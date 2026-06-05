import React, { useState, useEffect } from 'react';

export const CoPoMapping: React.FC = () => {
  // Dummy lists
  const cos = ['CO1', 'CO2', 'CO3', 'CO4', 'CO5'];
  const pos = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12'];
  
  // Mapping state: mapping[co][po] = true/false (checked state)
  const [mapping, setMapping] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    // Initialize mapping matrix
    const initial: Record<string, Record<string, boolean>> = {};
    cos.forEach(co => {
      initial[co] = {};
      pos.forEach(po => {
        initial[co][po] = false;
      });
    });
    setMapping(initial);
  }, []);

  const handleToggle = (co: string, po: string) => {
    setMapping(prev => ({
      ...prev,
      [co]: {
        ...prev[co],
        [po]: !prev[co][po]
      }
    }));
  };

  const handleSave = () => {
    console.log("Saving Mapping Payload:", mapping);
    alert('Mapping Saved!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-100 rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">CO-PO Mapping Matrix</h2>
            <p className="text-sm text-gray-500 mt-1">Map your Course Outcomes (COs) to Program Outcomes (POs)</p>
          </div>
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow text-sm font-medium transition-colors">
            Save Mapping
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex gap-4 items-end max-w-md">
             <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                <select className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">-- Select Subject --</option>
                    <option value="101">Advanced Web Technologies</option>
                </select>
             </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-md">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 border-r border-gray-200 text-sm font-semibold text-gray-600 bg-gray-100">
                    CO \ PO
                  </th>
                  {pos.map(po => (
                    <th key={po} className="px-4 py-3 border-r border-gray-200 text-sm font-semibold text-gray-600 bg-gray-100 min-w-[60px]">
                      {po}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cos.map(co => (
                  <tr key={co} className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3 border-r border-gray-200 text-sm font-semibold text-gray-800 bg-gray-50">
                      {co}
                    </td>
                    {pos.map(po => (
                      <td key={po} className="px-4 py-3 border-r border-gray-200">
                        <label className="flex items-center justify-center cursor-pointer w-full h-full min-h-[24px]">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={mapping[co]?.[po] || false}
                            onChange={() => handleToggle(co, po)}
                          />
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoPoMapping;
