// Export the published lexical data (entries and meanings, no quotations)
// as CSV for an external researcher. See issue #506.
//
// Usage, from the repository root, with DATABASE_URL set (it reads .env):
//
//   node scripts/local/export-lexical-data.mjs <output directory>
//
// Writes entries.csv, meanings.csv and README.md into the directory, which
// is created if needed. Only entries with is_public = 1 and a headword are
// exported (one public DCHP-1 row has an empty headword and no meanings).
// Quotation texts are not exported, because the source texts have their
// own copyright; each meaning gets a quotation count and the year of its
// earliest quotation instead.
//
// The README's copyright and terms section is a placeholder until the
// editor-in-chief supplies the wording; do not send the export before that.
//
// Editorial text keeps its inline HTML (<i>, <sub>, <br>, links), since
// the italics carry meaning; stray HTML comments left by the old editing
// software are removed.

import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { PrismaClient } from "@prisma/client"

const [outDir] = process.argv.slice(2)
if (!outDir) {
  console.error(
    "Usage: node scripts/local/export-lexical-data.mjs <output directory>"
  )
  process.exit(1)
}

const prisma = new PrismaClient()

// --- helpers ---------------------------------------------------------------

const clean = (text) =>
  text == null
    ? ""
    : String(text)
        .replace(/<!--.*?-->/gs, "")
        .trim()

