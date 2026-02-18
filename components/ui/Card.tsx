interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  onClick,
  hover = false,
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 ${
        hover
          ? "cursor-pointer transition-shadow hover:shadow-md dark:hover:border-zinc-700"
          : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-3 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-sm font-semibold text-zinc-900 dark:text-zinc-50 ${className}`}
    >
      {children}
    </h3>
  );
}
