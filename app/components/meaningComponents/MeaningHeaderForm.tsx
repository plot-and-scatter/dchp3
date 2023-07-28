import { Form, useParams } from "@remix-run/react"
import { attributeEnum } from "../editing/attributeEnum"
import { type MeaningType } from "../Meaning"
import type JSXNode from "~/types/JSXNode"
import { useState } from "react"

interface MeaningHeaderFormProps {
  shouldDisplay: boolean
  meaning: MeaningType
  dagger: boolean
}

const MeaningHeaderForm = ({
  shouldDisplay,
  meaning,
  dagger,
}: MeaningHeaderFormProps): JSXNode => {
  const [daggerValue, setDagger] = useState(dagger)
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
      <label className="col-span-3">
        order <input />
      </label>
      <label className="col-span-3">
        text <input type="text" />
      </label>
      <label className="col-span-5">
        lots of text <input type="text" />
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
        className="col-span-2 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400"
      >
        submit
      </button>
    </Form>
  )
}

export default MeaningHeaderForm
