import { createLocalVue, mount } from '@vue/test-utils';
import ClientToJoin from '@/views/clientToJoin.vue';
import BootstrapVue from 'bootstrap-vue';
import Router from '@/router';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import flushPromises from 'flush-promises';

const mock = new MockAdapter(axios);

const localVue = createLocalVue();
localVue.use(BootstrapVue);
localVue.use(Router);

describe('clientToJoin.vue', () => {
  let wrapper;

  beforeEach(() => {
    mock.reset();
    wrapper = mount(ClientToJoin, { localVue });
  });

  afterAll(() => mock.restore());

  it('it mounted', () => {
    const title = wrapper.find('h1');
    expect(title.text()).toMatch('Bienvenido!');
  });
  it('redirect when button is clicked', async () => {
    mock
      .onGet('https://jsonplaceholder.typicode.com/users?id=1')
      .reply(200, [{ name: 'fila', yourNumber: 10, current: 5 }]);
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h1').exists()).toBe(false);
  });
  it('get queue information when called', async () => {
    mock
      .onGet('https://jsonplaceholder.typicode.com/users?id=1')
      .reply(200, { name: 'fila', yourNumber: 10, current: 5 });
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.emitted().queue[0][0]).toMatchObject({
      name: expect.any(String), yourNumber: expect.any(Number), current: expect.any(Number),
    });
  });
});
