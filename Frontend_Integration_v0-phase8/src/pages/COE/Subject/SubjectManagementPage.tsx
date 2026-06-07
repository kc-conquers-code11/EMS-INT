import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Eye, Trash2, Pencil, ChevronDown, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { 
  type SubjectModalType,
  type SubjectData 
} from "../../../types/COE/subject";
import { subjectSchema, type SubjectFormValues } from "../../../schemas/COE/subjectSchema";
import { TabNavigation } from "../../../components/screens/TabNavigation";
import { FeedbackModal } from "../../../components/modals/FeedbackModal";
import { ViewSubjectModal, EditSubjectModal, BulkUploadModal } from "../../../components/modals/Subject/SubjectModals";
import { SearchFilters } from "../../../components/screens/SearchFilters";

const SUBJECTS_DATA: SubjectData[] = [
  { id: 1, scheme_id: "1", name: "Applied Thermodynamics", code: "AT", type: "TH", semester: "5", credits: "4", max_theory: "100", max_practical: "50", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 2, scheme_id: "1", name: "Data Structures", code: "DS", type: "PR", semester: "3", credits: "3", max_theory: "0", max_practical: "50", max_oral: "0", max_tw: "0", min_pass_theory: "0", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 3, scheme_id: "2", name: "Mechanics", code: "MECH", type: "TH", semester: "1", credits: "4", max_theory: "100", max_practical: "0", max_oral: "0", max_tw: "0", min_pass_theory: "40", min_pass_practical: "0", exam_duration_min: "180", status: "Inactive" },
  { id: 4, scheme_id: "1", name: "Computer Networks", code: "CN", type: "TH", semester: "5", credits: "4", max_theory: "100", max_practical: "50", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 5, scheme_id: "1", name: "Operating Systems", code: "OS", type: "TH", semester: "4", credits: "4", max_theory: "100", max_practical: "50", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 6, scheme_id: "2", name: "Engineering Drawing", code: "ED", type: "PR", semester: "2", credits: "3", max_theory: "0", max_practical: "50", max_oral: "0", max_tw: "0", min_pass_theory: "0", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 7, scheme_id: "1", name: "Database Management", code: "DBMS", type: "TH", semester: "4", credits: "4", max_theory: "100", max_practical: "50", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 8, scheme_id: "1", name: "Software Engineering", code: "SE", type: "TH", semester: "6", credits: "4", max_theory: "100", max_practical: "0", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "0", exam_duration_min: "180", status: "Active" },
  { id: 9, scheme_id: "1", name: "Machine Learning", code: "ML", type: "TH", semester: "7", credits: "4", max_theory: "100", max_practical: "50", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 10, scheme_id: "2", name: "Basic Electrical", code: "BEE", type: "TH", semester: "1", credits: "4", max_theory: "100", max_practical: "50", max_oral: "0", max_tw: "0", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 11, scheme_id: "1", name: "Cloud Computing", code: "CC", type: "TH", semester: "8", credits: "4", max_theory: "100", max_practical: "0", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "0", exam_duration_min: "180", status: "Active" },
  { id: 12, scheme_id: "1", name: "Cyber Security", code: "CS", type: "TH", semester: "7", credits: "3", max_theory: "100", max_practical: "0", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "0", exam_duration_min: "180", status: "Inactive" },
  { id: 13, scheme_id: "2", name: "Applied Mathematics", code: "AM-I", type: "TH", semester: "1", credits: "4", max_theory: "100", max_practical: "0", max_oral: "0", max_tw: "25", min_pass_theory: "40", min_pass_practical: "0", exam_duration_min: "180", status: "Active" },
  { id: 14, scheme_id: "1", name: "Artificial Intelligence", code: "AI", type: "TH", semester: "6", credits: "4", max_theory: "100", max_practical: "50", max_oral: "25", max_tw: "25", min_pass_theory: "40", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
  { id: 15, scheme_id: "1", name: "Web Technologies", code: "WT", type: "PR", semester: "5", credits: "3", max_theory: "0", max_practical: "50", max_oral: "0", max_tw: "0", min_pass_theory: "0", min_pass_practical: "20", exam_duration_min: "180", status: "Active" },
];

const SUBJECT_TYPES = ["TH", "PR", "OR", "TW"];
const STATUS_OPTIONS = ["Active", "Inactive"];
const SCHEMES = [
  { id: "1", name: "C Scheme" },
  { id: "2", name: "R Scheme" },
];

const ITEMS_PER_PAGE = 10;

export default function Subject() {
  const [activeTab, setActiveTab] = useState<"add" | "view">("add");
  const [modalType, setModalType] = useState<SubjectModalType>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [schemes, setSchemes] = useState<{id: string; label: string}[]>([]);
  const [branches, setBranches] = useState<{id: string; label: string}[]>([]);
  const [academicYears, setAcademicYears] = useState<{id: string; label: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bulkUploadSummary, setBulkUploadSummary] = useState<{ created: number; failed: number } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      scheme_id: "1",
      subject_name: "",
      subject_code: "",
      subject_type: "TH",
      semester: "",
      credits: "",
      max_theory: "",
      max_practical: "",
      max_oral: "",
      max_tw: "",
      min_pass_theory: "",
      min_pass_practical: "",
      exam_duration_min: "",
      status: "Active"
    }
  });

  const onSubmit: SubmitHandler<SubjectFormValues> = (data) => {
    console.log("Subject Data:", data);
    setModalType("add-success");
    reset();
  };

  const openModal = (type: SubjectModalType, subject?: SubjectData) => {
    if (subject) {
      setSelectedSubject(subject);
      if (type === "edit") {
        setValue("scheme_id", subject.scheme_id);
        setValue("subject_name", subject.name);
        setValue("subject_code", subject.code);
        setValue("subject_type", subject.type);
        setValue("semester", subject.semester);
        setValue("credits", subject.credits);
        setValue("max_theory", subject.max_theory || "");
        setValue("max_practical", subject.max_practical || "");
        setValue("max_oral", subject.max_oral || "");
        setValue("max_tw", subject.max_tw || "");
        setValue("min_pass_theory", subject.min_pass_theory || "");
        setValue("min_pass_practical", subject.min_pass_practical || "");
        setValue("exam_duration_min", subject.exam_duration_min || "");
        setValue("status", subject.status);
      }
    }
    setModalType(type);
  };

  const filteredData = SUBJECTS_DATA.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "ALL" || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  const fetchSubjects = () => {
    console.log("Mock fetching subjects...");
  };

  const handleDelete = () => {
    setModalType("delete-success");
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="flex flex-col gap-6 mb-8 px-2">
        <h1 className="text-[28px] font-semibold text-[#171822] tracking-tight">
          Subject Management
        </h1>

        <div className="flex items-center justify-between">
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            addLabel="Add Subject" 
          />

          <button 
            onClick={() => setModalType("bulk-upload")}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#0e1680] text-[#0e1680] rounded-lg font-semibold hover:bg-[#f2f3fd] transition-all shadow-sm"
          >
            <Upload size={18} />
            Bulk Upload
          </button>
        </div>
      </div>

      {activeTab === "add" ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 bg-white p-10 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-2">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-[#344054]">Select Scheme</label>
              <div className="relative">
                <select 
                  {...register("scheme_id")}
                  className={`w-full px-4 py-3.5 bg-white border ${errors.scheme_id ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 appearance-none cursor-pointer transition-all`}
                >
                  {SCHEMES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={20} />
              </div>
              {errors.scheme_id && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.scheme_id.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-[#344054]">Subject Code</label>
              <input 
                {...register("subject_code")}
                type="text" 
                placeholder="CSC1001" 
                className={`w-full px-4 py-3.5 bg-white border ${errors.subject_code ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
              />
              {errors.subject_code && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.subject_code.message}</span>}
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-[16px] font-medium text-[#344054]">Subject Name</label>
              <input 
                {...register("subject_name")}
                type="text" 
                placeholder="Advanced Thermodynamics" 
                className={`w-full px-4 py-3.5 bg-white border ${errors.subject_name ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
              />
              {errors.subject_name && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.subject_name.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-[#344054]">Semester</label>
              <input 
                {...register("semester")}
                type="number" 
                min="1"
                placeholder="5" 
                className={`w-full px-4 py-3.5 bg-white border ${errors.semester ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
              />
              {errors.semester && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.semester.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-[#344054]">Subject Type</label>
              <div className="relative">
                <select 
                  {...register("subject_type")}
                  className={`w-full px-4 py-3.5 bg-white border ${errors.subject_type ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 appearance-none cursor-pointer transition-all`}
                >
                  {SUBJECT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={20} />
              </div>
              {errors.subject_type && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.subject_type.message}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-[#344054]">Credits</label>
              <input 
                {...register("credits")}
                type="number" 
                min="1"
                placeholder="4" 
                className={`w-full px-4 py-3.5 bg-white border ${errors.credits ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
              />
              {errors.credits && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.credits.message}</span>}
            </div>

            <div className="col-span-2 mt-4">
              <h3 className="text-xl font-bold text-[#101828] mb-8 border-b border-[#eaecf0] pb-4">Marks Distribution</h3>
              <div className="grid grid-cols-4 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#344054]">Max Theory</label>
                  <input {...register("max_theory")} type="number" min="0" placeholder="100" className={`w-full px-4 py-3.5 bg-white border ${errors.max_theory ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`} />
                  {errors.max_theory && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.max_theory.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#344054]">Max Practical</label>
                  <input {...register("max_practical")} type="number" min="0" placeholder="50" className={`w-full px-4 py-3.5 bg-white border ${errors.max_practical ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`} />
                  {errors.max_practical && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.max_practical.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#344054]">Max Oral</label>
                  <input {...register("max_oral")} type="number" min="0" placeholder="25" className={`w-full px-4 py-3.5 bg-white border ${errors.max_oral ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`} />
                  {errors.max_oral && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.max_oral.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#344054]">Max TW</label>
                  <input {...register("max_tw")} type="number" min="0" placeholder="25" className={`w-full px-4 py-3.5 bg-white border ${errors.max_tw ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`} />
                  {errors.max_tw && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.max_tw.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#344054]">Min Pass Theory</label>
                  <input {...register("min_pass_theory")} type="number" min="0" placeholder="40" className={`w-full px-4 py-3.5 bg-white border ${errors.min_pass_theory ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`} />
                  {errors.min_pass_theory && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.min_pass_theory.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#344054]">Min Pass Practical</label>
                  <input {...register("min_pass_practical")} type="number" min="0" placeholder="20" className={`w-full px-4 py-3.5 bg-white border ${errors.min_pass_practical ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`} />
                  {errors.min_pass_practical && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.min_pass_practical.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#344054]">Exam Duration (Min)</label>
                  <input {...register("exam_duration_min")} type="number" min="0" placeholder="180" className={`w-full px-4 py-3.5 bg-white border ${errors.exam_duration_min ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`} />
                  {errors.exam_duration_min && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.exam_duration_min.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#344054]">Status</label>
                  <div className="relative">
                    <select 
                      {...register("status")}
                      className="w-full px-4 py-3.5 bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 appearance-none cursor-pointer transition-all"
                    >
                      {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <button 
              type="submit"
              className="px-12 py-3.5 bg-[#0e1680] text-white rounded-lg font-bold text-[16px] shadow-lg shadow-[#0e1680]/20 hover:bg-[#0a1060] transition-all duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 px-2">
          <SearchFilters 
            onSearch={(q) => setSearchQuery(q)} 
            filters={[
              { label: `Type: ${filterType}`, onClick: () => {
                const nextTypes: Record<string, string> = { "ALL": "TH", "TH": "PR", "PR": "OR", "OR": "TW", "TW": "ALL" };
                setFilterType(prev => nextTypes[prev] || "ALL");
              }}
            ]} 
          />

          <div className="bg-white border border-[#eaecf0] rounded-2xl overflow-hidden shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-[#f9fafb]">
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Subject Name</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Code</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Type</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Semester</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Credits</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Status</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaecf0]">
                  {paginatedData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{item.name}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{item.code}</td>
                      <td className="px-8 py-6 text-[15px] font-medium">
                        <div className="flex flex-wrap gap-2">
                           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.type === 'TH' ? 'bg-[#effbe7] text-[#095512]' : 'bg-[#fcf0e5] text-[#6f0906]'}`}>
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{item.semester}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{item.credits}</td>
                      <td className="px-8 py-6 text-[15px] font-medium">
                        <span className={`px-4 py-1 rounded-full text-xs font-semibold ${
                          item.status === "Active" ? 'bg-[#effbe7] text-[#095512]' : 'bg-[rgba(255,0,0,0.1)] text-[#c00000]'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-medium text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => openModal("view", item)} className="p-2.5 text-[#667085] hover:text-[#0e1680] hover:bg-[#f2f3fd] rounded-xl transition-all"><Eye size={20} /></button>
                          <button onClick={() => openModal("delete-confirm", item)} className="p-2.5 text-[#667085] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                          <button onClick={() => openModal("edit", item)} className="p-2.5 text-[#667085] hover:text-[#0e1680] hover:bg-[#f2f3fd] rounded-xl transition-all"><Pencil size={20} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-8 py-5 flex items-center justify-between border-t border-[#eaecf0] bg-white">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ArrowLeft size={18} /> Previous
              </button>
              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof page === "number" && setCurrentPage(page)}
                    className={`size-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${page === currentPage ? "bg-[#f9fafb] text-[#101828] font-bold" : page === "..." ? "text-[#667085] cursor-default" : "text-[#667085] hover:bg-gray-50"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <BulkUploadModal
        isOpen={modalType === "bulk-upload"}
        onClose={() => setModalType(null)}
        schemes={schemes}
        onSuccess={(summary) => {
          setBulkUploadSummary(summary);
          setModalType("bulk-upload-success");
          fetchSubjects();
        }}
      />

      <ViewSubjectModal 
        isOpen={modalType === "view"} 
        onClose={() => setModalType(null)} 
        data={selectedSubject} 
      />

      <EditSubjectModal 
        isOpen={modalType === "edit"} 
        onClose={() => setModalType(null)} 
        data={selectedSubject} 
        onSave={() => setModalType("edit-success")} 
      />

      <FeedbackModal
        isOpen={modalType === "delete-confirm"}
        onClose={() => setModalType(null)}
        type="delete-confirm"
        title="Do you really want to delete this Subject?"
        onConfirm={handleDelete}
      />

      <FeedbackModal
        isOpen={modalType === "bulk-upload-success"}
        onClose={() => {
          setModalType(null);
          setBulkUploadSummary(null);
        }}
        type="success"
        title={
          bulkUploadSummary
            ? `${bulkUploadSummary.created} subject(s) uploaded successfully${
                bulkUploadSummary.failed > 0
                  ? ` (${bulkUploadSummary.failed} row(s) skipped or failed)`
                  : ''
              }`
            : 'Subjects uploaded successfully'
        }
      />

      <FeedbackModal 
        isOpen={modalType === "add-success"} 
        onClose={() => setModalType(null)} 
        type="success" 
        title="Subject added successfully !!" 
      />

      <FeedbackModal 
        isOpen={modalType === "edit-success"} 
        onClose={() => setModalType(null)} 
        type="success" 
        title="Subject edited successfully !!" 
      />

      <FeedbackModal 
        isOpen={modalType === "delete-success"} 
        onClose={() => setModalType(null)} 
        type="success" 
        title="Subject deleted successfully !!" 
      />
    </div>
  );
}
