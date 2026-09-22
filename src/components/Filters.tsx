import React from 'react';
import { Filter, RotateCcw, Search, MapPin, Users, Calendar, AlertOctagon, HeartCrack } from 'lucide-react';
import { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onChangeFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  availableAreas: string[];
  availableMonths: string[];
  totalRecordsCount: number;
  filteredCount: number;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onChangeFilter,
  onResetFilters,
  availableAreas,
  availableMonths,
  totalRecordsCount,
  filteredCount,
}) => {
  const isFiltered =
    filters.area !== 'ทั้งหมด' ||
    filters.gender !== 'ทั้งหมด' ||
    filters.ageGroup !== 'ทั้งหมด' ||
    filters.month !== 'ทั้งหมด' ||
    filters.riskLevel !== 'ทั้งหมด' ||
    filters.searchQuery !== '' ||
    filters.highRiskOnly;

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#E8DED8] p-4 sm:p-5 shadow-xs space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0EAE6]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#E0F2FE] text-[#0288D1]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#4E342E]">ตัวกรองข้อมูลการคัดกรอง</h2>
            <p className="text-xs text-[#8D6E63]">
              แสดง <strong className="text-[#0288D1]">{filteredCount}</strong> จากทั้งหมด {totalRecordsCount} ราย
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick High Risk Toggle Button */}
          <button
            id="toggle-high-risk-only"
            type="button"
            onClick={() => onChangeFilter('highRiskOnly', !filters.highRiskOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              filters.highRiskOnly
                ? 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2] shadow-xs'
                : 'bg-[#FAF7F5] text-[#6D4C41] border-[#E8DED8] hover:bg-[#F5EBE6]'
            }`}
          >
            <HeartCrack className={`w-3.5 h-3.5 ${filters.highRiskOnly ? 'text-[#D32F2F]' : 'text-[#8D6E63]'}`} />
            <span>เฉพาะกลุ่มเสี่ยงสูง</span>
          </button>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              id="btn-reset-filters"
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#795548] hover:text-[#3E2723] hover:bg-[#EFEBE9] border border-[#D7CCC8] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. พื้นที่ (Area) */}
        <div className="space-y-1">
          <label htmlFor="filter-area" className="flex items-center gap-1 text-[11px] font-medium text-[#6D4C41]">
            <MapPin className="w-3 h-3 text-[#0288D1]" />
            1. พื้นที่
          </label>
          <select
            id="filter-area"
            value={filters.area}
            onChange={(e) => onChangeFilter('area', e.target.value)}
            className="w-full text-xs rounded-xl bg-[#FAF7F5] border border-[#E0D7D2] px-2.5 py-2 text-[#4E342E] focus:outline-hidden focus:ring-2 focus:ring-[#81D4FA] transition-all cursor-pointer"
          >
            <option value="ทั้งหมด">ทั้งหมด (ทุกพื้นที่)</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* 2. เพศ (Gender) */}
        <div className="space-y-1">
          <label htmlFor="filter-gender" className="flex items-center gap-1 text-[11px] font-medium text-[#6D4C41]">
            <Users className="w-3 h-3 text-[#0288D1]" />
            2. เพศ
          </label>
          <select
            id="filter-gender"
            value={filters.gender}
            onChange={(e) => onChangeFilter('gender', e.target.value)}
            className="w-full text-xs rounded-xl bg-[#FAF7F5] border border-[#E0D7D2] px-2.5 py-2 text-[#4E342E] focus:outline-hidden focus:ring-2 focus:ring-[#81D4FA] transition-all cursor-pointer"
          >
            <option value="ทั้งหมด">ทั้งหมด (ชาย/หญิง)</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
        </div>

        {/* 3. ช่วงอายุ (Age Group) */}
        <div className="space-y-1">
          <label htmlFor="filter-age-group" className="flex items-center gap-1 text-[11px] font-medium text-[#6D4C41]">
            <Users className="w-3 h-3 text-[#0288D1]" />
            3. ช่วงอายุ
          </label>
          <select
            id="filter-age-group"
            value={filters.ageGroup}
            onChange={(e) => onChangeFilter('ageGroup', e.target.value)}
            className="w-full text-xs rounded-xl bg-[#FAF7F5] border border-[#E0D7D2] px-2.5 py-2 text-[#4E342E] focus:outline-hidden focus:ring-2 focus:ring-[#81D4FA] transition-all cursor-pointer"
          >
            <option value="ทั้งหมด">ทุกช่วงอายุ</option>
            <option value="< 30">ต่ำกว่า 30 ปี</option>
            <option value="30-44">30 - 44 ปี</option>
            <option value="45-59">45 - 59 ปี</option>
            <option value="60+">60 ปีขึ้นไป</option>
          </select>
        </div>

        {/* 4. เดือนที่คัดกรอง (Month) */}
        <div className="space-y-1">
          <label htmlFor="filter-month" className="flex items-center gap-1 text-[11px] font-medium text-[#6D4C41]">
            <Calendar className="w-3 h-3 text-[#0288D1]" />
            4. เดือน / วันที่คัดกรอง
          </label>
          <select
            id="filter-month"
            value={filters.month}
            onChange={(e) => onChangeFilter('month', e.target.value)}
            className="w-full text-xs rounded-xl bg-[#FAF7F5] border border-[#E0D7D2] px-2.5 py-2 text-[#4E342E] focus:outline-hidden focus:ring-2 focus:ring-[#81D4FA] transition-all cursor-pointer"
          >
            <option value="ทั้งหมด">ทุกเดือน</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* 5. ระดับความเสี่ยง (Risk Level) */}
        <div className="space-y-1">
          <label htmlFor="filter-risk-level" className="flex items-center gap-1 text-[11px] font-medium text-[#6D4C41]">
            <AlertOctagon className="w-3 h-3 text-[#E53935]" />
            5. ระดับความเสี่ยง
          </label>
          <select
            id="filter-risk-level"
            value={filters.riskLevel}
            onChange={(e) => onChangeFilter('riskLevel', e.target.value)}
            className="w-full text-xs rounded-xl bg-[#FAF7F5] border border-[#E0D7D2] px-2.5 py-2 text-[#4E342E] focus:outline-hidden focus:ring-2 focus:ring-[#81D4FA] transition-all cursor-pointer"
          >
            <option value="ทั้งหมด">ทุกระดับความเสี่ยง</option>
            <option value="ต่ำ">ความเสี่ยงต่ำ</option>
            <option value="ปานกลาง">ความเสี่ยงปานกลาง</option>
            <option value="สูง">ความเสี่ยงสูง</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="space-y-1">
          <label htmlFor="filter-search" className="flex items-center gap-1 text-[11px] font-medium text-[#6D4C41]">
            <Search className="w-3 h-3 text-[#0288D1]" />
            ค้นหารหัสบุคคล / ข้อความ
          </label>
          <div className="relative">
            <input
              id="filter-search"
              type="text"
              placeholder="เช่น H0001, เหนือ..."
              value={filters.searchQuery}
              onChange={(e) => onChangeFilter('searchQuery', e.target.value)}
              className="w-full text-xs rounded-xl bg-[#FAF7F5] border border-[#E0D7D2] pl-8 pr-2.5 py-2 text-[#4E342E] placeholder-[#A1887F] focus:outline-hidden focus:ring-2 focus:ring-[#81D4FA] transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#A1887F] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};
