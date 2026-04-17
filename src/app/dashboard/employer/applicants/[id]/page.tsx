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
  Award,
  Send
} from "lucide-react";

export default function ApplicantDetail() {
  const { id } = useParams();
  const [applicant, setApplicant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offering, setOffering] = useState(false);

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

  const handleSendOffer = async () => {
    const confirmOffer = confirm("Are you sure you want to send a job offer to this candidate?");
    if (!confirmOffer) return;

    setOffering(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `https://easyjobspk.onrender.com/api/applications/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "Offered" }), 
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Offer sent successfully!");
        setApplicant({ ...applicant, status: "Offered" });
      } else {
        alert(data.message || "Failed to send offer. Please try again.");
      }
    } catch (error) {
      console.error("Error sending offer:", error);
      alert("Something went wrong!");
    } finally {
      setOffering(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-[#e2f2f5]">
        <Loader2 className="animate-spin w-10 h-10 text-[#00004d]" />
      </div>
    );

  if (!applicant) return <p>No data found</p>;

  return (
    <div className="min-h-screen bg-[#e2f2f5] p-6 pb-24">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="bg-[#00004d] text-white p-6 rounded-3xl shadow-lg flex items-center gap-5">
          <img
            src={`https://easyjobspk.onrender.com/uploads/${applicant.image}`}
            className="w-20 h-20 rounded-full object-cover border-4 border-white"
            alt="Profile"
          />
          <div>
            <h1 className="text-2xl font-bold">{applicant.fullName}</h1>
            <p className="text-sm opacity-80">{applicant.email}</p>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full uppercase">
              Status: {applicant.status}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-lg font-bold text-[#00004d]">Basic Info</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <p><User size={16} className="inline mr-2"/> {applicant.gender}</p>
            <p><Calendar size={16} className="inline mr-2"/> {new Date(applicant.dob).toLocaleDateString()}</p>
            <p><Globe size={16} className="inline mr-2"/> {applicant.country}</p>
            <p><MapPin size={16} className="inline mr-2"/> {applicant.city}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-lg font-bold text-[#00004d]">Professional Info</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <p><Briefcase size={16} className="inline mr-2"/> {applicant.job?.title}</p>
            <p><Briefcase size={16} className="inline mr-2"/> {applicant.jobtype}</p>
            <p><GraduationCap size={16} className="inline mr-2"/> {applicant.education}</p>
            <p>Category: {applicant.category}</p>
            <p>{applicant.isFresher ? "Fresher" : "Experienced"}</p>
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
                  {exp.isCurrentJob ? "Present" : new Date(exp.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
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
        <div className="mt-8 flex justify-center pb-10">
          {applicant.status === "Offered" ? (
            <button 
              disabled
              className="bg-green-600 text-white px-10 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 cursor-not-allowed"
            >
              Offer Already Sent
            </button>
          ) : (
            <button
              onClick={handleSendOffer}
              disabled={offering}
              className="bg-[#00004d] hover:bg-blue-900 text-white px-10 py-4 rounded-full font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              {offering ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={20} />}
              {offering ? "Offering..." : "Make an Offer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}