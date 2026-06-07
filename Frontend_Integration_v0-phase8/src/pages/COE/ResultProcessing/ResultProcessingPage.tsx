import { useState } from 'react';
import { Search, ChevronDown, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { FeedbackModal } from '../../../components/modals/FeedbackModal';

type Tab = 'processing' | 'declaration';

// Mock data
const PROCESSING_DATA = [
  { id: 1, subject: 'CSC101- Web Application development', status: 'Not started' },
  { id: 2, subject: 'CSC202- Software testing', status: 'In progress' },
  { id: 3, subject: 'CSC301- Machine Learning', status: 'Ready to declare' },
  { id: 4, subject: 'CSC401- Data Structures', status: 'Not started' },
];

const DECLARATION_DATA = [
  { id: 1, prn: '1234567890', seat: '101', name: 'Student 1', cpi: '8.5', sgpi: '8.5', status: 'Pass' },
  { id: 2, prn: '1234567891', seat: '102', name: 'Student 2', cpi: '7.5', sgpi: '7.5', status: 'Pass' },
];

export const ResultProcessingPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('processing');
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleMakeLive = () => {
    setShowLiveModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="flex flex-col w-full h-full" style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px]">Result Processing</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#eaecf0] mb-6">
        <button
          onClick={() => setActiveTab('processing')}
          className={`pb-3 px-1 text-[16px] font-semibold transition-colors relative ${
            activeTab === 'processing' ? 'text-[#0e1680]' : 'text-[#667085] hover:text-[#344054]'
          }`}
        >
          Result Processing
          {activeTab === 'processing' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0e1680] rounded-t-sm" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('declaration')}
          className={`pb-3 px-1 ml-6 text-[16px] font-semibold transition-colors relative ${
            activeTab === 'declaration' ? 'text-[#0e1680]' : 'text-[#667085] hover:text-[#344054]'
          }`}
        >
          Declaration of Result
          {activeTab === 'declaration' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0e1680] rounded-t-sm" />
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {['Semester', 'Academic year', 'Exam session', 'Exam Event', 'Programme', 'Branch'].map((filter) => (
          <div key={filter} className="relative">
            <select className="w-[160px] h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#667085] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer">
              <option value="">{filter}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
          </div>
        ))}
        {activeTab === 'declaration' && ['Scheme', 'Exam month'].map((filter) => (
          <div key={filter} className="relative">
            <select className="w-[160px] h-[40px] px-3.5 border border-[#d0d5dd] rounded-[8px] text-[14px] text-[#667085] bg-white appearance-none focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] cursor-pointer">
              <option value="">{filter}</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667085] pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-[320px] h-[40px] pl-10 pr-4 border border-[#d0d5dd] rounded-[8px] text-[16px] text-[#667085] bg-white focus:outline-none focus:border-[#0e1680] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#667085]" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-semibold text-[#344054] bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-gray-50 transition-colors">
          <SlidersHorizontal size={20} />
          Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-[#eaecf0] rounded-[10px] shadow-[0px_1px_3px_0px_rgba(16,24,40,0.1),0px_1px_2px_0px_rgba(16,24,40,0.06)] overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#eaecf0]">
                {activeTab === 'processing' ? (
                  <>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Sr no.</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Subject name</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Status</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Calculate</th>
                  </>
                ) : (
                  <>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Sr. no.</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">PRN no.</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Seat no.</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Student name</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">CPI</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">SGPI</th>
                    <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Result status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'processing'
                ? PROCESSING_DATA.map((row, i) => (
                    <tr key={row.id} className="border-b border-[#eaecf0] hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{i + 1}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{row.subject}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium ${
                            row.status === 'Ready to declare'
                              ? 'bg-green-100 text-green-700'
                              : row.status === 'In progress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-medium">
                        <button className="px-4 py-1.5 bg-[#0e1680] text-white text-[14px] font-semibold rounded-[6px] hover:bg-[#0a1060] transition-colors cursor-pointer">
                          Calculate Result
                        </button>
                      </td>
                    </tr>
                  ))
                : DECLARATION_DATA.map((row, i) => (
                    <tr key={row.id} className="border-b border-[#eaecf0] hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{i + 1}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{row.prn}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{row.seat}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{row.name}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{row.cpi}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{row.sgpi}</td>
                      <td className="px-8 py-6 text-[15px] font-medium">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-green-100 text-green-700">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#eaecf0] mt-auto">
          <button className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <div className="flex gap-1">
            {[1, 2, 3, '...', 8, 9, 10].map((p, i) => (
              <button
                key={i}
                className={`w-10 h-10 rounded-[8px] flex items-center justify-center text-[14px] font-medium transition-colors ${
                  p === 1 ? 'bg-[#f0f1ff] text-[#0e1680]' : 'text-[#667085] hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 border border-[#d0d5dd] rounded-[8px] text-[14px] font-medium text-[#344054] bg-white hover:bg-gray-50 transition-colors shadow-sm">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Action */}
      {activeTab === 'declaration' && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowLiveModal(true)}
            className="px-6 py-2.5 bg-[#0e1680] text-white text-[16px] font-semibold rounded-[8px] shadow-sm hover:bg-[#0a1060] transition-colors"
          >
            Publish Result
          </button>
        </div>
      )}

      {/* Modals */}
      <FeedbackModal
        isOpen={showLiveModal}
        onClose={() => setShowLiveModal(false)}
        type="warning-confirm"
        title="Do you really want to make result live?"
        onConfirm={handleMakeLive}
        confirmLabel="Yes"
        cancelLabel="No"
      />

      <FeedbackModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Result is live successfully !!"
        backLabel="Back"
      />
    </div>
  );
};
