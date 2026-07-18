<template>
  <div class="app-container">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #0b1320;
}

.main-content {
  padding-top: 80px;
  min-height: calc(100vh - 80px);
}
</style>
