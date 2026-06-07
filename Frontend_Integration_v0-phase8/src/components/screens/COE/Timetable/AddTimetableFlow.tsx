import React, { useState } from 'react';
import { Clock, Upload, Plus, Trash2, Calendar, Check, Play, AlertCircle, FileText, Search, Filter, ArrowLeft, ArrowRight, Pencil, Eye } from 'lucide-react';
import type { Timetable, TimetableSlot } from '../../../../types/COE/timetable';
import { MOCK_SEMESTERS, MOCK_FACULTY, MOCK_ROOMS, getSubjects } from './mockData';
import { TimetableBulkUploadModal, TimetableSuccessModal, TimeSlotEditModal, TimeSlotDeleteModal, SubjectAllocationDeleteModal, SubjectAllocationViewModal, SubjectAllocationEditModal, TimetableEditModal, TimetableViewDetailsModal, TimetableViewDeleteModal, MergedTimetableViewModal } from "../../../modals/Timetable/TimetableModals";




interface AddTimetableFlowProps {
  onPublish: (newTimetable: Timetable) => void;
  onCancel: () => void;
}

type TabType = 'timeslot' | 'subject' | 'view' | 'merge';

interface CreatedTimeSlot {
  id: string;
  semester: string;
  startTime: string;
  endTime: string;
}

interface SlotRow {
  id: string;
  date: string;
  timeSlot: string;
  courseTitle: string;
  courseCode: string;
  error?: string;
}

