import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface Subject {
  subject_id: string;
  subject_name: string;
  subject_code?: string;
}

interface CO {
  co_id: string;
  subject_id: string;
  co_code: string;
  description: string;
  blooms_level: string;
}

export const CourseOutcomes: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [cos, setCOs] = useState<CO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCO, setEditingCO] = useState<CO | null>(null);
  const [formData, setFormData] = useState({ co_code: '', description: '', blooms_level: 'L1 (Remember)' });

  const bloomsOptions = [
    'L1 (Remember)',
    'L2 (Understand)',
    'L3 (Apply)',
    'L4 (Analyze)',
    'L5 (Evaluate)',
    'L6 (Create)'
  ];

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchCOs(selectedSubject);
    } else {
      setCOs([]);
    }
  }, [selectedSubject]);

  const fetchSubjects = async () => {
    try {
      // Temporarily fetching all subjects or my-subjects based on backend logic
      const res = await api.get('/faculty-subject-mappings/my-subjects');
      // Assume array of subjects returned or mapped objects containing .subject
      const subjectsData = res.data.data.map((item: any) => item.subject || item);
      setSubjects(subjectsData);
    } catch (err) {
      console.error('Failed to fetch subjects:', err);
      // Fallback if my-subjects fails
      try {
        const fallbackRes = await api.get('/subjects');
        setSubjects(fallbackRes.data.data || []);
      } catch (fallbackErr) {}
    }
  };

  const fetchCOs = async (subject_id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/course-outcomes/subject/${subject_id}`);
      setCOs(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch COs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (co?: CO) => {
    if (co) {
      setEditingCO(co);
      setFormData({ co_code: co.co_code, description: co.description, blooms_level: co.blooms_level });
    } else {
      setEditingCO(null);
      setFormData({ co_code: '', description: '', blooms_level: 'L1 (Remember)' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!selectedSubject) {
      alert('Please select a subject first.');
      return;
    }
    try {
      if (editingCO) {
        await api.put(`/course-outcomes/${editingCO.co_id}`, formData);
      } else {
        await api.post('/course-outcomes', { ...formData, subject_id: selectedSubject });
      }
      setShowModal(false);
      fetchCOs(selectedSubject);
    } catch (err: any) {
      console.error('Failed to save CO:', err);
      alert('Failed to save CO: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (co_id: string) => {
    if (!confirm('Are you sure you want to delete this CO?')) return;
    try {
      await api.delete(`/course-outcomes/${co_id}`);
      fetchCOs(selectedSubject);
    } catch (err: any) {
      console.error('Failed to delete CO:', err);
      alert('Failed to delete CO: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-100 rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Define Course Outcomes (COs)</h2>
            <p className="text-sm text-gray-500 mt-1">Select your assigned subject to manage its COs</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            disabled={!selectedSubject}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded shadow text-sm font-medium transition-colors"
          >
            + Add New CO
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex gap-4 items-end">
             <div className="flex-1 max-w-md">
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
               <p className="text-gray-500 font-medium">Please select a subject to view its Course Outcomes.</p>
             </div>
          ) : loading ? (
            <p className="text-gray-500 py-4 text-center">Loading COs...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider w-24">CO Code</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider w-40">Bloom's Level</th>
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
                        <button onClick={() => handleOpenModal(co)} className="text-blue-600 hover:text-blue-800 mr-3 font-medium">Edit</button>
                        <button onClick={() => handleDelete(co.co_id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {cos.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No Course Outcomes defined for this subject. Click "Add New CO" to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingCO ? 'Edit CO' : 'Add New CO'}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CO Code</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="e.g., CO1"
                  value={formData.co_code}
                  onChange={e => setFormData({...formData, co_code: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Outcome description..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bloom's Taxonomy Level</label>
                <select 
                  className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.blooms_level}
                  onChange={e => setFormData({...formData, blooms_level: e.target.value})}
                >
                  {bloomsOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm text-sm font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseOutcomes;
