import type { LoaderArgs } from "@remix-run/node"
import { type ActionArgs } from "@remix-run/node"
import Main from "~/components/elements/Main"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  console.log(data)
  return { data }
}

export async function loader({ request }: LoaderArgs) {
  await redirectIfUserLacksPermission(request, "det:createDraft")

  return {}
}

export default function Index() {
  return (
    <div className="relative">
      <Main>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Add new citation</h1>
        </div>
      </Main>
    </div>
  )
}
