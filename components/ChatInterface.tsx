"use client";

import { useState, useRef, useEffect } from "react";
import { IBook, Messages } from "@/types";
import { 
  Send, 
  BookOpen, 
  GraduationCap, 
  Lightbulb, 
  HelpCircle, 
  Loader2, 
  User, 
  Trash2, 
  ChevronLeft,
  Sparkles,
  Search
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { chatWithBook } from "@/lib/actions/chat.actions";
import { toast } from "sonner";

const ChatInterface = ({ book }: { book: IBook }) => {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMsg: Messages = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatWithBook(book._id, book.title, messageText, messages);
      
      if (result.success && result.data) {
        setMessages((prev) => [...prev, { role: "assistant", content: result.data as string }]);
      } else {
        toast.error(result.error || "Failed to get a response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("An error occurred with the AI connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    if (messages.length === 0) return;
    if (confirm("Clear all messages in this session?")) {
      setMessages([]);
    }
  };

  const quickPrompts = [
    { label: "Summarize", icon: <BookOpen size={16} />, text: "Can you summarize the main points of this material?" },
    { label: "Study Guide", icon: <GraduationCap size={16} />, text: "Create a study guide for the most important concepts in this book." },
    { label: "Quiz Me", icon: <HelpCircle size={16} />, text: "Give me 5 practice questions to test my knowledge of this material." },
    { label: "Explain", icon: <Lightbulb size={16} />, text: "Explain the most complex part of this book in simple terms." },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-soft-lg overflow-hidden border border-black/5">
      
      {/* Top Header / Navigation */}
      <div className="bg-[#f3e4c7] px-4 py-3 flex items-center justify-between border-b border-black/10">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-[#212a3b]" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-8 relative shadow-md rounded overflow-hidden hidden sm:block">
              <Image
                src={book.coverURL || "/assets/book-cover.svg"}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#212a3b] line-clamp-1">{book.title}</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#663820]">
                  <Sparkles size={10} /> Student Assistant
                </span>
                <span className="h-1 w-1 bg-black/20 rounded-full" />
                <span className="text-[10px] text-gray-500 font-medium">
                  {book.totalSegments} Segments
                </span>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
          title="Clear session"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa] p-4 sm:p-6 space-y-8 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="bg-[#663820] p-5 rounded-3xl mb-6 shadow-lg rotate-3">
              <GraduationCap size={40} className="text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#212a3b] mb-4">
              Hello, Student! I'm your AI Learning Partner.
            </h1>
            <p className="text-[#3d485e] text-lg mb-10 leading-relaxed">
              I've analyzed <span className="font-bold text-[#663820]">"{book.title}"</span> and I'm ready to help you study. Try one of these to get started:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="flex items-center gap-4 p-4 text-left bg-white hover:border-[#663820] hover:bg-[#fff9f0] transition-all rounded-xl border border-black/5 shadow-sm group"
                >
                  <div className="bg-[#f3e4c7] p-2.5 rounded-lg text-[#663820] group-hover:scale-110 transition-transform">
                    {prompt.icon}
                  </div>
                  <span className="font-bold text-[#212a3b] text-sm">{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto w-full">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === "user" ? "bg-[#212a3b] text-white" : "bg-[#663820] text-white"
                }`}>
                  {msg.role === "user" ? <User size={20} /> : <Sparkles size={20} />}
                </div>

                {/* Message Bubble */}
                <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-sm leading-relaxed text-sm sm:text-base ${
                    msg.role === "user" 
                      ? "bg-[#212a3b] text-white rounded-tr-none" 
                      : "bg-white text-[#212a3b] border border-black/5 rounded-tl-none"
                  }`}>
                    <div className="whitespace-pre-wrap prose prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-[#663820]">
                      {msg.content}
                    </div>
                  </div>
                  <span className="text-[10px] mt-1.5 text-gray-400 font-medium px-1">
                    {msg.role === "user" ? "You" : "Student Assistant"}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Thinking Indicator */}
            {isLoading && (
              <div className="flex gap-4 animate-in fade-in duration-300">
                <div className="h-10 w-10 rounded-full bg-[#663820] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Loader2 size={20} className="animate-spin" />
                </div>
                <div className="bg-white border border-black/5 px-6 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#663820]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#663820]/60 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#663820]/80 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
                  <span className="text-xs font-bold text-[#663820] tracking-wider uppercase italic">Searching pages...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 sm:p-6 border-t border-black/5">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#663820] transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about this material..."
            className="w-full pl-12 pr-16 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-[#212a3b] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#663820] focus:bg-white focus:border-transparent transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-[#663820] text-white rounded-xl hover:bg-[#7a4528] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-md"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="max-w-4xl mx-auto mt-3 flex items-center justify-center gap-4 text-[10px] text-gray-400 font-medium">
          <span className="flex items-center gap-1"><BookOpen size={10} /> Context-Aware RAG</span>
          <span className="h-1 w-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-1"><Sparkles size={10} /> Powered by Llama 3.3</span>
          <span className="h-1 w-1 bg-gray-300 rounded-full" />
          <span>Educational Assistant</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;