import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="wrapper mb-10 md:mb-16">
      <div className="library-hero-card min-h-[400px]">
        <div className="library-hero-content">
          {/* Left Part */}
          <div className="library-hero-text">
            <div className="relative">
              {/* Small graphic above title */}
              <div className="absolute -top-8 left-20 opacity-40">
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 0V34M0 17H34"
                    stroke="#212a3b"
                    strokeWidth="0.5"
                  />
                  <text
                    x="19"
                    y="12"
                    fill="#212a3b"
                    fontSize="6"
                    className="font-sans"
                  >
                    540
                  </text>
                  <text
                    x="19"
                    y="18"
                    fill="#212a3b"
                    fontSize="6"
                    className="font-sans"
                  >
                    270
                  </text>
                </svg>
              </div>
              <h1 className="library-hero-title">Your Library</h1>
            </div>
            <p className="library-hero-description">
              Convert your books into interactive AI conversations.
              <br />
              Listen, learn, and discuss your favorite reads.
            </p>
            <Link href="/books/new" className="library-cta-primary mt-4">
              <span className="text-2xl font-light">+</span>
              <span>Add new book</span>
            </Link>
          </div>

          {/* Center Part - Desktop */}
          <div className="library-hero-illustration-desktop relative z-10">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books and a globe"
              width={500}
              height={500}
              className="object-contain"
              priority
            />
          </div>

          {/* Center Part - Mobile (Hidden on Desktop) */}
          <div className="library-hero-illustration relative z-10">
            <Image
              src="/assets/hero-illustration.png"
              alt="Vintage books and a globe"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>

          {/* Right Part */}
          <div className="library-steps-card min-w-[280px] shadow-soft-md">
            <ul className="space-y-6">
              <li className="library-step-item">
                <div className="library-step-number">1</div>
                <div className="flex flex-col">
                  <h3 className="library-step-title">Upload PDF</h3>
                  <p className="library-step-description">Add your book file</p>
                </div>
              </li>
              <li className="library-step-item">
                <div className="library-step-number">2</div>
                <div className="flex flex-col">
                  <h3 className="library-step-title">AI Processing</h3>
                  <p className="library-step-description">
                    We analyze the content
                  </p>
                </div>
              </li>
              <li className="library-step-item">
                <div className="library-step-number">3</div>
                <div className="flex flex-col">
                  <h3 className="library-step-title">Voice Chat</h3>
                  <p className="library-step-description">Discuss with AI</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
