import { useEffect, useState } from "react"

// The whole lookup can be done without touching the mouse: Enter opens the
// search, Cmd+W brings the student back to the same field, the number goes
// in, Enter moves on. This block explains that loop on the page itself.
export default function KeyboardGuide() {
  // Decided after hydration so the server and first client render agree.
  const [mod, setMod] = useState("Cmd / Ctrl")
  useEffect(() => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
    setMod(isMac ? "Cmd" : "Ctrl")
  }, [])

  const Key = ({ children }: { children: React.ReactNode }) => (
    <kbd className="rounded border border-gray-400 bg-gray-100 px-1.5 py-0.5 font-mono text-sm">
      {children}
    </kbd>
  )

  return (
    <details
      open
      className="mb-6 max-w-3xl rounded border border-gray-300 bg-gray-50 p-4"
    >
      <summary className="cursor-pointer font-semibold">
        Keyboard-only workflow
      </summary>
      <ol className="mt-3 list-decimal space-y-2 pl-6">
        <li>
          Type the term and press <Key>Enter</Key>. The table appears and the
          cursor lands in the first count field.
        </li>
        <li>
          In an empty count field, <Key>Enter</Key> opens that Google search in
          a new tab.
        </li>
        <li>
          Read the &ldquo;About N results&rdquo; line under Google&rsquo;s
          search box. If Google does not show it, click <em>Tools</em> under the
          search box and it appears. With fewer than ten results there is no
          line: count the results yourself.
        </li>
        <li>
          Press <Key>{mod}</Key>+<Key>W</Key> to close the tab. You are back
          here, in the same field.
        </li>
        <li>
          Type the number. Commas are optional, and you can paste the whole
          &ldquo;About 1,230,000 results&rdquo; line; only the number is kept.
          <Key>Enter</Key> or <Key>Tab</Key> moves to the next field. A field
          that is already filled, such as a reused normalizer count, is skipped
          over with <Key>Enter</Key> too.
        </li>
        <li>
          When every count is in, <Key>{mod}</Key>+<Key>Enter</Key> saves the
          lookup.
        </li>
      </ol>
      <p className="mt-3 text-sm text-gray-600">
        Google personalizes results by account and location. For counts that
        other people can reproduce, use a private window or a browser profile
        that is not signed in to Google.
      </p>
    </details>
  )
}
