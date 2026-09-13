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
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .finally(() => setLoading(false));
  }, []);

  async function handleNewChat() {
    const conv = await createConversation();
    setConversations((prev) => [conv, ...prev]);
    router.push(`/chat/${conv.id}`);
  }

  function handleDeleted(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="w-64 border-r h-screen flex flex-col p-3">
      <button
        onClick={handleNewChat}
        className="mb-3 bg-black text-white rounded py-2 text-sm"
      >
        + New chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-1">
        {loading && <p className="text-sm text-gray-400">Loading...</p>}
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            onDeleted={handleDeleted}
          />
        ))}
      </div>

      <div className="border-t pt-3 mt-3 text-sm">
        <p className="text-gray-500 truncate mb-2">{user?.email}</p>
        <button onClick={logout} className="text-red-500 hover:underline">
          Log out
        </button>
      </div>
    </div>
  );
}
