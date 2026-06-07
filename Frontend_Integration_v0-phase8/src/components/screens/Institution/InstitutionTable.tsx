import type { Institution } from '../../../types/institution';

interface Props {
    data: Institution[];
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const InstitutionTable = ({ data, onView, onEdit, onDelete }: Props) => {
    return (
        <div className="w-full overflow-x-auto border rounded-lg">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider">Institution Name</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider">Established Year</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider">Institution Code</th>
                        <th className="px-8 py-5 text-[12px] font-bold uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                            <td className="px-8 py-6 text-[15px] font-medium">{item.institutionName}</td>
                            <td className="px-8 py-6 text-[15px] font-medium">{item.establishmentYear}</td>
                            <td className="px-8 py-6 text-[15px] font-medium">{item.institutionCode}</td>
                            <td className="px-8 py-6 text-[15px] font-medium flex space-x-3">
                                <button onClick={() => onView(item.id)} className="text-gray-500 hover:text-blue-600">👁️</button>
                                <button onClick={() => onEdit(item.id)} className="text-gray-500 hover:text-blue-600">✏️</button>
                                <button onClick={() => onDelete(item.id)} className="text-gray-500 hover:text-red-600">🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};