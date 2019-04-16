<template>
  <div
    class="main"
  >
    <div v-if="hasError">
      <b-alert
        variant="danger"
        dismissible
        show
      >
        {{ error }}
      </b-alert>
    </div>
    <h1> Bienvenido! </h1>
    <div>
      <b-button
        block
        variant="primary"
        @click="joinRow"
      >
        Unirse a una fila!
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientToJoin',
  data() {
    return {
      error: '',
      hasError: false,
    };
  },
  methods: {
    joinRow() {
      axios.get('https://jsonplaceholder.typicode.com/users?id=1')
        .then((response) => {
          this.$emit('queue', response.data);
          this.hasError = false;
          this.$router.replace('/');
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
  },
};


</script>

<style scoped>

</style>
