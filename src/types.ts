export interface ScreeningRecord {
  id: string; // รหัสบุคคล เช่น H0001
  date: string; // วันที่คัดกรอง เช่น 3/1/2026
  area: string; // พื้นที่ เช่น เมือง, เหนือ, ตะวันออก, ตะวันตก, ใต้
  gender: string; // เพศ เช่น ชาย, หญิง
  age: number; // อายุ
  height: number; // ส่วนสูง_cm
  weight: number; // น้ำหนัก_kg
  bmi: number; // BMI
  sbp: number; // SBP_mmHg (ความดันตัวบน)
  dbp: number; // DBP_mmHg (ความดันตัวล่าง)
  pulse: number; // ชีพจร_bpm
  glucose: number; // น้ำตาล_mg_dL
  smoking: string; // สูบบุหรี่ ("สูบ", "ไม่สูบ")
  alcohol: string; // ดื่มแอลกอฮอล์ ("ดื่ม", "ไม่ดื่ม")
  exercise: string; // การออกกำลังกาย ("สม่ำเสมอ", "บางครั้ง", "ไม่ออกกำลังกาย")
  diabetesRisk: string; // เบาหวาน_คัดกรอง ("ไม่มี", "มีแนวโน้ม/เสี่ยง")
  hypertensionRisk: string; // ความดันโลหิตสูง_คัดกรอง ("ไม่มี", "มีแนวโน้ม/เสี่ยง")
  riskScore: number; // คะแนนความเสี่ยง (0 - 10)
  riskLevel: string; // ระดับความเสี่ยง ("ต่ำ", "ปานกลาง", "สูง")
  month: string; // เดือน เช่น 2026-01, 2026-02
}

export interface FilterState {
  area: string;
  gender: string;
  ageGroup: string;
  month: string;
  riskLevel: string;
  searchQuery: string;
  highRiskOnly: boolean;
}

export interface OverviewKPIs {
  totalCount: number;
  avgBmi: number;
  avgGlucose: number;
  avgSbp: number;
  avgDbp: number;
  avgRiskScore: number;
  minGlucose: number;
  maxGlucose: number;
  minBmi: number;
  maxBmi: number;
  minAge: number;
  maxAge: number;
  minSbp: number;
  maxSbp: number;
  femaleCount: number;
  maleCount: number;
  femaleRatio: number;
  maleRatio: number;
  highRiskCount: number;
  highRiskPercentage: number;
  moderateRiskCount: number;
  lowRiskCount: number;
  diabetesRiskCount: number;
  diabetesRiskPercentage: number;
  htRiskCount: number;
  htRiskPercentage: number;
  smokingCount: number;
  smokingPercentage: number;
  alcoholCount: number;
  alcoholPercentage: number;
  sedentaryCount: number;
  sedentaryPercentage: number;
}
