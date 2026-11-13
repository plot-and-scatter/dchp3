// DCHP-1: home (welcome text)
// Ported from the DCHP-1 Online CakePHP templates (2013); text unchanged.
import { Link } from "~/components/elements/LinksAndButtons/Link"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"

export default function Dchp1Home() {
  return (
    <TextPageMain>
      <PageHeader>
        Welcome to <em>DCHP-1 Online</em>
      </PageHeader>

      <p>
        This is the online edition of{" "}
        <strong>
          <em>A Dictionary of Canadianisms on Historical Principles</em>
        </strong>{" "}
        based on the first edition of the dictionary, published by Gage
        Educational Publishing in 1967 under the editorship of Walter S. Avis
        (editor-in-chief), Charles Crate, Patrick Drysdale, Douglas Leechman and
        Matthew H. Scargill. See{" "}
        <Link to="/pages/copyright-notice">Copyright Notice</Link>.
      </p>

      <p>
        As an historical dictionary, this work shows changes in the meanings of
        words over time, using a series of dated quotations to illustrate these
        shifts. For the sake of historical completeness, it includes words that
        have become obsolete or outdated. DCHP-1 Online has 9,900 headwords,
        with 13,400 meanings, which are illustrated by 31,400 quotations from
        1505 to 1965, and 115 original drawings. Note that some obsolete words
        or dated descriptions may not be consistent with modern standards of
        usage.
      </p>

      <p>
        In the production of this online edition, the original print dictionary
        was scanned, tagged and uploaded into a custom-built online environment.
        The changes required by this shift of medium are described in the
        section <Link to="/how-to-use">How to Use</Link>. Apart from minor
        corrections in bibliographic references and quotations, the first
        edition was not altered in any way.
      </p>

      <p>
        For a brief history of DCHP in all its guises since the 1950s, see{" "}
        <Link to="/pages/history">Project History</Link>.
      </p>

      <hr />

      <p>
        The project was carried out by the{" "}
        <a href="http://dchp.ca" target="_blank" rel="noreferrer">
          Canadian English Lab
        </a>{" "}
        at the University of British Columbia under the leadership of Stefan
        Dollinger (editor-in-chief) with co-editors Laurel J. Brinton and
        Margery Fee. For a complete list of the team members, see{" "}
        <Link to="/pages/team">Project Team</Link>.
      </p>

      <p>
        The second, updated edition is currently being compiled and is expected
        to be completed by 2015.
      </p>

      <p>DCHP-1 Online should be cited as:</p>

      <blockquote>
        Dollinger, Stefan (editor-in-chief), Laurel J. Brinton and Margery Fee
        (eds.). 2013.{" "}
        <em>
          DCHP-1 Online: A Dictionary of Canadianisms on Historical Principles
          Online
        </em>
        . Based on Avis et al. (1967).{" "}
        <a
          href="https://dchp.arts.ubc.ca/dchp1"
          target="_blank"
          rel="noreferrer"
        >
          http://dchp.ca/DCHP-1/
        </a>
        .
      </blockquote>

      <div>
        <div>
          <strong>
            To start using the dictionary, use either “Browse” to search entries
            by letter or “Search” to enter a search word or phrase.
          </strong>
        </div>
      </div>
    </TextPageMain>
  )
}
