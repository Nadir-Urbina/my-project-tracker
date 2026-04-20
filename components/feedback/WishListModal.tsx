"use client";

import { useState } from "react";
import { LuStar, LuX } from "react-icons/lu";

interface WishListModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WishListModal({ open, onClose }: WishListModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [wishlist, setWishlist] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setRating(0);
    setHovered(0);
    setFeedback("");
    setWishlist("");
    setSent(false);
    onClose();
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!rating || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback, wishlist, rating }),
      });
      if (!res.ok) throw new Error("Failed");
      setSent(true);
      setTimeout(handleClose, 2500);
    } catch {
      // silent — keep form open so user can retry
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Wish List
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Share feedback or request a feature
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <LuX className="h-4 w-4" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-14">
            <div className="text-4xl">🎉</div>
            <p className="text-center text-sm font-medium text-zinc-800 dark:text-zinc-100">
              Thanks for your feedback!
            </p>
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
              It helps make FolioGTD better for everyone.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
            {/* Star rating */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                How are you finding FolioGTD?
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <LuStar
                      className={`h-7 w-7 transition-colors ${
                        star <= (hovered || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-300 dark:text-zinc-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* General feedback */}
            <div>
              <label
                htmlFor="feedback"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                General feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                placeholder="What's working well? What's not?"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>

            {/* Wish list */}
            <div>
              <label
                htmlFor="wishlist"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Wish list
              </label>
              <textarea
                id="wishlist"
                value={wishlist}
                onChange={(e) => setWishlist(e.target.value)}
                rows={3}
                placeholder="What features or improvements would you love to see?"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!rating || loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
