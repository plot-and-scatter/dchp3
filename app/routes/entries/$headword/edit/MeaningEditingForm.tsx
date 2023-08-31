import { Form } from "@remix-run/react"
import { type MeaningType } from "~/components/Meaning"
import { attributeEnum } from "~/components/editing/attributeEnum"
import Button from "~/components/elements/Button"
import { useState } from "react"
import { CanadianismTypeEnum } from "~/types/CanadianismTypeEnum"
import { EditFormInput } from "../../../components/editing/EditFormInput"
import AddSeeAlso from "./AddSeeAlso"
import SeeAlsoEditing from "./SeeAlsoEditing"

interface MeaningEditingFormProps {
  headword: string
  meaning: MeaningType
}

export default function MeaningEditingForm({
  headword,
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
  //   const [usageNoteValue, setUsageNote] = useState(usageNote)

  return (
    <div className="my-16">
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
          <div className="col-span-full">
            <SeeAlsoEditing
              headword={headword}
              seeAlsoItems={meaning.seeAlso}
            />
          </div>
          <AddSeeAlso headword={headword} meaningId={meaning.id} />

          {meaning.usageNotes.map((usageNote, index) => (
            <div
              className="col-span-full"
              key={`usage-note-div-${usageNote.id}`}
            >
              <Form className="">
                <label>Fist note {index}:</label>
                <textarea
                  value={usageNote.text}
                  className="m-1 h-16 w-full border p-1"
                />
                <button> submit </button>
              </Form>
            </div>
          ))}

          <Button
            type="submit"
            size="medium"
            name="attributeType"
            value={attributeEnum.MEANING}
            className="col-span-1 col-start-4"
          >
            Update Meaning
          </Button>
        </div>
      </Form>
    </div>
  )
}
