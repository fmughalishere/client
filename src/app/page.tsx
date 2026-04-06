"use client";

import { useState, useEffect } from "react";
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
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  const featuredJobs = [
    { title: "Junior Accounts Assistant", loc: "Urdu Bazar, Lahore", img: "/images/app_logo.jpeg" },
    { title: "Europe Jobs / Greece Visa", loc: "Allama Iqbal Town, Lahore", img: "/images/app_logo.jpeg" },
    { title: "Factory Hiring Helper", loc: "S.I.E, Gujranwala", img: "/images/app_logo.jpeg" },
  ];

  const quickActions = [
    { label: "Apply For Job", icon: <Briefcase size={20} />, href: "/jobs" },
    { label: "Post A Job", icon: <PlusCircle size={20} />, href: "/dashboard/employer" },
    { label: "Job Seekers", icon: <Users size={20} />, href: "/dashboard/employer" },
    { label: "Job Offers", icon: <ClipboardList size={20} />, href: "/jobs" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      <section className="px-0 pt-0">
        <div className="bg-[#000a31] rounded-b-[45px] pt-8 pb-14 px-6 flex flex-col items-center shadow-lg">
          <div className="text-center mb-5 mt-2"> 
            <h1 className="text-[26px] font-extrabold text-white leading-[1.1]">
              Hire easy
            </h1>
            <h1 className="text-[26px] font-extrabold text-[#94a3b8] leading-[1.1]">
              Get hired easy
            </h1>
          </div>      
          <div className="relative w-full max-w-[310px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder="Search jobs..."
              className="block w-full pl-12 pr-4 py-3 bg-white border-none rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
            />
          </div>
        </div>
      </section>
      <section className="max-w-md mx-auto px-10 -mt-7">
        <div className="flex flex-col gap-3 items-center">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="w-full max-w-[240px] transition-transform active:scale-95">
              <div className="flex items-center justify-start gap-4 py-3.5 px-6 bg-white rounded-full shadow-md border border-gray-100 text-[#000a31] hover:shadow-lg transition-all">
                <span className="text-[#000a31]">{action.icon}</span>
                <span className="font-bold text-[13px] tracking-tight">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
          <h3 className="text-lg font-black text-[#000a31] flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Featured Jobs
          </h3>
          <Link href="/jobs" className="text-[10px] font-bold text-white bg-[#000a31] px-4 py-2 rounded-full uppercase">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-2xl transition-all group">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative border border-gray-100 shadow-sm bg-white">
                  <Image 
                    src={job.img}
                    alt="job logo" 
                    fill 
                    unoptimized={true} 
                    className="object-contain p-1"
                  />
                </div>
                <button className="text-gray-200 hover:text-red-500 transition-colors bg-gray-50 p-2.5 rounded-full">
                  <Heart size={18} />
                </button>
              </div>
              
              <div>
                <h4 className="font-bold text-[#000a31] text-md leading-tight group-hover:text-blue-900 transition-colors">
                  {job.title}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-500 font-medium">
                  <MapPin size={12} className="text-blue-500" />
                  {job.loc}
                </div>
              </div>

              <button className="w-full py-3 bg-[#f1f5f9] text-[#000a31] text-xs font-black rounded-2xl group-hover:bg-[#000a31] group-hover:text-white transition-all shadow-sm">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>
      {showInstallBtn && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleInstallClick}
            className="bg-[#000a31] text-white py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 font-bold active:scale-95 transition-all animate-bounce"
          >
            <PlusCircle size={20} />
            <span className="text-sm">Add Shortcut</span>
          </button>
        </div>
      )}
    </main>
  );
}