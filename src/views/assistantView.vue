<template>
  <div
    class="main"
  >
    <div v-if="status == 'notStarted'">
      <AssistantStart @status="updateStatus" />
    </div>
    <div v-if="status == 'arrived'">
      <AssistantAttending
        :currentNumber="currentNumber"
        @status="updateStatus"
      />
    </div>
    <div v-if="status == 'waiting' && currentNumber">
      <AssistantWaiting
        :currentNumber="currentNumber"
        @status="updateStatus"
      />
    </div>
    <div v-if="status == 'waiting' && !currentNumber">
      <AssistantEmpty @status="updateStatus" />
    </div>
  </div>
</template>

<script>
import AssistantEmpty from '@/components/assistantEmpty.vue';
import AssistantAttending from '@/components/assistantAttending.vue';
import AssistantStart from '@/components/assistantStart.vue';
import AssistantWaiting from '@/components/assistantWaiting.vue';

export default {
  name: 'AssistantView',
  components: {
    AssistantEmpty,
    AssistantAttending,
    AssistantStart,
    AssistantWaiting,
  },
  data() {
    return {
      error: '',
      hasError: false,
      status: 'arrived',
      currentNumber: 2,
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
    updateStatus(value) {
      this.status = value.status;
      this.currentNumber = value.currentNumber;
    },
  },
};


</script>

<style scoped>

</style>
