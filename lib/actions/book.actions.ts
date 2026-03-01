"use server";

import { IBook, CreateBook, TextSegment } from "@/types";

interface BookCheckResult {
  exists: boolean;
  book?: IBook;
}

interface CreateBookResult {
  success: boolean;
  data?: IBook;
  error?: string;
  alreadyExists?: boolean;
  isBillingError?: boolean;
}

interface SaveSegmentsResult {
  success: boolean;
  segmentsCount?: number;
  error?: string;
}

/**
 * Check if a book with the given title already exists
 */
export async function checkBookExists(title: string): Promise<BookCheckResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/books/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to check book existence");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error checking book existence:", error);
    return { exists: false };
  }
}

/**
 * Create a new book record in the database
 */
export async function createBook(
  bookData: CreateBook,
): Promise<CreateBookResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/books`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      },
    );

    if (!response.ok) {
      const error = await response.json();

      if (response.status === 402) {
        return {
          success: false,
          error: "Billing error - please check your subscription",
          isBillingError: true,
        };
      }

      if (error.alreadyExists) {
        return {
          success: false,
          alreadyExists: true,
          data: error.book,
          error: "Book already exists",
        };
      }

      throw new Error(error.error || "Failed to create book");
    }

    const data: IBook = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error creating book:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create book",
    };
  }
}

/**
 * Save parsed PDF segments to the database
 */
export async function saveBookSegments(
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
): Promise<SaveSegmentsResult> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/books/${bookId}/segments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId,
          segments,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to save segments");
    }

    const data = await response.json();
    return {
      success: true,
      segmentsCount: data.count || segments.length,
    };
  } catch (error) {
    console.error("Error saving segments:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save segments",
    };
  }
}
