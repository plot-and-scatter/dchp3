import * as React from "react"
import { HydratedRouter } from "react-router/dom"
import { hydrateRoot } from "react-dom/client"

function hydrate() {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <HydratedRouter />
      </React.StrictMode>
    )
  })
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate)
} else {
  window.setTimeout(hydrate, 1)
}
