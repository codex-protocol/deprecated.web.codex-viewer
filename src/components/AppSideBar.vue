<template>
  <nav>
    <div class="image-container">
      <img src="../assets/logo.svg" />
    </div>
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
  position: fixed;
  top: 0;
  left: 0;
  background-color: #09091F;
  color: #ffffff;
  padding-top: 2em;
  border-right: 2px solid #09091F;
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

.image-container {
  width: 100%;
  padding: 2em 1em;
  background-color: white;
}
</style>
