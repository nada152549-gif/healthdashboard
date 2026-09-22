import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ScreeningRecord } from '../types';
import { AlertCircle, ShieldAlert, HeartPulse, MapPin, Users } from 'lucide-react';

interface HealthRiskSectionProps {
  records: ScreeningRecord[];
}

const RISK_COLORS: Record<string, string> = {
  'ต่ำ': '#81D4FA', // Sky Blue Pastel
  'ปานกลาง': '#FFB74D', // Amber/Peach Pastel
  'สูง': '#EF5350', // Coral/Rose Pastel
};

export const HealthRiskSection: React.FC<HealthRiskSectionProps> = ({ records }) => {
  // 1. ระดับความเสี่ยงโดยรวม (Risk Level Pie Data)
  const riskCounts: Record<string, number> = { ต่ำ: 0, ปานกลาง: 0, สูง: 0 };
  records.forEach((r) => {
    if (riskCounts[r.riskLevel] !== undefined) {
      riskCounts[r.riskLevel]++;
    } else {
      riskCounts['ต่ำ']++;
    }
  });

  const riskPieData = [
    { name: 'เสี่ยงต่ำ', rawLevel: 'ต่ำ', value: riskCounts['ต่ำ'] || 0 },
    { name: 'เสี่ยงปานกลาง', rawLevel: 'ปานกลาง', value: riskCounts['ปานกลาง'] || 0 },
    { name: 'เสี่ยงสูง', rawLevel: 'สูง', value: riskCounts['สูง'] || 0 },
  ].filter((item) => item.value > 0);

  // 2. เบาหวาน_คัดกรอง และ ความดันโลหิตสูง_คัดกรอง
  const diabetesRiskCount = records.filter((r) => r.diabetesRisk.includes('เสี่ยง')).length;
  const diabetesNormalCount = records.length - diabetesRiskCount;

  const htRiskCount = records.filter((r) => r.hypertensionRisk.includes('เสี่ยง')).length;
  const htNormalCount = records.length - htRiskCount;

  const diseaseRiskData = [
    {
      disease: 'คัดกรองเบาหวาน',
      'มีแนวโน้ม/เสี่ยง': diabetesRiskCount,
      'ปกติ/ไม่มี': diabetesNormalCount,
    },
    {
      disease: 'คัดกรองความดันโลหิตสูง',
      'มีแนวโน้ม/เสี่ยง': htRiskCount,
      'ปกติ/ไม่มี': htNormalCount,
    },
  ];

  // 3. การแจกแจงคะแนนความเสี่ยง (Risk Score 0-7)
  const scoreDistribution: Record<number, number> = {};
  for (let i = 0; i <= 7; i++) scoreDistribution[i] = 0;
  records.forEach((r) => {
    const s = Math.min(7, Math.max(0, Math.round(r.riskScore)));
    scoreDistribution[s] = (scoreDistribution[s] || 0) + 1;
  });

  const scoreData = Object.entries(scoreDistribution).map(([score, count]) => ({
    score: `คะแนน ${score}`,
    count,
    level: Number(score) >= 4 ? 'สูง' : Number(score) >= 2 ? 'ปานกลาง' : 'ต่ำ',
  }));

  // 4. กลุ่มอายุที่มีความเสี่ยงสูง
  const ageGroupRisk: Record<string, { total: number; highRisk: number; modRisk: number; lowRisk: number }> = {
    '< 30 ปี': { total: 0, highRisk: 0, modRisk: 0, lowRisk: 0 },
    '30-44 ปี': { total: 0, highRisk: 0, modRisk: 0, lowRisk: 0 },
    '45-59 ปี': { total: 0, highRisk: 0, modRisk: 0, lowRisk: 0 },
    '60+ ปี': { total: 0, highRisk: 0, modRisk: 0, lowRisk: 0 },
  };

  records.forEach((r) => {
    let group = '< 30 ปี';
    if (r.age >= 60) group = '60+ ปี';
    else if (r.age >= 45) group = '45-59 ปี';
    else if (r.age >= 30) group = '30-44 ปี';

    ageGroupRisk[group].total++;
    if (r.riskLevel === 'สูง') ageGroupRisk[group].highRisk++;
    else if (r.riskLevel === 'ปานกลาง') ageGroupRisk[group].modRisk++;
    else ageGroupRisk[group].lowRisk++;
  });

  const ageRiskData = Object.entries(ageGroupRisk).map(([group, data]) => ({
    group,
    'เสี่ยงสูง': data.highRisk,
    'เสี่ยงปานกลาง': data.modRisk,
    'เสี่ยงต่ำ': data.lowRisk,
    highRiskRate: data.total > 0 ? Math.round((data.highRisk / data.total) * 100) : 0,
  }));

  // 5. พื้นที่ที่มีผู้เสี่ยงสูง (High Risk by Area)
  const areaRiskMap: Record<string, { total: number; highRisk: number; modRisk: number; lowRisk: number }> = {};
  records.forEach((r) => {
    if (!areaRiskMap[r.area]) {
      areaRiskMap[r.area] = { total: 0, highRisk: 0, modRisk: 0, lowRisk: 0 };
    }
    areaRiskMap[r.area].total++;
    if (r.riskLevel === 'สูง') areaRiskMap[r.area].highRisk++;
    else if (r.riskLevel === 'ปานกลาง') areaRiskMap[r.area].modRisk++;
    else areaRiskMap[r.area].lowRisk++;
  });

  const areaRiskData = Object.entries(areaRiskMap)
    .map(([area, data]) => ({
      area: `พื้นที่ ${area}`,
      'ผู้มีความเสี่ยงสูง': data.highRisk,
      'ความเสี่ยงปานกลาง': data.modRisk,
      'ความเสี่ยงต่ำ': data.lowRisk,
      total: data.total,
    }))
    .sort((a, b) => b['ผู้มีความเสี่ยงสูง'] - a['ผู้มีความเสี่ยงสูง']);

  return (
    <section id="section-health-risk" className="space-y-5">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-6 rounded-full bg-[#EF5350]" />
        <div>
          <h2 className="text-lg font-bold text-[#4E342E]">
            Health Risk: การวิเคราะห์ระดับความเสี่ยงและผลคัดกรอง
          </h2>
          <p className="text-xs text-[#8D6E63]">
            ประเมินความเสี่ยงเบาหวาน, ความดันโลหิตสูง, คะแนนความเสี่ยงรายช่วงอายุ และพื้นที่
          </p>
        </div>
      </div>

      {/* Row 1: Risk Level Distribution & Disease Screening Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Risk Level Donut Chart */}
        <div className="lg:col-span-5 bg-white/95 rounded-2xl border border-[#E8DED8] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#4E342E] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#EF5350]" />
              สัดส่วนระดับความเสี่ยง (Risk Levels)
            </h3>
            <span className="text-[11px] text-[#8D6E63] bg-[#FAF7F5] px-2 py-0.5 rounded-md border border-[#E8DED8]">
              {records.length} ราย
            </span>
          </div>
          <p className="text-xs text-[#8D6E63] mb-4">
            จำแนกตามเกณฑ์คะแนนความเสี่ยงสากล (ต่ำ 0-1, ปานกลาง 2-3, สูง 4+)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskPieData.map((entry) => (
                    <Cell 
                      key={`cell-${entry.rawLevel}`} 
                      fill={RISK_COLORS[entry.rawLevel] || '#81D4FA'} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any, name: any) => [`${val} ราย`, name]}
                  contentStyle={{ backgroundColor: '#FAF7F5', borderRadius: '12px', border: '1px solid #E0D7D2', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-[#F5EBE6] text-center text-xs">
            <div className="p-2 rounded-xl bg-[#E1F5FE]/60 border border-[#B3E5FC]">
              <span className="text-[11px] text-[#0277BD] font-medium block">เสี่ยงต่ำ</span>
              <strong className="text-base text-[#01579B]">{riskCounts['ต่ำ']}</strong>
              <span className="text-[10px] text-[#0288D1] block">({Math.round((riskCounts['ต่ำ'] / (records.length || 1)) * 100)}%)</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FFF8E1]/70 border border-[#FFE082]">
              <span className="text-[11px] text-[#F57F17] font-medium block">เสี่ยงปานกลาง</span>
              <strong className="text-base text-[#E65100]">{riskCounts['ปานกลาง']}</strong>
              <span className="text-[10px] text-[#F57F17] block">({Math.round((riskCounts['ปานกลาง'] / (records.length || 1)) * 100)}%)</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FFEBEE]/70 border border-[#FFCDD2]">
              <span className="text-[11px] text-[#C62828] font-medium block">เสี่ยงสูง</span>
              <strong className="text-base text-[#B71C1C]">{riskCounts['สูง']}</strong>
              <span className="text-[10px] text-[#C62828] block">({Math.round((riskCounts['สูง'] / (records.length || 1)) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Disease Screening Comparison */}
        <div className="lg:col-span-7 bg-white/95 rounded-2xl border border-[#E8DED8] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#4E342E] flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-[#0288D1]" />
                ผลคัดกรองเบาหวาน & ความดันโลหิตสูง
              </h3>
              <span className="text-[11px] text-[#0277BD] bg-[#E1F5FE] px-2 py-0.5 rounded-md border border-[#B3E5FC]">
                เปรียบเทียบ 2 ภาวะ
              </span>
            </div>
            <p className="text-xs text-[#8D6E63] mb-4">
              สัดส่วนผู้เข้ารับการตรวจที่มีผลคัดกรอง "มีแนวโน้ม/เสี่ยง" เทียบกับกลุ่มปกติ
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={diseaseRiskData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="disease" stroke="#8D6E63" fontSize={12} tickLine={false} />
                  <YAxis stroke="#8D6E63" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FAF7F5', borderRadius: '12px', border: '1px solid #E0D7D2', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="มีแนวโน้ม/เสี่ยง" fill="#FF7043" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="ปกติ/ไม่มี" fill="#81D4FA" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#F5EBE6] text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F5] border border-[#E8DED8]">
              <span className="text-[#6D4C41]">ผู้มีแนวโน้มเสี่ยงเบาหวาน:</span>
              <strong className="text-[#D84315] font-semibold">{diabetesRiskCount} ราย ({Math.round((diabetesRiskCount / (records.length || 1)) * 100)}%)</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F5] border border-[#E8DED8]">
              <span className="text-[#6D4C41]">ผู้มีแนวโน้มเสี่ยงความดัน:</span>
              <strong className="text-[#D84315] font-semibold">{htRiskCount} ราย ({Math.round((htRiskCount / (records.length || 1)) * 100)}%)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: กลุ่มอายุที่มีความเสี่ยงสูง & พื้นที่ที่มีผู้เสี่ยงสูง */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* กลุ่มอายุที่มีความเสี่ยงสูง */}
        <div className="lg:col-span-6 bg-white/95 rounded-2xl border border-[#E8DED8] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#4E342E] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#795548]" />
              กลุ่มอายุที่มีความเสี่ยงสูง (Age Groups & Risk)
            </h3>
            <span className="text-[11px] text-[#8D6E63] bg-[#FAF7F5] px-2 py-0.5 rounded-md border border-[#E8DED8]">
              วิเคราะห์จำแนกตามวัย
            </span>
          </div>
          <p className="text-xs text-[#8D6E63] mb-4">
            แสดงจำนวนผู้มีความเสี่ยงในแต่ละช่วงอายุ (สังเกตกลุ่มอายุ 60 ปีขึ้นไปที่มีสัดส่วนเสี่ยงสูงเด่นชัด)
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageRiskData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                <XAxis dataKey="group" stroke="#8D6E63" fontSize={11} tickLine={false} />
                <YAxis stroke="#8D6E63" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FAF7F5', borderRadius: '12px', border: '1px solid #E0D7D2', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="เสี่ยงสูง" stackId="a" fill="#EF5350" radius={[0, 0, 0, 0]} />
                <Bar dataKey="เสี่ยงปานกลาง" stackId="a" fill="#FFB74D" radius={[0, 0, 0, 0]} />
                <Bar dataKey="เสี่ยงต่ำ" stackId="a" fill="#81D4FA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* พื้นที่ที่มีผู้เสี่ยงสูง */}
        <div className="lg:col-span-6 bg-white/95 rounded-2xl border border-[#E8DED8] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[#4E342E] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#0288D1]" />
              พื้นที่ที่มีผู้เสี่ยงสูง (High Risk by Area)
            </h3>
            <span className="text-[11px] text-[#0277BD] bg-[#E1F5FE] px-2 py-0.5 rounded-md border border-[#B3E5FC]">
              เรียงตามจำนวนผู้เสี่ยงสูง
            </span>
          </div>
          <p className="text-xs text-[#8D6E63] mb-4">
            จำแนกสถิติตามพื้นที่ เพื่อสนับสนุนการวางแผนลงพื้นที่คัดกรองเชิงรุก
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={areaRiskData} 
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <XAxis type="number" stroke="#8D6E63" fontSize={11} tickLine={false} />
                <YAxis dataKey="area" type="category" stroke="#8D6E63" fontSize={11} tickLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FAF7F5', borderRadius: '12px', border: '1px solid #E0D7D2', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="ผู้มีความเสี่ยงสูง" fill="#EF5350" radius={[0, 6, 6, 0]} />
                <Bar dataKey="ความเสี่ยงปานกลาง" fill="#FFB74D" radius={[0, 6, 6, 0]} />
                <Bar dataKey="ความเสี่ยงต่ำ" fill="#81D4FA" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};
