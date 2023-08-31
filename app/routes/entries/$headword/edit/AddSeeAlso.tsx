import { attributeEnum } from "~/components/editing/attributeEnum"
import Button from "~/components/elements/Button"

interface AddSeeAlsoProps {
  meaningId: number
  headword: string
}

export default function AddSeeAlso({ meaningId, headword }: AddSeeAlsoProps) {
  return (
    <div className="col-span-full my-2 flex flex-row border bg-slate-100 p-5">
      <input type="hidden" name="attributeID" value={meaningId} />
      <label className="mx-2 p-1">
        New See Also:
        <input name="headwordToAdd" className="rounded border p-1" />
      </label>
      <label htmlFor="linkNote" className="mx-2 p-1">
        See Also Comment
      </label>
      <input name="linkNote" className="rounded border p-1" />

      <Button
        type="submit"
        size="medium"
        name="attributeType"
        value={attributeEnum.SEE_ALSO}
        className="col-span-1 col-start-4"
      >
        Add See Also
      </Button>
    </div>
  )
}
