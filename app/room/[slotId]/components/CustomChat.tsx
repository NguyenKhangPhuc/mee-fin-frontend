/**
 * PURPOSE:
 * Custom LiveKit chat component powered by the useChat() hook.
 * Features:
 * - Scrolls to the bottom ONLY ONCE when the chat window opens.
 * - Aligns local user messages on the RIGHT (#82301c terracotta bubble) and remote messages on the LEFT.
 * - Loads chat history from localStorage on initial render (useState initialValue) and persists new messages per slotId.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat, useLocalParticipant } from "@livekit/components-react";
import { useNotification } from "@/app/context/NotificationContext";

export interface SavedChatMessage {
  id: string;
  senderName: string;
  senderIdentity: string;
  isLocal: boolean;
  message: string;
  timestamp: number;
}

interface CustomChatProps {
  slotId?: string;
  onClose?: () => void;
}

export default function CustomChat({ slotId, onClose }: CustomChatProps) {
  const { chatMessages, send, isSending } = useChat();
  const { localParticipant } = useLocalParticipant();

  const [messageText, setMessageText] = useState<string>("");
  const { showNotification } = useNotification()
  // Lazy initialValue for useState: load chat history from localStorage once on reload
  const [savedMessages, setSavedMessages] = useState<SavedChatMessage[]>(() => {
    if (typeof window === "undefined" || !slotId) return [];
    try {
      const saved = localStorage.getItem(`meefins_chat_${slotId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      showNotification("Failed to load chat history");
      return [];
    }
  });

  // Merge live chatMessages into savedMessages and persist to localStorage
  useEffect(() => {
    if (!chatMessages || chatMessages.length === 0) return;

    const newItems: SavedChatMessage[] = chatMessages.map((msg) => {
      const isLocal =
        msg.from?.isLocal ||
        (Boolean(localParticipant?.identity) &&
          msg.from?.identity === localParticipant?.identity);

      return {
        id: msg.id || String(msg.timestamp),
        senderName: msg.from?.name || msg.from?.identity || (isLocal ? "You" : "Participant"),
        senderIdentity: msg.from?.identity || "",
        isLocal: Boolean(isLocal),
        message: msg.message,
        timestamp: msg.timestamp,
      };
    });

    setSavedMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const merged = [...prev];
      let updated = false;

      newItems.forEach((item) => {
        if (!existingIds.has(item.id)) {
          merged.push(item);
          existingIds.add(item.id);
          updated = true;
        }
      });

      if (updated && slotId && typeof window !== "undefined") {
        try {
          localStorage.setItem(`meefins_chat_${slotId}`, JSON.stringify(merged));
        } catch (err) {
          showNotification("Failed to save chat history");
        }
      }

      return updated ? merged : prev;
    });
  }, [chatMessages, localParticipant, slotId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await send(messageText.trim());
      setMessageText("");
    } catch (err) {
      showNotification("Failed to send live chat message");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#141215]/95 backdrop-blur-xl border border-[#dfccc1]/30 rounded-2xl shadow-2xl overflow-hidden font-sans select-none">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-[#dfccc1]/20 bg-[#1a181b]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#f5e9e2]">
          <span>Room Chat</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#82301c] text-white border border-[#82301c]/40">
            {savedMessages.length}
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
        {savedMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-neutral-400">
            <p className="text-xs font-semibold text-[#f5e9e2]">No messages yet</p>
            <p className="text-[10px] text-neutral-400 mt-1 max-w-[200px] leading-relaxed">
              Send a message to start chatting with participants in the room.
            </p>
          </div>
        ) : (
          savedMessages.map((msg) => {
            const isLocal = msg.isLocal;
            const timeStr = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 w-full ${isLocal ? "items-end" : "items-start"
                  }`}
              >
                {/* Sender Header */}
                <div
                  className={`flex items-center gap-2 px-1 max-w-[85%] ${isLocal ? "flex-row-reverse text-right" : "flex-row text-left"
                    }`}
                >
                  <span className="text-[11px] font-bold text-[#d97757] truncate">
                    {msg.senderName} {isLocal ? "(You)" : ""}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-mono shrink-0">
                    {timeStr}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-2.5 max-w-[85%] text-xs leading-relaxed break-words shadow-xs ${isLocal
                    ? "bg-[#82301c] text-white rounded-2xl rounded-tr-xs border border-[#82301c]/80"
                    : "bg-[#1a181b] text-[#f8ede6] rounded-2xl rounded-tl-xs border border-[#dfccc1]/20"
                    }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
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
          className="px-4 py-2 bg-[#82301c] hover:bg-[#6c2716] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0 shadow-[#82301c]/30"
        >
          Send
        </button>
      </form>
    </div>
  );
}
