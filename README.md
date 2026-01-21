# USDCx Liquidity Hub

Non-custodial dApp to bridge **USDC (Ethereum)** to **USDCx (Stacks)** and optionally deposit into a **USDCx savings vault** in one flow, built for the _Programming USDCx on Stacks_ hackathon

## What it does

- Connects **Ethereum** + **Stacks** wallets.
- Bridges USDC → USDCx via Circle’s **xReserve** and Stacks attestation flow. [docs.stacks](https://docs.stacks.co/more-guides/bridging-usdcx)
- Lets users:
  - Keep USDCx in their Stacks wallet, or
  - Deposit USDCx into a **vault** that issues shares representing a pro‑rata claim on underlying USDCx.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind (or similar).
- Ethereum: USDC ERC‑20 + xReserve contracts.
- Stacks: USDCx SIP‑010 token + custom Clarity vault contract.

## Core Contracts (Stacks)

- `usdcx-vault.clar`
  - `deposit-usdcx(amount)` → mints vault shares.
  - `withdraw-usdcx(shares)` → burns shares, returns USDCx.
  - View functions for user balances and vault stats.

## Key Flows

1. Connect Ethereum + Stacks wallets.
2. Approve USDC to xReserve.
3. Bridge USDC → USDCx (mint on Stacks after attestation). [circle](https://www.circle.com/blog/usdcx-on-stacks-now-available-via-circle-xreserve)
4. Deposit USDCx into the vault.
5. View and withdraw positions from the Portfolio page.

## Running Locally

```bash
# install deps
pnpm install

# env: RPC URLs, contract addresses, chain IDs
cp .env.example .env

# dev server
pnpm dev
```

Then open `http://localhost:3000` and connect test wallets.
