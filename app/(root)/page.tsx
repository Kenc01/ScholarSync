import React from "react";
import BookCard from "@/components/BookCard";
import { getAllBooks } from "@/lib/actions/book.actions";
import Search from "@/components/Search";
import Link from "next/link";
import { sampleBooks } from "@/lib/constants";
import HeroSection from "@/components/HeroSection";
import { getSession } from "@/lib/auth";
import {
  Sparkles,
  BookOpen,
  Mic,
  BrainCircuit,
  ShieldCheck,
  ArrowRight,
  Coffee,
  Cloud,
  Moon,
} from "lucide-react";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  const { query } = await searchParams;
  const session = await getSession();
  const userId = session?.userId;

  // Fetch personal books if signed in
  const bookResults = userId
    ? await getAllBooks(query, userId)
    : { success: true, data: [] };
  
  const dbBooks = bookResults.success ? (bookResults.data ?? []) : [];

  return (
    <div className="pt-[94px] bg-[#fdfcf6] min-h-screen">
      {/* ==========================================================
          SIGNED IN: THE MINIMAL HOME UI
          ========================================================== */}
      {session ? (
        <>
          <HeroSection />
          <main className="wrapper pb-20">
            <div className="library-books-grid min-h-[300px]">
              {dbBooks.length > 0 ? (
                dbBooks.slice(0, 3).map((book) => (
                  <BookCard
                    key={book._id}
                    id={book._id}
                    title={book.title}
                    author={book.author}
                    coverURL={book.coverURL}
                    slug={book.slug}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-black/5">
                  <p className="text-[#4a5d4e] mb-4 font-medium">
                    Your library is currently empty and peaceful.
                  </p>
                  <Link
                    href="/books/new"
                    className="text-[#663820] font-bold hover:underline"
                  >
                    Add your first book to begin.
                  </Link>
                </div>
              )}
            </div>

            {dbBooks.length > 3 && (
              <div className="mt-12 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#212a3b] text-white font-bold hover:bg-[#3d485e] transition-all shadow-md hover:shadow-lg"
                >
                  View Full Library ({dbBooks.length} Books)
                </Link>
              </div>
            )}
          </main>
        </>
      ) : (
        /* ==========================================================
            SIGNED OUT: THE CHILL LANDING PAGE
            ========================================================== */
        <div className="overflow-hidden">
          {/* Chill Hero */}
          <section className="relative px-6 pt-20 pb-32 text-center max-w-5xl mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
              <div className="absolute top-10 left-10 w-64 h-64 bg-green-200 blur-[100px] rounded-full" />
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-orange-100 blur-[100px] rounded-full" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/5 text-[#4a5d4e] text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
              <Cloud size={14} className="animate-bounce" /> Your peaceful study corner
            </div>
            
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-[#212a3b] mb-8 leading-[1.1] tracking-tight">
              Study at your <br />
              <span className="text-[#663820] italic">own pace.</span>
            </h1>
            
            <p className="text-xl text-[#3d485e]/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              ScholarSync turns your heavy textbooks into gentle, conversational partners. 
              No stress, just meaningful learning.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/sign-up">
                <button className="px-10 py-5 bg-[#212a3b] text-white rounded-full font-bold text-lg hover:bg-[#3d485e] transition-all shadow-xl hover:scale-105 active:scale-95">
                  Start for free
                </button>
              </Link>
              <Link href="/sign-in">
                <button className="px-10 py-5 bg-white text-[#212a3b] border border-black/10 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-sm">
                  Sign in
                </button>
              </Link>
            </div>
          </section>

          {/* Features - Soft Grid */}
          <section className="wrapper py-24 border-t border-black/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Coffee className="text-orange-600" />,
                  title: "Guided Focus",
                  desc: "Our AI helps you navigate through complex chapters without the overwhelm.",
                },
                {
                  icon: <Moon className="text-indigo-600" />,
                  title: "Night-Mode Ready",
                  desc: "A warm, eye-friendly design meant for those late-night deep-dives.",
                },
                {
                  icon: <Sparkles className="text-yellow-600" />,
                  title: "Instant Clarity",
                  desc: "Get summaries and answers rooted directly in your material, instantly.",
                },
              ].map((feature, i) => (
                <div key={i} className="group p-10 bg-white/40 hover:bg-white rounded-[3rem] border border-transparent hover:border-black/5 transition-all duration-500 shadow-soft-sm hover:shadow-soft-lg">
                  <div className="w-16 h-16 bg-[#fdfcf6] rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:rotate-6 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#212a3b] mb-4">{feature.title}</h3>
                  <p className="text-[#3d485e] leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Sample Showcase - Minimal */}
          <section className="wrapper mb-32">
            <div className="p-12 md:p-20 bg-[#4a5d4e]/5 rounded-[4rem] relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center gap-20">
                <div className="flex-1 text-left">
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#212a3b] mb-6 leading-tight">
                    Explore with <br />
                    pre-loaded classics.
                  </h2>
                  <p className="text-lg text-[#3d485e] mb-10">
                    See how ScholarSync works with some of the world's most influential texts before you upload your own.
                  </p>
                  <Link href="/sign-up" className="inline-flex items-center gap-3 text-[#663820] font-bold hover:gap-5 transition-all">
                    Create your shelf <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-6 scale-90 md:scale-100">
                    {sampleBooks.slice(0, 4).map((book) => (
                      <div key={book._id} className="opacity-80 hover:opacity-100 transition-opacity">
                        <BookCard
                          id={book._id}
                          title={book.title}
                          author={book.author}
                          coverURL={book.coverURL}
                          slug={book.slug}
                          isSample={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA - Very Chill */}
          <section className="wrapper py-32 text-center">
            <div className="bg-[#212a3b] text-white p-16 md:p-28 rounded-[5rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-7xl font-serif font-bold mb-10 leading-tight">
                  Ready for a <br />
                  <span className="italic opacity-80">quieter</span> study session?
                </h2>
                <Link href="/sign-up">
                  <button className="px-14 py-6 bg-[#fdfcf6] text-[#212a3b] rounded-full font-bold text-xl hover:scale-105 transition-all shadow-xl">
                    Join ScholarSync
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Page;
