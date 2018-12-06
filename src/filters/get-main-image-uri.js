import Vue from 'vue'
import missingImage from '../assets/images/missing-image.png'

export default Vue.filter('getMainImageUri', (metadata) => {
  if (
    !metadata ||
    !metadata.mainImage ||
    !metadata.mainImage.uri
  ) {
    return missingImage
  }
  return metadata.mainImage.uri
})
