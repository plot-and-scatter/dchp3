// DCHP-2: Introduction to DCHP-2 (the 2017 how-to-use page)
// Ported from the DCHP-2 (2017) CakePHP templates via tidy; text unchanged.
import { Link } from "~/components/elements/LinksAndButtons/Link"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import { TertiaryHeader } from "~/components/elements/Headings/TertiaryHeader"
import FrontmatterImage from "~/components/elements/Images/FrontmatterImage"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"
import img_cf08e6_html_7e1971fd from "../images/i_a41ce94b16cf08e6_html_7e1971fd.png"
import img_cf08e6_html_adb03385 from "../images/i_a41ce94b16cf08e6_html_adb03385.gif"
import img_cf08e6_html_9c17b5b8 from "../images/i_a41ce94b16cf08e6_html_9c17b5b8.png"
import img_cf08e6_html_3100b6a1 from "../images/i_a41ce94b16cf08e6_html_3100b6a1.png"
import img_cf08e6_html_b0eda47d from "../images/i_a41ce94b16cf08e6_html_b0eda47d.png"
import img_picture15 from "../images/picture15.png"
import img_cf08e6_html_7ed87689 from "../images/i_a41ce94b16cf08e6_html_7ed87689.png"
import img_cf08e6_html_6235c431 from "../images/i_a41ce94b16cf08e6_html_6235c431.png"
import img_cf08e6_html_fbfbb98d from "../images/i_a41ce94b16cf08e6_html_fbfbb98d.png"
import img_cf08e6_html_47ffe327 from "../images/i_a41ce94b16cf08e6_html_47ffe327.png"
import img_cf08e6_html_3e23d0f5 from "../images/i_a41ce94b16cf08e6_html_3e23d0f5.png"
import img_cf08e6_html_eceeed08 from "../images/i_a41ce94b16cf08e6_html_eceeed08.png"
import img_cf08e6_html_1738fb9a from "../images/i_a41ce94b16cf08e6_html_1738fb9a.png"
import img_cf08e6_html_3579553d from "../images/i_a41ce94b16cf08e6_html_3579553d.png"
import img_6cf08e6_html_7d927ec from "../images/i_a41ce94b16cf08e6_html_7d927ec.png"
import img_6cf08e6_html_59a1da0 from "../images/i_a41ce94b16cf08e6_html_59a1da0.jpg"
import img_cf08e6_html_c9082166 from "../images/i_a41ce94b16cf08e6_html_c9082166.jpg"
import img_cf08e6_html_d13a70e6 from "../images/i_a41ce94b16cf08e6_html_d13a70e6.png"
import img_cf08e6_html_d3d8e120 from "../images/i_a41ce94b16cf08e6_html_d3d8e120.png"
import img_cf08e6_html_b62f0ba3 from "../images/i_a41ce94b16cf08e6_html_b62f0ba3.png"
import img_cf08e6_html_7aabf2eb from "../images/i_a41ce94b16cf08e6_html_7aabf2eb.png"
import img_cf08e6_html_4ed35ac0 from "../images/i_a41ce94b16cf08e6_html_4ed35ac0.png"
import img_cf08e6_html_9bcc2382 from "../images/i_a41ce94b16cf08e6_html_9bcc2382.png"
import img_6cf08e6_html_3e09bef from "../images/i_a41ce94b16cf08e6_html_3e09bef.png"
import legacySite from "../images/legacy-site-2017.png"
import LegacySiteNote from "../../LegacySiteNote"

