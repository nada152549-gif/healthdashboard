import React from 'react';
import { 
  Users, 
  Activity, 
  Gauge, 
  ArrowDownUp, 
  PieChart as PieIcon, 
  Percent, 
  AlertTriangle,
  Flame,
  Scale
} from 'lucide-react';
import { OverviewKPIs } from '../types';

interface KPICardsProps {
  kpis: OverviewKPIs;
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  return (
    <section id="section-kpi-cards" className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 rounded-full bg-[#81D4FA]" />
          <h2 className="text-lg font-bold text-[#4E342E]">
            Health Overview: สรุปข้อมูลสำคัญ 6 มิติสถิติ
          </h2>
        </div>
        <span className="text-xs font-medium text-[#8D6E63] bg-white px-3 py-1 rounded-full border border-[#E8DED8]">
          ครบถ้วน: จำนวน • ค่าเฉลี่ย • ต่ำสุด-สูงสุด • สัดส่วน • ร้อยละ
        </span>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. จำนวน (Count) */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl border border-[#E8DED8] p-4 shadow-xs hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#E0F2FE]/60 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0277BD] bg-[#E0F2FE] px-2 py-0.5 rounded-md">
              <Users className="w-3 h-3" />
              1. จำนวน
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] text-[#0288D1] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#8D6E63] font-medium">ผู้เข้ารับการคัดกรอง</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#3E2723]">
              {kpis.totalCount}
            </span>
            <span className="text-xs text-[#8D6E63] font-medium">คน</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#F5EBE6] text-[11px] text-[#6D4C41] flex items-center justify-between">
            <span>ชาย: {kpis.maleCount} คน</span>
            <span>หญิง: {kpis.femaleCount} คน</span>
          </div>
        </div>

        {/* 2. ค่าเฉลี่ย (Average) */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl border border-[#E8DED8] p-4 shadow-xs hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#F5EBE6]/80 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5D4037] bg-[#EFEBE9] px-2 py-0.5 rounded-md">
              <Activity className="w-3 h-3" />
              2. ค่าเฉลี่ย
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF7F5] text-[#6D4C41] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#8D6E63] font-medium">BMI & น้ำตาลในเลือดเฉลี่ย</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#4E342E]">
              {kpis.avgBmi}
            </span>
            <span className="text-xs text-[#8D6E63]">kg/m²</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#F5EBE6] text-[11px] text-[#6D4C41] flex items-center justify-between">
            <span>น้ำตาลเฉลี่ย: <strong>{kpis.avgGlucose}</strong> mg/dL</span>
          </div>
        </div>

        {/* 3. ค่าต่ำสุด (Minimum) */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl border border-[#E8DED8] p-4 shadow-xs hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#E8F5E9]/60 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md">
              <ArrowDownUp className="w-3 h-3" />
              3. ค่าต่ำสุด (Min)
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F1F8E9] text-[#33691E] flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#8D6E63] font-medium">ค่าน้ำตาลต่ำสุด</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#2E7D32]">
              {kpis.minGlucose}
            </span>
            <span className="text-xs text-[#8D6E63]">mg/dL</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#F5EBE6] text-[11px] text-[#6D4C41] flex items-center justify-between">
            <span>BMI ต่ำสุด: {kpis.minBmi}</span>
            <span>อายุ: {kpis.minAge} ปี</span>
          </div>
        </div>

        {/* 4. ค่าสูงสุด (Maximum) */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl border border-[#E8DED8] p-4 shadow-xs hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFEBEE]/60 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C62828] bg-[#FFEBEE] px-2 py-0.5 rounded-md">
              <Flame className="w-3 h-3" />
              4. ค่าสูงสุด (Max)
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFEBEE] text-[#D32F2F] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#8D6E63] font-medium">ค่าน้ำตาลสูงสุด</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#C62828]">
              {kpis.maxGlucose}
            </span>
            <span className="text-xs text-[#8D6E63]">mg/dL</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#F5EBE6] text-[11px] text-[#6D4C41] flex items-center justify-between">
            <span>BMI สูงสุด: {kpis.maxBmi}</span>
            <span>BP: {kpis.maxSbp} mmHg</span>
          </div>
        </div>

        {/* 5. สัดส่วน (Ratio) */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl border border-[#E8DED8] p-4 shadow-xs hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFF8E1]/70 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F57F17] bg-[#FFF8E1] px-2 py-0.5 rounded-md">
              <PieIcon className="w-3 h-3" />
              5. สัดส่วน (Ratio)
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FFFDE7] text-[#F57F17] flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#8D6E63] font-medium">สัดส่วน หญิง : ชาย</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-bold text-[#4E342E]">
              {kpis.femaleRatio}% : {kpis.maleRatio}%
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#F5EBE6] text-[11px] text-[#6D4C41] flex items-center justify-between">
            <span className="truncate">ระดับเสี่ยง: ต่ำ {kpis.lowRiskCount} | กลาง {kpis.moderateRiskCount} | สูง {kpis.highRiskCount}</span>
          </div>
        </div>

        {/* 6. ร้อยละ (Percentage) */}
        <div className="relative overflow-hidden bg-white/95 rounded-2xl border border-[#E8DED8] p-4 shadow-xs hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#F3E5F5]/60 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#7B1FA2] bg-[#F3E5F5] px-2 py-0.5 rounded-md">
              <Percent className="w-3 h-3" />
              6. ร้อยละ (%)
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xs text-[#8D6E63] font-medium">ร้อยละกลุ่มความเสี่ยงสูง</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-[#7B1FA2]">
              {kpis.highRiskPercentage}%
            </span>
            <span className="text-xs text-[#8D6E63]">({kpis.highRiskCount} ราย)</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#F5EBE6] text-[11px] text-[#6D4C41] flex items-center justify-between">
            <span>เสี่ยงเบาหวาน {kpis.diabetesRiskPercentage}%</span>
            <span>เสี่ยงความดัน {kpis.htRiskPercentage}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
