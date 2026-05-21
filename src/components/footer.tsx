"use client";
import Link from 'next/link';
import { GrLinkedin } from "react-icons/gr";
import { 
  FaTiktok, FaInstagram, FaFacebook, FaHeadset, 
  FaUserTie, FaScrewdriverWrench, FaChalkboardUser,
  FaBolt,
  FaUserDoctor
} from "react-icons/fa6";
import { GiChefToque, GiSteeringWheel } from "react-icons/gi";
import { MdDeveloperBoard, MdEngineering, MdManageAccounts, MdPlumbing } from "react-icons/md";

const Footer = () => {
  const professions = [
    <MdEngineering key="6" />,
    <FaHeadset key="1" />,
    <GiChefToque key="3" />,
    <FaChalkboardUser key="7" />,
    <FaScrewdriverWrench key="4" />,
    <MdManageAccounts key="5" />,
    <GiSteeringWheel key="2" />,
    <MdPlumbing key="8" />,
    <MdDeveloperBoard key="9"/>,
    <FaUserDoctor key="10"/>
  ];

  return (
    <footer className="w-full flex flex-col">
      <div className="w-full bg-white py-1 flex justify-center items-center px-2">
        <div className="flex items-center justify-between w-full max-w-[320px] sm:max-w-[420px]">
          <Link href="https://facebook.com" target="_blank" className="text-[#1877F2] hover:scale-110 transition-transform">
            <FaFacebook size={20} />
          </Link>
          
          <Link href="https://linkedin.com" target="_blank" className="hover:scale-110 transition-transform">
            <div className="bg-[#0077B5] text-white p-[3px] rounded-[3px]">
              <GrLinkedin size={14} />
            </div>
          </Link>
          
          <Link
            href="/help"
            className="bg-[#5DBB63] text-white px-3 py-1.5 rounded-[9px] text-[10px] font-black shadow-sm hover:opacity-90"
          >
            GET HELP
          </Link>

          <Link href="https://tiktok.com" target="_blank" className="hover:scale-110 transition-transform">
            <div className="bg-black text-white p-[6px] rounded-full">
              <FaTiktok size={10} />
            </div>
          </Link>
          
          <Link href="https://instagram.com" target="_blank" className="hover:scale-110 transition-transform">
            <div className="rounded-lg p-[3px] bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
              <FaInstagram size={16} />
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full bg-[#E1EAED] pt-8 flex flex-col items-center">
          <div className="text-center mb-6 px-4">
          <p className="text-[#1e3a8a] text-[10px] sm:text-[16px] font-bold leading-tight">
            Copyright © 2026 <span className="underline decoration-green-400 decoration-2">easyjobs.pk</span>
          </p>
          <p className="text-[#1e3a8a] text-[9px] sm:text-[11px] mt-1 font-bold opacity-80 tracking-wide">
            A project of Success Signatures (SMC Pvt) Ltd. Lahore–Pakistan
          </p>
        </div>
        <div className="w-full flex justify-around items-end px-1 sm:px-10 overflow-hidden">
          {professions.map((icon, index) => (
            <div 
              key={index} 
              className="text-[#98BCC4] opacity-50 text-4xl sm:text-6xl md:text-7xl lg:text-6xl mb-[-5px] hover:opacity-100 hover:text-[#5DBB63] transition-all duration-300 cursor-default"
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

    </footer>
  );
};

export default Footer;