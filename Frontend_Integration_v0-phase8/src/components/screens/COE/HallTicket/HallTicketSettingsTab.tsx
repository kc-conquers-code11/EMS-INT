import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import { HallTicketSuccessModal } from './HallTicketSuccessModal';
import { hallTicketAPI } from '../../../../services/hallTicket/hallTicketApi';
import type {
  GeneratedHallTicketPayload,
  HallTicketSettingsPayload,
  HallTicketStatus,
  LateExamRequired,
} from '../../../../types/COE/HallTicket/hallTicket.types';

export const HallTicketSettingsTab: React.FC = () => {
  const [examEvents, setExamEvents] = useState<{ event_id: string; event_name: string }[]>([]);
  const [examEvent, setExamEvent] = useState('');
  const [hallTicketStatus, setHallTicketStatus] = useState<HallTicketStatus>('enabled');
  const [releaseDate, setReleaseDate] = useState('');
  const [downloadLastDate, setDownloadLastDate] = useState('');
  const [lateExamRequired, setLateExamRequired] = useState<LateExamRequired>('no');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<GeneratedHallTicketPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hallTicketAPI.getExamEvents().then(setExamEvents).catch(() => setExamEvents([]));
  }, []);

  const loadSettings = useCallback(async (eventId: string) => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const settings = await hallTicketAPI.getHallTicketSettings(eventId);
      if (settings) {
        setHallTicketStatus(settings.hall_ticket_status);
        setReleaseDate(settings.release_date || '');
        setDownloadLastDate(settings.download_last_date || '');
        setLateExamRequired(settings.late_exam_required || 'no');
      }
    } catch {
      setError('Failed to load hall ticket settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (examEvent) {
      loadSettings(examEvent);
    }
  }, [examEvent, loadSettings]);

  const handleSave = async () => {
    if (!examEvent || !releaseDate || !downloadLastDate) {
      setError('Please select exam event and both dates');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload: HallTicketSettingsPayload = {
        exam_event_id: examEvent,
        hall_ticket_status: hallTicketStatus || 'enabled',
        release_date: releaseDate,
        download_last_date: downloadLastDate,
        late_exam_required: lateExamRequired || 'no',
      };
      await hallTicketAPI.saveHallTicketSettings(payload);
      setShowSuccess(true);
    } catch {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const previewSubjects = previewData?.subjects ?? [];

  return (
    <>
      {error && (
        <p className="text-sm text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-[15px]">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
            Exam Event
          </label>
          <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
            <div className="flex-1 px-[14px] py-[10px]">
              <select
                id="hall-ticket-exam-event"
                value={examEvent}
                onChange={(e) => setExamEvent(e.target.value)}
                className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
              >
                <option value="">Select exam event</option>
                {examEvents.map((evt) => (
                  <option key={evt.event_id} value={evt.event_id}>
                    {evt.event_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="px-[14px] py-[10px] flex items-center justify-center">
              <ChevronDown size={20} className="text-[#687b96]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
            Hall Ticket Status
          </label>
          <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
            <div className="flex-1 px-[14px] py-[10px]">
              <select
                id="hall-ticket-status"
                value={hallTicketStatus}
                onChange={(e) => setHallTicketStatus(e.target.value as HallTicketStatus)}
                className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div className="px-[14px] py-[10px] flex items-center justify-center">
              <ChevronDown size={20} className="text-[#687b96]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
            Release date
          </label>
          <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
            <div className="flex-1 px-[14px] py-[10px]">
              <input
                id="hall-ticket-release-date"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none font-['Instrument_Sans']"
              />
            </div>
            <div className="px-[14px] py-[10px] flex items-center justify-center">
              <Calendar size={20} className="text-[#687b96]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
            Download last date
          </label>
          <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
            <div className="flex-1 px-[14px] py-[10px]">
              <input
                id="hall-ticket-download-last-date"
                type="date"
                value={downloadLastDate}
                onChange={(e) => setDownloadLastDate(e.target.value)}
                className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none font-['Instrument_Sans']"
              />
            </div>
            <div className="px-[14px] py-[10px] flex items-center justify-center">
              <Calendar size={20} className="text-[#687b96]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
            Late exam required
          </label>
          <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
            <div className="flex-1 px-[14px] py-[10px]">
              <select
                id="hall-ticket-late-exam"
                value={lateExamRequired}
                onChange={(e) => setLateExamRequired(e.target.value as LateExamRequired)}
                className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="px-[14px] py-[10px] flex items-center justify-center">
              <ChevronDown size={20} className="text-[#687b96]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-[15px] mt-4">
        <button
          id="hall-ticket-save-settings"
          onClick={handleSave}
          disabled={loading}
          className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer font-['Instrument_Sans'] disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save settings'}
        </button>
        <button
          id="hall-ticket-preview"
          onClick={handlePreview}
          className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer font-['Instrument_Sans']"
        >
          Preview Student View
        </button>
      </div>

      {showPreview && (
        <div className="mt-6">
          <div className="bg-white border border-[#e4e7ec] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-[21px] border-b border-[#e4e7ec]">
              <h2 className="text-[24px] font-semibold text-[#101828] leading-[32px]">Hall Ticket</h2>
            </div>
            <div className="p-5">
              <div className="border border-[#e4e7ec] rounded-lg overflow-hidden">
                {/* Logo Banner */}
                <div className="bg-[#f2f4f7] flex items-center justify-center h-[140px] border-b border-[#e4e7ec]">
                  <span className="text-[28px] font-semibold text-[#667085] tracking-tight">Logo</span>
                </div>

                {/* Student Info + Photo */}
                <div className="px-8 pt-8 pb-6 flex items-start justify-between gap-6">
                  <div className="grid grid-cols-[200px_1fr] gap-y-4 text-[14px] flex-1">
                    <span className="font-semibold text-[#344054]">Enrollment/Student ID :</span>
                    <span className="text-[#101828]">ENR2024001</span>

                    <span className="font-semibold text-[#344054]">Student Name :</span>
                    <span className="text-[#101828]">John Doe</span>

                    <span className="font-semibold text-[#344054]">Branch:</span>
                    <span className="text-[#101828]">Computer Science & Engineering</span>

                    <span className="font-semibold text-[#344054]">Semester :</span>
                    <span className="text-[#101828]">6th Semester</span>

                    <span className="font-semibold text-[#344054]">Exam Event:</span>
                    <span className="text-[#101828]">Summer 2026 Regular Exam</span>

                    <span className="font-semibold text-[#344054]">Seat number</span>
                    <span className="text-[#101828]">A-101</span>
                  </div>
                  <div className="w-[100px] h-[110px] bg-[#d0d5dd] rounded-md flex-shrink-0" />
                </div>

                {/* Subject Table */}
                <div className="px-8 pb-8">
                  <table className="w-full text-[13px] text-[#101828] border-collapse">
                    <thead>
                      <tr className="border-b border-[#e4e7ec]">
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085] pr-4 w-[60px]">Sr. No.</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085] pr-4">Course/subject code</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085] pr-4">Course/Subject Name</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085] pr-4">Date</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-[#667085]">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { srNo: 1, code: 'CS301', name: 'Data Structures & Algorithms', date: '10 May 2026', time: '10:00 AM' },
                        { srNo: 2, code: 'CS302', name: 'Database Management Systems', date: '12 May 2026', time: '10:00 AM' },
                        { srNo: 3, code: 'CS303', name: 'Operating Systems', date: '14 May 2026', time: '10:00 AM' },
                        { srNo: 4, code: 'CS304', name: 'Computer Networks', date: '16 May 2026', time: '10:00 AM' },
                      ].map(sub => (
                        <tr key={sub.srNo} className="border-b border-[#f2f4f7] last:border-0">
                          <td className="px-8 py-6 text-[15px] font-medium pr-4 text-center text-[#344054]">{sub.srNo}</td>
                          <td className="px-8 py-6 text-[15px] font-medium pr-4 text-[#0e1680]">{sub.code}</td>
                          <td className="px-8 py-6 text-[15px] font-medium pr-4 text-[#0e1680]">{sub.name}</td>
                          <td className="px-8 py-6 text-[15px] font-medium pr-4 text-[#344054]">{sub.date}</td>
                          <td className="px-8 py-6 text-[15px] font-medium text-[#344054]">{sub.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signature Row */}
                <div className="px-8 py-8 border-t border-[#e4e7ec] flex items-end justify-between">
                  <div className="text-[13px] font-semibold text-[#344054]">Student Signature</div>
                  <div className="text-[13px] font-semibold text-[#344054]">Department stamp</div>
                  <div className="text-[13px] font-semibold text-[#344054]">Principal signature</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <HallTicketSuccessModal onClose={() => setShowSuccess(false)} />
      )}
    </>
  );
};
