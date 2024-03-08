import { Form } from "@remix-run/react"
import Input from "~/components/bank/Input"
import LabelledField from "~/components/bank/LabelledField"
import Button from "~/components/elements/LinksAndButtons/Button"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import { attributeEnum } from "../attributeEnum"

type EditImageFormProps = {
  entry: LoadedEntryDataType
  image: LoadedEntryDataType["images"][0]
}

export default function EditImageForm({ entry, image }: EditImageFormProps) {
  return (
    <>
      <Form
        method="post"
        reloadDocument={true}
        action={`/entries/${entry.headword}/edit`}
      >
        <input
          type="hidden"
          name="attributeType"
          value={attributeEnum.EDIT_IMAGE}
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
          />
        </div>
      </Form>
      <img
        className="shadow-md"
        src={image.path}
        alt={image.caption || "Caption unavailable"}
      />
      <div className="mt-4 flex items-center">
        <Form
          method="post"
          reloadDocument={true}
          action={`/entries/${entry.headword}/edit`}
        >
          <input
            type="hidden"
            name="attributeType"
            value={attributeEnum.DELETE_IMAGE}
          />
          <input type="hidden" name="imageId" value={image.id} />
          <Button
            size="small"
            appearance="danger"
            onClick={(e) => {
              if (!confirm("Are you sure you want to delete this image?")) {
                e.preventDefault()
              }
            }}
          >
            Delete
          </Button>
        </Form>
      </div>
    </>
  )
}
