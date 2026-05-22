"use client";
import Link from 'next/link';
import { GrLinkedin } from "react-icons/gr";
import { 
  FaTiktok, FaInstagram, FaFacebook,
  FaUserDoctor,
  FaChalkboardUser,
  FaUserGear,
  FaUserTie,
  FaUserNurse,
  FaUserGraduate,
  FaUserShield,
  FaUserAstronaut,
  FaUserNinja,
  FaUserSecret,
  FaUserPen
} from "react-icons/fa6";

const Footer = () => {
  const professions = [
    <FaUserDoctor key="1" title="Doctor" />,
    <FaChalkboardUser key="2" title="Teacher" />,
    <FaUserGear key="3" title="Engineer" />,
    <FaUserTie key="4" title="Manager" />,
    <FaUserNurse key="5" title="Nurse" />,
    <FaUserGraduate key="6" title="Graduate" />,
    <FaUserShield key="7" title="Security" />,
    <FaUserAstronaut key="8" title="Science" />,
    <FaUserNinja key="9" title="Developer" />,
    <FaUserSecret key="10" title="Legal" />,
    <FaUserPen key="12" title="Writer" />
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

      <div className="w-full bg-[#e6e8e8] pt-8 flex flex-col items-center">
        <div className="text-center px-4">
          <p className="text-[#1e3a8a] text-[10px] sm:text-[16px] font-bold leading-tight">
            Copyright © 2026 <span className="underline decoration-green-400 decoration-2">easyjobs.pk</span>
          </p>
          <p className="text-[#1e3a8a] text-[9px] sm:text-[11px] mt-1 font-bold opacity-80 tracking-wide">
            A project of Success Signatures (SMC Pvt) Ltd. Lahore–Pakistan
          </p>
        </div>
        <div className="w-full flex justify-around items-end px-2 sm:px-10 overflow-hidden h-14 sm:h-20">
          {professions.map((icon, index) => (
            <div 
              key={index} 
              className="text-[#98BCC4] opacity-40 text-3xl sm:text-5xl md:text-6xl hover:opacity-100 hover:text-[#5DBB63] transition-all duration-300 cursor-default hover:scale-110"
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