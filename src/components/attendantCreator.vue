<template>
  <div
    class="title"
  >
    <b-form
      inline
      @submit="onSubmit"
    >
      <label
        class="sr-only"
        for="inline-form-input-name"
      >
        Nombre:
      </label>
      <div class="main">
        <b-input
          id="inline-form-input-name"
          v-model="attendant.name"
          placeholder="Fila de espera"
        />
      </div>
      <div class="main">
        <b-button
          type="submit"
          variant="primary"
        >
          Guardar
        </b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AttendantCreator',
  props: {
    companyId: {
      type: String,
      default() {
        return 'NOPE';
      },
    },
    isNew: {
      type: Boolean,
      default() {
        return true;
      },
    },
    attendant: {
      type: Object,
      default() {
        return {
          name: '',
          _id: '',
        };
      },
    },
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      if (this.isNew) {
        axios.post(`http://127.0.0.1:3000/company/${this.companyId}/attendant`, { name: this.attendant.name })
          .then(() => {
            this.$emit('done');
            this.attendant = {
              name: '',
              _id: '',
            };
          })
          .catch((error) => {
            console.log(error);
            this.$emit('error', error);
          });
      } else {
        axios.patch(`http://127.0.0.1:3000/attendant/${this.attendant._id}`, { name: this.attendant.name })
          .then(() => {
            this.$emit('done');
          })
          .catch((error) => {
            this.$emit('error', error);
          });
      }
    },
  },
};


</script>

<style scoped>

.main{
  margin: auto;
}

.title{
  
}

</style>
