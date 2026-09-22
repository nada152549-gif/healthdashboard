import React from 'react';
import { 
  X, 
  User, 
  Activity, 
  Calendar, 
  MapPin, 
  HeartPulse, 
  AlertTriangle, 
  CheckCircle2, 
  Cigarette, 
  Wine, 
  Dumbbell, 
  Scale, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ScreeningRecord } from '../types';

interface PatientDetailModalProps {
  record: ScreeningRecord | null;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const isHighRisk = record.riskLevel === 'สูง';
  const isModRisk = record.riskLevel === 'ปานกลาง';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E8DED8] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Cute Polka Dot Accent */}
        <div className="relative bg-gradient-to-r from-[#FAF7F5] via-[#F5EBE6] to-[#E1F5FE] p-5 border-b border-[#E8DED8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#0288D1]">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#4E342E]">
                    รหัสบุคคล: {record.id}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    isHighRisk
                      ? 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]'
                      : isModRisk
                      ? 'bg-[#FFF8E1] text-[#E65100] border-[#FFE082]'
                      : 'bg-[#E1F5FE] text-[#0277BD] border-[#B3E5FC]'
                  }`}>
                    ระดับเสี่ยง{record.riskLevel} (คะแนน {record.riskScore})
                  </span>
                </div>
                <p className="text-xs text-[#6D4C41] mt-0.5 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8D6E63]" />
                    วันที่คัดกรอง: {record.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0288D1]" />
                    พื้นที่: {record.area}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#8D6E63] hover:text-[#3E2723] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* General Demographic Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#E8DED8]">
              <span className="text-[#8D6E63] block">เพศ</span>
              <strong className="text-sm text-[#4E342E]">{record.gender}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#E8DED8]">
              <span className="text-[#8D6E63] block">อายุ</span>
              <strong className="text-sm text-[#4E342E]">{record.age} ปี</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#E8DED8]">
              <span className="text-[#8D6E63] block">ส่วนสูง / น้ำหนัก</span>
              <strong className="text-sm text-[#4E342E]">{record.height} ซม. / {record.weight} กก.</strong>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#E8DED8]">
              <span className="text-[#8D6E63] block">BMI ดัชนีมวลกาย</span>
              <strong className="text-sm text-[#4E342E]">{record.bmi} kg/m²</strong>
            </div>
          </div>

          {/* Vitals & Clinical Measurements */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#4E342E] flex items-center gap-1.5 uppercase tracking-wide">
              <HeartPulse className="w-4 h-4 text-[#EF5350]" />
              ผลการวัดสัญญาณชีพและระดับน้ำตาล (Vitals & Labs)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-3.5 rounded-2xl border ${
                record.sbp >= 140 ? 'bg-[#FFEBEE]/60 border-[#FFCDD2]' : 'bg-[#FAF7F5] border-[#E8DED8]'
              }`}>
                <span className="text-[#8D6E63] block">ความดันโลหิต (BP)</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-xl font-bold ${record.sbp >= 140 ? 'text-[#C62828]' : 'text-[#3E2723]'}`}>
                    {record.sbp}/{record.dbp}
                  </span>
                  <span className="text-[11px] text-[#8D6E63]">mmHg</span>
                </div>
                <span className="text-[10px] text-[#8D6E63] block mt-1">
                  ชีพจร: {record.pulse} ครั้ง/นาที
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl border ${
                record.glucose >= 126 ? 'bg-[#FFEBEE]/60 border-[#FFCDD2]' : 'bg-[#FAF7F5] border-[#E8DED8]'
              }`}>
                <span className="text-[#8D6E63] block">ระดับน้ำตาลในเลือด</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-xl font-bold ${record.glucose >= 126 ? 'text-[#C62828]' : 'text-[#2E7D32]'}`}>
                    {record.glucose}
                  </span>
                  <span className="text-[11px] text-[#8D6E63]">mg/dL</span>
                </div>
                <span className="text-[10px] text-[#8D6E63] block mt-1">
                  {record.glucose >= 126 ? 'สูงกว่าเกณฑ์มาตรฐาน (≥126)' : 'อยู่ในเกณฑ์ปกติ'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#E8DED8]">
                <span className="text-[#8D6E63] block">คะแนนความเสี่ยงสะสม</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-xl font-bold ${
                    isHighRisk ? 'text-[#C62828]' : isModRisk ? 'text-[#E65100]' : 'text-[#0277BD]'
                  }`}>
                    {record.riskScore}
                  </span>
                  <span className="text-[11px] text-[#8D6E63]">/ 7 คะแนน</span>
                </div>
                <span className="text-[10px] text-[#8D6E63] block mt-1">
                  ระดับ: {record.riskLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Screening Diagnosis & Behaviors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Diseases */}
            <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E8DED8] space-y-2.5 text-xs">
              <h5 className="font-bold text-[#4E342E] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0288D1]" />
                ผลการคัดกรองโรคไม่ติดต่อเรื้อรัง (NCDs)
              </h5>
              <div className="flex items-center justify-between py-1 border-b border-[#F0EAE6]">
                <span className="text-[#6D4C41]">คัดกรองเบาหวาน:</span>
                <span className={`font-semibold ${record.diabetesRisk.includes('เสี่ยง') ? 'text-[#C62828]' : 'text-[#2E7D32]'}`}>
                  {record.diabetesRisk}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-[#6D4C41]">คัดกรองความดันโลหิตสูง:</span>
                <span className={`font-semibold ${record.hypertensionRisk.includes('เสี่ยง') ? 'text-[#C62828]' : 'text-[#2E7D32]'}`}>
                  {record.hypertensionRisk}
                </span>
              </div>
            </div>

            {/* Behaviors */}
            <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#E8DED8] space-y-2.5 text-xs">
              <h5 className="font-bold text-[#4E342E] flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#795548]" />
                พฤติกรรมสุขภาพ
              </h5>
              <div className="flex items-center justify-between py-1 border-b border-[#F0EAE6]">
                <span className="flex items-center gap-1 text-[#6D4C41]">
                  <Cigarette className="w-3.5 h-3.5" />
                  สูบบุหรี่:
                </span>
                <span className={`font-semibold ${record.smoking === 'สูบ' ? 'text-[#C62828]' : 'text-[#5D4037]'}`}>
                  {record.smoking}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#F0EAE6]">
                <span className="flex items-center gap-1 text-[#6D4C41]">
                  <Wine className="w-3.5 h-3.5" />
                  ดื่มแอลกอฮอล์:
                </span>
                <span className={`font-semibold ${record.alcohol === 'ดื่ม' ? 'text-[#E65100]' : 'text-[#5D4037]'}`}>
                  {record.alcohol}
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1 text-[#6D4C41]">
                  <Dumbbell className="w-3.5 h-3.5 text-[#0288D1]" />
                  การออกกำลังกาย:
                </span>
                <span className="font-semibold text-[#4E342E]">
                  {record.exercise}
                </span>
              </div>
            </div>
          </div>

          {/* Medical Records Student Recommendation */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E0F2FE]/50 to-[#F5EBE6]/60 border border-[#B3E5FC] text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#0277BD]">
              <FileText className="w-4 h-4" />
              <span>ความเห็นทางเวชระเบียนและการดูแลสุขภาพเชิงป้องกัน:</span>
            </div>
            <p className="text-[#4E342E] leading-relaxed">
              {isHighRisk
                ? `ผู้รับการตรวจมีคะแนนความเสี่ยงระดับสูง (${record.riskScore} คะแนน) มีผลคัดกรองเบาหวาน/ความดันโลหิตสูงและ BMI สูง แนะนำส่งต่อแพทย์เฉพาะทางเพื่อตรวจยืนยันทางห้องปฏิบัติการเพิ่มเติม (เช่น HbA1c) และขึ้นทะเบียนผู้ป่วยกลุ่มเสี่ยงในระบบเวชระเบียนเพื่อการติดตามผลราย 3 เดือน`
                : isModRisk
                ? `ผู้รับการตรวจอยู่ในกลุ่มความเสี่ยงปานกลาง ควรให้คำปรึกษาปรับเปลี่ยนพฤติกรรม (Lifestyle Modification) เช่น ลดการบริโภคโซเดียม/หวาน เพิ่มการออกกำลังกายสม่ำเสมอ และนัดคัดกรองซ้ำในอีก 6 เดือน`
                : `ผลการคัดกรองอยู่ในเกณฑ์ปกติและมีความเสี่ยงต่ำ แนะนำให้คงพฤติกรรมการออกกำลังกายและรับประทานอาหารเพื่อสุขภาพอย่างต่อเนื่อง นัดตรวจสุขภาพประจำปีตามเกณฑ์`}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF7F5] border-t border-[#E8DED8] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#5D4037] hover:bg-[#4E342E] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
