import SanitizedTextSpan from "../SanitizedTextSpan"

interface etymologyProps {
  etymology: string | undefined
}

const Etymology = ({ etymology }: etymologyProps): JSX.Element => {
  const authenticated: boolean = true // TODO: use authentication variable
  if (!etymology && !authenticated) return <></>

  return (
    <p>
      <span className="ml-3 italic">
        <SanitizedTextSpan text={etymology} />
      </span>
    </p>
  )
}

export default Etymology
