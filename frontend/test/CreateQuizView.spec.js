import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import CreateQuizView from '/src/view/CreateQuizView.vue';
import NavbarComponent from '/src/components/NavBarComponent.vue';
import { createRouter, createWebHistory } from 'vue-router';

vi.mock('/src/components/NavBarComponent.vue', () => {
    return {
        default: {
            name: 'NavbarComponent',
            template: '<div>Mocked Navbar</div>',
        },
    };
});
const routes = [{ path: '/', component: { template: '<div></div>' } }];
const router = createRouter({
    history: createWebHistory(),
    routes,
});

describe('CreateQuizView', () => {
    beforeEach(async () => {
        router.push('/');
        await router.isReady();
    });

    it('renders NavbarComponent', () => {
        const wrapper = mount(CreateQuizView, {
            global: {
                plugins: [router],
                stubs: {
                    NavbarComponent: true,
                    RouterView: true,
                },
            },
        });

        expect(wrapper.findComponent(NavbarComponent).exists()).toBe(true);
    });

});
