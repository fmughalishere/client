"use client";

import {
  Search,
  PlusCircle,
  Briefcase,
  Users,
  ClipboardList,
  ChevronDown,
  Loader2,
  User,
  Heart,
} from "lucide-react";

import { IoIosPin } from "react-icons/io";
import { LuChevronsRight } from "react-icons/lu";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

import { MALE_ICON, FEMALE_ICON } from "./constants";

export default function HomePage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const router = useRouter();

  const searchRef = useRef<HTMLDivElement>(null);

  const whiteFilter = {
    filter: "brightness(0) invert(1)",
  };

  const quickActions = [
    {
      label: "Apply for a Job",
      icon: (
        <Briefcase
          size={28}
          style={{ color: "#5DBB63" }}
        />
      ),
      href: "/application",
    },

    {
      label: "Post a Job",
      icon: (
        <PlusCircle
          size={28}
          style={{ color: "#5DBB63" }}
        />
      ),
      href: "/post-job",
    },

    {
      label: "Job Seekers",
      icon: (
        <Users
          size={28}
          style={{ color: "#5DBB63" }}
        />
      ),
      href: "/applicants",
    },

    {
      label: "Job Offers",
      icon: (
        <ClipboardList
          size={28}
          style={{ color: "#5DBB63" }}
        />
      ),
      href: "/jobs",
    },
  ];

  const fetchApplicants = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const userData =
        typeof window !== "undefined"
          ? localStorage.getItem("user")
          : null;

      if (userData) {
        const parsedUser = JSON.parse(userData);

        setCurrentUserId(
          parsedUser._id || parsedUser.id
        );
      }

      const res = await fetch(
        "https://easyjobspk.onrender.com/api/applications/all-applicants",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const approvedOnly = Array.isArray(data)
        ? data.filter(
          (app: any) =>
            app.status === "shortlisted"
        )
        : [];

      const latestApplicants = approvedOnly.reverse();

      setApplicants(latestApplicants);
    } catch (error) {
      console.error(
        "Error fetching applicants:",
        error
      );
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

  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const calculateTotalExperience = (expArray: any[], isFresher: boolean) => {
    if (isFresher || !expArray || expArray.length === 0) return "Fresher";
    let totalMonths = 0;
    expArray.forEach((exp) => {
      const start = new Date(exp.startDate);
      const end = exp.isCurrentJob ? new Date() : new Date(exp.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (diff > 0) totalMonths += diff;
      }
    });
    const yrs = Math.floor(totalMonths / 12);
    return yrs > 0 ? `Exp: ${yrs} Years` : `Exp: ${totalMonths % 12} Months`;
  };

  return (
    <main className="min-h-screen bg-[#e6e8e8] font-sans pb-20">
      <Toaster position="top-center" />
      <section className="px-0 pt-0 relative">
        <div className="bg-white rounded-b-[40px] pt-6 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="text-center mb-1 mt-0 relative z-10">
            <h1 style={{ fontFamily: "Fontatica" }} className="text-[35px] text-[#5DBB63] leading-none">Hire Easy</h1>
            <h1 style={{ fontFamily: "Fontatica" }} className="text-[35px] text-[#5DBB63] leading-tight">Get Hired Easy</h1>
            <h5 className="text-[16px] text-[#00004d] leading-tight">Totally <span className="font-bold">FREE</span> for Job Seekers!</h5>
          </div>
        </div>

        <div className="relative -mt-8 flex justify-center px-6 z-30">
          <div ref={searchRef} className="relative w-full max-w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#00004d]" strokeWidth={3} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs/employees"
              className="block w-full pl-11 pr-16 py-3 bg-[#e1eaed] rounded-[15px] shadow-lg text-sm text-[#00004d] font-bold outline-none"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
              <div className="h-5 w-[1.5px] bg-[#00004d]" />
              <button className="text-[#00004d] font-black text-[15px] hover:opacity-70">Go</button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 mt-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full justify-items-center">
          {quickActions.map((action, i) => (
            <button key={i} onClick={() => router.push(action.href)} className="w-full max-w-[140px] transition-transform active:scale-95">
              <div className="flex flex-col items-center justify-center aspect-square bg-white rounded-2xl text-[#00004d] shadow-md border border-gray-50 p-4">
                <div className="mb-2">{action.icon}</div>
                <span className="text-[13px] font-black text-[#00004d] text-center leading-tight">{action.label}</span>
              </div>
            </button>
          ))}
        </div>

        <section className="max-w-[360px] mx-auto mt-6 mb-4 relative z-10">
          <div className="bg-[#00004d] text-[#5DBB63] rounded-2xl flex flex-col items-center justify-center h-16 shadow-sm">
            <span className="text-[18px] font-black leading-none mt-3 animate-bounce">I am seeking for a job</span>
            <div className="flex flex-col items-center mt-2 -space-y-3 animate-bounce">
              <ChevronDown size={20} strokeWidth={4} />
              <ChevronDown size={20} strokeWidth={4} className="opacity-40" />
            </div>
          </div>
        </section>

        <section className="max-w-[360px] mx-auto mt-1 mb-1">
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00004d]" /></div>
            ) : applicants.length > 0 ? (
              <>
                {applicants.slice(0, 10).map((app, idx) => {
                  const isSaved = currentUserId && app.savedBy?.includes(currentUserId);
                  return (
                    <div key={idx} onClick={() => router.push(`/applicants/${app._id}`)} className="bg-white border border-gray-100 rounded-[15px] flex items-stretch shadow-md min-h-[50px] cursor-pointer overflow-hidden transition-transform active:scale-95">
                      <div className={`relative w-24 shrink-0 overflow-hidden flex items-center justify-center ${
                        app.image === "male" ? "bg-[#00004d]" : app.image === "female" ? "bg-[#5DBB63]" : "bg-gray-100"
                      }`}>
                        {app.image === "male" ? (
                          <Image src={MALE_ICON} alt="M" width={52} height={52} className="object-contain" style={whiteFilter} unoptimized />
                        ) : app.image === "female" ? (
                          <Image src={FEMALE_ICON} alt="F" width={52} height={52} className="object-contain" style={whiteFilter} unoptimized />
                        ) : app.image && app.image.length > 20 ? (
                          <Image src={app.image} alt="U" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="bg-[#00004d] h-full w-full flex items-center justify-center">
                            <User size={24} strokeWidth={2.5} className="text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-2 justify-between min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2 min-w-0">
                            <h2 className="text-[13px] font-black text-[#00004d] truncate">{app.fullName}</h2>
                            <span className="text-[9px] font-bold text-[#00004d] bg-gray-100 px-1.5 py-[2px] rounded-md whitespace-nowrap">Age {calculateAge(app.dob)}</span>
                          </div>
                          <Heart size={16} className={`shrink-0 transition-all duration-300 ${isSaved ? "text-[#00004d] fill-[#00004d]" : "text-[#00004d]"}`} onClick={(e) => handleToggleSave(e, app._id)} />
                        </div>
                        <div className="space-y-0 text-[10px] font-bold text-[#00004d] opacity-90">
                          <p className="truncate">Profession: {app.category || "Consultant"}</p>
                          <p className="truncate">Edu. {app.education || "N/A"}</p>
                          <p>{calculateTotalExperience(app.experience, app.isFresher)}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center gap-0.5 text-[#5DBB63]"><IoIosPin size={12} /><span className="font-bold text-[10px]">{app.city}</span></div>
                          <span className="text-[#5DBB63] font-black text-[10px] flex items-center">Visit my profile <LuChevronsRight size={14} strokeWidth={3} /></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-center mt-6 mb-10">
                  <button
                    onClick={() => router.push("/applicants")}
                    className="bg-[#5DBB63] font-bold text-white px-8 py-3 rounded-[12px] text-[14px] flex items-center gap-2 shadow-xl active:scale-95 transition-all"
                  >
                    Explore More Applicants
                    <LuChevronsRight size={20} strokeWidth={3} className="animate-pulse" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400 font-bold py-10">No applicants found yet.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}