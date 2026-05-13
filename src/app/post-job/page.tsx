"use client";

import React, { useState, useRef, ChangeEvent, FormEvent, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import {
  MapPin, DollarSign, Info, FileText, Award, Search, 
  ChevronDown, Lock, Camera, Scissors, Check, X, 
  Building2, Briefcase, Globe
} from "lucide-react";
import SuccessModal from "../../components/SuccessModal";

import { JOB_CATEGORIES, JOB_TYPES, CITIES, EDUCATION_OPTIONS } from "../constants";
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );
  return canvas.toDataURL("image/jpeg", 0.7);
}

export default function PostJobPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    companyLogo: "",
    category: "",
    otherCategory: "",
    city: "",
    salary: "",
    type: "Full-Time",
    experience: "",
    description: "",
    skills: "",
    education: "",
    otherEducation: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userStatus, setUserStatus] = useState<"guest" | "jobseeker" | "employer" | null>(null);
    const [isCatOpen, setIsCatOpen] = useState(false);
  const [isEduOpen, setIsEduOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [eduSearch, setEduSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

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
    const filtered = JOB_CATEGORIES.filter(opt => opt.toLowerCase().includes(catSearch.toLowerCase()));
    return ["Other", ...filtered];
  }, [catSearch]);

  const filteredEducation = useMemo(() => {
    const filtered = EDUCATION_OPTIONS.filter(opt => opt.toLowerCase().includes(eduSearch.toLowerCase()));
    return ["Other", ...filtered];
  }, [eduSearch]);

  const filteredCities = useMemo(() => {
    return CITIES.filter(opt => opt.toLowerCase().includes(citySearch.toLowerCase()));
  }, [citySearch]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCroppedImage = async () => {
    try {
      if (imageToCrop && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        setFormData({ ...formData, companyLogo: croppedImage });
        setIsCropping(false);
        setImageToCrop(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const finalCategory = formData.category === "Other" ? formData.otherCategory : formData.category;
    const finalEducation = formData.education === "Other" ? formData.otherEducation : formData.education;

    if (userStatus === "guest") {
      localStorage.setItem("pendingJobPost", JSON.stringify({ ...formData, category: finalCategory, education: finalEducation }));
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
          category: finalCategory,
          education: finalEducation,
          skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : []
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
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (userStatus === "jobseeker") {
    return (
      <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[30px] shadow-2xl border border-red-100 max-w-sm w-full">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-[#00004d] mb-4">Employer Only</h1>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed">
            You are logged in as a Job Seeker. Please use an Employer account to post vacancies.
          </p>
          <button onClick={() => router.push("/")} className="w-full bg-[#00004d] text-white py-4 rounded-xl font-bold text-sm active:scale-95 transition-all">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (userStatus === null) return null;

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-10 font-sans">
      <AnimatePresence>
        {isCropping && (
          <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black p-4">
            <div className="relative w-full h-[60vh] md:w-[500px] md:h-[500px] bg-gray-900 rounded-2xl overflow-hidden">
              <Cropper
                image={imageToCrop!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="mt-8 w-full max-w-[400px] space-y-6 px-4">
              <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#5DBB63]" />
              <div className="flex gap-4">
                <button onClick={() => setIsCropping(false)} className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/20"><X size={18} /> Cancel</button>
                <button onClick={saveCroppedImage} className="flex-1 py-4 bg-[#5DBB63] text-white rounded-2xl font-bold flex items-center justify-center gap-2"><Check size={18} /> Done</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => router.push("/dashboard/employer/my-jobs")}
        title="JOB PUBLISHED!"
        message="Your job listing is live and visible to candidates after admin approval."
      />

      <div className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#5DBB63] text-3xl md:text-2xl font-bold">Post a Vacancy</motion.h1>
        <p className="text-[#5DBB63] font-bold text-[13px] md:text-xs mt-3 tracking-[0.1em]">Find Employees by Posting Jobs</p>
      </div>
      <div className="max-w-4xl mx-auto -mt-13 md:-mt-16 px-4">
        <div className="bg-white rounded-[35px] md:rounded-[45px] shadow-xl overflow-hidden border border-white">
          <form onSubmit={handleSubmit} className="p-6 md:p-14 space-y-12 md:space-y-20">
                        <section className="flex flex-col items-center gap-6">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#f8fcfd] shadow-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                  {formData.companyLogo ? (
                    <img src={formData.companyLogo} className="w-full h-full object-cover" alt="Logo" />
                  ) : (
                    <div className="bg-[#00004d] w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Scissors className="text-white" size={24} />
                    <span className="text-white text-[10px] font-bold ml-2">EDIT LOGO</span>
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-[#00004d] text-white p-2.5 rounded-full shadow-lg"><Camera size={18} /></div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest">Upload Company Logo (Optional)</span>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
            </section>
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3">
                <h2 className="text-[#00004d] font-bold text-lg tracking-wider">Company Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="space-y-1.5 relative" ref={cityRef}>
                  <label className="text-[10px] font-bold text-[#00004d] ml-1 flex items-center gap-1"><MapPin size={12}/> Select City</label>
                  <div onClick={() => setIsCityOpen(!isCityOpen)} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold text-[#00004d] flex justify-between items-center cursor-pointer">
                    {formData.city || "Select City"}
                    <ChevronDown size={16} className={`transition-transform ${isCityOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {isCityOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
                          <Search size={14} className="text-gray-400 ml-2" />
                          <input type="text" placeholder="Search city..." className="w-full p-2 text-[11px] font-medium bg-transparent outline-none" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCities.map(c => (
                            <div key={c} onClick={() => { setFormData({...formData, city: c}); setIsCityOpen(false); setCitySearch(""); }} className="px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-blue-50 hover:text-[#00004d] cursor-pointer border-b border-gray-50 last:border-0">{c}</div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="w-full bg-gray-100 rounded-xl p-4 text-sm font-bold text-gray-500 flex items-center gap-2 mt-auto h-[54px]"><Globe size={14} /> Pakistan</div>
              </div>
            </section>
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3">
                <h2 className="text-[#00004d] font-bold text-lg tracking-wider">Job Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                                <div className="space-y-1.5 relative md:col-span-2" ref={catRef}>
                  <label className="text-[10px] font-bold text-[#00004d] ml-1">Job Title / Category</label>
                  <div onClick={() => setIsCatOpen(!isCatOpen)} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold text-[#00004d] flex justify-between items-center cursor-pointer min-h-[56px]">
                    {formData.category || "Select Category"}
                    <ChevronDown size={16} className={`transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {isCatOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
                          <Search size={14} className="text-gray-400 ml-2" />
                          <input type="text" placeholder="Search title..." className="w-full p-2 text-[11px] font-medium bg-transparent outline-none" value={catSearch} onChange={(e) => setCatSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCategories.map(cat => (
                            <div key={cat} onClick={() => { setFormData({...formData, category: cat}); setIsCatOpen(false); setCatSearch(""); }} className="px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-blue-50 hover:text-[#00004d] cursor-pointer border-b border-gray-50 last:border-0">{cat}</div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {formData.category === "Other" && (
                    <motion.input initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} required placeholder="Specify Job Title" className="w-full mt-3 bg-[#f8fafc] border-2 border-blue-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#00004d]" value={formData.otherCategory} onChange={(e) => setFormData({ ...formData, otherCategory: e.target.value })} />
                  )}
                </div>
                <div className="space-y-1.5 relative md:col-span-2" ref={eduRef}>
                  <label className="text-[10px] font-bold text-[#00004d] ml-1">Required Education</label>
                  <div onClick={() => setIsEduOpen(!isEduOpen)} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold text-[#00004d] flex justify-between items-center cursor-pointer min-h-[56px]">
                    {formData.education || "Select Education"}
                    <ChevronDown size={16} className={`transition-transform ${isEduOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <AnimatePresence>
                    {isEduOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-2 border-b bg-gray-50 flex items-center gap-2">
                          <Search size={14} className="text-gray-400 ml-2" />
                          <input type="text" placeholder="Search qualification..." className="w-full p-2 text-[11px] font-medium bg-transparent outline-none" value={eduSearch} onChange={(e) => setEduSearch(e.target.value)} onClick={(e) => e.stopPropagation()} />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredEducation.map(edu => (
                            <div key={edu} onClick={() => { setFormData({...formData, education: edu}); setIsEduOpen(false); setEduSearch(""); }} className="px-4 py-3 text-[11px] font-bold text-gray-600 hover:bg-blue-50 hover:text-[#00004d] cursor-pointer border-b border-gray-50 last:border-0">{edu}</div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {formData.education === "Other" && (
                    <motion.input initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} required placeholder="Specify Education" className="w-full mt-3 bg-[#f8fafc] border-2 border-blue-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#00004d]" value={formData.otherEducation} onChange={(e) => setFormData({ ...formData, otherEducation: e.target.value })} />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#00004d] ml-1 flex items-center gap-1"><DollarSign size={12}/> Monthly Salary</label>
                  <input type="text" placeholder="e.g. 50k - 80k" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#00004d] ml-1 flex items-center gap-1"><Info size={12}/> Job Type</label>
                  <select className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none appearance-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#00004d] ml-1 flex items-center gap-1"><Briefcase size={12}/> Experience Required</label>
                  <input type="text" placeholder="e.g. 2 Years / Fresh" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#00004d] ml-1 flex items-center gap-1"><Award size={12}/> Key Skills</label>
                  <input type="text" placeholder="Comma separated (Optional)" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-bold text-[#00004d] ml-1 flex items-center gap-1"><FileText size={12}/> Job Description</label>
                  <textarea required rows={4} placeholder="Describe the job roles and responsibilities... (Optional)" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none resize-none shadow-sm" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>
            </section>
            <div className="flex flex-col items-center gap-6 pt-10 border-t">
              <button 
                disabled={loading} 
                className="w-80% md:w-auto bg-[#5DBB63] text-white px-12 py-3.5 rounded-2xl text-[13px] font-bold tracking-[0.1em] active:scale-95 transition-all shadow-sm"
              >
                {loading ? "Publishing..." : "Publish Vacancy"}
              </button>
              
              {userStatus === "guest" && (
                <div className="flex items-center gap-2 text-red-500 animate-pulse">
                  <Lock size={14} />
                  <p className="text-[10px] font-bold tracking-widest uppercase">Login Required to Publish</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}