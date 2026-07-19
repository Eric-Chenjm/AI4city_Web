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
  background: #0a1628;
}

.main-content {
  padding-top: var(--navbar-h);
  min-height: calc(100vh - var(--navbar-h));
  min-height: calc(100dvh - var(--navbar-h));
}
</style>
