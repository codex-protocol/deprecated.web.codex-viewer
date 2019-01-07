const category = 'Codex Viewer'

const actionsLabels = {

  // Confirmation Email
  'events:resend-confirmation-email-dialog': {
    action: 'Click',
    label: 'Resend Confirmation Email',
  },

  // Records
  'events:record-metadata-create': {
    action: 'Web3',
    label: 'Record Metadata Create',
  },
  'events:record-transfer': {
    action: 'Web3',
    label: 'Record Transfer',
  },
  'events:accept-transfer': {
    action: 'Web3',
    label: 'Accept Transfer',
  },
  'events:cancel-transfer': {
    action: 'Web3',
    label: 'Cancel Transfer',
  },

  // Manage Tokens
  'events:approve-contract': {
    action: 'Web3',
    label: 'Approve Contract',
  },
  'events:faucet-drip-request': {
    action: 'Web3',
    label: 'Faucet Drip Request',
  },
  'events:stake-tokens': {
    action: 'Web3',
    label: 'Stake Tokens',
  },
  'events:unstake-tokens': {
    action: 'Web3',
    label: 'Unstake Tokens',
  },

  // Coming Soon
  'events:click-partner-link': {
    action: 'Click',
    label: 'Partner Link',
  },

  // Get CODX
  'events:codx-package-purchase': {
    action: 'Click',
    label: 'CODX Package Purchase',
  },
}

export { category, actionsLabels }
