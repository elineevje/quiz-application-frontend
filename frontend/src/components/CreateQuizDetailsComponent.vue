<template>
  <div class="create-quiz-details">
    <h1>Create Quiz</h1>
    <div class="input-field">
      <label for="quizName">Quiz Name</label>
      <input
        id="quizName"
        v-model="quizName"
        type="text"
        placeholder="Enter Quiz Name"
        maxlength="50"
      >
      <span>{{ 50 - quizName.length }} characters left</span>
    </div>
    <div class="input-field">
      <label for="quizDescription">Quiz Description</label>
      <input
        id="quizDescription"
        v-model="quizDescription"
        type="text"
        placeholder="Enter Quiz Description"
        maxlength="80"
      >
      <span>{{ 80 - quizDescription.length }} characters left</span>
    </div>
    <div class="input-field">
      <label for="category">Category</label>
      <select v-model="selectedCategory">
        <option
          value=""
          disabled
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
    <div class="input-field">
      <label for="difficulty">Difficulty</label>
      <select
        id="difficulty"
        v-model="difficulty"
        class="placeholder-grey"
      >
        <option
          value=""
          disabled
          selected
        >
          Select Difficulty Level
        </option>
        <option value="easy">
          Easy
        </option>
        <option value="medium">
          Medium
        </option>
        <option value="hard">
          Hard
        </option>
      </select>
    </div>
    <label
      v-if="!fileUploaded"
      id="uploadFileLabel"
      for="fileUpload"
    >
      <p>Upload File</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
      ><path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" /></svg>
    </label>
    <div
      v-else
      id="fileUploaded"
    >
      <p>{{ multimedia.name }}</p>
      <button @click="removeMedia">
        Remove
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 -960 960 960"
          width="24"
        ><path d="m480-800 200 200-56 58-104-104v92l-80-80-63-63 103-103Zm-40 480v-200l80 80v120h-80ZM791-55 686-160H240q-33 0-56.5-23.5T160-240v-120h80v120h366L55-791l57-57 736 736-57 57Zm9-219-80-80v-6h80v86Z" /></svg>
      </button>
    </div>
    <input
      id="fileUpload"
      type="file"
      accept="image/*, video/*"
      hidden
      @change="handleFileUpload"
    >
    <button
      class="next-button"
      :disabled="!isFormValid"
      @click="saveQuiz"
    >
      NEXT
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from "/src/store/quizStore";
import axios from 'axios';
import { useStore } from '/src/store/userStore';

const store = useQuizStore();
const quizName = ref('');
const quizDescription = ref('');
const multimedia = ref('');
const difficulty = ref('');
const fileUploaded = ref(false);
const router = useRouter();
const userStore = useStore();
const categoriesLoading = ref(true);

const categories = ref(null);
const selectedCategory = ref(null);

const isFormValid = computed(() => {
  return quizName.value.trim() !== '' &&
         selectedCategory.value !== null &&
         difficulty.value.trim() !== '';
});
    
onMounted(async () => {
  try {
    if(!categories.value) {
      await store.fetchCategories();
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  } finally {
    categories.value = store.categories;
    categoriesLoading.value = false;
  } 
});
    
const saveQuiz = async (event) => {
  try {
    const quizData = new FormData();
    quizData.append('quizName', quizName.value);
    quizData.append('quizDescription', quizDescription.value);
    quizData.append('category', selectedCategory.value);
    quizData.append('difficultyLevel', difficulty.value);
    if (multimedia.value) {
      quizData.append('file', multimedia.value);
    }

    const createdQuiz = await store.createQuiz(quizData);


    if (createdQuiz && multimedia.value) {
      let fileFormData = new FormData();
      fileFormData.append('file', multimedia.value);

      await axios.post(`http://localhost:8080/api/quizzes/upload/${createdQuiz.quizId}`, fileFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + userStore.jwtToken.accessToken
        }
      });
    }
  router.push({ path: '/addQuestions'});
    
  } catch (error) {
    console.error('Error creating quiz:', error);
  }
};

const handleFileUpload = (event) => {
    multimedia.value = event.target.files[0];
    fileUploaded.value = true;
};

