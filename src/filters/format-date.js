import Vue from 'vue'

export default Vue.filter('formatDate', (_date, dateOnly = false) => {

  const date = new Date(_date)

  return !dateOnly
    ? date.toLocaleString()
    : date.toLocaleDateString()

})
