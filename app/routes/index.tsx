import { PageHeader } from "~/components/elements/Headings/PageHeader"
import TextPageMain from "~/components/elements/Layouts/TextPageMain"
import { Link } from "~/components/elements/LinksAndButtons/Link"

export default function Index() {
  return (
    <TextPageMain>
      <PageHeader>Welcome to DCHP-3</PageHeader>
      <p>
        This is the third edition of the 1967{" "}
        <em>A Dictionary of Canadianisms on Historical Principles</em> (DCHP-1).
        DCHP-3 integrates the legacy data of DCHP-1 (1967) and the updated data
        of DCHP-2 (2017) with new content to form DCHP-3. There are 137 new and
        updated entries in this edition for a new total of 12,040 headwords with
        14,587 meanings.
      </p>
      <p>
        DCHP-3 lists, as did its predecessors, Canadianisms. A Canadianism is
        defined as
      </p>
      <blockquote>
        a word, expression, or meaning which is native to Canada or which is
        distinctively characteristic of Canadian usage though not necessarily
        exclusive to Canada. (Walter S. Avis in DCHP-1, page xiii;{" "}
        <Link to="https://dchp.ca/dchp1/pages/frontmatter#introduction">
          see DCHP-1 Online
        </Link>
        )
      </blockquote>
      <p>
        We recognize six types of Canadianisms (see the{" "}
        <Link to="/how-to-use">How-to section, A Typology of Canadianisms</Link>
        ). Some meanings that are not Canadian are included for context and are
        marked with a dagger (†). A few entries are included that we or others
        originally thought were Canadianisms, but our research proved otherwise.
        We include these entries to save others the trouble of checking again;
        they are marked by a{" "}
        <span className="border border-red-700 bg-red-300 px-1">
          red background
        </span>
        . DCHP-1 legacy content is presented on{" "}
        <span className="border border-amber-700 bg-amber-200 px-1">
          yellow
        </span>
        ; DCHP-2 and DCHP-3 content on{" "}
        <span className="border border-gray-700 px-1">white background</span>{" "}
        with edition labels in the top right corner.
      </p>
      <p>This work should be cited as:</p>
      <blockquote>
        Dollinger, Stefan and Margery Fee (eds). 2025.{" "}
        <em>
          DCHP-3: The Dictionary of Canadianisms on Historical Principles, Third
          Edition.
        </em>{" "}
        Vancouver, BC: University of British Columbia,{" "}
        <Link to="https://www.dchp.ca/dchp3">www.dchp.ca/dchp3</Link>. DOI:{" "}
        <Link to="https://doi.org/10.17613/hr345-77f43">
          https://doi.org/10.17613/hr345-77f43
        </Link>{" "}
        (Published 15 May 2025).
      </blockquote>
      <hr className="my-8" />
      <p className="text-center text-sm">
        Supported by the{" "}
        <Link to="https://www.sshrc-crsh.gc.ca/">
          Social Science and Humanities Council of Canada
        </Link>{" "}
        Grant # 435-2022-0921.
      </p>
      <p className="text-center text-sm">
        © Stefan Dollinger, Nelson Education Ltd., and The University of British
        Columbia, 2025. All rights reserved.
      </p>
    </TextPageMain>
  )
}
