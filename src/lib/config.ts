export const BITCOIN_CONFIG = {
  host: process.env.NEXT_PUBLIC_BITCOIN_HOST || '',
  username: process.env.NEXT_PUBLIC_BITCOIN_USER || '',
  password: process.env.NEXT_PUBLIC_BITCOIN_PASSWORD || '',
  wallet: process.env.NEXT_PUBLIC_BITCOIN_WALLET || ''
}

export const ALICE_LND_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_NODE_ALICE_HOST || '',
  token: '',
  name: process.env.NEXT_PUBLIC_NODE_ALICE_NAME || '',
  network: process.env.NEXT_PUBLIC_NODE_NETWORK || '',
  proxy: process.env.NEXT_PUBLIC_NODE_API_PROXY || ''
}

export const BOB_LND_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_NODE_BOB_HOST || '',
  token: '',
  name: process.env.NEXT_PUBLIC_NODE_BOB_NAME || '',
  network: process.env.NEXT_PUBLIC_NODE_NETWORK || '',
  proxy: process.env.NEXT_PUBLIC_NODE_API_PROXY || ''
}

