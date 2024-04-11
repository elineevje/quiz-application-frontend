<template>
  <div class="true-or-false-component">
    <h2>New question with True or False answer</h2>
    <h3>Fill in your question and check off for the correct answer!</h3>
    <div class="input-field">
      <label
        for="question"
        class="question-label"
      >Question</label>
      <input
        id="question"
        v-model="question"
        type="text"
        placeholder="Type in your question"
      >
    </div>
    <div class="options-container">
      <!-- True option with custom checkbox -->
      <div class="option">
        <button
          :class="{'option-button': true, 'selected': selectedOption === 'true'}"
          data-testid="true-option"
          @click="selectOption('true')"
        >
          True
        </button>
        <div
          class="reject-checkbox"
          :class="{ 'checked': selectedOption === 'true' }"
        >
          <div class="checkbox-wrapper">
            <input
              id="true-option"
              type="checkbox"
              :checked="selectedOption === 'true'"
              @change="selectOption('true')"
            >
            <label for="true-option">
              <div class="tick_mark" />
            </label>
          </div>
        </div>
      </div>
      <div class="option">
        <button
          :class="{'option-button': true, 'selected': selectedOption === 'false'}"
          data-testid="false-option"
          @click="selectOption('false')"
        >
          False
        </button>
        <div
          class="reject-checkbox"
          :class="{ 'checked': selectedOption === 'false' }"
        >
          <div class="checkbox-wrapper">
            <input
              id="false-option"
              type="checkbox"
              :checked="selectedOption === 'false'"
              @change="selectOption('false')"
            >
            <label for="false-option">
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
import confetti from 'canvas-confetti';

const question = ref('');
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

const selectOption = (option) => {
  selectedOption.value = option === selectedOption.value ? null : option;
};

const saveQuestion = async () => {
  if(!question.value || !selectedOption.value) {
    showModal.value = true;
    return;
  }
  const path = "http://localhost:8080/api/questions/create";
  const formData = new FormData();
  formData.append('questionText', question.value);
  formData.append('tag', 'true-or-false');
  formData.append('quizId', store.currentQuiz.quizId);
  formData.append('questionTypeId', 2)
  
  let choices = [
    {"choice": "True", "explanation": "N/A", "isCorrectChoice": false},
    {"choice": "False", "explanation": "N/A", "isCorrectChoice": false},
  ];
  const right_index = selectedOption.value === 'true' ? 0 : 1;
  choices[right_index].isCorrectChoice = true;
  let choicesString = JSON.stringify(choices);
  formData.append('choices', choicesString);
  await axios.post(path, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${userStore.jwtToken.accessToken}`
    }
  })
    .then(() => {
      router.push('/addQuestions');
    })
    .catch((error) => {
      if(error.response.status === 403 && error.response.data.message === 'Token is invalid or expired') {
        userStore.renewToken();
      }
      console.error('Failed to save question:', error);
    });
};

const cancelQuestion = () => {
    router.push('/addQuestions');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&display=swap');

.true-or-false-component {
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

#question {
    font-family: "Karla", sans-serif;
}

#question::selection {
    background-color: #6320EE;
    color: white;
}

.input-field {
    margin-bottom: 2rem; 
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.question-label, .option-label {
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
}

.input-field input[type="text"] {
    width: 50%; 
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 1rem; 
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s ease-in-out; 
    box-sizing: border-box;
}

.input-field input[type="text"]:focus {
    outline: none; 
    border-color: #6320EE;
    box-shadow: 0 1px 6px -2px rgba(99, 32, 238, 0.5); 
    background-color: #fff; 
}

.option-box {
    border: 2px solid #6320EE;
    padding: 10px 20px;
    font-size: 24px;
    color: #6320EE;
    border-radius: 25px;
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

.options-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.option {
  display: flex;
  align-items: center;
  margin: 20px;
  padding: 10px;
}

.option-button {
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-radius: 25px;
  background-color: #6320EE;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}


.option-button.selected {
  background-color: #7E41FDFF;
}

@media (max-width: 768px) {
    .true-or-false-component {
        padding: 20px;
    }

    .input-field input[type="text"] {
        width: 75%;
    }
}
</style>@/store/userStore