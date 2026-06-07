import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, X } from 'lucide-react';
import { emergencyActionSchema, type EmergencyActionFormValues } from '../../../schemas/COE/emergencyHandlingSchema';

// ─── Mock Data ────────────────────────────────────────────────────────

type ExamEvent = {
  event_id: number;
  event_name: string;
  reg_start: string;
  reg_end: string;
  status: string;
};

const mockEvents: ExamEvent[] = [
  { event_id: 1, event_name: 'Summer 2026', reg_start: '11/05/2026', reg_end: '30/05/2026', status: 'Active' },
  { event_id: 2, event_name: 'Winter 2026', reg_start: '10/11/2026', reg_end: '30/11/2026', status: 'Scheduled' },
  { event_id: 3, event_name: 'Spring 2026', reg_start: '15/01/2026', reg_end: '15/02/2026', status: 'Cancelled' },
];

type ActionHistory = {
  id: number;
  session: string;
  action: string;
  reason: string;
  date: string;
};

const initialHistory: ActionHistory[] = [
  { id: 1, session: 'Spring 2026', action: 'Cancel', reason: 'Unforeseen circumstances', date: '2026-02-10' },
];

// ─── Component ────────────────────────────────────────────────────────

export const EmergencyHandlingPage = () => {
  const [activeTab, setActiveTab] = useState<'Manage Sessions' | 'Action History'>('Manage Sessions');
  const [history, setHistory] = useState<ActionHistory[]>(initialHistory);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmergencyActionFormValues>({
    resolver: zodResolver(emergencyActionSchema),
    defaultValues: { eventId: '', action: 'Cancel', reason: '' },
  });

  const selectedEventId = watch('eventId');
  const selectedAction = watch('action');
  
  const selectedEvent = mockEvents.find((e) => e.event_id.toString() === selectedEventId);

  const onSubmit = (data: EmergencyActionFormValues) => {
    const eventName = mockEvents.find(e => e.event_id.toString() === data.eventId)?.event_name || 'Unknown Session';
    
    const newRecord = {
      id: Date.now(),
      session: eventName,
      action: data.action,
      reason: data.reason,
      date: new Date().toISOString().split('T')[0]
    };
    setHistory([newRecord, ...history]);
    
    reset();
    
    if (data.action === 'Reschedule') {
      setSuccessMessage('Session rescheduled successfully!');
    } else {
      setSuccessMessage('Confirm and Notify successfully!');
    }
    
    setShowSuccessModal(true);
  };

  return (
    <div className="w-full flex flex-col font-['Instrument_Sans',sans-serif]">
      {/* ── Success Modal ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#344054]/70 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] shadow-xl w-[510px] flex flex-col items-center justify-center pt-[50px] pb-[45px] px-[20px] relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-[#667085] hover:text-[#101828] transition-colors"
            >
              <X size={24} />
            </button>
            <div className="w-[136px] h-[136px] bg-[#effbe7] text-[#095512] rounded-full flex items-center justify-center mb-[24px]">
              <Check size={64} strokeWidth={3} />
            </div>
            <h2 className="text-[24px] font-bold text-[#101828] mb-[60px] text-center max-w-[425px]">
              {successMessage}
            </h2>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-[86px] h-[44px] bg-[#0e1680] text-white text-[15px] font-bold rounded-[8px] hover:bg-[#0a1060] transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── Header & Tabs ── */}
      <div className="mb-6">
        <h1 className="text-[32px] font-semibold text-[#101828] mb-6">Emergency Handling Screen</h1>
        <div className="flex border-b border-[#eaecf0]">
          {['Manage Sessions', 'Action History'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 px-1 mr-8 text-[14px] font-medium transition-colors cursor-pointer relative ${
                activeTab === tab ? 'text-[#0e1680]' : 'text-[#667085] hover:text-[#344054]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0e1680]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Manage Sessions' && (
        <div className="flex flex-col gap-6">
          {/* ── Form Section ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-[18px] font-semibold text-[#101828] mb-6">Appointment Input</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Select */}
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-[#344054]">
                    Select Session <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('eventId')}
                    className={`w-full p-3 border ${
                      errors.eventId ? 'border-red-500' : 'border-[#d0d5dd]'
                    } rounded-[8px] bg-white text-[#101828] text-[15px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680]`}
                  >
                    <option value="">-- Choose a session --</option>
                    {mockEvents.map(e => (
                      <option key={e.event_id} value={e.event_id}>
                        {e.event_name} ({e.status})
                      </option>
                    ))}
                  </select>
                  {errors.eventId && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.eventId.message}
                    </span>
                  )}
                </div>

                {/* Action Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-semibold text-[#344054]">
                    Select Action <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('action')}
                    className={`w-full p-3 border ${
                      errors.action ? 'border-red-500' : 'border-[#d0d5dd]'
                    } rounded-[8px] bg-white text-[#101828] text-[15px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680]`}
                  >
                    <option value="Cancel">Cancel Session</option>
                    <option value="Interrupt">Interrupt Session</option>
                    <option value="Reschedule">Reschedule Session</option>
                  </select>
                  {errors.action && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.action.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#344054]">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('reason')}
                  placeholder={`Enter reason for ${selectedAction?.toLowerCase() || 'action'}ing the session...`}
                  rows={4}
                  className={`w-full p-3 border ${
                    errors.reason ? 'border-red-500 ring-2 ring-red-500/10' : 'border-[#d0d5dd]'
                  } rounded-[8px] bg-white text-[#101828] text-[15px] focus:outline-none focus:ring-4 focus:ring-[#0e1680]/5 focus:border-[#0e1680] resize-none`}
                />
                {errors.reason && (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.reason.message}
                  </span>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#0e1680] text-white text-[15px] font-bold rounded-[8px] hover:bg-[#0a1060] transition-colors cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Action'}
                </button>
              </div>
            </form>
          </div>

          {/* ── Selected Session Info ── */}
          {selectedEvent && (
            <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-8 shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)]">
              <h3 className="text-[16px] font-semibold text-[#101828] mb-4">Selected Session Details</h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#667085] font-medium w-[60px]">Session:</span>
                  <span className="text-[14px] text-[#101828] font-semibold">{selectedEvent.event_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#667085] font-medium w-[40px]">Date:</span>
                  <span className="text-[14px] text-[#101828] font-semibold">
                    {selectedEvent.reg_start} to {selectedEvent.reg_end}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#667085] font-medium w-[50px]">Status:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedEvent.status === 'Active' ? 'bg-[#effbe7] text-[#095512]' :
                    selectedEvent.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {selectedEvent.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Action History' && (
        <div className="bg-white rounded-2xl shadow-[0px_12px_16px_0px_rgba(16,24,40,0.08)] border border-gray-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eaecf0] bg-[#f9fafb]">
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085] w-[80px]">Sr no.</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Session</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Action Taken</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Date</th>
                  <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-[#667085]">Reason</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? (
                  history.map((record, idx) => (
                    <tr key={record.id} className="border-b border-[#eaecf0] hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{idx + 1}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#101828]">{record.session}</td>
                      <td className="px-8 py-6 text-[15px] font-medium">
                        <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold ${
                          record.action === 'Cancel' ? 'bg-red-50 text-red-700' :
                          record.action === 'Interrupt' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {record.action}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467]">{record.date}</td>
                      <td className="px-8 py-6 text-[15px] font-medium text-[#475467] max-w-[300px] truncate" title={record.reason}>
                        {record.reason}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-6 text-[15px] font-medium text-center text-[#667085]">
                      No emergency actions have been recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
