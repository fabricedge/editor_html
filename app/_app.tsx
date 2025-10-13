import { SessionProvider } from "next-auth/react"
import { useSession } from "next-auth/react"
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session: JSON } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export  function Component() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return <p>Signed in as {session.user?.email}</p>
  }
  return <Link href="/api/auth/signin">Sign in</Link>
}