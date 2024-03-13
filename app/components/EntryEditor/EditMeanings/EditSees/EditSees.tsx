import { EntryEditorFormActionEnum } from "~/components/EntryEditor/EntryEditorForm/EntryEditorFormActionEnum"
import { Form } from "@remix-run/react"
import { type SeeAlsoList } from "~/components/Entry/Meanings/SeeAlsoItems"
import IconButton from "~/components/elements/LinksAndButtons/IconButton"
import SeeAlsoItem from "~/components/Entry/Meanings/SeeAlsoItem"

interface SeeAlsoEditingProps {
  headword: string
  seeAlsoItems: SeeAlsoList
}

const SeeAlsoItems = ({
  headword,
  seeAlsoItems,
}: SeeAlsoEditingProps): JSX.Element => {
  if (!seeAlsoItems || seeAlsoItems.length === 0) {
    return <></>
  }

  return (
    <div className="flex flex-col flex-wrap items-start gap-1">
      <em>See:&nbsp;</em>
      {seeAlsoItems.map((seeAlso, index) => {
        return (
          <div
            key={`see-also-${seeAlso.meaning_id}-${seeAlso.entry_id}`}
            className="ml-2 flex flex-row items-center"
          >
            <SeeAlsoItem seeAlso={seeAlso} />
            <Form method="post" action={`/entries/${headword}/edit`}>
              <input
                type="hidden"
                name="meaningId"
                value={seeAlso.meaning_id}
              ></input>
              <input
                type="hidden"
                name="entryId"
                value={seeAlso.entry_id}
              ></input>
              <input
                type="hidden"
                name="entryEditorFormAction"
                value={EntryEditorFormActionEnum.DELETE_SEE_ALSO}
              ></input>
              <IconButton
                type="submit"
                iconName="fa-trash-can"
                size="small"
                appearance="danger"
                variant="outline"
                className="ml-1"
              >
                Delete
              </IconButton>
            </Form>
          </div>
        )
      })}
    </div>
  )
}

export default SeeAlsoItems
