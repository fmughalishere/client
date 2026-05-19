"use client";

import React, { useState, useRef, ChangeEvent, FormEvent, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Cropper, { Area } from "react-easy-crop";
import {
  User, Camera, Check, Loader2, CheckCircle2, Mail, Phone, MessageCircle, Trash2, X, Lock, ArrowRight, ArrowLeft
} from "lucide-react";

import {
  MALE_ICON, FEMALE_ICON, CITIES, JOB_TYPES, JOB_CATEGORIES, EDUCATION_OPTIONS
} from "../constants";

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

const navyBlueFilter = {
  filter: "invert(7%) sepia(76%) saturate(5793%) hue-rotate(241deg) brightness(91%) contrast(108%)"
};

interface ExperienceEntry {
  companyName: string;
  designation: string;
  startDate: string;
  endDate: string;
  isCurrentJob: boolean;
}

function AuthRequiredModal({ isOpen, onClose, onAction }: { isOpen: boolean; onClose: () => void; onAction: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-[30px] p-8 text-center shadow-2xl">
            <div className="bg-[#5DBB63] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[#00004d]" size={30} />
            </div>
            <h3 className="text-xl font-bold text-[#00004d] mb-2">Authentication Required</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">Please login or create your account first to submit your application.<br /><span className="text-[12px] text-gray-400 mt-2 block">اپنا اکاؤنٹ لاگ ان کریں یا نیا اکاؤنٹ بنائیں۔</span></p>
            <div className="space-y-3">
              <button onClick={onAction} className="w-full bg-[#00004d] text-white py-4 rounded-xl font-bold text-sm active:scale-95 transition-transform">Continue to Account</button>
              <button onClick={onClose} className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-sm">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SuccessModal({ isOpen, onClose, onAction }: { isOpen: boolean, onClose: () => void, onAction: () => void, title: string, message: string }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative w-full max-w-[360px] md:max-w-md bg-white rounded-[30px] p-6 md:p-8 text-left shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-center mb-4"><div className="bg-green-100 p-3 rounded-full"><CheckCircle2 size={40} className="text-green-500" /></div></div>
            <h3 className="text-xl font-bold text-[#00004d] mb-3 text-center">Thank You for Submitting Your Profile</h3>
            <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
              <div><p className="font-semibold">1. Your profile will be published after admin approval.</p><p className="text-gray-500 text-[12px]">آپ کی پروفائل مین پیج پر صرف ایڈمن کی منظوری کے بعد لگائی جائے گی۔</p></div>
              <div><p className="font-semibold">2. Your contact information will remain confidential.</p><p className="text-gray-500 text-[12px]">آپ کی کانٹیکٹ انفارمیشن مکمل طور پر خفیہ رکھی جائے گی۔</p></div>
              <div><p className="font-semibold">3. Employers will contact you directly.</p><p className="text-gray-500 text-[12px]">ایمپلائر خود آپ سے براہِ راست رابطہ کریں گے اور آپ کو جاب آفر دیں گے۔</p></div>
            </div>
            <button onClick={onAction} className="w-full mt-6 bg-[#00004d] text-white py-4 rounded-full font-bold text-sm active:scale-95 transition-transform">Go to Dashboard</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function MobileResponsiveJobForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [isFresher, setIsFresher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const catRef = useRef<HTMLDivElement>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [isEduOpen, setIsEduOpen] = useState(false);
  const [eduSearch, setEduSearch] = useState("");
  const eduRef = useRef<HTMLDivElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "", dob: "", gender: "Male", city: "", image: "",
    jobtype: "Full-Time", category: "", otherCategory: "", education: "", otherEducation: "",
    yearsOfExperience: "0", skills: "", achievements: "",
    email: "", phone: "+92 ", whatsapp: "+92 ", salaryDemand: "", agreeTerms: false
  });

  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([
    { companyName: "", designation: "", startDate: "", endDate: "", isCurrentJob: false }
  ]);

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleAuthNavigation = () => {
    localStorage.setItem("pendingJobApplication", JSON.stringify({ formData, isFresher, experienceList }));
    const isRegistered = localStorage.getItem("isRegistered");
    router.push(isRegistered === "true" ? "/login" : "/register");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (eduRef.current && !eduRef.current.contains(event.target as Node)) setIsEduOpen(false);
      if (catRef.current && !catRef.current.contains(event.target as Node)) setIsCatOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  const calculatedTotalYears = useMemo(() => {
    if (isFresher) return 0;
    let totalMonths = 0;
    experienceList.forEach(exp => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.isCurrentJob ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        if (months > 0) totalMonths += months;
      }
    });
    return (totalMonths / 12).toFixed(1);
  }, [experienceList, isFresher]);

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    let value = e.target.value;
    if (!value.startsWith("+92 ")) value = "+92 ";
    const suffix = value.slice(4).replace(/[^\d]/g, "");
    let formatted = "+92 ";
    if (suffix.length > 0) formatted += suffix.slice(0, 3);
    if (suffix.length > 3) formatted += " " + suffix.slice(3, 10);
    setFormData({ ...formData, [field]: formatted });
  };

  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredEducation = useMemo(() => {
    const filtered = EDUCATION_OPTIONS.filter(opt => opt.toLowerCase().includes(eduSearch.toLowerCase()));
    return ["Other", ...filtered];
  }, [eduSearch]);

  const filteredCategories = useMemo(() => {
    const filtered = JOB_CATEGORIES.filter(opt => opt.toLowerCase().includes(catSearch.toLowerCase()));
    return ["Other", ...filtered];
  }, [catSearch]);

  const handleExperienceChange = (index: number, field: keyof ExperienceEntry, value: any) => {
    const newList = [...experienceList];
    newList[index] = { ...newList[index], [field]: value };
    setExperienceList(newList);
  };

  const addExperience = () => setExperienceList([...experienceList, { companyName: "", designation: "", startDate: "", endDate: "", isCurrentJob: false }]);
  const removeExperience = (index: number) => setExperienceList(experienceList.filter((_, i) => i !== index));

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
      setFormData({ ...formData, image: croppedImage });
      setIsCropping(false);
      setImageToCrop(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { setIsAuthModalOpen(true); return; }
    if (!formData.agreeTerms) { alert("Please agree to the privacy policy."); return; }

    setLoading(true);
    const finalPayload = {
      ...formData,
      category: formData.category === "Other" ? formData.otherCategory : formData.category,
      education: formData.education === "Other" ? formData.otherEducation : formData.education,
      skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
      isFresher,
      yearsOfExperience: isFresher ? 0 : Number(calculatedTotalYears),
      experience: isFresher ? [] : experienceList
    };

    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(finalPayload)
      });
      if (res.ok) { setSubmitted(true); setIsModalOpen(true); }
      else { const data = await res.json(); alert(data.message || "Error submitting application"); }
    } catch { alert("Server error. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-10 font-sans">
      <AuthRequiredModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAction={handleAuthNavigation} />
      <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="" message="" onAction={() => router.push("/")} />
      <AnimatePresence>
        {isCropping && (
          <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black p-4">
            <div className="relative w-full h-[60vh] md:w-[500px] md:h-[500px] bg-gray-900 rounded-2xl overflow-hidden">
              <Cropper image={imageToCrop!} crop={crop} zoom={zoom} aspect={1} cropShape="round" onCropChange={setCrop} onCropComplete={(_, pix) => setCroppedAreaPixels(pix)} onZoomChange={setZoom} />
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

      <div className="bg-white rounded-b-[40px] pt-8 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#5DBB63] text-3xl font-bold">Apply for a Job</motion.h1>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`h-1.5 w-8 rounded-full transition-all duration-300 ${s <= currentStep ? 'bg-[#5DBB63]' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[35px] shadow-xl overflow-hidden border border-white">
          <form onSubmit={handleSubmit} className="p-6 md:p-14">
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                <section className="flex flex-col items-center gap-6">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-[#f8fcfd] shadow-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                      {formData.image.length > 20 ? (
                        <img src={formData.image} className="w-full h-full object-cover" alt="Profile" />
                      ) : formData.image === "male" ? (
                        <img src={MALE_ICON} className="w-[80%] h-[80%] object-contain" style={navyBlueFilter} alt="Male" />
                      ) : formData.image === "female" ? (
                        <img src={FEMALE_ICON} className="w-[80%] h-[80%] object-contain" style={navyBlueFilter} alt="Female" />
                      ) : (
                        <div className="bg-[#00004d] w-full h-full flex items-center justify-center"><User className="w-16 h-16 text-white" /></div>
                      )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-[#00004d] text-white p-2.5 rounded-full shadow-lg"><Camera size={18} /></div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                  <div className="flex gap-4 w-full justify-center">
                    <button type="button" onClick={() => setFormData({ ...formData, image: "male" })} className={`px-6 py-3 rounded-xl border-2 transition-all ${formData.image === "male" ? 'border-[#00004d] bg-[#00004d] text-white' : 'border-gray-100 text-gray-400'}`}>
                      <span className="text-[10px] font-bold">Male Icon</span>
                    </button>
                    <button type="button" onClick={() => setFormData({ ...formData, image: "female" })} className={`px-6 py-3 rounded-xl border-2 transition-all ${formData.image === "female" ? 'border-[#00004d] bg-[#00004d] text-white' : 'border-gray-100 text-gray-400'}`}>
                      <span className="text-[10px] font-bold">Female Icon</span>
                    </button>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Personal Details</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#00004d] ml-1">Full Name</label>
                      <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Enter Your Name" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#00004d] ml-1">Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#00004d] ml-1">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none"><option>Male</option><option>Female</option><option>Other</option></select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#00004d] ml-1">City</label>
                      <select required name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                        <option value="">Select City</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Profession & Type</h2></div>
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-[#00004d] block">Desired Job Category</label>
                  <div className="relative" ref={catRef}>
                    <div onClick={() => setIsCatOpen(!isCatOpen)} className="w-full bg-[#f8fafc] p-4 rounded-xl border border-gray-100 flex justify-between items-center cursor-pointer">
                      <span className="font-bold text-[#00004d] text-sm">{formData.category || "Select Category"}</span>
                    </div>
                    {isCatOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-2 bg-gray-50"><input placeholder="Search..." className="w-full p-2 text-sm border rounded-lg outline-none" value={catSearch} onChange={(e) => setCatSearch(e.target.value)} /></div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCategories.map(opt => (
                            <div key={opt} onClick={() => { setFormData({ ...formData, category: opt }); setIsCatOpen(false); }} className="px-4 py-3 text-sm font-bold hover:bg-gray-50 cursor-pointer">{opt}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {formData.category === "Other" && (
                    <input name="otherCategory" value={formData.otherCategory} onChange={handleChange} placeholder="Specify category" className="w-full bg-[#f8fafc] border border-blue-100 rounded-xl p-4 text-sm font-bold outline-none" />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#00004d] block">Job Type</label>
                  <select name="jobtype" value={formData.jobtype} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                    {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Education</h2></div>
                <div className="relative" ref={eduRef}>
                  <div onClick={() => setIsEduOpen(!isEduOpen)} className="w-full bg-[#f8fafc] p-4 rounded-xl border border-gray-100 flex justify-between items-center cursor-pointer">
                    <span className="font-bold text-[#00004d] text-sm">{formData.education || "Select Qualification"}</span>
                  </div>
                  {isEduOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                      <div className="p-2 bg-gray-50"><input placeholder="Search..." className="w-full p-2 text-sm border rounded-lg outline-none" value={eduSearch} onChange={(e) => setEduSearch(e.target.value)} /></div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredEducation.map(opt => (
                          <div key={opt} onClick={() => { setFormData({ ...formData, education: opt }); setIsEduOpen(false); }} className="px-4 py-3 text-sm font-bold hover:bg-gray-50 cursor-pointer">{opt}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {formData.education === "Other" && (
                  <input name="otherEducation" value={formData.otherEducation} onChange={handleChange} placeholder="Specify qualification" className="w-full bg-[#f8fafc] border border-blue-100 rounded-xl p-4 text-sm font-bold outline-none" />
                )}
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center justify-between border-l-4 border-[#00004d] pl-3">
                  <h2 className="text-[#00004d] font-bold text-lg tracking-wider">Experience & Skills</h2>
                  <label className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full cursor-pointer">
                    <input type="checkbox" checked={isFresher} onChange={(e) => setIsFresher(e.target.checked)} className="accent-[#00004d]" />
                    <span className="text-[10px] font-bold">I am a Fresher</span>
                  </label>
                </div>

                {!isFresher && (
                  <div className="space-y-4">
                    <div className="bg-[#00004d] text-white px-4 py-2 rounded-xl w-fit text-xs font-bold">Total: {calculatedTotalYears} Years Exp</div>
                    {experienceList.map((exp, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-2xl border relative space-y-3">
                        {experienceList.length > 1 && <button type="button" onClick={() => removeExperience(index)} className="absolute top-2 right-2 text-red-500"><Trash2 size={16} /></button>}
                        <input placeholder="Company Name" value={exp.companyName} onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)} className="w-full p-3 rounded-xl border text-sm font-bold outline-none" />
                        <input placeholder="Designation" value={exp.designation} onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)} className="w-full p-3 rounded-xl border text-sm font-bold outline-none" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="date" value={exp.startDate} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} className="p-3 rounded-xl border text-xs font-bold" />
                          <input type="date" disabled={exp.isCurrentJob} value={exp.endDate} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} className="p-3 rounded-xl border text-xs font-bold" />
                        </div>
                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 cursor-pointer">
                          <input type="checkbox" checked={exp.isCurrentJob} onChange={(e) => handleExperienceChange(index, 'isCurrentJob', e.target.checked)} /> Currently Working Here
                        </label>
                      </div>
                    ))}
                    <button type="button" onClick={addExperience} className="w-full py-3 border-2 border-dashed rounded-xl text-gray-400 font-bold text-xs">+ Add Experience</button>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#00004d] block">Skills (Comma separated)</label>
                  <input name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="e.g. Sales, Marketing, Driving" />
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-bold text-lg tracking-wider">Contact Info & Salary</h2></div>
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1"><Mail size={12} /> Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="example@mail.com" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1"><Phone size={12} /> Phone</label>
                      <input name="phone" value={formData.phone} onChange={(e) => handlePhoneChange(e, "phone")} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-[#00004d] flex items-center gap-1"><MessageCircle size={12} /> WhatsApp</label>
                      <input name="whatsapp" value={formData.whatsapp} onChange={(e) => handlePhoneChange(e, "whatsapp")} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-[#00004d]">Salary Demand</label>
                    <input name="salaryDemand" value={formData.salaryDemand} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="e.g. 50,000 - 60,000" />
                  </div>
                </div>

                <div className="pt-6 border-t space-y-4">
                  <button type="button" onClick={() => router.push('/readpolicy')} className="text-[#00004d] text-[11px] font-bold underline">Read Privacy Policy</button>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${formData.agreeTerms ? 'bg-[#00004d] border-[#00004d]' : 'bg-white'}`}>
                      <input type="checkbox" className="hidden" checked={formData.agreeTerms} onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })} />
                      {formData.agreeTerms && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">I agree to the privacy policy</span>
                  </label>
                </div>
              </motion.div>
            )}

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
                <button disabled={loading || submitted} className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#5DBB63] text-white font-bold text-sm shadow-lg active:scale-95 transition-transform">
                  {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}