"use client";

import Image from "next/image";
import {
  Search, PlusCircle, Briefcase, Users, ClipboardList,
  ChevronDown, Loader2, User,
  ChevronRight, Home, LayoutDashboard, Plus
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { IoIosPin } from "react-icons/io";
import { LuChevronsRight } from "react-icons/lu";
import { MALE_ICON, FEMALE_ICON } from "./constants";

export default function HomePage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [visitorCount, setVisitorCount] = useState(0);

  const navyBlueFilter = {
    filter: "invert(7%) sepia(76%) saturate(5793%) hue-rotate(241deg) brightness(91%) contrast(108%)"
  };

  const quickActions = [
    { label: "Apply for a Job", icon: <Briefcase size={18} style={{ color: "#5DBB63" }} />, href: "/application" },
    { label: "Post a Job", icon: <PlusCircle size={18} style={{ color: "#5DBB63" }} />, href: "/dashboard/employer/post-job" },
    { label: "Job Seekers", icon: <Users size={18} style={{ color: "#5DBB63" }} />, href: "/dashboard/jobseeker" },
    { label: "Job Offers", icon: <ClipboardList size={18} style={{ color: "#5DBB63" }} />, href: "/jobs" },
  ];

  const fetchApplicants = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://easyjobspk.onrender.com/api/applications/employer/all-applicants", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setApplicants(data);
    } catch (error) {
      console.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const socket = io("https://easyjobspk.onrender.com/");
    socket.on("visitorCount", (count: number) => setVisitorCount(count));
    fetchApplicants();
    return () => { socket.disconnect(); };
  }, [fetchApplicants]);

  const handleSearch = () => {
    if (searchQuery.trim()) router.push(`/jobs?search=${searchQuery}`);
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const calculateTotalExperience = (experienceArray: any[], isFresher: boolean) => {
    if (isFresher || !experienceArray || experienceArray.length === 0) {
      return "Fresher";
    }

    let totalMonths = 0;
    experienceArray.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.isCurrentJob ? new Date() : new Date(exp.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (diffInMonths > 0) totalMonths += diffInMonths;
      }
    });

    if (totalMonths === 0) return "Fresher";
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years > 0) {
      return `Exp ${years}${months > 0 ? `.${Math.round(months / 1.2)}` : ""} ${years === 1 && months === 0 ? "Year" : "Years"}`;
    } else {
      return `Exp ${months} Months`;
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-8 font-sans">
      <section className="px-0 pt-0 relative">
        <div className="bg-[#5DBB63] rounded-b-[50px] pt-12 pb-20 px-6 flex flex-col items-center shadow-lg relative overflow-hidden">
            <div className="absolute left-[-40px] top-6 w-48 h-48 opacity-30 pointer-events-none">
            <Image src="/images/chair.png" alt="chair" fill className="object-contain" />
          </div>
          <div className="absolute right-[-40px] top-6 w-48 h-48 opacity-30 pointer-events-none">
            <Image src="/images/need-job.png" alt="need job" fill className="object-contain" />
          </div>

          <div className="text-center mb-1 relative z-10">
            <h1 className="text-[32px] font-black text-white leading-tight">Hire easy</h1>
            <h1 className="text-[32px] font-black text-white leading-tight">Get hired easy</h1>
          </div>
          <div className="relative w-full max-w-[300px] mt-10 z-10">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#00004d]" strokeWidth={3} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search jobs..."
              className="block w-full pl-11 pr-16 py-4 bg-white border-2 border-[#00004d] rounded-[18px] shadow-2xl text-sm text-[#00004d] font-bold outline-none"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-5 gap-2">
              <div className="h-6 w-[1px] bg-[#00004d]"></div>
              <button onClick={handleSearch} className="text-[#00004d] font-black text-[16px]">Go</button>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-md mx-auto px-6 -mt-10 relative z-20">
        <div className="flex flex-col gap-3 items-center justify-center w-full">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => router.push(action.href)}
              className="w-full max-w-[250px] transition-transform active:scale-95"
            >
              <div className="relative flex items-center h-[50px] bg-[#00004d] rounded-2xl text-white shadow-xl px-5">
                <div className="shrink-0 z-10">
                  {action.icon}
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-bold text-[15px]">
                    {action.label}
                  </span>
                </div>
                <div className="ml-auto z-10">
                  <ChevronRight size={22} className="text-white/80" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="max-w-[340px] mx-auto px-4 mt-8 mb-4 relative z-30">
        <div className="bg-[#5DBB63] text-white rounded-2xl flex flex-col items-center justify-center h-18 py-3 shadow-md ">
          <span className="text-[17px] font-black tracking-[0.1em] animate-bounce">I am seeking for a job</span>
          <div className="flex flex-col items-center mt-1 -space-y-3 animate-bounce">
            <ChevronDown size={22} strokeWidth={4} />
            <ChevronDown size={22} strokeWidth={4} className="opacity-40" />
          </div>
        </div>
      </section>
      <section className="max-w-[360px] mx-auto px-4 mt-2 mb-10">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00004d]" /></div>
          ) : applicants.length > 0 ? (
            applicants.map((app: any, idx: number) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-[15px] p-3 flex items-center gap-3 relative shadow-md h-[95px]">
                <div className="w-16 h-16 rounded-full flex-shrink-0 relative bg-[#f8fafc] border border-gray-100 flex items-center justify-center overflow-hidden">
                  {app.image === "male" ? (
                    <Image src={MALE_ICON} alt="Male" fill className="object-contain p-1.5" style={navyBlueFilter} unoptimized />
                  ) : app.image === "female" ? (
                    <Image src={FEMALE_ICON} alt="Female" fill className="object-contain p-1.5" style={navyBlueFilter} unoptimized />
                  ) : app.image && app.image.length > 20 ? (
                    <Image src={app.image} alt="User" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="bg-[#00004d] w-full h-full flex items-center justify-center">
                      <User size={30} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-black text-[#00004d] truncate">{app.fullName}</h2>
                    <span className="text-[10px] font-bold text-[#00004d] bg-gray-100 px-1.5 py-0.5 rounded-md">
                      Age {calculateAge(app.dob)}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-[#00004d] opacity-90 truncate">{app.category || "Consultant"}</p>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#00004d]">{app.education || "BSIT"}</div>
                  <p className="text-[10px] font-bold text-[#00004d] mt-0.5">{calculateTotalExperience(app.experience, app.isFresher)}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#5DBB63]">
                      <IoIosPin size={13} />
                      <span className="font-bold text-[10px]">{app.city}</span>
                    </div>
                    <button onClick={() => router.push(`/applicants/${app._id}`)} className="text-[#5DBB63] font-black text-[10px] flex items-center gap-0.5">
                      Visit my profile <LuChevronsRight size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 font-bold py-10">No applicants found yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}