import { CreateReferenceSchema, createReference } from "./createReference"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { Form } from "@remix-run/react"
import { getFormProps, useForm } from "@conform-to/react"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { parseWithZod } from "@conform-to/zod"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { ReferenceActionEnum } from "./ReferenceActionEnum"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import AddIcon from "~/components/elements/Icons/AddIcon"
import Button from "~/components/elements/LinksAndButtons/Button"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import Input from "~/components/bank/Input"
import ReturnToRefListLink from "./ReturnToRefListLink"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import TextArea from "~/components/bank/TextArea"
import TopLabelledField from "~/components/bank/TopLabelledField"

export async function action({ request }: ActionArgs) {
  await redirectIfUserLacksPermission(request, "det:editReferences")

  const formData = await request.formData()

  const submission = parseWithZod(formData, {
    schema: CreateReferenceSchema,
  })

  if (submission.status !== "success") {
    throw new Error(`Error with submission: ${JSON.stringify(submission)}`)
  }

  const reference = await createReference(submission.value)

  return redirect(`/references/${reference.id}`)
}

export default function ReferenceIdPage() {
  const [form, fields] = useForm({
    shouldValidate: "onInput", // Run the same validation logic on client
    onValidate({ formData }) {
      const parsing = parseWithZod(formData, { schema: CreateReferenceSchema })
      console.log(parsing)
      return parsing
    },
  })

  return (
    <div>
      <ReturnToRefListLink />
      <PageHeader>
        <AddIcon /> Add reference
      </PageHeader>
      <Form
        {...getFormProps(form)}
        method="POST"
        className="flex flex-col gap-y-4"
      >
        <TopLabelledField
          label={<label htmlFor="shortDisplay">Short display text</label>}
          field={
            <Input
              conformField={fields.shortDisplay}
              id="shortDisplay"
              name="shortDisplay"
            />
          }
        />
        <TopLabelledField
          label={<label htmlFor="referenceText">Reference text</label>}
          field={
            <TextArea
              conformField={fields.referenceText}
              id="referenceText"
              name="referenceText"
            />
          }
        />
        <input
          type="hidden"
          name="referenceAction"
          value={ReferenceActionEnum.CREATE_REFERENCE}
        />
        <div className="flex items-center justify-between">
          <Button type="submit" appearance="success" size="large">
            <SaveIcon /> Save reference
          </Button>
          <Link to="/references" asButton appearance="danger">
            <DeleteIcon /> Cancel
          </Link>
        </div>
      </Form>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
