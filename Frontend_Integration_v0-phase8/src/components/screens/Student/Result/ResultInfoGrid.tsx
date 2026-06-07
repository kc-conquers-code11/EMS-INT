import React from 'react';
import type { StudentResult } from '../../../../types/Student/Result/result';

interface ResultInfoGridProps {
  result: StudentResult;
}

export const ResultInfoGrid: React.FC<ResultInfoGridProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-y-5 text-[15px]">
      <span className="font-semibold text-[#101828]">Student Name:</span>
      <span className="font-medium text-[#101828]">{result.studentName}</span>
      
      <span className="font-semibold text-[#101828]">Semester:</span>
      <span className="font-medium text-[#101828]">{result.semester}</span>
      
      <span className="font-semibold text-[#101828]">Examination:</span>
      <span className="font-medium text-[#101828]">{result.examination}</span>
      
      <span className="font-semibold text-[#101828]">Academic year:</span>
      <span className="font-medium text-[#101828]">{result.academicYear}</span>
      
      <span className="font-semibold text-[#101828]">Seat number:</span>
      <span className="font-medium text-[#101828]">{result.seatNumber}</span>
    </div>
  );
};
