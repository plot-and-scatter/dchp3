import SanitizedTextSpan from "../SanitizedTextSpan"

interface alternativesProps {
  alternatives: string | undefined
}

const Alternatives = ({ alternatives }: alternativesProps): JSX.Element => {
  const authenticated: boolean = true // TODO: use authentication variable
  if (!alternatives && !authenticated) return <></>

  return (
    <>
      {alternatives && (
        <h2 className="leading-tight text-gray-700 md:text-xl">
          <span className="text-gray-500">Spelling variants:</span>{" "}
          <span className="italic">
            <SanitizedTextSpan text={alternatives} />
          </span>
        </h2>
      )}
    </>
  )
}

export default Alternatives
