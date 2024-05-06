import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { DeleteReferenceSchema, deleteReference } from "./deleteReference"
import { Form, useLoaderData } from "@remix-run/react"
import { getReferenceById } from "~/models/reference.server"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { parseWithZod } from "@conform-to/zod"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import {
  type ActionArgs,
  redirect,
  type LoaderArgs,
} from "@remix-run/server-runtime"
import { UpdateReferenceSchema, updateReference } from "./updateReference"
import { z } from "zod"
import Button from "~/components/elements/LinksAndButtons/Button"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import EditIcon from "~/components/elements/Icons/EditIcon"
import Input from "~/components/bank/Input"
import invariant from "tiny-invariant"
import ReturnToRefListLink from "./ReturnToRefListLink"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import TextArea from "~/components/bank/TextArea"
import TopLabelledField from "~/components/bank/TopLabelledField"
import { ReferenceActionEnum } from "./ReferenceActionEnum"
import { getFormProps, useForm } from "@conform-to/react"

export async function action({ request }: ActionArgs) {
  await redirectIfUserLacksPermission(request, "det:editReferences")

  const formData = await request.formData()

  const submission = parseWithZod(formData, {
    schema: z.discriminatedUnion("referenceAction", [
      UpdateReferenceSchema,
      DeleteReferenceSchema,
    ]),
  })

  if (submission.status !== "success") {
    throw new Error(`Error with submission: ${JSON.stringify(submission)}`)
  }

  const action = submission.value.referenceAction

  switch (action) {
    case ReferenceActionEnum.DELETE_REFERENCE:
      await deleteReference(submission.value)
      break
    case ReferenceActionEnum.UPDATE_REFERENCE:
      await updateReference(submission.value)
      break
    default:
      throw new Error(`Unknown action: ${action}`)
  }

  return redirect(`/references`)
}

export async function loader({ params, request }: LoaderArgs) {
  redirectIfUserLacksPermission(request, "det:editReferences")

  invariant(params.id)
  const id = parseInt(params.id)
  const data = await getReferenceById(id)
  if (!data) throw new Error(`Reference with id: ${id} could not be obtained`)

  return data
}

export default function ReferenceIdPage() {
  const data = useLoaderData<typeof loader>()

  const [form, fields] = useForm({
    shouldValidate: "onInput", // Run the same validation logic on client
    onValidate({ formData }) {
      const parsing = parseWithZod(formData, { schema: UpdateReferenceSchema })
      console.log(parsing)
      return parsing
    },
  })

  return (
    <div>
      <ReturnToRefListLink />
      <PageHeader>
        <div className="flex items-center justify-between">
          <span>
            <EditIcon /> Edit reference
          </span>
          <Form method="post">
            <input type="hidden" name="id" value={data.id} />
            <Button
              type="submit"
              name="referenceAction"
              value={ReferenceActionEnum.DELETE_REFERENCE}
              appearance="danger"
              className="font-normal"
              onClick={(e) => {
                if (
                  !confirm("Are you sure you want to delete this reference?")
                ) {
                  e.preventDefault()
                }
              }}
            >
              <DeleteIcon /> Delete reference
            </Button>
          </Form>
        </div>
      </PageHeader>
      <Form
        {...getFormProps(form)}
        className="flex flex-col gap-y-4"
        method="post"
      >
        <input type="hidden" name="id" value={data.id} />
        <input
          type="hidden"
          name="referenceAction"
          value={ReferenceActionEnum.UPDATE_REFERENCE}
        />
        <TopLabelledField
          label="Short display text"
          field={
            <Input
              name="shortDisplay"
              defaultValue={data.short_display}
              conformField={fields.shortDisplay}
            />
          }
        />
        <TopLabelledField
          breakAfterLabel
          label="Reference text"
          field={
            <TextArea
              name="referenceText"
              defaultValue={data.reference_text}
              conformField={fields.referenceText}
            />
          }
        />
        <div>
          <Button type="submit" appearance="success" size="large">
            <SaveIcon /> Save reference
          </Button>
        </div>
      </Form>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
