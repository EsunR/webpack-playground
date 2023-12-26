<script lang="ts" setup>
import { ref } from 'vue';
defineOptions({
  name: 'Counter',
});

const count = ref(0);

const addCount = (num: number) => {
  count.value += num;
};
</script>

<template>
  <div class="counter">
    <div class="counter__text">Count value: {{ count }}</div>
    <div class="counter__btn-area">
      <button @click="addCount(1)">+</button>
      <button @click="addCount(-1)">-</button>
    </div>
  </div>
</template>

<style scoped>
.counter {
  .counter__text {
    text-align: center;
  }

  .counter__btn-area {
    button {
      margin: 0 4px;
      width: 50px;
    }
  }
}
</style>
