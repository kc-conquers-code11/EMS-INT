import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface Subject {
  subject_id: string;
  subject_name: string;
  subject_code?: string;
  programm_id?: string;
}

interface CO {
  co_id: string;
  co_code: string;
}

interface PO {
  po_id: string;
  po_code: string;
}

export const CoPoMapping: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [cos, setCOs] = useState<CO[]>([]);
  const [pos, setPOs] = useState<PO[]>([]);
  const [mapping, setMapping] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      loadMatrixData();
    } else {
      setCOs([]);
      setPOs([]);
      setMapping({});
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/faculty-subject-mappings/my-subjects');
      const subjectsData = res.data.data.map((item: any) => item.subject || item);
      setSubjects(subjectsData);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
      try {
        const fallbackRes = await api.get('/subjects');
        setSubjects(fallbackRes.data.data || []);
      } catch (fallbackErr) {}
    }
  };

  const loadMatrixData = async () => {
    setLoading(true);
    try {
      const selected = subjects.find(s => String(s.subject_id) === String(selectedSubject));
      const programm_id = selected?.programm_id || '1'; // fallback

      const [coRes, poRes, mapRes] = await Promise.all([
        api.get(`/course-outcomes/subject/${selectedSubject}`),
        api.get(`/programme-outcomes/programme/${programm_id}`).catch(() => ({ data: { data: [] } })),
        api.get(`/co-po-mappings/subject/${selectedSubject}`)
      ]);

      const fetchedCOs = coRes.data.data || [];
      const fetchedPOs = poRes.data.data || [];
      const fetchedMaps = mapRes.data.data || [];

      // If POs are empty, provide fallback so matrix can render
      const actualPOs = fetchedPOs.length > 0 ? fetchedPOs : Array.from({length: 12}).map((_, i) => ({ po_id: `fake-${i+1}`, po_code: `PO${i+1}` }));

      setCOs(fetchedCOs);
      setPOs(actualPOs);

      const newMap: Record<string, Record<string, boolean>> = {};
      fetchedCOs.forEach((co: CO) => {
        newMap[co.co_id] = {};
        actualPOs.forEach((po: PO) => {
          // Check if mapping exists in DB
          const isMapped = fetchedMaps.some((m: any) => String(m.co_id) === String(co.co_id) && String(m.po_id) === String(po.po_id) && m.correlation_level);
          newMap[co.co_id][po.po_id] = isMapped;
        });
      });
      setMapping(newMap);
    } catch (err) {
      console.error('Failed to load matrix data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (co_id: string, po_id: string) => {
    setMapping(prev => ({
      ...prev,
      [co_id]: {
        ...prev[co_id],
        [po_id]: !prev[co_id][po_id]
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedSubject) return;
    setSaving(true);
    try {
      const payload: any[] = [];
      Object.keys(mapping).forEach(co_id => {
        Object.keys(mapping[co_id]).forEach(po_id => {
          // Skip fallback PO IDs saving to DB to avoid errors, 
          // or assume backend will handle it. We only map actual DB IDs if possible.
          if (!String(po_id).startsWith('fake-')) {
             payload.push({
               co_id,
               po_id,
               correlation_level: mapping[co_id][po_id]
             });
          }
        });
      });

      if (payload.length > 0) {
        await api.post('/co-po-mappings', { mappings: payload });
        alert('Mapping Saved!');
      } else {
        alert('No mappings to save or POs not properly defined in the system.');
      }
    } catch (err: any) {
      console.error('Failed to save mapping:', err);
      alert('Failed to save mapping: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-100 rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">CO-PO Mapping Matrix</h2>
            <p className="text-sm text-gray-500 mt-1">Map your Course Outcomes (COs) to Program Outcomes (POs)</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving || !selectedSubject || cos.length === 0}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 py-2 rounded shadow text-sm font-medium transition-colors"
          >
            {saving ? 'Saving...' : 'Save Mapping'}
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex gap-4 items-end max-w-md">
             <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                >
                    <option value="">-- Select Subject --</option>
                    {subjects.map(s => (
                      <option key={s.subject_id} value={s.subject_id}>
                        {s.subject_code ? `[${s.subject_code}] ` : ''}{s.subject_name}
                      </option>
                    ))}
                </select>
             </div>
          </div>

          {!selectedSubject ? (
             <div className="text-center py-12 bg-gray-50 rounded border border-dashed border-gray-300">
               <p className="text-gray-500 font-medium">Please select a subject to manage mappings.</p>
             </div>
          ) : loading ? (
             <div className="text-center py-12">
               <p className="text-gray-500 font-medium">Loading matrix...</p>
             </div>
          ) : cos.length === 0 ? (
             <div className="text-center py-12 bg-gray-50 rounded border border-dashed border-gray-300">
               <p className="text-gray-500 font-medium">No Course Outcomes defined for this subject. Define COs first.</p>
             </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 border-r border-gray-200 text-sm font-semibold text-gray-600 bg-gray-100">
                      CO \ PO
                    </th>
                    {pos.map(po => (
                      <th key={po.po_id} className="px-4 py-3 border-r border-gray-200 text-sm font-semibold text-gray-600 bg-gray-100 min-w-[60px]">
                        {po.po_code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cos.map(co => (
                    <tr key={co.co_id} className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 border-r border-gray-200 text-sm font-semibold text-gray-800 bg-gray-50">
                        {co.co_code}
                      </td>
                      {pos.map(po => (
                        <td key={po.po_id} className="px-4 py-3 border-r border-gray-200">
                          <label className="flex items-center justify-center cursor-pointer w-full h-full min-h-[24px]">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                              checked={mapping[co.co_id]?.[po.po_id] || false}
                              onChange={() => handleToggle(co.co_id, po.po_id)}
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoPoMapping;
