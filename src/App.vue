<!-- <script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { getViaggi } from './api/viaggi'
import { onMounted } from 'vue';

onMounted(async () => {
  const viaggi = await getViaggi()
})
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style> -->

<script setup lang="ts">
</script>

<template>
  <div class="layout">
    <header class="header">
      <h1>Il nostro mondo 🌍💖</h1>
      <nav>
        <router-link to="/viaggi">Mappa</router-link>
      </nav>
    </header>

    <main class="content">
      <router-view />
    </main>

    <footer class="footer">
      <small>Creato con amore ✨</small>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  padding: 1rem 2rem;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  flex: 1;
  padding: 2rem;
}

.footer {
  text-align: center;
  padding: 1rem;
  background: #f1f1f1;
}
</style>
