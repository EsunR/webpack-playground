<script lang="ts" setup>
import Counter from '@/components/Counter.vue';

defineOptions({
  name: 'App',
});

console.log(__VUE_OPTIONS_API__);
</script>

<template>
  <div class="app-content">
    <h1>This is a vue app</h1>
    <Counter />
  </div>
</template>

<style scoped>
.app-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url('@/static/background.png');
}
</style>
