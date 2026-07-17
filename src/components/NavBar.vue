<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">FUXING ISLAND</span>
      </div>
      <div class="navbar-links">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: $route.path === link.path }"
        >
          {{ link.name }}
        </router-link>
      </div>
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <span class="menu-icon">{{ isMobileMenuOpen ? '✕' : '☰' }}</span>
      </button>
    </div>
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <router-link 
        v-for="link in navLinks" 
        :key="link.path"
        :to="link.path"
        class="mobile-link"
        @click="isMobileMenuOpen = false"
      >
        {{ link.name }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'COMPARE', path: '/above' },
  { name: 'GENERATE', path: '/generate' },
  { name: 'ANALYZE', path: '/analysis' },
  { name: 'METHOD', path: '/method' }
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 22, 40, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(232, 85, 78, 0.2);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  font-family: 'Syncopate', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #e8554e;
  letter-spacing: 3px;
}

.navbar-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #ffffff;
  font-family: 'Syncopate', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #e8554e;
}

.nav-link.active {
  color: #e8554e;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e8554e;
  border-radius: 1px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 24px;
  cursor: pointer;
}

.mobile-menu {
  display: none;
  background: rgba(10, 22, 40, 0.98);
  border-top: 1px solid rgba(232, 85, 78, 0.2);
}

.mobile-link {
  display: block;
  padding: 15px 20px;
  text-decoration: none;
  color: #ffffff;
  font-family: 'Syncopate', sans-serif;
  font-size: 14px;
  letter-spacing: 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-link:hover {
  background: rgba(232, 85, 78, 0.1);
  color: #e8554e;
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .logo-text {
    font-size: 14px;
    letter-spacing: 2px;
  }
}
</style>
