"use client";

import {
  Search,
  PlusCircle,
  Briefcase,
  Users,
  ClipboardList,
  ChevronDown,
  Loader2,
  User,
  Heart,
  Filter,
  X,
  ArrowUpDown,
} from "lucide-react";

import { IoIosPin } from "react-icons/io";
import { LuChevronsRight } from "react-icons/lu";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

import {
  MALE_ICON,
  FEMALE_ICON,
  CITIES,
  JOB_CATEGORIES,
  EDUCATION_OPTIONS,
} from "./constants";



function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#00004d] outline-none bg-gray-50 flex items-center justify-between"
      >
        <span>{value || placeholder}</span>

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">

          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100"
          >
            {placeholder}
          </button>

          {options.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                onChange(item);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-bold transition-all ${
                value === item
                  ? "bg-[#00004d] text-white"
                  : "text-[#00004d] hover:bg-[#5DBB63] hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



export default function HomePage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [searchMode, setSearchMode] = useState<
    "employees" | "jobs"
  >("employees");

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEducation, setSelectedEducation] = useState("");

  const [sortBy, setSortBy] = useState<
    "none" | "name" | "age" | "fav"
  >("none");

  const router = useRouter();

  const searchRef = useRef<HTMLDivElement>(null);

  const whiteFilter = {
    filter: "brightness(0) invert(1)",
  };

  const quickActions = [
    {
      label: "Apply a Job",
      icon: (
        <Briefcase
          size={30}
          style={{ color: "#5DBB63" }}
        />
      ),
      href: "/application",
    },

    {
      label: "Post a Job",
      icon: (
        <PlusCircle
          size={30}
          style={{ color: "white" }}
        />
      ),
      href: "/post-job",
    },

    {
      label: "Job Seekers",
      icon: (
        <Users
          size={30}
          style={{ color: "#5DBB63" }}
        />
      ),
      href: "/applicants",
    },

    {
      label: "Job Offers",
      icon: (
        <ClipboardList
          size={30}
          style={{ color: "#5DBB63" }}
        />
      ),
      href: "/jobs",
    },
  ];



  const fetchApplicants = useCallback(async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      const userData =
        typeof window !== "undefined"
          ? localStorage.getItem("user")
          : null;

      if (userData) {
        const parsedUser = JSON.parse(userData);

        setCurrentUserId(
          parsedUser._id || parsedUser.id
        );
      }

      const res = await fetch(
        "https://easyjobspk.onrender.com/api/applications/all-applicants",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const approvedOnly = Array.isArray(data)
        ? data.filter(
            (app: any) =>
              app.status === "shortlisted"
          )
        : [];

      setApplicants(approvedOnly.reverse());

    } catch (error) {
      console.error(
        "Error fetching applicants:",
        error
      );

    } finally {
      setLoading(false);
    }
  }, []);



  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);



  const calculateAge = (dob: string) => {
    if (!dob) return 0;

    const birthDate = new Date(dob);

    const today = new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    if (
      today.getMonth() <
        birthDate.getMonth() ||
      (today.getMonth() ===
        birthDate.getMonth() &&
        today.getDate() <
          birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };



  const filteredAndSortedData = useMemo(() => {
    let result = [...applicants];

    if (searchQuery) {
      const query = searchQuery
        .toLowerCase()
        .trim();

      result = result.filter((item) => {
        const nameMatch =
          item.fullName
            .toLowerCase()
            .includes(query);

        const categoryMatch =
          item.category &&
          item.category
            .toLowerCase()
            .includes(query);

        const age =
          calculateAge(item.dob).toString();

        const ageMatch = age === query;

        return (
          nameMatch ||
          categoryMatch ||
          ageMatch
        );
      });
    }

    if (selectedCity) {
      result = result.filter(
        (item) => item.city === selectedCity
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (item) =>
          item.category === selectedCategory
      );
    }

    if (selectedEducation) {
      result = result.filter(
        (item) =>
          item.education ===
          selectedEducation
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        a.fullName.localeCompare(b.fullName)
      );

    } else if (sortBy === "age") {
      result.sort(
        (a, b) =>
          calculateAge(a.dob) -
          calculateAge(b.dob)
      );

    } else if (sortBy === "fav") {
      result = result.filter(
        (app) =>
          currentUserId &&
          app.savedBy?.includes(currentUserId)
      );
    }

    return result;

  }, [
    applicants,
    searchQuery,
    selectedCity,
    selectedCategory,
    selectedEducation,
    sortBy,
    currentUserId,
  ]);



  const handleToggleSave = async (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();

    const token =
      localStorage.getItem("token");

    if (!token || !currentUserId) {
      toast.error(
        "Please login to save applicants!"
      );

      return;
    }

    try {
      const res = await fetch(
        `https://easyjobspk.onrender.com/api/applications/${id}/save`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      if (res.ok) {
        setApplicants((prev) =>
          prev.map((app) => {
            if (app._id === id) {

              const isCurrentlySaved =
                app.savedBy?.includes(
                  currentUserId
                );

              const newSavedBy =
                isCurrentlySaved
                  ? app.savedBy.filter(
                      (uid: string) =>
                        uid !== currentUserId
                    )
                  : [
                      ...(app.savedBy || []),
                      currentUserId,
                    ];

              return {
                ...app,
                savedBy: newSavedBy,
              };
            }

            return app;
          })
        );

        toast.success("Updated!");
      }

    } catch (error) {
      toast.error(
        "Error toggling save"
      );
    }
  };



  const calculateTotalExperience = (
    expArray: any[],
    isFresher: boolean
  ) => {

    if (
      isFresher ||
      !expArray ||
      expArray.length === 0
    ) {
      return "Fresher";
    }

    let totalMonths = 0;

    expArray.forEach((exp) => {
      const start = new Date(exp.startDate);

      const end = exp.isCurrentJob
        ? new Date()
        : new Date(exp.endDate);

      if (
        !isNaN(start.getTime()) &&
        !isNaN(end.getTime())
      ) {
        const diff =
          (end.getFullYear() -
            start.getFullYear()) *
            12 +
          (end.getMonth() -
            start.getMonth());

        if (diff > 0)
          totalMonths += diff;
      }
    });

    const yrs = Math.floor(
      totalMonths / 12
    );

    return yrs > 0
      ? `Exp: ${yrs} Years`
      : `Exp: ${
          totalMonths % 12
        } Months`;
  };

  return (
    <main className="min-h-screen bg-[#e6e8e8] font-sans pb-20">
      <Toaster position="top-center" />

      <section className="px-0 pt-0 relative">
        <div className="bg-white rounded-b-[40px] pt-6 pb-12 px-6 flex flex-col items-center shadow-sm relative overflow-hidden">
          <div className="text-center mb-1 mt-0 relative z-10">
            <h1 className="font-bold text-[25px] text-[#5DBB63] leading-none">Hire Easy</h1>
            <h1 className="font-bold text-[25px] text-[#5DBB63] leading-tight">Get Hired Easy</h1>
            <h1 className="text-[18px] text-[#00004d]">Totally <span className="font-bold">FREE</span> for Job Seekers</h1>
          </div>
        </div>
        <div className="relative -mt-8 flex flex-col items-center px-6 z-30">
          <div ref={searchRef} className="relative w-full max-w-[340px] bg-[#00004d] rounded-[15px] shadow-lg flex items-center p-1">
            <div className="pl-4">
              <Search className="h-5 w-5 text-white" strokeWidth={3} />
            </div>
            <input 
              type="text"
              placeholder="Search by Name, Age, or Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent py-3 px-3 text-sm text-white font-bold outline-none placeholder:text-gray-400"
            />
            <div className="h-5 w-[1.5px] bg-white mx-2" />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="text-white font-black text-[15px] px-4 hover:opacity-70"
            >
              Go
            </button>
          </div>
          {showFilters && (
            <div className="w-full max-w-[340px] bg-white mt-3 rounded-2xl shadow-xl p-4 border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[#00004d] font-black text-sm flex items-center gap-2"><Filter size={16} /> Filters & Sorting</h3>
                <X size={20} className="text-gray-400 cursor-pointer" onClick={() => setShowFilters(false)} />
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                {["employees", "jobs"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSearchMode(mode as any)}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-md capitalize transition-all ${searchMode === mode ? 'bg-[#00004d] text-white' : 'text-gray-500'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#00004d] outline-none bg-gray-50">
                  <option value="">All Cities</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#00004d] outline-none bg-gray-50">
                  <option value="">All Categories</option>
                  {JOB_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>

                <select value={selectedEducation} onChange={(e) => setSelectedEducation(e.target.value)} className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#00004d] outline-none bg-gray-50">
                  <option value="">All Education Levels</option>
                  {EDUCATION_OPTIONS.map(edu => <option key={edu} value={edu}>{edu}</option>)}
                </select>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Sort By</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'name', label: 'Name A-Z' },
                      { id: 'age', label: 'Age' },
                      { id: 'fav', label: 'My Favourites' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setSortBy(sortBy === btn.id ? 'none' : btn.id as any)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${sortBy === btn.id ? 'bg-[#5DBB63] border-[#5DBB63] text-white' : 'bg-white text-[#00004d] border-gray-200'}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {setSelectedCity(""); setSelectedCategory(""); setSelectedEducation(""); setSortBy("none"); setSearchQuery("");}}
                className="w-full mt-4 text-[10px] font-bold text-red-500 text-center"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="max-w-2xl mx-auto px-14 mt-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full justify-items-center">
          {quickActions.map((action, i) => (
            <button key={i} onClick={() => router.push(action.href)} className={`w-full max-w-[145px] transition-all duration-300 active:scale-95 ${action.label === "Post a Job" ? "animate-pulse" : "hover"}`}>
              <div className={`flex flex-col items-center justify-center aspect-square rounded-2xl p-4 border ${action.label === "Post a Job" ? "bg-[#5DBB63] border-[#5DBB63]" : "bg-white shadow-md border-gray-50"}`}>
                <div className={action.label === "Post a Job" ? "animate-bounce" : ""}>{action.icon}</div>
                <span className={`font-black text-center leading-tight ${action.label === "Post a Job" ? "text-white text-[17px]" : "text-[#00004d] text-[15px]"}`}>{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
      <section className="max-w-2xl mx-auto px-6 mt-4 relative z-10">
        <section className="max-w-[360px] mx-auto mt-4 mb-4 relative z-10">
          <div className="bg-[#00004d] text-[#5DBB63] rounded-2xl flex flex-col items-center justify-center h-16 shadow-sm">
            <span className="text-[18px] font-black leading-none mt-3">
              {searchMode === "employees" ? "I am seeking for a job" : "I am offering a job"}
            </span>
            <div className="flex flex-col items-center mt-2 -space-y-3 animate-bounce">
              <ChevronDown size={20} strokeWidth={4} />
              <ChevronDown size={20} strokeWidth={4} className="opacity-40" />
            </div>
          </div>
        </section>

        <section className="max-w-[360px] mx-auto mt-1 mb-1">
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00004d]" /></div>
            ) : filteredAndSortedData.length > 0 ? (
              <>
                {filteredAndSortedData.slice(0, 25).map((app, idx) => {
                  const isSaved = currentUserId && app.savedBy?.includes(currentUserId);
                  return (
                    <div key={idx} onClick={() => router.push(`/applicants/${app._id}`)} className="bg-white border border-gray-100 rounded-[15px] flex items-stretch shadow-md min-h-[50px] cursor-pointer overflow-hidden transition-transform active:scale-95">
                      <div className={`relative w-24 shrink-0 overflow-hidden flex items-center justify-center ${app.image === "male" ? "bg-[#00004d]" : app.image === "female" ? "bg-[#5DBB63]" : "bg-gray-100"}`}>
                        {app.image === "male" ? (
                          <Image src={MALE_ICON} alt="M" width={52} height={52} className="object-contain" style={whiteFilter} unoptimized />
                        ) : app.image === "female" ? (
                          <Image src={FEMALE_ICON} alt="F" width={52} height={52} className="object-contain" style={whiteFilter} unoptimized />
                        ) : app.image && app.image.length > 20 ? (
                          <Image src={app.image} alt="U" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="bg-[#00004d] h-full w-full flex items-center justify-center"><User size={24} strokeWidth={2.5} className="text-white" /></div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 p-2 justify-between min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2 min-w-0">
                            <h2 className="text-[13px] font-black text-[#00004d] truncate">{app.fullName}</h2>
                            <span className="text-[9px] font-bold text-[#00004d] bg-gray-100 px-1.5 py-[2px] rounded-md">Age {calculateAge(app.dob)}</span>
                          </div>
                          <Heart size={16} className={`shrink-0 transition-all duration-300 ${isSaved ? "text-[#00004d] fill-[#00004d]" : "text-[#00004d]"}`} onClick={(e) => handleToggleSave(e, app._id)} />
                        </div>
                        <div className="space-y-0 text-[10px] font-bold text-[#00004d] opacity-90">
                          <p className="truncate">Profession: {app.category || "Consultant"}</p>
                          <p className="truncate">Edu. {app.education || "N/A"}</p>
                          <p>{calculateTotalExperience(app.experience, app.isFresher)}</p>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="flex items-center gap-0.5 text-[#5DBB63]">
                            <IoIosPin size={12} /><span className="font-bold text-[10px]">{app.city}</span>
                          </div>
                          <span className="text-[#5DBB63] font-black text-[10px] flex items-center">Visit profile <LuChevronsRight size={14} strokeWidth={3} /></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-center mt-4 mb-5">
                  <button onClick={() => router.push("/applicants")} className="bg-[#5DBB63] font-bold text-white px-8 py-3 rounded-[12px] text-[14px] flex items-center gap-2 shadow-xl active:scale-95 transition-all">
                    Explore More Applicants <LuChevronsRight size={24} strokeWidth={3} className="animate-[moveRight_1s_ease-in-out_infinite]" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400 font-bold py-10">No results found matching your criteria.</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}