import { Search, Filter, Eye, Trash2, Pencil } from 'lucide-react';
import type { SchemeTableProps } from '../../../../types/COE/scheme';

export const SchemeTable: React.FC<SchemeTableProps> = ({
  schemes,
  onAddNew: _onAddNew,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <div className="flex flex-col h-full bg-[#fcfcfd] font-sans w-full">
      {/* Header and tabs moved to SchemePage.tsx */}

      <div className="flex justify-end mb-[16px]">
        <div className="flex items-center gap-[12px]">
          <div className="relative w-[211px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-[#687b96]" />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-[36px] pr-[12px] py-[8px] bg-white border border-[#d0d5dd] rounded-lg text-[16px] text-[#687b96] placeholder-[#687b96] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
            />
          </div>
          <button className="flex items-center gap-[8px] px-[16px] py-[10px] bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#344054] font-semibold shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-gray-50 transition-colors">
            Credit system type
            <Filter size={16} className="text-[#344054]" />
          </button>
          <button className="flex items-center gap-[8px] px-[16px] py-[10px] bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#344054] font-semibold shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-gray-50 transition-colors">
            Regulation year
            <Filter size={16} className="text-[#344054]" />
          </button>
          <button className="flex items-center gap-[8px] px-[16px] py-[10px] bg-white border border-[#d0d5dd] rounded-lg text-[14px] text-[#344054] font-semibold shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] hover:bg-gray-50 transition-colors">
            Semester
            <Filter size={16} className="text-[#344054]" />
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#eaecf0] border-solid rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#f9fafb]">

              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#49505b]">Scheme Name</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-left border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467]">Scheme Code</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467]">Regulation Year</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467]">Applicable From Academic Year</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467]">Total Semesters</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-center border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467]">Credit System Type</span>
              </th>
              <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider text-right border-b border-[#eaecf0] border-solid">
                <span className="text-[12px] font-medium text-[#475467]">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaecf0]">
            {schemes.map((scheme: any) => (
              <tr key={scheme.scheme_id} className="hover:bg-gray-50 transition-colors h-[72px]">

                <td className="px-8 py-6 text-[15px] font-medium align-middle">
                  <span className="text-[14px] font-normal text-[#475467]">{scheme.scheme_name}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium align-middle">
                  <span className="text-[14px] font-normal text-[#475467]">{scheme.scheme_code}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-center align-middle">
                  <span className="text-[16px] font-normal text-[#687b96]">{scheme.regulation}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-center align-middle">
                  <span className="text-[16px] font-normal text-[#687b96]">{scheme.applicable_from_year}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-center align-middle">
                  <span className="text-[16px] font-normal text-[#687b96]">{scheme.total_semesters}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium text-center align-middle">
                  <span className="text-[16px] font-normal text-[#687b96]">{scheme.credit_system_type}</span>
                </td>
                <td className="px-8 py-6 text-[15px] font-medium align-middle">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-[#98a2b3] hover:text-[#101828] transition-colors rounded-lg">
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(scheme)}
                      className="p-2 text-[#98a2b3] hover:text-[#d92d20] transition-colors rounded-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                    <button
                      onClick={() => onEditClick(scheme)}
                      className="p-2 text-[#98a2b3] hover:text-[#101828] transition-colors rounded-lg"
                    >
                      <Pencil size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
