import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { SchedulePublishModal } from './SchedulePublishModal';
import { HallTicketSuccessModal } from './HallTicketSuccessModal';
import { hallTicketAPI } from '../../../../services/hallTicket/hallTicketApi';
import type { HallTicketPublishStatus } from '../../../../types/COE/HallTicket/hallTicket.types';
import { formatDateTimeDDMMYYYYHHMM } from '../../../../utils/formatDateTime';

const PUBLISH_NOW_DELAY_SEC = 15;
const PUBLISH_NOW_DELAY_MS = PUBLISH_NOW_DELAY_SEC * 1000;

const PublishStatusBadge: React.FC<{
  status: HallTicketPublishStatus | null;
  countdownSec: number | null;
}> = ({ status, countdownSec }) => {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium';

  if (countdownSec !== null && countdownSec > 0) {
    return (
      <span className={`${base} bg-amber-50 text-amber-800 border border-amber-200`}>
        Publishing in {countdownSec}s...
      </span>
    );
  }

  if (!status || status.status === 'not_found') return null;

  if (status.status === 'scheduled') {
    return (
      <span className={`${base} bg-amber-50 text-amber-800 border border-amber-200`}>
        Scheduled for {formatDateTimeDDMMYYYYHHMM(status.scheduled_at)}
      </span>
    );
  }
  if (status.status === 'active') {
    return (
      <span className={`${base} bg-blue-50 text-blue-800 border border-blue-200`}>
        Publishing in progress...
      </span>
    );
  }
  if (status.status === 'completed') {
    return (
      <span className={`${base} bg-green-50 text-green-800 border border-green-200`}>
        Published on {formatDateTimeDDMMYYYYHHMM(status.published_at)}
      </span>
    );
  }
  if (status.status === 'failed') {
    return (
      <span className={`${base} bg-red-50 text-red-800 border border-red-200`}>
        Publish failed. Retry?
      </span>
    );
  }
  return null;
};

