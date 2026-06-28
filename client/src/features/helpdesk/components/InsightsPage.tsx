import React, { useState, useMemo, useId } from 'react';
import {
  MOCK_APPOINTMENTS, MOCK_PATIENTS, MONTHLY_TREND, SPECIALTY_FEE, TODAY,
} from '../data/mock';

type Range = 'week' | 'month' | 'last30';

// ── Custom tooltip ────────────────────────────────────────────────────────────
function Tip({ text, children }: { text: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center"
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {children}
      {open && (
        <span className="absolute z-50 pointer-events-none"
          style={{ bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', minWidth: 140, maxWidth: 190 }}>
          <span className="block text-[11px] font-medium leading-snug px-2.5 py-1.5"
            style={{ background: '#1E293B', color: '#F1F5F9', borderRadius: 6, boxShadow: '0 4px 14px rgba(0,0,0,.18)', whiteSpace: 'normal', fontFamily: "'Poppins',sans-serif" }}>
            {text}
          </span>
          <span className="block mx-auto" style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #1E293B' }} />
        </span>
      )}
    </span>
  );
}

function InfoTip({ tip }: { tip: string }) {
  return (
    <Tip text={tip}>
      <span className="inline-flex items-center justify-center ml-1 cursor-help align-middle"
        style={{ color: '#CBD5E1', verticalAlign: 'middle' }}>
        <span className="material-icons-outlined" style={{ fontSize: 13 }}>info</span>
      </span>
    </Tip>
  );
}

// ── Rate badge (color-coded) ──────────────────────────────────────────────────
function RateBadge({ rate, suffix = '%' }: { rate: number; suffix?: string }) {
  const color = rate >= 70 ? '#16A34A' : rate >= 40 ? '#D97706' : '#EF4444';
  const bg    = rate >= 70 ? '#ECFDF5' : rate >= 40 ? '#FEF3C7' : '#FEF2F2';
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5"
      title={`${rate}${suffix} — ${rate >= 70 ? 'Good' : rate >= 40 ? 'Moderate' : 'Low'}`}
      style={{ background: bg, color, borderRadius: 4 }}>
      {rate}{suffix}
    </span>
  );
}

// ── Mini horizontal bar ───────────────────────────────────────────────────────
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 rounded-full flex-1" style={{ background: '#F1F5F9', minWidth: 40 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width .3s' }} />
      </div>
    </div>
  );
}

