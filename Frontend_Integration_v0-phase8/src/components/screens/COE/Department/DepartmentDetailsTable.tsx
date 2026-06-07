import { Eye, Trash2, Pencil, Plus } from 'lucide-react';
import type { DepartmentTableProps } from '../../../../types/COE/department';

export const DepartmentDetailsTable: React.FC<DepartmentTableProps & { onViewClick?: (dept: any) => void }> = ({
  departments,
  onAddNew,
  onEditClick,
  onDeleteClick,
  onViewClick
}) => {
  return (
    <div className="flex flex-col h-full bg-[#fcfcfd] font-sans">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[28px] font-semibold text-[#171822] leading-[42px]">Department Details</h1>
        <button
          onClick={onAddNew}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
        >
          <Plus size={18} />
          <span>Add Department</span>
        </button>
      </div>

      <div className="bg-white border border-[#eaecf0] border-solid rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9fafb]">

              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#49505b] uppercase tracking-wider">Department Name</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467] uppercase tracking-wider">HOD Name</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467] uppercase tracking-wider">Total Faculty Count</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467] uppercase tracking-wider">Total Student Count</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467] uppercase tracking-wider">Mobile No</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467] uppercase tracking-wider">Email ID</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-right border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467] uppercase tracking-wider">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-gray-50 transition-colors h-[72px]">

                <td className="px-8 py-6 text-[15px] font-medium align-middle">
                  <span className="text-[14px] font-normal text-[#475467]">{dept.name}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium align-middle">
                  <span className="text-[14px] font-normal text-[#475467]">{dept.hod}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-center align-middle">
                  <span className="text-[14px] font-normal text-[#475467]">{dept.facultyCount}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-center align-middle">
                  <span className="text-[14px] font-normal text-[#475467]">{dept.studentCount}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-center align-middle">
                  <span className="text-[14px] font-normal text-[#475467]">{dept.mobile}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-center align-middle">
                  <span className="text-[14px] font-normal text-[#475467] truncate max-w-[150px] inline-block">{dept.email}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium align-middle">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => onViewClick?.(dept)}
                      className="p-2 text-[#98a2b3] hover:text-[#101828] transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEditClick(dept)}
                      className="p-2 text-[#98a2b3] hover:text-[#101828] transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(dept)}
                      className="p-2 text-[#98a2b3] hover:text-[#d92d20] transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          className="px-8 py-2.5 bg-[#0e1680] text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition-all shadow-md"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
