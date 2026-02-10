import { BITCOIN_CONFIG } from "@/lib/config";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const method = body.method as string;
    const params = body.params as unknown[];
    
    if(!method || !params) {
      return new Response(`Invalid params.`, { status: 500 });
    }

    let url = BITCOIN_CONFIG.host;
    if(method === 'getbalance') {
      url = BITCOIN_CONFIG.host + `/wallet/${BITCOIN_CONFIG.wallet}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${BITCOIN_CONFIG.username}:${BITCOIN_CONFIG.password}`).toString('base64')
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'frontend',
        method,
        params
      })
    });

    return new Response(res.body, {
      status: res.status,
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 500 });
  }
}
