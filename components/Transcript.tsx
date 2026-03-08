"use client";

import React, { useEffect, useRef } from "react";
import { Mic, MessageCircle } from "lucide-react";
import { Messages } from "@/types";

interface TranscriptProps {
  messages: Messages[];
  currentMessages: Messages[];
  currentAssistantMessage: string;
  currentUserMessage: string;
  isVoiceMode?: boolean;
}

const Transcript = ({
  messages,
  currentMessages,
  currentAssistantMessage,
  currentUserMessage,
  isVoiceMode = false,
}: TranscriptProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentAssistantMessage, currentUserMessage]);

  const isEmpty =
    messages.length === 0 && !currentAssistantMessage && !currentUserMessage;

  return (
    <div className="transcript-container min-h-[400px]">
      {isEmpty ? (
        <div className="transcript-empty">
          {isVoiceMode ? (
            <>
              <Mic className="size-12 text-[#663820] mx-auto mb-4" />
              <p className="transcript-empty-text">
                <strong>No conversation yet</strong>
              </p>
              <p className="transcript-empty-hint">
                Click the mic button to start chatting with the AI
              </p>
            </>
          ) : (
            <>
              <MessageCircle className="size-12 text-[#663820] mx-auto mb-4" />
              <p className="transcript-empty-text">
                <strong>Start chatting</strong>
              </p>
              <p className="transcript-empty-hint">
                Type a message below and press Enter or click Send to start
                talking with the AI assistant about this book
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="transcript-messages">
          {/* Render existing messages */}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`transcript-message ${
                msg.role === "user"
                  ? "transcript-message-user"
                  : "transcript-message-assistant"
              }`}
            >
              <div
                className={`transcript-bubble ${
                  msg.role === "user"
                    ? "transcript-bubble-user"
                    : "transcript-bubble-assistant"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Render streaming user message */}
          {currentUserMessage && (
            <div className="transcript-message transcript-message-user">
              <div className="transcript-bubble transcript-bubble-user">
                {currentUserMessage}
                <span className="transcript-cursor">|</span>
              </div>
            </div>
          )}

          {/* Render streaming assistant message */}
          {currentAssistantMessage && (
            <div className="transcript-message transcript-message-assistant">
              <div className="transcript-bubble transcript-bubble-assistant">
                {currentAssistantMessage}
                <span className="transcript-cursor">|</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default Transcript;
