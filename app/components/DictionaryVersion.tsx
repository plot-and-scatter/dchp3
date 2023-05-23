import React from "react"

interface DictionaryVersionProps {
  isLegacy: boolean
}

const DictionaryVersion = ({
  isLegacy,
}: DictionaryVersionProps): JSX.Element => {
  const color = isLegacy
    ? "border-amber-300 bg-amber-200"
    : "border-slate-200 bg-slate-100"
  const text = isLegacy ? "DCHP-1 (pre-1967)" : "DCHP-2 (Dec 2016)"

  return (
    <div
      className={`border ${color} py-1 px-2 text-xs text-slate-700 shadow-sm md:px-4 md:text-sm`}
    >
      {text}
    </div>
  )
}

export default DictionaryVersion
