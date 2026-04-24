"use client";

import React, { useState, useRef, ChangeEvent, FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Camera, Check, Globe, Briefcase, Loader2, CheckCircle, CheckCircle2, X, Wand2
} from "lucide-react";

import {
  MALE_ICON, FEMALE_ICON, CITIES, JOB_TYPES, JOB_CATEGORIES, EDUCATION_GROUPS
} from "../constants";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

function SuccessModal({ isOpen, onClose, title, message }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative w-full max-w-[340px] md:max-w-sm bg-white rounded-[30px] p-6 md:p-8 text-center shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 size={40} className="text-green-500 md:w-12 md:h-12" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-[#00004d] mb-2">{title}</h3>
            <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 leading-relaxed">{message}</p>
            <button onClick={onClose} className="w-full bg-[#00004d] text-white py-4 rounded-full font-black text-sm md:text-base active:scale-95 transition-transform">Go to Dashboard</button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function MobileResponsiveJobForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFresher, setIsFresher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const [formData, setFormData] = useState({
    fullName: "", dob: "", gender: "Male", city: "", image: "", jobtype: "Full-Time", category: "", education: "", yearsOfExperience: "", skills: "", achievements: "", agreeTerms: false
  });

  const calculatedAge = useMemo(() => {
    if (!formData.dob) return null;
    const birthDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age < 0 ? 0 : age;
  }, [formData.dob]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      setModalContent({ title: "Agreement Required", message: "Please agree to the privacy policy before submitting." });
      setIsModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ ...formData, skills: formData.skills.split(",").map(s => s.trim()), isFresher, yearsOfExperience: isFresher ? "Fresher" : formData.yearsOfExperience }),
      });
      if (response.ok) {
        setSubmitted(true);
        setModalContent({ title: "Application Received!", message: "Your application has been submitted successfully." });
      } else {
        const data = await response.json();
        setModalContent({ title: "Submission Failed", message: data.message || "Something went wrong." });
      }
      setIsModalOpen(true);
    } catch (error) {
      setModalContent({ title: "Connection Error", message: "Server is not responding." });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-10 font-sans">
      <SuccessModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); if (submitted) window.location.reload(); }} title={modalContent.title} message={modalContent.message} />

      <div className="bg-[#0E8449] pt-12 pb-20 md:pt-16 md:pb-24 rounded-b-[40px] md:rounded-b-[60px] text-center border-b border-blue-100 px-4">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-white text-3xl md:text-5xl font-black tracking-tight">Apply for a Job</motion.h1>
        <p className="text-white/60 font-bold text-[10px] md:text-xs mt-3 tracking-[0.2em] md:tracking-[0.4em] uppercase">Create your professional profile</p>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 md:-mt-16 px-4">
        <div className="bg-white rounded-[35px] md:rounded-[45px] shadow-xl overflow-hidden border border-white">
          <form onSubmit={handleSubmit} className="p-6 md:p-14 space-y-12 md:space-y-20">
            <section className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 md:border-8 border-[#f8fcfd] shadow-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                  {formData.image.length > 20 ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Profile" />
                  ) : formData.image === "male" ? (
                    <img src={MALE_ICON} className="w-[85%] h-[85%] object-contain" alt="Male Icon" />
                  ) : formData.image === "female" ? (
                    <img src={FEMALE_ICON} className="w-[85%] h-[85%] object-contain" alt="Female Icon" />
                  ) : (
                    <User className="w-16 h-16 text-gray-200" />
                  )}
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-[#00004d] text-white p-2.5 rounded-full shadow-lg"><Camera size={18} /></button>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Optional</span>
              <div className="flex items-center gap-4 w-full max-w-xs">
                <div className="h-[1px] bg-gray-200 flex-1"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or Use Icon</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
              <div className="flex gap-4 w-full justify-center">
                <button type="button" onClick={() => setFormData({ ...formData, image: "male" })} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${formData.image === "male" ? 'border-[#00004d] bg-[#00004d] text-white' : 'border-gray-100 text-gray-400'}`}>
                  <img src={MALE_ICON} className={`w-5 h-5 ${formData.image === "male" ? 'brightness-0 invert' : ''}`} alt="" /> <span className="text-[10px] font-bold">Male</span>
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, image: "female" })} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${formData.image === "female" ? 'border-pink-500 bg-pink-500 text-white' : 'border-gray-100 text-gray-400'}`}>
                  <img src={FEMALE_ICON} className={`w-5 h-5 ${formData.image === "female" ? 'brightness-0 invert' : ''}`} alt="" /> <span className="text-[10px] font-bold">Female</span>
                </button>
              </div>
            </section>
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-black text-lg tracking-wider">Personal Details</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#00004d] ml-1">Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Enter Your Name" />
                </div>
                <div className="space-y-1.5 relative">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-[#00004d]">Date of Birth</label>
                    {calculatedAge !== null && <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{calculatedAge} Years Old</span>}
                  </div>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" />
                </div>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none"><option>Male</option><option>Female</option><option>Other</option></select>
                <div className="w-full bg-gray-100 rounded-xl p-4 text-sm font-bold text-gray-500 flex items-center gap-2"><Globe size={14} /> Pakistan</div>
                <div className="md:col-span-2">
                  <select required name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                    <option value="">Select City</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#00004d] ml-1 block">Desired Job</label>
                <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#f8fafc] p-4 rounded-xl font-bold text-[#00004d] text-sm border border-gray-100 outline-none">
                  <option value="">Select Category</option>
                  {JOB_CATEGORIES.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#00004d] ml-1 block">Job Type</label>
                <select name="jobtype" value={formData.jobtype} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <section className="space-y-3">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-black text-lg tracking-wider">Experience</h2></div>
              <select
                required
                name="education"
                value={formData.education}
                onChange={handleChange}
                className="w-full bg-[#f8fafc] border border-gray-100 rounded-lg p-2 text-xs font-semibold outline-none"
              >
                <option value="">Select Your Qualification</option>

                {EDUCATION_GROUPS.map((group, idx) => (
                  <optgroup key={idx} label={group.label}>
                    {group.options ? (
                      group.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))
                    ) : (
                      group.subGroups?.map((sub, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <option disabled className="text-gray-400 font-semibold">
                            -- {sub.title} --
                          </option>
                          {sub.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </React.Fragment>
                      ))
                    )}
                  </optgroup>
                ))}
              </select>
            </section>
            <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-black text-lg tracking-wider">Experience</h2></div>
            <section className="p-5 md:p-10 rounded-[30px] border-2 border-white shadow-inner">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black text-[#00004d] tracking-widest flex items-center gap-2 uppercase"><Briefcase size={14} /> Work Experience</h3>
                <label className="flex items-center gap-3 bg-white px-4 py-2 rounded-full cursor-pointer shadow-sm active:scale-95 transition-all">
                  <input type="checkbox" checked={isFresher} onChange={(e) => setIsFresher(e.target.checked)} className="accent-[#00004d] w-4 h-4" />
                  <span className="text-[10px] font-black text-[#00004d]">Fresher</span>
                </label>
              </div>
              {!isFresher && (
                <div className="space-y-6">
                  <input type="text" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} className="w-full bg-white rounded-xl p-4 text-sm font-bold shadow-sm outline-none" placeholder="Experience (e.g. 2 Years, 5 Months)" />
                  <textarea value={formData.achievements} name="achievements" onChange={handleChange} className="w-full bg-white rounded-xl p-4 text-sm font-bold shadow-sm outline-none" placeholder="Experience Details or Achievements..." rows={4} />
                </div>
              )}
            </section>
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-black text-lg tracking-wider">Skills</h2></div>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Your Skills (Comma Separated)" />
            </section>
            <div className="flex flex-col items-center gap-8 pt-10 border-t">
              <button type="button" className="w-full md:w-auto bg-[#0E8449] text-white px-12 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-sm">
                Read Privacy Policy
              </button>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.agreeTerms ? 'bg-[#00004d] border-[#00004d]' : 'bg-white border-gray-200'}`}>
                  <input type="checkbox" className="hidden" checked={formData.agreeTerms} onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })} />
                  {formData.agreeTerms && <Check size={14} className="text-white" />}
                </div>
                <span className="text-[10px] font-black text-gray-400">I agree to the privacy policy</span>
              </label>
              <button disabled={loading || submitted} className={`w-full md:w-80 font-black py-5 rounded-2xl shadow-xl tracking-[0.2em] text-xs transition-all flex justify-center items-center gap-2 ${submitted ? 'bg-green-600 text-white' : 'bg-[#00004d] text-white active:scale-95'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : submitted ? <CheckCircle size={18} /> : "Submit Application"}
                {loading ? " Submitting..." : submitted ? " Submitted!" : ""}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}