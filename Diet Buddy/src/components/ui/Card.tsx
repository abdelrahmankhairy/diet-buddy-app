interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`glass rounded-lg p-6 backdrop-blur-xl border border-white/10 dark:border-white/10 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
