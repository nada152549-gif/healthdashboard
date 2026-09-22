import { ScreeningRecord, OverviewKPIs } from '../types';
import { FALLBACK_RECORDS } from '../data/fallbackData';

const SHEET_ID = '1EL3Rr3qyewSsayjw4t79LwtV2YxVu7bU-smIS0i3UkM';

function cleanText(val: string): string {
  if (!val) return '';
  return val.replace(/^["'\s]+|["'\s]+$/g, '').trim();
}

function parseNumber(val: string, fallback = 0): number {
  const cleaned = cleanText(val).replace(/[^0-9.-]/g, '');
  const n = parseFloat(cleaned);
  return isNaN(n) ? fallback : n;
}

function normalizeAlcohol(val: string): string {
  const clean = cleanText(val);
  if (clean.includes('ไม่ดื่ม') || clean.includes('ไม่ดื่่ม')) return 'ไม่ดื่ม';
  if (clean.includes('ดื่ม')) return 'ดื่ม';
  return clean || 'ไม่ดื่ม';
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

export function parseScreeningCSV(csvText: string): ScreeningRecord[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return FALLBACK_RECORDS;

  const records: ScreeningRecord[] = [];

  // Skip header (first row)
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 5) continue;

    const id = cleanText(cols[0]);
    if (!id || id === 'รหัสบุคคล') continue;

    const date = cleanText(cols[1]);
    const area = cleanText(cols[2]) || 'ไม่ระบุ';
    const gender = cleanText(cols[3]) || 'ไม่ระบุ';
    const age = parseNumber(cols[4], 0);
    const height = parseNumber(cols[5], 160);
    const weight = parseNumber(cols[6], 60);
    const bmi = parseNumber(cols[7], +(weight / ((height / 100) * (height / 100))).toFixed(1));
    const sbp = parseNumber(cols[8], 120);
    const dbp = parseNumber(cols[9], 80);
    const pulse = parseNumber(cols[10], 75);
    const glucose = parseNumber(cols[11], 100);
    const smoking = cleanText(cols[12]) || 'ไม่สูบ';
    const alcohol = normalizeAlcohol(cols[13]);
    const exercise = cleanText(cols[14]) || 'บางครั้ง';
    const diabetesRisk = cleanText(cols[15]) || 'ไม่มี';
    const hypertensionRisk = cleanText(cols[16]) || 'ไม่มี';
    const riskScore = parseNumber(cols[17], 0);
    const riskLevel = cleanText(cols[18]) || (riskScore >= 4 ? 'สูง' : riskScore >= 2 ? 'ปานกลาง' : 'ต่ำ');
    const month = cleanText(cols[19]) || '2026-01';

    records.push({
      id,
      date,
      area,
      gender,
      age,
      height,
      weight,
      bmi,
      sbp,
      dbp,
      pulse,
      glucose,
      smoking,
      alcohol,
      exercise,
      diabetesRisk,
      hypertensionRisk,
      riskScore,
      riskLevel,
      month,
    });
  }

  return records.length > 0 ? records : FALLBACK_RECORDS;
}

export async function fetchScreeningData(): Promise<{ records: ScreeningRecord[]; lastUpdated: Date; source: 'live' | 'fallback' }> {
  try {
    const urls = [
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`,
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`,
    ];

    let csv = '';
    for (const url of urls) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) {
          csv = await res.text();
          if (csv && csv.includes('รหัสบุคคล')) break;
        }
      } catch {
        // try next url
      }
    }

    if (csv && csv.includes('รหัสบุคคล')) {
      const records = parseScreeningCSV(csv);
      return {
        records,
        lastUpdated: new Date(),
        source: 'live',
      };
    }
  } catch (err) {
    console.warn('Live fetch failed, using reliable fallback dataset', err);
  }

  return {
    records: FALLBACK_RECORDS,
    lastUpdated: new Date(),
    source: 'fallback',
  };
}

