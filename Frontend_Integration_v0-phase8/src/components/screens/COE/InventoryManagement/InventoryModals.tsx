import type { InventoryItem } from '../../../../types/COE/inventory';

const ChevDown = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
    <path d="M1 1.5L6 6.5L11 1.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface InventoryModalsProps {
  viewItem: InventoryItem | null;
  setViewItem: (item: InventoryItem | null) => void;
  editItem: InventoryItem | null;
  setEditItem: (item: InventoryItem | null) => void;
  uForm: { batch: string; examSession: string; item: string; quantity: string };
  setUForm: React.Dispatch<React.SetStateAction<{ batch: string; examSession: string; item: string; quantity: string }>>;
  stockEditedSuccess: boolean;
  setStockEditedSuccess: (val: boolean) => void;
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  deleteSuccess: boolean;
  setDeleteSuccess: (val: boolean) => void;
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  reportOpen: boolean;
  setReportOpen: (val: boolean) => void;
  reportSuccess: boolean;
  setReportSuccess: (val: boolean) => void;
  handleDownloadReport: () => void;
}

export const InventoryModals: React.FC<InventoryModalsProps> = ({
  viewItem, setViewItem, editItem, setEditItem, uForm, setUForm,
  stockEditedSuccess, setStockEditedSuccess, deleteId, setDeleteId,
  deleteSuccess, setDeleteSuccess, setInventory, reportOpen, setReportOpen,
  reportSuccess, setReportSuccess, handleDownloadReport
}) => {
  return (
    <>
      {/* ── View Modal ── */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] w-[866px] max-w-full shadow-[0px_4px_24px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4" style={{ height: '56px' }}>
              <span className="text-[18px] font-semibold text-[#101828]">View Stock</span>
              <button onClick={() => setViewItem(null)} className="text-[#667085] hover:text-[#000] cursor-pointer transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="w-full h-[1px] bg-[#eaecf0]">─</div>
            <div className="p-6 flex flex-col" style={{ gap: '22px' }}>
              {/* Row 1: Batch */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#344054]">Batch</label>
                <div className="relative">
                  <select disabled value={viewItem.batch} style={{ height: '52px', borderColor: '#eaecf0', borderRadius: '8px', fontSize: '14px', color: '#667085', paddingLeft: '16px', paddingRight: '48px', background: '#fcfcfd' }} className="w-full border appearance-none cursor-not-allowed">
                    <option>{viewItem.batch}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
                </div>
              </div>
              {/* Row 2: Exam Session */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#344054]">Exam Session</label>
                <div className="relative">
                  <select disabled value={viewItem.examSession} style={{ height: '52px', borderColor: '#eaecf0', borderRadius: '8px', fontSize: '14px', color: '#667085', paddingLeft: '16px', paddingRight: '48px', background: '#fcfcfd' }} className="w-full border appearance-none cursor-not-allowed">
                    <option>{viewItem.examSession}</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
                </div>
              </div>
              {/* Row 3: Item & Total Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-[#344054]">Item</label>
                  <div className="relative">
                    <select disabled value={viewItem.item} style={{ height: '52px', borderColor: '#eaecf0', borderRadius: '8px', fontSize: '14px', color: '#667085', paddingLeft: '16px', paddingRight: '48px', background: '#fcfcfd' }} className="w-full border appearance-none cursor-not-allowed">
                      <option>{viewItem.item}</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-[#344054]">Total Quantity</label>
                  <div className="relative">
                    <select disabled value={viewItem.quantity} style={{ height: '52px', borderColor: '#eaecf0', borderRadius: '8px', fontSize: '14px', color: '#667085', paddingLeft: '16px', paddingRight: '48px', background: '#fcfcfd' }} className="w-full border appearance-none cursor-not-allowed">
                      <option>{viewItem.quantity}</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Stock Modal ── */}
      {editItem && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] w-[866px] max-w-full shadow-[0px_4px_24px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4" style={{ height: '56px' }}>
              <span className="text-[18px] font-semibold text-[#101828]">Edit Stock</span>
              <button onClick={() => setEditItem(null)} className="text-[#667085] hover:text-[#000] cursor-pointer transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="w-full h-[1px] bg-[#eaecf0]">─</div>
            <div className="p-6 flex flex-col" style={{ gap: '22px' }}>
              {/* Row 1: Batch */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#344054]">Batch</label>
                <div className="relative">
                  <select value={uForm.batch} onChange={e => setUForm(p => ({ ...p, batch: e.target.value }))} style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }} className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]">
                    <option>SYIT 2025</option>
                    <option>TYIT</option>
                    <option>BEIT</option>
                    <option>FECOMPS</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
                </div>
              </div>
              {/* Row 2: Exam Session */}
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-medium text-[#344054]">Exam Session</label>
                <div className="relative">
                  <select value={uForm.examSession} onChange={e => setUForm(p => ({ ...p, examSession: e.target.value }))} style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }} className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]">
                    <option>End-Sem Apr 2026</option>
                    <option>Winter 2026</option>
                    <option>Summer 2026</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
                </div>
              </div>
              {/* Row 3: Item & Total Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-[#344054]">Item</label>
                  <div className="relative">
                    <select value={uForm.item} onChange={e => setUForm(p => ({ ...p, item: e.target.value }))} style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }} className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]">
                      <option>Supplements Sheet</option>
                      <option>Answer Book</option>
                      <option>Thread</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-[#344054]">Total Quantity</label>
                  <div className="relative">
                    <select value={uForm.quantity} onChange={e => setUForm(p => ({ ...p, quantity: e.target.value }))} style={{ height: '52px', borderColor: '#d0d5dd', borderRadius: '8px', fontSize: '14px', color: '#344054', paddingLeft: '16px', paddingRight: '48px' }} className="w-full border bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#0e1680]">
                      <option>400</option>
                      <option>100</option>
                      <option>200</option>
                      <option>500</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevDown /></div>
                  </div>
                </div>
              </div>
              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => { setEditItem(null); setStockEditedSuccess(true); }}
                  style={{ width: '86px', height: '44px', background: '#0e1680', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}
                  className="text-white cursor-pointer hover:bg-[#0b126c] transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stock Edited Successfully Modal ── */}
      {stockEditedSuccess && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] w-[510px] max-w-full shadow-[0px_4px_24px_rgba(0,0,0,0.08)] flex flex-col items-center p-10 text-center gap-6" style={{ height: '360px' }}>
            <div className="w-[120px] h-[120px] flex items-center justify-center">
              <svg viewBox="0 0 104.667 104.667" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-[20px] font-bold text-[#101828] mt-2">Stock Edited Successfully!</h2>
            <button
              onClick={() => setStockEditedSuccess(false)}
              style={{ width: '86px', height: '44px', background: '#0e1680', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}
              className="text-white cursor-pointer hover:bg-[#0b126c] transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white flex flex-col items-center" style={{ width: '510px', height: '442px', borderRadius: '16px', boxShadow: '0px 8px 40px rgba(0,0,0,0.18)', position: 'relative' }}>
            <div style={{ marginTop: '82px', width: '444px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
              <div style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" stroke="#F04438" strokeWidth="4"/>
                  <circle cx="50" cy="33" r="4" fill="#F04438"/>
                  <line x1="50" y1="45" x2="50" y2="68" stroke="#F04438" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ marginTop: '10px', width: '444px', textAlign: 'center', fontSize: '18px', fontWeight: 600, lineHeight: '32px', color: '#101828', fontFamily: 'Instrument Sans, Inter, sans-serif' }}>
                Do you really want to delete this<br />Distribution of Items?
              </p>
              <div style={{ marginTop: '30px', display: 'flex', gap: '40px', width: '212px', height: '44px' }}>
                <button
                  onClick={() => {
                    setInventory(p => p.filter(i => i.id !== deleteId));
                    setDeleteId(null);
                    setDeleteSuccess(true);
                  }}
                  style={{ width: '86px', height: '44px', background: '#0e1680', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Instrument Sans, Inter, sans-serif' }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  style={{ width: '86px', height: '44px', background: '#0e1680', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Instrument Sans, Inter, sans-serif' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Distribution Deleted Successfully Modal ── */}
      {deleteSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="bg-white flex flex-col items-center" style={{ width: '510px', height: '348px', borderRadius: '16px', boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }}>
            <div style={{ marginTop: '40px', width: '470px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
              <div style={{ width: '136px', height: '136px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="80" height="90" viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="28" y="0" width="24" height="7" rx="3.5" fill="#F04438"/>
                  <rect x="4" y="10" width="72" height="10" rx="5" fill="#F04438"/>
                  <path d="M10 24 L14 86 Q14 90 18 90 L62 90 Q66 90 66 86 L70 24 Z" fill="#F04438" opacity="0.15"/>
                  <path d="M10 24 L14 86 Q14 90 18 90 L62 90 Q66 90 66 86 L70 24 Z" stroke="#F04438" strokeWidth="3.5" fill="none"/>
                  <line x1="40" y1="34" x2="40" y2="80" stroke="#F04438" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="28" y1="34" x2="26" y2="80" stroke="#F04438" strokeWidth="3" strokeLinecap="round"/>
                  <line x1="52" y1="34" x2="54" y2="80" stroke="#F04438" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ marginTop: '16px', width: '439px', textAlign: 'center', fontSize: '18px', fontWeight: 700, lineHeight: '32px', color: '#101828', fontFamily: 'Instrument Sans, Inter, sans-serif' }}>
                Distribution deleted successfully!
              </p>
              <div style={{ marginTop: '28px', width: '470px', display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => setDeleteSuccess(false)}
                  style={{ width: '86px', height: '44px', background: '#0e1680', borderRadius: '8px', fontSize: '14px', fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Instrument Sans, Inter, sans-serif' }}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Report Modal ── */}
      {reportOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white flex flex-col relative" style={{ width: '866px', maxHeight: '85vh', borderRadius: '16px', boxShadow: '0px 8px 40px rgba(0,0,0,0.18)', overflow: 'hidden', fontFamily: 'Instrument Sans, Inter, sans-serif' }}>
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontSize: '18px', fontWeight: 700 }}>Report</h2>
              <button onClick={() => setReportOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px' }}>&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6" style={{ minHeight: 0 }}>
              <div className="space-y-3 text-sm">
                <div className="flex"><span className="font-semibold text-gray-500" style={{ width: '150px' }}>Institution Name</span><span className="text-gray-900 font-medium">Vasantdada Patil Pratishthan's College of Engineering and Visual Arts</span></div>
                <div className="flex"><span className="font-semibold text-gray-500" style={{ width: '150px' }}>Batch</span><span className="text-gray-900 font-medium">SYIT</span></div>
                <div className="flex"><span className="font-semibold text-gray-500" style={{ width: '150px' }}>Exam Session</span><span className="text-gray-900 font-medium">VPPCOE&amp;VA</span></div>
                <div className="flex"><span className="font-semibold text-gray-500" style={{ width: '150px' }}>Generated On</span><span className="text-gray-900 font-medium">25/05/26</span></div>
              </div>
              <div className="pt-2"><h3 className="text-sm font-bold text-gray-900 mb-2">Student Details</h3><div className="flex items-center text-sm"><span className="text-gray-500" style={{ width: '150px' }}>Total Student Registered</span><span className="font-semibold text-gray-900">2000</span></div></div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Required Inventory</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr><th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-gray-600">Item</th><th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center text-gray-600">Avg per Student</th><th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center text-gray-600">Total Student</th><th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center text-gray-600">Required Quantity</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr><td className="px-8 py-6 text-[15px] font-medium text-left text-gray-900">Thread</td><td className="px-8 py-6 text-[15px] font-medium text-center text-gray-500">1000</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">200</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">200</td></tr>
                      <tr><td className="px-8 py-6 text-[15px] font-medium text-left text-gray-900">Supplement Sheets</td><td className="px-8 py-6 text-[15px] font-medium text-center text-gray-500">1000</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">150</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">150</td></tr>
                      <tr><td className="px-8 py-6 text-[15px] font-medium text-left text-gray-900">Answer Book</td><td className="px-8 py-6 text-[15px] font-medium text-center text-gray-500">1000</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">500</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">500</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">Current Inventory Status</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr><th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left text-gray-600">Item</th><th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center text-gray-600">Total Stock</th><th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center text-gray-600">Distributed</th><th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center text-gray-600">Remaining</th><th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center text-gray-600">Shortage</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr><td className="px-8 py-6 text-[15px] font-medium text-left text-gray-900">Thread</td><td className="px-8 py-6 text-[15px] font-medium text-center text-gray-500">3000</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">200</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">200</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">200</td></tr>
                      <tr><td className="px-8 py-6 text-[15px] font-medium text-left text-gray-900">Supplement Sheets</td><td className="px-8 py-6 text-[15px] font-medium text-center text-gray-500">3000</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">150</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">150</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">150</td></tr>
                      <tr><td className="px-8 py-6 text-[15px] font-medium text-left text-gray-900">Answer Book</td><td className="px-8 py-6 text-[15px] font-medium text-center text-gray-500">3000</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">500</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">500</td><td className="px-8 py-6 text-[15px] font-medium text-center text-blue-600">500</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="pt-2"><h3 className="text-sm font-bold text-gray-900 mb-1">Remark / Recommendation</h3><p className="text-sm text-gray-500 font-medium">Remark......</p></div>
              <div className="flex flex-col items-end pt-4 pb-2"><span className="text-sm font-bold text-gray-900">Signature</span><span className="text-xs text-gray-500 mt-1">Admin/COE</span></div>
            </div>
            <div className="flex justify-end items-center px-8 py-4 bg-gray-50 border-t border-gray-100 gap-4 flex-shrink-0">
              <button onClick={handleDownloadReport} className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all cursor-pointer bg-[#0e1680] hover:bg-[#0b1160]" style={{ width: '125px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Download</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Report Success Modal ── */}
      {reportSuccess && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[16px] w-[510px] max-w-full shadow-[0px_4px_24px_rgba(0,0,0,0.08)] flex flex-col items-center p-10 text-center gap-6" style={{ height: '360px' }}>
            <div className="w-[120px] h-[120px] flex items-center justify-center">
              <svg viewBox="0 0 104.667 104.667" width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100.667 47.9143V52.361C100.661 62.7837 97.2858 72.9253 91.0451 81.2732C84.8045 89.621 76.0325 95.728 66.0376 98.6832C56.0426 101.638 45.3601 101.284 35.5833 97.6715C25.8065 94.0595 17.4592 87.3838 11.7863 78.6402C6.11346 69.8965 3.41899 59.5533 4.10477 49.1532C4.79055 38.7531 8.81984 28.8532 15.5917 20.9302C22.3635 13.0071 31.5151 7.48535 41.6816 5.18837C51.848 2.8914 62.4846 3.9423 72.005 8.18434M100.667 13.6667L52.3333 62.0483L37.8333 47.5483" stroke="#81D66A" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-[20px] font-bold text-[#101828] mt-2">Report Downloaded Successfully!</h2>
            <button
              onClick={() => setReportSuccess(false)}
              style={{ width: '86px', height: '44px', background: '#0e1680', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}
              className="text-white cursor-pointer hover:bg-[#0b126c] transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
};
