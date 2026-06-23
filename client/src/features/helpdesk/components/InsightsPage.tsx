import React, { useState, useMemo, useId } from 'react';
import {
  MOCK_APPOINTMENTS, MOCK_PATIENTS, SPECIALTY_DATA, MONTHLY_TREND, SPECIALTY_FEE,
} from '../data/mock';

type Range = 'week' | 'month' | 'last30';

// ── SVG Line Chart ─────────────────────────────────────────────────────────────
interface LinePoint { label: string; a: number; b?: number }
interface LineChartProps {
  data: LinePoint[];
  colorA?: string;
  colorB?: string;
  labelA?: string;
  labelB?: string;
  formatY?: (v: number) => string;
}

function LineChart({ data, colorA = '#5B65DC', colorB = '#16A34A', labelA = 'Series A', labelB, formatY = String }: LineChartProps) {
  const W = 440, H = 100, PAD_L = 40, PAD_R = 12, PAD_T = 10, PAD_B = 28;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const n = data.length;
  const aVals = data.map(d => d.a);
  const bVals = labelB ? data.map(d => d.b ?? 0) : [];
  const allVals = [...aVals, ...bVals];
  const maxY = Math.max(...allVals, 1);
  const minY = 0;

  const xOf = (i: number) => PAD_L + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
  const yOf = (v: number) => PAD_T + chartH - ((v - minY) / (maxY - minY)) * chartH;

  const ptsA = data.map((d, i) => `${xOf(i)},${yOf(d.a)}`).join(' ');
  const ptsB = labelB ? data.map((d, i) => `${xOf(i)},${yOf(d.b ?? 0)}`).join(' ') : '';

  const areaA = `M${xOf(0)},${yOf(data[0].a)} ` +
    data.slice(1).map((d, i) => `L${xOf(i + 1)},${yOf(d.a)}`).join(' ') +
    ` L${xOf(n - 1)},${PAD_T + chartH} L${PAD_L},${PAD_T + chartH} Z`;

  const GRIDS = [0, 0.5, 1];
  const idA = `grad-a-${useId().replace(/:/g, '')}`;
  const idB = `grad-b-${useId().replace(/:/g, '')}`;

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-2">
        <span className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: '#6B7280' }}>
          <span className="inline-block w-3 h-0.5 rounded" style={{ background: colorA }} />{labelA}
        </span>
        {labelB && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: '#6B7280' }}>
            <span className="inline-block w-3 h-0.5 rounded" style={{ background: colorB }} />{labelB}
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Line chart">
        <defs>
          <linearGradient id={idA} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={colorA} stopOpacity="0.12" />
            <stop offset="100%" stopColor={colorA} stopOpacity="0" />
          </linearGradient>
          {labelB && (
            <linearGradient id={idB} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={colorB} stopOpacity="0.1" />
              <stop offset="100%" stopColor={colorB} stopOpacity="0" />
            </linearGradient>
          )}
        </defs>
        {/* Grid lines + Y labels */}
        {GRIDS.map(pct => {
          const y = PAD_T + chartH * (1 - pct);
          const val = minY + (maxY - minY) * pct;
          return (
            <g key={pct}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#F1F5F9" strokeWidth={1} />
              <text x={PAD_L - 4} y={y + 3} textAnchor="end" fontSize={8} fill="#9CA3AF" fontFamily="Poppins,sans-serif">
                {formatY(Math.round(val))}
              </text>
            </g>
          );
        })}
        {/* Area fills */}
        <path d={areaA} fill={`url(#${idA})`} />
        {/* Lines */}
        <polyline points={ptsA} fill="none" stroke={colorA} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {labelB && ptsB && (
          <polyline points={ptsB} fill="none" stroke={colorB} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 2" />
        )}
        {/* Data points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xOf(i)} cy={yOf(d.a)} r={3} fill={colorA} />
            {labelB && <circle cx={xOf(i)} cy={yOf(d.b ?? 0)} r={3} fill={colorB} />}
          </g>
        ))}
        {/* X-axis labels */}
        {data.map((d, i) => (
          <text key={i} x={xOf(i)} y={H - 4} textAnchor="middle" fontSize={8.5} fill="#9CA3AF" fontFamily="Poppins,sans-serif">
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ── SVG Donut Chart ────────────────────────────────────────────────────────────
function DonutChart({ segments, size = 110, thickness = 13 }: {
  segments: { label: string; value: number; color: string }[];
  size?: number; thickness?: number;
}) {
  const r = (size - thickness) / 2, cx = size / 2, cy = size / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0);
  let off = 0;
  const segs = segments.map(d => {
    const len = total ? (d.value / total) * C : 0;
    const s = { ...d, len, off };
    off += len;
    return s;
  });
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Status distribution donut chart" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={thickness} />
        {segs.map((s, i) => s.len > 0 && (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
            strokeDasharray={`${s.len} ${C - s.len}`} strokeDashoffset={-s.off}
            transform={`rotate(-90 ${cx} ${cy})`} />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={15} fontWeight="800" fill="#111827" fontFamily="Poppins,sans-serif">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={8} fill="#6B7280" fontFamily="Poppins,sans-serif">total</text>
      </svg>
      <div className="flex flex-col gap-1.5 min-w-0">
        {segs.map(s => (
          <div key={s.label} className="flex items-center gap-2 text-[11.5px]">
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
            <span className="flex-1" style={{ color: '#6B7280' }}>{s.label}</span>
            <span className="font-bold" style={{ color: '#111827' }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
function KpiCard({ label, val, sub, icon, color, bg }: {
  label: string; val: string | number; sub?: string;
  icon: string; color: string; bg: string;
}) {
  return (
    <div className="bg-white p-4" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 flex items-center justify-center" style={{ background: bg, borderRadius: 8 }}>
          <span className="material-icons-outlined" style={{ fontSize: 18, color }} aria-hidden="true">{icon}</span>
        </div>
      </div>
      <div className="text-[22px] font-extrabold leading-none mb-1" style={{ color: '#111827' }}>{val}</div>
      <div className="text-[11.5px] font-semibold" style={{ color: '#374151' }}>{label}</div>
      {sub && <div className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>{sub}</div>}
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-[13px] font-bold" style={{ color: '#111827' }}>{title}</h3>
      {sub && <p className="text-[11px] mt-0.5" style={{ color: '#6B7280' }}>{sub}</p>}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
const TD: React.CSSProperties = { padding: '8px 12px', borderRight: '1px solid #E4E8EF', borderBottom: '1px solid #E4E8EF', fontSize: 12.5, color: '#374151', fontFamily: "'Poppins',sans-serif" };
const TH: React.CSSProperties = { ...TD, fontSize: 10.5, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', textTransform: 'uppercase', background: '#FAFAFA' };

export default function InsightsPage() {
  const [range, setRange] = useState<Range>('month');

  const appts = useMemo(() => {
    if (range === 'week')   return MOCK_APPOINTMENTS.filter(a => a.date >= '2026-06-16' && a.date <= '2026-06-22');
    if (range === 'last30') return MOCK_APPOINTMENTS.filter(a => a.date >= '2026-05-22');
    return MOCK_APPOINTMENTS;
  }, [range]);

  // KPI derivations
  const total       = appts.length;
  const completed   = appts.filter(a => a.status === 'completed').length;
  const pending     = appts.filter(a => a.status === 'pending').length;
  const noshow      = appts.filter(a => a.status === 'no-show').length;
  const compRate    = total ? Math.round((completed / total) * 100) : 0;
  const noshowRate  = total ? Math.round((noshow / total) * 100) : 0;

  const revenue = useMemo(() =>
    appts.reduce((sum, a) => sum + (SPECIALTY_FEE[a.specialty] ?? 1200), 0),
    [appts]
  );
  const avgRevenue = total ? Math.round(revenue / total) : 0;

  const upcomingPatientIds = new Set(
    MOCK_APPOINTMENTS
      .filter(a => a.date >= '2026-06-22' && (a.status === 'confirmed' || a.status === 'pending'))
      .map(a => a.patientId)
  );
  const activePatients   = MOCK_PATIENTS.filter(p => upcomingPatientIds.has(p.id)).length;
  const inactivePatients = MOCK_PATIENTS.length - activePatients;

  // Line chart data
  const apptTrendData  = MONTHLY_TREND.map(d => ({ label: d.month, a: d.appointments, b: d.newPatients }));
  const revTrendData   = MONTHLY_TREND.map(d => ({ label: d.month, a: d.revenue }));

  // Status donut
  const statusDonut = [
    { label: 'Confirmed', value: appts.filter(a => a.status === 'confirmed').length, color: '#16A34A' },
    { label: 'Pending',   value: pending,                                             color: '#F59E0B' },
    { label: 'Completed', value: completed,                                           color: '#5B65DC' },
    { label: 'Cancelled', value: appts.filter(a => a.status === 'cancelled').length, color: '#EF4444' },
    { label: 'No-show',   value: noshow,                                             color: '#FB7185' },
  ];

  // Visit frequency breakdown
  const freqBuckets = [
    { label: '1 visit',  count: MOCK_PATIENTS.filter(p => p.totalVisits === 1).length,             color: '#C7CAEF' },
    { label: '2–4',      count: MOCK_PATIENTS.filter(p => p.totalVisits >= 2 && p.totalVisits <= 4).length, color: '#5B65DC' },
    { label: '5–9',      count: MOCK_PATIENTS.filter(p => p.totalVisits >= 5 && p.totalVisits <= 9).length, color: '#0EA5E9' },
    { label: '10+',      count: MOCK_PATIENTS.filter(p => p.totalVisits >= 10).length,             color: '#16A34A' },
  ];
  const freqMax = Math.max(...freqBuckets.map(b => b.count), 1);

  // Specialty performance
  const BRANCHES_LIST = ['City Clinic', 'North Branch', 'East Clinic', 'West Branch', 'South Clinic'];
  const specialtyPerf = Array.from(new Set(MOCK_APPOINTMENTS.map(a => a.specialty))).map(spec => {
    const sa = appts.filter(a => a.specialty === spec);
    const fee = SPECIALTY_FEE[spec] ?? 1200;
    return {
      name: spec,
      total: sa.length,
      revenue: sa.length * fee,
      avgCost: fee,
      rate: sa.length ? Math.round((sa.filter(a => a.status === 'completed').length / sa.length) * 100) : 0,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const branchPerf = BRANCHES_LIST.map(b => {
    const ba = appts.filter(a => a.branch === b);
    const rev = ba.reduce((s, a) => s + (SPECIALTY_FEE[a.specialty] ?? 1200), 0);
    return {
      name: b, total: ba.length, revenue: rev,
      avgConsult: ba.length ? Math.round(rev / ba.length) : 0,
      rate: ba.length ? Math.round((ba.filter(a => a.status === 'completed').length / ba.length) * 100) : 0,
    };
  });

  const INS_LIST = ['Maxicare', 'MediCard', 'PhilHealth', 'Intellicare', 'Insular Health', 'Cocolife'];
  const insData = INS_LIST.map(ins => {
    const ia = appts.filter(a => a.insurance === ins);
    return { name: ins, count: ia.length, revenue: ia.reduce((s, a) => s + (SPECIALTY_FEE[a.specialty] ?? 1200), 0) };
  }).sort((a, b) => b.count - a.count);
  const insMax = Math.max(...insData.map(d => d.count), 1);

  const fmtPhp = (n: number) => `₱${n.toLocaleString()}`;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#F4F6F9' }}>
      <div className="px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[18px] font-extrabold" style={{ color: '#111827' }}>Insights &amp; Analytics</h2>
            <p className="text-[12px] mt-0.5" style={{ color: '#6B7280' }}>Revenue, performance &amp; patient activity overview</p>
          </div>
          <div className="flex gap-1" role="group" aria-label="Date range">
            {([['week', 'This Week'], ['month', 'This Month'], ['last30', 'Last 30 Days']] as [Range, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setRange(v)}
                aria-pressed={range === v}
                className="border-0 cursor-pointer font-semibold text-[12px]"
                style={{ height: 32, padding: '0 12px', borderRadius: 6, fontFamily: "'Poppins',sans-serif",
                  background: range === v ? '#5B65DC' : '#fff', color: range === v ? '#fff' : '#6B7280',
                  border: range === v ? '1px solid #5B65DC' : '1px solid #E4E8EF' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── Section A: KPI cards ── */}
        <div className="grid grid-cols-3 gap-3 mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <KpiCard label="Total Appointments" val={total}    sub={`${pending} pending review`}       icon="event_note"      color="#5B65DC" bg="#EEEFFD" />
          <KpiCard label="Est. Revenue"        val={fmtPhp(revenue)} sub={`Avg ${fmtPhp(avgRevenue)}/appt`} icon="payments"       color="#16A34A" bg="#ECFDF5" />
          <KpiCard label="Completion Rate"     val={`${compRate}%`} sub={`${noshowRate}% no-show rate`} icon="task_alt"       color="#0EA5E9" bg="#E0F2FE" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          <KpiCard label="Active Patients"     val={activePatients}   sub="Upcoming confirmed appts"  icon="person_check"   color="#8B5CF6" bg="#EDE9FE" />
          <KpiCard label="Inactive Patients"   val={inactivePatients} sub="No upcoming appointments"  icon="person_off"     color="#EF4444" bg="#FEF2F2" />
          <KpiCard label="Total Patients"      val={MOCK_PATIENTS.length} sub={`${MOCK_PATIENTS.filter(p => p.totalVisits >= 5).length} frequent visitors`} icon="groups" color="#D97706" bg="#FEF3C7" />
        </div>

        {/* ── Section B: Line charts ── */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead title="Appointment Trend" sub="Monthly count Jan–Jun 2026 · solid = total, dashed = new patients" />
            <LineChart data={apptTrendData} colorA="#5B65DC" colorB="#0EA5E9" labelA="Total Appointments" labelB="New Patients" />
          </div>
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead title="Revenue Trend (₱)" sub="Estimated monthly revenue Jan–Jun 2026" />
            <LineChart data={revTrendData} colorA="#16A34A" labelA="Revenue (₱)" formatY={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
          </div>
        </div>

        {/* ── Section C: Status + Patient breakdown + Specialty table ── */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: '200px 220px 1fr' }}>
          {/* Donut */}
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead title="By Status" />
            <DonutChart segments={statusDonut} size={110} thickness={13} />
          </div>

          {/* Active/Inactive + frequency */}
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead title="Patient Activity" />
            {/* Active vs Inactive stacked bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] mb-1" style={{ color: '#6B7280' }}>
                <span>Active</span><span>Inactive</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden flex" style={{ background: '#F1F5F9', borderRadius: 6 }}>
                <div style={{ width: `${(activePatients / MOCK_PATIENTS.length) * 100}%`, background: '#5B65DC', borderRadius: '6px 0 0 6px' }} />
                <div style={{ flex: 1, background: '#FCA5A5', borderRadius: '0 6px 6px 0' }} />
              </div>
              <div className="flex justify-between text-[11.5px] font-bold mt-1">
                <span style={{ color: '#5B65DC' }}>{activePatients} ({Math.round((activePatients / MOCK_PATIENTS.length) * 100)}%)</span>
                <span style={{ color: '#EF4444' }}>{inactivePatients}</span>
              </div>
            </div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: '#6B7280' }}>Visit Frequency</div>
            {freqBuckets.map(b => (
              <div key={b.label} className="flex items-center gap-2 mb-2">
                <span className="text-[11.5px]" style={{ color: '#374151', width: 36, flexShrink: 0 }}>{b.label}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: '#F4F6F9' }}>
                  <div className="h-1.5 rounded-full" style={{ width: `${(b.count / freqMax) * 100}%`, background: b.color, borderRadius: 3 }} />
                </div>
                <span className="text-[11.5px] font-bold" style={{ color: '#111827', width: 16, textAlign: 'right' }}>{b.count}</span>
              </div>
            ))}
          </div>

          {/* Specialty performance table */}
          <div className="bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #E4E8EF' }}>
              <SectionHead title="Specialty Performance" sub="Revenue &amp; completion by specialty" />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} role="grid" aria-label="Specialty performance table">
              <thead>
                <tr>
                  {['Specialty', 'Appts', 'Revenue', 'Avg Fee', 'Done%'].map((h, i, arr) => (
                    <th key={h} scope="col" style={{ ...TH, borderRight: i < arr.length - 1 ? '1px solid #E4E8EF' : 'none' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specialtyPerf.map((s, idx) => (
                  <tr key={s.name} style={{ background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ ...TD, fontWeight: 600, color: '#111827' }}>{s.name}</td>
                    <td style={{ ...TD, textAlign: 'center' }}>{s.total}</td>
                    <td style={{ ...TD, color: '#16A34A', fontWeight: 600 }}>{fmtPhp(s.revenue)}</td>
                    <td style={{ ...TD, color: '#6B7280' }}>{fmtPhp(s.avgCost)}</td>
                    <td style={{ ...TD, textAlign: 'center', borderRight: 'none' }}>
                      <span className="font-bold" style={{ color: s.rate >= 50 ? '#16A34A' : '#D97706' }}>{s.rate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section D: Branch + Insurance ── */}
        <div className="grid grid-cols-2 gap-4">
          {/* Branch revenue */}
          <div className="bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #E4E8EF' }}>
              <SectionHead title="Branch Revenue" sub="Appointments &amp; estimated earnings per branch" />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} role="grid" aria-label="Branch revenue table">
              <thead>
                <tr>
                  {['Branch', 'Appts', 'Revenue', 'Avg', 'Rate'].map((h, i, arr) => (
                    <th key={h} scope="col" style={{ ...TH, borderRight: i < arr.length - 1 ? '1px solid #E4E8EF' : 'none' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {branchPerf.map((b, idx) => (
                  <tr key={b.name} style={{ background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ ...TD, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{b.name}</td>
                    <td style={{ ...TD, textAlign: 'center' }}>{b.total}</td>
                    <td style={{ ...TD, color: '#16A34A', fontWeight: 600 }}>{fmtPhp(b.revenue)}</td>
                    <td style={{ ...TD, color: '#6B7280' }}>{fmtPhp(b.avgConsult)}</td>
                    <td style={{ ...TD, textAlign: 'center', borderRight: 'none' }}>
                      <span className="font-bold" style={{ color: b.rate >= 50 ? '#16A34A' : '#D97706' }}>{b.rate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Insurance payer mix */}
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead title="Insurance Payer Mix" sub="Appointment count &amp; revenue per insurer" />
            <div className="flex flex-col gap-3">
              {insData.map((ins, i) => {
                const COLORS = ['#5B65DC', '#0EA5E9', '#16A34A', '#F59E0B', '#EC4899', '#8B5CF6'];
                const color = COLORS[i % COLORS.length];
                return (
                  <div key={ins.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-semibold" style={{ color: '#374151' }}>{ins.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px]" style={{ color: '#6B7280' }}>{ins.count} appts</span>
                        <span className="text-[11.5px] font-bold" style={{ color }}>{fmtPhp(ins.revenue)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#F4F6F9' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${(ins.count / insMax) * 100}%`, background: color, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
