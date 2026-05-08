"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Briefcase, MapPin, DollarSign, List, Info,
  FileText, Award, Loader2, AlertCircle, Search, ChevronDown, Lock,
  GraduationCap
} from "lucide-react";
import SuccessModal from "../../components/SuccessModal";

import { JOB_CATEGORIES, JOB_TYPES, CITIES, EDUCATION_OPTIONS } from "../constants";

export default function PostJobPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    city: "",
    salary: "",
    type: "Full-Time",
    experience: "",
    description: "",
    skills: "",
    education: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userStatus, setUserStatus] = useState<"guest" | "jobseeker" | "employer" | null>(null);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isEduOpen, setIsEduOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [eduSearch, setEduSearch] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const catRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (!token) {
      setUserStatus("guest");
    } else if (user.role === "jobseeker") {
      setUserStatus("jobseeker");
    } else if (user.role === "employer") {
      setUserStatus("employer");
    }
    const savedData = localStorage.getItem("pendingJobPost");
    if (savedData) {
      setFormData(JSON.parse(savedData));
      if (token && user.role === "employer") {
        localStorage.removeItem("pendingJobPost");
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(event.target as Node)) setIsCatOpen(false);
      if (eduRef.current && !eduRef.current.contains(event.target as Node)) setIsEduOpen(false);
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) setIsCityOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = useMemo(() => {
    return JOB_CATEGORIES.filter(opt => opt.toLowerCase().includes(catSearch.toLowerCase()));
  }, [catSearch]);

    const filteredEducation = useMemo(() => {
    return EDUCATION_OPTIONS.filter(opt => opt.toLowerCase().includes(eduSearch.toLowerCase()));
  }, [eduSearch]);

  const filteredCities = useMemo(() => {
    return CITIES.filter(opt => opt.toLowerCase().includes(citySearch.toLowerCase()));
  }, [citySearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userStatus === "guest") {
      localStorage.setItem("pendingJobPost", JSON.stringify(formData));
      router.push("/company-register");
      return;
    }

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

  if (userStatus === "jobseeker") {
    return (
      <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-red-100 max-w-sm w-full">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-[#00004d] mb-4">Employer Only</h1>
          <p className="text-gray-500 font-bold text-sm mb-10 leading-relaxed">
            You are logged in as a Job Seeker. Please use an Employer account to post vacancies.
          </p>
          <button onClick={() => router.push("/")} className="w-full bg-[#00004d] text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (userStatus === null) return null;

  const inputStyle = "w-full p-4 bg-white border-2 border-[#e2f2f5] rounded-2xl focus:border-[#00004d] focus:bg-white outline-none transition-all font-bold text-[#00004d] placeholder:text-gray-300 text-sm shadow-sm";
  const labelStyle = "flex items-center gap-2 text-[10px] font-black text-[#00004d] tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-12 font-sans">
      <div className="bg-[#5DBB63] rounded-b-[50px] pt-16 pb-24 px-6 text-center shadow-sm relative">
        <h1 className="text-3xl font-black text-white relative z-10 tracking-tight">Post a Vacancy</h1>
        <p className="text-white font-bold opacity-60 mt-2 text-sm relative z-10">Find your star employee today</p>
      </div>
      <div className="max-w-2xl mx-auto px-6 -mt-16 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,77,0.1)] border border-gray-50 space-y-7">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative" ref={catRef}>
                <label className={labelStyle}><List size={14} strokeWidth={3} />Job Title</label>
                <div onClick={() => setIsCatOpen(!isCatOpen)} className={`${inputStyle} flex justify-between items-center cursor-pointer`}>
                  <span className={formData.category ? "text-[#00004d]" : "text-gray-300"}>
                    {formData.category || "Select Category"}
                  </span>
                  <ChevronDown size={18} className={`transition-transform ${isCatOpen ? "rotate-180" : ""}`} />
                </div>
                <AnimatePresence>
                  {isCatOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                        <Search size={14} className="text-gray-400" />
                        <input type="text" placeholder="Search..." className="bg-transparent text-xs font-bold outline-none w-full" value={catSearch} onChange={(e) => setCatSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCategories.map((cat) => (
                          <div key={cat} onClick={() => { setFormData({ ...formData, category: cat }); setIsCatOpen(false); setCatSearch(""); }} className="px-5 py-3.5 text-xs font-bold text-[#00004d] hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                            {cat}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative" ref={eduRef}>
                <label className={labelStyle}><GraduationCap size={14} strokeWidth={3} />Education</label>
                <div onClick={() => setIsEduOpen(!isEduOpen)} className={`${inputStyle} flex justify-between items-center cursor-pointer`}>
                  <span className={formData.education ? "text-[#00004d]" : "text-gray-300"}>
                    {formData.education|| "Select Education"}
                  </span>
                  <ChevronDown size={18} className={`transition-transform ${isEduOpen ? "rotate-180" : ""}`} />
                </div>
                <AnimatePresence>
                  {isEduOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                        <Search size={14} className="text-gray-400" />
                        <input type="text" placeholder="Search..." className="bg-transparent text-xs font-bold outline-none w-full" value={eduSearch} onChange={(e) => setEduSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredEducation.map((edu) => (
                          <div key={edu} onClick={() => { setFormData({ ...formData, education: edu }); setIsEduOpen(false); setEduSearch(""); }} className="px-5 py-3.5 text-xs font-bold text-[#00004d] hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                            {edu}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative" ref={cityRef}>
                <label className={labelStyle}><MapPin size={14} strokeWidth={3} /> City</label>
                <div onClick={() => setIsCityOpen(!isCityOpen)} className={`${inputStyle} flex justify-between items-center cursor-pointer`}>
                  <span className={formData.city ? "text-[#00004d]" : "text-gray-300"}>
                    {formData.city || "Select City"}
                  </span>
                  <ChevronDown size={18} className={`transition-transform ${isCityOpen ? "rotate-180" : ""}`} />
                </div>
                <AnimatePresence>
                  {isCityOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                        <Search size={14} className="text-gray-400" />
                        <input type="text" placeholder="Search city..." className="bg-transparent text-xs font-bold outline-none w-full" value={citySearch} onChange={(e) => setCatSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCities.map((city) => (
                          <div key={city} onClick={() => { setFormData({ ...formData, city: city }); setIsCityOpen(false); setCitySearch(""); }} className="px-5 py-3.5 text-xs font-bold text-[#00004d] hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                            {city}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelStyle}><DollarSign size={14} strokeWidth={3} /> Monthly Salary</label>
                <input type="text" value={formData.salary} placeholder="e.g. 50k - 80k" className={inputStyle}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
              </div>
              <div>
                <label className={labelStyle}><Info size={14} strokeWidth={3} /> Type</label>
                <select value={formData.type} className={`${inputStyle} appearance-none`} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                  {JOB_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelStyle}><Award size={14} strokeWidth={3} /> Experience Required</label>
              <input type="text" value={formData.experience} placeholder="e.g. 2 Years / Fresh" className={inputStyle}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
            </div>
            <div>
              <label className={labelStyle}><Award size={14} strokeWidth={3} /> Key Skills</label>
              <input type="text" value={formData.skills} placeholder="Skills (comma separated)" className={inputStyle}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
            </div>
            <div>
              <label className={labelStyle}><FileText size={14} strokeWidth={3} /> Description</label>
              <textarea required rows={5} value={formData.description} placeholder="Job description..." className={`${inputStyle} resize-none`}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
            </div>
          </div>
          <button
            disabled={loading}
            className="w-50 h-15 bg-[#5DBB63] text-white py-5 rounded-[13px] font-black text-base flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} strokeWidth={3} /> Publish Vacancy</>}
          </button>
          {userStatus === "guest" && (
            <div className="flex items-center justify-center gap-2 mt-4 text-red-500 animate-pulse">
              <Lock size={12} strokeWidth={3} />
              <p className="text-[10px] font-black uppercase tracking-widest">Login required to publish</p>
            </div>
          )}
        </form>
      </div>
      {showSuccess && (
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => router.push("/dashboard/employer/my-jobs")}
          title="JOB PUBLISHED!"
          message="Your job listing is now live and visible to candidates."
        />
      )}
    </div>
  );
}