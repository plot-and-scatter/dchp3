import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { Form, useLoaderData } from "@remix-run/react"
import { useState } from "react"
import invariant from "tiny-invariant"
import {
  type ActionArgs,
  redirect,
  type LoaderArgs,
} from "@remix-run/server-runtime"
import {
  type Reference,
  getReferenceById,
  updateReferenceById,
} from "~/models/reference.server"
import {
  getNumberFromFormInput,
  getStringFromFormInput,
} from "~/utils/generalUtils"
import Button from "~/components/elements/LinksAndButtons/Button"
import EditIcon from "~/components/elements/Icons/EditIcon"
import Input from "~/components/bank/Input"
import TextArea from "~/components/bank/TextArea"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import TopLabelledField from "~/components/bank/TopLabelledField"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import ReturnToRefListLink from "./ReturnToRefListLink"

export async function loader({ params, request }: LoaderArgs) {
  redirectIfUserLacksPermission(request, "det:editReferences")

  invariant(params.id)
  const id: number = parseInt(params.id)
  const data: Reference | null = await getReferenceById(id)
  if (!data) throw new Error(`Reference with id: ${id} could not be obtained`)

  return data
}

export async function action({ request, params }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  invariant(data.id)
  invariant(data.shortDisplay)
  invariant(data.referenceText)

  const id = getNumberFromFormInput(data.id)
  const shortDisplay = getStringFromFormInput(data.shortDisplay)
  const referenceText = getStringFromFormInput(data.referenceText)

  updateReferenceById(id, shortDisplay, referenceText)
  return redirect(`/references`)
}

export default function ReferenceIdPage() {
  const data = useLoaderData<typeof loader>()
  let [shortDisplay, setShortDisplay] = useState(data.short_display)
  let [referenceText, setReferenceText] = useState(data.reference_text)

  return (
    <div>
      <ReturnToRefListLink />
      <PageHeader>
        <EditIcon /> Edit reference
      </PageHeader>
      <Form className="flex flex-col gap-y-4" method="post">
        <input type="hidden" name="id" value={data.id} />
        <TopLabelledField
          label="Short display text"
          field={
            <Input
              name="shortDisplay"
              value={shortDisplay}
              onChange={(e) => {
                setShortDisplay(e.target.value)
              }}
              type="text"
            />
          }
        />
        <TopLabelledField
          breakAfterLabel
          label="Reference text"
          field={
            <TextArea
              name="referenceText"
              value={referenceText}
              onChange={(e) => {
                setReferenceText(e.target.value)
              }}
            />
          }
        />
        <div className="flex items-center justify-between">
          <Button
            type="submit"
            name="updateReference"
            appearance="success"
            size="large"
          >
            <SaveIcon /> Save reference
          </Button>
          <Button
            type="submit"
            name="deleteReference"
            appearance="danger"
            onClick={(e) => {
              if (!confirm("Are you sure you want to delete this reference?")) {
                e.preventDefault()
              }
            }}
          >
            <DeleteIcon /> Delete reference
          </Button>
        </div>
      </Form>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
