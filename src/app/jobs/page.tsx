"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapPin, Globe, ChevronDown, Loader2 } from "lucide-react";
import { FaMale, FaFemale, FaUser } from "react-icons/fa";
import SuccessModal from "../../components/SuccessModal"; 

export default function JobApplicationPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    image: "",
    jobtype: "",
    maritalStatus: "",
    gender: "",
    category: "",
    city: "",
    education: "",
    experience: "",
    agreeTerms: false
  });

  const [selectedIcon, setSelectedIcon] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    if (!formData.agreeTerms) {
      alert("Please agree to Privacy Policy and Terms & Conditions.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("https://easyjobspk.onrender.com/api/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (response.status === 403) {
        alert("Access Denied: Only Job Seekers can apply.");
        return;
      }

      if (response.ok) {
        setShowModal(true); 
      } else {
        const result = await response.json();
        alert(result.message || "Error submitting form");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const cities = ["Karachi", "Lahore", "RWP/ISB", "Peshawar", "Quetta", "Multan", "Faisalabad"];
  const educationLevels = ["Matric", "Intermediate", "Bachelor's", "Master's", "M.Phil / PhD", "Other"];
  const maritalLevels = ["Married", "Single", "Divorced", "Widowed"];
  const genderLevels = ["Male", "Female", "Other"];
  const jobType = ["Full-Time", "Part-Time", "One-Day Task"];
  
  const categories = [
    { options: ["House Maid", "Full Time Maid", "Part Time Maid", "Live-in Maid", "Nanny", "Child Caretaker", "Elderly Caretaker", "Patient Care Attendant", "Home Nurse", "Cook", "Home Chef", "Assistant Cook", "Car Driver", "Truck Driver", "Bus Driver", "Personal Driver", "House Driver", "Office Driver", "Gardener", "Mali", "Security Guard", "Home Security Guard", "Gate Keeper", "Watchman", "Cleaner", "House Cleaner", "Office Cleaner", "Janitor", "Laundry Worker", "Ironing Man (Press Wala)", "Dish Washer", "Kitchen Helper", "Peon", "Office Boy", "House Boy", "Care Taker (General)", "Building Caretaker", "Helper", "General Helper", "Delivery Rider", "Courier Boy", "Receptionist", "Customer Care Taker", "Tractor Driver", "Beautition", "Barber", "Salesman", "Mid-Wife", "LHV", "Lab Technicain", "OTA", "Physiotherapist", "Nutritionist", "Coach", "Waiter", "Trainer", "Pilot", "Mobile Technician", "TV Technician", "Laptop Technician", "Motorcycle Mechanic", "Car Mechanic", "Car Painter", "Plumber", "Carpentar", "Phone Operator", "Air-Hostess", "Steward", "Translator", "Typist"] },
    { options: ["Administrator", "Office Manager", "Executive Assistant", "Operations Manager", "Farmer", "Livestock Farmer", "Agricultural Engineer", "Agronomist", "Graphic Designer", "Painter", "Illustrator", "Fashion Designer", "Animator", "Mechanical Engineer", "Auto Mechanic", "Technician", "Vehicle Inspector", "Accountant", "Banker", "Auditor", "Financial Analyst", "Business Analyst", "Business Development Manager", "Consultant", "Operations Manager", "Strategy Consultant", "Project Manager", "Customer Support Executive", "Call Center Agent", "Client Relationship Manager", "Civil Engineer", "Structural Engineer", "Site Supervisor", "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Researcher", "SEO Specialist", "Content Creator", "Social Media Manager", "Digital Marketer", "Teacher", "Lecturer", "Tutor", "Researcher", "Trainer", "E-commerce Manager", "Online Store Owner", "Marketplace Seller", "Electrical Engineer", "Electronics Technician", "Automation Engineer", "Doctor", "Nurse", "Pharmacist", "Lab Technician", "Surgeon", "HR Manager", "Recruiter", "HR Assistant", "Talent Acquisition Specialist", "Software Developer", "IT Support", "System Administrator", "Network Engineer", "Web Developer", "Frontend Developer", "Backend Developer", "Fullstack Developer", "Lawyer", "Judge", "Police Officer", "Paralegal", "Logistics Manager", "Warehouse Manager", "Supply Chain Analyst", "Driver", "Sales Executive", "Marketing Manager", "Brand Manager", "Business Development Executive", "Actor", "Musician", "Photographer", "Director", "Content Creator", "Pharmacist", "Lab Scientist", "Biotech Researcher", "Clinical Researcher", "Project Manager", "Program Manager", "Project Coordinator", "Researcher", "Lab Scientist", "R&D Engineer", "Biologist", "Chemist", "Physicist", "Lab Technician", "Security Guard", "Security Supervisor", "Investigator", "Social Worker", "NGO Coordinator", "Field Officer", "Telecom Engineer", "Network Technician", "Technical Support", "Travel Agent", "Tour Guide", "Visa Officer", "Ticketing Officer", "Veterinarian", "Animal Caretaker", "Pet Groomer", "Freelancer", "Content Writer", "Designer", "Online Consultant", "Other"] }
  ];

  const handleJumpByLetter = (letter: string) => {
    if (!categoryRef.current) return;
    const options = Array.from(categoryRef.current.options);
    const match = options.find(opt => opt.value.toLowerCase().startsWith(letter.toLowerCase()));
    if (match) {
      categoryRef.current.value = match.value;
      setFormData({ ...formData, category: match.value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
        setSelectedIcon("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconSelect = (icon: "male" | "female") => {
    setSelectedIcon(icon);
    setFormData({ ...formData, image: icon });
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-[#e2f2f5] pt-12 pb-24 px-6 rounded-b-[60px] text-center shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-[#00004d] tracking-tighter">
            Applying for a Job
          </h1>
          <p className="text-[#00004d] font-bold text-xs tracking-widest mt-4">
            Fill the single form below to apply
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 md:p-12 rounded-[40px] shadow-2xl border border-gray-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Country</label>
              <div className="bg-gray-100 p-4 rounded-full font-bold text-gray-400 border border-gray-200 flex items-center gap-3 cursor-not-allowed text-sm">
                <Globe size={18} /> Pakistan (Fixed)
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Select City</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-4 text-[#0000ff]" size={18} />
                <select
                  required
                  className="w-full bg-slate-50 p-4 pl-12 rounded-full font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#0000ff] appearance-none text-sm"
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="">Choose City</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-5 top-4 text-gray-300" size={18} />
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Jump to Category (by first letter)</label>
              <input
                type="text"
                maxLength={1}
                placeholder="Enter first letter..."
                className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] placeholder:text-[#00004d] text-sm border border-gray-100 outline-none focus:ring-2 focus:ring-[#0000ff]"
                onChange={(e) => handleJumpByLetter(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Job Category</label>
              <select
                ref={categoryRef}
                required
                className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] text-sm border border-gray-100 outline-none focus:ring-2 focus:ring-[#0000ff]"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {[...new Set(categories.flatMap(cat => cat.options))].sort((a, b) => a.localeCompare(b))
                  .map(opt => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>

            <select
              required
              className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d] md:col-span-2"
              onChange={(e) => setFormData({ ...formData, jobtype: e.target.value })}
            >
              <option value="">Job Type</option>
              {jobType.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <input type="text" required placeholder="Full Name" className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]" onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            <input type="email" required placeholder="Email" className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type="tel" required placeholder="Phone" className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <input type="text" placeholder="Age" className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]" onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
            
            <select required className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]" onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <option value="">Select Gender</option>
              {genderLevels.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <select className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]" onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}>
              <option value="">Select Marital Status</option>
              {maritalLevels.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <select className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]" onChange={(e) => setFormData({ ...formData, education: e.target.value })}>
              <option value="">Select Education</option>
              {educationLevels.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <textarea placeholder="Tell us about your experience..." className="md:col-span-2 p-6 rounded-3xl text-sm bg-slate-50 text-[#00004d]" onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
          </div>

          <div className="md:col-span-2 flex flex-col gap-4 mt-8 bg-slate-50 p-6 rounded-[30px]">
            <label className="font-bold text-gray-600 text-sm ml-2">Profile Picture</label>
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.image && formData.image.startsWith("data:") ? (
                  <img src={formData.image} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                ) : selectedIcon ? (
                  <div className={`w-24 h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center text-4xl ${selectedIcon === "male" ? "bg-blue-100 text-blue-500" : "bg-pink-100 text-pink-500"}`}>
                    {selectedIcon === "male" ? <FaMale /> : <FaFemale />}
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 shadow-md flex items-center justify-center text-gray-400 text-4xl">
                    <FaUser />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button type="button" className="bg-[#0000ff] text-white py-2 px-6 rounded-full text-xs font-black uppercase tracking-wider" onClick={() => fileInputRef.current?.click()}>
                  Upload Photo
                </button>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-[10px] font-black text-gray-400 uppercase ml-2">Or Use Default Icon</span>
              <div className="flex gap-4 mt-2">
                <button type="button" onClick={() => handleIconSelect("male")} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${selectedIcon === "male" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-400 border-gray-100"}`}>
                  <FaMale /> <span className="text-xs font-bold">Male</span>
                </button>
                <button type="button" onClick={() => handleIconSelect("female")} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${selectedIcon === "female" ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-400 border-gray-100"}`}>
                  <FaFemale /> <span className="text-xs font-bold">Female</span>
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 mt-8 flex items-start gap-3 px-2">
            <input
              type="checkbox"
              id="privacy"
              className="mt-1 w-4 h-4 accent-[#0000ff]"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            />
            <label htmlFor="privacy" className="text-xs font-bold text-gray-500 leading-relaxed">
              I have read and agree to the Privacy Policy and Terms.
            </label>
          </div>

          <div className="mt-12 text-center">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              type="submit" 
              className="w-full bg-[#00004d] text-white py-6 rounded-full font-black text-lg shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" /> Submitting...
                </>
              ) : "Submit Application"}
            </motion.button>
          </div>
        </form>
      </div>
      <SuccessModal 
        isOpen={showModal} 
        onClose={() => {
            setShowModal(false);
            router.push("/dashboard/jobseeker");
        }}
        title="Application Submitted!"
        message="Your application has been received. Your dashboard stats have been updated."
      />
    </main>
  );
}