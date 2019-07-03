<template>
  <div class="main">
    <div v-if="status == 'notLoggedIn'">
      <CompanyLogin @status="updateStatus" />
    </div>
    <div v-if="status != 'notLoggedIn'">
      <b-tabs
        vertical
        nav-wrapper-class="text-danger"
        active-nav-item-class="text-danger"
        nav-class="bg-light font-weight-bold text-danger"
      >
        <b-tab
          title="Colame"
          disabled
        >
          <p>I'm a disabled tab!</p>
        </b-tab>
        <b-tab
          title="Lineas"
          active
        >
          <CompanyLinesList :company="company" />
        </b-tab>
        <b-tab title="Atendedores">
          <CompanyAttendantList :company="company" />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import CompanyAttendantList from '@/components/CompanyAttendantList.vue';
import CompanyLinesList from '@/components/Companylinelist.vue';
import CompanyLogin from '@/components/CompanyLogin.vue';

export default {
  name: 'CompanyView',
  components: {
    CompanyAttendantList,
    CompanyLinesList,
    CompanyLogin,
  },
  data() {
    return {
      error: '',
      hasError: false,
      status: 'notLoggedIn',
      company: {},
    };
  },
  mounted() {
    if (localStorage.company) {
      this.company = JSON.parse(localStorage.company);
    } else {
      this.status = 'notLoggedIn';
    }
  },
  methods: {
    updateStatus() {
      this.status = 'loggedIn';
    },
  },
};

</script>

<style scoped>
.main {
  margin: auto;
}
</style>
