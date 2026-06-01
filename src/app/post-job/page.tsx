"use client";

import React, { useState, useRef, ChangeEvent, FormEvent, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Cropper, { Area } from "react-easy-crop";
import toast, { Toaster } from "react-hot-toast";
import {
  MapPin, DollarSign, Info, FileText, Award, Search,
  ChevronDown, Lock, Camera, Check, X,
  Building2, Briefcase, Globe, ArrowRight, ArrowLeft, Loader2, CheckCircle2,
  Clock
} from "lucide-react";

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

function AuthRequiredModal({ isOpen, onClose, onAction }: { isOpen: boolean; onClose: () => void; onAction: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-[30px] p-8 text-center shadow-2xl">
            <div className="bg-[#5DBB63] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[#00004d]" size={30} />
            </div>
            <h3 className="text-xl font-bold text-[#00004d] mb-2">Authentication Required</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">Please login or create an Employer account to post this job.<br /><span className="text-[12px] text-gray-400 mt-2 block">جاب پوسٹ کرنے کے لیے لاگ ان کریں۔</span></p>
            <div className="space-y-3">
              <button onClick={onAction} className="w-full bg-[#00004d] text-white py-4 rounded-xl font-bold text-sm active:scale-95 transition-transform">Continue to Login</button>
              <button onClick={onClose} className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-sm">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function JobPendingModal({ isOpen, onAction }: { isOpen: boolean, onAction: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.8, opacity: 0, y: 20 }} 
            className="relative w-full max-w-md bg-white rounded-[40px] p-10 text-center shadow-2xl border border-gray-100"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-50 p-6 rounded-full relative">
                <Clock size={60} className="text-yellow-600 animate-pulse" />
                <div className="absolute -right-1 -bottom-1 bg-green-500 rounded-full p-1 border-4 border-white">
                    <Check size={20} className="text-white" />
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-extrabold text-[#00004d] mb-3 uppercase tracking-tight">Job Submitted!</h3>
            
            <div className="space-y-4 mb-8">
                <p className="text-gray-700 font-medium leading-relaxed">
                    Your vacancy has been successfully sent for <span className="text-[#5DBB63] font-bold underline">Admin Approval</span>.
                </p>
                <div className="bg-blue-50 p-4 rounded-2xl">
                    <p className="text-[#00004d] text-sm font-bold leading-relaxed">
                        آپ کی جاب ایڈمن کی منظوری کے لیے بھیج دی گئی ہے۔ ریویو مکمل ہونے کے بعد اسے لائیو کر دیا جائے گا۔
                    </p>
                </div>
            </div>

            <button 
              onClick={onAction} 
              className="w-full bg-[#00004d] text-white py-5 rounded-2xl font-bold text-lg active:scale-95 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
            >
              Go to Dashboard <ArrowRight size={20} />
            </button>
            
            <p className="text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">Process usually takes 2-4 hours</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function PostJobPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    companyLogo: "", companyName: "", contactPerson: "", companyAddress: "", phone: "", designation: "", companyEmail: "", category: "", otherCategory: "", city: "", salary: "", type: "Full-Time", experience: "", description: "", skills: "", education: "", otherEducation: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
    const savedData = localStorage.getItem("pendingJobPost");
    if (savedData) setFormData(prev => ({ ...prev, ...JSON.parse(savedData) }));

    const handleClickOutside = (event: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(event.target as Node)) setIsCatOpen(false);
      if (eduRef.current && !eduRef.current.contains(event.target as Node)) setIsEduOpen(false);
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) setIsCityOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateStep = () => {
    if (currentStep === 1) return formData.city !== "" && formData.companyName.trim() !== "";
    if (currentStep === 2) return formData.contactPerson.trim() !== "" && formData.designation.trim() !== "" && formData.phone.trim() !== "" && formData.companyEmail.trim() !== "";
    if (currentStep === 3) {
      const isCatOk = formData.category !== "" && (formData.category === "Other" ? formData.otherCategory.trim() !== "" : true);
      const isEduOk = formData.education !== "" && (formData.education === "Other" ? formData.otherEducation.trim() !== "" : true);
      return isCatOk && isEduOk;
    }
    if (currentStep === 4) return formData.salary.trim() !== "" && formData.experience.trim() !== "";
    return true;
  };

  const nextStep = () => {
    if (validateStep()) { 
      setCurrentStep(prev => Math.min(prev + 1, totalSteps)); 
      window.scrollTo(0, 0); 
    } else {
      toast.error("Please fill required fields");
    }
  };

  const prevStep = () => { setCurrentStep(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 0); };

  const handleAuthNavigation = () => {
    localStorage.setItem("pendingJobPost", JSON.stringify(formData));
    const isRegistered = localStorage.getItem("isRegistered");
    router.push(isRegistered === "true" ? "/company-login" : "/company-register");
  };

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

  const handleFinalSubmit = async () => {
    if (!validateStep()) {
      toast.error("Please fill required fields");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);

    const finalCategory = formData.category === "Other" ? formData.otherCategory : formData.category;
    const finalEducation = formData.education === "Other" ? formData.otherEducation : formData.education;

    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          category: finalCategory,
          education: finalEducation,
          skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
        localStorage.removeItem("pendingJobPost");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to post job");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-[#e6e8e8] pb-10 font-sans">
      <Toaster position="top-center" />
      <AuthRequiredModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAction={handleAuthNavigation} />
      <JobPendingModal isOpen={showSuccess} onAction={() => router.push("/jobs")} />

      <AnimatePresence>
        {isCropping && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black p-4">
            <div className="relative w-full h-[60vh] md:w-[500px] md:h-[500px] bg-gray-900 rounded-2xl overflow-hidden">
              <Cropper image={imageToCrop!} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={(_, pix) => setCroppedAreaPixels(pix)} onZoomChange={setZoom} />
            </div>
            <div className="mt-8 w-full max-w-[400px] space-y-6 px-4">
              <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#5DBB63]" />
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsCropping(false)} className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/20"><X size={18} /> Cancel</button>
                <button type="button" onClick={saveCroppedImage} className="flex-1 py-4 bg-[#5DBB63] text-white rounded-2xl font-bold flex items-center justify-center gap-2"><Check size={18} /> Done</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#5DBB63] text-[25px] font-bold">Post a Vacancy</motion.h1>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-300 ${s <= currentStep ? 'bg-[#5DBB63]' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-[35px] shadow-xl overflow-hidden border border-white">
          <div className="p-6 md:p-14">
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                <section className="flex flex-col items-center gap-6">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#f8fcfd] shadow-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                      {formData.companyLogo ? <img src={formData.companyLogo} className="w-full h-full object-cover" alt="Logo" /> : <div className="bg-[#00004d] w-full h-full flex items-center justify-center"><Building2 className="w-12 h-12 text-white" /></div>}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-[#00004d] text-white p-2.5 rounded-full shadow-lg"><Camera size={18} /></div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Company Logo</span>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Company Details</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative" ref={cityRef}>
                      <label className="text-[10px] font-bold text-[#00004d] mb-2 block">Select City *</label>
                      <div onClick={() => setIsCityOpen(!isCityOpen)} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold text-[#00004d] flex justify-between items-center cursor-pointer">
                        {formData.city || "Choose City"}
                        <ChevronDown size={16} className={isCityOpen ? 'rotate-180' : ''} />
                      </div>
                      {isCityOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border rounded-2xl shadow-xl overflow-hidden">
                          <div className="p-2 bg-gray-50"><input placeholder="Search city..." className="w-full p-2 text-xs border rounded-lg outline-none" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} /></div>
                          <div className="max-h-60 overflow-y-auto">{filteredCities.map(c => <div key={c} onClick={() => { setFormData({ ...formData, city: c }); setIsCityOpen(false); }} className="px-4 py-3 text-xs font-bold hover:bg-blue-50 cursor-pointer">{c}</div>)}</div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-end"><div className="w-full bg-gray-100 rounded-xl p-4 text-sm font-bold text-gray-500 flex items-center gap-2 h-[54px]"><Globe size={14} /> Pakistan</div></div>
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1"> Company Name *</label>
                        <input placeholder="Company or Business Name" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Contact Information</h2></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-[#00004d]"> Contact Person *</label><input placeholder="Contact Person Name" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-[#00004d]"> Designation *</label><input placeholder="Contact Person's Designation" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-[#00004d]"> Phone Number *</label><input placeholder="Enter your phone no." className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-[#00004d]"> Company Email *</label><input placeholder="Enter company email" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.companyEmail} onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })} /></div>
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-[#00004d]"> Address </label><input placeholder="Company Address (Optional)" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.companyAddress} onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })} /></div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Job Information</h2></div>
                <div className="space-y-4" ref={catRef}>
                  <label className="text-[10px] font-bold text-[#00004d] block uppercase">Job Title / Category *</label>
                  <div onClick={() => setIsCatOpen(!isCatOpen)} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold text-[#00004d] flex justify-between items-center cursor-pointer">
                    {formData.category || "Select Category"} <ChevronDown size={16} className={isCatOpen ? 'rotate-180' : ''} />
                  </div>
                  {isCatOpen && (
                    <div className="absolute z-50 w-full bg-white border rounded-2xl shadow-xl overflow-hidden mt-1">
                      <div className="p-2 bg-gray-50"><input placeholder="Search title..." className="w-full p-2 text-xs border rounded-lg outline-none" value={catSearch} onChange={(e) => setCatSearch(e.target.value)} /></div>
                      <div className="max-h-60 overflow-y-auto">{filteredCategories.map(cat => <div key={cat} onClick={() => { setFormData({ ...formData, category: cat }); setIsCatOpen(false); }} className="px-4 py-3 text-xs font-bold hover:bg-blue-50 cursor-pointer">{cat}</div>)}</div>
                    </div>
                  )}
                  {formData.category === "Other" && <input placeholder="Specify Job Title" className="w-full mt-2 bg-[#f8fafc] border-2 border-blue-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.otherCategory} onChange={(e) => setFormData({ ...formData, otherCategory: e.target.value })} />}
                </div>

                <div className="space-y-4" ref={eduRef}>
                  <label className="text-[10px] font-bold text-[#00004d] block uppercase">Required Education *</label>
                  <div onClick={() => setIsEduOpen(!isEduOpen)} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold text-[#00004d] flex justify-between items-center cursor-pointer">
                    {formData.education || "Select Education"} <ChevronDown size={16} className={isEduOpen ? 'rotate-180' : ''} />
                  </div>
                  {isEduOpen && (
                    <div className="absolute z-50 w-full bg-white border rounded-2xl shadow-xl overflow-hidden mt-1">
                      <div className="p-2 bg-gray-50"><input placeholder="Search education..." className="w-full p-2 text-xs border rounded-lg outline-none" value={eduSearch} onChange={(e) => setEduSearch(e.target.value)} /></div>
                      <div className="max-h-60 overflow-y-auto">{filteredEducation.map(edu => <div key={edu} onClick={() => { setFormData({ ...formData, education: edu }); setIsEduOpen(false); }} className="px-4 py-3 text-xs font-bold hover:bg-blue-50 cursor-pointer">{edu}</div>)}</div>
                    </div>
                  )}
                  {formData.education === "Other" && <input placeholder="Specify Education" className="w-full mt-2 bg-[#f8fafc] border-2 border-blue-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.otherEducation} onChange={(e) => setFormData({ ...formData, otherEducation: e.target.value })} />}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#00004d] block uppercase">Job Type</label>
                  <select className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>{JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Salary & Requirements</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5"><label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1 uppercase"><DollarSign size={12} /> Monthly Salary *</label><input placeholder="e.g. 40k - 60k" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} /></div>
                  <div className="space-y-1.5"><label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1 uppercase"><Briefcase size={12} /> Experience *</label><input placeholder="e.g. 1 Year / Fresh" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} /></div>
                  <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1 uppercase"><Award size={12} /> Skills</label><input placeholder="Comma separated skills (e.g. Sales, Marketing)" className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} /></div>
                  <div className="space-y-1.5 md:col-span-2"><label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1 uppercase"><FileText size={12} /> Description (Optional)</label><textarea rows={4} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between mt-12 gap-4">
              {currentStep > 1 && <button type="button" onClick={prevStep} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gray-100 text-[#00004d] font-bold text-sm hover:bg-gray-200 transition-colors"><ArrowLeft size={18} /> Back</button>}
              {currentStep < totalSteps ? (
                <button type="button" onClick={nextStep} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#00004d] text-white font-bold text-sm active:scale-95 transition-transform">Next Step <ArrowRight size={18} /></button>
              ) : (
                <button type="button" onClick={handleFinalSubmit} disabled={loading} className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#5DBB63] text-white font-bold text-sm shadow-lg active:scale-95 transition-transform disabled:opacity-70">
                  {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />} {loading ? "Publishing..." : "Publish Vacancy"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}