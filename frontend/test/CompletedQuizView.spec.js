import {describe, it, expect, beforeEach} from 'vitest';
import { mount } from '@vue/test-utils';
import CompletedQuizComponent from '/src/components/CompletedQuizComponent.vue';
import NavbarComponent from '/src/components/NavBarComponent.vue';
import {createRouter, createWebHistory} from "vue-router";
import CreateQuizView from "/src/view/CreateQuizView.vue";

vi.mock('/src/components/NavBarComponent.vue', () => {
    return {
        default: {
            name: 'NavbarComponent',
            template: '<div>Mocked Navbar</div>',
        },
    };
});

vi.mock('/src/components/CompletedQuizComponent.vue', () => {
    return {
        default: {
            name: 'CompletedQuizComponent',
            template: '<div>Mocked Completed quiz component</div>',
        },
    };
});

const routes = [{ path: '/', component: { template: '<div></div>' } }];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

describe('CompletedQuizView', () => {
    beforeEach(async () => {
        router.push('/');
        await router.isReady();
    });

    it('renders CompletedQuizComponent', () => {
        const wrapper = mount(CreateQuizView, {
            global: {
                plugins: [router],
                stubs: {
                    NavbarComponent: true,
                    CompletedQuizComponent: true,
                    RouterView: true,
                },
            },
        });
        expect(wrapper.findComponent(NavbarComponent).exists()).toBe(true);
    });

});
