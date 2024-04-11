import { describe, it, expect, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import MultipleChoiceComponent from '/src/components/MultipleChoiceComponent.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useQuizStore } from '/src/store/quizStore';

const routes = [{ path: '/addquestions', name: 'AddQuestions' }];
const router = createRouter({ history: createWebHistory(), routes });

describe('MultipleChoiceComponent', () => {
    beforeEach(async () => {
        const pinia = createPinia();
        setActivePinia(pinia);
        await router.push('/');
        await router.isReady();
    });

    it('allows inputting a question', async () => {
        const wrapper = mount(MultipleChoiceComponent, {
            global: {
                plugins: [router, createPinia()]
            }
        });
        const questionInput = wrapper.find('#question');
        await questionInput.setValue('Test Question');
        expect(wrapper.vm.question).toBe('Test Question');
    });

    it('allows inputting alternatives and selecting the correct answer', async () => {
        const wrapper = mount(MultipleChoiceComponent, {
            global: {
                plugins: [router, createPinia()]
            }
        });

        const alternativeInputs = wrapper.findAll('.alternative-input');
        for (let i = 0; i < alternativeInputs.length; i++) {
            await alternativeInputs[i].setValue(`Alternative ${i + 1}`);
        }
        await wrapper.findAll('.reject-checkbox')[1].trigger('click');

        expect(wrapper.vm.alternatives).toEqual(['Alternative 1', 'Alternative 2', 'Alternative 3', 'Alternative 4']);
        expect(wrapper.vm.selectedOption).toBe('1');
    });


    it('navigates back to Add Questions on cancel', async () => {
        const wrapper = mount(MultipleChoiceComponent, {
            global: {
                plugins: [router, createPinia()]
            }
        });
        await wrapper.find('.cancel-button').trigger('click');
        await flushPromises();

        expect(router.currentRoute.value.name).toBe('AddQuestions');
    });
});
