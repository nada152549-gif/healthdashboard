import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchScreeningData, calculateOverviewKPIs } from './services/dataService';
import { ScreeningRecord, FilterState } from './types';
import { Header } from './components/Header';
import { Navigation, NavTabId } from './components/Navigation';
import { Filters } from './components/Filters';
import { KPICards } from './components/KPICards';
import { HealthRiskSection } from './components/HealthRiskSection';
import { HealthTrendBehaviorSection } from './components/HealthTrendBehaviorSection';
import { CorrelationSection } from './components/CorrelationSection';
import { DataTableSection } from './components/DataTableSection';
import { PatientDetailModal } from './components/PatientDetailModal';
import { CheckCircle2, Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<ScreeningRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [selectedRecord, setSelectedRecord] = useState<ScreeningRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    area: 'ทั้งหมด',
    gender: 'ทั้งหมด',
    ageGroup: 'ทั้งหมด',
    month: 'ทั้งหมด',
    riskLevel: 'ทั้งหมด',
    searchQuery: '',
    highRiskOnly: false,
  });

  // Load Data
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const result = await fetchScreeningData();
      setRecords(result.records);
      setLastUpdated(result.lastUpdated);
      if (isSilent) {
        setToastMessage('อัปเดตข้อมูลการคัดกรองล่าสุดสำเร็จ');
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch (error) {
      console.error('Failed to load screening data', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract available Areas & Months
  const availableAreas = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.area) set.add(r.area);
    });
    return Array.from(set);
  }, [records]);

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => {
      if (r.month) set.add(r.month);
    });
    return Array.from(set).sort();
  }, [records]);

  // Handle Filter Changes
  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      area: 'ทั้งหมด',
      gender: 'ทั้งหมด',
      ageGroup: 'ทั้งหมด',
      month: 'ทั้งหมด',
      riskLevel: 'ทั้งหมด',
      searchQuery: '',
      highRiskOnly: false,
    });
  };

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // 1. Area
      if (filters.area !== 'ทั้งหมด' && r.area !== filters.area) return false;

      // 2. Gender
      if (filters.gender !== 'ทั้งหมด' && r.gender !== filters.gender) return false;

      // 3. Age Group
      if (filters.ageGroup !== 'ทั้งหมด') {
        if (filters.ageGroup === '< 30' && r.age >= 30) return false;
        if (filters.ageGroup === '30-44' && (r.age < 30 || r.age > 44)) return false;
        if (filters.ageGroup === '45-59' && (r.age < 45 || r.age > 59)) return false;
        if (filters.ageGroup === '60+' && r.age < 60) return false;
      }

      // 4. Month
      if (filters.month !== 'ทั้งหมด' && r.month !== filters.month) return false;

      // 5. Risk Level
      if (filters.riskLevel !== 'ทั้งหมด' && r.riskLevel !== filters.riskLevel) return false;

      // 6. High Risk Only Toggle
      if (filters.highRiskOnly && r.riskLevel !== 'สูง') return false;

      // 7. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchId = r.id.toLowerCase().includes(query);
        const matchArea = r.area.toLowerCase().includes(query);
        const matchDate = r.date.toLowerCase().includes(query);
        if (!matchId && !matchArea && !matchDate) return false;
      }

      return true;
    });
  }, [records, filters]);

  // Overview KPIs
  const kpis = useMemo(() => calculateOverviewKPIs(filteredRecords), [filteredRecords]);

  // Overall High Risk Count
  const highRiskCount = useMemo(() => {
    return filteredRecords.filter((r) => r.riskLevel === 'สูง').length;
  }, [filteredRecords]);

  return (
    <div className="min-h-screen bg-polka text-[#5D4037] pb-16 selection:bg-[#B3E5FC] selection:text-[#01579B]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#3E2723] text-white rounded-2xl shadow-xl text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#81D4FA]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-5 sm:pt-7 space-y-6">
        {/* 1. Header & System Control */}
        <Header
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          onRefresh={() => loadData(true)}
          totalRecords={records.length}
        />

        {/* 5. Navigation Controls (Tabs & Sections) */}
        <Navigation
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          highRiskCount={highRiskCount}
          filteredCount={filteredRecords.length}
        />

        {/* Filters Bar */}
        <Filters
          filters={filters}
          onChangeFilter={handleFilterChange}
          onResetFilters={handleResetFilters}
          availableAreas={availableAreas}
          availableMonths={availableMonths}
          totalRecordsCount={records.length}
          filteredCount={filteredRecords.length}
        />

        {/* Content based on Active Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 2. KPI Cards / Summary Cards */}
            <KPICards kpis={kpis} />

            {/* Quick Teaser Grid: Health Risk + Health Trend Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white/95 rounded-2xl border border-[#E8DED8] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#4E342E]">
                    สัดส่วนผลคัดกรองเบาหวาน & ความดันโลหิตสูง
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('risk')}
                    className="text-xs text-[#0288D1] hover:underline font-medium cursor-pointer"
                  >
                    ดูวิเคราะห์เต็ม →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FFF5F5] border border-[#FFCDD2]">
                    <span className="text-[#C62828] font-semibold block">เสี่ยงเบาหวาน</span>
                    <strong className="text-2xl text-[#B71C1C] block mt-1">
                      {kpis.diabetesRiskCount} ราย
                    </strong>
                    <span className="text-[11px] text-[#C62828] block mt-0.5">
                      ({kpis.diabetesRiskPercentage}% ของกลุ่มตรวจ)
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FFF8E1] border border-[#FFE082]">
                    <span className="text-[#E65100] font-semibold block">เสี่ยงความดันโลหิตสูง</span>
                    <strong className="text-2xl text-[#E65100] block mt-1">
                      {kpis.htRiskCount} ราย
                    </strong>
                    <span className="text-[11px] text-[#E65100] block mt-0.5">
                      ({kpis.htRiskPercentage}% ของกลุ่มตรวจ)
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white/95 rounded-2xl border border-[#E8DED8] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#4E342E]">
                    พฤติกรรมสุขภาพที่ต้องเฝ้าระวัง
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('trend-behavior')}
                    className="text-xs text-[#0288D1] hover:underline font-medium cursor-pointer"
                  >
                    ดูวิเคราะห์เต็ม →
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2.5 text-xs text-center">
                  <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#E8DED8]">
                    <span className="text-[#8D6E63] text-[11px] block">สูบบุหรี่</span>
                    <strong className="text-lg text-[#3E2723] block mt-1">{kpis.smokingCount} ราย</strong>
                    <span className="text-[10px] text-[#8D6E63]">({kpis.smokingPercentage}%)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#E8DED8]">
                    <span className="text-[#8D6E63] text-[11px] block">ดื่มแอลกอฮอล์</span>
                    <strong className="text-lg text-[#3E2723] block mt-1">{kpis.alcoholCount} ราย</strong>
                    <span className="text-[10px] text-[#8D6E63]">({kpis.alcoholPercentage}%)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#E8DED8]">
                    <span className="text-[#8D6E63] text-[11px] block">ไม่ออกกำลังกาย</span>
                    <strong className="text-lg text-[#3E2723] block mt-1">{kpis.sedentaryCount} ราย</strong>
                    <span className="text-[10px] text-[#8D6E63]">({kpis.sedentaryPercentage}%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Preview of Table */}
            <DataTableSection
              records={filteredRecords}
              onSelectRecord={setSelectedRecord}
              highRiskOnly={filters.highRiskOnly}
              onToggleHighRiskOnly={(val) => handleFilterChange('highRiskOnly', val)}
            />
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="animate-in fade-in duration-200">
            {/* 3. ส่วนการวิเคราะห์ด้วยภาพ (Health Risk) */}
            <HealthRiskSection records={filteredRecords} />
          </div>
        )}

        {activeTab === 'trend-behavior' && (
          <div className="animate-in fade-in duration-200">
            {/* 3. ส่วนการวิเคราะห์ด้วยภาพ (Health Trend & Behavior) */}
            <HealthTrendBehaviorSection records={filteredRecords} />
          </div>
        )}

        {activeTab === 'correlations' && (
          <div className="animate-in fade-in duration-200">
            {/* 3. ข้อมูลเพิ่มเติม: ความสัมพันธ์ BMI กับน้ำตาล & ความดัน */}
            <CorrelationSection
              records={filteredRecords}
              onSelectRecord={setSelectedRecord}
            />
          </div>
        )}

        {activeTab === 'details' && (
          <div className="animate-in fade-in duration-200">
            {/* 4. ส่วนรายละเอียดเชิงลึก (Data Table / Detail View) */}
            <DataTableSection
              records={filteredRecords}
              onSelectRecord={setSelectedRecord}
              highRiskOnly={filters.highRiskOnly}
              onToggleHighRiskOnly={(val) => handleFilterChange('highRiskOnly', val)}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 pb-4 border-t border-[#E8DED8] text-center text-xs text-[#8D6E63] space-y-1.5">
          <p className="font-medium text-[#5D4037]">
            รายงานการคัดกรองสุขภาพ • จัดทำโดย นางสาวนาดา ระยาภักดิ์ นักศึกษาสาขาวิชาเวชระเบียน ชั้นปีที่ 3
          </p>
          <p className="text-[11px] text-[#A1887F] flex items-center justify-center gap-1">
            <span>เชื่อมโยงระบบฐานข้อมูลการคัดกรองสุขภาพอัตโนมัติ</span>
            <span>•</span>
            <span>ธีมพาสเทลน้ำตาล ฟ้า ขาว ลายจุดน่ารัก</span>
            <span>•</span>
            <span className="flex items-center gap-0.5 text-[#0288D1]">
              <Heart className="w-3 h-3 fill-current text-[#EF5350]" />
              Smart Health Screening
            </span>
          </p>
        </footer>
      </div>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  );
}
