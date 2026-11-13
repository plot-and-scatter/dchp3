import { Fragment, type ComponentType } from "react"
import type { EditionId } from "./edition"

import Dchp3Home from "./dchp3/pages/Home"
import Dchp3About from "./dchp3/pages/About"
import Dchp3HowToUse from "./dchp3/pages/HowToUse"
import Dchp3Acknowledgements from "./dchp3/pages/Acknowledgements"

import Dchp1Home from "./dchp1/pages/Home"
import Dchp1ProjectHistory from "./dchp1/pages/ProjectHistory"
import Dchp1ProjectTeam from "./dchp1/pages/ProjectTeam"
import Dchp1HowToUse from "./dchp1/pages/HowToUse"
import Dchp1Frontmatter from "./dchp1/pages/Frontmatter"
import Dchp1Abbreviations from "./dchp1/pages/Abbreviations"
import Dchp1CopyrightNotice from "./dchp1/pages/CopyrightNotice"

import Dchp2Home from "./dchp2/pages/Home"
import Dchp2ProjectHistory from "./dchp2/pages/ProjectHistory"
import Dchp2ProjectTeam from "./dchp2/pages/ProjectTeam"
import Dchp2HowToUse from "./dchp2/pages/HowToUse"
import Dchp2Foreword from "./dchp2/pages/Foreword"
import Dchp2Acknowledgements from "./dchp2/pages/Acknowledgements"

// Everything that differs between editions and is not data lives here: the
// titles, the front matter pages, the nav links to them, and which search
// filters make sense. Routes stay the same across editions; a route whose
// page an edition does not have (say /acknowledgements on DCHP-1) 404s.
//
// Front matter pages are plain components under app/editions/<id>/pages.
// The ones with routes of their own (home, about, how-to-use,
// acknowledgements) are keyed by fixed slugs so those routes can find them;
// extra pages are served by /pages/<slug>. The archives have no About page,
// as the 2013 and 2017 sites had none.

export type EditionNavLink = {
  to: string
  label: string
  // A Font Awesome class, e.g. "fa-circle-info".
  icon: string
}

export type EditionConfig = {
  id: EditionId
  // "DCHP-1", used in page titles and the compact header.
  shortName: string
  // The header's full title: the dictionary name and an edition mark.
  headerTitle: React.ReactNode
  // Tailwind background class for the header bar, so each edition is told
  // apart at a glance (staging still overrides it with amber). Full class
  // names, not fragments, so Tailwind's scanner keeps them.
  headerBackground: string
  // Archive editions sit the page and nav on a very light tint of the header
  // colour. The palette's light greys (slate, a cool blue-grey) would clash,
  // so the five steps replace gray-50/100/200/300/400: root.tsx sets them as
  // the --gray-* variables that tailwind.config.js resolves those shades
  // through. DCHP-3 leaves it unset (white page, slate greys).
  tints?: {
    page: string
    50: string
    100: string
    200: string
    300: string
    400: string
  }
  // Values of det_entries.dchp_version this edition's database holds. DCHP-3
  // holds all of them; an archive holds only its own.
  databases: { label: string; value: string }[]
  // DCHP-1's meanings carry no Canadianism type, so the type filter would
  // hide everything; the search form hides the filter and the queries skip
  // it.
  hasCanadianismTypes: boolean
  navLinks: EditionNavLink[]
  pages: Record<string, ComponentType>
}

const DCHP3: EditionConfig = {
  id: "dchp3",
  shortName: "DCHP-3",
  headerBackground: "bg-gray-700",
  headerTitle: (
    <Fragment>
      Dictionary of Canadianisms on Historical Principles{" "}
      <span className="italic">
        3<sup>rd</sup> Edition
      </span>
    </Fragment>
  ),
  databases: [
    { label: "DCHP-1", value: "dchp1" },
    { label: "DCHP-2", value: "dchp2" },
    { label: "DCHP-3", value: "dchp3" },
    { label: "DCHP-3.1", value: "dchp3.1" },
  ],
  hasCanadianismTypes: true,
  navLinks: [
    { to: "/about", label: "About", icon: "fa-circle-info" },
    { to: "/how-to-use", label: "How to use", icon: "fa-book" },
    { to: "/references", label: "References", icon: "fa-book" },
  ],
  pages: {
    home: Dchp3Home,
    about: Dchp3About,
    "how-to-use": Dchp3HowToUse,
    acknowledgements: Dchp3Acknowledgements,
  },
}

