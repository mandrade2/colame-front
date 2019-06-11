<template>
  <div class="main">
    <b-tabs
      vertical
      nav-wrapper-class="text-danger"
      active-nav-item-class="text-danger"
      nav-class="bg-light font-weight-bold text-danger"
    >
    <b-tab title="Colame" disabled><p>I'm a disabled tab!</p></b-tab>
      <b-tab
        title="Lineas"
        active
      >
        <CompanyLinesList />
      </b-tab>
      <b-tab title="Atendedores">
        <CompanyAttendantList />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import CompanyAttendantList from '@/components/CompanyAttendantList.vue';
import CompanyLinesList from '@/components/Companylinelist.vue';

export default {
  name: 'CompanyView',
  components: {
    CompanyAttendantList,
    CompanyLinesList,
  },
};


</script>

<style scoped>
.main {
  margin: auto;
}

</style>
