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
      <h3> Esperando número: </h3>
      <h1> {{ currentNumber }} </h1>
    </div>
    <div>
      <b-button
        class="arrived"
        variant="light"
        @click="arrived"
      >
        Llegó
      </b-button>
    </div>
    <div>
      <b-button
        class="notArrived"
        variant="danger"
        @click="notArrived"
      >
        No Llegó
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AssistantWaiting',
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
    notArrived() {
      axios.patch('notArrive', { currentNumber: this.currentNumber })
        .then((response) => {
          this.$emit('status', { status: 'waiting', currentNumber: response.data.currentNumber });
          this.currentNumber = response.data.currentNumber;
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    arrived() {
      axios.patch('arrive', { currentNumber: this.currentNumber })
        .then((response) => {
          this.$emit('status', { status: 'arrived', currentNumber: response.data.currentNumber });
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

.arrived{
  margin-top: 5vh;
  width: 70%;
}
.notArrived{
  margin-top: 1vh;
  width: 70%;
}

</style>

<style scoped>

</style>
