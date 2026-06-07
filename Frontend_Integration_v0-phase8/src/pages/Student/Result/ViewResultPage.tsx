import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { ResultInfoGrid } from '../../../components/screens/Student/Result/ResultInfoGrid';
import { ResultTable } from '../../../components/screens/Student/Result/ResultTable';
import { ResultHistoryTable } from '../../../components/screens/Student/Result/ResultHistoryTable';
import type { StudentResult } from '../../../types/Student/Result/result';

/* ── Sample current result data ────────────────────────────────── */
const SAMPLE_RESULT: StudentResult = {
  studentName: 'XYZ',
  semester: 'VI',
  examination: 'Winter 2025 Examination',
  academicYear: '2025-26',
  seatNumber: '123456',
  totalCredits: '23',
  totalCxg: '169',
  remark: 'SUCCESSFUL',
  sgpi: '7.35',
  marksObtained: '503',
  totalMarks: '775',
  subjects: [
    { courseCode: 'ITC301', courseTitle: 'SUBJECT 1', courseCredits: { value: '3', type: 'TH' }, ese: { min: '32', max: '80', obtained: '32' }, iaTw: { max: '8/20', obtained: '14' }, overall: { max: '100', obtained: '46' }, creditsEarned: '3', gradePoints: { points: '5', grade: 'E' }, cxg: '15' },
    { courseCode: '', courseTitle: '', courseCredits: { value: '1', type: 'T/P/O' }, ese: { min: '--', max: '--', obtained: '--' }, iaTw: { max: '10/25', obtained: '19' }, overall: { max: '25', obtained: '19' }, creditsEarned: '1', gradePoints: { points: '9', grade: 'A' }, cxg: '9' },
    { courseCode: 'ITC302', courseTitle: 'SUBJECT 2', courseCredits: { value: '3', type: 'TH' }, ese: { min: '32', max: '80', obtained: '48' }, iaTw: { max: '8/20', obtained: '18' }, overall: { max: '100', obtained: '66' }, creditsEarned: '3', gradePoints: { points: '7', grade: 'C' }, cxg: '21' },
    { courseCode: 'ITC303', courseTitle: 'SUBJECT 3', courseCredits: { value: '3', type: 'TH' }, ese: { min: '32', max: '80', obtained: '47' }, iaTw: { max: '8/20', obtained: '15' }, overall: { max: '100', obtained: '62' }, creditsEarned: 'Q', gradePoints: { points: 'Q', grade: '' }, cxg: '21' },
    { courseCode: 'ITC304', courseTitle: 'SUBJECT 4', courseCredits: { value: '3', type: 'TH' }, ese: { min: '32', max: '80', obtained: '38' }, iaTw: { max: '8/20', obtained: '13' }, overall: { max: '100', obtained: '51' }, creditsEarned: '3', gradePoints: { points: '6', grade: 'D' }, cxg: '18' },
    { courseCode: 'ITC305', courseTitle: 'SUBJCT 5', courseCredits: { value: '3', type: 'TH' }, ese: { min: '32', max: '80', obtained: '45' }, iaTw: { max: '8/20', obtained: '18' }, overall: { max: '100', obtained: '63' }, creditsEarned: '3', gradePoints: { points: '7', grade: 'C' }, cxg: '21' },
    { courseCode: 'ITL301', courseTitle: 'SUBJECT 1 LAB', courseCredits: { value: '1', type: 'T/P/O' }, ese: { min: '10', max: '25', obtained: '20' }, iaTw: { max: '10/25', obtained: '21' }, overall: { max: '50', obtained: '41' }, creditsEarned: '1', gradePoints: { points: '10', grade: 'O' }, cxg: '10' },
    { courseCode: 'ITL302', courseTitle: 'SUBJECT 2 LAB', courseCredits: { value: '1', type: 'T/P/O' }, ese: { min: '10', max: '25', obtained: '22' }, iaTw: { max: '10/25', obtained: '20' }, overall: { max: '50', obtained: '42' }, creditsEarned: '1', gradePoints: { points: '10', grade: 'O' }, cxg: '10' },
    { courseCode: 'ITL303', courseTitle: 'SUBJECT 3 LAB', courseCredits: { value: '1', type: 'T/P/O' }, ese: { min: '10', max: '25', obtained: '18' }, iaTw: { max: '10/25', obtained: '18' }, overall: { max: '50', obtained: '36' }, creditsEarned: '1', gradePoints: { points: '8', grade: 'B' }, cxg: '8' },
    { courseCode: 'ITL304', courseTitle: 'SUBJECT 4 LAB', courseCredits: { value: '2', type: 'T/P/O' }, ese: { min: '10', max: '25', obtained: '20' }, iaTw: { max: '10/25', obtained: '20' }, overall: { max: '50', obtained: '40' }, creditsEarned: '2', gradePoints: { points: '8', grade: 'B' }, cxg: '16' },
    { courseCode: 'ITM301', courseTitle: 'MINI PROJECT', courseCredits: { value: '2', type: 'T/P/O' }, ese: { min: '10', max: '25', obtained: '19' }, iaTw: { max: '10/25', obtained: '18' }, overall: { max: '50', obtained: '37' }, creditsEarned: '2', gradePoints: { points: '8', grade: 'B' }, cxg: '16' },
  ],
};

/* ── Main Page ──────────────────────────────────────────────────── */
export const ViewResultPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Result' | 'Result history'>('Result');

  return (
    <div className="flex flex-col min-h-full p-8 gap-8 font-['Instrument_Sans']">
      {/* ── Title ── */}
      <h1 className="text-[24px] font-semibold text-[#101828] print:hidden">View Result</h1>

      {/* ── Tabs ── */}
      <div className="flex items-center bg-[#f0f1fd] rounded-xl p-1 gap-1 w-fit print:hidden">
        {(['Result', 'Result history'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-[14px] font-semibold transition-all duration-200 ${
              activeTab === tab
                ? 'bg-[#0e1680] text-white shadow-sm'
                : 'text-[#687b96] hover:text-[#0e1680]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Result Tab ── */}
      {activeTab === 'Result' && (
        <div className="flex flex-col gap-8">
          <ResultInfoGrid result={SAMPLE_RESULT} />
          <ResultTable result={SAMPLE_RESULT} />
          <div className="flex justify-end mt-4 print:hidden">
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm"
            >
              <span>Download Marksheet</span>
              <Download size={18} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* ── Result History Tab ── */}
      {activeTab === 'Result history' && <ResultHistoryTable />}
    </div>
  );
};
