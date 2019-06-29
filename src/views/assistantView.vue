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
        :clientId = "clientId"
        :client = "client"
        :attended = "attended"
        :lineId = "lineId"
        @status="updateStatus"
      />
    </div>
    <div v-if="status == 'waiting' && currentNumber">
      <AssistantWaiting
        :currentNumber="currentNumber"
        :clientId = "clientId"
        :client = "client"
        :attended = "attended"
        :lineId = "lineId"
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
      status: 'notStarted',
      currentNumber: -1,
      clientId: -1,
      interval: 0,
      client: false,
      attended: null,
      lineId: null,
    };
  },
  methods: {
    updateStatus(value) {
      this.status = value.status;
      this.currentNumber = value.currentNumber;
      this.clientId = value.clientId;
      this.attended = value.attended;
      this.client = value.client;
      this.lineId = value.lineId;
    },
  },
};


</script>

<style scoped>

</style>
