import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import LoginPage from '/src/components/LoginPage.vue';

const routes = [
    { path: '/login', name: 'LogIn' },
    { path: '/signup', name: 'SignUp' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

describe('LoginPage', () => {
    let wrapper;
    const pinia = createPinia();

    beforeEach(async () => {
        wrapper = mount(LoginPage, {
            global: {
                plugins: [router, pinia],
            },
        });
        router.push('/login');
        await router.isReady();
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
    });

    it('renders the login form', () => {
        expect(wrapper.find('.log-in-form').exists()).toBe(true);
        expect(wrapper.find('#username').exists()).toBe(true);
        expect(wrapper.find('#password').exists()).toBe(true);
    });

    it('navigates to sign up page when the link is clicked', async () => {
        await wrapper.find('.sign-up-text a').trigger('click');
        await flushPromises();
        expect(router.currentRoute.value.path).toBe('/signup');
    });

    it('displays an error message if login is attempted with empty fields', async () => {
        await wrapper.find('.log-in-button').trigger('click');
        await flushPromises(); // Wait for any asynchronous updates
        expect(wrapper.vm.showError).toBe(true);
        expect(wrapper.vm.errorMessage).toBe('Username and password are required.');
        expect(wrapper.find('.error-message').text()).toContain('Username and password are required.');
    });
});
