import { addReference } from "~/models/reference.server"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { Form } from "@remix-run/react"
import { getStringFromFormInput } from "~/utils/generalUtils"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import AddIcon from "~/components/elements/Icons/AddIcon"
import Button from "~/components/elements/LinksAndButtons/Button"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import Input from "~/components/bank/Input"
import invariant from "tiny-invariant"
import ReturnToRefListLink from "./ReturnToRefListLink"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import TextArea from "~/components/bank/TextArea"
import TopLabelledField from "~/components/bank/TopLabelledField"

export async function action({ request }: ActionArgs) {
  await redirectIfUserLacksPermission(request, "det:editReferences")

  const data = Object.fromEntries(await request.formData())
  invariant(data.shortDisplay)
  invariant(data.referenceText)

  const shortDisplay = getStringFromFormInput(data.shortDisplay)
  const referenceText = getStringFromFormInput(data.referenceText)

  addReference(shortDisplay, referenceText)
  return redirect(`/references`)
}

export default function ReferenceIdPage() {
  return (
    <div>
      <ReturnToRefListLink />
      <PageHeader>
        <AddIcon /> Add reference
      </PageHeader>
      <Form className="flex flex-col gap-y-4" method="post">
        <input type="hidden" name="id" />
        <TopLabelledField
          label={<label htmlFor="shortDisplay">Short display text</label>}
          field={<Input id="shortDisplay" name="shortDisplay" />}
        />
        <TopLabelledField
          label={<label htmlFor="referenceText">Reference text</label>}
          field={<TextArea id="referenceText" name="referenceText" />}
        />
        <div className="flex items-center justify-between">
          <Button name="updateReference" appearance="success" size="large">
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
