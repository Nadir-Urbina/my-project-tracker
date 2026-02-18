import { LuInbox } from "react-icons/lu";
import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-12 dark:border-zinc-700">
      <div className="mb-3 text-zinc-400 dark:text-zinc-500">
        {icon || <LuInbox className="h-10 w-10" />}
      </div>
      <h3 className="mb-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mb-4 max-w-xs text-center text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
