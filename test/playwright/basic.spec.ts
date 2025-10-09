import basicSetup from '../wallet-setup/basic.setup'
import { testWithSynpress } from '@synthetixio/synpress'
import { MetaMask, metaMaskFixtures } from '@synthetixio/synpress/playwright'

const test = testWithSynpress(metaMaskFixtures(basicSetup))
const { expect } = test

test('has title', async ({ page }) => {
  await page.goto('/')

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/TSender/)
})

test("shows the airdrop form when connected, otherwise not", async ({ page, context, metamaskPage,
  extensionId }) => {
  await page.goto('/')
  await expect(page.getByText('Please connect')).toBeVisible()

  const metamask = new MetaMask(context, metamaskPage, basicSetup.walletPassword, extensionId)
  await page.getByTestId('rk-connect-button').click()
  await page.getByTestId('rk-wallet-option-metaMask').waitFor({
    state: 'visible',
    timeout: 30000
  })
  await page.getByTestId('rk-wallet-option-metaMask').click()
  await metamask.connectToDapp()

  // We dont need customNetwork yet but if we want to do cool stuff with the Anvil in the future 
  // this is how we would do it
  const customNetwork = {
    name: 'Anvil',
    rpcUrl: 'http://127.0.0.1:8545',
    chainId: 31337,
    symbol: 'ETH'
  }

  await expect(page.getByText("Token Address")).toBeVisible()
})


