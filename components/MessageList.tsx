"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/lib/types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: Message[];
  isLoading?: boolean;
}

export default function MessageList({ messages, isLoading = false }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      150;

    // Always scroll on initial messages or if the user
    // is already near the bottom of the conversation.
    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    }
  }, [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className="min-h-0 flex-1 overflow-y-auto scroll-smooth"
      role="log"
      aria-label="Conversation messages"
      aria-live="polite"
    >
      <div className="mx-auto w-full max-w-4xl">
        {messages.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <svg
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3 9 9l-6 3 6 3 3 6 3-6 6-3-6-3-3-6Z" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              How can I help you today?
            </h2>

            <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Ask a question, explore an idea, or start a conversation with your
              AI assistant.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        )}

        {/* AI Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 px-4 py-5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
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
                <path d="M12 3 9 9l-6 3 6 3 3 6 3-6 6-3-6-3-3-6Z" />
              </svg>
            </div>

            <div
              className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-4 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700"
              role="status"
              aria-label="AI is thinking"
            >
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
            </div>
          </div>
        )}

        {/* Scroll Anchor */}
        <div ref={bottomRef} className="h-px" aria-hidden="true" />
      </div>
    </div>
  );
}
