"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, User, Loader2, Heart } from "lucide-react"; // Heart import as it is
import { LuChevronsRight } from "react-icons/lu";
import { IoIosPin } from "react-icons/io";
import { MALE_ICON, FEMALE_ICON } from "../constants";
import Pagination from "../../components/Pagination";
import toast, { Toaster } from "react-hot-toast";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const whiteFilter = {
    filter: "brightness(0) invert(1)",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);

    if (value.trim().length > 0) {
      const filtered = applicants
        .filter((app) =>
          app.fullName.toLowerCase().includes(value.toLowerCase()) ||
          (app.category && app.category.toLowerCase().includes(value.toLowerCase()))
        )
        .map((app) => (app.category && app.category.toLowerCase().includes(value.toLowerCase()) ? app.category : app.fullName));

      const uniqueSuggestions = Array.from(new Set(filtered)).slice(0, 5);
      setSuggestions(uniqueSuggestions as string[]);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (selectedQuery?: string) => {
    const finalQuery = selectedQuery || searchQuery;
    setSearchQuery(finalQuery);
    setShowSuggestions(false);
  };

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
        const applicant = applicants.find(a => a._id === id);
        const isCurrentlySaved = applicant?.savedBy?.includes(currentUserId);
        
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
    return (
      app.fullName?.toLowerCase().includes(query) ||
      app.category?.toLowerCase().includes(query) ||
      app.city?.toLowerCase().includes(query)
    );
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
    <main className="min-h-screen bg-[#e6e8e8] pb-20 font-sans">
      <Toaster position="top-center" />
      <section className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center relative shadow-sm">
        <h1 style={{ fontFamily: 'Fontatica' }} className="text-[35px] text-[#5DBB63] leading-tight text-center">
          Hire Experts <br /> Get Quality Work
        </h1>
      </section>
      
      {/* Search Section */}
      <div className="relative -mt-8 flex justify-center px-6 z-30" ref={searchRef}>
        <div className="relative w-full max-w-[280px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#00004d]" strokeWidth={3} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search candidates..."
            className="block w-full pl-11 pr-14 py-3 bg-[#e1eaed] rounded-[15px] shadow-lg text-sm text-[#00004d] font-bold outline-none"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
            <div className="h-5 w-[1.5px] bg-[#00004d]"></div>
            <button onClick={() => handleSearch()} className="text-[#00004d] font-black text-[15px] hover:opacity-70">
              Go
            </button>
          </div>
        </div>
      </div>

      <section className="max-w-[360px] mx-auto px-4 mt-10">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00004d]" /></div>
          ) : (
            <>
              {currentItems.length > 0 ? (
                currentItems.map((app) => {
                  {/* Logic to check if saved */}
                  const isSaved = currentUserId && app.savedBy?.includes(currentUserId);

                  return (
                    <div
                      key={app._id}
                      onClick={() => router.push(`/applicants/${app._id}`)}
                      className="bg-white border border-gray-100 rounded-[15px] flex items-stretch shadow-md h-[100px] cursor-pointer overflow-hidden transition-transform active:scale-95"
                    >
                      <div className={`relative w-24 shrink-0 overflow-hidden flex items-center justify-center ${
                        app.image === "male" ? "bg-[#00004d]" : 
                        app.image === "female" ? "bg-[#5DBB63]" : 
                        "bg-gray-100"
                      }`}>
                        {app.image === "male" ? (
                          <Image src={MALE_ICON} alt="M" className="object-contain" width={52} height={52} style={whiteFilter} unoptimized />
                        ) : app.image === "female" ? (
                          <Image src={FEMALE_ICON} alt="F" className="object-contain" width={52} height={52} style={whiteFilter} unoptimized />
                        ) : app.image?.length > 20 ? (
                          <Image src={app.image} alt="U" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full">
                            <User size={30} className="text-[#00004d]" />
                          </div>
                        )}
                      </div>              
                      
                      <div className="flex flex-col flex-1 p-2 justify-between min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2 min-w-0">
                            <h2 className="text-[13px] font-black text-[#00004d] truncate">{app.fullName}</h2>
                            <span className="text-[9px] font-bold text-[#00004d] bg-gray-100 px-1.5 py-[2px] rounded-md whitespace-nowrap">
                              Age {calculateAge(app.dob)}
                            </span>
                          </div>
                            <Heart
                            size={16}
                            className={`shrink-0 transition-all duration-300 ${isSaved ? "text-[#00004d] fill-[#00004d]" : "text-[#00004d]"}`}
                            onClick={(e) => handleToggleSave(e, app._id)}
                          />
                        </div>

                        <div className="space-y-0">
                          <p className="text-[10px] font-bold text-[#00004d] opacity-90 truncate">Profession: {app.category || "Consultant"}</p>
                          <p className="text-[10px] font-bold text-[#00004d] opacity-90 truncate">Edu. {app.education || "N/A"}</p>
                          <p className="text-[10px] font-bold text-[#00004d]">{calculateTotalExperience(app.experience, app.isFresher)}</p>
                        </div>

                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center gap-0.5 text-[#5DBB63] ml-[-4]">
                            <IoIosPin size={12} />
                            <span className="font-bold text-[10px]">{app.city}</span>
                          </div>
                          <span className="text-[#5DBB63] font-black text-[10px] flex items-center">
                            Visit my profile <LuChevronsRight size={14} strokeWidth={3} />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-[#00004d] font-bold">No candidates found</div>
              )}

              {filteredApplicants.length > itemsPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page: number) => { setCurrentPage(page); window.scrollTo(0, 0); }}
                />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}