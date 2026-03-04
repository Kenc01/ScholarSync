import { useAuth } from "@clerk/nextjs";
import { IBook, Messages } from "../types";
import { useState, useRef, useEffect } from "react";
import { DEFAULT_VOICE } from "@/lib/constants";

export type CallStatus =
  | "idle"
  | "connecting"
  | "starting"
  | "listening"
  | "thinking"
  | "speaking";

export function useLatestRef<T>(value: T) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}

export const useVapi = (book: IBook) => {
  const { userId } = useAuth();
  //TODO: Implement limits

  const [status, setStatus] = useState<CallStatus>("idle");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [duration, setDuration] = useState(0);
  const [limitError, setLimitError] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isStoppingRef = useRef<boolean>(false);

  const bookRef = useLatestRef(book);
  // Keep refs in sync with latest values for use in callbacks
  //const maxDurationSeconds = limits?.maxDurationPerSession ? limits.maxDurationPerSession * 60 : (15 * 60);
  //const maxDurationRef = useLatestRef(maxDurationSeconds);
  const durationRef = useLatestRef(duration);
  const voice = book.persona || DEFAULT_VOICE;

  const isActive =
    status === "starting" ||
    status === "listening" ||
    status === "thinking" ||
    status === "speaking";

  //* limits:
  //const maxDurationRef = useLatestRef(limits:maxSessionMinutes * 60);
  //const maxDurationSeconds
  //const remainingSecond
  // const showTimeWarning

  const start = async () => {};
  const stop = async () => {};
  const clearError = async () => {};

  return {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    clearError,
    //maxDurationSeconds, remaininSeconds,showTimeWarning,
  };
};

export default useVapi;
