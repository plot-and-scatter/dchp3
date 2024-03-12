import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { CanadianismTypeEnum } from "~/types/CanadianismTypeEnum"
import { EditFormInput } from "~/components/EntryEditor/EntryEditorForm/EditFormInput"
import { Form } from "@remix-run/react"
import { type LoadedEntryDataType } from ".."
import { type MeaningType } from "~/components/Meaning"
import { useState } from "react"
import AddSeeAlso from "./AddSeeAlso"
import Button from "~/components/elements/LinksAndButtons/Button"
import FistnoteAddingForm from "./FistnoteAddingForm"
import FistnoteEditForm from "./FistnoteEditForm"
import QuotationAddingForm from "./QuotationAddingForm"
import QuotationList from "./QuotationList"
import SeeAlsoEditing from "./SeeAlsoEditing"
import FAIcon from "~/components/elements/Icons/FAIcon"
import LabelledField from "~/components/bank/LabelledField"
import Input from "~/components/bank/Input"
import Select from "~/components/bank/Select"
import RadioOrCheckbox from "~/components/bank/RadioOrCheckbox"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import EditIcon from "~/components/elements/Icons/EditIcon"
import MeaningEditorForm from "~/components/EntryEditor/EntryEditorForm/MeaningEditorForm"

interface MeaningEditingFormProps {
  entry: LoadedEntryDataType
  meaning: MeaningType
}

