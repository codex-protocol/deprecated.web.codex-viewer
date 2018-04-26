<template>
  <nav>
    <b-link to="/">Codex Viewer</b-link>
    <b-link to="/my-titles">Wallet</b-link>
    <b-link to="/my-transfers">Transfers</b-link>
    <b-link to="/my-offers">Offers</b-link>
  </nav>
</template>

<script>
export default {
  name: 'app-side-bar',

}
</script>

<style scoped>
nav {
  height: 100%;
  width: 240px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #09091F;
  color: #ffffff;
  padding-top: 2em;
}

a {
  padding: 1em;
  padding-left: 2em;
  color: #ffffff;
  display: block;
  font-weight: bold;
  box-sizing: border-box;
}

a:hover {
  text-decoration: none;
  background-color: #5f697a;
}
</style>