export const PublishHallTicketTab: React.FC = () => {
  const [examEvents, setExamEvents] = useState<{ event_id: string; event_name: string }[]>([]);
  const [examEvent, setExamEvent] = useState('');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdownSec, setCountdownSec] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<HallTicketPublishStatus | null>(null);
  const [successModalConfig, setSuccessModalConfig] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: '' });

  const publishDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPublishTimers = useCallback(() => {
    if (publishDelayRef.current) {
      clearTimeout(publishDelayRef.current);
      publishDelayRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const refreshPublishStatus = useCallback(async (eventId: string) => {
    if (!eventId) {
      setPublishStatus(null);
      return null;
    }
    try {
      const status = await hallTicketAPI.getPublishStatus(eventId);
      setPublishStatus(status);
      return status;
    } catch {
      setPublishStatus(null);
      return null;
    }
  }, []);

  const startStatusPolling = useCallback(
    (eventId: string) => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(async () => {
        const status = await refreshPublishStatus(eventId);
        if (
          status?.status === 'completed' ||
          status?.status === 'failed' ||
          status?.status === 'not_found'
        ) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          if (status?.status === 'completed') {
            setLoading(false);
            setSuccessModalConfig({
              isOpen: true,
              message: 'Hall tickets published to the student portal successfully!',
            });
          }
          if (status?.status === 'failed') {
            setLoading(false);
            setError('Publish failed. Check server logs and try again.');
          }
        }
      }, 3000);
    },
    [refreshPublishStatus]
  );

  useEffect(() => {
    hallTicketAPI.getExamEvents().then(setExamEvents).catch(() => setExamEvents([]));
  }, []);

  useEffect(() => {
    refreshPublishStatus(examEvent);
  }, [examEvent, refreshPublishStatus]);

  useEffect(() => {
    if (!examEvent || !publishStatus) return;
    if (publishStatus.status !== 'scheduled' && publishStatus.status !== 'active') return;

    const interval = setInterval(() => {
      refreshPublishStatus(examEvent);
    }, 5000);

    return () => clearInterval(interval);
  }, [examEvent, publishStatus?.status, refreshPublishStatus]);

  useEffect(() => {
    return () => {
      clearPublishTimers();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [clearPublishTimers]);

  const handlePublishNow = () => {
    if (!examEvent) {
      setError('Please select an exam event');
      return;
    }
    if (countdownSec !== null || loading) return;

    setError(null);
    setLoading(true);
    setCountdownSec(PUBLISH_NOW_DELAY_SEC);

    countdownIntervalRef.current = setInterval(() => {
      setCountdownSec((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);

    publishDelayRef.current = setTimeout(async () => {
      clearPublishTimers();
      setCountdownSec(null);

      try {
        await hallTicketAPI.publishHallTickets(examEvent);
        await refreshPublishStatus(examEvent);
        startStatusPolling(examEvent);
      } catch {
        setLoading(false);
        setError('Failed to publish hall tickets. Ensure settings are saved for this event.');
      }
    }, PUBLISH_NOW_DELAY_MS);
  };

  const handleScheduleSave = async (date: string, time: string) => {
    if (!examEvent) {
      setError('Please select an exam event');
      return;
    }
    setError(null);
    setLoading(true);
    const scheduledAt = `${date}T${time}:00`;
    try {
      await hallTicketAPI.publishHallTickets(examEvent, scheduledAt);
      setIsScheduleOpen(false);
      await refreshPublishStatus(examEvent);
      setSuccessModalConfig({
        isOpen: true,
        message: 'Hall tickets publish scheduled successfully!',
      });
    } catch {
      setError('Failed to schedule publish');
    } finally {
      setLoading(false);
    }
  };

  const isWaitingToPublish = countdownSec !== null && countdownSec > 0;
  const publishNowDisabled = loading || !examEvent || isWaitingToPublish;

  return (
    <div className="flex flex-col gap-[20px]">
      {error && (
        <p className="text-sm text-red-600 font-medium" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-[6px] max-w-md">
        <label className="text-[14px] font-medium text-[#344054] leading-[20px]">
          Exam Event
        </label>
        <div className="flex items-center bg-white border border-[#d0d5dd] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] overflow-hidden">
          <div className="flex-1 px-[14px] py-[10px]">
            <select
              value={examEvent}
              onChange={(e) => {
                clearPublishTimers();
                setCountdownSec(null);
                setLoading(false);
                setExamEvent(e.target.value);
              }}
              disabled={isWaitingToPublish}
              className="w-full text-[16px] leading-[24px] text-[#687b96] bg-transparent outline-none appearance-none cursor-pointer font-['Instrument_Sans'] disabled:opacity-60"
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

      {examEvent && <PublishStatusBadge status={publishStatus} countdownSec={countdownSec} />}

      <div className="flex items-start justify-between w-full">
        <h2 className="text-[18px] font-semibold text-[#2c3e50] leading-[28px] font-['Instrument_Sans']">
          Publish Hall Tickets to Student Portal
        </h2>

        <div className="flex flex-col gap-[12px]">
          <button
            type="button"
            onClick={handlePublishNow}
            disabled={publishNowDisabled}
            className="bg-[#0e1680] text-white font-semibold text-[14px] leading-[20px] px-[24px] py-[10px] rounded-[6px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer w-[150px] font-['Instrument_Sans'] disabled:opacity-60"
          >
            {isWaitingToPublish
              ? `Publish Now (${countdownSec}s)`
              : loading && countdownSec === null
                ? 'Publishing...'
                : 'Publish Now'}
          </button>

          <button
            type="button"
            onClick={() => setIsScheduleOpen(true)}
            disabled={loading || !examEvent || isWaitingToPublish}
            className="bg-[#0e1680] text-white font-semibold text-[14px] leading-[20px] px-[24px] py-[10px] rounded-[6px] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-[#0c1260] transition-colors cursor-pointer w-[150px] font-['Instrument_Sans'] disabled:opacity-60"
          >
            Schedule Publish
          </button>
        </div>
      </div>

      <p className="text-[12px] text-[#667085] max-w-lg">
        Publish Now waits {PUBLISH_NOW_DELAY_SEC} seconds, then publishes hall tickets for the selected exam event and
        generates PDFs for eligible students.
      </p>

      <SchedulePublishModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSave={handleScheduleSave}
      />

      {successModalConfig.isOpen && (
        <HallTicketSuccessModal
          message={successModalConfig.message}
          onClose={() => setSuccessModalConfig({ isOpen: false, message: '' })}
        />
      )}
    </div>
  );
};
