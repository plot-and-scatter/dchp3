// DCHP-2: project team
// Ported from the DCHP-2 (2017) CakePHP templates via tidy; text unchanged.
// The 2017 site had this as its own page (/pages/team); it was folded into
// an About page in the first port and split out again (issue 530).
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"

export default function Dchp2ProjectTeam() {
  return (
    <TextPageMain>
      <PageHeader>Project Team</PageHeader>

      <p>
        <strong>Editor-in-Chief</strong>
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>Stefan Dollinger</li>
      </ul>
      <p>
        <strong>Associate editor</strong>
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>Margery Fee</li>
      </ul>
      <strong>Drafting editors</strong>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>
          Baillie Ford ( 2015-17 &amp; 2013; lab manager Sept. - Dec. 2013)
        </li>
        <li>Alexandra Gaylie (2014-17; lab manager June 2014 - May 2016)</li>
        <li>Emily Briggs (2013-14; lab manager May - Sept. 2014)</li>
        <li>Gabrielle Lim (2012-14; lab manager Sept. 2012 - April 2014)</li>
      </ul>
      <p>
        <strong>Proofreader</strong>
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>Nancy Tinari</li>
      </ul>
      <p>
        <strong>Programming</strong>
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>Jeremy Hewett (2012-17)</li>
        <li>Frank Hangler (2008-12)</li>
        <li>David Kennedy (2008-10)</li>
        <li>Matthew Gruman (2007-08)</li>
        <li>Usman Khan (2007)</li>
      </ul>
      <p>
        <strong>Quotation selection and extraction</strong>
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>Caitlin Bethune</li>
        <li>Emily Briggs</li>
        <li>Laurel Brinton</li>
        <li>Faerie Cabrera</li>
        <li>Cicily Cooper</li>
        <li>Michelle Chu</li>
        <li>Sam Chung</li>
        <li>Jona Dervishaj</li>
        <li>Mark Douglas</li>
        <li>Tara Downs</li>
        <li>Baillie Ford</li>
        <li>Alexandra Gaylie</li>
        <li>Jocelyn Hassell</li>
        <li>Javier Ibanez</li>
        <li>Laura Kuboniwa</li>
        <li>Breanna Laing</li>
        <li>Kendi Lam</li>
        <li>Izabela Lazar</li>
        <li>Katrina Lo</li>
        <li>Adrienne Lee</li>
        <li>Emma Lee</li>
        <li>Gabrielle Lim</li>
        <li>Helen Lui</li>
        <li>Dorota Lockyer</li>
        <li>Molika Loshi</li>
        <li>Margarita Manabat</li>
        <li>Ana Martic</li>
        <li>Janice McAlpine</li>
        <li>Geoff Roeder</li>
        <li>Jim Shaw</li>
        <li>Hanami Shirai</li>
        <li>Yanush Sierra</li>
        <li>Jessica Tam</li>
        <li>Evgenia Todorova</li>
        <li>Phoebe Wong</li>
        <li>Frank Yang</li>
      </ul>
      <p>
        <strong>Volunteers</strong>
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>Christine Barker</li>
        <li>Damon Barta</li>
        <li>Baillie Ford</li>
        <li>Sheldon Goldfarb</li>
        <li>Ashley Gonzalez</li>
        <li>Izabela Lazar</li>
        <li>Ana Martic</li>
        <li>Matthew Parisien</li>
        <li>Geoff Roeder</li>
        <li>Diane Singleton</li>
      </ul>
      <span id="goback" />
    </TextPageMain>
  )
}
