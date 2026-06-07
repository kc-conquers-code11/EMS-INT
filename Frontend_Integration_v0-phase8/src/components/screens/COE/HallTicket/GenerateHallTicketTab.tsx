import React, { useEffect, useState } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import { HallTicketSuccessModal } from './HallTicketSuccessModal';
import {
  getHallTicketPublicUrl,
  hallTicketAPI,
} from '../../../../services/hallTicket/hallTicketApi';
import { downloadBlob, delay } from '../../../../utils/downloadBlob';
import type {
  BulkHallTicketResult,
  GeneratedHallTicketPayload,
  StudentEligibilityRow,
} from '../../../../types/COE/HallTicket/hallTicket.types';

const mapToBulkResult = (
  ticket: GeneratedHallTicketPayload & { error?: string },
  student?: StudentEligibilityRow
): BulkHallTicketResult => {
  const hasPdf = !!(ticket.pdf?.pdf_url || ticket.pdf?.file_name);
  return {
    student_id: ticket.student_id,
    exam_reg_id: student?.exam_reg_id,
    student_name: ticket.student_name || student?.student_name,
    enrollment_no: ticket.enrollment_id || student?.enrollment_no,
    file_name: ticket.pdf?.file_name || 'hall_ticket.pdf',
    pdf_url: ticket.pdf?.pdf_url,
    branch_name: ticket.branch,
    success: hasPdf && !ticket.error,
    error: ticket.error,
  };
};