// ── SVG Line Chart ────────────────────────────────────────────────────────────
interface LinePoint { label: string; a: number; b?: number }
function LineChart({ data, colorA = '#5B65DC', colorB = '#16A34A', labelA = 'Series A', labelB, formatY = String, title }: {
  data: LinePoint[]; colorA?: string; colorB?: string;
  labelA?: string; labelB?: string; formatY?: (v: number) => string; title?: string;
}) {
  const W = 440, H = 110, PAD_L = 44, PAD_R = 12, PAD_T = 10, PAD_B = 28;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const n = data.length;
  const aVals = data.map(d => d.a);
  const bVals = labelB ? data.map(d => d.b ?? 0) : [];
  const maxY = Math.max(...aVals, ...bVals, 1);
  const xOf = (i: number) => PAD_L + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
  const yOf = (v: number) => PAD_T + chartH - (v / maxY) * chartH;
  const ptsA = data.map((d, i) => `${xOf(i)},${yOf(d.a)}`).join(' ');
  const ptsB = labelB ? data.map((d, i) => `${xOf(i)},${yOf(d.b ?? 0)}`).join(' ') : '';
  const areaA = `M${xOf(0)},${yOf(data[0]?.a ?? 0)} ` +
    data.slice(1).map((d, i) => `L${xOf(i + 1)},${yOf(d.a)}`).join(' ') +
    ` L${xOf(n - 1)},${PAD_T + chartH} L${PAD_L},${PAD_T + chartH} Z`;
  const idA = `grad-a-${useId().replace(/:/g, '')}`;
  const GRIDS = [0, 0.5, 1];
  return (
    <div>
      <div className="flex items-center gap-4 mb-3">
        <span className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: '#6B7280' }}>
          <span className="inline-block w-4 h-0.5 rounded" style={{ background: colorA }} />{labelA}
        </span>
        {labelB && (
          <span className="flex items-center gap-1.5 text-[11.5px] font-semibold" style={{ color: '#6B7280' }}>
            <span className="inline-block w-4 h-0.5 rounded" style={{ background: colorB, opacity: .7 }} />{labelB}
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={title ?? 'Line chart'}>
        <defs>
          <linearGradient id={idA} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={colorA} stopOpacity="0.14" />
            <stop offset="100%" stopColor={colorA} stopOpacity="0" />
          </linearGradient>
        </defs>
        {GRIDS.map(pct => {
          const y = PAD_T + chartH * (1 - pct);
          return (
            <g key={pct}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#F1F5F9" strokeWidth={1} />
              <text x={PAD_L - 4} y={y + 3} textAnchor="end" fontSize={8} fill="#9CA3AF" fontFamily="Poppins,sans-serif">
                {formatY(Math.round(maxY * pct))}
              </text>
            </g>
          );
        })}
        <path d={areaA} fill={`url(#${idA})`} />
        <polyline points={ptsA} fill="none" stroke={colorA} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {labelB && ptsB && (
          <polyline points={ptsB} fill="none" stroke={colorB} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray="4 2" />
        )}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xOf(i)} cy={yOf(d.a)} r={3} fill={colorA} />
            {labelB && <circle cx={xOf(i)} cy={yOf(d.b ?? 0)} r={2.5} fill={colorB} />}
          </g>
        ))}
        {data.map((d, i) => (
          <text key={i} x={xOf(i)} y={H - 4} textAnchor="middle" fontSize={8.5} fill="#9CA3AF" fontFamily="Poppins,sans-serif">
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ── Donut Chart ───────────────────────────────────────────────────────────────
function DonutChart({ segments, size = 96, thickness = 12, richLegend = false }: {
  segments: { label: string; value: number; color: string }[];
  size?: number; thickness?: number; richLegend?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const r = (size - thickness) / 2, cx = size / 2, cy = size / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0);
  let off = 0;
  const segs = segments.map(d => {
    const len = total ? (d.value / total) * C : 0;
    const pct = total ? Math.round((d.value / total) * 100) : 0;
    const s = { ...d, len, off, pct };
    off += len;
    return s;
  });
  const hovSeg = hovered !== null ? segs[hovered] : null;
  const bigFont = size > 100;

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        role="img" aria-label="Appointment status distribution" className="shrink-0">
        {/* Track ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={thickness} />
        {/* Segments */}
        {segs.map((s, i) => s.len > 0 && (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={s.color}
            strokeWidth={hovered === i ? thickness + 4 : thickness}
            strokeDasharray={`${s.len} ${C - s.len}`}
            strokeDashoffset={-s.off}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ cursor: 'pointer', transition: 'stroke-width .15s ease, opacity .15s ease', opacity: hovered !== null && hovered !== i ? 0.3 : 1 }}
            aria-label={`${s.label}: ${s.value} (${s.pct}%)`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {/* Center tooltip — shows segment info on hover, total otherwise */}
        {hovSeg ? (
          <>
            <text x={cx} y={cy - (bigFont ? 8 : 5)} textAnchor="middle"
              fontSize={bigFont ? 16 : 13} fontWeight="800" fill={hovSeg.color}
              fontFamily="Poppins,sans-serif" style={{ pointerEvents: 'none' }}>
              {hovSeg.pct}%
            </text>
            <text x={cx} y={cy + (bigFont ? 8 : 6)} textAnchor="middle"
              fontSize={bigFont ? 8.5 : 7} fill="#374151" fontFamily="Poppins,sans-serif"
              style={{ pointerEvents: 'none' }}>
              {hovSeg.label}
            </text>
            <text x={cx} y={cy + (bigFont ? 20 : 15)} textAnchor="middle"
              fontSize={bigFont ? 7.5 : 6} fill="#9CA3AF" fontFamily="Poppins,sans-serif"
              style={{ pointerEvents: 'none' }}>
              {hovSeg.value} appt{hovSeg.value !== 1 ? 's' : ''}
            </text>
          </>
        ) : (
          <>
            <text x={cx} y={cy - (bigFont ? 3 : 2)} textAnchor="middle"
              fontSize={bigFont ? 16 : 14} fontWeight="800" fill="#111827"
              fontFamily="Poppins,sans-serif">
              {total}
            </text>
            <text x={cx} y={cy + (bigFont ? 12 : 10)} textAnchor="middle"
              fontSize={bigFont ? 8 : 7.5} fill="#6B7280" fontFamily="Poppins,sans-serif">
              total
            </text>
          </>
        )}
      </svg>
      {/* Legend */}
      <div className={richLegend ? 'flex flex-col gap-2.5 min-w-0 flex-1' : 'flex flex-col gap-1.5 min-w-0'}>
        {segs.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2"
            style={{ opacity: hovered !== null && hovered !== i ? 0.3 : 1, transition: 'opacity .15s ease', cursor: 'default' }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}>
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
            <span className={richLegend ? 'text-[12px] flex-1 truncate' : 'text-[11.5px] flex-1'}
              style={{ color: '#64748B' }}>
              {s.label}
            </span>
            <span className={richLegend ? 'text-[12px] font-bold shrink-0' : 'text-[11.5px] font-bold shrink-0'}
              style={{ color: '#111827' }}>
              {s.value}
            </span>
            {richLegend && (
              <span className="text-[10.5px] shrink-0 w-8 text-right tabular-nums" style={{ color: '#9CA3AF' }}>
                {s.pct}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, val, sub, icon, color, bg, tooltip, progress }: {
  label: string; val: string | number; sub?: string;
  icon: string; color: string; bg: string; tooltip?: string; progress?: number;
}) {
  return (
    <div className="bg-white px-5 py-4" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="text-[11px] font-semibold flex items-center" style={{ color: '#64748B' }}>
          {label}{tooltip && <InfoTip tip={tooltip} />}
        </div>
        <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: bg, borderRadius: 8 }}>
          <span className="material-icons-outlined" style={{ fontSize: 16, color }} aria-hidden="true">{icon}</span>
        </div>
      </div>
      <div className="text-[26px] font-extrabold leading-none" style={{ color: '#111827' }}>{val}</div>
      {sub && <div className="text-[11px] mt-1" style={{ color: '#9CA3AF' }}>{sub}</div>}
      {progress !== undefined && (
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
          <div style={{ width: `${Math.min(progress, 100)}%`, height: '100%', background: progress >= 80 ? '#16A34A' : color, borderRadius: 6, transition: 'width .5s ease' }} />
        </div>
      )}
    </div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHead({ title, sub, tooltip }: { title: string; sub?: string; tooltip?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-[13px] font-bold flex items-center" style={{ color: '#111827' }}>
        {title}{tooltip && <InfoTip tip={tooltip} />}
      </h3>
      {sub && <p className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{sub}</p>}
    </div>
  );
}

// ── Insight callout ───────────────────────────────────────────────────────────
function Callout({ icon, text, color, bg }: { icon: string; text: string; color: string; bg: string }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg"
      style={{ background: bg, border: `1px solid ${color}22` }}>
      <span className="material-icons-outlined shrink-0" style={{ fontSize: 16, color }}>{icon}</span>
      <span className="text-[12px] font-medium leading-snug" style={{ color: '#374151' }}>{text}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const TD: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid #E4E8EF',
  borderRight: '1px solid #E4E8EF',
  fontSize: 12.5, color: '#374151',
  fontFamily: "'Poppins',sans-serif",
};
const TH: React.CSSProperties = {
  ...TD,
  fontSize: 10.5, fontWeight: 700, color: '#6B7280',
  letterSpacing: '.06em', textTransform: 'uppercase',
  background: '#FAFAFA',
};

export default function InsightsPage() {
  const [range, setRange] = useState<Range>('month');

  const appts = useMemo(() => {
    if (range === 'week') {
      const d = new Date(); d.setDate(d.getDate() - 6);
      const from = d.toISOString().slice(0, 10);
      return MOCK_APPOINTMENTS.filter(a => a.date >= from && a.date <= TODAY);
    }
    if (range === 'last30') {
      const d = new Date(); d.setDate(d.getDate() - 30);
      const from = d.toISOString().slice(0, 10);
      return MOCK_APPOINTMENTS.filter(a => a.date >= from);
    }
    return MOCK_APPOINTMENTS;
  }, [range]);

  const total      = appts.length;
  const completed  = appts.filter(a => a.status === 'completed').length;
  const pending    = appts.filter(a => a.status === 'pending').length;
  const noshow     = appts.filter(a => a.status === 'no-show').length;
  const compRate   = total ? Math.round((completed / total) * 100) : 0;
  const noshowRate = total ? Math.round((noshow / total) * 100) : 0;

  const revenue    = useMemo(() => appts.reduce((s, a) => s + (SPECIALTY_FEE[a.specialty] ?? 1200), 0), [appts]);
  const avgRevenue = total ? Math.round(revenue / total) : 0;

  const upcomingIds = useMemo(() => new Set(
    MOCK_APPOINTMENTS
      .filter(a => a.date >= TODAY && (a.status === 'confirmed' || a.status === 'pending'))
      .map(a => a.patientId)
  ), []);
  const activePatients   = MOCK_PATIENTS.filter(p => upcomingIds.has(p.id)).length;
  const inactivePatients = MOCK_PATIENTS.length - activePatients;
  const activeRate       = MOCK_PATIENTS.length ? Math.round((activePatients / MOCK_PATIENTS.length) * 100) : 0;

  const fmtPhp = (n: number) => `₱${n.toLocaleString()}`;
  const fmtK   = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n);

  // Line chart data
  const apptTrendData = MONTHLY_TREND.map(d => ({ label: d.month, a: d.appointments, b: d.newPatients }));
  const revTrendData  = MONTHLY_TREND.map(d => ({ label: d.month, a: d.revenue }));

  // Status donut
  const statusDonut = [
    { label: 'Confirmed', value: appts.filter(a => a.status === 'confirmed').length, color: '#16A34A' },
    { label: 'Pending',   value: pending,                                             color: '#F59E0B' },
    { label: 'Completed', value: completed,                                           color: '#5B65DC' },
    { label: 'Cancelled', value: appts.filter(a => a.status === 'cancelled').length, color: '#EF4444' },
    { label: 'No-show',   value: noshow,                                             color: '#FB7185' },
  ];

  // Specialty performance
  const specialtyPerf = useMemo(() =>
    Array.from(new Set(MOCK_APPOINTMENTS.map(a => a.specialty))).map(spec => {
      const sa  = appts.filter(a => a.specialty === spec);
      const fee = SPECIALTY_FEE[spec] ?? 1200;
      return {
        name: spec, total: sa.length, revenue: sa.length * fee,
        rate: sa.length ? Math.round((sa.filter(a => a.status === 'completed').length / sa.length) * 100) : 0,
      };
    }).sort((a, b) => b.revenue - a.revenue),
    [appts]
  );
  const specRevMax = Math.max(...specialtyPerf.map(s => s.revenue), 1);

  // Branch performance
  const BRANCHES_LIST = ['City Clinic', 'North Branch', 'East Clinic', 'West Branch', 'South Clinic'];
  const branchPerf = useMemo(() =>
    BRANCHES_LIST.map(b => {
      const ba  = appts.filter(a => a.branch === b);
      const rev = ba.reduce((s, a) => s + (SPECIALTY_FEE[a.specialty] ?? 1200), 0);
      return {
        name: b, total: ba.length, revenue: rev,
        rate: ba.length ? Math.round((ba.filter(a => a.status === 'completed').length / ba.length) * 100) : 0,
      };
    }),
    [appts]
  );
  const branchMax = Math.max(...branchPerf.map(b => b.total), 1);

  // Insurance payer mix
  const INS_LIST = ['Maxicare', 'MediCard', 'PhilHealth', 'Intellicare', 'Insular Health', 'Cocolife'];
  const INS_COLORS = ['#5B65DC', '#0EA5E9', '#16A34A', '#F59E0B', '#EC4899', '#8B5CF6'];
  const insData = useMemo(() =>
    INS_LIST.map(ins => {
      const ia = appts.filter(a => a.insurance === ins);
      return { name: ins, count: ia.length, revenue: ia.reduce((s, a) => s + (SPECIALTY_FEE[a.specialty] ?? 1200), 0) };
    }).sort((a, b) => b.count - a.count),
    [appts]
  );
  const insMax = Math.max(...insData.map(d => d.count), 1);

  // Frequency buckets
  const freqBuckets = [
    { label: '1 visit',  count: MOCK_PATIENTS.filter(p => p.totalVisits === 1).length,                       color: '#C7CAEF', tip: 'First-time patients with exactly 1 recorded visit' },
    { label: '2–4',      count: MOCK_PATIENTS.filter(p => p.totalVisits >= 2 && p.totalVisits <= 4).length, color: '#5B65DC', tip: 'Returning patients with 2 to 4 visits' },
    { label: '5–9',      count: MOCK_PATIENTS.filter(p => p.totalVisits >= 5 && p.totalVisits <= 9).length, color: '#0EA5E9', tip: 'Regular patients with 5 to 9 visits' },
    { label: '10+',      count: MOCK_PATIENTS.filter(p => p.totalVisits >= 10).length,                       color: '#16A34A', tip: 'Highly loyal patients with 10 or more visits' },
  ];
  const freqMax = Math.max(...freqBuckets.map(b => b.count), 1);

  // Dynamic insight callout
  const topSpec    = specialtyPerf[0];
  const topBranch  = branchPerf.sort((a, b) => b.total - a.total)[0];
  const rangeLabel = range === 'week' ? 'this week' : range === 'month' ? 'this month' : 'the last 30 days';

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#F4F6F9' }}>
      <div className="px-5 py-4">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-extrabold" style={{ color: '#111827' }}>Insights &amp; Analytics</h2>
            <p className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>
              Performance overview · hover <span className="material-icons-outlined" style={{ fontSize: 11, verticalAlign: 'middle' }}>info</span> icons for explanations
            </p>
          </div>
          <div className="flex gap-1" role="group" aria-label="Date range filter">
            {([['week', 'This Week'], ['month', 'All Time'], ['last30', 'Last 30 Days']] as [Range, string][]).map(([v, l]) => (
              <button key={v} onClick={() => setRange(v)}
                aria-pressed={range === v}
                title={`Show data for ${l.toLowerCase()}`}
                className="border-0 cursor-pointer font-semibold text-[12px]"
                style={{ height: 32, padding: '0 14px', borderRadius: 6, fontFamily: "'Poppins',sans-serif",
                  background: range === v ? '#5B65DC' : '#fff', color: range === v ? '#fff' : '#6B7280',
                  border: range === v ? '1px solid #5B65DC' : '1px solid #E4E8EF', transition: 'all .15s' }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI row: 4 cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
          <KpiCard
            label="Total Appointments" val={total}
            sub={`${pending} awaiting review`}
            icon="event_note" color="#5B65DC" bg="#EEEFFD"
            tooltip={`Total appointments recorded for ${rangeLabel}. Sub-count shows those still pending helpdesk review.`}
          />
          <KpiCard
            label="Completion Rate" val={`${compRate}%`}
            sub={`${noshowRate}% no-show rate`}
            icon="task_alt" color="#16A34A" bg="#ECFDF5"
            tooltip="Percentage of appointments marked Completed out of all appointments in the selected period. Higher is better. No-show rate is those who didn't arrive."
            progress={compRate}
          />
          <KpiCard
            label="Est. Revenue" val={fmtPhp(revenue)}
            sub={`Avg ${fmtPhp(avgRevenue)} per appointment`}
            icon="payments" color="#D97706" bg="#FEF3C7"
            tooltip="Estimated revenue based on standard consultation fees per specialty. Actual billing may differ. Average shows revenue per appointment."
          />
          <KpiCard
            label="Active Patients" val={`${activePatients} / ${MOCK_PATIENTS.length}`}
            sub={`${activeRate}% have upcoming appointments`}
            icon="groups" color="#0EA5E9" bg="#E0F2FE"
            tooltip="Active = patients with at least one confirmed or pending appointment scheduled from today onwards. Inactive patients have no upcoming slots."
            progress={activeRate}
          />
        </div>

        {/* ── Insight callout ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-5">
          {topSpec && (
            <Callout
              icon="star"
              text={`${topSpec.name} is the top-earning specialty at ${fmtPhp(topSpec.revenue)} with ${topSpec.total} appointment${topSpec.total !== 1 ? 's' : ''}.`}
              color="#D97706" bg="#FFFBEB"
            />
          )}
          {topBranch && (
            <Callout
              icon="location_city"
              text={`${topBranch.name} is the busiest branch with ${topBranch.total} appointment${topBranch.total !== 1 ? 's' : ''} this period.`}
              color="#5B65DC" bg="#EEEFFD"
            />
          )}
          <Callout
            icon={noshowRate >= 20 ? 'warning' : 'check_circle'}
            text={noshowRate >= 20
              ? `No-show rate is ${noshowRate}% — consider sending reminders to reduce missed appointments.`
              : `No-show rate is ${noshowRate}% — within a healthy range. Keep up patient communication.`}
            color={noshowRate >= 20 ? '#EF4444' : '#16A34A'}
            bg={noshowRate >= 20 ? '#FEF2F2' : '#ECFDF5'}
          />
        </div>

        {/* ── Trend charts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead
              title="Appointment Trend"
              sub="Monthly volume Jan–Jun 2026"
              tooltip="Total appointments per month (solid line) vs. new patients (dashed). Helps spot growth or seasonal dips."
            />
            <LineChart data={apptTrendData} colorA="#5B65DC" colorB="#0EA5E9"
              labelA="Total" labelB="New Patients"
              title="Monthly appointment trend"
            />
          </div>
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead
              title="Revenue Trend (₱)"
              sub="Estimated monthly revenue Jan–Jun 2026"
              tooltip="Estimated revenue per month based on specialty fees. Useful for spotting high-revenue periods and planning staffing."
            />
            <LineChart data={revTrendData} colorA="#16A34A" labelA="Revenue (₱)"
              formatY={fmtK} title="Monthly revenue trend"
            />
          </div>
        </div>

        {/* ── Status + Patient activity ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          {/* Status donut */}
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead
              title="By Appointment Status"
              tooltip="Breakdown of all appointments in the selected period by their current status. Hover each arc to see count and percentage."
            />
            <div className="mt-3">
              <DonutChart
                segments={statusDonut.filter(s => s.value > 0)}
                size={148} thickness={16} richLegend
              />
            </div>
          </div>

          {/* Patient activity */}
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead
              title="Patient Activity"
              tooltip="Active patients have at least one confirmed or pending appointment from today onwards. Visit frequency shows how often patients return."
            />
            {/* Active vs Inactive visual */}
            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-[11.5px] font-semibold" style={{ color: '#5B65DC' }}>
                  {activePatients} Active
                  <InfoTip tip="Patients with upcoming confirmed or pending appointments" />
                </span>
                <span className="text-[11.5px] font-semibold" style={{ color: '#EF4444' }}>
                  {inactivePatients} Inactive
                  <InfoTip tip="Patients with no upcoming appointments" />
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: '#F1F5F9' }}>
                <div title={`Active: ${activePatients} (${activeRate}%)`}
                  style={{ width: `${activeRate}%`, background: '#5B65DC', transition: 'width .4s', borderRadius: '6px 0 0 6px' }} />
                <div title={`Inactive: ${inactivePatients} (${100 - activeRate}%)`}
                  style={{ flex: 1, background: '#FCA5A5', borderRadius: '0 6px 6px 0' }} />
              </div>
              <div className="flex justify-between text-[10.5px] mt-1" style={{ color: '#9CA3AF' }}>
                <span>{activeRate}%</span>
                <span>{100 - activeRate}%</span>
              </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#9CA3AF' }}>
              Visit Frequency
              <InfoTip tip="How many patients fall into each visit count bucket. 10+ means loyal, repeat patients." />
            </div>
            {freqBuckets.map(b => (
              <div key={b.label} className="flex items-center gap-2 mb-2.5" title={b.tip}>
                <span className="text-[11.5px] font-medium shrink-0" style={{ color: '#374151', width: 38 }}>{b.label}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: '#F4F6F9' }}>
                  <div className="h-2 rounded-full" style={{ width: `${(b.count / freqMax) * 100}%`, background: b.color, transition: 'width .4s' }} />
                </div>
                <span className="text-[11.5px] font-bold shrink-0" style={{ color: '#111827', width: 20, textAlign: 'right' }}>{b.count}</span>
              </div>
            ))}
          </div>

          {/* Insurance payer mix */}
          <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <SectionHead
              title="Insurance Payer Mix"
              tooltip="How appointments are distributed across insurance providers. Longer bar = more appointments from that insurer."
            />
            <div className="flex flex-col gap-3">
              {insData.map((ins, i) => {
                const color = INS_COLORS[i % INS_COLORS.length];
                return (
                  <div key={ins.name} title={`${ins.name}: ${ins.count} appointment${ins.count !== 1 ? 's' : ''} · ${fmtPhp(ins.revenue)} est. revenue`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-semibold" style={{ color: '#374151' }}>{ins.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]" style={{ color: '#9CA3AF' }}>{ins.count} appts</span>
                        <span className="text-[11.5px] font-bold" style={{ color }}>{fmtPhp(ins.revenue)}</span>
                      </div>
                    </div>
                    <MiniBar value={ins.count} max={insMax} color={color} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Specialty + Branch tables ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Specialty performance */}
          <div className="bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <div className="px-5 py-3.5" style={{ borderBottom: '1px solid #E4E8EF' }}>
              <SectionHead
                title="Specialty Performance"
                sub="Revenue & completion rate per specialty"
                tooltip="Completion rate = appointments marked Completed ÷ total in the period. Color-coded: green ≥70%, amber 40–69%, red <40%."
              />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} role="grid" aria-label="Specialty performance table">
              <thead>
                <tr>
                  {[
                    { h: 'Specialty', tip: 'Medical specialty name' },
                    { h: 'Appts',     tip: 'Number of appointments in selected period' },
                    { h: 'Revenue',   tip: 'Estimated revenue based on standard fee per specialty' },
                    { h: 'Completion', tip: 'Percentage of appointments completed. Green ≥70%, amber 40–69%, red <40%' },
                  ].map(({ h, tip }, i, arr) => (
                    <th key={h} scope="col"
                      style={{ ...TH, borderRight: i < arr.length - 1 ? undefined : 'none' }}>
                      <span title={tip}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specialtyPerf.map((s, idx) => (
                  <tr key={s.name}
                    title={`${s.name}: ${s.total} appointments, ${fmtPhp(s.revenue)} revenue, ${s.rate}% completion`}
                    style={{ background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ ...TD, fontWeight: 600, color: '#111827' }}>{s.name}</td>
                    <td style={{ ...TD, textAlign: 'center' }}>
                      <div className="flex items-center gap-2 justify-center">
                        <MiniBar value={s.revenue} max={specRevMax} color="#5B65DC" />
                        <span className="shrink-0">{s.total}</span>
                      </div>
                    </td>
                    <td style={{ ...TD, color: '#16A34A', fontWeight: 600 }}>{fmtPhp(s.revenue)}</td>
                    <td style={{ ...TD, borderRight: 'none', textAlign: 'center' }}>
                      <RateBadge rate={s.rate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Branch performance */}
          <div className="bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <div className="px-5 py-3.5" style={{ borderBottom: '1px solid #E4E8EF' }}>
              <SectionHead
                title="Branch Performance"
                sub="Appointment volume & completion per branch"
                tooltip="Each branch row shows how busy it is (bar), total count, estimated revenue, and completion rate."
              />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }} role="grid" aria-label="Branch performance table">
              <thead>
                <tr>
                  {[
                    { h: 'Branch',      tip: 'Clinic or branch name' },
                    { h: 'Volume',      tip: 'Bar shows relative appointment count vs. busiest branch' },
                    { h: 'Revenue',     tip: 'Estimated revenue for this branch in the selected period' },
                    { h: 'Completion',  tip: 'Completion rate: done ÷ total. Green ≥70%, amber 40–69%, red <40%' },
                  ].map(({ h, tip }, i, arr) => (
                    <th key={h} scope="col"
                      style={{ ...TH, borderRight: i < arr.length - 1 ? undefined : 'none' }}>
                      <span title={tip}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {branchPerf.map((b, idx) => (
                  <tr key={b.name}
                    title={`${b.name}: ${b.total} appointments, ${fmtPhp(b.revenue)} revenue, ${b.rate}% completion`}
                    style={{ background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                    <td style={{ ...TD, fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' }}>{b.name}</td>
                    <td style={{ ...TD }}>
                      <div className="flex items-center gap-2">
                        <MiniBar value={b.total} max={branchMax} color="#5B65DC" />
                        <span className="text-[12px] font-bold shrink-0" style={{ color: '#374151' }}>{b.total}</span>
                      </div>
                    </td>
                    <td style={{ ...TD, color: '#16A34A', fontWeight: 600 }}>{fmtPhp(b.revenue)}</td>
                    <td style={{ ...TD, borderRight: 'none', textAlign: 'center' }}>
                      <RateBadge rate={b.rate} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
