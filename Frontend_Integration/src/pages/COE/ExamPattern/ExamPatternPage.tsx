// src/pages/COE/ExamPattern/ExamPatternPage.tsx
import { useState, useMemo, useEffect, useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  AlertCircle,
  Search,
  Eye,
  Trash2,
  Pencil,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import {
  examPatternSchema,
  type ExamPatternFormValues,
} from "../../../schemas/COE/examPatternSchema";
import type {
  ExamPatternData,
  ExamPatternModalType,
} from "../../../types/COE/examPattern";
import { examPatternAPI, programmeAPI } from "../../../services/api";

const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
];

const ACADEMIC_YEARS = ["2023-24", "2024-25", "2025-26", "2026-27"];

interface ProgrammeOption {
  id: string;
  name: string;
}

interface ExamPatternRecord extends ExamPatternData {
  semester?: string;
  academic_year?: string;
  fa_marks?: number;
  sa_marks?: number;
  term_work?: number;
  practical?: number;
  oral?: number;
  total_marks?: number;
  grace_type?: string;
  grace_eligibility?: string;
  grace_max_subjects?: number;
  detention_allowed?: number;
  min_attendance?: number;
  max_failed_subjects?: number;
  detention_condition?: string;
  programme_name?: string;
  programme_code?: string;
}

const ITEMS_PER_PAGE = 5;

