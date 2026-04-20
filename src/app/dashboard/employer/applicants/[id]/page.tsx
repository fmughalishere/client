"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  Loader2, 
  User, 
  Calendar, 
  Globe, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Send, 
  CheckCircle 
} from "lucide-react";

import { MOCK_APPLICANTS } from "../../../../../app/page"; 

export default function ApplicantDetail() {
  const { id } = useParams();
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [hiringState, setHiringState] = useState<"idle" | "loading" | "hired">("idle");

  useEffect(() => {
    const fetchApplicant = async () => {
      const mockUser = MOCK_APPLICANTS?.find((u: any) => u._id === id);
      
      if (mockUser) {
        setApplicant(mockUser);
        if (mockUser.status === "Hired" || mockUser.status === "Offered") {
            setHiringState("hired");
        }
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://easyjobspk.onrender.com/api/applications/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data && !data.message) {
            setApplicant(data);
            if (data.status === "Hired" || data.status === "Offered") setHiringState("hired");
        }
      } catch (err) {
        console.error("API error", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplicant();
  }, [id]);

  const handleHireClick = () => {
    setHiringState("loading");

    setTimeout(() => {
      setHiringState("hired");
      setApplicant((prev: any) => ({ ...prev, status: "Hired" }));
    }, 2000);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#e2f2f5]">
      <Loader2 className="animate-spin w-10 h-10 text-[#00004d]" />
    </div>
  );

  if (!applicant) return <div className="p-10 text-center font-bold text-[#00004d]">No data found for this ID</div>;

  return (
    <div className="min-h-screen bg-[#e2f2f5] p-6 pb-24 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="bg-[#00004d] text-white p-6 rounded-3xl shadow-lg flex items-center gap-5">
          <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
            <img
              src={applicant.image || "https://via.placeholder.com/150"}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{applicant.fullName}</h1>
            <p className="text-sm opacity-80">{applicant.email}</p>
            <span className={`mt-2 inline-block text-[10px] px-3 py-1 rounded-full uppercase font-black tracking-wider ${hiringState === 'hired' ? 'bg-green-500' : 'bg-white/20'}`}>
              Status: {applicant.status}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#00004d]">Basic Info</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 font-medium">
            <p className="flex items-center gap-2"><User size={16} className="text-[#00004d]"/> {applicant.gender}</p>
            <p className="flex items-center gap-2"><Calendar size={16} className="text-[#00004d]"/> {applicant.dob ? new Date(applicant.dob).toLocaleDateString() : "N/A"}</p>
            <p className="flex items-center gap-2"><Globe size={16} className="text-[#00004d]"/> {applicant.country}</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-[#00004d]"/> {applicant.city}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#00004d]">Professional Info</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 font-medium">
            <p className="flex items-center gap-2"><Briefcase size={16} className="text-[#00004d]"/> {applicant.category}</p>
            <p className="flex items-center gap-2"><Briefcase size={16} className="text-[#00004d]"/> {applicant.jobtype || "Not Specified"}</p>
            <p className="flex items-center gap-2"><GraduationCap size={16} className="text-[#00004d]"/> {applicant.education}</p>
            <p className="font-bold text-[#00004d]">{applicant.isFresher ? "✨ Fresher" : "💼 Experienced"}</p>
          </div>
        </div>

        {applicant.experience?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#00004d]">Experience</h2>
            {applicant.experience.map((exp: any, idx: number) => (
              <div key={idx} className="border-l-4 border-[#00004d] pl-4 py-1">
                <p className="font-bold text-[#00004d] text-base">{exp.designation}</p>
                <p className="text-sm text-gray-600 font-semibold">{exp.companyName}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center pb-10">
            <button 
              onClick={handleHireClick}
              disabled={hiringState !== "idle"}
              className={`
                min-w-[220px] h-16 rounded-full font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95
                ${hiringState === "idle" ? "bg-[#00004d] text-white hover:bg-blue-900" : ""}
                ${hiringState === "loading" ? "bg-[#00004d] text-white opacity-70 cursor-not-allowed" : ""}
                ${hiringState === "hired" ? "bg-green-600 text-white cursor-default" : ""}
              `}
            >
              {hiringState === "idle" && <><Send size={22} strokeWidth={3} /><span>Easy Hire</span></>}
              {hiringState === "loading" && <><Loader2 className="animate-spin w-6 h-6" strokeWidth={3} /><span>Hiring...</span></>}
              {hiringState === "hired" && <><CheckCircle size={24} strokeWidth={3} /><span>Hired!</span></>}
            </button>
        </div>
      </div>
    </div>
  );
}