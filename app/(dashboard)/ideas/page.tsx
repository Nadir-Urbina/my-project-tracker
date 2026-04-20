"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuPlus, LuLightbulb } from "react-icons/lu";
import { useAuth } from "@/contexts/AuthContext";
import { useIdeas } from "@/hooks/useFirestore";
import { deleteIdea, convertIdeaToContext, createIdea } from "@/services/firestore";
import { Idea } from "@/types/models";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import IdeaCard from "@/components/ideas/IdeaCard";
import IdeaForm from "@/components/ideas/IdeaForm";
import ConvertIdeaDialog from "@/components/ideas/ConvertIdeaDialog";

export default function IdeasPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: ideas, loading } = useIdeas();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | undefined>();
  const [deletingIdeaId, setDeletingIdeaId] = useState<string | null>(null);
  const [convertingToContextIdea, setConvertingToContextIdea] = useState<Idea | null>(null);
  const [convertingToProjectIdea, setConvertingToProjectIdea] = useState<Idea | null>(null);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickLoading, setQuickLoading] = useState(false);
  const quickInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading) quickInputRef.current?.focus();
  }, [loading]);

  const handleQuickAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!user || !quickTitle.trim() || quickLoading) return;
    setQuickLoading(true);
    try {
      await createIdea(user.uid, { title: quickTitle.trim(), description: "", status: "active" });
      setQuickTitle("");
      quickInputRef.current?.focus();
    } catch {
      toast("Failed to add idea");
    } finally {
      setQuickLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !deletingIdeaId) return;
    await deleteIdea(user.uid, deletingIdeaId);
    setDeletingIdeaId(null);
    toast("Idea deleted");
  };

  const handleConvertToContext = async () => {
    if (!user || !convertingToContextIdea) return;
    try {
      await convertIdeaToContext(user.uid, convertingToContextIdea);
      setConvertingToContextIdea(null);
      toast("Idea converted to context");
      router.push("/contexts");
    } catch (error) {
      console.error("Error converting idea:", error);
      toast("Failed to convert idea");
    }
  };

  const handleConvertToProject = (contextId: string, _projectId: string) => {
    setConvertingToProjectIdea(null);
    toast("Idea converted to project");
    router.push(`/contexts/${contextId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LuLightbulb className="h-6 w-6 text-amber-500" />
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Ideas
          </h1>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <LuPlus className="h-4 w-4" />
          New Idea
        </Button>
      </div>

      <form
        onSubmit={handleQuickAdd}
        className="mb-6 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3.5 dark:border-blue-900 dark:bg-blue-950/40"
      >
        <LuPlus className="h-5 w-5 shrink-0 text-blue-400 dark:text-blue-500" />
        <input
          ref={quickInputRef}
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Capture an idea..."
          className="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
          disabled={quickLoading}
        />
      </form>

      {ideas.length === 0 ? (
        <EmptyState
          title="No ideas yet"
          description="Capture your ideas here before organizing them into contexts or projects"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onEdit={() => {
                setEditingIdea(idea);
                setShowForm(true);
              }}
              onDelete={() => setDeletingIdeaId(idea.id)}
              onConvertToContext={() => setConvertingToContextIdea(idea)}
              onConvertToProject={() => setConvertingToProjectIdea(idea)}
            />
          ))}
        </div>
      )}

      <Modal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingIdea(undefined);
        }}
        title={editingIdea ? "Edit Idea" : "New Idea"}
      >
        <IdeaForm
          idea={editingIdea}
          onComplete={() => {
            setShowForm(false);
            setEditingIdea(undefined);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingIdeaId}
        onClose={() => setDeletingIdeaId(null)}
        onConfirm={handleDelete}
        title="Delete Idea"
        message="Are you sure you want to delete this idea? This action cannot be undone."
      />

      <ConfirmDialog
        open={!!convertingToContextIdea}
        onClose={() => setConvertingToContextIdea(null)}
        onConfirm={handleConvertToContext}
        title="Convert to Context"
        message={`Convert "${convertingToContextIdea?.title}" into a new context?`}
      />

      <Modal
        open={!!convertingToProjectIdea}
        onClose={() => setConvertingToProjectIdea(null)}
        title="Convert to Project"
      >
        {convertingToProjectIdea && (
          <ConvertIdeaDialog
            idea={convertingToProjectIdea}
            onComplete={handleConvertToProject}
            onCancel={() => setConvertingToProjectIdea(null)}
          />
        )}
      </Modal>
    </div>
  );
}
