<template>
  <div class="container mb-3">
    <b-navbar>

    <b-navbar-brand>
      <img src="../assets/logo.svg" />
    </b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <b-nav-form>
        <b-button v-b-modal.createTitleModal>Create title</b-button>
      </b-nav-form>
    </b-navbar-nav>

    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'app-header',
}
</script>

<style scoped>
.container {
  padding-bottom: 8px;
  border-bottom: 1px solid lightgray;
}
</style>
