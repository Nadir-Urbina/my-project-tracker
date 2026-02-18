"use client";

import { useState } from "react";
import { format } from "date-fns";
import { LuLightbulb, LuPencil, LuTrash2, LuArrowRight } from "react-icons/lu";
import Card from "@/components/ui/Card";
import { Idea, toDate } from "@/types/models";

interface IdeaCardProps {
  idea: Idea;
  onEdit: () => void;
  onDelete: () => void;
  onConvertToContext: () => void;
  onConvertToProject: () => void;
}

export default function IdeaCard({
  idea,
  onEdit,
  onDelete,
  onConvertToContext,
  onConvertToProject,
}: IdeaCardProps) {
  const [showConvertMenu, setShowConvertMenu] = useState(false);
  const createdDate = toDate(idea.createdAt);

  return (
    <Card hover>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <LuLightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {idea.title}
          </h3>
        </div>
        {createdDate && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {format(createdDate, "MMM d")}
          </span>
        )}
      </div>
      {idea.description && (
        <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 md:line-clamp-2">
          {idea.description}
        </p>
      )}
      <div className="flex gap-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <button
          onClick={(e) => {
            e.preventDefault();
            onEdit();
          }}
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          title="Edit"
        >
          <LuPencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
          title="Delete"
        >
          <LuTrash2 className="h-3.5 w-3.5" />
        </button>
        <div className="relative ml-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              setShowConvertMenu(!showConvertMenu);
            }}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
            title="Convert"
          >
            <LuArrowRight className="h-3.5 w-3.5" />
            Convert
          </button>
          {showConvertMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowConvertMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConvertMenu(false);
                    onConvertToContext();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Convert to Context
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConvertMenu(false);
                    onConvertToProject();
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Convert to Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