export function calculateOverviewKPIs(records: ScreeningRecord[]): OverviewKPIs {
  const count = records.length;
  if (count === 0) {
    return {
      totalCount: 0,
      avgBmi: 0,
      avgGlucose: 0,
      avgSbp: 0,
      avgDbp: 0,
      avgRiskScore: 0,
      minGlucose: 0,
      maxGlucose: 0,
      minBmi: 0,
      maxBmi: 0,
      minAge: 0,
      maxAge: 0,
      minSbp: 0,
      maxSbp: 0,
      femaleCount: 0,
      maleCount: 0,
      femaleRatio: 0,
      maleRatio: 0,
      highRiskCount: 0,
      highRiskPercentage: 0,
      moderateRiskCount: 0,
      lowRiskCount: 0,
      diabetesRiskCount: 0,
      diabetesRiskPercentage: 0,
      htRiskCount: 0,
      htRiskPercentage: 0,
      smokingCount: 0,
      smokingPercentage: 0,
      alcoholCount: 0,
      alcoholPercentage: 0,
      sedentaryCount: 0,
      sedentaryPercentage: 0,
    };
  }

  let totalBmi = 0;
  let totalGlucose = 0;
  let totalSbp = 0;
  let totalDbp = 0;
  let totalRiskScore = 0;

  let minGlucose = Infinity;
  let maxGlucose = -Infinity;
  let minBmi = Infinity;
  let maxBmi = -Infinity;
  let minAge = Infinity;
  let maxAge = -Infinity;
  let minSbp = Infinity;
  let maxSbp = -Infinity;

  let femaleCount = 0;
  let maleCount = 0;
  let highRiskCount = 0;
  let moderateRiskCount = 0;
  let lowRiskCount = 0;
  let diabetesRiskCount = 0;
  let htRiskCount = 0;
  let smokingCount = 0;
  let alcoholCount = 0;
  let sedentaryCount = 0;

  for (const r of records) {
    totalBmi += r.bmi;
    totalGlucose += r.glucose;
    totalSbp += r.sbp;
    totalDbp += r.dbp;
    totalRiskScore += r.riskScore;

    if (r.glucose < minGlucose) minGlucose = r.glucose;
    if (r.glucose > maxGlucose) maxGlucose = r.glucose;

    if (r.bmi < minBmi) minBmi = r.bmi;
    if (r.bmi > maxBmi) maxBmi = r.bmi;

    if (r.age < minAge) minAge = r.age;
    if (r.age > maxAge) maxAge = r.age;

    if (r.sbp < minSbp) minSbp = r.sbp;
    if (r.sbp > maxSbp) maxSbp = r.sbp;

    if (r.gender === 'หญิง') femaleCount++;
    else if (r.gender === 'ชาย') maleCount++;

    if (r.riskLevel === 'สูง') highRiskCount++;
    else if (r.riskLevel === 'ปานกลาง') moderateRiskCount++;
    else lowRiskCount++;

    if (r.diabetesRisk.includes('เสี่ยง')) diabetesRiskCount++;
    if (r.hypertensionRisk.includes('เสี่ยง')) htRiskCount++;

    if (r.smoking === 'สูบ') smokingCount++;
    if (r.alcohol === 'ดื่ม') alcoholCount++;
    if (r.exercise === 'ไม่ออกกำลังกาย') sedentaryCount++;
  }

  const femaleRatio = +(femaleCount / count * 100).toFixed(1);
  const maleRatio = +(maleCount / count * 100).toFixed(1);

  return {
    totalCount: count,
    avgBmi: +(totalBmi / count).toFixed(1),
    avgGlucose: +(totalGlucose / count).toFixed(1),
    avgSbp: +(totalSbp / count).toFixed(1),
    avgDbp: +(totalDbp / count).toFixed(1),
    avgRiskScore: +(totalRiskScore / count).toFixed(1),
    minGlucose: minGlucose === Infinity ? 0 : minGlucose,
    maxGlucose: maxGlucose === -Infinity ? 0 : maxGlucose,
    minBmi: minBmi === Infinity ? 0 : minBmi,
    maxBmi: maxBmi === -Infinity ? 0 : maxBmi,
    minAge: minAge === Infinity ? 0 : minAge,
    maxAge: maxAge === -Infinity ? 0 : maxAge,
    minSbp: minSbp === Infinity ? 0 : minSbp,
    maxSbp: maxSbp === -Infinity ? 0 : maxSbp,
    femaleCount,
    maleCount,
    femaleRatio,
    maleRatio,
    highRiskCount,
    highRiskPercentage: +(highRiskCount / count * 100).toFixed(1),
    moderateRiskCount,
    lowRiskCount,
    diabetesRiskCount,
    diabetesRiskPercentage: +(diabetesRiskCount / count * 100).toFixed(1),
    htRiskCount,
    htRiskPercentage: +(htRiskCount / count * 100).toFixed(1),
    smokingCount,
    smokingPercentage: +(smokingCount / count * 100).toFixed(1),
    alcoholCount,
    alcoholPercentage: +(alcoholCount / count * 100).toFixed(1),
    sedentaryCount,
    sedentaryPercentage: +(sedentaryCount / count * 100).toFixed(1),
  };
}
