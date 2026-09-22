import React from 'react';
import { RefreshCw, UserCheck, ShieldCheck, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
  totalRecords: number;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isLoading,
  onRefresh,
  totalRecords,
}) => {
  const formattedTime = lastUpdated
    ? new Intl.DateTimeFormat('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }).format(lastUpdated)
    : 'กำลังโหลดข้อมูล...';

  return (
    <header className="relative overflow-hidden bg-white/90 backdrop-blur-md rounded-3xl border border-[#E8DED8] p-5 sm:p-7 shadow-sm transition-all">
      {/* Decorative Pastel Polka Dot Elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#E0F2FE]/70 pointer-events-none blur-xl" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-[#F5EBE6]/80 pointer-events-none blur-lg" />
      
      {/* Floating cute polka dot accents */}
      <div className="absolute top-4 right-20 hidden md:flex items-center gap-1.5 opacity-60 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#81D4FA]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#A1887F]" />
        <span className="w-2 h-2 rounded-full bg-[#B3E5FC]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Title & Description */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#81D4FA] to-[#B3E5FC] text-[#0277BD] shadow-sm">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#4E342E]">
                  รายงานการคัดกรองสุขภาพ
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E0F2FE] text-[#0277BD] border border-[#B3E5FC]">
                  <Sparkles className="w-3 h-3" />
                  Smart Health
                </span>
              </div>
              <p className="text-sm text-[#795548] font-normal mt-0.5">
                ภาพรวมสถิติผู้เข้ารับการคัดกรองสุขภาพ และวิเคราะห์แนวโน้มรายพื้นที่
              </p>
            </div>
          </div>

          {/* Author Badge */}
          <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF7F5] border border-[#E8DED8] text-xs text-[#5D4037]">
            <span className="flex items-center gap-1.5 font-medium text-[#4E342E]">
              <UserCheck className="w-3.5 h-3.5 text-[#0288D1]" />
              ผู้จัดทำ:
            </span>
            <span>นางสาวนาดา ระยาภักดิ์</span>
            <span className="text-[#A1887F]">•</span>
            <span className="text-[#6D4C41]">นักศึกษาสาขาวิชาเวชระเบียน ชั้นปีที่ 3</span>
          </div>
        </div>

        {/* Right side: Last Updated, Status & Refresh Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 self-stretch lg:self-auto justify-between lg:justify-end">
          <div className="flex flex-col items-start sm:items-end text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#6D4C41]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="font-medium">อัปเดตล่าสุด:</span>
              <span className="text-[#4E342E] font-semibold">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-[#8D6E63]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F5EBE6] text-[#5D4037] font-medium text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                พร้อมใช้งาน ({totalRecords} ราย)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0277BD] font-medium text-[11px]">
                <ShieldCheck className="w-3 h-3" />
                ระบบปลอดภัย
              </span>
            </div>
          </div>

          {/* Interactive Refresh Button */}
          <button
            id="btn-refresh-dashboard"
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#81D4FA] to-[#4FC3F7] hover:from-[#4FC3F7] hover:to-[#29B6F6] text-white font-medium text-sm shadow-sm hover:shadow active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title="รีเฟรชข้อมูลล่าสุด"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'กำลังซิงค์...' : 'รีเฟรชข้อมูล'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
