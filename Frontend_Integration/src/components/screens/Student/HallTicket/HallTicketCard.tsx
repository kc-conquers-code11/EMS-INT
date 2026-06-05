import React from 'react';
import type { HallTicket } from '../../../../types/Student/HallTicket/hallTicket';

interface HallTicketCardProps {
  data: HallTicket;
}

export const HallTicketCard: React.FC<HallTicketCardProps> = ({ data }) => {
  const subjects =
    data.subjects?.length > 0
      ? data.subjects
      : [{ srNo: 1, courseCode: '-', courseName: '-', date: '-', time: '-' }];

  return (
    <div id="hall-ticket-card" className="bg-white border-[1px] border-[#eaecf0] rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] overflow-hidden flex flex-col p-6 w-full">
      
      {/* ── Logo Banner ── */}
      <div className="bg-[#e4e7ec] flex items-center justify-center h-[140px] rounded-lg mb-8 mx-2">
        <span className="text-[28px] font-medium text-[#101828] tracking-tight">Logo</span>
      </div>

      {/* ── Student Info + Photo ── */}
      <div className="px-6 flex items-start justify-between gap-6 mb-10">
        {/* Info Grid */}
        <div className="grid grid-cols-[200px_1fr] gap-y-5 text-[13px] flex-1">
          <span className="font-semibold text-[#101828]">Enrollmet/Student ID :</span>
          <span className="text-[#101828] font-medium">{data.enrollmentId}</span>

          <span className="font-semibold text-[#101828]">Student Name :</span>
          <span className="text-[#101828] font-medium">{data.studentName}</span>

          <span className="font-semibold text-[#101828]">Branch:</span>
          <span className="text-[#101828] font-medium">{data.branch}</span>

          <span className="font-semibold text-[#101828]">Semester :</span>
          <span className="text-[#101828] font-medium">{data.semester}</span>

          <span className="font-semibold text-[#101828]">Exam Event:</span>
          <span className="text-[#101828] font-medium">{data.examEvent}</span>

          <span className="font-semibold text-[#101828]">Seat number</span>
          <span className="text-[#101828] font-medium">{data.seatNumber}</span>
        </div>

        {/* Passport Photo Placeholder */}
        <div className="w-[120px] h-[130px] bg-[#e4e7ec] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] flex-shrink-0 mt-4 mr-2" />
      </div>

      {/* ── Subject Table ── */}
      <div className="px-6 pb-12">
        <div className="border border-[#eaecf0] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                <th className="py-[12px] px-6 text-[11.5px] font-medium text-center text-[#475467] w-[80px]">Sr. No.</th>
                <th className="py-[12px] px-2 text-[11.5px] font-medium text-center text-[#475467]">Course/subject code</th>
                <th className="py-[12px] px-2 text-[11.5px] font-medium text-center text-[#475467]">Course/Subject Name</th>
                <th className="py-[12px] px-2 text-[11.5px] font-medium text-center text-[#475467]">Date</th>
                <th className="py-[12px] px-6 text-[11.5px] font-medium text-center text-[#475467]">Time</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((sub) => (
                <tr key={sub.srNo} className="border-b border-[#eaecf0] last:border-0 bg-white">
                  <td className="py-4 px-6 text-[12.5px] font-normal text-center text-[#475467]">{sub.srNo}</td>
                  <td className="py-4 px-2 text-[12.5px] font-normal text-center text-[#475467]">{sub.courseCode}</td>
                  <td className="py-4 px-2 text-[12.5px] font-normal text-center text-[#475467]">{sub.courseName}</td>
                  <td className="py-4 px-2 text-[12.5px] font-normal text-center text-[#475467]">{sub.date}</td>
                  <td className="py-4 px-6 text-[12.5px] font-normal text-center text-[#475467]">{sub.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Signature Row ── */}
      <div className="pt-24 pb-12 flex justify-center gap-[120px] md:gap-[200px] xl:gap-[240px]">
        <div className="text-[16px] text-black">Student Signature</div>
        <div className="text-[16px] text-black">Department stamp</div>
        <div className="text-[16px] text-black">Principal signature</div>
      </div>
    </div>
  );
};
