// src/components/modals/Institution/ViewInstitutionModal.tsx
import React from "react";
import type { Institution } from "../../../types/institution.types";

interface ViewInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Institution | null;
}

const labelClass: string = "block text-sm font-medium text-[#344054] mb-1.5";
const inputClass: string =
  "w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-base text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-default bg-gray-50";

const ReadOnlyCheckbox: React.FC<{ label: string; checked: boolean }> = ({
  label,
  checked,
}) => (
  <label className="flex items-center gap-2.5 select-none cursor-default">
    <div
      className={`w-5 h-5 rounded-[4px] border flex items-center justify-center ${checked ? "border-[#0a106e] bg-[#e5e7fb]" : "border-[#d0d5dd] bg-gray-100"}`}
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

export const ViewInstitutionModal: React.FC<ViewInstitutionModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen) return null;

  // Use the passed data directly
  const institution = data;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] w-full max-w-[800px] max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 flex justify-between items-center z-10 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-[#101828] leading-7">
            View Institution Details
          </h3>
          <button
            onClick={onClose}
            className="text-[#667085] hover:text-[#344054] transition-colors p-1"
          >
            <svg
              className="w-5 h-5"
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
        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Row 1: Institution Name & Code/ID */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Institution Name</label>
              <input
                readOnly
                value={institution?.name || "N/A"}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Institution Code/ID</label>
              <input
                readOnly
                value={institution?.institution_code || "N/A"}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 2: Establishment Year & Institution Type */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Establishment Year</label>
              <input
                readOnly
                value={institution?.establishment_year || "N/A"}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Institution Type</label>
              <input
                readOnly
                value={institution?.institution_type || "N/A"}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 3: Affiliated University */}
          <div>
            <label className={labelClass}>Affiliated University</label>
            <input
              readOnly
              value={institution?.affiliated_university || "N/A"}
              className={inputClass}
            />
          </div>

          {/* Row 4: Accreditation & Courses Offered */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Accreditation</label>
              <div className="flex items-center gap-5 mt-1">
                <ReadOnlyCheckbox
                  label="NBA"
                  checked={institution?.accreditation?.nba ?? false}
                />
                <ReadOnlyCheckbox
                  label="NAAC"
                  checked={institution?.accreditation?.naac ?? false}
                />
                <ReadOnlyCheckbox
                  label="AICTE"
                  checked={institution?.accreditation?.aicte ?? false}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Courses Offered</label>
              <div className="flex items-center gap-5 mt-1">
                <ReadOnlyCheckbox
                  label="Undergraduate"
                  checked={institution?.courses?.undergraduate ?? false}
                />
                <ReadOnlyCheckbox
                  label="Postgraduate"
                  checked={institution?.courses?.postgraduate ?? false}
                />
                <ReadOnlyCheckbox
                  label="PHD"
                  checked={institution?.courses?.phd ?? false}
                />
              </div>
            </div>
          </div>

          {/* Row 5: Phone number & Website URL */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Phone number</label>
              <input
                readOnly
                value={institution?.phone_number || "N/A"}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Website URL</label>
              <input
                readOnly
                value={institution?.website_url || institution?.websiteUrl || institution?.website || "N/A"}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 6: City & State */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>City</label>
              <input
                readOnly
                value={institution?.city || "N/A"}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input
                readOnly
                value={institution?.state || "N/A"}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 7: Pincode & Official Email ID */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Pincode</label>
              <input
                readOnly
                value={institution?.pincode || "N/A"}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Official Email ID</label>
              <input
                readOnly
                value={institution?.official_email || institution?.officialEmail || institution?.email || "N/A"}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 8: Road */}
          <div>
            <label className={labelClass}>Road/Address</label>
            <input
              readOnly
              value={institution?.road || "N/A"}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
