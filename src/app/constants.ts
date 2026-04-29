// Professional Icons
export const MALE_ICON = "https://uxwing.com/wp-content/themes/uxwing/download/business-professional-services/male-employee-icon.png";
export const FEMALE_ICON = "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/female-user-icon.png";

// Dropdown Options
export const CITIES = ["Karachi", "Lahore", "RWP/ISB", "Peshawar", "Quetta", "Multan", "Faisalabad"];
export const JOB_TYPES = ["Full-Time", "Part-Time", "One-Day Task", "Remote-Job", "Home-Based", "Contract-Based"];

export const JOB_CATEGORIES = [
  "House Maid", "Full Time Maid", "Part Time Maid", "Live-in Maid", "Nanny", "Child Caretaker", "Elderly Caretaker", "Patient Care Attendant", "Home Nurse", "Cook", "Home Chef", "Assistant Cook", "Car Driver", "Truck Driver", "Bus Driver", "Personal Driver", "House Driver", "Office Driver", "Gardener", "Mali", "Security Guard", "Home Security Guard", "Gate Keeper", "Watchman", "Cleaner", "House Cleaner", "Office Cleaner", "Janitor", "Laundry Worker", "Ironing Man (Press Wala)", "Dish Washer", "Kitchen Helper", "Peon", "Office Boy", "House Boy", "Care Taker (General)", "Building Caretaker", "Helper", "General Helper", "Delivery Rider", "Courier Boy", "Receptionist", "Customer Care Taker", "Tractor Driver", "Beautition", "Barber", "Salesman", "Mid-Wife", "LHV", "Lab Technicain", "OTA", "Physiotherapist", "Nutritionist", "Coach", "Waiter", "Trainer", "Pilot", "Mobile Technician", "TV Technician", "Laptop Technician", "Motorcycle Mechanic", "Car Mechanic", "Car Painter", "Plumber", "Carpentar", "Phone Operator", "Air-Hostess", "Steward", "Translator", "Typist", "Administrator", "Office Manager", "Executive Assistant", "Operations Manager", "Farmer", "Livestock Farmer", "Agricultural Engineer", "Agronomist", "Graphic Designer", "Painter", "Illustrator", "Fashion Designer", "Animator", "Mechanical Engineer", "Auto Mechanic", "Technician", "Vehicle Inspector", "Accountant", "Banker", "Auditor", "Financial Analyst", "Business Analyst", "Business Development Manager", "Consultant", "Strategy Consultant", "Project Manager", "Customer Support Executive", "Call Center Agent", "Client Relationship Manager", "Civil Engineer", "Structural Engineer", "Site Supervisor", "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI Researcher", "SEO Specialist", "Content Creator", "Social Media Manager", "Digital Marketer", "Teacher", "Lecturer", "Tutor", "Researcher", "E-commerce Manager", "Online Store Owner", "Marketplace Seller", "Electrical Engineer", "Electronics Technician", "Automation Engineer", "Doctor", "Nurse", "Pharmacist", "Surgeon", "HR Manager", "Recruiter", "HR Assistant", "Talent Acquisition Specialist", "Software Developer", "IT Support", "System Administrator", "Network Engineer", "Web Developer", "Frontend Developer", "Backend Developer", "Fullstack Developer", "Lawyer", "Judge", "Police Officer", "Paralegal", "Logistics Manager", "Warehouse Manager", "Supply Chain Analyst", "Sales Executive", "Brand Manager", "Actor", "Musician", "Photographer", "Director", "Biotech Researcher", "Clinical Researcher", "Program Manager", "Project Coordinator", "Biologist", "Chemist", "Physicist", "Investigator", "Social Worker", "NGO Coordinator", "Field Officer", "Telecom Engineer", "Network Technician", "Technical Support", "Travel Agent", "Tour Guide", "Visa Officer", "Ticketing Officer", "Veterinarian", "Animal Caretaker", "Pet Groomer", "Freelancer", "Content Writer", "Online Consultant", "Other"
].sort((a, b) => a.localeCompare(b));

