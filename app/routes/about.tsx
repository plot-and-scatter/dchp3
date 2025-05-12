import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"
import Button from "~/components/elements/LinksAndButtons/Button"
import { Link } from "~/components/elements/LinksAndButtons/Link"
import WordLink from "~/components/elements/LinksAndButtons/WordLink"
import { scrollTo } from "~/components/quicklinks/QuickLink"

export default function About() {
  return (
    <TextPageMain>
      <PageHeader>About DCHP-3</PageHeader>

      <div className="my-8 flex flex-col items-start gap-y-2">
        <Button asLink onClick={() => scrollTo("introduction")}>
          Introduction to the Third Edition
        </Button>
        <Button asLink onClick={() => scrollTo("dchp-1-legacy-content")}>
          DCHP-1 Legacy Content
        </Button>
        <Button asLink onClick={() => scrollTo("project-team")}>
          Project Team
        </Button>
        <Button asLink onClick={() => scrollTo("canadian-english-dictionary")}>
          Canadian English Dictionary
        </Button>
        <Button asLink onClick={() => scrollTo("works-cited")}>
          Works Cited
        </Button>
      </div>

      <SecondaryHeader id="introduction">
        Introduction to the Third Edition
      </SecondaryHeader>

      <p>
        The current Third Edition of{" "}
        <em>A Dictionary of Canadianisms on Historical Principles</em>, DCHP-3,
        is the latest reiteration of a Canadian linguistics project that turned,
        sometime in the early 1960s, into a Canadian Centennial Project. DCHP-3
        is a major technical relaunch of the Second Edition from 2017 (
        <Link to="">Dollinger & Fee 2017</Link>) and a minor editorial update.
        Last time Paddy Drysdale, the last surviving member of the DCHP-1
        editorial board, offered a <Link to="">foreword</Link> for DCHP-2; now
        we must refer the reader to Paddy’s obituary (
        <Link to="">Dollinger & Neufeldt 2021</Link>
        ). While DCHP-2 added roughly 10% to the scope of DCHP-1 (Avis et al.
        1967, <Link to="">DCHP-1 Online</Link>), DCHP-3 adds around 10% of the
        update for DCHP-2.
      </p>

      <p>
        In total, this update includes 130 new entries with 187 meanings (180
        Canadian and 7 non-Canadian) for a total of now 12,039 lexemes (11,974
        Canadian plus 65 non-Canadian) and 14,586 meanings (14,516 Canadian and
        70 non-Canadian), which are illustrated by way of 34,402 quotations
        (33,994 to illustrate Canadianisms + 408 for Canadian usage of
        Non-Canadianisms). Work commenced, with the support of Social Sciences
        and Humanities Research Council of Canada Grant # 435-2022-0921, in the
        summer of 2022 and was completed in May 2025. We are grateful that SSHRC
        made this update and new edition possible.
      </p>

      <p>
        The Second Edition followed half a century after the First Edition. In
        dictionary timelines, we had not planned another edition so soon (five
        years after the second edition), but digital code rot (the Second
        Edition ran on PhP/MySQL 5.0 code) made an upgrade necessary by spring
        2021. We used the opportunity to add some new content. Technically, we
        opted for a new, mobile-friendly design in Remix that is now hosted on
        UBC’s own IT infrastructure. Supported by the{" "}
        <Link to="https://english.ubc.ca">
          Department of English Language and Literatures
        </Link>
        , we are now using our own Canadian servers (see our entry{" "}
        <WordLink>elbows up</WordLink>). The longest entry in the last edition
        was <WordLink>eh</WordLink>
        with eleven meanings; in the current edition it is the less dignified
        <WordLink>shit kicking</WordLink>, with a total of eight meanings, but{" "}
        <WordLink>ding</WordLink> and <WordLink>snowbird</WordLink> are not far
        behind.
      </p>

      <p>
        The intended content focus of the present update, which is more of an
        edition 2.1 than 3.0, was on previously neglected terms connected to
        minority groups and urban (or rural) slang. This explains the inclusion
        of <WordLink>Africadian</WordLink>, <WordLink>Epekwitk</WordLink>,{" "}
        <WordLink>kokum</WordLink>, <WordLink>skoden</WordLink> and{" "}
        <WordLink>quinzhee</WordLink>. For the latter four the label
        ‘Indigenous’ now replaces the older label ‘Aboriginal’, while in
        addition to ‘First Nations’ and ‘Inuit’ continue to be used. Since
        Canada ratified the United Nations Declaration on the Rights of
        Indigenous Peoples in 2010, ‘Indigenous’ has been the favoured term,
        particularly since this declaration involved the participation of
        Indigenous people from Canada.
      </p>

      <p>
        Some terms have seen updates from DCHP-1—<WordLink>deke (n.)</WordLink>,{" "}
        <WordLink>deke (v.)</WordLink>, <WordLink>fire hall</WordLink>,{" "}
        <WordLink>kayak</WordLink>, <WordLink>lahal</WordLink>,{" "}
        <WordLink>line-up</WordLink>, <WordLink>rink rat</WordLink> and{" "}
        <WordLink>snowbird</WordLink>—while some DCHP-2 terms from 2017 required
        correction and completion. Among the latter,{" "}
        <WordLink>parkade</WordLink> (<Link>Considine 2017</Link>) is the most
        prominent case, requiring reclassification as a Type 2 – Preservation
        from US English (rather than the original Type 1 – Origin in Canada). We
        hope for more corrections, big or small, preferably in a peer-reviewed
        context, as were John Considine’s and Victoria Neufeldt’s (
        <Link>Neufeldt 2019</Link>), though any critique in any form is most
        welcome. Other corrections and updates of DCHP-2 terms include{" "}
        <WordLink>bunny hug</WordLink> (which Saskatchewanians will likely be
        interested to know), <WordLink>bush party</WordLink>,{" "}
        <WordLink>down-island</WordLink>, <WordLink>Fat City</WordLink>,{" "}
        <WordLink>Idle No More</WordLink>, <WordLink>joe job</WordLink>, and{" "}
        <WordLink>qalunaaq</WordLink>.
      </p>

      <p>
        New terms include those that occur with no obvious connection to
        Canadian institutions. While a <WordLink>T4</WordLink> is, in our minds,
        still an exciting Canadianism, its ties to the Canada Revenue Agency are
        often perceived as a disqualification by some linguistic colleagues: not
        “real” language change. We beg to differ, but we are happy to announce
        that non-institutional language change has also been witnessed in terms
        such as <WordLink>booter</WordLink> and <WordLink>social</WordLink> (two
        Manitobanisms), <WordLink>dooryard</WordLink> (a New Brunswickism), the
        directional terms <WordLink>hang a larry</WordLink> (for turning left)
        and <WordLink>hang a roger</WordLink> (for turning right),{" "}
        <WordLink>gong show</WordLink> (as a synonym for ‘chaos’),{" "}
        <WordLink>beak</WordLink> ‘to diss someone’ and to{" "}
        <WordLink>be in there like a dirty shirt</WordLink> ‘to really engage in
        something’. We paid special attention to the informal, as in the de
        facto Albertanism <WordLink>rig pig</WordLink> ‘oil and gas worker’,{" "}
        <WordLink>shit disturber</WordLink> ‘troublemaker’ and{" "}
        <WordLink>give’r</WordLink> in its two meanings. New Indigenous terms
        include <WordLink>qajaq</WordLink>, as the decolonized form of{" "}
        <WordLink>kayak (1)</WordLink> (which was updated with an antedating
        from 1738) and <WordLink>skookumchuck</WordLink> ‘rapids, tidal wave’.
      </p>

      <p>
        In the more formal registers we can also report new findings.{" "}
        <WordLink>Leadhand</WordLink> ‘foreman, foreworker’ was another exciting
        discovery of a bona fide Canadianism that no one in the field seems to
        have had on their radar and that came to us via a graduate student who
        was working on the side as a landscape gardener. We expect many more
        words of this type to be awaiting identification and description in
        Canadian English. Like <WordLink>keener</WordLink>
        from DCHP-2, some of these newer terms represent an informal layer of
        the lexicon that, not too long ago, would have been unacceptable for
        inclusion in a dictionary of English. To <WordLink>ding</WordLink> (v.)
        (in the sense of ‘to charge someone money unexpectedly’) is one such
        informal term that was difficult to spot among the many meanings of ding
        in three word classes. It almost escaped our attention, drowned out in
        the noise of dings on cars, dinged up noses and criticizing people by
        dinging them.
      </p>

      <p>
        Other terms have a clear tie to Canadian settings, such as{" "}
        <WordLink>Surrey Jack</WordLink>, <WordLink>Indo-Canadian</WordLink>,{" "}
        <WordLink>Roxham Road</WordLink> or <WordLink>Fransaskois</WordLink>,
        plus the many names for Toronto of which we include{" "}
        <WordLink>T-dot</WordLink>, <WordLink>T.O.</WordLink> and{" "}
        <WordLink>the 6ix</WordLink>, in addition to the historical{" "}
        <WordLink>Hogtown</WordLink>. We also extended our attention to other
        cities: <WordLink>Raincouver</WordLink>, <WordLink>Brollywood</WordLink>{" "}
        and <WordLink>Lotusland</WordLink> (Vancouver),{" "}
        <WordLink>Toontown</WordLink> (Saskatoon), <WordLink>C-Town</WordLink>{" "}
        (Calgary) and <WordLink>E-Town</WordLink> (Edmonton).{" "}
        <WordLink>The Peg</WordLink> (Winnipeg) has been updated from a stub
        entry in DCHP-1. The list of these ‘citynyms’ would be much longer, as
        there are many more citynyms in this country.
      </p>

      <p>
        We have also included some overlooked terms, such as{" "}
        <WordLink>klick</WordLink> (for ‘kilometre’) versus the more universal
        (and American use) of simply <WordLink>K (initialism)</WordLink>. From a
        time of systematic discrimination against homosexuals, we listed{" "}
        <WordLink>fruit machine</WordLink>, while <WordLink>goal suck</WordLink>{" "}
        ‘someone who wants to score easy goals’ is not just important in hockey
        but also in other sports.
      </p>

      <p>
        Other terms show a more sobering part of economic realities today. That
        they spread out into the world from Vancouver, BC, and Toronto, ON, show
        the real housing crisis—a term we might have included but which will
        have to await another edition or update.{" "}
        <WordLink>Demoviction</WordLink> and <WordLink>renoviction</WordLink>{" "}
        are both attested first in Vancouver, which reveals Canada’s leader in
        this housing crisis.
      </p>

      <p>
        Digital life is taking over our lives more and more, so it should be of
        little surprise that Canadian-origin terms, such as{" "}
        <WordLink>enshittification</WordLink>, are going global. Like{" "}
        <WordLink>parka</WordLink>, <WordLink>kayak</WordLink> and{" "}
        <WordLink>visible minority</WordLink>, such Canadian terms may enter the
        general global lexicon, as <WordLink>caremongering</WordLink> did for a
        brief period during the early phase of the COVID-19 pandemic. The more
        digital platforms become enshittified, the more likely Cory Doctorow’s
        claim to fame as a journalist and science fiction writer will be
        enhanced by the proliferation of this catchy coinage.
      </p>

      <p>
        We are happy to report that we included <WordLink>levidrome</WordLink>,
        a term that first gained media attention in 2017, for a new name
        describing a word that yields another word if spelled backwards (e.g.
        stop and its levidrome pots). Although little Levi is not so little
        anymore, his term still warrants inclusion in a dictionary of
        Canadianisms. Two other newly identified Canadianisms are{" "}
        <WordLink>trick or treat</WordLink> (Type 1 – Origin) and wait time
        (Type 5 – Frequency), rather than waiting time.
      </p>

      <p>
        <WordLink>Maplewashing</WordLink> is a more obvious Canadianism, now
        more properly documented in its five meanings, and{" "}
        <WordLink>supply management</WordLink> makes a showing. Both are easy to
        spot but now with a historical record. The words{" "}
        <WordLink>peace bond</WordLink> and
        <WordLink>nothing game</WordLink> are in that regard quite different, as
        their Canadian dimension is not immediately clear.
      </p>

      <p>
        <WordLink>Toonie for Terry</WordLink> and{" "}
        <WordLink>the two Michaels</WordLink> have been documented in this
        edition as well, both with profound Canadian angles.{" "}
        <WordLink>Karen</WordLink>—to be a Karen (or Kevin)—is certainly in use
        in Canada but not Canadian by our definition. At long last,
        sentence-initial <WordLink>as well</WordLink> has been added, which is
        another more elusive Canadian construction. As well,{" "}
        <WordLink>in hospital</WordLink> was added as a prepositional phrase, as
        in She is recovering in hospital.
      </p>

      <SecondaryHeader id="dchp-1-legacy-content">
        DCHP-1 Legacy Content
      </SecondaryHeader>

      <p>
        As in DCHP-2, DCHP-1 legacy data is shown in DCHP-3 on a yellow
        background with a general disclaimer that it is outdated, as shown
        below.
      </p>

      <p>TK — insert</p>

      <p>
        Much work remains to be done, however, as our own study on 1,487
        meanings in DCHP-1, about 10% of the overall scope, suggests. Of these
        almost 1,500 meanings our assistant Andrew French considered 831 to be
        problematic, while 560 were deemed to be priority items. Some of these
        require revision more than others; however, we hope the disclaimer will
        continue to make clear that DCHP-1 reflects the prejudices of its time
        and of its lexicographers.
      </p>

      <p>
        For new content, we have introduced new labels, such as ‘Systemic
        discrimination’, which accompanies terms such as{" "}
        <WordLink>Saskatoon freezing deaths</WordLink>,{" "}
        <WordLink>settler-colonial violence</WordLink> or{" "}
        <WordLink>starlight tour</WordLink>. ‘Hiphop’ now graces the entries of{" "}
        <WordLink>the 6ix</WordLink> and <WordLink>T-dot</WordLink>,
        ‘Media’—capturing media language—in <WordLink>hospital</WordLink> and{" "}
        <WordLink>caremonger</WordLink>, and ‘Colonialism’ terms such as{" "}
        <WordLink>pretendian</WordLink> and{" "}
        <WordLink>settler-colonial violence</WordLink>. For{" "}
        <WordLink>rig pig</WordLink> we used the existing label ‘Mining’ rather
        than create a new one for the oil and gas industry.
      </p>

      <SecondaryHeader id="project-team">Project Team</SecondaryHeader>

      <p>
        The DCHP-3 team was considerably smaller than the last time around.
        Graduate students Sarah Moar and Tom Playfair assisted in 2022/23 with
        data collection and drafting. Some terms, e.g.{" "}
        <WordLink>leadhand</WordLink> and{" "}
        <WordLink>Saskatoon freezing deaths</WordLink>, come from their ideas.
        In 2024/25 undergraduate students Dristi Gounder and Jennifer Dinh
        assisted with data collection, frequency charts and the occasional
        drafting task (Dristi for <WordLink>Surrey Jack</WordLink>, Jennifer for{" "}
        <WordLink>quadrex</WordLink>). Volunteer Dasha Martinets drafted the
        entries <WordLink>T.O.</WordLink> and <WordLink>T-dot</WordLink>, while
        Serena Klumpenhouwer joined us for sensitivity reading (e.g.{" "}
        <WordLink>Afro-Canadian</WordLink> and <WordLink>Africadian</WordLink>).
        Associate editor Margery Fee contributed some terms, e.g.{" "}
        <WordLink>zombie fire</WordLink> and <WordLink>bundle buggy</WordLink>,
        and took on copy editing (as last time), which was topped off by a first
        round of proofreading. The final proofreading of all new content was
        conducted this time by Lynn Slobogian, who was also the experienced
        proofreader behind Creating Canadian English: The Professor, the
        Mountaineer, and a National Variety of English (
        <Link>Dollinger 2019</Link>), which is a ‘biography’ of Canadian
        English. Chief editor Stefan Dollinger was in charge of all aspects of
        the project, including drafting, data collection and system design,
        which was implemented cheerfully and efficiently, as always, by Frank
        Hangler from <Link>Plot + Scatter</Link>.
      </p>

      <SecondaryHeader id="canadian-english-dictionary">
        Canadian English Dictionary
      </SecondaryHeader>

      <p>
        An exciting development began in 2022, when{" "}
        <Link to="https://www.editors.ca">Editors Canada</Link>, the national
        professional association, approached DCHP-3 to explore options for a new
        present-day dictionary to replace the outdated Canadian Oxford
        Dictionary. Soon a national Dictionary Consortium was established, and a
        chief editor for the{" "}
        <Link to="https://www.canadianenglishdictionary.ca">
          Canadian English Dictionary (CED)
        </Link>{" "}
        was found in John Chew. CED has one fascicle completed (Q) and aims to
        release the entire full-size dictionary and app for 2028.
      </p>

      <p>
        While Canadian English lexicography was lagging behind at the beginning
        of both the 19th and the 20th centuries (Considine 2003: 265), the field
        was in the late 1960s for a generation at the cutting edge and breaking
        new ground. It was a position that we would like to return to, now that
        DCHP and CED have joined forces, which means that for the first time
        since the 1960s, when DCHP-1 and the Gage suite of dictionaries
        (including the Gage Canadian Dictionary) were developed in tandem (Gregg
        1993; Dollinger 2019: 34-85), Canadian English is again being explored
        by two closely integrated lexical research units. One unit, DCHP-3, is
        carving out the Canadian dimension, meaning by meaning; the other unit,
        CED and its governing Society for Canadian English, is focussed on
        producing a dictionary and app that is fully suited to the present needs
        of professional writers, editors, teachers, educators and students, as
        well as the general public.
      </p>

      <p>
        We hope that DCHP-3 will continue to serve the public seeking
        authoritative information on Canadian words and meanings and their
        histories. May it trigger many discussions about what is and what is not
        Canadian in the big ocean of English.
      </p>

      <p>Stefan Dollinger & Margery Fee</p>
      <p>Victoria & Vancouver, May 2025</p>

      <SecondaryHeader id="works-cited">Works Cited</SecondaryHeader>

      <p>
        Avis, Walter S. Introduction. In DCHP-1, xii-xv. Online:{" "}
        <Link to="https://www.dchp.ca/dchp1">www.dchp.ca/dchp1</Link> [TK:
        subpage link?].
      </p>
      <p>
        Considine, John. 2017. Parkade: one Canadianism or two Americanisms?
        American Speech 92(3): 281-297.{" "}
        <Link to="https://www.academia.edu/129241171/">
          https://www.academia.edu/129241171/
        </Link>
      </p>
      <p>
        Considine, John. 2003.{" "}
        <Link to="https://lexikos.journals.ac.za/pub/article/view/735">
          Dictionaries of Canadian English
        </Link>
        . Lexikos 13: 250-270.
      </p>
      <p>
        DCHP-1 = Avis, Walter S. (ed.-in-chief), Charles Crate, Patrick
        Drysdale, Douglas Leechman, Matthew H. Scargill and Charles J. Lovell
        (eds). 1967. A Dictionary of Canadianisms on Historical Principles.
        Toronto: Gage.
      </p>
      <p>
        DCHP-1 Online = Dollinger, Stefan, Laurel Brinton and Margery Fee (eds.)
        2013. DCHP-1 Online: A Dictionary of Canadianisms on Historical
        Principles, 1st edition. Based on Walter S. Avis et al. 1967.{" "}
        <Link to="https://www.dchp.ca/DCHP1">www.dchp.ca/DCHP1</Link>
      </p>
      <p>
        DCHP-2 = Dollinger, Stefan (chief editor) and Margery Fee (associate
        editor). 2017. DCHP-2: The Dictionary of Canadianisms on Historical
        Principles, 2nd edition. With the assistance of Baillie Ford, Alexandra
        Gaylie, and Gabrielle Lim. Vancouver: University of British Columbia.{" "}
        <Link to="https://www.dchp.ca/dchp2">www.dchp.ca/dchp2</Link>
      </p>
      <p>
        Dollinger, Stefan. 2019. Creating Canadian English: The Professor, the
        Mountaineer, and a National Variety of English. Cambridge: Cambridge
        University Press.{" "}
        <Link to="https://www.academia.edu/35184221/">
          https://www.academia.edu/35184221/
        </Link>
      </p>
      <p>
        Dollinger, Stefan. 2016. Googleology as smart lexicography: big, messy
        data for better regional labels. Dictionaries 37: 60-98.{" "}
        <Link to="https://www.academia.edu/21904323/">
          https://www.academia.edu/21904323/
        </Link>
      </p>
      <p>
        Dollinger, Stefan and Victoria Neufeldt. 2021. Patrick “Paddy” Drysdale
        (1929–2020). Canadian Journal of Linguistics 66(2): 275-78.{" "}
        <Link to="https://www.academia.edu/46895718/">
          https://www.academia.edu/46895718/
        </Link>
      </p>
      <p>
        Gregg, Robert J. 1993. Canadian English lexicography. In Clarke, Sandra
        (ed.). Focus on Canada, 27-44. Amsterdam: Benjamins.
      </p>
      <p>
        Neufeldt, Victoria. 2019. Review of DCHP-2. Dictionaries 40(2): 242-46.{" "}
        <Link to="https://www.academia.edu/129241047/">
          https://www.academia.edu/129241047/
        </Link>
      </p>
    </TextPageMain>
  )
}
