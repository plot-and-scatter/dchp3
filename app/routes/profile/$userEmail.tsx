import { type Prisma } from "@prisma/client"
import { useLoaderData } from "@remix-run/react"
import { type LoaderArgs } from "@remix-run/server-runtime"
import Main from "~/components/elements/Main"
import EntryList from "~/components/profile/EntryList"
import { getEntriesByUserEmail } from "~/models/user.server"

export async function loader({ params }: LoaderArgs) {
  // TODO: check to see if you have perms

  const email = params.userEmail ?? ""
  const entries = await getEntriesByUserEmail(email)
  return { email, entries }
}

type loaderData = Prisma.PromiseReturnType<typeof loader>

export default function Profile() {
  // remix bug - see: https://github.com/remix-run/remix/issues/3931
  const data = useLoaderData<typeof loader>() as unknown as loaderData

  return (
    <Main center={true}>
      <h1 className="text-4xl">Profile: {data.email}</h1>
      <EntryList logEntries={data.entries} />
    </Main>
  )
}
