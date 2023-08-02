import SanitizedTextSpan from "../SanitizedTextSpan"

interface generalLabelsProps {
  generalLabels: string | undefined
}

const GeneralLabels = ({ generalLabels }: generalLabelsProps): JSX.Element => {
  const authenticated: boolean = true // TODO: use authentication variable
  if (!generalLabels && !authenticated) return <></>

  return (
    <p>
      <span className="ml-3 italic">
        <SanitizedTextSpan text={generalLabels || "-- none --"} />
      </span>
    </p>
  )
}

export default GeneralLabels
