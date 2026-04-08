"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapPin, Globe, Lock, Send, ChevronDown } from "lucide-react";

export default function JobApplicationPage() {
const router = useRouter();
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [showLoginPopup, setShowLoginPopup] = useState(false);

const [formData, setFormData] = useState({
fullName: "",
email: "",
phone: "",
age:"",
jobtype:"",
maritalStatus:"",
gender:"",
applyingFor: "",
category: "",
city: "",
education: "",
experience: ""
});

const cities = ["Karachi", "Lahore", "RWP/ISB", "Peshawar", "Quetta", "Multan", "Faisalabad"];

const categories = [{
options: [
"House Maid",
"Full Time Maid",
"Part Time Maid",
"Live-in Maid",
"Nanny",
"Child Caretaker",
"Elderly Caretaker",
"Patient Care Attendant",
"Home Nurse",
"Cook",
"Home Chef",
"Assistant Cook",
"Car Driver",
"Truck Driver",
"Bus Driver",
"Personal Driver",
"House Driver",
"Office Driver",
"Gardener",
"Mali",
"Security Guard",
"Home Security Guard",
"Gate Keeper",
"Watchman",
"Cleaner",
"House Cleaner",
"Office Cleaner",
"Janitor",
"Laundry Worker",
"Ironing Man (Press Wala)",
"Dish Washer",
"Kitchen Helper",
"Peon",
"Office Boy",
"House Boy",
"Care Taker (General)",
"Building Caretaker",
"Helper",
"General Helper",
"Delivery Rider",
"Courier Boy",
"Receptionist",
"Customer Care Taker",
"Tractor Driver",
"Beautition",
"Barber",
"Salesman",
"Mid-Wife",
"LHV",
"Lab Technicain",
"OTA",
"Physiotherapist",
"Nutritionist",
"Coach",
"Waiter",
"Trainer",
"Pilot",
"Mobile Technician",
"TV Technician",
"Laptop Technician",
"Motorcycle Mechanic",
"Car Mechanic",
"Car Painter",
"Plumber",
"Carpentar",
"Phone Operator",
"Air-Hostess",
"Steward",
]
},

{
options: ["Administrator", "Office Manager", "Executive Assistant", "Operations Manager"]
},
{
options: ["Farmer", "Livestock Farmer", "Agricultural Engineer", "Agronomist"]
},
{
options: ["Graphic Designer", "Painter", "Illustrator", "Fashion Designer", "Animator"]
},
{
options: ["Mechanical Engineer", "Auto Mechanic", "Technician", "Vehicle Inspector"]
},
{
options: ["Accountant", "Banker", "Auditor", "Financial Analyst"]
},
{
options: ["Business Analyst", "Business Development Manager", "Consultant"]
},
{
options: ["Operations Manager", "Strategy Consultant", "Project Manager"]
},
{
options: ["Customer Support Executive", "Call Center Agent", "Client Relationship Manager"]
},
{
options: ["Civil Engineer", "Structural Engineer", "Site Supervisor"]
},
{
options: ["Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Researcher"]
},
{
options: ["SEO Specialist", "Content Creator", "Social Media Manager", "Digital Marketer"]
},
{
options: ["Teacher", "Lecturer", "Tutor", "Researcher", "Trainer"]
},
{
options: ["E-commerce Manager", "Online Store Owner", "Marketplace Seller"]
},
{
options: ["Electrical Engineer", "Electronics Technician", "Automation Engineer"]
},
{
options: ["Doctor", "Nurse", "Pharmacist", "Lab Technician", "Surgeon"]
},
{
options: ["HR Manager", "Recruiter", "HR Assistant", "Talent Acquisition Specialist"]
},
{
options: ["Software Developer", "IT Support", "System Administrator", "Network Engineer"]
},
{
options: ["Web Developer", "Frontend Developer", "Backend Developer", "Fullstack Developer"]
},
{
options: ["Lawyer", "Judge", "Police Officer", "Paralegal"]
},
{
options: ["Logistics Manager", "Warehouse Manager", "Supply Chain Analyst", "Driver"]
},
{
options: ["Sales Executive", "Marketing Manager", "Brand Manager", "Business Development Executive"]
},
{
options: ["Actor", "Musician", "Photographer", "Director", "Content Creator"]
},
{
options: ["Pharmacist", "Lab Scientist", "Biotech Researcher", "Clinical Researcher"]
},
{
options: ["Project Manager", "Program Manager", "Project Coordinator"]
},
{
options: ["Researcher", "Lab Scientist", "R&D Engineer"]
},
{
options: ["Biologist", "Chemist", "Physicist", "Lab Technician"]
},
{
options: ["Security Guard", "Security Supervisor", "Investigator"]
},
{
options: ["Social Worker", "NGO Coordinator", "Field Officer"]
},
{
options: ["Telecom Engineer", "Network Technician", "Technical Support"]
},
{
options: ["Travel Agent", "Tour Guide", "Visa Officer", "Ticketing Officer"]
},
{
options: ["Veterinarian", "Animal Caretaker", "Pet Groomer"]
},
{
options: ["Freelancer", "Content Writer", "Designer", "Online Consultant"]
},
{
options: ["Other"]
}

];

const educationLevels = [
"Matric",
"Intermediate",
"Bachelor's",
"Master's",
"M.Phil / PhD",
"Other"
];
const maritalLevels = [
  "Married",
  "Single",
  "Divorced",
  "Widowed",
]
const genderLevels = [
  "Male",
  "Female",
  "Other",
]
const jobType = [
  "Full-Time",
  "Part-Time",
  "One-Day Task",
]

const categoryRef = useRef<HTMLSelectElement>(null);

const handleJumpByLetter = (letter: string) => {
if (!categoryRef.current) return;
const options = Array.from(categoryRef.current.options);
const match = options.find(opt => opt.value.toLowerCase().startsWith(letter.toLowerCase()));
if (match) {
categoryRef.current.value = match.value;
setFormData({ ...formData, category: match.value });
}
};

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (!isLoggedIn) {
setShowLoginPopup(true);
return;
}
console.log("Form Data Submitted:", formData);
};

