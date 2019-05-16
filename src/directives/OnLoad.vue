<script>

import Vue from 'vue'

// when using @load on an img tag, vue doesn't seem to de-register the event
//  handlers when the parent component is destroyed... this simple directive
//  makes sure the event listeners are cleaned up
export default Vue.directive('on-load', {
  bind: ($element, binding) => {
    if (typeof binding.value !== 'function') return
    $element.addEventListener('load', binding.value)

  },
  unbind: ($element, binding) => {
    if (typeof binding.value !== 'function') return
    $element.removeEventListener('load', binding.value)
  },
})

</script>
