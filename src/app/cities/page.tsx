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
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <Loader2 className="animate-spin text-[#1e3a8a]" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
        <Link 
          href="/" 
          className="inline-block text-[#00d26a] font-black uppercase text-sm hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#1e3a8a]/5 px-4 py-2 rounded-full text-[#1e3a8a] text-sm font-black mb-6 border border-[#1e3a8a]/10"
          >
            
            <MapPin size={16} className="text-[#00d26a]" />
            <span className="uppercase tracking-widest">Explore Opportunities Locally</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#1e3a8a] mb-6 tracking-tight"
          >
            Find Jobs by <span className="text-[#00d26a]">City</span>
          </motion.h1>
          
          <motion.p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto leading-relaxed">
            Discover career opportunities in your preferred city. 
            Browse top companies across Pakistan.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-12 max-w-2xl mx-auto relative group"
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for your city (e.g. Lahore, Karachi...)" 
              className="w-full pl-16 pr-8 py-6 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/50 border-2 border-transparent focus:border-[#1e3a8a] outline-none font-bold text-[#1e3a8a] transition-all text-lg placeholder:text-gray-300"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
                { label: "Total Cities", val: `${cities.length}+`, icon: MapPin },
                { label: "New Jobs Today", val: "850+", icon: Briefcase },
                { label: "Local Companies", val: "2.5k+", icon: Building2 },
                { label: "Active Seekers", val: "100k+", icon: TrendingUp },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center shadow-sm">
                    <stat.icon className="text-[#00d26a] mb-2" size={24} />
                    <div className="text-2xl font-black text-[#1e3a8a]">{stat.val}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCities.length > 0 ? (
            filteredCities.map((city: any, index: number) => (
              <motion.div
                key={city._id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link href={`/jobs?city=${city.name}`} className="block">
                  <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-slate-200/30 relative overflow-hidden h-full transition-all group-hover:shadow-[#1e3a8a]/10">
                    <div className={`absolute top-0 right-0 w-32 h-32 ${bgColors[index % bgColors.length]} rounded-bl-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150`}></div>
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-8 group-hover:bg-[#1e3a8a] transition-all duration-300">
                        <MapPin className="text-[#1e3a8a] group-hover:text-white transition-colors" size={32} />
                      </div>
                      
                      <h3 className="text-3xl font-black text-[#1e3a8a] mb-2">{city.name}</h3>
                      <p className="text-gray-400 font-bold text-sm mb-6">{city.description || "The Corporate Hub"}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div className="flex flex-col">
                          <span className="text-[#00d26a] font-black text-2xl">{city.jobCount || 0}</span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Live Vacancies</span>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#00d26a] group-hover:text-white transition-all">
                          <ArrowRight size={24} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400 font-bold">
              No city found matching your search.
            </div>
          )}
        </div>

        <motion.div className="mt-24 p-12 bg-[#1e3a8a] rounded-[4rem] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[#00d26a]/5 skew-y-6 transform origin-top-left"></div>
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Can't find your city?</h2>
                <p className="text-blue-100 font-bold mb-10 max-w-xl mx-auto">Explore remote jobs from anywhere in Pakistan.</p>
                <Link href="/jobs" className="bg-[#00d26a] hover:bg-green-600 text-[#1e3a8a] px-12 py-5 rounded-2xl font-black text-xl shadow-2xl transition-all inline-block">
                    Browse All Jobs
                </Link>
            </div>
        </motion.div>
      </div>
    </main>
  );
}