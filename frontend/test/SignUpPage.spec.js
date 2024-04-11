import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SignUpPage from '/src/components/SignUpPage.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';

const routes = [
    { path: '/login', name: 'Login' },
    { path: '/signup', name: 'SignUp' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

describe('SignUpPage', () => {
    let wrapper;
    const pinia = createPinia();

    beforeEach(async () => {
        wrapper = mount(SignUpPage, {
            global: {
                plugins: [router, pinia],
            },
        });
        router.push('/signup');
        await router.isReady();
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
    });

    it('renders the sign-up form', () => {
        expect(wrapper.find('.sign-up-form').exists()).toBe(true);
        expect(wrapper.find('#envelope-icon').exists()).toBe(true);
        expect(wrapper.find('#user-icon').exists()).toBe(true);
        expect(wrapper.find('#lock-icon').exists()).toBe(true);
    });

    it('shows an error if signup is attempted with empty fields', async () => {
        await wrapper.find('.sign-up-button').trigger('click');
        expect(wrapper.vm.showError).toBe(true);
        expect(wrapper.vm.errorMessage).toBe('Email, username, and password are required.');
        expect(wrapper.find('.error-message').text()).toContain('Email, username, and password are required.');
    });

    it('navigates to the login page when the link is clicked', async () => {
        await wrapper.find('.log-in-text a').trigger('click');
        await flushPromises();
        expect(router.currentRoute.value.path).toBe('/login');
    });
});
