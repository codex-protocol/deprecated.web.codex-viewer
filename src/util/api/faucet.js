import { getApi } from './helpers'

export default {
  getDripFromFaucet: () => {
    return getApi('/user/faucet')
  },
}
