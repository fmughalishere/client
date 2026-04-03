"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Heart,
  TrendingUp,
  Smartphone,
} from "lucide-react";

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [userLink, setUserLink] = useState("/login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.log("SW error", err));
    }

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      const user = JSON.parse(storedUser);
      setUserLink(user.role === "employer" ? "/dashboard/employer" : "/dashboard/jobseeker");
    } else {
      setIsLoggedIn(false);
      setUserLink("/login");
    }

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

  const quickActions = [
    { src: "/images/IMG (5).png", alt: "Apply For A Job", href: "/jobs" },
    { src: "/images/IMG (2).png", alt: "Post A Job", href: "/dashboard/employer" },
    { src: "/images/IMG (4).png", alt: "Job Seekers", href: "/dashboard/employer" },
    { src: "/images/IMG (3).png", alt: "Job Offers", href: "/jobs" },
  ];

  const featuredJobs = [
    { title: "Junior Accounts Assistant", loc: "Urdu Bazar, Lahore", img: "/images/icon.jpeg" },
    { title: "Europe Jobs / Greece Visa", loc: "Allama Iqbal Town, Lahore", img: "/images/icon.jpeg" },
    { title: "Factory Hiring Helper", loc: "S.I.E, Gujranwala", img: "/images/icon.jpeg" },
  ];

  return (
    <main className="min-h-screen bg-white pb-16">
            <section className="px-5 pt-0 ">
        <div className="bg-[#DCC5A1] rounded-b-[45px] pt-8 pb-10 px-6 flex flex-col items-center h-50">          <div className="text-center mb-12">
            <h1 className="text-[24px] font-bold text-[#002D62] leading-tight">
              Hire easy
            </h1>
            <h1 className="text-[24px] font-bold text-[#002D62] leading-tight">
              Get hired easy
            </h1>
          </div>
          <div className="relative w-full max-w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-700" strokeWidth={2} />
            </div>
            <input
              type="text"
              placeholder=""
              className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </section>
      {showInstallBtn && (
        <div className="fixed bottom-20 right-4 z-40">
           <button
            onClick={handleInstallClick}
            className="bg-[#00d26a] text-white p-3 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-bounce"
          >
            <Smartphone size={20} />
            <span className="text-xs">Install App</span>
          </button>
        </div>
      )}
      <section className="max-w-6xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="block transition-transform active:scale-95">
              <div className="relative h-20 w-full overflow-hidden rounded-2xl shadow-md border border-gray-100">
                <Image
                  src={action.src}
                  alt={action.alt}
                  fill
                  className="object-contain bg-white px-2"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 mt-12">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-100">
          <h3 className="text-xl font-black text-[#002D62] flex items-center gap-2">
            <TrendingUp size={22} className="text-green-500" />
            Featured Jobs
          </h3>
          <Link href="/jobs" className="text-xs font-bold text-white bg-[#002D62] px-4 py-2 rounded-lg">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col gap-4 hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-xl overflow-hidden relative border">
                  <Image src={job.img} alt="job" fill className="object-cover" />
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-full">
                  <Heart size={18} />
                </button>
              </div>
              <h4 className="font-bold text-[#002D62] text-md leading-tight">{job.title}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={14} className="text-green-500" />
                {job.loc}
              </div>
              <button className="w-full py-2.5 bg-slate-100 text-[#002D62] text-sm font-bold rounded-xl group-hover:bg-[#002D62] group-hover:text-white transition-all">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}