"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  MapPin, 
  Briefcase, 
  ArrowLeft, 
  Search, 
  Loader2, 
  Building2, 
  Clock, 
  ChevronRight 
} from "lucide-react";

export default function CityJobsPage() {
  const params = useParams();
  const cityName = typeof params.id === 'string' ? params.id : "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityJobs = async () => {
      try {
        const response = await fetch(`https://easyjobspk.onrender.com/api/jobs?city=${cityName}`);
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs for city:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cityName) fetchCityJobs();
  }, [cityName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#000a31]" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 md:py-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/cities" className="inline-flex items-center gap-2 text-gray-400 font-black mb-8 hover:text-[#000a31] transition-all text-[10px] md:text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to All Cities
        </Link>

        <div className="bg-[#000a31] p-8 md:p-20 rounded-[2.5rem] md:rounded-[5rem] shadow-2xl mb-12 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00d26a]/5 rounded-bl-full -mr-20 -mt-20 opacity-40"></div>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[#00d26a] font-black uppercase tracking-widest text-[9px] md:text-xs mb-4"
            >
              <MapPin size={14} /> Local Opportunities
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-6xl font-black mb-6 capitalize leading-[1.1]"
            >
              Jobs in <span className="text-[#00d26a]">{cityName}</span>
            </motion.h1>
            
            <p className="text-gray-400 font-bold text-sm md:text-xl max-w-2xl leading-relaxed">
              Explore {jobs.length} career openings in {cityName}. Find your next move with top local companies.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                    <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl md:text-2xl font-black text-[#000a31] mb-8 flex items-center gap-3">
              <Briefcase className="text-[#00d26a]" size={22} /> Available Vacancies
            </h2>

            {jobs.length > 0 ? (
              jobs.map((job: any, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4 md:gap-6 w-full">
                      <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#000a31] group-hover:bg-[#000a31] group-hover:text-white transition-all">
                        <Building2 size={24} /> 
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-black text-[#000a31] mb-1 group-hover:text-[#00d26a] transition-colors line-clamp-1">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-wider">
                          <span className="flex items-center gap-1"><MapPin size={14} className="text-[#00d26a]" /> {job.location}</span>
                          <span className="flex items-center gap-1"><Clock size={14}/> {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none border-gray-50">
                      <div className="text-left md:text-right md:mr-4">
                        <div className="text-[#00d26a] font-black text-base md:text-xl">{job.salary || "Neg."}</div>
                        <div className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">Per Month</div>
                      </div>
                      <Link href={`/jobs/${job._id}`} className="bg-[#000a31] text-white px-6 py-3.5 rounded-full font-black text-xs transition-all flex items-center justify-center gap-2 hover:bg-[#00d26a] hover:text-[#000a31] active:scale-95 shadow-lg shadow-black/10">
                        View <ChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-12 md:p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                <Search className="mx-auto text-gray-200 mb-6" size={50} />
                <h3 className="text-lg md:text-2xl font-black text-[#000a31] mb-2 uppercase tracking-tight">No Vacancies Yet</h3>
                <p className="text-gray-400 font-bold text-sm md:text-lg">Try a different city or check back later.</p>
              </div>
            )}
          </div>
          <aside className="lg:col-span-1 space-y-8 mt-12 md:mt-0">
             <div className="bg-[#000a31] p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-lg md:text-xl font-black mb-4 relative z-10 uppercase tracking-widest text-[#00d26a]">Job Alerts</h3>
                <p className="text-gray-400 font-medium text-xs md:text-sm mb-6 relative z-10 leading-relaxed">
                  Get notified for new jobs in <span className="text-[#00d26a] font-bold">{cityName}</span>.
                </p>
                <input type="email" placeholder="Your Email" className="w-full p-4 bg-white/10 rounded-full border border-white/10 outline-none mb-4 placeholder:text-gray-500 font-bold text-sm focus:bg-white/20 transition-all" />
                <button className="w-full bg-[#00d26a] text-[#000a31] font-black py-4 rounded-full shadow-lg hover:bg-white transition-all active:scale-95 uppercase text-xs tracking-widest">
                  Subscribe
                </button>
             </div>
             <div className="bg-white p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 shadow-sm">
                <h3 className="text-md md:text-lg font-black text-[#000a31] mb-8 uppercase tracking-widest border-b pb-4 border-gray-50">Top Cities</h3>
                <div className="space-y-3">
                  {['Karachi', 'Lahore', 'Islamabad'].map(city => (
                    <Link key={city} href={`/cities/${city.toLowerCase()}`} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-[#000a31] hover:text-white rounded-full transition-all group">
                       <span className="font-bold text-gray-500 group-hover:text-white text-xs">{city}</span>
                       <ChevronRight size={14} className="text-gray-300 group-hover:text-[#00d26a]" />
                    </Link>
                  ))}
                </div>
             </div>
          </aside>

        </div>
      </div>
    </main>
  );
}