import { redirect, Form, data, useActionData } from "react-router"
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router"
import Main from "~/components/elements/Layouts/Main"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { insertEntry } from "~/models/entry.server"
import Button from "~/components/elements/LinksAndButtons/Button"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import LabelledField from "~/components/bank/LabelledField"
import Input from "~/components/bank/Input"
import TextArea from "~/components/bank/TextArea"
import RadioOrCheckbox from "~/components/bank/RadioOrCheckbox"
import FormConflictBanner from "~/components/elements/Form/FormConflictBanner"

// Prisma's unique-constraint code. Checked structurally rather than with
// `instanceof PrismaClientKnownRequestError`, because that would need a
// runtime import of @prisma/client in a route module.
const isDuplicateKeyError = (error: unknown): boolean =>
  typeof error === "object" &&
  error !== null &&
  (error as { code?: unknown }).code === "P2002"

export async function action({ request }: ActionFunctionArgs) {
  // TODO: Refactor this along the lines of all the other entry action
  // functions.
  const formValues = Object.fromEntries(await request.formData())

  try {
    // Must stay awaited. Unawaited, the redirect below raced the insert: the
    // edit page could load before the row committed, and any failure escaped
    // as an unhandled rejection with a raw Prisma stack trace instead of
    // reaching the error boundary.
    await insertEntry(formValues, request)
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      // Returned, not thrown, so the form stays on screen with what was typed
      // instead of being replaced by the error boundary.
      return data(
        {
          conflictMessage: `An entry for the headword "${formValues.headword}" already exists. Headwords must be unique, so edit the existing entry instead of creating a second one.`,
        },
        { status: 409 }
      )
    }
    throw error
  }

  return redirect(`/entries/${formValues.headword}/edit`)
}

export async function loader({ request }: LoaderFunctionArgs) {
  await redirectIfUserLacksPermission(request, "det:createDraft")

  return {}
}

export default function Index() {
  const actionData = useActionData<typeof action>()

  return (
    <Main center={true}>
      <PageHeader>Insert entry</PageHeader>
      <p>Enter the following inputs to create a new headword in the DCHP.</p>
      <FormConflictBanner actionData={actionData} />
      <Form
        id="entryInsertionForm"
        className="flex w-full max-w-3xl flex-col justify-center pt-6 align-middle"
        method="post"
      >
        <div className="my-4 flex flex-col gap-2">
          <LabelledField
            label="Headword"
            field={<Input name="headword" className="py-4 text-2xl" />}
          />
        </div>
        <div className="flex w-full flex-col gap-4">
          <LabelledField
            label="Spelling variants"
            field={<Input name="spellingVariants" />}
          />
          <LabelledField label="Etymology" field={<Input name="etymology" />} />
          <LabelledField
            label="General labels"
            field={<Input name="generalLabels" />}
          />

          <LabelledField
            label="Fistnote"
            field={<TextArea name="fistnote" />}
          />

          <LabelledField
            label="Dagger"
            field={
              <RadioOrCheckbox
                type="checkbox"
                options={[
                  {
                    label: "",
                    value: "on",
                  },
                ]}
                name="dagger"
              />
            }
          />

          <LabelledField
            label="Is non-Canadian"
            field={
              <RadioOrCheckbox
                type="checkbox"
                options={[
                  {
                    label: "",
                    value: "on",
                  },
                ]}
                name="isNonCanadian"
              />
            }
          />

          <LabelledField
            label="DCHP version"
            field={
              <RadioOrCheckbox
                type="radio"
                name="dchpVersion"
                direction="vertical"
                optionSetClassName="flex gap-x-2 mr-4"
                options={[
                  { label: "DCHP-1", value: "isLegacy" },
                  { label: "DCHP-2", value: "dchp2" },
                  { label: "DCHP-3", value: "dchp3" },
                  { label: "DCHP-3.1", value: "dchp3.1", defaultChecked: true },
                ]}
              />
            }
          />
        </div>

        <Button
          className="mx-auto mt-4"
          type="submit"
          name="submitButton"
          size="large"
        >
          Submit
        </Button>
      </Form>
    </Main>
  )
}
