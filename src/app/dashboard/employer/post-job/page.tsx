"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send, Briefcase, MapPin, DollarSign, List, Info, AlertCircle, FileText, Award, Loader2 } from "lucide-react";
import SuccessModal from "../../../../components/SuccessModal";

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    city: "",
    salary: "",
    type: "Full-time",
    experience: "",
    description: "",
    skills: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEmployer, setIsEmployer] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!token || user.role !== "employer") {
      setIsEmployer(false);
    } else {
      setIsEmployer(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/jobs", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
            ...formData,
            skills: formData.skills.split(",").map(s => s.trim())
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to post job");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Professional English Error UI for Job Seekers ---
  if (isEmployer === false) {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="bg-[#e2f2f5] p-10 rounded-[3rem] border-2 border-[#00004d] shadow-2xl max-w-md w-full mx-auto relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-20 rounded-full"></div>
          
          <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-[#00004d]/10">
            <AlertCircle size={48} className="text-[#00004d] animate-pulse" />
          </div>
          
          <h1 className="text-3xl font-black text-[#00004d] mb-4 uppercase tracking-tighter">Employer Access Only</h1>
          
          <p className="text-[#00004d] font-bold text-sm opacity-70 mb-10 leading-relaxed px-4">
            This feature is exclusively reserved for businesses and recruiters. 
            As a job seeker, you can explore thousands of live opportunities on our job board.
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push("/")}
              className="w-full bg-[#00004d] text-white py-4 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-all hover:bg-black"
            >
              Return to Dashboard
            </button>
            <button 
              onClick={() => router.push("/jobs")}
              className="w-full bg-transparent text-[#00004d] py-4 rounded-2xl font-black text-xs border border-[#00004d]/20 hover:bg-white transition-all"
            >
              Browse Available Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isEmployer === null) return null;

  const inputStyle = "w-full p-4 bg-white border-2 border-[#e2f2f5] rounded-2xl focus:border-[#00004d] focus:bg-white outline-none transition-all font-bold text-[#00004d] placeholder:text-gray-300 text-sm shadow-sm";
  const labelStyle = "flex items-center gap-2 text-[10px] font-black text-[#00004d] uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-12 font-sans">
      {/* Header matching Home Theme */}
      <div className="bg-[#e2f2f5] rounded-b-[50px] pt-16 pb-24 px-6 text-center shadow-sm relative">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-10">
            <Briefcase size={120} />
        </div>
        <h1 className="text-4xl font-black text-[#00004d] tracking-tighter relative z-10">CREATE VACANCY</h1>
        <p className="text-[#00004d] font-bold opacity-60 mt-2 text-sm uppercase tracking-widest relative z-10">Find your next star employee today</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-16 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,77,0.1)] border border-gray-50 space-y-7">
          
          <div className="space-y-6">
            {/* Job Title */}
            <div>
              <label className={labelStyle}><Briefcase size={14} strokeWidth={3}/> Job Title</label>
              <input required type="text" placeholder="e.g. Senior Software Engineer" className={inputStyle}
                onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>

            {/* Category & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyle}><List size={14} strokeWidth={3}/> Category</label>
                <div className="relative">
                    <select required className={`${inputStyle} appearance-none cursor-pointer`} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category</option>
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Management">Management</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#00004d]">
                        <Info size={16} />
                    </div>
                </div>
              </div>
              <div>
                <label className={labelStyle}><MapPin size={14} strokeWidth={3}/> Location / City</label>
                <input required type="text" placeholder="e.g. Lahore, Pakistan" className={inputStyle}
                  onChange={(e) => setFormData({...formData, city: e.target.value})} />
              </div>
            </div>

            {/* Salary & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyle}><DollarSign size={14} strokeWidth={3}/> Monthly Salary</label>
                <input type="text" placeholder="e.g. 150k - 200k PKR" className={inputStyle}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}><Info size={14} strokeWidth={3}/> Employment Type</label>
                <select className={inputStyle} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className={labelStyle}><Award size={14} strokeWidth={3}/> Required Key Skills</label>
              <input type="text" placeholder="React, Node.js, Project Management..." className={inputStyle}
                onChange={(e) => setFormData({...formData, skills: e.target.value})} />
            </div>

            {/* Description */}
            <div>
              <label className={labelStyle}><FileText size={14} strokeWidth={3}/> Job Description</label>
              <textarea required rows={6} placeholder="Detailed role responsibilities and candidate requirements..." className={`${inputStyle} resize-none`}
                onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full bg-[#00004d] text-white py-5 rounded-[2.5rem] font-black text-base flex items-center justify-center gap-3 hover:shadow-[0_10px_30px_rgba(0,0,77,0.3)] hover:bg-black transition-all disabled:opacity-50 active:scale-95 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <><Send size={20} strokeWidth={3} /> PUBLISH VACANCY</>
            )}
          </button>
        </form>
      </div>

      {showSuccess && (
        <SuccessModal 
          isOpen={showSuccess} 
          onClose={() => router.push("/dashboard/employer/my-jobs")}
          title="JOB PUBLISHED!"
          message="Excellent! Your job listing is now live and visible to potential candidates."
        />
      )}
    </div>
  );
}