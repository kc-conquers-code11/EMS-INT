import React, { useState, useEffect } from 'react';

// Using dummy interfaces for now to prevent typescript errors
interface PO {
  po_id: number;
  programm_id: number;
  po_code: string;
  description: string;
}

export const ProgramOutcomes: React.FC = () => {
  const [pos, setPOs] = useState<PO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Note: Replace this with your actual React Query and Axios fetch logic
  useEffect(() => {
    // Dummy fetch
    setTimeout(() => {
      setPOs([
        { po_id: 1, programm_id: 1, po_code: 'PO1', description: 'Engineering knowledge' },
        { po_id: 2, programm_id: 1, po_code: 'PO2', description: 'Problem analysis' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-100 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-800">Define Program Outcomes (POs)</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-colors">
            + Add New PO
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-gray-500">Loading POs...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">PO Code</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pos.map((po) => (
                    <tr key={po.po_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{po.po_code}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{po.description}</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Edit</button>
                        <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {pos.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                        No Program Outcomes defined yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramOutcomes;
