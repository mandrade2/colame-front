<template>
  <div
    class="main"
  >
    <h1>Empresas</h1>

    <div class="center">
      <b-card
        title="Crear Empresa"
        bg-variant="light"
        text-variant="dark"
      >
        <CompanyCreator
          @done="getAttendants()"
        />
      </b-card>
    </div>
    <div
      v-for="(company) in companies"
      :key="company._id"
    >
      <b-card
        v-if="selected != company._id"
        bg-variant="dark"
        text-variant="white"
        :title="company.name"
      >
        <b-button
          variant="danger"
          @click="deleteCompany(company._id)"
        >
          Delete
        </b-button>
        <b-button
          variant="warning"
          @click="select(company._id)"
        >
          Editar
        </b-button>
      </b-card>
      <b-card
        v-else
        bg-variant="dark"
        text-variant="white"
        :title="'Editando '+company.name"
      >
        <div class="center">
          <CompanyCreator
            :company="company"
            :is-new="false"
            @done="getCompanies()"
          />
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CompanyCreator from '@/components/companyRegistration.vue';

export default {
  name: 'CompaniesList',
  components: {
    CompanyCreator,
  },
  data() {
    return {
      error: '',
      hasError: false,
      companies: [],
      selected: '',
    };
  },
  mounted() {
    this.getCompanies();
  },
  methods: {
    getCompanies() {
      axios.get('http://127.0.0.1:3000/company')
        .then((companies) => {
          this.companies = companies.data;
          this.selected = '';
        })
        .catch((err) => {
          console.log(err);
          this.hasError = true;
          this.error = err;
        });
    },
    deleteCompany(id) {
      axios.delete('http://127.0.0.1:3000/company/${id}')
        .then(() => {
          this.getCompanies();
        })
        .catch((err) => {
          this.hasError = true;
          this.error = err;
        });
    },
    select(id) {
      this.selected = id;
    },
  },
};


</script>

<style scoped>
.card {
  margin: auto;
  margin-top: 1%;
  color: black;
  width:66%;
}

.card img {
  margin: auto;
  margin-top: 1%;
  margin-bottom: 1%;
  width: 25vh;
}

.center{
  margin: auto;
  width: 50vw;
  padding: 10px;
}

</style>
