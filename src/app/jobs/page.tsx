"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Loader2, Bookmark, Heart } from "lucide-react";
import { LuChevronsRight } from "react-icons/lu";
import Pagination from "../../components/Pagination";
import toast, { Toaster } from "react-hot-toast";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userData) setCurrentUserId(JSON.parse(userData)._id);

      const res = await fetch("https://easyjobspk.onrender.com/api/jobs");
      const data = await res.json();
      const activeJobs = Array.isArray(data) ? data.filter((job: any) => job.status === "active") : [];
      setJobs(activeJobs);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

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
    setSearchQuery(finalQuery);
    setShowSuggestions(false);
  };

  const handleToggleSave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token || !currentUserId) return toast.error("Please login to save jobs!");

    try {
      const res = await fetch(`https://easyjobspk.onrender.com/api/jobs/${id}/save`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (res.ok) {
        const isCurrentlySaved = jobs.find(j => j._id === id)?.savedBy?.includes(currentUserId);
        setJobs(prev => prev.map(job => {
          if (job._id === id) {
            const newSavedBy = isCurrentlySaved ? job.savedBy.filter((uid: string) => uid !== currentUserId) : [...(job.savedBy || []), currentUserId];
            return { ...job, savedBy: newSavedBy };
          }
          return job;
        }));
        isCurrentlySaved ? toast.success("Removed from saved") : toast.success("Job Saved!");
      }
    } catch (error) { toast.error("Error toggling save"); }
  };

  const filteredJobs = jobs.filter((job) =>
    job.city.toLowerCase().includes(searchQuery.toLowerCase()) || job.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentItems = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="min-h-screen bg-[#e1eaed] pb-20 font-sans">
      <Toaster position="top-center" />
      
      <section className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative">
        <h1 style={{ fontFamily: 'Fontatica' }} className="text-[35px] text-[#5DBB63] leading-tight text-center">
          Find Your Dream <br /> Career Today
        </h1>
      </section>

      <div className="relative -mt-8 flex justify-center px-6 z-30" ref={searchRef}>
        <div className="relative w-full max-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#00004d]" strokeWidth={3} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => searchQuery.trim().length > 0 && setShowSuggestions(true)}
            placeholder="Search jobs/locations..."
            className="block w-full pl-11 pr-14 py-3 bg-[#e1eaed] rounded-[15px] shadow-lg text-sm text-[#00004d] font-bold outline-none"
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
            <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion)}
                  className="w-full text-left px-4 py-3 text-sm font-bold text-[#00004d] hover:bg-gray-50 border-b last:border-0 border-gray-100"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <section className="max-w-[360px] mx-auto px-4 mt-10">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00004d]" /></div>
          ) : (
            <>
              {currentItems.length > 0 ? (
                currentItems.map((job) => (
                  <div 
                    key={job._id} 
                    onClick={() => router.push(`/jobs/${job._id}`)} 
                    className="bg-white border border-gray-100 rounded-[15px] flex items-center gap-3 shadow-md h-[95px] cursor-pointer transition-transform active:scale-95 overflow-hidden"
                  >
                    <div className="relative w-20 h-full shrink-0 bg-gray-50 flex items-center justify-center border-r border-gray-50">
                      <Briefcase size={28} className="text-[#00004d]" />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden py-2 pr-3">
                      <div className="flex justify-between items-center">
                        <p className="text-[11px] font-bold text-[#00004d] truncate max-w-[150px]">{job.category}</p>
                        <button onClick={(e) => handleToggleSave(e, job._id)} className="p-1">
                          <Heart size={18} className={job.savedBy?.includes(currentUserId) ? "fill-[#00004d] text-[#00004d]" : "text-[#00004d]"} />
                        </button>
                      </div>
                      <p className="text-[9px] font-bold text-[#00004d]">{job.type || "Full Time"}</p>
                      <p className="text-[10px] font-bold text-[#00004d] mt-0.5">{job.salary || "Negotiable"}</p>
                      <div className="flex justify-between items-center mt-1">
                        <div className="flex items-center gap-0 text-[#5DBB63] ml-[-1]">
                          <MapPin size={13} />
                          <span className="font-bold text-[10px]">{job.city}</span>
                        </div>
                        <button className="text-[#5DBB63] font-black text-[10px] flex items-center">
                          View Job Details <LuChevronsRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-[#00004d] font-bold">No jobs found</div>
              )}
              
              {filteredJobs.length > itemsPerPage && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={(page: number) => { setCurrentPage(page); window.scrollTo(0,0); }} 
                />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}