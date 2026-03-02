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
    }, 100);
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
    <div className="bg-slate-50 min-h-screen py-12 relative">
            <AnimatePresence>
        {showLoginAlert && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1e3a8a]/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center relative border border-gray-100"
            >
              <button onClick={() => setShowLoginAlert(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500">
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-orange-500" />
              </div>
              <h3 className="text-2xl font-black text-[#1e3a8a] mb-2">Login Required</h3>
              <p className="text-gray-500 font-medium mb-8">Please login to your account to submit your application for this position.</p>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full bg-[#1e3a8a] text-white py-4 rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-lg"
                >
                  Login Now
                </button>
                <button 
                  onClick={() => setShowLoginAlert(false)}
                  className="w-full bg-slate-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-6">
        <Link href="/jobs" className="inline-flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-[#1e3a8a] transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
        </Link>
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100 mb-10">
          <div className="bg-[#1e3a8a] p-10 md:p-16 text-white relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00d26a]/10 rounded-bl-full blur-3xl"></div>
            <div className="relative z-10">
              <span className="bg-[#00d26a] text-[#1e3a8a] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block">Featured Opportunity</span>
              <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Senior UI/UX Designer</h1>
              <div className="flex flex-wrap gap-6 font-bold text-blue-100/80">
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl"><Briefcase size={18} className="text-[#00d26a]" /> TechFlow Labs</span>
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl"><MapPin size={18} className="text-[#00d26a]" /> Lahore</span>
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl"><DollarSign size={18} className="text-[#00d26a]" /> 150k - 200k</span>
              </div>
            </div>
          </div>

          <div className="p-10 md:p-16 space-y-12">
            <section>
              <h2 className="text-2xl font-black text-[#1e3a8a] mb-6 flex items-center gap-3">
                <FileText className="text-[#00d26a]" /> Job Requirements
              </h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {[
                  'Minimum 5 years UI/UX Experience', 
                  'Expert in Figma & Framer', 
                  'Strong Portfolio required', 
                  'Bachelor\'s in Computer Science/Design',
                  'Team leadership skills',
                  'Understanding of Design Systems'
                ].map((req, i) => (
                  <li key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
                    <CheckCircle className="text-[#00d26a] shrink-0" size={20} />
                    <span className="text-gray-600 font-bold text-sm group-hover:text-[#1e3a8a]">{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {!showForm && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 border-t flex items-center justify-between gap-6">
                <div className="hidden md:block">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Response Time</p>
                  <p className="text-lg font-bold text-[#1e3a8a]">Within 24 Hours</p>
                </div>
                <button 
                  onClick={handleApplyClick}
                  className="w-full md:w-auto bg-[#00d26a] hover:bg-green-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-green-200 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                >
                  Apply for this Position <ArrowRight size={22} />
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
              className="bg-white rounded-[3rem] shadow-2xl border border-[#00d26a]/20 overflow-hidden mb-20"
            >
              <div className="bg-green-50 p-8 border-b border-green-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-[#1e3a8a]">Submit Application</h2>
                  <p className="text-green-700 font-bold text-sm">Position: Senior UI/UX Designer</p>
                </div>
                <button onClick={() => setShowForm(false)} className="bg-white p-3 rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-[#1e3a8a] ml-1">Full Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-5 text-gray-400" size={20} />
                      <input required type="text" placeholder="John Doe" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-[#1e3a8a] focus:bg-white border rounded-2xl outline-none transition-all font-bold text-[#1e3a8a]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-[#1e3a8a] ml-1">Email Address</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-5 text-gray-400" size={20} />
                      <input required type="email" placeholder="john@example.com" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-[#1e3a8a] focus:bg-white border rounded-2xl outline-none transition-all font-bold text-[#1e3a8a]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-[#1e3a8a] ml-1">Portfolio or Resume Link</label>
                  <div className="relative flex items-center">
                    <LinkIcon className="absolute left-5 text-gray-400" size={20} />
                    <input required type="url" placeholder="https://behance.net/johndoe" className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent focus:border-[#1e3a8a] focus:bg-white border rounded-2xl outline-none transition-all font-bold text-[#1e3a8a]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-[#1e3a8a] ml-1">Why are you a good fit?</label>
                  <textarea rows={4} placeholder="Tell us about your passions and skills..." className="w-full px-6 py-4 bg-slate-50 border-transparent focus:border-[#1e3a8a] focus:bg-white border rounded-2xl outline-none transition-all font-bold text-[#1e3a8a] resize-none"></textarea>
                </div>

                <div className="p-6 bg-[#1e3a8a]/5 rounded-[2rem] border border-blue-100">
                  <p className="text-xs font-bold text-[#1e3a8a] leading-relaxed italic">
                    * By submitting, you confirm that you have read all the requirements listed above and your profile matches the criteria for TechFlow Labs.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#1e3a8a] hover:bg-blue-900 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 group"
                >
                  Submit Final Application <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}