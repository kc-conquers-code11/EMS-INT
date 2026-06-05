export const BranchTabs = ({ activeTab, setActiveTab }: { activeTab: number; setActiveTab: (index: number) => void }) => {
    const tabs = ['Add Branch', 'View'];

    return (
        <div className="flex bg-[#f2f4f7] p-1 rounded-lg w-fit mb-8">
            {tabs.map((tab, index) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(index)}
                    className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                        activeTab === index
                            ? 'bg-[#0e1680] text-white shadow-sm'
                            : 'text-[#667085] hover:text-[#0e1680]'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
