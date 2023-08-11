import { NavLink, useLoaderData } from "@remix-run/react"
import { json, type LoaderArgs } from "@remix-run/server-runtime"
import { sourceTypeToText } from "utils/citation"
import { PageHeader } from "~/components/elements/PageHeader"
import { getOwnCitations } from "~/models/citation.server"
import {
  getEmailFromSession,
  redirectIfUserLacksPermission,
} from "~/services/auth/session.server"

export const loader = async ({ request }: LoaderArgs) => {
  await redirectIfUserLacksPermission(request, "bank:create")

  const email = await getEmailFromSession(request)

  console.log("email", email)

  if (!email) throw json({ message: `No email on user` }, { status: 500 })
  const citations = await getOwnCitations(email)

  return citations
}

export default function OwnCitations() {
  const citations = useLoaderData<typeof loader>()

  console.log("citations", citations)

  return (
    <>
      <PageHeader>Owned citations</PageHeader>
      {citations.map((citation) => {
        return (
          <div key={citation.id} className="mb-4">
            <div className="text-lg font-bold">
              <NavLink
                to={`/bank/edit/${citation.id}`}
                className="text-blue-500"
              >
                {citation.headword}
              </NavLink>
            </div>
            <div>
              <strong>Meaning Short</strong>: {citation.short_meaning}
              <br />
              <strong>ID</strong>: {citation.id} | <strong>Year Pub</strong>:{" "}
              {citation.year_published} | <strong>Year</strong>
              <strong>Comp</strong>: {citation.year_composed} |{" "}
              <strong>Place</strong>: {citation.place_name} |
              <strong>Spelling Variations</strong>: {citation.spelling_variant}
              <br />
              <strong>Citation</strong>:[...] {citation.text} [..] (Source:{" "}
              {sourceTypeToText(citation.type_id)})
            </div>
          </div>
        )
      })}
    </>
  )
}
