export const horizonText = (
  searchTerm: string,
  horizon: number,
  citationText: string
) => {
  const citationTextWords = citationText.split(" ")

  const matchIndices = []

  let previousIndex = -1

  // Yes, it is a do ... while. This is because we'll always want to go through
  // the loop body at least once.
  do {
    // Get freshest value so we don't get an error when using previousIndex in
    // the findIndex function below.
    const _previousIndex = previousIndex
    const index = citationTextWords.findIndex(
      (text, index) =>
        text.toLowerCase().includes(searchTerm.toLowerCase()) &&
        index > _previousIndex
    )
    previousIndex = index
    if (index > -1) matchIndices.push(index)
  } while (previousIndex > -1)

  const textSegments: string[] = []

  matchIndices.forEach((index) => {
    const minWordIndex = index - horizon
    const maxWordIndex = index + 1 + horizon

    if (minWordIndex > 0) {
      textSegments.push("[...]")
    }

    const surroundedText = citationTextWords.slice(
      Math.max(minWordIndex, 0),
      Math.min(maxWordIndex, citationTextWords.length)
    )
    textSegments.push(surroundedText.join(" "))

    if (maxWordIndex < citationTextWords.length) {
      textSegments.push("[...]")
    }
  })

  return textSegments.join(" ")
}
