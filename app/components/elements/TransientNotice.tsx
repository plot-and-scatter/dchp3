import { useEffect, useState } from "react"

// A confirmation that takes itself away. For "that worked" and nothing else:
// anything a reader might still need — a one-time password link, an error they
// have to act on — must stay put.
//
// It fades rather than vanishing, because something disappearing between
// glances reads as a glitch, and it respects prefers-reduced-motion, where a
// fade is the thing being asked for less of.

const VISIBLE_MS = 5000
const FADE_MS = 700

export default function TransientNotice({
  children,
  /**
   * Change this to show the notice again. Action data is a fresh object per
   * submission, so passing it restarts the timer on a second save rather than
   * leaving the second confirmation unshown because the first had gone.
   */
  resetKey,
  className = "",
}: {
  children: React.ReactNode
  resetKey?: unknown
  className?: string
}) {
  const [state, setState] = useState<"shown" | "fading" | "gone">("shown")

  useEffect(() => {
    setState("shown")

    const fade = setTimeout(() => setState("fading"), VISIBLE_MS)
    const remove = setTimeout(() => setState("gone"), VISIBLE_MS + FADE_MS)

    return () => {
      clearTimeout(fade)
      clearTimeout(remove)
    }
  }, [resetKey])

  if (state === "gone") return null

  return (
    <div
      // Announced when it appears, which is what matters: a screen reader has
      // had it by the time it fades.
      role="status"
      className={`transition-opacity duration-700 motion-reduce:transition-none ${
        state === "fading" ? "opacity-0" : "opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  )
}
