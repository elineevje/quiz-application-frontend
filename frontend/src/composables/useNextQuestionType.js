import { computed } from 'vue';

export function useNextQuestionType(quiz, currentQuestionId) {
    const currentQuestionIndex = computed(() => quiz.questionList.findIndex(q => q.questionId === currentQuestionId));

    const nextQuestionType = computed(() => {
        const nextIndex = currentQuestionIndex.value + 1;
        if (nextIndex < quiz.questionList.length) {
            return quiz.questionList[nextIndex].questionType.typeId;
        }
        return null;
    });

    const nextQuestionRouteName = computed(() => {
        switch (nextQuestionType.value) {
            case 1:
                return 'multipleChoiceQuestion';
            case 2:
                return 'trueOrFalseQuestion';
            case 3:
                return 'fillInTheBlankQuestion';
            default:
                return 'quizCompletion';
        }
    });

    return {
        nextQuestionRouteName,
    };
}
