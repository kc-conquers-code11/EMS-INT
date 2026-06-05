import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Check, Eye, Trash2, Pencil, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import {  
  type Programme, 
  type ProgrammeModalMode, 
  type ProgrammeStatusModal 
} from "../../../types/COE/programme";
import { programmeSchema, type ProgrammeFormValues } from "../../../schemas/COE/programmeSchema";
import { TabNavigation } from "../../../components/screens/TabNavigation";
import { FeedbackModal } from "../../../components/modals/FeedbackModal";
import { ViewProgrammeModal, EditProgrammeModal } from "../../../components/modals/Programme/ProgrammeModals";
import { SearchFilters } from "../../../components/screens/SearchFilters";
import { getProgrammes, createProgramme, deleteProgramme } from "../../../services/programme/programmeApiService";
import { getDepartmentDropdown } from "../../../services/department/departmentApiService";
import { useUserScope } from "../../../hooks/useUserScope";

const ITEMS_PER_PAGE = 10;



export default function ProgrammeDetails() {
  const { institutionId, isUnrestricted } = useUserScope();
  const [activeTab, setActiveTab] = useState<"add" | "view">("add");
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<"ALL" | "UG" | "PG">("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [modalMode, setModalMode] = useState<ProgrammeModalMode>(null);
  const [statusModal, setStatusModal] = useState<ProgrammeStatusModal>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ProgrammeFormValues>({
    resolver: zodResolver(programmeSchema) as any,
    defaultValues: {
      programme_name: "",
      programme_code: "",
      degree_type: "UG",
      duration_years: 0,
      total_semesters: 0,
      approved_intake: 0,
      depart_id: "",
      institution_id: institutionId || "",
      status: true
    }
  });

  const selectedDepartId = watch("depart_id");
  const selectedDeptName = departments.find(d => d.depart_id === selectedDepartId)?.depart_name || "";

  useEffect(() => {
    if (institutionId && !isUnrestricted) {
      setValue("institution_id", institutionId);
    }
  }, [institutionId, isUnrestricted, setValue]);

  useEffect(() => {
    fetchProgrammes();
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartmentDropdown();
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      setDepartments(list);
    } catch (err) {
      console.error('Failed to fetch departments', err);
      setDepartments([]);
    }
  };

  const fetchProgrammes = async () => {
    try {
      const response = await getProgrammes();
      const list = Array.isArray(response) ? response : (response?.data ?? []);
      setProgrammes(list);
    } catch (err) {
      console.error('Failed to fetch programmes', err);
      setProgrammes([]);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = async (data: ProgrammeFormValues) => {
    try {
      await createProgramme(data);
      await fetchProgrammes();
      setStatusModal("add-success");
      reset();
      setActiveTab("view");
    } catch (err) {
      console.error('Failed to create programme', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedProgramme) return;
    try {
      await deleteProgramme(selectedProgramme.programm_id);
      await fetchProgrammes();
      setStatusModal("delete-success");
      setSelectedProgramme(null);
    } catch (err) {
      console.error('Failed to delete programme', err);
    }
  };

  const handleEditSuccess = () => {
    setModalMode(null);
    setStatusModal("edit-success");
    fetchProgrammes();
  };

  const toggleDepartment = (deptId: string) => {
    setValue("depart_id", deptId, { shouldValidate: true });
    
    // Automatically set institution_id based on selected department
    const dept = departments.find(d => d.depart_id === deptId);
    if (dept && dept.institution_id) {
      setValue("institution_id", dept.institution_id);
    }
    
    setIsDropdownOpen(false);
  };

  const openModal = (mode: ProgrammeModalMode, programme?: Programme) => {
    if (programme) {
      setSelectedProgramme(programme);
      if (mode === "edit") {
        setValue("programme_name", programme.programme_name);
        setValue("programme_code", programme.programme_code || '');
        setValue("degree_type", programme.degree_type || "UG");
        setValue("duration_years", programme.duration_years || 0);
        setValue("total_semesters", programme.total_semesters || 0);
        setValue("approved_intake", programme.approved_intake || 0);
        setValue("depart_id", programme.depart_id);
      }
    } else {
      setSelectedProgramme(null);
      reset();
    }
    setModalMode(mode);
  };

  const closeModal = () => {
    setSelectedProgramme(null);
    setModalMode(null);
  };

  const openStatusModal = (mode: ProgrammeStatusModal, programme?: Programme) => {
    if (programme) setSelectedProgramme(programme);
    setStatusModal(mode);
  };

  const filteredData = programmes.filter(p => {
    const pName = p.programme_name || "";
    const pCode = p.programme_code || "";
    const matchesSearch = pName.toLowerCase().includes(searchQuery.toLowerCase()) || pCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === "ALL" || p.degree_type === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterLevel]);

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
          Programme Details
        </h1>

        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          addLabel="Add Programme" 
        />
      </div>

      {activeTab === "add" ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 bg-white p-10 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-2">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-[#344054]">Enter Programme Name</label>
              <input 
                {...register("programme_name")}
                type="text" 
                placeholder="Bachelor of Engineering" 
                className={`w-full px-4 py-3.5 bg-white border ${errors.programme_name ? 'border-red-500' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
              />
              {errors.programme_name && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.programme_name.message}</span>}
            </div>

            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-[#344054]">Programme Code</label>
              <input 
                {...register("programme_code")}
                type="text" 
                placeholder="BE-IT" 
                className={`w-full px-4 py-3.5 bg-white border ${errors.programme_code ? 'border-red-500' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
              />
              {errors.programme_code && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.programme_code.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] font-medium text-[#344054]">Duration (Years)</label>
                <input 
                  {...register("duration_years", { valueAsNumber: true })}
                  type="number" 
                  min="1"
                  placeholder="4" 
                  className={`w-full px-4 py-3.5 bg-white border ${errors.duration_years ? 'border-red-500' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
                />
                {errors.duration_years && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.duration_years.message}</span>}
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] font-medium text-[#344054]">Total Semesters</label>
                <input 
                  {...register("total_semesters", { valueAsNumber: true })}
                  type="number" 
                  min="1"
                  placeholder="8" 
                  className={`w-full px-4 py-3.5 bg-white border ${errors.total_semesters ? 'border-red-500' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
                />
                {errors.total_semesters && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.total_semesters.message}</span>}
              </div>
            </div>

            <div className="flex flex-col gap-2.5 relative" ref={dropdownRef}>
              <label className="text-[16px] font-medium text-[#344054]">Department(s)</label>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3.5 bg-white border border-[#d0d5dd] rounded-lg shadow-sm text-[#101828] text-[16px] flex items-center justify-between cursor-pointer transition-all"
              >
                <span>{selectedDeptName || "Select Department"}</span>
                <ChevronDown size={20} className={`transition-transform text-[#687b96] ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              {errors.depart_id && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.depart_id.message}</span>}
              {isDropdownOpen && (
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-[#d0d5dd] rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 max-h-60 overflow-y-auto">
                  {departments.map((dept) => (
                    <div 
                      key={dept.depart_id}
                      onClick={() => toggleDepartment(dept.depart_id)}
                      className="flex items-center justify-between px-4 py-3.5 hover:bg-[#f2f3fd] cursor-pointer border-b last:border-b-0 border-[#f2f4f7] transition-colors group"
                    >
                      <span className={`text-[15px] ${selectedDepartId === dept.depart_id ? 'text-[#0e1680] font-semibold' : 'text-[#687b96]'}`}>
                        {dept.depart_name}
                      </span>
                      <div className={`size-5 rounded-md border flex items-center justify-center ${selectedDepartId === dept.depart_id ? 'bg-[#e5e7fb] border-[#0a106e]' : 'bg-white border-[#d0d5dd]'}`}>
                        {selectedDepartId === dept.depart_id && <Check size={14} className="text-[#0a106e]" strokeWidth={3} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-[#344054]">Approved Intake</label>
              <input 
                {...register("approved_intake", { valueAsNumber: true })}
                type="number" 
                min="0"
                placeholder="120" 
                className={`w-full px-4 py-3.5 bg-white border ${errors.approved_intake ? 'border-red-500' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
              />
              {errors.approved_intake && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.approved_intake.message}</span>}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="px-12 py-3.5 bg-[#0e1680] text-white rounded-lg font-bold text-[16px] shadow-lg shadow-[#0e1680]/20 hover:bg-[#0a1060] transition-all duration-300"
            >
              Add Programme
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-2">
          <SearchFilters 
            onSearch={(q) => setSearchQuery(q)} 
            filters={[
              { label: `Level: ${filterLevel}`, onClick: () => setFilterLevel(prev => prev === "ALL" ? "UG" : prev === "UG" ? "PG" : "ALL") }
            ]} 
          />

          <div className="bg-white border border-[#eaecf0] rounded-2xl overflow-hidden shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#f9fafb]">
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Programme Name</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Code</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Level</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Duration</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaecf0]">
                  {paginatedData.map((prog, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{prog.programme_name}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{prog.programme_code}</td>
                      <td className="px-8 py-6 text-[15px] font-medium">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${prog.degree_type === 'UG' ? 'bg-[#effbe7] text-[#095512]' : 'bg-[#e5e7fb] text-[#070b5c]'}`}>
                          {prog.degree_type}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{prog.duration_years} Years</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => openModal("view", prog as Programme)} className="p-2.5 text-[#667085] hover:text-[#0e1680] hover:bg-[#f2f3fd] rounded-xl transition-all"><Eye size={20} /></button>
                          <button onClick={() => openStatusModal("delete-confirm", prog as Programme)} className="p-2.5 text-[#667085] hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
                          <button onClick={() => openModal("edit", prog as Programme)} className="p-2.5 text-[#667085] hover:text-[#0e1680] hover:bg-[#f2f3fd] rounded-xl transition-all"><Pencil size={20} /></button>
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

      {/* Action Modals */}
      <ViewProgrammeModal 
        isOpen={modalMode === "view"} 
        onClose={closeModal} 
        data={selectedProgramme} 
      />

      <EditProgrammeModal 
        isOpen={modalMode === "edit"} 
        onClose={closeModal} 
        data={selectedProgramme} 
        onSave={handleEditSuccess} 
      />

      <FeedbackModal 
        isOpen={statusModal === "delete-confirm"} 
        onClose={() => setStatusModal(null)} 
        type="delete-confirm" 
        title="Do you really want to delete this Programme?" 
        onConfirm={handleDelete} 
      />

      <FeedbackModal 
        isOpen={statusModal === "add-success"} 
        onClose={() => setStatusModal(null)} 
        type="success" 
        title="Programme added successfully !!" 
      />

      <FeedbackModal 
        isOpen={statusModal === "edit-success"} 
        onClose={() => setStatusModal(null)} 
        type="success" 
        title="Programme edited successfully !!" 
      />

      <FeedbackModal 
        isOpen={statusModal === "delete-success"} 
        onClose={() => setStatusModal(null)} 
        type="success" 
        title="Programme deleted successfully !!" 
      />
    </div>
  );
}
