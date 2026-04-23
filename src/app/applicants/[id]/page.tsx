"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Loader2, User, Calendar, Globe, MapPin, Briefcase,
  GraduationCap, Send, CheckCircle, X, Building, Camera
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function ApplicantDetail() {
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [offerData, setOfferData] = useState({
    employerName: "",
    designation: "",
    companyName: "",
    companyLogo: "",
    cityName: "",
    email: "",
    phone: "",
    whatsapp: "",
    interviewDate: "",
    message: ""
  });

  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const res = await fetch(`https://easyjobspk.onrender.com/api/applications/${id}`);
        const data = await res.json();
        if (data && !data.message) {
          setApplicant(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplicant();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOfferData({ ...offerData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOfferData({ ...offerData, companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitted(false);
        setApplicant((prev: any) => ({ ...prev, status: "Offered" }));
      }, 2000);
    }, 2000);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#e2f2f5]">
      <Loader2 className="animate-spin w-10 h-10 text-[#00004d]" />
    </div>
  );

  if (!applicant) return (
    <div className="p-10 text-center font-bold text-[#00004d]">
      No data found
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e2f2f5] p-4 md:p-10 pb-24 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-[#00004d] text-white p-6 md:p-10 rounded-[40px] shadow-lg flex items-center gap-6 overflow-hidden">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 overflow-hidden bg-gray-200 shadow-xl flex-shrink-0">
            <img
              src={applicant.image || "https://via.placeholder.com/150"}
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-black tracking-[0.1em] leading-tight truncate">
              {applicant.fullName}
            </h1>
            <p className="text-sm md:text-lg font-bold opacity-80 mt-1 tracking-[0.1em] truncate">
              {applicant.category}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
            <h2 className="text-lg font-black text-[#00004d] tracking-wider flex items-center gap-2 border-b pb-3">
              <MapPin size={18} /> Basic Info
            </h2>
            <div className="grid gap-4 text-sm font-bold text-gray-600">
              <p className="flex items-center gap-2">
                <User size={16} className="text-gray-400" />
                Gender: {applicant.gender}
              </p>
              <p className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                DOB: {applicant.dob ? new Date(applicant.dob).toLocaleDateString() : "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                City: {applicant.city}
              </p>
              <p className="flex items-center gap-2">
                <Globe size={16} className="text-gray-400" />
                Country: {applicant.country}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
            <h2 className="text-lg font-black text-[#00004d] tracking-wider flex items-center gap-2 border-b pb-3">
              <GraduationCap size={18} /> Education & Job
            </h2>
            <div className="grid gap-4 text-sm font-bold text-gray-600">
              <p className="flex items-center gap-2">
                <GraduationCap size={16} className="text-gray-400" />
                {applicant.education}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase size={16} className="text-gray-400" />
                Job Type: {applicant.jobtype}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-lg font-black text-[#00004d] tracking-wider flex items-center gap-3 border-b pb-4">
            <Briefcase size={20} /> Work Experiences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {applicant.experience?.length > 0 ? (
              applicant.experience.slice(0, 3).map((exp: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest mb-2 block">
                    Experience {idx + 1}
                  </span>
                  <p className="font-black text-[#00004d]">{exp.designation}</p>
                  <p className="text-sm font-bold text-gray-500">{exp.companyName}</p>
                  <p className="text-[10px] font-bold text-gray-300 mt-2">
                    {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 font-bold p-4 col-span-3 text-center">
                No experience added.
              </p>
            )}
          </div>
        </div>
        <div className="mt-12 flex justify-center pb-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="min-w-[280px] h-20 rounded-full bg-[#00004d] text-white font-black text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all tracking-[0.2em]"
          >
            <Send size={24} strokeWidth={3} />
            <span>Easy Hire</span>
          </button>
        </div>

      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[45px] overflow-hidden shadow-2xl relative">

            <div className="bg-[#00004d] p-8 text-white flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-[0.1em]">Submit Offer</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col items-center gap-3 border-b pb-6">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed flex items-center justify-center overflow-hidden relative">
                  {offerData.companyLogo ? (
                    <img src={offerData.companyLogo} className="w-full h-full object-cover" />
                  ) : (
                    <Building className="text-gray-200" size={30} />
                  )}
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 hover:opacity-100">
                    <Camera size={18} />
                  </button>
                </div>

                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black text-[#00004d] underline">
                  Upload Company Logo
                </button>

                <input type="file" ref={fileInputRef} className="hidden" onChange={handleLogoChange} accept="image/*" />
              </div>
              <input required name="companyName" placeholder="Company Name" onChange={handleInputChange} className="input" />
              <input required name="cityName" placeholder="City Name" onChange={handleInputChange} className="input" />
              <input required name="employerName" placeholder="Contact Person" onChange={handleInputChange} className="input" />
              <input required name="designation" placeholder="Designation" onChange={handleInputChange} className="input" />
              <input type="email" required name="email" placeholder="Email" onChange={handleInputChange} className="input" />

              <div className="relative">
                <FaWhatsapp className="absolute left-3 top-3.5 text-green-500" size={16} />
                <input required name="whatsapp" placeholder="+92..." onChange={handleInputChange} className="input pl-10" />
              </div>

              <input type="datetime-local" name="interviewDate" onChange={handleInputChange} className="input" />
              <button type="submit" disabled={isSubmitting || isSubmitted} className="w-full py-5 rounded-[20px] font-black text-white bg-[#00004d]">
                {isSubmitting ? "Submitting..." : isSubmitted ? "Submitted!" : "Submit Offer"}
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}