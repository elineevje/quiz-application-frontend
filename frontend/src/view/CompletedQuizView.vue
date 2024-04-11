<template>
  <div class="completed-quiz-view">
    <navbar-component />
    <div class="content">
      <CompletedQuizComponent />
    </div>
  </div>
</template>

<script setup>
import CompletedQuizComponent from "/src/components/CompletedQuizComponent.vue";
import NavbarComponent from "/src/components/NavBarComponent.vue";
</script>

<style scoped>

</style>