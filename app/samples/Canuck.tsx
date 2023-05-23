import React from "react"
import Citation from "~/oldcomponents/Citation"
import CitationList from "~/oldcomponents/CitationList"
import Definition from "~/oldcomponents/Definition"
import HandNoteBlock from "~/components/HandNoteBlock"
import Headword from "~/components/Headword"
import SeeAlso from "~/components/SeeAlso"

const Canuck = (): JSX.Element => {
  return (
    <div>
      <Headword
        word="Canuck"
        alternatives="Kanuck, kanaka, kanacka, Cannuck, Canuc"
        handNote="While originating in informal contexts (see DCHP-1, OED-3, s.v. &ldquo;Canuck&rdquo;, which labels the term &ldquo;colloq&rdquo;.) only some meanings can be considered informal today."
      />
      <Definition
        number="1a"
        partOfSpeech="n. &amp; adj."
        usageNote="Ethnicities, slang, derogatory, historical"
        dagger
      >
        <p className="text-sm font-bold text-slate-500  md:text-xl">
          a Hawaiian or Polynesian in North America.
        </p>
        <div className="-m-2 mb-2 border border-slate-300 bg-slate-100 px-4 py-2 pb-0 shadow-sm">
          <p>
            While originally deemed of uncertain origin (see DCHP-1, s.v.
            "Canuck"), work by Mathews (1975) and Adler (1975) offers a
            transmission scenario that is highly plausible. The term Canuck
            almost certainly derives from Hawaiian kanaka 'man' (Mathews 1975:
            160, Sledd 1978: 176) and was transferred to multiple groups
            starting around 1800. The first group that the term was applied to
            were Polynesian sailors, who sailed on North American whaling ships
            and referred to themselves as kanakas 'men', which the North
            American sailors used as their name for the Polynesians. The
            quotations under Kanaka, originally a DCHP-1 entry, predate other
            meanings of Canuck and support this explanation.
          </p>
          <p>
            From there, kanak(a) was expanded to other groups, originally
            triggered by a discriminatory and racist motivation (Adler 1975:
            159) (see meanings 1b, 2a, 2b). While the term's history is complex
            and not yet fully understood, the overall transmission path emerges
            quite clearly (cf. DCHP-1 Canuck ((n.)) (fistnotes) for previous
            theories).
          </p>
        </div>
        <SeeAlso>Kanaka</SeeAlso>
        <HandNoteBlock>
          Polynesians either settled early in British Columbia and the American
          Pacific Northwest, or arrived in the East on whaling ships, planting
          the term in the early 1800s on both sides of the continent with
          different meanings, i.e. transferring to other foreigners in the East
          (see meaning 1b), while remaining tied to Polynesians longer in the
          West.
        </HandNoteBlock>
        <CitationList>
          <Citation year="1829–1832">
            (1948) [[...] and that [was] again corroborated by the deceased
            calling out to the Kanackas to fire on the Canadians.]
          </Citation>
          <Citation year="1867">
            There were also a number of old slab buildings connected together,
            and called Kanaka Town.
          </Citation>
          <Citation year="1868">
            "[...]On the 20th, Kanaka William's house was burnt, and on the 26th
            the stable and cow house were pulled down by them.[...]"
          </Citation>
          <Citation year="1877">
            They rode astride their horses, like the Kanaka girls of the
            Sandwich islands [...].
          </Citation>
          <Citation year="1883">
            There are a few Hawaiian words introduced by the Kanaka sailors on
            the whaleships, which are universally employed between the whites
            and Eskimo on the whole of the Arctic coast, and occasionally among
            the Eskimo themselves.
          </Citation>
          <Citation year="1885">
            Violets, or, Jasper Luckings, the Kanuck Landlord and California
            Gardner; A tragic-comedy by Abel Yates
          </Citation>
          <Citation year="1892">
            Soon as you hear him, whose pillow is watered Over the soul of the
            savage Kanak,[...]
          </Citation>
        </CitationList>
      </Definition>
      <Definition
        number="1b"
        dagger
        partOfSpeech="n."
        usageNote="Ethnicities, historical"
      >
        <p className="text-sm font-bold text-slate-500 md:text-xl">
          a foreigner in North America.
        </p>
        <p>
          Adler (1975) suggests that perceived darker skin colour was the
          connection and reason for generalization from meaning 1a to other
          groups:
        </p>
        <p>
          "Canuck is given in many standard sources as designating, in Canada, a
          French-Canadian. Why not a British-Canadian? Could it be (if we assume
          a connection with kanaka) because skin of the French-Canadian was
          somewhat darker, more so because of intermarriage with American
          Indians? Sailors who had been in the Pacific might have applied the
          term kanaka to darker French-Canadians in Canadian or northwest
          American or New England ports." (Adler 1975: 159)
        </p>
        <p>
          The 1835 quotation offers evidence for this argument for New
          Englanders, who were commonly called by their 19th-century nickname
          "Johnathan", a point that is made in Mathews (1975: 160). Sledd offers
          evidence from historical travel reports in which a group of Canadian
          boatmen was described as "dark as Indians" (1978: 194 fn 11) and of
          kanakas as "the copper-colored islanders". So it appears that the term
          was generalized to refer to foreigners more generally, such as the
          French-Canadian, German and Dutch speakers, who were among the most
          numerous in 1830s North America. The French (canaque and German
          languages (der Kanake), have the same meanings, as do other languages,
          with German acknowledging the South Seas connection with two meanings:
          "Polynesisan" and as a "coarse term of abuse for foreigners" (ÖWB-42,
          s.v. "Kanake"). European racism seems to have been the driving force
          for the dissemination of this meaning, which underwent amelioration in
          Canada with a dozen years of the 1835 quotation (see meaning 2b).
        </p>
        <HandNoteBlock>
          DARE, s.v. "Canuck", lists the 1835 quotation also as the earliest
          American attestation and suggests its transition from Hawaiian kanaka
          into English via "perhaps" Canadian French canaque. The earliest
          French quotation we were able to find dates from 1866 (Larousse
          Etymologique 2005, s.v. "canaque"), which is rather late. Our
          interpretation, see above, would render the transfer from English into
          Canadian French more likely. Note: The DARE map shows its predominant
          use in the North-Eastern US, Northern Midwest and Washington State and
          Oregon.
        </HandNoteBlock>
        <CitationList>
          <Citation year="1835">
            (1835) [Taking possession, after purchase, is called, in the
            phraseology of the country, drawing your land. The quantity of land
            described as located in favor of U.E. loyalists, is 1,664,600 acres,
            and for militia claimants 504,100 acres. Canadians are somewhat
            jealous of Americans? that they are secretly manoeuvering, not
            exactly with the inoffensive good humor of a much respected yeoman
            of England, in whose sequestered dwelling I some time resided [?].
            Johnathan distinguishes a Dutch or French Canadian, by the term
            Kanuck.]
          </Citation>
        </CitationList>
      </Definition>
    </div>
  )
}

export default Canuck
