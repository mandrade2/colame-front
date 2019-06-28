<template>
  <div
    class="main"
  >
    <h1>Atendedores</h1>

    <div class="center">
      <b-card
        title="Crear Atendedor"
        bg-variant="light"
        text-variant="dark"
      >
        <AttendantCreator
          :companyId="'5cd6f9ce14f8aa4a7a2928ba'"
          @done="getAttendants()"
        />
      </b-card>
    </div>
    <div
      v-for="(attendant) in attendants"
      :key="attendant._id"
    >
      <b-card
        v-if="selected != attendant._id"
        bg-variant="dark"
        text-variant="white"
        :title="attendant.name"
      >
        <b-button
          variant="danger"
          @click="deleteAttendant(attendant._id)"
        >
          Delete
        </b-button>
        <b-button
          variant="warning"
          @click="select(attendant._id)"
        >
          Editar
        </b-button>
      </b-card>
      <b-card
        v-else
        bg-variant="dark"
        text-variant="white"
        :title="'Editando '+attendant.name"
      >
        <div class="center">
          <AttendantCreator
            :attendant="attendant"
            :isNew="false"
            :companyId="'5cd6f9ce14f8aa4a7a2928ba'"
            @done="getAttendants()"
          />
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AttendantCreator from '@/components/attendantCreator.vue';

export default {
  name: 'CompanyAttendantList',
  components: {
    AttendantCreator,
  },
  data() {
    return {
      error: '',
      hasError: false,
      attendants: [],
      selected: '',
    };
  },
  mounted() {
    this.getAttendants();
  },
  methods: {
    getAttendants() {
      axios.get('http://127.0.0.1:3000/company/5cd6f9ce14f8aa4a7a2928ba/attendants')
        .then((attendants) => {
          this.attendants = attendants.data;
          this.selected = '';
        })
        .catch((err) => {
          console.log(err);
          this.hasError = true;
          this.error = err;
        });
    },
    deleteAttendant(id) {
      axios.delete(`http://127.0.0.1:3000/attendant/${id}`)
        .then(() => {
          this.getAttendants();
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
