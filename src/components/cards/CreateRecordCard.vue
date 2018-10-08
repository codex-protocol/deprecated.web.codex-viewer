<template>
  <div class="faucet-card">
    <b-card no-body>
      <div class="faucet-card-body">
        <h2>Welcome</h2>
        <p>Use the <b>Add New Asset</b> button to create your first Codex Record!</p>
        <p>Codex Records can be used to...</p>
        <ul class="mb-4">
          <li>Create a digital token of any physical asset</li>
          <li>Store provenance digitally</li>
        </ul>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'CreateRecordCard',
}
</script>

<style lang="stylus" scoped>
@import "../../assets/variables.styl"

.faucet-card
  card()
  width: 100%
  min-width: 320px

.card
  height: 100%
  border: none
  background-color: rgba(white, .1)

.faucet-card-body
  flex: 1
  text-align: left
  padding: 1.25rem 1.25rem 0

  ul
    list-style-position: inside
    padding-left: 1rem

  li
    margin-bottom: 1rem

</style>
