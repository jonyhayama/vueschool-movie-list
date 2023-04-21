<script setup>
import { defineProps, toRefs, defineEmits } from "vue";
const props = defineProps({
  list: Object,
  open: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:open', 'deleteList', 'removeFromList'])
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

        <table>
          <tbody>
            <tr v-for="movie in list.movies">
              <td>{{ movie.Title }}</td>
              <td><button style="padding: 5px; width: auto; margin: 0"
                  @click="emit('removeFromList', movie)">Remove</button></td>
            </tr>
          </tbody>
        </table>
        <button @click="emit('deleteList')">Delete list</button>
      </article>
    </template>
  </dialog>
</template>
