import EditImageForm from "~/components/editing/entry/EditImageForm"
import { type LoadedEntryDataType } from ".."
import AddImageForm from "~/components/editing/entry/AddImageForm"

interface ImageEditingFormProps {
  data: LoadedEntryDataType
}

export default function ImageEditingForm({ data }: ImageEditingFormProps) {
  const images = data.images.sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="my-12 p-5">
      <div>
        <h1 className="mb-5 text-2xl font-bold">Edit images</h1>
        <div className="grid grid-cols-2 gap-4">
          {images.map((image) => (
            <div className="bg-gray-200 p-4" key={image.id}>
              <EditImageForm entry={data} image={image} />
            </div>
          ))}
          <div className="bg-success-50 p-4" key={"add-image"}>
            <AddImageForm entry={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
