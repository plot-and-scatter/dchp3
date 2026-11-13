// DCHP-1: how to use
// Ported from the DCHP-1 Online CakePHP templates (2013); text unchanged.
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"
import FrontmatterImage from "~/components/elements/Images/FrontmatterImage"
import scan1 from "../images/scan1.png"
import scan2 from "../images/scan2.png"
import scan3 from "../images/scan3.png"
import bib from "../images/bib.gif"
import scan4 from "../images/scan4.png"
import legacySite from "../images/legacy-site-2013.png"
import LegacySiteNote from "../../LegacySiteNote"

export default function Dchp1HowToUse() {
  return (
    <TextPageMain>
      <PageHeader>How To Use</PageHeader>

      <LegacySiteNote
        siteName="DCHP-1 Online"
        releasedIn={2013}
        screenshot={legacySite}
      />

      <p>
        The menu bar on the left screen offers the reader two viewing modes for
        DCHP-1 Online. <a href="#browsing">Browsing</a> and full-text{" "}
        <a href="#searching">Searching</a>, “quicksearch”.{" "}
        <a href="#show-reference">Show reference</a> explains how to call up a
        citation’s reference. Differences between the paper version and DCHP-1
        Online are shown <a href="#differences">here</a>.
      </p>

      <span id="browsing" />
      <SecondaryHeader>Browsing</SecondaryHeader>

      <p>
        Browsing allows the user to access the online version in a similar way
        to the paper version. Headwords are listed in alphabetical order in a
        ‘short view’ mode, with the option to ‘Expand +’, i.e. show all
        meanings, or to directly ‘Go to full entry’. For the example, below the
        entry for safety touch is shown in the abbreviated view:
      </p>

      <FrontmatterImage src={scan1} alt="" />

      <p>
        <strong>
          Safety touch: abbreviated view in browse or search modes
        </strong>
      </p>

      <p>
        Clicking ‘Expand +’ produces the term’s second meaning, i.e. “2. the two
        points conceded on such play.”:
      </p>

      <FrontmatterImage src={scan2} alt="" />

      <p>
        <strong>Safety touch with “Expand +” button clicked</strong>
      </p>

      <p>
        Clicking “Go to full entry &gt;” produces the entire dictionary entry
        for <strong>safety touch</strong>:
      </p>

      <FrontmatterImage src={scan3} alt="" />

      <p>
        The full entry displays the headword, all regional and usage labels (in
        this case Canadian Football, as a register label), followed by meanings
        and definitions, by cross references – in this case:{" "}
        <strong>rouge ((n.)) (def. 1)</strong> – and the dated citations as
        linguistic evidence.
      </p>

      <span id="searching" />
      <SecondaryHeader>Searching</SecondaryHeader>

      <p>
        A search window is shown in the top-left corner (“quicksearch”). This
        function is retrieving all text strings in three contexts: in{" "}
        <strong>headwords</strong>, <strong>citations</strong> and in{" "}
        <strong>other text</strong>, the latter category means anywhere else in
        the dictionary entries (such as in meanings, etymologies, fist notes or
        in usage labels, …) but neither in headwords nor in citations. Search
        terms are highlighted in <span>red</span>. After a search, the red
        highlighting can be undone by pressing the “refresh” button of your
        browser.
      </p>

      <p>
        The search installed here is simple and straightforward. It is blind to
        letter case and blank spaces. For instance, a search for “rouge”
        produces all terms, sorted in the three categories headwords, citations
        and ‘other text’, that contain the character string. Results are
        displayed in alphabetical order. For a search of “rouge”, the results in
        headwords are:
      </p>

      <blockquote className="my-4 ml-8">
        <strong>
          barouge, bois rouge, bonnet rouge, Parti Rouge, Rouge, rouge ((n.)),
          rouge ((v.)), Rouge party
        </strong>
      </blockquote>

      <p>
        These eight headwords are followed by 44 quotations and 3 definitions
        containing the character string. Simple scrolling will quickly produce
        the desired term.
      </p>

      <span id="show-reference" />
      <SecondaryHeader>Show reference</SecondaryHeader>

      <p>
        Clicking on the book symbol after each citation,{" "}
        <img src={bib} alt="" className="inline" />, produces the full
        bibliographic reference, which is shown in Scan 4 for the 1904 citation
        of Scan 3, Meaning 1.
      </p>

      <FrontmatterImage src={scan4} alt="" />

      <span id="differences" />
      <SecondaryHeader>
        Differences between paper and online editions
      </SecondaryHeader>

      <p>
        DCHP-1 Online is a web-based version of a historical document. As a
        general rule, DCHP-1 Online is a precise replication of DCHP-1, with all
        its shortcomings, that exploits the advantages of a digital environment.
        No attempts were made to correct or update the original work. DCHP-1
        Online includes, therefore, terms and perspectives that are out of date
        today or would need to be marked by different usage labels, e.g.{" "}
        <strong>Eskimo†</strong>.
      </p>

      <p>
        <strong>Five main changes must be addressed:</strong>
      </p>

      <p>
        First, the bibliography, formerly divided into periodicals and book
        publications and listed at the end of the book, has been integrated with
        the citations. A citation is the dated, textual evidence that is listed
        in chronological order for each meaning. Each citation, by link via the
        book symbol, <img src={bib} alt="" className="inline" />, features the
        same bibliographical record in hyperlinked form as the print edition.
        Here some obvious errors of referencing were corrected.
      </p>

      <p>
        Second, DCHP-1 Online’s browsing mode displays the words similarly to
        the paper format. However, DCHP-1 Online uses “electronic” ordering,
        listing punctuation before alphabetical signs. Punctuation and capital
        letters are treated differently. For instance, the beginning of letter
        “S” shows the alphabetic sequence of the headwords in the following way:
      </p>

      <blockquote className="my-4 ml-8">
        <p>DCHP-1 Paper starts with the following headwords:</p>
        <p>
          <strong>
            Sabine(‘s) gull, sablefish, Sable Island pony, sac à commis,
            saccacommi(s), sachem†
          </strong>
        </p>
        <p>DCHP-1 Online shows this sequence:</p>
        <p>
          <strong>
            S.D., S.S., S.S.B., Sabine(‘s) gull, Sable Island pony, sablefish,
            sac à commis, saccacommi(s), sachem†
          </strong>
        </p>
      </blockquote>

      <p>
        Punctuation is given preference (<strong>S.D.</strong>,{" "}
        <strong>S.S.</strong>, and <strong>S.S.B.</strong> are ranked first), as
        is upper case (hence Sable Island pony occurs before sablefish).
      </p>

      <p>
        Three, headwords use double round parentheses, (( )), to distinguish
        different meanings of the same word, as in the case of{" "}
        <strong>
          kiack<sup>1</sup>
        </strong>{" "}
        and{" "}
        <strong>
          kiack<sup>2</sup>
        </strong>
        , now rendered as <strong>kiack ((1))</strong> and{" "}
        <strong>kiack ((2))</strong>. Double parentheses are also used to
        distinguish the part of speech of otherwise identical headwords, e.g.{" "}
        <strong>Canuck ((n.))</strong> and <strong>Canuck ((adj.))</strong>.
      </p>

      <p>
        Four, to economize on space, the paper DCHP-1 makes use of the “See”
        device (as well as q.v., cf., cp.) to refer to terms and definitions
        that occur elsewhere in the text. DCHP-1 Online maintains all references
        to related terms with the “See also” hyperlink tool, but also repeats
        the definition in all relevant locations.
      </p>

      <p>
        Five, the rare pronunciation transcriptions were omitted. They are
        identical to those in the Gage Canadian Dictionary (1997).
      </p>
    </TextPageMain>
  )
}
