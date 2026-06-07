// src/components/modals/Institution/EditInstitutionModal.tsx
import React, { useState, useEffect } from "react";
import type {
  Institution,
  CreateInstitutionData,
} from "../../../types/institution.types";

interface EditInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Institution | null;
  onSave?: (data: Partial<CreateInstitutionData>) => void;
}

const labelClass: string = "block text-sm font-medium text-[#344054] mb-1.5";
const inputClass: string =
  "w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-base text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] focus:outline-none focus:ring-1 focus:ring-[#0e1680] transition-all";

interface EditableCheckboxProps {
  label: string;
  checked: boolean;
  onChange?: (val: boolean) => void;
}

const EditableCheckbox: React.FC<EditableCheckboxProps> = ({
  label,
  checked,
  onChange,
}) => (
  <label className="flex items-center gap-2.5 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className="hidden"
    />
    <div
      className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all ${checked ? "border-[#0a106e] bg-[#e5e7fb]" : "border-[#d0d5dd] bg-white"}`}
    >
      {checked && (
        <svg className="w-3 h-3 text-[#0a106e]" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 6.5L4.5 9L10 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
    <span className="text-sm font-semibold text-[#344054]">{label}</span>
  </label>
);

export const EditInstitutionModal: React.FC<EditInstitutionModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<CreateInstitutionData>>({
    name: "",
    institution_code: "",
    establishment_year: "",
    institution_type: "",
    accreditation: { nba: false, naac: false, aicte: false },
    courses: { undergraduate: false, postgraduate: false, phd: false },
    phone_number: "",
    website_url: "",
    road: "",
    official_email: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        institution_code: data.institution_code || "",
        establishment_year: data.establishment_year || "",
        institution_type: data.institution_type || "",
        accreditation: data.accreditation || {
          nba: false,
          naac: false,
          aicte: false,
        },
        courses: data.courses || {
          undergraduate: false,
          postgraduate: false,
          phd: false,
        },
        phone_number: data.phone_number || "",
        website_url: data.website_url || "",
        road: data.road || "",
        official_email: data.official_email || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        affiliated_university: data.affiliated_university || "",
      });
    }
  }, [data]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px]">
      <div className="bg-white rounded-[20px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08),0px_4px_6px_0px_rgba(16,24,40,0.03)] w-full max-w-[866px] max-h-[90vh] overflow-y-auto mx-4 relative">
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 flex justify-between items-center z-10 border-b border-[#eaecf0]">
          <div className="flex items-center gap-4.5">
            <h3 className="text-[16px] font-bold text-[#2c3e50] leading-6">
              Edit Institution Details
            </h3>
            <svg
              className="w-[19px] h-[19px] text-[#2c3e50]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>
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
        <div className="p-5 flex flex-col gap-[18.9px]">
          {/* Row 1: Institution Name & Code/ID */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Institution Name</label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Institution Code/ID</label>
              <input
                value={formData.institution_code}
                onChange={(e) =>
                  setFormData({ ...formData, institution_code: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 2: Establishment Year & Institution Type */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Establishment Year</label>
              <input
                value={formData.establishment_year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    establishment_year: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Institution Type</label>
              <input
                value={formData.institution_type}
                onChange={(e) =>
                  setFormData({ ...formData, institution_type: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 3: Affiliated University */}
          <div>
            <label className={labelClass}>Affiliated University</label>
            <input
              value={formData.affiliated_university}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  affiliated_university: e.target.value,
                })
              }
              className={inputClass}
              placeholder="Enter affiliated university"
            />
          </div>

          {/* Row 4: Accreditation & Courses Offered */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Accreditation</label>
              <div className="flex items-center gap-5 mt-1">
                <EditableCheckbox
                  label="NBA"
                  checked={formData.accreditation?.nba || false}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      accreditation: { ...formData.accreditation, nba: val },
                    })
                  }
                />
                <EditableCheckbox
                  label="NAAC"
                  checked={formData.accreditation?.naac || false}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      accreditation: { ...formData.accreditation, naac: val },
                    })
                  }
                />
                <EditableCheckbox
                  label="AICTE"
                  checked={formData.accreditation?.aicte || false}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      accreditation: { ...formData.accreditation, aicte: val },
                    })
                  }
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Courses Offered</label>
              <div className="flex items-center gap-5 mt-1">
                <EditableCheckbox
                  label="Undergraduate"
                  checked={formData.courses?.undergraduate || false}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      courses: { ...formData.courses, undergraduate: val },
                    })
                  }
                />
                <EditableCheckbox
                  label="Postgraduate"
                  checked={formData.courses?.postgraduate || false}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      courses: { ...formData.courses, postgraduate: val },
                    })
                  }
                />
                <EditableCheckbox
                  label="PHD"
                  checked={formData.courses?.phd || false}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      courses: { ...formData.courses, phd: val },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Row 5: Phone number & Website URL */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Phone number</label>
              <input
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Website URL</label>
              <input
                value={formData.website_url}
                onChange={(e) =>
                  setFormData({ ...formData, website_url: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 6: City & State */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>City</label>
              <input
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className={inputClass}
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className={inputClass}
                placeholder="Enter state"
              />
            </div>
          </div>

          {/* Row 7: Pincode & Official Email ID */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Pincode</label>
              <input
                value={formData.pincode}
                onChange={(e) =>
                  setFormData({ ...formData, pincode: e.target.value })
                }
                className={inputClass}
                placeholder="Enter pincode"
              />
            </div>
            <div>
              <label className={labelClass}>Official Email ID</label>
              <input
                value={formData.official_email}
                onChange={(e) =>
                  setFormData({ ...formData, official_email: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 8: Road */}
          <div>
            <label className={labelClass}>Road/Address</label>
            <input
              value={formData.road}
              onChange={(e) =>
                setFormData({ ...formData, road: e.target.value })
              }
              className={inputClass}
              placeholder="Enter road/street name"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="bg-[#0e1680] text-white px-[24px] py-[10px] rounded-[8px] font-semibold hover:bg-[#0a106e] transition-colors shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
