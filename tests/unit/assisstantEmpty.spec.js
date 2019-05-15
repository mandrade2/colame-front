import { createLocalVue, mount } from '@vue/test-utils';
import AssistantEmpty from '@/components/assistantEmpty.vue';
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

describe('assistantEmpty.vue', () => {
  let wrapper;

  beforeEach(() => {
    jest.useFakeTimers();
    mock.reset();
    wrapper = mount(AssistantEmpty, {
      localVue,
      mocks: {
        $router,
      },
    });
  });

  afterAll(() => mock.restore());

  it('it mounted', () => {
    const title = wrapper.find('h1');
    expect(title.text()).toMatch('Fila vacía!');
    expect(wrapper.find('.alert').exists()).toBe(false);
  });
  it('Update empty row', async () => {
    mock
      .onPatch('http://127.0.0.1:3000/line/5cdb81baaeac5c281f1b6658', {})
      .replyOnce(200, [{ number: null, _id: null }])
      .onPatch('http://127.0.0.1:3000/line/5cdb81baaeac5c281f1b6658', {})
      .reply(200, [{ number: 24, _id: 'abc123' }]);
    expect(wrapper.find('h1').text()).toBe('Fila vacía!');
    jest.advanceTimersByTime(10000);
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('Fila vacía!');
    jest.advanceTimersByTime(10000);
    await flushPromises();
    expect(wrapper.emitted().status[1]).toMatchObject({ status: 'waiting', currentNumber: 24, ClientId: 'abc123' });
  });
});
