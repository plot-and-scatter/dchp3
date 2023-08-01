interface ButtonProps {
  height?: string;
  width?: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ height, width, text, className, children }) => {
  const defaultButtonStyle = {
    height: height || '40px',
    width: width || '100px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const defaultClassName = 'ml-3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400';

  const buttonStyle = {
    ...defaultButtonStyle,
  };

  return (
    <button className={`${defaultClassName} ${className || ''}`} style={buttonStyle}> {text || children} </button>
  );
};

//
//{text || children}
//</button>
export default Button;