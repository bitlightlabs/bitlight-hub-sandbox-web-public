'use client'

import { useContext } from 'react';
import AccountContext from '@/context/AccountContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Header() {
  const { account } = useContext(AccountContext)!;

  return (
    <header className='sticky z-10 top-0 bg-background shadow h-12 flex items-center justify-between px-4'>
      <div className='flex gap-x-4'>
        <Link href='/'>Home</Link>
        <Link href='/bitcoin'>Bitcoind</Link>
        <Link href='/peers'>Peers</Link>
        <Link href='/channels'>Channels</Link>
        <Link href='/pay'>Pay</Link>
        <Link href='/receive'>Receive</Link>
      </div>
      <div>
        <Button type='button'>
          {account ? ('Current Node: ' + account.name) : 'Not connected'}
        </Button>
      </div>
    </header>
  );
}
