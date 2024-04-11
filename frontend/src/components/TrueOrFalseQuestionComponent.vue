<template>
  <div
    v-if="currentQuestion"
    class="true-or-false-question"
  >
    <div class="question-display">
      <p class="question-text">
        {{ currentQuestion.questionText }}
      </p>
    </div>
    <div class="alternatives-container">
      <button
        class="alternative-button"
        :class="{ 'selected': selectedAnswer === true }"
        @click="selectAlternative(true)"
      >
        true
      </button>
      <button
        class="alternative-button"
        :class="{ 'selected': selectedAnswer === false }"
        @click="selectAlternative(false)"
      >
        false
      </button>
    </div>
    <div class="submit-container">
      <button
        class="button submit-button"
        :disabled="selectedAnswer === null"
        @click="submitAnswer"
      >
        SUBMIT ANSWER AND GO TO NEXT QUESTION
      </button>
    </div>
  </div>
  <div v-else>
    No question available.
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from "/src/store/userStore";
import { useQuizStore } from "/src/store/quizStore";

const userStore = useStore();
const quizStore = useQuizStore();
const router = useRouter();
const quizId =  quizStore.currentQuiz.quizId;
const selectedAnswer = ref(null);
const currentQuestion = computed(() => quizStore.currentQuestion);

const selectAlternative = (answer) => {
    selectedAnswer.value = answer !== selectedAnswer.value ? answer : null;
    const trueChoice = currentQuestion.value.choices.find(c => c.choice.toLowerCase() === 'True'.toLowerCase());
    const falseChoice = currentQuestion.value.choices.find(c => c.choice.toLowerCase() === 'False'.toLowerCase());

    let choiceId = null;
    if (answer && trueChoice) {
        choiceId = trueChoice.quizChoiceId;
    } else if (!answer && falseChoice) {
        choiceId = falseChoice.quizChoiceId;
    }

    if (choiceId !== null) {
        quizStore.updateAnswer(choiceId);
    } else {
        console.error('Could not find a matching choice for the answer.');
    }
};

const submitAnswer = async () => {
    const next = quizStore.nextQuestion()
    if(next !== null) {
        const route = quizStore.getQuestionRouteName(next.questionTypeId);
        quizStore.currentQuestion = next;
        selectedAnswer.value = null;
        router.push({ name: route });
    }
    else {
          await quizStore.submitAnswers(quizId);
          router.push({ name: 'QuizCompletion', params: { quizId } });
    }
};
</script>




<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Karla:wght@400;700&display=swap');

.question-display {
  text-align: center;
  margin-bottom: 20px;
}

.question-text {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  font-family: 'Karla', sans-serif;
}

.alternatives-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.alternative-button {
  width: 80%;
  max-width: 250px;
  min-height: 60px;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f0f0f0;
  border: 2px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Karla', sans-serif;
  background-color: white;
  color: #6320EE;
  border:#6320EE solid 2px;
}

.alternative-button:hover, .alternative-button.selected {
  background-color: #7E41FDFF;
  color: white;
  border-color: #7E41FDFF;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button.submit-button {
  padding: 10px 20px;
  background-color: #6320EE;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'Karla', sans-serif;
  transition: background-color 0.3s ease;
}

.button.submit-button:hover {
  background-color: #7E41FDFF;
}

.button.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button.submit-button:disabled:hover {
  background-color: #ccc;
}

@media (max-width: 768px) {
  .alternative-button {
    width: 90%;
  }
}
.true-or-false-question {
  max-width: 800px;
  margin: 50px auto;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  font-family: 'Karla', sans-serif;
}
</style>