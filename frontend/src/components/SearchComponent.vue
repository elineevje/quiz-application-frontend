<template>
  <div class="search-component">
    <div class="search-bar-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search among all quizzes"
        class="search-bar"
        @change="searchQuizzes"
      >
      <font-awesome-icon
        icon="magnifying-glass"
        class="search-image"
        @click="searchQuizzes"
      />
      <select v-model="selectedCategory">
        <option
          value="null"
          selected
        >
          Select Category
        </option>
        <option
          v-for="category in categories"
          :key="category.categoryId"
          :value="category.categoryId"
        >
          {{ category.categoryName }}
        </option>
      </select>
    </div>
    <div class="quiz-box-container">
      <div
        v-for="quiz in filteredQuizzes"
        :key="quiz.quizId"
        class="quiz-box"
      >
        <div
          v-if="quiz.multimedia"
          class="quiz-image"
          :style="{ backgroundImage: `url(${getPathToQuizImage(quiz.multimedia)})` }"
        />
        <div
          v-else
          class="quiz-image-placeholder"
        />
        <div class="quiz-details">
          <h3 class="quiz-title">
            {{ quiz.quizName }}
          </h3>
          <p class="quiz-description">
            {{ quiz.quizDescription }}
          </p>
          <button
            class="play-quiz-button"
            @click="playQuiz(quiz.quizId)"
          >
            Play Quiz
          </button>
        </div>
      </div>
    </div>
    <ConfirmModal 
        :visible=showModal
        message="No quizzes found with that search / category"
        title="No results found."
        @cancel="noQuizzesFound"
      />
  </div>
</template>


<script setup>
import { onMounted, ref, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import router from "/src/router/router";
import { useStore } from "/src/store/userStore";
import { useQuizStore } from "/src/store/quizStore"
import ConfirmModal from './ConfirmModal.vue';

const searchQuery = ref('');
const quizzes = ref([]);
const userStore = useStore();
const filteredQuizzes = ref([]);
const quizStore = useQuizStore();
const categories = ref(quizStore.categories);
const selectedCategory = ref('null');
const showModal = ref(false);

watch(() => selectedCategory.value, () => {
  searchQuizzes();
});

function noQuizzesFound() {
  showModal.value = false;
  filteredQuizzes.value = quizzes.value;
  selectedCategory.value = 'null';
  searchQuery.value = '';
}

async function fetchAllQuizzes() {
  try {
    const response = await userStore.fetchData('http://localhost:8080/api/quizzes/allQuizzes');
    const fetchedQuizzes = await response.data;

    quizzes.value = fetchedQuizzes.sort((a, b) => {
      return new Date(b.quizId) - new Date(a.quizId);
    });
    filteredQuizzes.value = quizzes.value
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
  }
}

onMounted(fetchAllQuizzes);

const searchQuizzes = () => {
  if(searchQuery.value == ''){
    filteredQuizzes.value = quizzes.value
    if(selectedCategory.value != 'null'){
      const categoryIds = quizStore.categories.filter(c => c.categoryId === selectedCategory.value).map(c => c.categoryId)
      filteredQuizzes.value = filteredQuizzes.value.filter(q => categoryIds.includes(q.categoryId))
    }
    if(filteredQuizzes.value.length == 0)
      showModal.value = true;

    return;
  }
  filteredQuizzes.value = quizzes.value.filter(q => q.quizName.toLowerCase().includes(searchQuery.value.toLowerCase()) || q.quizDescription.toLowerCase().includes(searchQuery.value.toLowerCase()))
  if(selectedCategory.value != 'null'){
    const categoryIds = quizStore.categories.filter(c => c.categoryId === selectedCategory.value).map(c => c.categoryId)
    filteredQuizzes.value = filteredQuizzes.value.filter(q => categoryIds.includes(q.categoryId))
  }
  if(filteredQuizzes.value.length == 0)
    showModal.value = true;

  return;
  
};

function getPathToQuizImage(fileName) {
  return `http://localhost:8080/api/quizzes/files/${fileName}`;
}

const playQuiz = (quizId) => {
  router.push(`/playquiz/${quizId}`);
};

</script>

<style scoped>
.search-component {
    margin-top: 20px;
}

.search-bar-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.search-bar {
    width: 400px;
    height: 30px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-right: 10px;
    font-size: 16px;
    font-family: "Karla", sans-serif;
}

.search-image {
    cursor: pointer;
    color: white;
  font-size: 30px;
}

.quiz-box-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0 60px;
  margin: 20px 0;
}

select {
  font-family: "Karla", sans-serif;
  font-size: 16px;
  padding: 8px;
  border-radius: 4px;
  border: none;
  margin-left: 1rem;
}

.quiz-box {
  width: calc(30% - 20px);
  background-color: white;
  height: 200px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.quiz-image, .quiz-image-placeholder {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.quiz-image-placeholder {
  background-color: white;
}

.quiz-title {
  color: white;
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
  padding: 10px 0;
  position: absolute;
  top: -20px;
}

.quiz-description {
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  width: auto;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.3s linear;
  padding: 10px 15px;
  box-sizing: border-box;
  white-space: pre-wrap;
}

.play-quiz-button {
  display: none;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f7567c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.quiz-box:hover .play-quiz-button {
  display: block;
  visibility: visible;
  opacity: 1;
}

.quiz-box:hover .quiz-description {
  visibility: visible;
  opacity: 1;
}

@media (max-width: 768px) {
  .quiz-box-container {
    justify-content: flex-start;
    margin-bottom: 40px;
  }

  .quiz-description {
    white-space: normal;
    font-size: smaller;
  }

  .quiz-box {
    width: 100%;
  }

  .search-bar {
    width: 70%;
  }
}
</style>