return ( <main className="min-h-screen bg-[#f8fafc] pb-20"> <section className="bg-[#e2f2f5] pt-12 pb-24 px-6 rounded-b-[60px] text-center shadow-lg"> <div className="max-w-4xl mx-auto"> <h1 className="text-3xl md:text-5xl font-black text-[#00004d] tracking-tighter">
Applying for a Job </h1> <p className="text-[#00004d] font-bold text-xs tracking-widest mt-4">
Fill the single form below to apply </p> </div> </section>

  <div className="max-w-4xl mx-auto px-4 -mt-16">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-12 rounded-[40px] shadow-2xl border border-gray-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Country</label>
      <div className="bg-gray-100 p-4 rounded-full font-bold text-gray-400 border border-gray-200 flex items-center gap-3 cursor-not-allowed text-sm">
        <Globe size={18} /> Pakistan (Fixed)
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Select City</label>
      <div className="relative">
        <MapPin className="absolute left-5 top-4 text-[#0000ff]" size={18} />
        <select
          required
          className="w-full bg-slate-50 p-4 pl-12 rounded-full font-bold text-[#00004d] border border-gray-100 outline-none focus:ring-2 focus:ring-[#0000ff] appearance-none text-sm"
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        >
          <option value="">Choose City</option>
          {cities.map(c => <option key={c}>{c}</option>)}
        </select>
        <ChevronDown className="absolute right-5 top-4 text-gray-300" size={18} />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Applying For (Positions)</label>
      <input
        type="text"
        placeholder="e.g. Sales Manager"
        className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] placeholder:text-[#00004d] text-sm border border-gray-100 outline-none focus:ring-2 focus:ring-[#0000ff]"
        onChange={(e) => setFormData({ ...formData, applyingFor: e.target.value })}
      />
    </div>

    <div className="md:col-span-2 flex flex-col gap-2">
      <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Jump to Category (by first letter)</label>
      <input
        type="text"
        maxLength={1}
        placeholder="Enter first letter..."
        className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] placeholder:text-[#00004d] text-sm border border-gray-100 outline-none focus:ring-2 focus:ring-[#0000ff]"
        onChange={(e) => handleJumpByLetter(e.target.value)}
      />
    </div>

    <div className="md:col-span-2 space-y-2">
      <label className="text-[10px] font-black text-gray-400 uppercase ml-4">Job Category</label>
      <select
        ref={categoryRef}
        className="w-full bg-slate-50 p-4 rounded-full font-bold text-[#00004d] text-sm border border-gray-100 outline-none focus:ring-2 focus:ring-[#0000ff]"
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        <option value="">Select Category</option>
        {[...new Set(categories.flatMap(cat => cat.options))]
  .sort((a, b) => a.localeCompare(b))
  .map(opt => (
    <option key={opt} value={opt}>{opt}</option>
))}
      </select>
    </div>
<select
      className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, jobtype: e.target.value })}
    >
      <option>Job Type</option>
      {jobType.map(e => <option key={e}>{e}</option>)}
    </select>
    <input
      type="text"
      placeholder="Full Name"
      className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d] placeholder:text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
    />

    <input
      type="email"
      placeholder="Email"
      className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d] placeholder:text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    />

    <input
      type="tel"
      placeholder="Phone"
      className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d] placeholder:text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
    />
    <input
      type="age"
      placeholder="Age"
      className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d] placeholder:text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
    />
    <select
      className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
    >
      <option>Select Gender</option>
      {genderLevels.map(e => <option key={e}>{e}</option>)}
    </select>
    <select
      className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
    >
      <option>Select Marital Status</option>
      {maritalLevels.map(e => <option key={e}>{e}</option>)}
    </select>
    <select
      className="p-4 rounded-full text-sm bg-slate-50 text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
    >
      <option>Select Education</option>
      {educationLevels.map(e => <option key={e}>{e}</option>)}
    </select>

    <textarea
    placeholder="Add Experience 1"
      className="md:col-span-2 p-4 rounded-3xl text-sm bg-slate-50 text-[#00004d] placeholder:text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
    />
    <textarea
    placeholder="Add Experience 2"
      className="md:col-span-2 p-4 rounded-3xl text-sm bg-slate-50 text-[#00004d] placeholder:text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
    />
    <textarea
    placeholder="Add Experience 3"
      className="md:col-span-2 p-4 rounded-3xl text-sm bg-slate-50 text-[#00004d] placeholder:text-[#00004d]"
      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
    />

  </div>

  <div className="mt-12 text-center">
    <motion.button type="submit"
      className="w-full bg-[#00004d] text-white py-6 rounded-full font-black text-lg">
      Submit Application
    </motion.button>
  </div>
</form>
  </div>
</main>
);
}
