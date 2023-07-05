import { type LoadedDataType } from "~/routes/entries/$headword"

interface EntryProps {
  data: LoadedDataType
}

const Entry = ({ data }: EntryProps): JSX.Element => {
  // TODO: replace array contents with legitimate links
  const testUrlArray = [...Array(3)].map((elm) => {
    return "https://picsum.photos/300/200"
  })

  return (
    <>
      <div className="flex flex-col">
        <h1 className="mb-5 text-2xl font-bold">Images</h1>
        {testUrlArray.map((imageUrl) => {
          return (
            <div className="m-5" key={imageUrl + " div"}>
              <img className="m-3" key={imageUrl} src={imageUrl} alt="" />
              <h3>Caption for the above URL</h3>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Entry
