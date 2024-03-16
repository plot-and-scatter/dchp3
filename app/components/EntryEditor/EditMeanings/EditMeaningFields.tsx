import { CanadianismTypeEnum } from "~/types/CanadianismTypeEnum"
import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import Button from "~/components/elements/LinksAndButtons/Button"
import Dagger from "~/components/Entry/Common/Dagger"
import Definition from "~/components/Entry/Meanings/Definition"
import Input from "~/components/bank/Input"
import MeaningEditorForm from "../EntryEditorForm/MeaningEditorForm"
import SaveIcon from "~/components/elements/Icons/SaveIcon"
import Select from "~/components/bank/Select"
import TextArea from "~/components/bank/TextArea"
import TopLabelledField from "~/components/bank/TopLabelledField"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import type { MeaningType } from "~/components/Entry/Meanings/Meaning"

type EditMeaningFieldsProps = {
  entry: LoadedEntryDataType
  meaning: MeaningType
}

export default function EditMeaningFields({
  entry,
  meaning,
}: EditMeaningFieldsProps) {
  return (
    <MeaningEditorForm
      formAction={EntryEditorFormActionEnum.UPDATE_MEANING}
      meaning={meaning}
      headword={entry.headword}
      className="mt-4 flex flex-col gap-y-4"
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
                rows={8}
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
  )
}