// Education Structure
export const EDUCATION_GROUPS = [
  {
    label: "School Education",
    options: ["Primary", "Middle", "Matric (SSC)", "O Levels", "Intermediate (HSSC)", "A Levels"]
  },
  {
    label: "Diplomas & Certificates",
    options: ["DAE (Diploma of Associate Engineering)", "DIT (Diploma in Information Technology)", "Nursing Diploma", "Paramedical Diplomas", "Vocational / Technical Diplomas", "Hospitality & Hotel Management Diploma", "Fashion Designing Diploma", "Interior Designing Diploma", "Graphic Designing Diploma", "Other Diplomas (Field-based)", "Certificate Courses (Short Courses)"]
  },
  {
    label: "Associate Degrees",
    options: ["ADP (Associate Degree Program)", "ADS (Associate Degree in Science)", "ADA (Associate Degree in Arts)", "ADC (Associate Degree in Commerce)", "ADIT (Associate Degree in IT)"]
  },
  {
    label: "Bachelor (Undergraduate Degrees)",
    subGroups: [
      { title: "General & Arts", options: ["BA", "BSc", "B.Com", "BBA", "B.Ed", "BFA", "BS English", "BS Urdu", "BS Islamic Studies", "BS Pakistan Studies"] },
      { title: "Computer & IT", options: ["BS Computer Science (BSCS)", "BS Information Technology (BSIT)", "BS Software Engineering", "BS Data Science", "BS Artificial Intelligence", "BS Cyber Security"] },
      { title: "Engineering", options: ["BE / BSc Engineering", "Civil Engineering", "Electrical Engineering", "Mechanical Engineering", "Chemical Engineering", "Mechatronics Engineering", "Petroleum Engineering", "Industrial Engineering", "Software Engineering"] },
      { title: "Medical & Health Sciences", options: ["MBBS", "BDS", "DPT (Doctor of Physical Therapy)", "Pharm-D (Doctor of Pharmacy)", "BS Nursing", "BS Medical Lab Technology (MLT)", "BS Radiology / Imaging Technology", "BS Optometry", "BS Public Health", "BS Physiotherapy"] },
      { title: "Business & Social Sciences", options: ["BS Accounting & Finance", "BS Economics", "BS Marketing", "BS Human Resource Management", "BS Mass Communication", "BS Media Studies", "BS Psychology", "BS Sociology", "BS Political Science", "BS International Relations"] },
      { title: "Other Fields", options: ["BS Agriculture", "BS Environmental Sciences", "BS Forestry", "BS Biotechnology", "BS Architecture", "BS Interior Design", "BS Fashion Design"] }
    ]
  },
  {
    label: "Master’s Degrees",
    options: ["MA", "MSc", "M.Com", "MBA", "M.Ed", "LLM", "MS Computer Science", "MS Information Technology", "MS Software Engineering", "MS Data Science", "MS Artificial Intelligence", "MS Cyber Security", "MS Civil Engineering", "MS Electrical Engineering", "MS Mechanical Engineering", "MS Chemical Engineering", "MS Mechatronics Engineering", "MS Nursing", "MS Clinical Psychology", "MPH (Master of Public Health)"]
  },
  {
    label: "Research Degrees",
    options: ["MPhil", "PhD (Doctor of Philosophy)"]
  },
  {
    label: "Professional Medical Qualifications",
    options: ["MD", "MS (Surgery)", "MDS (Dentistry Specialization)", "FCPS", "MRCP", "MRCS", "FRCS"]
  },
  {
    label: "Options",
    options: ["Other"]
  }
];

// policyContent.ts

export interface PolicyItem {
    id: number;
    titleEn: string;
    descEn: string;
    titleUr: string;
    descUr: string;
}

export const policyData: PolicyItem[] = [
    {
        id: 1,
        titleEn: "Data Visibility",
        descEn: "The candidate agrees that their profile information (excluding sensitive contact details) may be publicly displayed on the job portal for employers.",
        titleUr: "ڈیٹا کی نمائش",
        descUr: "امیدوار اس بات سے متفق ہے کہ اس کی پروفائل کی معلومات (سوائے حساس رابطہ معلومات کے) جاب پورٹل پر آجران کے لیے ظاہر کی جا سکتی ہیں۔"
    },
    {
        id: 2,
        titleEn: "Contact Information Protection",
        descEn: "The candidate’s personal contact details (phone number, email, address) will remain confidential and will not be publicly displayed.",
        titleUr: "رابطہ کی معلومات کا تحفظ",
        descUr: "امیدوار کی ذاتی رابطہ معلومات (فون نمبر، ای میل، پتہ) مکمل طور پر خفیہ رکھی جائیں گی اور عوامی طور پر ظاہر نہیں کی جائیں گی۔"
    },
    {
        id: 3,
        titleEn: "Profile Photo Usage",
        descEn: "If the candidate uploads a profile picture, they consent to its public display.",
        titleUr: "پروفائل تصویر کا استعمال",
        descUr: "اگر امیدوار اپنی تصویر اپلوڈ کرتا ہے تو وہ اس کے عوامی طور پر ظاہر ہونے پر رضامند ہے۔"
    },
    {
        id: 4,
        titleEn: "Accuracy of Information",
        descEn: "The candidate confirms that all provided information is accurate and up to date.",
        titleUr: "معلومات کی درستگی",
        descUr: "امیدوار تصدیق کرتا ہے کہ فراہم کردہ تمام معلومات درست اور تازہ ترین ہیں۔"
    },
    {
        id: 5,
        titleEn: "Data Usage for Recruitment",
        descEn: "The candidate allows the platform to share their profile with potential employers for recruitment purposes.",
        titleUr: "بھرتی کے لیے ڈیٹا کا استعمال",
        descUr: "امیدوار اس بات کی اجازت دیتا ہے کہ اس کی پروفائل ممکنہ آجران کے ساتھ بھرتی کے مقصد کے لیے شیئر کی جا سکتی ہے۔"
    },
    {
        id: 6,
        titleEn: "Consent to Communication",
        descEn: "The candidate agrees to receive calls, messages, or emails regarding job opportunities.",
        titleUr: "رابطے کے لیے رضامندی",
        descUr: "امیدوار اس بات سے متفق ہے کہ اسے ملازمت کے مواقع کے حوالے سے کالز، پیغامات یا ای میلز موصول ہو سکتی ہیں۔"
    },
    {
        id: 7,
        titleEn: "Right to Remove Profile",
        descEn: "The candidate has the right to request removal or modification of their data at any time.",
        titleUr: "پروفائل حذف کرنے کا حق",
        descUr: "امیدوار کو یہ حق حاصل ہے کہ وہ کسی بھی وقت اپنی معلومات کو حذف یا ترمیم کرنے کی درخواست دے سکتا ہے۔"
    },
    {
        id: 8,
        titleEn: "Misuse Policy",
        descEn: "Any misuse, false information, or fraudulent activity may result in profile suspension or permanent removal.",
        titleUr: "غلط استعمال کی پالیسی",
        descUr: "غلط معلومات یا کسی بھی قسم کے غلط استعمال کی صورت میں پروفائل کو معطل یا مستقل طور پر ختم کیا جا سکتا ہے۔"
    }
];

export const consentText = {
    en: "I have read and agree to the Privacy Policy & Terms",
    ur: "میں نے پرائیویسی پالیسی اور شرائط کو پڑھ لیا ہے اور ان سے متفق ہوں"
};