export default function Dchp2HowToUse() {
  return (
    <TextPageMain>
      <PageHeader>
        <span id="goback" />
        Introduction to DCHP‑2
      </PageHeader>
      <LegacySiteNote
        siteName="DCHP-2 Online"
        releasedIn={2017}
        screenshot={legacySite}
      />
      <p>
        <strong>Stefan Dollinger &amp; Margery Fee</strong>
      </p>
      <p>
        In the introduction to the first edition of the{" "}
        <em>Dictionary of Canadianisms on Historical Principles</em> (DCHP‑1),
        chief editor Walter S. Avis explained the rationale behind this
        dictionary, a rationale that has been taken over unchanged in this new
        edition. The <em>Dictionary's</em> purpose was - and is -
      </p>
      <p>
        to provide a historical record of words and expressions characteristic
        of the various spheres of Canadian life during the almost four centuries
        that English has been used in Canada (Avis 1967: xii).
      </p>
      <p>
        From the outset, we used Avis and associates' work as a springboard
        towards a lexicographic process that Avis (1967: xiii) considered
        "clearly quite different from that of lexicographers in the United
        States". This difference lies first and foremost in the comparative
        nature of DCHP. In DCHP‑1, the comparative approach is enshrined in the
        definition of a Canadianism, which was - and is - defined as
      </p>
      <p>
        a word, expression, or meaning which is native to Canada or which is
        distinctively characteristic of Canadian usage though not necessarily
        exclusive to Canada (Avis 1967: xiii).
      </p>
      <p>
        While this definition is also the core of DCHP‑2, we have refined what
        it means for a word or phrase to be "distinctively characteristic of
        Canadian usage". The study of distinct characteristics necessitates the
        systematic comparison of usage patterns and semantics of Canadian
        English with other varieties of English, which was one of the key
        features of DCHP‑1's editorial work. For the user of DCHP‑1, this
        comparative method is, unfortunately, utterly hidden, as generally no
        cross-references to other dictionaries are offered. This is perplexing,
        as Charles J. Lovell, driving force and first chief editor of DCHP‑1
        (from 1958 until his death in 1960), emphasized the importance of
        "cross-checking in dictionaries" as the "chief factor in developing a
        knowledge of the specialized Canadian English vocabulary", a point that
        "cannot be too highly stressed" (1956: 31). DCHP‑1's comparative work
        can only be seen on the quotation slips, now housed at the University of
        Victoria Archives. Their premise was that "Canadianness is shown by [a
        word's] absence from dictionaries published outside Canada" (Görlach
        1990: 1484). This "negative" evidence is included for the new entries in
        DCHP‑2. Today, we need not rely exclusively on non-Canadian dictionaries
        for claims of Canadianness, as we now can refer to lexicographical and
        dialectological work done on Canadian English since 1967. Drawing from
        decades of experience in corpus linguistics and a constantly growing
        number of digital sources, we can arrive at interesting insights that,
        however, should not diminish the achievement of the pre-computer
        pioneers behind DCHP‑1 with its c. 102,000 paper quotation slips.{" "}
      </p>
      <p>
        From a comparative perspective, the question of evidence and
        documentation is key and the common practice of merely assigning labels
        to terms and meanings becomes problematic. In Canadian English
        lexicography, terms and meanings are labelled "Canadian" without a
        rationale. In DCHP-2, one goal has been to make explicit the rationale
        behind the inclusion of a particular word or meaning as Canadian.
        Looking at the entry for <em>parkade</em> from DCHP-1 in Figure 1, at
        the time of DCHP-1's publication a recent coinage, one might question
        why the term is Canadian at all (here from DCHP‑1 Online [Dollinger,
        Brinton and Fee 2013], which is a verbatim copy of DCHP‑1). This problem
        exists in all dictionaries of Canadian English to date: either the
        readers are already familiar with the special status of <em>parkade</em>{" "}
        in Canadian English, in which case they find their hunches confirmed, or
        if not, they are as likely to question the status of <em>parkade</em> as
        to accept it in the absence of evidence. Of course, one reason for the
        lack of a rationale was the lack of space in print publications: not
        only do we have access to vastly greater amounts of text online, but
        also we have more space to lay out supporting evidence for each entry.
      </p>
      <p>
        <FrontmatterImage src={img_cf08e6_html_7e1971fd} alt="" />
      </p>
      <p>
        Figure 1: Entry <em>parkade</em> from DCHP-1 Online
      </p>
      <p>
        When the revision project was taking shape in the winter and spring of
        2006, it had become clear that DCHP‑1 was "out of date to an extent that
        severely compromises its use today" (Dollinger 2006: section 1).
        Katherine Barber, at the time editor of the{" "}
        <em>Canadian Oxford Dictionary</em>, considered the lack of a historical
        perspective for many newer Canadian terms a huge problem (Barber &amp;
        Considine 2010: 143). DCHP‑2 now contains some of the information she
        wanted to know then, such as when the term <em>mangia-cake</em> was
        first used (the earliest attestation is now 1988). However, we were not
        sure just where to put our energies in bringing the dictionary into the
        21st century.
      </p>
      <p>
        One of the first questions to be asked about the editing of a dictionary
        is, in Sidney Landau's words, "how fully" the dictionary should "cover
        the lexicon" (2001: 28). John Considine's comparison of historical
        dictionaries led him to project that a new edition might have twice as
        many entries as DCHP‑1 and at least double the quotation count (Barber
        &amp; Considine 2010: 146). Until 2008, we felt that an increase by that
        measure would be feasible (Dollinger &amp; Brinton 2008: 49-50). We
        realized soon after the initial data collection from 2008 to 2010 that
        we faced a greater degree of complexity than anticipated, and that a
        different route of action would be required. Because we decided to give
        evidence for our decision to label a word, meaning or expression
        "Canadian", we opted for more fully researched entries that would allow
        the reader to follow our reasoning. This decision entailed fewer but
        better argued entries. In order to facilitate classification, we
        developed a typology of various sub-types of Canadianisms as well as a
        methodology that would allow us to test our hypotheses on the status of
        a given meaning. The first such typology was published in Dollinger
        &amp; Brinton (2008: 51-52), and, after two revisions, a final version
        in Dollinger (2015a).
      </p>
      <SecondaryHeader>A Typology of Canadianisms</SecondaryHeader>
      <p>
        In DCHP-2, meanings are the smallest unit. Each meaning is assigned to
        one of six dominant Types of Canadianism. These six classes are
        complemented by a class "Non-Canadian", which is used for meanings that
        were previously classified as Canadian or that were suspected to be
        Canadian but turned out not to be. The six types are:
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>
          <strong>Type 1 - Origin:</strong> a form and its meaning was created
          in what is now Canada
        </li>
        <li>
          <strong>Type 2 - Preservation:</strong> a form or meaning that was
          once widespread in many Englishes, but is now preserved in Canadian
          English in the North American context or beyond; sometimes called
          "retention"
        </li>
        <li>
          <strong>Type 3 - Semantic Change:</strong> forms that have undergone
          semantic change in Canadian English
        </li>
        <li>
          <strong>Type 4 - Culturally Significant:</strong> forms or meanings
          that have been enshrined in the Canadian psyche and are widely seen as
          part of Canadian identity
        </li>
        <li>
          <strong>Type 5 - Frequency:</strong> forms or meanings that are
          Canadian by virtue of frequency
        </li>
        <li>
          <strong>Type 6 - Memorial:</strong> forms or meanings now widely
          considered to be pejorative
        </li>
        <li>
          <strong>Non-Canadian:</strong> forms or meanings once thought to be
          Canadian for which evidence is lacking
        </li>
      </ul>
      <p>
        Origin (Type 1) includes forms such as <em>all-dressed</em>,{" "}
        <em>garburator</em>, <em>frosh week</em>, <em>humidex</em> and{" "}
        <em>parkade.</em> Examples of Preservations (Type 2) include{" "}
        <em>drinking</em> <em>box</em>, <em>dunch</em>, <em>invigilate</em> and{" "}
        <em>pencil crayon</em>. Semantic change in Canadian English (Type 3)
        includes <em>to acclaim</em> 'elected by virtue of being the sole
        candidate', <em>toque</em> and <em>Canuck</em>. Culturally salient terms
        (Type 4) include terms relating to universal healthcare, e.g.{" "}
        <em>health care card</em>, hockey terms, e.g.{" "}
        <em>backhander, goalie mask</em>, and others relating to the Canadian
        experience, such as <em>biculturalism,</em> <em>multiculturalism</em>,{" "}
        <em>Native Canadian</em> and <em>culturally modified tree</em>.
      </p>
      <p>
        Frequency (Type 5) typifies terms that occur in Canada at a higher
        frequency than elsewhere in the normalized internet searches we provide
        for most terms (see below under "Frequency Index" and Dollinger 2016a).
        These include <em>advanced green</em>, <em>cube van</em>,{" "}
        <em>ginger group</em> and <em>to table legislation</em>. This merger of
        comparative corpus linguistics methods with lexicography is perhaps the
        most important methodological innovation of DCHP‑2. We hope that the
        inclusion of Frequency Charts in DCHP‑2 will be seen as a useful
        addition to the traditional entry format, just as were the display maps
        in DARE (Cassidy &amp; Hall 1985-2013) that indicated the location of
        all occurrences of a variant.
      </p>
      <p>
        Memorial terms (Type 6), finally, was the last addition to the typology
        scheme, in 2013, and is the flip side of Cultural Salience (Type 4):
        Canadians take pride in the terms we mark as culturally salient, whereas
        terms categorized as Memorial connect to negative episodes and events in
        Canada's history. This category relates to the Aboriginal colonial
        experience, e.g. <em>residential school</em>,{" "}
        <em>assimilation, potlatch ban</em>, and includes terms of abuse now
        considered racist, e.g. <em>chink</em>, <em>wop</em>,{" "}
        <em>iron chink</em>, or terms that are, if not racist, now considered
        outdated, such as <em>Eskimo</em>. We therewith follow a practice that
        has a longer tradition in German than in English lexicography, where the
        OED-1, bound by Victorian values, tended to omit terms considered
        offensive. As the Brothers Grimm put in Volume 1 of their historical
        dictionary of German: "The dictionary, if it wishes to be worth its
        salt, is not here to hide words, but to show them" (Grimm 1854: xxxiii,
        transl. SD). In other words, we include with Type 6 terms that were once
        widespread and form part of Canada's negative heritage today.
      </p>
      <p>
        The category Non-Canadian includes terms that were thought to be
        Canadian, either in previous works or by the editorial team. This
        category is an integral part of a contrastive dictionary and includes
        terms such as <em>ASA</em> 'acetylsalicylic acid' (labelled Canadian in
        COD-2), <em>candy floss</em> (COD-2), <em>friendship cake</em> (ITP
        Nelson), <em>icing sugar</em> ("Cdn, Brit., Austral. &amp; NZ," in
        COD-2), and the expression <em>Bob's your uncle</em> (which we suspected
        to be Canadian). Examples of other terms the editors suspected,
        incorrectly, to be Canadian include <em>to write an exam</em> vs.{" "}
        <em>to take an exam</em>, or <em>clawback</em> 'funds taken back', which
        proved to be most frequent in the US. The label "Non-Canadianism" is set
        in the top right of the entry on top of a red background to distinguish
        the two classes of entries (see the section on "Background colours"
        below).
      </p>
      <p>
        If a term or meaning is deemed Canadian, only one of the six types was
        assigned although some terms belong to more than one category. In other
        words, the "more profound" type trumps, which often concerns the choice
        between Frequency and Origin. For instance, <em>Scarberia</em> would
        clearly qualify on the grounds of Frequency as a Canadianism, but Origin
        is highly likely and thus trumps Frequency. In other cases, the
        assessment is based on negative evidence. While{" "}
        <em>bear-pit session</em> is clearly Type 5 - Frequency, in the absence
        of any evidence of this word in this sense in any media originating from
        outside Canada, the type was "upped" to Type 1 ­- Origin. Here the
        inference was inspired by (considerable) negative evidence. Such
        assessments are, of course, subject to corrections once more
        non-Canadian data becomes available, e.g. in the case of a term that was
        invented in the US, adopted early in Canada, and spread here while the
        term fell into disuse in the US. If such cases come to our attention, we
        will be happy to adapt our ruling. Where two possible classifications
        were considered, we explain the rationale behind our classification in
        the Word Story.
      </p>
      <SecondaryHeader>Structure of Entries</SecondaryHeader>
      <p>
        Below is the DCHP-2 entry for <em>parkade</em>, a building [...] serving
        as a parking area for motor vehicles. It includes the header DCHP‑2 on a
        blue background (to distinguish it from the entry for <em>parkade</em>{" "}
        in DCHP-1 Online, see Image 1). The headword <strong>parkade</strong>{" "}
        follows, for which the most common present-day variant has been chosen.
        The main entry is found under the current spelling, but cross-references
        are inserted. If available, a derivation follows after '&lt;', in this
        case from <em>park(ing) (arc)ade</em>, which is followed by an IPA
        transcription of terms that need disambiguation (e.g. SQ for{" "}
        <em>Sûreté du Québec</em> generally as [es'kju:] for the general
        pronunciation in the Quebec English of Anglophones rather than the
        French [es'kjy]). On the right side is the date of the last revision.
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <FrontmatterImage src={img_cf08e6_html_adb03385} alt="" />
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              Figure 2: Entry <em>parkade</em> from DCHP-2 (Part 1 of 2)
            </p>
          </td>
        </tr>
      </table>
      Under the horizontal line at the top of Figure 2, the meaning is the basic
      organizational unit; next is part of speech, here <em>n.</em> for{" "}
      <em>noun</em>, followed by the mark-up labels, which are regional (e.g.
      Ontario, Prairies) and social (e.g. slang, dated) and, as shown here,
      pertaining to the semantic domain, here <em>Automotive</em> (a full list
      of labels and abbreviations is found at the end of this introduction).
      <br />
      <br />
      <p>
        The next item is the heart of the entry, composed of the Typology, in
        this case Type 1 - Origin, followed by the Word Story, which offers a
        rationale for the Type choice. The Type and Word Story are shown here
        for the reader's convenience:
      </p>
      <p>
        Type 1 - Origin: <em>Parkade</em>&#160;is probably of Canadian origin,
        linked to the Hudson Bay department stores, which first appeared in
        western Canada (see the first 1958 quotation). Boberg (2010: 179), with
        data gathered from self-reports, considers it primarily a Prairie and BC
        term (from Ontario eastwards&#160;<em>parking garage</em>&#160;is more
        frequently reported than&#160;<em>parkade</em>).&#160;<em>Parkade</em>
        &#160;is also the majority term in PEI (Boberg 2010). Chart 2
        substantiates this finding. The term is most common in Alberta (see
        Chart 2), confirming overall the Prairie dominance from Boberg (MB, SK,
        AB) and BC, which can be partly explained by the western Canadian
        connection to the HBC department stores, as the first six of which, the
        "original six", opened in Victoria, Vancouver, Edmonton, Calgary,
        Saskatoon and Winnipeg (see HBC reference), where the term is frequent
        to this day.&#160;
        <br />
        Apart from Canada (see Chart 1), the term has currency in South Africa,
        where it is most likely an independent development. Some US locations
        have adopted&#160;<em>parkade</em>&#160;(see the one shown in Image 2,
        from Spokane, Washington). From a North American perspective, the term
        is Canadian also by virtue of frequency (Type 5).&#160;
        <br />
        See COD-2, which labels the term "Cdn". See&#160;<em>Gravol</em>
        &#160;and&#160;<em>day parole</em>&#160;for other terms with a
        Canada/South Africa parallel.
      </p>
      <p>
        The Word Story refers to the supporting material, which can be Images
        (two for <em>parkade</em>, one from Canada and one from the US, to show
        the term's recent dissemination south across the border, though only the
        image from Canada is shown here).
      </p>
      <p>
        After the Word Story come the cross-references to other entries, under
        the heading "See also" which link to parallel or similar cases referred
        to in the Word Story. Literature references, such as Boberg (2010), and
        external hyperlinks, e.g. to encyclopedia pages, are found at the end of
        the Quotation Paragraph. A click will either open a new tab and link
        directly to an online source, or show the bibliographic details in the
        right margin. Similarly, in the Quotation Paragraph, one or two symbols
        are found after each quotation: a book symbol and, if the source is
        online, a square symbol. The book symbol calls up the bibliographic
        reference of the source. In Figure 3, a click on the book symbol of the
        1957 quotation, for instance, will show in the right margin the
        following information under the heading <strong>Bibliography</strong>:
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_9c17b5b8} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              Figure 3: Bibliographic details in the right-hand margin for{" "}
              <em>parkade</em> (1957 quotation)
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
        </tr>
      </table>
      <p>
        The 1957 quotation is from the University of Alberta student publication{" "}
        <em>The Gateway</em>, from 25 January 1957, p. 5. The URL is shown as
        well. A click on the square symbol behind the quotation will open the
        page with the quotation in the original source, provided that the user
        has access rights and the link is still functional.
      </p>
      <TertiaryHeader>Linguistic surveys</TertiaryHeader>
      <p>
        Since DCHP-1, the linguistic study of Canadian English has made great
        strides. While not especially focused on the area of lexis, this
        tradition has offered many points of comparison. We have included
        results from the <em>Survey of Canadian English</em> (Scargill and
        Warkentyne 1972, e.g. <em>chesterfield</em>), the{" "}
        <em>Dialect Topography of Canada</em> (Chambers 1994, e.g.{" "}
        <em>anymore</em>), the{" "}
        <em>North American Regional Vocabulary Survey</em> (Boberg 2005, e.g.{" "}
        <em>bank machine</em>) and smaller surveys, including our own data such
        as the BC Linguistic Survey (Dollinger 2014), e.g. <em>P.E.</em> for
        physical education.
      </p>
      <TertiaryHeader>Hyperlinks to sources</TertiaryHeader>
      <p>
        <em>The Gateway</em> is an open access publication. In other cases, such
        as <em>Canadian Newsstream</em> or other commercial databases, the user
        might be blocked by a pay wall. With some other links, the URL may have
        changed since 2007, when the first quotations were entered in the{" "}
        <em>Bank of Canadian English</em> (Dollinger, Brinton and Fee
        2006-2016). Nonetheless, we considered it useful to offer the link we
        followed at the time the quotation was entered into the Bank.
      </p>
      <TertiaryHeader>Frequency Charts</TertiaryHeader>
      <p>
        Frequency Charts, if part of an entry, are found after any images.
        Frequency Charts are site-restricted web searches that have been
        normalized to allow for comparison of "index points" (see next section).
        In the case of <em>parkade</em>, both international and provincial
        charts have been included (see Figure 4). Other terms may show one or
        more charts, while others have none, as not all meanings are searchable
        this way.
      </p>
      <table className="my-4 border-collapse">
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_3100b6a1} alt="" />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              Figure 4: Entry for <em>parkade</em> from DCHP-2 (Part 2 of 2)
            </p>
          </td>
        </tr>
      </table>
      <p>
        In some cases we would have liked to include charts, but the meanings
        overlapped with others, defying attempts to narrow and isolate the
        desired ones. Such terms include <em>country marriage</em> or{" "}
        <em>transfer payment</em>, where Google searches ignore sentence
        punctuation, listing hits where the first word ends a sentence and the
        second begins a new one. Another typical problem occurs with{" "}
        <em>rez</em> ((2)) 'reserve', which is conflated with <em>rez</em> ((1))
        'student dorm, residence', and no common phrase could be found that
        would clearly disambiguate the two meanings in practice (restrictions of
        the type "rez +student -Native" or "rez +Native -student", for instance,
        would yield too much noise). Likewise, examples such as <em>Metro</em>{" "}
        'metropolitan region' and <em>metro</em> 'subway in Montreal', or{" "}
        <em>joe job</em> and <em>bailiff</em> proved impossible to disambiguate.
        Occasionally, we actually read the examples that the search produced in
        order to make a decision.
      </p>
      <p>
        In most cases, however, we were successful in producing Frequency Charts
        (see Figure 4) and more than 57% of meanings include at least one. The
        international Frequency Chart (Chart 1 in Figure 4) shows the .ca domain
        for Canada as leading with 6.0 index points (a normalized measure in
        relation to the estimated size of the .ca domain), followed by South
        Africa (.za with 5.2 points). The other domains, for the United Kingdom
        (.uk with 0.1 points), Ireland (.ie with 0.3), New Zealand (.nz 0.0),
        Australia (.au 0.0) and the US (merging counts for the .edu, .gov, .mil
        and .us domains) is a mere 0.2. With Chart 1, which was produced on 24
        May 2012, we have evidence that <em>parkade</em> is currently in use
        primarily in Canada and South Africa.
      </p>
      <p>
        The provincial Frequency Chart (Chart 2 in Figure 4) uses governmental
        provincial web domains to gauge the term's distribution within Canada
        (.bc.ca for British Columbia, .ab.ca for Alberta and so forth). The
        results suggest a base of the term in Alberta with 30.8 points, where it
        was first used according to the historical record, followed with
        considerable difference by Prince Edward Island, Saskatchewan, Manitoba
        and British Columbia, with Ontario, Nova Scotia and the Yukon showing
        only negligible counts. While the text types reflected in the provincial
        charts are much less diverse than in the top-level national domains, the
        data still offers interesting insights and most often striking
        congruence with anecdotal and other evidence.
      </p>
      <TertiaryHeader>Fist Notes</TertiaryHeader>
      <p>
        A feature from DCHP-1 is the Fist Note, which is not shown in{" "}
        <em>parkade</em>. Generally a Fist Note{" "}
        <FrontmatterImage src={img_cf08e6_html_b0eda47d} alt="" inline /> adds
        information that would help the general reader to contextualize the
        definition as in the Fist Notes in the first edition (Avis et al. 1967:
        xix) with the exception that in DCHP‑2, the more complex connections are
        explained in the Word Story. One such Fist Note is found under{" "}
        <em>adhesion</em>, 'agreement to join an existing treaty':
      </p>
      <p>
        <FrontmatterImage src={img_cf08e6_html_b0eda47d} alt="" inline />{" "}
        Treaties are only signed with the Crown, the federal government, yet
        provincial governments often play a role in the negotiations.
      </p>
      <TertiaryHeader>Pronunciation</TertiaryHeader>
      <p>
        We give pronunciations only for those words that present a demonstrated
        problem. Transcriptions are given in the International Phonetic Alphabet
        above the horizontal line, next to the headword. For instance,{" "}
        <em>coffee row</em> has been transcribed as [rou] (to distinguish it
        from [rau]). We transcribe phonemically, not phonetically, which means
        that phonetic phenomena such as Canadian Raising or the Canadian Vowel
        Shift are not shown, as there are better sources outlining these
        phenomena (see, e.g., Chambers 2006 and Hoffman 2010).
      </p>
      <TertiaryHeader>Parts of speech</TertiaryHeader>
      <p>
        The standard parts of speech have been marked as n. (noun), v. (verb),
        adj. (adjective), adv. (adverb) and expression. Where necessary we went
        beyond this basic classification and added <em>transitive</em> or{" "}
        <em>phrasal verb</em>, <em>verbal n</em>. (the latter, e.g. skidoo,
        meaning 2) or exclamation (e.g. <em>padiddle</em>). We also mark
        proprietary terms. The majority of terms in DCHP are nouns, many of
        which can be used as adjectives as well. In many cases we opted for the
        shortcut "n. &amp; adj." for one meaning, e.g. matriculation, for which
        we listed quotations giving both nominal, e.g.{" "}
        <em>in the way of matriculation</em>, and adjectival uses, e.g.{" "}
        <em>matriculation class</em>.
      </p>
      <TertiaryHeader>Etymology</TertiaryHeader>
      <p>
        As the Word Story is the primary vehicle for the semantic development of
        a term or meaning, the etymology field above the horizontal line, or in
        the case of isolated meanings, following the usage labels, is used to
        signal a donor language or dialect, such as in <em>guichet</em> 'bank
        machine' which shows &#160;[&lt; Canadian French&#160;<em>guichet</em>
        &#160;'counter']&#160;as the source form, or <em>square head</em>{" "}
        <strong>2</strong>&#160;<em>n.</em>&#160;'an English Canadian', which is
        labelled as [&lt; loan translation of Canadian French 'tête carrée'].
      </p>
      <TertiaryHeader>Quotations</TertiaryHeader>
      <p>
        All quotations are taken from Canadian materials or material by
        travellers reporting terms, meanings or usage that was heard or read in
        Canada. We went by the principle that words or meanings that have come
        into existence since World War II should be documented in 10-year steps,
        while older words were documented if possible in 25-year steps.
        Quotations come from the <em>Bank of Canadian English</em> (Dollinger,
        Brinton and Fee 2006-2016, Dollinger 2010). This rule was not
        hard-and-fast; we opted, more often than not, on the side of inclusion.
        Thus, the quotation paragraph for <em>parkade</em> in Figure 2 contains
        a total of 11 quotations between 1957 and 2016. Following the principles
        for quotation selection from DCHP-1 (Avis et al. 1967: xviii) we still
        list the earliest and (one of) the latest uses to offer explanations of
        the term and appropriate contexts in which the term occurs. Unlike
        DCHP‑1, however, we do not direct readers to a quotation in place of a
        definition.
      </p>
      <p>
        As in DCHP-1, when we use non-Canadian English sources, we include the
        quotation text in square brackets, [ ], in order to show the development
        of the Canadian dimension. Such cases are found in, e.g.,{" "}
        <em>parks officer, bilingual, demob,</em> where in the latter, demob
        (2), the 1919 quotation does not yet use the shortened noun form, but
        only the shortened verb form. In the earliest quotation for{" "}
        <em>parks officer</em>, we can see that the form likely derives from the
        juxtaposition of <em>Niagara Parks</em> with <em>officer</em>, but that
        the compound noun had not yet been formed, as shown in the 1960
        quotation from the <em>Toronto Star</em>:
      </p>
      <p>
        [The vest type lifejacket which Roger Woodward wore on his ride over
        Niagara Falls must be credited in part with saving his life, according
        to Niagara Parks officer Percy Baker.]
      </p>
      <p>
        Quotations in square brackets provide important predecessor forms that
        would otherwise be lost, as can be seen in the 1867 quotation for{" "}
        <em>bilingual</em>. Taken from the British North America Act, the
        concept of bilingualism is described even though the term{" "}
        <em>bilingual</em> (2) 'pertaining to official use of English and
        French' is not yet used:
      </p>
      <p>
        <strong>1867</strong>&#160;(1868)&#160;&#160;[<strong>133.</strong>
        &#160;Either the English or the French language may be used by any
        person in the debates of the houses of the parliament of Canada and of
        the houses of the legislature of Quebec; and both those languages shall
        be used in the respective records and journals of those houses; and
        either of those languages may be used by any person or in any pleading
        or process in or issuing from any court of Canada established under this
        act, and in or from all or any of the courts of Quebec. The acts of the
        parliament of Canada and of the legislature of Quebec shall be printed
        and published in both those languages.]
      </p>
      <p>
        Sometimes, we use square brackets to show a non-Canadian dimension. For
        instance, under <em>laneway</em>, the earliest quotation from 1873 is
        included in brackets in order to highlight the Irish connection in a
        reprint of an Irish term in a Canadian paper.
      </p>
      <p>
        Quotations in historical dictionaries are selected as examples of
        language use, not because they contain accurate factual information or
        support the opinions of the editors. Therefore, readers should not
        assume that they can rely on these quotations as evidence to support any
        arguments except linguistic ones. Although we do try to indicate the
        general context for word meanings in our entries, anyone who needs
        practical information related to the terms in the dictionary,
        particularly financial or legal information, should turn to more
        specialized resources. Quotations are used for their illustration of
        linguistic and cultural use and, in many cases, report incorrectly or
        are factually wrong. For instance, the 1989 quotation on tax-free growth
        of RESPs (s.v. "Registered Education Savings Plan") is incorrect.
        Likewise, so is the 1956 quotation of <em>qulliq</em>, which likens this
        lamp of great cultural significance to the Inuit peoples and to the
        Territory of Nunavut to a propane gas camping stove.
      </p>
      <p>
        Sometimes, despite our best efforts, we could not decipher isolated
        words or characters in a given source, particularly when using unclear
        microfilm or manuscript sources. In that case, we follow the convention
        from the <em>Corpus of Early Ontario English,</em> which marks with
        "[xxx]" every word that was not decipherable (Dollinger 2008: 99-119).
        In rare cases, we include a quotation for a variant form that is,
        strictly speaking, not a variant of the headword, such as in the 2011
        quotation in <em>idiot string</em>, which only includes "idiot mittens".
      </p>
      <TertiaryHeader>Dating: Years</TertiaryHeader>
      <p>
        Quite frequently, one can find two dates in the quotations, such as in
        the quotation above for <em>bilingual</em>, with "<strong>1867</strong>{" "}
        (1868)". Here, the boldfaced year is the year of composition or
        utterance of the text, while the year in round brackets is the year of
        publication. Following established practice in DCHP‑1, we provide both
        dates. While for <em>bilingual</em> the difference is not great, the
        first quotation of <em>Canuck</em>, meaning 1a, was published in 1948,
        but written more than a century earlier, in that case around 1830.
      </p>
      <TertiaryHeader>Cross-references</TertiaryHeader>
      <p>
        As an online dictionary, we made extensive use of cross-referencing.
        Using the tool from DCHP‑1, the "See also" reference, we link to all
        terms that are mentioned in the Word Story as well as to terms that are
        in a direct relationship with the headword, which can generate more
        extensive lists, such as in the case of <em>residential school</em>,
        which links to nine related terms:
      </p>
      <p>
        <Link to="/entries/Sixties Scoop">Sixties Scoop</Link>&#160;&#160;
        <Link to="/entries/Truth and Reconciliation Commission">
          Truth and Reconciliation Commission
        </Link>
        &#160;&#160;
        <Link to="/entries/residential school survivor">
          residential school survivor
        </Link>
        &#160;&#160;
        <Link to="/entries/reconciliation week">reconciliation week</Link>
        &#160;&#160;<Link to="/entries/assimilation">assimilation</Link>
        &#160;&#160;<Link to="/entries/reconciliation">reconciliation</Link>
        &#160;&#160;
        <Link to="/entries/missing and murdered women">
          missing and murdered women
        </Link>
        &#160;&#160;
        <Link to="/entries/First Nations language">First Nations language</Link>
        &#160;&#160;
        <Link to="/entries/aboriginal language">aboriginal language</Link>
        &#160;&#160;
      </p>
      <p>
        All linked terms also link back to <em>residential school</em>, so that
        the reader can browse by topic as well as by the alphabet.
      </p>
      <SecondaryHeader>Frequency Index</SecondaryHeader>
      <p>
        How did we arrive at the Frequency Index that allows the comparison of
        internet-generated data across domains? Computational linguists prefer
        to work with a corpus, that is, a body of text that has been selected
        based on a set of principles, such as national origin, genre, and the
        like. Corpora using material taken from the web are usually "cleaned",
        that is, filtered in some way to adhere to these selection principles.
        While these cleaned web corpora may be big, often in the 10 or 20
        billion word range today, searches for open class lexical items require
        resources that are much bigger, by several magnitudes. (An open class
        word is a word that is easily added to the lexicon, such as nouns for
        new inventions, like <em>smart phone</em>, or verbs for new actions,
        like <em>upload</em> in reference to the web. Closed class words are
        those with a grammatical function, like prepositions or modal verbs.)
        Canadianisms are by definition already limited nationally, and some of
        them are quite rare: searches on the open web are, for the time being,
        our best shot at finding enough evidence to track the geographical
        dimension crucial to our comparative focus in DCHP‑2.
      </p>
      <p>
        Computational linguists have good reasons for compiling their own
        corpora that revolve around well-known problems with commercial search
        engines such as Google, Bing and Yahoo. There are five major problems
        that compromise any open web search, and they require workaround
        procedures to minimize them. The problems stem from the following
        features of commercial search engines:
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>
          they are optimized for finding hits relevant to one's search terms,
          not for retrieving all occurrences on the web;
        </li>
        <li>
          they function as "black boxes" whose design features are unknown;
        </li>
        <li>
          they count web pages on which many tokens of a search term might
          occur, rather than each token;
        </li>
        <li>
          they are dynamic, not static, causing problems for the replication of
          results;
        </li>
        <li>
          they are accessed via search tools whose algorithms are not published.
        </li>
      </ul>
      <p>
        There are other problems, such as non-lemmatization. A lemma comprises
        all forms of a given item, e.g. the lemma <em>play</em> (v.) would
        include the forms <em>plays, playing, played</em> as well as{" "}
        <em>play</em> and <em>to play.</em> As lemmatization is not available in
        commercial search engines, one must carry out multiple searches per
        lemma. In the light of these issues, computational lexicographers
        (Kilgarriff 2007, Pomikálek et al. 2012) have made a well-argued case
        against "googling" and for web-crawled and cleaned corpora that remedy
        the problems listed above.
      </p>
      <p>
        As we felt we needed to work with commercial search engines nonetheless,
        we developed procedures that are anchored in estimating the size of URL
        domains for English-speaking countries and provinces on the one hand
        and, on the other hand, in monitoring the search engine behaviour at the
        time of particular searches (for full details see Dollinger 2016a).
        Google has the biggest search index and thus gives us the best chance at
        retrieving enough tokens to address a term's national and regional
        dimension.
      </p>
      <TertiaryHeader>Normalizing web domains</TertiaryHeader>
      <p>
        The biggest problem in using web searches for comparative purposes is
        that we do not know the relative size of each domain, such as .ca. or
        .uk, although we do know that the populations for the countries the
        domains stand for vary immensely in size from Ireland, the smallest, to
        the US, the largest. We tested an idea to address this problem with the
        GloWbE corpus (Davies 2013), which offers sub corpora between 35 and 390
        million words for twenty varieties of English. If a term could be found
        that remains constant in relation to the domain size of its variety, we
        could use this term to gauge the size of the domain (see Figure 5). For
        instance, the term <em>shall</em> occurs 354,939 times in the US domain
        of GloWbE, which has a total of 386,809,355 words. By dividing the
        number of hits by the overall size of the US data we get a quotient:
      </p>
      <p>
        Quotient for <em>shall</em> in US = 354939 / 386809355 = 0.00092.
      </p>
      <p>
        We applied this process to a number of terms over the 20 domains. Figure
        5 shows the comparison of the lexical items <em>could</em>,{" "}
        <em>shall</em>, and <em>must</em> and <em>like</em>. If the line for a
        particular term was fully horizontal it would mean that the term's
        frequency is proportionally identical in all varieties and thus a
        perfect normalizer for the web. The goal must be to come as close as
        possible to a fully horizontal line.
      </p>
      <p>
        <FrontmatterImage src={img_picture15} alt="" />
      </p>
      <p>Figure 5: Visual comparison of four normalizing terms</p>
      <br />
      <p>
        In Figure 5 we see that <em>shall</em>, which is more infrequent than
        the others, shows variation between 0.00010 in the UK and 0.00050 in the
        Philippines. Here we can see that <em>shall</em> is relatively bad as a
        normalizer because the fluctuation is a striking 400 percent (=
        100/0.00010*(0.00050-0.00010). Table 1 charts 10 terms and their
        relative fluctuation:
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>snow</em>
            </p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>shall</em>
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>pool</em>
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>cat</em>
            </p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>sex</em>
            </p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>rain</em>
            </p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>like</em>
            </p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>must</em>
            </p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>house</em>
            </p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <em>could</em>
            </p>
            <p>
              <br />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>728%</p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>400%</p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>273%</p>
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>225%</p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>200%</p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>173%</p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>78%</p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>70%</p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>69%</p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>53%</p>
          </td>
        </tr>
      </table>
      <p>WORST (LEFT) TO BEST (RIGHT) NORMALIZERS BASED ON GloWbE</p>
      <p>
        Grammarians distinguish between open class words, which are content
        words that can be easily added to the lexicon (e.g.{" "}
        <em>smart phone, to upload</em> something to the web) and closed class
        words, i.e. terms that serve a grammatical function (e.g. prepositions{" "}
        <em>to, up, on</em>; modal auxiliaries <em>shall, will</em> and the
        like) that cannot be added at will. Worst in this sample is open class
        term <em>snow</em> with 728%, while best is closed class term{" "}
        <em>could</em> with 53% fluctuation. <em>Could</em> was the normalizing
        term used in DCHP‑2 (see Dollinger 2016a: 76-77, Table 3 for discussion
        of a possibly better normalizer, the definite article and most frequent
        word in English: <em>the</em>).
      </p>
      <TertiaryHeader>Monitoring the search engine</TertiaryHeader>
      <p>
        After having found a way to compare findings across different domains,
        it remains important to monitor the behaviour of the commercial search
        engine over time. Figure 6 shows such monitoring of google.ca, via the
        documented number of hits for normalizer <em>could</em> in the domains
        used in DCHP-2's Frequency Charts, from late 2012 and early 2013:
      </p>
      <p>
        <br />
      </p>
      <p>
        <FrontmatterImage src={img_cf08e6_html_7ed87689} alt="" />
      </p>
      <p>
        Figure 6: Top-level domain tracking (Nov. 2012-Jan. 2013) with
        normalizer <em>could</em>
      </p>
      <br />
      <p>
        Figure 6 is used to confirm or discard searches made on a particular
        day: as can be seen in the spikes in .au (Australia) and in the .gov
        (American government) domains on 27 and 29 Nov. 2012. Google manipulated
        their index for Australia and on 28 Nov. 2012 for .gov domains without
        increasing the index size. Results on that day must be thrown out. If
        the higher level had been maintained (which would have been possible
        with an increase of the size seen in the .gov domain), the web index
        would have been permanently increased, which means that Google would
        have permanently increased the size of its search index for a particular
        domain.
      </p>
      <p>
        Normalization and web monitoring are the two main procedures that
        underlie the DCHP‑2 charts and they make us fairly confident that the
        charts deliver reliable data (see Dollinger 2016a: 89-92 and Robert
        Lew's concerns in Dollinger 2016b for words of caution). In certain
        cases, Google's number estimates over-represents the actual results.
        This problem can be circumvented by clicking at one of the later hits,
        which leads Google to adjust the count (e.g. <em>poutine</em>). Like all
        statistical data, they should be contextualized with other information
        if they are to be used as evidence, something that we do in the Word
        Stories.
      </p>
      <TertiaryHeader>How to read Frequency Chart headings</TertiaryHeader>
      <p>
        The precise search terms are always shown in the chart headings.
        Multi-part words were always searched for with quotation marks, so the
        chart for entry <em>Sobey's bag</em> was created by entering:
      </p>
      <p>
        "sobeys bag" site:.ca --&gt; followed by other site searches, e.g.
        site:.edu
      </p>
      <p>
        If the chart under <em>toque</em> reads <strong>toques</strong> (Image
        4) as the headline, the search term was the plural form, which provided
        better information than the singular form, in this case because the term
        is part of the name of a monkey species (the <em>toque macaque</em>{" "}
        monkey).
      </p>
      <p>
        Due to the polysemous nature of some terms, searches were narrowed by
        adding or excluding search terms, at times using more specialized
        phrases, which are reproduced in double quotation marks, such as in{" "}
        <em>tick</em> 'credit' with the search term "buy on tick" (see Image 4),
        or for off-reserve in the phrase "off-reserve population", which
        produced a usable number of hits. Other meanings were isolated by adding
        Boolean search terms (AND, NOT), as can be seen in the chart for{" "}
        <em>day parole</em>, arrived at via "day parole" AND "prisoner" or{" "}
        <em>unemployment</em>, as in <em>she's on unemployment</em>, which
        required us to exclude the term insurance (hence NOT insurance). The
        decision to narrow a search was made by reading through the quotations
        and deciding whether the targeted meaning and only (or almost only) the
        targeted meaning had been produced. We do not explain why a certain
        search term combination was used and not another one, as a discussion of
        such methodological questions could easily take up more space than the
        main part of the entry.
      </p>
      <p>
        We aimed to make the data as comparable as possible. All search dates
        are offered in the captions. The Frequency Index, discussed in detail in
        Dollinger (2016a: 79-87), is the quotient of
      </p>
      <TertiaryHeader>
        Hits of search term/phrase divided by normalizer could * multiplier
      </TertiaryHeader>
      <p>
        The multiplier is always offered in the y-axis label (here 100,000 for{" "}
        <em>sobeys bag</em>, but 10,000 for <em>toques</em>). Different
        multipliers are used to make the charts more readable on the page, while
        allowing the cross-comparison across charts.
      </p>
      <p>
        <br />
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_6235c431} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_fbfbb98d} alt="" />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_47ffe327} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_3e23d0f5} alt="" />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_eceeed08} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_1738fb9a} alt="" />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>Figure 7: Reading Frequency Chart headers</p>
          </td>
          <td className="border border-gray-300 p-1 align-top"></td>
        </tr>
      </table>
      <p>
        The method at times produced gaps in the documentation. For instance,{" "}
        <em>scrob</em>, a Newfoundland term, is listed only with an
        international chart, in which is Canada leading by an overwhelming
        margin. We did not include a provincial chart because the provincial
        searches yielded fewer than five tokens per provincial domain, too few
        for meaningful conclusions (in addition, the results often include
        typos, such as for <em>scrub</em>, reducing the low-token count
        further). If a provincial chart appears to be missing, it is for that
        reason.
      </p>
      <p>
        In some rare cases, e.g. <em>dozy</em> 'dim-witted', we were unable to
        produce Frequency Charts; however, our assessment rests on some corpus
        data. In the case of <em>dozy</em>, we list negative American search
        results, as our classification of the meaning rests on a lack of the
        form in the US. Although we are aware that using negative evidence based
        on corpora might simply mean the corpora do not contain the right
        text-types or are not big enough, in particularly strong cases we have
        decided to build our argument on it. Given that one of our corpora is
        the open web, we can be fairly confident that the biggest text
        collection of written contemporary genres is free of the form.
      </p>
      <TertiaryHeader>Rare workarounds</TertiaryHeader>
      <p>
        Occasionally, when no satisfactory search term combinations were found
        for the headword, we devised feasible workarounds with a related term.
        As the search for <em>cork boot</em> proved impossible because of too
        much interference from related terms, we searched for the related form
        "caulk boots" instead and were able to show the BC provenance of the
        concept and thus, we believe, also for the headword proper.
      </p>
      <p>
        In very few cases, we used a "wildcard" search. For "hang up
        his/her/their/the etc. skates", we used the asterisk to search for any
        term that occurred before skates. Thus "hang up * skates" returns
        results for "hang up her skates", "hang up his skates", "hang up the
        skates" and the like (including the erroneous result "hang up John's
        skates").
      </p>
      <TertiaryHeader>Other charts</TertiaryHeader>
      <p>
        Our most common charts show normalized web frequency, yet occasionally
        we use other kinds of charts. Where meanings rather than forms are
        Canadian, we occasionally applied a more fine-grained analysis of a
        smaller sample by providing the results of a semantic analysis of
        unambiguous examples, such as for the term <em>to table</em>{" "}
        (legislation etc.), which can mean either 'to postpone' or 'to bring
        forward' for discussion.
      </p>
      <p>
        Figure 8 shows the results of a reading of 100 unambiguous examples of
        "tabled" in each three years, 1990-2013, in Canadian and US newspaper
        data. As can be clearly seen, the Canadian meaning is 'bring forward' in
        around 90% of all cases, while the dominant US meaning is 'to postpone'.
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_3579553d} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_6cf08e6_html_7d927ec} alt="" />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              Figure 8: Semantic analysis for <em>tabled</em>
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
        </tr>
      </table>
      <p>
        In cases when all or the main competing variants were known, we opted to
        offer, in addition to the Frequency Chart, a close-up of the situation
        on the .ca domain, such as in Figure 9 (left) for <em>dish soap</em>:
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_6cf08e6_html_59a1da0} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_c9082166} alt="" />
            </p>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <p>
              Figure 9: Main competitors for <em>dish soap</em> on .ca domain
              (left) and Frequency Chart (right)
            </p>
          </td>
        </tr>
      </table>
      <p>
        These data show that <em>dish soap</em>, although not distinguished by
        frequency compared to Ireland or New Zealand, is the preferred term here
        and does have a Canadian dimension in the North American context
        (Frequency Index points: Ireland 473, Canada 61, US 27, UK 12), as shown
        in Figure 9 on the right.
      </p>
      <p>
        The quantitative data behind these various visualizations show the
        Canadian dimension of previously unidentified Canadianisms, such as{" "}
        <em>take up</em> meaning 9 (added in COD-1 &amp; COD-2 but not marked as
        Canadian), <em>joe job</em>, '<em>menial job</em>' (listed in Gage-3,
        Gage-5 but not marked), or reveal a regional preference, e.g.{" "}
        <em>table cream</em> 'coffee cream' (PEI), <em>Sobey's bag</em>{" "}
        (Maritimes, esp. NS, 'plastic shopping bag'), or <em>strata (</em>BC,
        'collective real estate ownership'). A range of new Canadianisms, e.g.{" "}
        <em>squarehead</em> (meaning 2) or <em>padiddle</em>, was also found,
        and the previous identification of terms or meanings as Canadian was
        given further backing, e.g. <em>backcatcher, gem jar, Molson muscle</em>{" "}
        and <em>poutine</em>.
      </p>
      <br />
      <SecondaryHeader>DCHP-1 Online: A digitized DCHP-1</SecondaryHeader>
      <p>
        The project's first public milestone was the launch in 2013 of the
        digitized version of the first edition, DCHP‑1 Online (Dollinger,
        Brinton and Fee 2013). Digitizing legacy data has not been a glorious
        task, which holds even more true for the lexicographical world with its
        especially thick volumes. When OED-2 was published on CD-ROM in 1992,
        and later on the internet, it integrated the contents of the 12-volume
        OED-1 with five "supplement" and three "additions" volumes and added
        only a small percentage of new entries. This pioneering venture in
        digital humanities made possible the revision and update of the third
        edition, which was begun in 2000.
      </p>
      <p>
        With DCHP-1, some of the same steps had to be retraced in a much smaller
        and different context. After initial digitization, which was carried out
        by the University of British Columbia Archives and Special Collections,
        the text was proofread by UBC students in 2010-11 (for a list of staff
        and volunteers see{" "}
        <a
          href="http://www.dchp.ca/DCHP-1/pages/team"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        ). After a period of copyright negotiations, DCHP‑1 Online was made
        available in open access in 2013, free of charge for everyone at{" "}
        <a href="http://www.dchp.ca/dchp1" target="_blank" rel="noreferrer">
          www.dchp.ca/dchp1
        </a>
        . By that time, DCHP‑1 had been out of print for decades and had fallen
        into oblivion. Today, users can easily access the online version and
        bibliophiles may order remaindered paper copies of the 1991 reprint{" "}
        <a
          href="http://faculty.arts.ubc.ca/sdollinger/dchp2.htm#dchp-1"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        ).
      </p>
      <br />
      <SecondaryHeader>Benchmarks of DCHP-2</SecondaryHeader>
      <p>
        DCHP‑2 contains 1002 new lexemes, which increases the headword count of
        DCHP‑2 by about ten percent (DCHP‑1 Online: 10,974 headwords). The{" "}
        <em>Bank of Canadian English</em>, which is the quotations database,
        comprises (2 Dec. 2016) 51,345 newly collected quotations in addition to
        the 24,753 quotations from DCHP‑1, for a total of 76,098. In total, 1239
        additional meanings are included in the update, for which 8713
        quotations were selected as evidence from the{" "}
        <em>Bank of Canadian English</em> (Dollinger, Brinton &amp; Fee
        2006-2016). The update increases the quotation count by just over 35%.
      </p>
      <p>
        The 1239 meanings comprise 1103 Canadianisms and 136 Non-Canadianisms,
        which makes almost 11 percent of all meanings, or more than one in ten,
        non-Canadian. This finding is an important corrective to previous
        knowledge. Among the 1103 Canadian meanings, the six types are
        distributed as follows (percent of Canadianisms in the update):
      </p>
      <ol className="my-4 ml-8 flex list-decimal flex-col gap-y-2">
        <li>Origin: 358 meanings or 32.4 percent</li>
        <li>Preservation: 138 meanings or 12.5 percent</li>
        <li>Semantic Change: 202 meanings or 18.3 percent</li>
        <li>Culturally Significant: 164 meanings or 14.9 percent</li>
        <li>Frequency: 227 meanings or 20.6 percent</li>
        <li>Memorial: 14 meanings or 1.3 percent</li>
      </ol>
      <p>
        The update includes a total of 241 Images, 861 Frequency Charts, and
        2502 references to secondary literature. We refer to a total of 405
        sources, including dictionaries and encyclopedias. The Frequency Charts
        consist of 694 international charts using the top-level internet domains
        and 167 regional charts based on the 13 provincial and territorial
        Canadian government internet subdomains. DCHP‑1 to a large degree
        focused on the historical dimension of words and meanings now obsolete:{" "}
        <em>aboiteu</em>, <em>Digby chicken</em>, <em>splake</em> or{" "}
        <em>Yankee fix</em>, Canadian terms no longer known to many Canadians.
        The overall goal of the update was to reflect changes since World War
        II, although we do include some earlier Canadianisms, including some
        that are revisions of entries in DCHP‑1. While aiming to build a case
        for the status of Canadian English lexis as a unique collection of terms
        and meanings, we also wanted to eliminate "false Canadianisms". Charles
        Boberg argues that the strongest case for the distinctiveness of
        Canadian English rests on vocabulary that excludes "objects or cultural
        phenomena found only or mostly in Canada" (Boberg 2010: 115). While we
        include such vocabulary in the update, e.g. <em>to table (v.)</em>,{" "}
        <em>take up (phr. v.</em>), <em>toque</em> or <em>tick</em>, we also
        list words that are socially, culturally, politically, topographically
        and geographically tied to Canada, e.g. <em>throat singing</em>,{" "}
        <em>Timbits</em>, <em>treaty Indian</em> and <em>two solitudes</em>.
        Both kinds of Canadianisms are of interest to dictionary users.
      </p>
      <p>
        The increase around a thousand headwords may seem modest; however, there
        is quite an increase in detail and evidence in each of the new entries
        when compared to the legacy data from DCHP‑1. A comparison between the
        original entry for <em>landed immigrant</em> in DCHP‑1 and DCHP‑2 shows
        the difference visually (Figures 10a and 10b):
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_d13a70e6} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
            <p>
              <br />
            </p>
            <p>
              <br />
            </p>
            <p>
              <br />
            </p>
            <p>
              <br />
            </p>
            <p>
              <br />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              Figure 10a: Entry for <em>landed immigrant</em> in DCHP-1 (DCHP-1
              Online)
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_d3d8e120} alt="" />
            </p>
            <p>
              <br />
            </p>
            <p>
              <FrontmatterImage src={img_cf08e6_html_b62f0ba3} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              Figure 10b: Entry for <em>landed immigrant</em> in DCHP-2
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
        </tr>
      </table>
      <p>
        A comparison between versions a and b of Figure 10 shows that only the
        1964 quotation and parts of the definition were taken over from DCHP‑1.
        The count of 1002 headwords was not an utterly arbitrary choice. As the
        Introduction to OED-2 put it "Omission should not be equated with
        exclusion" (xxii), given funding and time constraints. In fact, the
        editorial files contain unfinished drafts for additional Canadian terms
        and meanings. The choice of 1002 headwords is therefore a symbolic nod
        of appreciation to DARE - the{" "}
        <em>Dictionary of American Regional English</em> - which offers the most
        precise regional dimension of any dictionary, and which is based on
        fieldwork study in 1002 American communities. DARE - the longest-running
        National Endowment for the Humanities project in history - and DCHP‑2,
        funded with a string of three grants from the Social Sciences and
        Humanities Research Council and a patchwork of small grants - are very
        different dictionaries in both resources and scope, yet both follow the
        principles of documenting historical semantic changes in the most
        precise and feasible way in each regional context (for a comparison
        between the two dictionaries, see Dollinger &amp; von Schneidemesser
        2011).
      </p>
      <SecondaryHeader>Encyclopedic entries</SecondaryHeader>
      <p>
        Readers will notice that encyclopedic content, that is, terms such as{" "}
        <em>CANDU</em>, <em>Canadian Pacific Railway</em>, or <em>VQA</em>, is
        found quite often in the DCHP‑2 update. In this respect, DCHP‑2
        continues the trend set in DCHP‑1 that in turn followed the practice
        established in Noah Webster's lexicographical tradition. The 1933
        edition of the <em>Oxford English Dictionary</em> (OED-1) speaks in this
        context of
      </p>
      <p>
        an indefinite number of <em>Proper</em> or mere <em>denotative</em>{" "}
        names, outside the province of lexicography, yet touching it in
        thousands of points, at which these names, and still more the adjectives
        and verbs formed upon them, acquire more or less of connotative value.
        Here also limits more or less arbitrary must be assumed. (OED-1, General
        Explanations, xxvii)
      </p>
      <p>
        In the Canadian contexts we decided to cast our net rather wide. We had
        good reason to do so, beyond following an established practice in the
        field, because what some consider encyclopedic content that is not of
        primary interest to lexicography often acquires a new dimension in the
        Canadian context where a number of more generally-used Canadian terms
        have their origin in proper names, such as <em>Genie (Award)</em>,{" "}
        <em>Robertson screw</em>, or <em>Vancouver Special</em>. Most of these
        terms are related to the area of onomastics, the study of proper nouns,
        which are one type of encyclopedic entry that refers to a specific
        public event or otherwise known fact that comes "with many complex
        associations" (Landau 2001: 212). Landau gives perhaps the best reason
        for the inclusion of encyclopedic entries:
      </p>
      <p>
        It would be impossible to define such associations, since they differ
        from person to person, are often emotional, and depend on nonlinguistic
        cultural phenomena, but the central fact of the event is that it is
        shared by many people, and because of the importance and frequency of
        such allusive words in the language, dictionaries cannot ignore them.
        (Landau 2001: 212)
      </p>
      <p>
        In a dictionary of Canadianisms, such events are obviously very
        important for collective memory. Examples of such uses include the
        meanings of <em>Gretzky effect</em>, <em>Trudeaumania</em>, and{" "}
        <em>Sixties Scoop</em>. No matter how one views <em>Trudeaumania</em> or
        the <em>Gretzky effect</em>, they are part of what makes Canada, Canada.
        Leaving such terms out would have resulted in an overly narrow, and
        indeed distorted view of the Canadian vocabulary.
      </p>
      <p>
        At the same time, we did not include proper names <em>per se</em>,
        unless they have acquired metaphorical uses, such as{" "}
        <em>Howe Street</em> for Vancouver's banking and finance circle, and{" "}
        <em>Vi-Co</em> as a generic Saskatchewan term for chocolate milk, or
        unless they had a culturally salient dimension, such as <em>Anik</em>,{" "}
        <em>Canada Pension Plan</em> and <em>Red Fife</em>. As in DCHP‑1 (Avis
        1967: xv), we exclude the names for Aboriginal peoples as headwords in
        general, except when they refer to other entities, e.g. <em>Salish</em>{" "}
        (for <em>Salish apple</em>) is included, while <em>Salish</em> for
        Salish people is not.
      </p>
      <SecondaryHeader>
        Background colours: DCHP-2 data, DCHP‑1 legacy data and non-Canadian
        terms
      </SecondaryHeader>
      <p>
        Armed with the typology and the methodological tools presented above, we
        aimed to navigate the complex task, in Avis's words (1983: 4), of
        preparing a dictionary of Canadian English that is "complicated by a
        great deal of unsettled and divided usage" of Canadian, American and
        British speakers, a complication that is further compounded the further
        one goes back in time. As these tools have only been applied to the
        newly written headwords and meanings, which were integrated with
        unaltered entries from DCHP‑1 Online, we opted for a colour scheme to
        distinguish clearly between entries in the two editions when they are
        linked by cross-references:
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_7aabf2eb} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_4ed35ac0} alt="" />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>WHITE background = DCHP-2 update entry</p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>YELLOW background = unchanged DCHP‑1 legacy entry</p>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <p>Figure 11: White and yellow background colours</p>
          </td>
        </tr>
      </table>
      <p>
        DCHP-1 legacy entries are visually marked by a yellow background, here
        on the right for <em>demoiselle</em>, from the new DCHP‑2 update
        content, on the left, which appears on white background (here for{" "}
        <em>denticare plan</em>, with Frequency Chart omitted). In addition,
        legacy entries contain the label "DCHP-1 (pre-1967)" in the upper right
        corner, and the warning "THIS ENTRY MAY CONTAIN OUTDATED INFORMATION,
        TERMS and EXAMPLES" below it to clarify that we do not endorse outdated
        or discriminatory wording in DCHP‑1. For the new entries, the top right
        corner, inspired by OED‑3, shows the month and year the entry was last
        saved.
      </p>
      <p>
        A third background colour is used to differentiate non-Canadian terms
        from the Canadianisms in the DCHP‑2 update. The colour red and the label
        "Non-Canadianism" in the top right corner mark this category.
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_cf08e6_html_9bcc2382} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
        </tr>
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>Figure 12: Non-Canadianisms marked by RED background</p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
        </tr>
      </table>
      <p>
        For <em>multicult</em>, we found no evidence that it was a Canadianism
        (although it was labelled as such in COD-2), while the long form{" "}
        <em>multiculturalism</em>, to which this entry links, is indeed
        Canadian.
      </p>
      <p>
        In entries for Canadianisms where one or more meanings are not Canadian,
        we used the dagger device, borrowed from DCHP-1, to mark meanings "which
        are not Canadian at all" (Avis 1967: xiii). Meanings labelled with a
        dagger are not Canadian, but are included because related meanings are.
        The entry <em>giveaway</em> in Figure 13, for instance, has two
        meanings. Meaning 1, 'something […] given away free of charge' is
        labelled 1 'superscript dagger' <em>n. &amp; adj.</em>, marking this
        meaning as non-Canadian, while Meaning 2 (only the definition shown
        below) 'loss of the puck […] resulting in goal' is a Canadianisms of
        Type 4 - Culturally Significant.
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <FrontmatterImage src={img_6cf08e6_html_3e09bef} alt="" />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
        </tr>
      </table>
      <p>
        Figure 13: Entry for <em>giveaway</em> with dagger in Meaning 1.
      </p>
      <TertiaryHeader>Homonyms &amp; polysemous forms</TertiaryHeader>
      <p>
        Following conventional lexicographic practice, homonyms, i.e. forms that
        are accidentally identical but not historically related, are listed
        separately. As a result of the integration of DCHP‑1 headwords, which
        use ( ) to show variants, we render superscript numbers in double round
        parentheses, (( )).
      </p>
      <p>
        Therefore, <strong>noddy ((1))</strong> and <strong>noddy ((2))</strong>{" "}
        are equivalent to <strong>noddy</strong>
        <sup>
          <strong>1</strong>
        </sup>{" "}
        and <strong>noddy</strong>
        <sup>
          <strong>2</strong>
        </sup>
        . Likewise <strong>blackberry ((1))</strong> and{" "}
        <strong>blackberry ((2))</strong> are unrelated forms rather than two
        meanings of one and the same lexeme.
      </p>
      <TertiaryHeader>Spelling variants</TertiaryHeader>
      <p>
        We understand by spelling not just differences in the sequences of
        letters, e.g. <em>colour</em> vs. <em>color</em>, but also variation in
        upper or lower case, e.g. <em>bi and bi</em> vs. <em>Bi and Bi</em> is
        considered a "spelling difference". Sometimes we include related forms
        that may be used as synonyms.
      </p>
      <TertiaryHeader>Dictionaries Used for Comparison</TertiaryHeader>
      <p>
        As anticipated by Lovell, the comparison with other dictionaries is
        important. Pratt (2004) was proven right that DARE would be most
        valuable source of comparison, as are the older American dictionaries of
        national terms, such as DAE (Craigie and Hulbert 1938-44) and DA
        (Mathews 1951), as the example of <em>Cowtown</em> 'Calgary' shows. The
        OED‑3 is, of course, often the first stop in any comparative quest. To
        establish the historical component we operated with a set of
        dictionaries that were checked for all terms:
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>
          <em>Oxford English Dictionary</em> - 3rd ed. (Simpson and Proffitt
          2000-)
        </li>
        <li>
          <em>Dictionary of American Regional English</em> (DARE) (Cassidy &amp;
          Hall 1985-2013)
        </li>
        <li>
          <em>Dictionary of American English</em> (DAE) (Craigie &amp; Hulbert
          1938-1944)
        </li>
        <li>
          <em>Dictionary of Americanisms</em> (DA) (Mathews 1951)
        </li>
        <li>
          <em>English Dialect Dictionary</em> (EDD) (Wright 1896-1905)
        </li>
        <li>
          <em>Australian National Dictionary</em> (AND) - 1st ed. (Ramson 1988)
        </li>
        <li>
          <em>Oxford Dictionary of New Zealand English</em> (DNZE) (Orsman 1997)
        </li>
        <li>
          <em>Dictionary of South African English</em> (DSAE) (Silva 1998)
        </li>
        <li>
          <em>Random House Historical Dictionary of American Slang</em>, Vols 1
          &amp; 2 (Lighter 1994 &amp; 1997)
        </li>
        <li>
          <em>Webster's International Dictionary</em> (W-3) ­- 3rd ed. (Gove
          1961)
        </li>
        <li>
          <em>American Heritage Dictionary</em> (AHD-5) - 5th ed. (Pickett 2011)
        </li>
      </ul>
      <p>
        In addition to these, more specialist dictionaries were consulted where
        warranted, e.g. the <em>Dictionary of Alaskan English</em> (Tabbert
        1991) for Northern terms. We conducted a contemporary comparison with
        the three general desk dictionaries in Canadian English:
      </p>
      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>
          <em>Canadian Oxford Dictionary</em> - 2nd ed. (Barber 2004)
        </li>
        <li>
          <em>Gage Canadian Dictionary</em> - 5th ed. (DeWolf et al. 1997)
        </li>
        <li>
          <em>ITP Nelson Canadian Dictionary</em> ­- 1st ed. (Friend et al.
          1997)
        </li>
      </ul>
      <p>
        In the interest of readability, we applied a shorthand system that
        allows the tracing of each meaning as Canadian in the literature. But
        rather than offering long lists (e.g. included in Gage-1 (1967), Gage-2
        (1973), Gage-3 (1983), Gage-4 (1990) and Gage-5 (1997) and reprints), we
        generally list the first dictionary in a series that lists it. The
        information "Gage-3, which&#160;marks the meaning Cdn" in{" "}
        <em>bilingual</em> (2), means that Gage-3 is the first edition in that
        dictionary series that identifies the meaning as Canadian and that
        Gage-4 and Gage-5 mark it this way too. The purpose of this method is to
        give credit to the earliest dictionary source where available. These
        dictionaries vary widely in which words they label as Canadian, which
        shows the importance of checking all three (e.g. <em>scrum</em> (2) is
        only documented in the ITP Nelson, <em>bloody-minded</em> 'stubborn'
        only in COD-2; <em>Mountie</em> is marked "Cdn" only in Gage-1 and
        subsequent editions, while <em>washroom</em> 'public toilet', is not
        labelled "Cdn" in Gage-5 and ITP Nelson.
      </p>
      <p>
        Where only the reference COD-2 is found, the reader can be certain that
        the COD series, starting in 1998, was the first dictionary and the only
        Canadian dictionary to document the meaning as Canadian. If a dictionary
        is not listed, it means that neither the term nor any of its meanings
        are marked as Canadian in any way. The comparison of the three main desk
        dictionaries of Canadian English reveal their strengths and weaknesses
        with respect to labelling of Canadianisms, which was not, of course,
        their major purpose.
      </p>
      <TertiaryHeader>Expressions</TertiaryHeader>
      <p>
        DCHP-1 did not document many expressions and we document only a few
        more, including <em>back of the net</em>, <em>hang up one's skates</em>,
        or <em>done like dinner</em>. There are a total of 20 expressions in the
        DCHP‑2 update, with quotations ranging from the year 1900 to 2016.
      </p>
      <TertiaryHeader>Written and spoken language</TertiaryHeader>
      <p>
        DCHP-1 did not consider "terms for which there is only oral evidence",
        in order to comply maximally with OED principles of the day (Avis 1967:
        xii), which led to the exclusion of much interesting material. DCHP‑2
        includes such terms, yet is limited to the extent that no systemic oral
        data collection was possible. The resources of spoken language that
        exist are data collections from sociolinguists or corpora such as the{" "}
        <em>International Corpus of English</em> (see ICE Project), among
        others, which are designed for the study of grammatical phenomena and
        are much too small for lexical searches of the kind we require. Spoken
        language attestations, of which we give some dozen examples, come in
        most cases from transcriptions of spontaneous speech or, occasionally,
        from audio or video recordings.
      </p>
      <p>
        Spoken language, which provides some of the most interesting material,
        remains one of the challenges in lexicography. One example is{" "}
        <em>Game 7</em>, for which despite detailed searches, we do not have
        enough evidence to warrant listing a figurative meaning, which doubtless
        exists in speech and may indeed be widespread. We offered a Fist Note
        explaining the current state of knowledge. A written questionnaire
        survey (Dollinger 2015b) would be the best means to get to the bottom of
        the usage, yet attestations would need to be found by other means.
        Another example is positive <em>anymore</em>, for which we could only
        muster two very recent dated attestations of a receding construction
        that was more widespread earlier in the 20th century.
      </p>
      <TertiaryHeader>
        Terminology used in editorial text, e.g. definition or Word Story
      </TertiaryHeader>
      <p>
        Since this is a dictionary of Canadian <em>English</em>, we have
        generally taken an Anglophone perspective on Canadian matters.
        Nonetheless we aim to give equal voice to conflicting opinions,
        especially with respect to terms that relate to the English-French and
        mainstream-Aboriginal dimensions. Whether one considers{" "}
        <em>sovereignty</em> (meaning 1) or <em>separation</em> (meaning 1) as
        the more appropriate term in the Canadian French context is a matter of
        political perspective. In the Aboriginal context <em>sovereignty</em>{" "}
        acquires a different meaning. We try to provide an even-handed account
        of these differences, sometimes by including quotations that reveal
        strong political differences. Based on the relevance for some political
        science concepts and their complex interpretations, some Word Stories
        tend to be longer (e.g. <em>Meech Lake Accord</em>) than others (e.g.{" "}
        <em>Rest of Canada</em>).
      </p>
      <TertiaryHeader>Abbreviations as headwords</TertiaryHeader>
      <p>
        Generally, we link abbreviations, e.g. <em>grow-op</em>, to their long
        forms, e.g. <em>grow operation</em>, where the main information is
        offered. In some cases, we have entered both an abbreviated form, e.g.{" "}
        <em>MLA</em>, written as a full entry besides the long form, e.g.{" "}
        <em>Member of the Legislative Assembly</em>, in order to differentiate
        different uses of each form.
      </p>
      <SecondaryHeader>The regional dimension</SecondaryHeader>
      <p>
        With evidence from the provincial Frequency Charts and the Bank of
        Canadian English, we were able to foreground the regional dimension in
        DCHP‑2. Some terms or meanings are more or less confined to provinces,
        such as the ones listed below:
      </p>
      <p>
        British Columbia: <em>P.E., dry grad</em>
        <br />
        Alberta: <em>parking stall, health care card</em>
        <br />
        Manitoba: <em>Tundra Buggy, Saskabush</em>
        <br />
        Saskatchewan: <em>bunny hug, coffee row</em>
        <br />
        Ontario:{" "}
        <em>Big Blue Machine, collector lane, take up, 'review answers'</em>
        <br />
        Quebec: <em>all-dressed, francize, two-and-a-half</em>
        <br />
        Prince Edward Island:<em>table cream, mainland (2)</em>
        <br />
        New Brunswick: <em>redemption centre</em>
        <br />
        Nova Scotia: <em>blueberry buckle, Tintamarre</em>
        <br />
        Newfoundland: <em>after*</em> (perfect construction),{" "}
        <em>screech-in</em>
        <br />
        Yukon: <em>skookum, bush party</em>
        <br />
        Northwest Territories: <em>charter community, parks officer</em>
        <br />
        Nunavut: <em>skidoo, qulliq*</em>
        <br />
        (* not based on a Frequency Chart)
      </p>
      <p>
        In rare cases where findings allow, we offer more narrow regional labels
        that go beyond the Frequency Charts:
      </p>
      <p>
        Vancouver: <em>Frissant*</em>
        <br />
        Toronto &amp; Vancouver: <em>laneway house</em>
        <br />
        Montreal: <em>metro*</em>
        <br />
        Cape Breton: <em>Les Suêtes, mainland* (3)</em>
        <br />
        Gaspé Peninsula: <em>crawfish</em>*<br />
      </p>
      <p>
        More frequent than attestations that are located in one province, a
        quite arbitrary regional unit, are patterns that transcend provincial
        boundaries. Some terms or meanings cross adjacent provincial boundaries,
        while others show quite discontinuous regional patterns. With the
        provincial Frequency Chart data, for instance, one can show that{" "}
        <em>leg</em> [lɛdʒ] 'legislature' is a term that is found on the
        Prairies and in the North, above all in Alberta, Manitoba, the Yukon,
        the Northwest Territories and Nunavut. Such patterns offer an additional
        layer of evidence, in some cases a corrective, to existing regional
        labels. Some examples include:
      </p>
      <table className="my-4 border-collapse">
        <col />
        <col />
        <tr>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              <br />
            </p>
          </td>
          <td className="border border-gray-300 p-1 align-top">
            <p>
              mainland Canada (Canada except Newfoundland): <em>Newfie joke</em>
              <br />
              Central Canada (Ontario &amp; Quebec): <em>two-four</em>
              <br />
              Central Canada &amp; Prairies (Ontario, Quebec, Manitoba,
              Saskatchewan &amp; Alberta): <em>Morality squad</em>
              <br />
              Western Canada (Manitoba to British Columbia): <em>kubasa</em>
              <br />
              Northern Canada (usually Territories and northern parts of
              provinces): <em>sked</em> 'scheduled flight plan',{" "}
              <em>isolation pay</em>*<br />
              Western &amp; Northern Canada: <em>smudge</em> (1a, 1b, 1c)
              <br />
              British Columbia &amp; Quebec: <em>coffee cream</em>
              <br />
              Ontario &amp; BC: <em>Business Improvement Association</em>
              <br />
              Ontario &amp; Alberta: <em>grow-op</em>
              <br />
              Ontario &amp; Yukon: <em>bush party</em>
              <br />
              Prince Edward Island &amp; Nunavut: <em>snowmobile</em>
              <br />
              especially Nunavut, Northwest Territories, Yukon &amp; Prince
              Edward Island: <em>skidoo</em>
              <br />
              especially British Columbia: <em>Salish</em> (apple) - but if this
              award-winning apple gets more popular, it might soon be found in
              many places
              <br />
              Quebec &amp; Alberta: <em>exercise book, Texas gate</em>
              <br />
              British Columbia &amp; Alberta: <em>bumbleberry</em>
              <br />
              especially Manitoba &amp; Northwestern Ontario:{" "}
              <em>jambuster*</em>
              <br />
              especially Prince Edward Island &amp; Nunavut:{" "}
              <em>liquor commission</em>
              <br />
              predominantly Vancouver &amp; Toronto: <em>laneway house</em>
              <br />
            </p>
          </td>
        </tr>
      </table>
      <TertiaryHeader>
        Regional usage parallels: South Africa and beyond
      </TertiaryHeader>
      <p>
        In some cases we notice apparent parallel developments or Canadian
        influence in some Inner Circle Englishes, of which the Canadian-South
        African parallel appears to be the most striking, unexpected and
        unusual. A number of terms, e.g. <em>day parole</em>, <em>parkade,</em>{" "}
        or <em>Gravol</em> show high frequencies in both countries. While the
        connection is obvious in at least one case,{" "}
        <em>Truth and Reconciliation Commission</em> - the Canadian TRC was
        inspired in part by the South African ones - others defy such clear
        rationale. COD-2 noticed a parallel in at least one case, e.g.{" "}
        <em>write</em>, as in to <em>write an exam</em>, which we labelled
        Non-Canadian in our dictionary, but which was considered "Cdn &amp;
        South Africa" in COD-2.
      </p>
      <p>
        Other parallels are more easily explained. A distinct Commonwealth
        dimension can be found in "bath the baby", not <em>bathe</em>, the
        former form being more rare in the US and UK but widespread in the rest
        of the Commonwealth countries studied. The Irish connection is
        historically particularly strong in parts of the country, which explains
        perfective <em>after</em>; the Scottish connection explains{" "}
        <em>kitchen party</em>.
      </p>
      <TertiaryHeader>
        Special Cases: Newfoundland, Prince Edward Island, Cape Breton
      </TertiaryHeader>
      <p>
        The treatment of Canada's most linguistically diverse regions has
        presented special problems since the dictionary's foundation in the
        1950s. The problem is a result of long-established Canadian linguistic
        enclaves, which result in a highly uneven distribution of distinctly
        local terms in different parts of the country. While much of mainland
        Canada, above all the area from Ontario westwards, is comparatively
        homogeneous, other regions stand out as a result of very different
        settlement patterns. Newfoundland is by far the biggest such enclave
        (e.g. Clarke 2010), and the traditional dialect in the Ottawa Valley
        (Pringle and Padolsky 1983) and Cape Breton Island other widely known
        cases. Since DCHP-1, scholarly regional dictionaries on three varieties
        have appeared, with the <em>Dictionary of Newfoundland English</em> (DNE
        1982, 1999), the <em>Dictionary of Prince Edward Island English</em>{" "}
        (Pratt 1988) and, most recently, the{" "}
        <em>Dictionary of Cape Breton English</em> (Davey and MacKinnon 2016).
        The former two played an important part in the writing of DCHP‑2, while
        the latter will certainly inform future work. As the oldest and most
        diverse traditional dialect region in Canada, Newfoundland was given
        special focus in DCHP‑2. As the roughly 5000 lexemes in DNE would have
        swamped DCHP‑2, we were confronted - as mainlanders - with the difficult
        task of selection from an existing list. The 132 Newfoundland meanings
        comprise slightly more than 10 percent of the overall content. We strove
        to select, with input from our colleagues at Memorial University, a
        sample that would add a Newfoundland dimension within reasonable limits
        in the national context. We hope that some of the concerns expressed in
        Story &amp; Kirwin (1971), which highlighted the local perspective and
        data richness, could be alleviated as a result of the Newfoundland
        assistance. We are aware that not all problems pertaining to traditional
        Newfoundland terms, including some identified in Dollinger (2015c),
        could be addressed due to practical limitations.
      </p>
      <SecondaryHeader>Canadianisms and Americanisms …</SecondaryHeader>
      <p>
        The OED, DNE and DARE must be mentioned as the three historical sources
        to which we owe the greatest debt: the OED for its sheer scope and for
        offering a broader framework that would otherwise have been difficult to
        access; the DNE for allowing us to write more informed entries on
        Newfoundland terms and, more than once, to refer to their unique spoken
        or written quotations; and DARE, our "big sister dictionary", which has
        offered us superb data from the American neighbour for all non-standard
        terms we were interested in, and which has helped us greatly to improve
        the entries that are shared. That the overlap between DARE and DCHP is
        not greater than about 7% of DCHP-2's headword count (Dollinger &amp;
        von Schneidemesser 2011: 121) is the result of different sampling
        methods and scopes in both dictionaries. For DCHP-1, the word list
        focused on pronounced historical periods of Canadian interest, while
        DARE's word list started in a large-scale nation-wide fieldwork survey
        which were then traced back in time.
      </p>
      <p>
        The excellent DARE data confronted us with a special problem when
        assigning the type of Canadianism as, more often than not, obviously
        Canadian meanings are first attested in US material. To that end, we
        considered in our interpretations the fact that the publishing industry
        was generally more developed in the US than in Canada, especially but
        not exclusively as far as the West is concerned. For that reason, often
        the earliest attestations of otherwise clearly Canadian words are found
        in the US.
      </p>
      <p>
        Such cases are <em>Canuck, skookum</em>, and <em>toque</em>, the first
        and third of which are among the most widely recognized Canadian terms
        today, and for which we were able to offer a correction. <em>Canuck</em>
        , for instance, is first attested in 1835 by a traveller in Canada who
        reports on American usage. DARE lists this attestation, correctly, as
        American, while we list it as non-Canadian evidence of an older,
        otherwise lost meaning that would likely have applied to Canada as well.{" "}
        <em>Skookum</em>, a loan word from Chinook Jargon, the 19<sup>th</sup>
        -century contact language of the Canadian West Coast and US Pacific
        Northwest, has its earliest attestation in the US in 1847 in a glossary,
        and in an undated 19<sup>th</sup> century glossary in Canada published
        by T.N. Hibben &amp; Co., which was British Columbia's first bookstore,
        founded in 1858. We label both meanings as Culturally Significant, given
        the role of Chinook in early British Columbia and the Yukon. "Origin"
        might be possible for meaning 2, yet we err on the side of caution.
      </p>
      <p>
        Finally, DARE lists for <em>toque</em> its older spelling <em>tuque</em>
        , from 1856. Our Canadian antedate (from 1882 in DCHP‑1 to 1865) does
        not quite match the American source. In this case, <em>tuque</em> is
        referred to in the US text as the name for a riding hat "as the
        voyageurs call it", which we consider as solid evidence for the French
        Canadian connection. Thus, <em>toque</em> is labelled "Origin", with an
        explanation for an earlier American attestation for Canadian usage in
        DARE in the Word Story.
      </p>
      <SecondaryHeader>… and North Americanisms</SecondaryHeader>
      <p>
        The discussion above suggests that the discrimination between Canadian
        and US origins may become moot the further one goes back in time and the
        less clearly a Canadian and American identity would have been
        linguistically expressed. <em>Skookum</em>, for instance, is as much
        (Pacific Northwestern) American as it is (West Coast) Canadian. After
        work on DCHP‑1 was completed, Avis writes in no uncertain terms of
      </p>
      <p>
        the problem of identifying many terms as specifically "American" or
        "Canadian" [, which] is virtually impossible of solution. Needless to
        say, the editors of <em>A Dictionary of Canadianisms</em> [DCHP‑1] have
        struggled with this problem since the project began. In view of the
        difficulty and, perhaps, pointlessness of trying to identify many words
        in common use on this continent as being "American" or "Canadian,"
        lexicographers compiling dictionaries of the English used in North
        America might be well advised to adopt the label{" "}
        <em>North Americanism</em>. (Avis 1967: xiii)
      </p>
      <p>
        It is indeed unlikely that national identity, rather than local
        identity, would have been expressed in the earlier periods. Linguistic
        phenomena of nativization have been dated to the post-Confederation
        period (1867) based on social and political events (Schneider 2007:
        242-244), which is roughly confirmed for Ontario on empirical evidence
        to around 1850 in urban regions and 1875 in rural ones (Dollinger 2008:
        280-283). In the West, national identity formations would happen much
        later, however, with orientations to the US or the UK (exonormative
        stabilization in Schneider's model) lasting
      </p>
      <p>
        much longer than until 1867 [as suggested by Schneider], at least to the
        1930s or, in some cases the 1960s, when the first Canadian-made
        reference books came into wide circulation (the{" "}
        <em>Gage Canadian Dictionaries</em>, see DeWolf et al. 1997 for the
        latest edition). (Dollinger 2015b: 207)
      </p>
      <p>
        Despite the problems outlined above relating to American evidence, our
        typology and data sources have given us considerably more security in
        our assessments than the editors of DCHP‑1 were afforded. As a result,
        we can confine the challenging cases, such as the ones listed, to a
        handful, all of which are discussed in the respective Word Stories. We
        maintain for cases that would in a different framework warrant the label
        "North American" an assessment as <em>either</em> Canadian <em>or</em>{" "}
        American not only for the sake of consistency but also to offer a
        corrective: if dictionaries of dominant language varieties can afford to
        list joint vocabulary as belonging to their variety, it should be
        permissible for the non-dominant variety to proceed likewise. The
        reference to the other variety with an assessment guides the reader to
        the full context.
      </p>
      <p>
        The difficulty of cross-border usage is not easy of resolution as long
        as linguistic projects stop at national borders. From a Canadian
        perspective it seems legitimate to question the relevance of the label{" "}
        <em>Americanism</em>, given the Canadian evidence for many North
        American words. For terms and meanings shared between the two countries,
        the North American vocabulary, such questioning would be a particularly
        important point. Given the scope of this task, such work would need to
        be undertaken collaboratively from specialist teams on both sides of the
        border.
      </p>
      <p>
        There are two ways to solve this problem: shared terms and meanings may
        either be treated as both Americanisms in American dictionaries{" "}
        <em>and</em> Canadianisms in Canadian dictionaries, which is more in
        line with lexicographical traditions and obviously the practice adopted
        for DCHP‑2, or with a novel cross-border lexicography that would have to
        start with an systematic investigation establishing the prevalence of
        each term and meaning across the North American continent. For select
        terms, a set of some 50 tokens, such an approach has been carried out
        using written online questionnaires (Boberg 2005), which seems like the
        obvious methodology to gather such widespread data. While the enormity
        of the task is apparent, recent border studies are offering tools for
        such approaches (e.g. Auer &amp; Hinskens 1996, Auer 2005, 2014,
        Dollinger &amp; von Schneidemesser 2011: 138-43, Dollinger 2016c, Swan
        2016, Boberg 2016).
      </p>
      <br />
      <SecondaryHeader>1867­-1967 (DCHP‑1) - 2017 (DCHP-2)</SecondaryHeader>
      <p>
        We trust that this introduction will help the interested reader in
        putting DCHP‑2 to the best use. While the first edition was, in its day,
        pioneering work, DCHP‑2 is the attempt to bring the principles
        established then onto a sounder empirical footing. DCHP‑1 was published
        in the year of the Canadian Centennial; DCHP‑2 will be released in open
        access in the year of Canada's 150th anniversary. Just as in 1967, when
        DCHP‑1 was published, we now hope "that this record is sufficiently
        extensive to constitute a scholarly and valuable contribution" (Avis
        1967: xv).
      </p>
      <p>
        <em>Stefan Dollinger</em> (Gothenburg, Sweden) &amp;{" "}
        <em>Margery Fee</em> (Vancouver, Canada)
        <br />
        December 2016
      </p>
      <p>
        <br />
      </p>
      <SecondaryHeader>Lists of Labels</SecondaryHeader>
      <TertiaryHeader>Domain labels</TertiaryHeader>
      <ol className="my-4 ml-8 flex list-decimal flex-col gap-y-2">
        <li>
          Aboriginal (<em>adhesion, treaty band</em>)
        </li>
        <li>
          Aboriginal (Inuit) (<em>amautik, qulliq</em>)
        </li>
        <li>
          Administration (<em>BC Day, blood donor clinic</em>)
        </li>
        <li>
          Agriculture (<em>canola, trash cover</em>)
        </li>
        <li>
          Automotive (<em>advanced green, parkade</em>)
        </li>
        <li>
          Canadian Football (<em>designated import, rouge ((v.))</em>)
        </li>
        <li>
          Clothing (<em>bunny hug, Canadian tuxedo</em>)
        </li>
        <li>
          Construction (<em>ardox nail, wafer board</em>)
        </li>
        <li>
          Curling (<em>centre ice</em>)
        </li>
        <li>
          Education (<em>bird course, semestering</em>)
        </li>
        <li>
          Entertainment (<em>CanCon,</em> <em>Screenies</em>)
        </li>
        <li>
          Ethnicities (<em>Canadian-born Chinese, visible minority</em>)
        </li>
        <li>
          Economy (<em>branch plant, corporate welfare bum</em>)
        </li>
        <li>
          Fauna (<em>Boston bluefish, turr</em>)
        </li>
        <li>
          Finance (<em>ABM, download (1)</em>)
        </li>
        <li>
          First Nations (<em>Bill C-31, status</em>)
        </li>
        <li>
          Fishing (<em>barge, cod moratorium</em>)
        </li>
        <li>
          Flora (<em>arbutus, partridgeberry (1a, 1b)</em>)
        </li>
        <li>
          Food or Food &amp; Drink(<em>brown cow, chocolate bar</em>)
        </li>
        <li>
          Forestry (<em>cork boot, tenas (2)</em>)
        </li>
        <li>
          Fur trade (<em>canot du nord, country wife</em>)
        </li>
        <li>
          French relations (<em>bi and bi, tongue trooper</em>)
        </li>
        <li>
          Games (<em>Chinese skipping, padiddle</em>)
        </li>
        <li>
          Geography (<em>down south, north of 60</em>)
        </li>
        <li>
          Hockey (<em>muck up, Timbits (2)</em>)
        </li>
        <li>
          Housing (<em>bachelor apartment, laneway house</em>)
        </li>
        <li>
          Industry (<em>branch plant, Robertson screw</em>)
        </li>
        <li>
          Law (<em>gate ((v.)), skill-testing question</em>)
        </li>
        <li>
          Military (<em>khaki, Poppy Day</em>)
        </li>
        <li>
          Mining (<em>catskinner, gold seeker</em>)
        </li>
        <li>
          Outdoors (<em>beaver fever</em>, <em>serviced</em>)
        </li>
        <li>
          Politics (<em>bear-pit session, scrum</em>)
        </li>
        <li>
          Ranching (<em>Texas gate</em>)
        </li>
        <li>
          Science (<em>Standard Time, wind chill</em>)
        </li>
        <li>
          Social customs (<em>kitchen racket, May Two Four</em>)
        </li>
        <li>
          Sports (<em>Big O, tube skate</em>)
        </li>
        <li>
          Transportation (<em>bombardier ((2)), seat sale</em>)
        </li>
        <li>
          Urban culture (<em>booze can, baywop</em>)
        </li>
      </ol>
      <p>
        <br />
      </p>
      <TertiaryHeader>List of Regional Labels</TertiaryHeader>
      <ol className="my-4 ml-8 flex list-decimal flex-col gap-y-2">
        <li>British Columbia</li>
        <li>Alberta</li>
        <li>Saskatchewan</li>
        <li>Manitoba</li>
        <li>Ontario</li>
        <li>Quebec</li>
        <li>New Brunswick</li>
        <li>Nova Scotia</li>
        <li>Prince Edward Island</li>
        <li>
          Newfoundland
          <p>
            <br />
          </p>
        </li>
        <li>Prairies</li>
        <li>Northern Canada</li>
        <li>Territories</li>
        <li>Atlantic Canada</li>
        <li>Central Canada</li>
        <li>Western Canada</li>
        <li>Northwest Territories</li>
        <li>mainland Canada</li>
        <li>Maritime Provinces</li>
        <li>Cape Breton Island</li>
      </ol>
      <p>
        <br />
      </p>
      <TertiaryHeader>Social labels</TertiaryHeader>
      <ol className="my-4 ml-8 flex list-decimal flex-col gap-y-2">
        <li>derogatory</li>
        <li>offensive</li>
        <li>euphemism</li>
        <li>humorous</li>
        <li>jocular</li>
        <li>diminutive</li>
        <li>dated</li>
        <li>obsolete</li>
        <li>slang (incl. student slang, military slang)</li>
        <li>informal</li>
        <li>
          common core (= neither formal nor informal, but of the common core of
          Canadian English. Used sparingly, e.g. <em>Mountie</em>, which is the
          unmarked term and thus common core term in Standard Canadian English)
        </li>
      </ol>
      <br />
      <TertiaryHeader>Frequency labels</TertiaryHeader>
      <ol className="my-4 ml-8 flex list-decimal flex-col gap-y-2">
        <li>rare</li>
        <li>very rare</li>
        <li>originally</li>
        <li>predominantly</li>
        <li>especially (also as "esp.")</li>
        <li>usually</li>
        <li>also</li>
        <li>near (obsolete, …)</li>
        <li>
          rural (used sparingly): <em>beaver fever, skookum</em>
        </li>
      </ol>
      <p>
        <br />
      </p>
      <TertiaryHeader>Syntactic labels</TertiaryHeader>
      <ol className="my-4 ml-8 flex list-decimal flex-col gap-y-2">
        <li>in figurative use</li>
        <li>predicative</li>
        <li>attributively</li>
        <li>in attributive position</li>
        <li>transitive</li>
      </ol>
      <p>
        <br />
      </p>
      <PageHeader>References</PageHeader>
      <p>
        Auer, Peter and Frans Hinskens. 1996. The convergence and divergence of
        dialects in Europe. New and not so new developments in an old area.{" "}
        <em>Sociolinguistica</em> 10(1): 1-30.
      </p>
      <p>
        Auer, Peter. 2005. The construction of linguistic borders and the
        linguistic construction of borders. In: Filppula, Markku, Juhani
        Klemola, Marjatta Palandern and Esa Penttila (eds.). 2005.{" "}
        <em>
          Dialects Across Borders: Selected Papers from the 11th International
          Conference on Methods in Dialectology (Methods XI), Joensuu, August
          2002,
        </em>{" "}
        3-30. Amsterdam: Benjamins.
      </p>
      <p>
        Auer, Peter. 2014. Enregistering pluricentric German. In:{" "}
        <em>
          Pluricentricity: Language Variation and Sociocognitive Dimensions
        </em>
        , ed. by Augusto Soares Da Silva, 19-48. Berlin: De Gruyter.
      </p>
      <p>
        Avis Walter S., Robert J. Gregg and Matthew H. Scargill (eds.) 1967.{" "}
        <em>Gage Senior Dictionary</em> [later:{" "}
        <em>Gage Canadian Dictionary</em>]. 1st ed. Toronto: W. J. Gage.
      </p>
      <p>
        Avis, Walter S. (editor-in-chief), Charles Crate, Patrick Drysdale,
        Douglas Leechman, Matthew H. Scargill and Charles J. Lovell (eds). 1967.{" "}
        <em>A Dictionary of Canadianisms on Historical Principles</em>. Toronto:
        Gage.
      </p>
      <p>
        Avis, Walter S. 1967. Introduction. In: Avis et al. (eds.), xii-xv. Also
        in <em>DCHP‑1</em> <em>Online</em>.{" "}
        <a
          href="http://dchp.ca/DCHP-1/pages/frontmatter"
          target="_blank"
          rel="noreferrer"
        >
          http://dchp.ca/DCHP-1/pages/frontmatter
        </a>{" "}
        (5 Dec. 2016)
      </p>
      <p>
        Avis, Walter S. 1983. Canadian English in the North American context.{" "}
        <em>Canadian Journal of Linguistics</em> 28(1): 3-15.
      </p>
      <p>
        Avis, Walter S., Patrick D. Drysdale, Robert J. Gregg, Victoria E.
        Neufeldt and Matthew H. Scargill (eds). 1983.{" "}
        <em>Gage Canadian Dictionary</em>. 3rd ed. Toronto: Gage.
      </p>
      <p>
        Barber, Katherine and John Considine. 2010. Revising the Dictionary of
        Canadianisms: views from 2005. In{" "}
        <em>Current Projects in Historical Lexicography</em>, edited by John
        Considine, 141-149. Newcastle: Cambridge Scholars.
      </p>
      <p>
        Barber, Katherine. 2004 [1998]. <em>Canadian Oxford Dictionary</em>. 2nd
        ed. [1st ed.]. Don Mills, ON: Oxford Univeristy Press.
      </p>
      <p>
        Boberg, Charles. 2005. The North American Regional Vocabulary Survey:
        new variables and methods in the study of North American English.{" "}
        <em>American Speech</em> 80: 22-60.
      </p>
      <p>
        Boberg, Charles. 2010.{" "}
        <em>
          The English Language in Canada: Status, History and Comparative
          Analysis
        </em>
        . Cambridge: Cambridge University Press.
      </p>
      <p>
        Boberg, Charles. 2016. Newspaper dialectology: harnessing the power of
        the mass media to study Canadian English. <em>American Speech</em>{" "}
        91(2): 109-138.
      </p>
      <p>
        Cassidy, Frederick G. and Joan Houston Hall (eds.). 1985-2013.{" "}
        <em>Dictionary of American Regional English</em>. Volumes I - VI.
        Cambridge, MA: Belknap Press of Harvard University Press.
      </p>
      <p>
        Chambers, J. K. 1994. An introduction to Dialect Topography.{" "}
        <em>English World-Wide</em>. 15: 35-53.
      </p>
      <p>
        Chambers, J. K. 2006. Canadian Raising retrospect and prospect.{" "}
        <em>Canadian Journal of Linguistics</em> 51(2 &amp; 3): 105-118.
      </p>
      <p>COD-1 = see Barber, Katherine (2004, 1998)</p>
      <p>COD-2 = see Barber, Katherine (2004, 1998)</p>
      <p>
        Craigie, William and James R. Hulbert (eds.). 1938-44.{" "}
        <em>A Dictionary of American English on Historical Principles</em>. 4
        volumes. Chicago: University of Chicago Press.
      </p>
      <p>DA = see Mathews (1951)</p>
      <p>DAE = see Craigie and Hulbert (1938-44)</p>
      <p>DARE ­= see Cassidy &amp; Hall (1985-2013)</p>
      <p>
        Davey, William J. and Richard P. MacKinnon (eds.). 2016.{" "}
        <em>Dictionary of Cape Breton English.</em> Toronto: University of
        Toronto Press.
      </p>
      <p>
        Davies, Mark. 2013.&#160;
        <em>
          Corpus of Global Web-Based English: 1.9 billion words from speakers in
          20 countries
        </em>
        . Available online at{" "}
        <a
          href="http://corpus.byu.edu/glowbe/"
          target="_blank"
          rel="noreferrer"
        >
          http://corpus.byu.edu/glowbe/
        </a>{" "}
        (5 Dec. 2016).
      </p>
      <p>DCHP-1 ­= see Avis et. al (1967)</p>
      <p>DCHP-1 Online = see Dollinger, Brinton and Fee (2013)</p>
      <p>
        DeWolf, Gaelan Dodds, Robert J. Gregg, Barbara P. Harris, and Matthew H.
        Scargill (eds.). 1997. <em>Gage Canadian Dictionary</em>. 5th ed.
        Toronto: Gage.
      </p>
      <p>DNE = see Story et al. (1982-1999)</p>
      <p>
        Dollinger, Stefan (ed.-in-chief), Laurel Brinton and Margery Fee (eds.).
        2006-2016. <em>The Bank of Canadian English</em>. Online database,
        1505-2016. 2.7 million words.
      </p>
      <p>
        Dollinger, Stefan (ed.-in-chief), Laurel J. Brinton and Margery Fee
        (eds). 2013.{" "}
        <em>
          DCHP-1 Online: A Dictionary of Canadianisms on Historical Principles
          Online
        </em>
        . Based on Walter S. Avis et al. (1967). (Online dictionary){" "}
        <a href="http://dchp.ca/dchp1/" target="_blank" rel="noreferrer">
          http://dchp.ca/dchp1/
        </a>
        . Vancouver, BC: University of British Columbia.
      </p>
      <p>
        Dollinger, Stefan and Laurel J. Brinton. 2008. Canadian English lexis:
        historical and variationist perspectives.{" "}
        <em>Anglistik: International Journal of English Studies.</em> 19(2)
        Special Issue "Focus on Canadian English", edited by Matthias Meyer,
        43-64.
      </p>
      <p>
        Dollinger, Stefan and Luanne von Schneidemesser. 2011. Canadianism,
        Americanism, North Americanism? A comparison of DARE and DCHP.{" "}
        <em>American Speech</em> 86(2): 115-151.
      </p>
      <p>
        Dollinger, Stefan. 2006. Towards a fully revised and extended edition of
        the <em>Dictionary of Canadianisms on Historical Principles</em>:
        background, challenges, prospects.{" "}
        <em>Historical Sociolinguistics/Sociohistorical Linguistics</em> 6.{" "}
        <a
          href="http://www.academia.edu/4591720/"
          target="_blank"
          rel="noreferrer"
        >
          http://www.academia.edu/4591720/
        </a>{" "}
        (5 Dec. 2016)
      </p>
      <p>
        Dollinger, Stefan. 2008.{" "}
        <em>
          New-Dialect Formation in Canada: Evidence from the English Modal
          Auxiliaries
        </em>
        . Amsterdam/Philadelphia: Benjamins.
      </p>
      <p>
        Dollinger, Stefan. 2010. Software from the Bank of Canadian English as
        an open source tool for the dialectologist: ling.surf and its features.
        In: <em>Joseph Wright's</em> English Dialect Dictionary{" "}
        <em>and Beyond: Studies in Late Modern English Dialectology,</em> edited
        by Manfred Markus, Clive Upton and Reinhard Heuberger, 249-261. Berne:
        Lang.
      </p>
      <p>
        Dollinger, Stefan. 2014. BC Linguistic Survey. Class project ENGL 489.
        Fall 2014, 1304 written questionnaire responses. University of British
        Columbia.
      </p>
      <p>
        Dollinger, Stefan. 2015a. How to write a historical dictionary: a sketch
        of <em>The Dictionary of Canadianisms on Historical Principles</em>,
        Second Edition<strong>.</strong> <em>Ozwords</em> 24(2): 1-3 &amp; 6
        (October 2015). Canberra: Australian National Dictionary Centre.{" "}
        <a
          href="http://www.academia.edu/18967380/"
          target="_blank"
          rel="noreferrer"
        >
          http://www.academia.edu/18967380/
        </a>{" "}
        (5 Dec. 2016)
      </p>
      <p>
        Dollinger, Stefan. 2015b.{" "}
        <em>
          The Written Questionnaire in Social Dialectology: History, Theory,
          Practice
        </em>
        . Amsterdam/Philadelphia: Benjamins.
      </p>
      <p>
        Dollinger, Stefan. 2015c. The{" "}
        <em>
          Dictionary of Canadianisms on Historical Principles, Second Edition
        </em>{" "}
        and regional variation: the complex case of Newfoundland.{" "}
        <em>Regional Language Studies . . . Newfoundland</em> 26: 9-20.{" "}
        <a
          href="http://www.academia.edu/16544684/"
          target="_blank"
          rel="noreferrer"
        >
          http://www.academia.edu/16544684/
        </a>{" "}
        (6 Dec. 2016)
      </p>
      <p>
        Dollinger, Stefan. 2016a. Googleology as smart lexicography: big, messy
        data for better regional labels.{" "}
        <em>
          Dictionaries: Journal of the Dictionary Society of North America
        </em>
        . 37: 60-98.
      </p>
      <p>
        Dollinger, Stefan (ed.). 2016b. Lexicography and variation: big data via
        Google? Discussion results and summary of responses, 19 Feb. - mid-March
        2016.{" "}
        <a
          href="https://www.academia.edu/25184026/"
          target="_blank"
          rel="noreferrer"
        >
          https://www.academia.edu/25184026/
        </a>{" "}
        (5 Dec. 2016)
      </p>
      <p>
        Dollinger, Stefan. 2016c. TAKE UP #9 as a semantic isogloss on the
        Canada-US border. <em>World Englishes</em>. Early view. DOI:
        10.1111/weng.12212 (8 Dec. 2016)
      </p>
      <p>
        Friend, David, Julia Keeler, Dan Liebman and Fraser Sutherland (eds.)
        <em>.</em> 1997.{" "}
        <em>
          ITP Nelson Canadian Dictionary of the English Language: An
          Encyclopedic Reference.
        </em>{" "}
        Toronto: ITP Nelson.
      </p>
      <p>Gage-1 = see Avis, Gregg and Scargill (eds.). (1967).</p>
      <p>Gage-3 = see Avis et al. (eds.). (1983).</p>
      <p>Gage-5 ­= see DeWolf et al. (1997).</p>
      <p>
        Görlach, Manfred. 1990. The dictionary of transplanted varieties of
        languages: English. In{" "}
        <em>
          Wörterbücher: Dictionaries: Dictionnaires: An International
          Encyclopedia of Lexicography
        </em>
        , edited by Franz J. Hausmann, Oskar Reichmann, Herbert E. Wiegand and
        Ladislav Zgusta (eds.), II: 1475-1499. Berlin: de Gruyter.
      </p>
      <p>
        Gove, Philip Babcock. 1961.{" "}
        <em>
          Webster's Third International Dictionary of the English Language
        </em>
        . Springfield, MA: Merriam Webster.
      </p>
      <p>
        Grimm, Jacob. 1854. [Vorrede]. In <em>Deutsches Wörterbuch,</em> Vol. I:
        A-Biermolke, edited by Jacob Grimm and Wilhelm Grimm, ii-lxvii. Leipzig:
        S. Hirzel.
      </p>
      <p>
        Hoffman, Michol F. 2010. The role of social factors in the Canadian
        Vowel Shift: evidence from Toronto. <em>American Speech</em> 85(2):
        121-140.
      </p>
      <p>
        ICE Project. Coordinated by Gerald Nelson.{" "}
        <a
          href="http://ice-corpora.net/ICE/INDEX.HTM"
          target="_blank"
          rel="noreferrer"
        >
          http://ice-corpora.net/ICE/INDEX.HTM
        </a>{" "}
        (5 Dec. 2016)
      </p>
      <p>ITP Nelson = see Friend et al. (1997)</p>
      <p>
        Kilgarriff, Adam. 2007. Googleology is bad science.{" "}
        <em>Computational Linguistics&#160;</em>33: 147-151.
      </p>
      <p>
        Landau, Sidney I. 2001.{" "}
        <em>Dictionaries: the Art and Craft of Lexicography</em>. 2nd ed.
        Cambridge: Cambridge University Press.
      </p>
      <p>
        Lighter, J. E. (ed.). 1994, 1997.{" "}
        <em>Random House Historical Dictionary of American Slang</em>. 2 vols.
        New York: Random House.
      </p>
      <p>
        Lovell, Charles J. 1956. Whys and hows of collecting for the{" "}
        <em>Dictionary of Canadian English</em> [DCHP]. II. Excerption of
        quotations. <em>Canadian Journal of Linguistics</em> 2(1): 7-33.
      </p>
      <p>
        Mathews, Mitford (ed.). 1951.{" "}
        <em>Dictionary of Americanisms on Historical Principles</em>. Chicago:
        University of Chicago Press.
      </p>
      <p>
        Murray, James A. H., Henry Bradley, W. A. Craigie and C. T. Onions
        (eds.). 1933.{" "}
        <em>
          The Oxford English Dictionary: Being a Corrected Re-issue with an
          Introduction, Supplement, and Bibliography
        </em>
        . Oxford: Clarendon Press.
      </p>
      <p>OED-1 = see Murray et al. (eds.) (1933).</p>
      <p>
        OED-2 ­= <em>The Oxford English Dictionary</em>. 2nd ed. 1989. Edited by
        John Simpson and E.S.C. Weiner. Oxford: Oxford University Press.
      </p>
      <p>
        OED-3 = <em>The</em> <em>Oxford English Dictionary</em>, 3rd ed. 2000--.
        Edited by John Simpson and Michael Proffitt.{" "}
        <a href="http://www.oed.com" target="_blank" rel="noreferrer">
          www.oed.com
        </a>
      </p>
      <p>
        Orsman, Harry W. (ed.). 1997.
        <em>
          The Dictionary of New Zealand English: A Dictionary of New Zealandisms
          on Historical Principles
        </em>
        . Auckland: Oxford University Press.
      </p>
      <p>
        Pickett, Joseph P. (ed.). 2011.{" "}
        <em>American Heritage Dictionary of the English Language</em>. 5th ed.
        Boston: Houghton Mifflin, Harcourt.
      </p>
      <p>
        Pomikálek, Jan, Miloš Jakubícek and Pavel Rychly. 2012. Building a 70
        billion word corpus of English from ClueWeb. In{" "}
        <em>
          Proceedings of the Eight International Conference on Language
          Resources and Evaluation (LREC'12)
        </em>
        , edited by Nicoletta Calzolari et al., 502-506. Istanbul, Turkey:
        European Language Resources Association (ELRA).
      </p>
      <p>
        Pratt, T. K. 2004. Review of "Dictionary of American Regional English,
        Vol. IV: P-Sk." <em>Canadian Journal of Linguistics</em> 49(1): 127-130.
      </p>
      <p>
        Pratt, Terrence K. (ed.). 1988.{" "}
        <em>Dictionary of Prince Edward Island English.</em> Toronto: University
        of Toronto Press.
      </p>
      <p>
        Pringle, Ian and Enoch Padolsky. 1983. The linguistic survey of the
        Ottawa Valley. <em>American Speech</em> 58(4): 327-344.
      </p>
      <p>
        Ramson, W. S. (ed.). 1988.{" "}
        <em>
          Australian National Dictionary: A Dictionary of Australianisms on
          Historical Principles
        </em>
        . Melbourne: Oxford University Press.
      </p>
      <p>
        Scargill, Matthew H. and Henry J. Warkentyne. 1972. The survey of
        Canadian English: a report.{" "}
        <em>The English Quarterly. A Publication of the</em> Canadian Council of
        Teachers of English 5(3, Fall): 47-104.
      </p>
      <p>
        Schneider, Edgar W. 2007.{" "}
        <em>Postcolonial English: Varieties around the World</em>. Cambridge:
        Cambridge University Press.
      </p>
      <p>
        Silva, Penny (ed.). 1996.{" "}
        <em>A Dictionary of South African English on Historical Principles</em>.
        Oxford: Oxford University Press.
      </p>
      <p>
        Story, G. M and William Kirwin. 1971. National dictionaries and regional
        homeword. <em>Regional Language Studies . . . Newfoundland</em> 3:
        19-22.
      </p>
      <p>
        Story, G. M., W. J. Kirwin, and J. D. A. Widdowson (eds.). 1999. [1990,
        1982]. <em>Dictionary of Newfoundland English.</em> 3rd ed. [2nd ed.,
        1st ed.]. Toronto: University of Toronto Press.{" "}
        <a
          href="http://www.heritage.nf.ca/dictionary/"
          target="_blank"
          rel="noreferrer"
        >
          http://www.heritage.nf.ca/dictionary/
        </a>{" "}
        (6 Dec. 2016)
      </p>
      <p>
        Swan, Julia. 2016. Canadian English in the Pacific Northwest: a phonetic
        comparison of Vancouver, BC and Seattle, WA. In{" "}
        <em>Proceedings of the 2016 Annual Conference of the</em> Canadian
        Linguistic Association, edited by Lindsay Hracs, 1-15.{" "}
        <a href="https://t.co/0pp1QGQPNm" target="_blank" rel="noreferrer">
          https://t.co/0pp1QGQPNm
        </a>{" "}
        (8 Dec. 2016).
      </p>
      <p>
        Tabbert, Russell (ed.). 1991. <em>Dictionary of Alaskan English</em>.
        Juneau, AL: Denali.
      </p>
      <p>
        Wright, Joseph (ed.). 1898-1905. <em>The English Dialect Dictionary</em>
        . London: Henry Frowde.
      </p>
    </TextPageMain>
  )
}
