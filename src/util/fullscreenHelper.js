export default {

  browserSupportsFullscreen: (
    typeof document.body.requestFullscreen === 'function' ||
    typeof document.body.mozRequestFullScreen === 'function' ||
    typeof document.body.webkitRequestFullScreen === 'function'
  ),

  requestFullscreen($element) {

    if (!this.browserSupportsFullscreen) return false

    if (typeof $element.requestFullscreen === 'function') {
      $element.requestFullscreen()
    } else if (typeof $element.mozRequestFullScreen === 'function') {
      $element.mozRequestFullScreen()
    } else if (typeof $element.webkitRequestFullScreen === 'function') {
      $element.webkitRequestFullScreen()
    }

    return true

  },

  exitFullscreen() {
    if (!this.browserSupportsFullscreen || !document.fullscreenElement) return false

    if (typeof document.exitFullscreen === 'function') {
      document.exitFullscreen()
    } else if (typeof document.mozExitFullScreen === 'function') {
      document.mozExitFullScreen()
    } else if (typeof document.webkitExitFullScreen === 'function') {
      document.webkitExitFullScreen()
    }

    return true

  },
}
