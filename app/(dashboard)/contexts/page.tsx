"use client";

import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { useContexts, useProjects } from "@/hooks/useFirestore";
import { deleteContext } from "@/services/firestore";
import { Context } from "@/types/models";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import ContextCard from "@/components/contexts/ContextCard";
import ContextForm from "@/components/contexts/ContextForm";

export default function ContextsPage() {
  const { user } = useAuth();
  const { data: contexts, loading } = useContexts();
  const { data: projects } = useProjects();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingContext, setEditingContext] = useState<Context | undefined>();
  const [deletingContextId, setDeletingContextId] = useState<string | null>(null);

  const getProjectCount = (contextId: string) =>
    projects.filter((p) => p.contextId === contextId).length;

  const handleDelete = async () => {
    if (!user || !deletingContextId) return;
    await deleteContext(user.uid, deletingContextId);
    setDeletingContextId(null);
    toast("Context deleted");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Contexts
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Organize your projects by area of responsibility
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <LuPlus className="h-4 w-4" />
          New Context
        </Button>
      </div>

      {contexts.length === 0 ? (
        <EmptyState
          title="No contexts yet"
          description="Create your first context to start organizing your projects (e.g., Day Job, Side Business)"
          action={{ label: "Create Context", onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contexts.map((ctx) => (
            <ContextCard
              key={ctx.id}
              context={ctx}
              projectCount={getProjectCount(ctx.id)}
              onEdit={() => {
                setEditingContext(ctx);
                setShowForm(true);
              }}
              onDelete={() => setDeletingContextId(ctx.id)}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingContext(undefined);
        }}
        title={editingContext ? "Edit Context" : "New Context"}
      >
        <ContextForm
          context={editingContext}
          existingCount={contexts.length}
          onComplete={() => {
            setShowForm(false);
            setEditingContext(undefined);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingContextId}
        onClose={() => setDeletingContextId(null)}
        onConfirm={handleDelete}
        title="Delete Context"
        message="Are you sure you want to delete this context? Projects within it will not be deleted but will become unlinked."
      />
    </div>
  );
}
