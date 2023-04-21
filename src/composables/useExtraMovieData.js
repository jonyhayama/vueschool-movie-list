import { useStorage } from '@vueuse/core'

const properties = {
  "Ratings": {},
  "Reviews": {}
};
const propertiesKeys = Object.keys(properties);

class ExtraMovieData {
  constructor(key) {
    this.ref = useStorage(`movie-list/movie${key}`, properties[key]);
  }

  add(imdbID, value) {
    if (!this.ref.value[imdbID]) {
      this.ref.value[imdbID] = [value];
    } else {
      this.ref.value[imdbID].push(value)
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
