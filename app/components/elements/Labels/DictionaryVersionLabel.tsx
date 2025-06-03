type DictionaryVersionLabelProps = {
  dchpVersion?: string | null
}

export default function DictionaryVersionLabel({
  dchpVersion,
}: DictionaryVersionLabelProps) {
  const color =
    dchpVersion === "dchp1"
      ? "border-amber-300 bg-amber-50"
      : dchpVersion === "dchp2"
      ? "border-gray-200 bg-gray-100"
      : "border-green-300 bg-green-50"

  return (
    <div
      className={`inline-block w-12 border text-center ${color} mr-2 px-1 py-0 text-xs uppercase text-gray-700 shadow-sm`}
    >
      {dchpVersion}
    </div>
  )
}
