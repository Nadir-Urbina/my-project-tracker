"use client";

import { MentionItem } from "@/hooks/useMentions";

interface MentionDropdownProps {
  items: MentionItem[];
  selectedIndex: number;
  onSelect: (item: MentionItem) => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
}

export default function MentionDropdown({
  items,
  selectedIndex,
  onSelect,
  inputRef,
}: MentionDropdownProps) {
  if (items.length === 0) return null;

  // Calculate position based on input element
  const getPosition = () => {
    if (!inputRef.current) return { top: 0, left: 0 };
    const rect = inputRef.current.getBoundingClientRect();
    return {
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    };
  };

  const position = getPosition();

  return (
    <div
      className="fixed z-50 w-64 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
      style={{ top: position.top, left: position.left }}
    >
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          onMouseEnter={() => {}}
          className={`w-full px-3 py-2 text-left transition-colors ${
            index === selectedIndex
              ? "bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
              : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">{item.label}</span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {item.value}
            </span>
          </div>
          {item.description && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {item.description}
            </p>
          )}
        </button>
      ))}
      <div className="border-t border-zinc-200 px-3 py-1.5 dark:border-zinc-700">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          ↑↓ Navigate • Enter/Tab to insert • Esc to dismiss
        </p>
      </div>
    </div>
  );
}
