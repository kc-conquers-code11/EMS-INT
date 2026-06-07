import React from 'react';
import { Eye, Trash2, Pencil, Plus } from 'lucide-react';
import type { Department } from '../../../../types/COE/department';

interface DepartmentTableProps {
  departments: Department[];
  onAddClick: () => void;
  onEditClick: (dept: Department) => void;
  onDeleteClick: (dept: Department) => void;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({ 
  departments, 
  onAddClick, 
  onEditClick, 
  onDeleteClick 
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Department Details</h1>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 bg-[#0e1680] text-white px-4 py-2 rounded-lg hover:bg-blue-900 shadow-md"
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                {['Department Name', 'HOD Name', 'Faculty Count', 'Student Count', 'Mobile No', 'Email ID', 'Actions'].map((h, i) => (
                  <th 
                    key={h} 
                    className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase ${
                      i === 2 || i === 3 ? 'text-center' : i === 6 ? 'text-right' : ''
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-6 text-[15px] font-medium text-sm text-gray-700">{dept.name}</td>
                  <td className="px-8 py-6 text-[15px] font-medium text-sm text-gray-600">{dept.hod}</td>
                  <td className="px-8 py-6 text-[15px] font-medium text-sm text-gray-600 text-center">{dept.facultyCount}</td>
                  <td className="px-8 py-6 text-[15px] font-medium text-sm text-gray-600 text-center">{dept.studentCount}</td>
                  <td className="px-8 py-6 text-[15px] font-medium text-sm text-gray-600">{dept.mobile}</td>
                  <td className="px-8 py-6 text-[15px] font-medium text-sm text-gray-600">{dept.email}</td>
                  <td className="px-8 py-6 text-[15px] font-medium text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700"><Eye size={18} /></button>
                      <button onClick={() => onDeleteClick(dept)} className="p-2 text-gray-500 hover:text-red-600"><Trash2 size={18} /></button>
                      <button onClick={() => onEditClick(dept)} className="p-2 text-gray-500 hover:text-blue-600"><Pencil size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
