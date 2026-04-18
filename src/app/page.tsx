"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  PlusCircle,
  Briefcase,
  Users,
  ClipboardList,
  ChevronDown,
  User,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [visitorCount, setVisitorCount] = useState<number>(0);

  const quickActions = [
    { label: "Apply for a Job", icon: <Briefcase size={18} />, href: "/application" },
    { label: "Post a Job", icon: <PlusCircle size={18} />, href: "/dashboard/employer" },
    { label: "Job Seekers", icon: <Users size={18} />, href: "/dashboard/jobseeker" },
    { label: "Job Offers", icon: <ClipboardList size={18} />, href: "/jobs" },
  ];

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://easyjobspk.onrender.com/api/applications/employer/all-applicants", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setApplicants(data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io("https://easyjobspk.onrender.com/");
    socket.on("visitorCount", (count: number) => {
      setVisitorCount(count);
    });

    fetchApplicants();

    return () => {
      socket.disconnect();
    };
  }, []);

  const getExperienceLabel = (app: any) => {
    if (app.isFresher || !app.experience || app.experience.length === 0) {
      return "Fresher";
    }

    let totalMonths = 0;
    app.experience.forEach((exp: any) => {
      const start = new Date(exp.startDate);
      const end = exp.isCurrentJob ? new Date() : new Date(exp.endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, months);
      }
    });

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years > 0) {
      return `${years} Year${years > 1 ? 's' : ''} ${months > 0 ? `${months} Mo` : ''} `;
    } else if (months > 0) {
      return `${months} Month${months > 1 ? 's' : ''} `;
    } else {
      return "Fresher";
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-8 font-sans">
      <section className="px-0 pt-0 relative">
        <div className="bg-[#e2f2f5] rounded-b-[35px] pt-12 pb-12 px-6 flex flex-col items-center shadow-sm relative">
          <div className="bg-white text-[#00004d] font-black px-3 py-1 rounded-full tracking-tighter text-[10px] absolute top-2 z-30 shadow-md border border-[#00004d] whitespace-nowrap">
             Real-time Visitors: 300{visitorCount}
          </div>            
          <div className="text-center mb-1 mt-6">
            <h1 className="text-[22px] font-black text-[#00004d] leading-none">Hire easy</h1>
            <h1 className="text-[22px] font-black text-[#00004d] leading-tight">Get hired easy</h1>
          </div>
          <div className="relative w-full max-w-[250px] mt-4">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#00004d]" strokeWidth={3} />
            </div>
            <input type="text" placeholder="Search jobs..." className="block w-full pl-9 pr-4 py-2 bg-white border border-[#00004d] rounded-full shadow-md text-xs text-[#00004d] font-bold outline-none" />
          </div>
        </div>
      </section>

      <section className="max-w-md mx-auto px-6 -mt-6 relative z-20">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="w-full max-w-[210px] transition-transform active:scale-95">
              <div className="flex items-center justify-center gap-2 h-[40px] bg-[#e2f2f5] rounded-full shadow border border-[#00004d] text-[#00004d] hover:bg-[#00004d] hover:text-white transition-all duration-300 group">
                <span>{action.icon}</span>
                <span className="font-bold text-[13px] whitespace-nowrap">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-[280px] mx-auto px-4 mt-6 mb-4 relative z-30">
        <div className="bg-[#00004d] text-white rounded-2xl flex flex-col items-center justify-center h-16 shadow-sm border border-white"> 
          <span className="text-[14px] font-black tracking-[0.2em] leading-none mb-1 text-center px-4">
            I am seeking for a job
          </span>
          <div className="flex flex-col items-center -space-y-3 animate-bounce">
            <ChevronDown size={20} strokeWidth={4} />
            <ChevronDown size={20} strokeWidth={4} className="opacity-40" />
          </div>
        </div>
      </section>

      <section className="max-w-[360px] mx-auto px-4 mt-2 mb-10">
        <div className="flex flex-col gap-3">
          {loading ? (
             <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00004d]" /></div>
          ) : applicants.length > 0 ? (
            applicants.map((app: any, idx) => (
              <div key={idx} className="bg-[#e2f2f5] border border-gray-100 rounded-3xl p-3 flex items-center gap-4 relative shadow-sm h-28">
                
                <div className="w-16 h-16 rounded-full border-2 border-[#00004d] overflow-hidden relative bg-gray-50 flex items-center justify-center">
                  {app.image ? (
                    <Image 
                      src={app.image.startsWith('http') ? app.image : `https://easyjobspk.onrender.com/uploads/${app.image}`} 
                      alt={app.fullName || "User"} 
                      fill 
                      className="object-cover" 
                      unoptimized 
                    />
                  ) : (
                    <User size={30} className="text-gray-300" />
                  )}
                </div>

                <div className="flex flex-col overflow-hidden flex-1">
                  <h2 className="text-base font-black text-[#00004d] truncate">{app.fullName || "Anonymous"}</h2>
                  <p className="text-[12px] font-bold text-gray-700 truncate">{app.category || "Applicant"}</p>
                  
                  <span className="text-[10px] font-bold text-gray-400 mt-1">
                    {getExperienceLabel(app)}
                  </span>
                </div>

                <div className="absolute top-3 right-4 flex flex-col items-center">
                  <MapPin size={14} className="text-[#00004d]" strokeWidth={4} />
                  <span className="font-bold text-[#00004d] text-[9px] uppercase">{app.city || "PK"}</span>
                </div>

                <button 
                  onClick={() => router.push(`/dashboard/employer/applicants/${app._id}`)}
                  className="absolute bottom-3 right-4 bg-[#00004d] text-white px-2 py-1 rounded-full text-[11px] font-bold shadow-sm active:scale-95 transition-transform"
                >
                  Visit my profile
                </button>
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