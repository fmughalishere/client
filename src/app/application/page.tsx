"use client";

import React, { useState, useRef, ChangeEvent, FormEvent, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Camera, Check, Globe, Briefcase, Loader2, CheckCircle, CheckCircle2, X, Wand2
} from "lucide-react";
import { GrUserManager, GrUserFemale } from "react-icons/gr";

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
              onClick={onClose} 
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
  const fileInputRef = useRef<HTMLInputElement>(null); 
  const [isFresher, setIsFresher] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "Male",
    city: "",
    image: "",
    jobtype: "Full-Time",
    category: "",
    education: "Matric",
    yearsOfExperience: "",
    skills: "",
    achievements: "",
    agreeTerms: false
  });

  const calculatedAge = useMemo(() => {
    if (!formData.dob) return null;
    const birthDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age < 0 ? 0 : age;
  }, [formData.dob]);

  const sortedCategories = [
    "House Maid", "Full Time Maid", "Part Time Maid", "Live-in Maid", "Nanny", "Child Caretaker", "Elderly Caretaker", "Patient Care Attendant", "Home Nurse", "Cook", "Home Chef", "Assistant Cook", "Car Driver", "Truck Driver", "Bus Driver", "Personal Driver", "House Driver", "Office Driver", "Gardener", "Mali", "Security Guard", "Home Security Guard", "Gate Keeper", "Watchman", "Cleaner", "House Cleaner", "Office Cleaner", "Janitor", "Laundry Worker", "Ironing Man (Press Wala)", "Dish Washer", "Kitchen Helper", "Peon", "Office Boy", "House Boy", "Care Taker (General)", "Building Caretaker", "Helper", "General Helper", "Delivery Rider", "Courier Boy", "Receptionist", "Customer Care Taker", "Tractor Driver", "Beautition", "Barber", "Salesman", "Mid-Wife", "LHV", "Lab Technicain", "OTA", "Physiotherapist", "Nutritionist", "Coach", "Waiter", "Trainer", "Pilot", "Mobile Technician", "TV Technician", "Laptop Technician", "Motorcycle Mechanic", "Car Mechanic", "Car Painter", "Plumber", "Carpentar", "Phone Operator", "Air-Hostess", "Steward", "Translator", "Typist", "Administrator", "Office Manager", "Executive Assistant", "Operations Manager", "Farmer", "Livestock Farmer", "Agricultural Engineer", "Agronomist", "Graphic Designer", "Painter", "Illustrator", "Fashion Designer", "Animator", "Mechanical Engineer", "Auto Mechanic", "Technician", "Vehicle Inspector", "Accountant", "Banker", "Auditor", "Financial Analyst", "Business Analyst", "Business Development Manager", "Consultant", "Strategy Consultant", "Project Manager", "Customer Support Executive", "Call Center Agent", "Client Relationship Manager", "Civil Engineer", "Structural Engineer", "Site Supervisor", "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Researcher", "SEO Specialist", "Content Creator", "Social Media Manager", "Digital Marketer", "Teacher", "Lecturer", "Tutor", "Researcher", "E-commerce Manager", "Online Store Owner", "Marketplace Seller", "Electrical Engineer", "Electronics Technician", "Automation Engineer", "Doctor", "Nurse", "Pharmacist", "Surgeon", "HR Manager", "Recruiter", "HR Assistant", "Talent Acquisition Specialist", "Software Developer", "IT Support", "System Administrator", "Network Engineer", "Web Developer", "Frontend Developer", "Backend Developer", "Fullstack Developer", "Lawyer", "Judge", "Police Officer", "Paralegal", "Logistics Manager", "Warehouse Manager", "Supply Chain Analyst", "Sales Executive", "Brand Manager", "Actor", "Musician", "Photographer", "Director", "Biotech Researcher", "Clinical Researcher", "Program Manager", "Project Coordinator", "Biologist", "Chemist", "Physicist", "Investigator", "Social Worker", "NGO Coordinator", "Field Officer", "Telecom Engineer", "Network Technician", "Technical Support", "Travel Agent", "Tour Guide", "Visa Officer", "Ticketing Officer", "Veterinarian", "Animal Caretaker", "Pet Groomer", "Freelancer", "Content Writer", "Online Consultant", "Other"
  ].sort((a, b) => a.localeCompare(b));

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 

    if (!formData.agreeTerms) {
      setModalContent({
        title: "Agreement Required",
        message: "Please agree to the privacy policy before submitting."
      });
      setIsModalOpen(true);
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("https://easyjobspk.onrender.com/api/applications", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          dob: formData.dob,
          gender: formData.gender,
          city: formData.city,
          image: formData.image,
          jobtype: formData.jobtype,
          category: formData.category,
          education: formData.education,
          isFresher: isFresher,
          yearsOfExperience: isFresher ? "Fresher" : formData.yearsOfExperience,
          skills: formData.skills.split(",").map(s => s.trim()),
          achievements: formData.achievements
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setModalContent({
          title: "Application Received!",
          message: "Your job application has been submitted successfully. We will get back to you soon."
        });
        setIsModalOpen(true);
      } else {
        setModalContent({
          title: "Submission Failed",
          message: data.message || "Something went wrong. Please check if you are logged in."
        });
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setModalContent({
        title: "Connection Error",
        message: "Server is not responding. Check your internet connection."
      });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (submitted) {
        window.location.reload();
    }
  };

  const cities = ["Karachi", "Lahore", "RWP/ISB", "Peshawar", "Quetta", "Multan", "Faisalabad"];
  const jobTypes = ["Full-Time", "Part-Time", "One-Day Task"];
  const educationOptions = ["Matric", "Intermediate", "Bachelors", "Masters", "M-Phil", "PhD", "Diploma"];

  return (
    <div className="min-h-screen bg-[#f4f7f9] pb-10 font-sans">
      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        title={modalContent.title} 
        message={modalContent.message} 
      />
      <div className="bg-[#e2f2f5] pt-12 pb-20 md:pt-16 md:pb-24 rounded-b-[40px] md:rounded-b-[60px] text-center border-b border-blue-100 px-4">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[#00004d] text-3xl md:text-5xl font-black tracking-tight">
          Apply for a Job
        </motion.h1>
        <p className="text-[#00004d]/60 font-bold text-[10px] md:text-xs mt-3 tracking-[0.2em] md:tracking-[0.4em]">
          Create your professional profile
        </p>
      </div>

      <div className="max-w-4xl mx-auto -mt-12 md:-mt-16 px-4">
        <div className="bg-white rounded-[35px] md:rounded-[45px] shadow-xl overflow-hidden border border-white">
          <form onSubmit={handleSubmit} className="p-6 md:p-14 space-y-12 md:space-y-20">
            <section className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 md:border-8 border-[#f8fcfd] shadow-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                  {formData.image && formData.image.length > 20 ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Profile" />
                  ) : formData.image === "male" ? (
                    <GrUserManager className="w-full h-full text-[#00004d] p-2" />
                  ) : formData.image === "female" ? (
                    <GrUserFemale className="w-full h-full text-pink-500 p-2" />
                  ) : (
                    <User className="w-16 h-16 text-gray-200" />
                  )}
                </div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-[#00004d] text-white p-2.5 rounded-full shadow-lg">
                  <Camera size={18} />
                </button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Optional</span>
              <div className="flex items-center gap-4 w-full max-w-xs">
                <div className="h-[1px] bg-gray-200 flex-1"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Or Use Icon</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
              </div>
              <div className="flex gap-4 w-full justify-center">
                  <button type="button" onClick={() => setFormData({...formData, image: "male"})} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${formData.image === "male" ? 'border-[#00004d] bg-[#00004d] text-white' : 'border-gray-100 text-gray-400'}`}>
                    <GrUserManager size={20} /> <span className="text-[10px] font-bold">Male</span>
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, image: "female"})} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all ${formData.image === "female" ? 'border-pink-500 bg-pink-500 text-white' : 'border-gray-100 text-gray-400'}`}>
                    <GrUserFemale size={20} /> <span className="text-[10px] font-bold">Female</span>
                  </button>
              </div>
            </section>
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3">
                <h2 className="text-[#00004d] font-black text-lg tracking-wider">Personal Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#00004d] ml-1">Full Name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Enter Your Name" />
                </div>

                <div className="space-y-1.5 relative">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black text-[#00004d]">Date of Birth</label>
                    {calculatedAge !== null && (
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md animate-pulse">
                        {calculatedAge} Years Old
                      </span>
                    )}
                  </div>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none" />
                </div>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                    <option>Male</option><option>Female</option><option>Other</option>
                </select>
                <div className="w-full bg-gray-100 rounded-xl p-4 text-sm font-bold text-gray-500 flex items-center gap-2">
                    <Globe size={14} /> Pakistan
                </div>
                <div className="md:col-span-2">
                  <select required name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#00004d] ml-1 block">Desired Job</label>
                <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#f8fafc] p-4 rounded-xl font-bold text-[#00004d] text-sm border border-gray-100 outline-none">
                  <option value="">Select Category</option>
                  {sortedCategories.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#00004d] ml-1 block">Job Type</label>
                <select name="jobtype" value={formData.jobtype} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                  {jobTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <section className="space-y-8">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3">
                <h2 className="text-[#00004d] font-black text-lg tracking-wider">Education & Experience</h2>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#00004d] ml-1 block">Education</label>
                <select name="education" value={formData.education} onChange={handleChange} className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none">
                  {educationOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="bg-[#f0f8f9] p-5 md:p-10 rounded-[30px] border-2 border-white shadow-inner">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[10px] font-black text-[#00004d] tracking-widest flex items-center gap-2 uppercase">
                      <Briefcase size={14}/> Work Experience
                    </h3>
                    <label className="flex items-center gap-3 bg-white px-6 py-2 rounded-full cursor-pointer shadow-sm active:scale-95 transition-all">
                      <input type="checkbox" checked={isFresher} onChange={(e) => setIsFresher(e.target.checked)} className="accent-[#00004d] w-4 h-4" />
                      <span className="text-[10px] font-black text-[#00004d]">Fresher</span>
                    </label>
                  </div>
                  
                  {!isFresher && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#00004d] ml-1 block">How many years of experience?</label>
                        <input 
                          type="text"
                          name="yearsOfExperience"
                          value={formData.yearsOfExperience}
                          onChange={handleChange}
                          className="w-full bg-white rounded-xl p-4 text-sm font-bold shadow-sm outline-none border border-transparent focus:border-[#00004d] transition-all" 
                          placeholder="e.g. 2 Years, 5 Months, 10 Years etc." 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#00004d] ml-1 block">Experience Details or Achievements</label>
                        <textarea 
                          value={formData.achievements} 
                          name="achievements" 
                          onChange={handleChange} 
                          className="w-full bg-white rounded-xl p-4 text-sm font-bold shadow-sm outline-none" 
                          placeholder="Tell us more about your work..." 
                          rows={4} 
                        />
                      </div>
                    </div>
                  )}
              </div>
            </section>
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-l-4 border-[#00004d] pl-3">
                <h2 className="text-[#00004d] font-black text-lg tracking-wider">Skills</h2>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#00004d] ml-1 block">Your Skills (Comma Separated)</label>
                <input 
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#00004d] transition-all" 
                  placeholder="e.g. Cooking, Driving, Cleaning, Security" 
                />
              </div>
            </section>
            <div className="flex flex-col items-center gap-8 pt-10 border-t">
              <button type="button" className="w-full md:w-auto bg-[#e2f2f5] text-[#00004d] px-12 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-sm">
                Read Privacy Policy
              </button>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.agreeTerms ? 'bg-[#00004d] border-[#00004d]' : 'bg-white border-gray-200'}`}>
                   <input type="checkbox" className="hidden" checked={formData.agreeTerms} onChange={(e)=>setFormData({...formData, agreeTerms: e.target.checked})} />
                   {formData.agreeTerms && <Check size={14} className="text-white" />}
                </div>
                <span className="text-[10px] font-black text-gray-400">I agree to the privacy policy</span>
              </label>
              <button 
                type="submit"
                disabled={loading || submitted}
                className={`
                  w-full md:w-80 font-black py-5 rounded-2xl shadow-xl tracking-[0.2em] text-xs transition-all flex justify-center items-center gap-2
                  ${submitted ? 'bg-green-600 text-white' : 'bg-[#00004d] text-white active:scale-95'}
                  ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : submitted ? <CheckCircle size={18}/> : "Submit Application"}
                {loading ? " Submitting..." : submitted ? " Submitted!" : ""}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}