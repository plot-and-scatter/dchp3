import { prisma } from "~/db.server"

export const loader = async () => {
  const columnCount = await prisma.$queryRawUnsafe<{ count: string }[]>(
    `SELECT COUNT(*) AS count FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'det_entries' AND COLUMN_NAME = 'dchp_version'`
  )
  const stringifiedCount = JSON.stringify(columnCount[0]?.count) // Will be "0" if column does not exist, "1" if it does.

  if (stringifiedCount === '"0"') {
    await prisma.$queryRawUnsafe(
      `ALTER TABLE det_entries ADD COLUMN dchp_version varchar(10)`
    )
    // Now set the values.
    await prisma.entry.updateMany({
      where: { is_legacy: true },
      data: { dchp_version: "dchp1" },
    })

    await prisma.entry.updateMany({
      where: { is_legacy: false },
      data: { dchp_version: "dchp2" },
    })

    await prisma.entry.updateMany({
      where: {
        dchp_version: "dchp2",
        logEntries: {
          some: {
            created: {
              gte: new Date("2018-01-01"),
            },
          },
        },
      },
      data: {
        dchp_version: "dchp3",
      },
    })
  }

  return null
}

export default function Migrate() {
  return <h1 className="mt-8 text-2xl">Migration complete.</h1>
}
