"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  MapPin,
  Briefcase,
  GraduationCap,
  History,
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  Send,
  Lock,
  ChevronDown
} from "lucide-react";

export default function JobApplicationPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    applyingFor: "",
    category: "",
    city: "",
    education: "",
    experience: ""
  });

  const cities = ["Karachi", "Lahore", "RWP/ISB", "Peshawar", "Quetta", "Multan", "Faisalabaad"];
  const categories = ["IT & Software", "Accounts & Finance", "Management", "Education", "Medical", "Sales & Marketing", "Other"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    console.log("Form Data Submitted:", formData);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-20">
      <section className="bg-[#00004d] pt-12 pb-24 px-6 rounded-b-[60px] text-center shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
            Applying for <span className="text-[#00d26a]">Job</span>
          </h1>

          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-4">
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
              <div className="bg-gray-100 p-4 rounded-full font-bold text-gray-400 border border-gray-200 flex items-center gap-3 cursor-not-allowed">
                <Globe size={18} /> Pakistan (Fixed)
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Select City</label>
              <div className="relative">
                <MapPin className="absolute left-5 top-4 text-[#00d26a]" size={18} />
                <select
                  required
                  className="w-full bg-slate-50 p-4 pl-12 rounded-full font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#00d26a] appearance-none"
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                >
                  <option value="">Choose City</option>
                  {cities.map(c => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-5 top-4 text-gray-300" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name"
                className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#00d26a]"
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Applying For (Positions)</label>
              <input
                type="text"
                required
                placeholder="e.g. Sales Manager"
                className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#00d26a]"
                onChange={(e) => setFormData({ ...formData, applyingFor: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Email Address</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#00d26a]"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="03xx xxxxxxx"
                className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#00d26a]"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Job Category</label>
              <select
                required
                className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#00d26a]"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select a Category</option>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Education Degrees & Qualification</label>
              <textarea
                required
                className="w-full h-32 bg-slate-50 p-6 rounded-[30px] font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#00d26a]"
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Professional Experience</label>
              <textarea
                required
                className="w-full h-32 bg-slate-50 p-6 rounded-[30px] font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#00d26a]"
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#00004d] text-white py-6 rounded-full font-black text-lg uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:bg-[#00d26a] hover:text-[#00004d] transition-all"
            >
              {isLoggedIn ? <Send size={24} /> : <Lock size={24} />}
              {isLoggedIn ? "Submit Application" : "Login to Submit"}
            </motion.button>
          </div>
        </form>
      </div>
      <AnimatePresence>
        {showLoginPopup && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-[30px] w-[90%] max-w-sm text-center shadow-2xl"
            >
              <Lock size={36} className="mx-auto text-[#00d26a] mb-4" />

              <h2 className="text-lg font-black text-[#00004d] uppercase">
                Login Required
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Please login first to submit your application.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLoginPopup(false)}
                  className="w-full py-3 rounded-full border font-bold"
                >
                  Cancel
                </button>

                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-3 rounded-full bg-[#00004d] text-white font-bold"
                >
                  Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}