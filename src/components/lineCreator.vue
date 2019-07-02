<template>
  <div
    class="main"
  >
    <b-form
      inline
      @submit="onSubmit"
    >
      <div class="main">
        <label
          class="sr-only"
          for="inline-form-input-name"
        >
          Nombre:
        </label>
        <b-input
          id="inline-form-input-name"
          v-model="line.name"
          class="mb-2 mr-sm-2 mb-sm-0"
          placeholder="Fila de espera"
        />
      </div>
      <div class="main">
        <b-button
          v-if="!isNew"
          block
          variant="danger"
          @click="cancel"
        >
          Cancelar
        </b-button>
        <b-button
          block
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
  name: 'LineCreator',
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
    line: {
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
    cancel() {
      this.$emit('cancel');
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.isNew) {
        axios.post(`http://127.0.0.1:3000/company/${this.companyId}/line`, { name: this.line.name })
          .then(() => {
            this.$emit('done');
            this.line = {
              name: '',
              _id: '',
            };
          })
          .catch((error) => {
            this.$emit('error', error);
          });
      } else {
        axios.patch(`http://127.0.0.1:3000/line/${this.line._id}`, { name: this.line.name })
          .then(() => {
            this.$emit('done');
            this.line = {
              name: '',
              _id: '',
            };
          })
          .catch((error) => {
            console.log(error);
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

</style>
