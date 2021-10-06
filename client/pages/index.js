import React, { useEffect } from 'react'
import { CookiesProvider } from "react-cookie"
import { useRouter } from 'next/router'

export default function App() {

  const router = useRouter();
  useEffect(() => {
      router.push('/login')
      return () => {
      };
});
  return (
    <></>
  )
}


