<template>
  <div class="quiz-container">
    <div class="layout-container">
      <div class="add-questions">
        <h1>Add Questions</h1>
        <div class="button-container">
          <div
            v-if="!showOptions"
            class="add-question-button"
            @click="toggleOptions"
          >
            <span>+ Add</span>
          </div>
          <div
            v-if="showOptions"
            class="options-container"
          >
            <button
              data-testid="multiple-choice-button"
              @click="chooseQuestionType('multiplechoice')"
            >
              Multiple Choice
            </button>
            <button
              data-testid="true-or-false-button"
              @click="chooseQuestionType('truefalse')"
            >
              True or False
            </button>
            <button
              data-testid="fill-in-the-blank-button"
              @click="chooseQuestionType('fillintheblank')"
            >
              Fill in the Blank
            </button>
          </div>
        </div>
      </div>
      <div class="quiz-preview">
        <h1>Quiz Preview</h1>
        <div
          v-if="currentQuiz"
          class="quiz-info"
        >
          <h2>{{ currentQuiz.quizName }}</h2>
          <p>{{ currentQuiz.quizDescription }}</p>
          <p>Category: {{ categoryName }}</p>
          <p>Difficulty Level: {{ currentQuiz.difficultyLevel }}</p>
        </div>
        <div class="question-list">
          <ul v-if="currentQuiz && currentQuiz.questions">
            <li
              v-for="question in currentQuiz.questions"
              :key="question.questionId"
            >
              {{ question.questionText }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="nav-buttons">
      <button
        class="nav-button back-button"
        @click="promptDelete"
      >
        BACK
      </button>
      <button
        class="nav-button next-button"
        @click="promptSave"
      >
        NEXT
      </button>
    </div>
    <ConfirmModal
      :visible="showModal"
      :title="modalTitle"
      :message="modalMessage"
      :confirm-show="true"
      @confirm="modalConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>
    
    <script setup>
    import { ref, watch, onBeforeMount, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { useQuizStore } from "/src/store/quizStore";
    import { useStore } from "/src/store/userStore";
    import axios from 'axios';
    import ConfirmModal from '/src/components/ConfirmModal.vue';
    import confetti from 'canvas-confetti';
    
    const quizStore = useQuizStore();
    const userStore = useStore();
    const route = useRoute();
    const router = useRouter();
    const showOptions = ref(false);
    const selectedFile = ref(null);
    const categoryName = computed(() => {
        const category = quizStore.categories.find(cat => cat.categoryId === quizStore.currentQuiz.categoryId);
        return category ? category.categoryName : '';
    });
    const currentQuiz = ref(null);

    const showModal = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const modalConfirm = ref(() => {});

    onBeforeMount(async () => {
    if(quizStore.currentQuiz && quizStore.currentQuiz.quizId) {
        const quizId = quizStore.currentQuiz.quizId;
        const data = await quizStore.fetchQuizDetails(quizId);
        currentQuiz.value = data;
    } else {
        router.push('/createQuiz');
    }
    });
    
    const toggleOptions = () => {
        showOptions.value = !showOptions.value;
    };

    const deleteQuiz = async (quizId) => {
    try {
        await axios.delete(`http://localhost:8080/api/quizzes/${quizId}`, {
            headers: {
                Authorization: `Bearer ${userStore.jwtToken.accessToken}`
            }
        });
        } catch (error) {
            console.error('Failed to delete quiz:', error);
            throw error;
        }
    };

    const handleCancel = () => {
        showModal.value = false;
    };

    const handleDelete = () => {
        deleteQuiz(currentQuiz.value.quizId).then(() => {
            router.push('/createQuiz');
            showModal.value = false;
        }).catch(error => {
            console.error('Failed to delete quiz:', error);
            showModal.value = false;
        });
    };

    const promptDelete = () => {
        modalTitle.value = "Confirm Delete";
        modalMessage.value = "You are about to delete the quiz! Are you sure you want to proceed?";
        modalConfirm.value = handleDelete;
        showModal.value = true;
    };

    const promptSave = () => {
        modalTitle.value = "Confirm Save";
        modalMessage.value = "You are about to save the quiz! Are you sure you want to proceed?";
        modalConfirm.value = handleSave;
        showModal.value = true;
    };

    const handleSave = () => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
        });
        setTimeout(() => {
            router.push('/home');
        }, 250);
    };
        
    const chooseQuestionType = (type) => {
        switch (type) {
            case 'multiplechoice':
                router.push({ path: '/addQuestions/multipleChoice'});
                break;
            case 'truefalse':
                router.push({ path: '/addQuestions/trueFalse'});
                break;
            case 'fillintheblank':
                router.push({ path: '/addQuestions/fillInTheBlank'});
                break;
            default:

                break;
        }

    };

    const handleAddQuestion = async () => {
        const questionData = {
            quizId: currentQuiz.value.quizId,
            questionText: currentQuiz.value.questionText,
            tag: currentQuiz.value.tag,
            questionTypeId: currentQuiz.value.questionTypeId,
            choices: currentQuiz.value.choices,
            file: selectedFile.value
        };

        try {
            await quizStore.addQuestionToQuiz(questionData);
        } catch (error) {
            console.error('Failed to add question', error);
        }
    };

    </script>
    
    <style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&display=swap');
    
    .quiz-container {
        max-width: 1200px;
        margin: 50px auto;
        display: flex;
        flex-direction: column;
    }
    
    .layout-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
    }
    
    .add-questions, .quiz-preview {
        flex-basis: 48%;
        padding: 40px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        font-family: 'Karla', sans-serif;
        margin: 10px;
    }
    
    h1 {
        text-align: center;
        color: #333;
        font-weight: 700;
        margin-bottom: 2rem;
    }
    
    .button-container, .nav-buttons {
        display: flex;
        justify-content: center;
    }

    .options-container {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .add-question-button, .options-container button, .nav-button {
        border: none;
        background-color: #6320EE;
        padding: 15px 30px;
        color: white;
        border-radius: 25px;
        font-family: "Karla", sans-serif;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        margin-right: 1rem;
    }
    
    .nav-buttons {
        margin-top: 20px;
    }
    
    .nav-button.back-button, .nav-button.next-button {
        margin-left: 80px;
        margin-right: 80px;
    }

    .question-list {
        flex-direction: column;
        align-items: center;
        display: flex;
    }
    

    
    @media (max-width: 768px) {
        .layout-container {
        flex-direction: column;
        }
    
        .add-questions, .quiz-preview {
        flex-basis: 100%;
        }
        
        .nav-button.back-button, .nav-button.next-button {
        margin-left: 0;
        margin-right: 0;
        }
    }
    </style>@/store/userStore