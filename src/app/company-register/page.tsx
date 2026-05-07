"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Cropper from "react-easy-crop";
import {
  Building2, Mail, Lock, User, Phone,
  Globe, MapPin, FileText, ShieldCheck, Eye, EyeOff,
  ArrowLeft, Check, Briefcase, Users, LayoutDashboard, Camera, Trash2, X, Scissors
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

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

export default function CompanyRegister() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    industry: "",
    companySize: "",
    description: "",
    contactPerson: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const saveCroppedImage = async () => {
    try {
      if (imageToCrop && croppedAreaPixels) {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        setLogoPreview(croppedImage);
        setIsCropping(false);
        setImageToCrop(null);
        toast.success("Logo cropped successfully!");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to crop image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match!");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    
    try {
      const response = await fetch("https://easyjobspk.onrender.com/api/auth/company-register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          logo: logoPreview,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Company registered successfully!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("API Error:", err);
      toast.error("Network error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-8 md:p-12 relative overflow-hidden">
      <Toaster position="top-center" />
      <AnimatePresence>
        {isCropping && (
          <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <div className="relative w-full h-[60vh] md:w-[500px] md:h-[500px] bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl">
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

            <div className="mt-8 w-full max-w-[400px] space-y-6 px-4 text-center">
              <p className="text-white/60 text-xs font-bold tracking-widest uppercase">Zoom to adjust logo</p>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex gap-4">
                <button onClick={() => setIsCropping(false)} className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/20">
                  <X size={18} /> CANCEL
                </button>
                <button onClick={saveCroppedImage} className="flex-1 py-4 bg-white text-[#00004d] rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl">
                  <Check size={18} /> APPLY LOGO
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#e2f2f5] rounded-full blur-[80px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#f0fdf4] rounded-full blur-[80px] opacity-60"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,77,0.05)] p-6 md:p-12 border border-white"
      >
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 font-bold text-[10px] tracking-widest hover:text-[#00004d] transition-colors">
            <ArrowLeft size={14} className="mr-1" /> BACK TO HOME
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-[#00004d] mb-2 tracking-tighter">
            Company Registration
          </h1>
          <p className="text-gray-400 font-bold text-[12px] md:text-sm tracking-wide">Enter details to start hiring talent</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#00004d]">
                {logoPreview ? (
                  <div className="relative w-full h-full">
                    <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Scissors size={20} className="text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Camera className="mx-auto text-gray-300 mb-1" size={24} />
                    <span className="text-[9px] font-black text-gray-400 uppercase">Logo</span>
                  </div>
                )}
              </div>
              <input 
                type="file" ref={fileInputRef} className="hidden" 
                accept="image/*" onChange={handleImageChange} 
              />
              <button 
                type="button" 
                onClick={(e) => {
                    e.stopPropagation();
                    logoPreview ? setLogoPreview(null) : fileInputRef.current?.click();
                }}
                className={`absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg transition-all ${logoPreview ? 'bg-red-500 text-white' : 'bg-[#00004d] text-white'}`}
              >
                {logoPreview ? <Trash2 size={16} /> : <Camera size={16} />}
              </button>
            </div>
            <span className="mt-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Click icon to upload/edit</span>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase px-2">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  required type="text" placeholder="Company Name" 
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
                />
              </div>
              <div className="relative">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  required type="text" placeholder="Industry (e.g. IT, Sales)" 
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
                />
              </div>
              <div className="relative">
                <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  required type="text" placeholder="Company Size" 
                  value={formData.companySize}
                  onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
                />
              </div>
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" placeholder="Website (Optional)" 
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
                />
              </div>
            </div>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required type="text" placeholder="Full Office Location" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-300 tracking-[0.2em] uppercase px-2">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  required type="text" placeholder="Contact Person Name" 
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
                />
              </div>
              <div className="relative">
                <LayoutDashboard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  required type="text" placeholder="Designation" 
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  required type="email" placeholder="Business Email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  required type="text" placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
                />
              </div>
            </div>
          </div>

          <div className="relative">
            <FileText className="absolute left-5 top-5 text-gray-300" size={18} />
            <textarea 
              required placeholder="Briefly describe your company..." 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all resize-none text-sm" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required type={showPass ? "text" : "password"} 
                placeholder="Password" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                required type={showConfirmPass ? "text" : "password"} 
                placeholder="Confirm Password" 
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] focus:bg-white font-bold text-[#00004d] transition-all text-sm" 
              />
              <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div 
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${agreed ? 'bg-[#00004d]/5 border-[#00004d]' : 'bg-gray-50 border-transparent'}`} 
            onClick={() => setAgreed(!agreed)}
          >
            <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all ${agreed ? 'bg-[#00004d]' : 'border-2 border-gray-200 bg-white'}`}>
              {agreed && <Check size={12} className="text-white" strokeWidth={4} />}
            </div>
            <p className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-tight">
              Accept <span className="text-[#00004d] underline">Terms</span> & <span className="text-[#00004d] underline">Privacy Policy</span>
            </p>
          </div>

          <button 
            type="submit"
            disabled={!agreed || loading}
            className={`w-full py-5 rounded-2xl font-black text-[12px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl
              ${agreed && !loading ? 'bg-[#00004d] text-white shadow-blue-100' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                REGISTERING...
              </div>
            ) : (
              <>REGISTER COMPANY <Building2 size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">
            Already registered? 
            <Link href="/login" className="text-[#00004d] font-black hover:underline ml-2">Login Here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}