<template>
  <div class="start-playing-quiz-component">
    <div
      v-if="!loading"
      class="content-wrapper"
    >
      <div class="quiz-details">
        <div
          v-if="currentQuiz.multimedia"
          class="quiz-image"
          :style="{ backgroundImage: `url(${getPathToQuizImage(currentQuiz.multimedia)})` }"
        />
        <div
          v-else
          class="quiz-image-placeholder"
        />
        <h3 class="quiz-title">
          {{ currentQuiz.quizName }}
        </h3>
        <p class="quiz-description">
          Quiz Description: {{ currentQuiz.quizDescription }}
        </p>
        <p
          v-if="currentQuiz.difficultyLevel"
          class="quiz-description"
        >
          <span class="label">Difficulty level:</span> {{ currentQuiz.difficultyLevel }}
        </p>
        <p
          v-if="currentQuiz.categoryId && !categoriesLoading"
          class="quiz-description"
        >
          <span class="label">Category:</span> {{ categories.find(cat => cat.categoryId === currentQuiz.categoryId).categoryName }}
        </p>
        <button
          class="play-quiz-button"
          @click="playQuiz(currentQuiz.quizId)"
        >
          START
        </button>
      </div>
      <div class="questions-wrapper">
        <h2>Questions:</h2>
        <ul>
          <li
            v-for="question in currentQuiz.questions"
            :key="question.questionId"
            class="single-question"
          >
            {{ question.questionText }}
            {{ question.questionTypeId }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeMount } from 'vue';
import { useStore } from "/src/store/userStore";
import { useQuizStore } from "/src/store/quizStore";
import router from "/src/router/router";
import axios from 'axios';

const userStore = useStore();
const quizStore = useQuizStore();
const quiz = ref([]);
const categories = ref([]);
const currentQuiz = ref(null);
const quizId = router.currentRoute.value.params.quizId;
const multimedia = ref(null);
const loading = ref(true);
const categoriesLoading = ref(true);


onBeforeMount(async () => {
  try{
    const data = await quizStore.fetchQuizDetails(quizId);
    currentQuiz.value = data;
    if(data.multimedia){
      multimedia.value = data.multimedia;
    }
  } catch(error) {
    console.error('Failed to fetch quizzes:', error);
    router.push({ path: '/home' })
  } finally {
    loading.value = false;
  }
});

onMounted(() => {
  fetchCategories();
});



const getPathToQuizImage = (filename) => {
  return `http://localhost:8080/api/quizzes/files/${filename}`;
};

async function fetchCategories() {
    try {
        const catResponse = await userStore.fetchData('http://localhost:8080/api/categories/allCategories');
        if (catResponse.status !== 200) {
            throw new Error(`HTTP error! status: ${catResponse.status}`);
        }
        categories.value = await catResponse.data;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    } finally {
        categoriesLoading.value = false;
    }
}

const playQuiz = async (quizId) => {
    if (currentQuiz.value.questions.length > 0){
        const firstQuestion = currentQuiz.value.questions[0];
        quizStore.currentQuestion = firstQuestion;
        const routeName = quizStore.getQuestionRouteName(firstQuestion.questionTypeId);
        if (routeName) {
            await router.push({
                name: routeName,
                params: {
                    quizId: quizId.toString(),
                    questionId: firstQuestion.questionId.toString(),
                }
            });
        } else {
            console.error("Invalid question type ID or route name not found.");
        }
    } else {
        console.error("Quiz has no questions.");
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;700&display=swap');

.start-playing-quiz-component {
  width: 100%;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
  min-height: 85vh;
  padding: 30px;
  font-family: 'Karla', sans-serif;
  width: 95%;
  max-width: 1200px; 
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.quiz-box {
  margin: 10px 0;
  width: 80%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.quiz-image, .quiz-image-placeholder {
  width: 250px;
  height: 250px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 10px;
}

.quiz-title {
  margin-bottom: 10px;
  font-size: 2rem;
  color: #333;
  font-weight: 700;
  background-color: transparent;
}

.quiz-description {
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 400;
  color: #666;
}

.play-quiz-button {
  padding: 10px 20px;
  background-color: #6320EE;
  color: white;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.play-quiz-button:hover {
  background-color: #7E41FDFF;
}

.label {
  font-weight: 700;
  color: #7E41FDFF;
}

.questions-wrapper {
  width: 40%;
  max-width: 400px;
  padding: 30px;
  border-left: 2px solid #ccc;
}

.quiz-details {
    display: flex;
    flex-direction: column;
    padding: 100px;
    align-items: center;
}

@media (max-width: 768px) {
  .content-wrapper {
        flex-direction: column;
        align-items: center; 
        padding: 20px; 
    }

    .quiz-details, .questions-wrapper {
        width: 100%; 
        max-width: none;
        padding: 15px;
    }

    .quiz-image, .quiz-image-placeholder {
        width: 100%; 
        height: 200px; 
        margin-bottom: 20px; 
    }

    .quiz-title, .quiz-description {
        text-align: center; 
        font-size: 1.2rem; 
        margin-bottom: 10px; 
    }

    .play-quiz-button {
        width: 80%; 
        padding: 12px 0; 
        font-size: 1.1rem;
    }

    .questions-wrapper {
        border-left: none; 
        border-top: 2px solid #ccc; 
    }
}
</style>