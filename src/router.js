import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ClientToJoin from './views/clientToJoin.vue';
import ClientJoined from './views/clientJoined.vue';
import AssistanView from './views/assistantView.vue';
import CompanyView from './views/CompanyView.vue';
import CompanyForm from './views/CompanyForm.vue';
import authCompany from './middleware/authCompany';
import authAssistant from './middleware/authAssistant';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: ClientToJoin,
  },
  {
    path: '/row',
    name: 'line',
    component: ClientJoined,
  },
  {
    path: '/assistant',
    name: 'Assistant',
    component: AssistanView,
    meta: {
      middleware: authAssistant,
    },
  },
  {
    path: '/company',
    name: 'Company',
    component: CompanyView,
    meta: {
      middleware: authCompany,
    },
  },
  {
    path: '/company_form',
    name: 'CompanyForm',
    component: CompanyForm,
  },
  ],
});
