import React, { useState } from 'react';

interface CourseSelectionTabProps {
  onNext: () => void;
}

export const CourseSelectionTab: React.FC<CourseSelectionTabProps> = ({ onNext }) => {
  const [program, setProgram] = useState('Bachleor of Engineering');
  const [department, setDepartment] = useState('Informtaion Technology');
  const [academicYear, setAcademicYear] = useState('2025-26');
  const [semester, setSemester] = useState('3');
  const [courseTitle, setCourseTitle] = useState('Operating System');
  const [courseCode, setCourseCode] = useState('CO1919');
  const [facultyName, setFacultyName] = useState('abc');
  const [regulation, setRegulation] = useState('R-2020');

  const ChevronDown = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#667085" strokeWidth="2" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  return (
    <div className="flex flex-col gap-5 w-full font-['Instrument_Sans'] select-none bg-white p-2">
      {/* Form Fields */}
      <div className="flex flex-col gap-5 w-full">
        {/* Program */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Program</label>
          <div className="relative">
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
            >
              <option value="Bachleor of Engineering">Bachleor of Engineering</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Department */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Department</label>
          <div className="relative">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
            >
              <option value="Informtaion Technology">Informtaion Technology</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Academic Year & Semester */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[14px] font-medium text-[#344054]">Academic Year</label>
            <div className="relative">
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
              >
                <option value="2025-26">2025-26</option>
                <option value="2nd">2nd</option>
              </select>
              <ChevronDown />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[14px] font-medium text-[#344054]">Semester</label>
            <div className="relative">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
              >
                <option value="3">3</option>
              </select>
              <ChevronDown />
            </div>
          </div>
        </div>

        {/* Course Title */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Course Title</label>
          <div className="relative">
            <select
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm appearance-none cursor-pointer"
            >
              <option value="Operating System">Operating System</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Course Code */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Course Code</label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm transition-all"
          />
        </div>

        {/* Faculty Name */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Faculty Name</label>
          <input
            type="text"
            value={facultyName}
            onChange={(e) => setFacultyName(e.target.value)}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm transition-all"
          />
        </div>

        {/* Regulation */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-[14px] font-medium text-[#344054]">Regulation</label>
          <input
            type="text"
            value={regulation}
            onChange={(e) => setRegulation(e.target.value)}
            className="w-full px-3.5 py-3 bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#667085] focus:outline-none focus:ring-4 focus:ring-[#0E1680]/5 focus:border-[#0E1680] shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onNext}
          className="flex items-center justify-center gap-2 px-8 py-2.5 bg-[#0E1680] hover:bg-blue-900 text-white text-[14px] font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-[#0E1680]/20 transition-all cursor-pointer"
        >
          <span>Next</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
