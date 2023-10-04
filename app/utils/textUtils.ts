export const convertToDoubleBreaks = (text: string) => {
  return (
    text
      // First, convert multiple <br> (or <br />, <br/>, etc.) to a single <br>...
      .replace(/((<br\s*\/?>))+/g, "<br>")
      // ...then, convert single <br> to double <br />.
      .replace(/(<br>)/g, "<br /><br />")
  )
}
