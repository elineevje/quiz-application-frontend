<template>
  <div class="create-quiz-view">
    <navbar-component />
    <div class="content">
      <router-view v-if="!showAddQuestions" />
      <router-view v-else />
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from '/src/components/NavBarComponent.vue';
import { ref } from 'vue';

const showAddQuestions = ref(false);

</script>

<style scoped>
</style>
