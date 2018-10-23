<!-- Based on https://vuejs.org/v2/cookbook/editable-svg-icons.html -->
<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="icons[iconName].viewBox"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <g :fill="iconColor">
      <component :is="icons[iconName].component" />
    </g>
  </svg>
</template>

<script>
// @NOTE: Although this is cleaner code-wise, it means that we are now bundling all the svg icons even if they aren't being used
// For now, I'm commenting out ones we aren't using explicitly to reduce the bundle size

// import IconPathChrome from './IconPathChrome'
import IconPathCoinbaseWallet from './IconPathCoinbaseWallet'
import IconPathFacebook from './IconPathFacebook'
// import IconPathFirefox from './IconPathFirefox'
import IconPathGitHub from './IconPathGitHub'
import IconPathGoogle from './IconPathGoogle'
import IconPathMedium from './IconPathMedium'
import IconPathMenu from './IconPathMenu'
import IconPathMetaMask from './IconPathMetaMask'
import IconPathMicrosoft from './IconPathMicrosoft'
// import IconPathOpera from './IconPathOpera'
import IconPathTelegram from './IconPathTelegram'
import IconPathTwitter from './IconPathTwitter'

export default {
  props: {
    iconName: {
      type: String,
    },
    width: {
      type: [Number, String],
      default: 18,
    },
    height: {
      type: [Number, String],
      default: 18,
    },
    iconColor: {
      type: String,
      default: 'currentColor',
    },
  },

  data() {
    const icons = {
      // chrome: {
      //   viewBox: '0 0 496 512',
      //   component: IconPathChrome,
      // },
      coinbaseWallet: {
        viewBox: '0 0 32 32',
        component: IconPathCoinbaseWallet,
      },
      facebook: {
        viewBox: '0 0 448 512',
        component: IconPathFacebook,
      },
      // firefox: {
      //   viewBox: '0 0 480 512',
      //   component: IconPathFirefox,
      // },
      gitHub: {
        viewBox: '0 0 496 512',
        component: IconPathGitHub,
      },
      google: {
        viewBox: '0 0 488 512',
        component: IconPathGoogle,
      },
      medium: {
        viewBox: '0 0 512 512',
        component: IconPathMedium,
      },
      menu: {
        viewBox: '0 0 448 512',
        component: IconPathMenu,
      },
      metaMask: {
        viewBox: '0 0 24 24',
        component: IconPathMetaMask,
      },
      microsoft: {
        viewBox: '0 0 448 512',
        component: IconPathMicrosoft,
      },
      // opera: {
      //   viewBox: '0 0 496 512',
      //   component: IconPathOpera,
      // },
      telegram: {
        viewBox: '0 0 496 512',
        component: IconPathTelegram,
      },
      twitter: {
        viewBox: '0 0 512 512',
        component: IconPathTwitter,
      },
    }

    return {
      icons,
    }
  },
}
</script>
