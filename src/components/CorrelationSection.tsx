import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  ReferenceLine,
  Cell
} from 'recharts';
import { ScreeningRecord } from '../types';
import { Activity, Gauge, Info, Sparkles } from 'lucide-react';

interface CorrelationSectionProps {
  records: ScreeningRecord[];
  onSelectRecord?: (record: ScreeningRecord) => void;
}

const RISK_COLORS: Record<string, string> = {
  'ต่ำ': '#81D4FA', // Sky Blue
  'ปานกลาง': '#FFB74D', // Amber/Peach
  'สูง': '#EF5350', // Coral/Red
};

export const CorrelationSection: React.FC<CorrelationSectionProps> = ({ records, onSelectRecord }) => {
  const [activeTab, setActiveTab] = useState<'glucose' | 'sbp'>('glucose');

  const scatterGlucoseData = records.map((r) => ({
    id: r.id,
    bmi: r.bmi,
    glucose: r.glucose,
    age: r.age,
    riskLevel: r.riskLevel,
    riskScore: r.riskScore,
    gender: r.gender,
    area: r.area,
    record: r,
  }));

  const scatterSbpData = records.map((r) => ({
    id: r.id,
    bmi: r.bmi,
    sbp: r.sbp,
    dbp: r.dbp,
    age: r.age,
    riskLevel: r.riskLevel,
    riskScore: r.riskScore,
    gender: r.gender,
    area: r.area,
    record: r,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-[#D7CCC8] shadow-md text-xs space-y-1">
          <div className="flex items-center justify-between gap-2 border-b border-[#F0EAE6] pb-1">
            <span className="font-bold text-[#4E342E]">{data.id} ({data.gender}, {data.age} ปี)</span>
            <span 
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
              style={{ backgroundColor: RISK_COLORS[data.riskLevel] || '#81D4FA' }}
            >
              เสี่ยง{data.riskLevel}
            </span>
          </div>
          <p className="text-[#6D4C41]">พื้นที่: {data.area}</p>
          <p className="text-[#6D4C41]">ดัชนีมวลกาย (BMI): <strong>{data.bmi} kg/m²</strong></p>
          {data.glucose !== undefined && (
            <p className="text-[#0277BD]">ระดับน้ำตาล: <strong>{data.glucose} mg/dL</strong></p>
          )}
          {data.sbp !== undefined && (
            <p className="text-[#D32F2F]">ความดันโลหิต: <strong>{data.sbp}/{data.dbp} mmHg</strong></p>
          )}
          <p className="text-[10px] text-[#8D6E63] italic">คลิกจุดเพื่อดูรายละเอียดผู้ป่วย</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="section-correlations" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 rounded-full bg-[#8D6E63]" />
          <div>
            <h2 className="text-lg font-bold text-[#4E342E]">
              ความสัมพันธ์เชิงลึก (Health Correlations & Clinical Benchmarks)
            </h2>
            <p className="text-xs text-[#8D6E63]">
              วิเคราะห์ความสัมพันธ์ระหว่างดัชนีมวลกาย (BMI) กับระดับน้ำตาลในเลือด และความดันโลหิต
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-[#FAF7F5] p-1 rounded-xl border border-[#E8DED8] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('glucose')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'glucose'
                ? 'bg-white text-[#0277BD] shadow-xs font-semibold'
                : 'text-[#6D4C41] hover:text-[#3E2723]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#0288D1]" />
            <span>BMI กับระดับน้ำตาล</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sbp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'sbp'
                ? 'bg-white text-[#D32F2F] shadow-xs font-semibold'
                : 'text-[#6D4C41] hover:text-[#3E2723]'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-[#D32F2F]" />
            <span>BMI กับความดันโลหิต</span>
          </button>
        </div>
      </div>

      {/* Main Scatter View Card */}
      <div className="bg-white/95 rounded-2xl border border-[#E8DED8] p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-[#4E342E] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF9800]" />
              {activeTab === 'glucose'
                ? 'แผนภาพการกระจาย: ความสัมพันธ์ระหว่าง BMI กับระดับน้ำตาลในเลือด (mg/dL)'
                : 'แผนภาพการกระจาย: ความสัมพันธ์ระหว่าง BMI กับความดันโลหิตตัวบน SBP (mmHg)'}
            </h3>
            <p className="text-xs text-[#8D6E63]">
              เส้นประแสดงเกณฑ์ทางการแพทย์: เกณฑ์ภาวะอ้วน BMI ≥ 25, 
              {activeTab === 'glucose' ? ' เกณฑ์สงสัยเบาหวาน ≥ 126 mg/dL' : ' เกณฑ์ความดันสูง ≥ 140 mmHg'}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-[#6D4C41]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#81D4FA]" />
              เสี่ยงต่ำ
            </span>
            <span className="flex items-center gap-1 text-[#6D4C41]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]" />
              เสี่ยงปานกลาง
            </span>
            <span className="flex items-center gap-1 text-[#6D4C41]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF5350]" />
              เสี่ยงสูง
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === 'glucose' ? (
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <XAxis 
                  type="number" 
                  dataKey="bmi" 
                  name="BMI" 
                  domain={[18, 35]} 
                  stroke="#8D6E63" 
                  fontSize={11} 
                  tickLine={false}
                  label={{ value: 'BMI (kg/m²)', position: 'insideBottom', offset: -10, fill: '#8D6E63', fontSize: 11 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="glucose" 
                  name="น้ำตาล" 
                  domain={[70, 180]} 
                  stroke="#8D6E63" 
                  fontSize={11} 
                  tickLine={false}
                  label={{ value: 'ระดับน้ำตาล (mg/dL)', angle: -90, position: 'insideLeft', fill: '#8D6E63', fontSize: 11 }}
                />
                <ZAxis type="number" range={[120, 160]} />
                <Tooltip content={<CustomTooltip />} />
                {/* Clinical Reference lines */}
                <ReferenceLine x={25} stroke="#FFB74D" strokeDasharray="3 3" label={{ value: 'BMI 25 (อ้วน)', fill: '#E65100', fontSize: 10 }} />
                <ReferenceLine y={100} stroke="#81D4FA" strokeDasharray="3 3" label={{ value: '100 ปกติ', fill: '#0277BD', fontSize: 10, position: 'right' }} />
                <ReferenceLine y={126} stroke="#EF5350" strokeDasharray="3 3" label={{ value: '126 เสี่ยงเบาหวาน', fill: '#C62828', fontSize: 10, position: 'right' }} />
                <Scatter 
                  data={scatterGlucoseData} 
                  cursor="pointer"
                  onClick={(entry: any) => {
                    const rec = entry?.record || entry?.payload?.record;
                    if (rec && onSelectRecord) onSelectRecord(rec);
                  }}
                >
                  {scatterGlucoseData.map((entry, index) => (
                    <Cell 
                      key={`cell-g-${index}`} 
                      fill={RISK_COLORS[entry.riskLevel] || '#81D4FA'} 
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            ) : (
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <XAxis 
                  type="number" 
                  dataKey="bmi" 
                  name="BMI" 
                  domain={[18, 35]} 
                  stroke="#8D6E63" 
                  fontSize={11} 
                  tickLine={false}
                  label={{ value: 'BMI (kg/m²)', position: 'insideBottom', offset: -10, fill: '#8D6E63', fontSize: 11 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="sbp" 
                  name="SBP" 
                  domain={[95, 175]} 
                  stroke="#8D6E63" 
                  fontSize={11} 
                  tickLine={false}
                  label={{ value: 'ความดันตัวบน SBP (mmHg)', angle: -90, position: 'insideLeft', fill: '#8D6E63', fontSize: 11 }}
                />
                <ZAxis type="number" range={[120, 160]} />
                <Tooltip content={<CustomTooltip />} />
                {/* Clinical Reference lines */}
                <ReferenceLine x={25} stroke="#FFB74D" strokeDasharray="3 3" label={{ value: 'BMI 25 (อ้วน)', fill: '#E65100', fontSize: 10 }} />
                <ReferenceLine y={120} stroke="#81D4FA" strokeDasharray="3 3" label={{ value: '120 ปกติ', fill: '#0277BD', fontSize: 10, position: 'right' }} />
                <ReferenceLine y={140} stroke="#EF5350" strokeDasharray="3 3" label={{ value: '140 ความดันสูง', fill: '#C62828', fontSize: 10, position: 'right' }} />
                <Scatter 
                  data={scatterSbpData} 
                  cursor="pointer"
                  onClick={(entry: any) => {
                    const rec = entry?.record || entry?.payload?.record;
                    if (rec && onSelectRecord) onSelectRecord(rec);
                  }}
                >
                  {scatterSbpData.map((entry, index) => (
                    <Cell 
                      key={`cell-s-${index}`} 
                      fill={RISK_COLORS[entry.riskLevel] || '#81D4FA'} 
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Interpretation Clinical Notes */}
        <div className="p-3 rounded-xl bg-[#FAF7F5] border border-[#E8DED8] text-xs text-[#5D4037] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#0288D1] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-[#4E342E]">ข้อค้นพบทางสถิติและเวชระเบียนคลินิก:</p>
            <p>
              • มีความสัมพันธ์เชิงบวกชัดเจน (Positive Correlation) ระหว่างค่า BMI สูง (≥ 28 kg/m²) กับระดับน้ำตาลในเลือดสะสมที่สูงเกินเกณฑ์ปกติ (≥ 126 mg/dL)
            </p>
            <p>
              • ผู้ที่มีค่า BMI เกินมาตรฐานส่วนใหญ่ มีความดันโลหิตซิสโตลิก (SBP) เกิน 140 mmHg ซึ่งจัดอยู่ในกลุ่มที่มีความเสี่ยงสูง (จุดสีแดง) ที่จำเป็นต้องได้รับการส่งต่อพบแพทย์
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
