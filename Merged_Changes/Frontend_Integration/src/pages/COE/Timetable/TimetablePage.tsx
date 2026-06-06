import React, { useState } from 'react';
import { TimetableFilters } from '../../../components/screens/COE/Timetable/TimetableFilters';
import { TimetableTable } from '../../../components/screens/COE/Timetable/TimetableTable';
import { AddTimetableFlow } from '../../../components/screens/COE/Timetable/AddTimetableFlow';
import {
  TimetableDeleteModal,
  TimetableSuccessModal,
  TimetableViewModal
} from '../../../components/modals/Timetable/TimetableModals';
import { INITIAL_DEMO_TIMETABLES } from '../../../components/screens/COE/Timetable/mockData';
import type { Timetable } from '../../../types/COE/timetable';

export const TimetablePage: React.FC = () => {
  // --- View states: 'list' | 'add' ---
  const [view, setView] = useState<'list' | 'add'>('list');

  // --- Data states ---
  // Matches Figma "No Data Found" by starting empty
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [isDemoPopulated, setIsDemoPopulated] = useState(false);

  // --- Filtering & Searching states ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBranch, selectedSemester, selectedYear, timetables]);

  // --- Modal Overlay states ---
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState<'save' | 'delete'>('save');

  // --- Toggle Demo Data ---
  const handlePopulateDemo = () => {
    if (isDemoPopulated) {
      setTimetables([]);
      setIsDemoPopulated(false);
    } else {
      setTimetables(INITIAL_DEMO_TIMETABLES);
      setIsDemoPopulated(true);
    }
  };

  // --- Modal Handlers ---
  const handleViewClick = (tt: Timetable) => {
    setSelectedTimetable(tt);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (tt: Timetable) => {
    setSelectedTimetable(tt);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedTimetable) return;
    setTimetables(prev => prev.filter(t => t.id !== selectedTimetable.id));
    setIsDeleteModalOpen(false);
    setSelectedTimetable(null);
    setSuccessMessage("Timetable deleted successfully!");
    setSuccessType('delete');
    setIsSuccessModalOpen(true);
  };

  // --- Publish Timetable Handler ---
  const handlePublishTimetable = (newTt: Timetable) => {
    setTimetables(prev => [newTt, ...prev]);
    setView('list');
    setSuccessMessage(`Timetable ${newTt.timetableNo} generated & published successfully!`);
    setSuccessType('save');
    setIsSuccessModalOpen(true);
  };

  // --- Filter Logic ---
  const filteredTimetables = timetables.filter(tt => {
    const matchesSearch = searchQuery === '' ||
      tt.timetableNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tt.branch.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = selectedBranch === '' || tt.branch === selectedBranch;
    const matchesSemester = selectedSemester === '' || tt.semester === selectedSemester;
    const matchesYear = selectedYear === '' || tt.year === selectedYear;

    return matchesSearch && matchesBranch && matchesSemester && matchesYear;
  });

  const totalPages = Math.ceil(filteredTimetables.length / itemsPerPage);
  const paginatedTimetables = filteredTimetables.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-8 w-full font-sans animate-in fade-in duration-500">

      {/* Dynamic Title */}
      <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px] tracking-tight">
        Timetable Generation
      </h1>

      {view === 'list' ? (
        <>
          {/* Top Filters & Actions */}
          <TimetableFilters
            onAddClick={() => setView('add')}
            onSearchChange={setSearchQuery}
            onBranchChange={setSelectedBranch}
            onSemesterChange={setSelectedSemester}
            onYearChange={setSelectedYear}
            selectedBranch={selectedBranch}
            selectedSemester={selectedSemester}
            selectedYear={selectedYear}
            isDemoPopulated={isDemoPopulated}
            onPopulateDemo={handlePopulateDemo}
          />

          {/* Timetable List Table */}
          <TimetableTable
            timetables={paginatedTimetables}
            onViewClick={handleViewClick}
            onDeleteClick={handleDeleteClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        /* Dynamic Multi-Step Creation Wizard */
        <AddTimetableFlow
          onPublish={handlePublishTimetable}
          onCancel={() => setView('list')}
        />
      )}

      {/* --- Overlay Modals --- */}
      <TimetableViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedTimetable(null);
        }}
        timetable={selectedTimetable}
      />

      <TimetableDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedTimetable(null);
        }}
        timetable={selectedTimetable}
        onConfirm={handleConfirmDelete}
      />

      <TimetableSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
        type={successType}
      />
    </div>
  );
};
