"use client";

import { useState } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 border rounded px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={disabled}
        className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
