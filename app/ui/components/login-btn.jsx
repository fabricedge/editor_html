'use client'
import { useSession } from "next-auth/react"

const UseSession = ({ children }) => {
  const session = useSession()
  return children(session)
}

// Usage
export class ClassComponent extends React.Component {
  render() {
    return (
      <UseSession>
        {(session) => <pre>{JSON.stringify(session, null, 2)}</pre>}
      </UseSession>
    )
  }
}