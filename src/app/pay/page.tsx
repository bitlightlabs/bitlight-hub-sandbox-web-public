'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import AccountContext from "@/context/AccountContext"
import { RgbLdkService } from "@/lib/rgbsdk/service"
import { InfoIcon } from "lucide-react"
import { useContext, useState } from "react"
import { toast } from "sonner"

export default function PayPage() {
  const [posting, setPosting] = useState(false)
  const { account } = useContext(AccountContext)!;
  const [invoice, setInvoice] = useState<string>("")
  const [decodedInvoice, setDecodedInvoice] = useState<unknown>(null)

  const pay = async () => {
    if (!account || !invoice) return

    try {
      setPosting(true)
      const list = await new RgbLdkService(account).getChannels()
      if(!list || list.length === 0) {
        toast.error("No channels available for payment")
        return
      }

      // Check channel status
      for(let i=0; i<list.length; i++) {
        if(list[i].status !== "Open") {
          toast.error(`Channel status is not open`)
          return
        }
      }

      await new RgbLdkService(account).payInvoice(invoice)
      setInvoice("")
      toast.success("Payment successful")
    } catch (e) {
      console.error("Payment failed:", e)
      toast.error((e as Error).message)
    } finally {
      setPosting(false)
    }
  }

  const decode = async () => {
    if (!account || !invoice) return

    try {
      setPosting(true)
      const decoded = await new RgbLdkService(account).decodeInvoice(invoice)
      setDecodedInvoice(decoded)
      toast.success("Invoice decoded successfully")
    } catch (e) {
      console.error("Decoding failed:", e)
      toast.error((e as Error).message)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="flex flex-col items-center mt-8 gap-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Pay a invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste invoice here"
            rows={4}
            onChange={(e) => setInvoice(e.target.value)}
            value={invoice}
          />
        </CardContent>
        <CardFooter>
          <Button disabled={posting} className="w-full" onClick={pay}>Pay</Button>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Decode a invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste invoice here"
            rows={4}
            onChange={(e) => setInvoice(e.target.value)}
            value={invoice}
          />

          {
            decodedInvoice !== '' ? (
              <Alert className="mt-4">
                <InfoIcon />
                <AlertTitle>Your invoice</AlertTitle>
                <AlertDescription className="wrap-anywhere">
                  <div className="w-full overflow-hidden">
                    <pre className="overflow-x-scroll">
                      {JSON.stringify(decodedInvoice, null, 2)}
                    </pre>
                  </div>
                </AlertDescription>
              </Alert>
            ) : null
          }
        </CardContent>
        <CardFooter>
          <Button disabled={posting} className="w-full" onClick={decode}>Pay</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
