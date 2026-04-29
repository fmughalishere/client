"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2, User, Calendar, Globe, MapPin, Briefcase,
  GraduationCap, Send, X, Building, Camera, Wand2,
  CheckCircle2, Clock
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { MALE_ICON, FEMALE_ICON } from "../../constants";

export default function ApplicantDetail() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navyBlueFilter = {
    filter: "invert(7%) sepia(76%) saturate(5793%) hue-rotate(241deg) brightness(91%) contrast(108%)"
  };

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
    const fetchApplicant = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://easyjobspk.onrender.com/api/applications/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://easyjobspk.onrender.com/api/applications/${id}/offer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(offerData)
      });

      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitted(false);
          router.push("/dashboard/employer/applicants"); // Redirect back
        }, 2000);
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to send offer");
      }
    } catch (err) {
      console.error("Offer Error:", err);
      alert("Connection error!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-[#f4f7f9]">
      <Loader2 className="animate-spin w-10 h-10 text-[#00004d]" />
    </div>
  );

  if (!applicant) return (
    <div className="p-10 text-center font-bold text-[#00004d]">No data found</div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] p-4 md:p-10 pb-24 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-[#5DBB63] text-white p-6 md:p-10 rounded-[40px] shadow-lg flex items-center gap-6 overflow-hidden">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 overflow-hidden bg-white shadow-xl flex-shrink-0 flex items-center justify-center">
            {applicant.image === "male" ? (
              <img src={MALE_ICON} className="w-[75%] h-[75%] object-contain" style={navyBlueFilter} alt="Male" />
            ) : applicant.image === "female" ? (
              <img src={FEMALE_ICON} className="w-[75%] h-[75%] object-contain" style={navyBlueFilter} alt="Female" />
            ) : applicant.image ? (
              <img src={applicant.image} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <User size={50} className="text-gray-300" />
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              {applicant.fullName}
            </h1>
            <p className="text-sm md:text-lg opacity-80 mt-1">
              {applicant.category}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-[#00004d] tracking-wider flex items-center gap-2 border-b pb-3">
              <User size={18} /> Basic & Contact Info
            </h2>
            <div className="grid gap-4 text-sm font-bold text-gray-600">
              <p className="flex items-center gap-2 "><User size={16} className="text-gray-400" /> Gender: {applicant.gender}</p>
              <p className="flex items-center gap-2 "><Calendar size={16} className="text-gray-400" /> DOB: {applicant.dob ? new Date(applicant.dob).toLocaleDateString() : "N/A"}</p>
              <p className="flex items-center gap-2 "><MapPin size={16} className="text-gray-400" /> City: {applicant.city}</p>
              <p className="flex items-center gap-2 "><Globe size={16} className="text-gray-400" /> Country: Pakistan</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-[#00004d] tracking-wider flex items-center gap-2 border-b pb-3">
              <GraduationCap size={18} /> Education
            </h2>
            <div className="grid gap-4 text-sm font-bold text-gray-600">
              <p className="flex items-center gap-2 "><GraduationCap size={16} className="text-gray-400" /> {applicant.education}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-[#00004d] tracking-wider flex items-center gap-2 border-b pb-3">
              <Briefcase size={18} /> Job Category + Type
            </h2>
            <div className="grid gap-4 text-sm font-bold text-gray-600">
              <p className="flex items-center gap-2 "><Briefcase size={16} className="text-gray-400" /> {applicant.category}</p>
              <p className="flex items-center gap-2 "><Clock size={16} className="text-gray-400" /> Job Type: {applicant.jobtype || applicant.jobType}</p>
            </div>
          </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#00004d] tracking-wider flex items-center gap-3 border-b pb-4 ">
            <Wand2 size={20} /> Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-3">
            {applicant.skills?.length > 0 ? (
              applicant.skills.map((skill: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-blue-50 text-[#00004d] text-xs font-bold rounded-full border border-blue-100  tracking-wider">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-400 font-bold">No skills specified.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#00004d] tracking-wider flex items-center gap-3 border-b pb-4 ">
            <Briefcase size={20} /> Work History
          </h2>
          <div className="space-y-4">
            {applicant.isFresher ? (
              <p className="text-sm text-[#00004d] font-bold p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center ">
                Fresh Candidate / Entry Level
              </p>
            ) : applicant.experience && applicant.experience.length > 0 ? (
              applicant.experience.map((exp: any, i: number) => (
                <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                   <p className="text-xs font-bold text-gray-400 tracking-widest mb-1">{exp.companyName}</p>
                  <p className="font-bold text-[#00004d] text-lg ">{exp.designation}</p>
                  <p className="text-[10px] font-bold text-gray-500 mt-1 ">
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrentJob ? "Present" : new Date(exp.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="font-bold text-[#00004d] text-lg ">{applicant.yearsOfExperience} Years Experience</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center pb-2">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={applicant.status === "Offered"}
            className={`w-50 h-10 rounded-full font-bold text-sm shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all tracking-[0.2em] ${applicant.status === "Offered" ? 'bg-gray-400' : 'bg-[#5DBB63] text-white'}`}
          >
            <Send size={16} strokeWidth={3} />
            <span>{applicant.status === "Offered" ? "Offered Sent" : "Easy Hire"}</span>
          </button>
        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bold/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[45px] overflow-hidden shadow-2xl relative">
            <div className="bg-[#5DBB63] p-8 text-white flex justify-between items-center">
              <h3 className="text-2xl font-bold">Send Job Offer</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col items-center gap-3 border-b pb-6">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed flex items-center justify-center overflow-hidden relative">
                  {offerData.companyLogo ? (
                    <img src={offerData.companyLogo} className="w-full h-full object-cover" alt="Logo" />
                  ) : (
                    <Building className="text-gray-200" size={30} />
                  )}
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-bold/40 text-white flex items-center justify-center opacity-0 hover:opacity-100">
                    <Camera size={18} />
                  </button>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleLogoChange} accept="image/*" />
              </div>
              <input required name="companyName" placeholder="Company Name" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input required name="address" placeholder="Office Address" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input required name="cityName" placeholder="City" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input required name="employerName" placeholder="Hiring Manager Name" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input required name="designation" placeholder="Job Title / Designation" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input type="email" required name="email" placeholder="Official Email" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input type="number" required name="number" placeholder="Offer Salary Range" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <div className="relative">
                <FaWhatsapp className="absolute left-3 top-4 text-green-500" size={16} />
                <input required name="whatsapp" placeholder="WhatsApp Number" onChange={handleInputChange} className="w-full p-4 pl-10 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              </div>
              <textarea name="message" placeholder="Message to candidate..." onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" rows={3} />
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 ">Interview Date & Time <span>(Optional)</span></label>
                <input type="datetime-local" name="interviewDate" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-sm" />
              </div>
              <button type="submit" disabled={isSubmitting || isSubmitted} className="w-full py-5 rounded-[20px] font-bold text-white bg-[#00004d] active:scale-95 transition-all tracking-widest">
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : isSubmitted ? "OFFER SENT!" : "SUBMIT OFFER"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}