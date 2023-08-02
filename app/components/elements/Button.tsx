interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  name?: string;
  value?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  className,
  children,
  name,
  value,
  type,
}) => {
  const defaultClassName = 'ml-3 border border-slate-600 bg-slate-500 p-2 text-white hover:bg-slate-400';


  return (
    <button
      className={`${className || ''} ${defaultClassName}`}
      name={name || ''}
      value={value || ''}
      type={type || 'submit'}
    >
      {children}
    </button>
  );
};

export default Button;
