//src/components/screens/TabNavigation.tsx
import { Plus } from "lucide-react";

interface TabNavigationProps {
  activeTab: "add" | "view";
  onTabChange: (tab: "add" | "view") => void;
  addLabel: string;
  viewLabel?: string;
}

export const TabNavigation = ({ 
  activeTab, 
  onTabChange, 
  addLabel, 
  viewLabel = "View Details" 
}: TabNavigationProps) => {
  return (
    <div className="flex bg-white rounded-xl shadow-sm border border-[#eaecf0] p-1.5 w-max">
      <button
        onClick={() => onTabChange("add")}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-[15px] transition-all duration-300 ${
          activeTab === "add" 
            ? "bg-[#0e1680] text-white shadow-md" 
            : "text-[#667085] hover:text-[#0e1680] hover:bg-gray-50"
        }`}
      >
        <Plus size={18} />
        {addLabel}
      </button>
      
      <button
        onClick={() => onTabChange("view")}
        className={`flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold text-[15px] transition-all duration-300 ${
          activeTab === "view" 
            ? "bg-[#0e1680] text-white shadow-md" 
            : "text-[#667085] hover:text-[#0e1680] hover:bg-gray-50"
        }`}
      >
        {viewLabel}
      </button>
    </div>
  );
};
