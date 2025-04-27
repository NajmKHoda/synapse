const Button = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'outline' | 'default';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
}) => {
  const baseClasses = "rounded-md font-medium transition-colors";
  const variantClasses = variant === 'outline'
    ? "border border-gray-200 bg-transparent hover:border-secondary hover:text-secondary"
    : "bg-primary text-gray-800 hover:bg-primary/90";
  
  const sizeClasses = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg"
  }[size];

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
export default Button;