"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, User, Calendar, Globe, MapPin, Briefcase,
  GraduationCap, Send, X, Building, Camera, Wand2,
  CheckCircle2, Clock, ChevronLeft
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const MALE_ICON = "https://cdn-icons-png.flaticon.com/512/4140/4140037.png";
const FEMALE_ICON = "https://cdn-icons-png.flaticon.com/512/4140/4140047.png";

function OfferSuccessModal({ isOpen, onClose, onAction }: { isOpen: boolean; onClose: () => void; onAction: () => void }) {
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
            className="relative w-full max-w-[380px] bg-white rounded-[35px] p-8 text-center shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle2 size={50} className="text-green-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#00004d] mb-3">Offer Sent Successfully!</h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              Your job offer has been delivered to the candidate. They will review your proposal and get in touch.
              <br />
              <span className="text-[12px] text-gray-400 mt-2 block">آپ کی آفر امیدوار کو بھیج دی گئی ہے۔</span>
            </p>
            <button
              onClick={onAction}
              className="w-full bg-[#00004d] text-white py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform shadow-lg"
            >
              Back to Applicants
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ApplicantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [offerData, setOfferData] = useState({
    employerName: "",
    designation: "",
    companyName: "",
    companyLogo: "",
    cityName: "",
    address: "",
    email: "",
    phone: "",
    whatsapp: "",
    interviewDate: "",
    message: ""
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://easyjobspk.onrender.com/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setApplicant(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOfferData({ ...offerData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://easyjobspk.onrender.com/api/applications/${id}/offer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(offerData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setShowSuccessModal(true);
      } else {
        toast.error("Failed to send offer");
      }
    } catch (err) {
      toast.error("Server Error!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#f4f7f9]"><Loader2 className="animate-spin text-[#00004d]" size={40}/></div>;
  if (!applicant) return <div className="p-20 text-center font-bold">Applicant not found</div>;

  return (
    <div className="min-h-screen bg-[#f4f7f9] p-4 md:p-10 pb-24 font-sans">
      <Toaster />
      <OfferSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        onAction={() => router.push("/dashboard/employer/applicants")}
      />

      <div className="max-w-5xl mx-auto space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#00004d] font-bold mb-4 active:scale-95 transition-all">
            <ChevronLeft size={20} strokeWidth={3}/> Back
        </button>

        <div className="bg-[#5DBB63] text-white p-8 md:p-12 rounded-[45px] shadow-xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-white/20 bg-white shadow-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img 
               src={applicant.gender === "female" ? FEMALE_ICON : MALE_ICON} 
               className="w-[80%] h-[80%] object-contain" 
               alt="Avatar"
               style={{ filter: "invert(7%) sepia(76%) saturate(5793%) hue-rotate(241deg) brightness(91%) contrast(108%)" }}
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase">{applicant.fullName}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
               <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold backdrop-blur-sm tracking-widest">{applicant.category}</span>
               <span className="bg-white text-[#5DBB63] px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase">{applicant.status}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-[#00004d] tracking-[0.2em] uppercase flex items-center gap-3 border-b pb-4 mb-6">
              <User size={18} /> Basic Information
            </h2>
            <div className="space-y-4">
               {[
                 { label: "Gender", val: applicant.gender, icon: User },
                 { label: "City", val: applicant.city, icon: MapPin },
                 { label: "Education", val: applicant.education, icon: GraduationCap },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                    <span className="text-sm font-bold text-[#00004d]">{item.val}</span>
                 </div>
               ))}
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-[#00004d] tracking-[0.2em] uppercase flex items-center gap-3 border-b pb-4 mb-6">
              <Clock size={18} /> Expectations
            </h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expected Salary</span>
                    <span className="text-sm font-black text-green-600">{applicant.salaryDemand || "Negotiable"}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Type</span>
                    <span className="text-sm font-bold text-[#00004d] uppercase">{applicant.jobType || "Full Time"}</span>
                </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-sm font-black text-[#00004d] tracking-[0.2em] uppercase flex items-center gap-3 border-b pb-4 mb-6">
            <Wand2 size={18} /> Professional Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {applicant.skills?.map((skill: string, i: number) => (
              <span key={i} className="bg-blue-50 text-[#00004d] px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-wider border border-blue-100">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h2 className="text-sm font-black text-[#00004d] tracking-[0.2em] uppercase flex items-center gap-3 border-b pb-4 mb-6">
            <Briefcase size={18} /> Work History
          </h2>
          <div className="space-y-4">
            {applicant.experience?.length > 0 ? applicant.experience.map((exp: any, i: number) => (
              <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{exp.companyName}</p>
                <p className="text-lg font-black text-[#00004d]">{exp.designation}</p>
                <p className="text-xs font-bold text-gray-400 mt-1">{new Date(exp.startDate).getFullYear()} - {exp.isCurrentJob ? "Present" : new Date(exp.endDate).getFullYear()}</p>
              </div>
            )) : <p className="text-center py-6 text-gray-400 font-bold uppercase tracking-widest text-xs">Fresh Candidate / No Experience</p>}
          </div>
        </div>
        <div className="flex justify-center pt-10">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={applicant.status === "Offered"}
            className={`px-12 py-5 rounded-[2rem] font-black text-sm shadow-2xl flex items-center gap-4 active:scale-95 transition-all tracking-[0.2em] uppercase ${applicant.status === "Offered" ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#5DBB63] text-white hover:bg-[#4ea855]'}`}
          >
            <Send size={18} strokeWidth={3} />
            {applicant.status === "Offered" ? "Already Offered" : "Easy Hire Candidate"}
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[45px] overflow-hidden shadow-2xl relative">
            <div className="bg-[#5DBB63] p-8 text-white flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Send Job Offer</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <input required name="companyName" placeholder="COMPANY NAME" onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#5DBB63] font-bold text-xs tracking-widest" />
              <input required name="designation" placeholder="JOB TITLE (e.g. Sales Manager)" onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#5DBB63] font-bold text-xs tracking-widest" />
              <input required name="cityName" placeholder="CITY" onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#5DBB63] font-bold text-xs tracking-widest" />
              <div className="relative">
                <FaWhatsapp className="absolute left-4 top-4 text-green-500" size={16} />
                <input required name="whatsapp" placeholder="WHATSAPP NUMBER" onChange={handleInputChange} className="w-full p-4 pl-12 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#5DBB63] font-bold text-xs tracking-widest" />
              </div>
              <textarea name="message" placeholder="WRITE A SHORT MESSAGE..." onChange={handleInputChange} className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 focus:border-[#5DBB63] font-bold text-xs tracking-widest" rows={3} />
              
              <button type="submit" disabled={isSubmitting} className="w-full py-5 rounded-[20px] font-black text-white bg-[#00004d] active:scale-95 transition-all tracking-[0.2em] shadow-xl uppercase">
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "CONFIRM & SEND OFFER"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}