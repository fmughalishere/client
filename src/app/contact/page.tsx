"use client";

import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formState, setFormState] = useState("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    setTimeout(() => setFormState("success"), 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+92 300 1234567",
      sub: "Mon - Fri, 9am - 6pm",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@easyjobs.pk",
      sub: "24/7 Online Support",
      color: "text-[#00d26a]",
      bg: "bg-green-50"
    },
    {
      icon: MapPin,
      title: "Our Office",
      details: "Business Center, PECHS",
      sub: "Karachi, Pakistan",
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-block text-[#00d26a] font-black uppercase text-sm hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#1e3a8a] mb-6 tracking-tight"
          >
            Get In <span className="text-[#00d26a]">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 font-bold text-lg max-w-2xl mx-auto"
          >
            Have questions about a job or need help with hiring? Our team is here to support you every step of the way.
          </motion.p>
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            {contactInfo.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-gray-100 flex items-start gap-6 group hover:border-[#1e3a8a] transition-all"
              >
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1e3a8a] mb-1">{item.title}</h3>
                  <p className="text-gray-700 font-bold mb-1">{item.details}</p>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{item.sub}</p>
                </div>
              </motion.div>
            ))}
            <div className="bg-[#1e3a8a] p-10 rounded-[2.5rem] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d26a]/10 rounded-bl-full blur-2xl"></div>

              <h3 className="text-xl font-black mb-6 relative z-10">
                Follow Our Journey
              </h3>

              <div className="flex gap-4 relative z-10">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 bg-white/10 hover:bg-[#00d26a] rounded-xl flex items-center justify-center transition-all">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-gray-100 relative"
            >

              {formState === "success" ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={60} className="text-[#00d26a]" />
                  </div>

                  <h2 className="text-3xl font-black text-[#1e3a8a] mb-4">
                    Message Sent!
                  </h2>

                  <p className="text-gray-500 font-bold mb-10">
                    Thanks! We've received your message and will get back to you within 24 hours.
                  </p>

                  <button 
                    onClick={() => setFormState("idle")} 
                    className="bg-[#1e3a8a] text-white px-10 py-4 rounded-2xl font-black"
                  >
                    Send Another Message
                  </button>
                </motion.div>

              ) : (

                <>
                  <div className="mb-10">
                    <h2 className="text-3xl font-black text-[#1e3a8a] mb-2 flex items-center gap-3">
                      <MessageSquare className="text-[#00d26a]" /> Send Message
                    </h2>
                    <p className="text-gray-400 font-bold">
                      Fill out the form below and our team will reach out.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="grid md:grid-cols-2 gap-8">
                      <input
                        required
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold"
                      />

                      <input
                        required
                        type="email"
                        placeholder="email@example.com"
                        className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold"
                      />
                    </div>

                    <select className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold">
                      <option>General Inquiry</option>
                      <option>Job Seeker Support</option>
                      <option>Employer Business</option>
                      <option>Report an Issue</option>
                    </select>

                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold resize-none"
                    ></textarea>

                    <button
                      type="submit"
                      className="w-full bg-[#1e3a8a] text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3"
                    >
                      Submit Message
                      <Send size={22} />
                    </button>

                  </form>
                </>
              )}

            </motion.div>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 h-96 w-full bg-slate-200 rounded-[4rem] relative overflow-hidden flex items-center justify-center border-8 border-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-[#1e3a8a]/5 flex flex-col items-center justify-center">
            <MapPin size={48} className="text-[#1e3a8a] mb-4 animate-bounce" />
            <p className="text-[#1e3a8a] font-black text-xl">
              Find us on Google Maps
            </p>
          </div>
        </motion.div>

      </div>
    </main>
  );
}