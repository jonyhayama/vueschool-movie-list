<script setup>
import { ref, computed } from "vue";
import { useExtraMovieData } from '@/composables/useExtraMovieData';
import MyListModal from "../components/MyListModal.vue";

const { MyLists } = useExtraMovieData();
const newListName = ref("");
const createListForm = ref(null);
const modalValue = ref(false);
const selectedList = ref(null);

const openListModal = (list) => {
  selectedList.value = list;
  modalValue.value = true;
}

const movieLists = computed(() => Object.entries(MyLists.ref.value || {}).map(([name, movies]) => ({ name, movies })));
const createList = () => {
  if (Object.keys(MyLists.ref.value).includes(newListName.value)) {
    alert(`List ${newListName.value} already exists`);
    return;
  }

  MyLists.add(newListName.value);
  newListName.value = "";
  createListForm.value.removeAttribute('open')
}

const deleteList = () => {
  if (confirm('are you sure?')) {
    MyLists.remove(selectedList.value.name);
    modalValue.value = false;
  }
}

const removeFromList = (movie) => {
  if (confirm('are you sure?')) {
    const index = MyLists.ref.value[selectedList.value.name].findIndex(m => m.imdbID === movie.imdbID);
    MyLists.remove(selectedList.value.name, index);
    modalValue.value = false;
  }
}
</script>

<template>
  <div>
    <h1>My Lists</h1>
    <details ref="createListForm">
      <summary>Create List</summary>
      <input type="text" v-model="newListName" />
      <button @click="createList">Save</button>
    </details>
    <template v-if="movieLists.length === 0">
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
        <tr v-for="list in movieLists" :key="list.name" @click="openListModal(list)">
          <td>{{ list.name }}</td>
          <td>{{ list.movies.length }}</td>
        </tr>
      </tbody>
    </table>
    <MyListModal :list="selectedList" v-model:open="modalValue" @deleteList="deleteList"
      @removeFromList="removeFromList" />
  </div>
</template>
