import Vue from 'vue'
import titleCase from 'title-case'

export default Vue.filter('titleCase', (value) => {
  return titleCase(value)
})
