<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <nav class="container-fluid">
    <ul>
      <li>
        <RouterLink to="/" class="contrast"><strong>Movie List</strong></RouterLink>
      </li>
    </ul>
    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/about">About</RouterLink></li>
    </ul>
  </nav>

  <main class="container">
    <RouterView />
  </main>
</template>
