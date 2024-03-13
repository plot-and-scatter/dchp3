import { CanadianismTypeEnum } from "~/types/CanadianismTypeEnum"
import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import { TertiaryHeader } from "~/components/elements/Headings/TertiaryHeader"
import { type LoadedEntryDataType } from "../../routes/entries/$headword"
import { type MeaningType } from "~/components/Entry/Meanings/Meaning"
import AddSeeAlso from "./EditSees/AddSeeAlso"
import Button from "~/components/elements/LinksAndButtons/Button"
import Dagger from "~/components/Entry/Common/Dagger"
import Definition from "~/components/Entry/Meanings/Definition"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"
import EditIcon from "~/components/elements/Icons/EditIcon"
import FistnoteAddingForm from "./FistnoteAddingForm"
import FistnoteEditForm from "./FistnoteEditForm"
import Input from "~/components/bank/Input"
import MeaningEditorForm from "~/components/EntryEditor/EntryEditorForm/MeaningEditorForm"
import QuotationAddingForm from "./EditQuotations/QuotationAddingForm"
import QuotationList from "./EditQuotations/QuotationList"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import SeeAlsoEditing from "./EditSees/EditSees"
import Select from "~/components/bank/Select"
import TextArea from "~/components/bank/TextArea"
import TopLabelledField from "~/components/bank/TopLabelledField"

interface MeaningEditingFormProps {
  entry: LoadedEntryDataType
  meaning: MeaningType
}

export default function MeaningEditingForm({
  entry,
  meaning,
}: MeaningEditingFormProps) {
  const headword = entry.headword
  //   const [usageNoteValue, setUsageNote] = useState(usageNote)

  return (
    <div className="my-12 rounded border border-gray-400 bg-gray-100 p-8 pt-4 shadow-lg">
      <div className="sticky top-32 z-30 mb-2 border-b border-b-gray-400 bg-gray-100/95 py-2">
        <SecondaryHeader noMargin>
          <EditIcon /> Edit meaning {meaning.order} ({meaning.definition})
        </SecondaryHeader>
      </div>
      <div className="mb-4 flex w-full items-center justify-between">
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
            <DeleteIcon /> Delete meaning
          </Button>
        </MeaningEditorForm>
      </div>
      <MeaningEditorForm
        formAction={EntryEditorFormActionEnum.UPDATE_MEANING}
        meaning={meaning}
        headword={entry.headword}
        className="flex flex-col gap-y-4"
      >
        <div className="flex gap-x-4">
          <TopLabelledField
            label="Order"
            field={
              <Input
                name="order"
                defaultValue={meaning.order}
                lightBorder
                placeholder="e.g. 1a"
                className="font-bold"
              />
            }
          />
          <Dagger dagger={meaning.dagger} isEditingMode />
          <TopLabelledField
            label="Part of speech"
            field={
              <Input
                className="italic text-gray-900"
                name="partOfSpeech"
                defaultValue={meaning.partofspeech}
                lightBorder
                placeholder="e.g. n."
              />
            }
          />
          <TopLabelledField
            label="Usage"
            field={
              <Input
                className="italic text-gray-900"
                name="usage"
                defaultValue={meaning.usage}
                lightBorder
                placeholder="e.g. Slang, dated"
              />
            }
          />
        </div>
        <div>
          <Definition meaning={meaning} isEditingMode />
        </div>
        <div className="my-2 flex items-start justify-between gap-x-4">
          <div>
            <TopLabelledField
              label="Canadianism type"
              field={
                <Select
                  lightBorder
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
                  defaultValue={meaning.canadianism_type ?? ""}
                />
              }
            />
          </div>
          <div className="flex-1">
            <TopLabelledField
              labelWidth="w-fit"
              label="Canadianism type comment"
              field={
                <TextArea
                  lightBorder
                  defaultValue={meaning.canadianism_type_comment ?? ""}
                  name="canadianismTypeComment"
                  rows={5}
                  placeholder="Enter Canadianism type comment"
                />
              }
            />
          </div>
        </div>

        <div className="col-span-full flex flex-row justify-between">
          <Button appearance="success" type="submit" size="large">
            <SaveIcon /> Save changes to meaning {meaning.order}
          </Button>
        </div>
      </MeaningEditorForm>

      <div className="mt-8 rounded border border-gray-400 bg-red-50 p-4 shadow">
        <TertiaryHeader>
          <EditIcon /> Edit sees
        </TertiaryHeader>
        <SeeAlsoEditing headword={headword} seeAlsoItems={meaning.seeAlso} />
        <AddSeeAlso headword={headword} meaning={meaning} />
      </div>

      <div className="mt-8 rounded border border-gray-400 bg-action-50 p-4 shadow">
        <TertiaryHeader>
          <EditIcon /> Edit fist notes
        </TertiaryHeader>

        <div className="mb-4">
          {meaning.usageNotes.map((usageNote) => (
            <div key={`usage-note-div-${usageNote.id}`} className="mb-2">
              <FistnoteEditForm usageNote={usageNote} />
            </div>
          ))}
        </div>
        <FistnoteAddingForm headword={headword} meaning={meaning} />
      </div>

      <div className="mt-8 rounded border border-gray-400 bg-amber-50 p-4">
        <TertiaryHeader>
          <span className="text-amber-600">
            <EditIcon /> Edit quotations
          </span>
        </TertiaryHeader>
        <QuotationList meaningId={meaning.id} citations={meaning.citations} />
        <QuotationAddingForm meaningId={meaning.id} />
      </div>
    </div>
  )
}
