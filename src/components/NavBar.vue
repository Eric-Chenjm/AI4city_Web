<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <img class="logo-icon" src="../assets/dcd19cd3718b.png" alt="Logo" />
        <span class="logo-text">INNOVATION GRAVITY FIELD</span>
      </div>
      <div class="lang-switch">
        <button
          class="lang-btn"
          :class="{ active: locale === 'en' }"
          @click="locale = 'en'; localStorage.setItem('locale', 'en')"
        >EN</button>
        <button
          class="lang-btn"
          :class="{ active: locale === 'zh' }"
          @click="locale = 'zh'; localStorage.setItem('locale', 'zh')"
        >中</button>
      </div>
      <div class="navbar-links">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          class="nav-link"
          :class="{ active: $route.path === link.path }"
        >
          {{ $t(link.nameKey) }}
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
        {{ $t(link.nameKey) }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const isMobileMenuOpen = ref(false)

const navLinks = [
  { nameKey: 'nav.compare', path: '/above' },
  { nameKey: 'nav.generate', path: '/generate' },
  { nameKey: 'nav.analyze', path: '/analysis' },
  { nameKey: 'nav.method', path: '/method' }
]

const toggleLocale = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
  localStorage.setItem('locale', locale.value)
}

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

.lang-switch {
  display: flex;
  gap: 0;
  border: 1px solid rgba(0, 91, 172, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.lang-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 1px;
}

.lang-btn:hover {
  color: #ffffff;
  background: rgba(0, 91, 172, 0.1);
}

.lang-btn.active {
  color: #ffffff;
  background: #005BAC;
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

  .lang-switch {
    order: 1;
    margin-left: auto;
    margin-right: 10px;
  }

  .lang-btn {
    font-size: 10px;
    padding: 3px 6px;
  }
}
</style>
