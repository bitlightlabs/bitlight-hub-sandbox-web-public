'use client'

import { useContext, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AccountContext from '@/context/AccountContext';
import { RgbLdkService } from '@/lib/rgbsdk/service';
import type { LightningNodePeer } from '@/lib/rgbsdk/ILightning';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function PeersPage() {
  const { account } = useContext(AccountContext)!;
  const [peers, setPeers] = useState<LightningNodePeer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [rpc, setRpc] = useState('');

  const loadList = async () => {
    if(!account) return
    
    try {
      const list = await new RgbLdkService(account).getPeers()
      setPeers(list)
    } catch(e) {
      console.error(e)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadList()
  }, [])

  const connect = async () => {
    try {
      if(!account) return

      await new RgbLdkService(account).connectPeers([rpc])
      setShowModal(false)
      setRpc('')
      loadList()
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Peers</h1>
        <Button onClick={() => setShowModal(true)}>
          Connect New Peer
        </Button>
      </div>
      <Table className='border'>
        <TableHeader>
          <TableRow>
            <TableHead >Pubkey</TableHead>
            <TableHead >Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {peers.map((peer, idx) => (
            <TableRow key={idx}>
              <TableCell >{peer.pubkey}</TableCell>
              <TableCell >{peer.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showModal ? (
        <Dialog open onOpenChange={() => setShowModal(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Peer</DialogTitle>
            </DialogHeader>
            <div>
              <Input
                type="text"
                placeholder="RPC URL"
                value={rpc}
                onChange={e => setRpc(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={connect}>Connect</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
