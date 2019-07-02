<template>
  <div class="main">
    <CompaniesList />
  </div>
</template>

<script>
import CompaniesList from '@/components/companiesList.vue';

export default {
  name: 'CompanyForm',
  components: {
    CompaniesList,
  },
};


</script>

<style scoped>
.main {
  margin: auto;
}

</style>
