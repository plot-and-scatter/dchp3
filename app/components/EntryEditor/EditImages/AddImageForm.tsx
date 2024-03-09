import { Form } from "@remix-run/react"
import { useState } from "react"
import Input from "~/components/bank/Input"
import LabelledField from "~/components/bank/LabelledField"
import Button from "~/components/elements/LinksAndButtons/Button"
import type { LoadedEntryDataType } from "~/routes/entries/$headword"
import { EntryEditorFormActionEnum } from "../EntryEditorForm/EntryEditorFormActionEnum"

type AddImageFormProps = {
  entry: LoadedEntryDataType
}

export default function AddImageForm({ entry }: AddImageFormProps) {
  const maxImageOrder = Math.max(entry.images.sort((i) => i.order || 0)) + 1

  const [fileName, setFileName] = useState<string>()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      //   const reader = new FileReader()
      //   reader.readAsText(file)
      //   reader.onload = async () => {
      //     try {
      //       const data = await validateFile((reader.result as string) || '')
      //       console.log(data)
      //       fileIsValidCallback?.(true)
      //     } catch (e) {
      //       setFileError((e as any).message)
      //       fileIsValidCallback?.(false)
      //     }
      //   }
    }
  }

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      className="flex flex-col gap-y-2"
    >
      <input
        type="hidden"
        name="attributeType"
        value={EntryEditorFormActionEnum.ADD_IMAGE}
      />
      <input type="hidden" name="entryId" value={entry.id} />
      <h3 className="text-2xl font-bold">New image</h3>
      <LabelledField
        breakAfterLabel
        label="Order"
        field={
          <Input name="order" type="number" defaultValue={maxImageOrder} />
        }
      />
      <LabelledField
        breakAfterLabel
        label="Caption"
        field={<Input name="caption" />}
      />
      <>
        <div className="mt-2 flex flex-row items-center gap-x-4">
          <label
            className="block w-fit cursor-pointer rounded border border-gray-700 py-2 px-4 font-semibold transition-colors"
            htmlFor="imageFile"
          >
            <i className="fa-sharp fa-regular fa-file-csv mr-2" /> Choose an
            image file
          </label>
          {fileName}
        </div>
        <input
          hidden
          onChange={handleFileChange}
          id="imageFile"
          type="file"
          accept="image/*"
          name="imageFile"
          className="hidden"
        />
        <div className="text-right">
          <Button appearance="success" disabled={fileName === undefined}>
            Save image
          </Button>
        </div>
      </>
    </Form>
  )
}
