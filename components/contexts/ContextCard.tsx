"use client";

import Link from "next/link";
import { LuCircleDot, LuPencil, LuTrash2 } from "react-icons/lu";
import Card from "@/components/ui/Card";
import { EntityStatusBadge } from "@/components/ui/Badge";
import { Context } from "@/types/models";

interface ContextCardProps {
  context: Context;
  projectCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ContextCard({
  context,
  projectCount,
  onEdit,
  onDelete,
}: ContextCardProps) {
  return (
    <Card hover>
      <Link href={`/contexts/${context.id}`} className="block">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <LuCircleDot className="h-5 w-5" style={{ color: context.color }} />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {context.name}
            </h3>
          </div>
          <EntityStatusBadge status={context.status} />
        </div>
        {context.description && (
          <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1 md:line-clamp-2">
            {context.description}
          </p>
        )}
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          {projectCount} project{projectCount !== 1 ? "s" : ""}
        </p>
      </Link>
      <div className="mt-3 flex gap-1 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <button
          onClick={(e) => {
            e.preventDefault();
            onEdit();
          }}
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <LuPencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
        >
          <LuTrash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  );
}
