"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, Loader2, Sparkles } from "lucide-react";
import { LuChevronsRight } from "react-icons/lu";

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
    job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-20 font-sans">
      <section className="bg-[#5DBB63] rounded-b-[35px] pt-10 pb-12 px-6 shadow-sm">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full mb-3 shadow-sm border border-[#00004d]/10">
            <Sparkles size={12} className="text-[#00004d]" />
            <span className="text-[9px] font-black text-[#00004d] tracking-widest ">Explore Jobs</span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-5">
            Find Your Dream <br /> Career Today
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
        </div>
      </section>

    </main>
  );
}