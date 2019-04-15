import { createLocalVue, mount } from '@vue/test-utils';
import ClientToJoin from '@/views/clientToJoin.vue';
import BootstrapVue from 'bootstrap-vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe('clientToJoin.vue', () => {
  it('it mounted', () => {
    const wrapper = mount(ClientToJoin, {
      localVue,
    });
    const title = wrapper.find('h1');
    expect(title.text()).toMatch('Bienvenido!');
  });
});
