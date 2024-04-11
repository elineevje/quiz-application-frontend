<template>
  <div v-if="!loadingResults">
    <div class="quiz-results">
      <h1>Quiz Results</h1>
      <p>Your score is: {{ quizResults.score }} / {{ quizResults.userAnswers.length }} points</p>
      <div
        v-for="(answer, index) in quizResults.userAnswers"
        :key="'answer-' + index"
        class="result-item"
      >
        <h3>Question {{ index + 1 }}: {{ answer.questionText }}</h3>
        <p>
          Your Answer: {{ answer.choice }} - <strong
            :class="{ 'correct': answer.correct, 'incorrect': !answer.correct }"
          >{{
            answer.correct ? 'Correct' : 'Incorrect'
          }}</strong>
        </p>
        <p
          v-if="!answer.correct"
          style="color:#2ecc71 "
        >
          Correct answer: {{ answer.correctAnswer }}
        </p>
      </div>
    </div>
    <button
      class="button"
      @click="$router.push('/home')"
    >
      Go to Home
    </button>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import axios from 'axios';
import { useStore } from "/src/store/userStore";
import { useRoute } from 'vue-router';
import { useQuizStore } from "/src/store/quizStore";
import confetti from 'canvas-confetti'; 

const store = useStore();
const quizResults = ref([]);
const loadingResults = ref(true);
const quizStore = useQuizStore();

onMounted(async () => {
    confetti({
        particleCount: 500,
        spread: 150,
        origin: { y: 0.5 }
    })
    const quizId = quizStore.currentQuiz.quizId;
    let tempQuizResults = [];
    try {
        const response = await axios.get(
            `http://localhost:8080/api/completed-quizzes/${quizId}`,
            {
                headers: {
                    'Authorization': `Bearer ${store.jwtToken.accessToken}`,
                },
            }
        );
        tempQuizResults = response.data;     
    } catch (error) {
        console.error('Error fetching quiz results:', error);
    } finally {
        tempQuizResults.userAnswers = tempQuizResults.userAnswers.map((answer, index) => {
            return {
                questionText: quizStore.currentQuiz.questions[index].questionText,
                choice: quizStore.currentQuiz.questions[index].choices.find(c => c.quizChoiceId === answer.questionChoiceId).choice,
                correct: quizStore.currentQuiz.questions[index].choices.find(c => c.quizChoiceId === answer.questionChoiceId).isCorrectChoice,
                explanation: quizStore.currentQuiz.questions[index].explanation,
                correctAnswer: quizStore.currentQuiz.questions[index].choices.find(c => c.isCorrectChoice === true).choice
            }
        });
        quizResults.value = tempQuizResults;
        loadingResults.value = false;
    }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;700&display=swap');

.quiz-results {
    max-width: 800px;
    margin: 50px auto;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    font-family: 'Karla', sans-serif;
}

.quiz-results h1 {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 2.5rem;
}

.quiz-results p {
    font-weight: 500;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 0;
    margin-bottom: 30px;
}

.result-item {
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f0f0f0;
    border-radius: 1rem;
}

.result-item h3 {
    font-weight: bold;
    margin-bottom: 1rem;
    font-size: 1.4rem;
    color: #6320EE;
}

.result-item p {
    font-size: 1rem;
    margin-left: 1rem;
}

strong {
    font-weight: bold;
}

.correct {
    color: #2ecc71;
}

.incorrect {
    color: #f7567c;
}

.button {
    display: block;
    width: max-content;
    margin: 20px auto;
    padding: 10px 20px;
    background-color: #6320EE;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
}

.button:hover {
    background-color: #7E41FDFF;
}

@media (max-width: 768px) {
    .quiz-results {
        padding: 20px;
    }

    .result-item {
        padding: 10px;
    }
}
</style>
