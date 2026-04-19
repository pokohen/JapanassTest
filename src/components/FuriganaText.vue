<script setup lang="ts">
import type { RubySegment } from '../utils/furigana';

defineProps<{ segments: RubySegment[] }>();
</script>

<template>
  <span class="furigana">
    <template v-for="(seg, i) in segments" :key="i">
      <ruby v-if="seg.rt">{{ seg.text }}<rp>(</rp><rt>{{ seg.rt }}</rt><rp>)</rp></ruby>
      <template v-else>{{ seg.text }}</template>
    </template>
  </span>
</template>

<style scoped>
.furigana ruby {
  ruby-position: over;
}
.furigana rt {
  font-size: 0.5em;
  color: #666;
  font-weight: 400;
  letter-spacing: 0;
}
</style>
