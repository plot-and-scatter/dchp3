import { Form, Link } from "@remix-run/react"
import { type MeaningType } from "~/components/Meaning"
import { attributeEnum } from "~/components/editing/attributeEnum"
import Button from "~/components/elements/LinksAndButtons/Button"
import { useState } from "react"
import { CanadianismTypeEnum } from "~/types/CanadianismTypeEnum"
import AddSeeAlso from "./AddSeeAlso"
import SeeAlsoEditing from "./SeeAlsoEditing"
import { EditFormInput } from "~/components/editing/EditFormInput"
import FistnoteEditForm from "./FistnoteEditForm"
import FistnoteAddingForm from "./FistnoteAddingForm"
import QuotationAddingForm from "./QuotationAddingForm"
import QuotationList from "./QuotationList"
import { type LoadedDataType } from ".."
import { DchpLink } from "~/components/elements/LinksAndButtons/Link"

interface MeaningEditingFormProps {
  entry: LoadedDataType
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
    <div className="my-12 mb-56 bg-slate-100 p-5">
      <div className="flex justify-between">
        <h3 className="text-4xl font-bold">Meaning: {meaning.order}</h3>
        <Form method="post" className="my-6">
          <input type="hidden" name="id" value={meaning.id} />
          <input type="hidden" name="headword" value={headword} />
          <Button
            type="submit"
            appearance="danger"
            name="attributeType"
            value={attributeEnum.DELETE_MEANING}
          >
            Delete
          </Button>
        </Form>
      </div>
      <Form method="post" className="my-6">
        <div className="grid grid-cols-7">
          <input type="hidden" name="id" value={meaning.id} />
          <input type="hidden" name="headword" value={headword} />
          <EditFormInput
            label="Definition: "
            value={definitionValue}
            name="definition"
            onChangeFunction={setDefinition}
            className="col-span-7"
          />

          <EditFormInput
            label="Order: "
            name="order"
            value={orderValue}
            onChangeFunction={setOrder}
            className="col-span-2"
          />
          <EditFormInput
            label="Part Of Speech: "
            name="partOfSpeech"
            value={partOfSpeech}
            onChangeFunction={setPartOfSpeech}
            className="col-span-2"
          />
          <label className="col-span-2">
            Canadianism Type
            <select
              name="canadianismType"
              value={canadianismType ?? ""}
              onChange={(e) => setCanadianismType(e.target.value)}
              className="mx-2 border p-1"
            >
              <option value={""}>{"None"}</option>
              <option>{CanadianismTypeEnum.ONE_ORIGIN}</option>
              <option>{CanadianismTypeEnum.TWO_PRESERVATION}</option>
              <option>{CanadianismTypeEnum.THREE_SEMANTIC_CHANGE}</option>
              <option>{CanadianismTypeEnum.FOUR_CULTURALLY_SIGNIFICANT}</option>
              <option>{CanadianismTypeEnum.FIVE_FREQUENCY}</option>
              <option>{CanadianismTypeEnum.SIX_MEMORIAL}</option>
            </select>
          </label>
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
            <div className="flex gap-x-4">
              <DchpLink asButton to={`/entries/${entry.headword}`}>
                &larr; Return to headword
              </DchpLink>
              <Button name="attributeType" value={attributeEnum.ADD_MEANING}>
                Add new meaning
              </Button>
            </div>
            <Button
              appearance="success"
              type="submit"
              name="attributeType"
              value={attributeEnum.MEANING}
            >
              Save meaning
            </Button>
            <input type="hidden" name="attributeID" value={entry.id} />
          </div>
        </div>
      </Form>

      <div className="my-2 flex flex-col justify-center bg-slate-200 p-2">
        <h2 className=" my-2 text-2xl font-bold underline">Quotation Adding</h2>
        <QuotationList meaningId={meaning.id} citations={meaning.citations} />
        <QuotationAddingForm meaningId={meaning.id} />
      </div>

      <div className="my-2 bg-slate-200 p-2">
        <h2 className=" my-2 text-2xl underline">See Also</h2>
        <SeeAlsoEditing headword={headword} seeAlsoItems={meaning.seeAlso} />
        <AddSeeAlso headword={headword} meaningId={meaning.id} />
      </div>
      <div className="my-2 bg-slate-200 p-2">
        <div className="flex justify-between">
          <h2 className=" my-2 text-2xl underline">Fistnotes</h2>
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
