export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function waitFor<T>(
    predicate: () => Promise<T>,
    interval = 1000,
    timeout = 60000,
): Promise<T> {
    const start = Date.now();
    while (true) {
        try {
            return await predicate();
        } catch (error) {
            if (Date.now() - start > timeout) {
                throw new Error(`Timeout after ${timeout}ms: ${error instanceof Error ? error.message : String(error)}`);
            }
            await delay(interval);
        }
    }
}
