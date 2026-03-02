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
  Briefcase
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pb-20 overflow-hidden">
            <section className="relative bg-[#1e3a8a] py-20 lg:py-32 text-white">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00d26a]/10 skew-x-12 transform origin-right"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-7xl font-black mb-6 tracking-tight"
          >
            Empowering <span className="text-[#00d26a]">Pakistan's</span> <br /> 
            Talent Landscape
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
          >
            EasyJobs.pk is more than just a job portal. We are a bridge between passion and career, dedicated to helping every Pakistani professional find their dream role.
          </motion.p>
        </div>
      </section>
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            <div className="inline-flex items-center gap-2 bg-[#00d26a]/10 px-4 py-2 rounded-full text-[#00d26a] text-sm font-black mb-6 border border-[#00d26a]/20">
              <Target size={18} />
              <span className="uppercase tracking-widest">Our Vision</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#1e3a8a] mb-6 leading-tight">
              To be the #1 destination for <span className="text-[#00d26a]">career growth</span> in Pakistan.
            </h2>
            <p className="text-gray-500 font-medium text-lg mb-8 leading-relaxed">
              We started with a simple goal: to make job hunting easy and hiring efficient. Today, EasyJobs.pk serves thousands of users across Karachi, Lahore, Islamabad, and every corner of the country.
            </p>
            <ul className="space-y-4">
              {['Verified Employers Only', 'Direct Candidate Access', 'Zero Placement Fees'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-[#1e3a8a]">
                  <CheckCircle2 className="text-[#00d26a]" size={22} /> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-slate-50 rounded-[3rem] p-10 border-2 border-dashed border-slate-200">
               <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
                      <Users className="text-[#1e3a8a] mb-4" size={40} />
                      <div className="text-3xl font-black text-[#1e3a8a]">50k+</div>
                      <div className="text-xs font-black text-gray-400 uppercase">Users</div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center mt-8">
                      <Briefcase className="text-[#00d26a] mb-4" size={40} />
                      <div className="text-3xl font-black text-[#1e3a8a]">15k+</div>
                      <div className="text-xs font-black text-gray-400 uppercase">Jobs Posted</div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center -mt-4">
                      <Globe className="text-[#1e3a8a] mb-4" size={40} />
                      <div className="text-3xl font-black text-[#1e3a8a]">40+</div>
                      <div className="text-xs font-black text-gray-400 uppercase">Cities</div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center mt-4">
                      <Trophy className="text-[#00d26a] mb-4" size={40} />
                      <div className="text-3xl font-black text-[#1e3a8a]">98%</div>
                      <div className="text-xs font-black text-gray-400 uppercase">Success Rate</div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section className="bg-[#1e3a8a] py-24 px-6 text-white overflow-hidden relative">
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00d26a]/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">The Values We Breathe</h2>
            <p className="text-blue-100 font-medium">Built with integrity, driven by innovation.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Transparency", 
                desc: "No hidden fees, no fake ads. We believe in clear communication between employers and seekers.",
                icon: Zap 
              },
              { 
                title: "Local Excellence", 
                desc: "Designed specifically for the Pakistani market, understanding the local needs and challenges.",
                icon: TrendingUp 
              },
              { 
                title: "Empowerment", 
                desc: "We provide the tools and resources for professionals to own their career path.",
                icon: Users 
              }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md hover:bg-white/10 transition-all group"
              >
                <div className="w-16 h-16 bg-[#00d26a] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <value.icon className="text-[#1e3a8a]" size={32} />
                </div>
                <h4 className="text-2xl font-black mb-4 uppercase tracking-tight">{value.title}</h4>
                <p className="text-blue-100/60 leading-relaxed font-medium">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <motion.div {...fadeInUp}>
          <h2 className="text-3xl md:text-5xl font-black text-[#1e3a8a] mb-6">Join the Revolution</h2>
          <p className="text-gray-500 font-bold mb-10 text-lg">
            Whether you are a fresh graduate or an experienced professional, EasyJobs.pk is here to guide you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="bg-[#1e3a8a] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-blue-100 hover:bg-blue-900 transition-all flex items-center justify-center gap-3">
              Get Started <ArrowRight size={22} />
            </Link>
            <Link href="/contact" className="bg-white text-[#1e3a8a] border-2 border-[#1e3a8a] px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all flex items-center justify-center">
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  );
}