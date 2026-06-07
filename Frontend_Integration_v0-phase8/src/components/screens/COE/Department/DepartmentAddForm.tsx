import React, { useState } from 'react';
import { Phone, Mail, ArrowRight, User, Hash, Calendar, BookOpen, Users, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

interface DepartmentAddFormProps {
  onBack: () => void;
}

export const DepartmentAddForm: React.FC<DepartmentAddFormProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('Basic Department Details');

  const tabs = ['Basic Department Details', 'Head Details', 'Faculty details'];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Validate phone numbers
    const phoneInputs = form.querySelectorAll('input[type="number"]');
    for (let i = 0; i < phoneInputs.length; i++) {
      const input = phoneInputs[i] as HTMLInputElement;
      if (input.placeholder?.includes("mobile") || input.placeholder?.includes("Mobile")) {
        const val = input.value;
        if (val.length !== 10 || val === "0000000000") {
          input.setCustomValidity("Please enter a valid 10-digit mobile number");
          input.reportValidity();
          return;
        }
      }
    }

    // Validate any year field
    const allInputs = form.querySelectorAll('input');
    for (let i = 0; i < allInputs.length; i++) {
      const input = allInputs[i];
      const labelContainer = input.previousElementSibling || input.parentElement?.previousElementSibling || input.closest('div')?.parentElement?.querySelector('label');
      const labelText = labelContainer?.textContent || "";
      
      if (labelText.toLowerCase().includes('year')) {
        const val = input.value;
        const yearRegex = /^\d{4}(-\d{2})?$/;
        if (!yearRegex.test(val) || val.startsWith("0000")) {
          input.setCustomValidity(`Please enter a valid format for ${labelText.trim()} (e.g. 2024 or 2024-25)`);
          input.reportValidity();
          return;
        }
      }
    }

    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else {
      toast.success("Department added successfully!");
      onBack();
    }
  };

  const renderField = (label: string, placeholder: string, icon?: React.ReactNode, type: string = "text", isTextArea: boolean = false) => (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#344054]">{label}</label>
      <div className={`flex border border-[#d0d5dd] rounded-lg shadow-sm overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#0e1680]/20 focus-within:border-[#0e1680] transition-all`}>
        {icon && (
          <div className="flex items-center justify-center px-3 border-r border-[#d0d5dd] bg-gray-50/50">
            {icon}
          </div>
        )}
        {isTextArea ? (
          <textarea 
            placeholder={placeholder} 
            rows={3}
            className="w-full px-3 py-2.5 focus:outline-none text-sm text-[#101828] placeholder:text-[#667085]" 
          />
        ) : (
          <input required 
            type={type} 
            placeholder={placeholder} 
            className="w-full px-3 py-2.5 focus:outline-none text-sm text-[#101828] placeholder:text-[#667085]" 
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/30">
        <h1 className="text-2xl font-bold text-[#101828]">Add Department Details</h1>
        <p className="text-sm text-[#667085] mt-1">Fill in the information to register a new department in the system.</p>
      </div>
      
      {/* Tabs */}
      <div className="px-8 mt-6">
        <div className="flex space-x-1 bg-[#f2f3fd] p-1.5 rounded-xl w-max border border-[#e5e7fb]">
          {tabs.map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)} 
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === t 
                  ? 'bg-[#0e1680] text-white shadow-md' 
                  : 'text-[#667085] hover:text-[#0e1680] hover:bg-white/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <form id="addDeptForm" onSubmit={handleSubmit} className="max-w-4xl">
          {activeTab === 'Basic Department Details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {renderField('Department Name', 'e.g. Information Technology', <BookOpen size={18} className="text-[#667085]" />)}
              {renderField('Department Code', 'e.g. IT-01', <Hash size={18} className="text-[#667085]" />)}
              {renderField('Year of Establishment', 'YYYY', <Calendar size={18} className="text-[#667085]" />)}
              {renderField('Intake Capacity', 'e.g. 120', <Users size={18} className="text-[#667085]" />, "number")}
              {renderField('Total Student Count', 'Current enrolled students', <Users size={18} className="text-[#667085]" />, "number")}
              <div className="md:col-span-2">
                {renderField('Department Description', 'Brief overview of the department...', undefined, "text", true)}
              </div>
            </div>
          )}

          {activeTab === 'Head Details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {renderField('HOD Name', 'Full name of Head of Department', <User size={18} className="text-[#667085]" />)}
              {renderField('Designation', 'e.g. Professor & Head', <Briefcase size={18} className="text-[#667085]" />)}
              {renderField('Mobile No', '10-digit mobile number', <Phone size={18} className="text-[#667085]" />, "number")}
              {renderField('Email ID', 'official.email@institute.edu.in', <Mail size={18} className="text-[#667085]" />, "email")}
              {renderField('Date of Appointment', '', <Calendar size={18} className="text-[#667085]" />, "date")}
            </div>
          )}

          {activeTab === 'Faculty details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {renderField('Total Faculty Count', 'Total number of staff', <Users size={18} className="text-[#667085]" />, "number")}
              {renderField('Teaching Staff', 'Number of teaching members', <Briefcase size={18} className="text-[#667085]" />, "number")}
              {renderField('Non-Teaching Staff', 'Technical & support staff', <Users size={18} className="text-[#667085]" />, "number")}
              {renderField('Lab Assistants', 'Count of laboratory staff', <Hash size={18} className="text-[#667085]" />, "number")}
            </div>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-4">
        <button 
          onClick={onBack} 
          className="px-6 py-2.5 border border-[#d0d5dd] text-[#344054] text-sm font-semibold rounded-lg hover:bg-gray-100 hover:border-[#b0b5bd] transition-all"
        >
          Back
        </button>
        <button 
          type="submit"
          form="addDeptForm"
          className="flex items-center space-x-2 px-8 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0a1060] shadow-lg hover:shadow-xl transition-all"
        >
          <span>{activeTab === tabs[tabs.length - 1] ? 'Finish' : 'Next'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
