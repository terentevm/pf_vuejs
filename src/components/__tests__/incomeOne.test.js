import { render, fireEvent } from '@testing-library/vue';
import Income from '../Income.vue';

describe('Component', () => {
    test('является экземпляром Vue', () => {
        const wrapper = mount(Income);
        expect(wrapper.isVueInstance()).toBeTruthy();
    });
});
