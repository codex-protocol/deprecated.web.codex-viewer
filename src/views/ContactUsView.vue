<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Contact Us" />

        <div class="contact">
          <div>
            <h4>General support</h4>
            <h6>Chat</h6>
            <p>Use the widget at the bottom to chat with one of the team members. We'll respond as fast as possible!</p>

            <h6>Email</h6>
            <p>If you prefer email, our support team can be reached at <a :href="supportHref">support@codexprotocol.com</a>.</p>

            <h6>Twitter</h6>
            <p>Our team is also actively engaged on Twitter <a href="https://twitter.com/codexprotocol" target="_blank">@codexprotocol</a>.</p>
          </div>

          <div>
            <h4>Developers</h4>
            <p>For any development related questions, email our engineers at <a :href="developersHref">developers@codexprotocol.com</a>.</p>
          </div>

          <div>
            <h4>Business inquiries</h4>
            <p>For any business inquiries, our business team can be reached at <a :href="contactHref">contact@codexprotocol.com</a>.</p>
          </div>

          <div>
            <h4>Security disclosures</h4>
            <p>
              Security disclosures can reported to <a :href="disclosuresHref">disclosures@codexprotocol.com</a>.
              We follow the W3C Security Disclosures Best Practices for our disclosure policy. See below.
            </p>

            <p>Codex Labs, Inc:</p>
            <ol>
              <li>Agree not to bring suit against you, recommend law enforcement investigation, or cooperate with law enforcement investigation, if your disclosure meets the criteria listed in this section;</li>
              <li>Request that you give us a reasonable time (usually not to exceed 90 days) before publicly disclosing specific details of the vulnerability;</li>
              <li>Request to be provided an appropriate level of detail on the vulnerability to allow us to identify and reproduce the issue. Detail should include target URLs, request/response pairs, screenshots, and/or other relevant information;</li>
              <li>Agree to confirm, within a reasonable time, receipt of your disclosure (such as 3 days) and the validity of your disclosure (such as 10 days);</li>
              <li>Request that your vulnerability research not create service disruption (e.g. DoS), privacy issues (i.e. accessing a customer’s data), or data destruction, within a reasonable effort.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/core/AppHeader'

export default {

  components: {
    AppHeader,
  },

  data() {
    return {
      supportHref: `mailto:support@codexprotocol.com?subject=${encodeURIComponent('Codex Viewer Support')}`,
      developersHref: `mailto:developers@codexprotocol.com?subject=${encodeURIComponent('Codex Viewer Developer Support')}`,
      contactHref: `mailto:contact@codexprotocol.com?subject=${encodeURIComponent('Codex Protocol Business Inquiry')}`,
      disclosuresHref: `mailto:disclosures@codexprotocol.com?subject=${encodeURIComponent('Codex Viewer Security Disclosure')}`,
    }
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.contact > div
  margin-bottom: 2rem

</style>
