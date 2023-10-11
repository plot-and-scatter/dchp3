import { type LoadedDataType } from "~/routes/entries/$headword"
import EntryReference from "./EntryReference"
import type { SerializeFrom } from "@remix-run/server-runtime"

const EntryReferences = ({
  data,
}: {
  data: SerializeFrom<LoadedDataType>
}): JSX.Element => {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">References</h1>
      <div className="items-left mb-4 flex flex-col justify-around">
        <ul className="list-disc pl-4">
          {data.referenceLinks.map((referenceLink) => (
            <EntryReference
              key={referenceLink.id}
              referenceLink={referenceLink}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default EntryReferences
