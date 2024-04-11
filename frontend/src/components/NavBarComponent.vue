<template>
  <nav class="navbar">
    <router-link to="/home">
      <img
        src="../assets/logo.png"
        alt="Logo"
        class="navbar-logo"
        @click="navigateToHome"
      >
    </router-link>
    <ul
      v-if="!showMobileMenu"
      class="navbar-list"
    >
      <li>
        <router-link to="/home">
          <font-awesome-icon
            class="icon"
            icon="house"
          />HOME
        </router-link>
      </li>
      <li>
        <router-link to="/createQuiz">
          <font-awesome-icon
            class="icon"
            icon="plus"
          />CREATE NEW QUIZ
        </router-link>
      </li>
      <li>
        <router-link to="/search">
          <font-awesome-icon
            class="icon"
            icon="magnifying-glass"
          />SEARCH
        </router-link>
      </li>
    </ul>
    <div
      v-if="!showMobileMenu"
      class="navbar-settings-container"
    >
      <font-awesome-icon
        icon="cog"
        class="navbar-settings"
        @click="toggleSettingsDropdown"
      />
      <div
        v-if="showSettingsDropdown"
        ref="dropdownMenu"
        class="dropdown-menu"
      >
        <button @click="handleLogout">
          Log out
        </button>
      </div>
    </div>
    <div
      v-if="isMobileMenuVisible"
      class="hamburger-menu-container"
      @click="toggleMobileMenu"
    >
      <font-awesome-icon
        icon="bars"
        class="hamburger-menu"
      />
    </div>
    <div
      v-if="isMobileMenuVisible"
      ref="mobileDropdownMenu"
      class="mobile-dropdown-menu"
      :style="mobileMenuStyle"
    >
      <router-link
        to="/home"
        @click="toggleMobileMenu"
      >
        <font-awesome-icon
          class="icon"
          icon="home"
        />HOME
      </router-link>
      <router-link
        to="/createQuiz"
        @click="toggleMobileMenu"
      >
        <font-awesome-icon
          class="icon"
          icon="plus"
        />CREATE NEW QUIZ
      </router-link>
      <router-link
        to="/search"
        @click="toggleMobileMenu"
      >
        <font-awesome-icon
          class="icon"
          icon="search"
        />SEARCH
      </router-link>
      <button
        class="mobile-settings-button"
        @click="toggleMobileSettingsDropdown"
      >
        <font-awesome-icon
          icon="cog"
          class="icon"
        />SETTINGS
      </button>
      <div
        v-if="showMobileSettingsDropdown"
        ref="dropdownMenu"
        class="dropdown-menu-mobile"
      >
        <button @click="handleLogout">
          Log out
        </button>
      </div>
    </div>
  </nav>
</template>


<script setup>
import {onMounted, onUnmounted, ref, computed} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '/src/store/userStore';

const showMobileMenu = ref(false);
const showSettingsDropdown = ref(false);
const router = useRouter();
const store = useStore();
const showMobileSettingsDropdown = ref(false);


const toggleSettingsDropdown = () => {
  showSettingsDropdown.value = !showSettingsDropdown.value;
};

const toggleMobileSettingsDropdown = () => {
  showMobileSettingsDropdown.value = !showMobileSettingsDropdown.value;

  if (!showMobileMenu.value || !isMobileMenuVisible.value) {
    showMobileSettingsDropdown.value = false;
  }
};

const handleLogout = () => {
    store.clearToken();
    router.push('/login');
};

const navigateToHome = () => {
  router.push('/');
};

const checkWidth = () => window.innerWidth >= 800;
const isMobileMenuVisible = ref(checkWidth());

const toggleMobileMenu = () => {
  if (showMobileMenu.value) {
    showMobileSettingsDropdown.value = false;
  }

  showMobileMenu.value = !showMobileMenu.value;
};


const handleResize = () => {
  const currentWidthIsMobile = window.innerWidth < 800;
  isMobileMenuVisible.value = currentWidthIsMobile;

  if (!currentWidthIsMobile) {
    showMobileMenu.value = false;
    showMobileSettingsDropdown.value = false;
    showSettingsDropdown.value = false;
  } else {
    showSettingsDropdown.value = false;
  }
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
});

const mobileMenuStyle = computed(() => ({
  maxHeight: showMobileMenu.value ? '500px' : '0',
}));


</script>

<style scoped>
.navbar {
  background-color: #6320EE;
  justify-content: space-between;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  height: 60px;
}

.navbar-logo {
  width: 130px;
  margin-left: -40px;
  cursor: pointer;
  transform: translateY(20px);
}

.navbar-logo img {
  max-height: 100%;
  vertical-align: middle;
}

.navbar-list {
  list-style-type: none;
  padding: 0;
  margin-right: auto;
}

.icon {
  margin-right: 7px;
  font-size: 18px;
  color: white;
  cursor: pointer;
}

.navbar-settings {
  font-size: 30px;
  color: white;
  cursor: pointer;
}

.navbar-list li {
  display: inline;
  margin-right: 40px;
}

.navbar-list li a {
  color: white;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
}

.navbar-list li a:hover {
  text-decoration: underline;
}

.navbar-settings-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: white;
  color: #6320EE;
  border: 1px solid #6320EE;
  z-index: 1;
  border-radius: 8px;
  width: 200px;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px;
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #6320EE;
  border: none;
  background-color: transparent;
  cursor: pointer;
  white-space: nowrap;
}

.dropdown-menu button:hover {
  background-color: #6320EE;
  color: white;
  border-radius: 8px;
  font-weight: bold;
}

@media screen and (max-width: 800px) {
  .navbar-list, .navbar-settings-container {
    display: none;
  }

  .hamburger-menu-container {
    display: block !important;
  }

  .dropdown-menu-mobile {
    position: fixed;
    top: 250px;
    left: 10px;
    background-color: #6320EE;
    border: 1px solid #6320EE;
    z-index: 1;
    border-radius: 8px;
    width: 200px;
    font-size: 18px;
  }
}

.hamburger-menu-container {
  display: block;
  position: absolute;
  right: 20px;
  top: 20px;
}

.mobile-dropdown-menu {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 60px;
  right: 0;
  width: 100%;
  background-color: #6320EE;
  z-index: 100;
  padding: 10px 0;
  border-radius: 20px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s ease-in-out;
}

.mobile-dropdown-menu a,
.mobile-dropdown-menu button {
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: left;
}

.mobile-dropdown-menu button {
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger-menu {
  font-size: 40px;
  color: white;
  cursor: pointer;
}
</style>