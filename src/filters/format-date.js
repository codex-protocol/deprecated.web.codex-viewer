import Vue from 'vue'

export default Vue.filter('formatDate', (_date, dateOnly = false) => {

  const date = new Date(_date)

  // since we can always be confident that the API will return ISO 8601 strings,
  //  this allows us to pass random strings into the filter and have them pass
  //  through (useful when dynamically iterating over keys in
  //  additionalMetadata on the record detail page)
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)Z?$/.test(_date)) return _date

  return !dateOnly
    ? date.toLocaleString()
    : date.toLocaleDateString()

})
