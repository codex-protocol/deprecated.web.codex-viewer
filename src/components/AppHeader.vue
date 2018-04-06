<template>
  <div class="container">
    <b-navbar>

    <b-navbar-brand>
      <img src="../assets/logo.svg" />
    </b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <b-nav-form>
        <b-button class="mr-3" v-if="showBack" @click="goHome">My titles</b-button>
        <b-button v-b-modal.createTitleModal>Create title</b-button>
      </b-nav-form>
    </b-navbar-nav>

    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'app-header',
  props: ['showBack'],
  methods: {
    goHome() {
      this.$router.push({ path: '/my-titles' })
    },
  },
  computed: {
  },
}
</script>

<style scoped>
</style>
