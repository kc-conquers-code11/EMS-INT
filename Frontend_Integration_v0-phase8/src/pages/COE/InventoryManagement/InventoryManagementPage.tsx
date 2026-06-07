import React, { useState } from 'react';
import { InventoryDashboardTab } from '../../../components/screens/COE/InventoryManagement/InventoryDashboardTab';
import { UpdateStockTab } from '../../../components/screens/COE/InventoryManagement/UpdateStockTab';
import { DistributeStockTab } from '../../../components/screens/COE/InventoryManagement/DistributeStockTab';
import { InventoryModals } from '../../../components/screens/COE/InventoryManagement/InventoryModals';
import type { InventoryItem, InventoryTab } from '../../../types/COE/inventory';

/* ─── Seed Data ──────────────────────────────── */
const SEED: InventoryItem[] = [
  { id: '1', item: 'Thread',            batch: 'TYIT',    examSession: 'Winter 2026', quantity: 200, distributed: 200, remaining: 200 },
  { id: '2', item: 'Supplement Sheets', batch: 'FECOMPS', examSession: 'Winter 2026', quantity: 150, distributed: 150, remaining: 150 },
  { id: '3', item: 'Answer Book',       batch: 'BEIT',    examSession: 'Winter 2026', quantity: 500, distributed: 500, remaining: 500 },
];

