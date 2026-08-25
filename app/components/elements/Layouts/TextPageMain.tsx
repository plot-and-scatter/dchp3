import Main from "./Main"

const TextPageMain = (
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
): JSX.Element => {
  return (
    <Main>
      <div className="TextPageMain w-full md:mx-auto md:max-w-xl md:gap-3 md:text-xl lg:max-w-3xl">
        {props.children}
      </div>
    </Main>
  )
}

export default TextPageMain
