import { type LoadedDataType } from "~/routes/entries/$headword"
import { EntryImage } from "./EntryImage"

const EntryImages = ({ data }: { data: LoadedDataType }): JSX.Element => {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Images</h1>
      <div className="flex flex-col items-center justify-around">
        {data.images.map((image) => (
          <EntryImage key={image.id} image={image} />
        ))}
      </div>
    </div>
  )
}

export default EntryImages
