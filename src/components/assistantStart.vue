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
    <h1 class="title">
      Bienvenido!
    </h1>
    <div>
      <b-button
        block
        class="begin"
        variant="light"
        @click="start"
      >
        Partir!
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AssistantStart',
  data() {
    return {
      error: '',
      hasError: false,
    };
  },
  methods: {
    start() {
      axios.post('http://127.0.0.1:3000/line/5cdb81baaeac5c281f1b6658/attendant')
        .then(() => {
          this.$emit('status', { status: 'waiting', currentNumber: null, clientId: null });
          this.hasError = false;
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

.main{
  margin: 0 auto;
  padding-top: 25vh;
}
.title{
  padding-top: 25 vh;
    font-size: 400%;
}

.begin{
  width:70%;
  margin:10vh auto;
}
</style>
