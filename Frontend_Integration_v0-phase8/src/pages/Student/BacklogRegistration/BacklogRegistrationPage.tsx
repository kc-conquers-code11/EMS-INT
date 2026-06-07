import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ChevronDown, 
  Check, 
  Minus, 
  X, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  HelpCircle,
  Printer
} from "lucide-react";
import { backlogRegistrationSchema, type BacklogRegistrationFormValues } from '../../../schemas/Student/examRegistrationSchema';
import type { SubjectData } from '../../../types/COE/subject';

// Mock subjects data matching schema
const SUBJECTS_DATA: SubjectData[] = [
  { id: 1, scheme_id: "1", name: "Web Technologies", code: "CSC1067", type: "PR", semester: "5", credits: "3", max_theory: "0", max_practical: "50", max_oral: "0", max_tw: "0", min_pass_theory: "0", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 2, scheme_id: "1", name: "Computer Networks", code: "CSC1038", type: "TH", semester: "5", credits: "4", max_theory: "100", max_practical: "50", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 3, scheme_id: "1", name: "Database Management System", code: "CSC1042", type: "TH", semester: "4", credits: "4", max_theory: "100", max_practical: "50", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 4, scheme_id: "1", name: "Operating Systems & Internals", code: "CSC1045", type: "TH", semester: "4", credits: "4", max_theory: "100", max_practical: "50", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 5, scheme_id: "1", name: "Data Structures & Lab", code: "CSC1033", type: "PR", semester: "3", credits: "3", max_theory: "0", max_practical: "50", max_oral: "0", max_tw: "0", min_pass_theory: "0", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
];

const UNCLEARED_SUBJECTS = SUBJECTS_DATA;

// Mock student profile information for auto-fetching
interface StudentProfile {
  sid: string;
  name: string;
  branch: string;
  semester: string;
  category: string;
  phone: string;
  email: string;
}

const MOCK_STUDENTS: Record<string, StudentProfile> = {
  "vu4s2425001": {
    sid: "vu4s2425001",
    name: "XYZ",
    branch: "Information technology",
    semester: "VI",
    category: "OBC",
    phone: "1234567892",
    email: "XYZ@gmail.com"
  },
  "vu4s2324030": {
    sid: "vu4s2324030",
    name: "XYZXYZ",
    branch: "Computer Engineering",
    semester: "IV",
    category: "General",
    phone: "9089786790",
    email: "vu4s2324030@gmail.com"
  }
};

const DEFAULT_PROFILE: StudentProfile = {
  sid: "vu4s2425001",
  name: "XYZ",
  branch: "Information technology",
  semester: "VI",
  category: "OBC",
  phone: "1234567892",
  email: "XYZ@gmail.com"
};

export default function BacklogRegistrationPage() {
  const [step, setStep] = useState<"form" | "verify" | "success">("form");

  // Selection states
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [examEvent, setExamEvent] = useState<number>(1);
  const [regType, setRegType] = useState<string>("Backlog only");
  
  // Dropdown open states
  const [regTypeOpen, setRegTypeOpen] = useState(false);
  const [subjectsOpen, setSubjectsOpen] = useState(false);
  const [examEventOpen, setExamEventOpen] = useState(false);

  // Active student profile details
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DEFAULT_PROFILE);

  // OTP Popup Verification state
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [txnId, setTxnId] = useState("");

  const examEvents = [
    { id: 1, name: "Summer 2026 Regular Exam" },
    { id: 2, name: "Winter 2026 Regular Exam" },
    { id: 3, name: "Summer 2026 Backlog Exam" },
    { id: 4, name: "Winter 2026 Backlog Exam" },
  ];

  const toggleSubject = (id: number) => {
    setSelectedSubjects((prev) => {
      const updated = prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id];
      setValue("selected_subjects", updated, { shouldValidate: true });
      return updated;
    });
  };

  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BacklogRegistrationFormValues>({
    resolver: zodResolver(backlogRegistrationSchema),
    defaultValues: {
      sid: "vu4s2425001",
      event_id: 1,
      selected_subjects: [],
      total_fee: 0,
      payment_status: "Pending",
    },
  });

  const watchSid = watch("sid");

  // Auto-fetch profile details when Student ID changes
  useEffect(() => {
    if (!watchSid) return;
    const lowerSid = watchSid.trim().toLowerCase();
    if (MOCK_STUDENTS[lowerSid]) {
      setStudentProfile(MOCK_STUDENTS[lowerSid]);
    } else {
      // Create dynamic fallback or trigger validation warning
      setStudentProfile({
        sid: watchSid,
        name: "Test Profile",
        branch: "General",
        semester: "VI",
        category: "General",
        phone: "9999999999",
        email: `${watchSid}@gmail.com`
      });
    }
  }, [watchSid]);

  // Calculate prices dynamically
  const subjectCost = 500;
  const totalBacklogFee = selectedSubjects.length * subjectCost;

  useEffect(() => {
    setValue("total_fee", totalBacklogFee);
  }, [totalBacklogFee, setValue]);

  // Check custom validations on submit
  const handleProceedClick = async () => {
    const isFormValid = await trigger();
    if (!isFormValid) return;

    setStep("verify");
  };

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const triggerPaymentSuccess = () => {
    setTxnId(`TXN${Math.floor(100000000 + Math.random() * 900000000)}`);
    setOtpModalOpen(false);
    setStep("success");
  };

  const handleVerifyOtp = () => {
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter the complete 6-digit OTP code.");
      return;
    }
    triggerPaymentSuccess();
  };

  const resetFormState = () => {
    setSelectedSubjects([]);
    setValue("selected_subjects", []);
    setStep("form");
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };

  const activeEventName = examEvents.find(e => e.id === examEvent)?.name || "Summer 2026 Regular Exam";

  return (
    <div className="flex flex-col w-full pb-20 font-['Instrument_Sans',sans-serif] bg-[#fcfcfd]">
      


      {/* Breadcrumbs Banner */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <ArrowRight size={24} className="text-[#0e1680] shrink-0" />
        <h1 className="text-[26px] font-extrabold text-[#0e1680] tracking-tight">
          {step === "form" ? "Backlog Exam Registration Form" : "Exam Registration Form"}
        </h1>
      </div>

      {/* STEP 1: Registration Form State */}
      {step === "form" && (
        <form onSubmit={(e) => { e.preventDefault(); handleProceedClick(); }} className="flex flex-col gap-8 w-full max-w-[1053px] mx-2">
          
          {/* Main Form Fields Container */}
          <div className="bg-white p-10 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 flex flex-col gap-6">
            
            {/* Student ID Field with Inline Validation Warning */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[14px] font-semibold text-[#344054]">Enter student ID</label>
              </div>
              <div className="relative">
                <input
                  {...register("sid")}
                  placeholder="vu4s2425001"
                  className={`w-full border ${
                    errors.sid ? 'border-red-500 focus:ring-red-200' : 'border-[#d0d5dd] focus:ring-[#0e1680]/20'
                  } rounded-[8px] px-[14px] py-[10px] bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] text-black placeholder:text-[#98a2b3] text-[16px] leading-[24px] focus:outline-none focus:ring-2`}
                />
              </div>
              {errors.sid && (
                <p className="text-red-500 text-[12px] flex items-center gap-1 font-semibold mt-1">
                  <AlertCircle size={14} />
                  {errors.sid.message}
                </p>
              )}
            </div>

            {/* Branch & Semester Grid Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#344054]">Branch</label>
                <input
                  type="text"
                  readOnly
                  value={studentProfile.branch}
                  className="border border-[#eaecf0] rounded-[8px] px-[14px] py-[10px] bg-gray-50/70 text-[#475467] text-[16px] leading-[24px] focus:outline-none font-medium cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#344054]">Semester</label>
                <input
                  type="text"
                  readOnly
                  value={studentProfile.semester}
                  className="border border-[#eaecf0] rounded-[8px] px-[14px] py-[10px] bg-gray-50/70 text-[#475467] text-[16px] leading-[24px] focus:outline-none font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* Registration Type Dropdown */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[14px] font-semibold text-[#344054]">Registration Type</label>
              <div className="relative">
                <div
                  onClick={() => setRegTypeOpen(!regTypeOpen)}
                  className="flex items-center justify-between border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white shadow-sm cursor-pointer hover:bg-gray-50/70"
                >
                  <span className="text-[#344054] font-medium text-[16px]">{regType}</span>
                  <ChevronDown className={`w-5 h-5 text-[#667085] transition-transform ${regTypeOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {regTypeOpen && (
                  <div className="absolute top-[48px] left-0 right-0 z-30 bg-white border border-[#d0d5dd] rounded-lg shadow-lg overflow-hidden mt-1">
                    <div
                      onClick={() => { setRegType("Backlog only"); setRegTypeOpen(false); }}
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-[#344054]">Backlog only</span>
                      <div className={`w-5 h-5 border rounded-[6px] flex items-center justify-center shrink-0 transition-colors ${regType === "Backlog only" ? 'border-[#0e1680] bg-[#e5e7fb]' : 'border-[#d0d5dd] bg-white'}`}>
                        {regType === "Backlog only" && <Check className="w-3.5 h-3.5 text-[#0e1680]" strokeWidth={3} />}
                      </div>
                    </div>
                    <div
                      onClick={() => { setRegType("Backlog along with regular"); setRegTypeOpen(false); }}
                      className="flex items-center justify-between px-4 py-3 border-t border-gray-100 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-[#344054]">Backlog along with regular</span>
                      <div className={`w-5 h-5 border rounded-[6px] flex items-center justify-center shrink-0 transition-colors ${regType === "Backlog along with regular" ? 'border-[#0e1680] bg-[#e5e7fb]' : 'border-[#d0d5dd] bg-white'}`}>
                        {regType === "Backlog along with regular" && <Check className="w-3.5 h-3.5 text-[#0e1680]" strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Uncleared Subjects Dropdown (with checkmarks) */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[14px] font-semibold text-[#344054]">Uncleared Subjects</label>
              <div className="relative">
                <div
                  onClick={() => setSubjectsOpen(!subjectsOpen)}
                  className={`flex items-center justify-between border ${
                    errors.selected_subjects ? 'border-red-500' : 'border-[#d0d5dd]'
                  } rounded-[8px] px-[14px] py-[10px] bg-white shadow-sm cursor-pointer hover:bg-gray-50/70`}
                >
                  <span className={`text-[16px] font-medium ${selectedSubjects.length > 0 ? 'text-[#344054]' : 'text-[#98a2b3]'}`}>
                    {selectedSubjects.length > 0 
                      ? `${selectedSubjects.length} subject(s) selected` 
                      : 'Select Uncleared Subjects...'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[#667085] transition-transform ${subjectsOpen ? 'rotate-180' : ''}`} />
                </div>

                {subjectsOpen && (
                  <div className="absolute top-[48px] left-0 right-0 z-30 bg-white border border-[#d0d5dd] rounded-lg shadow-lg overflow-hidden mt-1 max-h-[220px] overflow-y-auto">
                    {UNCLEARED_SUBJECTS.map((sub) => (
                      <div 
                        key={sub.id}
                        onClick={() => toggleSubject(sub.id!)}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 border-t border-gray-100 first:border-t-0 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-[#344054]">{sub.name}</span>
                          <span className="text-xs text-[#667085]">{sub.code} ({sub.semester} Semester)</span>
                        </div>
                        <div className={`w-5 h-5 border rounded-[6px] flex items-center justify-center shrink-0 transition-colors ${selectedSubjects.includes(sub.id!) ? 'border-[#0e1680] bg-[#e5e7fb]' : 'border-[#d0d5dd] bg-white'}`}>
                          {selectedSubjects.includes(sub.id!) && <Check className="w-3.5 h-3.5 text-[#0e1680]" strokeWidth={3} />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.selected_subjects && (
                <p className="text-red-500 text-[12px] flex items-center gap-1 font-semibold mt-1">
                  <AlertCircle size={14} />
                  {errors.selected_subjects.message}
                </p>
              )}
            </div>

            {/* Exam Event Selection Dropdown */}
            <div className="flex flex-col gap-1.5 relative">
              <label className="text-[14px] font-semibold text-[#344054]">Exam Event Selection</label>
              <div className="relative">
                <div
                  onClick={() => setExamEventOpen(!examEventOpen)}
                  className="flex items-center justify-between border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] bg-white shadow-sm cursor-pointer hover:bg-gray-50/70"
                >
                  <span className="text-[#344054] font-medium text-[16px]">
                    {examEvents.find(e => e.id === examEvent)?.name || 'Select Exam Event...'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-[#667085] transition-transform ${examEventOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {examEventOpen && (
                  <div className="absolute top-[48px] left-0 right-0 z-30 bg-white border border-[#d0d5dd] rounded-lg shadow-lg overflow-hidden mt-1">
                    {examEvents.map((evt) => (
                      <div 
                        key={evt.id}
                        onClick={() => { setExamEvent(evt.id); setValue("event_id", evt.id, { shouldValidate: true }); setExamEventOpen(false); }}
                        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 border-t border-gray-100 first:border-t-0 transition-colors"
                      >
                        <span className="text-sm font-medium text-[#344054]">{evt.name}</span>
                        <div className={`w-4 h-4 border rounded-full flex items-center justify-center shrink-0 relative transition-colors ${examEvent === evt.id ? 'border-[#0e1680] bg-[#e5e7fb]' : 'border-[#d0d5dd] bg-white'}`}>
                          {examEvent === evt.id && <div className="w-[8px] h-[8px] bg-[#0e1680] rounded-full"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-[13px] text-[#667085] flex items-center gap-1 font-medium mt-1">
              <HelpCircle size={14} className="text-[#0e1680]" />
              Maximum Allowed Subjects = 10
            </div>

          </div>

          {/* BACKLOG FEES SUMMARY */}
          <div className="bg-white p-6 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 flex flex-col gap-4">
            <div className="flex justify-between items-center text-[16px] text-[#101828] font-extrabold mt-2 px-2">
              <span>Total Backlog Fee:</span>
              <span className="text-[20px] text-[#0e1680]">₹{totalBacklogFee}</span>
            </div>
          </div>

          {/* Form Actions Footer Row */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={selectedSubjects.length === 0}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-[8px] font-bold text-[16px] transition-all shadow-sm ${
                selectedSubjects.length > 0 
                  ? 'bg-[#0e1680] text-white hover:bg-[#0a1060] cursor-pointer' 
                  : 'bg-[#d0d5dd] text-[#98a2b3] cursor-not-allowed'
              }`}
            >
              Proceed to Payment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Review / Verification State */}
      {step === "verify" && (
        <div className="flex flex-col gap-6 w-full max-w-[1053px] mx-2 animate-in fade-in duration-300">
          
          {/* Information Detail Card */}
          <div className="bg-white p-10 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 flex flex-col gap-5">
            <h2 className="text-[18px] font-bold text-[#101828] border-b border-[#f2f4f7] pb-3 mb-2">Student Verification Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex justify-between items-center border-b border-[#f9fafb] pb-2">
                <span className="text-[14px] font-semibold text-[#667085]">Student Name:</span>
                <span className="text-[15px] font-bold text-[#101828]">{studentProfile.name}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-[#f9fafb] pb-2">
                <span className="text-[14px] font-semibold text-[#667085]">Student ID:</span>
                <span className="text-[15px] font-bold text-[#101828]">{studentProfile.sid}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[#f9fafb] pb-2">
                <span className="text-[14px] font-semibold text-[#667085]">Branch/Stream:</span>
                <span className="text-[15px] font-bold text-[#101828]">{studentProfile.branch}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[#f9fafb] pb-2">
                <span className="text-[14px] font-semibold text-[#667085]">Semester:</span>
                <span className="text-[15px] font-bold text-[#101828]">{studentProfile.semester}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[#f9fafb] pb-2">
                <span className="text-[14px] font-semibold text-[#667085]">Category:</span>
                <span className="text-[15px] font-bold text-[#101828]">{studentProfile.category}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[#f9fafb] pb-2">
                <span className="text-[14px] font-semibold text-[#667085]">Phone no.:</span>
                <span className="text-[15px] font-bold text-[#101828]">{studentProfile.phone}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[#f9fafb] pb-2 md:col-span-2">
                <span className="text-[14px] font-semibold text-[#667085]">Selected Exam Event:</span>
                <span className="text-[15px] font-bold text-[#0e1680]">{activeEventName}</span>
              </div>
            </div>
          </div>

          {/* Selected Courses Component Checkbox Table */}
          <div className="bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-[#eaecf0] overflow-hidden flex flex-col">
            <div className="px-8 py-5 border-b border-[#eaecf0] bg-[#f9fafb]">
              <h3 className="text-[16px] font-bold text-[#101828]">Selected Courses</h3>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
                <tr>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider w-full">Courses</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider text-center w-[75px]">TH</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider text-center w-[75px]">PR</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider text-center w-[75px]">OR</th>
                  <th className="px-6 py-4 text-[12px] font-bold text-[#667085] uppercase tracking-wider text-center w-[90px] border-l border-[#eaecf0]">TW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaecf0]">
                {selectedSubjects.map((subId) => {
                  const subject = UNCLEARED_SUBJECTS.find(s => s.id === subId);
                  if (!subject) return null;
                  
                  // Map course configurations
                  const hasTh = subject.max_theory !== "0";
                  const hasPr = subject.max_practical !== "0";
                  const hasOr = subject.max_oral !== "0";
                  const hasTw = subject.max_tw !== "0";

                  return (
                    <tr key={subId} className="h-[72px] hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-[15px] font-medium">
                        <div className="text-[16px] font-bold text-[#101828] leading-[24px]">{subject.name}</div>
                        <div className="text-[13px] text-[#475467] font-semibold">{subject.code}</div>
                      </td>
                      <td className="px-6 py-4 text-[15px] font-medium text-center">
                        <div className="flex justify-center">
                          {hasTh ? (
                            <div className="w-5 h-5 border border-[#0e1680] rounded-[6px] bg-[#e5e7fb] flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-[#0e1680]" strokeWidth={3} />
                            </div>
                          ) : (
                            <Minus className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-medium text-center">
                        <div className="flex justify-center">
                          {hasPr ? (
                            <div className="w-5 h-5 border border-[#0e1680] rounded-[6px] bg-[#e5e7fb] flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-[#0e1680]" strokeWidth={3} />
                            </div>
                          ) : (
                            <Minus className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-medium text-center">
                        <div className="flex justify-center">
                          {hasOr ? (
                            <div className="w-5 h-5 border border-[#0e1680] rounded-[6px] bg-[#e5e7fb] flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-[#0e1680]" strokeWidth={3} />
                            </div>
                          ) : (
                            <Minus className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-medium text-center border-l border-[#eaecf0]">
                        <div className="flex justify-center">
                          {hasTw ? (
                            <div className="w-5 h-5 border border-[#0e1680] rounded-[6px] bg-[#e5e7fb] flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-[#0e1680]" strokeWidth={3} />
                            </div>
                          ) : (
                            <Minus className="w-4 h-4 text-gray-300" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setStep("form")}
              className="px-6 py-3 border border-[#d0d5dd] text-[#344054] rounded-[8px] font-semibold text-[15px] hover:bg-[#f9fafb] transition-all shadow-sm cursor-pointer"
            >
              Back to Edit
            </button>

            <button
              onClick={() => setOtpModalOpen(true)}
              className="px-8 py-3.5 bg-[#0e1680] text-white rounded-[8px] font-bold text-[16px] hover:bg-[#0a1060] transition-all shadow-md cursor-pointer"
            >
              Pay Backlog Fee (₹{totalBacklogFee})
            </button>
          </div>

        </div>
      )}

      {/* Verify OTP Popup Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[560px] flex flex-col p-8 animate-in zoom-in-95 duration-200 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[22px] font-extrabold text-[#101828]">
                Verify Registration
              </h2>
              <button
                onClick={() => { setOtpModalOpen(false); setOtpError(""); setOtp(["", "", "", "", "", ""]); }}
                className="text-[#98a2b3] hover:text-[#475467] font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[#344054] text-[15px] mb-6 leading-relaxed">
              Please enter the 6-digit OTP code sent to your registered mobile number ending with 
              <span className="font-bold text-[#0e1680]"> ******{studentProfile.phone.slice(-4)}</span>.
            </p>

            <div className="flex justify-center gap-3.5 mb-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className={`w-[48px] h-[48px] text-center text-[22px] font-extrabold border ${
                    otpError ? 'border-red-400 ring-2 ring-red-400/10' : 'border-[#d0d5dd] focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680]'
                  } rounded-[8px] focus:outline-none transition-all`}
                />
              ))}
            </div>

            {otpError && (
              <p className="text-red-500 text-[13px] text-center mt-2 flex items-center justify-center gap-1 font-semibold">
                <AlertCircle size={14} /> {otpError}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => { setOtpModalOpen(false); setOtpError(""); setOtp(["", "", "", "", "", ""]); }}
                className="px-5 py-2.5 border border-[#d0d5dd] text-[#344054] rounded-[8px] font-semibold text-[14px] hover:bg-[#f9fafb] transition-all shadow-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={otp.join("").length !== 6}
                className={`px-6 py-2.5 rounded-[8px] font-bold text-[14px] transition-all shadow-sm ${
                  otp.join("").length === 6 
                    ? 'bg-[#0e1680] text-white hover:bg-[#0a1060] cursor-pointer' 
                    : 'bg-[#d0d5dd] text-[#98a2b3] cursor-not-allowed shadow-none'
                }`}
              >
                Verify & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Success View with Transaction Receipt Pop-up */}
      {step === "success" && (
        <div className="relative w-full max-w-[1053px] px-2 animate-in fade-in duration-500">
          
          {/* Base Layout in background as backdrop */}
          <div className="bg-white rounded-xl border border-[#eaecf0] shadow-sm p-6 filter blur-[2px] pointer-events-none opacity-50 flex flex-col gap-6">
            <h2 className="text-[18px] font-bold text-[#101828]">Student Verification Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>Student Name: {studentProfile.name}</div>
              <div>Student ID: {studentProfile.sid}</div>
              <div>Branch: {studentProfile.branch}</div>
              <div>Semester: {studentProfile.semester}</div>
            </div>
          </div>

          {/* Modal Popup Overlay */}
          <div className="fixed inset-0 bg-[#101828]/60 backdrop-blur-[6px] z-40 transition-opacity"></div>
          
          {/* High-Fidelity Transaction Receipt Modal Dialog */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-[24px] px-6 py-6 w-full max-w-[620px] z-50 flex flex-col shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#f2f4f7] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ecfdf3] border border-[#abefc6] flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-[#027a48]" strokeWidth={3} />
                </div>
                <h2 className="text-[20px] font-extrabold text-[#101828] tracking-tight">Payment Successful!!</h2>
              </div>
              <button 
                onClick={resetFormState} 
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 text-[#98a2b3] hover:text-[#475467]" />
              </button>
            </div>

            {/* Receipt Details Block */}
            <div className="bg-[#f9fafb] border border-[#eaecf0] rounded-xl p-5 flex flex-col gap-3.5 mb-6">
              
              <div className="flex justify-between items-center border-b border-white pb-2.5 last:border-b-0">
                <span className="text-[13px] font-bold text-[#667085] uppercase tracking-wider">Student Name:</span>
                <span className="text-[15px] font-extrabold text-[#101828]">{studentProfile.name}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-white pb-2.5 last:border-b-0">
                <span className="text-[13px] font-bold text-[#667085] uppercase tracking-wider">Student ID:</span>
                <span className="text-[15px] font-extrabold text-[#101828]">{studentProfile.sid}</span>
              </div>

              <div className="flex justify-between items-center border-b border-white pb-2.5 last:border-b-0">
                <span className="text-[13px] font-bold text-[#667085] uppercase tracking-wider">Email ID:</span>
                <span className="text-[15px] font-bold text-[#101828]">{studentProfile.email}</span>
              </div>

              <div className="flex justify-between items-center border-b border-white pb-2.5 last:border-b-0">
                <span className="text-[13px] font-bold text-[#667085] uppercase tracking-wider">Contact no:</span>
                <span className="text-[15px] font-bold text-[#101828]">{studentProfile.phone}</span>
              </div>

              <div className="flex justify-between items-center border-b border-white pb-2.5 last:border-b-0">
                <span className="text-[13px] font-bold text-[#667085] uppercase tracking-wider">Applicable Amount:</span>
                <span className="text-[16px] font-extrabold text-[#0e1680]">₹{totalBacklogFee}.00</span>
              </div>

              <div className="flex justify-between items-center border-b border-white pb-2.5 last:border-b-0">
                <span className="text-[13px] font-bold text-[#667085] uppercase tracking-wider">Transaction ID:</span>
                <span className="text-[15px] font-bold text-slate-700 tracking-wider font-mono">{txnId}</span>
              </div>

              <div className="flex justify-between items-center last:border-b-0">
                <span className="text-[13px] font-bold text-[#667085] uppercase tracking-wider">Date & Time:</span>
                <span className="text-[14px] font-medium text-slate-600">
                  {new Date().toISOString().slice(0, 10)} {new Date().toTimeString().slice(0, 8)}
                </span>
              </div>
            </div>

            {/* Receipt Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button 
                onClick={() => alert(`Receipt ${txnId}.pdf has been downloaded successfully!`)}
                className="w-full sm:w-auto px-6 py-3 bg-[#f2f3fd] border border-[#e5e7fb] text-[#0e1680] rounded-[8px] font-bold text-[14px] hover:bg-[#e5e7fb] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer size={16} />
                Download Receipt
              </button>

              <button 
                onClick={resetFormState}
                className="w-full sm:w-auto px-8 py-3 bg-[#0e1680] text-white rounded-[8px] font-bold text-[14px] hover:bg-[#0a1060] transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} />
                Verify Registration
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
