<script setup>
import { useFetch } from '@vueuse/core'
import { ref, computed } from 'vue';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const search = "harry potter";
const resultsPerPage = 10;
const currentPage = ref(1);
const totalResults = ref(0);
const movies = ref([]);
const url = computed(() => `http://www.omdbapi.com/?apikey=${API_KEY}&s=${search}&type=movie&page=${currentPage.value}`);
const totalPages = computed(() => {
  if (!totalResults.value) {
    return 1;
  }

  return Math.ceil(totalResults.value / resultsPerPage);
});
const { isFetching, error, data: rawData } = useFetch(url, {
  refetch: true,
  afterFetch(ctx) {
    totalResults.value = parseInt(ctx.data.totalResults, 10);
    movies.value = ctx.data.Search;

    return ctx;
  }
}).json()
const changePage = (event) => {
  currentPage.value = parseInt(event.target.value, 10);
}
</script>

<template>
  <div role="document">
    <template v-if="error">
      Error: {{ error }}
    </template>
    <div v-else-if="isFetching">loading...</div>
    <template v-else>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Release Year</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in movies">
            <td>{{ movie.Title }}</td>
            <td>{{ movie.Year }}</td>
          </tr>
        </tbody>
      </table>
      <div style="display: flex; justify-content: space-between;">
        <div>
          Total of {{ totalResults }} Results
        </div>
        <div>
          Page
          <select @change="changePage" style="display: inline-block; width: auto">
            <option v-for="page in totalPages" :selected="page === currentPage">
              {{ page }}
            </option>
          </select>
          of {{ totalPages }}
        </div>
      </div>
    </template>
  </div>
</template>