export const AddTimetableFlow: React.FC<AddTimetableFlowProps> = ({
  onPublish,
  onCancel
}) => {
  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState<TabType>('timeslot');

  // --- Bulk Upload Modal State ---
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState<'save' | 'delete'>('save');

  // --- Time Slot Edit & Filter states ---
  const [slotSearchQuery, setSlotSearchQuery] = useState('');
  const [slotFilterSemester, setSlotFilterSemester] = useState('');
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  // --- Pagination States ---
  const [slotCurrentPage, setSlotCurrentPage] = useState(1);
  const [subjectCurrentPage, setSubjectCurrentPage] = useState(1);
  const [viewCurrentPage, setViewCurrentPage] = useState(1);

  // --- Time Slot Modal Edit States ---
  const [selectedEditSlot, setSelectedEditSlot] = useState<CreatedTimeSlot | null>(null);
  const [isSlotEditModalOpen, setIsSlotEditModalOpen] = useState(false);

  // --- Subject Allocation Modal States ---
  const [selectedSubView, setSelectedSubView] = useState<any | null>(null);
  const [isSubViewOpen, setIsSubViewOpen] = useState(false);

  const [selectedSubDelete, setSelectedSubDelete] = useState<{ sa: any; absoluteIdx: number } | null>(null);
  const [isSubDeleteOpen, setIsSubDeleteOpen] = useState(false);

  const [selectedSubEdit, setSelectedSubEdit] = useState<{ sa: any; absoluteIdx: number } | null>(null);
  const [isSubEditOpen, setIsSubEditOpen] = useState(false);

  // --- Time Slot Delete Modal States ---
  const [selectedDeleteSlot, setSelectedDeleteSlot] = useState<CreatedTimeSlot | null>(null);
  const [isSlotDeleteOpen, setIsSlotDeleteOpen] = useState(false);

  // --- View Timetables Tab Edit Modal State ---
  const [selectedTimetableEdit, setSelectedTimetableEdit] = useState<any>(null);
  const [isTimetableEditOpen, setIsTimetableEditOpen] = useState(false);

  const [selectedTimetableViewDetails, setSelectedTimetableViewDetails] = useState<any>(null);
  const [isTimetableViewDetailsOpen, setIsTimetableViewDetailsOpen] = useState(false);

  const [isTimetableViewDeleteOpen, setIsTimetableViewDeleteOpen] = useState(false);

  const handleConfirmTimetableViewDelete = () => {
    setIsTimetableViewDeleteOpen(false);
    setSuccessMessage("Timetable details deleted successfully!");
    setSuccessType('delete');
    setIsSuccessOpen(true);
  };

  const handleSaveTimetableEdit = () => {
    setIsTimetableEditOpen(false);
    setSelectedTimetableEdit(null);
    setSuccessMessage("Timetable updated successfully!");
    setSuccessType('save');
    setIsSuccessOpen(true);
  };
  // --- Common Selection State (Semester selection in Tab 1 propagates) ---
  const [selectedSemester, setSelectedSemester] = useState('2nd');

  // --- Tab 1: Time Slot States ---
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [createdSlots, setCreatedSlots] = useState<CreatedTimeSlot[]>([
    { id: '1', semester: '2nd', startTime: '09:00 AM', endTime: '10:00 AM' },
    { id: '2', semester: '2nd', startTime: '10:00 AM', endTime: '11:00 AM' },
    { id: '3', semester: '2nd', startTime: '11:15 AM', endTime: '12:15 PM' },
    { id: '4', semester: '2nd', startTime: '01:00 PM', endTime: '02:00 PM' }
  ]);

  // --- Tab 2: Subject Allocation States ---
  const [allocations, setAllocations] = useState<TimetableSlot[]>([
    { day: 'Monday', timeSlot: '09:00 AM - 10:00 AM', subjectCode: 'IT201', subjectName: 'Calculus and Linear Algebra', facultyName: 'Dr. A. Kumar', roomNo: 'Room 101' },
    { day: 'Monday', timeSlot: '10:00 AM - 11:00 AM', subjectCode: 'IT202', subjectName: 'Data Structures and Algorithms', facultyName: 'Prof. S. Sharma', roomNo: 'Room 102' }
  ]);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('');

  // --- Tab 2: Figma Restructured States ---
  const [academicYear, setAcademicYear] = useState('FE');
  const [semesterTab2, setSemesterTab2] = useState('1');
  const [branchTab2, setBranchTab2] = useState('Information Technology');
  const [noOfCourses, setNoOfCourses] = useState('4');
  const [examType, setExamType] = useState('Internal Assessment 1');
  const [startDate, setStartDate] = useState('10-05-2025');
  const [endDate, setEndDate] = useState('14-05-2025');

  // Add Slots States — dynamic multi-row
  const [slotRows, setSlotRows] = useState<SlotRow[]>([
    { id: 'row-0', date: '', timeSlot: '', courseTitle: '', courseCode: '' }
  ]);

  // Initial mockup rows prefilled to match Figma exactly!
  const [subjectAllocations, setSubjectAllocations] = useState([
    { startTime: '10:00 AM', endTime: '11:00 AM', courseTitle: 'Operating System', courseCode: 'CO1919', dateDay: '10-05-2025', shift: 'Morning' },
    { startTime: '12:00 AM', endTime: '01:00 PM', courseTitle: 'Automata Theory', courseCode: 'CO1919', dateDay: '11-05-2025', shift: 'Morning' },
    { startTime: '10:00 AM', endTime: '11:00 AM', courseTitle: 'Communication', courseCode: 'CO1919', dateDay: '12-05-2025', shift: 'Morning' }
  ]);

  const [selectedRoom, setSelectedRoom] = useState(MOCK_ROOMS[0]);

  // --- Tab 4: Merge Timetables State ---
  const [mergeStep, setMergeStep] = useState<'initial' | 'merged'>('initial');
  const [isMergedViewOpen, setIsMergedViewOpen] = useState(false);

  // Get subjects for selected semester (Default Branch: Information Technology)
  const semesterSubjects = getSubjects('Information Technology', selectedSemester);

  // Set default subject on loading tab
  React.useEffect(() => {
    if (semesterSubjects.length > 0 && !selectedSubjectCode) {
      setSelectedSubjectCode(semesterSubjects[0].code);
    }
  }, [semesterSubjects, selectedSubjectCode]);

  // --- Pagination Calculations & Constants ---
  const SLOT_PAGE_SIZE = 3;
  const SUBJECT_PAGE_SIZE = 3;

  // Tab 1 (Slots) Calculations
  const filteredSlots = createdSlots.filter(s => {
    const matchesSearch = slotSearchQuery === '' ||
      s.startTime.toLowerCase().includes(slotSearchQuery.toLowerCase()) ||
      s.endTime.toLowerCase().includes(slotSearchQuery.toLowerCase()) ||
      s.semester.toLowerCase().includes(slotSearchQuery.toLowerCase());
    const matchesSemester = slotFilterSemester === '' || s.semester === slotFilterSemester;
    return matchesSearch && matchesSemester;
  });

  const slotTotalPages = Math.ceil(filteredSlots.length / SLOT_PAGE_SIZE) || 1;

  const displayedSlots = filteredSlots.slice(
    (slotCurrentPage - 1) * SLOT_PAGE_SIZE,
    slotCurrentPage * SLOT_PAGE_SIZE
  );

  // Tab 2 (Subjects) Calculations
  const subjectTotalPages = Math.ceil(subjectAllocations.length / SUBJECT_PAGE_SIZE) || 1;

  const displayedSubjectAllocations = subjectAllocations.slice(
    (subjectCurrentPage - 1) * SUBJECT_PAGE_SIZE,
    subjectCurrentPage * SUBJECT_PAGE_SIZE
  );

  // Auto Reset Page on search/filter changes
  React.useEffect(() => {
    setSlotCurrentPage(1);
  }, [slotSearchQuery, slotFilterSemester]);

  // Adjust page index if item deletion pushes index out of bounds
  React.useEffect(() => {
    if (slotCurrentPage > slotTotalPages) {
      setSlotCurrentPage(slotTotalPages);
    }
  }, [filteredSlots.length, slotTotalPages]);

  React.useEffect(() => {
    if (subjectCurrentPage > subjectTotalPages) {
      setSubjectCurrentPage(subjectTotalPages);
    }
  }, [subjectAllocations.length, subjectTotalPages]);

  // Generic render pagination function to keep aesthetics matching Figma 100%
  const renderPaginationNumbers = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
  ) => {
    // Force the exact figma design pagination: 1 2 3 ... 8 9 10
    const pages: (number | string)[] = [1, 2, 3, '...', 8, 9, 10];

    return pages.map((page, i) => {
      if (page === '...') {
        return (
          <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-[#98a2b3]">
            ...
          </span>
        );
      }

      const isActualPage = (page as number) <= totalPages;

      return (
        <button
          key={page}
          type="button"
          onClick={() => isActualPage && onPageChange(page as number)}
          disabled={!isActualPage}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${currentPage === page
            ? 'bg-[#f2f4fd] text-[#0e1680] border border-[#d2d6f8]'
            : isActualPage
              ? 'text-[#667085] hover:bg-gray-50 cursor-pointer'
              : 'text-[#d0d5dd] cursor-not-allowed opacity-50'
            }`}
        >
          {page}
        </button>
      );
    });
  };

  // --- DB Schema & Dynamic Bounds Constraint Helpers ---
  const getDatesInRange = (startStr: string, endStr: string): string[] => {
    try {
      const parseDate = (dStr: string): Date => {
        const parts = dStr.split('-');
        if (parts.length === 3) {
          // DD-MM-YYYY
          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        }
        return new Date(dStr);
      };

      const start = parseDate(startStr);
      const end = parseDate(endStr);

      if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
        return [];
      }

      const dates: string[] = [];
      const current = new Date(start);
      while (current <= end) {
        const dd = String(current.getDate()).padStart(2, '0');
        const mm = String(current.getMonth() + 1).padStart(2, '0');
        const yyyy = current.getFullYear();
        dates.push(`${dd}-${mm}-${yyyy}`);
        current.setDate(current.getDate() + 1);
      }
      return dates;
    } catch (e) {
      return [];
    }
  };

  const getShiftFromTime = (timeStr: string): string => {
    const lower = timeStr.toLowerCase();
    if (lower.includes('pm')) {
      const parts = lower.split(':');
      const hour = parseInt(parts[0] || '12', 10);
      if (hour >= 1 && hour < 12) {
        return 'Afternoon';
      }
    }
    return 'Morning';
  };

  const availableDates = getDatesInRange(startDate, endDate);


  const formatTime12h = (time24h: string): string => {
    const [hoursStr, minutesStr] = time24h.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours.toString().padStart(2, '0')}:${minutesStr} ${ampm}`;
  };

  // --- Add/Edit Time Slot Handler ---
  const handleAddTimeSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) return;

    const formattedStart = formatTime12h(startTime);
    const formattedEnd = formatTime12h(endTime);

    if (editingSlotId) {
      // Update existing slot
      setCreatedSlots(prev =>
        prev.map(s =>
          s.id === editingSlotId
            ? { ...s, semester: selectedSemester, startTime: formattedStart, endTime: formattedEnd }
            : s
        )
      );
      setEditingSlotId(null);
    } else {
      // Duplicate check
      const isDup = createdSlots.some(
        s => s.semester === selectedSemester && s.startTime === formattedStart && s.endTime === formattedEnd
      );
      if (isDup) return;

      const newSlot: CreatedTimeSlot = {
        id: Date.now().toString(),
        semester: selectedSemester,
        startTime: formattedStart,
        endTime: formattedEnd
      };

      setCreatedSlots(prev => [...prev, newSlot]);
    }

    // Show success modal
    setSuccessMessage(editingSlotId ? 'Time Slot updated successfully!' : 'Time Slot added successfully!');
    setSuccessType('save');
    setIsSuccessOpen(true);

    // Reset inputs
    setStartTime('09:00');
    setEndTime('10:00');
    setEditingSlotId(null);
  };

  // --- Edit Slot Trigger ---
  const handleEditSlot = (slot: CreatedTimeSlot) => {
    setEditingSlotId(slot.id);
    setSelectedSemester(slot.semester);

    const parseTo24h = (time12h: string): string => {
      const [time, modifier] = time12h.split(' ');
      const [hoursStr, minutesStr] = time.split(':');
      let hours = parseInt(hoursStr, 10);
      if (hours === 12) hours = 0;
      if (modifier === 'PM') hours += 12;
      return `${hours.toString().padStart(2, '0')}:${minutesStr}`;
    };

    setStartTime(parseTo24h(slot.startTime));
    setEndTime(parseTo24h(slot.endTime));
  };

  // --- Remove Time Slot (now via confirmation modal) ---
  const handleRemoveSlot = (id: string) => {
    const slot = createdSlots.find(s => s.id === id);
    if (slot) {
      setSelectedDeleteSlot(slot);
      setIsSlotDeleteOpen(true);
    }
  };

  const handleConfirmDeleteSlot = () => {
    if (!selectedDeleteSlot) return;
    setCreatedSlots(prev => prev.filter(s => s.id !== selectedDeleteSlot.id));
    if (editingSlotId === selectedDeleteSlot.id) setEditingSlotId(null);
    setIsSlotDeleteOpen(false);
    setSelectedDeleteSlot(null);
    setSuccessMessage('Time Slot deleted successfully!');
    setSuccessType('delete');
    setIsSuccessOpen(true);
  };

  // --- Modal Edit Slot Save Handler ---
  const handleSaveEditSlotModal = (id: string, start: string, end: string) => {
    setCreatedSlots(prev =>
      prev.map(s =>
        s.id === id
          ? { ...s, startTime: start, endTime: end }
          : s
      )
    );
    // Open success modal matching Figma
    setSuccessMessage("Time Slot saved successfully!");
    setSuccessType('save');
    setIsSuccessOpen(true);
  };



  // --- Add Subject Allocation Handler ---
  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = semesterSubjects.find(s => s.code === selectedSubjectCode);
    if (!sub) return;

    // Check conflicts
    const hasOverlap = allocations.some(
      a => a.day === selectedDay && a.timeSlot === selectedTimeSlot
    );

    if (hasOverlap) {
      alert("This time slot is already allocated to another subject! Please select a free slot.");
      return;
    }

    const newAllocation: TimetableSlot = {
      day: selectedDay,
      timeSlot: selectedTimeSlot,
      subjectCode: sub.code,
      subjectName: sub.title,
      facultyName: selectedFaculty,
      roomNo: selectedRoom
    };

    setAllocations(prev => [...prev, newAllocation]);
  };

  // --- Remove Allocation ---
  const handleRemoveAllocation = (index: number) => {
    setAllocations(prev => prev.filter((_, idx) => idx !== index));
  };

  // --- Merge Timetables Action ---
  const handleMergeTimetables = () => {
    setMergeStep('merged');
    setSuccessMessage("Timetables Merged successfully!");
    setSuccessType('save'); // Uses green checkmark
    setIsSuccessOpen(true);
  };

  // --- Bulk Upload Simulation ---
  const handleBulkUpload = () => {
    alert("Bulk Upload Mock: Select an Excel or CSV schedule file. Parsing timetable configurations...");
    // Populate some slots and allocations as mock upload output
    setCreatedSlots([
      { id: '10', semester: '2nd', startTime: '09:00 AM', endTime: '10:00 AM' },
      { id: '11', semester: '2nd', startTime: '10:00 AM', endTime: '11:00 AM' },
      { id: '12', semester: '2nd', startTime: '11:15 AM', endTime: '12:15 PM' },
      { id: '13', semester: '2nd', startTime: '01:00 PM', endTime: '02:00 PM' }
    ]);
  };

  // --- Tab 2: Dynamic slot row helpers ---
  const updateSlotRow = (id: string, field: 'date' | 'timeSlot' | 'courseTitle' | 'courseCode', value: string) => {
    setSlotRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value, error: undefined } : r));
  };

  const handleAddSlotRow = () => {
    setSlotRows(prev => [...prev, { id: `row-${Date.now()}`, date: '', timeSlot: '', courseTitle: '', courseCode: '' }]);
  };

  const isSlotBooked = (date: string, timeSlot: string, excludeId: string) => {
    const parts = timeSlot.split(' to ');
    const start = parts[0];
    const end = parts[1];
    if (!date || !start || !end) return false;
    const inAllocations = subjectAllocations.some(sa => sa.dateDay === date && sa.startTime === start && sa.endTime === end);
    const inOtherRows = slotRows.some(r => r.id !== excludeId && r.date === date && r.timeSlot === timeSlot);
    return inAllocations || inOtherRows;
  };

  const handleAddAllSlots = () => {
    // Build a running list to detect within-batch conflicts too
    const newAllocations = [...subjectAllocations];
    let hasErrors = false;

    const updatedRows = slotRows.map(row => {
      if (!row.date || !row.timeSlot || !row.courseTitle || !row.courseCode) {
        hasErrors = true;
        return { ...row, error: 'Please fill all fields in this slot before adding.' };
      }

      const parts = row.timeSlot.split(' to ');
      const start = parts[0] || '10:00 AM';
      const end = parts[1] || '11:00 AM';

      const hasCourseConflict = newAllocations.some(
        sa => sa.courseCode === row.courseCode || sa.courseTitle === row.courseTitle
      );
      if (hasCourseConflict) {
        hasErrors = true;
        return { ...row, error: `Conflict: "${row.courseTitle}" already has a scheduled exam slot.` };
      }

      const hasSlotConflict = newAllocations.some(
        sa => sa.dateDay === row.date && sa.startTime === start && sa.endTime === end
      );
      if (hasSlotConflict) {
        hasErrors = true;
        return { ...row, error: `Conflict: Slot on ${row.date} at ${start}–${end} is already booked.` };
      }

      // Valid — add to the running check list for subsequent rows
      newAllocations.push({ startTime: start, endTime: end, courseTitle: row.courseTitle, courseCode: row.courseCode, dateDay: row.date, shift: getShiftFromTime(start) });
      return { ...row, error: undefined };
    });

    setSlotRows(updatedRows);

    if (!hasErrors) {
      setSubjectAllocations(newAllocations);
      setSlotRows([{ id: `row-reset-${Date.now()}`, date: '', timeSlot: '', courseTitle: '', courseCode: '' }]);
    }
  };

  const handleRemoveSubjectAllocation = (idx: number) => {
    setSubjectAllocations(prev => prev.filter((_, i) => i !== idx));
  };

  // --- Tab 2: Subject Allocation Modal Handlers ---
  const handleConfirmDeleteAllocation = () => {
    if (!selectedSubDelete) return;
    const { absoluteIdx } = selectedSubDelete;
    setSubjectAllocations(prev => prev.filter((_, i) => i !== absoluteIdx));
    setIsSubDeleteOpen(false);
    setSelectedSubDelete(null);
    setSuccessMessage("Subject Allocation deleted successfully!");
    setSuccessType('delete');
    setIsSuccessOpen(true);
  };

  const handleSaveEditAllocationModal = (
    oldAlloc: any,
    newAlloc: { startTime: string; endTime: string; courseTitle: string; courseCode: string; dateDay: string }
  ) => {
    if (!selectedSubEdit) return;
    const { absoluteIdx } = selectedSubEdit;

    // Relational checks (excluding the one being edited!)
    const otherAllocations = subjectAllocations.filter((_, i) => i !== absoluteIdx);

    // 1. Relational DB Constraint: Course Unique Check (excluding self)
    const hasCourseConflict = otherAllocations.some(
      sa => sa.courseCode === newAlloc.courseCode || sa.courseTitle === newAlloc.courseTitle
    );
    if (hasCourseConflict) {
      alert(`Database Constraint Conflict: An exam is already scheduled for "${newAlloc.courseTitle}" (${newAlloc.courseCode})!`);
      return;
    }

    // 2. Relational DB Constraint: Date-Time Slot Unique Booking Check (excluding self)
    const hasSlotConflict = otherAllocations.some(
      sa => sa.dateDay === newAlloc.dateDay && sa.startTime === newAlloc.startTime && sa.endTime === newAlloc.endTime
    );
    if (hasSlotConflict) {
      alert(`Database Constraint Conflict: Another exam is already scheduled on ${newAlloc.dateDay} at ${newAlloc.startTime} to ${newAlloc.endTime}!`);
      return;
    }

    // Decode shift
    const shift = getShiftFromTime(newAlloc.startTime);

    setSubjectAllocations(prev =>
      prev.map((sa, i) =>
        i === absoluteIdx
          ? { ...newAlloc, shift }
          : sa
      )
    );

    setIsSubEditOpen(false);
    setSelectedSubEdit(null);
    setSuccessMessage("Subject Allocation saved successfully!");
    setSuccessType('save');
    setIsSuccessOpen(true);
  };

  const handleFinalPublishTab2 = () => {
    // Generate a unique number
    const code = branchTab2.split(' ').map(w => w[0]).join('').toUpperCase();
    const rand = Math.floor(100 + Math.random() * 900);
    const timetableNo = `TT-2026-${code}-SEM${semesterTab2}-${rand}`;

    // Convert subjectAllocations into standard TimetableSlots
    const slots: TimetableSlot[] = subjectAllocations.map(sa => {
      const dateParts = sa.dateDay.split('-');
      const dateObj = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      const daysOfWeek: Array<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'> = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ];
      const dayIndex = Math.max(0, Math.min(5, dateObj.getDay() - 1));
      const day = daysOfWeek[dayIndex] || 'Monday';

      return {
        day,
        timeSlot: `${sa.startTime} - ${sa.endTime}`,
        subjectCode: sa.courseCode,
        subjectName: sa.courseTitle,
        facultyName: 'Dr. A. Kumar',
        roomNo: 'Room 101'
      };
    });

    const newTt: Timetable = {
      id: Date.now().toString(),
      timetableNo,
      year: academicYear === 'FE' ? '1st Year' : academicYear === 'SE' ? '2nd Year' : '3rd Year',
      branch: branchTab2,
      semester: semesterTab2 === '1' ? '1st' : `${semesterTab2}th`,
      scheme: 'Choice Based Credit System (CBCS) 2024',
      status: 'active',
      slots,
      created_at: new Date().toISOString().split('T')[0]
    };

    setSuccessMessage(`Timetable ${timetableNo} generated & published successfully!`);
    setSuccessType('save');
    setIsSuccessOpen(true);
    // Delay calling onPublish so user can see the success modal first
    setTimeout(() => onPublish(newTt), 1800);
  };

  // --- Final Publish ---
  const handleFinalPublish = () => {
    const code = 'IT';
    const rand = Math.floor(100 + Math.random() * 900);
    const timetableNo = `TT-2026-${code}-SEM${selectedSemester.replace(/\D/g, '')}-${rand}`;

    const newTt: Timetable = {
      id: Date.now().toString(),
      timetableNo,
      year: '2nd Year',
      branch: 'Information Technology',
      semester: selectedSemester,
      scheme: 'Choice Based Credit System (CBCS) 2024',
      status: 'active',
      slots: allocations,
      created_at: new Date().toISOString().split('T')[0]
    };

    setSuccessMessage("Timetables Published successfully!");
    setSuccessType('save');
    setIsSuccessOpen(true);
    setTimeout(() => onPublish(newTt), 1800);
  };


  // --- Class names ---
  const labelClass = "block text-sm font-semibold text-[#344054] mb-1.5";
  const inputClass = "w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680] shadow-sm";

  return (
    <div className="flex flex-col gap-6 w-full font-sans">

      {/* Figma style Tab Navigation bar */}
      <div className="flex justify-between items-center w-full flex-wrap gap-4">
        {/* Tab container: Light blue/gray rounded wrapper */}
        <div className="flex bg-[#f2f4fd] p-1 rounded-xl border border-[#e5e7fb]">
          {[
            { id: 'timeslot', label: 'Add Time Slot' },
            { id: 'subject', label: 'Add Subject -Exam' },
            { id: 'view', label: 'View Timetables' },
            { id: 'merge', label: 'Merge Timetables' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === tab.id
                ? 'bg-[#0e1680] text-white shadow-sm'
                : 'text-[#687b96] hover:text-[#0e1680]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Upload Bulk Timetable Button (aligned right) */}
        {activeTab === 'timeslot' && (
          <button
            type="button"
            onClick={() => setIsBulkUploadOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow transition-all cursor-pointer"
          >
            <Upload size={16} />
            Upload Bulk Timetable
          </button>
        )}
      </div>

      {/* --- TAB CONTENT: ADD TIME SLOT --- */}
      {activeTab === 'timeslot' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">

          {/* Add Time Slot Form */}
          <form onSubmit={handleAddTimeSlot} className="bg-white border border-[#eaecf0] rounded-xl p-6 shadow-sm flex flex-col gap-5">
            <div>
              <label className={labelClass}>Select Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className={inputClass}
              >
                {MOCK_SEMESTERS.map(sem => (
                  <option key={sem} value={sem}>{sem} Semester</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Start Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680] shadow-sm pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#687b96]">
                    <Clock size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>End Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-2 focus:ring-[#0e1680] shadow-sm pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#687b96]">
                    <Clock size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-md cursor-pointer transition-all active:scale-95"
              >
                {editingSlotId ? <Check size={16} /> : <Plus size={16} />}
                {editingSlotId ? "Update Time Slot" : "Add Time Slot"}
              </button>
            </div>
          </form>

          {/* Time Slots Table Section (refined as per Figma mockup) */}
          <div className="flex flex-col gap-4">

            {/* Search and Semester Filter Row */}
            <div className="flex justify-end gap-3 items-center">
              {/* Search Bar */}
              <div className="relative w-[220px]">
                <input
                  type="text"
                  placeholder="Search"
                  value={slotSearchQuery}
                  onChange={(e) => setSlotSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-white border border-[#d0d5dd] rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm text-[#101828] placeholder-[#98a2b3]"
                />
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#687b96]">
                  <Search size={14} />
                </div>
              </div>

              {/* Semester Filter Button */}
              <div className="relative flex items-center">
                <select
                  value={slotFilterSemester}
                  onChange={(e) => setSlotFilterSemester(e.target.value)}
                  className="appearance-none bg-white border border-[#d0d5dd] rounded-lg pl-3 pr-9 py-2 text-xs font-semibold text-[#344054] hover:bg-gray-50 shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#0e1680]"
                >
                  <option value="">Semester</option>
                  {MOCK_SEMESTERS.map(sem => (
                    <option key={sem} value={sem}>{sem} Sem</option>
                  ))}
                </select>
                <Filter size={12} className="absolute right-3 text-[#344054] pointer-events-none" />
              </div>
            </div>

            <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-[#475467] text-center">Sr.No.</th>
                    <th className="px-6 py-3 text-xs font-semibold text-[#475467] text-center">Semester</th>
                    <th className="px-6 py-3 text-xs font-semibold text-[#475467] text-center">Time Slot</th>
                    <th className="px-6 py-3 text-xs font-semibold text-[#475467] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaecf0]">
                  {displayedSlots.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="h-28 text-center text-sm text-[#98a2b3] italic">
                        No time slots configured. Add your first time slot above.
                      </td>
                    </tr>
                  ) : (
                    displayedSlots.map((slot, idx) => {
                      const absoluteIdx = (slotCurrentPage - 1) * SLOT_PAGE_SIZE + idx + 1;
                      return (
                        <tr key={slot.id} className="hover:bg-gray-50/50 h-14">
                          <td className="px-6 py-4 text-sm font-medium text-[#475467] text-center">{absoluteIdx}</td>
                          <td className="px-6 py-4 text-sm text-[#475467] text-center">{slot.semester}</td>
                          <td className="px-6 py-4 text-sm text-[#101828] font-bold text-center">
                            {slot.startTime} to {slot.endTime}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleRemoveSlot(slot.id)}
                                className="text-[#687b96] hover:text-[#d92d20] transition-colors p-1 cursor-pointer"
                                title="Delete Slot"
                              >
                                <Trash2 size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEditSlot(slot);
                                  setIsSlotEditModalOpen(true);
                                }}
                                className="text-[#687b96] hover:text-[#0e1680] transition-colors p-1 cursor-pointer"
                                title="Edit Slot"
                              >
                                <Pencil size={16} className="stroke-[2.2]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Table Pagination Footer */}
              <div className="px-6 py-3 bg-white flex items-center justify-between border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setSlotCurrentPage(prev => Math.max(1, prev - 1))}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={slotCurrentPage === 1}
                >
                  <ArrowLeft size={14} />
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {renderPaginationNumbers(slotCurrentPage, slotTotalPages, setSlotCurrentPage)}
                </div>

                <button
                  type="button"
                  onClick={() => setSlotCurrentPage(prev => Math.min(slotTotalPages, prev + 1))}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={slotCurrentPage === slotTotalPages}
                >
                  Next
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* --- TAB CONTENT: ADD SUBJECT - EXAM --- */}
      {activeTab === 'subject' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">

          {/* Restructured Academic Form */}
          <div className="bg-white border border-[#eaecf0] rounded-xl p-6 shadow-sm flex flex-col gap-5">

            {/* Row 1: Select Academic Year & Select Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Select Academic Year</label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className={inputClass}
                >
                  <option value="FE">FE</option>
                  <option value="SE">SE</option>
                  <option value="TE">TE</option>
                  <option value="BE">BE</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Select Semester</label>
                <select
                  value={semesterTab2}
                  onChange={(e) => setSemesterTab2(e.target.value)}
                  className={inputClass}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                </select>
              </div>
            </div>

            {/* Row 2: Select Branch & No of Courses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Select Branch</label>
                <select
                  value={branchTab2}
                  onChange={(e) => setBranchTab2(e.target.value)}
                  className={inputClass}
                >
                  <option value="Information Technology">Information Technology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mechatronics">Mechatronics</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>No of Courses</label>
                <select
                  value={noOfCourses}
                  onChange={(e) => setNoOfCourses(e.target.value)}
                  className={inputClass}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>

            {/* Row 3: Examination Type */}
            <div>
              <label className={labelClass}>Examination Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className={inputClass}
              >
                <option value="Internal Assessment 1">Internal Assessment 1</option>
                <option value="Internal Assessment 2">Internal Assessment 2</option>
                <option value="End Semester Exam">End Semester Exam</option>
              </select>
            </div>

            {/* Row 4: Start Date & End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Start Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClass}
                    placeholder="DD-MM-YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#687b96]">
                    <Calendar size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>End Date</label>
                <div className="relative">
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={inputClass}
                    placeholder="DD-MM-YYYY"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#687b96]">
                    <Calendar size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Figma style Add Slots Box container */}
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold text-[#344054]">Add Slots</h4>
              <div className="flex flex-col gap-3">
                {slotRows.map((row, index) => (
                  <div
                    key={row.id}
                    className={`p-5 rounded-2xl border flex flex-col gap-4 relative transition-all ${index === 0
                        ? 'bg-[#f2f4fd] border-[#e5e7fb]'
                        : 'bg-[#e8efff] border-[#c7d7f5]'
                      }`}
                  >
                    {/* Row label for clarity when multiple rows */}
                    {slotRows.length > 1 && (
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#0e1680] uppercase tracking-wide">Slot {index + 1}</span>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => setSlotRows(prev => prev.filter(r => r.id !== row.id))}
                            className="text-[#98a2b3] hover:text-[#d92d20] transition-colors"
                            title="Remove this slot"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Per-row conflict error */}
                    {row.error && (
                      <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold animate-in slide-in-from-top-2 duration-300">
                        <AlertCircle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-5">{row.error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                      {/* Date Select */}
                      <select
                        value={row.date}
                        onChange={(e) => updateSlotRow(row.id, 'date', e.target.value)}
                        className={inputClass}
                      >
                        <option value="" disabled hidden>Select Date</option>
                        {availableDates.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>

                      {/* Time Slot Select — mark already-booked slots */}
                      <select
                        value={row.timeSlot}
                        onChange={(e) => updateSlotRow(row.id, 'timeSlot', e.target.value)}
                        className={inputClass}
                      >
                        <option value="" disabled hidden>Select Time Slot</option>
                        {[
                          '09:00 AM to 10:00 AM',
                          '10:00 AM to 11:00 AM',
                          '11:15 AM to 12:15 PM',
                          '12:00 AM to 01:00 PM',
                          '01:00 PM to 02:00 PM',
                          '02:00 PM to 03:00 PM'
                        ].map(slot => {
                          const taken = isSlotBooked(row.date, slot, row.id);
                          return (
                            <option key={slot} value={slot} disabled={taken}>
                              {slot}{taken ? ' — Booked' : ''}
                            </option>
                          );
                        })}
                      </select>

                      {/* Course Title + Code */}
                      <div className="grid grid-cols-2 gap-4">
                        <select
                          value={row.courseTitle}
                          onChange={(e) => updateSlotRow(row.id, 'courseTitle', e.target.value)}
                          className={inputClass}
                        >
                          <option value="" disabled hidden>Select Course Title</option>
                          <option value="Operating System">Operating System</option>
                          <option value="Automata Theory">Automata Theory</option>
                          <option value="Communication">Communication</option>
                        </select>

                        <select
                          value={row.courseCode}
                          onChange={(e) => updateSlotRow(row.id, 'courseCode', e.target.value)}
                          className={inputClass}
                        >
                          <option value="" disabled hidden>Select Course Code</option>
                          <option value="CO1919">CO1919</option>
                          <option value="CO1920">CO1920</option>
                        </select>
                      </div>
                    </div>

                    {/* + button only on the LAST row */}
                    {index === slotRows.length - 1 && (
                      <div className="flex justify-end mt-1">
                        <button
                          type="button"
                          onClick={handleAddSlotRow}
                          className="w-8 h-8 rounded-full border-2 border-[#0e1680] bg-white flex items-center justify-center text-[#0e1680] hover:bg-[#0e1680] hover:text-white transition-all shadow-sm cursor-pointer active:scale-90"
                          title="Add another slot"
                        >
                          <Plus size={18} className="stroke-[2.5]" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action buttons — ABOVE the allocations table */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('view')}
              className="flex items-center gap-1.5 px-5 py-2.5 border border-[#0e1680] text-[#0e1680] text-sm font-semibold rounded-lg hover:bg-[#f2f4fd] shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <Eye size={16} />
              View Timetable
            </button>
            <button
              type="button"
              onClick={handleAddAllSlots}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 shadow-md cursor-pointer transition-all active:scale-95"
            >
              <Plus size={16} />
              Add Timetable
            </button>
          </div>

          {/* Allocations Summary Table */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
                  <tr>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">Start Time</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">End Time</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467]">Course Title</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">Course Code</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">Date/Day</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaecf0]">
                  {displayedSubjectAllocations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="h-28 text-center text-sm text-[#98a2b3] italic">
                        No subject allocations added. Map slots inside the "Add Slots" card above.
                      </td>
                    </tr>
                  ) : (
                    displayedSubjectAllocations.map((sa, saIdx) => {
                      const absoluteIdx = (subjectCurrentPage - 1) * SUBJECT_PAGE_SIZE + saIdx;
                      return (
                        <tr key={absoluteIdx} className="hover:bg-gray-50/50 h-14">
                          <td className="px-6 py-4 text-sm text-[#475467] text-center">{sa.startTime}</td>
                          <td className="px-6 py-4 text-sm text-[#475467] text-center">{sa.endTime}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#101828]">{sa.courseTitle}</td>
                          <td className="px-6 py-4 text-sm text-[#475467] text-center font-medium">{sa.courseCode}</td>
                          <td className="px-6 py-4 text-sm text-[#101828] font-medium text-center">{sa.dateDay}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSubView(sa);
                                  setIsSubViewOpen(true);
                                }}
                                className="text-[#687b96] hover:text-[#0e1680] transition-colors p-1 cursor-pointer"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSubDelete({ sa, absoluteIdx });
                                  setIsSubDeleteOpen(true);
                                }}
                                className="text-[#687b96] hover:text-[#d92d20] transition-colors p-1 cursor-pointer"
                                title="Delete Allocation"
                              >
                                <Trash2 size={16} />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSubEdit({ sa, absoluteIdx });
                                  setIsSubEditOpen(true);
                                }}
                                className="text-[#687b96] hover:text-[#0e1680] transition-colors p-1 cursor-pointer"
                                title="Edit Allocation"
                              >
                                <Pencil size={16} className="stroke-[2.2]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Table Pagination Footer */}
              <div className="px-6 py-3 bg-white flex items-center justify-between border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setSubjectCurrentPage(prev => Math.max(1, prev - 1))}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={subjectCurrentPage === 1}
                >
                  <ArrowLeft size={14} />
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {renderPaginationNumbers(subjectCurrentPage, subjectTotalPages, setSubjectCurrentPage)}
                </div>

                <button
                  type="button"
                  onClick={() => setSubjectCurrentPage(prev => Math.min(subjectTotalPages, prev + 1))}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={subjectCurrentPage === subjectTotalPages}
                >
                  Next
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* --- TAB CONTENT: VIEW TIMETABLES --- */}
      {activeTab === 'view' && (() => {
        // --- Local state for View Timetables tab ---
        // We use a static mock list matching Figma exactly
        const VIEW_MOCK = [
          { no: 1, year: 'FE', branch: 'IT', semester: '1' },
          { no: 2, year: 'FE', branch: 'IT', semester: '2' },
          { no: 3, year: 'SE', branch: 'IT', semester: '3' },
          { no: 4, year: 'SE', branch: 'IT', semester: '4' },
          { no: 5, year: 'TE', branch: 'IT', semester: '5' },
          { no: 6, year: 'TE', branch: 'IT', semester: '6' },
          { no: 7, year: 'BE', branch: 'IT', semester: '7' },
          { no: 8, year: 'BE', branch: 'IT', semester: '8' },
        ];

        const VIEW_PAGE_SIZE = 5;
        const viewTotalPages = Math.ceil(VIEW_MOCK.length / VIEW_PAGE_SIZE) || 1;
        const displayedViewTimetables = VIEW_MOCK.slice(
          (viewCurrentPage - 1) * VIEW_PAGE_SIZE,
          viewCurrentPage * VIEW_PAGE_SIZE
        );


        return (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">

            {/* Select Branch */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#344054]">Select Branch</label>
              <select className="w-full px-3.5 py-2.5 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm cursor-pointer">
                <option value="IT">IT</option>
                <option value="CS">Computer Science</option>
                <option value="Mechatronics">Mechatronics</option>
              </select>
            </div>

            {/* Search + Filter bar */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-4 pr-10 py-2 bg-white border border-[#d0d5dd] rounded-lg text-sm text-[#101828] focus:outline-none focus:ring-1 focus:ring-[#0e1680] shadow-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#98a2b3]">
                  <Search size={16} />
                </div>
              </div>

              {/* Filter pills */}
              {['Time Slot', 'Date', 'Semester', 'Branch', 'Academic Year'].map(f => (
                <button
                  key={f}
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 shadow-sm cursor-pointer transition-colors whitespace-nowrap"
                >
                  {f}
                  <Filter size={13} className="text-[#667085]" />
                </button>
              ))}
            </div>

            {/* Timetable List Table */}
            <div className="bg-white border border-[#eaecf0] rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f9fafb] border-b border-[#eaecf0]">
                  <tr>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">Timetable No.</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">Year</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">Branch</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">Semester</th>
                    <th className="px-6 py-3.5 text-xs font-semibold text-[#475467] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaecf0]">
                  {displayedViewTimetables.map(row => (
                    <tr key={row.no} className="hover:bg-gray-50/50 h-14 transition-colors">
                      <td className="px-6 py-4 text-sm text-[#475467] text-center">{row.no}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#475467] text-center">{row.year}</td>
                      <td className="px-6 py-4 text-sm text-[#475467] text-center">{row.branch}</td>
                      <td className="px-6 py-4 text-sm text-[#475467] text-center">{row.semester}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="text-[#687b96] hover:text-[#0e1680] transition-colors p-1 cursor-pointer"
                            title="View"
                            onClick={() => {
                              setSelectedTimetableViewDetails(row);
                              setIsTimetableViewDetailsOpen(true);
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className="text-[#687b96] hover:text-[#d92d20] transition-colors p-1 cursor-pointer"
                            title="Delete"
                            onClick={() => setIsTimetableViewDeleteOpen(true)}
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            type="button"
                            className="text-[#687b96] hover:text-[#0e1680] transition-colors p-1 cursor-pointer"
                            title="Edit"
                            onClick={() => {
                              setSelectedTimetableEdit(row);
                              setIsTimetableEditOpen(true);
                            }}
                          >
                            <Pencil size={16} className="stroke-[2.2]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Footer */}
              <div className="px-6 py-3 bg-white flex items-center justify-between border-t border-[#eaecf0]">
                <button
                  type="button"
                  onClick={() => setViewCurrentPage(prev => Math.max(1, prev - 1))}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={viewCurrentPage === 1}
                >
                  <ArrowLeft size={14} />
                  Previous
                </button>

                <div className="flex items-center gap-1.5">
                  {renderPaginationNumbers(viewCurrentPage, viewTotalPages, setViewCurrentPage)}
                </div>

                <button
                  type="button"
                  onClick={() => setViewCurrentPage(prev => Math.min(viewTotalPages, prev + 1))}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#d0d5dd] rounded-lg text-xs font-semibold text-[#344054] hover:bg-gray-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={viewCurrentPage === viewTotalPages}
                >
                  Next
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Bottom Next button */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setActiveTab('merge')}
                className="flex items-center gap-1.5 px-7 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-md cursor-pointer transition-all active:scale-95"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        );
      })()}

      {/* --- TAB CONTENT: MERGE TIMETABLES --- */}

      {activeTab === 'merge' && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex flex-col gap-5 mt-2">

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Select Department</label>
              <select className={inputClass} defaultValue="IT">
                <option value="IT">IT</option>
                <option value="CS">Computer Science</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Select Pattern</label>
              <select className={inputClass} defaultValue="Semester">
                <option value="Semester">Semester</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div className="flex justify-end mt-4 gap-4">
              {mergeStep === 'initial' ? (
                <button
                  type="button"
                  onClick={handleMergeTimetables}
                  className="px-6 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Merge Timetables
                </button>
              ) : (
                <div className="flex justify-center w-full gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsMergedViewOpen(true)}
                    className="px-8 py-2.5 bg-[#0e1680] hover:bg-blue-900 text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    View Merge Timetable
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalPublish}
                    className="px-8 py-2.5 bg-[#8b9cf6] hover:bg-[#7a8deb] text-white text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Publish Timetable
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Bulk Upload Modal */}
      <TimetableBulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUploadSuccess={(filename) => {
          setSuccessMessage("Bulk Uploaded successfully !");
          setIsSuccessOpen(true);
          setCreatedSlots([
            { id: '10', semester: selectedSemester, startTime: '09:00 AM', endTime: '10:00 AM' },
            { id: '11', semester: selectedSemester, startTime: '10:00 AM', endTime: '11:00 AM' },
            { id: '12', semester: selectedSemester, startTime: '11:15 AM', endTime: '12:15 PM' },
            { id: '13', semester: selectedSemester, startTime: '01:00 PM', endTime: '02:00 PM' }
          ]);
        }}
      />

      {/* Success Modal */}
      <TimetableSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        message={successMessage}
        type={successType}
        buttonText="Back"
      />

      {/* Time Slot Edit Modal */}
      <TimeSlotEditModal
        isOpen={isSlotEditModalOpen}
        onClose={() => {
          setIsSlotEditModalOpen(false);
          setSelectedEditSlot(null);
        }}
        slot={selectedEditSlot}
        onSave={handleSaveEditSlotModal}
      />

      {/* Subject Allocation View Modal */}
      <SubjectAllocationViewModal
        isOpen={isSubViewOpen}
        onClose={() => {
          setIsSubViewOpen(false);
          setSelectedSubView(null);
        }}
        allocation={selectedSubView}
      />

      {/* Subject Allocation Delete Modal */}
      <SubjectAllocationDeleteModal
        isOpen={isSubDeleteOpen}
        onClose={() => {
          setIsSubDeleteOpen(false);
          setSelectedSubDelete(null);
        }}
        allocation={selectedSubDelete ? selectedSubDelete.sa : null}
        onConfirm={handleConfirmDeleteAllocation}
      />

      {/* Subject Allocation Edit Modal */}
      <SubjectAllocationEditModal
        isOpen={isSubEditOpen}
        onClose={() => {
          setIsSubEditOpen(false);
          setSelectedSubEdit(null);
        }}
        allocation={selectedSubEdit ? selectedSubEdit.sa : null}
        availableDates={availableDates}
        onSave={handleSaveEditAllocationModal}
      />

      {/* Time Slot Delete Confirmation Modal */}
      <TimeSlotDeleteModal
        isOpen={isSlotDeleteOpen}
        onClose={() => {
          setIsSlotDeleteOpen(false);
          setSelectedDeleteSlot(null);
        }}
        slot={selectedDeleteSlot}
        onConfirm={handleConfirmDeleteSlot}
      />

      {/* Timetable Edit Modal (View Timetables Tab) */}
      <TimetableEditModal
        isOpen={isTimetableEditOpen}
        onClose={() => {
          setIsTimetableEditOpen(false);
          setSelectedTimetableEdit(null);
        }}
        onSave={handleSaveTimetableEdit}
        timetableData={selectedTimetableEdit}
      />

      {/* Timetable View Details Modal (View Timetables Tab) */}
      <TimetableViewDetailsModal
        isOpen={isTimetableViewDetailsOpen}
        onClose={() => {
          setIsTimetableViewDetailsOpen(false);
          setSelectedTimetableViewDetails(null);
        }}
        timetableData={selectedTimetableViewDetails}
      />

      {/* Timetable View Delete Modal (View Timetables Tab) */}
      <TimetableViewDeleteModal
        isOpen={isTimetableViewDeleteOpen}
        onClose={() => setIsTimetableViewDeleteOpen(false)}
        onConfirm={handleConfirmTimetableViewDelete}
      />

      {/* Merged Timetable View Modal (Merge Tab) */}
      <MergedTimetableViewModal
        isOpen={isMergedViewOpen}
        onClose={() => setIsMergedViewOpen(false)}
      />
    </div>
  );
};

