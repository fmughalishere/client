"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  User,
  Calendar,
  Globe,
  FileText,
  Award
} from "lucide-react";

export default function ApplicantDetail() {
  const { id } = useParams();
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicant = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://easyjobspk.onrender.com/api/applications/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      setApplicant(data);
      setLoading(false);
    };

    if (id) fetchApplicant();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#e2f2f5]">
        <Loader2 className="animate-spin w-10 h-10 text-[#00004d]" />
      </div>
    );

  if (!applicant) return <p>No data found</p>;

  return (
    <div className="min-h-screen bg-[#e2f2f5] p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="bg-[#00004d] text-white p-6 rounded-3xl shadow-lg flex items-center gap-5">
          <img
            src={`https://easyjobspk.onrender.com/uploads/${applicant.image}`}
            className="w-20 h-20 rounded-full object-cover border-4 border-white"
          />
          <div>
            <h1 className="text-2xl font-bold">{applicant.fullName}</h1>
            <p className="text-sm opacity-80">{applicant.email}</p>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
              {applicant.status}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-lg font-bold text-[#00004d]">Basic Info</h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm">

            <p><User size={16} className="inline mr-2"/> {applicant.gender}</p>

            <p>
              <Calendar size={16} className="inline mr-2"/>
              {new Date(applicant.dob).toLocaleDateString()}
            </p>

            <p><Globe size={16} className="inline mr-2"/> {applicant.country}</p>

            <p><MapPin size={16} className="inline mr-2"/> {applicant.city}</p>

          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-lg font-bold text-[#00004d]">Contact Info</h2>

          <div className="space-y-2 text-sm">

            <p>
              <Phone size={16} className="inline mr-2"/>
              {applicant.phone} ({applicant.phonePrivacy})
            </p>

            <p>
              <Mail size={16} className="inline mr-2"/>
              {applicant.email} ({applicant.emailPrivacy})
            </p>

            <p>
              <Phone size={16} className="inline mr-2"/>
              WhatsApp: {applicant.whatsapp} ({applicant.whatsappPrivacy})
            </p>

          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-lg font-bold text-[#00004d]">Professional Info</h2>

          <div className="grid md:grid-cols-2 gap-4 text-sm">

            <p>
              <Briefcase size={16} className="inline mr-2"/>
              {applicant.job?.title}
            </p>

            <p>
              <Briefcase size={16} className="inline mr-2"/>
              {applicant.jobtype}
            </p>

            <p>
              <GraduationCap size={16} className="inline mr-2"/>
              {applicant.education}
            </p>

            <p>
              Category: {applicant.category}
            </p>

            <p>
              {applicant.isFresher ? "Fresher" : "Experienced"}
            </p>

          </div>
        </div>

        {applicant.experience?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h2 className="text-lg font-bold text-[#00004d]">Experience</h2>

            {applicant.experience.map((exp: any) => (
              <div key={exp._id} className="border-l-4 border-[#00004d] pl-4">
                <p className="font-semibold">{exp.designation}</p>
                <p className="text-sm text-gray-600">{exp.companyName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(exp.startDate).toLocaleDateString()} -{" "}
                  {exp.isCurrentJob
                    ? "Present"
                    : new Date(exp.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {applicant.achievements && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-bold text-[#00004d] mb-2">
              <Award size={16} className="inline mr-2"/>
              Achievements
            </h2>
            <p className="text-sm text-gray-700">{applicant.achievements}</p>
          </div>
        )}

        {applicant.coverLetter && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-bold text-[#00004d] mb-2">
              <FileText size={16} className="inline mr-2"/>
              Cover Letter
            </h2>
            <p className="text-sm text-gray-700">{applicant.coverLetter}</p>
          </div>
        )}

        {applicant.resume && (
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <a
              href={`https://easyjobspk.onrender.com/uploads/${applicant.resume}`}
              target="_blank"
              className="text-[#00004d] font-semibold underline"
            >
              View Resume
            </a>
          </div>
        )}

      </div>
    </div>
  );
}