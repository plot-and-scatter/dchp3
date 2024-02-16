import { redirect } from "@remix-run/node"
import type { LoaderArgs, ActionArgs } from "@remix-run/node"
import { Form } from "@remix-run/react"
import Main from "~/components/elements/Main"
import { PageHeader } from "~/components/elements/PageHeader"
import { insertEntry } from "~/models/entry.server"
import Button from "~/components/elements/LinksAndButtons/Button"
import { redirectIfUserLacksPermission } from "~/services/auth/session.server"
import LabelledField from "~/components/bank/LabelledField"
import BankInput from "~/components/bank/BankInput"
import BankTextArea from "~/components/bank/BankTextArea"
import BankRadioOrCheckbox from "~/components/bank/BankRadioOrCheckbox"

export async function action({ request }: ActionArgs) {
  const data = Object.fromEntries(await request.formData())
  insertEntry(data, request)
  return redirect(`/entries/${data.headword}/edit`)
}

export async function loader({ request }: LoaderArgs) {
  await redirectIfUserLacksPermission(request, "det:createDraft")

  return {}
}

export default function Index() {
  return (
    <Main center={true}>
      <PageHeader>Insert entry</PageHeader>
      <p>Enter the following inputs to create a new headword in the DCHP.</p>
      <Form
        id="entryInsertionForm"
        className="flex w-full max-w-3xl flex-col justify-center pt-6 align-middle"
        method="post"
      >
        <div className="my-4 flex flex-col gap-2">
          <LabelledField
            label="Headword"
            field={<BankInput name="headword" className="py-4 text-2xl" />}
          />
        </div>
        <div className="flex w-full flex-col gap-4">
          <LabelledField
            label="Spelling variants"
            field={<BankInput name="spellingVariants" />}
          />
          <LabelledField
            label="Etymology"
            field={<BankInput name="etymology" />}
          />
          <LabelledField
            label="General labels"
            field={<BankInput name="generalLabels" />}
          />

          <LabelledField
            label="Fistnote"
            field={<BankTextArea name="fistnote" />}
          />

          <LabelledField
            label="Dagger"
            field={
              <BankRadioOrCheckbox
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
              <BankRadioOrCheckbox
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
              <BankRadioOrCheckbox
                type="radio"
                name="dchpVersion"
                direction="vertical"
                optionSetClassName="flex gap-x-2 mr-4"
                options={[
                  { label: "DCHP-1", value: "isLegacy" },
                  { label: "DCHP-2", value: "dchp2" },
                  { label: "DCHP-3", value: "dchp3", defaultChecked: true },
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
