// DCHP-1: front matter of the 1967 paper edition
// Ported from the DCHP-1 Online CakePHP templates (2013); text unchanged.
import { Link } from "~/components/elements/LinksAndButtons/Link"
import { PageHeader } from "~/components/elements/Headings/PageHeader"
import { SecondaryHeader } from "~/components/elements/Headings/SecondaryHeader"
import { TertiaryHeader } from "~/components/elements/Headings/TertiaryHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"
import hand from "../images/hand.png"

export default function Dchp1Frontmatter() {
  return (
    <TextPageMain>
      <PageHeader>Frontmatter of the 1967 paper edition</PageHeader>

      <ul className="my-4 ml-8 flex list-disc flex-col gap-y-2">
        <li>
          <Link to="#foreword">Foreword (W.R. Wees, Gage Ltd.)</Link>
        </li>
        <li>
          <Link to="#preface">Preface (M. H. Scargill)</Link>
        </li>
        <li>
          <Link to="#acknowledgements">Acknowledgments (all editors)</Link>
        </li>
        <li>
          <Link to="#editors">The Editors</Link>
        </li>
        <li>
          <Link to="#introduction">Introduction (W. S. Avis)</Link>
        </li>
        <li>
          <Link to="#style">Principles of style</Link>
        </li>
      </ul>

      <span id="foreword" />
      <SecondaryHeader>Foreword</SecondaryHeader>

      <p>
        When man has an experience that he has turned into an idea that stays
        with him, he invariably gives a name to it. By the instrument of the
        word he is thus more readily enabled to re-use the experience himself,
        and to tell other people about it. The study of people's language is
        thus a study of their experience over the course of time, an intimate
        study of their history.
      </p>

      <p>
        By its history a people is set apart, differentiated from the rest of
        humanity. If, therefore, there is anything distinctive about Canadians,
        it must be the result of a history of experience different from the
        histories of the French, the English, the Americans, and all those who
        have come together to form the Canadian people.
      </p>

      <p>
        That separateness of experience, in the bludgeoning of the Atlantic
        waves, the forest over-burden of the St. Lawrence valley, the long
        waterways to the West, the silence of the Arctic wastes, the lonesome
        horizons of the prairie, the vast imprisonment of the Cordilleras, the
        trade and commerce with the original Canadians—all this is recorded in
        our language.
      </p>

      <p>
        The publishers hope that, as a contribution to Centennial thinking, the{" "}
        <em>Dictionary of Canadianisms</em> will assist in the identification,
        not only of Canadianisms but of whatever it is that we may call
        "Canadianism."
      </p>

      <p>
        <em>W. R. Wees</em>,<br />
        Vice-President, Publishing
        <br />
        W. J. Gage Limited
        <br />
        <br />
        Toronto, Ontario
        <br />
        August, 1967
      </p>

      <span id="preface" />
      <SecondaryHeader>Preface</SecondaryHeader>

      <p>
        <em>A Dictionary of Canadianisms on Historical Principles</em> is the
        product of the vision, hard work, support, and encouragement of a great
        many people, and its beginning goes back many years.
      </p>

      <p>
        At the founding meeting of the Canadian Linguistic Association, held at
        the University of Manitoba in 1954, some discussion was given to the
        possibility of preparing dictionaries of Canadian English; but it was
        not until 1957 that the Association established a Lexicographical
        Committee to begin promoting and co-ordinating lexicographical work in
        Canada. The membership of the original committee was as follows: M. H.
        Scargill (Chairman); H. Alexander; W. S. Avis; W. H. Brodie; P.
        Daviault; R. J. Gregg; C. J. Lovell; J. E. Robbins; G. M. Story; J. P.
        Vinay; H. R. Wilson. Since 1957, separate committees have been
        established to deal with French-Canadian and Ukrainian lexicography and
        with dialect studies.
      </p>

      <p>
        In 1957 and following years plans were made to prepare three types of
        dictionaries: a series of dictionaries for use in schools and
        universities (now completed); a historical dictionary of the English
        language in Canada; a dictionary of Canadianisms, which was to serve as
        a pilot project for the larger historical dictionary of the English
        language in Canada. In 1958 Mr. C. J. Lovell was invited to prepare a{" "}
        <em>Dictionary of Canadianisms</em> for W. J. Gage Limited from
        materials already assembled by him and other scholars, especially Dr.
        Avis and Mr. Charles Crate. In order to expedite his work, the Canada
        Council awarded Mr. Lovell a Visiting Fellowship to Canada in 1960, and
        he made plans to spend a full year in Canada, editing his materials and
        consulting with colleagues. However, these plans were never completed,
        for Mr. Lovell died on March 17th, 1960, at his home in Illinois.
      </p>

      <p>
        On Mr. Lovell's death, W. J. Gage Limited made arrangements to purchase
        from his estate his entire lexicographical collection; and at the
        request of W. J. Gage, Dr. Avis and Dr. Scargill agreed to continue the
        work that Mr. Lovell had undertaken.
      </p>

      <p>
        At this time it became essential to have some central location where Mr.
        Lovell's materials and others being assembled could be housed ready for
        editing. It also became apparent that the moment had arrived for the
        acquisition of a budget to provide for secretarial help, for supplies,
        for filing cabinets, and all the things necessary for the establishment
        of an editorial office.
      </p>

      <p>
        During the summer of 1960, Dr. M. G. Taylor, now President of the
        University of Victoria and then first Principal of the University of
        Alberta, Calgary (now the University of Calgary), agreed to provide the
        space and secretarial assistance for what was designated as the
        "Lexicographical Centre for Canadian English Located at the University
        of Alberta, Calgary." Dr. Scargill became the Centre's Director and Dr.
        Avis its Associate Director.
      </p>

      <p>
        From the summer of 1960 on, materials began to arrive at the Centre in
        ever-increasing amounts. Particularly valuable was the gift to the
        Centre of a complete manuscript for a dictionary of terms of the
        Canadian Northwest collected by Dr. Douglas Leechman.
      </p>

      <p>
        Until 1963 editorial work proceeded very slowly, and it was obvious that
        arrangements would have to be made to free one of our colleagues from
        his normal academic work so that he could devote at least a full year to
        dictionary editing. Thanks to the co-operation of Canada Council in
        providing a Senior Fellowship and to the Royal Military College of
        Canada in granting a sabbatical leave of absence, Dr. Avis was able to
        spend a full year, 1963-64, at the Lexicographical Centre in Calgary. By
        the summer of 1964, as a result of his hard work, it was thought
        possible to advance the publication date of the dictionary from 1970 to
        1967, the year of Canada's Centenary. Accordingly, the Lexicographical
        Centre appointed the Editorial Board which has been responsible for the
        production of this present dictionary. At the same time, the Board
        agreed that because other materials in addition to those assembled by
        Mr. Lovell, notably the collections of Dr. Avis, Mr. Crate, Dr.
        Leechman, and that of the Centre itself, were being used in the
        dictionary, the nature and scope of the project as originally conceived
        had greatly changed and the book should now be acknowledged as compiled
        from the five collections named above.
      </p>

      <p>
        In the fall of 1964, Dr. Scargill left the University of Alberta,
        Calgary, to join the staff of the new University of Victoria, and the
        Lexicographical Centre was moved to that city. In Victoria the resources
        of the Centre were increased by the appointment of Dr. Leechman as
        Research Associate and Miss Joan Hall as Editorial Assistant, positions
        which both still hold. At the same time the Centre signed a contract
        with W. J. Gage Limited to produce for them this present dictionary with
        the Editorial Board named above.
      </p>

      <p>
        Again thanks to the generosity of Canada Council and to the Royal
        Military College of Canada, Dr. Avis was able to spend the summer of
        1965 at the University of Victoria, where he was joined by Mr. Crate,
        who spent a further summer there in 1966.
      </p>

      <p>
        Perhaps there are those who will consider this a rather long prefatory
        essay; but I do not think that they will be many. I believe that the
        story of all that has gone into the making of this dictionary is worth
        the telling, and I am proud to be its narrator on behalf of my
        colleagues. Several years have elapsed now since our collaboration
        began. Those years have been enlivened by good humor among a closely
        knit group of colleagues and marred only by the tragedy of Mr. Lovell's
        death. We have been aided on all sides and at all times by people in
        many walks of life. It is with pleasure and with pride that we now offer
        our thanks to them in the realization that their good wishes and
        encouragement will accompany this book that they have helped to make
        possible.
      </p>

      <p>
        <em>M. H. Scargill,</em>
        <br />
        Director,
        <br />
        Lexicographical Centre for Canadian English
      </p>

      <p>
        Victoria, B.C.
        <br />
        June, 1967
      </p>

      <span id="acknowledgements" />
      <SecondaryHeader>Acknowledgments</SecondaryHeader>

      <p>
        It is impossible to acknowledge at all adequately the debt that we owe
        to all those who have helped to make possible{" "}
        <em>A Dictionary of Canadianisms on Historical Principles</em>. The
        following list is by no means a complete record of the names of the
        people and the institutions providing assistance of varying degrees and
        kinds, and we apologize for any omissions.
      </p>

      <p>
        For the financial assistance without which this book could never have
        been produced we wish to thank the Canada Council, the President and
        Board of Governors of the University of Victoria, the President and the
        Board of Governors of the University of Alberta. In this respect our
        special thanks are due to Dr. M. G. Taylor, President of the University
        of Victoria, not only for invaluable financial aid but also for
        encouragement and support of an academic kind.
      </p>

      <p>
        We are grateful to the Royal Military College of Canada for co-operation
        in making available the services of Dr. W. S. Avis, not only for a full
        sabbatical year but at other times as well, and to the School Board of
        North Island (District #85) for granting occasional leave to Mr. Chas.
        Crate.
      </p>

      <p>
        We have received invaluable assistance in checking bibliographical
        materials and in other ways from the staff of the McPherson Library,
        University of Victoria; and we thank the Librarian, Mr. Dean Halliwell,
        for making available to us the services of Mrs. Helen Rodney and Mr.
        Robin Kerr, Reference Librarians. Thanks for similar assistance are due
        also to Miss Inez Mitchell, Assistant Provincial Archivist, Provincial
        Archives, Victoria, B.C., and to the Librarians and their staffs in the
        following institutions: the University of Alberta, the University of
        Calgary, the University of British Columbia, the Royal Military College
        of Canada, the Toronto Public Library, and the Vancouver Public Library.
        Miss Grace Lewis, Yarmouth, Nova Scotia, has helped us not only in her
        capacity as Librarian in that city but also as a reader and as a
        consultant on items of Nova Scotia interest.
      </p>

      <p>
        It is with special pleasure that we acknowledge the contribution made to
        this dictionary by students, especially Mr. Terry Klokeid, University of
        Victoria, for help with Eskimo and Amerindian items, and Mrs. Cheryl
        Campbell, Alert Bay, B.C., for help with Chinook and Kwakiutl items. Dr.
        Avis' students in courses at the Summer School of Linguistics,
        University of Alberta, provided many examples of Canadianisms. Students
        of Mr. Chas. Crate have given considerable assistance to him with the
        typing of materials.
      </p>

      <p>
        We wish to thank also the very many individuals who have helped us in
        various ways as readers and as occasional consultants. Their names
        include the following: Mr. H. G. Ambury; Mrs. E. W. J. Avery; Mrs. G. D.
        Bancroft; Mrs. Geri Pattisson Beddows; Mr. R. W. Bennett; Dr. C. Bida;
        Rev. L. Braceland; Mr. L. Bunyan; Miss M. I. Buxton; Major S. S.
        Carroll; Mr. C. Cole; Dr. C. B. Conway; Mr. H. C. Cutbill; Mr.W.
        Davidson; Mr. B. W. A. Deacon; Mr. H. De Groot; Dr. H. A. Dempsey; Mr.
        T. Dunbabin; Mr. R. Eaton; Mr. Harold B. Elworthy; Mr. S. J. Ewaniuk;
        Mr. J. B. Fraser; Mr. N. F. W. Gates; Mr. T. Gilchrist; Miss I. M.
        Graham; Mr. W. J. Greene; Dr. R. J. Gregg; Mr. A. Harshenin; Mr. E. B.
        Harvey; Rev. R. B. Horsefield; Mr. Willard Ireland; Lieutenant M.
        Jacquest; Miss B. A. Johnstone; Mr. R. J. Jones; Mrs. E. Joslin; Mr. R.
        Keith-Hicks; Mr. J. LeBourdais; Dr. A. R. M. Lower; Miss J. W. Lucas;
        Dr. N. M. McArthur; Miss D. MacDonald; Mr. C. McAllister; Mrs. J. C.
        McGibbon; Mrs. K. B. McCool; Mr. H. Michell; Mr. J. S. Moir; Mrs. M.
        Moore; Mrs. S. Mott; Mr. M. D. Nelles; Dr. G. N. O'Grady; Mr. T. M.
        Paikeday; Mr. J. S. Peach; Mr. E. W. Person; Mr. W. Preuss; Mr. E. Pye;
        Mr. Allen Walker Read; Dr. P. Read-Campbell; Dr. Carroll Reed; Mr. and
        Mrs. Wallace Roberts; Major N. Sadleir-Brown; Miss M. S. Simpson; Mr.
        Vernon Simpson; Dr. G. F. G. Stanley; Mr. J. Stein; Miss H. Stevenson;
        Dr. G. M. Story; Mr. B. Stuart-Stubbs; Dr. J.-P.Vinay; Dr. M. G.
        Wanamaker; Mr. B. G. Webber; Rev. Gavin White; Dr. H. R. Wilson; Mr. S.
        F. Wise; Dr. A. J. Wood.
      </p>

      <p>
        The publishers of any book often play a greater part in its production
        than readers realize. We should be indeed remiss if we failed to record
        our appreciation to W. J. Gage Limited for their support and
        encouragement over many years and, in particular, to Dr. W. R. Wees,
        whose high ideals and determination helped to make possible the
        publication of this book and the whole series of which it is a part. In
        addition, we wish to thank all those members of the publisher's
        editorial staff who have worked on this book.
      </p>

      <p>
        Finally, we wish to convey our appreciation to Mrs. C. J. Lovell and her
        family for their help and co-operation.
      </p>

      <p>
        W.S.A.
        <br />
        C.C.
        <br />
        P.D.
        <br />
        D.L.
        <br />
        M.H.S.
      </p>

      <span id="editors" />
      <SecondaryHeader>The Editors</SecondaryHeader>

      <p>
        <em>Walter S. Avis</em>, B.A., M.A. (Queen’s), Ph.D. (Michigan), is a
        Professor of English at the Royal Military College of Canada. Born in
        Toronto, Ontario, in 1919, he has long been interested in English
        language studies, especially with reference to North American English,
        both as student and teacher. Dr. Avis has been a teaching fellow at
        Queen's University and at the University of Michigan and a visiting
        professor at summer schools of linguistics at both the University of
        Montreal and the University of Alberta. A founding member of the
        Canadian Linguistic Association, he was Secretary-Treasurer from 1956 to
        1959 and Secretary from 1959 to 1967; he is at present Vice-President of
        the Association. Since 1955 he has also been Canadian Secretary of the
        American Dialect Society. Dr. Avis is a co-editor of the{" "}
        <em>Dictionary of Canadian English</em> series and compiler of{" "}
        <em>A Bibliography of Writings on Canadian English (1857-1965)</em>. He
        has published various articles in such journals as the{" "}
        <em>Journal of the Canadian Linguistic Association</em> (now the{" "}
        <em>Canadian Journal of Linguistics</em>), <em>Language</em>,{" "}
        <em>American Speech</em>, the <em>Translator's Journal</em>, and{" "}
        <em>Culture</em>. He is also a contributor to the{" "}
        <em>Encyclopedia Canadiana</em>, the <em>Encyclopaedia Britannica</em>,{" "}
        <em>Funk and Wagnall's Standard College Dictionary</em>, the{" "}
        <em>Random House Dictionary</em>, and several other works of reference.
        He has given several talks about Canadian English on the CBC and has
        lectured on the subject many times in many places.
      </p>

      <p>
        <em>Charles Brandel ("Chuck") Crate</em> is a teacher at the Quesnel
        Secondary School, Quesnel, B.C. Born in Weston, Ontario, in 1915, he was
        educated at York Memorial Collegiate and at the University of British
        Columbia and the University of Victoria. Mr. Crate has had a varied
        career and has spent much of his life in the Canadian North. For almost
        four years, 1952-1955, he published and edited the Yellowknife{" "}
        <em>North Star</em> and for nine years directed a program on Radio
        Station CFYK. Mr. Crate has served as Secretary and Research Director of
        the Yellowknife District Miners' Union, as a member of the Board of
        Governors of the Yellowknife Red Cross Hospital, and as Chairman,
        Friends of the Indians (Northwest Territories). He was twice elected
        Councillor of the Municipal District of Yellowknife, and in 1954 was a
        candidate for Northwest Territories Council. He has been a member of the
        Canadian Linguistic Association for many years, and has written articles
        and published papers in a variety of fields, including a vocabulary of
        hardrock mining.
      </p>

      <p>
        <em>Patrick Dockar Drysdale</em>, M.A. (Oxon.), is a senior editor with
        W. J. Gage Limited. Born in Shropshire, England, in 1929, he worked for
        a time in the professional theatre, mainly as a stage manager, before
        turning to teaching. From 1956 to 1959 he was an Assistant Professor in
        the Department of English, Memorial University, Newfoundland, and in
        1958 taught at the Summer School of Linguistics, University of Alberta.
        In 1959 he joined W. J. Gage to participate in the preparation and
        publication of the <em>Dictionary of Canadian English</em> series. In
        addition, he has edited books on English grammar, the theatre, and
        education. He is a member of the Canadian Linguistic Association, and
        since 1960 has served on the editorial board of the{" "}
        <em>Canadian Journal of Linguistics</em>. He has written articles on
        lexicography, dialect geography, and general linguistics.
      </p>

      <p>
        <em>Douglas Leechman</em>, B.Sc., M.A., Ph.D. (Ottawa), F.R.S.C., is
        Research Associate at the Lexicographical Centre for Canadian English.
        Born in 1890, he came to Canada in 1908. In 1924 he joined the staff of
        the Division of Anthropology in the National Museum of Canada and was
        engaged there till 1955. During this period he attended the University
        of Ottawa, and in 1941 he was elected a Fellow of the Royal Society of
        Canada. On leaving the National Museum, he became the first Director of
        the Glenbow Foundation in Calgary, Alberta. On retiring to Victoria,
        B.C., in 1957, he devoted much of his time to writing and further work
        in lexicography, especially in the fields of Canadian slang and terms
        and expressions used in the fur trade. He joined the staff of the
        University of Victoria in 1964. He is the author of several books,
        including <em>Native Tribes of Canada</em> and <em>Eskimo Summer</em>,
        and of many technical papers.
      </p>

      <p>
        <em>Charles Julien Lovell</em>, writer, researcher and lexicographer,
        was born in Portland, Maine. Orphaned as a small child, he was reared in
        foster homes in New Bedford, Massachusetts. His life-long interest in
        words was closely linked to his first love, the out-of-doors. The
        nomenclature of fauna and flora always fascinated him, and his devotion
        to Canada and Canadian English grew out of a series of hiking trips in
        the Canadian Rockies. In 1946 he was appointed research and editorial
        assistant of <em>A Dictionary of Americanisms</em>, to which, in the
        words of its editor, he made "an outstanding contribution." He worked
        for the University of Chicago Press until November, 1953, when he
        suffered a first heart attack. Thereafter he continued his writing and
        lexicographical work independently. He corresponded and compared notes
        with Canadian scholars and gradually assembled that impressive
        collection already referred to in the Preface. His death on March 17,
        1960, was a tragic loss to lexicography and to the study of Canadian
        English.
      </p>

      <p>
        <em>Matthew Harry Scargill</em>, B.A., Ph.D. (Leeds), is Chairman of the
        School of Graduate Studies and Head of the Department of Linguistics at
        the University of Victoria. Born in Yorkshire, England, in 1916, he came
        to Canada in 1948 and joined the staff of the University of Alberta. In
        1959 he became Professor of English at the University of Calgary, and
        was appointed Dean of Arts and Science there in 1962. Dr. Scargill moved
        to the University of Victoria in 1964 to head the newly established
        Department of Linguistics. Dr. Scargill is a founding member of the
        Canadian Linguistic Association and has served as the Association's
        Secretary, Editor of the <em>Journal</em>, and from 1964 to 1966 as
        President. He is the author of several articles and books, including{" "}
        <em>Three Icelandic Sagas</em>, <em>An English Handbook</em>,{" "}
        <em>The Development of the Principal Sounds of Indo-European</em>.
        Together with Dr. W. S. Avis, Dr. R. J. Gregg, and Mr. P. D. Drysdale,
        he is an editor of the{" "}
        <em>W. J. Gage Dictionary of Canadian English</em> series.
      </p>

      <span id="introduction" />
      <SecondaryHeader>Introduction</SecondaryHeader>

      <blockquote className="my-4 ml-8">
        That part of Canadian English which is neither British nor American is
        best illustrated by the vocabulary, for there are hundreds of words
        which are native to Canada or which have meanings peculiar to Canada. As
        might be expected, many of these words refer to topographical features,
        plants, trees, fish, animals, and birds; and many others to social,
        economic, and political institutions and activities. Few of these words,
        which may be called Canadianisms, find their way into British or
        American dictionaries, a fact which should occasion no surprise, for
        British and American dictionaries are based on British and American
        usage, being primarily intended for Britons and Americans, not for
        Canadians.
        <br />
        (Walter S. Avis. 1967. "Canadian English,"{" "}
        <em>The Senior Dictionary</em>, Dictionary of Canadian English Series.
        Toronto: W. J. Gage, pp. vi-ix)
      </blockquote>

      <p>
        The purpose of{" "}
        <em>A Dictionary of Canadianisms on Historical Principles</em> is to
        provide a historical record of words and expressions characteristic of
        the various spheres of Canadian life during the almost four centuries
        that English has been used in Canada. The dictionary is intended to
        provide the meaning, or meanings, of such terms and, where relevant,
        their pronunciation, etymology, and scope — both in time and space;
        moreover, through dated quotations, an extensive cross-referencing
        system, illustrative drawings, and explanatory notes relating to usage,
        disputed origins, and other contentious matters, the editors have sought
        to create an informative, entertaining, and valuable reference work.
        Finally, the dictionary should demonstrate that a substantial vocabulary
        relating to both today and yesterday has been developed by Canadians in
        pursuing their many activities throughout their vast and varied
        homeland.
      </p>

      <p>
        <em>A Dictionary of Canadianisms</em> has been compiled on historical
        principles in that every term entered is supported by dated evidence
        from printed sources. In this respect, we are in the well-established
        tradition of <em>The Oxford English Dictionary</em>,{" "}
        <em>A Dictionary of American English</em>, and{" "}
        <em>A Dictionary of Americanisms</em>, all three of which have been
        indispensable during the editing process. To follow this tradition,
        however, is to accept certain restrictions, for it precludes the
        entering of terms for which there is only oral evidence and of others
        for which the printed evidence is fragmentary or otherwise inadequate.
        As a consequence, many interesting items remain in the files, awaiting
        fuller substantiation in printed sources. Furthermore, since reading for
        the dictionary has continued during editing and printing, there is in
        the files a great deal of material that for practical reasons could not
        be published in the present edition — including additional evidence for
        entered items as well as evidence for completely new items. It should be
        added that less stringent limitations of space have made it possible to
        introduce innovations in format and style affording more ease of
        reference than was possible in earlier historical dictionaries.
      </p>

      <p>
        The problem of establishing a definition for <em>Canadianism</em> as
        used in the title of this dictionary was not easy to solve. The term is
        used in a less inclusive sense than the definition given in the body of
        the dictionary itself, for we are concerned primarily with vocabulary;
        on the other hand, it is used in a more inclusive sense than{" "}
        <em>Americanism</em> has been used by scholars in the United States.
        Mitford M. Mathews, for example, defines the term in his Preface to{" "}
        <em>A Dictionary of Americanisms</em> as "a word or expression which
        originated in the United States." (Chicago: University of Chicago Press,
        1951, p. v). Yet in his dictionary he uses a wide variety of Canadian
        source materials as evidence for a substantial number of "Americanisms,"
        a practice which, to say the least, weakens his definition. After all,
        Canada is not part of the United States — although she has shared
        English-speaking North America with the United States from the time of
        the American Revolution. Prior to that time, English speakers in North
        America held their mother country in common. Consequently, the problem
        of identifying many terms as specifically "American" or "Canadian" is
        virtually impossible of solution. Needless to say, the editors of{" "}
        <em>A Dictionary of Canadianisms</em> have struggled with this problem
        since the project began.
      </p>

      <p>
        In view of the difficulty and, perhaps, pointlessness of trying to
        identify many words in common use on this continent as being "American"
        or "Canadian," lexicographers compiling dictionaries of the English used
        in North America might be well advised to adopt the label{" "}
        <em>North Americanism</em>. The arguments for such a solution to this
        problem are several. In the first place, many terms in this class were
        current in North America before the United States existed as a political
        entity. Indeed, the present-day boundary between the United States and
        Canada was not fixed — especially on the Pacific Coast — until well into
        the nineteenth century. Furthermore, Canadians and Americans from the
        late seventeenth century onward have moved back and forth across the
        border in such numbers and with such regularity that it is impossible to
        determine exactly where certain terms originated. So much is and has
        long been similar or identical in the social and economic spheres of
        Canadian and American life and so much, especially along the border, is
        shared with respect to natural resources, flora and fauna, topography,
        and so on, to say nothing of our common contacts with the American
        Indians, that hosts of terms cannot be claimed by one country or the
        other with any degree of confidence whatever. As a matter of fact, there
        is little point in making such claims since these terms reflect a common
        heritage in many fields of activity, the vocabulary of a people being in
        a very real sense a record of the history and experience of those who
        use it.
      </p>

      <p>
        To meet this problem, we have done our best to confine ourselves to
        source materials written by persons native to or resident in Canada who
        were writing about Canadian life or by travellers and other visitors to
        Canada who were commenting on their experiences in this country.
        Furthermore, we have found it desirable, perhaps even necessary, to
        include certain entries in this dictionary which are not Canadian at
        all. Such entries are intended (1) to clarify terms having numerous
        extensions of meaning or lending themselves freely to the formation of
        new compounds, such extensions or compounds being themselves
        Canadianisms, as <em>beaver</em> (defs. 1 and 2); (2) to serve as
        reference points for synonyms which are themselves Canadianisms, as{" "}
        <em>wolverine</em>; (3) to call attention to terms having special
        interest in various areas of Canadian activity, as{" "}
        <em>discovery claim</em>. All words or meanings so entered are marked
        with a dagger (†); they have, moreover, a special significance and
        history in Canada and, accordingly, are supported by dated quotations.
        In addition to easing certain editorial problems, the dagger device has
        made it possible to include a limited amount of interesting and
        informative matter that otherwise would not have qualified for
        inclusion.
      </p>

      <span id="point-a" />
      <p>
        Since our approach to our material is clearly quite different from that
        of lexicographers in the United States, we have chosen to define{" "}
        <em>Canadianism</em> less exclusively than they have defined{" "}
        <em>Americanism</em>. A Canadianism, then, is a word, expression, or
        meaning which is native to Canada or which is distinctively
        characteristic of Canadian usage though not necessarily exclusive to
        Canada; <em>Winnipeg couch</em> falls into the first category,{" "}
        <em>chesterfield</em> ("sofa") into the second.
      </p>

      <p>
        Now that the term <em>Canadianism</em> has been defined for our
        purposes, it is possible to expand on the general nature of the entries
        in this dictionary. The vocabulary distinctive of Canada has developed
        along lines characteristic of linguistic groups which become separated
        from their motherland through emigration to distant and strange shores.
        The stock of words brought with these emigrants will change as they come
        into close contact with speakers of other languages, as they encounter
        novelties of animal life, vegetation, and topography, as they adopt or
        devise different ways of coping with their new environment, and as they
        work out new ways of organizing their political, economic, and social
        life. As a result of these experiences, new terms will be added to the
        vocabulary, while others will fall into disuse and obsolescence because
        they have specific reference to things having to do with life in the old
        country. The result, of course, is a speech community which differs in
        many respects from the motherland although continuing to share a very
        extensive common vocabulary. Moreover, the speech patterns in the
        emigrant community change in other ways: in pronunciation, intonation,
        syntax, and, often less markedly, in grammatical form. When the extent
        of such differentiation becomes extreme, the two dialects become
        mutually unintelligible and are consequently classed as different
        languages. Such a degree of change has not taken place in North America,
        and the English spoken in Canada and in the United States is, with
        relatively minor exceptions largely relating to vocabulary, quite
        understandable in Britain — and vice versa. Therefore, it is quite
        erroneous to refer, as some have done, to an American language or a
        Canadian language.
      </p>

      <p>
        In colonial times, the English-speakers coming to Canada — first in the
        sixteenth century as resident fishermen in Newfoundland, then in the
        seventeenth as fur traders for the Hudson's Bay Company, and eventually
        in the eighteenth and nineteenth centuries as settlers — came into
        contact with the Indians, the Eskimos, and the Canadian French. Living
        among these non-English-speaking peoples, the traders and pioneers
        borrowed a wide variety of terms, usually referring to things new in
        their experience, as <em>pemmican</em>, <em>igloo</em>, and{" "}
        <em>voyageur</em>. Another source of new terms lay in the ready-to-hand
        resources of the parent language, elements of which could be combined in
        several ways as labels for new concepts, as <em>fur brigade</em>,{" "}
        <em>snowbird</em>, and <em>sturgeon-head boat</em>, compounds which have
        referents substantially different from the meanings of the parts. Once
        loanwords from other languages had been assimilated, these too were
        available for compounding, as <em>pemmican post</em>,{" "}
        <em>portage strap</em>, and <em>saskatoon berry</em>. Still another
        solution to the problem of labeling the novelties of the environment was
        to use already established English words in a new sense, that is, to
        extend the range of meaning of these words. Thus <em>buffalo</em> was
        extended to refer to the bison of the prairies; and throughout the North{" "}
        <em>deer</em> was extended to refer to the caribou. Moreover,
        assimilated loanwords often took on extended meanings not known in the
        source languages, as with several of the meanings of <em>cache</em>,{" "}
        <em>shaganappi</em>, and <em>siwash</em> (ultimately from French{" "}
        <em>sauvage</em> Indian). Many indeed are the processes of change by
        which the vocabulary has grown — by borrowing, by compounding, by
        shortening, by blending, by the generalization of proper names, and by
        new coinages; moreover, the range of meaning of terms has been altered
        and expanded by extension, transference, deterioration and amelioration,
        by generalization and specialization, and by folk etymology. Many of
        these processes have been applied not only to terms already existing in
        the parent language, but also to loanwords borrowed and assimilated.
        Thus <em>A Dictionary of Canadianisms</em> offers compelling evidence of
        the inventiveness of Canadians past and present in the realm of word
        creation.
      </p>

      <p>
        Readers of this dictionary will soon become aware that certain areas of
        activity in the social, political, and economic life of the country have
        been particularly productive of Canadianisms. In the social and
        political sphere, the most significant of these include pioneer life,
        travel, recreation, religion, and education, as well as politics and
        administration — at the municipal, provincial, and federal levels. In
        the economic, or commercial, sphere must be included the fur trade,
        logging, fishing, farming, mining, oil and gas operations, and the
        maple-products industry. Then, too, there is the large area concerned
        with relationships between the English-speaking Canadians and the
        French-speaking Canadians, the Indians, the Eskimos, and, especially in
        certain regions, the many immigrant peoples who form an important part
        of the population of twentieth-century Canada. Finally, there is the
        extensive contribution of terms deriving from the experiences of
        Canadians in the North American environment, relating to topographical
        features, weather conditions, and flora and fauna. In fact, the plethora
        of evidence for local terms and folk-names within the last-mentioned
        category is both overwhelming and difficult to document. It has been
        necessary, therefore, to adopt a rather arbitrary policy of selection
        with regard to such items in the hope of providing a representative
        rather than definitive listing of the names for plants, shrubs, trees,
        animals, birds, and fish.
      </p>

      <p>
        Since most of the areas of activity and experience mentioned above
        represent situations in which Canadian life differs most markedly from
        life in the mother country, it should not be surprising that they are
        well represented in this lexicon. That{" "}
        <em>A Dictionary of Canadianisms</em>, in spite of its many entries from
        many areas of activity, is incomplete goes without saying; it is the
        fate of all dictionaries, for reasons inherent in the complexity of the
        subject matter and in the lamentable lack of omniscience among its
        editors and consultants, to be flawed in this respect. On the other
        hand, a deliberate decision was taken to omit certain kinds of entries
        whose relevance to dictionaries is often considered peripheral, namely,
        biographical and gazeteer entries; also excluded, after much
        deliberation, were the names of Indian and Eskimo tribes and bands in
        spite of the wealth of interesting evidence in the files at the
        Lexicographical Centre. It was decided, however, to include numerous
        compound terms incorporating proper nouns, terms relating to certain
        general regions, nicknames of cities, provinces, and regions and their
        inhabitants (with the exception of common present-day terms such as{" "}
        <em>Torontonian</em>, <em>Montrealer</em>, and <em>Vancouverite</em>),
        and informal or slang names for people, places, and institutions. In
        these several categories, special attention has been given to those
        terms having historical significance justifying definition and
        illustration.
      </p>

      <p>
        In the preparation of <em>A Dictionary of Canadianisms</em>, constant
        recourse has been had not only to <em>The Oxford English Dictionary</em>
        , <em>A Dictionary of Americanisms</em>, and{" "}
        <em>The English Dialect Dictionary</em>, all especially helpful because
        of their historical evidence, but also to the invaluable{" "}
        <em>Webster's Third New International Dictionary</em> and to many other
        dictionaries and word lists of a more specialized or limited scope.
        Despite all precautions, however, it is inevitable that certain errors
        not now known to the editors of this dictionary will be discovered by
        knowledgeable readers, for any pioneering work is bound to be
        accompanied by such shortcomings. We shall work to overcome these
        shortcomings by continuing to add to our files. In this endeavor, we
        should appreciate the help of interested persons in detecting and
        rectifying all inaccuracies and omissions; we also need further
        information concerning terms already entered, including evidence of
        earlier use, and concerning other terms that we may appear to have
        overlooked. Any evidence supplied should, of course, be in the form of
        dated quotations from printed sources, accompanied by full
        bibliographical details. In this way, through our combined efforts, an
        improved second edition will be assured.
      </p>

      <p>
        This first edition of <em>A Dictionary of Canadianisms</em> must be
        regarded as a pioneering work. Nevertheless, in spite of imperfections,
        it makes available a unique and fascinating record of Canadian history
        and accomplishment through the medium of the hundreds of terms defined
        and the thousands of contexts provided to illuminate its terms and
        definitions. It is in the confidence that this record is sufficiently
        extensive to constitute a scholarly and valuable contribution that we
        take pride in offering it to the Canadian people.
      </p>

      <p>
        <em>Walter S. Avis</em>
        <br />
        Editor-in-Chief
      </p>

      <p>
        Kingston, Ontario
        <br />
        June, 1967
      </p>

      <span id="style" />
      <SecondaryHeader>Principles of Style</SecondaryHeader>

      <p>
        The method and the principles of style followed in compiling{" "}
        <em>A Dictionary of Canadianisms</em> have been adopted with two
        principal considerations in mind: the interests of the reader and the
        demand for clear and economical presentation. It has been the editors'
        constant concern to satisfy the latter without detriment to the former.
        Inasmuch as a uniform pattern of style was followed in putting together
        each entry, the readers' understanding of these principles will be
        advanced by a point-by-point description of the parts of an entry.
      </p>

      <TertiaryHeader>Entry word</TertiaryHeader>

      <p>
        The spelling given for an entry word in current use is the generally
        accepted form; in the case of many obsolete loanwords having various
        spellings in the evidence, the principle of frequency and simplicity is
        followed. Occasionally, where two spellings are clearly in use for
        current words, both are given, as for <em>ooloo</em> or <em>ulu</em>,
        with no implication that one is preferable to the other. To conserve
        space, certain other measures have been adopted, for example: terms in
        which the simplex has a meaning identical with that of a compound are
        occasionally combined, as <em>bachelor (seal)</em>; so with a number of
        terms having minor variations in form, as{" "}
        <em>Barren Ground(s) grizzly</em>; in the alphabetizing of such entries,
        the parenthetical material is ignored. Where this practice might cause
        the reader difficulty in locating the entry, a cross-entry has been set
        up.
      </p>

      <p>
        When two or more entries have the same spelling but different
        etymologies, superior numbers are used to observe the distinction, as{" "}
        <em>
          boom<sup>1</sup>
        </em>{" "}
        and{" "}
        <em>
          boom<sup>2</sup>
        </em>
        ; superior numbers are also used to distinguish similar forms having the
        same ultimate origin but arriving in Canadian English by historically
        different routes, as{" "}
        <em>
          voyage<sup>1</sup>
        </em>{" "}
        and{" "}
        <em>
          voyage<sup>2</sup>
        </em>
        .
      </p>

      <p>
        When two sequential entries differ only in that one normally has an
        upper-case, or capitalized, initial letter, the upper-case form is
        entered second, unless it is clearly the antecedent of the lower-case,
        or generalized, form. Finally, certain terms occur in the evidence in
        both upper- and lower-case forms; such are treated according to the
        general practice among modern writers represented in the evidence. Names
        of flora and fauna are regularly entered as lower-case forms, as{" "}
        <em>prairie lily</em>, unless the first element is a word normally
        requiring a capital letter, as <em>Canada jay</em>,{" "}
        <em>Macintosh apple</em>, <em>Canadian horse</em>. Furthermore, the
        names of groups of people are usually entered as proper names, as{" "}
        <em>Bluenose</em>, <em>Doukhobor</em>, <em>Metis</em>; although the
        "either-or" formula is sometimes used where usage is markedly divided,
        as <em>Mountie</em> or <em>mountie</em>. In cases of divided usage in
        the use of upper- or lower-case forms, no attempt has been made to list
        as variant spellings the alternative not used in the entry words.
      </p>

      <TertiaryHeader>Compound words</TertiaryHeader>

      <p>
        Entry words formed by compounding make up such a large part of this
        dictionary that our treatment of them demands special attention. All
        compounds appear in proper alphabetical order whether printed as one
        word (<em>moosebird</em>), two words joined by a hyphen (
        <em>moose-fly</em>), or two independent words (<em>moose maple</em>). As
        a rule, such entries represent true compounds in that they have a
        referent quite distinct from the sum of their parts; thus{" "}
        <em>pemmican post</em> is entered because it is not self-explanatory and
        requires definition, whereas <em>pemmican shipment</em>, if it occurred
        at all in the evidence, would have been used only as an illustration of
        the word <em>pemmican</em>. Decisions as to whether a given compound was
        to be printed as one word, as a hyphenated word, or as two words were
        not always easy to make, for the style of treating such compounds has
        never been consistent in English. Such decisions were based on the
        evidence (which was not always helpful), on accepted practice (which is
        unsettled), or on value judgments relating to the appearance of the word
        as a unit. Moreover, the stress pattern was often taken into account
        along with other criteria — a sequence of a primary followed by a
        secondary stress dictating the use of either a block or a hyphenated
        form and the sequence of primary followed by another primary dictating a
        two-word entry. The final decision was often somewhat arbitrary although
        our overall handling of the problem is certainly more rational than was
        the case in the evidence we worked from. In any event, the forms set up
        as entry words in such cases are not intended as a reflection of
        accepted current usage with regard to the treatment of compounds since
        there is no such thing. Within the confines of our own book, however,
        the choice of one form or another does have an effect on the degree of
        detail included in a given entry, as will be seen from the discussion
        below.
      </p>

      <TertiaryHeader>Pronunciation</TertiaryHeader>
      <p>[omitted in DCHP-1 Online, SD]</p>

      <p>
        The pronunciation respelling comes immediately after the entry word and
        is given in the symbols of the International Phonetic Alphabet within
        square brackets; a pronunciation key is to be found on page{" "}
        <em>xxiii</em> [of the paper copy, SD]. Such respellings are offered, as
        a rule, only for words not commonly entered in standard dictionaries,
        being considered redundant for commonplace words easily looked up
        elsewhere and for most compounds made up of such words; respellings are
        not offered for compounds containing words for which the pronunciation
        is given elsewhere in this dictionary. Moreover, no respellings are
        offered for terms labelled as obsolete, the pronunciation of many such
        being a matter of guesswork. Variant pronunciations of current terms are
        sometimes given; however, in keeping with the position that{" "}
        <em>A Dictionary of Canadianisms</em> is not intended as a guide to
        accepted spelling and pronunciation, most terms are respelled in one
        form only, that being, to the best of the editors' knowledge, a
        currently acceptable variant.
      </p>

      <TertiaryHeader>Parts of speech</TertiaryHeader>

      <p>
        All entry words consisting of one word or of more than one word joined
        by hyphens are identified as parts of speech; such is not the case for
        unhyphenated two-word terms or phrases. Thus <em>face-off</em> is
        labelled <em>n.</em> for noun, whereas <em>face off</em>, a phrasal
        verb, is not labelled at all. Where a form has a different set of
        meanings as a noun, verb, adjective, or other part of speech, a distinct
        entry has been set up and labelled accordingly. In cases of entry words
        which have irregular plural forms or which are usually or always
        construed in the plural form, the appropriate information is given.
      </p>

      <TertiaryHeader>Etymology</TertiaryHeader>

      <p>
        Wherever relevant, the etymology of a term follows the part-of-speech
        label, enclosed in square brackets. In the typical entry the symbol &lt;
        ("derived from") comes first, followed by the word in the source
        language, if different in form from the entry word, then the English
        gloss, if different in meaning from the following definition. Few words
        are traced back farther than the immediate source although for specific
        words detailed information may be offered. Needless to say, some
        etymologies are incomplete and others are shown to be uncertain because
        the facts are not known to the editors. If the origin of a word is a
        subject of controversy, or of wide speculation, as in the case of{" "}
        <em>Canada</em> or <em>Eskimo</em>, reference is made to a note
        occurring later in the entry, where the matter is discussed and, often,
        illustrated by a number of dated quotations. Indian and Eskimo words are
        transliterated in a non-technical way in the traditional English
        alphabet, augmented by macrons to signify long vowels. The evidence for
        many of these etymologies is based on older sources, most of them by
        linguistically naive writers; unfortunately, the present state of
        Amerindian studies in Canada is quite inadequate to afford a practicable
        alternative. In any event, such approximations are probably quite
        adequate for the needs of the general reader and may, indeed, be easier
        to comprehend than a system of strange symbols representing the many
        unfamiliar sounds and sequences to be met with in the diverse languages
        in question.
      </p>

      <TertiaryHeader>Restrictive labels</TertiaryHeader>

      <p>
        Since many terms are largely confined to certain areas of use, a number
        of restrictive labels have been regularly employed. These may be grouped
        into the following categories, each of which is illustrated by examples:
        sphere (<em>Fur Trade</em>, <em>Lumbering</em>), locale (
        <em>Maritimes</em>, <em>North</em>), level (<em>Informal</em>,{" "}
        <em>Slang</em>), connotation (<em>Derog.</em>, <em>Humorous</em>), and
        currency (<em>Obs.</em>, <em>Hist.</em>, <em>Rare</em>). The distinction
        between obsolete (<em>Obs.</em>) and historical (<em>Hist.</em>) terms
        is not always easy to establish, apart from the fact that all terms so
        labelled have reference to the past. In this dictionary, a term labelled{" "}
        <em>Obs.</em> has a referent solely in the past and is itself no longer
        in use; a term labelled <em>Hist.</em> has a referent in the past but is
        still used as a current term in historical contexts. Thus the terms{" "}
        <em>angle</em> (entrance to a beaver lodge) and <em>fathom fish</em>{" "}
        (oolichan) are obsolete, whereas <em>late-Loyalist</em> and{" "}
        <em>York boat</em> are historical. The absence of a recent quotation
        from the files does not necessarily mean that a given term has fallen
        into disuse, for the excerpters may have either looked in the wrong
        places or simply missed it. Such items known to the editors to be still
        current have not been labelled. On the other hand, an apparently
        obsolete term is no less obsolete by virtue of a recent writer's use of
        it in referring to or in glossing an earlier source. It must be observed
        that all labels reflect the editors' judgment, based on the evidence in
        the files and on their own knowledge and experience.
      </p>

      <p>
        In some instances, special labels have been adopted, as for the few
        non-English terms entered for various reasons: <em>Cdn French</em>,{" "}
        <em>Chinook Jargon</em>, <em>Eskimo</em>. Such entries are not normally
        given pronunciation respellings or etymologies; the entry word, however,
        is given an English gloss if the meaning of the components is not
        directly clear from the definition, as <em>canot allège</em> "unburdened
        canoe." Restrictive labels precede the first definition if applicable to
        the entire entry; otherwise, they are placed before the definition to
        which they apply. It might be added that phrases are sometimes used in
        place of locale labels: "in Upper and Lower Canada," for instance, being
        preferable to a label for certain historical items current in a
        restricted area in colonial times. Further, the abbreviation{" "}
        <em>Esp.</em> ("especially") may be placed before any label to modify
        the degree of restrictiveness intended. Certain sets of quotations
        illustrating the figurative uses of a term are entered as a separate
        definition and identified either by the label <em>Figurative use</em> or
        by a phrase having the same significance.
      </p>

      <TertiaryHeader>Quotations</TertiaryHeader>

      <p>
        The quotations selected to illustrate each definition were chosen with
        the following ends in view: to supply the earliest and, usually, the
        latest evidence on file; to supply fuller descriptive detail than is
        possible or desirable in a definition; to supply definitions where
        acceptable and to which the reader may be referred; and to supply
        interesting, entertaining, and otherwise appropriate contexts in which
        the term occurs.
      </p>

      <p>
        These quotations are, with rare exceptions, presented as grammatical
        sentences, irrelevant matter in the original usually being displaced by
        ellipsis dots or editorial interpolations set in square brackets: each
        is preceded by a brief bibliographical direction which gives year,
        source, and page number, the quotations for each definition being
        entered in chronological order. Square brackets are also used within
        quotations to enclose editorial interpolations intended to clarify
        ambiguities and obscurities; in addition, they are used to enclose
        certain quotations—usually early evidence—included as useful information
        but so set apart for one of the following reasons: (1) the source
        material is not Canadian or is not clearly Canadian; (2) the quotations
        explain, describe, or define the term in question without actually using
        it; (3) the term occurs in some other context not to be classed as
        evidence for the use of the term in English. The last category includes
        quotations from early French-Canadian sources and glosses appearing in
        the writings of early traders and explorers in contact with the Indians
        and Eskimos.
      </p>

      <p>
        Although the illustrative quotations have been carefully chosen, a
        reader may sometimes feel that a given illustration could apply to other
        definitions as readily as to that to which it has been assigned. It must
        be remembered, however, that the quotation represents only part of a
        larger context in the source and that the citation slip usually provides
        the editor with considerably more information as to the meaning of the
        term in the larger context than the quotation itself might indicate. In
        situations where citation slips were ambiguous the deficient quotations
        have been set aside.
      </p>

      <span id="bibliographical-directions" />
      <TertiaryHeader>Bibliographical Directions</TertiaryHeader>

      <p>
        Special mention should be made of the bibliographical directions which
        precede each quotation. References to books are made by year, author,
        short title, and page number; where the author is anonymous, only the
        short title is given. Periodicals are referred to by year, title, month
        (or volume number), page, and where relevant, column. The books and
        periodicals consulted are listed in the bibliography. Newspapers, which
        are not listed in the bibliography, are referred to by year, title,
        place of publication (except where identified in the title), province
        (except for capital and certain other well-known cities), day, month,
        page, and column (except for advertisements, headlines, and captions,
        which are identified as such). If the name of the place of publication
        is obsolete, the current name is inserted in square brackets, as Rat
        Portage [Kenora], Ont. Finally, where dates are supplied in parentheses,
        they indicate the date of the edition used, the accompanying volume and
        page number referring to that edition. Thus a diary written in 1804 but
        published, say, in 1945 is entered as <strong>1804</strong>(1945). Where
        a book was first published in 1804 and presumably written at that time,
        the simple date <strong>1804</strong> is given; if this book was
        republished in 1900, the date <strong>1804</strong>(1900) is given,
        indicating that the page reference is to the 1900 edition. In the case
        of material reprinted in an anthology, a journal, a newspaper, or any
        other source, the date of the original material is given first and the
        date of the source in which it was reprinted is given in parentheses.
      </p>

      <TertiaryHeader>Sub-Entries</TertiaryHeader>

      <p>
        Idioms and phrases are entered in boldface type as numbered definitions
        under the key word; thus <em>by acclamation</em> is entered under{" "}
        <em>acclamation</em>. Where there is apt to be doubt as to the key word,
        a cross-reference is given; thus <em>bury the hatchet</em> is entered
        under <em>hatchet</em> and a simple cross-entry set up at{" "}
        <em>bury the hatchet</em>. Certain short verbal phrases are, however,
        listed as main entries in the manner of phrasal verbs — for example,{" "}
        <em>make fish</em>, <em>make fur</em>, and <em>make logs</em>.
      </p>

      <TertiaryHeader>Bibliography</TertiaryHeader>

      <p>
        The full bibliography of books and periodicals appended to this
        dictionary follows universally accepted principles of style and should
        therefore cause little difficulty. Such problems as might arise
        concerning the entries themselves are discussed in the introductory note
        to the bibliography [below, SD].
      </p>

      <p>
        [Note: the following text, from p. 881 in the paper edition, is of
        interest concerning the genesis of the bibliography, SD]
      </p>

      <p>
        The following bibliography is organized in two parts [in DCHP-1 Online
        the parts have been merged, see{" "}
        <Link to="/how-to-use#show-reference">Show reference</Link>, SD]. The
        first embraces sources of quotations identified by author (or, rarely,
        editor) and/or title (if written anonymously), whether a book, an
        extract from a book, or an article in a newspaper, magazine, or other
        source. Book titles are often identified in the text by an abbreviated
        form, or short title, which, taken with the author's name and the date
        of publication, should be readily traced in the bibliography. The second
        part embraces periodicals cited in the dictionary by the year, title,
        and month of issue (or volume number) or day and month of the source,
        the usual practice of readers being to provide only this information for
        quotations drawn from periodicals, newspapers, and similar sources. In
        the case of periodicals now defunct, the inclusive dates of publication,
        in so far as the editors have been able to discover them, are given in
        parentheses at the end of the entry [this information is suppressed in
        DCHP-1 Online, SD]. Newspapers are not listed in the bibliography, their
        places of publication being given within parentheses in the text,
        immediately following the title.
      </p>

      <p>
        Both parts of the bibliography are intended to direct the reader to the
        source cited, giving him such information as may be reasonably expected
        to achieve this end. Whenever more than one edition of a book has been
        read, all relevant publication dates have been given. Details as to how
        such have been presented in the text of the dictionary are set forth [in
        the section{" "}
        <Link to="#bibliographical-directions">Bibliographical Directions</Link>
        ] under <em>Principles of Style</em>. Various notes and cross-references
        have been entered in the bibliography as aids to the reader.
      </p>

      <p>
        The form outlined above has been dictated by the nature of the collected
        materials, which presented many difficult problems for those collating
        the bibliographical data. The main obstacle was that in the early stages
        of independent collecting by various persons no consistent pattern of
        providing bibliographical information was followed. As a result, the
        record is incomplete with respect to a few details relating to edition
        and place and date of publication, especially for very early writings.
        It must be added, however, that the search for such missing details goes
        on. For the present, the editors have offered the fullest information
        available from the resources at their disposal. They have, moreover,
        striven to achieve a sensible compromise between the opposed demands of
        completeness in detail and economy of space.
      </p>

      <TertiaryHeader>General Aids to the Reader</TertiaryHeader>

      <p>
        Several additional devices are used throughout the dictionary to give
        the reader an opportunity to derive a maximum of information from the
        contents.
      </p>

      <p>
        Within many entries are short notes (identified by this symbol{" "}
        <img src={hand} alt="" className="inline" />
        and called "fist-notes") which offer various kinds of information
        relating to complex shifts in the meaning of words, especially
        complicated or disputed etymologies, expansions of general definitions,
        and other questions requiring more space for elucidation than is
        provided in the normal entry.
      </p>

      <p>
        To conserve space, a system of "focal entries" has been established
        whereby one term, usually that most commonly used, functions as the
        focus for a group of synonyms; the entry word for this term carries the
        definition, all others being cross-referred to it. All entry words are,
        however, supported by quotations — with the exception of simple
        cross-reference entries identifying spelling or other variants. At these
        focal entries, a list of synonyms is provided.
      </p>

      <p>
        The directive "See also" is used throughout for referring the reader
        both to synonyms and to certain other related entries having
        enlightening definitions or quotations.
      </p>

      <p>
        The abbreviation Cp., used in place of "See also," refers the reader to
        a term (or terms) having a contrary meaning or a meaning in some way
        germane to a full understanding of the term being defined.
      </p>

      <p>
        Other cross-references are made by means of the abbreviation{" "}
        <em>q.v.</em> placed within a definition, where it follows a term itself
        defined and illustrated in the dictionary. This device has permitted the
        editors to dispense with circumlocutions for Canadian terms having no
        commonplace synonym.
      </p>

      <p>
        Economy is often achieved by making quotations do double duty. Thus the
        instruction "See 1801 quote" (or whatever the relevant year may be) is
        sometimes used in place of a definition where an adequate definition
        appears in the designated quotation following. Again, a quotation
        substitute such as "<strong>1801</strong> [see quote at{" "}
        <strong>lumberjack</strong>]" is sometimes given instead of repeating a
        quotation which has been entered elsewhere.
      </p>

      <p>
        Several of the above-mentioned devices are used in the etymologies to
        direct the reader to entries having related etymologies or other
        pertinent information.
      </p>

      <p>
        Finally, there are a substantial number of line drawings included in the
        dictionary to aid the reader in visualizing the entry concerned. Such
        drawings are normally placed adjacent to the entry; wherever such is not
        the case, as when the drawing is located near a synonym elsewhere in the
        dictionary, the reader is directed to it by a cross-reference.
      </p>

      <p>
        In these many ways, the editors have striven to produce a reference book
        in which the information is easy of access as well as interesting and
        informative. It is our hope that those who make use of the results of
        our work will find the experience both rewarding and entertaining.
      </p>
    </TextPageMain>
  )
}
