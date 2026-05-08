"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, User, Loader2, Sparkles } from "lucide-react";
import { LuChevronsRight } from "react-icons/lu";
import { IoIosPin } from "react-icons/io";
import { MALE_ICON, FEMALE_ICON } from "../constants";


export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const navyBlueFilter = {
    filter: "invert(7%) sepia(76%) saturate(5793%) hue-rotate(241deg) brightness(91%) contrast(108%)"
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
    if (isFresher || !experienceArray || experienceArray.length === 0) return "Fresher";
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
    return years > 0 ? `Exp ${years}${months > 0 ? `.${Math.round(months / 1.2)}` : ""} Years` : `Exp ${months} Months`;
  };

  const fetchApplicants = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("https://easyjobspk.onrender.com/api/applications/all-applicants", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setApplicants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const filteredApplicants = applicants.filter((app) => {
    const query = searchQuery.toLowerCase();
    return (
      app.fullName?.toLowerCase().includes(query) ||
      app.category?.toLowerCase().includes(query) ||
      app.city?.toLowerCase().includes(query)
    );
  });

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-20 font-sans">
      <section className="bg-[#5DBB63] rounded-b-[35px] pt-10 pb-12 px-6 shadow-sm">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full mb-3 shadow-sm border border-[#00004d]/10">
            <Sparkles size={12} className="text-[#00004d]" />
            <span className="text-[9px] font-black text-[#00004d] tracking-widest uppercase">Explore Talent</span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-5">
            Hire Experts <br /> Get Quality Work
          </h1>
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#00004d]" strokeWidth={3} />
            </div>
            <input
              type="text"
              placeholder="Search name, category or city..."
              className="block w-full pl-10 pr-4 py-2.5 bg-white border border-[#00004d] rounded-full shadow-md text-xs text-[#00004d] font-bold outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>
      <section className="max-w-[360px] mx-auto px-4 mt-6">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center p-10">
              <Loader2 className="animate-spin text-[#00004d]" />
            </div>
          ) : filteredApplicants.length > 0 ? (
            filteredApplicants.map((app, idx) => (
              <div 
                key={app._id || idx} 
                onClick={() => router.push(`/applicants/${app._id}`)}
                className="bg-white border border-gray-100 rounded-[15px] p-3 flex items-center gap-3 relative shadow-md h-[100px] cursor-pointer active:scale-95 transition-transform"
              >
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
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[14px] font-black text-[#00004d] leading-tight truncate">
                      {app.fullName}
                    </h2>
                    <span className="text-[9px] font-bold text-[#00004d] bg-gray-100 px-1.5 py-0.5 rounded-md shrink-0">
                      Age {calculateAge(app.dob)}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-[#00004d] opacity-90 truncate">
                    {app.category || "Professional"}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 whitespace-nowrap">
                    <span>{app.education || "Qualification N/A"}</span>
                  </div>

                  <p className="text-[10px] font-bold text-[#00004d] mt-0.5 tracking-tight">
                    {calculateTotalExperience(app.experience, app.isFresher)}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 text-[#5DBB63] ml-[-3px]">
                      <IoIosPin size={13} />
                      <span className="font-bold text-[10px] truncate">{app.city || "Pakistan"}</span>
                    </div>

                    <button className="text-[#5DBB63] font-black text-[10px] flex items-center gap-0.5 shrink-0">
                      View Profile <LuChevronsRight size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold text-sm tracking-widest">No Applicants Found</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}