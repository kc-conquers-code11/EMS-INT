import { useState } from 'react';
import { ChevronDown, CheckCircle2, Check, AlertTriangle, Lock, Unlock, Edit2 } from 'lucide-react';

export default function UnlockMarksheetPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'audit'>('search');
  const [prn, setPrn] = useState('75002');
  const [selectedEvent, setSelectedEvent] = useState('Semester V - Winter 2025');
  const [hasSearched, setHasSearched] = useState(false);
  
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [unlockReason, setUnlockReason] = useState('Data correction');
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleUnlockClick = () => {
    setShowReasonModal(true);
  };

  const handleReasonSubmit = () => {
    setShowReasonModal(false);
    setShowConfirmModal(true);
  };

  const handleConfirmUnlock = () => {
    setShowConfirmModal(false);
    setIsUnlocked(true);
  };

  const handleSave = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const handleSuccessBack = () => {
    setShowSuccessModal(false);
    if (successMessage.includes('re-locked')) {
      setIsUnlocked(false);
      setHasSearched(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 font-['Instrument_Sans']">
      <h1 className="text-2xl font-bold text-[#1d2939] mb-6">Unlock Marksheet</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-8 py-3 text-center font-medium transition-colors ${activeTab === 'search' ? 'bg-[#0e1680] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('search')}
          >
            Search Student
          </button>
          <button 
            className={`px-8 py-3 text-center font-medium transition-colors ${activeTab === 'audit' ? 'bg-[#0e1680] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab('audit')}
          >
            Audit log
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'search' ? (
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter student PRN/seat number</label>
                <input 
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e1680] focus:border-transparent"
                  placeholder="75002"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam event</label>
                <div className="relative">
                  <select 
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0e1680] focus:border-transparent"
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                  >
                    <option value="Semester V - Winter 2025">Semester V - Winter 2025</option>
                    <option value="Semester VI - Summer 2026">Semester VI - Summer 2026</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex justify-end">
                <button 
                  className="px-6 py-2 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium"
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>

              {hasSearched && !isUnlocked && (
                <div className="mt-8 border border-gray-200 rounded-xl p-5 flex items-center justify-between bg-gray-50">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Seat number: <span className="font-medium text-[#1d2939]">75002</span></p>
                    <p className="text-sm text-gray-600">Student: <span className="font-medium text-[#1d2939]">Rahul Patil</span></p>
                    <p className="text-sm text-gray-600">Exam Event: <span className="font-medium text-[#1d2939]">Sem V Winter 2025</span></p>
                    <p className="text-sm text-gray-600">Current Version: <span className="font-medium text-[#1d2939]">v3.2</span></p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className="text-sm font-medium text-[#1d2939]">Locked</span>
                      <Lock className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                  </div>
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium"
                    onClick={handleUnlockClick}
                  >
                    Unlock <Unlock className="h-4 w-4" />
                  </button>
                </div>
              )}

              {isUnlocked && (
                <div className="mt-8 overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 font-medium">Sr no.</th>
                        <th className="px-4 py-3 font-medium">Student ID</th>
                        <th className="px-4 py-3 font-medium">Student Name</th>
                        <th className="px-4 py-3 font-medium text-center">IA</th>
                        <th className="px-4 py-3 font-medium text-center">EXT</th>
                        <th className="px-4 py-3 font-medium text-center">Assign</th>
                        <th className="px-4 py-3 font-medium text-center">Oral</th>
                        <th className="px-4 py-3 font-medium text-center">Total</th>
                        <th className="px-4 py-3 font-medium text-center">%</th>
                        <th className="px-4 py-3 font-medium text-center">Result</th>
                        <th className="px-4 py-3 font-medium text-center">Flags</th>
                        <th className="px-4 py-3 font-medium text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">1</td>
                        <td className="px-4 py-3">vu4s2425001</td>
                        <td className="px-4 py-3 font-medium text-[#1d2939]">XYZ</td>
                        <td className="px-4 py-3 text-center">
                          <input type="text" defaultValue="18" className="w-10 text-center border border-gray-300 rounded p-1" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="text" defaultValue="65" className="w-10 text-center border border-gray-300 rounded p-1" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="text" defaultValue="10" className="w-10 text-center border border-gray-300 rounded p-1" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input type="text" defaultValue="8" className="w-10 text-center border border-gray-300 rounded p-1" />
                        </td>
                        <td className="px-4 py-3 text-center">101</td>
                        <td className="px-4 py-3 text-center">67</td>
                        <td className="px-4 py-3 text-center text-green-600 font-medium">Pass</td>
                        <td className="px-4 py-3 text-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mx-auto" />
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500">
                          <Edit2 className="h-4 w-4 mx-auto cursor-pointer hover:text-[#0e1680]" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  {/* Pagination placeholder */}
                  <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-600 hover:bg-gray-50">← Previous</button>
                    <div className="flex gap-1 text-sm">
                      <button className="px-2.5 py-1 text-[#0e1680] font-medium bg-blue-50 rounded">1</button>
                      <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded">2</button>
                      <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded">3</button>
                      <span className="px-2 py-1 text-gray-400">...</span>
                      <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded">8</button>
                      <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded">9</button>
                      <button className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 rounded">10</button>
                    </div>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-600 hover:bg-gray-50">Next →</button>
                  </div>

                  <div className="flex justify-center gap-4 p-6 bg-gray-50">
                    <button 
                      className="px-6 py-2.5 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium shadow-sm"
                      onClick={() => handleSave('Changes saved successfully!!')}
                    >
                      Save changes
                    </button>
                    <button 
                      className="px-6 py-2.5 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium shadow-sm"
                      onClick={() => handleSave('Changes saved and marksheet re-locked successfully!!')}
                    >
                      Save and re-lock
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1d2939] mb-4">Student ID: 75002</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 flex justify-center"><CheckCircle2 className="h-4 w-4 text-gray-400" /></div>
                  <span className="text-gray-600 text-sm">Marksheet Version: <span className="text-[#1d2939]">v3.2</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 flex justify-center"><CheckCircle2 className="h-4 w-4 text-gray-400" /></div>
                  <span className="text-gray-600 text-sm">Reason: <span className="text-[#1d2939]">Missing external marks</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 flex justify-center"><CheckCircle2 className="h-4 w-4 text-gray-400" /></div>
                  <span className="text-gray-600 text-sm">Published By: <span className="text-[#1d2939]">COE Admin</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 flex justify-center"><CheckCircle2 className="h-4 w-4 text-gray-400" /></div>
                  <span className="text-gray-600 text-sm">Timestamp: <span className="text-[#1d2939]">12 May 2026, 11:30 AM</span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reason for Unlock Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#1d2939]">Reason for Unlock *</h3>
              <button onClick={() => setShowReasonModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Enter detailed reason here...</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e1680] focus:border-transparent min-h-[100px] resize-y"
                  placeholder="Examples: Missing marks, Incorrect total, Data correction"
                  value={unlockReason}
                  onChange={(e) => setUnlockReason(e.target.value)}
                />
              </div>

              <div className="flex justify-center gap-4">
                <button 
                  className="px-6 py-2.5 bg-[#8b91e7] text-white rounded-lg hover:bg-opacity-90 font-medium shadow-sm transition-colors"
                  style={{ backgroundColor: unlockReason ? '#0e1680' : '#8b91e7' }}
                  onClick={handleReasonSubmit}
                  disabled={!unlockReason}
                >
                  Unlock Marksheet
                </button>
                <button 
                  className="px-6 py-2.5 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium shadow-sm"
                  onClick={() => setShowReasonModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Unlock Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-bold text-[#1d2939]">Confirm Unlock</h3>
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-8 leading-relaxed">
                This action will unlock an officially finalized marksheet.<br/>
                All activities will be audited.
              </p>

              <div className="flex justify-center gap-4">
                <button 
                  className="px-6 py-2.5 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium shadow-sm"
                  onClick={handleConfirmUnlock}
                >
                  Confirm Unlock
                </button>
                <button 
                  className="px-6 py-2.5 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium shadow-sm"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden p-8 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-500" strokeWidth={3} />
            </div>
            <h3 className="text-lg font-bold text-[#1d2939] mb-8">{successMessage}</h3>
            <button 
              className="px-8 py-2.5 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium shadow-sm"
              onClick={handleSuccessBack}
            >
              Back
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
