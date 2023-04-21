<script setup>
import { defineProps, toRefs, defineEmits, ref } from "vue";
const props = defineProps({
  movie: Object,
  open: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:open', 'addRating'])

const { movie, open } = toRefs(props)

const rating = ref(5);
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
        <details>
          <summary>Add Rating</summary>
          <select v-model="rating">
            <option v-for="i in 5" :key="i" :value="i">{{ i }}</option>
          </select>
          <button @click="emit('addRating', rating)">Save</button>
        </details>
      </article>
    </template>
  </dialog>
</template>
