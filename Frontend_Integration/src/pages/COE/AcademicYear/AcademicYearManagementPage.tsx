// src/pages/COE/AcademicYear/AcademicYearManagementPage.tsx
import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, Trash2, Pencil, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { 
  type AcademicYearModalType,
  type AcademicYearData 
} from "../../../types/COE/academic-year";
import { academicYearSchema, type AcademicYearFormValues } from "../../../schemas/COE/academicYearSchema";
import { TabNavigation } from "../../../components/screens/TabNavigation";
import { FeedbackModal } from "../../../components/modals/FeedbackModal";
import { ViewAcademicYearModal, EditAcademicYearModal } from "../../../components/modals/AcademicYear/AcademicYearModals";
import { SearchFilters } from "../../../components/screens/SearchFilters";
import { academicYearAPI } from "../../../services/acedmic/academicYearApi";

const ITEMS_PER_PAGE = 10;

export default function AcademicYear() {
  const [activeTab, setActiveTab] = useState<"add" | "view">("add");
  const [modalType, setModalType] = useState<AcademicYearModalType>(null);
  const [selectedYear, setSelectedYear] = useState<AcademicYearData | null>(null);
  const [pendingData, setPendingData] = useState<AcademicYearFormValues | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      academic_name: "",
      is_admission: 1,
      current_ay: 0,
      start_date: "",
      end_date: ""
    }
  });

  const isAdmission = watch("is_admission");
  const currentAy = watch("current_ay");

  // Fetch academic years from API
  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const response = await academicYearAPI.getAll(1, 100);
      if (response.success) {
        setAcademicYears(response.data);
      }
    } catch (error) {
      console.error("Error fetching academic years:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "view") {
      fetchAcademicYears();
    }
  }, [activeTab]);

  const onSubmit: SubmitHandler<AcademicYearFormValues> = async (data) => {
    if (data.current_ay === 1) {
      const existingCurrentYear = academicYears.find(y => y.current_ay === 1);
      if (existingCurrentYear) {
        setPendingData(data);
        setModalType("current-year-conflict");
        return;
      }
    }
    
    try {
      const formattedData = {
        ...data,
        start_date: data.start_date,
        end_date: data.end_date,
      };
      
      const response = await academicYearAPI.create(formattedData);
      if (response.success) {
        setModalType("add-success");
        reset();
        if (activeTab === "view") {
          fetchAcademicYears();
        }
      }
    } catch (error: any) {
      console.error("Error creating academic year:", error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Failed to create academic year");
      }
    }
  };

  const confirmCurrentYearConflict = async (changeCurrent: boolean) => {
    if (pendingData) {
      if (!changeCurrent) {
        setModalType("action-cancelled");
        setPendingData(null);
        return;
      }
      
      try {
        const formattedData = {
          ...pendingData,
          start_date: pendingData.start_date,
          end_date: pendingData.end_date,
        };
        
        const response = await academicYearAPI.create(formattedData);
        if (response.success) {
          setModalType("add-success");
          reset();
          setPendingData(null);
          if (activeTab === "view") {
            fetchAcademicYears();
          }
        }
      } catch (error: any) {
        console.error("Error creating academic year:", error);
        alert("Failed to create academic year");
      }
    }
  };

  const handleEdit = async (data: AcademicYearFormValues) => {
    const academicId = selectedYear?.academic_id;
    if (!academicId) return;
    
    try {
      const formattedData = {
        ...data,
        start_date: data.start_date,
        end_date: data.end_date,
      };
      
      const response = await academicYearAPI.update(academicId, formattedData);
      if (response.success) {
        setModalType("edit-success");
        reset();
        fetchAcademicYears();
      }
    } catch (error: any) {
      console.error("Error updating academic year:", error);
      alert("Failed to update academic year");
    }
  };

  const handleDelete = async () => {
    const academicId = selectedYear?.academic_id;
    if (!academicId) return;
    
    try {
      const response = await academicYearAPI.delete(academicId);
      if (response.success) {
        setModalType("delete-success");
        fetchAcademicYears();
      }
    } catch (error: any) {
      console.error("Error deleting academic year:", error);
      alert("Failed to delete academic year");
    }
  };

  const openModal = (type: AcademicYearModalType, year?: AcademicYearData) => {
    if (year) {
      setSelectedYear(year);
      if (type === "edit") {
        setValue("academic_name", year.academic_name);
        setValue("start_date", year.start_date ? year.start_date.split('T')[0] : (year.startDate ? year.startDate.split('/').reverse().join('-') : ""));
        setValue("end_date", year.end_date ? year.end_date.split('T')[0] : (year.endDate ? year.endDate.split('/').reverse().join('-') : ""));
        setValue("is_admission", year.is_admission);
        setValue("current_ay", year.current_ay);
      }
    }
    setModalType(type);
  };

  const filteredData = academicYears.filter(p => {
    const matchesSearch = p.academic_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStartDate = true;
    let matchesEndDate = true;
    
    const pStart = new Date(p.start_date || p.startDate).getTime();
    const pEnd = new Date(p.end_date || p.endDate).getTime();
    
    if (filterStartDate) {
      matchesStartDate = pStart >= new Date(filterStartDate).getTime();
    }
    
    if (filterEndDate) {
      matchesEndDate = pEnd <= new Date(filterEndDate).getTime();
    }
    
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const displayTotalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStartDate, filterEndDate]);

  const getPageNumbers = () => {
    const pages = [];
    if (displayTotalPages <= 7) {
      for (let i = 1; i <= displayTotalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", displayTotalPages);
      } else if (currentPage >= displayTotalPages - 3) {
        pages.push(1, "...", displayTotalPages - 4, displayTotalPages - 3, displayTotalPages - 2, displayTotalPages - 1, displayTotalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", displayTotalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="flex flex-col gap-6 mb-8 px-2">
        <h1 className="text-[28px] font-semibold text-[#171822] tracking-tight">
          Academic Year Management
        </h1>

        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          addLabel="Add Academic Year" 
        />
      </div>

      {activeTab === "add" ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 bg-white p-10 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-2">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2.5">
              <label className="text-[16px] font-medium text-[#344054]">
                Enter Academic Year
              </label>
              <input 
                {...register("academic_name")}
                type="text" 
                placeholder="2025-26" 
                className={`w-full px-4 py-3.5 bg-white border ${errors.academic_name ? 'border-red-500 ring-1 ring-red-500' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all placeholder:text-[#687b96]`}
              />
              {errors.academic_name && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.academic_name.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-10">
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] font-medium text-[#344054]">
                  Select Start Date
                </label>
                <input 
                  {...register("start_date")}
                  type="date" 
                  className={`w-full px-4 py-3.5 bg-white border ${errors.start_date ? 'border-red-500 ring-1 ring-red-500' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
                />
                {errors.start_date && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.start_date.message}</span>}
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[16px] font-medium text-[#344054]">
                  Select End Date
                </label>
                <input 
                  {...register("end_date")}
                  type="date" 
                  className={`w-full px-4 py-3.5 bg-white border ${errors.end_date ? 'border-red-500 ring-1 ring-red-500' : 'border-[#d0d5dd]'} rounded-lg shadow-sm text-[#101828] text-[16px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 transition-all`}
                />
                {errors.end_date && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.end_date.message}</span>}
              </div>
            </div>

            <div className="flex gap-12 pt-2">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div 
                  onClick={() => setValue("is_admission", isAdmission ? 0 : 1)}
                  className={`size-6 rounded-md border flex items-center justify-center transition-all ${isAdmission ? 'bg-[#0e1680] border-[#0e1680]' : 'bg-white border-[#d0d5dd] group-hover:border-[#0e1680]'}`}
                >
                  {isAdmission === 1 && <Check size={16} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-[16px] font-medium text-[#344054] group-hover:text-[#0e1680] transition-colors">Is Admission</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer group">
                <div 
                  onClick={() => setValue("current_ay", currentAy ? 0 : 1)}
                  className={`size-6 rounded-md border flex items-center justify-center transition-all ${currentAy ? 'bg-[#0e1680] border-[#0e1680]' : 'bg-white border-[#d0d5dd] group-hover:border-[#0e1680]'}`}
                >
                  {currentAy === 1 && <Check size={16} className="text-white" strokeWidth={3} />}
                </div>
                <span className="text-[16px] font-medium text-[#344054] group-hover:text-[#0e1680] transition-colors">Current Academic Year</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="px-12 py-3.5 bg-[#0e1680] text-white rounded-lg font-bold text-[16px] shadow-lg shadow-[#0e1680]/20 hover:bg-[#0a1060] transition-all duration-300"
            >
              Add Academic Year
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-2">
          <SearchFilters 
            onSearch={(q) => setSearchQuery(q)} 
            filters={[]} 
            customFilters={
              <>
                <div className="flex items-center bg-white border border-[#d0d5dd] rounded-lg px-3 overflow-hidden shadow-sm hover:bg-gray-50 transition-colors">
                  <span className="text-[13px] font-semibold text-[#667085] mr-2">Start Date:</span>
                  <input 
                    type="date" 
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="py-3 text-[14px] text-[#101828] focus:outline-none bg-transparent cursor-pointer"
                  />
                </div>
                <div className="flex items-center bg-white border border-[#d0d5dd] rounded-lg px-3 overflow-hidden shadow-sm hover:bg-gray-50 transition-colors">
                  <span className="text-[13px] font-semibold text-[#667085] mr-2">End Date:</span>
                  <input 
                    type="date" 
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="py-3 text-[14px] text-[#101828] focus:outline-none bg-transparent cursor-pointer"
                  />
                </div>
              </>
            }
          />

          <div className="bg-white border border-[#eaecf0] rounded-2xl overflow-hidden shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#f9fafb]">
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Academic year</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Start date</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">End date</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0]">Status</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] border-b border-[#eaecf0] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaecf0]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0e1680]"></div>
                          <span className="text-gray-400">Loading academic years...</span>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-gray-400 font-medium">No academic years found.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((item, idx) => (
                      <tr key={item.academic_id || idx} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{item.academic_name}</td>
                        <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{item.start_date || item.startDate}</td>
                        <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{item.end_date || item.endDate}</td>
                        <td className="px-8 py-6 text-[15px] font-medium">
                          <span className={`px-4 py-1 rounded-full text-xs font-semibold ${
                            item.current_ay === 1 ? 'bg-[#effbe7] text-[#095512]' : 'bg-[rgba(255,0,0,0.1)] text-[#c00000]'
                          }`}>
                            {item.current_ay === 1 ? 'Current' : 'Past'}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading && paginatedData.length > 0 && (
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, displayTotalPages))}
                  disabled={currentPage === displayTotalPages}
                  className="flex items-center gap-2 px-5 py-2.5 border border-[#d0d5dd] rounded-lg text-sm font-semibold text-[#344054] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <ViewAcademicYearModal 
        isOpen={modalType === "view"} 
        onClose={() => setModalType(null)} 
        data={selectedYear} 
      />

      <EditAcademicYearModal 
        isOpen={modalType === "edit"} 
        onClose={() => setModalType(null)} 
        register={register} 
        onSubmit={handleSubmit(handleEdit)} 
      />

      <FeedbackModal 
        isOpen={modalType === "delete-confirm"} 
        onClose={() => setModalType(null)} 
        type="delete-confirm" 
        title="Do you really want to delete this Academic Year?" 
        onConfirm={handleDelete} 
      />

      <FeedbackModal 
        isOpen={modalType === "add-success"} 
        onClose={() => setModalType(null)} 
        type="success" 
        title="Academic Year added successfully !!" 
      />

      <FeedbackModal 
        isOpen={modalType === "edit-success"} 
        onClose={() => setModalType(null)} 
        type="success" 
        title="Academic Year edited successfully !!" 
      />

      <FeedbackModal 
        isOpen={modalType === "delete-success"} 
        onClose={() => setModalType(null)} 
        type="success" 
        title="Academic Year deleted successfully !!" 
      />

      <FeedbackModal 
        isOpen={modalType === "current-year-conflict"} 
        onClose={() => confirmCurrentYearConflict(false)} 
        type="warning-confirm" 
        title="A current academic year is already defined. Do you want to change it?" 
        onConfirm={() => confirmCurrentYearConflict(true)}
        confirmLabel="Yes, Change it"
        cancelLabel="No"
      />

      <FeedbackModal 
        isOpen={modalType === "action-cancelled"} 
        onClose={() => setModalType(null)} 
        type="error" 
        title="Action cancelled." 
      />
    </div>
  );
}
