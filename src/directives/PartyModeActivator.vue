<script>

import Vue from 'vue'

export default Vue.directive('party-mode-activator', {

  bind: ($element) => {

    let clickCount = 0
    let timeoutId = null
    let isPartyModeActivated = false

    $element.addEventListener('click', () => {

      clickCount += 1
      clearTimeout(timeoutId)

      if (clickCount === 10) {

        clickCount = 0
        isPartyModeActivated = !isPartyModeActivated

        const $explicitTargets = document.querySelectorAll('[party-mode-target]')
        const $targets = $explicitTargets.length > 0 ? $explicitTargets : [document.body]

        if (isPartyModeActivated) {
          $targets.forEach(($target) => {
            $target.classList.add('party-mode')
          })
        } else {
          $targets.forEach(($target) => {
            $target.classList.remove('party-mode')
          })
        }

      } else {
        timeoutId = setTimeout(() => {
          clickCount = 0
        }, 500)
      }

    })

  },

})

</script>

<style lang="stylus">

@import "../assets/variables.styl"

.party-mode
  animation: party-mode 500ms linear 0s infinite

@keyframes party-mode
  0%
    filter: hue-rotate(0deg)

  100%
    filter: hue-rotate(360deg)

</style>
