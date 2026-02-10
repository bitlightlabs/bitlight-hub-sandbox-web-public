'use client'

import { useEffect, useState } from "react"
import AccountContext from "@/context/AccountContext"
import type { RgbLdkNode } from "@/lib/rgbsdk/ILightning"
import { ALICE_LND_CONFIG, BOB_LND_CONFIG } from "@/lib/config"

export default function AccountProvider(props: {children: React.ReactNode}) {
  const [account, setAccount] = useState<RgbLdkNode | null>(null)

  const selectNode = (node: RgbLdkNode) => {
    localStorage.setItem('rgb_account', JSON.stringify(node))
    setAccount(node)
  }

  const reset = () => {
    localStorage.removeItem('rgb_account')
    setAccount(null)
  }

  const loadAccount = () => {
    const cached = localStorage.getItem('rgb_account')
    if (cached) {
      const account = JSON.parse(cached)
      setAccount(account as RgbLdkNode)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAccount()
  }, [])

  return (
    <AccountContext.Provider value={{
      account,
      selectNode,
      reset,
    }}>{props.children}</AccountContext.Provider>
  )
}
