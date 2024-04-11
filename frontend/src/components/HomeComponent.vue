<template>
  <div
    v-if="!categoriesLoading"
    class="home-component"
  >
    <div class="content-wrapper">
      <h1>Your recently made quizzes:</h1>
      <div
        v-if="quizzes.length > 0"
        class="quiz-box-container"
      >
        <div
          v-for="quiz in quizzes"
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
      <div
        v-else
        class="no-quizzes-message"
      >
        <p>You have not created any quizzes yet... Get started now!!</p>
      </div>
    </div>
    <router-link
      to="/createquiz"
      class="create-quiz-button"
    >
      CREATE NEW QUIZ
    </router-link>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from "/src/store/userStore";
import router from "/src/router/router";
import { useQuizStore } from "/src/store/quizStore";

const store = useStore();
const quizStore = useQuizStore();
const categoriesLoading = ref(true);
const quizzes = ref([]);

const getPathToQuizImage = (filename) => {
  return `http://localhost:8080/api/quizzes/files/${filename}`;
};

const fetchQuizzes = async () => {
  const token = store.jwtToken;

  const creatorId = token.userId;

  const accessToken = token.accessToken;

  try {
    const response = await fetch(`http://localhost:8080/api/quizzes/user/${creatorId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 401 || response.status === 403) {
      console.error("Token is invalid or expired. Please re-authenticate.");
      return;
    }

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }

    const fetchedQuizzes = await response.json();

    quizzes.value = fetchedQuizzes.sort((a, b) => {
      return new Date(b.quizId) - new Date(a.quizId);
    });
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
  }
};

const playQuiz = (quizId) => {
  router.push(`/playquiz/${quizId}`);
};

onMounted(async () => {
  try {
    await fetchQuizzes();
    await quizStore.fetchCategories();
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
  } finally {
    categoriesLoading.value = false;
  }
});


</script>

<style scoped>
.home-component {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  max-height: 100vh;
  text-align: center;
}

.content-wrapper {
  overflow-y: auto;
  padding-bottom: 20px;
  margin-top: 20px;
  flex-grow: 1;
}

.quiz-box-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  padding: 0 60px;
  margin-bottom: 100px;
}

.quiz-box {
  width: calc(30% - 20px);
  background-color: white;
  height: 200px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  position: relative;
}

.create-quiz-button {
  display: block;
  position: fixed;
  bottom: 20px;
  left: 50%;
  margin-left: -150px;
  width: 300px;
  padding: 20px 0;
  background-color: #6320EE;
  color: white;
  text-decoration: none;
  border-radius: 20px;
  text-align: center;
  font-size: 22px;
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
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  text-align: center;
  padding: 10px 0;
  position: absolute;
  top: -20px;
}

.quiz-description {
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  width: auto;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.4);
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
  background-color: #6320EE;
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

.no-quizzes-message {
  text-align: center;
  padding: 10px 10px;
}

h1 {
  color: white
}

@media (max-width: 768px) {
  .quiz-box-container {
    justify-content: flex-start;
    margin-bottom: 40px;
  }

  .quiz-description {
    white-space: normal;
    font-size: smaller;
    top: 27px;
  }

  .quiz-box {
    width: 100%;
  }

  h1 {
    font-size: 1.8rem;
  }
}
</style>@/store/userStore