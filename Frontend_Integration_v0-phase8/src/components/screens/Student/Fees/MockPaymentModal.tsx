import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import type { PendingFeeItem } from '../../../../types/Student/Fees/fees';

interface MockPaymentModalProps {
  selectedFee: PendingFeeItem;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const MockPaymentModal: React.FC<MockPaymentModalProps> = ({ selectedFee, onClose, onPaymentSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConfirmPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 1800);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Success View */}
        {success ? (
          <div className="flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 animate-bounce">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-[#101828]">Payment Successful!</h3>
            <p className="text-sm text-[#687b96]">
              Your fee of <strong className="text-[#0e1680]">{selectedFee.amount}</strong> for <strong>{selectedFee.title}</strong> has been successfully processed.
            </p>
            <div className="w-full bg-[#f8f9fc] border border-gray-100 rounded-xl p-4 flex flex-col gap-2.5 text-left text-xs text-[#344054] mt-2">
              <div className="flex justify-between">
                <span className="text-[#687b96]">Receipt No</span>
                <span className="font-semibold">PVPP/REC/9821</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687b96]">Date & Time</span>
                <span className="font-semibold">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687b96]">Payment Status</span>
                <span className="font-semibold text-emerald-600">SUCCESS</span>
              </div>
            </div>
          </div>
        ) : (
          /* Payment Processing / Input Form */
          <div className="flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-[#101828]">Complete Payment</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none font-medium p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="bg-[#f0f1fd]/50 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-[#687b96]">{selectedFee.type}</span>
                <span className="font-bold text-[#101828] text-sm truncate max-w-[200px]">{selectedFee.title}</span>
              </div>
              <span className="text-xl font-black text-[#0e1680]">{selectedFee.amount}</span>
            </div>

            {/* Credit card form details placeholder */}
            <div className="flex flex-col gap-3">
              <label className="text-[12px] font-bold text-[#344054]">Payment Details</label>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Card Number" 
                  defaultValue="4111 2222 3333 4444"
                  disabled={processing}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0e1680] text-sm disabled:bg-gray-50"
                />
                <CreditCard className="absolute right-4 top-3.5 text-gray-400" size={18} />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  defaultValue="12/29"
                  disabled={processing}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0e1680] text-sm disabled:bg-gray-50 text-center"
                />
                <input 
                  type="password" 
                  placeholder="CVV" 
                  defaultValue="123"
                  disabled={processing}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0e1680] text-sm disabled:bg-gray-50 text-center"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <ShieldCheck className="text-emerald-500 shrink-0" size={14} />
              <span>Secured 256-bit SSL encrypted connection</span>
            </div>

            <button 
              onClick={handleConfirmPayment}
              disabled={processing}
              className="w-full py-3.5 bg-[#0e1680] hover:bg-[#0b1260] text-white font-semibold rounded-xl mt-2 transition-all active:scale-95 disabled:bg-[#0e1680]/60 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {processing ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Pay {selectedFee.amount}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