export const InventoryManagementPage: React.FC = () => {
  const [activeTab, setActiveTab]     = useState<InventoryTab>('Inventory Dashboard');
  const [inventory, setInventory]     = useState<InventoryItem[]>(SEED);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast]             = useState<string | null>(null);

  /* Update Stock form */
  const [uForm, setUForm] = useState({ batch: 'SYIT 2025', examSession: 'End-Sem Apr 2026', item: 'Supplements Sheet', quantity: '400' });
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  /* Distribute Stock form */
  const [dForm, setDForm] = useState({ selectedId: '', qty: '' });

  /* Modals */
  const [viewItem,       setViewItem]       = useState<InventoryItem | null>(null);
  const [deleteId,       setDeleteId]       = useState<string | null>(null);
  const [deleteSuccess,  setDeleteSuccess]  = useState(false);
  const [reportOpen,     setReportOpen]     = useState(false);
  const [reportSuccess,  setReportSuccess]  = useState(false);
  const [stockEditedSuccess, setStockEditedSuccess] = useState(false);

  /* Derived */
  const totalStock = inventory.reduce((s, i) => s + i.quantity, 0);
  const distStock  = inventory.reduce((s, i) => s + i.distributed, 0);
  const remStock   = inventory.reduce((s, i) => s + i.remaining, 0);

  const filtered = inventory.filter(i =>
    i.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.examSession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  /* ── Generate + Download Report ── */
  const handleDownloadReport = () => {
    const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '/');
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Inventory Report</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #101828; font-size: 13px; }
    h2 { font-size: 18px; font-weight: 700; margin-bottom: 20px; color: #0e1680; }
    .info-row { display: flex; gap: 8px; margin-bottom: 6px; }
    .info-label { font-weight: 600; min-width: 140px; color: #344054; }
    .info-val { color: #101828; }
    .section-title { font-size: 13px; font-weight: 700; color: #101828; margin: 18px 0 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { background: #f9fafb; color: #475467; font-weight: 600; font-size: 12px; padding: 10px 12px; text-align: center; border: 1px solid #e4e7ec; }
    td { padding: 10px 12px; text-align: center; border: 1px solid #e4e7ec; color: #344054; }
    td.item { text-align: left; color: #101828; font-weight: 500; }
    td.highlight { color: #0e1680; font-weight: 600; }
    .remark { font-size: 13px; color: #667085; margin-top: 4px; }
    .signature { text-align: right; margin-top: 24px; font-weight: 700; color: #101828; }
    .sig-sub { font-size: 12px; color: #667085; font-weight: 400; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h2>Report</h2>
  <div class="info-row"><span class="info-label">Institution Name</span><span class="info-val">Vasantdada Patil Pratishthan's College of Engineering and Visual Arts</span></div>
  <div class="info-row"><span class="info-label">Batch</span><span class="info-val">SYIT</span></div>
  <div class="info-row"><span class="info-label">Exam Session</span><span class="info-val">VPPCOE&amp;VA</span></div>
  <div class="info-row"><span class="info-label">Generated On</span><span class="info-val">${today}</span></div>

  <div class="section-title">Student Details</div>
  <div class="info-row"><span class="info-label">Total Student Registered</span><span class="info-val">2000</span></div>

  <div class="section-title">Required Inventory</div>
  <table>
    <thead><tr><th>Item</th><th>Avg per Student</th><th>Total Student</th><th>Required Quantity</th></tr></thead>
    <tbody>
      ${inventory.map(i => `<tr><td class="item">${i.item}</td><td>1000</td><td class="highlight">${i.quantity}</td><td class="highlight">${i.quantity}</td></tr>`).join('')}
    </tbody>
  </table>

  <div class="section-title">Current Inventory Status</div>
  <table>
    <thead><tr><th>Item</th><th>Total Stock</th><th>Distributed</th><th>Remaining</th><th>Shortage</th></tr></thead>
    <tbody>
      ${inventory.map(i => `<tr><td class="item">${i.item}</td><td>3000</td><td class="highlight">${i.distributed}</td><td class="highlight">${i.remaining}</td><td class="highlight">${i.distributed}</td></tr>`).join('')}
    </tbody>
  </table>

  <div class="section-title">Remark / Recommendation</div>
  <div class="remark">Remark......</div>

  <div class="signature">Signature<div class="sig-sub">Admin/COE</div></div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const win  = window.open(url, '_blank');
    if (win) { win.onload = () => { win.focus(); win.print(); }; }
    
    setReportOpen(false);
    setReportSuccess(true);
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditItem(item);
    setUForm({ batch: item.batch, examSession: item.examSession, item: item.item, quantity: item.quantity.toString() });
  };

  const handleNext = () => {
    if (!uForm.batch || !uForm.examSession || !uForm.item || !uForm.quantity) return;
    const qty = parseInt(uForm.quantity) || 0;
    if (editItem) {
      setInventory(p => p.map(i => i.id === editItem.id
        ? { ...i, item: uForm.item, batch: uForm.batch, examSession: uForm.examSession, quantity: qty, remaining: qty - i.distributed }
        : i
      ));
      setEditItem(null);
      setStockEditedSuccess(true);
    } else {
      setInventory(p => [...p, { id: Date.now().toString(), item: uForm.item, batch: uForm.batch, examSession: uForm.examSession, quantity: qty, distributed: 0, remaining: qty }]);
      showToast('Stock added successfully!');
    }
    setUForm({ batch: 'SYIT 2025', examSession: 'End-Sem Apr 2026', item: 'Supplements Sheet', quantity: '400' });
    setActiveTab('Inventory Dashboard');
  };

  const handleDistribute = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(dForm.qty) || 0;
    const target = inventory.find(i => i.id === dForm.selectedId);
    if (!target || val <= 0 || val > target.remaining) return;
    setInventory(p => p.map(i => i.id === dForm.selectedId
      ? { ...i, distributed: i.distributed + val, remaining: i.remaining - val }
      : i
    ));
    showToast(`Distributed ${val} units of ${target.item}`);
    setDForm({ selectedId: '', qty: '' });
    setActiveTab('Inventory Dashboard');
  };

  return (
    <div className="flex flex-col gap-6 p-8 bg-white min-h-full" style={{ fontFamily: 'Instrument Sans, Inter, sans-serif' }}>
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-8 z-50 bg-[#0e1680] text-white px-5 py-3 rounded-xl shadow-lg text-[13px] font-semibold">
          {toast}
        </div>
      )}

      {/* ── Title ── */}
      <h1 className="text-[22px] font-semibold text-[#0d0d26]">Inventory Management</h1>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-0 h-14 px-1.5" style={{ background: '#f0f1fd', borderRadius: '10px', width: 'fit-content' }}>
        {(['Inventory Dashboard', 'Update Stock', 'Distribute Stock'] as InventoryTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); if (tab !== 'Update Stock') setEditItem(null); }}
            style={activeTab === tab ? { background: '#0e1680', color: '#fff', borderRadius: '8px' } : { color: '#667085', background: 'transparent', borderRadius: '8px' }}
            className="px-5 h-11 text-[13px] font-semibold transition-all cursor-pointer whitespace-nowrap"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Contents ── */}
      {activeTab === 'Inventory Dashboard' && (
        <InventoryDashboardTab
          totalStock={totalStock} distStock={distStock} remStock={remStock}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          filtered={filtered} currentPage={currentPage} setCurrentPage={setCurrentPage}
          setReportOpen={setReportOpen} setActiveTab={setActiveTab}
          setEditItem={setEditItem} setUForm={setUForm} setViewItem={setViewItem}
          setDeleteId={setDeleteId} handleEditClick={handleEditClick}
        />
      )}

      {activeTab === 'Update Stock' && (
        <UpdateStockTab uForm={uForm} setUForm={setUForm} handleNext={handleNext} />
      )}

      {activeTab === 'Distribute Stock' && (
        <DistributeStockTab 
          dForm={dForm} setDForm={setDForm} 
          inventory={inventory} 
          uForm={uForm} setUForm={setUForm} 
          handleDistribute={handleDistribute} 
        />
      )}

      {/* ── Modals ── */}
      <InventoryModals
        viewItem={viewItem} setViewItem={setViewItem}
        editItem={editItem} setEditItem={setEditItem}
        uForm={uForm} setUForm={setUForm}
        stockEditedSuccess={stockEditedSuccess} setStockEditedSuccess={setStockEditedSuccess}
        deleteId={deleteId} setDeleteId={setDeleteId}
        deleteSuccess={deleteSuccess} setDeleteSuccess={setDeleteSuccess}
        setInventory={setInventory}
        reportOpen={reportOpen} setReportOpen={setReportOpen}
        reportSuccess={reportSuccess} setReportSuccess={setReportSuccess}
        handleDownloadReport={handleDownloadReport}
      />
    </div>
  );
};
