import { shallowMount } from '@vue/test-utils';
import ClientToJoin from '@/components/clientToJoin.vue';

describe('clientToJoin.vue', () => {
  it('it mounted', () => {
    const wrapper = shallowMount(ClientToJoin);
    const title = wrapper.find('h1');
    expect(title.text()).toMatch('Bienvenido!');
  });
});
