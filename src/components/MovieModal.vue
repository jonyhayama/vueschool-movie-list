<script setup>
import { defineProps, toRefs, defineEmits, ref, watch, computed } from "vue";
import { useExtraMovieData } from "../composables/useExtraMovieData";
const props = defineProps({
  movie: Object,
  open: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:open', 'addRating', 'addReview'])

const { movie, open } = toRefs(props)

const { MyLists } = useExtraMovieData();
const movieLists = computed(() => Object.keys(MyLists.ref.value || {}));
const rating = ref(5);
const review = ref("");
const selectedListIndex = ref(0)
const addToList = () => {
  const list = movieLists.value[selectedListIndex.value];
  if (MyLists.ref.value[list].find(m => m.imdbID === movie.value.imdbID)) {
    alert('The movie is already on that list');
    return;
  }

  MyLists.add(list, movie.value);
  alert('Added successfully');
}

// when modal is opened, reset values
watch(open, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    rating.value = 5;
    review.value = "";
  }
})
</script>

<template>
  <dialog :open="open">
    <template v-if="movie">
      <article>
        <header>
          <a @click="emit('update:open', false)" aria-label="Close" class="close"></a>
          Movie Details
        </header>
        <p><strong>{{ movie.Title }}</strong></p>
        <p>Released on {{ movie.Year }}</p>
        <p>IMDB id {{ movie.imdbID }}</p>
        <p>Rating: {{ movie.rating ?? 'not rated' }}</p>
        <p>Reviews:</p>
        <div v-if="!movie.reviews">
          No reviews yet
        </div>
        <template v-else>
          <div v-for="(review, index) in movie.reviews" :key="index">
            {{ review }}
          </div>
        </template>

        <hr />

        <details>
          <summary>Add Rating</summary>
          <select v-model="rating">
            <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
          </select>
          <button @click="emit('addRating', rating)">Save</button>
        </details>
        <details>
          <summary>Add Review</summary>
          <textarea v-model="review"></textarea>
          <button @click="emit('addReview', review)">Save</button>
        </details>
        <details v-if="movieLists.length > 0">
          <summary>Add to List</summary>
          <select v-model="selectedListIndex">
            <option v-for="(name, index) in movieLists" :key="index" :value="index">{{ name }}</option>
          </select>
          <button @click="addToList">Save</button>
        </details>
      </article>
    </template>
  </dialog>
</template>
