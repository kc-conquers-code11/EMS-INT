import React, { useState, useEffect } from 'react';
import { DepartmentDetailsTable } from '../../../components/screens/COE/Department/DepartmentDetailsTable';
import { AddDepartmentDetails } from '../../../components/screens/COE/Department/AddDepartmentDetails';
import { EditDepartmentModal } from '../../../components/screens/COE/Department/EditDepartmentModal';
import { ViewDepartmentModal } from '../../../components/screens/COE/Department/ViewDepartmentModal';
import { FeedbackModal } from '../../../components/screens/COE/Department/DepartmentModals';
import type { Department, ViewType, FeedbackType } from '../../../types/COE/department';
import { departmentAPI } from '../../../services/api';
import { getApiErrorMessage } from '../../../types/COE/departmentSetup';

export const DepartmentPage: React.FC = () => {
  const [view, setView] = useState<ViewType>('table');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<Department | undefined>();
  
  // Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [feedbackState, setFeedbackState] = useState<{
    isOpen: boolean;
    type: FeedbackType;
    message?: string;
  }>({
    isOpen: false,
    type: 'edit_success',
  });

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getList();
      const list = Array.isArray(response.data?.data) ? response.data.data : [];
      // Map API data to the Department type needed by the frontend.
      const mapped = list.map((dept: any) => ({
        id: dept.depart_id, // using depart_id as id
        name: dept.depart_name || 'N/A',
        hod: dept.head_name || 'N/A',
        facultyCount: dept.total_faculties || 0,
        studentCount: dept.total_students || 0,
        mobile: dept.contact || 'N/A',
        email: dept.email || 'N/A',
      }));
      setDepartments(mapped);
    } catch (err) {
      console.error('Failed to fetch departments', err);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEditClick = (dept: Department) => {
    setSelectedDept(dept);
    setIsEditOpen(true);
  };

  const handleViewClick = (dept: Department) => {
    setSelectedDept(dept);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (dept: Department) => {
    setSelectedDept(dept);
    setFeedbackState({ isOpen: true, type: 'delete_confirm' });
  };



  const handleConfirmDelete = async () => {
    if (!selectedDept) return;
    try {
      await departmentAPI.delete(selectedDept.id);
      await fetchDepartments();
      setFeedbackState({ isOpen: true, type: 'delete_success' });
    } catch (err) {
      console.error('Failed to delete department', err);
      setFeedbackState({
        isOpen: true,
        type: 'delete_confirm',
        message: getApiErrorMessage(err, 'Failed to delete department. Please try again.'),
      });
    }
  };

  const handleAddSuccess = (message?: string) => {
    fetchDepartments();
    setView('table');
    setFeedbackState({
      isOpen: true,
      type: 'add_success',
      message:
        message ||
        'Department created successfully! Credential emails were sent if SMTP is configured.',
    });
  };

  const closeFeedback = () => {
    setFeedbackState(prev => ({ ...prev, isOpen: false }));
    setSelectedDept(undefined);
  };

  return (
    <div className="h-full">
      {view === 'table' ? (
        <DepartmentDetailsTable 
          departments={departments}
          onAddNew={() => setView('add')}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onViewClick={handleViewClick}
        />
      ) : (
        <div className="p-6">
          <AddDepartmentDetails
            onBack={() => setView('table')}
            onSuccess={handleAddSuccess}
          />
        </div>
      )}


      {/* Modals */}
      <EditDepartmentModal 
        isOpen={isEditOpen}
        onClose={(success?: boolean) => {
          setIsEditOpen(false);
          if (success) fetchDepartments();
        }}
        department={selectedDept}
      />

      <ViewDepartmentModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        department={selectedDept}
      />

      <FeedbackModal 
        isOpen={feedbackState.isOpen}
        type={feedbackState.type}
        onClose={closeFeedback}
        onConfirm={handleConfirmDelete}
        message={feedbackState.type === 'delete_confirm' ? `Do you really want to delete ${selectedDept?.name}?` : undefined}
      />
    </div>
  );
};
