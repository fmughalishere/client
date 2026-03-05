import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Linkedin, Instagram, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1e3a8a] text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00d26a]/10 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
            <Link href="/">
              <Image 
                src="/images/logo.png" 
                alt="EasyJobs" 
                width={160} 
                height={45} 
                style={{ height: 'auto' }}
              />
            </Link>
            <p className="text-blue-100/70 text-sm leading-relaxed mt-3">
              Pakistan's premier destination for job seekers and employers. We connect talent with opportunity across every city.
            </p>
            <div className="flex space-x-3">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#00d26a] hover:scale-110 transition-all duration-300">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              For Candidates <span className="w-6 h-[2px] bg-[#00d26a]"></span>
            </h3>
            <ul className="space-y-4 text-sm font-medium text-blue-100/70">
              <li><Link href="/jobs" className="hover:text-[#00d26a] transition-colors">Browse Jobs</Link></li>
              <li><Link href="/cities" className="hover:text-[#00d26a] transition-colors">Jobs by City</Link></li>
              <li><Link href="/blogs" className="hover:text-[#00d26a] transition-colors">Career Advice</Link></li>
              <li><Link href="#" className="hover:text-[#00d26a] transition-colors">Resume Help</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              Company <span className="w-6 h-[2px] bg-[#00d26a]"></span>
            </h3>
            <ul className="space-y-4 text-sm font-medium text-blue-100/70">
              <li><Link href="/about" className="hover:text-[#00d26a] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#00d26a] transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-[#00d26a] transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-[#00d26a] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              Get in Touch <span className="w-6 h-[2px] bg-[#00d26a]"></span>
            </h3>
            <ul className="space-y-4 text-sm font-medium text-blue-100/70">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#00d26a] shrink-0" />
                <span>Suite 402, Business Center, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#00d26a]" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#00d26a]" />
                <span>support@easyjobs.pk</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-blue-100/40 font-medium">
            © {new Date().getFullYear()} EasyJobs.pk. Built with Passion in Pakistan.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#00d26a] font-bold tracking-widest uppercase">
            Designed for Success
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;