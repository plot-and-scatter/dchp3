import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import Button from "~/components/elements/LinksAndButtons/Button"
import SeeAlsoInput from "./SeeAlsoInput"
import MeaningEditorForm from "~/components/EntryEditor/EntryEditorForm/MeaningEditorForm"
import type { MeaningType } from "~/components/Entry/Meanings/Meaning"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import TopLabelledField from "~/components/bank/TopLabelledField"
import Input from "~/components/bank/Input"
import AddIcon from "~/components/elements/Icons/AddIcon"
// import { useActionData } from "@remix-run/react"
// import type { action as EntryEditorAction } from "~/routes/entries/$headword/edit"
// import { getFormProps, useForm } from "@conform-to/react"

interface AddSeeAlsoProps {
  meaning: MeaningType
  headword: string
}

export default function AddSeeAlso({ meaning, headword }: AddSeeAlsoProps) {
  // const lastResult = useActionData<typeof EntryEditorAction>()

  // const [form] = useForm({
  //   lastResult,
  //   shouldValidate: "onBlur",
  // })

  return (
    <MeaningEditorForm
      headword={headword}
      meaning={meaning}
      formAction={EntryEditorFormActionEnum.ADD_SEE_ALSO}
      className={"mt-4 rounded border border-red-400 bg-red-100 p-4 shadow"}
      // {...getFormProps(form)}
    >
      <h4 className="mb-4 text-base font-bold">
        <AddIcon /> Add see also
      </h4>
      <div className="flex items-end gap-x-4 text-sm">
        <SeeAlsoInput name="headwordToAdd" />
        <TopLabelledField
          label="Linking note"
          field={
            <Input
              name="linkNote"
              lightBorder
              placeholder="e.g. definition 3"
            />
          }
        />
        <Button appearance="success">
          <SaveIcon /> Save see also
        </Button>
      </div>
    </MeaningEditorForm>
  )
}