const csvCell = (value) => {
  const text = typeof value === "boolean" ? (value ? "1" : "0") : clean(value)
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

const csv = (header, rows) =>
  [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") +
  "\r\n"

// The site shows a quotation's composition year when there is one,
// otherwise its publication year; "c1902" and "1963-64" count as 1902 and
// 1963. "n.d." and blanks give nothing.
const citationYear = (citation) => {
  const text = citation.yearcomp || citation.yearpub || ""
  const m = text.match(/\d{4}/)
  return m ? Number(m[0]) : null
}

// --- query -----------------------------------------------------------------

const entries = await prisma.entry.findMany({
  where: { is_public: true, NOT: { headword: "" } },
  orderBy: { headword: "asc" },
  include: {
    meanings: {
      orderBy: { order: "asc" }, // the entry page sorts by this string
      include: {
        usageNotes: { orderBy: { id: "asc" } },
        citations: {
          include: {
            detCitation: { select: { yearpub: true, yearcomp: true } },
          },
        },
      },
    },
  },
})

// --- entries.csv -----------------------------------------------------------

const entryHeader = [
  "entry_id",
  "headword",
  "homograph_number",
  "spelling_variants",
  "etymology",
  "general_labels",
  "fist_note",
  "non_canadian_headword",
  "non_canadian_confirmed",
  "legacy_dchp1_entry",
  "edition",
  "meaning_count",
]

const entryRows = entries.map((e) => [
  e.id,
  e.headword,
  e.superscript,
  e.spelling_variants,
  e.etymology,
  e.general_labels,
  e.fist_note,
  e.dagger,
  e.no_cdn_conf,
  e.is_legacy,
  e.dchp_version,
  e.meanings.length,
])

// --- meanings.csv ----------------------------------------------------------

const meaningHeader = [
  "meaning_id",
  "entry_id",
  "headword",
  "meaning_number",
  "part_of_speech",
  "definition",
  "usage_labels",
  "canadianism_type",
  "canadianism_type_comment",
  "non_canadian_meaning",
  "usage_notes",
  "quotation_count",
  "earliest_quotation_year",
]

const meaningRows = []
for (const e of entries) {
  for (const m of e.meanings) {
    const years = m.citations
      .map((c) => (c.detCitation ? citationYear(c.detCitation) : null))
      .filter((y) => y != null)
    meaningRows.push([
      m.id,
      e.id,
      e.headword,
      m.order === "0" ? "" : m.order, // "0" and blank both mean the only sense
      m.partofspeech,
      m.definition,
      m.usage,
      m.canadianism_type,
      m.canadianism_type_comment,
      m.dagger,
      m.usageNotes.map((n) => clean(n.text)).join("\n\n"),
      m.citations.length,
      years.length ? Math.min(...years) : "",
    ])
  }
}

// --- README.md -------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10)
const byEdition = {}
for (const e of entries)
  byEdition[e.dchp_version ?? "unknown"] =
    (byEdition[e.dchp_version ?? "unknown"] ?? 0) + 1

const readme = `# DCHP-3 lexical data export

Exported ${today} from the Dictionary of Canadianisms on Historical
Principles, third edition (DCHP-3), https://dchp.arts.ubc.ca.

## Copyright and terms of use

© Stefan Dollinger, Nelson Education Ltd., and The University of British
Columbia. All rights reserved. (This is the copyright line of the DCHP-3
website; its Copyright Note, https://dchp.arts.ubc.ca/how-to-use#copyright-note,
explains that the DCHP-1 content is licensed to UBC by Nelson Education Ltd.
and that reproduction or distribution of dictionary content needs express
consent from the editor-in-chief and, for the DCHP-1 content, Nelson and/or
UBC.)

TERMS OF USE AND CITATION: TO BE SUPPLIED BY THE EDITOR-IN-CHIEF BEFORE THIS
EXPORT IS SENT TO ANYONE. Replace this paragraph with the approved wording
(permitted use, redistribution, how to cite the dictionary).

## What is included

Every published entry (${entries.length.toLocaleString(
  "en-CA"
)}) and its meanings
(${meaningRows.length.toLocaleString(
  "en-CA"
)}). Quotations are not included because the
quoted sources have their own copyright; each meaning carries a quotation
count and the year of its earliest quotation instead.

Entries by edition of first publication:

${Object.entries(byEdition)
  .sort()
  .map(([k, v]) => `- ${k}: ${v.toLocaleString("en-CA")}`)
  .join("\n")}

Editorial text keeps its inline HTML (\`<i>\`, \`<sub>\`, \`<br>\`, links) because
the italics are meaningful (cited forms, foreign words). Both files are UTF-8
CSV with a header row, comma separated, fields quoted where needed, CRLF line
ends; multi-line fields are quoted.

## entries.csv

| column | meaning |
| --- | --- |
| entry_id | Database id; joins to meanings.csv |
| headword | The headword as displayed |
| homograph_number | Distinguishes headwords spelled alike (blank for most) |
| spelling_variants | Other spellings, comma separated, as written by the editors |
| etymology | Etymology text; "<" means "from" |
| general_labels | Labels that apply to the whole entry |
| fist_note | The editorial note shown with a pointing hand on the entry page |
| non_canadian_headword | 1 if the headword is marked Non-Canadian (the dagger in DCHP-1 and DCHP-2 and "Non-Cdn." in DCHP-3) |
| non_canadian_confirmed | 1 if the editors confirmed the term is not a Canadianism |
| legacy_dchp1_entry | 1 if the entry is unrevised DCHP-1 (1967) text |
| edition | Edition in which the entry was first published: dchp1 (1967), dchp2 (2017), dchp3 (2023), dchp3.1 (ongoing) |
| meaning_count | Number of rows in meanings.csv for this entry |

## meanings.csv

| column | meaning |
| --- | --- |
| meaning_id | Database id |
| entry_id | Joins to entries.csv |
| headword | Repeated from the entry for convenience |
| meaning_number | Sense number as displayed, e.g. 1, 2a, 2b; blank when the entry has a single sense |
| part_of_speech | e.g. n., v., adj. |
| definition | The definition text |
| usage_labels | Regional, social or domain labels for this sense, e.g. "Ontario, slang" |
| canadianism_type | DCHP-2/3 typology: 1. Origin, 2. Preservation, 3. Semantic Change, 4. Culturally Significant, 5. Frequency, 6. Memorial; blank for most DCHP-1 senses, which were not typed |
| canadianism_type_comment | The "Word Story": the editors' rationale for the type |
| non_canadian_meaning | 1 if this sense is marked Non-Canadian |
| usage_notes | Longer usage notes, separated by a blank line when there are several |
| quotation_count | Number of quotations attached to the sense |
| earliest_quotation_year | Year of the earliest attached quotation (composition year where known, otherwise publication year); blank if none is dated |

The typology is explained in the DCHP-2 introduction,
https://dchp.arts.ubc.ca/dchp2/how-to-use, and in DCHP-3's How to use page.
`

// --- write -----------------------------------------------------------------

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, "entries.csv"), csv(entryHeader, entryRows))
writeFileSync(join(outDir, "meanings.csv"), csv(meaningHeader, meaningRows))
writeFileSync(join(outDir, "README.md"), readme)
console.log(
  `Wrote ${entryRows.length} entries and ${meaningRows.length} meanings to ${outDir}`
)

await prisma.$disconnect()
