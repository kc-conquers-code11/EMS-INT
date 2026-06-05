import React from 'react';
import { SuccessIcon, DeleteSuccessIcon } from '../../shared/ModalIcons';

/* --- ActionConfirmModal --- */

interface ActionConfirmModalProps {
    isOpen: boolean;
    type: 'success' | 'warning' | 'danger';
    title: string;
    onClose: () => void;
    onConfirm?: () => void;
}

export const ActionConfirmModal = ({ isOpen, type, title, onClose, onConfirm }: ActionConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
                <div className="mb-4 text-4xl">
                    {type === 'success' ? '✅' : '⚠️'}
                </div>
                <h3 className="text-lg font-bold mb-6">{title}</h3>
                <div className="flex justify-center space-x-4">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg font-medium">Back</button>
                    {onConfirm && (
                        <button 
                            onClick={onConfirm} 
                            className={`px-6 py-2 text-white rounded-lg font-medium ${type === 'danger' ? 'bg-red-600' : 'bg-blue-900'}`}
                        >
                            Confirm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* --- DeleteInstitutionModal --- */

interface DeleteInstitutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteInstitutionModal = ({ isOpen, onClose, onConfirm }: DeleteInstitutionModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px]">
            <div className="bg-white rounded-[20px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08),0px_4px_6px_0px_rgba(16,24,40,0.03)] w-full max-w-[510px] p-[40px_20px] flex flex-col items-center text-center">
                {/* Info Icon */}
                <div className="w-[136px] h-[136px] flex items-center justify-center mb-[28px]">
                    <svg className="w-full h-full text-[#ff4141]" viewBox="0 0 121.333 121.333" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M60.6667 83.3333V60.6667M60.6667 38H60.7233M117.333 60.6667C117.333 91.9628 91.9628 117.333 60.6667 117.333C29.3705 117.333 4 91.9628 4 60.6667C4 29.3705 29.3705 4 60.6667 4C91.9628 4 117.333 29.3705 117.333 60.6667Z" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Message */}
                <h3 className="text-[24px] font-semibold text-black leading-[32px] mb-[28px] w-[439px]">
                    Do you really want to delete?
                </h3>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4 w-full">
                    <button
                        onClick={onClose}
                        className="bg-[#0e1680] text-white px-[18px] py-[10px] rounded-[8px] font-semibold text-[16px] leading-[24px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0a106e] transition-colors min-w-[86px]"
                    >
                        Back
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-[#ff4141] text-white px-[18px] py-[10px] rounded-[8px] font-semibold text-[16px] leading-[24px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#e63b3b] transition-colors min-w-[86px]"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

/* --- DeleteInstitutionSuccessModal --- */

interface DeleteInstitutionSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DeleteInstitutionSuccessModal = ({ isOpen, onClose }: DeleteInstitutionSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px]">
            <div className="bg-white rounded-[20px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08),0px_4px_6px_0px_rgba(16,24,40,0.03)] w-full max-w-[510px] p-[40px_20px] flex flex-col items-center text-center">
                {/* Delete Success Icon (Trash) */}
                <div className="w-[120px] h-[120px] flex items-center justify-center mb-[28px]">
                    <DeleteSuccessIcon size={120} />
                </div>

                {/* Message */}
                <h3 className="text-[24px] font-semibold text-black leading-[32px] mb-[28px] w-[439px]">
                    Institution deleted successfully!
                </h3>

                {/* Back Button */}
                <div className="flex items-center justify-center w-full">
                    <button
                        onClick={onClose}
                        className="bg-[#0e1680] text-white px-[18px] py-[10px] rounded-[8px] font-semibold text-[16px] leading-[24px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0a106e] transition-colors min-w-[86px]"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

/* --- EditInstitutionModal --- */

interface EditInstitutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: any;
    onSave?: (data: any) => void;
}

const labelClass = "block text-sm font-medium text-[#344054] mb-1.5";
const inputClass = "w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-base text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] focus:outline-none focus:ring-1 focus:ring-[#0e1680] transition-all";

const EditableCheckbox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange?: (val: boolean) => void }) => (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={(e) => onChange?.(e.target.checked)}
            className="hidden"
        />
        <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all ${checked ? 'border-[#0a106e] bg-[#e5e7fb]' : 'border-[#d0d5dd] bg-white'}`}>
            {checked && (
                <svg className="w-3 h-3 text-[#0a106e]" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
        <span className="text-sm font-semibold text-[#344054]">{label}</span>
    </label>
);

export const EditInstitutionModal = ({ isOpen, onClose, data: propData, onSave }: EditInstitutionModalProps) => {
    // Local state for form fields
    const [formData, setFormData] = React.useState<any>({
        institutionName: 'ABC',
        institutionCode: '356',
        establishmentYear: '2005',
        institutionType: 'Autonomous',
        accreditation: { nba: true, naac: true, aicte: true },
        courses: { undergraduate: true, postgraduate: true, phd: true },
        phoneNumber: '9090909090',
        websiteUrl: 'https://example.com',
        instituteAddress: 'ABC',
        officialEmail: 'ABC@gmail.com',
        coeName: 'ABC',
        coeEmployeeId: '12345',
        coePhoneNo: '9090909090',
        qualification: 'Gradutaion',
        courseQualification: 'BTECH',
    });

    React.useEffect(() => {
        if (propData) {
            setFormData((prev: any) => ({ ...prev, ...propData }));
        }
    }, [propData]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave?.(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px]">
            <div className="bg-white rounded-[20px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08),0px_4px_6px_0px_rgba(16,24,40,0.03)] w-full max-w-[866px] max-h-[90vh] overflow-y-auto mx-4 relative">
                {/* Header */}
                <div className="sticky top-0 bg-white px-5 py-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-4.5">
                        <h3 className="text-[16px] font-bold text-[#2c3e50] leading-6">Edit Institution Details</h3>
                        <svg className="w-[19px] h-[19px] text-[#2c3e50]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#667085] hover:text-[#344054] transition-colors p-1"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#eaecf0]" />

                {/* Body */}
                <div className="p-5 flex flex-col gap-[18.9px]">
                    {/* Row 1: Institution Name & Code/ID */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Institution Name</label>
                            <input 
                                value={formData.institutionName} 
                                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Institution Code/ID</label>
                            <input 
                                value={formData.institutionCode} 
                                onChange={(e) => setFormData({ ...formData, institutionCode: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                    </div>

                    {/* Row 2: Establishment Year & Institution Type */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Establishment Year</label>
                            <input 
                                value={formData.establishmentYear} 
                                onChange={(e) => setFormData({ ...formData, establishmentYear: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Institution Type</label>
                            <input 
                                value={formData.institutionType} 
                                onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                    </div>

                    {/* Row 3: Accreditation & Courses Offered */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Accrediation</label>
                            <div className="flex items-center gap-5 mt-1">
                                <EditableCheckbox 
                                    label="NBA" 
                                    checked={formData.accreditation.nba} 
                                    onChange={(val) => setFormData({ ...formData, accreditation: { ...formData.accreditation, nba: val } })}
                                />
                                <EditableCheckbox 
                                    label="NAAC" 
                                    checked={formData.accreditation.naac} 
                                    onChange={(val) => setFormData({ ...formData, accreditation: { ...formData.accreditation, naac: val } })}
                                />
                                <EditableCheckbox 
                                    label="AICTE" 
                                    checked={formData.accreditation.aicte} 
                                    onChange={(val) => setFormData({ ...formData, accreditation: { ...formData.accreditation, aicte: val } })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Courses Offered</label>
                            <div className="flex items-center gap-5 mt-1">
                                <EditableCheckbox 
                                    label="Undergraduate" 
                                    checked={formData.courses.undergraduate} 
                                    onChange={(val) => setFormData({ ...formData, courses: { ...formData.courses, undergraduate: val } })}
                                />
                                <EditableCheckbox 
                                    label="Postgraduate" 
                                    checked={formData.courses.postgraduate} 
                                    onChange={(val) => setFormData({ ...formData, courses: { ...formData.courses, postgraduate: val } })}
                                />
                                <EditableCheckbox 
                                    label="PHD" 
                                    checked={formData.courses.phd} 
                                    onChange={(val) => setFormData({ ...formData, courses: { ...formData.courses, phd: val } })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Phone number & Website URL */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Phone number</label>
                            <input 
                                value={formData.phoneNumber} 
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Website URL</label>
                            <input 
                                value={formData.websiteUrl} 
                                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                    </div>

                    {/* Row 5: Road & Official Email ID */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Road</label>
                            <input 
                                value={formData.road} 
                                onChange={(e) => setFormData({ ...formData, road: e.target.value })}
                                className={inputClass} 
                                placeholder="Enter road/street name"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Official Email ID</label>
                            <input 
                                value={formData.officialEmail} 
                                onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                    </div>

                    {/* Row 6: COE Name & COE Employee ID */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>COE Name</label>
                            <input 
                                value={formData.coeName} 
                                onChange={(e) => setFormData({ ...formData, coeName: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                        <div>
                            <label className={labelClass}>COE Employee ID</label>
                            <input 
                                value={formData.coeEmployeeId} 
                                onChange={(e) => setFormData({ ...formData, coeEmployeeId: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                    </div>

                    {/* Row 7: Phone No & Qualification */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Phone No</label>
                            <input 
                                value={formData.coePhoneNo} 
                                onChange={(e) => setFormData({ ...formData, coePhoneNo: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Qualification</label>
                            <input 
                                value={formData.qualification} 
                                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                className={inputClass} 
                            />
                        </div>
                    </div>

                    {/* Row 8: Course (Qualification) */}
                    <div>
                        <label className={labelClass}>Course (Qualification)</label>
                        <input 
                            value={formData.courseQualification} 
                            onChange={(e) => setFormData({ ...formData, courseQualification: e.target.value })}
                            className={inputClass} 
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSave}
                            className="bg-[#0e1680] text-white px-[24px] py-[10px] rounded-[8px] font-semibold hover:bg-[#0a106e] transition-colors shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* --- InstitutionEditSuccessModal --- */

interface InstitutionEditSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InstitutionEditSuccessModal = ({ isOpen, onClose }: InstitutionEditSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[rgba(16,24,40,0.6)] backdrop-blur-[4px]">
            <div className="bg-white rounded-[20px] shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08),0px_4px_6px_0px_rgba(16,24,40,0.03)] w-full max-w-[510px] p-[45px_20px] flex flex-col items-center text-center">
                {/* Success Icon */}
                <div className="w-[120px] h-[120px] flex items-center justify-center mb-[28px]">
                    <SuccessIcon size={120} />
                </div>

                {/* Success Message */}
                <h3 className="text-[24px] font-semibold text-black leading-[32px] mb-[28px] max-w-[435px]">
                    Institution details edited successfully !
                </h3>

                {/* Back Button */}
                <button
                    onClick={onClose}
                    className="bg-[#0e1680] text-white px-[18px] py-[10px] rounded-[8px] font-semibold text-[16px] leading-[24px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0a106e] transition-colors w-[86px]"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

/* --- ViewInstitutionModal --- */

interface ViewInstitutionModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: {
        institutionName?: string;
        institutionCode?: string;
        establishmentYear?: string;
        institutionType?: string;
        accreditation?: { nba?: boolean; naac?: boolean; aicte?: boolean };
        courses?: { undergraduate?: boolean; postgraduate?: boolean; phd?: boolean };
        phoneNumber?: string;
        websiteUrl?: string;
        road?: string;
        officialEmail?: string;
        coeName?: string;
        coeEmployeeId?: string;
        coePhoneNo?: string;
        qualification?: string;
        courseQualification?: string;
    };
}

const viewInputClass = "w-full bg-white border border-[#d0d5dd] rounded-lg px-3.5 py-2.5 text-base text-[#101828] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-default";

const ReadOnlyCheckbox = ({ label, checked }: { label: string; checked: boolean }) => (
    <label className="flex items-center gap-2.5 select-none">
        <div className="w-5 h-5 rounded-[4px] border border-[#0a106e] bg-[#e5e7fb] flex items-center justify-center">
            {checked && (
                <svg className="w-3 h-3 text-[#0a106e]" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6.5L4.5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}
        </div>
        <span className="text-sm font-semibold text-[#344054]">{label}</span>
    </label>
);

const defaultData = {
    institutionName: 'ABC',
    institutionCode: '356',
    establishmentYear: '2005',
    institutionType: 'Autonomous',
    accreditation: { nba: true, naac: true, aicte: true },
    courses: { undergraduate: true, postgraduate: true, phd: true },
    phoneNumber: '9090909090',
    websiteUrl: 'https://example.com',
    instituteAddress: 'ABC',
    officialEmail: 'ABC@gmail.com',
    coeName: 'ABC',
    coeEmployeeId: '12345',
    coePhoneNo: '9090909090',
    qualification: 'Gradutaion',
    courseQualification: 'BTECH',
};

export const ViewInstitutionModal = ({ isOpen, onClose, data: propData }: ViewInstitutionModalProps) => {
    if (!isOpen) return null;

    const data = { ...defaultData, ...propData };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-white rounded-xl shadow-[0px_24px_48px_-12px_rgba(16,24,40,0.18)] w-full max-w-[800px] max-h-[90vh] overflow-y-auto mx-4">
                {/* Header */}
                <div className="sticky top-0 bg-white px-6 pt-6 pb-4 flex justify-between items-center z-10">
                    <h3 className="text-lg font-semibold text-[#101828] leading-7">View Institution Details</h3>
                    <button
                        onClick={onClose}
                        className="text-[#667085] hover:text-[#344054] transition-colors p-1"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-6 flex flex-col gap-4">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Institution Name</label>
                            <input readOnly value={data.institutionName} className={viewInputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Institution Code/ID</label>
                            <input readOnly value={data.institutionCode} className={viewInputClass} />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Establishment Year</label>
                            <input readOnly value={data.establishmentYear} className={viewInputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Institution Type</label>
                            <input readOnly value={data.institutionType} className={viewInputClass} />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Accreditation</label>
                            <div className="flex items-center gap-5 mt-1">
                                <ReadOnlyCheckbox label="NBA" checked={data.accreditation?.nba ?? false} />
                                <ReadOnlyCheckbox label="NAAC" checked={data.accreditation?.naac ?? false} />
                                <ReadOnlyCheckbox label="AICTE" checked={data.accreditation?.aicte ?? false} />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Courses Offered</label>
                            <div className="flex items-center gap-5 mt-1">
                                <ReadOnlyCheckbox label="Undergraduate" checked={data.courses?.undergraduate ?? false} />
                                <ReadOnlyCheckbox label="Postgraduate" checked={data.courses?.postgraduate ?? false} />
                                <ReadOnlyCheckbox label="PHD" checked={data.courses?.phd ?? false} />
                            </div>
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Phone number</label>
                            <input readOnly value={data.phoneNumber} className={viewInputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Website URL</label>
                            <input readOnly value={data.websiteUrl} className={viewInputClass} />
                        </div>
                    </div>

                    {/* Row 5 */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Road</label>
                            <input readOnly value={data.road} className={viewInputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Official Email ID</label>
                            <input readOnly value={data.officialEmail} className={viewInputClass} />
                        </div>
                    </div>

                    {/* Row 6 */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>COE Name</label>
                            <input readOnly value={data.coeName} className={viewInputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>COE Employee ID</label>
                            <input readOnly value={data.coeEmployeeId} className={viewInputClass} />
                        </div>
                    </div>

                    {/* Row 7 */}
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Phone No</label>
                            <input readOnly value={data.coePhoneNo} className={viewInputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Qualification</label>
                            <input readOnly value={data.qualification} className={viewInputClass} />
                        </div>
                    </div>

                    {/* Row 8 */}
                    <div>
                        <label className={labelClass}>Course (Qualification)</label>
                        <input readOnly value={data.courseQualification} className={viewInputClass} />
                    </div>
                </div>
            </div>
        </div>
    );
};
