"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Conversation } from "@/lib/types";
import { deleteConversation } from "@/lib/api";

interface Props {
  conversation: Conversation;
  onDeleted: (id: string) => void;
}

export default function ConversationItem({ conversation, onDeleted }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === `/chat/${conversation.id}`;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate when clicking delete
    e.stopPropagation();
    if (!confirm("Delete this conversation?")) return;
    await deleteConversation(conversation.id);
    onDeleted(conversation.id);
    if (isActive) router.push("/chat");
  }

  return (
    <Link
      href={`/chat/${conversation.id}`}
      className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer group ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
    >
      <span className="truncate text-sm">{conversation.title}</span>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs ml-2"
      >
        ✕
      </button>
    </Link>
  );
}
