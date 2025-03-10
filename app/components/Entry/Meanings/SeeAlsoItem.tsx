import { NavLink } from "@remix-run/react"
import { type MeaningType } from "./Meaning"

export type SeeAlso = MeaningType["seeAlso"][0]

interface SeeAlsoProps {
  seeAlso: SeeAlso
}

export default function SeeAlsoItem({ seeAlso }: SeeAlsoProps) {
  return (
    <span>
      <NavLink
        className={`text-sm font-bold uppercase tracking-widest text-primary underline hover:text-primary-dark md:text-base md:tracking-wider`}
        to={`/entries/${seeAlso.entry.headword}`}
        prefetch="intent"
      >
        {seeAlso.entry.headword}
        {seeAlso.entry.is_public ? "" : " [Draft]"}
      </NavLink>
      {seeAlso.linknote && <span className="ml-1">{seeAlso.linknote}</span>}
    </span>
  )
}
