// src/components/modals/Institution/CreateCOEModal.tsx
import React, { useState, useEffect } from "react";
import type {
  Institution,
  CreateCOEData,
} from "../../../types/institution.types";

interface CreateCOEModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution | null;
  onCreateCOE: (data: CreateCOEData) => Promise<void>;
}

export const CreateCOEModal: React.FC<CreateCOEModalProps> = ({
  isOpen,
  onClose,
  institution,
  onCreateCOE,
}) => {
  const [formData, setFormData] = useState<CreateCOEData>({
    institution_id: institution?.institution_id || "",
    name: "",
    employee_id: "",
    email: "",
    phone_number: "",
    qualification: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && institution) {
      setFormData((prev) => ({
        ...prev,
        institution_id: institution.institution_id,
      }));
    }
  }, [isOpen, institution]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.employee_id.trim())
      newErrors.employee_id = "Employee ID is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    } else if (!/^\d{10,}$/.test(formData.phone_number)) {
      newErrors.phone_number = "Phone number must be at least 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onCreateCOE(formData);
      setFormData({
        institution_id: institution?.institution_id || "",
        name: "",
        employee_id: "",
        email: "",
        phone_number: "",
        qualification: "",
      });
      onClose();
    } catch (error) {
      console.error("Error creating COE:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass: string =
    "w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-base text-[#101828] placeholder-[#687b96] focus:outline-none focus:ring-1 focus:ring-[#0e1680] transition-all";
  const labelClass: string = "block text-sm font-medium text-[#344054] mb-1.5";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px]">
      <div className="bg-white rounded-[20px] shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 flex justify-between items-center border-b border-[#eaecf0]">
          <h3 className="text-xl font-bold text-[#0e1680]">
            Add Controller of Examinations (COE)
          </h3>
          <button
            onClick={onClose}
            className="text-[#667085] hover:text-[#344054] transition-colors p-1"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              Adding COE for <strong>{institution?.name}</strong>. The COE will
              receive an email with login credentials.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter COE full name"
                className={inputClass}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Employee ID *</label>
                <input
                  type="text"
                  value={formData.employee_id}
                  onChange={(e) =>
                    setFormData({ ...formData, employee_id: e.target.value })
                  }
                  placeholder="Enter employee ID"
                  className={inputClass}
                />
                {errors.employee_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.employee_id}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  placeholder="Enter phone number"
                  className={inputClass}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone_number}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
                className={inputClass}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Qualification</label>
              <input
                type="text"
                value={formData.qualification || ""}
                onChange={(e) =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
                placeholder="Enter qualification (e.g., Ph.D., M.Tech)"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-[#eaecf0]">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-[#0e1680] text-white rounded-lg font-semibold hover:bg-[#0a106e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create COE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
