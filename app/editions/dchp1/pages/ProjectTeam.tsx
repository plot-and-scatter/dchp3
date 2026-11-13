// DCHP-1: project team
// Ported from the DCHP-1 Online CakePHP templates (2013); text unchanged.
// The 2013 site had this as its own page (/pages/team); it was folded into
// an About page in the first port and split out again (issue 530).
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"

export default function Dchp1ProjectTeam() {
  return (
    <TextPageMain>
      <PageHeader>Project Team</PageHeader>

      <p>
        DCHP-1 Online was automatically scanned by{" "}
        <a
          href="http://www.library.ubc.ca/archives/"
          target="_blank"
          rel="noreferrer"
        >
          UBC Archives
        </a>{" "}
        and then proofread and adapted for the online environment by work-study
        students from May 2010 to July 2011:
      </p>

      <SecondaryHeader>Editor-in-Chief:</SecondaryHeader>
      <p>Stefan Dollinger</p>

      <SecondaryHeader>Co-Editors</SecondaryHeader>
      <p>Laurel J. Brinton</p>
      <p>Margery Fee</p>

      <SecondaryHeader>Proofreaders:</SecondaryHeader>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>Katrina Lo (lab supervisor 2010)</li>
        <li>Kendi Lam (lab supervisor 2011)</li>
        <li>Caitlin Bethune</li>
        <li>Laura Kuboniwa</li>
        <li>Jim Shaw</li>
        <li>Hanami Shirai</li>
        <li>Helen Lui</li>
        <li>Faerie Cabrera</li>
        <li>Emma Lee</li>
        <li>Evgenia Todorova</li>
        <li>Geoff Roeder</li>
        <li>Damon Barta</li>
        <li>Margarita Manabat</li>
        <li>Stefan Dollinger</li>
        <li>Laurel Brinton</li>
        <li>Margery Fee</li>
      </ul>

      <SecondaryHeader>Programmers:</SecondaryHeader>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>Frank Hangler</li>
        <li>David Kennedy</li>
      </ul>

      <SecondaryHeader>UBC Archives:</SecondaryHeader>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>Chris Hives</li>
        <li>Leslie Fields</li>
      </ul>

      {/* The 2013 page ended with a sentence linking to an external list of
          people; removed at the editorial team's request (issue 523). */}
    </TextPageMain>
  )
}
