"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Timestamp } from "firebase/firestore";
import { createTask, updateTask } from "@/services/firestore";
import { Task, TaskStatus, Priority, TaskType, TASK_TYPE_CONFIG, toDate } from "@/types/models";
import Button from "@/components/ui/Button";
import { useMentions } from "@/hooks/useMentions";
import MentionDropdown from "@/components/ui/MentionDropdown";

interface TaskFormProps {
  task?: Task;
  projectId: string;
  contextId: string;
  onComplete: () => void;
  existingCount: number;
}

export default function TaskForm({
  task,
  projectId,
  contextId,
  onComplete,
  existingCount,
}: TaskFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "backlog");
  const [priority, setPriority] = useState<Priority>(task?.priority || "medium");
  const [type, setType] = useState<TaskType>(task?.type || "feature");
  const [dueDate, setDueDate] = useState(() => {
    const date = toDate(task?.dueDate);
    return date ? date.toISOString().split("T")[0] : "";
  });
  const [loading, setLoading] = useState(false);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const { showSuggestions, filteredMentions, selectedIndex, insertMention } =
    useMentions({
      inputRef: descriptionRef,
      onInsert: (value) => {
        if (descriptionRef.current) {
          setDescription(descriptionRef.current.value);
        }
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const dueDateTimestamp = dueDate
        ? Timestamp.fromDate(new Date(dueDate))
        : null;

      if (task) {
        await updateTask(user.uid, task.id, {
          name,
          description,
          status,
          priority,
          type,
          ...(dueDate ? { dueDate: dueDateTimestamp as Task["dueDate"] } : { dueDate: null }),
        });
      } else {
        await createTask(user.uid, {
          projectId,
          contextId,
          name,
          description,
          status,
          priority,
          type,
          dueDate: dueDateTimestamp as Task["dueDate"],
          order: existingCount,
          timeSpent: 0,
        });
      }
      onComplete();
    } catch (err) {
      console.error("Error saving task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Task Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="What needs to be done?"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
          <span className="ml-2 text-xs font-normal text-zinc-500 dark:text-zinc-500">
            (Type @ for shortcuts)
          </span>
        </label>
        <div className="relative">
          <textarea
            ref={descriptionRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Additional details..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          {showSuggestions && (
            <MentionDropdown
              items={filteredMentions}
              selectedIndex={selectedIndex}
              onSelect={insertMention}
              inputRef={descriptionRef}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="backlog">Backlog</option>
            <option value="next_action">Next Action</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TaskType)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {(Object.entries(TASK_TYPE_CONFIG) as [TaskType, { label: string }][]).map(
              ([value, config]) => (
                <option key={value} value={value}>
                  {config.label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Due Date (optional)
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onComplete}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? "Saving..." : task ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