export const GenerateHallTicketTab: React.FC = () => {
  const [examEvents, setExamEvents] = useState<{ event_id: string; event_name: string }[]>([]);
  const [examEvent, setExamEvent] = useState('');
  const [eventStudents, setEventStudents] = useState<StudentEligibilityRow[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectStudents, setSelectStudents] = useState('All Eligible Students');
  const [format, setFormat] = useState('PDF(Default)');
  const [includeSignature, setIncludeSignature] = useState('Yes');
  const [isGenerated, setIsGenerated] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [bulkResults, setBulkResults] = useState<BulkHallTicketResult[]>([]);

  const includePrincipalSignature = includeSignature === 'Yes';

  useEffect(() => {
    hallTicketAPI.getExamEvents().then(setExamEvents).catch(() => setExamEvents([]));
  }, []);

  useEffect(() => {
    if (!examEvent) {
      setEventStudents([]);
      setSelectedStudentId('');
      setBulkResults([]);
      return;
    }

    setLoadingStudents(true);
    setError(null);
    hallTicketAPI
      .getStudentsEligibility({ examEventId: examEvent })
      .then((rows) => {
        const byStudent = new Map<string, StudentEligibilityRow>();
        for (const row of rows) {
          if (!row.student_id) continue;
          const prev = byStudent.get(row.student_id);
          if (!prev || (row.can_generate && !prev.can_generate)) {
            byStudent.set(row.student_id, row);
          }
        }
        setEventStudents(Array.from(byStudent.values()));
        setSelectedStudentId('');
      })
      .catch(() => {
        setEventStudents([]);
        setError('Failed to load students for this exam event');
      })
      .finally(() => setLoadingStudents(false));
  }, [examEvent]);

  const downloadOneTicket = async (studentId: string, label: string) => {
    const blob = await hallTicketAPI.downloadHallTicket(
      studentId,
      examEvent,
      includePrincipalSignature
    );
    downloadBlob(blob, `${label}_hall_ticket.pdf`);
  };

  const downloadAllSuccessful = async (rows: BulkHallTicketResult[]) => {
    const successful = rows.filter((r) => r.success && r.student_id);
    if (!successful.length || !examEvent) return;

    setDownloadingAll(true);
    try {
      for (let i = 0; i < successful.length; i += 1) {
        const row = successful[i];
        await downloadOneTicket(
          row.student_id,
          row.enrollment_no || row.student_name || row.student_id
        );
        if (i < successful.length - 1) {
          await delay(400);
        }
      }
    } finally {
      setDownloadingAll(false);
    }
  };

  const handleGenerate = async () => {
    if (!examEvent) {
      setError('Please select an exam event');
      return;
    }

    if (selectStudents === 'Specific Students' && !selectedStudentId) {
      setError('Please select a student');
      return;
    }

    setError(null);
    setLoading(true);
    setBulkResults([]);

    try {
      const result = await hallTicketAPI.generateHallTickets({
        exam_event_id: examEvent,
        format: 'pdf',
        include_principal_signature: includePrincipalSignature,
        ...(selectStudents === 'Specific Students'
          ? { student_id: selectedStudentId }
          : {}),
      });

      const bulk = result.results.map((ticket) =>
        mapToBulkResult(
          ticket as GeneratedHallTicketPayload & { error?: string },
          eventStudents.find((s) => s.student_id === ticket.student_id)
        )
      );

      setGeneratedCount(result.generated_count);
      setBulkResults(bulk);

      const failed = bulk.filter((r) => !r.success);
      if (result.generated_count === 0) {
        setError(
          failed[0]?.error ||
            'No hall ticket PDFs were created. Ensure sign.png exists at uploads/faculty/principal/sign.png and Chrome is installed (npm run puppeteer:install in EMS-Backend).'
        );
        return;
      }
      if (failed.length > 0) {
        setError(`${failed.length} student(s) failed: ${failed.map((f) => f.error).join('; ')}`);
      }
      setShowSuccessModal(true);
      setIsGenerated(true);
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { message?: string; errors?: { message?: string }[] } } })
        ?.response?.data;
      const validationMsg = res?.errors?.[0]?.message;
      setError(validationMsg || res?.message || 'Failed to generate hall tickets');
    } finally {
      setLoading(false);
    }
  };

  const canGenerate =
    !!examEvent &&
    !loading &&
    !downloadingAll &&
    (selectStudents === 'All Eligible Students' ||
      (selectStudents === 'Specific Students' && !!selectedStudentId));

  const successfulBulk = bulkResults.filter((r) => r.success);

  return (
    <div className="flex flex-col gap-[20px]">
      {error && (
        <p className="text-sm text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
          Exam Event
        </label>
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <select
              value={examEvent}
              onChange={(e) => {
                setExamEvent(e.target.value);
                setBulkResults([]);
                setIsGenerated(false);
              }}
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
          <div className="px-[14px] py-[10px] flex items-center justify-center pointer-events-none">
            <ChevronDown size={20} className="text-[#687b96]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
          Select Students
        </label>
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <select
              value={selectStudents}
              onChange={(e) => {
                setSelectStudents(e.target.value);
                setSelectedStudentId('');
                setBulkResults([]);
              }}
              className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
            >
              <option value="All Eligible Students">All Eligible Students</option>
              <option value="Specific Students">Specific Students</option>
            </select>
          </div>
          <div className="px-[14px] py-[10px] flex items-center justify-center pointer-events-none">
            <ChevronDown size={20} className="text-[#687b96]" />
          </div>
        </div>
      </div>

      {selectStudents === 'Specific Students' && examEvent && (
        <div className="flex flex-col gap-[6px]">
          <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
            Student
          </label>
          <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
            <div className="flex-1 px-[14px] py-[10px]">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                disabled={loadingStudents || eventStudents.length === 0}
                className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans'] disabled:opacity-60"
              >
                <option value="">
                  {loadingStudents
                    ? 'Loading students...'
                    : eventStudents.length === 0
                      ? 'No students registered for this event'
                      : 'Select student'}
                </option>
                {eventStudents.map((s) => {
                  const available = !s.on_hold && s.can_generate;
                  return (
                    <option
                      key={s.exam_reg_id || s.student_id}
                      value={s.student_id}
                      disabled={!available}
                      className={
                        available
                          ? 'bg-[#ecfdf3] text-[#027a48]'
                          : 'bg-[#f2f4f7] text-[#98a2b3]'
                      }
                      style={{
                        backgroundColor: available ? '#ecfdf3' : '#f2f4f7',
                        color: available ? '#027a48' : '#98a2b3',
                      }}
                    >
                      {s.student_name} ({s.enrollment_no})
                      {available ? ' — Available' : ` — ${s.reason || 'Not available'}`}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="px-[14px] py-[10px] flex items-center justify-center pointer-events-none">
              <ChevronDown size={20} className="text-[#687b96]" />
            </div>
          </div>
        </div>
      )}

      {examEvent && selectStudents === 'All Eligible Students' && !loadingStudents && (
        <p className="text-sm text-[#667085]">
          {eventStudents.filter((s) => s.eligibility === 'Eligible' && !s.on_hold).length} eligible
          student(s) will receive hall tickets.
        </p>
      )}

      {selectStudents === 'Specific Students' && examEvent && !loadingStudents && (
        <div className="flex gap-4 text-[12px] text-[#667085]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#ecfdf3] border border-[#abefc6]" />
            Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#f2f4f7] border border-[#d0d5dd]" />
            Not available
          </span>
        </div>
      )}

      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
          Hall Ticket Format
        </label>
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
            >
              <option value="PDF(Default)">PDF(Default)</option>
              <option value="HTML">HTML</option>
            </select>
          </div>
          <div className="px-[14px] py-[10px] flex items-center justify-center pointer-events-none">
            <ChevronDown size={20} className="text-[#687b96]" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
          Include Principal Signature
        </label>
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <select
              value={includeSignature}
              onChange={(e) => setIncludeSignature(e.target.value)}
              className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans']"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div className="px-[14px] py-[10px] flex items-center justify-center pointer-events-none">
            <ChevronDown size={20} className="text-[#687b96]" />
          </div>
        </div>
        {includePrincipalSignature && (
          <p className="text-[12px] text-[#667085]">
            Embeds Principal signature from{' '}
            <code className="text-[11px]">uploads/faculty/principal/sign.png</code> into each{' '}
            <code className="text-[11px]">hall_ticket.pdf</code>.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-[12px] mt-2 flex-wrap">
        <button
          onClick={handleGenerate}
          disabled={!canGenerate}
          className="bg-[#0e1680] text-white font-semibold text-[16px] leading-[24px] px-[18px] py-[10px] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer font-['Instrument_Sans'] disabled:opacity-60"
        >
          {loading
            ? 'Generating...'
            : downloadingAll
              ? 'Downloading...'
              : 'Generate Hall Tickets'}
        </button>
        {successfulBulk.length > 0 && (
          <button
            type="button"
            onClick={() => downloadAllSuccessful(bulkResults).catch(() => setError('Failed to download hall tickets'))}
            disabled={downloadingAll || loading}
            className="border border-[#0e1680] text-[#0e1680] font-semibold text-[14px] px-[14px] py-[10px] rounded-[8px] hover:bg-[#f0f2ff] transition-colors disabled:opacity-60 font-['Instrument_Sans']"
          >
            {downloadingAll ? 'Downloading...' : `Download all (${successfulBulk.length})`}
          </button>
        )}
        {isGenerated && (
          <span className="text-sm text-[#475467]">
            {generatedCount} ticket(s) generated
          </span>
        )}
      </div>

      {successfulBulk.length > 0 && (
        <div className="border border-[#e4e7ec] rounded-[12px] overflow-hidden">
          <div className="bg-[#f9fafb] px-4 py-3 border-b border-[#e4e7ec]">
            <h3 className="text-[14px] font-semibold text-[#344054] font-['Instrument_Sans']">
              Generated hall tickets
            </h3>
            <p className="text-[12px] text-[#667085] mt-1">
              Saved under uploads/students/&#123;branch&#125;/&#123;enrollment&#125;/hall_ticket.pdf
            </p>
          </div>
          <ul className="divide-y divide-[#e4e7ec] max-h-[280px] overflow-y-auto">
            {bulkResults.map((row, index) => (
              <li
                key={row.exam_reg_id || `${row.student_id}-${index}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-[14px]"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[#101828] truncate">
                    {row.student_name} ({row.enrollment_no})
                  </p>
                  <p className="text-[12px] text-[#667085] truncate">
                    {row.success
                      ? `${row.branch_code || row.branch_name || 'Branch'} · ${row.file_name || 'hall_ticket.pdf'}`
                      : row.error || 'Failed'}
                  </p>
                  {row.success && row.pdf_url && (
                    <a
                      href={getHallTicketPublicUrl(row.pdf_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-[#0e1680] hover:underline mt-0.5 inline-block"
                    >
                      View PDF
                    </a>
                  )}
                </div>
                {row.success && (
                  <button
                    type="button"
                    onClick={() =>
                      downloadOneTicket(
                        row.student_id,
                        row.enrollment_no || row.student_name || row.student_id
                      ).catch(() => setError('Failed to download hall ticket'))
                    }
                    className="shrink-0 flex items-center gap-1 text-[#0e1680] font-medium text-[13px] hover:underline"
                  >
                    <Download size={16} />
                    Download
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuccessModal && (
        <HallTicketSuccessModal
          onClose={() => setShowSuccessModal(false)}
          message={`Hall tickets generated successfully ! (${generatedCount})`}
        />
      )}
    </div>
  );
};
