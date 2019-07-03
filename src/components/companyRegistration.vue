<template>
  <div>
    <b-form
      inline
      @submit="onSubmit"
    >
      <div class="main">
        <div class="inp">
          <label
            class="sr-only"
            for="inline-form-input-name"
          >
            Nombre:
          </label>
          <b-input
            id="inline-form-input-name"
            v-model="company.name"
            placeholder="nombre"
            class="mb-2 mr-sm-2 mb-sm-0"
          />
        </div>
        <div class="inp">
          <label
            class="sr-only"
            for="inline-form-input-description"
          >
            Descripcion:
          </label>
          <b-input
            id="inline-form-input-description"
            v-model="company.description"
            placeholder="descripcion"
            class="mb-2 mr-sm-2 mb-sm-0"
          />
        </div>
        <div class="inp">
          <label
            class="sr-only"
            for="inline-form-input-description"
          >
            Username:
          </label>
          <b-input
            id="inline-form-input-description"
            v-model="company.username"
            placeholder="descripcion"
            class="mb-2 mr-sm-2 mb-sm-0"
          />
        </div>
        <div class="inp">
          <label
            class="sr-only"
            for="inline-form-input-description"
          >
            Password:
          </label>
          <b-input
            id="inline-form-input-description"
            v-model="company.plainpassword"
            placeholder="descripcion"
            class="mb-2 mr-sm-2 mb-sm-0"
          />
        </div>
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
  name: 'CompanyCreator',
  props: {
    company: {
      type: String,
      default() {
        return {
          name: '',
          description: '',
          _id: '',
        };
      },
    },
    isNew: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      if (this.isNew) {
        axios.post('http://127.0.0.1:3000/company', { name: this.company.name, description: this.company.description, plainpassword: this.company.plainpassword, username: this.company.username })
          .then(() => {
            this.$emit('done');
            this.company = {
              name: '',
              description: '',
              _id: '',
            };
          })
          .catch((error) => {
            console.log(error);
            this.$emit('error', error);
          });
      } else {
        axios.patch(`http://127.0.0.1:3000/company/${this.company._id}`, { name: this.company.name, description: this.company.description, plainpassword: this.company.plainpassword, username: this.company.username })
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
  background-color: gray;
}
.inp{
  padding: 10px;
}
</style>
