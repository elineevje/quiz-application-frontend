import { shallowMount } from '@vue/test-utils';
import CreateQuizDetailsComponent from '/src/components/CreateQuizDetailsComponent.vue';
import { useQuizStore } from '/src/store/quizStore';
import { useStore } from '/src/store/userStore';

vi.mock('/src/store/quizStore');
vi.mock('/src/store/userStore');

describe('CreateQuizDetailsComponent', () => {
    let wrapper;
    let mockUseQuizStore;
    let mockUseStore;

    beforeEach(() => {
        mockUseQuizStore = {
            fetchCategories: vi.fn(),
            createQuiz: vi.fn(),
            categories: [
                { categoryId: 1, categoryName: 'Category 1' },
                { categoryId: 2, categoryName: 'Category 2' }
            ]
        };
        mockUseStore = {
            jwtToken: {
                accessToken: 'mockAccessToken'
            }
        };
        useQuizStore.mockReturnValue(mockUseQuizStore);
        useStore.mockReturnValue(mockUseStore);

        wrapper = shallowMount(CreateQuizDetailsComponent);
    });

    it('renders properly', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('fetches categories on mounted', async () => {
        await wrapper.vm.$nextTick();
        expect(mockUseQuizStore.fetchCategories).toHaveBeenCalled();
    });
});
