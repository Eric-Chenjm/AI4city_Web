<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <img class="logo-icon" src="../assets/dcd19cd3718b.png" alt="Logo" />
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

      <!-- 语言切换按钮 -->
      <button class="lang-toggle" @click="toggleLang" :title="currentLang === 'en' ? 'Switch to Chinese' : '切换英文'">
        <span class="lang-option" :class="{ 'lang-active': currentLang === 'zh' }">中</span>
        <span class="lang-divider">|</span>
        <span class="lang-option" :class="{ 'lang-active': currentLang === 'en' }">EN</span>
      </button>

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
import { useLang } from '../composables/useLang.js'

const { toggleLang, currentLang } = useLang()

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
  border-bottom: 1px solid rgba(0, 91, 172, 0.2);
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
  gap: 15px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: invert(1);
  mix-blend-mode: screen;
}

.logo-text {
  font-family: 'Syncopate', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #005BAC;
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
  color: #005BAC;
}

.nav-link.active {
  color: #005BAC;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  right: 0;
  height: 2px;
  background: #005BAC;
  border-radius: 1px;
}

/* ── 语言切换按钮 ───────────────────────────────── */
.lang-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 91, 172, 0.08);
  border: 1px solid rgba(0, 91, 172, 0.35);
  border-radius: 20px;
  padding: 5px 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-left: 10px;
}

.lang-toggle:hover {
  background: rgba(0, 91, 172, 0.2);
  border-color: rgba(0, 91, 172, 0.7);
}

.lang-option {
  font-family: 'Syncopate', 'Outfit', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.25s ease;
  user-select: none;
}

.lang-option.lang-active {
  color: #36c8ff;
}

.lang-divider {
  color: rgba(255, 255, 255, 0.2);
  font-size: 11px;
  user-select: none;
}

/* ── Mobile ─────────────────────────────────────── */
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
  border-top: 1px solid rgba(0, 91, 172, 0.2);
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
  background: rgba(0, 91, 172, 0.1);
  color: #005BAC;
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

  .lang-toggle {
    padding: 4px 10px;
  }
}
</style>
