import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download, BarChart2, Hash } from 'lucide-react';
import { axiosInstance } from '../../../utils/axiosInstance';
import { useParams } from 'react-router-dom';

interface COAttainment {
  co_id: number;
  co_code: string;
  description: string;
  percent_above_60: string;
  attainment_level: number;
}

interface POMatrix {
  po_code: string;
  weight: string;
}

export const COPOAttainmentReport: React.FC = () => {
  const { mapping_id } = useParams<{ mapping_id: string }>();
  const activeMappingId = mapping_id || 'mock-mapping-id';

  const [coData, setCoData] = useState<COAttainment[]>([]);
  const [poData, setPoData] = useState<POMatrix[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttainment = async () => {
    try {
      const response = await axiosInstance.get(`/faculty/analytics/copo-attainment/${activeMappingId}`);
      if (response.data.success) {
        setCoData(response.data.data.coAttainment || []);
        setPoData(response.data.data.poMatrix || []);
        setIsLoaded(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading CO-PO attainment data.');
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchAttainment();
    return () => { isMounted = false; };
  }, [activeMappingId]);

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 w-full max-w-7xl mx-auto p-6">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart2 className="text-indigo-600" size={28} />
            CO-PO Attainment Report
          </h1>
          <p className="text-sm text-gray-500">NBA/NAAC Accreditation Analytics based on final student performance.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer print:hidden"
        >
          <Download size={18} />
          Export Academic Report
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3 shadow-sm print:hidden">
          <AlertTriangle size={20} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {isLoaded && (
        <div className="flex flex-col gap-10">
          
          {/* CO Attainment Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <Hash className="text-gray-400" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Course Outcome (CO) Attainment</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">CO Code</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-48">% Students &gt; 60%</th>
                    <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-48">Attainment Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coData.map((co) => (
                    <tr key={co.co_id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm font-bold text-indigo-700 font-mono">{co.co_code}</td>
                      <td className="py-4 px-6 text-sm text-gray-700">{co.description}</td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">{co.percent_above_60}%</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shadow-sm ${
                          co.attainment_level === 3 ? 'bg-green-100 text-green-800 border border-green-200' :
                          co.attainment_level === 2 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {co.attainment_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {coData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-sm text-gray-500 text-center">No Course Outcomes mapped for this subject.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PO Matrix Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <BarChart2 className="text-gray-400" size={20} />
              <h2 className="text-lg font-bold text-gray-800">Program Outcome (PO) Matrix Mapping</h2>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Matrix</th>
                      {poData.map(po => (
                        <th key={po.po_code} className="py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider border-r border-gray-200 last:border-0">
                          {po.po_code}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50 border-r border-gray-200 text-left">
                        Final Weight
                      </td>
                      {poData.map(po => (
                        <td key={po.po_code} className="py-4 px-4 border-r border-gray-200 last:border-0">
                          {po.weight === '-' ? (
                            <span className="text-gray-300">-</span>
                          ) : (
                            <span className="text-sm font-bold text-indigo-700">{po.weight}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-100 border border-green-200"></span> Level 3 (High)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></span> Level 2 (Medium)
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-100 border border-red-200"></span> Level 1 (Low)
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