export default function ExamPatternPage() {
  const [activeTab, setActiveTab] = useState<"add" | "marking" | "view">("view");
  const [modalState, setModalState] = useState<ExamPatternModalType>(null);

  const [records, setRecords] = useState<ExamPatternRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<ExamPatternRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [programmes, setProgrammes] = useState<ProgrammeOption[]>([]);
  const [programmesLoading, setProgrammesLoading] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSemester, setFilterSemester] = useState<string>("ALL");
  const [filterScheme, setFilterScheme] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ExamPatternFormValues>({
    resolver: zodResolver(examPatternSchema),
    defaultValues: {
      programm_id: "",
      pattern_name: "",
      grading_type: "Absolute",
      grace_marks_allowed: 1,
      grace_marks_max: 5,
      atkt_rule: "",
      rounding_rule: "",
      passing_criteria: "CGPA",
      detention_criteria: "",
      semester: "1st Semester",
      academic_year: "2025-26",
      fa_marks: 20,
      sa_marks: 80,
      term_work: 25,
      practical: 25,
      oral: 25,
    },
  });

  const formValues = watch();

  // Fetch programmes from backend
  const fetchProgrammes = useCallback(async () => {
    setProgrammesLoading(true);
    try {
      const response = await programmeAPI.getDropdown();
      if (response.data.success && Array.isArray(response.data.data)) {
        const mapped: ProgrammeOption[] = response.data.data.map((p: any) => ({
          id: String(p.programm_id),
          name: p.programme_name
            ? `${p.programme_name}${p.programme_code ? " - " + p.programme_code : ""}`
            : String(p.programm_id),
        }));
        setProgrammes(mapped);
        if (mapped.length > 0) {
          setValue("programm_id", mapped[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching programmes:", err);
    } finally {
      setProgrammesLoading(false);
    }
  }, [setValue]);

  // Fetch exam patterns from backend
  const fetchExamPatterns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await examPatternAPI.getAll();
      if (response.data.success) {
        const transformedRecords = (response.data.data ?? []).map((pattern: any) => ({
          pattern_id: pattern.pattern_id,
          programm_id: String(pattern.programm_id),
          pattern_name: pattern.pattern_name,
          grading_type: pattern.grading_type,
          grace_marks_allowed: pattern.grace_marks_allowed ? 1 : 0,
          grace_marks_max: pattern.grace_marks_max || 0,
          atkt_rule: pattern.atkt_rule || "",
          rounding_rule: pattern.rounding_rule || "",
          passing_criteria: pattern.passing_criteria || "CGPA",
          detention_criteria: pattern.detention_criteria || "",
          semester: "1st Semester",
          academic_year: "2025-26",
          fa_marks: 20,
          sa_marks: 80,
          term_work: 25,
          practical: 25,
          oral: 25,
          total_marks: 175,
          grace_type: pattern.grace_marks_allowed ? "General" : "None",
          grace_eligibility: pattern.grace_marks_allowed ? "Near Pass" : "Not Eligible",
          grace_max_subjects: pattern.grace_marks_allowed ? 2 : 0,
          detention_allowed: pattern.detention_criteria ? 1 : 0,
          min_attendance: pattern.detention_criteria ? 75 : 0,
          max_failed_subjects: pattern.detention_criteria ? 3 : 0,
          detention_condition: pattern.detention_criteria ? "Attendance" : "None",
          programme_name: pattern.programme_name,
          programme_code: pattern.programme_code,
          status: pattern.status,
        }));
        setRecords(transformedRecords);
      } else {
        setError(response.data.message || "Failed to fetch exam patterns");
      }
    } catch (err: any) {
      console.error("Error fetching exam patterns:", err);
      setError(err.response?.data?.message || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgrammes();
    fetchExamPatterns();
  }, [fetchProgrammes, fetchExamPatterns]);

  const liveTotalMarks = useMemo(() => {
    const fa = Number(formValues.fa_marks) || 0;
    const sa = Number(formValues.sa_marks) || 0;
    const tw = Number(formValues.term_work) || 0;
    const pr = Number(formValues.practical) || 0;
    const or = Number(formValues.oral) || 0;
    return fa + sa + tw + pr + or;
  }, [formValues.fa_marks, formValues.sa_marks, formValues.term_work, formValues.practical, formValues.oral]);

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof ExamPatternFormValues)[] = [
      "pattern_name",
      "programm_id",
      "grading_type",
      "passing_criteria",
      "atkt_rule",
      "rounding_rule",
      "semester",
      "academic_year",
    ];
    const isStep1Valid = await trigger(fieldsToValidate);
    if (isStep1Valid) {
      setActiveTab("marking");
    }
  };

  const onSubmit: SubmitHandler<ExamPatternFormValues> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        programm_id: data.programm_id,
        pattern_name: data.pattern_name,
        grading_type: data.grading_type.toLowerCase(),
        grace_marks_allowed: data.grace_marks_allowed,
        grace_marks_max: data.grace_marks_allowed === 1 ? data.grace_marks_max : 0,
        atkt_rule: data.atkt_rule || "",
        rounding_rule: data.rounding_rule || "",
        passing_criteria: data.passing_criteria,
        detention_criteria: data.detention_criteria || "None",
        status: true,
      };

      const response = await examPatternAPI.create(payload);

      if (response.data.success) {
        setModalState("add-success");
        reset({
          programm_id: programmes[0]?.id || "",
          pattern_name: "",
          grading_type: "Absolute",
          grace_marks_allowed: 1,
          grace_marks_max: 5,
          atkt_rule: "",
          rounding_rule: "",
          passing_criteria: "CGPA",
          detention_criteria: "",
          semester: "1st Semester",
          academic_year: "2025-26",
          fa_marks: 20,
          sa_marks: 80,
          term_work: 25,
          practical: 25,
          oral: 25,
        });
        setActiveTab("view");
        await fetchExamPatterns();
      } else {
        setError(response.data.message || "Failed to create exam pattern");
      }
    } catch (err: any) {
      console.error("Error creating exam pattern:", err);
      setError(err.response?.data?.message || "Failed to create exam pattern");
    } finally {
      setLoading(false);
    }
  };

  const [editRecordId, setEditRecordId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ExamPatternRecord>>({});
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (record: ExamPatternRecord) => {
    setEditRecordId(record.pattern_id);
    setEditForm({ ...record });
    setEditErrors({});
    setModalState("edit");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!editForm.pattern_name || editForm.pattern_name.length < 2 || editForm.pattern_name.length > 200) {
      errors.pattern_name = "Pattern Name must be between 2 and 200 characters";
    }
    if (!editForm.programm_id) {
      errors.programm_id = "Please select a valid Program";
    }
    if (editForm.grace_marks_allowed === 1 && (editForm.grace_marks_max === undefined || editForm.grace_marks_max < 0 || editForm.grace_marks_max > 50)) {
      errors.grace_marks_max = "Max grace marks must be between 0 and 50";
    }
    if (!editForm.passing_criteria || editForm.passing_criteria.length < 4) {
      errors.passing_criteria = "Passing criteria is required (min 4 chars)";
    }
    if (!editForm.atkt_rule || editForm.atkt_rule.length < 4) {
      errors.atkt_rule = "ATKT rule is required (min 4 chars)";
    }
    if (!editForm.detention_criteria || editForm.detention_criteria.length < 4) {
      errors.detention_criteria = "Detention criteria is required (min 4 chars)";
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    setIsEditing(true);
    try {
      // UUID regex — backend Zod schema requires programm_id to be a valid UUID
      const isUUID = (v?: string) =>
        !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

      const payload: Record<string, any> = {
        pattern_name: editForm.pattern_name,
        grading_type: editForm.grading_type?.toLowerCase(),
        // Zod schema expects integer for these fields
        grace_marks_allowed: Number(editForm.grace_marks_allowed) | 0,
        grace_marks_max: editForm.grace_marks_allowed === 1 ? (Number(editForm.grace_marks_max) | 0) : 0,
        atkt_rule: editForm.atkt_rule || null,
        rounding_rule: editForm.rounding_rule || null,
        passing_criteria: editForm.passing_criteria || null,
        detention_criteria: editForm.detention_criteria || null,
        // MySQL returns TINYINT as 0/1 — Zod requires a real boolean
        status: editForm.status === undefined ? true : Boolean(editForm.status),
      };

      // Only send programm_id if it is a valid UUID (backend enforces uuid format)
      if (isUUID(editForm.programm_id)) {
        payload.programm_id = editForm.programm_id;
      }

      const response = await examPatternAPI.update(editRecordId!, payload);

      if (response.data.success) {
        setModalState("edit-success");
        await fetchExamPatterns();
      } else {
        setError(response.data.message || "Failed to update exam pattern");
      }
    } catch (err: any) {
      console.error("Error updating exam pattern:", err);
      setError(err.response?.data?.message || "Failed to update exam pattern");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteConfirm = (record: ExamPatternRecord) => {
    setSelectedRecord(record);
    setModalState("delete-confirm");
  };

  const handleDeleteSubmit = async () => {
    if (selectedRecord) {
      setLoading(true);
      try {
        const response = await examPatternAPI.softDelete(selectedRecord.pattern_id);
        if (response.data.success) {
          setModalState("delete-success");
          await fetchExamPatterns();
        } else {
          setError(response.data.message || "Failed to delete exam pattern");
        }
      } catch (err: any) {
        console.error("Error deleting exam pattern:", err);
        setError(err.response?.data?.message || "Failed to delete exam pattern");
      } finally {
        setLoading(false);
      }
    }
  };

  const getProgrammeName = (programm_id: string, record_programme_name?: string) => {
    if (record_programme_name) return record_programme_name;
    const prog = programmes.find((p) => p.id === programm_id);
    return prog ? prog.name.split(" - ")[0] : "Unknown Scheme";
  };

  const filteredData = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.pattern_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.programme_name || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchSemester = filterSemester === "ALL" || r.semester === filterSemester;
      const matchScheme = filterScheme === "ALL" || r.grading_type === filterScheme;
      return matchSearch && matchSemester && matchScheme;
    });
  }, [records, searchQuery, filterSemester, filterScheme]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  if (loading && records.length === 0) {
    return (
      <div className="flex flex-col w-full pb-20 font-['Instrument_Sans',sans-serif] items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-[#0e1680] animate-spin" />
        <p className="mt-4 text-[#667085]">Loading exam patterns...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-20 font-['Instrument_Sans',sans-serif]">
      {error && (
        <div className="mb-6 mx-2 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">×</button>
        </div>
      )}

      <div className="flex flex-col gap-6 mb-8 px-2">
        <h1 className="text-[28px] font-semibold text-[#171822] tracking-tight">
          Exam Pattern Configuration
        </h1>

        <div className="flex bg-white rounded-xl shadow-sm border border-[#eaecf0] p-1.5 w-max">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-[15px] transition-all duration-300 ${
              activeTab === "add"
                ? "bg-[#0e1680] text-white shadow-md"
                : "text-[#667085] hover:text-[#0e1680] hover:bg-gray-50"
            }`}
          >
            <Plus size={18} />
            Add Exam Pattern
          </button>

          <button
            onClick={handleNextStep}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-[15px] transition-all duration-300 ${
              activeTab === "marking"
                ? "bg-[#0e1680] text-white shadow-md"
                : "text-[#667085] hover:text-[#0e1680] hover:bg-gray-50"
            }`}
          >
            Marking Configuration
          </button>

          <button
            onClick={() => {
              setActiveTab("view");
              fetchExamPatterns();
            }}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold text-[15px] transition-all duration-300 ${
              activeTab === "view"
                ? "bg-[#0e1680] text-white shadow-md"
                : "text-[#667085] hover:text-[#0e1680] hover:bg-gray-50"
            }`}
          >
            View List
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-transparent px-2 max-w-[1049px]">
        {activeTab === "add" && (
          <div className="flex flex-col gap-8 bg-white p-10 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-[#101828] border-b border-[#f2f4f7] pb-4">
              Step 1: Basic Configuration Details
            </h2>

            <div className="grid grid-cols-2 gap-x-[30px] gap-y-6">
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-[14px] font-semibold text-[#344054]">Pattern Name</label>
                <input
                  {...register("pattern_name")}
                  type="text"
                  placeholder="e.g. 2024 CBCS Pattern"
                  className={`w-full px-4 py-3 bg-white border ${errors.pattern_name ? "border-red-500 ring-2 ring-red-500/10" : "border-[#d0d5dd]"} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
                />
                {errors.pattern_name && (
                  <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.pattern_name.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#344054]">Program / Applicable Scheme</label>
                <div className="relative">
                  <select
                    {...register("programm_id")}
                    disabled={programmesLoading}
                    className={`w-full px-4 py-3 bg-white border ${errors.programm_id ? "border-red-500" : "border-[#d0d5dd]"} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 appearance-none cursor-pointer transition-all disabled:opacity-60`}
                  >
                    {programmesLoading ? (
                      <option value="">Loading programmes...</option>
                    ) : programmes.length === 0 ? (
                      <option value="">No programmes found</option>
                    ) : (
                      programmes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={20} />
                </div>
                {errors.programm_id && (
                  <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.programm_id.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#344054]">Grading Type</label>
                <div className="relative">
                  <select
                    {...register("grading_type")}
                    className="w-full px-4 py-3 bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 appearance-none cursor-pointer transition-all"
                  >
                    <option value="Absolute">Absolute</option>
                    <option value="Relative">Relative</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={20} />
                </div>
                {errors.grading_type && (
                  <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.grading_type.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#344054]">Passing Criteria</label>
                <div className="relative">
                  <select
                    {...register("passing_criteria")}
                    className="w-full px-4 py-3 bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 appearance-none cursor-pointer transition-all"
                  >
                    <option value="CGPA">CGPA Based (e.g. CGPA &gt;= 5.0)</option>
                    <option value="Percentage">Percentage Based (e.g. &gt;= 40%)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={20} />
                </div>
                {errors.passing_criteria && (
                  <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.passing_criteria.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#344054]">Rounding Rule</label>
                <input
                  {...register("rounding_rule")}
                  type="text"
                  placeholder="e.g. Round to nearest integer"
                  className={`w-full px-4 py-3 bg-white border ${errors.rounding_rule ? "border-red-500" : "border-[#d0d5dd]"} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
                />
                {errors.rounding_rule && (
                  <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.rounding_rule.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#344054]">Select Semester</label>
                <div className="relative">
                  <select
                    {...register("semester")}
                    className="w-full px-4 py-3 bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 appearance-none cursor-pointer transition-all"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={20} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#344054]">Academic Year</label>
                <div className="relative">
                  <select
                    {...register("academic_year")}
                    className="w-full px-4 py-3 bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 appearance-none cursor-pointer transition-all"
                  >
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none" size={20} />
                </div>
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-[14px] font-semibold text-[#344054]">ATKT Promotion Rule</label>
                <textarea
                  {...register("atkt_rule")}
                  placeholder="e.g. Max 3 subjects backlogs allowed to promote to next academic year..."
                  rows={3}
                  className={`w-full px-4 py-3 bg-white border ${errors.atkt_rule ? "border-red-500" : "border-[#d0d5dd]"} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all resize-none`}
                />
                {errors.atkt_rule && (
                  <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.atkt_rule.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-8 py-3.5 bg-[#0e1680] text-white rounded-lg font-bold text-[16px] hover:bg-[#0a1060] transition-all flex items-center gap-2 hover:shadow-lg shadow-[#0e1680]/20 duration-300"
              >
                Next to Marking Configuration <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {activeTab === "marking" && (
          <div className="flex flex-col gap-8 bg-white p-10 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-[#101828] border-b border-[#f2f4f7] pb-4">
              Step 2: Marking Scheme &amp; Policies
            </h2>

            <div className="flex flex-col gap-6">
              <h3 className="text-base font-bold text-[#101828] flex items-center gap-2 text-[#0e1680]">
                Marking Scheme Components
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#344054]">FA (Formative)</label>
                  <input
                    {...register("fa_marks", { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                  />
                  {errors.fa_marks && <span className="text-xs text-red-500">{errors.fa_marks.message}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#344054]">SA (Summative)</label>
                  <input
                    {...register("sa_marks", { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                  />
                  {errors.sa_marks && <span className="text-xs text-red-500">{errors.sa_marks.message}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#344054]">Term Work</label>
                  <input
                    {...register("term_work", { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                  />
                  {errors.term_work && <span className="text-xs text-red-500">{errors.term_work.message}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#344054]">Practical</label>
                  <input
                    {...register("practical", { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                  />
                  {errors.practical && <span className="text-xs text-red-500">{errors.practical.message}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#344054]">Oral/Viva</label>
                  <input
                    {...register("oral", { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                  />
                  {errors.oral && <span className="text-xs text-red-500">{errors.oral.message}</span>}
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#f8f9fc] p-4 rounded-xl border border-gray-100">
                <span className="text-sm font-semibold text-[#475467]">Total Marks (Auto-calculated):</span>
                <span className="text-lg font-bold text-[#0e1680]">{liveTotalMarks}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
              <h3 className="text-base font-bold text-[#101828] flex items-center gap-2 text-[#0e1680]">
                Grace Marks Policy
              </h3>

              <div className="flex items-center gap-4 mb-2">
                <span className="text-sm font-medium text-[#344054]">Allow Grace Marks</span>
                <button
                  type="button"
                  onClick={() => setValue("grace_marks_allowed", formValues.grace_marks_allowed === 1 ? 0 : 1)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${formValues.grace_marks_allowed === 1 ? "bg-[#0e1680]" : "bg-gray-300"}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${formValues.grace_marks_allowed === 1 ? "right-0.5" : "left-0.5"}`}></div>
                </button>
              </div>

              {formValues.grace_marks_allowed === 1 && (
                <div className="grid grid-cols-2 gap-x-[30px] gap-y-4 animate-in slide-in-from-top-1 duration-200">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#344054]">Grace Type</label>
                    <input
                      type="text"
                      defaultValue="General"
                      className="w-full px-4 py-3 bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-sm text-[#101828] focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#344054]">Max Grace Marks Allowed</label>
                    <input
                      {...register("grace_marks_max", { valueAsNumber: true })}
                      type="number"
                      className={`w-full px-4 py-3 bg-white border ${errors.grace_marks_max ? "border-red-500" : "border-[#d0d5dd]"} rounded-lg shadow-sm text-sm text-[#101828] focus:outline-none`}
                    />
                    {errors.grace_marks_max && <span className="text-xs text-red-500">{errors.grace_marks_max.message}</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
              <h3 className="text-base font-bold text-[#101828] flex items-center gap-2 text-[#0e1680]">
                Detention Criteria
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-[#344054]">Detention Criteria Description</label>
                  <textarea
                    {...register("detention_criteria")}
                    placeholder="e.g. Minimum 75% attendance required and maximum 4 active backlogs allowed..."
                    rows={3}
                    className={`w-full px-4 py-3 bg-white border ${errors.detention_criteria ? "border-red-500" : "border-[#d0d5dd]"} rounded-lg shadow-sm text-sm text-[#101828] focus:outline-none resize-none`}
                  />
                  {errors.detention_criteria && <span className="text-xs text-red-500">{errors.detention_criteria.message}</span>}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-gray-100 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab("add")}
                className="px-6 py-3 border border-[#d0d5dd] hover:bg-gray-50 rounded-lg text-[15px] font-semibold text-[#344054] transition-all flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Back to Step 1
              </button>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="px-8 py-3 bg-[#0e1680] text-white rounded-lg font-bold text-[15px] hover:bg-[#0a1060] transition-all flex items-center gap-2 hover:shadow-lg shadow-[#0e1680]/20 duration-300 disabled:opacity-70"
              >
                {isSubmitting || loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 size={18} />}
                Save Final Configuration
              </button>
            </div>
          </div>
        )}
      </form>

      {activeTab === "view" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300 px-2 max-w-[1049px]">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <button
              onClick={() => setActiveTab("add")}
              className="bg-[#0e1680] text-white px-6 py-3 rounded-lg font-bold text-[15px] hover:bg-[#0a1060] transition-all flex items-center gap-2 shadow-md shrink-0 w-max"
            >
              <Plus size={18} /> Add Exam Pattern Configuration
            </button>

            <div className="flex flex-wrap items-center gap-3 justify-end flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-[260px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pattern..."
                  className="pl-4 pr-10 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20 text-[#101828]"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              </div>

              <div className="relative">
                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  className="pl-4 pr-10 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                >
                  <option value="ALL">All Semesters</option>
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="relative">
                <select
                  value={filterScheme}
                  onChange={(e) => setFilterScheme(e.target.value)}
                  className="pl-4 pr-10 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#344054] font-medium appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0e1680]/20"
                >
                  <option value="ALL">All Schemes</option>
                  <option value="Absolute">Absolute</option>
                  <option value="Relative">Relative</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-6 py-5 border-b border-[#eaecf0] bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-[#101828]">Exam Pattern Configuration List</h3>
                <span className="bg-[#e5e7fb] text-[#070b5c] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {filteredData.length}
                </span>
              </div>
              <button onClick={() => fetchExamPatterns()} className="text-gray-400 hover:text-[#0e1680] transition-colors">
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#f9fafb]">
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-gray-200">Pattern Name</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-gray-200">Applicable Scheme</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-gray-200">Semester</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-gray-200">Academic Year</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-gray-200 text-center">Grace Marks</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-gray-200">Marking Type</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-gray-200 text-center">Detention</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-gray-200 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && records.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-8 py-12 text-center">
                        <Loader2 className="w-8 h-8 text-[#0e1680] animate-spin mx-auto" />
                        <p className="mt-2 text-[#667085]">Loading...</p>
                       </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-8 py-6 text-[15px] font-medium text-center text-[#a49d9d]">
                        No Data Found
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((row) => (
                      <tr key={row.pattern_id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-[#101828]">
                          {row.pattern_name}
                        </td>
                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-[#475467]">
                          {getProgrammeName(row.programm_id, row.programme_name)}
                        </td>
                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-[#475467]">
                          {row.semester}
                        </td>
                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-[#475467]">
                          {row.academic_year}
                        </td>
                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              row.grace_marks_allowed === 1
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-50 text-gray-500 border border-gray-200"
                            }`}>
                              {row.grace_marks_allowed === 1 ? `Allowed (${row.grace_marks_max})` : "Disallowed"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 bg-[#e5e7fb] text-[#070b5c] text-xs font-bold rounded-md">
                              {row.grading_type}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                              {row.total_marks || 0} Marks
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            <span className={`w-2.5 h-2.5 rounded-full ${row.detention_criteria && row.detention_criteria !== "None" ? "bg-red-500" : "bg-gray-300"}`} title={row.detention_criteria} />
                          </div>
                        </td>
                        <td className="px-8 py-6 text-[15px] font-medium whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setSelectedRecord(row); setModalState("view"); }}
                              className="p-1.5 text-gray-400 hover:text-[#0e1680] hover:bg-[#f2f3fd] rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEditClick(row)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit Pattern"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirm(row)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Pattern"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {filteredData.length > 0 && (
              <div className="px-6 py-5 flex items-center justify-between border-t border-[#eaecf0] bg-white">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ArrowLeft size={16} /> Previous
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof page === "number" && setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        page === currentPage
                          ? "bg-[#0e1680] text-white shadow-sm font-semibold"
                          : page === "..."
                            ? "text-gray-400 cursor-default"
                            : "text-[#667085] hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals remain the same as your existing code */}
      {modalState === "add-success" && (
        <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[510px] min-h-[424px] rounded-[24px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] px-5 py-[45px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-[28px] p-6 rounded-full bg-green-50 text-green-500">
              <div className="w-16 h-16 rounded-full border-[6px] border-green-500 flex items-center justify-center">
                <Check size={40} strokeWidth={4} />
              </div>
            </div>
            <h3 className="text-[24px] font-bold text-[#101828] mb-[28px] leading-tight px-4">
              Exam Pattern Configured successfully !
            </h3>
            <button onClick={() => setModalState(null)} className="w-full max-w-[320px] py-3.5 bg-[#0e1680] text-white font-bold rounded-lg hover:bg-[#0a1060] transition-all shadow-lg shadow-[#0e1680]/20">
              Back to List
            </button>
          </div>
        </div>
      )}

      {modalState === "edit-success" && (
        <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[510px] min-h-[424px] rounded-[24px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] px-5 py-[45px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-[28px] p-6 rounded-full bg-green-50 text-green-500">
              <div className="w-16 h-16 rounded-full border-[6px] border-green-500 flex items-center justify-center">
                <Check size={40} strokeWidth={4} />
              </div>
            </div>
            <h3 className="text-[24px] font-bold text-[#101828] mb-[28px] leading-tight px-4">
              Exam Pattern Edited successfully !
            </h3>
            <button onClick={() => setModalState(null)} className="w-full max-w-[320px] py-3.5 bg-[#0e1680] text-white font-bold rounded-lg hover:bg-[#0a1060] transition-all shadow-lg shadow-[#0e1680]/20">
              Back to List
            </button>
          </div>
        </div>
      )}

      {modalState === "delete-confirm" && (
        <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[510px] min-h-[424px] rounded-[24px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] px-5 py-[45px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-[28px] p-6 rounded-full bg-red-50 text-red-500">
              <AlertCircle size={64} strokeWidth={2} />
            </div>
            <h3 className="text-[24px] font-bold text-[#101828] mb-[28px] leading-tight px-4">
              Do you really want to delete this Exam Pattern ?
            </h3>
            <div className="flex gap-4 w-full max-w-[320px] justify-center">
              <button onClick={handleDeleteSubmit} disabled={loading} className="flex-1 py-3.5 bg-[#0e1680] text-white font-bold rounded-lg hover:bg-[#0a1060] transition-all shadow-lg shadow-[#0e1680]/20 disabled:opacity-70">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Delete"}
              </button>
              <button onClick={() => setModalState(null)} className="flex-1 py-3.5 bg-white border border-[#d0d5dd] text-[#344054] font-bold rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState === "delete-success" && (
        <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[510px] min-h-[424px] rounded-[24px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] px-5 py-[45px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="mb-[28px] p-6 rounded-full bg-green-50 text-green-500">
              <div className="w-16 h-16 rounded-full border-[6px] border-green-500 flex items-center justify-center">
                <Check size={40} strokeWidth={4} />
              </div>
            </div>
            <h3 className="text-[24px] font-bold text-[#101828] mb-[28px] leading-tight px-4">
              Exam Pattern deleted successfully!
            </h3>
            <button onClick={() => setModalState(null)} className="w-full max-w-[320px] py-3.5 bg-[#0e1680] text-white font-bold rounded-lg hover:bg-[#0a1060] transition-all shadow-lg shadow-[#0e1680]/20">
              Back to List
            </button>
          </div>
        </div>
      )}

      {modalState === "view" && selectedRecord && (
        <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[760px] max-h-[90vh] rounded-[24px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-6 py-5 border-b border-[#eaecf0] bg-white flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#101828]">Exam Pattern Details</h3>
              <button onClick={() => setModalState(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 custom-scrollbar text-[#101828]">
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-[#0e1680] uppercase tracking-wider border-b border-gray-100 pb-1">Basic Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="block text-gray-500 font-medium">Pattern Name</span><span className="font-semibold">{selectedRecord.pattern_name}</span></div>
                  <div><span className="block text-gray-500 font-medium">Applicable Scheme / Program</span><span className="font-semibold">{getProgrammeName(selectedRecord.programm_id, selectedRecord.programme_name)}</span></div>
                  <div><span className="block text-gray-500 font-medium">Grading Type</span><span className="font-semibold">{selectedRecord.grading_type}</span></div>
                  <div><span className="block text-gray-500 font-medium">Passing Criteria</span><span className="font-semibold">{selectedRecord.passing_criteria}</span></div>
                  <div><span className="block text-gray-500 font-medium">Semester</span><span className="font-semibold">{selectedRecord.semester}</span></div>
                  <div><span className="block text-gray-500 font-medium">Academic Year</span><span className="font-semibold">{selectedRecord.academic_year}</span></div>
                  <div className="col-span-2"><span className="block text-gray-500 font-medium">Rounding Rule</span><span className="font-semibold">{selectedRecord.rounding_rule || "None Specified"}</span></div>
                  <div className="col-span-2"><span className="block text-gray-500 font-medium">ATKT Promotion Rule</span><span className="font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-lg block border border-gray-100 mt-1">{selectedRecord.atkt_rule}</span></div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <h4 className="text-sm font-bold text-[#0e1680] uppercase tracking-wider border-b border-gray-100 pb-1">Marking Scheme</h4>
                <div className="grid grid-cols-5 gap-2 text-center text-sm">
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100"><span className="block text-[10px] text-gray-500 font-bold uppercase">FA</span><span className="text-base font-bold text-[#0e1680]">{selectedRecord.fa_marks ?? 0}</span></div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100"><span className="block text-[10px] text-gray-500 font-bold uppercase">SA</span><span className="text-base font-bold text-[#0e1680]">{selectedRecord.sa_marks ?? 0}</span></div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100"><span className="block text-[10px] text-gray-500 font-bold uppercase">TW</span><span className="text-base font-bold text-[#0e1680]">{selectedRecord.term_work ?? 0}</span></div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100"><span className="block text-[10px] text-gray-500 font-bold uppercase">PR</span><span className="text-base font-bold text-[#0e1680]">{selectedRecord.practical ?? 0}</span></div>
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100"><span className="block text-[10px] text-gray-500 font-bold uppercase">OR</span><span className="text-base font-bold text-[#0e1680]">{selectedRecord.oral ?? 0}</span></div>
                </div>
                <div className="flex items-center justify-between bg-[#f8f9fc] p-3 rounded-lg border border-gray-100 text-sm mt-1">
                  <span className="font-semibold text-gray-700">Total Component Marks:</span>
                  <span className="text-lg font-extrabold text-[#0e1680]">{selectedRecord.total_marks ?? 0} Marks</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <h4 className="text-sm font-bold text-[#0e1680] uppercase tracking-wider border-b border-gray-100 pb-1">Policies &amp; Criteria</h4>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Grace Marks Policy</span>
                    {selectedRecord.grace_marks_allowed === 1 ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between"><span className="text-gray-500">Allowed Max:</span><span className="font-semibold text-green-700">{selectedRecord.grace_marks_max} Marks</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Grace Type:</span><span className="font-semibold">{selectedRecord.grace_type || "General"}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Eligibility:</span><span className="font-semibold">{selectedRecord.grace_eligibility || "Near Pass"}</span></div>
                      </div>
                    ) : (<span className="text-gray-400 font-medium italic">Grace Marks policy is disallowed.</span>)}
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Detention Criteria</span>
                    <p className="text-gray-700 leading-relaxed text-sm">{selectedRecord.detention_criteria || "None"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-[#fcfcfd] flex justify-end">
              <button onClick={() => setModalState(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors text-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {modalState === "edit" && editRecordId && (
        <div className="fixed inset-0 bg-[#02053d]/40 backdrop-blur-[8px] z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-[760px] max-h-[90vh] rounded-[24px] shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-6 py-5 border-b border-[#eaecf0] bg-white flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#101828] flex items-center gap-2">Edit Exam Pattern <Pencil size={18} className="text-gray-400" /></h3>
              <button onClick={() => setModalState(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleEditSave} className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6 custom-scrollbar text-[#101828]">
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold text-[#0e1680] uppercase tracking-wider border-b border-gray-100 pb-1">1. Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[12px] font-semibold text-[#344054]">Pattern Name</label>
                    <input type="text" value={editForm.pattern_name || ""} onChange={(e) => setEditForm({ ...editForm, pattern_name: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm" />
                    {editErrors.pattern_name && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {editErrors.pattern_name}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#344054]">Applicable Scheme / Program</label>
                    <div className="relative">
                      <select value={editForm.programm_id || ""} onChange={(e) => setEditForm({ ...editForm, programm_id: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm appearance-none pr-8">
                        {programmes.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#344054]">Grading Type</label>
                    <div className="relative">
                      <select value={editForm.grading_type || "Absolute"} onChange={(e) => setEditForm({ ...editForm, grading_type: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm appearance-none pr-8">
                        <option value="Absolute">Absolute</option>
                        <option value="Relative">Relative</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#344054]">Passing Criteria</label>
                    <div className="relative">
                      <select value={editForm.passing_criteria || "CGPA"} onChange={(e) => setEditForm({ ...editForm, passing_criteria: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm appearance-none pr-8">
                        <option value="CGPA">CGPA Based</option>
                        <option value="Percentage">Percentage Based</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#344054]">Rounding Rule</label>
                    <input type="text" value={editForm.rounding_rule || ""} onChange={(e) => setEditForm({ ...editForm, rounding_rule: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#344054]">Semester</label>
                    <div className="relative">
                      <select value={editForm.semester || "1st Semester"} onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm appearance-none pr-8">
                        {SEMESTERS.map((s) => (<option key={s} value={s}>{s}</option>))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#344054]">Academic Year</label>
                    <div className="relative">
                      <select value={editForm.academic_year || "2025-26"} onChange={(e) => setEditForm({ ...editForm, academic_year: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm appearance-none pr-8">
                        {ACADEMIC_YEARS.map((y) => (<option key={y} value={y}>{y}</option>))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[12px] font-semibold text-[#344054]">ATKT Rule</label>
                    <textarea value={editForm.atkt_rule || ""} onChange={(e) => setEditForm({ ...editForm, atkt_rule: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm resize-none" />
                    {editErrors.atkt_rule && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {editErrors.atkt_rule}</span>}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-[#0e1680] uppercase tracking-wider border-b border-gray-100 pb-1">2. Marking Scheme Components</h4>
                <div className="grid grid-cols-5 gap-2">
                  <div><label className="text-[10px] font-semibold text-[#475467]">FA</label><input type="number" value={editForm.fa_marks || 0} onChange={(e) => setEditForm({ ...editForm, fa_marks: Number(e.target.value) })} className="w-full px-2.5 py-1.5 bg-white border border-[#d0d5dd] rounded-lg text-sm" /></div>
                  <div><label className="text-[10px] font-semibold text-[#475467]">SA</label><input type="number" value={editForm.sa_marks || 0} onChange={(e) => setEditForm({ ...editForm, sa_marks: Number(e.target.value) })} className="w-full px-2.5 py-1.5 bg-white border border-[#d0d5dd] rounded-lg text-sm" /></div>
                  <div><label className="text-[10px] font-semibold text-[#475467]">TW</label><input type="number" value={editForm.term_work || 0} onChange={(e) => setEditForm({ ...editForm, term_work: Number(e.target.value) })} className="w-full px-2.5 py-1.5 bg-white border border-[#d0d5dd] rounded-lg text-sm" /></div>
                  <div><label className="text-[10px] font-semibold text-[#475467]">PR</label><input type="number" value={editForm.practical || 0} onChange={(e) => setEditForm({ ...editForm, practical: Number(e.target.value) })} className="w-full px-2.5 py-1.5 bg-white border border-[#d0d5dd] rounded-lg text-sm" /></div>
                  <div><label className="text-[10px] font-semibold text-[#475467]">OR</label><input type="number" value={editForm.oral || 0} onChange={(e) => setEditForm({ ...editForm, oral: Number(e.target.value) })} className="w-full px-2.5 py-1.5 bg-white border border-[#d0d5dd] rounded-lg text-sm" /></div>
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold text-[#0e1680] uppercase tracking-wider border-b border-gray-100 pb-1">3. Grace Marks &amp; Detention Policies</h4>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#344054]">Allow Grace Marks</span>
                  <button type="button" onClick={() => setEditForm({ ...editForm, grace_marks_allowed: editForm.grace_marks_allowed === 1 ? 0 : 1 })} className={`w-11 h-6 rounded-full relative transition-colors ${editForm.grace_marks_allowed === 1 ? "bg-[#0e1680]" : "bg-gray-300"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${editForm.grace_marks_allowed === 1 ? "right-0.5" : "left-0.5"}`}></div>
                  </button>
                </div>
                {editForm.grace_marks_allowed === 1 && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-1 duration-200">
                    <div><label className="text-[12px] font-semibold text-[#344054]">Grace Type</label><input type="text" value={editForm.grace_type || "General"} onChange={(e) => setEditForm({ ...editForm, grace_type: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm" /></div>
                    <div><label className="text-[12px] font-semibold text-[#344054]">Max Grace Marks Allowed</label><input type="number" value={editForm.grace_marks_max || 0} onChange={(e) => setEditForm({ ...editForm, grace_marks_max: Number(e.target.value) })} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm" /></div>
                  </div>
                )}
                <div className="flex flex-col gap-1.5 mt-2">
                  <label className="text-[12px] font-semibold text-[#344054]">Detention Criteria Description</label>
                  <textarea value={editForm.detention_criteria || ""} onChange={(e) => setEditForm({ ...editForm, detention_criteria: e.target.value })} rows={2} className="w-full px-3 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm resize-none" />
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-2 border-t border-gray-100 gap-3">
                <button type="button" onClick={() => setModalState(null)} className="px-5 py-2.5 border border-[#d0d5dd] text-[#344054] font-semibold rounded-lg text-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={isEditing} className="px-6 py-2.5 bg-[#0e1680] text-white font-bold rounded-lg text-sm hover:bg-[#0a1060] transition-colors disabled:opacity-70 flex items-center gap-2">
                  {isEditing ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}