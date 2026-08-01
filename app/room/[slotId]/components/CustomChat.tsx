/**
 * PURPOSE:
 * Custom LiveKit chat component powered by the useChat() hook.
 * Provides real-time messaging over LiveKit's Data Channel, formatted timestamps,
 * sender identity badges, and clean #82301c theme styling.
 *
 * CONTEXT/PARENT FILE:
 * Rendered inside CustomLiveKitUI.tsx.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@livekit/components-react";

interface CustomChatProps {
  onClose?: () => void;
}

export default function CustomChat({ onClose }: CustomChatProps) {
  // The useChat hook manages the array of chat messages and the async send function
  const { chatMessages, send, isSending } = useChat();
  const [messageText, setMessageText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the latest message whenever new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      // Dispatch message payload across the active LiveKit Data Channel
      await send(messageText.trim());
      setMessageText("");
    } catch (err) {
      console.error("Failed to send live chat message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#141215]/95 backdrop-blur-xl border border-[#dfccc1]/30 rounded-2xl shadow-2xl overflow-hidden font-sans select-none">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-[#dfccc1]/20 bg-[#1a181b]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#f5e9e2]">
          <span>Room Chat</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#82301c] text-white border border-[#82301c]/40">
            {chatMessages.length}
          </span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer text-xs font-bold"
            title="Close Chat"
          >
            ✕
          </button>
        )}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-neutral-400">
            <p className="text-xs font-semibold text-[#f5e9e2]">No messages yet</p>
            <p className="text-[10px] text-neutral-400 mt-1 max-w-[200px] leading-relaxed">
              Send a message to start chatting with participants in the room.
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const senderName =
              msg.from?.name || msg.from?.identity || "System";
            const timeStr = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={msg.id || msg.timestamp} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2 px-1">
                  <span className="text-[11px] font-bold text-[#d97757] truncate">
                    {senderName}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-mono shrink-0">
                    {timeStr}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#1a181b] border border-[#dfccc1]/20 text-xs text-[#f8ede6] leading-relaxed break-words shadow-xs">
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#dfccc1]/20 bg-[#1a181b] flex gap-2">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-[#141215] text-white text-xs rounded-xl border border-[#dfccc1]/30 outline-none focus:border-[#82301c] transition placeholder:text-neutral-500"
        />
        <button
          type="submit"
          disabled={isSending || !messageText.trim()}
          className="px-4 py-2 bg-[#82301c] hover:bg-[#6c2716] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 shadow-md shadow-[#82301c]/30"
        >
          Send
        </button>
      </form>
    </div>
  );
}
