import React from 'react';
import type { StudentResult } from '../../../../types/Student/Result/result';

interface ResultTableProps {
  result: StudentResult;
}

export const ResultTable: React.FC<ResultTableProps> = ({ result }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-center border-collapse border border-[#101828] text-[11px] text-[#101828] font-medium leading-tight">
        <thead>
          <tr>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]" rowSpan={2}>COURSE<br/>CODE</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]" rowSpan={2} style={{ textAlign: 'left', minWidth: '160px' }}>COURSE<br/>TITLE</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]">COURSE<br/>CREDITS</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]" colSpan={2}>ESE<br/>PR / OR</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]" colSpan={2}>IA / TW</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]" colSpan={2}>OVER ALL</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]" rowSpan={2}>CREDITS<br/>EARNED<br/>( C )</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]" rowSpan={2}>GRADE<br/>POINTS<br/>( G )</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]" rowSpan={2}>CXG</th>
          </tr>
          <tr>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]">TH/<br/>T/P/O</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]">Min<br/>Max</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]">Obt</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]">Max</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]">Obt</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]">Max</th>
            <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider border border-[#101828]">Obt</th>
          </tr>
        </thead>
        <tbody>
          {result.subjects.map((sub, idx) => (
            <tr key={idx}>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.courseCode}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828] text-left">{sub.courseTitle}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.courseCredits.value}<br/>{sub.courseCredits.type}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.ese.min === '--' ? '--' : <>{sub.ese.min}<br/>{sub.ese.max}</>}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.ese.obtained}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.iaTw.max === '--' ? '--' : <>{sub.iaTw.max.split('/')[0]}<br/>{sub.iaTw.max.split('/')[1] || sub.iaTw.max}</>}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.iaTw.obtained}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.overall.max}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.overall.obtained}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.creditsEarned}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.gradePoints.points}<br/>{sub.gradePoints.grade}</td>
              <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{sub.cxg}</td>
            </tr>
          ))}

          {/* Total Row */}
          <tr>
            <td colSpan={2} className="px-8 py-6 text-[15px] font-medium border border-[#101828]">TOTAL</td>
            <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{result.totalCredits}</td>
            <td colSpan={6} className="px-8 py-6 text-[15px] font-medium border border-[#101828] bg-[#f9fafb]"></td>
            <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{result.totalCredits}</td>
            <td className="px-8 py-6 text-[15px] font-medium border border-[#101828] bg-[#f9fafb]"></td>
            <td className="px-8 py-6 text-[15px] font-medium border border-[#101828]">{result.totalCxg}</td>
          </tr>

          {/* Summary Row */}
          <tr className="text-left font-semibold">
            <td colSpan={4} className="px-8 py-6 text-[15px] font-medium border border-[#101828]">
              <span className="ml-4">REMARK: {result.remark}</span>
            </td>
            <td colSpan={3} className="px-8 py-6 text-[15px] font-medium border border-[#101828]">
              <span className="ml-4">SGPI : {result.sgpi}</span>
            </td>
            <td colSpan={5} className="px-8 py-6 text-[15px] font-medium border border-[#101828]">
              <span className="ml-4">MARKS OBTAINED : {result.marksObtained}/{result.totalMarks}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
