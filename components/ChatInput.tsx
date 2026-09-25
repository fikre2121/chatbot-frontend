"use client";

import { useRef, useState } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_LENGTH = 2000;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = text.trim();

    if (!message || disabled) return;

    onSend(message);
    setText("");

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends; Shift + Enter creates a new line
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (text.trim() && !disabled) {
        e.currentTarget.form?.requestSubmit();
      }
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;

    if (value.length > MAX_LENGTH) return;

    setText(value);

    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  }

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div
          className={`relative rounded-2xl border bg-white transition-all dark:bg-gray-900 ${
            disabled
              ? "border-gray-200 opacity-70 dark:border-gray-700"
              : "border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-gray-700"
          }`}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled ? "AI is thinking..." : "Message your AI assistant..."
            }
            disabled={disabled}
            rows={1}
            maxLength={MAX_LENGTH}
            aria-label="Chat message"
            className="block max-h-40 min-h-[52px] w-full resize-none overflow-y-auto rounded-2xl bg-transparent px-4 py-4 pr-16 text-sm text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed dark:text-gray-100 dark:placeholder:text-gray-500"
          />

          <button
            type="submit"
            disabled={!canSend}
            aria-label={disabled ? "Sending message" : "Send message"}
            title="Send message"
            className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
          >
            {disabled ? (
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
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-1 text-xs text-gray-400">
          <p>
            {disabled
              ? "Please wait while AI processes your message."
              : "Enter to send · Shift + Enter for new line"}
          </p>

          <span className={text.length >= MAX_LENGTH ? "text-red-500" : ""}>
            {text.length}/{MAX_LENGTH}
          </span>
        </div>
      </form>
    </div>
  );
}
