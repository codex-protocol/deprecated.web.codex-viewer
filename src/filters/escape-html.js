import Vue from 'vue'
import escapeHtml from 'escape-html'

export default Vue.filter('escapeHtml', (text) => {

  if (typeof text !== 'string') {
    return text
  }

  return escapeHtml(text)

    // replace urls with hyperlinks
    //
    // @NOTE: to reduce code bloat, this url regex was just copied out of the
    //  linkify-urls npm package source
    //
    // see: https://github.com/sindresorhus/linkify-urls/blob/7f6bff7112112e78040f26b220db5dfe3cd72ac8/index.js#L5
    .replace(/((?<!\+)(?:https?(?::\/\/))(?:www\.)?(?:[a-zA-Z\d-_.]+(?:(?:\.|@)[a-zA-Z\d]{2,})|localhost)(?:(?:[-a-zA-Z\d:%_+.~#!?&//=@]*)(?:[,](?![\s]))*)*)/g, '<a href="$1" target="_blank">$1</a>')

    // replace newlines with break tags
    .replace(/\n/g, '<br>')

})
