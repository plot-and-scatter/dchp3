import SanitizedTextSpan from "../SanitizedTextSpan"

interface generalLabelsProps {
  generalLabels: string | undefined
}

const GeneralLabels = ({ generalLabels }: generalLabelsProps): JSX.Element => {
  const authenticated: boolean = true // TODO: use authentication variable
  if (!generalLabels && !authenticated) return <></>

  return (
    <p className="mb-0">
      <span className="ml-3 italic">
        <SanitizedTextSpan text={generalLabels} />
      </span>
    </p>
  )
}

export default GeneralLabels
