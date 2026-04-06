"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Briefcase, Calendar, DollarSign, ArrowLeft, 
  CheckCircle, FileText, Send, User, Mail, Link as LinkIcon,
  AlertCircle, X, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JobDetailPage() {
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const router = useRouter();

  const handleApplyClick = () => {
    setShowForm(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginAlert(true);
      return;
    }
    alert("Application Submitted Successfully!");
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20 relative">
            <AnimatePresence>
        {showLoginAlert && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#00004d]/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-sm w-full text-center relative border border-gray-100"
            >
              <button onClick={() => setShowLoginAlert(false)} className="absolute top-8 right-8 text-gray-300 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-orange-500" />
              </div>
              <h3 className="text-2xl font-black text-[#00004d] mb-2 uppercase tracking-tighter">Login Required</h3>
              <p className="text-gray-400 font-bold mb-8 text-sm">Please login to your account to apply for this position.</p>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#00004d] text-white py-4 rounded-full font-black hover:bg-black transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                  Login Now
                </button>
                <button 
                  onClick={() => setShowLoginAlert(false)}
                  className="w-full bg-slate-50 text-gray-400 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <section className="bg-[#e2f2f5] pt-10 pb-20 md:pb-32 px-6 rounded-b-[50px] shadow-sm">
        <div className="max-w-4xl mx-auto">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-[#00d26a] font-black mb-10 hover:underline transition-all text-[10px] md:text-xs uppercase tracking-widest group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-[#00d26a] text-[#00004d] px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-6 inline-block shadow-sm">Featured Opportunity</span>
            <h1 className="text-3xl md:text-6xl font-black text-[#00004d] mb-8 leading-[1.1] tracking-tight">Senior UI/UX Designer</h1>
            
            <div className="flex flex-wrap gap-4 md:gap-6 font-bold text-[#00004d]/60">
              <span className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-full border border-white/20 text-xs md:text-sm"><Briefcase size={16} className="text-[#00d26a]" /> TechFlow Labs</span>
              <span className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-full border border-white/20 text-xs md:text-sm"><MapPin size={16} className="text-[#00d26a]" /> Lahore</span>
              <span className="flex items-center gap-2 bg-white/40 px-4 py-2 rounded-full border border-white/20 text-xs md:text-sm"><DollarSign size={16} className="text-[#00d26a]" /> 150k - 200k</span>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-12 md:-mt-16">
        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-xl overflow-hidden border border-gray-50 mb-10">
          <div className="p-8 md:p-16 space-y-12">
                        <section>
              <h2 className="text-xl md:text-2xl font-black text-[#00004d] mb-8 flex items-center gap-3 uppercase tracking-tight border-b pb-4 border-gray-50">
                <FileText className="text-[#00d26a]" /> Job Requirements
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Minimum 5 years UI/UX Experience', 
                  'Expert in Figma & Framer', 
                  'Strong Portfolio required', 
                  'Bachelor\'s in Computer Science/Design',
                  'Team leadership skills',
                  'Understanding of Design Systems'
                ].map((req, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-[#e2f2f5] transition-all group">
                    <CheckCircle className="text-[#00d26a] shrink-0" size={18} />
                    <span className="text-gray-600 font-bold text-xs md:text-sm group-hover:text-[#00004d]">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
            {!showForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Response Time</p>
                  <p className="text-lg font-black text-[#00004d]">Within 24 Hours</p>
                </div>
                <button 
                  onClick={handleApplyClick}
                  className="w-full md:w-auto bg-[#00004d] text-white px-10 py-5 rounded-full font-black text-sm md:text-xl shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  Apply Now <ArrowRight size={22} />
                </button>
              </motion.div>
            )}
          </div>
        </div>
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[3rem] md:rounded-[4rem] shadow-2xl border border-[#00d26a]/10 overflow-hidden mb-20"
            >
              <div className="bg-[#e2f2f5] p-8 md:p-10 border-b border-[#00d26a]/10 flex justify-between items-center">
                <div>
                  <h2 className="text-xl md:text-3xl font-black text-[#00004d] uppercase tracking-tighter">Submit Application</h2>
                  <p className="text-[#00d26a] font-black text-xs md:text-sm">Position: Senior UI/UX Designer</p>
                </div>
                <button onClick={() => setShowForm(false)} className="bg-white p-3 rounded-full text-gray-300 hover:text-red-500 shadow-sm transition-all active:scale-90">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 md:p-16 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#00004d] ml-6 uppercase tracking-widest">Full Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-6 text-gray-300" size={18} />
                      <input required type="text" placeholder="John Doe" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-[#00004d] focus:bg-white border rounded-full outline-none transition-all font-bold text-[#00004d] text-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#00004d] ml-6 uppercase tracking-widest">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-6 text-gray-300" size={18} />
                      <input required type="email" placeholder="john@example.com" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-[#00004d] focus:bg-white border rounded-full outline-none transition-all font-bold text-[#00004d] text-sm" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#00004d] ml-6 uppercase tracking-widest">Portfolio Link</label>
                  <div className="relative flex items-center">
                    <LinkIcon className="absolute left-6 text-gray-300" size={18} />
                    <input required type="url" placeholder="https://behance.net/johndoe" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-[#00004d] focus:bg-white border rounded-full outline-none transition-all font-bold text-[#00004d] text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#00004d] ml-6 uppercase tracking-widest">About Yourself</label>
                  <textarea rows={4} placeholder="Why are you a good fit?" className="w-full px-8 py-6 bg-slate-50 border-transparent focus:border-[#00004d] focus:bg-white border rounded-[2rem] outline-none transition-all font-bold text-[#00004d] text-sm resize-none"></textarea>
                </div>

                <div className="p-6 bg-[#e2f2f5]/50 rounded-[2rem] border border-[#e2f2f5]">
                  <p className="text-[10px] font-bold text-[#00004d] leading-relaxed italic">
                    * By submitting, you confirm that your profile matches the criteria for TechFlow Labs.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#00004d] text-white py-5 rounded-full font-black text-sm md:text-xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-95 group"
                >
                  Submit Application <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}