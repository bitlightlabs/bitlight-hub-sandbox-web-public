import axios, { type AxiosInstance } from 'axios';
import type { RgbLdkNode } from './ILightning';

function getClient(node: RgbLdkNode): AxiosInstance {
    return axios.create({
        baseURL: node.baseUrl,
        headers: {
            Authorization: `Bearer ${node.token}`,
            'Content-Type': 'application/json',
        },
    });
}

export async function httpGet<T>(node: RgbLdkNode, path: string): Promise<T> {
    const client = getClient(node);
    try {
        const proxy = node.proxy;
        if(proxy) {
            client.defaults.baseURL = '/';
        }

        const response = await client.get<T>(proxy ? `${proxy}?api=${node.baseUrl + path}` : path);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const message = error.response?.data?.message || error.response?.data?.error || error.message;
        throw new Error(`GET ${path} failed: ${message}`);
    }
}

export async function httpPost<T>(
    node: RgbLdkNode,
    path: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: any,
): Promise<T> {
    const client = getClient(node);
    try {
        const proxy = node.proxy;
        if(proxy) {
            client.defaults.baseURL = '/';
        }

        const response = await client.post<T>(proxy ? `${proxy}?api=${node.baseUrl + path}` : path, body);
        return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        const message = error.response?.data?.message || error.response?.data?.error || error.message;
        throw new Error(`POST ${path} failed: ${message}`);
    }
}
