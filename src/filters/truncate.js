import Vue from 'vue'

export default Vue.filter('truncate', (string, length = 500) => {
  return (string || '').length > length
    ? `${string.substr(0, length)}...`
    : string
})
