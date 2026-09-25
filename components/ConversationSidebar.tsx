"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Conversation } from "@/lib/types";
import { getConversations, createConversation } from "@/lib/api";
import ConversationItem from "./ConversationItem";
import { useAuth } from "@/context/AuthContext";

export default function ConversationSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function loadConversations() {
      try {
        setLoading(true);
        setError(null);

        const data = await getConversations();

        if (!cancelled) {
          setConversations(data);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);

        if (!cancelled) {
          setError("Unable to load conversations. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadConversations();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleNewChat() {
    if (creating) return;

    try {
      setCreating(true);
      setError(null);

      const conv = await createConversation();

      setConversations((prev) => [conv, ...prev]);

      router.push(`/chat/${conv.id}`);
    } catch (err) {
      console.error("Failed to create conversation:", err);

      setError("Unable to create a new chat. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function handleDeleted(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <aside className="flex h-full w-72 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3 9 9l-6 3 6 3 3 6 3-6 6-3-6-3-3-6Z" />
            </svg>
          </div>

          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            AI Chatbot
          </h2>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-4">
        <button
          type="button"
          onClick={handleNewChat}
          disabled={creating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-gray-950"
        >
          {creating ? (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="3"
                strokeOpacity="0.3"
              />
              <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          )}

          {creating ? "Creating..." : "New chat"}
        </button>
      </div>

      {/* Section Title */}
      <div className="px-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Your conversations
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mx-3 mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {/* Conversation List */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <div className="space-y-2 px-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-11 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
              </svg>
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              No conversations yet
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Start a new chat to begin.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}
      </div>

      {/* User Footer */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-800">
        <div className="mb-3 flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {user?.email?.charAt(0).toUpperCase() ?? "U"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
              {user?.email ?? "User"}
            </p>

            <p className="text-xs text-gray-400">Account</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-200 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
