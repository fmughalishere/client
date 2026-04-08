"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Heart,
  TrendingUp,
  PlusCircle,
  Briefcase,
  Users,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const jobSeekers = [
    { 
      name: "Qamar Ahmad", 
      category: "Driver", 
      age: "56 years", 
      city: "Lahore", 
      img: "/images/app_logo.png" 
    },
    { 
      name: "Sajid Khan", 
      category: "Cook", 
      age: "32 years", 
      city: "Karachi", 
      img: "/images/app_logo.png" 
    },
    { 
      name: "M. Ali", 
      category: "Electrician", 
      age: "28 years", 
      city: "Islamabad", 
      img: "/images/app_logo.png" 
    },
  ];

  const quickActions = [
    { label: "Apply for a Job", icon: <Briefcase size={18} />, href: "/jobs" },
    { label: "Post a Job", icon: <PlusCircle size={18} />, href: "/dashboard/employer" },
    { label: "Job Seekers", icon: <Users size={18} />, href: "/dashboard/employer" },
    { label: "Job Offers", icon: <ClipboardList size={18} />, href: "/jobs" },
  ];

  const [visitorCount, setVisitorCount] = useState<number>(3000);

  useEffect(() => {
    const storedCount = localStorage.getItem("visitorCount");
    let count = storedCount ? parseInt(storedCount) : visitorCount;
    count += 1;
    setVisitorCount(count);
    localStorage.setItem("visitorCount", count.toString());
  }, []);

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-8 font-sans">
      <section className="px-0 pt-0 relative">
        <div className="bg-[#e2f2f5] rounded-b-[35px] pt-10 pb-12 px-6 flex flex-col items-center shadow-sm relative">
          <div className="bg-[#00004d] text-white px-3 py-1 rounded-full font-black text-[8px] absolute top-2 z-30 shadow-md">
            Real-Time Visitors: {visitorCount}
          </div>
          <div className="text-center mb-1 mt-4">
            <h1 className="text-[20px] font-black text-[#00004d] leading-none">Hire easy</h1>
            <h1 className="text-[20px] font-black text-[#00004d] leading-tight">Get hired easy</h1>
          </div>
          <div className="relative w-full max-w-[250px] mt-3">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-[#00004d]" strokeWidth={3} />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              className="block w-full pl-9 pr-4 py-2 bg-white border border-[#00004d] rounded-full shadow-md text-xs text-[#00004d] font-bold outline-none"
            />
          </div>
        </div>
      </section>
      <section className="max-w-md mx-auto px-6 -mt-6 relative z-20">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="w-full max-w-[210px] transition-transform active:scale-95">
              <div className="flex items-center justify-center gap-2 h-[40px] bg-[#e2f2f5] rounded-full shadow border border-[#00004d] text-[#00004d] hover:bg-[#00004d] hover:text-white transition-all duration-300 group">
                <span className="flex items-center justify-center">{action.icon}</span>
                <span className="font-bold text-[13px] whitespace-nowrap">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 mt-6 flex justify-center">
        <div className="w-full max-w-xs rounded-lg overflow-hidden shadow-sm border border-gray-100">
          <Image src="/images/IMG (6).jpeg" alt="Promotional Banner" width={1280} height={473} className="object-cover" priority unoptimized={true} />
        </div>
      </section>
      <section className="flex justify-center mt-4 mb-4 relative z-30">
        <div className="bg-[#00004d] text-white px-4 py-1.5 rounded-full flex flex-col items-center shadow-sm border border-white">
            <span className="text-[9px] font-black uppercase tracking-wider leading-none">Seeking for a job</span>
            <div className="flex flex-col items-center -space-y-2 animate-bounce mt-0.5">
                <ChevronDown size={12} strokeWidth={4} />
                <ChevronDown size={12} strokeWidth={4} />
            </div>
        </div>
      </section>
      <section className="max-w-[340px] mx-auto px-4 mt-2 mb-10">
        <div className="flex flex-col gap-3">
          {jobSeekers.map((seeker, idx) => (
            <div 
              key={idx} 
              className="bg-[#eef8fa] border border-blue-50 rounded-2xl p-2.5 flex items-center gap-3 relative shadow-sm h-24"
            >
              <div className="w-16 h-16 rounded-full border-2 border-[#00004d] overflow-hidden shrink-0 relative">
                <Image src={seeker.img} alt={seeker.name} fill className="object-cover" unoptimized={true} />
              </div>
              <div className="flex flex-col justify-center overflow-hidden pr-10">
                <h2 className="text-base font-black text-[#00004d] truncate">
                    {seeker.name}
                </h2>
                <p className="text-[11px] font-bold text-gray-700">
                    {seeker.category}
                </p>
                <p className="text-[10px] font-bold text-gray-400">
                    {seeker.age}
                </p>
              </div>
              <div className="absolute top-2 right-3 flex flex-col items-center">
                <MapPin size={12} className="text-[#00004d]" strokeWidth={4} />
                <span className="font-bold text-[#00004d] text-[8px] uppercase">
                    {seeker.city}
                </span>
              </div>
              <button className="absolute bottom-2 right-3 bg-[#00004d] text-white px-2.5 py-1 rounded-full text-[8px] font-black shadow-sm active:scale-95 uppercase tracking-tighter">
                Visit my profile
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}