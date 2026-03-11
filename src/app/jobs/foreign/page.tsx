"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Globe, 
  MapPin, 
  Clock, 
  Search, 
  Briefcase, 
  ChevronLeft,
  Loader2,
  DollarSign
} from "lucide-react";

interface ForeignJob {
  id: string;
  title: string;
  company: string;
  country: string;
  city: string;
  salary: string;
  type: string;
  postedAt: string;
  img: string;
}

export default function ForeignJobsPage() {
  const [jobs, setJobs] = useState<ForeignJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchForeignJobs = async () => {
      try {
        setLoading(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };

    fetchForeignJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
            <section className="bg-[#1e3a8a] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
        <Link 
          href="/" 
          className="inline-block text-[#00d26a] font-black uppercase text-sm hover:underline"
        >
          ← Back to Home
        </Link>
      </div>    
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-3 flex items-center gap-3">
                <Globe className="text-[#00d26a]" size={36} />
                International Jobs
              </h1>
              <p className="text-blue-100 opacity-90 max-w-lg">
                Explore thousands of verified job opportunities abroad.
              </p>
            </div>
            <div className="relative w-full md:w-96 group">
              <input
                type="text"
                id="foreign-search"
                name="query"
                placeholder="Search country or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 pl-6 pr-12 rounded-full text-base text-black outline-none shadow-2xl focus:ring-4 focus:ring-blue-400/30 transition-all border-none"
              />
              <Search 
                size={22} 
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#1e3a8a] group-hover:scale-110 transition-transform cursor-pointer" 
              />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        {loading ? (
          <div className="bg-white rounded-3xl p-20 shadow-xl flex flex-col items-center justify-center text-slate-500 border border-slate-100">
            <Loader2 className="animate-spin text-[#1e3a8a] mb-4" size={48} />
            <p className="font-semibold tracking-wide">Connecting to Global Database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-slate-100">
                        <Image 
                          src={job.img} 
                          alt={job.company} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 33vw" 
                          className="object-cover" 
                        />
                      </div>
                      <span className="bg-blue-50 text-[#1e3a8a] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1e3a8a] mb-1 group-hover:text-[#00d26a] transition-colors leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 font-medium">{job.company}</p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={16} className="text-[#00d26a]" />
                        <span className="font-semibold">{job.city}, {job.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#1e3a8a] font-black">
                        <DollarSign size={16} className="text-[#00d26a]" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                        <Clock size={14} />
                        Posted {job.postedAt}
                      </div>
                    </div>
                  </div>

                  <button className="mt-8 w-full py-3.5 bg-[#1e3a8a] text-white font-bold rounded-2xl hover:bg-[#00d26a] transition-all shadow-md active:scale-95">
                    View Details & Apply
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-3xl p-20 text-center shadow-sm border border-slate-100">
                <Briefcase size={64} className="mx-auto text-slate-200 mb-4" />
                <h2 className="text-2xl font-black text-slate-700">No Jobs Found</h2>
                <p className="text-slate-400 mt-2">We will update new international job opportunities here soon.</p>
              </div>
            )}
          </div>
        )}
      </section>
      <section className="max-w-6xl mx-auto px-6 mt-16">
        <div className="bg-white border border-blue-100 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="bg-blue-50 p-4 rounded-2xl text-[#1e3a8a]">
             <Globe size={32} />
          </div>
          <div>
            <h4 className="font-black text-[#1e3a8a] text-lg">Safety Tip for Abroad Jobs</h4>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              Always verify visa consultants and recruitment agencies through the Bureau of Emigration (OEPC). Conduct thorough research before making any payments. We do not charge any fees for job applications.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}