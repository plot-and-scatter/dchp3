import { Form } from "@remix-run/react"
import React from "react"
import SeeAlsoItem from "~/components/SeeAlsoItem"
import { type SeeAlsoList } from "~/components/SeeAlsoItems"
import { attributeEnum } from "~/components/editing/attributeEnum"
import Button from "~/components/elements/Button"

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
    <div className="flex flex-row">
      <em>See also:</em>{" "}
      {seeAlsoItems.map((seeAlso, index) => {
        return (
          <div
            key={`see-also-${seeAlso.meaning_id}-${seeAlso.entry_id}`}
            className="flex flex-row"
          >
            {index > 0 && <span className="mr-3">,</span>}
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
                name="attributeType"
                value={attributeEnum.DELETE_SEE_ALSO}
              ></input>
              <input type="hidden" name="headword" value={headword}></input>
              <Button size="small" appearance="danger">
                <i className="fa fa-trash" aria-hidden="true"></i>{" "}
              </Button>
            </Form>
          </div>
        )
      })}
    </div>
  )
}

export default SeeAlsoItems
