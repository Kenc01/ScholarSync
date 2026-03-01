import React from "react";
import HeroSection from "@/components/HeroSection";
import { sampleBooks } from "@/lib/constants";
import BookCard from "@/components/BookCard";

const page = () => {
  return (
    <main className="pt-24 min-h-screen">
      <HeroSection />

      <div className="wrapper pb-20">
        <h2 className="section-title mb-8">Latest Books</h2>
        <div className="library-books-grid">
          {sampleBooks.map((book) => (
            <BookCard
              key={book._id}
              title={book.title}
              author={book.author}
              coverURL={book.coverURL}
              slug={book.slug}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default page;
