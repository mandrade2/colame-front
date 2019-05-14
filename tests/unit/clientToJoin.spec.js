import { createLocalVue, mount } from '@vue/test-utils';
import ClientToJoin from '@/views/clientToJoin.vue';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';

const mock = new MockAdapter(axios);

const localVue = createLocalVue();
localVue.use(BootstrapVue);

const replace = jest.fn();

const $router = {
  replace,
};

describe('clientToJoin.vue', () => {
  let wrapper;

  beforeEach(() => {
    mock.reset();
    wrapper = mount(ClientToJoin, {
      localVue,
      mocks: {
        $router,
      },
    });
  });

  afterAll(() => mock.restore());

  it('it mounted', () => {
    const title = wrapper.find('h1');
    expect(title.text()).toMatch('Bienvenido!');
    expect(wrapper.find('.alert').exists()).toBe(false);
  });
  it('redirect when button is clicked', async () => {
    mock
      .onGet('https://jsonplaceholder.typicode.com/users?id=1')
      .reply(200, [{ name: 'fila', yourNumber: 10, current: 5 }]);
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(replace).toHaveBeenCalledWith('/');
  });
  it('get queue information when called', async () => {
    mock
      .onGet('https://jsonplaceholder.typicode.com/users?id=1')
      .reply(200, { name: 'fila', yourNumber: 10, current: 5 });
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('.alert').exists()).toBe(false);
    expect(wrapper.emitted().queue[0][0]).toMatchObject({
      name: expect.any(String), yourNumber: expect.any(Number), current: expect.any(Number),
    });
  });
  it('show error and dont show queue information', async () => {
    mock
      .onGet('https://jsonplaceholder.typicode.com/users?id=1')
      .networkError();
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.emitted().queue).toBeUndefined();
    expect(wrapper.find('.alert').exists()).toBe(true);
  });
});
