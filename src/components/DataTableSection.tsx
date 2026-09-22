import React, { useState, useMemo } from 'react';
import { 
  Table2, 
  ArrowUpDown, 
  AlertTriangle, 
  ShieldAlert, 
  Eye, 
  Download, 
  HeartCrack,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { ScreeningRecord } from '../types';

interface DataTableSectionProps {
  records: ScreeningRecord[];
  onSelectRecord: (record: ScreeningRecord) => void;
  highRiskOnly: boolean;
  onToggleHighRiskOnly: (val: boolean) => void;
}

type SortField = 'id' | 'date' | 'area' | 'gender' | 'age' | 'bmi' | 'sbp' | 'glucose' | 'riskScore' | 'riskLevel';
type SortOrder = 'asc' | 'desc';

export const DataTableSection: React.FC<DataTableSectionProps> = ({
  records,
  onSelectRecord,
  highRiskOnly,
  onToggleHighRiskOnly,
}) => {
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [pageSize, setPageSize] = useState<number>(15);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Filter records based on highRiskOnly toggle
  const displayRecords = useMemo(() => {
    let list = highRiskOnly ? records.filter((r) => r.riskLevel === 'สูง') : records;

    // Sorting
    list = [...list].sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return list;
  }, [records, highRiskOnly, sortField, sortOrder]);

  const totalPages = Math.ceil(displayRecords.length / pageSize) || 1;
  const paginatedRecords = displayRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportFilteredCSV = () => {
    const headers = [
      'รหัสบุคคล',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'ส่วนสูง_cm',
      'น้ำหนัก_kg',
      'BMI',
      'SBP_mmHg',
      'DBP_mmHg',
      'ชีพจร_bpm',
      'น้ำตาล_mg_dL',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'เบาหวาน_คัดกรอง',
      'ความดันโลหิตสูง_คัดกรอง',
      'คะแนนความเสี่ยง',
      'ระดับความเสี่ยง',
      'เดือน'
    ];

    const rows = displayRecords.map(r => [
      r.id,
      r.date,
      r.area,
      r.gender,
      r.age,
      r.height,
      r.weight,
      r.bmi,
      r.sbp,
      r.dbp,
      r.pulse,
      r.glucose,
      r.smoking,
      r.alcohol,
      r.exercise,
      r.diabetesRisk,
      r.hypertensionRisk,
      r.riskScore,
      r.riskLevel,
      r.month
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `รายงานการคัดกรองสุขภาพ_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="section-data-table" className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 rounded-full bg-[#5D4037]" />
          <div>
            <h2 className="text-lg font-bold text-[#4E342E]">
              ตารางข้อมูลเชิงลึกและการจำแนกความเสี่ยง (Data Table & Detail View)
            </h2>
            <p className="text-xs text-[#8D6E63]">
              ใช้สีเน้นข้อมูล (Conditional Formatting) สำหรับความเสี่ยงสูง น้ำตาลเกิน และความดันผิดปกติ
            </p>
          </div>
        </div>

        {/* High Risk Toggle & CSV Download */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-high-risk-filter-toggle"
            type="button"
            onClick={() => {
              onToggleHighRiskOnly(!highRiskOnly);
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              highRiskOnly
                ? 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2] shadow-sm'
                : 'bg-white text-[#5D4037] border-[#E8DED8] hover:bg-[#FAF7F5]'
            }`}
          >
            <HeartCrack className={`w-4 h-4 ${highRiskOnly ? 'text-[#C62828]' : 'text-[#8D6E63]'}`} />
            <span>กลุ่มที่มีระดับความเสี่ยงสูง</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
              highRiskOnly ? 'bg-[#C62828] text-white' : 'bg-[#F5EBE6] text-[#6D4C41]'
            }`}>
              {records.filter((r) => r.riskLevel === 'สูง').length} ราย
            </span>
          </button>

          <button
            type="button"
            onClick={exportFilteredCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-white text-[#6D4C41] border border-[#E8DED8] hover:bg-[#FAF7F5] transition-all cursor-pointer"
            title="ส่งออกไฟล์ข้อมูลที่กรองแล้ว (CSV)"
          >
            <Download className="w-3.5 h-3.5 text-[#0288D1]" />
            <span>ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Conditional Formatting Color Legend */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-[#E8DED8] text-xs text-[#6D4C41]">
        <span className="font-semibold text-[#4E342E] flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#0288D1]" />
          เกณฑ์สีเน้นข้อมูล (Conditional Formatting):
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2] text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#EF5350]" />
          เสี่ยงสูง / น้ำตาล ≥ 126 / BP ≥ 140 / BMI ≥ 25
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF8E1] text-[#E65100] border border-[#FFE082] text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#FFB74D]" />
          เสี่ยงปานกลาง / น้ำตาล 100-125 / BP 120-139 / BMI 23-24.9
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E1F5FE] text-[#0277BD] border border-[#B3E5FC] text-[11px]">
          <span className="w-2 h-2 rounded-full bg-[#81D4FA]" />
          เสี่ยงต่ำ / ค่าปกติ
        </span>
      </div>

      {/* Main Table Container */}
      <div className="bg-white/95 rounded-2xl border border-[#E8DED8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#4E342E]">
            <thead className="bg-[#FAF7F5] border-b border-[#E8DED8] text-[11px] font-semibold text-[#6D4C41] uppercase tracking-wider">
              <tr>
                <th 
                  onClick={() => handleSort('id')} 
                  className="py-3 px-3.5 cursor-pointer hover:bg-[#F5EBE6] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>รหัสบุคคล</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A1887F]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('area')} 
                  className="py-3 px-3 cursor-pointer hover:bg-[#F5EBE6] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>พื้นที่</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A1887F]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('gender')} 
                  className="py-3 px-2.5 cursor-pointer hover:bg-[#F5EBE6] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>เพศ</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A1887F]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('age')} 
                  className="py-3 px-2.5 cursor-pointer hover:bg-[#F5EBE6] transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>อายุ</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A1887F]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('bmi')} 
                  className="py-3 px-3 cursor-pointer hover:bg-[#F5EBE6] transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>BMI (kg/m²)</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A1887F]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('sbp')} 
                  className="py-3 px-3 cursor-pointer hover:bg-[#F5EBE6] transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>BP (SBP/DBP)</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A1887F]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('glucose')} 
                  className="py-3 px-3 cursor-pointer hover:bg-[#F5EBE6] transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>น้ำตาล (mg/dL)</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A1887F]" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">คัดกรองเบาหวาน</th>
                <th className="py-3 px-3 text-center">คัดกรองความดัน</th>
                <th 
                  onClick={() => handleSort('riskScore')} 
                  className="py-3 px-3 cursor-pointer hover:bg-[#F5EBE6] transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>คะแนน</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A1887F]" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('riskLevel')} 
                  className="py-3 px-3 cursor-pointer hover:bg-[#F5EBE6] transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ระดับความเสี่ยง</span>
                    <ArrowUpDown className="w-3 h-3 text-[#A1887F]" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE6]">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-[#8D6E63]">
                    ไม่พบข้อมูลตามเงื่อนไขตัวกรอง
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => {
                  const isHighRisk = r.riskLevel === 'สูง';
                  const isModRisk = r.riskLevel === 'ปานกลาง';

                  // Conditional formatting calculations:
                  const isGlucoseHigh = r.glucose >= 126;
                  const isGlucoseBorderline = r.glucose >= 100 && r.glucose < 126;

                  const isSbpHigh = r.sbp >= 140;
                  const isSbpBorderline = r.sbp >= 120 && r.sbp < 140;

                  const isBmiObese = r.bmi >= 25;
                  const isBmiOverweight = r.bmi >= 23 && r.bmi < 25;

                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-[#FDF9F6] transition-colors ${
                        isHighRisk ? 'bg-[#FFF5F5]/60 font-medium' : ''
                      }`}
                    >
                      {/* รหัสบุคคล */}
                      <td className="py-2.5 px-3.5 font-bold text-[#3E2723]">
                        {r.id}
                        <span className="block text-[10px] font-normal text-[#8D6E63]">{r.date}</span>
                      </td>

                      {/* พื้นที่ */}
                      <td className="py-2.5 px-3 text-[#5D4037]">{r.area}</td>

                      {/* เพศ */}
                      <td className="py-2.5 px-2.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          r.gender === 'หญิง' ? 'bg-[#FCE4EC] text-[#AD1457]' : 'bg-[#E1F5FE] text-[#0277BD]'
                        }`}>
                          {r.gender}
                        </span>
                      </td>

                      {/* อายุ */}
                      <td className="py-2.5 px-2.5 text-right font-medium text-[#4E342E]">{r.age} ปี</td>

                      {/* BMI */}
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          isBmiObese
                            ? 'bg-[#FFEBEE] text-[#C62828]'
                            : isBmiOverweight
                            ? 'bg-[#FFF8E1] text-[#E65100]'
                            : 'text-[#5D4037]'
                        }`}>
                          {r.bmi.toFixed(1)}
                        </span>
                      </td>

                      {/* BP (SBP/DBP) */}
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-1.5 py-0.5 rounded font-semibold ${
                          isSbpHigh
                            ? 'bg-[#FFEBEE] text-[#C62828]'
                            : isSbpBorderline
                            ? 'bg-[#FFF8E1] text-[#E65100]'
                            : 'text-[#5D4037]'
                        }`}>
                          {r.sbp}/{r.dbp}
                        </span>
                      </td>

                      {/* Glucose */}
                      <td className="py-2.5 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded font-semibold ${
                          isGlucoseHigh
                            ? 'bg-[#FFEBEE] text-[#C62828]'
                            : isGlucoseBorderline
                            ? 'bg-[#FFF8E1] text-[#E65100]'
                            : 'text-[#2E7D32]'
                        }`}>
                          {r.glucose}
                        </span>
                      </td>

                      {/* Diabetes Risk */}
                      <td className="py-2.5 px-3 text-center">
                        {r.diabetesRisk.includes('เสี่ยง') ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">
                            <AlertTriangle className="w-3 h-3" />
                            มีแนวโน้ม/เสี่ยง
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F5E9] text-[#2E7D32]">
                            <CheckCircle className="w-3 h-3" />
                            ปกติ
                          </span>
                        )}
                      </td>

                      {/* HT Risk */}
                      <td className="py-2.5 px-3 text-center">
                        {r.hypertensionRisk.includes('เสี่ยง') ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]">
                            <AlertTriangle className="w-3 h-3" />
                            มีแนวโน้ม/เสี่ยง
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8F5E9] text-[#2E7D32]">
                            <CheckCircle className="w-3 h-3" />
                            ปกติ
                          </span>
                        )}
                      </td>

                      {/* Risk Score */}
                      <td className="py-2.5 px-3 text-center font-bold text-sm">
                        <span className={`inline-block w-6 h-6 leading-6 rounded-full text-center ${
                          isHighRisk
                            ? 'bg-[#FFCDD2] text-[#B71C1C]'
                            : isModRisk
                            ? 'bg-[#FFE082] text-[#E65100]'
                            : 'bg-[#B3E5FC] text-[#01579B]'
                        }`}>
                          {r.riskScore}
                        </span>
                      </td>

                      {/* Risk Level */}
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isHighRisk
                            ? 'bg-[#FFEBEE] text-[#B71C1C] border-[#FFCDD2]'
                            : isModRisk
                            ? 'bg-[#FFF8E1] text-[#E65100] border-[#FFE082]'
                            : 'bg-[#E1F5FE] text-[#0277BD] border-[#B3E5FC]'
                        }`}>
                          {isHighRisk && <ShieldAlert className="w-3 h-3" />}
                          เสี่ยง{r.riskLevel}
                        </span>
                      </td>

                      {/* View Action */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => onSelectRecord(r)}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg bg-[#FAF7F5] hover:bg-[#E0F2FE] text-[#0288D1] border border-[#E8DED8] transition-all cursor-pointer"
                          title="ดูรายละเอียดข้อมูลรายบุคคล"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-[#FAF7F5] border-t border-[#E8DED8] text-xs text-[#6D4C41]">
          <div className="flex items-center gap-2">
            <span>แสดงแถวต่อหน้า:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs rounded-lg bg-white border border-[#D7CCC8] px-2 py-1 text-[#4E342E]"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={35}>ทั้งหมด ({displayRecords.length})</option>
            </select>
            <span>
              หน้า {currentPage} จาก {totalPages} (รวม {displayRecords.length} รายการ)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg bg-white border border-[#D7CCC8] text-[#5D4037] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5EBE6] transition-all cursor-pointer"
            >
              ก่อนหน้า
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-lg bg-white border border-[#D7CCC8] text-[#5D4037] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F5EBE6] transition-all cursor-pointer"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
