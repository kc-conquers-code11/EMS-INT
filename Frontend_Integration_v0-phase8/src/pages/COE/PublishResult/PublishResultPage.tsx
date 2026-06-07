import { useState } from 'react';
import { ChevronDown, CheckCircle2, ChevronRight, Check, AlertTriangle } from 'lucide-react';

export default function PublishResultPage() {
  const [step, setStep] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'publish' | 'audit'>('publish');
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [password, setPassword] = useState('');

  const handlePublish = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 font-['Instrument_Sans']">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1d2939]">Publish Result</h1>
        
        {/* Simple Steps Indicator */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-[#0e1680] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <div className={`w-8 h-px ${step >= 2 ? 'bg-[#0e1680]' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-[#0e1680] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <div className={`w-8 h-px ${step >= 3 ? 'bg-[#0e1680]' : 'bg-gray-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-[#0e1680] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Step 1: Select Exam Event</h2>
          
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Event</label>
              <div className="relative">
                <select 
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#0e1680] focus:border-transparent"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  <option value="">Select an event</option>
                  <option value="Sem V - Winter 2025">Semester V - Winter 2025</option>
                  <option value="Sem VI - Summer 2026">Semester VI - Summer 2026</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button 
              className="px-4 py-2 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium"
              onClick={() => setShowSummary(true)}
              disabled={!selectedEvent}
            >
              Load Summary
            </button>
          </div>

          {showSummary && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-md font-semibold mb-4">Summary for {selectedEvent}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Total Students</p>
                  <p className="text-2xl font-bold text-[#1d2939]">149</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Marksheet Status</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">All Locked</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Publish Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                    <span className="font-medium text-[#1d2939]">Ready for publish</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button 
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium"
                  onClick={() => setStep(2)}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-6">Step 2: Pre-Publication Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Total Students</span>
                <span className="font-bold text-[#1d2939]">149</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Marksheet Locked</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1d2939]">149</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Marksheet Pending</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1d2939]">0</span>
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-medium text-[#1d2939] mb-4">Components Covered</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-[#0e1680]" />
                  <span className="text-gray-700">Internal Assessment (IA)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-[#0e1680]" />
                  <span className="text-gray-700">External Exam (EXT)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-[#0e1680]" />
                  <span className="text-gray-700">Assignment</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-[#0e1680]" />
                  <span className="text-gray-700">Oral / Practical</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button 
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button 
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium"
              onClick={() => setStep(3)}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-0 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button 
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'publish' ? 'text-[#0e1680] border-b-2 border-[#0e1680]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('publish')}
            >
              Publish Result
            </button>
            <button 
              className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === 'audit' ? 'text-[#0e1680] border-b-2 border-[#0e1680]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('audit')}
            >
              Audit Log Entry
            </button>
          </div>
          
          <div className="p-8">
            {activeTab === 'publish' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-[#0e1680]" />
                </div>
                <h2 className="text-xl font-bold text-[#1d2939] mb-2">Ready to Publish</h2>
                <p className="text-gray-500 max-w-md mb-8">
                  All marksheets for {selectedEvent} have been finalized and locked. You can now publish the final result to students.
                </p>
                <button 
                  className="px-8 py-3 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-semibold text-lg shadow-sm"
                  onClick={() => setShowConfirmModal(true)}
                >
                  Publish Final Result
                </button>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg text-[#1d2939] mb-4">Latest Publication Record</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                      <span className="text-gray-500">Exam Event</span>
                      <span className="col-span-2 font-medium text-[#1d2939]">{selectedEvent || 'Semester V - Winter 2025'}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                      <span className="text-gray-500">Published On</span>
                      <span className="col-span-2 font-medium text-[#1d2939]">12-05-2026 11:45 AM</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                      <span className="text-gray-500">Published By</span>
                      <span className="col-span-2 font-medium text-[#1d2939]">COE Admin</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100">
                      <span className="text-gray-500">Dataset Version</span>
                      <span className="col-span-2 font-medium text-[#1d2939]">v3.2</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3">
                      <span className="text-gray-500">Status</span>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="font-medium text-green-700">Published</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {activeTab === 'publish' && (
            <div className="flex justify-start items-center p-6 bg-gray-50 border-t border-gray-100">
              <button 
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                onClick={() => setStep(2)}
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirm Identity Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#1d2939]">Confirm Identity</h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-sm">Please enter your password to confirm and publish the result for {selectedEvent}. This action cannot be undone.</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter Password</label>
                <input 
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0e1680] focus:border-transparent"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium disabled:opacity-50"
                  onClick={handlePublish}
                  disabled={!password}
                >
                  Confirm and publish
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
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-[#1d2939] mb-2">Result Published Successfully!</h3>
            <p className="text-gray-500 text-sm mb-6">Notifications have been sent to students and faculty.</p>
            <button 
              className="w-full px-4 py-2.5 bg-[#0e1680] text-white rounded-lg hover:bg-opacity-90 font-medium"
              onClick={() => {
                setShowSuccessModal(false);
                setActiveTab('audit');
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
