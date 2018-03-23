<template>
  <div class="container">
    <b-navbar>

    <b-navbar-brand>
      <img src="../assets/logo.svg" />
    </b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <b-nav-form>
        <b-button v-on:click="showModal">{{ buttonName }}</b-button>
      </b-nav-form>
    </b-navbar-nav>

    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'title-viewer-header',
  props: ['buttonName'],
  methods: {
    showModal() {
      this.$emit('showModal');
    },
  },
};
</script>

<style scoped>
</style>
