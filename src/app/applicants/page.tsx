"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, User, Loader2, Sparkles, Bookmark } from "lucide-react";
import { LuChevronsRight } from "react-icons/lu";
import { IoIosPin } from "react-icons/io";
import { MALE_ICON, FEMALE_ICON } from "../constants";
import Pagination from "../../components/Pagination";
import toast, { Toaster } from "react-hot-toast";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const navyBlueFilter = {
    filter: "invert(7%) sepia(76%) saturate(5793%) hue-rotate(241deg) brightness(91%) contrast(108%)"
  };

  const fetchApplicants = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setCurrentUserId(parsedUser._id || parsedUser.id);
      }

      const res = await fetch("https://easyjobspk.onrender.com/api/applications/all-applicants", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      const approvedOnly = Array.isArray(data) ? data.filter((app: any) => app.status === "shortlisted") : [];
      setApplicants(approvedOnly);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleToggleSave = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token || !currentUserId) {
      toast.error("Please login to save applicants!");
      return;
    }
    try {
      const res = await fetch(`https://easyjobspk.onrender.com/api/applications/${id}/save`, {
        method: "PATCH",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      if (res.ok) {
        const isCurrentlySaved = applicants.find(a => a._id === id)?.savedBy?.includes(currentUserId);
        setApplicants(prev => prev.map(app => {
          if (app._id === id) {
            const newSavedBy = isCurrentlySaved 
              ? app.savedBy.filter((uid: string) => uid !== currentUserId)
              : [...(app.savedBy || []), currentUserId];
            return { ...app, savedBy: newSavedBy };
          }
          return app;
        }));
        isCurrentlySaved ? toast.success("Removed from saved") : toast.success("Applicant Saved!");
      }
    } catch (error) { toast.error("Error toggling save"); }
  };

  const filteredApplicants = applicants.filter((app) => {
    const query = searchQuery.toLowerCase();
    return app.fullName?.toLowerCase().includes(query) || app.category?.toLowerCase().includes(query) || app.city?.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const currentItems = filteredApplicants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const calculateTotalExperience = (expArray: any[], isFresher: boolean) => {
    if (isFresher || !expArray || expArray.length === 0) return "Fresher";
    let totalMonths = 0;
    expArray.forEach((exp) => {
      const start = new Date(exp.startDate), end = exp.isCurrentJob ? new Date() : new Date(exp.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (diff > 0) totalMonths += diff;
      }
    });
    const yrs = Math.floor(totalMonths / 12), mths = totalMonths % 12;
    return yrs > 0 ? `Exp ${yrs}${mths > 0 ? `.${Math.round(mths / 1.2)}` : ""} Years` : `Exp ${mths} Months`;
  };

  return (
    <main className="min-h-[59vh] bg-[#e1eaed] pb-20 font-sans">
      <Toaster position="top-center" />
      <section className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center relative">
      <h1 style={{ fontFamily: 'Fontatica' }} className="text-[35px] text-[#5DBB63] leading-tight text-center">Hire Experts <br /> Get Quality Work</h1>
      </section>

      <div className="relative -mt-7 flex justify-center px-6 z-30">
        <div className="relative w-full max-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#00004d]" strokeWidth={3} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search candidates..."
            className="block w-full pl-11 pr-4 py-2.5 bg-white rounded-[15px] shadow-lg text-sm text-[#00004d] font-bold outline-none"
          />
        </div>
      </div>

      <section className="max-w-[360px] mx-auto px-4 mt-6">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00004d]" /></div>
          ) : (
            <>
              {currentItems.map((app) => (
                <div key={app._id} onClick={() => router.push(`/applicants/${app._id}`)} className="bg-white border border-gray-100 rounded-[15px] p-3 flex items-center gap-3 shadow-md h-[100px] cursor-pointer">
                  <div className="w-16 h-16 rounded-full relative bg-[#f8fafc] border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {app.image === "male" ? <Image src={MALE_ICON} alt="M" fill className="object-contain p-1.5" style={navyBlueFilter} unoptimized /> 
                    : app.image === "female" ? <Image src={FEMALE_ICON} alt="F" fill className="object-contain p-1.5" style={navyBlueFilter} unoptimized />
                    : app.image?.length > 20 ? <Image src={app.image} alt="U" fill className="object-cover" unoptimized />
                    : <User size={30} className="text-[#00004d]" />}
                  </div>

                  <div className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 items-center truncate">
                        <h2 className="text-[14px] font-black text-[#00004d] truncate">{app.fullName}</h2>
                        <span className="text-[9px] font-bold text-[#00004d] bg-gray-100 px-1.5 py-0.5 rounded-md">Age {calculateAge(app.dob)}</span>
                      </div>
                      <button onClick={(e) => handleToggleSave(e, app._id)} className="p-1">
                        <Bookmark size={18} className={app.savedBy?.includes(currentUserId) ? "fill-[#00004d] text-[#00004d]" : "text-gray-400"} />
                      </button>
                    </div>
                    <p className="text-[11px] font-bold text-[#00004d] opacity-90 truncate">{app.category}</p>
                    <p className="text-[10px] font-bold text-[#00004d] mt-0.5">{calculateTotalExperience(app.experience, app.isFresher)}</p>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center gap-1 text-[#5DBB63]"><IoIosPin size={13} /><span className="font-bold text-[10px]">{app.city}</span></div>
                      <button className="text-[#5DBB63] font-black text-[10px] flex items-center">View Profile <LuChevronsRight size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredApplicants.length > itemsPerPage && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page: number) => { setCurrentPage(page); window.scrollTo(0,0); }} />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}