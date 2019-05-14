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
    <div class="title">
      <h3> Atendiendo número: </h3>
      <h1> {{ currentNumber }} </h1>
    </div>
    <div>
      <b-button
        class="done"
        variant="light"
        @click="next"
      >
        Listo!
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AssistantAttending',
  props: {
    currentNumber: {
      type: Number,
      default() {
        return -1;
      },
    },
  },
  data() {
    return {
      error: '',
      hasError: false,
    };
  },
  methods: {
    next() {
      axios.get('next')
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


</script>

<style scoped>

.title{
  padding-top: 20vh;
}

.done{
  margin-top: 5vh;
  width: 70%;
}

</style>
