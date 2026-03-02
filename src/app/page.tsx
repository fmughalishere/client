"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Heart,
  FileText,
  UserCheck,
  TrendingUp
} from "lucide-react";

export default function HomePage() {
  const quickActions = [
    { title: "Start Applying", icon: FileText, href: "/jobs" },
    { title: "Start Hiring", icon: UserCheck, href: "/dashboard/employer" },
    { title: "Govt Jobs", icon: Clock, href: "/jobs" },
    { title: "Browse CVs", icon: Briefcase, href: "/dashboard/employer" }
  ];

  const featuredJobs = [
    {
      title: "Junior Accounts / Finance Assistant & HR Assistant Required",
      loc: "Urdu Bazar, Lahore",
      time: "3 days ago",
      img: "/images/icon.jpeg"
    },
    {
      title: "Europe Jobs / Greece Work Visa / Hotel Staff Required",
      loc: "Allama Iqbal Town, Lahore",
      time: "27 days ago",
      img: "/images/icon.jpeg"
    },
    {
      title: "Factory Hiring: Helper, Worker, Manager Required",
      loc: "S.I.E, Gujranwala",
      time: "1 day ago",
      img: "/images/icon.jpeg"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-16">
      <section className="bg-[#1e3a8a] text-white py-12 px-6 text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold mb-3">
          Hire Easy, Get Hired Easy
        </h1>
        <p className="text-sm md:text-base text-blue-100 mb-6">
          Explore thousands of jobs across Pakistan
        </p>

        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            className="w-full py-3 pl-4 pr-10 rounded-full text-sm text-black outline-none"
          />
          <Search
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1e3a8a]"
          />
        </div>
      </section>
      <section className="max-w-5xl mx-auto px-6 mt-8">
        <div className="md:hidden space-y-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex items-center justify-between bg-white border p-4 rounded-3xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <action.icon size={26} className="text-[#1e3a8a]" />
                <span className="text-base font-bold text-[#1e3a8a]">
                  {action.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="hidden md:grid bg-white shadow-lg rounded-2xl p-6 grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 transition group"
            >
              <action.icon
                size={28}
                className="text-[#1e3a8a] group-hover:text-[#00d26a] transition"
              />
              <span className="text-xs font-semibold text-slate-600 text-center">
                {action.title}
              </span>
            </Link>
          ))}
        </div>

      </section>
      <section className="max-w-5xl mx-auto px-6 mt-14">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-[#1e3a8a] flex items-center gap-2">
            <TrendingUp size={22} className="text-[#00d26a]" />
            Featured Jobs
          </h3>

          <Link
            href="/jobs"
            className="text-sm font-semibold text-[#1e3a8a] hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="md:hidden space-y-4">
          {featuredJobs.map((job, idx) => (
            <div key={idx} className="bg-white p-4 rounded-3xl border shadow-sm flex gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden relative border">
                <Image src={job.img} alt="job" fill className="object-cover" />
              </div>

              <div className="flex-1">
                <h4 className="font-bold text-[#1e3a8a] text-sm mb-2">
                  {job.title}
                </h4>

                <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                  <MapPin size={13} />
                  {job.loc}
                </div>

                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <Clock size={13} />
                  {job.time}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {featuredJobs.map((job, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border p-5 flex gap-4 hover:shadow-lg transition group"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden relative border">
                <Image src={job.img} alt="job" fill className="object-cover" />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-[#1e3a8a] text-sm mb-2 group-hover:text-[#00d26a] transition">
                  {job.title}
                </h4>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <MapPin size={14} />
                  {job.loc}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock size={13} />
                  {job.time}
                </div>
              </div>

              <button className="text-gray-300 hover:text-red-500 transition">
                <Heart size={18} />
              </button>
            </div>
          ))}
        </div>

      </section>

    </main>
  );
}