import * as React from 'react';
import { Calendar, Users, GraduationCap, Download } from 'lucide-react';
import { ExamScheduleViewModal, SuccessModal } from '../../../modals/Exam/ExamModals';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* ── Stat Card ── */
interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <div className="flex-1 bg-[#f2f4fd] p-6 rounded-xl flex flex-col items-center gap-2">
    <div className="text-[#0e1680]">{icon}</div>
    <span className="text-[24px] font-bold text-[#101828]">{value}</span>
    <span className="text-sm text-[#667085] text-center">{label}</span>
  </div>
);

export const DownloadExamSchedule: React.FC = () => {
  const [branch, setBranch] = React.useState('Information Technology');
  const [semester, setSemester] = React.useState('2nd');
  const [examType, setExamType] = React.useState('Internal Assessment');
  const [isViewOpen, setIsViewOpen] = React.useState(false);
  const [isPublishSuccessOpen, setIsPublishSuccessOpen] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

  const labelClass = 'block text-sm font-medium text-[#344054] mb-1.5';
  const selectClass =
    'w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] ' +
    'focus:outline-none focus:ring-2 focus:ring-[#0e1680]/30 focus:border-[#0e1680] ' +
    'transition-all shadow-sm appearance-none cursor-pointer';

  const ChevronDown = () => (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="#667085" strokeWidth="2" strokeLinecap="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const [clickedButtons, setClickedButtons] = React.useState({
    apply: false,
    view: false,
    download: false,
    publish: false,
  });

  const toggleClicked = (btn: 'apply' | 'view' | 'download' | 'publish') => {
    setClickedButtons((prev) => ({
      ...prev,
      [btn]: !prev[btn],
    }));
  };

  const handleDownload = async () => {
    toggleClicked('download');
    setIsDownloading(true);
    
    try {
      const doc = new jsPDF('landscape');
      
      doc.setFontSize(14);
      doc.text('Exam Schedule', 14, 15);
      
      autoTable(doc, {
        startY: 20,
        head: [
          [
            { content: 'Date', rowSpan: 3, styles: { halign: 'center', valign: 'middle', fillColor: [248, 249, 252] } },
            { content: branch, colSpan: 6, styles: { halign: 'center', fillColor: [248, 249, 252] } }
          ],
          [
            { content: 'SEM 4', colSpan: 2, styles: { halign: 'center', fillColor: [248, 249, 252] } },
            { content: 'SEM 6', colSpan: 2, styles: { halign: 'center', fillColor: [248, 249, 252] } },
            { content: 'SEM 8', colSpan: 2, styles: { halign: 'center', fillColor: [248, 249, 252] } }
          ],
          [
            { content: '10:00 - 11:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
            { content: '3:00 - 4:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
            { content: '10:00 - 11:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
            { content: '3:00 - 4:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
            { content: '10:00 - 11:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } },
            { content: '3:00 - 4:00 AM', styles: { halign: 'center', fillColor: [248, 249, 252] } }
          ]
        ],
        body: [
          [
            '25/05/2026\nThursday',
            'ABC', 'ABC',
            'ABC', 'ABC',
            'ABC', 'ABC'
          ],
          [
            '26/05/2026\nFriday',
            'XYZ', 'XYZ',
            'XYZ', 'XYZ',
            'XYZ', 'XYZ'
          ],
          [
            '28/05/2026\nMonday',
            'ABC', 'ABC',
            'ABC', 'ABC',
            'ABC', 'ABC'
          ]
        ],
        theme: 'grid',
        headStyles: { textColor: [52, 64, 84], lineColor: [234, 236, 240], lineWidth: 0.1, fontStyle: 'bold' },
        bodyStyles: { textColor: [71, 84, 103], lineColor: [234, 236, 240], lineWidth: 0.1, halign: 'center', valign: 'middle' },
        styles: { font: 'helvetica', fontSize: 9, cellPadding: 4 }
      });

      doc.save(`Exam_Schedule_${branch.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
    }
    
    setIsDownloading(false);
  };

  const handlePublish = async () => {
    toggleClicked('publish');
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsPublishing(false);
    setIsPublishSuccessOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">

      {/* ── Stats Row ── */}
      <div className="flex gap-5 w-full">
        <StatCard icon={<Calendar size={28} />} value="165" label="Total Exam Events" />
        <StatCard icon={<Users size={28} />} value="102" label="Active Exam Event" />
        <StatCard icon={<GraduationCap size={28} />} value="4" label="Total exam Conducted" />
        <StatCard icon={<GraduationCap size={28} />} value="4" label="Pending Exam Events" />
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col gap-4">

        {/* Select Branch */}
        <div>
          <label className={labelClass}>Select Branch</label>
          <div className="relative">
            <select
              className={selectClass}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option>Information Technology</option>
              <option>Computer Science</option>
              <option>Electronics</option>
              <option>Mechanical</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Select Semester */}
        <div>
          <label className={labelClass}>Select Semester</label>
          <div className="relative">
            <select
              className={selectClass}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* Select Exam type */}
        <div>
          <label className={labelClass}>Select Exam type</label>
          <div className="relative">
            <select
              className={selectClass}
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
            >
              <option>Internal Assessment</option>
              <option>Internal Assessment 1</option>
              <option>Internal Assessment 2</option>
              <option>Semester End Exam</option>
            </select>
            <ChevronDown />
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex items-center justify-end gap-3 pt-2 flex-wrap">

          {/* Apply Filter */}
          <button
            type="button"
            onClick={() => toggleClicked('apply')}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg active:scale-[0.97] transition-all flex items-center gap-2 ${clickedButtons.apply
              ? 'bg-[#eef0fd] text-[#0e1680] shadow-sm'
              : 'bg-[#0e1680] text-white hover:bg-[#0b1260] shadow-md'
              }`}
          >
            Apply Filter
          </button>

          {/* View */}
          <button
            type="button"
            onClick={() => {
              toggleClicked('view');
              setIsViewOpen(true);
            }}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg active:scale-[0.97] transition-all flex items-center gap-2 ${clickedButtons.view
              ? 'bg-[#eef0fd] text-[#0e1680] shadow-sm'
              : 'bg-[#0e1680] text-white hover:bg-[#0b1260] shadow-md'
              }`}
          >
            View
          </button>

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-70 ${clickedButtons.download
              ? 'bg-[#eef0fd] text-[#0e1680] shadow-sm'
              : 'bg-[#0e1680] text-white hover:bg-[#0b1260] shadow-md'
              }`}
          >
            {isDownloading ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            ) : (
              <Download size={15} />
            )}
            {isDownloading ? 'Downloading…' : 'Download'}
          </button>

          {/* Publish Exam Events */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-70 ${clickedButtons.publish
              ? 'bg-[#eef0fd] text-[#0e1680] shadow-sm'
              : 'bg-[#0e1680] text-white hover:bg-[#0b1260] shadow-md'
              }`}
          >
            {isPublishing && (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            )}
            {isPublishing ? 'Publishing…' : 'Publish Exam Events'}
          </button>

        </div>
      </div>

      {/* ── View Modal ── */}
      <ExamScheduleViewModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        branch={branch}
        semester={semester}
        examType={examType}
      />

      {/* ── Success Modal (Publish Success) ── */}
      <SuccessModal
        isOpen={isPublishSuccessOpen}
        onClose={() => setIsPublishSuccessOpen(false)}
        message="Published Exam Events successfully!"
      />
    </div>
  );
};
