'use client';

import CopyText from '@/components/CopyText';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AccountContext from '@/context/AccountContext';
import { RgbLdkService } from '@/lib/rgbsdk/service';
import type {
  LightningNodeAddress,
  LightningNodeBalances,
  LightningNodeInfo,
} from '@/lib/rgbsdk/ILightning';
import { formatAddress } from '@/lib/utils';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Checkbox } from '@/components/ui/checkbox';
import { ALICE_LND_CONFIG, BOB_LND_CONFIG } from '@/lib/config';

export default function Home() {
  const { account, selectNode, reset } = useContext(AccountContext)!;
  const [info, setInfo] = useState<LightningNodeInfo | null>(null);
  const [balance, setBalance] = useState<LightningNodeBalances | null>(null);
  const [address, setAddress] = useState<LightningNodeAddress | null>(null);
  const [node, setNode] = useState(ALICE_LND_CONFIG.name);
  const [proxyApi, setProxyApi] = useState(true);

  const nodeList = [ALICE_LND_CONFIG, BOB_LND_CONFIG];

  const refreshBalance = async () => {
    if (!account) return;

    try {
      const service = new RgbLdkService(account);
      const balance = await service.getBalances();
      setBalance(balance);
      toast.success('Balance refreshed');
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInfo = async () => {
    if (!account) return;

    try {
      const service = new RgbLdkService(account);
      const info = await service.getInfo();
      const balance = await service.getBalances();
      const address = await service.getNewAddress();
      setInfo(info);
      setBalance(balance);
      setAddress(address);
    } catch (e) {
      toast.error((e as Error).message);
      console.error(e);
    }
  };

  const connect = () => {
    const config = nodeList.find((n) => n.name === node);
    if (!config) {
      toast.error('Invalid node selected');
      return;
    }

    const nodeConfig = {
      ...config,
      proxy: proxyApi ? '/api/proxy' : '',
    };

    selectNode(nodeConfig);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInfo();
  }, [account]);

  return (
    <div className='flex justify-center mt-8'>
      <Card className='w-full max-w-xl'>
        <CardHeader>
          <CardTitle>Select a node</CardTitle>
        </CardHeader>
        <CardContent>
          {account ? (
            <div className='leading-10'>
              <div className='flex justify-between'>
                <b>name</b>
                <span>{info?.alias}</span>
              </div>
              <div className='flex justify-between'>
                <b>blockHeight</b>
                <span>{info?.blockHeight}</span>
              </div>
              <div className='flex justify-between'>
                <b>pubkey</b>
                <div>
                  <span>{formatAddress(info?.pubkey)}</span>
                  <CopyText text={info?.pubkey || ''} />
                </div>
              </div>
              <div className='flex justify-between'>
                <b>rpcUrl</b>
                <div>
                  <span>{formatAddress(info?.rpcUrl)}</span>
                  <CopyText text={info?.rpcUrl || ''} />
                </div>
              </div>
              <div className='flex justify-between'>
                <b>wallet address</b>
                <div>
                  <span>{formatAddress(address?.address)}</span>
                  <CopyText text={address?.address || ''} />
                </div>
              </div>
              <div className='flex justify-between'>
                <b>Balance</b>
                <div className='text-right'>
                  <p>total: {balance?.total}</p>
                  <p>confirmed: {balance?.confirmed}</p>
                  <p>unconfirmed: {balance?.unconfirmed}</p>
                </div>
              </div>
              <div className='flex items-center justify-end gap-2'>
                <Button onClick={refreshBalance} variant='outline' size='sm'>
                  Refresh balance
                </Button>
                <Link href='/bitcoin'>
                  <Button size='sm'>Deposit</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <NativeSelect
                className='w-full'
                onChange={(e) => setNode(e.target.value)}
                value={node}
              >
                {nodeList.map((node) => (
                  <NativeSelectOption key={node.name} value={node.name}>
                    {node.name.split(':')[0]}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <div className='flex gap-2 items-center mt-4'>
                <Checkbox
                  id='proxy'
                  checked={proxyApi}
                  onCheckedChange={(v) => {
                    setProxyApi(v as boolean);
                  }}
                />
                <label htmlFor='proxy'>Proxy API Request</label>
              </div>
              <div className='text-xs mt-2 text-muted-foreground'>
                This Proxy API request is required only due to issues with CORS
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {account ? (
            <Button className='w-full' onClick={reset}>
              Switch Node
            </Button>
          ) : (
            <Button className='w-full' onClick={connect}>
              Connect
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