const removeMedia = () => {
    multimedia.value = null;
    fileUploaded.value = false;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&display=swap');
.create-quiz-details {
  max-width: 800px; 
  margin: 50px auto;
  padding: 40px;
  background: #fff; 
  border-radius: 8px; 
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); 
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.create-quiz-details h1 {
  text-align: center;
  color: #333; 
  margin-bottom: 20px; 
  font-family: "Karla", sans-serif; 
  font-weight: 700;
  font-size: xxx-large;
  margin: 0;
  margin-bottom: 2rem;
}

.input-field {
  margin-bottom: 20px; 
  display: flex; 
  align-items: center;
  font-family: "Karla", sans-serif;
  width: 100%;
}

.input-field input[type="text"] {
  font-family: "Karla", sans-serif;
}

.input-field select {
  font-family: "Karla", sans-serif;
}

.input-field label {
  flex: 0 0 120px; 
  margin-right: 20px;
  color: #666; 
  font-weight: bold;
}

.input-field span {
  display: flex;
  justify-content: flex-start;
  justify-items: flex-start;
  text-align: start;
  margin-left: 0.25rem;

}

.input-field input,
.input-field select {
  width: 100%;
  padding: 15px 20px;
  border: 1px solid transparent; 
  border-bottom: 2px solid #ddd;
  border-radius: 4px;
  background-color: #f8f8f8; 
  font-size: 16px;
  color: #333;
  transition: all 0.3s ease-in-out;
  box-sizing: border-box;
}

.input-field input:focus,
.input-field select:focus {
  outline: none; 
  border-bottom-color: #6320ee; 
  box-shadow: 0 1px 6px -2px rgba(99, 32, 238, 0.5);
  background-color: #fff;
}

.input-field input[type="file"] {
  background-color: #fff; 
  border: none;
  padding: 10px 20px;
}

.input-field input::placeholder,
.input-field select .placeholder-grey {
  color: #aaa;
  font-style: italic; 
}


button.next-button {
  padding: 15px 30px;
  background-color: #6320ee;
  color: #fff;
  border: none;
  border-radius: 25px; 
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px; 
  transition: background-color 0.2s ease-in-out;
  margin-top: 2rem;
}

button.next-button:hover,
button.next-button:focus {
  background-color: #7e41fd;
  box-shadow: 0 4px 12px rgba(225, 219, 237, 0.5);
}

button.next-button:disabled {
  background-color: #ccc;
  color: #666;
  cursor: not-allowed;
}


.input-field span.character-count {
  margin-left: auto; 
  color: #999;
}


@media (max-width: 768px) {
  .input-field {
    flex-direction: column;
    align-items: stretch;
  }

  .input-field label {
    margin-bottom: 5px;
    flex: 0 0 auto; 
  }

  .create-quiz-details {
    padding: 20px;
  }

  button.next-button {
    padding: 10px; 
  }
}

#uploadFileLabel {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  cursor: pointer;
  border-radius: 1rem;
  border: #6320EE 3px solid;
  background-color: #6320EE;
  width: fit-content;
  font-family: "Karla", sans-serif;
  font-weight: 500;
}

#uploadFileLabel p {
  color: white;
  padding: 0;
}

#uploadFileLabel svg {
  fill: white;
  width: 2rem;
  height: 2rem;
}

#uploadFileLabel:hover {
  background-color: white;
  transition: all 0.3s ease-in-out;
}

#uploadFileLabel:hover p {
  color: #6320EE;
}

#uploadFileLabel:hover svg {
  fill: #6320EE;
}

#fileUploaded {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  cursor: pointer;
  border-radius: 1rem;
  width: fit-content;
  color: white;
  font-family: "Karla", sans-serif;
  font-weight: 500;
  background-color: #6320EE;
  border: #6320EE 3px solid;
}

#fileUploaded p {
  padding: 0;
}

#fileUploaded svg {
  fill: #6320EE;
  width: 2rem;
  height: 2rem;
}

#fileUploaded button {
  background-color: transparent;
  color: white;
  border: none;
  border-radius: 1rem;
  font-family: "Karla", sans-serif;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}

#fileUploaded button svg {
  fill: white;
  width: 2rem;
  height: 2rem;
}

#fileUploaded:hover {
  background-color: white;
  transition: all 0.3s ease-in-out;
}

#fileUploaded:hover p {
  color: #6320EE;
}

#fileUploaded:hover svg {
  fill: #6320EE;
}

#fileUploaded:hover button {
  color: #6320EE;
}

</style>