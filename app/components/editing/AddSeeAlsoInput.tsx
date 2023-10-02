import { useEffect, useRef } from "react"
import { attributeEnum } from "./attributeEnum"
import Button from "../elements/LinksAndButtons/Button"

const AddSeeAlsoInput = () => {
  const inputElement = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputElement?.current?.focus()
  }, [])

  return (
    <div className="grid grid-cols-5 grid-rows-2 gap-1">
      <label className="col-span-2" htmlFor="headword">
        Headword:
      </label>
      <input type="text" name="headword" className="col-span-3 border-2 p-1" />
      <label className="col-span-2" htmlFor="headword">
        Note:
      </label>
      <input type="text" name="linkNote" className="col-span-3 border-2 p-1" />
      <input
        type="hidden"
        name="attributeType"
        value={attributeEnum.SEE_ALSO}
      />
      <Button type="submit"></Button>
    </div>
  )
}

export default AddSeeAlsoInput
