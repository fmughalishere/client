"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Loader2, Sparkles, Bookmark } from "lucide-react";
import { LuChevronsRight } from "react-icons/lu";
import Pagination from "../../components/Pagination";
import toast, { Toaster } from "react-hot-toast";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (userData) setCurrentUserId(JSON.parse(userData)._id);

      const res = await fetch("https://easyjobspk.onrender.com/api/jobs");
      const data = await res.json();
      const activeJobs = Array.isArray(data) ? data.filter((job: any) => job.status === "active") : [];
      setJobs(activeJobs);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

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
        <h1 style={{ fontFamily: 'Fontatica' }} className="text-[35px] text-[#5DBB63] leading-tight text-center">Find Your Dream <br /> Career Today</h1>
      </section>

      <div className="relative -mt-7 flex justify-center px-6 z-30">
        <div className="relative w-full max-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00004d]" strokeWidth={3} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search jobs... "
            className="block w-full pl-11 pr-4 py-2.5 bg-white rounded-[15px] shadow-lg text-sm text-[#00004d] font-bold outline-none"
          />
        </div>
      </div>
      
      <section className="max-w-[360px] mx-auto px-4 mt-6">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00004d]" /></div>
          ) : (
            <>
              {currentItems.map((job) => (
                <div key={job._id} onClick={() => router.push(`/jobs/${job._id}`)} className="bg-white border border-gray-100 rounded-[15px] p-3 flex items-center gap-3 shadow-md h-[90px] cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-[#f8fafc] border border-gray-100 flex items-center justify-center shrink-0">
                    <Briefcase size={26} className="text-[#00004d]" />
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-bold text-[#00004d] truncate max-w-[150px]">{job.category}</p>
                      <button onClick={(e) => handleToggleSave(e, job._id)} className="p-1">
                        <Bookmark size={18} className={job.savedBy?.includes(currentUserId) ? "fill-[#00004d] text-[#00004d]" : "text-gray-400"} />
                      </button>
                    </div>
                    <p className="text-[9px] font-bold text-[#00004d]">{job.type || "Full Time"}</p>
                    <p className="text-[10px] font-bold text-[#00004d] mt-0.5">{job.salary || "Negotiable"}</p>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-1 text-[#5DBB63]"><MapPin size={13} /><span className="font-bold text-[10px]">{job.city}</span></div>
                      <button className="text-[#5DBB63] font-black text-[10px] flex items-center">View Detail <LuChevronsRight size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredJobs.length > itemsPerPage && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page: number) => { setCurrentPage(page); window.scrollTo(0,0); }} />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}