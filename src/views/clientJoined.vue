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
    <div v-if=" queueData.yourNumber - queueData.current != 0">
      <h3> Faltan: </h3>
      <h1> {{ queueData.yourNumber - queueData.current }} </h1>
    </div>
    <div v-else>
      <h1> Te Toca! </h1>
    </div>
    <h5> Tu número: </h5>
    <h4> {{ queueData.yourNumber }} </h4>
    <div v-if=" queueData.yourNumber - queueData.current > 0">
      <b-button
        block
        variant="danger"
        @click="exitRow"
      >
        Salirse de una fila!
      </b-button>
    </div>
    <div v-else>
      <b-button
        block
        variant="danger"
        disabled
        @click="exitRow"
      >
        Salirse de una fila!
      </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientJoined',
  props: {
    queue: {
      type: Object,
      default() {
        return {
          name: '__error__',
          yourNumber: 10,
          current: 1,
          done: true,
        };
      },
    },
  },
  data() {
    return {
      error: '',
      hasError: false,
      queueData: this.queue,
    };
  },
  mounted() {
    this.loadData();
  },
  beforeDestroy() {
    clearInterval(this.loadData);
  },
  methods: {
    loadData() {
      setInterval(() => {
        axios.get('mock')
          .then((response) => {
            this.queueData = response.data;
            this.hasError = false;
            this.checkExit();
          })
          .catch((error) => {
            this.error = error;
            this.hasError = true;
          });
      }, 10000);
    },
    exitRow() {
      axios.delete('mock')
        .then(() => {
          this.$router.replace('/');
        })
        .catch((error) => {
          this.error = error;
          this.hasError = true;
        });
    },
    checkExit() {
      if (this.queueData.done) {
        this.exitRow();
      }
    },
  },
};


</script>

<style scoped>

</style>
