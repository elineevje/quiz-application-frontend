import {describe, it, expect, beforeEach} from 'vitest';
import {mount, flushPromises} from '@vue/test-utils';
import {createPinia, setActivePinia} from 'pinia';
import TrueOrFalseComponent from '/src/components/TrueOrFalseComponent.vue';
import {createRouter, createWebHistory} from 'vue-router';

const routes = [{path: '/addquestions', name: 'AddQuestions'}];
const router = createRouter({history: createWebHistory(), routes});

describe('TrueOrFalseComponent', () => {
    beforeEach(async () => {
        const pinia = createPinia();
        setActivePinia(pinia);
        await router.push('/');
        await router.isReady();
    });

    it('allows inputting a question', async () => {
        const wrapper = mount(TrueOrFalseComponent, {
            global: {
                plugins: [router, createPinia()]
            }
        });
        const questionInput = wrapper.find('#question');
        await questionInput.setValue('Is the sky blue?');
        expect(questionInput.element.value).toBe('Is the sky blue?');
    });

    it('allows selecting True as the answer alternative', async () => {
        const wrapper = mount(TrueOrFalseComponent, {
            global: {
                plugins: [router]
            }
        });
        const trueOption = wrapper.find('[data-testid="true-option"]');
        await trueOption.trigger('click');
        expect(wrapper.vm.selectedOption).toBe('true');
    });

    it('allows selecting False as the answer alternative', async () => {
        const wrapper = mount(TrueOrFalseComponent, {
            global: {
                plugins: [router]
            }
        });
        const falseOption = wrapper.find('[data-testid="false-option"]');
        await falseOption.trigger('click');
        expect(wrapper.vm.selectedOption).toBe('false');
    });

    it('navigates back to home on save', async () => {
        const wrapper = mount(TrueOrFalseComponent, {
            global: {
                plugins: [router, createPinia()]
            }
        });
        await wrapper.find('.save-button').trigger('click');
        await flushPromises();
        expect(router.currentRoute.value.path).toBe('/');
    });

    it('navigates back to Add Questions on cancel', async () => {
        const wrapper = mount(TrueOrFalseComponent, {
            global: {
                plugins: [router, createPinia()]
            }
        });
        await wrapper.find('.cancel-button').trigger('click');
        await flushPromises();
        expect(router.currentRoute.value.path).toBe('/addQuestions');
    });
});
