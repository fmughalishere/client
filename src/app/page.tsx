"use client";

import {
  Search, PlusCircle, Briefcase, Users, ClipboardList,
} from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    { label: "Apply for a Job", icon: <Briefcase size={28} style={{ color: "#5DBB63" }} />, href: "/application" },
    { label: "Post a Job", icon: <PlusCircle size={28} style={{ color: "#5DBB63" }} />, href: "/post-job" },
    { label: "Job Seekers", icon: <Users size={28} style={{ color: "#5DBB63" }} />, href: "/applicants" },
    { label: "Job Offers", icon: <ClipboardList size={28} style={{ color: "#5DBB63" }} />, href: "/jobs" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length > 0) {
      const filtered = applicants
        .filter((app) =>
          app.fullName.toLowerCase().includes(value.toLowerCase()) ||
          (app.category && app.category.toLowerCase().includes(value.toLowerCase()))
        )
        .map((app) => (app.category && app.category.toLowerCase().includes(value.toLowerCase()) ? app.category : app.fullName));
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
    <main className="min-h-[60vh] bg-[#fcfcfc] font-sans">
      <section className="px-0 pt-0 relative">
        <div className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="text-center mb-1 mt-0 relative z-10">
            <h1 className="text-[26px] font-black text-[#5DBB63] leading-none">Hire easy</h1>
            <h1 className="text-[26px] font-black text-[#5DBB63] leading-tight">Get hired easy</h1>
          </div>
        </div>
        <div className="relative -mt-7 flex justify-center px-6 z-30" ref={searchRef}>
          <div className="relative w-full max-w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#00004d]" strokeWidth={3} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search jobs/employees"
              className="block w-full pl-11 pr-14 py-3 bg-white rounded-[15px] shadow-lg text-sm text-[#00004d] font-bold outline-none"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
              <div className="h-5 w-[1.5px] bg-[#00004d]"></div>
              <button onClick={() => handleSearch()} className="text-[#00004d] font-black text-[15px] hover:opacity-70">Go</button>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-2xl mx-auto px-6 mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => router.push(action.href)}
              className="w-full transition-transform active:scale-95 group"
            >
              <div className="relative flex flex-col items-center justify-center h-[90px] bg-white rounded-2xl text-[#00004d] shadow-md border border-gray-50 p-3">                <div className="mb-3 transform group-hover:scale-110 transition-transform">
                {action.icon}
              </div>
                <span className="text-[14px] font-black text-[#00004d] text-center leading-tight">
                  {action.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}