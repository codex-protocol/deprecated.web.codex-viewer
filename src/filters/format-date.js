import Vue from 'vue'

export default Vue.filter('formatDate', (_date, dateOnly = false) => {

  const date = new Date(_date)

  // this allows us to pass random strings into the filter and have them pass
  //  through (useful when dynamically iterating over keys in
  //  additionalMetadata on the record detail page)
  if (date.toString() === 'Invalid Date') return _date

  return !dateOnly
    ? date.toLocaleString()
    : date.toLocaleDateString()

})
