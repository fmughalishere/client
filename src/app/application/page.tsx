"use client";

import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Camera, Check, Globe, Calendar, Briefcase, Loader2
} from "lucide-react";
import { GrUserManager, GrUserFemale } from "react-icons/gr";

export default function MobileResponsiveJobForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  
  const [activeExpTab, setActiveExpTab] = useState(1);
  const [isFresher, setIsFresher] = useState(false);
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "Male",
    city: "",
    image: "",
    jobtype: "Full-Time",
    category: "",
    education: "Matric",
    experienceData: [
      { company: "", role: "", start: "", end: "", current: false },
      { company: "", role: "", start: "", end: "", current: false },
      { company: "", role: "", start: "", end: "", current: false }
    ],
    achievements: "",
    agreeTerms: false
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpFieldChange = (field: string, value: any) => {
    const updatedExp = [...formData.experienceData];
    (updatedExp[activeExpTab - 1] as any)[field] = value;
    setFormData(prev => ({ ...prev, experienceData: updatedExp }));
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
        setSelectedIcon("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) return alert("Please agree to privacy policy");
    
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          isFresher,
          experience: isFresher ? [] : formData.experienceData
        })
      });

      if (res.ok) {
        alert("Application Submitted Successfully!");
        window.location.reload();
      } else {
        const err = await res.json();
        alert(err.message || "Submission failed");
      }
    } catch (error) {
      alert("Error: Backend is not running on port 5000");
    } finally {
      setLoading(false);
    }
  };

  const cities = ["Karachi", "Lahore", "RWP/ISB", "Peshawar", "Quetta", "Multan", "Faisalabad"];
  const educationLevels = ["Matric", "Intermediate", "Bachelor's", "Master's", "M.Phil / PhD", "Diploma", "Other"];
  const jobTypes = ["Full-Time", "Part-Time", "One-Day Task"];
  
  const categories = [
    { options: ["House Maid", "Full Time Maid", "Part Time Maid", "Live-in Maid", "Nanny", "Child Caretaker", "Elderly Caretaker", "Patient Care Attendant", "Home Nurse", "Cook", "Home Chef", "Assistant Cook", "Car Driver", "Truck Driver", "Bus Driver", "Personal Driver", "House Driver", "Office Driver", "Gardener", "Mali", "Security Guard", "Home Security Guard", "Gate Keeper", "Watchman", "Cleaner", "House Cleaner", "Office Cleaner", "Janitor", "Laundry Worker", "Ironing Man (Press Wala)", "Dish Washer", "Kitchen Helper", "Peon", "Office Boy", "House Boy", "Care Taker (General)", "Building Caretaker", "Helper", "General Helper", "Delivery Rider", "Courier Boy", "Receptionist", "Customer Care Taker", "Tractor Driver", "Beautition", "Barber", "Salesman", "Mid-Wife", "LHV", "Lab Technicain", "OTA", "Physiotherapist", "Nutritionist", "Coach", "Waiter", "Trainer", "Pilot", "Mobile Technician", "TV Technician", "Laptop Technician", "Motorcycle Mechanic", "Car Mechanic", "Car Painter", "Plumber", "Carpentar", "Phone Operator", "Air-Hostess", "Steward", "Translator", "Typist"] },
    { options: ["Administrator", "Office Manager", "Executive Assistant", "Operations Manager", "Farmer", "Livestock Farmer", "Agricultural Engineer", "Agronomist", "Graphic Designer", "Painter", "Illustrator", "Fashion Designer", "Animator", "Mechanical Engineer", "Auto Mechanic", "Technician", "Vehicle Inspector", "Accountant", "Banker", "Auditor", "Financial Analyst", "Business Analyst", "Business Development Manager", "Consultant", "Operations Manager", "Strategy Consultant", "Project Manager", "Customer Support Executive", "Call Center Agent", "Client Relationship Manager", "Civil Engineer", "Structural Engineer", "Site Supervisor", "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Researcher", "SEO Specialist", "Content Creator", "Social Media Manager", "Digital Marketer", "Teacher", "Lecturer", "Tutor", "Researcher", "Trainer", "E-commerce Manager", "Online Store Owner", "Marketplace Seller", "Electrical Engineer", "Electronics Technician", "Automation Engineer", "Doctor", "Nurse", "Pharmacist", "Lab Technician", "Surgeon", "HR Manager", "Recruiter", "HR Assistant", "Talent Acquisition Specialist", "Software Developer", "IT Support", "System Administrator", "Network Engineer", "Web Developer", "Frontend Developer", "Backend Developer", "Fullstack Developer", "Lawyer", "Judge", "Police Officer", "Paralegal", "Logistics Manager", "Warehouse Manager", "Supply Chain Analyst", "Driver", "Sales Executive", "Marketing Manager", "Brand Manager", "Business Development Executive", "Actor", "Musician", "Photographer", "Director", "Content Creator", "Pharmacist", "Lab Scientist", "Biotech Researcher", "Clinical Researcher", "Project Manager", "Program Manager", "Project Coordinator", "Researcher", "Lab Scientist", "R&D Engineer", "Biologist", "Chemist", "Physicist", "Lab Technician", "Security Guard", "Security Supervisor", "Investigator", "Social Worker", "NGO Coordinator", "Field Officer", "Telecom Engineer", "Network Technician", "Technical Support", "Travel Agent", "Tour Guide", "Visa Officer", "Ticketing Officer", "Veterinarian", "Animal Caretaker", "Pet Groomer", "Freelancer", "Content Writer", "Designer", "Online Consultant", "Other"] }
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-10 font-sans">
      <div className="bg-[#e2f2f5] pt-12 pb-20 md:pt-16 md:pb-24 rounded-b-[40px] md:rounded-b-[60px] text-center border-b border-blue-100 px-4">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#00004d] text-3xl md:text-5xl font-black uppercase tracking-tight">
          Apply for a Job
        </motion.h1>
        <p className="text-[#00004d]/60 font-bold text-[10px] md:text-xs mt-3 uppercase tracking-[0.2em] md:tracking-[0.4em]">
          Create your professional profile
        </p>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 md:-mt-16 px-4">
        <div className="bg-white rounded-[35px] md:rounded-[45px] shadow-xl overflow-hidden border border-white">
          <form onSubmit={handleSubmit} className="p-6 md:p-14 space-y-12 md:space-y-20">
              <section className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 md:border-8 border-[#f8fcfd] shadow-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                  {formData.image && formData.image.startsWith("data:") ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Profile" />
                  ) : selectedIcon === "male" ? (
                    <GrUserManager className="w-full h-full text-[#00004d] p-2" />
                  ) : selectedIcon === "female" ? (
                    <GrUserFemale className="w-full h-full text-pink-500 p-2" />
                  ) : (
                    <User className="w-16 h-16 text-gray-200" />
                  )}
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-[#00004d] text-white p-2.5 rounded-full shadow-lg">
                  <Camera size={18} />
                </button>
              </div>
              <div className="text-center w-full">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full md:w-auto bg-[#00004d] text-white px-10 py-3.5 rounded-full font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                  Upload Photo
                </button>
                <p className="text-[10px] font-black text-gray-400 mt-2 uppercase">Optional</p>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
              </div>
              <div className="flex flex-col items-center gap-4 w-full">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Or Select Avatar</span>
                <div className="flex gap-4 w-full justify-center">
                  <button type="button" onClick={() => {setSelectedIcon("male"); setFormData({...formData, image: "male"})}} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${formData.image === "male" ? 'border-[#00004d] bg-[#00004d] text-white' : 'border-gray-100 text-gray-400'}`}>
                    <GrUserManager size={20} /> <span className="text-[10px] font-bold uppercase">Male</span>
                  </button>
                  <button type="button" onClick={() => {setSelectedIcon("female"); setFormData({...formData, image: "female"})}} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${formData.image === "female" ? 'border-pink-500 bg-pink-500 text-white' : 'border-gray-100 text-gray-400'}`}>
                    <GrUserFemale size={20} /> <span className="text-[10px] font-bold uppercase">Female</span>
                  </button>
                </div>
              </div>
            </section>
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3">
                <h2 className="text-[#00004d] font-black text-lg uppercase tracking-wider">Personal Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#00004d] uppercase ml-1">Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none focus:bg-white focus:ring-1 focus:ring-[#00004d]/10 transition-all" placeholder="Enter Your Name" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#00004d] uppercase ml-1">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#00004d] uppercase ml-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#00004d] uppercase ml-1">Country</label>
                  <div className="w-full bg-gray-100 rounded-xl p-4 text-sm font-bold text-gray-500 flex items-center gap-2">
                    <Globe size={14} /> Pakistan
                  </div>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-[#00004d] uppercase ml-1">City</label>
                  <select required name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#00004d] uppercase ml-1 block">Desired Job</label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  className="w-full bg-[#f8fafc] p-4 rounded-xl font-bold text-[#00004d] text-sm border border-gray-100 outline-none focus:ring-1 focus:ring-[#00004d]/20"
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {[...new Set(categories.flatMap(cat => cat.options))].sort((a, b) => a.localeCompare(b))
                    .map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#00004d] uppercase ml-1 block">Job Type</label>
                <select name="jobtype" value={formData.jobtype} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                  {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <section className="space-y-8">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3">
                <h2 className="text-[#00004d] font-black text-lg uppercase tracking-wider">Education & Experience</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Education Level</label>
                  <select name="education" value={formData.education} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                    {educationLevels.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="bg-[#f0f8f9] p-5 md:p-10 rounded-[30px] border-2 border-white shadow-inner">
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h3 className="text-[10px] font-black uppercase text-[#00004d] tracking-widest text-center flex items-center gap-2">
                      <Briefcase size={14}/> Job Experience (Optional)
                    </h3>
                    <label className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white px-6 py-2.5 rounded-full cursor-pointer shadow-sm active:scale-95 transition-all">
                      <input type="checkbox" checked={isFresher} onChange={(e) => {setIsFresher(e.target.checked); setFormData({...formData, isFresher: e.target.checked} as any)}} className="accent-[#00004d] w-4 h-4" />
                      <span className="text-[10px] font-black text-[#00004d] uppercase tracking-tighter">I am a Fresher</span>
                    </label>
                  </div>

                  {!isFresher && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((n) => (
                          <button key={n} type="button" onClick={() => setActiveExpTab(n)} className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${activeExpTab === n ? 'bg-[#00004d] text-white shadow-md' : 'bg-white/50 text-gray-400'}`}>
                            Exp {n}
                          </button>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input value={formData.experienceData[activeExpTab-1].company} onChange={(e)=>handleExpFieldChange('company', e.target.value)} className="w-full bg-white rounded-xl p-4 text-sm font-bold shadow-sm outline-none" placeholder="Company Name" />
                        <input value={formData.experienceData[activeExpTab-1].role} onChange={(e)=>handleExpFieldChange('role', e.target.value)} className="w-full bg-white rounded-xl p-4 text-sm font-bold shadow-sm outline-none" placeholder="Your Designation/Role" />
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Start Date</label>
                          <input type="date" value={formData.experienceData[activeExpTab-1].start} onChange={(e)=>handleExpFieldChange('start', e.target.value)} className="w-full bg-white rounded-xl p-4 text-sm font-bold shadow-sm outline-none" />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-gray-400 uppercase ml-1">End Date</label>
                          {formData.experienceData[activeExpTab-1].current ? (
                            <div className="w-full bg-gray-100 rounded-xl p-4 text-sm font-bold shadow-inner text-[#00004d] flex items-center justify-center border border-dashed border-gray-300">
                               Currently Working (Present)
                            </div>
                          ) : (
                            <input type="date" value={formData.experienceData[activeExpTab-1].end} onChange={(e)=>handleExpFieldChange('end', e.target.value)} className="w-full bg-white rounded-xl p-4 text-sm font-bold shadow-sm outline-none" />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-start mt-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.experienceData[activeExpTab-1].current ? 'bg-[#00004d] border-[#00004d]' : 'bg-white border-gray-300'}`}>
                            <input type="checkbox" className="hidden" checked={formData.experienceData[activeExpTab-1].current} onChange={(e) => handleExpFieldChange('current', e.target.checked)} />
                            {formData.experienceData[activeExpTab-1].current && <Check size={12} className="text-white" />}
                          </div>
                          <span className="text-[10px] font-black text-[#00004d] uppercase tracking-tighter">I currently work here</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#00004d] uppercase ml-1 block">Achievements</label>
                <textarea name="achievements" value={formData.achievements} onChange={handleChange} placeholder="List your certificates or awards..." className="w-full bg-[#f8fafc] rounded-2xl p-5 h-40 outline-none text-sm font-bold border border-gray-50" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-[#00004d] uppercase ml-1 block">Documents (Optional)</label>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-dashed border-gray-200">
                  <span className="text-[8px] font-black text-gray-400 uppercase">Resume / CV</span>
                  <input type="file" className="block w-full text-[10px] mt-2 file:bg-[#00004d] file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-black cursor-pointer" />
                </div>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-dashed border-gray-200">
                  <span className="text-[8px] font-black text-gray-400 uppercase">Cover Letter</span>
                  <input type="file" className="block w-full text-[10px] mt-2 file:bg-[#00004d] file:text-white file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-black cursor-pointer" />
                </div>
              </div>
            </section>
            <div className="flex flex-col items-center gap-8 pt-10 border-t border-[#f8fafc]">
              <button type="button" className="w-full md:w-auto bg-[#e2f2f5] text-[#00004d] px-12 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-sm">
                Read Privacy Policy
              </button>
              
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.agreeTerms ? 'bg-[#00004d] border-[#00004d]' : 'bg-white border-gray-200'}`}>
                   <input type="checkbox" className="hidden" checked={formData.agreeTerms} onChange={(e)=>setFormData({...formData, agreeTerms: e.target.checked})} />
                   {formData.agreeTerms && <Check size={14} className="text-white" />}
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#00004d] transition-colors">I agree to the privacy policy</span>
              </label>

              <button 
                type="submit"
                disabled={loading}
                className="w-full md:w-80 bg-[#00004d] text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}