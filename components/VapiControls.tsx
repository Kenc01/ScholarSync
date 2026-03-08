"use client";

import { useState } from "react";
import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import { Mic, MicOff, Send, MessageCircle, Volume2 } from "lucide-react";
import Image from "next/image";
import Transcript from "./Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const [textMessage, setTextMessage] = useState("");
  const [useVoice, setUseVoice] = useState(false); // Start with text-only mode
  const {
    status,
    isActive,
    messages,
    currentAssistantMessage,
    currentUserMessage,
    currentMessages,
    duration,
    start,
    stop,
    sendMessage,
    clearError,
    //limitError,
    //isBillingError,
    //maxDurationSeconds,
  } = useVapi(book);

  const handleSendMessage = async () => {
    if (!textMessage.trim()) return;

    // In text-only mode, auto-start the conversation if not active
    if (!useVoice && !isActive) {
      try {
        // Start the conversation first
        await start();
        // Message will be sent after a small delay to ensure connection
        setTimeout(() => {
          sendMessage(textMessage);
          setTextMessage("");
        }, 100);
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
      return;
    }

    // Normal send if already active
    if (isActive) {
      sendMessage(textMessage);
      setTextMessage("");
    }
  };

  const handleVoiceStart = () => {
    if (!useVoice) {
      // In text-only mode, just focus on the input field instead
      const inputField = document.querySelector(
        'input[placeholder*="Type a message"]',
      ) as HTMLInputElement;
      inputField?.focus();
      return;
    }
    // Start voice session only if voice mode is enabled
    start();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <>
      <div className="vapi-header-card w-full">
        <div className="vapi-card-layout w-full">
          {/* Left: Book Cover & Mic Button (Only show if voice mode enabled) */}
          <div className="vapi-cover-wrapper">
            <Image
              src={book.coverURL || "/assets/book-cover.svg"}
              alt={book.title}
              width={162}
              height={240}
              className="vapi-cover-image"
            />
            {useVoice && (
              <div className="vapi-mic-wrapper">
                <button
                  onClick={isActive ? stop : handleVoiceStart}
                  disabled={status === "connecting"}
                  className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 ${isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"}`}
                >
                  {isActive ? (
                    <MicOff className="size-7 text-[#212a3b]" />
                  ) : (
                    <Mic className="size-7 text-[#212a3b]" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right: Book Details */}
          <div className="flex flex-col justify-center flex-1">
            <h1 className="book-title-lg">{book.title}</h1>
            <p className="subtitle mb-6">by {book.author}</p>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-3">
              <div className="vapi-status-indicator">
                <span className="vapi-status-dot vapi-status-dot-ready" />
                <span className="vapi-status-text">
                  {useVoice ? "Voice Mode" : "Text Mode"}
                </span>
              </div>

              <div className="vapi-badge-ai">
                <span className="vapi-badge-ai-text">
                  Voice: {book.persona || "Default"}
                </span>
              </div>

              <div className="vapi-badge-ai">
                <span className="vapi-badge-ai-text">0:00/15:00</span>
              </div>
            </div>

            {/* Mode Toggle Button */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setUseVoice(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  !useVoice
                    ? "bg-[#212a3b] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <MessageCircle size={18} />
                Text Mode
              </button>
              <button
                onClick={() => setUseVoice(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  useVoice
                    ? "bg-[#212a3b] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Volume2 size={18} />
                Voice Mode
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="vapi-transcript-wrapper">
        <Transcript
          messages={messages}
          currentMessages={currentMessages}
          currentAssistantMessage={currentAssistantMessage}
          currentUserMessage={currentUserMessage}
          isVoiceMode={useVoice}
        />
      </div>

      {/* Text Message Input - Always visible */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            useVoice
              ? "Or type a message instead..."
              : "Type a message to chat..."
          }
          disabled={useVoice && !isActive}
          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#212a3b]"
        />
        <button
          onClick={handleSendMessage}
          disabled={(useVoice && !isActive) || !textMessage.trim()}
          className="px-6 py-3 bg-[#212a3b] text-white rounded-lg hover:bg-[#3d485e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Send size={18} />
          Send
        </button>
      </div>
    </>
  );
};

export default VapiControls;
