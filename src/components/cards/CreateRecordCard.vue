<template>
  <b-card>
    <h2>Welcome</h2>
    <p>Use the <b>Add New Asset</b> button to create your first Codex Record!</p>
    <p>Codex Records can be used to...</p>
    <ul class="mb-4">
      <li>Create a digital token of any physical asset</li>
      <li>Store provenance digitally</li>
    </ul>
  </b-card>
</template>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.card
  card()
  width: 100%

  .card-body
    background-color: transparent

    ul
      padding-left: 1rem
      list-style-position: inside

    li
      margin-bottom: 1rem

</style>
