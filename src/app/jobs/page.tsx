"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Loader2, Sparkles } from "lucide-react";
import { LuChevronsRight } from "react-icons/lu";
import Pagination from "../../components/Pagination";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/jobs");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fetchJobs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    if (value.trim().length > 0) {
      const filtered = jobs
        .filter((job) => 
          job.category?.toLowerCase().includes(value.toLowerCase()) || 
          job.city?.toLowerCase().includes(value.toLowerCase())
        )
        .map((job) => (job.category?.toLowerCase().includes(value.toLowerCase()) ? job.category : job.city));

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

  const handleSelectSuggestion = (item: string) => {
    setSearchQuery(item);
    setShowSuggestions(false);
  };

  const filteredJobs = jobs.filter((job) =>
    job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-20 font-sans">
      <section className="px-0 pt-0 relative">
        <div className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full mb-3 shadow-sm border border-[#00004d]/10">
              <Sparkles size={12} className="text-[#00004d]" />
              <span className="text-[9px] font-black text-[#00004d] tracking-widest">Explore Jobs</span>
            </div>
          <div className="text-center mb-1 mt-0 relative z-10">
            <h1 className="text-[26px] font-black text-[#5DBB63] leading-tight">Find Your Dream <br /> Career Today</h1>
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
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search jobs... "
              className="block w-full pl-11 pr-14 py-2.5 bg-white rounded-[15px] shadow-lg text-sm text-[#00004d] font-bold outline-none"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
              <div className="h-5 w-[1.5px] bg-[#00004d]"></div>
              <button onClick={() => handleSearch()} className="text-[#00004d] font-black text-[15px] hover:opacity-70">Go</button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden text-left">
                {suggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item);
                      handleSearch(item);
                    }}
                    className="px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer border-b last:border-none border-gray-50 transition-colors"
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
      <section className="max-w-[360px] mx-auto px-4 mt-6 relative z-20">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="animate-spin text-[#00004d]" />
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((job) => (
              <div
                key={job._id}
                onClick={() => router.push(`/jobs/${job._id}`)}
                className="bg-white border border-gray-100 rounded-[15px] p-3 flex items-center gap-3 relative shadow-md h-[90px] cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-14 h-14 rounded-full flex-shrink-0 bg-[#f8fafc] border border-gray-100 flex items-center justify-center overflow-hidden">
                  <Briefcase size={26} className="text-[#00004d]" />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <p className="text-[11px] font-bold text-[#00004d] opacity-90 truncate">
                    { job.category}
                  </p>

                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#00004d] whitespace-nowrap">
                    <span>{job.type || "Full Time"}</span>
                  </div>

                  <p className="text-[10px] font-bold text-[#00004d] mt-0.5 tracking-[0.1em]">
                    {job.salary || "Negotiable"}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 text-[#5DBB63] ml-[-2px]">
                      <MapPin size={13} />
                      <span className="font-bold text-[10px]">
                        {job.city}
                      </span>
                    </div>

                    <button className="text-[#5DBB63] font-black text-[10px] flex items-center gap-0.5">
                      View Detail <LuChevronsRight size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 font-bold text-sm  tracking-widest">
                No Jobs Found
              </p>
            </div>
          )}
          {!loading && filteredJobs.length > 0 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={(page: number) => setCurrentPage(page)} 
            />
          )}
        </div>
      </section>
    </main>
  );
}