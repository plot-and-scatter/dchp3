import { attributeEnum } from "../attributeEnum"
import { Form } from "@remix-run/react"
import { PageHeader } from "../../elements/PageHeader"
import Button from "../../elements/LinksAndButtons/Button"
import EditingStatus from "../EditingStatus"
import EditingTools from "../EditingTools"
import EntryEditingForm from "~/routes/entries/$headword/edit/EntryEditingForm"
import MeaningEditingForms from "~/routes/entries/$headword/edit/MeaningEditingForms"
import type { EntryEditLoaderData } from "~/routes/entries/$headword/edit"
import EntryComment from "../EntryComment"
import ImageEditingForm from "~/routes/entries/$headword/edit/ImageEditingForm"

export default function EditEntry({ entry }: EntryEditLoaderData) {
  const { id, headword } = entry

  return (
    <div className="flex w-11/12 flex-row justify-between">
      <div className="w-1/4">
        <div className="fixed w-1/5">
          <Form
            reloadDocument={true}
            action={`/entries/${headword}/edit`}
            method="post"
            className="my-5"
          >
            <Button appearance="success" variant="outline">
              Add new meaning
            </Button>
            <input
              type="hidden"
              name="attributeType"
              value={attributeEnum.ADD_MEANING}
            />
            <input type="hidden" name="attributeID" value={id} />
            <input type="hidden" name="headword" value={headword} />
          </Form>
          <EditingTools data={entry} />
          <EditingStatus data={entry} />
          <EntryComment data={entry} />
        </div>
      </div>

      <div className="w-3/4">
        <div className="flex flex-row items-center justify-between">
          <PageHeader>Edit headword: {headword}</PageHeader>
        </div>
        <EntryEditingForm data={entry} />
        <MeaningEditingForms data={entry} />
        <ImageEditingForm data={entry} />
      </div>
    </div>
  )
}
