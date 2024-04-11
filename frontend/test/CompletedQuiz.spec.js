import { shallowMount } from '@vue/test-utils';
import CompletedQuizComponent from '/src/components/CompletedQuizComponent.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useStore } from '/src/store/userStore';
import { useQuizStore } from '/src/store/quizStore';

vi.mock('axios');
vi.mock('vue-router');
vi.mock('/src/store/userStore');
vi.mock('/src/store/quizStore');

describe('CompletedQuizComponent', () => {
    let wrapper;
    let mockRoute;
    let mockStore;
    let mockQuizStore;

    beforeEach(() => {
        mockRoute = {
            params: {
                quizId: 1,
            },
        };
        useRoute.mockReturnValue(mockRoute);

        mockStore = {
            jwtToken: {
                accessToken: 'mockAccessToken',
            },
        };
        useStore.mockReturnValue(mockStore);

        mockQuizStore = {
            currentQuiz: {
                questions: [
                    {
                        questionText: 'Question 1?',
                        choices: [
                            { quizChoiceId: 1, choice: 'Choice 1', isCorrectChoice: true },
                            { quizChoiceId: 2, choice: 'Choice 2', isCorrectChoice: false },
                        ],
                        explanation: 'Explanation for question 1',
                    },
                    {
                        questionText: 'Question 2?',
                        choices: [
                            { quizChoiceId: 3, choice: 'Choice 1', isCorrectChoice: false },
                            { quizChoiceId: 4, choice: 'Choice 2', isCorrectChoice: true },
                        ],
                        explanation: 'Explanation for question 2',
                    },
                ],
            },
        };
        useQuizStore.mockReturnValue(mockQuizStore);

        axios.get.mockResolvedValue({
            data: {
                score: 1,
                userAnswers: [
                    { questionChoiceId: 1 },
                    { questionChoiceId: 4 },
                ],
            },
        });

        wrapper = shallowMount(CompletedQuizComponent);
    });

    it('fetches quiz results and displays them correctly', async () => {
        await wrapper.vm.$nextTick();

        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/api/completed-quizzes/1', {
            headers: {
                Authorization: 'Bearer mockAccessToken',
            },
        });

        expect(wrapper.find('h1').text()).toBe('Quiz Results');
        expect(wrapper.find('p').text()).toBe('Your score is: 1 / 2 points');

        const resultItems = wrapper.findAll('.result-item');
        expect(resultItems.length).toBe(2);

        expect(resultItems[0].find('h3').text()).toBe('Question 1: Question 1?');
        expect(resultItems[0].find('p').text()).toBe('Your Answer: Choice 1 - Correct');
        expect(resultItems[0].find('strong').classes()).toContain('correct');
        expect(resultItems[0].find('p').element.style.color).toBe('');
        expect(resultItems[0].find('p').text()).not.toContain('Correct answer:');

        expect(resultItems[1].find('h3').text()).toBe('Question 2: Question 2?');
        expect(resultItems[1].find('p').text()).toBe('Your Answer: Choice 2 - Correct');
        expect(resultItems[1].find('strong').classes()).toContain('correct');
        expect(resultItems[1].find('p').element.style.color).toBe('');
        expect(resultItems[1].find('p').text()).not.toContain('Correct answer:');
    });

    it('displays correct explanation for incorrect answers', async () => {
        await wrapper.vm.$nextTick();

        const resultItems = wrapper.findAll('.result-item');

        expect(resultItems[0].find('p').text()).toContain('Your Answer: Choice 1 - Correct');
        expect(resultItems[1].find('p').element.style.color).toBe('');
        expect(resultItems[1].find('p').text()).not.toContain('Correct answer:');
    });
});
