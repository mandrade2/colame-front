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

describe('clientToJoin.vue', () => {
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
    expect(title.text()).toMatch('Fila Vacía!!');
    expect(wrapper.find('.alert').exists()).toBe(false);
  });
  it('Update empty row', async () => {
    mock
      .onGet('next')
      .replyOnce(200, [{ currentNumber: null }])
      .reply(200, [{ currentNumber: 24 }]);
    expect(wrapper.find('h1').text()).toBe('Fila Vacía!');
    jest.advanceTimersByTime(10000);
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('Fila Vacía!');
    jest.advanceTimersByTime(10000);
    await flushPromises();
    expect(wrapper.emitted().status[1]).toMatchObject({ status: 'waiting', currentNumber: 24 });
  });
});
