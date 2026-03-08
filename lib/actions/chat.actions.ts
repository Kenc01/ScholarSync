"use server";

import { searchBookSegments } from "./book.actions";
import { Messages } from "@/types";
import Groq from "groq-sdk";

const getGroq = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is missing in .env");
  return new Groq({ apiKey });
};

export const chatWithBook = async (
  bookId: string,
  bookTitle: string,
  userMessage: string,
  history: Messages[] = [],
) => {
  try {
    const groq = getGroq();
    
    // 1. Search context from your book segments
    const searchResults = await searchBookSegments(bookId, userMessage, 6);
    const context = searchResults.success && searchResults.data
      ? searchResults.data.map((s: any) => `[Page ${s.pageNumber || '?'}] ${s.content}`).join("\n\n")
      : "";

    // 2. Prepare the Student Assistant instructions
    const systemPrompt = `You are a specialized Student Learning Assistant for the material: "${bookTitle}".

INSTRUCTIONS:
- Use the provided context from the book to answer the student's questions.
- If the answer isn't in the context, say so, but provide general academic guidance.
- Break down complex topics into simple terms.
- Use Markdown (bold, lists) for better readability.
- Be encouraging and clear.

CONTEXT FROM THE BOOK:
${context || "No specific segments found for this query."}`;

    // 3. Build the conversation history
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-6).map(msg => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    // 4. Call Groq with Llama 3.3 70B (Currently recommended versatile model)
    const completion = await groq.chat.completions.create({
      messages: chatMessages as any,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });
    
    const responseText = completion.choices[0]?.message?.content || "";

    return {
      success: true,
      data: responseText,
    };
  } catch (error) {
    console.error("Groq Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get response from Groq",
    };
  }
};
