import { PassThrough } from "stream"
import { renderToPipeableStream } from "react-dom/server"
import { ServerRouter } from "react-router"
import { createReadableStreamFromReadable } from "@react-router/node"
import type { EntryContext } from "react-router"
import isbot from "isbot"
import { installUnhandledRejectionHandler } from "~/services/errors/unhandledRejection.server"

const ABORT_DELAY = 5000

// Registered as the server module is evaluated, before any request is served.
// Without it Node terminates the process on an unhandled rejection, so a
// single missing `await` anywhere takes the site down. See #457.
installUnhandledRejectionHandler()

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext
) {
  const callbackName = isbot(request.headers.get("user-agent"))
    ? "onAllReady"
    : "onShellReady"

  return new Promise((resolve, reject) => {
    let didError = false

    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        [callbackName]() {
          let body = new PassThrough()

          responseHeaders.set("Content-Type", "text/html")

          resolve(
            // v2's Response is the global (undici) one, which takes a web
            // stream rather than a Node stream, so the PassThrough has to be
            // adapted rather than passed straight in.
            new Response(createReadableStreamFromReadable(body), {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          )
          pipe(body)
        },
        onShellError(err: unknown) {
          reject(err)
        },
        onError(error: unknown) {
          didError = true
          console.error(error)
        },
      }
    )
    setTimeout(abort, ABORT_DELAY)
  })
}
