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
  CheckCircle2,
  ArrowLeft
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
      color: "text-[#00004d]",
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
      color: "text-[#00004d]",
      bg: "bg-[#e2f2f5]"
    }
  ];

  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-10">
            <section className="bg-[#e2f2f5] py-16 md:py-24 px-6 rounded-b-[50px] shadow-sm text-center">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-start md:justify-center">
            <Link 
              href="/" 
              className="inline-flex items-center text-[#00d26a] font-black  text-[10px] md:text-xs tracking-widest hover:underline"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Link>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#00004d] mb-6 leading-tight tracking-tight"
          >
            Get In <span className="text-[#00d26a]">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#00004d]/70 font-bold text-sm md:text-lg max-w-2xl mx-auto px-4"
          >
            Have questions about a job or need help with hiring? Our team is here to support you every step of the way.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 mt-12 md:mt-20">
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                    <div className="space-y-6">
            {contactInfo.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-[#00004d] mb-1">{item.title}</h3>
                  <p className="text-[#00004d] text-sm md:text-base font-bold mb-0.5">{item.details}</p>
                  <p className="text-gray-400 text-[9px] md:text-[10px] font-black  tracking-widest">{item.sub}</p>
                </div>
              </motion.div>
            ))}
            <div className="bg-[#00004d] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d26a]/10 rounded-bl-full blur-2xl"></div>
              <h3 className="text-xl font-black mb-6 relative z-10  tracking-widest">
                Follow Us
              </h3>
              <div className="flex gap-4 relative z-10">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-[#00d26a] hover:text-[#00004d] rounded-2xl flex items-center justify-center transition-all active:scale-90">
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
              className="bg-white p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] shadow-sm border border-gray-50 relative"
            >
              {formState === "success" ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-10 md:py-20"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} className="text-[#00d26a]" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black text-[#00004d] mb-4  tracking-tight">Message Sent!</h2>
                  <p className="text-gray-500 font-bold mb-10 text-sm md:text-base">We'll get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setFormState("idle")} 
                    className="bg-[#00004d] text-white px-10 py-4 rounded-full font-black text-xs md:text-sm  tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-900/20"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-10">
                    <h2 className="text-2xl md:text-3xl font-black text-[#00004d] mb-2 flex items-center gap-3">
                      <MessageSquare className="text-[#00d26a]" /> Send Message
                    </h2>
                    <p className="text-gray-400 font-bold text-xs md:text-sm">Fill out the form below and our team will reach out.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                      <input
                        required
                        type="text"
                        placeholder="Your Name"
                        className="w-full px-8 py-4 bg-slate-50 rounded-full outline-none font-bold text-sm md:text-base focus:ring-2 focus:ring-[#00004d] transition-all"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-8 py-4 bg-slate-50 rounded-full outline-none font-bold text-sm md:text-base focus:ring-2 focus:ring-[#00004d] transition-all"
                      />
                    </div>

                    <select className="w-full px-8 py-4 bg-slate-50 rounded-full font-bold text-sm md:text-base outline-none focus:ring-2 focus:ring-[#00004d] appearance-none cursor-pointer">
                      <option>General Inquiry</option>
                      <option>Job Seeker Support</option>
                      <option>Employer Business</option>
                      <option>Report an Issue</option>
                    </select>

                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help you?"
                      className="w-full px-8 py-6 bg-slate-50 rounded-[2rem] font-bold text-sm md:text-base resize-none outline-none focus:ring-2 focus:ring-[#00004d] transition-all"
                    ></textarea>

                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      className="w-full bg-[#00004d] text-white py-5 rounded-full font-black text-sm md:text-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                    >
                      {formState === "sending" ? "Sending..." : "Submit Message"}
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
          viewport={{ once: true }}
          className="mt-20 md:mt-32 h-64 md:h-96 w-full bg-[#e2f2f5] rounded-[3rem] md:rounded-[6rem] relative overflow-hidden flex items-center justify-center border-8 border-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-[#00004d]/5 flex flex-col items-center justify-center px-6 text-center">
            <MapPin size={48} className="text-[#00004d] mb-4 animate-bounce" />
            <p className="text-[#00004d] font-black text-sm md:text-xl  tracking-widest">
              Find our headquarters on Google Maps
            </p>
          </div>
        </motion.div>

      </div>
    </main>
  );
}