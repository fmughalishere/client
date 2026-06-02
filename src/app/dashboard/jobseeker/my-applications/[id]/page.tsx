"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Briefcase, MapPin, DollarSign,
    Calendar, Building2, CheckCircle2, Clock,
    FileText, Loader2, Mail, ExternalLink, Info, Phone, MessageCircle, X
} from "lucide-react";
import Link from "next/link";

export default function ApplicationDetails() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showOfferOnly, setShowOfferOnly] = useState(false); // State to toggle view

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`https://easyjobspk.onrender.com/api/applications/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await res.json();
                setData(result);
            } catch (err) { console.error(err) }
            finally { setLoading(false) }
        };
        fetchDetails();
    }, [id]);

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#e6e8e8] gap-4">
            <Loader2 className="animate-spin text-[#00004d]" size={40} />
            <p className="font-black text-slate-400 text-xs  tracking-widest">Loading Details...</p>
        </div>
    );

    const isJobApp = !!data?.job;

    // --- FULL SCREEN OFFER VIEW ---
    if (showOfferOnly && data?.offerDetails) {
        const offer = data.offerDetails;
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                <button
                    onClick={() => setShowOfferOnly(false)}
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 font-black text-xs  tracking-widest hover:text-[#00004d] transition-colors"
                >
                    <ArrowLeft size={20} /> Back to Application
                </button>

                <div className="max-w-2xl w-full text-center space-y-8">
                    <div className="inline-flex p-4 bg-green-50 text-[#5DBB63] rounded-[2rem] animate-bounce">
                        <CheckCircle2 size={48} />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black text-[#00004d] leading-tight tracking-tighter">
                            Congratulations!
                        </h1>
                        <p className="text-slate-400 font-bold  tracking-[0.2em] text-sm">You have received a job offer</p>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 text-left space-y-6">
                        <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 ">Designation</span>
                                <h2 className="text-2xl font-black text-[#00004d]">{offer.designation}</h2>
                                <p className="text-[#5DBB63] font-extrabold">{offer.companyName}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-slate-400 ">Offered By</span>
                                <p className="font-bold text-[#00004d]">{offer.employerName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-[#5DBB63]" size={20} />
                                <div>
                                    <span className="text-[10px] font-black text-slate-400  block">Interview Date</span>
                                    <p className="text-sm font-bold text-[#00004d]">{new Date(offer.interviewDate).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="text-[#5DBB63]" size={20} />
                                <div>
                                    <span className="text-[10px] font-black text-slate-400  block">Location</span>
                                    <p className="text-sm font-bold text-[#00004d]">{offer.cityName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-white rounded-2xl border border-slate-100 italic text-slate-500 text-sm">
                            "{offer.message || "We are pleased to offer you this position based on your profile."}"
                        </div>
                    </div>

                    {/* ACTION BUTTON: Accept & WhatsApp */}
                    <div className="pt-4 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                className="py-4 bg-[#5DBB63] hover:bg-[#4ea854] text-white rounded-[2rem] font-black flex items-center justify-center gap-2 shadow-xl shadow-green-100"
                            >
                                <MessageCircle size={20} />
                                ACCEPT
                            </button>

                            <button
                                className="py-4 bg-red-500 hover:bg-red-600 text-white rounded-[2rem] font-black flex items-center justify-center gap-2 shadow-xl shadow-red-100"
                            >
                                REJECT
                            </button>
                        </div>

                        <a
                            href={`mailto:${offer.email}`}
                            className="block bg-slate-50 border border-slate-200 rounded-2xl p-4 hover:bg-slate-100 transition"
                        >
                            <p className="text-xs text-slate-500 font-semibold mb-1">
                                Contact Email
                            </p>
                            <p className="text-sm font-bold text-blue-600">
                                {offer.email}
                            </p>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // --- NORMAL APPLICATION VIEW ---
    const steps = [
        { label: "Submitted", date: data.createdAt, done: true },
        { label: isJobApp ? "Reviewed by HR" : "Verified by Team", date: data.reviewedAt || null, done: !!data.reviewedAt || data.status !== 'pending' },
        { label: isJobApp ? (data.status === 'offered' ? "Hired" : "Updated") : (data.status === 'approved' ? "Approved" : "Status Update"), date: data.updatedAt, done: data.status !== 'pending' },
    ];

    return (
        <div className="min-h-screen bg-[#e6e8e8] pb-20">
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
                    <Link href="/dashboard/jobseeker/my-applications" className="flex items-center gap-2 text-slate-400 font-bold text-xs group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-all" /> BACK
                    </Link>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black  tracking-wider ${['offered', 'approved'].includes(data.status?.toLowerCase()) ? 'bg-[#5DBB63] text-white' : 'bg-[#00004d] text-white'
                        }`}>
                        Current Status: {data.status}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-white">
                            <div className="flex items-center gap-5 mb-8">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${isJobApp ? 'bg-slate-100 text-[#00004d]' : 'bg-green-50 text-[#5DBB63]'}`}>
                                    {isJobApp ? <Building2 size={32} /> : <FileText size={32} />}
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-black text-[#00004d] leading-tight">
                                        {data.job?.title || "General Application"}
                                    </h1>
                                    <p className="text-[#5DBB63] font-black  tracking-widest text-sm mt-1">
                                        {data.job?.companyName || "Easy Jobs PK Network"}
                                    </p>
                                </div>
                            </div>

                            {isJobApp ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-8 border-y border-slate-50">
                                    <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 ">Location</span><p className="text-sm font-bold text-[#00004d]">{data.job.location}</p></div>
                                    <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 ">Salary</span><p className="text-sm font-bold text-[#00004d]">{data.job.salary}</p></div>
                                    <div className="flex flex-col"><span className="text-[10px] font-black text-slate-400 ">Role</span><p className="text-sm font-bold text-[#00004d]">{data.job.jobType}</p></div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 flex gap-4">
                                    <Info className="text-blue-500 shrink-0" size={20} />
                                    <p className="text-sm text-slate-600 font-medium">
                                        This was a general application submitted to our talent pool. Companies can view your profile and contact you directly for relevant roles.
                                    </p>
                                </div>
                            )}

                            <div className="mt-8">
                                <h3 className="text-lg font-black text-[#00004d] mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-[#5DBB63]" /> Details Summary
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {data.job?.description || "Your application is being processed. Our team is verifying your details to match you with the best opportunities available in our network."}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-white">
                            <h3 className="text-lg font-black text-[#00004d] mb-8">Process Timeline</h3>
                            <div className="space-y-8 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex gap-6 relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${step.done ? 'bg-[#5DBB63] text-white shadow-lg shadow-green-200' : 'bg-slate-100 text-slate-300'}`}>
                                            <CheckCircle2 size={18} />
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-black  tracking-wider ${step.done ? 'text-[#00004d]' : 'text-slate-400'}`}>{step.label}</h4>
                                            <p className="text-xs font-bold text-slate-400">{step.date ? new Date(step.date).toLocaleDateString() : "Pending"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className={`p-8 rounded-[2.5rem] text-white shadow-xl ${['offered', 'approved'].includes(data.status?.toLowerCase()) ? 'bg-gradient-to-br from-[#5DBB63] to-[#4ea854]' : 'bg-[#00004d]'}`}>
                            <h3 className="text-xl font-black mb-2  tracking-tight">Verdict</h3>
                            <p className="text-sm font-bold opacity-90 capitalize mb-4">{data.status}</p>

                            {/* OFFER BUTTON */}
                            {data.status === 'offered' && data.offerDetails && (
                                <button
                                    onClick={() => setShowOfferOnly(true)}
                                    className="w-full py-4 bg-white text-[#5DBB63] rounded-2xl font-black text-xs  tracking-widest mb-6 shadow-lg animate-pulse hover:scale-105 transition-all"
                                >
                                    View Offer Details
                                </button>
                            )}

                            <p className="text-[11px] font-medium opacity-80 leading-relaxed italic">
                                {data.status === 'pending' && "Processing your application. Please stay tuned for updates."}
                                {data.status === 'approved' && "Congratulations! Your general application has been approved."}
                                {data.status === 'offered' && "Click the button above to view your direct job offer details."}
                                {data.status === 'rejected' && "Unfortunately, your application was not successful this time."}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}