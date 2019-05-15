import { createLocalVue, mount } from '@vue/test-utils';
import AssistantAttending from '@/components/assistantAttending.vue';
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

describe('assistantStart.vue', () => {
  let wrapper;

  beforeEach(() => {
    jest.useFakeTimers();
    mock.reset();
    wrapper = mount(AssistantAttending, {
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
  it('Start Attending!', async () => {
    mock
      .onGet('next')
      .reply(200, [{ currentNumber: 23 }]);
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Esperando Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
  });
  it('get new number when customer did not arrive', async () => {
    mock
      .onGet('next')
      .reply(200, [{ currentNumber: 23 }])
      .onPatch('notArrive', { currentNumber: 23 })
      .reply(200, [{ currentNumber: 24 }])
      .onAny()
      .reply(500);

    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Esperando Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
    wrapper.find('.notArrived').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Esperando Numero:');
    expect(wrapper.find('h1').text()).toBe('24');
  });
  it('Change view when customer arrive', async () => {
    mock
      .onGet('next')
      .reply(200, [{ currentNumber: 23 }])
      .onPatch('Arrive', { currentNumber: 23 })
      .reply(200, [{ currentNumber: 23 }])
      .onAny()
      .reply(500);

    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Esperando Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
    wrapper.find('arrived').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Atendiendo Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
    expect(wrapper.find('button').text()).toBe('Siguiente');
  });
  it('get new number when customer when done attending', async () => {
    mock
      .onGet('next')
      .replyOnce(200, [{ currentNumber: 23 }])
      .reply(200, [{ currentNumber: 24 }])
      .onPatch('Arrive', { currentNumber: 23 })
      .reply(200, [{ currentNumber: 23 }])
      .onAny()
      .reply(500);

    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Esperando Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
    wrapper.find('arrived').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Atendiendo Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
    expect(wrapper.find('button').text()).toBe('Siguiente');
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Esperando Numero:');
    expect(wrapper.find('h1').text()).toBe('24');
  });
  it('Change view row is empty', async () => {
    mock
      .onGet('next')
      .replyOnce(200, [{ currentNumber: 23 }])
      .reply(200, [{ currentNumber: null }])
      .onPatch('Arrive', { currentNumber: 23 })
      .reply(200, [{ currentNumber: 23 }])
      .onAny()
      .reply(500);

    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Esperando Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
    wrapper.find('arrived').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Atendiendo Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
    expect(wrapper.find('button').text()).toBe('Siguiente');
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('Fila Vacía!');
  });
  it('Update empty row', async () => {
    mock
      .onGet('next')
      .replyOnce(200, [{ currentNumber: 23 }])
      .replyOnce(200, [{ currentNumber: null }])
      .reply(200, [{ currentNumber: 24 }])
      .onPatch('Arrive', { currentNumber: 23 })
      .reply(200, [{ currentNumber: 23 }])
      .onAny()
      .reply(500);

    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Esperando Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
    wrapper.find('arrived').trigger('click');
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Atendiendo Numero:');
    expect(wrapper.find('h1').text()).toBe('23');
    expect(wrapper.find('button').text()).toBe('Siguiente');
    wrapper.find('button').trigger('click');
    await flushPromises();
    expect(wrapper.find('h1').text()).toBe('Fila Vacía!');
    jest.advanceTimersByTime(10000);
    await flushPromises();
    expect(wrapper.find('h3').text()).toBe('Esperando Numero:');
    expect(wrapper.find('h1').text()).toBe('24');
  });
});
