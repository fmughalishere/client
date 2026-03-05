"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Heart,
  FileText,
  UserCheck,
  TrendingUp,
  Globe,
  PlusCircle,
  Share2,
  Smartphone 
} from "lucide-react";

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    // 1. Service Worker Register karna (PWA Requirement)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(err => console.log("SW error", err));
    }

    // 2. Install Prompt ko capture karna
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    });

    window.addEventListener("appinstalled", () => {
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
        alert("Shortcut feature is ready! If you don't see the popup, please use the browser menu (3 dots) and click 'Install App'.");
        return;
    }
    // Browser ka confirmation popup dikhana
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    }
  };

  const quickActions = [
    { title: "Foreign Jobs", icon: Globe, href: "/jobs/foreign" }, 
    { title: "Start Applying", icon: FileText, href: "/jobs" },
    { title: "Start Hiring", icon: UserCheck, href: "/dashboard/employer" },
    { title: "Govt Jobs", icon: Clock, href: "/jobs" },
    { title: "Browse CVs", icon: Briefcase, href: "/dashboard/employer" }
  ];

  const featuredJobs = [
    { title: "Junior Accounts Assistant", loc: "Urdu Bazar, Lahore", time: "3 days ago", img: "/images/icon.jpeg" },
    { title: "Europe Jobs / Greece Visa", loc: "Allama Iqbal Town, Lahore", time: "27 days ago", img: "/images/icon.jpeg" },
    { title: "Factory Hiring Helper", loc: "S.I.E, Gujranwala", time: "1 day ago", img: "/images/icon.jpeg" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16">
      
      {/* Floating Shortcut Button */}
      <button 
        onClick={handleInstallClick}
        className="fixed bottom-6 right-6 z-50 bg-[#00d26a] text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-110 transition-all active:scale-95 group"
      >
        <Smartphone size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap text-sm">
          Add Shortcut
        </span>
      </button>

      {/* Hero Section */}
      <section className="bg-[#1e3a8a] text-white py-12 px-6 text-center relative overflow-hidden">
        <h1 className="text-2xl md:text-5xl font-extrabold mb-3 tracking-tight">
          Hire Easy, Get Hired Easy
        </h1>
        <p className="text-sm md:text-lg text-blue-100 mb-8 opacity-90">
          Explore thousands of jobs across Pakistan & International Locations
        </p>

        <div className="max-w-2xl mx-auto relative group">
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            className="w-full py-4 pl-6 pr-12 rounded-full text-base text-black outline-none shadow-2xl focus:ring-4 focus:ring-blue-400/30 transition-all"
          />
          <Search size={22} className="absolute right-5 top-1/2 -translate-y-1/2 text-[#1e3a8a]" />
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="hidden md:grid bg-white shadow-2xl rounded-3xl p-8 grid-cols-5 gap-6 border border-slate-100">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:bg-blue-50 transition-all group">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all shadow-sm">
                <action.icon size={32} />
              </div>
              <span className="text-sm font-bold text-slate-700 text-center group-hover:text-[#1e3a8a]">{action.title}</span>
            </Link>
          ))}
        </div>

        <div className="md:hidden space-y-3 mt-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="flex items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-2 rounded-xl text-[#1e3a8a]"><action.icon size={24} /></div>
                <span className="text-base font-bold text-[#1e3a8a]">{action.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-6xl mx-auto px-6 mt-16">
        <div className="flex justify-between items-center mb-8 border-b pb-4 border-slate-100">
          <h3 className="text-2xl md:text-3xl font-black text-[#1e3a8a] flex items-center gap-3">
            <TrendingUp size={28} className="text-[#00d26a]" /> Featured Jobs
          </h3>
          <Link href="/jobs" className="text-sm font-bold text-white bg-[#1e3a8a] px-4 py-2 rounded-lg">View All</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredJobs.map((job, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-2xl transition-all group">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl overflow-hidden relative border">
                    <Image src={job.img} alt="job" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-full"><Heart size={20} /></button>
              </div>
              <h4 className="font-bold text-[#1e3a8a] text-lg mb-1 leading-tight">{job.title}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={16} className="text-[#00d26a]" />{job.loc}</div>
              <button className="w-full py-3 bg-slate-50 text-[#1e3a8a] font-bold rounded-xl group-hover:bg-[#1e3a8a] group-hover:text-white transition-all">Apply Now</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}