// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

// A component that imports a VALUE from a `.server` module pulls that module
// into the client bundle. For anything reaching ~/db.server that means a real
// PrismaClient in the browser build, which fails the Vite build with
// "Server-only module referenced by client" and, in tests, surfaces as an
// unhandled PrismaClientInitializationError once DATABASE_URL is absent.
//
// Route modules are different: the compiler strips their loaders and actions
// from the client build, so they may import server modules freely. Components
// may not, and only the full build catches it otherwise.
//
// A type-only import is erased and is fine.

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    return statSync(path).isDirectory()
      ? walk(path)
      : /\.tsx?$/.test(entry)
      ? [path]
      : []
  })

// The clause is forbidden from containing `from`, which pins each match to the
// import statement immediately before it. Matching on `[^;]` instead would run
// across statements, because this codebase omits semicolons.
const SERVER_IMPORT =
  /(?:import|export)\s+((?:(?!\bfrom\b)[\s\S])*?)\s+from\s+["']([^"']*\.server)["']/g

describe("components do not import server modules", () => {
  const files = walk("app/components")

  it("finds the component files to check", () => {
    expect(files.length).toBeGreaterThan(10)
  })

  it.each(files)("%s", (file) => {
    const source = readFileSync(file, "utf8")
    const offenders: string[] = []

    for (const [, clause, module] of source.matchAll(SERVER_IMPORT)) {
      // `import type { Foo }` is erased entirely.
      if (clause.trimStart().startsWith("type")) continue

      // `import { type Foo }` is erased too; only a value binding is a problem.
      const bindings = clause
        .replace(/[{}]/g, " ")
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean)

      const values = bindings.filter((b) => b && !b.startsWith("type "))
      if (values.length > 0) offenders.push(`${module}: ${values.join(", ")}`)
    }

    expect(offenders).toEqual([])
  })
})
