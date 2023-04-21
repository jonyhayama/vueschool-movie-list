import { useStorage } from '@vueuse/core'

const properties = {
  "Ratings": {},
  "Reviews": {}
};
const propertiesKeys = Object.keys(properties);

export const useExtraMovieData = () => {
  propertiesKeys.forEach(key => {
    properties[key] = useStorage(`movie-list/movie${key}`, properties[key]);
  });

  return {
    ...properties
  }
}
