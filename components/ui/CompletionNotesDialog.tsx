"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { useMentions } from "@/hooks/useMentions";
import MentionDropdown from "@/components/ui/MentionDropdown";

interface CompletionNotesDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
  taskName?: string;
}

export default function CompletionNotesDialog({
  open,
  onClose,
  onConfirm,
  taskName,
}: CompletionNotesDialogProps) {
  const [notes, setNotes] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { showSuggestions, filteredMentions, selectedIndex, insertMention } =
    useMentions({
      inputRef: textareaRef,
      onInsert: (value) => {
        if (textareaRef.current) {
          setNotes(textareaRef.current.value);
        }
      },
    });

  useEffect(() => {
    if (open) {
      setNotes("");
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = () => {
    onConfirm(notes);
    setNotes("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Complete Task">
      {taskName && (
        <p className="mb-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {taskName}
        </p>
      )}
      <label className="mb-1.5 block text-sm text-zinc-600 dark:text-zinc-400">
        What was done to complete this task?
        <span className="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-500">
          (Type @ for shortcuts)
        </span>
      </label>
      <div className="relative mb-4">
        <textarea
          ref={textareaRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Completion notes (optional)..."
          rows={3}
          className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }}
        />
        {showSuggestions && (
          <MentionDropdown
            items={filteredMentions}
            selectedIndex={selectedIndex}
            onSelect={insertMention}
            inputRef={textareaRef}
          />
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          Mark Complete
        </Button>
      </div>
    </Modal>
  );
}
