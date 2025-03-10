import { Form } from "@remix-run/react"
import Input from "~/components/bank/Input"
import LabelledField from "~/components/bank/LabelledField"
import Button from "~/components/elements/LinksAndButtons/Button"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"
import DeleteIcon from "~/components/elements/Icons/DeleteIcon"

type EditImageFormProps = {
  entry: LoadedEntryDataType
  image: LoadedEntryDataType["images"][0]
}

export default function EditImageForm({ entry, image }: EditImageFormProps) {
  return (
    <>
      <Form method="post" action={`/entries/${entry.headword}/edit`}>
        <input
          type="hidden"
          name="entryEditorFormAction"
          value={EntryEditorFormActionEnum.EDIT_IMAGE}
        />
        <input type="hidden" name="imageId" value={image.id} />
        <div className="flex items-center justify-between">
          <LabelledField
            label="Order"
            breakAfterLabel
            fullWidth={false}
            field={
              <Input
                className="w-16"
                name="order"
                type="number"
                defaultValue={image.order}
                lightBorder
              />
            }
          />
          <div className="flex items-center">
            <Button appearance="success">Save</Button>
          </div>
        </div>
        <div className="my-4 flex flex-col">
          <Input
            name="caption"
            placeholder="Image caption"
            defaultValue={image.caption}
            lightBorder
          />
        </div>
      </Form>
      <img
        className="shadow-md"
        src={image.path}
        alt={image.caption || "Caption unavailable"}
      />
      <div className="mt-4 flex items-center">
        <Form method="post" action={`/entries/${entry.headword}/edit`}>
          <input
            type="hidden"
            name="entryEditorFormAction"
            value={EntryEditorFormActionEnum.DELETE_IMAGE}
          />
          <input type="hidden" name="imageId" value={image.id} />
          <Button
            size="small"
            appearance="danger"
            variant="outline"
            onClick={(e) => {
              if (!confirm("Are you sure you want to delete this image?")) {
                e.preventDefault()
              }
            }}
          >
            <DeleteIcon className="mr-2" />
            Delete
          </Button>
        </Form>
      </div>
    </>
  )
}
