# Fonts served by the app

- `Carlito-Regular.woff`, `Carlito-Bold.woff`: Carlito, the open-licence font
  with the same metrics as Calibri, from
  https://github.com/googlefonts/carlito, subset to Latin (Basic, Latin-1,
  Latin Extended-A, general punctuation, euro) and converted to WOFF with
  fontTools. Licence in `OFL.txt`.

Used by the Frequency Index chart (`app/components/frequencyIndex/FrequencyIndexChart.tsx`)
so the DCHP-2 chart looks the same on a machine without Calibri, on the page
and in the downloaded PNG. Declared in `app/styles/additional.css`.
