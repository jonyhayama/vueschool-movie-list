<script setup>
import { useFetch, refDebounced } from '@vueuse/core'
import { ref, computed } from 'vue';
import MovieModal from "@/components/MovieModal.vue";

const FIRST_MOVIE_RELEASE_YEAR = 1888;
const CURRENT_YEAR = new Date().getFullYear();
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const searchInput = ref("");
const search = refDebounced(searchInput, 500);
const yearInput = ref("");
const year = refDebounced(yearInput, 500);
const resultsPerPage = 10;
const currentPage = ref(1);
const totalResults = ref(0);
const movies = ref([]);
const modalValue = ref(false);
const selectedMovie = ref(null);

const openMovieModal = (movie) => {
  selectedMovie.value = movie;
  modalValue.value = true;
}
const handleAddRating = (rating) => {
  const { imdbID } = selectedMovie.value;
  if (!movieRatings.value[imdbID]) {
    movieRatings.value[imdbID] = [rating];
  } else {
    movieRatings.value[imdbID].push(rating)
  }
  movies.value = movies.value.map(movie => (imdbID === movie.imdbID) ? { ...movie, rating: getMovieRating(imdbID) } : movie)
  modalValue.value = false;
}

const movieRatings = ref({
  "tt1201607": [3],
  "tt0241527": [0],
  "tt0295297": [1, 2, 3]
})
const getMovieRating = (imdbID) => {
  const ratings = movieRatings.value[imdbID];

  if (!ratings || ratings.length === 0) {
    return null;
  }

  return ratings.reduce((acc, i) => acc + i, 0) / ratings.length;
}

const url = computed(() => `http://www.omdbapi.com/?apikey=${API_KEY}&s=${search.value}&type=movie&page=${currentPage.value}&y=${year.value}`);
const totalPages = computed(() => {
  if (!totalResults.value) {
    return 1;
  }

  return Math.ceil(totalResults.value / resultsPerPage);
});
const looksLikeMovieYear = computed(() => {
  const val = parseInt(year.value, 10);
  return FIRST_MOVIE_RELEASE_YEAR <= val && val <= CURRENT_YEAR;
})
const validRequest = computed(() => {
  if (search.value.length < 5) {
    return false;
  }

  if (year.value.length > 0 && !looksLikeMovieYear.value) {
    return false;
  }

  return true;
})
const { isFetching, error, data: rawData } = useFetch(url, {
  refetch: true,
  beforeFetch({ options, cancel }) {
    if (!validRequest.value) {
      cancel();
    }

    return {
      options
    }
  },
  afterFetch(ctx) {
    totalResults.value = parseInt(ctx.data.totalResults, 10);
    movies.value = ctx.data.Search.map(movie => ({
      ...movie,
      rating: getMovieRating(movie.imdbID)
    }));

    return ctx;
  }
}).json()
const changePage = (event) => {
  currentPage.value = parseInt(event.target.value, 10);
}
</script>

<template>
  <div role="document">
    <div class="grid">
      <div>
        <input type="search" class="title-input" placeholder="Search a Movie by title..." v-model="searchInput"
          :aria-busy="isFetching">
      </div>
      <div>
        <input type="number" class="release-year-input" :min="FIRST_MOVIE_RELEASE_YEAR" :max="CURRENT_YEAR"
          placeholder="Release Year" v-model="yearInput" :aria-busy="isFetching">
      </div>
    </div>
    <template v-if="error || rawData?.Error">
      Error: {{ error || rawData?.Error }}
    </template>
    <div v-else-if="isFetching">loading...</div>
    <template v-if="!validRequest">
      <template v-if="search.length < 5">
        Please type at leaset 5 characters to search.
      </template>
      <template v-if="year.length > 1 && !looksLikeMovieYear(year)">
        Please type a valid release year (from {{ FIRST_MOVIE_RELEASE_YEAR }} to {{ CURRENT_YEAR }})
      </template>
    </template>
    <template v-else>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Release Year</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in movies" @click="openMovieModal(movie)">
            <td>{{ movie.Title }}</td>
            <td>{{ movie.Year }}</td>
            <td>{{ movie.rating ?? 'not rated' }}</td>
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
  <MovieModal :movie="selectedMovie" v-model:open="modalValue" @addRating="handleAddRating" />
</template>

<style lang="scss" scoped>
.release-year-input {
  border-radius: 5em;
}

@media screen and (min-width: 992px) {
  .grid {
    grid-template-columns: 3fr 1fr;
    grid-column-gap: 0;
  }

  .title-input {
    border-radius: 5em 0 0 5em !important;
  }

  .release-year-input {
    border-radius: 0 5em 5em 0;
  }
}
</style>
