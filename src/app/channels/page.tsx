'use client'

import { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AccountContext from '@/context/AccountContext';
import { RgbLdkService } from '@/lib/rgbsdk/service';
import type { LightningNodeChannel } from '@/lib/rgbsdk/ILightning';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { bitcoinMime } from '@/lib/utils';
import { toast } from 'sonner';

export default function ChannelsPage() {
  const [posting, setPosting] = useState(false);
  const { account } = useContext(AccountContext)!;
  const [list, setList] = useState<LightningNodeChannel[]>([]);
  const [showModal, setShowModal] = useState(false);

  const loadList = async () => {
    if(!account) return
    
    try {
      const list = await new RgbLdkService(account).getChannels()
      setList(list)
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadList()
  }, [account])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const toRpcUrl = data.get('toRpcUrl') as string
    const amount = data.get('amount') as string
    const isPrivate = data.get('isPrivate') === 'on'

    if(!toRpcUrl || !amount) return
    if(!account) return

    try {
      setPosting(true)

      // Connect
      await new RgbLdkService(account).openChannel({toRpcUrl, amount, isPrivate})
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mine blocks to confirm
      await bitcoinMime(5)

      setShowModal(false)
      loadList()
    } catch(e) {} finally {
      setPosting(false)
    }
  }

  const closeChannel = async (item: LightningNodeChannel) => {
    if(!account) return

    try {
      setPosting(true)
      await new RgbLdkService(account).closeChannel(item.channelPoint)
      await new Promise(resolve => setTimeout(resolve, 1000))

      await bitcoinMime(6)

      toast.success("Channel closed")
      loadList()
    } catch(e) {
      console.error(e)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="p-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Channels</h1>
        <Button onClick={() => setShowModal(true)}>
          New Channel
        </Button>
      </div>
      <Table className='border'>
        <TableHeader>
          <TableRow>
            <TableHead >ID</TableHead>
            <TableHead >channelPoint</TableHead>
            <TableHead >pubkey</TableHead>
            <TableHead >capacity</TableHead>
            <TableHead >localBalance</TableHead>
            <TableHead >remoteBalance</TableHead>
            <TableHead >status</TableHead>
            <TableHead >isPrivate</TableHead>
            <TableHead className='sticky right-0 bg-background'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.map((item) => (
            <TableRow key={item.userChannelId}>
              <TableCell >{item.userChannelId}</TableCell>
              <TableCell >{item.channelPoint}</TableCell>
              <TableCell >{item.pubkey}</TableCell>
              <TableCell >{item.capacity}</TableCell>
              <TableCell >{item.localBalance}</TableCell>
              <TableCell >{item.remoteBalance}</TableCell>
              <TableCell >{item.status}</TableCell>
              <TableCell >{item.isPrivate ? 'Yes' : 'No'}</TableCell>
              <TableCell className='sticky right-0 bg-background'>
                <Button disabled={posting} size="sm" onClick={() => closeChannel(item)}>Close Channel</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showModal ? (
        <Dialog open onOpenChange={() => setShowModal(false)}>
          <DialogContent>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>New Channel</DialogTitle>
              </DialogHeader>
            
              <div>
                <label className='block'>To</label>
                <Input
                  type="text"
                  name="toRpcUrl"
                  placeholder="RPC URL"
                />
              </div>
              <div>
                <label className='block'>Amount</label>
                <Input
                  type="text"
                  name="amount"
                  placeholder="Amount in sats"
                />
              </div>
              <div>
                <label className='block'>Is Private</label>
                <Checkbox name='isPrivate' />
              </div>
            
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button disabled={posting} type="submit">Open Channel</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
