<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ current: number; total: number }>();

const percentage = computed(() => ((props.current) / props.total) * 100);
</script>

<template>
  <div class="progress-container">
    <div class="progress-text">{{ current + 1 }} / {{ total }}</div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: percentage + '%' }"></div>
    </div>
  </div>
</template>

<style scoped>
.progress-container {
  width: 100%;
}
.progress-text {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.4rem;
}
.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #4caf50;
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
