<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ current: number; total: number }>();

const percentage = computed(() => ((props.current) / props.total) * 100);
</script>

<template>
  <div class="progress-container">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
    </div>
    <span class="progress-text">{{ current + 1 }}/{{ total }}</span>
  </div>
</template>

<style scoped>
.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.progress-bar {
  flex: 1;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #222;
  border-radius: 3px;
  transition: width 0.3s ease;
}
.progress-text {
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
