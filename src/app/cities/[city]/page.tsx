"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // URL se city ID/name lene ke liye
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
  const cityName = params.id;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityJobs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/jobs?city=${cityName}`);
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
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-[#1e3a8a]" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/cities" className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-[#1e3a8a] transition-colors">
          <ArrowLeft size={20} /> Back to All Cities
        </Link>

        <div className="bg-white p-10 md:p-16 rounded-[3.5rem] shadow-xl shadow-slate-200/50 border border-gray-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-bl-full -mr-20 -mt-20 opacity-50"></div>
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-[#00d26a] font-black uppercase tracking-widest text-sm mb-4"
            >
              <MapPin size={18} /> {cityName} Opportunities
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-[#1e3a8a] mb-6 capitalize"
            >
              Jobs in <span className="text-[#00d26a]">{cityName}</span>
            </motion.h1>
            
            <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
              Explore {jobs.length} active job openings in {cityName}. Find your next career move with top local companies and multinational firms.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-black text-[#1e3a8a] mb-8 flex items-center gap-3">
              <Briefcase className="text-[#00d26a]" /> Available Vacancies
            </h2>

            {jobs.length > 0 ? (
              jobs.map((job: any, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-[#1e3a8a] group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">
                        <Building2 size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#1e3a8a] mb-1">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-gray-400 font-bold text-xs uppercase tracking-wider">
                          <span className="flex items-center gap-1"><MapPin size={14}/> {job.location}</span>
                          <span className="flex items-center gap-1"><Clock size={14}/> {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="text-right mr-4 hidden md:block">
                        <div className="text-[#00d26a] font-black text-lg">{job.salary || "Negotiable"}</div>
                        <div className="text-[10px] font-bold text-gray-300 uppercase">Monthly Salary</div>
                      </div>
                      <Link href={`/jobs/${job._id}`} className="flex-1 md:flex-none text-center bg-slate-50 hover:bg-[#1e3a8a] hover:text-white text-[#1e3a8a] px-6 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2">
                        View Details <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
                <Search className="mx-auto text-gray-200 mb-4" size={60} />
                <h3 className="text-xl font-black text-[#1e3a8a] mb-2">No Jobs Found</h3>
                <p className="text-gray-400 font-bold">Try searching in a different city or check back later.</p>
              </div>
            )}
          </div>
          <aside className="lg:col-span-1 space-y-8">
             <div className="bg-[#1e3a8a] p-8 rounded-[3rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-xl font-black mb-4 relative z-10">Job Alerts</h3>
                <p className="text-blue-100 font-medium text-sm mb-6 relative z-10">Get notified whenever a new job is posted in {cityName}.</p>
                <input type="email" placeholder="Enter your email" className="w-full p-4 bg-white/10 rounded-2xl border border-white/20 outline-none mb-4 placeholder:text-blue-200 font-bold" />
                <button className="w-full bg-[#00d26a] text-[#1e3a8a] font-black py-4 rounded-2xl shadow-lg">Subscribe Now</button>
             </div>

             <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-[#1e3a8a] mb-6">Top Cities</h3>
                <div className="space-y-4">
                  {['Karachi', 'Lahore', 'Islamabad'].map(city => (
                    <Link key={city} href={`/cities/${city.toLowerCase()}`} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
                       <span className="font-bold text-gray-500 group-hover:text-[#1e3a8a]">{city}</span>
                       <ChevronRight size={16} className="text-gray-300" />
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