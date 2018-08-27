// Adding some buffer, because the estimation is not perfect when using CodexRecordProxy
// @TODO: This needs to be more finely tuned. For some actions only 10k buffer is needed, and for others 50k+ is needed
const gasBuffer = 100000

// @TODO: Pull from ethgasstation instead
const recommendedGasPriceInGwei = 10

function callContract(func, args, account, instance) {
  return func.estimateGas(
    ...args,
    { from: account }
  )
    .then((estimatedGas) => {
      return func(
        ...args,
        {
          from: account,
          gas: estimatedGas + gasBuffer,
          gasPrice: instance.toWei(recommendedGasPriceInGwei, 'gwei'),
        }
      )
    })
}

export default callContract
