import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import NavBarComponent from '/src/components/NavBarComponent.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const routes = [
    { path: '/home', name: 'Home' },
    { path: '/createQuiz', name: 'CreateQuiz' },
    { path: '/search', name: 'Search' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

describe('NavBarComponent', () => {
    let wrapper;
    const pinia = createPinia();

    beforeEach(() => {
        global.innerWidth = 500;
        global.dispatchEvent = vi.fn();

        wrapper = mount(NavBarComponent, {
            global: {
                plugins: [router, pinia],
                stubs: {
                    FontAwesomeIcon
                }
            },
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('displays the mobile menu when the screen width is less than 800px', async () => {
        expect(wrapper.vm.isMobileMenuVisible).toBe(true);
    });

    it('toggles the mobile menu when the hamburger icon is clicked', async () => {
        await wrapper.find('.hamburger-menu-container').trigger('click');
        expect(wrapper.vm.showMobileMenu).toBe(true);
    });

    it('closes the mobile menu when an item is clicked', async () => {
        await wrapper.find('.hamburger-menu-container').trigger('click');
        expect(wrapper.vm.showMobileMenu).toBe(true);

        await wrapper.find('.mobile-dropdown-menu a').trigger('click');
        expect(wrapper.vm.showMobileMenu).toBe(false);
    });

    it('navigates to the correct page when a menu item is clicked', async () => {
        await wrapper.find('.navbar-list li:first-child a').trigger('click');
        expect(router.currentRoute.value.path).toBe('/');
    });
});
