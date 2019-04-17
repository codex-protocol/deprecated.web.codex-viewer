export default {

  // Page Actions
  'events:resend-confirmation-email': {
    category: 'Page Action',
    action: 'Resend Confirmation Email',
  },
  'events:forgot-password-request': {
    category: 'Page Action',
    action: 'Forgot Password Request',
  },
  'events:click-extension-feature': {
    category: 'Page Action',
    action: 'Click Extension Feature',
  },
  'events:codx-package-purchase': {
    category: 'Page Action',
    action: 'CODX Package Purchase',
  },
  'events:referral-survey-answered': {
    category: 'Page Action',
    action: 'Referral Survey Answered',
  },
  'events:claim-record-request': {
    category: 'Page Action',
    action: 'Claim Record Request',
  },

  // Codex Records
  'events:record-metadata-create': {
    category: 'Codex Record',
    action: 'Metadata Create',
  },
  'events:record-transfer-approve': {
    category: 'Codex Record',
    action: 'Approve',
  },
  'events:record-transfer-cancel': {
    category: 'Codex Record',
    action: 'Cancel Transfer',
  },
  'events:record-transfer': {
    category: 'Codex Record',
    action: 'Transfer',
  },

  // Blockchain
  'events:approve-contract': {
    category: 'Blockchain',
    action: 'Approve Contract',
  },
  'events:faucet-drip-request': {
    category: 'Blockchain',
    action: 'Faucet Drip Request',
  },
  'events:stake-tokens': {
    category: 'Blockchain',
    action: 'Stake Tokens',
  },
  'events:unstake-tokens': {
    category: 'Blockchain',
    action: 'Unstake Tokens',
  },
}
