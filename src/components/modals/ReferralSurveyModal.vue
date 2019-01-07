<template>
  <b-modal
    title="Quick Survey"
    id="referralSurveyModal"

    @ok="submit"
    ok-title="Submit"
    :ok-disabled="!selectedOptionId"

    visible
    ok-only
    no-close-on-esc
    hide-header-close
    no-close-on-backdrop
  >

    <b-form
      class="referral-survey"
      @submit.prevent="submit"
    >
      <label for="referral">
        How did you hear about us?
      </label>
      <b-form-select
        class="mb-3"
        value-field="id"
        id="referral"
        text-field="name"
        @input="referralChanged"
        v-model="selectedOptionId"
        :options="randomizedOptions"
      />
      <b-form-textarea
        :rows="3"
        class="mb-3"
        ref="details"
        v-model="details"
        :placeholder="selectedReferralSurveyOption.detailsPrompt + ' (Optional)'"
        v-if="selectedReferralSurveyOption && selectedReferralSurveyOption.detailsPrompt"
      />

    </b-form>

  </b-modal>
</template>

<script>

import { mapState } from 'vuex'

import EventBus from '../../util/eventBus'

export default {

  data() {
    return {
      details: null,
      selectedOptionId: null,
    }
  },

  computed: {
    ...mapState('app', ['referralSurveyOptions']),

    // randomize the order of survey options, but keep "other" as the last one
    //
    // @NOTE: this also adds the "select an option..." placeholder
    randomizedOptions() {

      const shuffledOptions = this.referralSurveyOptions.filter((option) => {
        return option.id !== 'other'
      })

      const otherOption = this.referralSurveyOptions.find((option) => {
        return option.id === 'other'
      })

      // do the Fisher-Yates shuffle! ᕕ( ᐛ )ᕗ
      for (let index = shuffledOptions.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(Math.random() * (index + 1))
        ;[shuffledOptions[index], shuffledOptions[swapIndex]] = [shuffledOptions[swapIndex], shuffledOptions[index]]
      }

      return [
        { id: null, name: 'Select an option...' },
        ...shuffledOptions,
        otherOption,
      ]

    },

    selectedReferralSurveyOption() {
      return this.referralSurveyOptions.find((referralSurveyOption) => {
        return referralSurveyOption.id === this.selectedOptionId
      })
    },
  },

  methods: {

    referralChanged() {

      if (!this.selectedReferralSurveyOption || this.selectedReferralSurveyOption.id === null) return

      if (this.selectedReferralSurveyOption.detailsPrompt) {
        this.$nextTick(() => {
          this.$refs.details.$el.focus()
        })
      }

    },

    submit() {

      if (!this.selectedReferralSurveyOption || this.selectedReferralSurveyOption.id === null) return

      const referralSurveyData = {
        details: this.details,
        referralSurveyOptionId: this.selectedReferralSurveyOption.id,
      }

      this.$store.dispatch('auth/UPDATE_REFERRAL_SURVEY', referralSurveyData)
        .catch((error) => {
          // do nothing since this isn't a crucial action
        })
        .finally(() => {
          EventBus.$emit('toast:success', 'Survey answer saved. Thanks for your input!')
        })

    },

  },
}
</script>
