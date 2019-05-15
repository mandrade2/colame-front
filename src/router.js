import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ClientToJoin from './views/clientToJoin.vue';
import ClientJoined from './views/clientJoined.vue';
import AssistanView from './views/assistantView.vue';

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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
