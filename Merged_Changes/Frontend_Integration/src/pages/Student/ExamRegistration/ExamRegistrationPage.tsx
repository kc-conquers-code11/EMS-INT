import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ArrowRight,
  Eye,
  Printer,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Check
} from "lucide-react";
import {
  examRegistrationSchema,
  type ExamRegistrationFormValues,
} from "../../../schemas/Student/examRegistrationSchema";

interface SubjectItem {
  id: number;
  name: string;
  code: string;
  th: boolean;
  pr: boolean;
  or: boolean;
  thDisabled: boolean;
}

const SEMESTER_SUBJECTS: Record<string, SubjectItem[]> = {
  "Sem 5": [
    { id: 501, name: "Software Engineering", code: "CSC1051", th: true, pr: true, or: false, thDisabled: false },
    { id: 502, name: "Computer Networks", code: "CSC1052", th: true, pr: true, or: true, thDisabled: false },
    { id: 503, name: "Theory of Computation", code: "CSC1053", th: true, pr: false, or: false, thDisabled: false },
    { id: 504, name: "Microprocessors", code: "CSC1054", th: true, pr: true, or: true, thDisabled: true },
    { id: 505, name: "Professional Communication", code: "CSC1055", th: false, pr: false, or: true, thDisabled: false }
  ],
  "Sem 6": [
    { id: 601, name: "System Programming & Compiler Construction", code: "CSC1061", th: true, pr: true, or: true, thDisabled: false },
    { id: 602, name: "Cryptography & Network Security", code: "CSC1062", th: true, pr: false, or: true, thDisabled: false },
    { id: 603, name: "Data Warehousing & Mining", code: "CSC1063", th: true, pr: true, or: false, thDisabled: false },
    { id: 604, name: "Mobile Computing", code: "CSC1064", th: true, pr: true, or: true, thDisabled: true },
    { id: 605, name: "Cloud Computing", code: "CSC1065", th: true, pr: true, or: true, thDisabled: false }
  ],
  "Sem 7": [
    { id: 701, name: "Artificial Intelligence", code: "CSC1071", th: true, pr: true, or: true, thDisabled: false },
    { id: 702, name: "Big Data Analytics", code: "CSC1072", th: true, pr: true, or: false, thDisabled: false },
    { id: 703, name: "Digital Signal Processing", code: "CSC1073", th: true, pr: false, or: true, thDisabled: false },
    { id: 704, name: "Robotics & Automation", code: "CSC1074", th: true, pr: true, or: true, thDisabled: true },
    { id: 705, name: "User Experience Design", code: "CSC1075", th: false, pr: false, or: true, thDisabled: false }
  ]
};

const EXAM_EVENTS = [
  { id: 1, name: "Summer 2026 Regular Exam", checked: true },
  { id: 2, name: "Winter 2026 Regular Exam", checked: false },
  { id: 3, name: "Summer 2026 Backlog Exam", checked: false },
  { id: 4, name: "Winter 2026 Backlog Exam", checked: false }
];

