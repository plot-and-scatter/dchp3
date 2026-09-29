// Import normalizer counts from a spreadsheet export into
// det_frequency_normalizer_counts, the table of normalizer observations the
// Frequency Index tool reads for its history page, its sparklines and the
// seven-day prefill. Imported rows have no lookup_id.
//
// Usage, from the repository root, with DATABASE_URL set (it reads .env):
//
//   node scripts/local/import-normalizer-counts.mjs <csv> <user email> [normalizer] [source]
//
// The CSV has a header row of domain columns and one row per date:
//
//   ,.ca,.uk,.ie,.nz,.au,.za,US,.edu,.mil,.gov,.us
//   19-Jul-26,3.31E+09,4.59E+09,...
//
// Only columns that map to the tool's seven domains are kept (.ca .uk .ie
// .nz .au .za and US, the combined .edu/.gov/.mil/.us count). Others, and
// any block after a blank line, are ignored. Rows already present for the
// same normalizer, domain, date and source are skipped, so the script can
// be run again safely.

import { readFileSync } from "node:fs"
import { PrismaClient } from "@prisma/client"

const COLUMN_TO_DOMAIN = {
  ".ca": "ca",
  us: "us",
  ".uk": "uk",
  ".ie": "ie",
  ".nz": "nz",
  ".au": "au",
  ".za": "za",
}
const MONTHS = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
}

const [csvPath, email, normalizer = "the", source = "spreadsheet"] =
  process.argv.slice(2)
if (!csvPath || !email) {
  console.error(
    "Usage: node scripts/local/import-normalizer-counts.mjs <csv> <user email> [normalizer] [source]"
  )
  process.exit(1)
}

// "19-Jul-26" -> 2026-07-19, as a UTC date so MySQL's DATE column gets the
// same calendar day whatever the machine's time zone.
const parseDate = (text) => {
  const m = text.trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/)
  if (!m) return null
  const month = MONTHS[m[2].toLowerCase()]
  if (month === undefined) return null
  const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3])
  return new Date(Date.UTC(year, month, Number(m[1])))
}

const lines = readFileSync(csvPath, "utf8").split(/\r?\n/)
const header = lines[0].split(",").map((h) => h.trim().toLowerCase())
const columns = header
  .map((h, i) => ({ domain: COLUMN_TO_DOMAIN[h], index: i }))
  .filter((c) => c.domain)

const observations = []
for (const line of lines.slice(1)) {
  const cells = line.split(",")
  if (cells.every((c) => c.trim() === "")) break // end of the first block
  const observed = parseDate(cells[0])
  if (!observed) {
    console.error(`Skipping row with unreadable date: ${line}`)
    continue
  }
  for (const { domain, index } of columns) {
    const value = Number(cells[index])
    if (!Number.isFinite(value) || value <= 0) continue
    observations.push({ domain, observed, hits: BigInt(Math.round(value)) })
  }
}

const prisma = new PrismaClient()
try {
  const user = await prisma.user.findFirst({ where: { email } })
  if (!user) throw new Error(`No user with email ${email}`)

  let inserted = 0
  let skipped = 0
  for (const o of observations) {
    const exists = await prisma.frequencyNormalizerCount.findFirst({
      where: {
        normalizer,
        domain_key: o.domain,
        observed: o.observed,
        source,
      },
      select: { id: true },
    })
    if (exists) {
      skipped++
      continue
    }
    await prisma.frequencyNormalizerCount.create({
      data: {
        normalizer,
        domain_key: o.domain,
        hits: o.hits,
        observed: o.observed,
        source,
        user_id: user.id,
        created: new Date(),
      },
    })
    inserted++
  }
  console.log(
    `${observations.length} counts read; ${inserted} inserted, ${skipped} already present. Recorded for ${user.first_name} ${user.last_name} (id ${user.id}), normalizer "${normalizer}", source "${source}".`
  )
} finally {
  await prisma.$disconnect()
}
