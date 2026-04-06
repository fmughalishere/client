"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Search, ArrowRight, TrendingUp, Building2, Briefcase, Loader2 } from "lucide-react";

export default function CitiesPage() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const bgColors = [
    "bg-blue-50", "bg-green-50", "bg-purple-50", "bg-orange-50", 
    "bg-red-50", "bg-indigo-50", "bg-teal-50", "bg-yellow-50", 
    "bg-sky-50", "bg-emerald-50"
  ];

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cities");
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  const filteredCities = cities.filter((city: any) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#000a31]" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfcfc] py-10 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
                <div className="mb-8 md:mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-[#00d26a] font-black uppercase text-[10px] md:text-xs tracking-widest hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="text-center mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#000a31]/5 px-4 py-2 rounded-full text-[#000a31] text-[10px] md:text-xs font-black mb-6 border border-[#000a31]/10 uppercase tracking-widest"
          >
            <MapPin size={14} className="text-[#00d26a]" />
            <span>Explore Opportunities Locally</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl font-black text-[#000a31] mb-4 md:mb-6 leading-tight tracking-tight"
          >
            Find Jobs by <span className="text-[#00d26a]">City</span>
          </motion.h1>
          
          <motion.p className="text-gray-500 font-bold text-sm md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            Discover career opportunities in your preferred city. 
            Browse top companies across Pakistan.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-10 md:mt-12 max-w-2xl mx-auto relative group px-2"
          >
            <div className="absolute left-8 md:left-10 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#000a31] transition-colors">
              <Search className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for your city..." 
              className="w-full pl-14 md:pl-20 pr-8 py-4 md:py-6 rounded-full bg-white shadow-xl shadow-slate-200/50 border-2 border-transparent focus:border-[#000a31] outline-none font-bold text-[#000a31] transition-all text-sm md:text-lg placeholder:text-gray-300"
            />
          </motion.div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 md:mb-24">
            {[
                { label: "Total Cities", val: `${cities.length}+`, icon: MapPin },
                { label: "New Jobs", val: "850+", icon: Briefcase },
                { label: "Companies", val: "2.5k+", icon: Building2 },
                { label: "Seekers", val: "100k+", icon: TrendingUp },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-5 md:p-8 rounded-[2rem] border border-gray-50 flex flex-col items-center text-center shadow-sm">
                    <stat.icon className="text-[#00d26a] mb-2 w-5 h-5 md:w-6 md:h-6" />
                    <div className="text-xl md:text-3xl font-black text-[#000a31]">{stat.val}</div>
                    <div className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </div>
            ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filteredCities.length > 0 ? (
            filteredCities.map((city: any, index: number) => (
              <motion.div
                key={city._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Link href={`/jobs?city=${city.name}`} className="block">
                  <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-50 shadow-sm relative overflow-hidden h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                    <div className={`absolute top-0 right-0 w-24 md:w-40 h-24 md:h-40 ${bgColors[index % bgColors.length]} rounded-bl-full -mr-8 md:-mr-16 -mt-8 md:-mt-16 transition-transform duration-700 group-hover:scale-150`}></div>
                    
                    <div className="relative z-10">
                      <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center shadow-sm mb-6 md:mb-10 group-hover:bg-[#000a31] transition-all duration-300">
                        <MapPin className="text-[#000a31] group-hover:text-white transition-colors w-7 h-7 md:w-10 md:h-10" />
                      </div>
                      
                      <h3 className="text-2xl md:text-4xl font-black text-[#000a31] mb-2">{city.name}</h3>
                      <p className="text-gray-400 font-bold text-xs md:text-base mb-8">{city.description || "The Corporate Hub"}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-[#00d26a] font-black text-2xl md:text-3xl">{city.jobCount || 0}</span>
                          <span className="text-[9px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest">Live Vacancies</span>
                        </div>
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#000a31] text-white flex items-center justify-center group-hover:bg-[#00d26a] group-hover:text-[#000a31] transition-all active:scale-90 shadow-lg shadow-black/10">
                          <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 font-bold text-gray-400 text-sm md:text-lg">
              No results found for your search.
            </div>
          )}
        </div>
        <motion.div className="mt-20 md:mt-32 p-8 md:p-20 bg-[#000a31] rounded-[2.5rem] md:rounded-[5rem] text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[#00d26a]/5 skew-y-6 transform origin-top-left"></div>
            <div className="relative z-10">
                <h2 className="text-2xl md:text-6xl font-black text-white mb-4 md:mb-8 leading-tight">Can't find your city?</h2>
                <p className="text-gray-400 font-bold mb-10 md:mb-14 max-w-2xl mx-auto text-sm md:text-xl">Explore remote opportunities and work from anywhere in Pakistan.</p>
                <Link href="/jobs" className="bg-[#00d26a] hover:bg-white text-[#000a31] px-10 md:px-16 py-4 md:py-6 rounded-full font-black text-sm md:text-2xl shadow-xl transition-all inline-block active:scale-95">
                    Browse All Jobs
                </Link>
            </div>
        </motion.div>
      </div>
    </main>
  );
}