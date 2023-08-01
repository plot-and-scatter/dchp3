import { getUserFromSession } from "~/services/auth/session.server"
import { PageHeader } from "~/components/elements/PageHeader"
import { useLoaderData } from "@remix-run/react"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"
import type { LoaderArgs } from "@remix-run/server-runtime"

export async function loader({ request }: LoaderArgs) {
  const user = await getUserFromSession(request)
  return { user }
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="relative">
      <Header />
      <Nav user={user} />
      <Main>
        <div>
          <PageHeader>Welcome to the DCHP-3.</PageHeader>
          <p>Content to come later.</p>
        </div>
      </Main>
    </div>
  )
}
