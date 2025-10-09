# Welcome to Jeff's Airdrop Token Sender!

This project is to learn how to build a fullstack web3 application that uses a ERC20 smart contract to airdrop any ERC20 Token contract address to airdrop tokens to multiple recipients.

A 100% client-side UI for the TSender contract.

# Getting Started

## Requirements

- [foundry](https://getfoundry.sh/)
    - Follow the instructions on how to install foundry on the website and run foundryup
- [node](https://nodejs.org/en/download)
    - You'll know you've installed it right if you can run `node --version` and get a response like `v23.0.1`
- [pnpm](https://pnpm.io/)
    - You'll know you've installed it right if you can run `pnpm --version` and get a response like `10.1.0`
- [git](https://git-scm.com/downloads)
    - You'll know you've installed it right if you can run `git --version` and get a response like `git version 2.33.0`

## Setup

```bash
git clone https://github.com/matcherbudz/TSender-airdrop-ui-cu
cd TSender-airdrop-ui-cu
pnpm install
pnpm anvil
```
### Environment Variables
Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2
You can get a projectId at https://cloud.reown.com/ or if that doesn't work search how to get a WalletConnect Cloud projectId

You'll need to add a `.env.local` to the main directory and the following environment variable

NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

You can either add it in vscode or through the terminal
First make sure you're in the ~/TSender-airdrop-ui-cu directory
```bash
touch .env.local
nano .env.local
# Now add `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here`
```

You'll want to make sure you have a Metamask/Rabby wallet and add the Anvil network in cutsom networks using the rpc url http://127.0.0.1:8545, chain id 31337, and symbol ETH. Then add the first two, three, or all anvil accounts using their private addresses.
Mock Token address `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

Then, in a second terminal run:

```bash
pnpm run dev
```

# Testing

## Unit

```bash
pnpm test:unit
```

## e2e

Playwright should also install the browsers needed to run tests.

To test e2e, do the following
Right now synpress has a "gimmicky" feature where we will have to change the name of a folder to get it working but until this changes this is how you do it. 
If you run synpress before creating the cache and renaming the folder in .cache-synpress

It will throw an error like:

```
Error: Cache for 08a20e3c7fc77e6ae298 does not exist. Create it first!
```
To edit in the terminal
```bash
pnpm synpress
cd .cache-synpress
ls
```
You will see a folder named something like 532f685e346606c2a803 rename it to 08a20e3c7fc77e6ae298

```bash
mv 532f685e346606c2a803 08a20e3c7fc77e6ae298
```
Then, you should be able to run:

```
pnpm test:e2e
```

Then hit the play button and the playwright tests should work. Testing that the page has the right title, then testing that when connected it shows the airdrop form with Token Contract Address, and when not connected it shows the page without the airdrop form. 

<!-- # Install from scratch notes

When adding Tailwind, remember to remove `supports-color` -->

<!-- Testing: -->
<!-- -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths -->
