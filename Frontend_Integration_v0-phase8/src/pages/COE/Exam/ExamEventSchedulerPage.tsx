import * as React from 'react';
import { ExamFilters } from '../../../components/screens/COE/Exam/ExamFilters';
import { ExamTable } from '../../../components/screens/COE/Exam/ExamTable';
import { AddExamFlow } from '../../../components/screens/COE/Exam/AddExamFlow';
import { INITIAL_DEMO_EXAMS } from '../../../components/screens/COE/Exam/mockData';
import {
  ExamEventViewModal,
  ExamEventEditModal,
  ExamEventDeleteModal,
  RescheduleModal,
  SuccessModal,
} from '../../../components/modals/Exam/ExamModals';
import type { ExamEvent } from '../../../types/COE/exam';

export const ExamEventSchedulerPage = () => {
  const [view, setView] = React.useState<'list' | 'add'>('list');
  const [events, setEvents] = React.useState<ExamEvent[]>([]); // Starts empty to match Figma 'No Data Found'
  const [isDemoPopulated, setIsDemoPopulated] = React.useState(false);

  // --- Filtering & Searching states ---
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = React.useState('');
  const [selectedCourseCode, setSelectedCourseCode] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCourseTitle, selectedCourseCode, selectedDate]);

  // --- Modal Overlay states ---
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = React.useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [selectedEvent, setSelectedEvent] = React.useState<ExamEvent | null>(null);

  // --- Toggle Demo Data ---
  const handlePopulateDemo = () => {
    if (isDemoPopulated) {
      setEvents([]);
      setIsDemoPopulated(false);
    } else {
      setEvents(INITIAL_DEMO_EXAMS);
      setIsDemoPopulated(true);
    }
  };

  const handleAddClick = () => {
    setView('add');
  };

  const handleCancel = () => {
    setView('list');
  };

  const handlePublish = () => {
    setView('list');
  };

  const handleViewClick = (event: ExamEvent) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (event: ExamEvent) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (event: ExamEvent) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleRescheduleClick = (event: ExamEvent) => {
    setSelectedEvent(event);
    setIsRescheduleModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.event_id !== selectedEvent.event_id));
    }
  };

  const handleRescheduleSuccess = () => {
    setIsRescheduleModalOpen(false);
    setSuccessMessage('Exam Event Rescheduled & Notified successfully!');
    setIsSuccessModalOpen(true);
  };

  // Extract filter dropdown options from all demo exams
  const courseTitles = React.useMemo(() => {
    return Array.from(new Set(INITIAL_DEMO_EXAMS.map(e => e.event_name).filter(Boolean))) as string[];
  }, []);

  const courseCodes = React.useMemo(() => {
    return Array.from(new Set(INITIAL_DEMO_EXAMS.map(e => e.course_code).filter(Boolean))) as string[];
  }, []);

  const dates = React.useMemo(() => {
    return Array.from(new Set(INITIAL_DEMO_EXAMS.map(e => e.date).filter(Boolean))) as string[];
  }, []);

  // Filter Logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === '' ||
      event.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.course_code && event.course_code.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTitle = selectedCourseTitle === '' || event.event_name === selectedCourseTitle;
    const matchesCode = selectedCourseCode === '' || event.course_code === selectedCourseCode;
    const matchesDate = selectedDate === '' || event.date === selectedDate;

    return matchesSearch && matchesTitle && matchesCode && matchesDate;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Transform ExamEvent to the structure expected by the modals
  const getExamEntry = (event: ExamEvent | null) => {
    if (!event) return null;
    return {
      id: event.event_id,
      title: event.event_name,
      code: event.course_code || 'CO1919',
      date: event.date || '10-05-2025',
      time: event.time_slot || '10:00 - 11:00',
      students: event.total_students || 170,
      status: event.status === 'published' || event.status === 'scheduled' ? 'scheduled' : 'pending',
      branch: 'Information Technology',
      semester: '2nd',
      examType: event.exam_type || 'Regular'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  };

  const getRescheduleData = (event: ExamEvent | null) => {
    if (!event) return null;
    return {
      title: event.event_name,
      code: event.course_code || 'CO1919',
      date: event.date || '10-05-2025',
      time: event.time_slot || '10:00 - 11:00',
      branch: 'Information Technology',
      semester: '2nd',
      examType: event.exam_type || 'Regular'
    };
  };

  return (
    <div className="flex flex-col gap-8 w-full font-sans p-6 animate-in fade-in duration-500">
      {/* Title */}
      <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px] tracking-tight">
        Exam Event Scheduler
      </h1>

      {view === 'list' ? (
        <>
          <ExamFilters
            onAddClick={handleAddClick}
            onSearchChange={setSearchQuery}
            onCourseTitleChange={setSelectedCourseTitle}
            onCourseCodeChange={setSelectedCourseCode}
            onDateChange={setSelectedDate}
            selectedCourseTitle={selectedCourseTitle}
            selectedCourseCode={selectedCourseCode}
            selectedDate={selectedDate}
            isDemoPopulated={isDemoPopulated}
            onPopulateDemo={handlePopulateDemo}
            courseTitles={courseTitles}
            courseCodes={courseCodes}
            dates={dates}
          />
          <ExamTable
            events={paginatedEvents}
            onViewClick={handleViewClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onRescheduleClick={handleRescheduleClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <AddExamFlow onCancel={handleCancel} onPublish={handlePublish} />
      )}

      {/* Modals */}
      <ExamEventViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        exam={getExamEntry(selectedEvent)}
      />
      <ExamEventEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        exam={getExamEntry(selectedEvent)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          setSuccessMessage('Exam Event Scheduled & Notified successfully!');
          setIsSuccessModalOpen(true);
        }}
      />
      <ExamEventDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        exam={getExamEntry(selectedEvent)}
        onSuccess={handleDeleteSuccess}
      />
      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        examData={getRescheduleData(selectedEvent)}
        onSuccess={handleRescheduleSuccess}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </div>
  );
};
