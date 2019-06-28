import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ClientToJoin from './views/clientToJoin.vue';
import ClientJoined from './views/clientJoined.vue';
import AssistanView from './views/assistantView.vue';
import CompanyView from './views/CompanyView.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: ClientToJoin,
    },
    {
      path: '/row',
      name: 'line',
      component: ClientJoined,
      props: true,
    },
    {
      path: '/assistant',
      name: 'Assistant',
      component: AssistanView,
    },
    {
      path: '/company',
      name: 'Company',
      component: CompanyView,
    },
  ],
});
