import { SessionProvider } from "next-auth/react"
import { useSession } from "next-auth/react"
import type { AppProps } from "next/app";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & { pageProps: { session: any } }) {
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

  return <a href="/api/auth/signin">Sign in</a>
}