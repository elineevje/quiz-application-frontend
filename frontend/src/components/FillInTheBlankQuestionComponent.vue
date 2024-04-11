<template>
  <div
    v-if="options"
    class="fill-in-the-blank-question"
  >
    <h2>Fill in the blank!</h2>
    <p v-html="formattedQuestion" />
    <div class="options-container">
      <div
        v-for="(option, index) in options"
        :key="index"
        class="option"
      >
        <div class="option-choice">
          <span>{{ index+1 }}.</span>
          <p style="color:transparent">
            __
          </p>
          <label :for="option">{{ option }}</label>
        </div>
        <div
          class="reject-checkbox"
          :class="{'checked': selectedOption === index.toString()}"
          @click="selectOption(index.toString())"
        >
          <div class="checkbox-wrapper">
            <input
              :id="'input-correct-' + (index + 1)"
              type="checkbox"
              :checked="selectedOption === index.toString()"
            >
            <label :for="'correct-' + (index + 1)">
              <div class="tick_mark" />
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="submit-container">
      <button
        class="button submit-button"
        :disabled="selectedOption === null"
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
import { computed, ref, onBeforeMount, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from "/src/store/userStore";
import { useQuizStore } from "/src/store/quizStore";

const formattedQuestion = computed(() => {
  let string = currentQuestion.value.questionText;
  const optionText = selectedOption.value !== null ? currentQuestion.value.choices[selectedOption.value].choice : '____';
  return string.replace("____", `<strong>${optionText}</strong>`);
});

const selectedOption = ref(null);
const router = useRouter();
const store = useStore();
const quizStore = useQuizStore();
const userAnswer = ref('');
const loading = ref(true);

const quizId = quizStore.currentQuiz.quizId;

const currentQuestion = computed(() => {
  return quizStore.currentQuestion;
});

const selectOption = (option) => {
  selectedOption.value = option === selectedOption.value ? null : option;
  if(selectedOption.value !== null) {
    const choiceId = currentQuestion.value.choices[option].quizChoiceId;
    quizStore.updateAnswer(choiceId);
  } else {
    quizStore.updateAnswer(null);
  }
};

const options = computed(() => {
  return currentQuestion.value.choices.map(choice => choice.choice);
});


const submitAnswer = async () => {
    const next = quizStore.nextQuestion()
    if(next !== null) {
        const route = quizStore.getQuestionRouteName(next.questionTypeId);
        quizStore.currentQuestion = next;
        selectedOption.value = null;
        router.push({ name: route });
    }
    else {
          await quizStore.submitAnswers(quizId);
          router.push({ name: 'QuizCompletion', params: { quizId } });
    }
};


</script>


<style scoped>
.fill-in-the-blank-question {
  max-width: 800px;
  margin: 50px auto;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  font-family: 'Karla', sans-serif;
}

.options-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.option {
  margin: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: clamp(100px, 70%, 400px);
}

.button.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.button.submit-button:disabled:hover {
  background-color: #ccc;
}


.option-choice {
  display: flex;
  align-items: center;
  justify-self: flex-start;
}

.submit-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button.submit-button {
  padding: 15px 30px;
  background-color: #6320EE;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
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

.reject-checkbox {
  justify-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
}

.reject-checkbox.checked .tick_mark:before,
.reject-checkbox.checked .tick_mark:after {
  opacity: 1;
}

.reject-checkbox .checkbox-wrapper * {
  -webkit-tap-highlight-color: transparent;
  outline: none;
}
.reject-checkbox .checkbox-wrapper input[type="checkbox"] {
  display: none;
}
.reject-checkbox .checkbox-wrapper label {
  --size: 30px;
  --shadow: calc(var(--size) * 0.07) calc(var(--size) * 0.1);
  position: relative;
  display: block;
  width: var(--size);
  height: var(--size);
  margin: 0 auto;
  background-color: #4158d0;
  background-image: linear-gradient(
    43deg,
    #4158d0 0%,
    #c850c0 46%,
    #ffcc70 100%
  );
  border-radius: 50%;
  box-shadow: 0 var(--shadow) #ffbeb8;
  cursor: pointer;
  transition: 0.2s ease transform, 0.2s ease background-color,
    0.2s ease box-shadow;
  overflow: hidden;
  z-index: 1;
}
.reject-checkbox .checkbox-wrapper label:before {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  width: calc(var(--size) * 0.7);
  height: calc(var(--size) * 0.7);
  margin: 0 auto;
  background-color: #fff;
  transform: translateY(-50%);
  border-radius: 50%;
  box-shadow: inset 0 var(--shadow) #ffbeb8;
  transition: 0.2s ease width, 0.2s ease height;
}
.reject-checkbox .checkbox-wrapper label:hover:before {
  width: calc(var(--size) * 0.55);
  height: calc(var(--size) * 0.55);
  box-shadow: inset 0 var(--shadow) #ff9d96;
}
.reject-checkbox .checkbox-wrapper label:active {
  transform: scale(0.9);
}
.reject-checkbox .checkbox-wrapper .tick_mark {
  position: absolute;
  top: 9px;
  left: 2px;
  right: 0;
  width: calc(var(--size) * 0.6);
  height: calc(var(--size) * 0.6);
  margin: 0 auto;
  margin-left: calc(var(--size) * 0.14);
  transform: rotateZ(-92deg);
}
.reject-checkbox .checkbox-wrapper .tick_mark:before,
.reject-checkbox .checkbox-wrapper .tick_mark:after {
  content: "";
  position: absolute;
  background-color: #fff;
  border-radius: 2px;
  opacity: 0;
  transition: 0.2s ease transform, 0.2s ease opacity;
}
.reject-checkbox .checkbox-wrapper .tick_mark:before {
  left: 0;
  bottom: 0;
  width: calc(var(--size) * 0.1);
  height: calc(var(--size) * 0.3);
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.23);
  transform: translateY(calc(var(--size) * -0.68));
}
.reject-checkbox .checkbox-wrapper .tick_mark:after {
  left: 0;
  bottom: 0;
  width: 100%;
  height: calc(var(--size) * 0.1);
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.23);
  transform: translateX(calc(var(--size) * 0.78));
}
.reject-checkbox .checkbox-wrapper input[type="checkbox"]:checked + label {
  background-color: #4158d0;
  background-image: linear-gradient(
    43deg,
    #f7805c 0%,
    #fb4545 46%,
    #e1236a 100%
  );
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
    rgba(0, 0, 0, 0.22) 0px 15px 12px;
}
.reject-checkbox
  .checkbox-wrapper
  input[type="checkbox"]:checked
  + label:before {
  width: 0;
  height: 0;
}

.reject-checkbox
  .checkbox-wrapper
  input[type="checkbox"]:checked
  + label
  .tick_mark:before,
.reject-checkbox
  .checkbox-wrapper
  input[type="checkbox"]:checked
  + label
  .tick_mark:after {
  background-color: #fff;
  width: calc(var(--size) * 0.4);
  height: calc(var(--size) * 0.1);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 1;
}
.reject-checkbox
  .checkbox-wrapper
  input[type="checkbox"]:checked
  + label
  .tick_mark:before {
  transform: translate(-50%, -50%) rotate(45deg);
}
.reject-checkbox
  .checkbox-wrapper
  input[type="checkbox"]:checked
  + label
  .tick_mark:after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
</style>