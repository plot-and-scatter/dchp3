import { useHref } from "react-router"
// DCHP-1: copyright notice
// Ported from the DCHP-1 Online CakePHP templates (2013); text unchanged.
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"

export default function Dchp1CopyrightNotice() {
  return (
    <TextPageMain>
      <PageHeader>Copyright Notice</PageHeader>

      <p>
        <em>DCHP-1 Online</em> is a digital version of{" "}
        <em>DCHP-1: A Dictionary of Canadianisms on Historical Principles</em>,
        ed. by Walter S. Avis, Charles Crate, Patrick Drysdale, Douglas Leechman
        and Matthew H. Scargill (editor until 1960: Charles J. Lovell),
        published in 1967 by Gage Educational Publishing Company in Toronto. A
        1991 reprint of DCHP-1 was issued.
      </p>

      <p>
        The copyright pages of the 1991 work are shown{" "}
        <a
          href={useHref("/files/DCHP-1_Copyright.pdf")}
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        .
      </p>

      <p>
        Per licensing agreement between UBC and the copyright holder of DCHP-1,
        Nelson Education Ltd., signed Oct 1st, 2012, DCHP-1 Online is made
        available free of charge on the internet. The user is advised that this
        license does <strong>not</strong> include the reposting or
        redistribution of DCHP-1 or part of DCHP-1 by third parties. Reposting
        of content is governed by copyright laws and require express permission
        by Nelson Education Ltd.
      </p>
    </TextPageMain>
  )
}
