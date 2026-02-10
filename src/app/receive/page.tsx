'use client'

import CopyText from "@/components/CopyText"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { RgbLdkService } from "@/lib/rgbsdk/service"
import { InfoIcon } from "lucide-react"
import { useContext, useState } from "react"
import { toast } from "sonner"

export default function ReceivePage() {
  const { account } = useContext(AccountContext)!;
  const [amount, setAmount] = useState<string>("")
  const [invoice, setInvoice] = useState<string>("")

  const generate = async () => {
    if (!account || !amount) return

    try {
      const invoice = await new RgbLdkService(account).createInvoice(Number(amount))
      setAmount("")
      setInvoice(invoice)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="flex justify-center mt-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Create a invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Amount Sats"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />

          {
            invoice !== '' ? (
              <Alert className="mt-4">
                <InfoIcon />
                <AlertTitle>Your invoice</AlertTitle>
                <AlertDescription className="wrap-anywhere">
                  {invoice}
                  <div>
                    <CopyText size="lg" text={invoice} />
                  </div>
                </AlertDescription>
              </Alert>
            ) : null
          }
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generate}>Create</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
