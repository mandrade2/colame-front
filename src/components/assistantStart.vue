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
      axios.get('start')
        .then((response) => {
          this.$emit('status', { status: 'waiting', currentNumber: response.data.currentNumber });
          this.hasError = false;
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
  },
};

<b-button
  class="exit"
  variant="danger"
  @click="exitRow"
>
  Salirse de la fila!
</b-button>

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
