"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, ChevronRight, Loader2, Sparkles } from "lucide-react";

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
      <section className="bg-[#e2f2f5] rounded-b-[45px] pt-12 pb-16 px-6 shadow-sm">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full mb-4 shadow-sm border border-[#00004d]/10">
            <Sparkles size={14} className="text-[#00004d]" />
            <span className="text-[10px] font-black text-[#00004d] uppercase tracking-widest">Explore Opportunities</span>
          </div>
          <h1 className="text-3xl font-black text-[#00004d] leading-none mb-6">
            Find Your Dream <br /> <span className="opacity-60">Career Today</span>
          </h1>
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#00004d]" strokeWidth={3} />
            </div>
            <input
              type="text"
              placeholder="Search by title, city or skill..."
              className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-[#00004d] rounded-2xl shadow-xl text-sm text-[#00004d] font-bold outline-none placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>
      <section className="max-w-2xl mx-auto px-6 -mt-8 relative z-20">
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#00004d] mb-4" size={40} />
              <p className="text-[#00004d] font-black text-sm uppercase tracking-widest">Loading Jobs...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => router.push(`/jobs/${job._id}`)}
                className="bg-[#e2f2f5] border border-transparent hover:border-[#00004d] rounded-[2.5rem] p-6 transition-all duration-300 cursor-pointer group shadow-sm relative overflow-hidden"
              >
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white opacity-20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-[#00004d]/10 shadow-sm">
                        <Briefcase size={24} className="text-[#00004d]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-[#00004d] leading-tight group-hover:underline">{job.title}</h3>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">{job.category || "General"}</p>
                      </div>
                    </div>
                    <span className="bg-[#00004d] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-md">
                      {job.type || "Full Time"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#00004d]" />
                      <span className="text-xs font-black text-[#00004d]/70">{job.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-[#00004d]" />
                      <span className="text-xs font-black text-[#00004d]/70">{job.salary || "Market Competitive"}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1 opacity-40">
                      <Clock size={12} className="text-[#00004d]" />
                      <span className="text-[10px] font-bold text-[#00004d]">Posted recently</span>
                    </div>
                    <div className="bg-white p-2 rounded-full border border-[#00004d] text-[#00004d] group-hover:bg-[#00004d] group-hover:text-white transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-[#e2f2f5]">
              <div className="bg-[#e2f2f5] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={30} className="text-[#00004d] opacity-30" />
              </div>
              <h3 className="text-xl font-black text-[#00004d]">No Jobs Found</h3>
              <p className="text-gray-400 font-bold text-sm mt-2">Try searching with different keywords</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}