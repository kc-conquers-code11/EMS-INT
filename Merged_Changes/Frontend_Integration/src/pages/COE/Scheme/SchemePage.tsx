import React, { useState, useEffect } from 'react';
import { SchemeTable } from '../../../components/screens/COE/Scheme/SchemeTable';
import { SchemeFeedbackModal } from '../../../components/screens/COE/Scheme/SchemeModals';
import { EditSchemeModal } from '../../../components/screens/COE/Scheme/EditSchemeModal';
import { AddSchemeDetails } from '../../../components/screens/COE/Scheme/AddSchemeDetails';
import type { SchemeViewType, SchemeFeedbackType } from '../../../types/COE/scheme';

import { schemeAPI } from '../../../services/api';

export const SchemePage: React.FC = () => {
  const [view, setView] = useState<SchemeViewType>('table');
  const [schemes, setSchemes] = useState<any[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<any | undefined>();
  const [loading, setLoading] = useState(false);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const response = await schemeAPI.getAll();
      console.log(response.data, 'res')
      if (response.data.success) {
        setSchemes(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch schemes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, []);
  console.log(schemes, 'schemes')

  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [feedbackState, setFeedbackState] = useState<{ isOpen: boolean; type: SchemeFeedbackType; message?: string }>({
    isOpen: false,
    type: 'edit_success'
  });

  const handleEditClick = (scheme: any) => {
    setSelectedScheme(scheme);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (scheme: any) => {
    setSelectedScheme(scheme);
    setFeedbackState({ isOpen: true, type: 'delete_confirm' });
  };

  const handleConfirmDelete = async () => {
    if (selectedScheme) {
      try {
        await schemeAPI.delete(selectedScheme.scheme_id);
        setFeedbackState({ isOpen: true, type: 'delete_success' });
        fetchSchemes();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const handleEditSubmit = () => {
    setIsEditOpen(false);
    setFeedbackState({ isOpen: true, type: 'edit_success', message: 'Scheme edited successfully !!' });
    fetchSchemes();
  };

  const handleAddSubmitSuccess = (type: SchemeFeedbackType, message: string) => {
    setFeedbackState({ isOpen: true, type, message });
    setView('table');
    fetchSchemes();
  };

  const closeFeedback = () => {
    setFeedbackState(prev => ({ ...prev, isOpen: false }));
    setSelectedScheme(undefined);
  };

  return (
    <div className="h-full relative font-sans">
      {/* Tab Navigation */}
      <div className="mb-[32px]">
        <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px] mb-[28px]">Scheme Details</h1>
        <div className="inline-flex bg-[#f2f3fd] p-[6px] rounded-xl border border-[#e5e7fb]">
          <button
            onClick={() => setView('add')}
            className={`px-[24px] py-[10px] rounded-lg text-[16px] font-semibold transition-colors ${view === 'add' ? 'bg-[#0e1680] text-[#f9fafb]' : 'text-[#929292] hover:text-[#475467]'
              }`}
          >
            Add Scheme Details
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-[24px] py-[10px] rounded-lg text-[16px] font-semibold transition-colors ${view === 'table' ? 'bg-[#0e1680] text-[#f9fafb]' : 'text-[#929292] hover:text-[#475467]'
              }`}
          >
            View
          </button>
        </div>
      </div>

      {view === 'table' ? (
        <SchemeTable
          schemes={schemes}
          onAddNew={() => setView('add')}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div className="mt-[32px]">
          <AddSchemeDetails onSubmitSuccess={handleAddSubmitSuccess} />
        </div>
      )}

      {/* Modals */}
      <EditSchemeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditSubmit}
        scheme={selectedScheme}
      />

      <SchemeFeedbackModal
        isOpen={feedbackState.isOpen}
        type={feedbackState.type}
        onClose={closeFeedback}
        onConfirm={handleConfirmDelete}
        message={feedbackState.type === 'delete_confirm' ? `Do you really want to delete ${selectedScheme?.scheme_name}?` : feedbackState.message}
      />
    </div>
  );
};
