<script setup>
import { defineProps, toRefs, defineEmits } from "vue";
const props = defineProps({
  list: Object,
  open: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:open', 'deleteList'])
const { list, open } = toRefs(props)
</script>

<template>
  <dialog :open="open">
    <template v-if="list">
      <article>
        <header>
          <a @click="emit('update:open', false)" aria-label="Close" class="close"></a>
          List Details
        </header>

        <ul>
          <li v-for="movie in list.movies">{{ movie.Title }}</li>
        </ul>
        <button @click="emit('deleteList')">Delete list</button>
      </article>
    </template>
  </dialog>
</template>
