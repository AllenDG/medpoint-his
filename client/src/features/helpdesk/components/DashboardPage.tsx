import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_APPOINTMENTS, MOCK_PATIENTS, WEEKLY_DATA, SPECIALTY_DATA,
  ACTIVITY_LOG, ACTIVITY_ICON, STATUS_META, type Appointment,
} from '../data/mock';
import { DOCS, BRANCHES, INS_LIST, TIMES } from '@/features/public-site/data/constants';

const TODAY = '2026-06-22';
const APPT_TYPES = ['General Consult', 'Follow-up', 'New Patient', 'Check-up', 'Consult', 'Emergency'] as const;

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function BarChart() {
  const maxVal = Math.max(...WEEKLY_DATA.map(d => d.count));
  const BAR_W  = 32, GAP = 24, PAD = 20;
  const CH = 100;
  const SVG_W = PAD * 2 + WEEKLY_DATA.length * BAR_W + (WEEKLY_DATA.length - 1) * GAP;
  const SVG_H = CH + 36;

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full">
      {/* Guides */}
      {[0, 50, 100].map(p => {
        const y = CH * (1 - p / 100);
        return <line key={p} x1={0} y1={y} x2={SVG_W} y2={y} stroke="#F1F5F9" strokeWidth={1} />;
      })}
      {WEEKLY_DATA.map((d, i) => {
        const x   = PAD + i * (BAR_W + GAP);
        const pct = maxVal ? d.count / maxVal : 0;
        const bH  = Math.max(pct * CH, d.count > 0 ? 4 : 2);
        const y   = CH - bH;
        const isT = d.date === TODAY;
        return (
          <g key={d.day}>
            <rect x={x} y={0} width={BAR_W} height={CH} rx={4} fill="#F8FAFC" />
            <rect x={x} y={y} width={BAR_W} height={bH} rx={4} fill={isT ? '#5B65DC' : '#C7CAEF'} />
            {d.count > 0 && (
              <text x={x + BAR_W / 2} y={y - 6} textAnchor="middle"
                fontSize={10} fontWeight="700" fill={isT ? '#5B65DC' : '#94A3B8'}
                fontFamily="Poppins,sans-serif">{d.count}</text>
            )}
            <text x={x + BAR_W / 2} y={SVG_H - 4} textAnchor="middle"
              fontSize={10} fontWeight={isT ? '700' : '500'}
              fill={isT ? '#122056' : '#94A3B8'}
              fontFamily="Poppins,sans-serif">{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── SVG Donut Chart ─────────────────────────────────────────────────────────
function DonutChart() {
  const appts = MOCK_APPOINTMENTS;
  const data = [
    { label: 'Confirmed', value: appts.filter(a => a.status === 'confirmed').length,  color: '#16A34A' },
    { label: 'Pending',   value: appts.filter(a => a.status === 'pending').length,    color: '#F59E0B' },
    { label: 'Completed', value: appts.filter(a => a.status === 'completed').length,  color: '#5B65DC' },
    { label: 'Cancelled', value: appts.filter(a => a.status === 'cancelled').length,  color: '#EF4444' },
    { label: 'No-show',   value: appts.filter(a => a.status === 'no-show').length,    color: '#FB7185' },
  ];
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 48, CX = 64, CY = 64, TH = 14;
  const C = 2 * Math.PI * R;
  let off = 0;
  const segs = data.map(d => {
    const len = total > 0 ? (d.value / total) * C : 0;
    const s   = { ...d, len, off };
    off += len;
    return s;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={128} height={128} viewBox="0 0 128 128" className="flex-shrink-0">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F1F5F9" strokeWidth={TH} />
        {segs.map((s, i) => s.len > 0 && (
          <circle key={i} cx={CX} cy={CY} r={R} fill="none"
            stroke={s.color} strokeWidth={TH}
            strokeDasharray={`${s.len} ${C - s.len}`}
            strokeDashoffset={-s.off}
            transform={`rotate(-90 ${CX} ${CY})`} />
        ))}
        <text x={CX} y={CY - 5} textAnchor="middle" fontSize={18} fontWeight="800" fill="#122056" fontFamily="Poppins,sans-serif">{total}</text>
        <text x={CX} y={CY + 11} textAnchor="middle" fontSize={9} fill="#94A3B8" fontFamily="Poppins,sans-serif">appointments</text>
      </svg>
      <div className="flex flex-col gap-2 text-[12px]">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: d.color }} />
            <span style={{ color: '#64748B', minWidth: 64 }}>{d.label}</span>
            <span className="font-bold ml-auto" style={{ color: '#122056' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Mini Calendar (read-only density view) ───────────────────────────────────
function MiniCalendar() {
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const firstDow = new Date(2026, 5, 1).getDay(); // Monday = 1
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: 30 }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  const apptDates = MOCK_APPOINTMENTS.reduce<Record<string, number>>((acc, a) => {
    acc[a.date] = (acc[a.date] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[9.5px] font-bold py-1" style={{ color: '#94A3B8' }}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const ds = `2026-06-${String(day).padStart(2, '0')}`;
          const count = apptDates[ds] ?? 0;
          const isToday = ds === TODAY;
          return (
            <div key={i} className="relative flex items-center justify-center rounded text-[11px] font-medium"
              style={{
                height: 26,
                background: isToday ? '#5B65DC' : 'transparent',
                color: isToday ? '#fff' : count > 0 ? '#122056' : '#94A3B8',
                fontWeight: count > 0 ? 700 : 400,
                borderRadius: 4,
              }}>
              {day}
              {count > 0 && !isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: '#5B65DC' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookingModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    patientName: '', phone: '', email: '', doctorId: '1',
    date: TODAY, time: '9:00 AM', branch: 'City Clinic',
    type: 'General Consult', insurance: 'Maxicare', notes: '',
  });
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center" style={{ background: 'rgba(18,32,86,.5)', backdropFilter: 'blur(3px)' }}>
      <div className="bg-white w-full max-w-[540px] overflow-hidden" style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div className="text-[14px] font-bold" style={{ color: '#122056' }}>New Appointment</div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer rounded"
            style={{ color: '#94A3B8', border: '1px solid #E4E8EF', borderRadius: 6 }}>
            <span className="material-icons-outlined" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>
        <form className="px-6 py-4 grid grid-cols-2 gap-3" onSubmit={e => { e.preventDefault(); onClose(); }}>
          <div><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>PATIENT NAME *</label>
            <input className="f-input text-[13px]" placeholder="Full name" value={form.patientName} onChange={e => set('patientName', e.target.value)} required /></div>
          <div><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>PHONE</label>
            <input className="f-input text-[13px]" placeholder="09xx-xxx-xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
          <div className="col-span-2"><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>EMAIL</label>
            <input className="f-input text-[13px]" type="email" placeholder="patient@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
          <div><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>DOCTOR *</label>
            <select className="f-input text-[13px]" value={form.doctorId} onChange={e => set('doctorId', e.target.value)}>
              {DOCS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
            </select></div>
          <div><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>BRANCH *</label>
            <select className="f-input text-[13px]" value={form.branch} onChange={e => set('branch', e.target.value)}>
              {BRANCHES.map(b => <option key={b.name}>{b.name}</option>)}
            </select></div>
          <div><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>DATE *</label>
            <input type="date" className="f-input text-[13px]" value={form.date} onChange={e => set('date', e.target.value)} min={TODAY} required /></div>
          <div><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>TIME *</label>
            <select className="f-input text-[13px]" value={form.time} onChange={e => set('time', e.target.value)}>
              {TIMES.map(t => <option key={t}>{t}</option>)}
            </select></div>
          <div><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>TYPE</label>
            <select className="f-input text-[13px]" value={form.type} onChange={e => set('type', e.target.value)}>
              {APPT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select></div>
          <div><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>INSURANCE</label>
            <select className="f-input text-[13px]" value={form.insurance} onChange={e => set('insurance', e.target.value)}>
              {INS_LIST.map(i => <option key={i}>{i}</option>)}
            </select></div>
          <div className="col-span-2"><label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>NOTES / CHIEF COMPLAINT</label>
            <textarea className="f-textarea text-[13px]" rows={2} placeholder="Reason for visit…" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
          <div className="col-span-2 flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 h-9 rounded font-semibold text-[13px] bg-transparent border-0 cursor-pointer"
              style={{ background: '#F4F6F9', color: '#64748B', fontFamily: "'Poppins',sans-serif", borderRadius: 6 }}>
              Cancel
            </button>
            <button type="submit" className="btn-p flex-1 h-9 text-[13px] justify-center" style={{ borderRadius: 6 }}>
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Activity Log Drawer ──────────────────────────────────────────────────────
function ActivityDrawer({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-[600]" onClick={onClose} style={{ background: 'rgba(0,0,0,.2)' }} />
      <div className="fixed inset-y-0 right-0 z-[601] flex flex-col bg-white w-[380px]"
        style={{ borderLeft: '1px solid #E4E8EF', boxShadow: '-8px 0 32px rgba(0,0,0,.08)' }}>
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div className="text-[13px] font-bold" style={{ color: '#122056' }}>Activity Log</div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer"
            style={{ color: '#94A3B8', border: '1px solid #E4E8EF', borderRadius: 6 }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-0">
            {ACTIVITY_LOG.map((log, i) => {
              const meta = ACTIVITY_ICON[log.type];
              return (
                <div key={log.id} className="flex gap-3 relative">
                  {/* Timeline line */}
                  {i < ACTIVITY_LOG.length - 1 && (
                    <div className="absolute left-[13px] top-7 bottom-0 w-px" style={{ background: '#E4E8EF' }} />
                  )}
                  <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 z-10 mt-0.5"
                    style={{ background: `${meta.color}15`, borderRadius: 6 }}>
                    <span className="material-icons-outlined" style={{ fontSize: 14, color: meta.color }}>{meta.icon}</span>
                  </div>
                  <div className="pb-5">
                    <div className="text-[12.5px] leading-[1.5]" style={{ color: '#374151' }}>{log.action}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{log.user} · {log.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const [showBooking,  setShowBooking]  = useState(false);
  const [showActivity, setShowActivity] = useState(false);

  const todayAppts   = MOCK_APPOINTMENTS.filter(a => a.date === TODAY);
  const pendingAppts = MOCK_APPOINTMENTS.filter(a => a.status === 'pending');
  const completedToday = todayAppts.filter(a => a.status === 'completed');
  const upcomingToday  = todayAppts.filter(a => a.status === 'confirmed' || a.status === 'pending');

  const STATS = [
    { label: "Today's Appointments", val: todayAppts.length, sub: `${completedToday.length} done · ${upcomingToday.length} upcoming`, icon: 'calendar_today', color: '#5B65DC', bg: '#EEEFFD', trend: '+2 vs yesterday' },
    { label: 'Pending Review',       val: pendingAppts.length, sub: 'Needs helpdesk action', icon: 'pending_actions', color: '#D97706', bg: '#FEF3C7', trend: 'Action required' },
    { label: 'Week Total',           val: MOCK_APPOINTMENTS.filter(a => a.date >= '2026-06-22').length, sub: 'Jun 22–28',  icon: 'date_range',     color: '#0EA5E9', bg: '#E0F2FE', trend: '+12% vs last week' },
    { label: 'No-shows Today',       val: todayAppts.filter(a => a.status === 'no-show').length,        sub: 'Follow-up needed', icon: 'person_off', color: '#EF4444', bg: '#FEE2E2', trend: 'Monitor' },
  ];

  const QUICK = [
    { icon: 'add',          label: 'Book Appointment', action: () => setShowBooking(true),                        color: '#5B65DC' },
    { icon: 'pending',      label: 'Pending Review',   action: () => navigate('/helpdesk/appointments'),          color: '#D97706' },
    { icon: 'event_note',   label: 'Today Schedule',   action: () => navigate('/helpdesk/appointments'),          color: '#0EA5E9' },
    { icon: 'history',      label: 'Activity Log',     action: () => setShowActivity(true),                      color: '#8B5CF6' },
    { icon: 'print',        label: 'Print Schedule',   action: () => window.print(),                             color: '#64748B' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ background: '#F4F6F9' }}>

      {/* Quick actions */}
      <div className="flex items-center gap-2 mb-5">
        {QUICK.map(q => (
          <button
            key={q.label}
            onClick={q.action}
            title={q.label}
            className="flex items-center gap-2 border-0 cursor-pointer transition-colors"
            style={{
              height: 34,
              padding: '0 14px',
              background: '#fff',
              border: '1px solid #E4E8EF',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 600,
              color: '#374151',
              fontFamily: "'Poppins',sans-serif",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = q.color; (e.currentTarget as HTMLButtonElement).style.color = q.color; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E4E8EF'; (e.currentTarget as HTMLButtonElement).style.color = '#374151'; }}
          >
            <span className="material-icons-outlined" style={{ fontSize: 16, color: q.color }}>{q.icon}</span>
            {q.label}
          </button>
        ))}
        <div className="ml-auto text-[11.5px]" style={{ color: '#94A3B8' }}>Last synced: just now</div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {STATS.map(s => (
          <div key={s.label} className="bg-white p-4" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: s.bg, borderRadius: 6 }}>
                <span className="material-icons-outlined" style={{ fontSize: 17, color: s.color }}>{s.icon}</span>
              </div>
              <span className="text-[10.5px] font-semibold px-2 py-0.5" style={{ background: '#F4F6F9', color: '#64748B', borderRadius: 4 }}>
                {s.trend}
              </span>
            </div>
            <div className="text-[28px] font-extrabold leading-none mb-1" style={{ color: '#111827' }}>{s.val}</div>
            <div className="text-[12px] font-semibold" style={{ color: '#374151' }}>{s.label}</div>
            <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(200px,260px) minmax(180px,220px)' }}>

        {/* Bar chart */}
        <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[13px] font-bold" style={{ color: '#111827' }}>Weekly Appointments</div>
              <div className="text-[11px]" style={{ color: '#9CA3AF' }}>Jun 22–28, 2026</div>
            </div>
            <div className="flex gap-3 text-[11px]">
              <span className="flex items-center gap-1" style={{ color: '#64748B' }}>
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#5B65DC' }} /> Today
              </span>
              <span className="flex items-center gap-1" style={{ color: '#64748B' }}>
                <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#C7CAEF' }} /> Other
              </span>
            </div>
          </div>
          <BarChart />
        </div>

        {/* Donut chart */}
        <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div className="text-[13px] font-bold mb-1" style={{ color: '#111827' }}>By Status</div>
          <div className="text-[11px] mb-4" style={{ color: '#9CA3AF' }}>All appointments</div>
          <DonutChart />
        </div>

        {/* Mini calendar */}
        <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div className="text-[13px] font-bold mb-1" style={{ color: '#111827' }}>June 2026</div>
          <div className="text-[11px] mb-3" style={{ color: '#9CA3AF' }}>Appointment density</div>
          <MiniCalendar />
          <div className="flex items-center gap-2 mt-3 text-[10.5px]" style={{ color: '#9CA3AF' }}>
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: '#5B65DC' }} />
            Blue dot = has appointments
          </div>
        </div>
      </div>

      {/* Bottom row: Today's queue + Pending tasks */}
      <div className="grid grid-cols-2 gap-3">

        {/* Today's queue */}
        <div className="bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <div className="text-[13px] font-bold" style={{ color: '#111827' }}>Today's Queue</div>
            <button onClick={() => navigate('/helpdesk/appointments')}
              className="text-[11.5px] font-semibold bg-transparent border-0 cursor-pointer"
              style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
              View all →
            </button>
          </div>
          {upcomingToday.length === 0
            ? <div className="px-5 py-8 text-center text-[12px]" style={{ color: '#9CA3AF' }}>No upcoming appointments today</div>
            : upcomingToday.map(a => {
              const meta = STATUS_META[a.status];
              return (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-semibold" style={{ color: '#111827' }}>{a.patientName}</div>
                    <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{a.doctorName} · {a.specialty}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[12px] font-bold" style={{ color: '#374151' }}>{a.time}</div>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: meta.bg, color: meta.text, borderRadius: 4 }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                      {meta.label}
                    </span>
                  </div>
                </div>
              );
            })
          }
        </div>

        {/* Pending tasks */}
        <div className="bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <div className="text-[13px] font-bold" style={{ color: '#111827' }}>Pending Review</div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded"
              style={{ background: '#FEF3C7', color: '#D97706', borderRadius: 4 }}>
              {pendingAppts.length} items
            </span>
          </div>
          {pendingAppts.length === 0
            ? <div className="px-5 py-8 text-center text-[12px]" style={{ color: '#9CA3AF' }}>All caught up!</div>
            : pendingAppts.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #F8FAFC' }}>
                <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: '#F59E0B', borderRadius: 2 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold" style={{ color: '#111827' }}>{a.patientName}</div>
                  <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{a.date} · {a.time} · {a.branch}</div>
                </div>
                <button
                  onClick={() => navigate('/helpdesk/appointments')}
                  className="text-[11px] font-semibold px-2.5 py-1 border-0 cursor-pointer"
                  style={{ background: '#EEEFFD', color: '#5B65DC', borderRadius: 4, fontFamily: "'Poppins',sans-serif" }}>
                  Review
                </button>
              </div>
            ))
          }
        </div>
      </div>

      {/* Alerts banner (only if no-shows exist) */}
      {MOCK_APPOINTMENTS.filter(a => a.status === 'no-show' && a.date === TODAY).length > 0 && (
        <div className="flex items-center gap-3 mt-3 px-4 py-3" style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8 }}>
          <span className="material-icons-outlined" style={{ fontSize: 17, color: '#EF4444' }}>warning</span>
          <span className="text-[12.5px] font-semibold" style={{ color: '#991B1B' }}>
            {MOCK_APPOINTMENTS.filter(a => a.status === 'no-show' && a.date === TODAY).length} no-show(s) recorded today.
          </span>
          <span className="text-[12px]" style={{ color: '#B91C1C' }}>Send follow-up reminders to affected patients.</span>
        </div>
      )}

      {showBooking  && <BookingModal onClose={() => setShowBooking(false)} />}
      {showActivity && <ActivityDrawer onClose={() => setShowActivity(false)} />}
    </div>
  );
}
