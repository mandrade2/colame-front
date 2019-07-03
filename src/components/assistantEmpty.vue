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
    <div>
      <h1> Fila vacía! </h1>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AssistantEmpty',
  props: {
    currentNumber: {
      type: Number,
      default() {
        return -1;
      },
    },
    lineId: {
      type: String,
      default() {
        return '00';
      },
    },
  },
  data() {
    return {
      error: '',
      hasError: false,
      interval: 0,
    };
  },
  mounted() {
    this.loadData();
    this.loadDataInterval();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  methods: {
    loadDataInterval() {
      this.interval = setInterval(() => {
        this.loadData();
      }, 10000);
    },
    loadData() {
      axios.patch('http://127.0.0.1:3000/line/5d0e4e71a68a2c2d983cbb62', {})
        .then((response) => {
          if (response.data._id) {
            clearInterval(this.interval);
            this.$emit('status', {
              status: 'waiting', currentNumber: response.data.number, clientId: response.data._id, lineId: this.lineId,
            });
          }
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

h1 {
  padding-top: 25vh;
  font-size: 450%;
}

</style>
