# Welcome to Jeff's Airdrop Token Sender!

This project is to learn how to build a fullstack web application that uses an ERC20 smart contract to use a token contract address and airdrop the token to multiple recipients.

A 100% client-side UI for the TSender contract.

- [TSender UI](#tsender-ui)
- [Getting Started](#getting-started)
    - [Requirements](#requirements)
        - [Environment Variables](#environment-variables)
    - [Setup](#setup)
- [Testing](#testing)
    - [Unit](#unit)
    - [e2e](#e2e)
- [Contributing](#contributing)

# Getting Started

## Requirements

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

```bash
pnpm cache
```

Then run:

```bash
pnpm test:e2e
```

This will throw an error like:

```
Error: Cache for 08a20e3c7fc77e6ae298 does not exist. Create it first!
```

The `08a20e3c7fc77e6ae298` is your `CACHE_NAME`

In your `.cache-synpress` folder, rename the folder that isn't `metamask-chrome-***` to your `CACHE_NAME`.

Then, you should be able to run:

```
pnpm test:e2e
```

Then hit the play button and the playwright tests should work

<!-- # Install from scratch notes

When adding Tailwind, remember to remove `supports-color` -->

<!-- Testing: -->
<!-- -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths -->
