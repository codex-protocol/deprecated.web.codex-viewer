<template>
  <div>
    <app-header title="Coming soon" />
    <b-card-group deck>
      <div class="feature-card" v-for="feature in features" :key="feature.title">
        <b-card
          :title="feature.title"
          :img-src="feature.image"
          img-top
        >
          <p class="card-text">{{ feature.description }}</p>
        </b-card>
      </div>
    </b-card-group>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader'

import toshi from '../assets/images/features/toshi.png'

export default {
  name: 'features-view',
  components: {
    AppHeader,
  },
  data() {
    return {
      features: [
        {
          title: 'Live Auctioneers',
          description: 'Automatically fill your collection with pieces purchased online from LiveAuctioneers.com',
          image: '',
          url: 'https://liveauctioneers.com',
        },
        {
          title: 'Value My Stuff',
          description: 'Get appraisals for individual pieces or for your entire collection',
          image: '',
          url: 'https://valuemystuff.com',
        },
        {
          title: 'Auction Mobility',
          description: 'Automatically fill your collection with pieces purchased online from auction houses using Auction Mobility software',
          image: '',
          url: 'https://auctionmobility.com',
        },
        {
          title: 'Maecenas',
          description: 'Democratize your collection',
          image: '',
          url: 'https://www.maecenas.co/',
        },
        {
          title: 'The Clarion List',
          description: 'Discover top rated art service companies',
          image: '',
          url: 'https://www.clarionlist.com/',
        },
        {
          title: 'Mobile experience',
          description: 'Site optimized for mobile dapp browsers like Cipher & Toshi',
          image: toshi,
        },
        {
          title: 'Hardware wallets',
          description: 'Authenticate to the viewer with hardware wallets like Ledger',
          image: '',
        },
        {
          title: 'Identity management',
          description: 'Manage your art collection without having to learn the complexities of the blockchain technology behind the platform',
          image: '',
        },
      ],
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.feature-card
  width: 25%
  max-width: 32rem
  margin-bottom: 2em
  font-weight: bold
  color: $color-dark

.card-title
  color: $color-dark

.card
  align-items: center

.card-img-top
  width: auto
  margin-top: 1rem
</style>
