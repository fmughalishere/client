"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Target, 
  Users, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Globe,
  Briefcase,
  ArrowLeft
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfc] pb-10 overflow-hidden">
            <section className="relative bg-[#e2f2f5] py-16 md:py-28 lg:py-32 text-[#00004d] px-6 rounded-b-[50px] shadow-sm">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#00d26a]/5 skew-x-12 transform origin-right hidden md:block"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-6 md:mb-10">
            <Link 
              href="/" 
              className="inline-flex items-center text-[#00d26a] font-black uppercase text-[10px] md:text-xs tracking-widest hover:underline"
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Home
            </Link>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] tracking-tight"
          >
            Empowering <span className="text-[#00d26a]">Pakistan's</span> <br className="hidden md:block" /> 
            Talent Landscape
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#00004d]/70 text-base md:text-xl max-w-2xl font-bold leading-relaxed"
          >
            EasyJobs.pk is the bridge between passion and career, dedicated to helping every Pakistani professional find their dream role with ease.
          </motion.p>
        </div>
      </section>
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 bg-[#00004d]/5 px-4 py-2 rounded-full text-[#00004d] text-[10px] md:text-xs font-black mb-6 border border-[#00004d]/10 uppercase tracking-widest">
              <Target size={16} className="text-[#00d26a]" />
              <span>Our Vision</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#00004d] mb-6 leading-tight">
              To be the #1 destination for <span className="text-[#00d26a]">career growth</span> in Pakistan.
            </h2>
            <p className="text-gray-500 font-bold text-sm md:text-lg mb-8 leading-relaxed">
              We started with a simple goal: to make job hunting easy and hiring efficient. Today, EasyJobs.pk serves thousands of users across the country.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['Verified Employers', 'Direct Access', 'Zero Fees', 'Easy Interface'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-black text-[#00004d] text-sm md:text-base">
                  <CheckCircle2 className="text-[#00d26a]" size={20} /> {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 md:gap-6 bg-[#e2f2f5]/30 p-6 md:p-10 rounded-[3rem] border border-[#e2f2f5]"
          >
            {[
              { label: "Users", val: "50k+", icon: Users, color: "text-[#00004d]" },
              { label: "Jobs", val: "15k+", icon: Briefcase, color: "text-[#00d26a]" },
              { label: "Cities", val: "40+", icon: Globe, color: "text-[#00004d]" },
              { label: "Success", val: "98%", icon: Trophy, color: "text-[#00d26a]" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm flex flex-col items-center text-center hover:shadow-md transition-all">
                <stat.icon className={`${stat.color} mb-3`} size={24} />
                <div className="text-2xl md:text-3xl font-black text-[#00004d]">{stat.val}</div>
                <div className="text-[9px] md:text-xs font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-[#00004d] py-16 md:py-24 px-6 text-white relative rounded-[50px] mx-4 md:mx-10 shadow-2xl">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">Our Core Values</h2>
            <p className="text-gray-400 font-bold text-sm md:text-base tracking-widest uppercase opacity-60">Built with integrity, driven by innovation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[ 
              { title: "Transparency", desc: "No hidden fees, no fake ads. We believe in clear communication.", icon: Zap },
              { title: "Local First", desc: "Designed specifically for Pakistan, understanding local needs.", icon: TrendingUp },
              { title: "Empowerment", desc: "Providing tools for professionals to own their career path.", icon: Users }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-sm group transition-all"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#00d26a] rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <value.icon className="text-[#00004d]" size={28} />
                </div>
                <h4 className="text-xl md:text-2xl font-black mb-3 uppercase tracking-tight">{value.title}</h4>
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-bold">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-3xl md:text-5xl font-black text-[#00004d] mb-6">Join the Revolution</h2>
          <p className="text-gray-500 font-black mb-10 text-sm md:text-lg px-4">
            Whether you are a fresh graduate or an expert, EasyJobs.pk is here for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4">
            <Link href="/register" className="bg-[#00004d] text-white px-10 py-5 rounded-full font-black text-lg shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="bg-white text-[#00004d] border-2 border-[#00004d] px-10 py-5 rounded-full font-black text-lg hover:bg-[#e2f2f5] transition-all flex items-center justify-center active:scale-95">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}