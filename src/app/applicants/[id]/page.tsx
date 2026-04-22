"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, User, Calendar, Globe, MapPin, Briefcase, GraduationCap, ArrowLeft } from "lucide-react";

export default function PublicApplicantDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`https://easyjobspk.onrender.com/api/applications/${id}`,);
        const data = await res.json();
        if(res.ok) setApplicant(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#e2f2f5]">
      <Loader2 className="animate-spin w-10 h-10 text-[#00004d]" />
    </div>
  );

  if (!applicant || applicant.message) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#e2f2f5]">
        <p className="font-black text-[#00004d]">Applicant profile not found.</p>
        <button onClick={() => router.push('/')} className="bg-[#00004d] text-white px-6 py-2 rounded-full font-bold">Back Home</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e2f2f5] p-4 md:p-10 font-sans">
      <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 font-bold text-[#00004d]">
        <ArrowLeft size={20} /> Back
      </button>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#00004d] text-white p-8 rounded-[40px] shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden bg-white shadow-2xl">
            <img src={applicant.image || "https://via.placeholder.com/150"} className="w-full h-full object-cover" alt="Profile" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight">{applicant.fullName}</h1>
            <p className="text-lg font-bold opacity-80 mt-1 uppercase tracking-widest">{applicant.category}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                <span className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold border border-white/20">{applicant.jobtype}</span>
                <span className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold border border-white/20">{applicant.city}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-white">
            <h2 className="text-lg font-black text-[#00004d] mb-5 flex items-center gap-2">
              <User size={18} /> Personal Details
            </h2>
            <div className="space-y-4 text-sm font-bold text-gray-600">
              <p className="flex justify-between border-b pb-2"><span>Gender:</span> <span>{applicant.gender}</span></p>
              <p className="flex justify-between border-b pb-2"><span>Born:</span> <span>{applicant.dob ? new Date(applicant.dob).toLocaleDateString() : 'N/A'}</span></p>
              <p className="flex justify-between border-b pb-2"><span>City:</span> <span>{applicant.city}</span></p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-white">
            <h2 className="text-lg font-black text-[#00004d] mb-5 flex items-center gap-2">
              <GraduationCap size={18} /> Education
            </h2>
            <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="font-black text-[#00004d]">{applicant.education}</p>
                <p className="text-xs text-gray-400 mt-1 font-bold">Highest qualification achieved</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-white">
          <h2 className="text-lg font-black text-[#00004d] mb-6 flex items-center gap-2">
            <Briefcase size={18} /> Work History
          </h2>
          {applicant.isFresher ? (
            <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed text-gray-400 font-bold">
               Fresher / No Previous Experience
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applicant.experience?.map((exp: any, idx: number) => (
                <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                   <h4 className="font-black text-[#00004d]">{exp.designation}</h4>
                   <p className="text-sm font-bold text-gray-500">{exp.companyName}</p>
                   <p className="text-[10px] font-black text-blue-500 mt-2 uppercase tracking-widest">
                     {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.isCurrentJob ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                   </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {applicant.achievements && (
            <div className="bg-[#00004d] p-8 rounded-3xl text-white">
                <h2 className="text-lg font-black mb-3">About / Achievements</h2>
                <p className="text-sm font-bold opacity-80 leading-relaxed">{applicant.achievements}</p>
            </div>
        )}
      </div>
    </div>
  );
}