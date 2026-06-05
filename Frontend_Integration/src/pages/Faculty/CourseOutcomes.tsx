import React, { useState, useEffect } from 'react';

// Using dummy interfaces for now
interface CO {
  co_id: number;
  subject_id: number;
  co_code: string;
  description: string;
  blooms_level: string;
}

export const CourseOutcomes: React.FC = () => {
  const [cos, setCOs] = useState<CO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Blooms Taxonomy Dropdown Options
  const bloomsOptions = [
    'L1 (Remember)',
    'L2 (Understand)',
    'L3 (Apply)',
    'L4 (Analyze)',
    'L5 (Evaluate)',
    'L6 (Create)'
  ];

  useEffect(() => {
    // Dummy fetch
    setTimeout(() => {
      setCOs([
        { co_id: 1, subject_id: 101, co_code: 'CO1', description: 'Understand the basics of React', blooms_level: 'L2 (Understand)' },
        { co_id: 2, subject_id: 101, co_code: 'CO2', description: 'Build a full-stack app', blooms_level: 'L6 (Create)' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-100 rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Define Course Outcomes (COs)</h2>
            <p className="text-sm text-gray-500 mt-1">Select your assigned subject to manage its COs</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition-colors">
            + Add New CO
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex gap-4 items-end">
             <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">-- Select Subject --</option>
                    <option value="101">Advanced Web Technologies</option>
                </select>
             </div>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading COs...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">CO Code</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Bloom's Level</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider w-32">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cos.map((co) => (
                    <tr key={co.co_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{co.co_code}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{co.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                         <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">{co.blooms_level}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Edit</button>
                        <button className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {cos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No Course Outcomes defined for this subject.
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

export default CourseOutcomes;
