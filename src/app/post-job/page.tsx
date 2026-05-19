"use client";

import React, { useState, useRef, ChangeEvent, FormEvent, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Cropper, { Area } from "react-easy-crop";
import {
  MapPin, DollarSign, Info, FileText, Award, Search, 
  ChevronDown, Lock, Camera, Scissors, Check, X, 
  Building2, Briefcase, Globe, ArrowRight, ArrowLeft, Loader2
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
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return canvas.toDataURL("image/jpeg", 0.7);
}

export default function PostJobPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Steps State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const catRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");
    if (!token) setUserStatus("guest");
    else if (user.role === "jobseeker") setUserStatus("jobseeker");
    else if (user.role === "employer") setUserStatus("employer");

    const savedData = localStorage.getItem("pendingJobPost");
    if (savedData) {
      setFormData(JSON.parse(savedData));
      if (token && user.role === "employer") localStorage.removeItem("pendingJobPost");
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(event.target as Node)) setIsCatOpen(false);
      if (eduRef.current && !eduRef.current.contains(event.target as Node)) setIsEduOpen(false);
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) setIsCityOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextStep = () => { if (currentStep < totalSteps) setCurrentStep(prev => prev + 1); window.scrollTo(0, 0); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); window.scrollTo(0, 0); };

  const filteredCategories = useMemo(() => {
    const filtered = JOB_CATEGORIES.filter(opt => opt.toLowerCase().includes(catSearch.toLowerCase()));
    return ["Other", ...filtered];
  }, [catSearch]);

  const filteredEducation = useMemo(() => {
    const filtered = EDUCATION_OPTIONS.filter(opt => opt.toLowerCase().includes(eduSearch.toLowerCase()));
    return ["Other", ...filtered];
  }, [eduSearch]);

  const filteredCities = useMemo(() => CITIES.filter(opt => opt.toLowerCase().includes(citySearch.toLowerCase())), [citySearch]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setImageToCrop(reader.result as string); setIsCropping(true); };
    reader.readAsDataURL(file);
  };

  const saveCroppedImage = async () => {
    if (imageToCrop && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setFormData({ ...formData, companyLogo: croppedImage });
      setIsCropping(false);
      setImageToCrop(null);
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
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          category: finalCategory,
          education: finalEducation,
          skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : []
        }),
      });

      if (res.ok) setShowSuccess(true);
      else { const errorData = await res.json(); alert(errorData.message || "Failed to post job"); }
    } catch (err) { alert("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  if (userStatus === "jobseeker") {
    return (
      <div className="min-h-screen bg-[#f4f7f9] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[30px] shadow-2xl border border-red-100 max-w-sm w-full">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><Lock size={40} className="text-red-500" /></div>
          <h1 className="text-2xl font-bold text-[#00004d] mb-4">Employer Only</h1>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed">You are logged in as a Job Seeker. Please use an Employer account to post vacancies.</p>
          <button onClick={() => router.push("/")} className="w-full bg-[#00004d] text-white py-4 rounded-xl font-bold text-sm">Back to Home</button>
        </div>
      </div>
    );
  }

  if (userStatus === null) return null;

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-10 font-sans">
      {/* Cropper UI */}
      <AnimatePresence>
        {isCropping && (
          <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black p-4">
            <div className="relative w-full h-[60vh] md:w-[500px] md:h-[500px] bg-gray-900 rounded-2xl overflow-hidden">
              <Cropper image={imageToCrop!} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={(_, pix) => setCroppedAreaPixels(pix)} onZoomChange={setZoom} />
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
        title="JOB SUBMITTED!"
        message="Your job listing has been received. It will be live on the platform after Admin Approval."
      />

      <div className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#5DBB63] text-3xl font-bold">Post a Vacancy</motion.h1>
        {/* Step Indicator */}
        <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-300 ${s <= currentStep ? 'bg-[#5DBB63]' : 'bg-gray-200'}`} />
            ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-10 px-4">
        <div className="bg-white rounded-[35px] shadow-xl overflow-hidden border border-white">
          <form onSubmit={handleSubmit} className="p-6 md:p-14">
            
            {/* STEP 1: COMPANY & LOCATION */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                <section className="flex flex-col items-center gap-6">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#f8fcfd] shadow-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                      {formData.companyLogo ? (
                        <img src={formData.companyLogo} className="w-full h-full object-cover" alt="Logo" />
                      ) : (
                        <div className="bg-[#00004d] w-full h-full flex items-center justify-center"><Building2 className="w-12 h-12 text-white" /></div>
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-[#00004d] text-white p-2.5 rounded-full shadow-lg"><Camera size={18} /></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Company Logo</span>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Location Details</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative" ref={cityRef}>
                      <label className="text-[10px] font-bold text-[#00004d] mb-2 block">Select City</label>
                      <div onClick={() => setIsCityOpen(!isCityOpen)} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold text-[#00004d] flex justify-between items-center cursor-pointer">
                        {formData.city || "Choose City"}
                        <ChevronDown size={16} className={isCityOpen ? 'rotate-180' : ''} />
                      </div>
                      {isCityOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border rounded-2xl shadow-xl overflow-hidden">
                          <div className="p-2 bg-gray-50"><input placeholder="Search city..." className="w-full p-2 text-xs border rounded-lg outline-none" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} /></div>
                          <div className="max-h-60 overflow-y-auto">
                            {filteredCities.map(c => <div key={c} onClick={() => { setFormData({...formData, city: c}); setIsCityOpen(false); }} className="px-4 py-3 text-xs font-bold hover:bg-blue-50 cursor-pointer">{c}</div>)}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-end"><div className="w-full bg-gray-100 rounded-xl p-4 text-sm font-bold text-gray-500 flex items-center gap-2 h-[54px]"><Globe size={14} /> Pakistan</div></div>
                  </div>
                </section>
              </motion.div>
            )}

            {/* STEP 2: JOB SPECS */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Job Information</h2></div>
                
                <div className="space-y-4" ref={catRef}>
                  <label className="text-[10px] font-bold text-[#00004d] block uppercase tracking-tight">Job Title / Category</label>
                  <div onClick={() => setIsCatOpen(!isCatOpen)} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold text-[#00004d] flex justify-between items-center cursor-pointer">
                    {formData.category || "Select Category"}
                    <ChevronDown size={16} className={isCatOpen ? 'rotate-180' : ''} />
                  </div>
                  {isCatOpen && (
                    <div className="absolute z-50 w-full md:w-[60%] bg-white border rounded-2xl shadow-xl overflow-hidden">
                      <div className="p-2 bg-gray-50"><input placeholder="Search title..." className="w-full p-2 text-xs border rounded-lg outline-none" value={catSearch} onChange={(e) => setCatSearch(e.target.value)} /></div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCategories.map(cat => <div key={cat} onClick={() => { setFormData({...formData, category: cat}); setIsCatOpen(false); }} className="px-4 py-3 text-xs font-bold hover:bg-blue-50 cursor-pointer">{cat}</div>)}
                      </div>
                    </div>
                  )}
                  {formData.category === "Other" && <input placeholder="Specify Job Title" className="w-full mt-2 bg-[#f8fafc] border-2 border-blue-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.otherCategory} onChange={(e) => setFormData({ ...formData, otherCategory: e.target.value })} />}
                </div>

                <div className="space-y-4" ref={eduRef}>
                  <label className="text-[10px] font-bold text-[#00004d] block uppercase tracking-tight">Required Education</label>
                  <div onClick={() => setIsEduOpen(!isEduOpen)} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold text-[#00004d] flex justify-between items-center cursor-pointer">
                    {formData.education || "Select Education"}
                    <ChevronDown size={16} className={isEduOpen ? 'rotate-180' : ''} />
                  </div>
                  {isEduOpen && (
                    <div className="absolute z-50 w-full md:w-[60%] bg-white border rounded-2xl shadow-xl overflow-hidden">
                      <div className="p-2 bg-gray-50"><input placeholder="Search education..." className="w-full p-2 text-xs border rounded-lg outline-none" value={eduSearch} onChange={(e) => setEduSearch(e.target.value)} /></div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredEducation.map(edu => <div key={edu} onClick={() => { setFormData({...formData, education: edu}); setIsEduOpen(false); }} className="px-4 py-3 text-xs font-bold hover:bg-blue-50 cursor-pointer">{edu}</div>)}
                      </div>
                    </div>
                  )}
                  {formData.education === "Other" && <input placeholder="Specify Education" className="w-full mt-2 bg-[#f8fafc] border-2 border-blue-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.otherEducation} onChange={(e) => setFormData({ ...formData, otherEducation: e.target.value })} />}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#00004d] block">Job Type</label>
                  <select className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </motion.div>
            )}

            {/* STEP 3: DETAILS & SALARY */}
            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Salary & Requirements</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1"><DollarSign size={12}/> Monthly Salary</label>
                        <input placeholder="e.g. 40k - 60k" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1"><Briefcase size={12}/> Experience</label>
                        <input placeholder="e.g. 1 Year / Fresh" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1"><Award size={12}/> Skills</label>
                        <input placeholder="Comma separated skills" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1"><FileText size={12}/> Description (Optional)</label>
                        <textarea rows={4} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                </div>

                {userStatus === "guest" && (
                  <div className="p-4 bg-red-50 rounded-xl flex items-center gap-3 text-red-600 border border-red-100">
                    <Lock size={18} />
                    <p className="text-[11px] font-bold uppercase tracking-widest">Login required to publish this vacancy</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-12 gap-4">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-100 text-[#00004d] font-bold text-sm">
                  <ArrowLeft size={18} /> Back
                </button>
              )}

              {currentStep < totalSteps ? (
                <button type="button" onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#00004d] text-white font-bold text-sm">
                  Next Step <ArrowRight size={18} />
                </button>
              ) : (
                <button disabled={loading} className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#5DBB63] text-white font-bold text-sm shadow-lg active:scale-95 transition-transform">
                  {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                  {loading ? "Publishing..." : "Publish Vacancy"}
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

// Choti si help component
function CheckCircle2({size}: {size?: number}) {
    return <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
}