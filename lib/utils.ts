import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TextSegment } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parse a PDF file and extract text content
 * For production, integrate with pdfjs-dist or similar library
 */
export async function parsePDFFile(file: File): Promise<{
  content: TextSegment[];
  cover: string;
}> {
  try {
    // Mock implementation - returns sample content structure
    // In production, use pdfjs-dist or pdf-parse library

    const mockContent: TextSegment[] = [
      {
        text: "Sample extracted text from PDF. Replace with actual PDF parsing library.",
        segmentIndex: 0,
        pageNumber: 1,
        wordCount: 12,
      },
    ];

    // Generate a placeholder cover image
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "#f3e4c7";
      ctx.fillRect(0, 0, 200, 300);
      ctx.fillStyle = "#212a3b";
      ctx.font = "16px serif";
      ctx.textAlign = "center";
      ctx.fillText("PDF Cover", 100, 150);
    }

    const coverUrl = canvas.toDataURL("image/png");

    return {
      content: mockContent,
      cover: coverUrl,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF file");
  }
}
