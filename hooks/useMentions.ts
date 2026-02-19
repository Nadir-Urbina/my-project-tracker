"use client";

import { useState, useEffect, useCallback, RefObject } from "react";

export interface MentionItem {
  id: string;
  label: string;
  value: string;
  description?: string;
}

// Predefined shortcuts
export const DATE_MENTIONS: MentionItem[] = [
  {
    id: "today",
    label: "@today",
    value: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    description: "Insert today's date",
  },
  {
    id: "tomorrow",
    label: "@tomorrow",
    value: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    })(),
    description: "Insert tomorrow's date",
  },
  {
    id: "nextweek",
    label: "@nextweek",
    value: (() => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    })(),
    description: "Insert date 7 days from now",
  },
  {
    id: "nextmonth",
    label: "@nextmonth",
    value: (() => {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    })(),
    description: "Insert date 1 month from now",
  },
];

interface UseMentionsProps {
  inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onInsert?: (value: string) => void;
  mentions?: MentionItem[];
}

export function useMentions({
  inputRef,
  onInsert,
  mentions = DATE_MENTIONS,
}: UseMentionsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredMentions, setFilteredMentions] = useState<MentionItem[]>([]);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!showSuggestions || filteredMentions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredMentions.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev === 0 ? filteredMentions.length - 1 : prev - 1
          );
          break;
        case "Enter":
        case "Tab":
          e.preventDefault();
          insertMention(filteredMentions[selectedIndex]);
          break;
        case "Escape":
          setShowSuggestions(false);
          break;
      }
    },
    [showSuggestions, filteredMentions, selectedIndex]
  );

  const insertMention = useCallback(
    (mention: MentionItem) => {
      const input = inputRef.current;
      if (!input || mentionStart === null) return;

      const value = input.value;
      const before = value.substring(0, mentionStart);
      const after = value.substring(input.selectionStart || mentionStart);
      const newValue = before + mention.value + after;

      // Update input value
      input.value = newValue;

      // Set cursor position after inserted text
      const cursorPos = before.length + mention.value.length;
      input.setSelectionRange(cursorPos, cursorPos);

      // Trigger change event
      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);

      // Call onInsert callback if provided
      onInsert?.(mention.value);

      setShowSuggestions(false);
      setMentionStart(null);
      setSearchQuery("");
    },
    [inputRef, mentionStart, onInsert]
  );

  const handleInput = useCallback(
    (e: Event) => {
      const input = e.target as HTMLInputElement | HTMLTextAreaElement;
      const value = input.value;
      const cursorPos = input.selectionStart || 0;

      // Find the last @ before cursor
      const textBeforeCursor = value.substring(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");

      if (lastAtIndex !== -1) {
        const query = textBeforeCursor.substring(lastAtIndex + 1);
        // Only show suggestions if @ is at start of word (preceded by space or start of string)
        const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : " ";
        if (charBeforeAt === " " || lastAtIndex === 0) {
          setMentionStart(lastAtIndex);
          setSearchQuery(query);

          // Filter mentions based on query
          const filtered = mentions.filter((m) =>
            m.label.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredMentions(filtered);
          setShowSuggestions(filtered.length > 0);
          setSelectedIndex(0);
          return;
        }
      }

      setShowSuggestions(false);
      setMentionStart(null);
    },
    [mentions]
  );

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.addEventListener("input", handleInput);
    input.addEventListener("keydown", handleKeyDown as EventListener);

    return () => {
      input.removeEventListener("input", handleInput);
      input.removeEventListener("keydown", handleKeyDown as EventListener);
    };
  }, [inputRef, handleInput, handleKeyDown]);

  return {
    showSuggestions,
    filteredMentions,
    selectedIndex,
    insertMention,
    setShowSuggestions,
  };
}
