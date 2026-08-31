// @vitest-environment node
import { EventEmitter } from "node:events"
import { execFileSync } from "node:child_process"
import {
  UNHANDLED_REJECTION_LOG_PREFIX,
  describeRejection,
  installUnhandledRejectionHandler,
  resetUnhandledRejectionHandlerForTests,
} from "./unhandledRejection.server"

beforeEach(() => resetUnhandledRejectionHandlerForTests())

describe("describeRejection", () => {
  it("gives a Response its status and redirect target", () => {
    const redirect = new Response(null, {
      status: 302,
      headers: { location: "/not-allowed" },
    })
    expect(describeRejection(redirect)).toBe("Response 302 -> /not-allowed")
  })

  it("gives a Response without a location just its status", () => {
    expect(describeRejection(new Response(null, { status: 500 }))).toBe(
      "Response 500"
    )
  })

  it("gives an Error its stack", () => {
    const error = new Error("boom")
    expect(describeRejection(error)).toContain("Error: boom")
    expect(describeRejection(error)).toBe(error.stack)
  })

  it("passes a string through", () => {
    expect(describeRejection("plain reason")).toBe("plain reason")
  })

  it("serialises an object", () => {
    expect(describeRejection({ code: 42 })).toBe('{"code":42}')
  })

  it("falls back to String() on something unserialisable", () => {
    const circular: Record<string, unknown> = {}
    circular.self = circular
    expect(describeRejection(circular)).toBe("[object Object]")
  })

  it("describes undefined as a string rather than returning undefined", () => {
    expect(describeRejection(undefined)).toBe("undefined")
  })
})

describe("installUnhandledRejectionHandler", () => {
  it("registers a listener and reports that it did", () => {
    const target = new EventEmitter()
    expect(installUnhandledRejectionHandler(target)).toBe(true)
    expect(target.listenerCount("unhandledRejection")).toBe(1)
  })

  it("is a no-op the second time, so listeners cannot accumulate", () => {
    const target = new EventEmitter()
    installUnhandledRejectionHandler(target)

    expect(installUnhandledRejectionHandler(target)).toBe(false)
    expect(target.listenerCount("unhandledRejection")).toBe(1)
  })

  it("logs the rejection with a greppable prefix", () => {
    const target = new EventEmitter()
    const error = vi.spyOn(console, "error").mockImplementation(() => {})
    installUnhandledRejectionHandler(target)

    target.emit(
      "unhandledRejection",
      new Response(null, { status: 302, headers: { location: "/not-allowed" } })
    )

    expect(error).toHaveBeenCalledWith(
      `${UNHANDLED_REJECTION_LOG_PREFIX} Response 302 -> /not-allowed`
    )
    error.mockRestore()
  })
})

// The unit tests above prove the module registers a listener and what it
// logs. This proves the premise the whole thing rests on: that registering
// one is what keeps Node alive. Run as real subprocesses, because the
// behaviour under test is process exit, and vitest installs handlers of its
// own that would mask it in-process.
describe("Node's behaviour with and without a listener", () => {
  const float = `const guard = async () => { throw new Response(null, { status: 302 }) };
    (async () => { guard(); })();
    setTimeout(() => { console.log("SURVIVED"); }, 50);`

  const run = (script: string) => {
    try {
      const stdout = execFileSync(process.execPath, ["-e", script], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      })
      return { code: 0, stdout }
    } catch (error) {
      const failure = error as { status: number; stdout: string }
      return { code: failure.status, stdout: failure.stdout }
    }
  }

  it("exits without a listener, which is the bug this guards against", () => {
    const { code, stdout } = run(float)

    expect(code).toBe(1)
    expect(stdout).not.toContain("SURVIVED")
  })

  it("survives with a listener registered", () => {
    const { code, stdout } = run(
      `process.on("unhandledRejection", (reason) => console.error("[unhandledRejection]", reason.status));
       ${float}`
    )

    expect(code).toBe(0)
    expect(stdout).toContain("SURVIVED")
  })
})
