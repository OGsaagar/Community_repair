"use client";

export interface MessageBubbleProps {
  message: string;
  sender: "user" | "other";
  timestamp: string;
  senderName?: string;
}

export function MessageBubble({
  message,
  sender,
  timestamp,
  senderName,
}: MessageBubbleProps) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs rounded-lg px-4 py-2 ${
          isUser ? "bg-green-500 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        {senderName && !isUser && <p className="text-xs font-semibold mb-1">{senderName}</p>}
        <p className="text-sm">{message}</p>
        <p className={`text-xs mt-1 ${isUser ? "text-green-100" : "text-gray-500"}`}>
          {new Date(timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
