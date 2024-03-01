import { EntryImage } from "./EntryImage"
import { type LoadedEntryDataType } from "~/routes/entries/$headword"

const EntryImages = ({ data }: { data: LoadedEntryDataType }): JSX.Element => {
  const images = data.images.sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Images</h1>
      <div className="flex flex-col items-center justify-around">
        {images.map((image) => (
          <EntryImage key={image.id} image={image} />
        ))}
      </div>
    </div>
  )
}

export default EntryImages
