import { render, fireEvent } from '@testing-library/vue';
import LoginPage from '../LoginPage.vue';

describe('Component', () => {
  test('является экземпляром Vue', () => {
    const instance = render(LoginPage);
    console.log(typeof instance);

  });
});