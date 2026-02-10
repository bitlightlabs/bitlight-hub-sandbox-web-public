import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const api = searchParams.get('api');
    if(!api) {
      return new Response(`Invalid API.`, { status: 500 });
    }

    const res = await fetch(api, {
      method: 'GET',
      headers: new Headers({
        'Authorization': request.headers.get('authorization') || '',
      }),
      cache: 'no-store',
    });
    return new Response(res.body);
  } catch (e) {
    return new Response((e as Error).message, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const api = searchParams.get('api');
    if(!api) {
      return new Response(`Invalid API.`, { status: 500 });
    }

    const body = await request.json();
    const res = await fetch(api, {
      method: 'POST',
      headers: new Headers({
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });
    return new Response(res.body, {
      status: res.status,
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 500 });
  }
}
