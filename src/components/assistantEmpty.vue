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
  },
  data() {
    return {
      error: '',
      hasError: false,
    };
  },
  mounted() {
    this.loadData();
    this.loadDataInterval();
  },
  beforeDestroy() {
    clearInterval(this.loadDataInterval);
  },
  methods: {
    loadDataInterval() {
      setInterval(() => {
        this.loadData();
      }, 10000);
    },
    loadData() {
      axios.get('next')
        .then((response) => {
          if (response.data.currentNumber) {
            this.$emit('status', { status: 'waiting', currentNumber: response.data.currentNumber });
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
