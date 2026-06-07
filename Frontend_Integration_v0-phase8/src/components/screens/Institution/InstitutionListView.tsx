// src/components/screens/Institution/InstitutionListView.tsx
import React, { useState, useEffect } from "react";
import { ViewInstitutionModal } from "../../modals/Institution/ViewInstitutionModal";
import { EditInstitutionModal } from "../../modals/Institution/EditInstitutionModal";
import { InstitutionEditSuccessModal } from "../../modals/Institution/InstitutionEditSuccessModal";
import { DeleteInstitutionModal } from "../../modals/Institution/DeleteInstitutionModal";
import { DeleteInstitutionSuccessModal } from "../../modals/Institution/DeleteInstitutionSuccessModal";
import { CreateCOEModal } from "../../modals/Institution/CreateCOEModal";
import { COECreatedSuccessModal } from "../../modals/Institution/COECreatedSuccessModal";
import { institutionAPI, coeAPI } from "../../../services/api";
import type {
  Institution,
  CreateInstitutionData,
  CreateCOEData,
} from "../../../types/institution.types";

interface InstitutionListViewProps {
  institutions?: Institution[];
  onDelete?: (id: string) => void;
  onEdit?: (data: any) => void;
}

export const InstitutionListView: React.FC<InstitutionListViewProps> = ({
  institutions = [],
  onDelete,
  onEdit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isPermanentDeleteModalOpen, setIsPermanentDeleteModalOpen] =
    useState<boolean>(false);
  const [isCreateCOEModalOpen, setIsCreateCOEModalOpen] =
    useState<boolean>(false);
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [isDeleteSuccessModalOpen, setIsDeleteSuccessModalOpen] =
    useState<boolean>(false);
  const [isEditSuccessModalOpen, setIsEditSuccessModalOpen] =
    useState<boolean>(false);
  const [isCOECreatedModalOpen, setIsCOECreatedModalOpen] =
    useState<boolean>(false);
  const [institutionsList, setInstitutionsList] =
    useState<Institution[]>(institutions);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteType, setDeleteType] = useState<"soft" | "permanent">("soft");

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cityFilter, setCityFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>("");

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await institutionAPI.getAll();
      if (response.data.success && response.data.data) {
        setInstitutionsList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching institutions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInstitutions: Institution[] = institutionsList.filter(
    (inst) => {
      const matchesName = inst.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCity =
        cityFilter === "" ||
        inst.city?.toLowerCase().includes(cityFilter.toLowerCase());
      const matchesYear =
        yearFilter === "" || inst.establishment_year?.toString() === yearFilter;
      return matchesName && matchesCity && matchesYear;
    },
  );

  const handleView = (inst: Institution): void => {
    setSelectedInstitution(inst);
    setIsModalOpen(true);
  };

  const handleEditClick = (inst: Institution): void => {
    setSelectedInstitution(inst);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (
    inst: Institution,
    isPermanent: boolean = false,
  ): void => {
    setSelectedInstitution(inst);
    setDeleteType(isPermanent ? "permanent" : "soft");
    if (isPermanent) {
      setIsPermanentDeleteModalOpen(true);
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const handleCreateCOEClick = (inst: Institution): void => {
    setSelectedInstitution(inst);
    setIsCreateCOEModalOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (selectedInstitution?.institution_id) {
      try {
        if (deleteType === "permanent") {
          await institutionAPI.permanentDelete(
            selectedInstitution.institution_id,
          );
        } else {
          await institutionAPI.delete(selectedInstitution.institution_id);
        }
        if (onDelete) onDelete(selectedInstitution.institution_id);
        setIsDeleteModalOpen(false);
        setIsPermanentDeleteModalOpen(false);
        setIsDeleteSuccessModalOpen(true);
        fetchInstitutions();
      } catch (error: any) {
        console.error("Error deleting institution:", error);
        alert(error.response?.data?.message || "Error deleting institution");
        setIsDeleteModalOpen(false);
        setIsPermanentDeleteModalOpen(false);
      }
    }
  };

  const handleEditSave = async (
    data: Partial<CreateInstitutionData>,
  ): Promise<void> => {
    if (selectedInstitution?.institution_id) {
      try {
        await institutionAPI.update(selectedInstitution.institution_id, data);
        if (onEdit) onEdit(data);
        setIsEditModalOpen(false);
        setIsEditSuccessModalOpen(true);
        fetchInstitutions();
      } catch (error) {
        console.error("Error updating institution:", error);
        alert("Error updating institution");
      }
    }
  };

  const handleCreateCOE = async (coeData: CreateCOEData): Promise<void> => {
    try {
      await coeAPI.create(coeData);
      setIsCreateCOEModalOpen(false);
      setIsCOECreatedModalOpen(true);
    } catch (error: any) {
      console.error("Error creating COE:", error);
      alert(error.response?.data?.message || "Error creating COE");
    }
  };

  return (
    <div className="flex flex-col gap-4 text-gray-700">
      {/* Filter Row */}
      <div className="flex justify-end gap-4 mb-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#0e1680] text-sm w-56 placeholder-gray-400 bg-white shadow-sm hover:border-gray-300 transition-all"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Filter by City"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-[#0e1680] text-sm w-48 placeholder-gray-400 bg-white shadow-sm hover:border-gray-300 transition-all"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="appearance-none border border-gray-200 rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-1 focus:ring-[#0e1680] text-sm bg-white text-gray-700 min-w-[160px] cursor-pointer shadow-sm hover:border-gray-300 transition-all"
          >
            <option value="">Established Year</option>
            {Array.from(
              new Set(institutionsList.map((i) => i.establishment_year)),
            )
              .sort()
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-[17px] text-[#0e1680]">
              Institutions List
            </h2>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {filteredInstitutions.length}
            </span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold text-[11px]">
                  Institution Name
                </th>
                <th className="px-6 py-4 font-semibold text-[11px]">
                  Established Year
                </th>
                <th className="px-6 py-4 font-semibold text-[11px]">
                  Institution Code
                </th>
                <th className="px-6 py-4 font-semibold text-[11px]">
                  Website URL
                </th>
                <th className="px-6 py-4 font-semibold text-[11px]">
                  Official Email
                </th>
                <th className="px-6 py-4 font-semibold text-[11px] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm font-medium text-[#4F5B7B]">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredInstitutions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    {institutionsList.length === 0
                      ? "No institutions added yet."
                      : "No matches found for your filters."}
                  </td>
                </tr>
              ) : (
                filteredInstitutions.map((inst) => (
                  <tr
                    key={inst.institution_id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">{inst.name}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {inst.establishment_year || "N/A"}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      #{inst.institution_code || "N/A"}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {(inst.website_url || inst.websiteUrl || inst.website) ? (
                        <a
                          href={(inst.website_url || inst.websiteUrl || inst.website)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-500 hover:text-indigo-600 flex items-center gap-1.5 font-medium"
                        >
                          {(inst.website_url || inst.websiteUrl || inst.website)!.substring(0, 30)}...
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {inst.official_email || inst.officialEmail || inst.email || "N/A"}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-3.5 items-center">
                        <button
                          onClick={() => handleView(inst)}
                          className="text-gray-500 hover:text-[#0e1680] transition-colors"
                          title="View"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(inst, false)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                          title="Soft Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(inst, true)}
                          className="text-gray-500 hover:text-red-700 transition-colors"
                          title="Permanent Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 11v4m0 0v4m0-4h4m-4 0H8"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditClick(inst)}
                          className="text-gray-500 hover:text-[#0e1680] transition-colors"
                          title="Edit"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleCreateCOEClick(inst)}
                          className="text-gray-500 hover:text-green-600 transition-colors"
                          title="Add COE"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ViewInstitutionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedInstitution}
      />

      <EditInstitutionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        data={selectedInstitution}
        onSave={handleEditSave}
      />

      <InstitutionEditSuccessModal
        isOpen={isEditSuccessModalOpen}
        onClose={() => setIsEditSuccessModalOpen(false)}
      />

      <DeleteInstitutionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        institutionName={selectedInstitution?.name}
        isPermanent={false}
      />

      <DeleteInstitutionModal
        isOpen={isPermanentDeleteModalOpen}
        onClose={() => setIsPermanentDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        institutionName={selectedInstitution?.name}
        isPermanent={true}
      />

      <DeleteInstitutionSuccessModal
        isOpen={isDeleteSuccessModalOpen}
        onClose={() => setIsDeleteSuccessModalOpen(false)}
        isPermanent={deleteType === "permanent"}
      />

      <CreateCOEModal
        isOpen={isCreateCOEModalOpen}
        onClose={() => setIsCreateCOEModalOpen(false)}
        institution={selectedInstitution}
        onCreateCOE={handleCreateCOE}
      />

      <COECreatedSuccessModal
        isOpen={isCOECreatedModalOpen}
        onClose={() => setIsCOECreatedModalOpen(false)}
      />
    </div>
  );
};

// Default export for easier importing
export default InstitutionListView;
