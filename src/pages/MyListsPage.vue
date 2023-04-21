<script setup>
import { useExtraMovieData } from '@/composables/useExtraMovieData';

const { MyLists } = useExtraMovieData();
const movieLists = Object.entries(MyLists.ref.value).map(([name, movies]) => ({ name, movies }));
</script>

<template>
  <div>
    <h1>My Lists</h1>
    <template v-if="!movieLists || movieLists.length === 0">
      No lists created yet.
    </template>
    <table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th>Movie Count</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="list in movieLists" :key="list.name">
          <td>{{ list.name }}</td>
          <td>{{ list.movies.length }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
