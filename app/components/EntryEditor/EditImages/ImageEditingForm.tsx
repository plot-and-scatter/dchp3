import EditImageForm from "~/components/EntryEditor/EditImages/EditImageForm"
import { type LoadedEntryDataType } from "../../../routes/entries/$headword"
import AddImageForm from "~/components/EntryEditor/EditImages/AddImageForm"
import EditIcon from "../../elements/Icons/EditIcon"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"

interface ImageEditingFormProps {
  data: LoadedEntryDataType
}

export default function ImageEditingForm({ data }: ImageEditingFormProps) {
  const images = data.images.sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="my-12 rounded border border-gray-400 bg-gray-50 p-4 shadow-lg">
      <div>
        <SecondaryHeader>
          <EditIcon /> Edit images
        </SecondaryHeader>
        <div className="grid grid-cols-2 gap-4">
          {images.map((image) => (
            <div
              className="rounded border border-gray-400 bg-gray-100 p-4 shadow"
              key={image.id}
            >
              <EditImageForm entry={data} image={image} />
            </div>
          ))}
          <div
            className="rounded border border-success-400 bg-success-50 p-4 shadow"
            key={"add-image"}
          >
            <AddImageForm entry={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
