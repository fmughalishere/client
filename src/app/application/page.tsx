"use client";

import React, { useState, useRef, ChangeEvent, FormEvent, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User, Camera, Check, Globe, Briefcase, Loader2, CheckCircle, CheckCircle2, Mail, Phone, MessageCircle, Plus, Trash2
} from "lucide-react";

import {
  MALE_ICON, FEMALE_ICON, CITIES, JOB_TYPES, JOB_CATEGORIES, EDUCATION_GROUPS
} from "../constants";

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

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onAction: () => void;
}

function SuccessModal({ isOpen, onClose, title, message, onAction }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="relative w-full max-w-[340px] md:max-w-sm bg-white rounded-[30px] p-6 md:p-8 text-center shadow-2xl"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 size={40} className="text-green-500 md:w-12 md:h-12" />
              </div>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-[#00004d] mb-2">{title}</h3>
            <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 leading-relaxed">{message}</p>

            <button
              onClick={onAction}
              className="w-full bg-[#00004d] text-white py-4 rounded-full font-black text-sm md:text-base active:scale-95 transition-transform"
            >
              Go to Dashboard
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function MobileResponsiveJobForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isFresher, setIsFresher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });

  const [formData, setFormData] = useState({
    fullName: "", dob: "", gender: "Male", city: "", image: "",
    jobtype: "Full-Time", category: "", education: "",
    yearsOfExperience: "0", skills: "", achievements: "",
    email: "", phone: "+92 ", whatsapp: "+92 ", agreeTerms: false
  });

  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([
    { companyName: "", designation: "", startDate: "", endDate: "", isCurrentJob: false }
  ]);

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

  useEffect(() => {
    const savedData = localStorage.getItem("pendingJobApplication");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed.formData);
      setIsFresher(parsed.isFresher);
      if (parsed.experienceList) setExperienceList(parsed.experienceList);
      localStorage.removeItem("pendingJobApplication");
    }
  }, []);

  const handleRedirect = () => {
    const token = localStorage.getItem("token");
    setIsModalOpen(false);
    if (!token) {
      router.push("/login");
    } else {
      router.push("/");
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    let value = e.target.value;
    if (!value.startsWith("+92 ")) value = "+92 ";

    const suffix = value.slice(4).replace(/[^\d]/g, "");
    let formatted = "+92 ";
    if (suffix.length > 0) formatted += suffix.slice(0, 3);
    if (suffix.length > 3) formatted += " " + suffix.slice(3, 10);

    setFormData({ ...formData, [field]: formatted });
  };

  const calculatedAge = useMemo(() => {
    if (!formData.dob) return null;
    const birthDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age < 0 ? 0 : age;
  }, [formData.dob]);

  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index: number, field: keyof ExperienceEntry, value: any) => {
    const newList = [...experienceList];
    newList[index] = { ...newList[index], [field]: value };
    setExperienceList(newList);
  };

  const addExperience = () => {
    setExperienceList([...experienceList, { companyName: "", designation: "", startDate: "", endDate: "", isCurrentJob: false }]);
  };

  const removeExperience = (index: number) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("pendingJobApplication", JSON.stringify({ formData, isFresher, experienceList }));
      router.push("/login");
      return;
    }

    if (!formData.agreeTerms) {
      setModalContent({ title: "Agreement Required", message: "Please agree to the privacy policy." });
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    const finalPayload = {
      ...formData,
      skills: formData.skills ? formData.skills.split(",").map(s => s.trim()) : [],
      isFresher: isFresher,
      yearsOfExperience: isFresher ? 0 : Number(calculatedTotalYears),
      experience: isFresher ? [] : experienceList
    };

    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(finalPayload)
      });

      if (res.ok) {
        setSubmitted(true);
        setModalContent({
          title: "Application Received!",
          message: "Submitted successfully."
        });
      } else {
        const data = await res.json();
        setModalContent({
          title: "Error",
          message: data.message || "Something went wrong"
        });
      }

      setIsModalOpen(true);
    } catch {
      setModalContent({
        title: "Server Error",
        message: "Try again later"
      });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-10 font-sans">
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
        onAction={handleRedirect}
      />

      <div className="bg-[#5DBB63] pt-12 pb-20 md:pt-16 md:pb-24 rounded-b-[40px] md:rounded-b-[60px] text-center border-b border-blue-100 px-4">
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
                    <img src={MALE_ICON} className="w-[80%] h-[80%] object-contain" style={navyBlueFilter} alt="Male Icon" />
                  ) : formData.image === "female" ? (
                    <img src={FEMALE_ICON} className="w-[80%] h-[80%] object-contain" style={navyBlueFilter} alt="Female Icon" />
                  ) : (
                    <div className="bg-[#00004d] w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
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
                  <img src={MALE_ICON} className={`w-5 h-5 ${formData.image === "male" ? 'brightness-0 invert' : ''}`} style={formData.image !== "male" ? navyBlueFilter : {}} alt="" /> <span className="text-[10px] font-bold">Male</span>
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, image: "female" })} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${formData.image === "female" ? 'border-[#00004d] bg-[#00004d] text-white' : 'border-gray-100 text-gray-400'}`}>
                  <img src={FEMALE_ICON} className={`w-5 h-5 ${formData.image === "female" ? 'brightness-0 invert' : ''}`} style={formData.image !== "female" ? navyBlueFilter : {}} alt="" /> <span className="text-[10px] font-bold">Female</span>
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
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-black text-lg tracking-wider">Education</h2></div>
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
                        <option key={opt} value={opt}>{opt}</option>
                      ))
                    ) : (
                      group.subGroups?.map((sub, sIdx) => (
                        <React.Fragment key={sIdx}>
                          <option disabled className="text-gray-400 font-semibold">-- {sub.title} --</option>
                          {sub.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </React.Fragment>
                      ))
                    )}
                  </optgroup>
                ))}
              </select>
            </section>
            <section className="space-y-6">
              <div className="flex items-center justify-between border-l-4 border-[#00004d] pl-3">
                <h2 className="text-[#00004d] font-black text-lg tracking-wider">Experience</h2>
                <label className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full cursor-pointer border border-gray-100">
                    <input type="checkbox" checked={isFresher} onChange={(e) => setIsFresher(e.target.checked)} className="accent-[#00004d] w-4 h-4" />
                    <span className="text-[10px] font-black text-[#00004d]">I am a Fresher</span>
                </label>
              </div>

              {!isFresher && (
                <div className="space-y-6 bg-gray-50/50 p-5 md:p-8 rounded-[30px] border border-gray-100">
                    <div className="flex items-center gap-2 bg-[#00004d] text-white self-start px-4 py-2 rounded-xl w-fit">
                    <Briefcase size={14} />
                    <span className="text-xs font-black uppercase tracking-tight">Total: {calculatedTotalYears} Years Exp</span>
                  </div>

                  {experienceList.map((exp, index) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      key={index} 
                      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 relative"
                    >
                      {experienceList.length > 1 && (
                        <button type="button" onClick={() => removeExperience(index)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">
                          <Trash2 size={18} />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Company Name</label>
                          <input required placeholder="Google / Software House" value={exp.companyName} onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)} className="w-full bg-[#f8fafc] border border-gray-100 p-3 rounded-xl text-sm font-bold outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Designation</label>
                          <input required placeholder="Frontend Developer" value={exp.designation} onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)} className="w-full bg-[#f8fafc] border border-gray-100 p-3 rounded-xl text-sm font-bold outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Start Date</label>
                          <input required type="date" value={exp.startDate} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} className="w-full bg-[#f8fafc] border border-gray-100 p-3 rounded-xl text-sm font-bold outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">End Date</label>
                          <input required={!exp.isCurrentJob} disabled={exp.isCurrentJob} type="date" value={exp.endDate} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} className={`w-full bg-[#f8fafc] border border-gray-100 p-3 rounded-xl text-sm font-bold outline-none ${exp.isCurrentJob ? 'opacity-50' : ''}`} />
                          <label className="flex items-center gap-2 mt-2 ml-1 cursor-pointer">
                            <input type="checkbox" checked={exp.isCurrentJob} onChange={(e) => handleExperienceChange(index, 'isCurrentJob', e.target.checked)} className="w-3 h-3 accent-[#0E8449]" />
                            <span className="text-[10px] font-bold text-gray-500">Currently Working Here</span>
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <button type="button" onClick={addExperience} className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-xs hover:border-[#00004d] hover:text-[#00004d] transition-all">
                    <Plus size={16} /> Add Another Experience
                  </button>

                  <div className="space-y-2 mt-6">
                    <label className="text-[10px] font-black text-[#00004d] ml-1 block uppercase tracking-widest">Achievements / Key Responsibilities</label>
                    <textarea value={formData.achievements} name="achievements" onChange={handleChange} className="w-full bg-white rounded-xl p-4 text-sm font-bold shadow-sm outline-none border border-gray-100" placeholder="Describe your main projects or achievements..." rows={3} />
                  </div>
                </div>
              )}
            </section>
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-black text-lg tracking-wider">Skills</h2></div>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Your Skills (React, Node, Designer, etc.)" />
            </section>
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3"><h2 className="text-[#00004d] font-black text-lg tracking-wider">Contact Info</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-[#00004d] ml-1 flex items-center gap-1"><Mail size={12} /> Email Address</label>
                  <input type="email" required name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="example@mail.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#00004d] ml-1 flex items-center gap-1"><Phone size={12} /> Phone Number</label>
                  <input required name="phone" value={formData.phone} onChange={(e) => handlePhoneChange(e, "phone")} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="+92 300 0000000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#00004d] ml-1 flex items-center gap-1"><MessageCircle size={12} /> WhatsApp Number</label>
                  <input required name="whatsapp" value={formData.whatsapp} onChange={(e) => handlePhoneChange(e, "whatsapp")} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="+92 300 0000000" />
                </div>
              </div>
            </section>
            <div className="flex flex-col items-center gap-8 pt-10 border-t">
              <button type="button" className="w-full md:w-auto bg-[#5DBB63] text-white px-12 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-sm">
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