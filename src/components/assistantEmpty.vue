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
    attendant: {
      type: Object,
      default() {
        return {};
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
      console.log(this.lineId);
      axios.patch(`http://127.0.0.1:3000/line/${this.lineId}`, {})
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