export default function MeaningEditingForm({
  entry,
  meaning,
}: MeaningEditingFormProps) {
  const {
    definition,
    order,
    partofspeech,
    dagger,
    canadianism_type,
    canadianism_type_comment,
  } = meaning

  const [definitionValue, setDefinition] = useState(definition)
  const [orderValue, setOrder] = useState(order ?? "")
  const [daggerValue, setDagger] = useState(dagger)
  const [partOfSpeech, setPartOfSpeech] = useState(partofspeech)
  const [canadianismType, setCanadianismType] = useState(canadianism_type)
  const [canadianismTypeComment, setCanadianismTypeComment] = useState(
    canadianism_type_comment
  )

  const headword = entry.headword
  //   const [usageNoteValue, setUsageNote] = useState(usageNote)

  return (
    <div className="my-12 mb-56 border border-gray-700 bg-gray-100 p-8">
      <div className="flex w-full items-center justify-between">
        <SecondaryHeader>
          <EditIcon /> Edit meaning {meaning.order}
        </SecondaryHeader>
        <MeaningEditorForm
          headword={entry.headword}
          meaning={meaning}
          formAction={EntryEditorFormActionEnum.DELETE_MEANING}
        >
          <Button
            type="submit"
            appearance="danger"
            variant="outline"
            onClick={(e) => {
              if (!confirm("Are you sure you want to delete this meaning?")) {
                e.preventDefault()
              }
            }}
          >
            <FAIcon iconName="fa-remove mr-2" /> Delete meaning
          </Button>
        </MeaningEditorForm>
      </div>
      <Form method="post" className="my-6">
        <div className="flex flex-col">
          <input type="hidden" name="id" value={meaning.id} />
          <input type="hidden" name="headword" value={headword} />
          <div>
            <LabelledField
              label={`Definition`}
              breakAfterLabel
              field={
                <Input
                  // conformField={citationFields?.short_meaning}
                  name="definition"
                  defaultValue={definitionValue}
                  onChange={(e) => setDefinition(e.target.value)}
                />
              }
            />
          </div>
          <div className="my-2 flex items-start justify-between gap-x-4">
            <div>
              <LabelledField
                label="Order"
                breakAfterLabel
                field={
                  <Input
                    name="order"
                    defaultValue={orderValue}
                    onChange={(e) => setOrder(e.target.value)}
                  />
                }
              />
            </div>
            <div>
              <LabelledField
                label="Part of speech"
                breakAfterLabel
                field={
                  <Input
                    name="partOfSpeech"
                    defaultValue={partOfSpeech}
                    onChange={(e) => setPartOfSpeech(e.target.value)}
                  />
                }
              />
            </div>
            <div>
              <LabelledField
                label="Canadianism type"
                breakAfterLabel
                field={
                  <Select
                    options={[
                      { label: "None", value: "" },
                      {
                        label: CanadianismTypeEnum.ONE_ORIGIN,
                        value: CanadianismTypeEnum.ONE_ORIGIN,
                      },
                      {
                        label: CanadianismTypeEnum.TWO_PRESERVATION,
                        value: CanadianismTypeEnum.TWO_PRESERVATION,
                      },
                      {
                        label: CanadianismTypeEnum.THREE_SEMANTIC_CHANGE,
                        value: CanadianismTypeEnum.THREE_SEMANTIC_CHANGE,
                      },
                      {
                        label: CanadianismTypeEnum.FOUR_CULTURALLY_SIGNIFICANT,
                        value: CanadianismTypeEnum.FOUR_CULTURALLY_SIGNIFICANT,
                      },
                      {
                        label: CanadianismTypeEnum.FIVE_FREQUENCY,
                        value: CanadianismTypeEnum.FIVE_FREQUENCY,
                      },
                      {
                        label: CanadianismTypeEnum.SIX_MEMORIAL,
                        value: CanadianismTypeEnum.SIX_MEMORIAL,
                      },
                    ]}
                    name="canadianismType"
                    onChange={(e) => setCanadianismType(e.target.value)}
                    defaultValue={canadianismType ?? ""}
                  />
                }
              />
            </div>
            <div>
              <LabelledField
                label="Dagger"
                breakAfterLabel
                field={
                  <RadioOrCheckbox
                    type="checkbox"
                    name="citationId"
                    options={[{ label: "", value: "dagger" }]}
                    className="mr-2"
                    onChange={(e) => setDagger(e.target.checked)}
                  />
                }
              />
            </div>
          </div>

          <label className="col-span-1">
            Dagger:
            <input
              name="dagger"
              checked={daggerValue}
              type="checkbox"
              onChange={(e) => setDagger(e.target.checked)}
              className="mx-4"
            />
          </label>
          <EditFormInput
            label="Canadianism Type Comment:"
            value={canadianismTypeComment || ""}
            name="canadianismTypeComment"
            type="textarea"
            onChangeFunction={setCanadianismTypeComment}
            className="col-span-7"
          />
          <div className="col-span-full flex flex-row justify-between">
            <Button
              appearance="success"
              type="submit"
              name="attributeType"
              value={EntryEditorFormActionEnum.UPDATE_MEANING}
            >
              <SaveIcon /> Save meaning
            </Button>
            <input type="hidden" name="entryId" value={entry.id} />
          </div>
        </div>
      </Form>

      <div className="my-2 flex flex-col justify-center bg-gray-200 p-2">
        <h2 className=" my-2 text-2xl font-bold">Quotation Adding</h2>
        <QuotationList meaningId={meaning.id} citations={meaning.citations} />
        <QuotationAddingForm meaningId={meaning.id} />
      </div>

      <div className="my-2 bg-gray-200 p-2">
        <h2 className=" my-2 text-2xl">See Also</h2>
        <SeeAlsoEditing headword={headword} seeAlsoItems={meaning.seeAlso} />
        <AddSeeAlso headword={headword} meaningId={meaning.id} />
      </div>
      <div className="my-2 bg-gray-200 p-2">
        <div className="flex justify-between">
          <h2 className=" my-2 text-2xl">Fistnotes</h2>
          <FistnoteAddingForm meaningId={meaning.id} />
        </div>
        {meaning.usageNotes.map((usageNote, index) => (
          <div className="col-span-full" key={`usage-note-div-${usageNote.id}`}>
            <FistnoteEditForm usageNote={usageNote} index={index} />
          </div>
        ))}
      </div>
    </div>
  )
}
