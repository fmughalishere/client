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
} from "lucide-react";

export default function HomePage() {
  const featuredJobs = [
    { title: "Junior Accounts Assistant", loc: "Urdu Bazar, Lahore", img: "/images/app_logo.png" },
    { title: "Europe Jobs / Greece Visa", loc: "Allama Iqbal Town, Lahore", img: "/images/app_logo.png" },
    { title: "Factory Hiring Helper", loc: "S.I.E, Gujranwala", img: "/images/app_logo.png" },
  ];

  const quickActions = [
    { label: "Apply For A Job", icon: <Briefcase size={20} />, href: "/jobs" },
    { label: "Post A Job", icon: <PlusCircle size={20} />, href: "/dashboard/employer" },
    { label: "Job Seekers", icon: <Users size={20} />, href: "/dashboard/employer" },
    { label: "Job Offers", icon: <ClipboardList size={20} />, href: "/jobs" },
  ];

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-16">
      <section className="px-0 pt-0">
        <div className="bg-[#e2f2f5] rounded-b-[45px] pt-10 pb-16 px-6 flex flex-col items-center shadow-sm">
          <div className="text-center mb-6 mt-2"> 
            <h1 className="text-[28px] font-black text-[#00004d] leading-[1.1]">
              Hire easy
            </h1>
            <h1 className="text-[28px] font-black text-[#00004d] leading-[1.1]">
              Get hired easy
            </h1>
          </div>      
                    <div className="relative w-full max-w-[310px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#00004d]" strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              className="block w-full pl-12 pr-4 py-4 bg-white border-none rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-[#00004d] font-bold"
            />
          </div>
        </div>
      </section>
      <section className="max-w-md mx-auto px-10 -mt-8">
        <div className="flex flex-col gap-3 items-center">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="w-full max-w-[240px] transition-transform active:scale-95">
              <div className="flex items-center justify-start gap-4 py-3.5 px-6 bg-white rounded-full shadow-md border border-gray-100 text-[#00004d] hover:shadow-lg transition-all">
                <span className="text-[#00004d]">{action.icon}</span>
                <span className="font-bold text-[13px] tracking-tight">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 mt-14">
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-gray-100">
          <h3 className="text-xl font-black text-[#00004d] flex items-center gap-2 uppercase tracking-tighter">
            <TrendingUp size={22} className="text-[#00004d]" />
            Featured Jobs
          </h3>
          <Link href="/jobs" className="text-[10px] font-black text-white bg-[#00004d] px-5 py-2.5 rounded-full uppercase tracking-widest shadow-md">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredJobs.map((job, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] border border-gray-50 p-7 flex flex-col gap-5 hover:shadow-2xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm bg-white flex items-center justify-center p-2">
                  <Image 
                    src={job.img}
                    alt="job logo" 
                    fill 
                    unoptimized={true} 
                    className="object-contain p-2"
                  />
                </div>
                <button className="text-gray-200 hover:text-red-500 transition-colors bg-gray-50 p-2.5 rounded-full">
                  <Heart size={20} />
                </button>
              </div>
              
              <div className="mt-2">
                <h4 className="font-black text-[#00004d] text-lg leading-tight group-hover:text-blue-800 transition-colors">
                  {job.title}
                </h4>
                <div className="flex items-center gap-2 mt-3 text-xs font-bold text-gray-400 uppercase tracking-wide">
                  <MapPin size={14} className="text-[#000a31]" />
                  {job.loc}
                </div>
              </div>

              <button className="w-full py-4 bg-[#f1f5f9] text-[#00004d] text-xs font-black rounded-2xl group-hover:bg-[#00004d] group-hover:text-white transition-all shadow-sm uppercase tracking-widest">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}