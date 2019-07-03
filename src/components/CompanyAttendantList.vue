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
          :company-id="company._id"
          @done="getAttendants()"
        />
      </b-card>
    </div>
    <div
      v-for="attendant in attendants"
      :key="attendant._id"
    >
      <AttendantListElement
        :attendant="attendant"
        @done="getAttendants()"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AttendantCreator from '@/components/attendantCreator.vue';
import AttendantListElement from '@/components/Attendantlistelement.vue';

export default {
  name: 'CompanyAttendantList',
  components: {
    AttendantCreator,
    AttendantListElement,
  },
  props: {
    company: {
      type: Object,
      default() {
        return {};
      },
    },
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
      axios.get(`http://127.0.0.1:3000/company/${this.company._id}/attendants`)
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
