<script setup>
import { useFetch, refDebounced } from '@vueuse/core'
import { ref, computed } from 'vue';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const searchInput = ref("");
const search = refDebounced(searchInput, 500);
const resultsPerPage = 10;
const currentPage = ref(1);
const totalResults = ref(0);
const movies = ref([]);
const url = computed(() => `http://www.omdbapi.com/?apikey=${API_KEY}&s=${search.value}&type=movie&page=${currentPage.value}`);
const totalPages = computed(() => {
  if (!totalResults.value) {
    return 1;
  }

  return Math.ceil(totalResults.value / resultsPerPage);
});
const { isFetching, error, data: rawData } = useFetch(url, {
  refetch: true,
  beforeFetch({ options, cancel }) {
    if (search.value.length < 5) {
      cancel();
    }

    return {
      options
    }
  },
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
    <input type="search" placeholder="Search a Movie..." v-model="searchInput" :aria-busy="isFetching">
    <template v-if="error || rawData?.Error">
      Error: {{ error || rawData?.Error }}
    </template>
    <div v-else-if="isFetching">loading...</div>
    <template v-if="search.length > 1 && search.length < 5">
      Please type at leaset 5 characters to search.
    </template>
    <template v-else-if="search">
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
