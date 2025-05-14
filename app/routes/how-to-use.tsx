import { Link } from "~/components/elements/LinksAndButtons/Link"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import { TertiaryHeader } from "~/components/elements/Headings/TertiaryHeader"
import FrontmatterImage from "~/components/elements/Images/FrontmatterImage"
import howToUse1 from "~/components/elements/Images/how-to-use-1.jpg"
import howToUse2 from "~/components/elements/Images/how-to-use-2.jpg"
import howToUse3 from "~/components/elements/Images/how-to-use-3.png"
import howToUse4 from "~/components/elements/Images/how-to-use-4.jpg"
import NewText from "~/components/elements/Text/NewText"
import ScrollButton from "~/components/elements/LinksAndButtons/ScrollButton"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"
import WordLink from "~/components/elements/LinksAndButtons/WordLink"

export default function Foreword() {
  return (
    <TextPageMain>
      <PageHeader>How to Use DCHP-3</PageHeader>

      <div className="my-8 flex flex-col items-start gap-y-2">
        <ScrollButton scrollToId="a-typology-of-canadianisms">
          A Typology of Canadianisms
        </ScrollButton>
        <ScrollButton scrollToId="entry-structure">
          Entry Structure
        </ScrollButton>
        <ScrollButton scrollToId="frequency-charts">
          Frequency Charts
        </ScrollButton>
        <ScrollButton scrollToId="other-charts">Other Charts</ScrollButton>
        <ScrollButton scrollToId="list-of-labels">List of Labels</ScrollButton>
        <ScrollButton scrollToId="copyright-note">Copyright Note</ScrollButton>
      </div>

      <p>
        The basic principles of entry structure remain the same as in DCHP-2
        (see here) [TK — link], though the appearance is quite different.
      </p>

      <SecondaryHeader id="a-typology-of-canadianisms">
        A Typology of Canadianisms
      </SecondaryHeader>
      <p>
        While this dictionary lists entries (headwords, lexemes), meanings are
        its smallest unit. Each meaning is assigned to one of six Types of
        Canadianism or is marked as “Non-Canadian”. The label “Non-Canadian” is
        used for meanings that were previously classified as Canadian or that
        were suspected to be Canadian but turned out to be none of our six
        types. The six types of Canadianisms are:
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>
          <strong>Type 1 &ndash; Origin</strong>: a form and its meaning were
          created in what is now Canada
        </li>
        <li>
          <strong>Type 2 &ndash; Preservation</strong>: a form or meaning that
          was once widespread in many Englishes, but is now preserved in
          Canadian English in the North American context or beyond; sometimes
          called “retention”
        </li>
        <li>
          <strong>Type 3 &ndash; Semantic Change</strong>: forms that have
          undergone semantic change in Canadian English
        </li>
        <li>
          <strong>Type 4 &ndash; Culturally Significant</strong>: forms or
          meanings that have been enshrined in the Canadian psyche and are
          widely seen as part of Canadian identity
        </li>
        <li>
          <strong>Type 5 &ndash; Frequency</strong>: forms or meanings that are
          Canadian by virtue of frequency
        </li>
        <li>
          <strong>Type 6 &ndash; Memorial</strong>: forms or meanings now widely
          considered to be pejorative
        </li>
        <li>
          <strong>Non-Canadian</strong>: forms or meanings once thought to be
          Canadian for which evidence is lacking
        </li>
      </ul>
      <p className="text-right">(Dollinger 2019: 122-23) [TK — link?]</p>

      <p>
        <strong>Type 1</strong> is a Canadianism by virtue of
        originating—entering the English language—in what is now Canada. A
        classic example is <WordLink>garburator</WordLink>; newer examples from
        this edition are
        <WordLink>hang a larry</WordLink>, <WordLink>hang a roger</WordLink>,{" "}
        <WordLink>levidrome</WordLink>, <WordLink>renovict</WordLink> and{" "}
        <WordLink>quinzhee</WordLink>. <strong>Type 2</strong> is a preservation
        in Canadian English from another variety of English, often from the UK
        but also from the US. The standard example is{" "}
        <WordLink>pencil crayon</WordLink>, once used in the US and now
        exclusively Canadian. Newer examples are <WordLink>joe job</WordLink>,
        the newly reclassified <WordLink>parkade</WordLink> and{" "}
        <WordLink>peace bond</WordLink>.
      </p>

      <p>
        <strong>Type 3</strong> is assigned when semantic change has been
        witnessed of an older form in Canadian English, where{" "}
        <WordLink>toque</WordLink> ‘a chef’s hat, a woman’s hat’ was adapted to
        a close-fitting warm winter hat or <WordLink>Canuck</WordLink>, meaning
        2b, which underwent semantic amelioration in Canada, from a term of
        abuse to a term of endearment for Anglophone Canadians (meaning 2a,
        ‘French Canadians’ did not bear such positive connotations throughout
        Canada’s history). New additions to this category include{" "}
        <WordLink>quadrex</WordLink> ‘a four-plex’, which is influenced by
        Quebec French and used to refer to other entities,{" "}
        <WordLink>soaker</WordLink> ‘a wet foot’ rather than just an alcoholic
        (US English)’ or <WordLink>social</WordLink> ‘wedding party’, which is
        common in Manitoba today.
      </p>

      <p>
        <strong>Type 4</strong> is the Culturally significant vocabulary, of
        which hockey terminology and things to do with revered Canadian
        institutions are prime contenders.{" "}
        <WordLink to="universal healthcare">Universal healthcare</WordLink> or
        hockey terminology, e.g. <WordLink>goalie mask</WordLink>, have that
        status, as do Indigenous words, e.g.{" "}
        <WordLink>culturally modified tree</WordLink>. This category includes
        those meanings of <WordLink>eh</WordLink> that are associated with
        Canadian English. As the country realigns itself out of
        Anglophone/Francophone hegemony we will see what other forms of activity
        will become associated with Canada. Newer terms include{" "}
        <WordLink>elbows up</WordLink> (meaning #2), the battle cry to avoid
        becoming a “51st state”, while meaning #1 is in the same category as a
        style of playing hockey. Other examples include{" "}
        <WordLink>poudrerie</WordLink>, as part of the Canadian (winter)
        experience, <WordLink>deke (n.)</WordLink> and{" "}
        <WordLink>deke (v.)</WordLink> as well as <WordLink>rink rat</WordLink>{" "}
        or, from local UBC student culture, <WordLink>bzzr</WordLink> ‘beer’.
      </p>

      <p>
        <strong>Type 5</strong> is a label that has been used often, as it is
        methodologically often the simplest way to establish a Canadian
        dimension in the comparative usage record. The classic examples are{" "}
        <WordLink>washroom</WordLink> ‘(public) toilet’ nationally and{" "}
        <WordLink>cube van</WordLink> ‘box-shaped (moving) truck’ in Central
        Canada. We used that criterion to declare <WordLink>chirp</WordLink>,{" "}
        <WordLink>goal suck</WordLink>, <WordLink>heat dome</WordLink>,{" "}
        <WordLink>klick</WordLink>, <WordLink>rig pig</WordLink>,{" "}
        <WordLink>substance use</WordLink> and <WordLink>quilling</WordLink>{" "}
        (meaning #2) Canadian, often in contrast to US English, in which case we
        insisted on a difference of several multiples of frequency in Canada
        compared to the US. As well, that’s how <WordLink>brown bread</WordLink>{" "}
        and <WordLink>shit disturber</WordLink> were assigned their Canadian
        labels.
      </p>

      <p>
        Finally, <strong>Type 6</strong> is the Memorial type. It’s the flipside
        of Type 4, Cultural significance, and concerns the darker aspects of
        Canada’s history. A prime example is{" "}
        <WordLink>residential school</WordLink>, the euphemism that sounds
        innocent but which exerted such brutal force with ongoing consequences
        in society today. In this edition we added{" "}
        <WordLink>maplewashing</WordLink> (meaning #1a) and{" "}
        <WordLink>pretendian</WordLink> yet we only, it seems, scratched the
        surface. As in DCHP-2, Type 6 - Memorial is the least developed, which
        would offer an approach for the next edition.
      </p>

      <SecondaryHeader id="entry-structure">Entry Structure</SecondaryHeader>

      <p>
        The entry structure follows the established order from DCHP-2. The left
        margin now shows the available meanings with hyperlinks. A time stamp on
        the top right assigns the entry an edition (DCHP-1, DCHP-2 or DCHP-3)
        and adds the date, if available, when the entry was first begun.
      </p>

      <FrontmatterImage
        src={howToUse1}
        alt="A screenshot of the DCHP-3 entry for 'stagette', with parts of the headword labelled"
      />

      <p>
        The quotations paragraph continues for meaning #1, before meaning #2
        begins. In the pictured example of <WordLink>stagette</WordLink>,
        meaning #2 has a “dagger”, which signifies that it is not Canadian but
        listed here for contextualization.
      </p>

      <FrontmatterImage
        src={howToUse2}
        alt="A screenshot of the DCHP-3 entry for 'stagette', further down the page, with parts of the meaning labelled"
      />

      <p>
        The quotations come from Canadian sources or Canadian speakers. The
        bibliographic details are shown with a click on the book symbol. A
        hyperlink to the sources is provided where available, though these
        sources are often behind paywalls for which users would require access,
        which is perhaps available through their research institutions or public
        libraries.
      </p>

      <p>
        In rare cases we include non-Canadian quotations, which are enclosed by
        square brackets, such as this 2005 quotation from{" "}
        <WordLink>atmospheric river</WordLink>, which is from a US source:
      </p>

      <FrontmatterImage
        src={howToUse3}
        alt="A screenshot of the DCHP-3 entry for 'atmospheric river', with a non-Canadian quotation shown in square brackets"
      />

      <p>
        Returning to stagette, once the quotation paragraph is finished for
        meaning #2, the References and Images sections follow, as seen below.
        Any source mentioned is offered here and, where available, linked.
        Finally, all visuals referred to in the Word Story and other editorial
        texts (e.g. fist notes) are listed. First any frequency charts are
        listed (if available), followed by any pictures (if available).
      </p>

      <FrontmatterImage
        src={howToUse4}
        alt="A screenshot of the DCHP-3 entry for 'stagette', focusing on the References section"
      />

      <SecondaryHeader id="frequency-charts">Frequency Charts</SecondaryHeader>

      <p>
        For <em>stagette</em>, we show an international frequency chart.
      </p>

      <p>
        The frequency charts follow the established model (Dollinger 2016), only
        this time normalized “the” was used, which has proven to be more
        reliable than the modal verb “could”. The precise search terms are
        always shown in the chart headings. Multi-part words were always
        searched for with quotation marks, so the chart for entry “
        <em>were dinged</em>” was created by entering:
      </p>

      <p className="border border-gray-500 bg-gray-50 p-2 px-4">
        “were dinged” site:.ca --&gt; followed by other site searches, e.g.
        site:.edu
      </p>

      <p>
        In this case, the frequency chart for <WordLink>ding</WordLink> managed
        to discriminate the many different meanings and isolate meaning #1, the
        only one with a distinct Canadian status.
      </p>

      <p>
        Due to the polysemous nature of some terms, at times searches were
        narrowed by adding or excluding search terms, or by using more
        specialized phrases, which are reproduced in double quotation marks,
        such as in <WordLink>tick</WordLink>, meaning ‘credit’, with the search
        term “buy on tick”, or for <WordLink>off-reserve</WordLink> in the
        phrase “off-reserve population”, which produced a usable number of hits.
        Other meanings were isolated by adding Boolean search terms (AND, NOT),
        as can be seen in the chart for <WordLink>day parole</WordLink>, arrived
        at via “day parole” AND “prisoner”, or <em>unemployment</em>, as in{" "}
        <em>she’s on unemployment</em>, which required us to exclude the term
        “insurance” (hence NOT insurance). The decision to narrow a search was
        made by reading through the quotations and deciding whether the targeted
        meaning and only (or almost only) the targeted meaning had been
        produced. We do not explain why a certain search term combination was
        used and not another one, as a discussion of such methodological
        questions could easily take up more space than the main part of the
        entry.
      </p>

      <p>
        We aimed to make the data as comparable as possible. All search dates
        are offered in the captions. The Frequency Index, discussed in detail in{" "}
        <Link>Dollinger (2016: 79-87)</Link>, is the quotient of
      </p>

      <p className="border border-gray-500 bg-gray-50 p-2 px-4">
        Hits of search term/phrase divided by normalizer could * multiplier
      </p>

      <p>
        The multiplier is always offered in the y-axis label (for stagette above
        it is 1,000,000). Different multipliers are used to make the charts more
        readable on the page, while allowing the cross-comparison across charts.
      </p>

      <SecondaryHeader id="other-charts">Other Charts</SecondaryHeader>
      <p>
        Our most common charts show normalized web frequency, yet occasionally
        we use other kinds of charts. Where meanings rather than forms are
        Canadian, we occasionally applied a more fine-grained analysis of a
        smaller sample by providing the results of a semantic analysis of
        unambiguous examples, such as for the term <WordLink>to table</WordLink>{" "}
        (legislation etc.), which can mean either ‘to postpone’ or ‘to bring
        forward’ for discussion. A chart showing real-time developments over a
        few decades is found with <WordLink>peace bond</WordLink>. Headword{" "}
        <WordLink>substance use</WordLink> shows an adapted frequency chart;
        these are found in other contexts too.
      </p>

      <SecondaryHeader id="list-of-labels">List of Labels</SecondaryHeader>
      <p>
        The labels found in DCHP-3 are offered by subject lists. Additions in
        DCHP-3 are in <NewText>blue</NewText> and concern only the semantic
        domain labels.
      </p>

      <TertiaryHeader id="domain-labels">Domain labels</TertiaryHeader>

      <p>
        The domain labels were increased from 38 in DCHP-2 to 55. Note that
        these new labels (in <NewText>blue</NewText>) currently remain
        restricted to DCHP-3 content.
      </p>
      <ul className="my-4 ml-8 flex flex-col gap-y-1">
        <li>
          Aboriginal (e.g. <em> adhesion, treaty band)</em>
        </li>
        <li>
          Aboriginal (Inuit) (e.g. <em> amautik, qulliq)</em>
        </li>
        <li>
          Administration (e.g. <em> BC Day, blood donor clinic)</em>
        </li>
        <li>
          Agriculture (e.g.{" "}
          <em>
            {" "}
            canola, trash cover, <NewText>supply management</NewText>)
          </em>
        </li>
        <li>
          Automotive (e.g. <em> advanced green, parkade)</em>
        </li>
        <li>
          <NewText>Canada-US relations</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>Roxham Road</NewText>, <NewText>snowbird</NewText>,{" "}
            <NewText>maplewashing</NewText> (meaning #3))
          </em>
        </li>
        <li>
          Canadian Football (e.g. <em> designated import, rouge ((v.)))</em>
        </li>
        <li>
          <NewText>Climate change</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>atmospheric river</NewText>, <NewText>heat dome</NewText>,{" "}
            <NewText>zombie fire</NewText>)
          </em>
        </li>
        <li>
          Clothing (e.g. <em> bunny hug, Canadian tuxedo)</em>
        </li>
        <li>
          <NewText>Colonialism</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>pretendian</NewText>,{" "}
            <NewText>settler-colonial violence</NewText>)
          </em>
        </li>
        <li>
          Construction (e.g. <em> ardox nail, wafer board)</em>
        </li>
        <li>
          Curling (e.g. <em> centre ice)</em>
        </li>
        <li>
          <NewText>Digital life</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>enshittification</NewText>, <NewText>ding</NewText>{" "}
            (meaning #1))
          </em>
        </li>
        <li>
          Economy (e.g. <em> branch plant, corporate welfare bum)</em>
        </li>
        <li>
          Education (e.g. <em> bird course, semestering)</em>
        </li>
        <li>
          Entertainment (e.g.{" "}
          <em>
            {" "}
            CanCon, <NewText>Brollywood</NewText>)
          </em>
        </li>
        <li>
          Ethnicities (e.g. <em> Canadian-born Chinese, visible minority)</em>
        </li>
        <li>
          Fauna (e.g.{" "}
          <em>
            {" "}
            Boston bluefish, <NewText>snowbird</NewText> (meanings #3 & #4))
          </em>
        </li>
        <li>
          <NewText>Federalism</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>Roxham Road</NewText>, <NewText>white paper</NewText>)
          </em>
        </li>
        <li>
          Finance (e.g. <em> ABM, download (meaning #1))</em>
        </li>
        <li>
          First Nations (e.g. <em> Bill C-31, status)</em>
        </li>
        <li>
          Fishing (e.g. <em> barge, cod moratorium)</em>
        </li>
        <li>
          Flora (e.g. <em> arbutus, partridgeberry (meanings #1a, #1b))</em>
        </li>
        <li>
          Food or Food & Drink (e.g. <em> brown cow, chocolate bar)</em>
        </li>
        <li>
          Forestry (e.g. <em> cork boot, tenas (meaning #2))</em>
        </li>
        <li>
          French relations (e.g. <em> bi and bi, tongue trooper)</em>
        </li>
        <li>
          Fur trade (e.g. <em> canot du nord, country wife)</em>
        </li>
        <li>
          Games (e.g.{" "}
          <em>
            {" "}
            Chinese skipping, padiddle, <NewText>lahal</NewText>,{" "}
            <NewText>levidrome</NewText>)
          </em>
        </li>
        <li>
          Geography (e.g. <em> down south, north of 60)</em>
        </li>
        <li>
          <NewText>Healthcare</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>in hospital</NewText>, <NewText>wait time</NewText>)
          </em>
        </li>
        <li>
          <NewText>Hiphop</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>6ix</NewText>, <NewText>T-dot</NewText>)
          </em>
        </li>
        <li>
          Hockey (e.g. <em> muck up, Timbits (meaning #2))</em>
        </li>
        <li>
          Housing (e.g. <em> bachelor apartment, laneway house)</em>
        </li>
        <li>
          <NewText>Immigration</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>Roxham Road</NewText>, <NewText>landed immigrant</NewText>)
          </em>
        </li>
        <li>
          <NewText>Indigenous</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>Indigenous identity fraud</NewText>,{" "}
            <NewText>knowledge keeper</NewText>)
          </em>
        </li>
        <li>
          <NewText>Indigenous resistance</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>Red Paper</NewText>, <NewText>skoden</NewText>)
          </em>
        </li>
        <li>
          <NewText>Inuit</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>qalunaaq</NewText>, <NewText>igloo</NewText>)
          </em>
        </li>
        <li>
          Industry (e.g. <em> branch plant, Robertson screw)</em>
        </li>
        <li>
          <NewText>Interprovincial relations</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>Churchill Falls</NewText>,{" "}
            <NewText>supply management</NewText>)
          </em>
        </li>
        <li>
          Law (e.g.{" "}
          <em>
            {" "}
            skill-testing question, <NewText>renovict</NewText>)
          </em>
        </li>
        <li>
          <NewText>Media</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>in hospital</NewText>, <NewText>caremongering</NewText>)
          </em>
        </li>
        <li>
          Military (e.g. <em> khaki, Poppy Day)</em>
        </li>
        <li>
          Mining (e.g.{" "}
          <em>
            {" "}
            catskinner, <NewText>rig pig</NewText>)
          </em>
        </li>
        <li>
          Outdoors (e.g.{" "}
          <em>
            {" "}
            serviced, <NewText>swamp donkey</NewText>)
          </em>
        </li>
        <li>
          Politics (e.g.{" "}
          <em>
            {" "}
            bear-pit session, <NewText>the two Michaels</NewText>)
          </em>
        </li>
        <li>
          Ranching (e.g. <em> Texas gate, rodeo)</em>
        </li>
        <li>
          <NewText>Reconciliation</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>pretendian</NewText>, <NewText>Idle No More</NewText>)
          </em>
        </li>
        <li>
          Science (e.g. <em> Standard Time, wind chill)</em>
        </li>
        <li>
          Social customs (e.g.{" "}
          <em>
            {" "}
            kitchen racket, May Two Four, <NewText>stagette</NewText>,{" "}
            <NewText>trick or treat</NewText>)
          </em>
        </li>
        <li>
          Sports (e.g. <em> Big O, tube skate)</em>
        </li>
        <li>
          <NewText>Student slang</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>bzzr</NewText>, <NewText>bird course</NewText>){" "}
          </em>
        </li>
        <li>
          <NewText>Systemic discrimination</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>fruit machine</NewText>,{" "}
            <NewText>Saskatoon freezing deaths</NewText>)
          </em>
        </li>
        <li>
          <NewText>Trades</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>leadhand</NewText>, <NewText>rig pig</NewText>)
          </em>
        </li>
        <li>
          Transportation (e.g.{" "}
          <em>
            {" "}
            seat sale, <NewText>klick</NewText>)
          </em>
        </li>
        <li>
          Urban culture (e.g.{" "}
          <em>
            {" "}
            <NewText>substance use</NewText>, <NewText>off-sale</NewText>)
          </em>
        </li>
        <li>
          <NewText>Weather</NewText> (e.g.{" "}
          <em>
            {" "}
            <NewText>heat dome</NewText>, <NewText>poudrerie</NewText>)
          </em>
        </li>
      </ul>

      <TertiaryHeader>List of regional labels</TertiaryHeader>

      <ul className="my-4 ml-8 flex flex-col gap-y-1">
        <li>Alberta</li>
        <li>Atlantic Canada (NB, NL, NS, PE)</li>
        <li>British Columbia</li>
        <li>Cape Breton Island</li>
        <li>Central Canada (QC, ON)</li>
        <li>
          mainland Canada (everything but Newfoundland, the Territories,
          Vancouver Island)
        </li>
        <li>Manitoba</li>
        <li>Maritime Provinces (NB, NS, PE)</li>
        <li>New Brunswick</li>
        <li>Newfoundland</li>
        <li>Northern Canada</li>
        <li>Northwest Territories</li>
        <li>Nova Scotia</li>
        <li>Ontario</li>
        <li>Prairies (MB, SK, AB)</li>
        <li>Prince Edward Island</li>
        <li>Quebec</li>
        <li>Saskatchewan</li>
        <li>Territories (YT, NT, Nunavut)</li>
        <li>Western Canada (northwestern ON, MB, SK, AB, BC)</li>
      </ul>

      <TertiaryHeader>Social labels</TertiaryHeader>

      <ul className="my-4 ml-8 flex flex-col gap-y-1">
        <li>
          common core (= neither formal nor informal, but of the common core of
          Canadian English. Used sparingly, e.g. Mountie, which is the unmarked
          term and thus a common core term in Standard Canadian English.)
        </li>
        <li>dated</li>
        <li>derogatory</li>
        <li>diminutive</li>
        <li>euphemism</li>
        <li>humorous</li>
        <li>informal</li>
        <li>jocular</li>
        <li>obsolete</li>
        <li>offensive</li>
        <li>slang (incl. student slang, military slang)</li>
      </ul>

      <TertiaryHeader>Frequency labels</TertiaryHeader>

      <ul className="my-4 ml-8 flex flex-col gap-y-1">
        <li>also</li>
        <li>especially (also as “esp.”)</li>
        <li>near (as in “near obsolete”, etc.)</li>
        <li>originally</li>
        <li>predominantly</li>
        <li>rare</li>
        <li>rural (used sparingly) (e.g. beaver fever, skookum)</li>
        <li>usually</li>
        <li>very rare</li>
      </ul>

      <TertiaryHeader>Syntactic labels</TertiaryHeader>

      <ul className="my-4 ml-8 flex flex-col gap-y-1">
        <li>attributively</li>
        <li>in attributive position</li>
        <li>in figurative use</li>
        <li>predicative</li>
        <li>transitive</li>
      </ul>

      <SecondaryHeader id="copyright-note">Copyright Note</SecondaryHeader>
      <p>
        DCHP-3 is an updated edition of DCHP-2 (
        <Link>Dollinger and Fee 2017</Link>). It includes content from DCHP-1,{" "}
        <em>A Dictionary of Canadianisms on Historical Principles</em> (1967 and
        1991 editions, ISBN 0-7715-1976-1), edited by Avis, Walter S.
        (ed.-in-chief), C. Crate, P. Drysdale, D. Leechman, M.H. Scargill and
        C.J. Lovell, published by Gage Educational Publishing Company, a
        division of Canada Publishing Corporation (<Link>DCHP-1</Link>). The
        copyright notice of DCHP-1 can be found <Link>here</Link>. DCHP-1 was
        licensed to The University of British Columbia (UBC) by Nelson Education
        Ltd. (Nelson), the copyright owner of DCHP-1. Please see{" "}
        <Link to="https://www.nelson.com/">https://www.nelson.com/</Link> for
        more information about Nelson. The license from Nelson allows UBC to
        make DCHP-3 available free of charge, as a public digital resource on
        the internet. However, such license does not include the reproduction,
        modification, editing, translation, adaptation or distribution of, or
        creation of derivative works based on DCHP-3 content (or parts thereof)
        by any person or entity. Such use of DCHP-3 content is subject to
        applicable copyright laws and requires express consent from the
        editor-in-chief (for new DCHP-3 content, i.e. entries in white and red
        background colours), Nelson and/or UBC (for legacy content, i.e.
        yellow-coloured entries).
      </p>
    </TextPageMain>
  )
}
