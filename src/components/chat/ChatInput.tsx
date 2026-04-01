"use client";

import { useState } from "react";

export function ChatInput({ onSendMessage }: { onSendMessage: (message: string) => void }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 p-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        type="submit"
        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 font-semibold"
      >
        Send
      </button>
    </form>
  );
}
