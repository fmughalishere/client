"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [applicants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { icon: "/images/apply-for-job.png", href: "/application" },
    { icon: "/images/post-job.png", href: "/post-job" },
    { icon: "/images/job-seekers.png", href: "/applicants" },
    { icon: "/images/job-offers.png", href: "/jobs" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 0) {
      const filtered = applicants
        .filter(
          (app) =>
            app.fullName.toLowerCase().includes(value.toLowerCase()) ||
            (app.category && app.category.toLowerCase().includes(value.toLowerCase()))
        )
        .map((app) =>
          app.category && app.category.toLowerCase().includes(value.toLowerCase())
            ? app.category
            : app.fullName
        );

      const uniqueSuggestions = Array.from(new Set(filtered)).slice(0, 5);
      setSuggestions(uniqueSuggestions as string[]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (selectedQuery?: string) => {
    const finalQuery = selectedQuery || searchQuery;
    if (finalQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/jobs?search=${finalQuery}`);
    }
  };

  return (
    <main className="h-screen w-full bg-[#fcfcfc] font-sans flex flex-col overflow-hidden">
            <section className="relative">
        <div className="bg-white rounded-b-[40px] pt-6 pb-10 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="text-center relative z-10">
            <h1 className="text-[28px] font-black text-[#5DBB63] leading-none">
              Hire easy
            </h1>
            <h1 className="text-[28px] font-black text-[#5DBB63] leading-tight">
              Get hired easy
            </h1>
          </div>
        </div>
        <div className="relative -mt-6 flex justify-center px-6 z-30" ref={searchRef}>
          <div className="relative w-full max-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#00004d]" strokeWidth={3} />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search jobs/employees"
              className="block w-full pl-11 pr-14 py-3 bg-white rounded-[15px] shadow-lg text-sm text-[#00004d] font-bold outline-none"
            />

            <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
              <div className="h-5 w-[1.5px] bg-[#00004d]"></div>
              <button
                onClick={() => handleSearch()}
                className="text-[#00004d] font-black text-[15px] hover:opacity-70"
              >
                Go
              </button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden text-left">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item);
                      handleSearch(item);
                    }}
                    className="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer border-b last:border-none border-gray-50 transition-colors"
                  >
                    <Search className="h-3 w-3 text-gray-400" />
                    <span className="text-sm font-semibold text-[#00004d]">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-2 w-full max-w-[380px] place-items-center">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => router.push(action.href)}
              className="relative w-full aspect-square max-w-[170px] rounded-[30px] overflow-hidden transition-transform active:scale-95 shadow-md"
            >
              <Image
                src={action.icon}
                alt="action"
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      </section>
      <div className="h-4 w-full"></div>
    </main>
  );
}