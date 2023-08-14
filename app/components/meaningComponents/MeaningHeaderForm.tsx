import { Form, useParams } from "@remix-run/react"
import { attributeEnum } from "../editing/attributeEnum"
import { type MeaningType } from "../Meaning"
import type JSXNode from "~/types/JSXNode"
import { useState } from "react"

interface MeaningHeaderFormProps {
  shouldDisplay: boolean
  meaning: MeaningType
  number: string | null
  dagger: boolean
  partOfSpeech: string
  usageNote: string
}

const MeaningHeaderForm = ({
  shouldDisplay,
  meaning,
  number,
  dagger,
  partOfSpeech,
  usageNote,
}: MeaningHeaderFormProps): JSXNode => {
  const [orderValue, setOrder] = useState(number ?? "")
  const [daggerValue, setDagger] = useState(dagger)
  const [partOfSpeechValue, setPartOfSpeech] = useState(partOfSpeech)
  const [usageNoteValue, setUsageNote] = useState(usageNote)

  const params = useParams()
  const headword = params.headword

  if (!shouldDisplay) {
    return null
  }

  return (
    <Form
      action={`/entries/${headword}`}
      method="post"
      className="grid grid-cols-7 grid-rows-2 bg-slate-200 py-5"
    >
      <label className="col-span-1">
        Dagger:
        <input
          checked={daggerValue}
          name="dagger"
          onChange={(e) => setDagger(e.target.checked)}
          type="checkbox"
          className="m-2"
        />
      </label>
      <label className="col-span-2">
        Order:
        <input
          type="text"
          name="order"
          className="ml-2 w-16"
          value={orderValue}
          onChange={(e) => setOrder(e.target.value)}
        />
      </label>
      <label className="col-span-3">
        Part Of Speech{" "}
        <input
          type="text"
          name="partOfSpeech"
          value={partOfSpeechValue}
          onChange={(e) => setPartOfSpeech(e.target.value)}
          className=""
        />
      </label>
      <label className="col-span-5">
        Usage Note:
        <input
          type="text"
          name="usageNote"
          value={usageNoteValue}
          onChange={(e) => setUsageNote(e.target.value)}
          className="ml-2 w-3/4 p-1"
        />
      </label>
      <input type="hidden" name="newValue" value="hi" />
      <input type="hidden" name="attributeID" value={meaning.id} />
      <input
        type="hidden"
        name="attributeType"
        value={attributeEnum.MEANING_HEADER}
      />
      <button
        type="submit"
        className="col-span-2 mx-2 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400"
      >
        submit
      </button>
    </Form>
  )
}

export default MeaningHeaderForm
