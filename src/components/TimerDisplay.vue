<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ remaining: number }>();

const display = computed(() => {
  const min = Math.floor(props.remaining / 60);
  const sec = props.remaining % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
});

const urgency = computed(() => {
  if (props.remaining <= 60) return 'urgent';
  if (props.remaining <= 300) return 'warning';
  return 'normal';
});
</script>

<template>
  <div class="timer" :class="urgency">
    ⏱ {{ display }}
  </div>
</template>

<style scoped>
.timer {
  font-size: 1.5rem;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-align: center;
}
.normal { color: #333; background: #e8f5e9; }
.warning { color: #e65100; background: #fff3e0; }
.urgent { color: #c62828; background: #ffebee; animation: pulse 1s infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
