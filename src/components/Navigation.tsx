import React from 'react';
import { LayoutDashboard, AlertTriangle, TrendingUp, ScatterChart, Table2, ShieldAlert } from 'lucide-react';

export type NavTabId = 'overview' | 'risk' | 'trend-behavior' | 'correlations' | 'details';

interface NavigationProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  highRiskCount: number;
  filteredCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  highRiskCount,
  filteredCount,
}) => {
  const tabs = [
    {
      id: 'overview' as NavTabId,
      label: 'ภาพรวมสถิติ (KPI)',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'risk' as NavTabId,
      label: 'วิเคราะห์ความเสี่ยง',
      icon: AlertTriangle,
      badge: highRiskCount > 0 ? `${highRiskCount} รายเสี่ยงสูง` : null,
      badgeColor: 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]',
    },
    {
      id: 'trend-behavior' as NavTabId,
      label: 'แนวโน้มและพฤติกรรม',
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'correlations' as NavTabId,
      label: 'ความสัมพันธ์เชิงลึก (BMI/น้ำตาล/ความดัน)',
      icon: ScatterChart,
      badge: null,
    },
    {
      id: 'details' as NavTabId,
      label: 'ตารางข้อมูลเชิงลึก',
      icon: Table2,
      badge: `${filteredCount} รายการ`,
      badgeColor: 'bg-[#E1F5FE] text-[#0277BD] border-[#B3E5FC]',
    },
  ];

  return (
    <nav className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E8DED8] p-1.5 shadow-xs">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#D7CCC8]/60 via-[#EFEBE9] to-[#D7CCC8]/60 text-[#4E342E] shadow-xs border border-[#BCAAA4]'
                  : 'text-[#6D4C41] hover:bg-[#F5EBE6]/70 hover:text-[#3E2723]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0288D1]' : 'text-[#8D6E63]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
                    tab.badgeColor || 'bg-[#F5EBE6] text-[#5D4037] border-[#D7CCC8]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
