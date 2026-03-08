"use client";

import Link from "next/link";
import { BookCardProps } from "@/types";
import Image from "next/image";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteBook } from "@/lib/actions/book.actions";
import { toast } from "sonner";
import { useState } from "react";

const BookCard = ({ id, title, author, coverURL, slug }: BookCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setShowConfirm(false);
      const result = await deleteBook(id);

      if (result.success) {
        toast.success("Book deleted successfully");
      } else {
        toast.error(result.error || "Failed to delete book");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("An error occurred while deleting the book");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative group">
        <Link href={`/books/${slug}`}>
          <article className={`book-card ${isDeleting ? "opacity-50 grayscale" : ""}`}>
            <figure className="book-card-figure">
              <div className="book-card-cover-wrapper">
                <Image
                  src={coverURL}
                  alt={title}
                  width={133}
                  height={200}
                  className="book-card-cover"
                />
              </div>

              <figcaption className="book-card-meta">
                <h3 className="book-card-title">{title}</h3>
                <p className="book-card-author">{author}</p>
              </figcaption>
            </figure>
          </article>
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowConfirm(true);
          }}
          disabled={isDeleting}
          className="absolute top-2 right-2 p-2 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-md z-10 scale-90 hover:scale-100"
          title="Delete book"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Custom ScholarSync Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#f3e4c7] p-6 flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-full mb-4 shadow-sm text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#212a3b] font-serif">Remove Material?</h3>
              <p className="text-[#3d485e] text-sm mt-2 leading-relaxed">
                Are you sure you want to delete <span className="font-bold">"{title}"</span>? This action will remove all indexed segments and cannot be undone.
              </p>
            </div>
            
            <div className="p-4 flex flex-col gap-2">
              <button
                onClick={handleDelete}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-sm text-sm"
              >
                Yes, Delete Material
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-[#212a3b] font-bold rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;