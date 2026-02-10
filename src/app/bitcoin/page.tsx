'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AccountContext from "@/context/AccountContext"
import { bitcoinMime } from "@/lib/utils"
import { useContext, useEffect, useState } from "react"
import { toast } from "sonner"

export default function BitcoinPage() {
  const [posting, setPosting] = useState(false)
  const { account } = useContext(AccountContext)!;
  const [address, setAddress] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [balance, setBalance] = useState<string>("")
  const [blocks, setBlocks] = useState<string>('5')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [blockInfo, setBlockInfo] = useState<any>(null)

  const init = async () => {
    try {
      setPosting(true)
      const response = await fetch('/api/bitcoin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'getbalance',
          params: []
        })
      });
      const infoRes = await fetch('/api/bitcoin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'getblockchaininfo',
          params: []
        })
      });

      const body = await response.json();
      const info = await infoRes.json();
      setBalance(body.result);
      setBlockInfo(info.result);
      
    } catch (e) {} finally {
      setPosting(false)
    }
  }

  useEffect(() => {
    init()
  }, [])

  const mine = async () => {
    if(!blocks) {
      return
    }

    try {
      setPosting(true)
      await bitcoinMime(Number(blocks))

      toast.success('Block mined')
    } catch(e) {} finally {
      setPosting(false)
    }
  }

  const deposit = async () => {
    if(!account || !address || !amount) return

    if(Number(amount) >= Number(balance)) {
      toast.error('Insufficient funds')
      return
    }

    try {
      setPosting(true)
      
      await fetch('/api/bitcoin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'sendtoaddress',
          params: [address, Number(amount)]
        })
      });
      await bitcoinMime(5) // mine 5 blocks to confirm the transaction


      toast.success('Payment sent')
      setAddress("")
      setAmount("")
    } catch(e) {
      console.error(e)
      toast.error('Error sending payment')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="flex justify-center mt-8 gap-2">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Bitcoind</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div>Balance: {balance} BTC</div>
          <div>Chain: {blockInfo?.chain}</div>
          <div>Height: {blockInfo?.blocks}</div>
          <div className="mt-4">
            <Input
              placeholder="Blocks to mine"
              onChange={(e) => setBlocks(e.target.value)}
              value={blocks}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" disabled={posting} className="w-full" onClick={mine}>Mine</Button>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Deposit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />

            <Input
              placeholder="Amount in BTC"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled={posting} className="w-full" onClick={deposit}>Deposit</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
