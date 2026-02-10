import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string | undefined, show = 20): string {
  if (!address) {
    return '';
  }

  const len = address.length;
  if (len <= show) {
    return address;
  }

  return address.substring(0, show - 4) + '...' + address.substring(len - 4);
}

export async function bitcoinMime(blocks: number) {
  const addressRes = await fetch('/api/bitcoin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'getnewaddress',
      params: []
    })
  })
  const addressData = await addressRes.json();
  const address = addressData.result;

  await fetch('/api/bitcoin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'generatetoaddress',
      params: [blocks, address]
    })
  });
}
