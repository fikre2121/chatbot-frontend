"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Message } from "@/lib/types";
import { getMessages, getAccessToken } from "@/lib/api";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChatConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMessages(conversationId)
      .then(setMessages)
      .finally(() => setLoading(false));
  }, [conversationId]);

  const handleSend = useCallback(
    async (text: string) => {
      // Optimistically show the user's message immediately
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setStreaming(true);

      // Placeholder assistant message we'll fill in as tokens arrive
      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          created_at: new Date().toISOString(),
        },
      ]);

      const token = getAccessToken();
      const res = await fetch(`${API_URL}/chat/stream`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: text,
        }),
      });

      if (!res.body) {
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // keep incomplete chunk for next read

        for (const line of lines) {
          if (line.startsWith("event: done")) {
            setStreaming(false);
            continue;
          }
          if (line.startsWith("event: error")) {
            setStreaming(false);
            continue;
          }
          if (line.startsWith("data: ")) {
            const delta = line.slice(6);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + delta } : m,
              ),
            );
          }
        }
      }

      setStreaming(false);
    },
    [conversationId],
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} disabled={streaming} />
    </div>
  );
}
