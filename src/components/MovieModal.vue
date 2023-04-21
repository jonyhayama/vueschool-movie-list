<script setup>
import { defineProps, toRefs, defineEmits, ref } from "vue";
const props = defineProps({
  movie: Object,
  open: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:open'])

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
      </article>
    </template>
  </dialog>
</template>
