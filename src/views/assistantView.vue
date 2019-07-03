<template>
  <div class="main">
    <div v-if="status == 'notLoggedIn'">
      <AssistantLogin @status="updateStatus" />
    </div>
    <div v-if="status == 'notStarted'">
      <AssistantStart @status="updateStatus" />
    </div>
    <div v-if="status == 'arrived'">
      <AssistantAttending
        :current-number="currentNumber"
        :client-id="clientId"
        :client="client"
        :attended="attended"
        :line-id="lineId"
        @status="updateStatus"
      />
    </div>
    <div v-if="status == 'waiting' && currentNumber">
      <AssistantWaiting
        :current-number="currentNumber"
        :client-id="clientId"
        :client="client"
        :attended="attended"
        :line-id="lineId"
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
import AssistantLogin from '@/components/assistantLogin.vue';
import AssistantWaiting from '@/components/assistantWaiting.vue';

export default {
  name: 'AssistantView',
  components: {
    AssistantEmpty,
    AssistantAttending,
    AssistantStart,
    AssistantLogin,
    AssistantWaiting,
  },
  data() {
    return {
      error: '',
      hasError: false,
      status: 'notLoggedIn',
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
