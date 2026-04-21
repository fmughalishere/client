"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, DollarSign, Clock, ChevronRight, Loader2, Sparkles } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/jobs");
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-20 font-sans">
      <section className="bg-[#e2f2f5] rounded-b-[35px] pt-10 pb-12 px-6 shadow-sm">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full mb-3 shadow-sm border border-[#00004d]/10">
            <Sparkles size={12} className="text-[#00004d]" />
            <span className="text-[9px] font-black text-[#00004d] tracking-widest uppercase">Explore Jobs</span>
          </div>
          <h1 className="text-2xl font-black text-[#00004d] leading-tight mb-5">
            Find Your Dream <br /> <span className="opacity-60">Career Today</span>
          </h1>
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#00004d]" strokeWidth={3} />
            </div>
            <input
              type="text"
              placeholder="Search jobs, cities..."
              className="block w-full pl-10 pr-4 py-2 bg-white border border-[#00004d] rounded-full shadow-md text-xs text-[#00004d] font-bold outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>
      <section className="max-w-[360px] mx-auto px-4 mt-6 relative z-20">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="animate-spin text-[#00004d]" />
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => router.push(`/jobs/${job._id}`)}
                className="bg-[#e2f2f5] border border-gray-100 rounded-3xl p-3 flex items-center gap-4 relative shadow-sm h-28 cursor-pointer active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#00004d] overflow-hidden relative bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Briefcase size={30} className="text-[#00004d]" />
                </div>
                <div className="flex flex-col overflow-hidden flex-1">
                  <h2 className="text-base font-black text-[#00004d] truncate leading-tight">
                    {job.title}
                  </h2>
                  <p className="text-[12px] font-bold text-gray-700 truncate mt-0.5">
                    {job.company || job.category}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {job.type || "Full Time"} • {job.salary || "Negotiable"}
                    </span>
                  </div>
                </div>
                <div className="absolute top-3 right-4 flex flex-col items-center">
                  <MapPin size={14} className="text-[#00004d]" strokeWidth={4} />
                  <span className="font-bold text-[#00004d] text-[9px] uppercase tracking-tighter">{job.city}</span>
                </div>
                <button 
                  className="absolute bottom-3 right-4 bg-[#00004d] text-white px-3 py-1 rounded-full text-[10px] font-black shadow-sm uppercase tracking-tight"
                >
                  View Detail
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No Jobs Found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}