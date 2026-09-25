"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Conversation } from "@/lib/types";
import { deleteConversation } from "@/lib/api";
import { useState } from "react";

interface Props {
  conversation: Conversation;
  onDeleted: (id: string) => void;
}

export default function ConversationItem({ conversation, onDeleted }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const isActive = pathname === `/chat/${conversation.id}`;

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await deleteConversation(conversation.id);

      onDeleted(conversation.id);

      if (isActive) {
        router.replace("/chat");
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);

      window.alert("Failed to delete conversation. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div
      className={`group relative flex items-center rounded-xl transition-colors ${
        isActive
          ? "bg-gray-200 dark:bg-gray-800"
          : "hover:bg-gray-100 dark:hover:bg-gray-900"
      }`}
    >
      <Link
        href={`/chat/${conversation.id}`}
        className="min-w-0 flex-1 rounded-xl px-3 py-3 pr-10 text-sm text-gray-700 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-200"
        aria-current={isActive ? "page" : undefined}
      >
        <span className="block truncate">{conversation.title}</span>
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={`Delete conversation: ${conversation.title}`}
        title="Delete conversation"
        className={`absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-red-100 hover:text-red-600 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950 dark:hover:text-red-400 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {isDeleting ? (
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
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v5" />
            <path d="M14 11v5" />
          </svg>
        )}
      </button>
    </div>
  );
}
