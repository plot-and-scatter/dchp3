import { Form } from "@remix-run/react"
import { attributeEnum } from "../editing/attributeEnum"
import { type MeaningType } from "../Meaning"
import JSXNode from "~/types/JSXNode"

interface MeaningHeaderFormProps {
  shouldDisplay: boolean
  word: string
  meaning: MeaningType
  dagger: boolean
  setDagger: React.Dispatch<React.SetStateAction<boolean>>
}

const MeaningHeaderForm = ({
  shouldDisplay,
  word,
  meaning,
  dagger,
  setDagger,
}: MeaningHeaderFormProps): JSXNode => {
  if (!shouldDisplay) {
    return null
  }

  return (
    <Form
      action={`/entries/${word}`}
      method="post"
      className="bg-slate-200 py-5"
    >
      <label>
        Dagger:
        <input
          checked={dagger}
          name="dagger"
          onChange={(e) => setDagger(e.target.checked)}
          type="checkbox"
        />
      </label>
      <input type="hidden" name="newValue" value="hi" />
      <input type="hidden" name="attributeID" value={meaning.id} />
      <input
        type="hidden"
        name="attributeType"
        value={attributeEnum.MEANING_HEADER}
      />
      <button type="submit">submit</button>
    </Form>
  )
}

export default MeaningHeaderForm