export default function ExamRegistrationPage() {
  const [step, setStep] = useState<"form" | "verify" | "success">("form");
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<number>(1);
  
  // Interactive semester selection mapping to auto-fetch
  const [selectedSemester, setSelectedSemester] = useState<string>("Sem 6");
  const [subjects, setSubjects] = useState<SubjectItem[]>(SEMESTER_SUBJECTS["Sem 6"]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExamRegistrationFormValues>({
    resolver: zodResolver(examRegistrationSchema),
    defaultValues: {
      sid: "vu4s2425001",
      event_id: 1,
      reg_type: "Regular",
      reg_status: "Pending",
      selected_subjects: [],
    },
  });

  // Auto-fetch trigger when semester is changed
  useEffect(() => {
    const fetched = SEMESTER_SUBJECTS[selectedSemester] || [];
    setSubjects(fetched);
    // Reset selected subject IDs to empty when semester changes
    setSelectedSubjects([]);
    setValue("selected_subjects", [], { shouldValidate: true });
  }, [selectedSemester, setValue]);



  const toggleSubject = (id: number) => {
    setSelectedSubjects((prev) => {
      const newVal = prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id];
      setValue("selected_subjects", newVal, { shouldValidate: true });
      return newVal;
    });
  };

  const toggleField = (id: number, field: "th" | "pr" | "or") => {
    setSubjects((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, [field]: !sub[field] } : sub
      )
    );
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const onSubmit: SubmitHandler<ExamRegistrationFormValues> = (data) => {
    if (!mobileNumber || mobileNumber.length < 10) {
      return;
    }
    console.log("Submitting Registration:", data, selectedSubjects);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setStep("verify");
  };

  const handleVerify = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }
    setStep("success");
  };

  return (
    <div className="flex flex-col w-full pb-20 font-['Instrument_Sans',sans-serif]">
      
      {/* Breadcrumb row matching Figma spacing */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <ArrowRight size={24} className="text-[#0e1680] shrink-0" />
        <h1 className="text-[26px] font-extrabold text-[#0e1680] tracking-tight">
          Exam Registration Form
        </h1>
      </div>

      {step === "form" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[30px] w-full max-w-[1053px] mx-2 bg-white p-10 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 animate-in fade-in duration-300"
        >
            {/* Input Fields Section */}
            <div className="grid grid-cols-2 gap-x-[30px] gap-y-6 w-full">
              {/* Student ID */}
              <div className="flex flex-col gap-[6px] w-full col-span-2 md:col-span-1">
                <label className="text-[14px] font-semibold text-[#344054]">
                  Student ID
                </label>
                <input
                  type="text"
                  {...register("sid")}
                  placeholder="vu4s2425001"
                  className={`bg-white border ${errors.sid ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-[8px] px-[14px] py-[10px] text-[16px] text-black placeholder:text-[#687b96] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5`}
                />
                {errors.sid && (
                  <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.sid.message}
                  </span>
                )}
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col gap-[6px] w-full col-span-2 md:col-span-1">
                <label className="text-[14px] font-semibold text-[#344054]">
                  Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setMobileNumber(val);
                    }}
                    placeholder="Enter 10-digit mobile number"
                    className={`bg-white border ${mobileNumber && mobileNumber.length < 10 ? 'border-red-400 ring-2 ring-red-400/10' : 'border-[#d0d5dd]'} rounded-[8px] pl-[40px] pr-[14px] py-[10px] text-[16px] text-black placeholder:text-[#687b96] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5`}
                  />
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                {mobileNumber && mobileNumber.length < 10 && (
                  <span className="text-red-500 text-[12px] mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> Mobile number must be 10 digits
                  </span>
                )}
              </div>

              {/* Branch */}
              <div className="flex flex-col gap-[6px] w-full">
                <label className="text-[14px] font-semibold text-[#344054]">
                  Select Branch
                </label>
                <div className="relative">
                  <select
                    defaultValue="IT"
                    className="appearance-none bg-white border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 cursor-pointer"
                  >
                    <option value="IT">Information Technology (IT)</option>
                    <option value="CS">Computer Science (CS)</option>
                    <option value="AIDS">Artificial Intelligence & Data Science (AIDS)</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none"
                  />
                </div>
              </div>

              {/* Semester (Triggers Subject Auto-Fetch) */}
              <div className="flex flex-col gap-[6px] w-full">
                <label className="text-[14px] font-semibold text-[#344054]">
                  Select Semester
                </label>
                <div className="relative">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="appearance-none bg-white border border-[#d0d5dd] rounded-[8px] px-[14px] py-[10px] text-[16px] text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] w-full focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 cursor-pointer"
                  >
                    <option value="Sem 5">5th Semester</option>
                    <option value="Sem 6">6th Semester</option>
                    <option value="Sem 7">7th Semester</option>
                  </select>
                  <ChevronDown
                    size={20}
                    className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#687b96] pointer-events-none"
                  />
                </div>
              </div>

              {/* Exam Event Selection Checkboxes List */}
              <div className="flex flex-col gap-[6px] w-full col-span-2">
                <label className="text-[14px] font-semibold text-[#344054]">
                  Exam Event Selection
                </label>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                  {EXAM_EVENTS.map(event => {
                    const isSelected = selectedEventId === event.id;
                    return (
                      <div 
                        key={event.id}
                        onClick={() => {
                          setSelectedEventId(event.id);
                          setValue("event_id", event.id, { shouldValidate: true });
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-[#f2f3fd] border-[#0e1680] text-[#0e1680] ring-2 ring-[#0e1680]/5' 
                            : 'bg-white border-[#d0d5dd] text-[#687b96] hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[15px] font-semibold">
                          {event.name}
                        </span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-[#0e1680] border-[#0e1680]' : 'bg-white border-[#d0d5dd]'
                        }`}>
                          {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Auto-Fetched Courses Table Section */}
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-base font-bold text-[#101828] text-[#0e1680]">
                  Courses Table - {selectedSemester} Subjects (Auto-fetched)
                </h3>
                <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <HelpCircle size={14} className="cursor-help" /> Toggle checkboxes to customize
                </span>
              </div>

              <div className="bg-white border border-[#eaecf0] rounded-2xl shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden w-full">
                <table className="w-full text-left">
                  <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
                    <tr>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider w-[60px] text-center">
                        <input
                          type="checkbox"
                          checked={selectedSubjects.length === subjects.length && subjects.length > 0}
                          onChange={() => {
                            if (selectedSubjects.length === subjects.length) {
                              setSelectedSubjects([]);
                              setValue("selected_subjects", [], { shouldValidate: true });
                            } else {
                              const allIds = subjects.map(s => s.id);
                              setSelectedSubjects(allIds);
                              setValue("selected_subjects", allIds, { shouldValidate: true });
                            }
                          }}
                          className="w-[20px] h-[20px] rounded-[6px] border-[#d0d5dd] text-[#0e1680] focus:ring-[#0e1680] cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Courses</th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center w-[92px]">TH</th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center w-[93px]">PR</th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#667085] text-center w-[128px]">OR</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eaecf0]">
                    {subjects.map((sub) => (
                      <tr key={sub.id} className={`h-[72px] transition-colors ${selectedSubjects.includes(sub.id) ? 'bg-[#f2f3fd]/40' : 'hover:bg-gray-50/50'}`}>
                        <td className="px-6 py-4 text-[15px] font-medium">
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(sub.id)}
                            onChange={() => toggleSubject(sub.id)}
                            className="w-[20px] h-[20px] rounded-[6px] border-[#0e1680] text-[#0e1680] focus:ring-[#0e1680] bg-[#e5e7fb] cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 text-[15px] font-medium">
                          <div className="text-[16px] font-semibold text-[#101828] leading-[24px]">{sub.name}</div>
                          <div className="text-[13px] text-[#475467] font-medium leading-[18px]">{sub.code}</div>
                        </td>
                        <td className="px-6 py-4 text-[15px] font-medium text-center">
                          <input
                            type="checkbox"
                            checked={sub.th}
                            onChange={() => toggleField(sub.id, "th")}
                            disabled={sub.thDisabled}
                            className={`w-[20px] h-[20px] rounded-[6px] focus:ring-[#0e1680] cursor-pointer ${
                              sub.thDisabled 
                                ? "border-[#d0d5dd] bg-[#f2f4f7] text-gray-300 cursor-not-allowed" 
                                : "border-[#0e1680] text-[#0e1680] bg-[#e5e7fb]"
                            }`}
                          />
                        </td>
                        <td className="px-8 py-6 text-[15px] font-medium text-center">
                          <input
                            type="checkbox"
                            checked={sub.pr}
                            onChange={() => toggleField(sub.id, "pr")}
                            className="w-[20px] h-[20px] rounded-[6px] border-[#0e1680] text-[#0e1680] focus:ring-[#0e1680] bg-[#e5e7fb] cursor-pointer"
                          />
                        </td>
                        <td className="px-8 py-6 text-[15px] font-medium text-center">
                          <input
                            type="checkbox"
                            checked={sub.or}
                            onChange={() => toggleField(sub.id, "or")}
                            className="w-[20px] h-[20px] rounded-[6px] border-[#0e1680] text-[#0e1680] focus:ring-[#0e1680] bg-[#e5e7fb] cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {errors.selected_subjects && (
                <span className="text-red-500 text-[14px] font-semibold px-2 flex items-center gap-1.5 mt-1">
                  <AlertCircle size={16} /> {errors.selected_subjects.message}
                </span>
              )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex justify-end pt-4 mt-2">
              <button
                type="submit"
                className="flex items-center justify-center gap-[8px] px-8 py-3.5 rounded-[8px] font-bold text-[16px] bg-[#0e1680] text-white hover:bg-[#0a1060] hover:shadow-lg shadow-[#0e1680]/20 transition-all duration-300"
              >
                Proceed & Register
                <ArrowRight size={20} />
              </button>
            </div>
          </form>
      )}

      {/* Verify OTP Popup Modal */}
      {step === "verify" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-xl w-full max-w-[560px] flex flex-col p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[22px] font-extrabold text-[#101828]">
                Verify Registration
              </h2>
              <button
                onClick={() => setStep("form")}
                className="text-[#98a2b3] hover:text-[#475467] font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-[#344054] text-[15px] mb-6 leading-relaxed">
              Please enter the 6-digit OTP sent to your registered mobile number ending with 
              <span className="font-semibold text-[#0e1680]"> ******{mobileNumber.slice(-4)}</span>.
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
                  className={`w-[48px] h-[48px] text-center text-[22px] font-bold border ${
                    otpError ? 'border-red-400 ring-2 ring-red-400/10' : 'border-[#d0d5dd] focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680]'
                  } rounded-[8px] focus:outline-none transition-all`}
                />
              ))}
            </div>
            {otpError && (
              <p className="text-red-500 text-[13px] text-center mt-2 flex items-center justify-center gap-1 font-medium">
                <AlertCircle size={14} /> {otpError}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={() => { setStep("form"); setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
                className="px-5 py-2.5 border border-[#d0d5dd] text-[#344054] rounded-[8px] font-semibold text-[14px] hover:bg-[#f9fafb] transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
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

      {/* Success View Screen */}
      {step === "success" && (
        <div className="flex flex-col gap-[36px] bg-white p-12 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 animate-in fade-in duration-500 max-w-[1053px] mt-10">
          <div className="flex flex-col gap-[20px] items-start w-full">
            <h1 className="text-[42px] font-semibold text-[#0e1680] tracking-tight leading-tight">
              Exam Registration Successful!!
            </h1>
            <p className="text-[16px] font-medium text-gray-600 leading-relaxed">
              Your exam registration for <span className="font-bold text-[#0e1680]">Winter 2026 Regular Exam</span> has been completed successfully. Your registered subjects are now pending hall ticket generation.
            </p>
          </div>
          <div className="flex items-center gap-[15px]">
            <button 
              onClick={() => setStep("form")}
              className="bg-[#0e1680] text-white flex items-center justify-center gap-[8px] px-6 py-3 rounded-[8px] font-semibold text-[14px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0a1060] transition-colors"
            >
              View Exam form
              <Eye size={18} />
            </button>
            <button className="bg-[#f2f3fd] border border-[#e5e7fb] text-[#0e1680] flex items-center justify-center gap-[8px] px-6 py-3 rounded-[8px] font-semibold text-[14px] shadow-sm hover:bg-[#e5e7fb] transition-colors">
              Print Exam form
              <Printer size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
