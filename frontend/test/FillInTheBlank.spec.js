import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import FillInTheBlankComponent from '/src/components/FillInTheBlankComponent.vue';

describe('FillInTheBlank', () => {
    let wrapper;

    beforeEach(() => {
        setActivePinia(createPinia());

        const router = createRouter({
            history: createWebHistory(),
            routes: [{ path: '/addQuestions', name: 'AddQuestions' }],
        });

        wrapper = mount(FillInTheBlankComponent, {
            global: {
                plugins: [router]
            }
        });
    });

    it('updates the first part of the question', async () => {
        const input = wrapper.find('#question-part-one');
        await input.setValue('First part');
        expect(wrapper.vm.questionPartOne).toBe('First part');
    });

    it('updates the second part of the question', async () => {
        const input = wrapper.find('#question-part-two');
        await input.setValue('Second part');
        expect(wrapper.vm.questionPartTwo).toBe('Second part');
    });

    it('adds an alternative and selects it as correct', async () => {
        const alternativeInputs = wrapper.findAll('.alternative-input');
        await alternativeInputs[0].setValue('Alternative 1');
        expect(wrapper.vm.alternatives[0]).toBe('Alternative 1');

        const correctCheckbox = wrapper.find('.reject-checkbox');
        await correctCheckbox.trigger('click');
        expect(wrapper.vm.selectedOption).toBe('0');
    });

    it('handles form submission with valid data', async () => {
        await wrapper.find('#question-part-one').setValue('First part');
        await wrapper.find('#question-part-two').setValue('Second part');

        const alternativeInputs = wrapper.findAll('.alternative-input');
        await alternativeInputs[0].setValue('Alternative 1');
        const correctCheckbox = wrapper.find('.reject-checkbox');
        await correctCheckbox.trigger('click');
    });
});
