import Vue from 'vue'
import escapeHtml from 'escape-html'

export default Vue.filter('escapeHtml', (text) => {

  if (typeof text !== 'string') {
    return text
  }

  return escapeHtml(text)

    // replace urls with hyperlinks
    //  @NOTE: URL regex copied from is.js@0.9.0 with ^ and $
    //  removed so the entire string isn't matched against and a capture
    //  group added around the whole regex
    //  (see: https://github.com/arasatasaygin/is.js/blob/56294950656ba58f940248510cdf3e45af357a1e/is.js#L347)
    .replace(/((?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?)/ig, '<a href="$1" target="_blank">$1</a>')

    // replace newlines with break tags
    .replace(/\n/g, '<br>')

})
