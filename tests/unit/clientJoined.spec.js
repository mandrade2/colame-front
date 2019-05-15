import { createLocalVue, mount } from '@vue/test-utils';
import ClientJoined from '@/views/clientJoined.vue';
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

describe('clientJoined.vue', () => {
  let wrapper;

  beforeEach(() => {
    jest.useFakeTimers();
    mock.reset();
    wrapper = mount(ClientJoined, {
      localVue,
      mocks: {
        $router,
      },
      propsData: {
        queue: {
          name: 'fila',
          yourNumber: 10,
          current: 5,
          done: false,
        },
      },
    });
  });

  afterAll(() => mock.restore());

  it('it mounted', () => {
    const title = wrapper.find('button');
    expect(title.text()).toMatch('Salirse de una fila!');
    expect(wrapper.find('.alert').exists()).toBe(false);
  });
  it('redirect when button is clicked', async () => {
    mock
      .onPatch(`http://127.0.0.1:3000/line/5cdb81baaeac5c281f1b6658/${this.data.client._id}`)
      .reply(200)
      .onGet('http://127.0.0.1:3000/line/5cdb81baaeac5c281f1b6658/')
      .reply(200, {
        name: 'fila',
        yourNumber: 10,
        current: 5,
        done: false,
      });
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(replace).toHaveBeenCalledWith('/');
  });
  it('show error when failed exit', async () => {
    mock
      .onDelete('mock')
      .networkError();
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('.alert').exists()).toBe(true);
  });
  it('show how long to wait and current number', async () => {
    mock
      .onPatch(`http://127.0.0.1:3000/line/5cdb81baaeac5c281f1b6658/${this.data.client._id}`)
      .reply(200)
      .onGet('http://127.0.0.1:3000/line/5cdb81baaeac5c281f1b6658/')
      .reply(200, {
        name: 'fila',
        yourNumber: 10,
        current: 5,
        done: false,
      });
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('5');
    expect(wrapper.find('h4').text()).toBe('10');
  });
  it('show how long to wait and current number', async () => {
    mock
      .onDelete('mock')
      .reply(200)
      .onGet('/mock')
      .replyOnce(200, {
        name: 'fila',
        yourNumber: 10,
        current: 5,
        done: false,
      })
      .onGet('/mock')
      .reply(200, {
        name: 'fila',
        yourNumber: 10,
        current: 8,
        done: false,
      });
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('5');
    expect(wrapper.find('h4').text()).toBe('10');
    jest.advanceTimersByTime(10001);
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('2');
    expect(wrapper.find('h4').text()).toBe('10');
  });
  it('Show when is your turn!', async () => {
    mock
      .onGet('/mock')
      .reply(200, {
        name: 'fila',
        yourNumber: 10,
        current: 10,
        done: false,
      });
    jest.advanceTimersByTime(10000);
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('Te Toca!');
    expect(wrapper.find('h4').text()).toBe('10');
  });
  it('Exit when done', async () => {
    mock
      .onGet('/mock')
      .reply(200, {
        name: 'fila',
        yourNumber: 10,
        current: 10,
        done: true,
      });
    jest.advanceTimersByTime(10000);
    await flushPromises();
    expect(replace).toHaveBeenCalledWith('/');
  });
});