const DCHP1: EditionConfig = {
  id: "dchp1",
  shortName: "DCHP-1",
  // amber-900 is the palette's nearest brown.
  headerBackground: "bg-amber-900",
  tints: {
    page: "#f9f6f2",
    50: "#faf7f3",
    100: "#f1eae2",
    200: "#e3d8cb",
    300: "#d2c2b0",
    400: "#b9a48c",
  },
  headerTitle: (
    <Fragment>
      Dictionary of Canadianisms on Historical Principles{" "}
      <span className="italic">Online (1967)</span>
    </Fragment>
  ),
  databases: [{ label: "DCHP-1", value: "dchp1" }],
  hasCanadianismTypes: false,
  navLinks: [
    // The 2013 site's menu, in its order; it had no About page.
    {
      to: "/pages/history",
      label: "Project History",
      icon: "fa-clock-rotate-left",
    },
    { to: "/pages/team", label: "Project Team", icon: "fa-users" },
    { to: "/how-to-use", label: "How to use", icon: "fa-book" },
    { to: "/pages/abbreviations", label: "Abbreviations", icon: "fa-list" },
    { to: "/pages/frontmatter", label: "Frontmatter (1967)", icon: "fa-book" },
    {
      to: "/pages/copyright-notice",
      label: "Copyright Notice",
      icon: "fa-copyright",
    },
  ],
  pages: {
    home: Dchp1Home,
    history: Dchp1ProjectHistory,
    team: Dchp1ProjectTeam,
    "how-to-use": Dchp1HowToUse,
    frontmatter: Dchp1Frontmatter,
    abbreviations: Dchp1Abbreviations,
    "copyright-notice": Dchp1CopyrightNotice,
  },
}

// DCHP-2's pages are the 2017 site's: the welcome page as home, the
// "Introduction to DCHP-2" as how-to-use (that is what the old nav called
// it), the two forewords, acknowledgements, and history + team as about.
const DCHP2: EditionConfig = {
  id: "dchp2",
  shortName: "DCHP-2",
  headerBackground: "bg-green-800",
  tints: {
    page: "#f3f8f4",
    50: "#f4f9f5",
    100: "#e3efe7",
    200: "#cfe3d6",
    300: "#b5d2c0",
    400: "#8fb9a0",
  },
  headerTitle: (
    <Fragment>
      Dictionary of Canadianisms on Historical Principles{" "}
      <span className="italic">
        2<sup>nd</sup> Edition (2017)
      </span>
    </Fragment>
  ),
  // The 2017 edition is DCHP-1's entries plus its own; the lift stamps them
  // dchp1 and dchp2 by is_legacy, so both can be filtered, as in DCHP-3.
  databases: [
    { label: "DCHP-1", value: "dchp1" },
    { label: "DCHP-2", value: "dchp2" },
  ],
  hasCanadianismTypes: true,
  navLinks: [
    // The 2017 site had no About page; Project Team and Project History
    // were pages of their own, as here.
    { to: "/how-to-use", label: "Introduction", icon: "fa-book" },
    { to: "/pages/foreword", label: "Foreword", icon: "fa-book" },
    {
      to: "/acknowledgements",
      label: "Acknowledgements",
      icon: "fa-people-group",
    },
    { to: "/pages/team", label: "Project Team", icon: "fa-users" },
    {
      to: "/pages/history",
      label: "Project History",
      icon: "fa-clock-rotate-left",
    },
  ],
  pages: {
    home: Dchp2Home,
    history: Dchp2ProjectHistory,
    team: Dchp2ProjectTeam,
    "how-to-use": Dchp2HowToUse,
    acknowledgements: Dchp2Acknowledgements,
    foreword: Dchp2Foreword,
  },
}

export const EDITIONS: Record<EditionId, EditionConfig> = {
  dchp1: DCHP1,
  dchp2: DCHP2,
  dchp3: DCHP3,
}

export const getEditionConfig = (id: EditionId) => EDITIONS[id]
