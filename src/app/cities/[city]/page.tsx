"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Search, ArrowRight, TrendingUp } from "lucide-react";

const cities = [
  { name: "Karachi", jobs: "4,500+", growth: "+12%", color: "bg-blue-50" },
  { name: "Lahore", jobs: "3,200+", growth: "+8%", color: "bg-green-50" },
  { name: "Islamabad", jobs: "2,100+", growth: "+15%", color: "bg-purple-50" },
  { name: "Rawalpindi", jobs: "1,500+", growth: "+5%", color: "bg-orange-50" },
  { name: "Faisalabad", jobs: "1,200+", growth: "+3%", color: "bg-red-50" },
  { name: "Multan", jobs: "950+", growth: "+6%", color: "bg-teal-50" },
  { name: "Peshawar", jobs: "800+", growth: "+4%", color: "bg-indigo-50" },
  { name: "Quetta", jobs: "500+", growth: "+2%", color: "bg-yellow-50" },
];

export default function CitiesPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#1e3a8a] mb-6"
          >
            Browse Jobs by <span className="text-[#00d26a]">City</span>
          </motion.h1>
          <p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto">
            Find the best opportunities in your preferred location. We cover all major industrial hubs across Pakistan.
          </p>

          <div className="mt-10 max-w-xl mx-auto relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e3a8a] transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Search for your city..." 
              className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 border-2 border-transparent focus:border-[#1e3a8a] outline-none font-bold text-[#1e3a8a] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Link href={`/cities/${city.name.toLowerCase()}`} className="block group">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-slate-200/40 relative overflow-hidden h-full">
                  <div className={`absolute top-0 right-0 w-24 h-24 ${city.color} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150`}></div>
                  
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:bg-[#1e3a8a] transition-colors">
                      <MapPin className="text-[#1e3a8a] group-hover:text-white transition-colors" size={28} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-[#1e3a8a] mb-2">{city.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#00d26a] font-black">{city.jobs} Jobs</span>
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                        <TrendingUp size={14} className="text-green-500" />
                        {city.growth}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-gray-100 flex items-center gap-2 text-[#1e3a8a] font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Now <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}