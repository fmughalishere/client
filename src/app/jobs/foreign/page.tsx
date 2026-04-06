"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Globe, 
  MapPin, 
  Clock, 
  Search, 
  Briefcase, 
  Loader2,
  DollarSign,
  ArrowLeft
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
    <main className="min-h-screen bg-[#fcfcfc] pb-20">
            <section className="bg-[#e2f2f5] pt-10 pb-20 px-6 rounded-b-[50px] shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-[#00d26a] font-black uppercase text-[10px] md:text-xs tracking-widest hover:underline"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="text-left">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#00004d] mb-4 leading-tight">
                International <span className="text-[#00d26a]">Jobs</span>
              </h1>
              <p className="text-[#00004d]/70 font-bold text-sm md:text-lg max-w-lg">
                Explore thousands of verified job opportunities abroad. Connect with global employers today.
              </p>
            </div>
            <div className="w-full max-w-xl relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search country or job title..."
                className="w-full py-4 md:py-5 pl-8 pr-14 rounded-full text-sm md:text-base font-bold text-[#00004d] placeholder:text-gray-300 outline-none bg-white shadow-2xl border-none focus:ring-2 focus:ring-[#00d26a] transition-all"
              />
              <Search
                size={22}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#00004d]"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        {loading ? (
          <div className="bg-white rounded-[3rem] p-20 shadow-xl flex flex-col items-center justify-center text-slate-500 border border-gray-50">
            <Loader2 className="animate-spin text-[#00004d] mb-4" size={40} />
            <p className="font-black uppercase tracking-widest text-[10px]">Connecting to global database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-[2.5rem] border border-gray-50 p-7 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-gray-100 p-2 bg-white">
                        <Image 
                          src={job.img} 
                          alt={job.company} 
                          fill 
                          className="object-contain p-2" 
                        />
                      </div>
                      <span className="bg-[#e2f2f5] text-[#00004d] text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                        {job.type}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-[#00004d] mb-2 group-hover:text-[#00d26a] transition-colors leading-tight">
                      {job.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-6 font-bold uppercase tracking-widest">{job.company}</p>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[13px] text-[#00004d] font-bold">
                        <MapPin size={18} className="text-[#00d26a]" />
                        <span>{job.city}, {job.country}</span>
                      </div>
                      <div className="flex items-center gap-3 text-lg text-[#00004d] font-black">
                        <DollarSign size={18} className="text-[#00d26a]" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-gray-300 font-bold uppercase tracking-widest pt-4 border-t border-gray-50">
                        <Clock size={14} />
                        Posted {job.postedAt}
                      </div>
                    </div>
                  </div>

                  <button className="mt-8 w-full py-4 bg-[#00004d] text-white font-black rounded-full hover:bg-[#00d26a] hover:text-[#00004d] transition-all shadow-lg active:scale-95 text-xs uppercase tracking-widest">
                    Apply Now
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white rounded-[3rem] p-20 text-center shadow-sm border-2 border-dashed border-gray-100">
                <Briefcase size={56} className="mx-auto text-gray-100 mb-6" />
                <h2 className="text-2xl font-black text-[#00004d] uppercase tracking-tight">No Jobs Found</h2>
                <p className="text-gray-400 font-bold mt-2 text-sm">New international opportunities will appear here soon.</p>
              </div>
            )}
          </div>
        )}
      </section>
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="bg-[#e2f2f5] p-8 md:p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-8 shadow-sm border border-white">
          <div className="bg-white p-5 rounded-2xl text-[#00004d] shadow-sm">
             <Globe size={32} className="text-[#00d26a]" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-black text-[#00004d] text-xl uppercase tracking-tight mb-2">Safety Tip for Abroad Jobs</h4>
            <p className="text-sm text-[#00004d]/70 font-bold leading-relaxed">
              Always verify visa consultants through the Bureau of Emigration (OEPC). We do not charge any fees for applications. Be cautious and conduct thorough research before any financial commitments.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}