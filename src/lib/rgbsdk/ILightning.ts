export interface LightningNode {
    /** Current network */
    network: string;
    /** Docker container name or IP address used for P2P connections */
    name: string;
    /** URL of the node's REST API endpoint */
    baseUrl: string;
    /** Authorization token */
    token?: string;
}
export interface RgbLdkNode extends LightningNode {
    proxy?: string;
}

export interface LightningNodeInfo {
  pubkey: string;
  alias: string;
  syncedToChain: boolean;
  blockHeight: number;
  numPendingChannels: number;
  numActiveChannels: number;
  numInactiveChannels: number;
  rpcUrl: string;
}

export interface LightningNodeChannelAsset {
  id: string;
  name: string;
  groupKey?: string;
  capacity: string;
  localBalance: string;
  remoteBalance: string;
  decimals: number;
}

export interface LightningNodeBalances {
  total: string;
  confirmed: string;
  unconfirmed: string;
}

export interface LightningNodeAddress {
  address: string;
}

export interface LightningNodeChannel {
  pending: boolean;
  uniqueId: string;
  channelPoint: string;
  pubkey: string;
  capacity: string;
  localBalance: string;
  remoteBalance: string;
  status:
    | 'Open'
    | 'Opening'
    | 'Closing'
    | 'Force Closing'
    | 'Waiting to Close'
    | 'Closed'
    | 'Error';
  isPrivate: boolean;
  assets?: LightningNodeChannelAsset[];
  userChannelId: string;
}

export interface LightningNodePeer {
  pubkey: string;
  address: string;
}

export interface LightningNodeChannelPoint {
  txid: string;
  index: number;
}

export interface OpenChannelOptions {
  toRpcUrl: string;
  amount: string;
  isPrivate: boolean;
}

export interface LightningNodePayReceipt {
  preimage: string;
  amount: number;
  destination: string;
}

export interface LightningNodePaymentRequest {
  paymentHash: string;
  amountMsat: string;
  expiry: string;
}

export interface LightningNodeChannelEvent {
  type: 'Open' | 'Pending' | 'Closed' | 'Unknown';
}

export interface ILightning {
  /**
   * Wait node ready to accept requests
   */
  waitUntilOnline(interval: number, timeout: number): Promise<void>;

  /**
   * Get node info
   */
  getInfo(): Promise<LightningNodeInfo>;

  /**
   * Get balances
   */
  getBalances(): Promise<LightningNodeBalances>;

  /**
   * Generate a new address
   */
  getNewAddress(): Promise<LightningNodeAddress>;

  /**
   * List peers
   */
  getPeers(): Promise<LightningNodePeer[]>;

  /**
   * Connect to peers
   */
  connectPeers(rpcUrls: string[]): Promise<void>;

  /**
   * List channels
   */
  getChannels(): Promise<LightningNodeChannel[]>;

  /**
   * Open a channel
   */
  openChannel(options: OpenChannelOptions): Promise<LightningNodeChannelPoint>;

  /**
   * Is channel ready for use
   */
  isChannelReady(channelId: string): Promise<boolean>;

  /**
   * Close a channel
   *
   * @param {string} channelPoint Value of `funding_txid:output_index`
   */
  closeChannel(channelPoint: string): Promise<unknown>;

  /**
   * Create a `BOLT11` invoice
   */
  createInvoice(
    amount: number,
    memo?: string,
    assetInfo?: { nodeId: string; scid: string; msats: string },
  ): Promise<string>;

  /**
   * Pay a `BOLT11` invoice
   */
  payInvoice(
    invoice: string,
    amount?: number,
  ): Promise<LightningNodePayReceipt>;

  /**
   * Decode a `BOLT11` invoice
   */
  decodeInvoice(invoice: string): Promise<LightningNodePaymentRequest>;

  /**
   * Remove listener from node
   */
  removeListener(): Promise<void>;

  /**
   * Subscribe to channel events
   */
  subscribeChannelEvents(
    callback: (event: LightningNodeChannelEvent) => void,
  ): Promise<void>;
}
