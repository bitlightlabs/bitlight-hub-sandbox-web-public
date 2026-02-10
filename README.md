## Notice

Due to cross-domain restrictions, all RPC requests from the frontend need to be proxied on the backend. Refer to the files in the `src/app/api` directory.

## Usage

1. Start container

```shell
cd test

docker compose -f compose.yaml up -d
```

2. Create wallet (Only need to create it once, and the wallet that has been saved will be used for subsequent restarts)

```shell
docker exec bitcoind bitcoin-cli -regtest \
  -rpcuser=btcuser \
  -rpcpassword=btcpass \
  createwallet "devwallet"
```

3. Start web project

```
npm run dev
```
