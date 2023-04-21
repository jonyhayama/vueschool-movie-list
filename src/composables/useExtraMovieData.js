import { useStorage } from '@vueuse/core'

const properties = {
  "Ratings": {},
  "Reviews": {},
  "MyLists": {}
};
const propertiesKeys = Object.keys(properties);

class ExtraMovieData {
  constructor(key) {
    this.ref = useStorage(`movie-list/movie${key}`, properties[key]);
  }

  add(imdbID, value) {
    if (!this.ref.value[imdbID]) {
      this.ref.value[imdbID] = [];
    }

    if (value !== undefined) {
      this.ref.value[imdbID].push(value)
    }
  }

  remove(imdbID, index) {
    if (index === undefined) {
      delete this.ref.value[imdbID];
    } else {
      this.ref.value[imdbID].splice(index, 1);
    }
  }
}

export const useExtraMovieData = () => {
  propertiesKeys.forEach(key => {
    properties[key] = new ExtraMovieData(key);
  });

  return {
    ...properties
  }
}
