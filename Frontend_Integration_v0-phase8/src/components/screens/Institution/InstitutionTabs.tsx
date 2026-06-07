import { VIEW_INSTITUTION } from "../../../types/Permissions/permission.types";
import { useHasPermission } from "../../../hooks/useHasPermission";

interface Props {
    activeTab: number;
    setActiveTab: (index: number) => void;
}

export const InstitutionTabs = ({ activeTab, setActiveTab }: Props) => {
    const hasPermission = useHasPermission();

    const tabs = ['Basic Institution Details', 'Contact Information', 'COE Details',
        ...(hasPermission(VIEW_INSTITUTION) ? ['View'] : [])
    ];

    return (
        <div className="flex items-center gap-2 bg-[#f2f3fd] border border-[#e5e7fb] p-1.5 rounded-[10px] w-fit">
            {tabs.map((tab, index) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(index)}
                    className={`px-3.5 py-2.5 rounded-md text-base font-semibold transition-colors whitespace-nowrap
                        ${activeTab === index
                            ? 'bg-[#0e1680] text-[#f9fafb]'
                            : 'text-[#98a2b3] hover:text-[#687b96]'
                        }`}
                        disabled={index === 3 && !hasPermission(VIEW_INSTITUTION)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};