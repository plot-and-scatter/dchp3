import { addReference } from "~/models/reference.server"
import { DefaultErrorBoundary } from "~/components/elements/DefaultErrorBoundary"
import { Form } from "@remix-run/react"
import { getStringFromFormInput } from "~/utils/generalUtils"
import { type ActionArgs, redirect } from "@remix-run/server-runtime"
import invariant from "tiny-invariant"
import Button from "~/components/elements/LinksAndButtons/Button"
import TopLabelledField from "~/components/bank/TopLabelledField"
import BankInput from "~/components/bank/BankInput"
import BankTextArea from "~/components/bank/BankTextArea"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"

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
    <div className="flex w-full max-w-4xl flex-col">
      <h2 className="my-4 text-2xl font-bold">Add reference</h2>
      <Form className="flex flex-col gap-y-4" method="post">
        <input type="hidden" name="id" />
        <TopLabelledField
          label={<label htmlFor="shortDisplay">Short display text</label>}
          field={<BankInput id="shortDisplay" name="shortDisplay" />}
        />
        <TopLabelledField
          label={<label htmlFor="referenceText">Reference text</label>}
          field={<BankTextArea id="referenceText" name="referenceText" />}
        />
        <div className="flex w-full flex-row justify-between self-center">
          <Button name="updateReference" appearance="success">
            Save reference
          </Button>
          <Button name="deleteReference" appearance="danger">
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}

export const ErrorBoundary = DefaultErrorBoundary
