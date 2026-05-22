"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Cropper from "react-easy-crop";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

import {
  Building2, Mail, Lock, User, Phone, Globe, MapPin, FileText, ShieldCheck,
  Eye, EyeOff, ArrowLeft, Check, Briefcase, Users, LayoutDashboard,
  Camera, Trash2, X, Search, Map as MapIcon, MailOpen, ArrowRight
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CITIES, EMPLOYEES } from "../constants";

const mapContainerStyle = {
  width: "100%",
  height: "100%"
};

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
    image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );
  return canvas.toDataURL("image/jpeg", 0.7);
}

export default function CompanyRegister() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

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
  const [showMapModal, setShowMapModal] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    lat: 31.5204,
    lng: 74.3587,
    city: "",
    industry: "",
    companySize: "",
    description: "",
    contactPerson: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        toast.success("Logo ready!");
      }
    } catch (e) {
      toast.error("Crop failed");
    }
  };

  const onMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          setFormData((prev) => ({ ...prev, lat, lng, location: results[0].formatted_address }));
        } else {
          setFormData((prev) => ({ ...prev, lat, lng, location: `${lat}, ${lng}` }));
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords match nahi kar rahay!");
    }
    if (formData.password.length < 6) {
      return toast.error("Password kam se kam 6 characters ka hona chahiye");
    }
    if (!formData.city) {
      return toast.error("Meharbani karke city select karein");
    }

    setLoading(true);
    try {
      const response = await fetch("https://easyjobspk.onrender.com/api/auth/company-register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          ...formData, 
          logo: logoPreview
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsEmailSent(true);
        toast.success(data.message || "Verification link sent to your email!");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("Submit Error:", err);
      toast.error("Network error! Server connect nahi ho raha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafa] flex flex-col items-center justify-start md:justify-center px-4 py-6 md:p-12 relative overflow-x-hidden">
      <Toaster position="top-center" />
      <AnimatePresence>
        {isCropping && (
          <div className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center p-0 md:p-4">
            <div className="relative w-full h-full md:w-[500px] md:h-[500px] md:rounded-3xl overflow-hidden shadow-2xl">
              <Cropper image={imageToCrop!} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onCropComplete={onCropComplete} onZoomChange={setZoom} />
            </div>
            <div className="absolute bottom-10 w-full max-md px-6 space-y-4">
              <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-2 bg-white/20 rounded-lg appearance-none accent-white" />
              <div className="flex gap-3">
                <button onClick={() => setIsCropping(false)} className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold backdrop-blur-md">CANCEL</button>
                <button onClick={saveCroppedImage} className="flex-1 py-4 bg-white text-black rounded-2xl font-bold shadow-xl">APPLY LOGO</button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showMapModal && isLoaded && (
          <div className="fixed inset-0 z-[150] bg-white md:bg-black/60 md:backdrop-blur-sm flex items-center justify-center p-0 md:p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="bg-white w-full h-full md:h-auto md:max-w-2xl md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-5 border-b flex justify-between items-center bg-gray-50 shrink-0">
                <span className="font-black text-[#00004d] text-xs tracking-widest flex items-center gap-2"><MapIcon size={18} /> Pin Office Location</span>
                <button onClick={() => setShowMapModal(false)} className="p-2 bg-gray-200 rounded-full text-gray-600"><X size={20} /></button>
              </div>
              <div className="flex-1 min-h-[350px] md:h-[400px]">
                <GoogleMap mapContainerStyle={mapContainerStyle} center={{ lat: formData.lat, lng: formData.lng }} zoom={15} onClick={onMapClick}>
                  <Marker position={{ lat: formData.lat, lng: formData.lng }} />
                </GoogleMap>
              </div>
              <div className="p-6 bg-gray-50 border-t shrink-0 text-center">
                <p className="text-[10px] font-bold text-gray-400 mb-4">Click anywhere on the map to set your office pin</p>
                <button onClick={() => setShowMapModal(false)} className="w-full py-4 bg-[#00004d] text-white rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl">CONFIRM LOCATION</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl p-5 md:p-12 border border-white">
        <AnimatePresence mode="wait">
          {!isEmailSent ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}>
              <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-gray-400 font-bold text-[10px] tracking-widest hover:text-[#00004d] transition-colors">
                  <ArrowLeft size={14} className="mr-1" /> BACK TO HOME
                </Link>
              </div>
              <div className="text-center mb-10">
                <h1 className="text-2xl md:text-4xl font-black text-[#00004d] tracking-tighter">Company Registration</h1>
                <p className="text-gray-400 font-bold text-[10px] md:text-xs tracking-[0.2em] mt-1">Join the hiring revolution in Pakistan</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col items-center">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#00004d]">
                      {logoPreview ? (<img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />)
                        : (<div className="text-center"> <Camera className="mx-auto text-gray-300 mb-1" size={28} />
                          <span className="text-[10px] font-black text-gray-400 tracking-widest">Logo</span>
                        </div>)} </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                    <button type="button" className={`absolute -bottom-2 -right-2 p-3 rounded-2xl shadow-xl ${logoPreview ? 'bg-red-500 text-white' : 'bg-[#00004d] text-white'}`}>
                      {logoPreview ? <Trash2 size={16} /> : <Camera size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-300 tracking-[0.3em] px-2">Company Essentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative"> <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input required type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm" />
                    </div>
                    <div className="relative"> <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input required type="text" name="industry" placeholder="Industry (IT, Retail, etc.)" value={formData.industry} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm" />
                    </div>
                    <div className="relative"> <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 z-10" size={18} />
                      <select name="companySize" required value={formData.companySize} onChange={handleChange} className="w-full pl-12 pr-8 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm appearance-none cursor-pointer">
                        <option value="">Company Size</option> {EMPLOYEES.map(size => <option key={size} value={size}>{size}</option>)}
                      </select>
                    </div>
                    <div className="relative"> <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input type="text" name="website" placeholder="Website (Optional)" value={formData.website} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-300 tracking-[0.3em] px-2">Location & Map</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative"> <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 z-10" size={18} />
                      <select name="city" required value={formData.city} onChange={handleChange} className="w-full pl-12 pr-8 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm appearance-none cursor-pointer">
                        <option value="">Select City</option> {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                    <button type="button" onClick={() => setShowMapModal(true)} className="flex items-center justify-between px-6 py-4 bg-blue-50/50 text-[#00004d] rounded-2xl border-2 border-dashed border-blue-100 hover:border-[#00004d] transition-all">
                      <div className="flex items-center gap-2 font-bold text-sm"><MapPin size={18} /> Pin on Map</div>
                      <span className="text-[9px] truncate max-w-[100px]">{formData.location || "No Pin"}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-300 tracking-[0.3em] px-2">HR Contact Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative"> <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input required type="text" name="contactPerson" placeholder="HR Name" value={formData.contactPerson} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm" />
                    </div>
                    <div className="relative"> <LayoutDashboard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input required type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm" />
                    </div>
                    <div className="relative"> <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input required type="email" name="email" placeholder="Business Email" value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm" />
                    </div>
                    <div className="relative"> <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input required type="text" name="phone" placeholder="Contact Number" value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm" />
                    </div>
                  </div>
                </div>

                <div className="relative"> <FileText className="absolute left-5 top-5 text-gray-300" size={18} />
                  <textarea required name="description" placeholder="Company description..." rows={3} value={formData.description} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative"> <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input required type={showPass ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"> {showPass ? <EyeOff size={18} /> : <Eye size={18} />} </button>
                  </div>
                  <div className="relative"> <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input required type={showConfirmPass ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#00004d] font-bold text-[#00004d] text-sm" />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"> {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />} </button>
                  </div>
                </div>

                <div className={`flex items-start gap-4 p-5 rounded-3xl border-2 cursor-pointer transition-all ${agreed ? 'bg-[#00004d]/5 border-[#00004d]' : 'bg-gray-50 border-transparent'}`} onClick={() => setAgreed(!agreed)}>
                  <div className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${agreed ? 'bg-[#00004d] shadow-lg shadow-blue-200' : 'border-2 border-gray-200 bg-white'}`}> {agreed && <Check size={14} className="text-white" strokeWidth={4} />} </div>
                  <p className="text-[11px] font-bold text-gray-500 leading-relaxed"> I agree to the <span className="text-[#00004d] underline">Terms of Service</span> and authorize account verification via the business email. </p>
                </div>

                <button type="submit" disabled={!agreed || loading} className={`w-full py-6 rounded-3xl font-black text-s tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-2xl active:scale-95 ${agreed && !loading ? 'bg-[#5DBB63] text-white hover:bg-green-600 shadow-green-100' : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'}`}>
                  {loading ? "Registering..." : "Register Company"} {!loading && <Mail size={20} />}
                </button>
              </form>

              <div className="mt-10 text-center">
                <p className="text-gray-400 font-bold text-[10px] tracking-widest "> Already a partner? <Link href="/login" className="text-[#00004d] font-black hover:underline ml-2">Login Here</Link> </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <MailOpen size={48} />
              </div>
              <h2 className="text-3xl font-black text-[#00004d] mb-4 tracking-tight text-center">Verify Business Account</h2>
              <p className="text-gray-500 font-medium mb-8 leading-relaxed max-w-sm mx-auto text-center">
                Registration for <span className="font-black text-[#00004d]">{formData.companyName}</span> was successful! <br /><br />
                We have sent a verification link to <br />
                <span className="text-[#00004d] font-black">{formData.email}</span>. <br />
                Please verify your email to start posting jobs.
              </p>
              <div className="space-y-4">
                <button onClick={() => router.push("/login")} className="w-full py-4 bg-[#00004d] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform">
                  Go to Login <ArrowRight size={18} />
                </button>
                <button onClick={() => setIsEmailSent(false)} className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-[#00004d] transition-colors">
                  Wrong email? Go back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}