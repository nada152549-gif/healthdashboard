import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { ScreeningRecord } from '../types';
import { TrendingUp, Cigarette, Wine, Dumbbell, Flame, CheckCircle2 } from 'lucide-react';

interface HealthTrendBehaviorSectionProps {
  records: ScreeningRecord[];
}

export const HealthTrendBehaviorSection: React.FC<HealthTrendBehaviorSectionProps> = ({ records }) => {
  // 1. Health Trend: Group by month
  const monthMap: Record<string, { count: number; totalRiskScore: number; highRiskCount: number; avgBmi: number; totalBmi: number }> = {};

  records.forEach((r) => {
    const m = r.month || '2026-01';
    if (!monthMap[m]) {
      monthMap[m] = { count: 0, totalRiskScore: 0, highRiskCount: 0, avgBmi: 0, totalBmi: 0 };
    }
    monthMap[m].count++;
    monthMap[m].totalRiskScore += r.riskScore;
    monthMap[m].totalBmi += r.bmi;
    if (r.riskLevel === 'สูง') {
      monthMap[m].highRiskCount++;
    }
  });

  const monthLabels: Record<string, string> = {
    '2026-01': 'ม.ค. 2569',
    '2026-02': 'ก.พ. 2569',
    '2026-03': 'มี.ค. 2569',
    '2026-09': 'ก.ย. 2569',
  };

  const trendData = Object.keys(monthMap).sort().map((m) => {
    const d = monthMap[m];
    return {
      monthKey: m,
      monthName: monthLabels[m] || m,
      'จำนวนผู้คัดกรอง': d.count,
      'คะแนนเสี่ยงเฉลี่ย': +(d.totalRiskScore / d.count).toFixed(2),
      'ผู้มีความเสี่ยงสูง': d.highRiskCount,
      'BMI เฉลี่ย': +(d.totalBmi / d.count).toFixed(1),
    };
  });

  // 2. Health Behavior: Smoking, Alcohol, Exercise distribution
  const smokingStats = {
    'สูบ': records.filter((r) => r.smoking === 'สูบ').length,
    'ไม่สูบ': records.filter((r) => r.smoking !== 'สูบ').length,
  };

  const alcoholStats = {
    'ดื่ม': records.filter((r) => r.alcohol === 'ดื่ม').length,
    'ไม่ดื่ม': records.filter((r) => r.alcohol !== 'ดื่ม').length,
  };

  const exerciseStats = {
    'สม่ำเสมอ': records.filter((r) => r.exercise.includes('สม่ำเสมอ')).length,
    'บางครั้ง': records.filter((r) => r.exercise.includes('บางครั้ง')).length,
    'ไม่ออกกำลังกาย': records.filter((r) => r.exercise.includes('ไม่ออกกำลังกาย')).length,
  };

  // 3. พฤติกรรมกับระดับความเสี่ยง (Behavior vs Risk Level)
  // Compare risk levels across behavior profiles:
  const behaviorComparison = [
    {
      name: 'ผู้สูบบุหรี่',
      total: smokingStats['สูบ'],
      'เสี่ยงสูง': records.filter((r) => r.smoking === 'สูบ' && r.riskLevel === 'สูง').length,
      'เสี่ยงปานกลาง': records.filter((r) => r.smoking === 'สูบ' && r.riskLevel === 'ปานกลาง').length,
      'เสี่ยงต่ำ': records.filter((r) => r.smoking === 'สูบ' && r.riskLevel === 'ต่ำ').length,
    },
    {
      name: 'ผู้ไม่สูบบุหรี่',
      total: smokingStats['ไม่สูบ'],
      'เสี่ยงสูง': records.filter((r) => r.smoking !== 'สูบ' && r.riskLevel === 'สูง').length,
      'เสี่ยงปานกลาง': records.filter((r) => r.smoking !== 'สูบ' && r.riskLevel === 'ปานกลาง').length,
      'เสี่ยงต่ำ': records.filter((r) => r.smoking !== 'สูบ' && r.riskLevel === 'ต่ำ').length,
    },
    {
      name: 'ผู้ดื่มแอลกอฮอล์',
      total: alcoholStats['ดื่ม'],
      'เสี่ยงสูง': records.filter((r) => r.alcohol === 'ดื่ม' && r.riskLevel === 'สูง').length,
      'เสี่ยงปานกลาง': records.filter((r) => r.alcohol === 'ดื่ม' && r.riskLevel === 'ปานกลาง').length,
      'เสี่ยงต่ำ': records.filter((r) => r.alcohol === 'ดื่ม' && r.riskLevel === 'ต่ำ').length,
    },
    {
      name: 'ผู้ไม่ออกกำลังกาย',
      total: exerciseStats['ไม่ออกกำลังกาย'],
      'เสี่ยงสูง': records.filter((r) => r.exercise.includes('ไม่ออกกำลังกาย') && r.riskLevel === 'สูง').length,
      'เสี่ยงปานกลาง': records.filter((r) => r.exercise.includes('ไม่ออกกำลังกาย') && r.riskLevel === 'ปานกลาง').length,
      'เสี่ยงต่ำ': records.filter((r) => r.exercise.includes('ไม่ออกกำลังกาย') && r.riskLevel === 'ต่ำ').length,
    },
    {
      name: 'ออกกำลังกายสม่ำเสมอ',
      total: exerciseStats['สม่ำเสมอ'],
      'เสี่ยงสูง': records.filter((r) => r.exercise.includes('สม่ำเสมอ') && r.riskLevel === 'สูง').length,
      'เสี่ยงปานกลาง': records.filter((r) => r.exercise.includes('สม่ำเสมอ') && r.riskLevel === 'ปานกลาง').length,
      'เสี่ยงต่ำ': records.filter((r) => r.exercise.includes('สม่ำเสมอ') && r.riskLevel === 'ต่ำ').length,
    },
  ];

  // 4. BMI ตามพฤติกรรมการออกกำลังกาย
  const exerciseBmiData = [
    {
      category: 'สม่ำเสมอ',
      count: exerciseStats['สม่ำเสมอ'],
      avgBmi: +(
        records.filter((r) => r.exercise.includes('สม่ำเสมอ')).reduce((acc, c) => acc + c.bmi, 0) /
        (exerciseStats['สม่ำเสมอ'] || 1)
      ).toFixed(1),
    },
    {
      category: 'บางครั้ง',
      count: exerciseStats['บางครั้ง'],
      avgBmi: +(
        records.filter((r) => r.exercise.includes('บางครั้ง')).reduce((acc, c) => acc + c.bmi, 0) /
        (exerciseStats['บางครั้ง'] || 1)
      ).toFixed(1),
    },
    {
      category: 'ไม่ออกกำลังกาย',
      count: exerciseStats['ไม่ออกกำลังกาย'],
      avgBmi: +(
        records.filter((r) => r.exercise.includes('ไม่ออกกำลังกาย')).reduce((acc, c) => acc + c.bmi, 0) /
        (exerciseStats['ไม่ออกกำลังกาย'] || 1)
      ).toFixed(1),
    },
  ];

  return (
    <section id="section-health-trend-behavior" className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-6 rounded-full bg-[#0288D1]" />
        <div>
          <h2 className="text-lg font-bold text-[#4E342E]">
            Health Trend & Behavior: แนวโน้มตามช่วงเวลาและพฤติกรรมสุขภาพ
          </h2>
          <p className="text-xs text-[#8D6E63]">
            การเปลี่ยนแปลงตามเดือนที่คัดกรอง และความสัมพันธ์ระหว่างพฤติกรรมเสี่ยงกับระดับความรุนแรง
          </p>
        </div>
      </div>

      {/* Row 1: Health Trend Line Chart */}
      <div className="bg-white/95 rounded-2xl border border-[#E8DED8] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#4E342E] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#0288D1]" />
              แนวโน้มการคัดกรองและคะแนนความเสี่ยงรายเดือน (Health Trend)
            </h3>
            <p className="text-xs text-[#8D6E63]">
              จำนวนผู้รับการตรวจคัดกรอง และคะแนนความเสี่ยงเฉลี่ยตามเดือน
            </p>
          </div>
          <span className="text-xs bg-[#E1F5FE] text-[#0277BD] px-3 py-1 rounded-full font-medium border border-[#B3E5FC] self-start">
            แกนคู่: จำนวนผู้คัดกรอง & คะแนนความเสี่ยงเฉลี่ย
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE6" vertical={false} />
              <XAxis dataKey="monthName" stroke="#8D6E63" fontSize={12} tickLine={false} />
              <YAxis yAxisId="left" stroke="#0288D1" fontSize={12} tickLine={false} label={{ value: 'คน', position: 'insideTopLeft', offset: -10 }} />
              <YAxis yAxisId="right" orientation="right" stroke="#EF5350" fontSize={12} tickLine={false} domain={[0, 7]} label={{ value: 'คะแนน', position: 'insideTopRight', offset: -10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FAF7F5', borderRadius: '12px', border: '1px solid #E0D7D2', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line yAxisId="left" type="monotone" dataKey="จำนวนผู้คัดกรอง" stroke="#0288D1" strokeWidth={3} dot={{ r: 5, fill: '#0288D1' }} activeDot={{ r: 7 }} />
              <Line yAxisId="left" type="monotone" dataKey="ผู้มีความเสี่ยงสูง" stroke="#EF5350" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 4, fill: '#EF5350' }} />
              <Line yAxisId="right" type="monotone" dataKey="คะแนนเสี่ยงเฉลี่ย" stroke="#FF9800" strokeWidth={3} dot={{ r: 5, fill: '#FF9800' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Health Behavior Summary Cards & Behavior vs Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Behavior Stats Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white/95 rounded-2xl border border-[#E8DED8] p-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#4E342E] mb-3 flex items-center gap-1.5">
              <Cigarette className="w-4 h-4 text-[#8D6E63]" />
              สถิติการสูบบุหรี่
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6D4C41]">สูบบุหรี่:</span>
                <strong className="text-[#D32F2F]">{smokingStats['สูบ']} ราย ({Math.round((smokingStats['สูบ'] / (records.length || 1)) * 100)}%)</strong>
              </div>
              <div className="w-full bg-[#EFEBE9] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#EF5350] h-2 rounded-full transition-all"
                  style={{ width: `${(smokingStats['สูบ'] / (records.length || 1)) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#8D6E63]">
                <span>ไม่สูบ: {smokingStats['ไม่สูบ']} ราย</span>
                <span>สูบเป็นประจำ/บางโอกาส</span>
              </div>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl border border-[#E8DED8] p-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#4E342E] mb-3 flex items-center gap-1.5">
              <Wine className="w-4 h-4 text-[#8D6E63]" />
              สถิติการดื่มแอลกอฮอล์
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6D4C41]">ดื่มแอลกอฮอล์:</span>
                <strong className="text-[#E65100]">{alcoholStats['ดื่ม']} ราย ({Math.round((alcoholStats['ดื่ม'] / (records.length || 1)) * 100)}%)</strong>
              </div>
              <div className="w-full bg-[#EFEBE9] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-[#FFB74D] h-2 rounded-full transition-all"
                  style={{ width: `${(alcoholStats['ดื่ม'] / (records.length || 1)) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#8D6E63]">
                <span>ไม่ดื่ม: {alcoholStats['ไม่ดื่ม']} ราย</span>
                <span>ดื่มสังสรรค์/เป็นประจำ</span>
              </div>
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl border border-[#E8DED8] p-4 shadow-xs">
            <h3 className="text-sm font-bold text-[#4E342E] mb-3 flex items-center gap-1.5">
              <Dumbbell className="w-4 h-4 text-[#0288D1]" />
              ระดับการออกกำลังกาย
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#2E7D32]">สม่ำเสมอ:</span>
                <strong>{exerciseStats['สม่ำเสมอ']} ราย</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#F57F17]">บางครั้ง:</span>
                <strong>{exerciseStats['บางครั้ง']} ราย</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#C62828]">ไม่ออกกำลังกาย:</span>
                <strong className="text-[#C62828]">{exerciseStats['ไม่ออกกำลังกาย']} ราย</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Behavior vs Risk Level Stacked Bar Chart */}
        <div className="lg:col-span-8 bg-white/95 rounded-2xl border border-[#E8DED8] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#4E342E] flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#EF5350]" />
                พฤติกรรมกับระดับความเสี่ยง (Behavior vs Risk Level)
              </h3>
              <span className="text-[11px] text-[#0277BD] bg-[#E1F5FE] px-2 py-0.5 rounded-md border border-[#B3E5FC]">
                วิเคราะห์ปัจจัยเสี่ยง
              </span>
            </div>
            <p className="text-xs text-[#8D6E63] mb-4">
              เปรียบเทียบสัดส่วนระดับความเสี่ยง (ต่ำ, ปานกลาง, สูง) ในกลุ่มที่มีพฤติกรรมสุขภาพต่างกัน
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={behaviorComparison} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#8D6E63" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8D6E63" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FAF7F5', borderRadius: '12px', border: '1px solid #E0D7D2', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                  <Bar dataKey="เสี่ยงสูง" stackId="b" fill="#EF5350" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="เสี่ยงปานกลาง" stackId="b" fill="#FFB74D" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="เสี่ยงต่ำ" stackId="b" fill="#81D4FA" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#F5EBE6] text-xs text-[#6D4C41] flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <strong>ข้อสังเกต:</strong> กลุ่มที่ออกกำลังกายสม่ำเสมอส่วนใหญ่มีความเสี่ยงต่ำ (0-1 คะแนน)
            </span>
            <span className="text-[#C62828] font-medium">
              กลุ่มไม่ออกกำลังกาย + สูบ/ดื่ม มีความเสี่ยงสูงถึง 80%+
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
