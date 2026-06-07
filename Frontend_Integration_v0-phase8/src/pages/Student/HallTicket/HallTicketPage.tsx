import React, { useEffect, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { HallTicketCard } from '../../../components/screens/Student/HallTicket/HallTicketCard';
import { Can } from '../../../components/common/Can';
import { hallTicketAPI } from '../../../services/hallTicket/hallTicketApi';
import {
  DOWNLOAD_HALL_TICKET,
  VIEW_HALL_TICKET,
} from '../../../types/Permissions/permission.types';
import type { HallTicketPublishStatus } from '../../../types/COE/HallTicket/hallTicket.types';
import type { HallTicket } from '../../../types/Student/HallTicket/hallTicket';
import { formatDateTimeDDMMYYYYHHMM } from '../../../utils/formatDateTime';

export const HallTicketPage: React.FC = () => {
  const [hallTicketData, setHallTicketData] = useState<HallTicket | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [canDownload, setCanDownload] = useState(false);
  const [hasTicketRecord, setHasTicketRecord] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<HallTicketPublishStatus | null>(null);
  const [viewPublished, setViewPublished] = useState(false);
  const [withinDownloadWindow, setWithinDownloadWindow] = useState(true);
  const [downloadLastDate, setDownloadLastDate] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string | null>(null);

  const isPublished = publishStatus?.is_published ?? viewPublished;

  const showScheduledBanner =
    publishStatus &&
    !isPublished &&
    publishStatus.status === 'scheduled' &&
    publishStatus.scheduled_at;

  const showTicketContent =
    isPublished && (!!hallTicketData || hasTicketRecord);

  const allowDownload =
    !loading &&
    !refreshing &&
    canDownload &&
    isPublished &&
    hasTicketRecord &&
    withinDownloadWindow &&
    !!eventId;

  const refreshView = async (evtId?: string) => {
    const view = await hallTicketAPI.getStudentHallTicketView(evtId);
    setEventId(view.event_id);
    setEventName(view.event_name);
    setViewPublished(view.published);
    setCanDownload(view.can_download);
    setHasTicketRecord(view.has_ticket_record === true);
    setWithinDownloadWindow(view.within_download_window !== false);
    setDownloadLastDate(view.download_last_date ?? null);
    setInfoMessage(view.message);
    setHallTicketData(view.hall_ticket ?? null);
    return view;
  };

  const syncPublishAndDownload = async (
    view: Awaited<ReturnType<typeof refreshView>>
  ) => {
    if (!view.event_id) return;
    try {
      const status = await hallTicketAPI.getPublishStatus(view.event_id);
      setPublishStatus(status);
    } catch {
      setPublishStatus(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const view = await refreshView();
        await syncPublishAndDownload(view);
      } catch {
        setError('Unable to load your hall ticket. Please try again later.');
        setHallTicketData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!eventId || !publishStatus) return;
    if (publishStatus.status !== 'scheduled' && publishStatus.status !== 'active') return;

    const interval = setInterval(async () => {
      try {
        const status = await hallTicketAPI.getPublishStatus(eventId);
        setPublishStatus(status);
        if (status.is_published) {
          const view = await refreshView(eventId);
          setCanDownload(view.can_download);
          setHasTicketRecord(view.has_ticket_record === true);
        }
      } catch {
        /* ignore poll errors */
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [eventId, publishStatus?.status]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const view = await refreshView(eventId ?? undefined);
      await syncPublishAndDownload(view);
    } catch {
      setError('Unable to refresh hall ticket. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDownload = async () => {
    if (!allowDownload || !eventId) return;
    setDownloading(true);
    setError(null);
    try {
      const blob = await hallTicketAPI.downloadStudentHallTicket(eventId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hall_ticket.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      setError(
        apiMessage ||
          'Failed to download hall ticket PDF. Ensure your ticket was generated by the exam office.'
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Can
      permission={VIEW_HALL_TICKET}
      fallback={
        <div className="flex flex-col min-h-full p-8 gap-6 font-['Instrument_Sans']">
          <h1 className="text-[28px] font-semibold text-[#171822]">Hall Ticket</h1>
          <p className="text-[#667085] text-sm">
            You do not have permission to view hall tickets. Contact your administrator if you
            believe this is an error.
          </p>
        </div>
      }
    >
      <div className="flex flex-col min-h-full p-8 gap-6 font-['Instrument_Sans'] print:p-0 print:bg-white">
        <div className="flex items-center justify-between print:hidden mb-2">
          <h1 className="text-[28px] font-semibold text-[#171822]">Hall Ticket</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#d0d5dd] text-[#344054] text-[14px] font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Refresh hall ticket"
            >
              <RefreshCw size={17} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <Can permission={DOWNLOAD_HALL_TICKET}>
              <button
                onClick={handleDownload}
                disabled={!allowDownload || downloading}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0e1680] text-white text-[14px] font-semibold rounded-lg hover:bg-[#0b1260] transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  loading || refreshing
                    ? 'Loading hall ticket status...'
                    : !isPublished
                      ? 'Hall tickets are not published yet'
                      : !hasTicketRecord
                        ? 'Hall ticket PDF not generated yet'
                        : !withinDownloadWindow
                        ? 'Download window has closed'
                        : !canDownload
                          ? 'Download not available'
                          : 'Download hall_ticket.pdf'
                }
              >
                <span>{downloading ? 'Downloading...' : 'Download'}</span>
                <Download size={17} strokeWidth={2} />
              </button>
            </Can>
          </div>
        </div>

        {loading && <p className="text-[#667085] text-sm">Loading hall ticket...</p>}

        {error && (
          <p className="text-red-600 text-sm font-medium" role="alert">
            {error}
          </p>
        )}

        {showScheduledBanner && (
          <p className="text-[#475467] text-sm bg-[#fffaeb] border border-[#fec84b] rounded-lg px-4 py-3">
            Your hall ticket will be available on{' '}
            {formatDateTimeDDMMYYYYHHMM(publishStatus.scheduled_at)}.
          </p>
        )}

        {publishStatus?.status === 'active' && !publishStatus.is_published && (
          <p className="text-[#475467] text-sm bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            Hall tickets are being published. Please check back shortly.
          </p>
        )}

        {infoMessage && !error && !showScheduledBanner && !hallTicketData && (
          <p className="text-[#475467] text-sm bg-[#f9fafb] border border-[#eaecf0] rounded-lg px-4 py-3">
            {infoMessage}
          </p>
        )}

        {!withinDownloadWindow && downloadLastDate && !error && (
          <p className="text-[#475467] text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3" role="status">
            {infoMessage ||
              `The download window for the hall ticket of the exam "${eventName || 'this exam'}" closed on ${downloadLastDate.slice(0, 10)}. Contact the college authorities for the hall ticket.`}
          </p>
        )}

        {infoMessage && showTicketContent && !allowDownload && !error && withinDownloadWindow && (
          <p className="text-[#475467] text-sm bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            {infoMessage}
          </p>
        )}

        {hallTicketData && showTicketContent && <HallTicketCard data={hallTicketData} />}

        {!loading &&
          !showTicketContent &&
          !error &&
          !infoMessage &&
          !showScheduledBanner &&
          publishStatus?.status !== 'active' && (
            <p className="text-[#667085]">No hall ticket is available for display yet.</p>
          )}
      </div>
    </Can>
  );
};
