interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
}: ButtonProps) {
  const variants = {
    primary:
      "bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200",
    secondary:
      "glass border border-white/20 hover:bg-white/10 dark:hover:bg-white/20 px-6 py-2 rounded-lg transition-all duration-200",
  };

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${className} font-medium`}
    >
      {children}
    </button>
  );
}
