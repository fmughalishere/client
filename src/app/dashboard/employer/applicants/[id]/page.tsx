"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import {
  Loader2, User, Calendar, Globe, MapPin, Briefcase,
  GraduationCap, Send, X, Building, Camera, Wand2,
  CheckCircle2, Scissors
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { MALE_ICON, FEMALE_ICON } from "../../../../constants";

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

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.7);
}

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
            <h3 className="text-2xl font-bold text-[#00004d] mb-3">
              Offer Sent Successfully!
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your job offer has been delivered to the candidate. They will review your proposal and get in touch with you directly.
              <br />
              <span className="text-[12px] text-gray-400 mt-2 block">آپ کی آفر امیدوار کو بھیج دی گئی ہے۔ وہ آپ سے جلد رابطہ کریں گے۔</span>
            </p>
            <button
              onClick={onAction}
              className="w-full bg-[#00004d] text-white py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform shadow-lg shadow-blue-900/20"
            >
              Back to Applicants
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ApplicantDetail() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const [offerData, setOfferData] = useState({
    employerName: "",
    designation: "",
    companyName: "",
    companyLogo: "",
    cityName: "",
    address: "",
    email: "",
    salaryRange: "",
    whatsapp: "",
    interviewDate: "",
    message: ""
  });

  const navyBlueFilter = {
    filter: "invert(7%) sepia(76%) saturate(5793%) hue-rotate(241deg) brightness(91%) contrast(108%)"
  };

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
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const saveCroppedLogo = async () => {
    try {
      if (imageToCrop && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        setOfferData({ ...offerData, companyLogo: croppedImage });
        setIsCropping(false);
        setImageToCrop(null);
      }
    } catch (e) {
      console.error(e);
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
        setIsModalOpen(false);
        setShowSuccessModal(true);
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
    <div className="min-h-screen bg-[#f7fafa] p-4 md:p-10 pb-24 font-sans">
            <AnimatePresence>
        {isCropping && (
          <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/90 p-4">
            <div className="relative w-full h-[50vh] md:w-[450px] md:h-[450px] bg-gray-900 rounded-3xl overflow-hidden">
              <Cropper
                image={imageToCrop!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="mt-6 w-full max-w-[400px] space-y-4 px-4">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex gap-3">
                <button onClick={() => setIsCropping(false)} className="flex-1 py-3.5 bg-white/10 text-white rounded-xl font-bold border border-white/20">
                  Cancel
                </button>
                <button onClick={saveCroppedLogo} className="flex-1 py-3.5 bg-white text-[#00004d] rounded-xl font-bold shadow-xl">
                  Save Logo
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <OfferSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        onAction={() => router.push("/dashboard/employer/applicants")}
      />

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
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">{applicant.fullName}</h1>
            <p className="text-sm md:text-lg opacity-80 mt-1">{applicant.category}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-[#00004d] tracking-wider flex items-center gap-2 border-b pb-3">
              <User size={18} /> Basic Info
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
            <Briefcase size={18} /> Work Experience
          </h2>
          <div className="space-y-4">
            {applicant.isFresher ? (
              <p className="text-sm text-[#00004d] font-bold p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center ">Fresh Candidate / Entry Level</p>
            ) : applicant.experience?.map((exp: any, i: number) => (
                <div key={i} className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 tracking-widest mb-1">{exp.companyName}</p>
                  <p className="font-bold text-[#00004d] text-lg ">{exp.designation}</p>
                  <p className="text-[10px] font-bold text-gray-500 mt-1 ">
                    {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrentJob ? "Present" : new Date(exp.endDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            }
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#00004d] tracking-wider flex items-center gap-3 border-b pb-4 "><Wand2 size={20} /> Skills</h2>
          <div className="flex flex-wrap gap-3">
            {applicant.skills?.map((skill: string, i: number) => (
                <span key={i} className="px-4 py-2 bg-blue-50 text-[#00004d] text-xs font-bold rounded-full border border-blue-100 tracking-wider">{skill}</span>
            ))}
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-[#00004d] tracking-wider flex items-center gap-2 border-b pb-3">💰 Salary Expectation</h2>
          <p className="text-sm font-bold text-gray-600">{applicant.salaryDemand || "Not mentioned"}</p>
        </div>
        <div className="mt-8 flex justify-center pb-2">
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={applicant.status === "Offered"}
            className={`w-50 h-10 px-8 rounded-[9px] font-bold text-sm shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all tracking-[0.2em] ${applicant.status === "Offered" ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5DBB63] text-white hover:bg-[#4ea854]'}`}
          >
            <Send size={16} strokeWidth={3} />
            <span>{applicant.status === "Offered" ? "Offer Sent" : "Easy Hire"}</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[45px] overflow-hidden shadow-2xl relative">
            <div className="bg-[#00004d] p-8 text-white flex justify-between items-center">
              <h3 className="text-2xl font-bold">Send Job Offer</h3>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-2 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col items-center gap-3 border-b pb-6">
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="w-20 h-20 rounded-2xl bg-gray-50 border-2 border-dashed flex items-center justify-center overflow-hidden relative cursor-pointer group"
                >
                  {offerData.companyLogo ? (
                    <>
                      <img src={offerData.companyLogo} className="w-full h-full object-cover" alt="Logo" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Scissors className="text-white" size={20} />
                      </div>
                    </>
                  ) : (
                    <Building className="text-gray-200" size={30} />
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-[#00004d] text-white p-1 rounded-md">
                    <Camera size={14} />
                  </div>
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Company Logo</span>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleLogoChange} accept="image/*" />
              </div>

              <input required name="companyName" placeholder="Company Name" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input required name="address" placeholder="Office Address" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input required name="cityName" placeholder="City" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input required name="employerName" placeholder="Hiring Manager Name" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input required name="designation" placeholder="Job Title / Designation" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input type="email" required name="email" placeholder="Official Email" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              <input name="salaryRange" placeholder="Offered Salary Range (e.g. 50k - 70k)" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              
              <div className="relative">
                <FaWhatsapp className="absolute left-3 top-4 text-green-500" size={16} />
                <input required name="whatsapp" placeholder="WhatsApp Number" onChange={handleInputChange} className="w-full p-4 pl-10 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" />
              </div>
              
              <textarea name="message" placeholder="Message to candidate..." onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-xs" rows={3} />
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 ">Interview Date & Time <span>(Optional)</span></label>
                <input type="datetime-local" name="interviewDate" onChange={handleInputChange} className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#00004d] font-bold text-sm" />
              </div>
              
              <button type="submit" disabled={isSubmitting} className="w-45 h-10 py-5 rounded-[9px] font-bold text-white bg-[#5DBB63] active:scale-95 transition-all flex justify-center items-center gap-2 shadow-xl">
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit Offer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}