import { PageHeader } from "~/components/elements/Headings/PageHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import WordLink from "~/components/elements/LinksAndButtons/WordLink"
import { Link } from "~/components/elements/LinksAndButtons/Link"

export default function Foreword() {
  return (
    <TextPageMain>
      <PageHeader>How to Use DCHP-3</PageHeader>

      <p>
        The basic principles of entry structure remain the same as in DCHP-2
        (see here) [TK — link], though the appearance is quite different.
      </p>

      <SecondaryHeader>A Typology of Canadianisms</SecondaryHeader>
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
          <strong>Type 1 &mdash; Origin</strong>: a form and its meaning were
          created in what is now Canada
        </li>
        <li>
          <strong>Type 2 &mdash; Preservation</strong>: a form or meaning that
          was once widespread in many Englishes, but is now preserved in
          Canadian English in the North American context or beyond; sometimes
          called “retention”
        </li>
        <li>
          <strong>Type 3 &mdash; Semantic Change</strong>: forms that have
          undergone semantic change in Canadian English
        </li>
        <li>
          <strong>Type 4 &mdash; Culturally Significant</strong>: forms or
          meanings that have been enshrined in the Canadian psyche and are
          widely seen as part of Canadian identity
        </li>
        <li>
          <strong>Type 5 &mdash; Frequency</strong>: forms or meanings that are
          Canadian by virtue of frequency
        </li>
        <li>
          <strong>Type 6 &mdash; Memorial</strong>: forms or meanings now widely
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
        <WordLink>Universal healthcare</WordLink> or hockey terminology, e.g.{" "}
        <WordLink>goalie mask</WordLink>, have that status, as do Indigenous
        words, e.g. <WordLink>culturally modified tree</WordLink>. This category
        includes those meanings of <WordLink>eh</WordLink> that are associated
        with Canadian English. As the country realigns itself out of
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

      <SecondaryHeader>Entry Structure</SecondaryHeader>
      <p>
        The entry structure follows the established order from DCHP-2. The left
        margin now shows the available meanings with hyperlinks. A time stamp on
        the top right assigns the entry an edition (DCHP-1, DCHP-2 or DCHP-3)
        and adds the date, if available, when the entry was first begun.
      </p>

      <p>TK — image</p>

      <p>
        The quotations paragraph continues for meaning #1, before meaning #2
        begins. In the pictured example of <WordLink>stagette</WordLink>,
        meaning #2 has a “dagger”, which signifies that it is not Canadian but
        listed here for contextualization.
      </p>

      <p>TK — image</p>

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

      <p>TK — image</p>

      <p>
        Returning to stagette, once the quotation paragraph is finished for
        meaning #2, the References and Images sections follow, as seen below.
        Any source mentioned is offered here and, where available, linked.
        Finally, all visuals referred to in the Word Story and other editorial
        texts (e.g. fist notes) are listed. First any frequency charts are
        listed (if available), followed by any pictures (if available).
      </p>

      <p>TK — image</p>

      <SecondaryHeader>Frequency Charts</SecondaryHeader>

      <p>For stagette, we show an international frequency chart.</p>

      <p>
        The frequency charts follow the established model (Dollinger 2016), only
        this time normalized “the” was used, which has proven to be more
        reliable than the modal verb “could”. The precise search terms are
        always shown in the chart headings. Multi-part words were always
        searched for with quotation marks, so the chart for entry “were dinged”
        was created by entering:
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
        at via “day parole” AND “prisoner”, or unemployment, as in she’s on
        unemployment, which required us to exclude the term “insurance” (hence
        NOT insurance). The decision to narrow a search was made by reading
        through the quotations and deciding whether the targeted meaning and
        only (or almost only) the targeted meaning had been produced. We do not
        explain why a certain search term combination was used and not another
        one, as a discussion of such methodological questions could easily take
        up more space than the main part of the entry.
      </p>

      <p>
        We aimed to make the data as comparable as possible. All search dates
        are offered in the captions. The Frequency Index, discussed in detail in
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

      <SecondaryHeader>Other Charts</SecondaryHeader>
      <p>
        Our most common charts show normalized web frequency, yet occasionally
        we use other kinds of charts. Where meanings rather than forms are
        Canadian, we occasionally applied a more fine-grained analysis of a
        smaller sample by providing the results of a semantic analysis of
        unambiguous examples, such as for the term <WordLink>to table</WordLink>{" "}
        (legislation etc.), which can mean either ‘to postpone’ or ‘to bring
        forward’ for discussion. A chart showing real-time developments over a
        few decades is found with <WordLink>peace bond</WordLink>. Headword
        <WordLink>substance use</WordLink> shows an adapted frequency chart;
        these are found in other contexts too.
      </p>

      <SecondaryHeader>List of Labels</SecondaryHeader>
      <p>
        The labels found in DCHP-3 are offered by subject lists. Additions in
        DCHP-3 are in red and concern only the semantic domain labels.
      </p>

      <SecondaryHeader>Domain labels</SecondaryHeader>

      <p>
        The domain labels were increased from 38 in DCHP-2 to 55. Note that
        these new labels (in red) currently remain restricted to DCHP-3 content.
      </p>
      <ul className="my-4 ml-8 flex flex-col gap-y-1">
        <li>Aboriginal (e.g. adhesion, treaty band)</li>
        <li>Aboriginal (Inuit) (e.g. amautik, qulliq)</li>
        <li>Administration (e.g. BC Day, blood donor clinic)</li>
        <li>Agriculture (e.g. canola, trash cover, supply management)</li>
        <li>Automotive (e.g. advanced green, parkade)</li>
        <li>
          Canada-US relations (e.g. Roxham Road, snowbird, maplewashing (meaning
          #3))
        </li>
        <li>Canadian Football (e.g. designated import, rouge ((v.)))</li>
        <li>Climate change (e.g. atmospheric river, heat dome, zombie fire)</li>
        <li>Clothing (e.g. bunny hug, Canadian tuxedo)</li>
        <li>Colonialism (e.g. pretendian, settler-colonial violence)</li>
        <li>Construction (e.g. ardox nail, wafer board)</li>
        <li>Curling (e.g. centre ice)</li>
        <li>Digital life (e.g. enshittification, ding (meaning #1))</li>
        <li>Economy (e.g. branch plant, corporate welfare bum)</li>
        <li>Education (e.g. bird course, semestering)</li>
        <li>Entertainment (e.g. CanCon, Brollywood)</li>
        <li>Ethnicities (e.g. Canadian-born Chinese, visible minority)</li>
        <li>Fauna (e.g. Boston bluefish, snowbird (meanings #3 & #4))</li>
        <li>Federalism (e.g. Roxham Road, white paper)</li>
        <li>Finance (e.g. ABM, download (meaning #1))</li>
        <li>First Nations (e.g. Bill C-31, status)</li>
        <li>Fishing (e.g. barge, cod moratorium)</li>
        <li>Flora (e.g. arbutus, partridgeberry (meanings #1a, #1b))</li>
        <li>Food or Food & Drink (e.g. brown cow, chocolate bar)</li>
        <li>Forestry (e.g. cork boot, tenas (meaning #2))</li>
        <li>French relations (e.g. bi and bi, tongue trooper)</li>
        <li>Fur trade (e.g. canot du nord, country wife)</li>
        <li>Games (e.g. Chinese skipping, padiddle, lahal, levidrome)</li>
        <li>Geography (e.g. down south, north of 60)</li>
        <li>Healthcare (e.g. in hospital, wait time)</li>
        <li>Hiphop (e.g. 6ix, T-dot)</li>
        <li>Hockey (e.g. muck up, Timbits (meaning #2))</li>
        <li>Housing (e.g. bachelor apartment, laneway house)</li>
        <li>Immigration (e.g. Roxham Road, landed immigrant)</li>
        <li>Indigenous (e.g. Indigenous identity fraud, knowledge keeper)</li>
        <li>Indigenous resistance (e.g. Red Paper, skoden)</li>
        <li>Inuit (e.g. qalunaaq, igloo)</li>
        <li>Industry (e.g. branch plant, Robertson screw)</li>
        <li>
          Interprovincial relations (e.g. Churchill Falls, supply management)
        </li>
        <li>Law (e.g. skill-testing question, renovict)</li>
        <li>Media (e.g. in hospital, caremongering)</li>
        <li>Military (e.g. khaki, Poppy Day)</li>
        <li>Mining (e.g. catskinner, rig pig)</li>
        <li>Outdoors (e.g. serviced, swamp donkey)</li>
        <li>Politics (e.g. bear-pit session, the two Michaels)</li>
        <li>Ranching (e.g. Texas gate, rodeo)</li>
        <li>Reconciliation (e.g. pretendian, Idle No More)</li>
        <li>Science (e.g. Standard Time, wind chill)</li>
        <li>
          Social customs (e.g. kitchen racket, May Two Four, stagette, trick or
          treat)
        </li>
        <li>Sports (e.g. Big O, tube skate)</li>
        <li>Student slang (e.g. bzzr, bird course) </li>
        <li>
          Systemic discrimination (e.g. fruit machine, Saskatoon freezing
          deaths)
        </li>
        <li>Trades (e.g. leadhand, rig pig)</li>
        <li>Transportation (e.g. seat sale, klick)</li>
        <li>Urban culture (e.g. substance use, off-sale)</li>
        <li>Weather (e.g. heat dome, poudrerie)</li>
      </ul>

      <SecondaryHeader>List of regional labels</SecondaryHeader>

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

      <SecondaryHeader>Social labels</SecondaryHeader>

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

      <SecondaryHeader>Frequency labels</SecondaryHeader>

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

      <SecondaryHeader>Syntactic labels</SecondaryHeader>

      <ul className="my-4 ml-8 flex flex-col gap-y-1">
        <li>attributively</li>
        <li>in attributive position</li>
        <li>in figurative use</li>
        <li>predicative</li>
        <li>transitive</li>
      </ul>

      <SecondaryHeader>Copyright Note</SecondaryHeader>
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
