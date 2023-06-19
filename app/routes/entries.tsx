import { Outlet } from "@remix-run/react"
import { type ActionArgs } from "@remix-run/server-runtime"
import Header from "~/components/elements/Header"
import Main from "~/components/elements/Main"
import Nav from "~/components/elements/Nav"
import { updateRecordByAttributeAndType } from "~/models/entry.server"
import {
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())

  const newValue = getStringFromFormInput(data.newValue)
  const type = getNumberFromFormInput(data.attributeType.toString())
  const id = getNumberFromFormInput(data.attributeID.toString())

  updateRecordByAttributeAndType(type, id, newValue)

  return null
}

export default function EntriesPage() {
  return (
    <div className="relative">
      <Header />
      <Nav />
      <Main>
        <Outlet />
      </Main>
    </div>
  )
}
