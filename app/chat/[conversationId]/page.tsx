"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Message } from "@/lib/types";
import { getMessages, getAccessToken } from "@/lib/api";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ChatConversationPage() {
  const { conversationId } = useParams<{
    conversationId: string;
  }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load existing messages
  useEffect(() => {
    setLoading(true);

    getMessages(conversationId)
      .then(setMessages)
      .catch((error) => {
        console.error("Failed to load messages:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [conversationId]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;

      // 1. Show user's message immediately
      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);

      // 2. Create empty assistant message
      const assistantId = crypto.randomUUID();

      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      setStreaming(true);

      try {
        const token = getAccessToken();

        // 3. Connect to streaming endpoint
        const res = await fetch(`${API_URL}/chat/stream`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            message: text,
          }),
        });

        // 4. Check response
        if (!res.ok) {
          const errorText = await res.text();

          throw new Error(`Chat request failed: ${res.status} ${errorText}`);
        }

        if (!res.body) {
          throw new Error("No response body received.");
        }

        // 5. Read stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Add incoming data to buffer
          buffer += decoder.decode(value, {
            stream: true,
          });

          // SSE events are separated by blank lines
          const events = buffer.split(/\r?\n\r?\n/);

          // Keep incomplete event
          buffer = events.pop() || "";

          // Process complete events
          for (const event of events) {
            const lines = event.split(/\r?\n/);

            let eventType = "message";
            let data = "";

            for (const line of lines) {
              if (line.startsWith("event:")) {
                eventType = line.slice(6).trim();
              }

              if (line.startsWith("data:")) {
                const value = line.slice(5);

                // Remove only the optional single space after "data:"
                data += value.startsWith(" ") ? value.slice(1) : value;

                // Preserve newline between multiple data lines
                data += "\n";
              }
            }

            // Remove the extra newline we added
            data = data.replace(/\n$/, "");

            // Server says streaming is finished
            if (eventType === "done") {
              continue;
            }

            // Server returned an error
            if (eventType === "error") {
              console.error("Server error:", data);

              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantId
                    ? {
                        ...message,
                        content:
                          data ||
                          "An error occurred while generating the response.",
                      }
                    : message,
                ),
              );

              continue;
            }

            // Normal streamed content
            if (data) {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantId
                    ? {
                        ...message,
                        content: message.content + data,
                      }
                    : message,
                ),
              );
            }
          }
        }

        // Flush decoder
        buffer += decoder.decode();

        // Process final buffered event
        if (buffer.trim()) {
          const lines = buffer.split(/\r?\n/);

          let data = "";

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const value = line.slice(5);

              data += value.startsWith(" ") ? value.slice(1) : value;

              data += "\n";
            }
          }

          data = data.replace(/\n$/, "");

          if (data) {
            setMessages((prev) =>
              prev.map((message) =>
                message.id === assistantId
                  ? {
                      ...message,
                      content: message.content + data,
                    }
                  : message,
              ),
            );
          }
        }
      } catch (error) {
        console.error("Streaming error:", error);

        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content:
                    "Sorry, something went wrong while generating the response.",
                }
              : message,
          ),
        );
      } finally {
        setStreaming(false);
      }
    },
    [conversationId, streaming],
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <MessageList messages={messages} />

      <ChatInput onSend={handleSend} disabled={streaming} />
    </div>
  );
}
