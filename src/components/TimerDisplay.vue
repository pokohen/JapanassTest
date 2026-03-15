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
    {{ display }}
  </div>
</template>

<style scoped>
.timer {
  font-size: 0.9rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}
.normal { color: #333; background: #eee; }
.warning { color: #e65100; background: #fff3e0; }
.urgent { color: #c62828; background: #ffebee; animation: pulse 1s infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
