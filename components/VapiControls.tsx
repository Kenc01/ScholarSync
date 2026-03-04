"use client";

import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import { Mic, MicOff } from "lucide-react";
import Image from "next/image";
import Transcript from "./Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearError,
    //limitError,
    //isBillingError,
    //maxDurationSeconds,
  } = useVapi(book);
  return (
    <>
      <div className="vapi-header-card w-full">
        <div className="vapi-card-layout w-full">
          {/* Left: Book Cover & Mic Button */}
          <div className="vapi-cover-wrapper">
            <Image
              src={book.coverURL || "/assets/book-cover.svg"}
              alt={book.title}
              width={162}
              height={240}
              className="vapi-cover-image"
            />
            <div className="vapi-mic-wrapper">
              <button
                onClick={isActive ? stop : start}
                disabled={status === "connecting"}
                className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 ${isActive ? "vapi-mic-btn-active" : "vapi-mic-btn-inactive"}`}
              >
                <MicOff className="size-7 text-[#212a3b]" />
              </button>
            </div>
          </div>

          {/* Right: Book Details */}
          <div className="flex flex-col justify-center flex-1">
            <h1 className="book-title-lg">{book.title}</h1>
            <p className="subtitle mb-6">by {book.author}</p>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-3">
              <div className="vapi-status-indicator">
                <span className="vapi-status-dot vapi-status-dot-ready" />
                <span className="vapi-status-text">Ready</span>
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
          </div>
        </div>
      </div>

      <div className="vapi-transcript-wrapper">
        <Transcript
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>
    </>
  );
};

export default VapiControls;
