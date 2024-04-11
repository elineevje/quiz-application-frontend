<template>
  <div class="multiple-choice-component">
    <h2>New question with multiple choice answer</h2>
    <h3>Fill in your question with alternatives, and check off for the correct answer!</h3>
    <div class="input-field">
      <label
        for="question"
        class="question-label"
      >Question</label>
      <input
        id="question"
        v-model="question"
        type="text"
      >
    </div>
    <div class="options-container">
      <div
        v-for="(alternative, index) in alternatives"
        :key="index"
        class="alternative-row"
      >
        <div class="alternative-container">
          <label
            :for="'alternative-' + (index + 1)"
            class="alternative-label"
          >Alternative {{ index + 1 }}</label>
          <input
            :id="'alternative-' + (index + 1)"
            v-model="alternatives[index]"
            type="text"
            class="alternative-input"
          >
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
    <div class="button-container">
      <button
        class="button cancel-button"
        @click="cancelQuestion"
      >
        CANCEL
      </button>
      <button
        class="button save-button"
        @click="saveQuestion"
      >
        SAVE AND GO BACK
      </button>
    </div>
  </div>
  <ConfirmModal
    :visible="showModal"
    :title="modalTitle"
    :message="modalMessage"
    :confirm-show="false"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '/src/store/quizStore';
import { useStore } from '/src/store/userStore';
import ConfirmModal from '/src/components/ConfirmModal.vue';
import axios from 'axios';

const question = ref('');
const alternatives = ref(['', '', '', '']);
const selectedOption = ref(null);
const router = useRouter();
const store = useQuizStore(); 
const userStore = useStore();
const showModal = ref(false);
const modalTitle = ref('Please fill in all fields');
const modalMessage = ref('Could not add question');
const handleCancel = () => {
  showModal.value = false;
};

const cancelQuestion = () => {
    router.push('/addQuestions');
};

const selectOption = (option) => {
  selectedOption.value = option === selectedOption.value ? null : option;
};

const saveQuestion = async () => {
  if(question.value === '' || alternatives.value.some(alternative => alternative === '') || selectedOption.value === null) {
    showModal.value = true;
    return;
  }
  const path = "http://localhost:8080/api/questions/create";
  const formData = new FormData();
  formData.append('questionText', question.value);
  formData.append('tag', 'true-or-false');
  formData.append('quizId', store.currentQuiz.quizId);
  formData.append('questionTypeId', 1)
  let choices = [
    {"choice": alternatives.value[0], "explanation": "N/A", "isCorrectChoice": false},
    {"choice": alternatives.value[1], "explanation": "N/A", "isCorrectChoice": false},
    {"choice": alternatives.value[2], "explanation": "N/A", "isCorrectChoice": false},
    {"choice": alternatives.value[3], "explanation": "N/A", "isCorrectChoice": false}
  ];
  choices[selectedOption.value].isCorrectChoice = true;
  let choicesString = JSON.stringify(choices);
  formData.append('choices', choicesString);

  await axios.post(path,formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + userStore.jwtToken.accessToken
    }
  })
    .then(() => {
      router.push('/addQuestions');
    })
    .catch(async (error) => {
      console.error('Failed to save question:', error);
      await userStore.renewToken();
    });
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&display=swap');

.multiple-choice-component {
    max-width: 800px;
    margin: 50px auto;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    font-family: 'Karla', sans-serif;
}

h2, h3 {
    color: #333;
    text-align: center;
}

h2 {
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 2rem;
}

h3 {
    font-weight: 500;
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 2rem;
}

.input-field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    margin-bottom: 1rem; 
    flex-wrap: wrap;
}

.question-label, .alternative-label {
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: left;
    flex-basis: 100%;;
}

.input-field input[type="text"], .alternative-input[type="text"] {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 1rem; 
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease-in-out; 
    box-sizing: border-box;
    width: calc(50% - 20px);
}

.alternative-container {
  display: flex;
  align-items: flex-start;
  flex-grow: 1;
}

.alternative-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.alternative-label {
  margin-right: 10px;
  display: block;
}

.alternative-input {
  width: 100%;
}


.input-field input[type="text"]:focus, .alternative-input[type="text"]:focus {
    outline: none; 
    border-color: #6320EE;
    box-shadow: 0 1px 6px -2px rgba(99, 32, 238, 0.5); 
    background-color: #fff; 
}

.options-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.button-container {
    display: flex;
    justify-content: space-evenly;
}

.button {
    padding: 15px 30px;
    background-color: #6320EE;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
}

.button:hover {
    background-color: #7E41FDFF;
}

.reject-checkbox {
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


@media (max-width: 768px) {
    .multiple-choice-component {
        padding: 20px;
    }

    .input-field input[type="text"], .alternative-input {
        width: 75%; /* Adjusted for smaller screens */
    }
}
</style>