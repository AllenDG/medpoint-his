import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  MOCK_APPOINTMENTS, WEEKLY_DATA, ACTIVITY_LOG, ACTIVITY_ICON, STATUS_META, TODAY,
} from '../data/mock';
import { DOCS, BRANCHES, INS_LIST, TIMES } from '@/features/public-site/data/constants';
import { useUIStore } from '@/store/ui.store';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { EmptyState } from '@/components/shared/EmptyState';

const APPT_TYPES = ['General Consult', 'Follow-up', 'New Patient', 'Check-up', 'Consult', 'Emergency'] as const;
type QueueFilter = 'all' | 'confirmed' | 'pending';

function fmtDate(ds: string): string {
  return new Date(ds + 'T00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── SVG Bar Chart ─────────────────────────────────────────────────────────────
function BarChart() {
  const maxVal = Math.max(...WEEKLY_DATA.map(d => d.count), 1);
  const BAR_W = 32, GAP = 24, PAD = 20, CH = 100;
  const SVG_W = PAD * 2 + WEEKLY_DATA.length * BAR_W + (WEEKLY_DATA.length - 1) * GAP;
  const SVG_H = CH + 36;
  const peak = WEEKLY_DATA.reduce((a, b) => b.count > a.count ? b : a);

  return (
    <div>
      <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full"
        role="img"
        aria-label={`Weekly appointments. Peak: ${peak.day} with ${peak.count} appointment${peak.count !== 1 ? 's' : ''}`}>
        <title>Weekly appointment counts</title>
        {[0, 50, 100].map(p => {
          const y = CH * (1 - p / 100);
          return <line key={p} x1={0} y1={y} x2={SVG_W} y2={y} stroke="#F1F5F9" strokeWidth={1} />;
        })}
        {WEEKLY_DATA.map((d, i) => {
          const x   = PAD + i * (BAR_W + GAP);
          const pct = d.count / maxVal;
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
      <p className="sr-only">
        {WEEKLY_DATA.map(d => `${d.day}: ${d.count}`).join(', ')}.
        Highest: {peak.day} with {peak.count} appointment{peak.count !== 1 ? 's' : ''}.
      </p>
    </div>
  );
}

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
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
  const ariaLabel = `Status: ${data.filter(d => d.value > 0).map(d => `${d.value} ${d.label.toLowerCase()}`).join(', ')}`;

  return (
    <div>
      <div className="flex items-center gap-5">
        <svg width={148} height={148} viewBox="0 0 128 128" className="shrink-0"
          role="img" aria-label={ariaLabel}>
          <title>Appointment status — {total} total</title>
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
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          {data.map(d => {
            const pct = total ? Math.round((d.value / total) * 100) : 0;
            return (
              <div key={d.label} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
                <span className="text-[12px] flex-1 truncate" style={{ color: '#64748B' }}>{d.label}</span>
                <span className="text-[12px] font-bold shrink-0" style={{ color: '#122056' }}>{d.value}</span>
                <span className="text-[10.5px] shrink-0 w-7 text-right" style={{ color: '#9CA3AF' }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="sr-only">{ariaLabel}. Total: {total}.</p>
    </div>
  );
}

// ─── Dashboard full-page skeleton ─────────────────────────────────────────────
function DashboardSkeleton() {
  const P = { background: '#F1F5F9', borderRadius: 4 } as const;
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-pulse" style={{ background: '#F4F6F9' }}>
      <div className="px-5 py-4">
        {/* welcome bar */}
        <div className="mb-5 bg-white px-5 py-4" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div style={{ ...P, height: 10, width: 140, marginBottom: 8 }} />
          <div style={{ ...P, height: 22, width: 220, marginBottom: 8 }} />
          <div style={{ ...P, height: 10, width: 180 }} />
        </div>
        {/* stat cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
              <div style={{ ...P, width: 40, height: 40, borderRadius: 8, marginBottom: 12 }} />
              <div style={{ ...P, height: 26, width: 48, marginBottom: 8 }} />
              <div style={{ ...P, height: 10, width: 110, marginBottom: 6 }} />
              <div style={{ ...P, height: 9, width: 80 }} />
            </div>
          ))}
        </div>
        {/* charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4" style={{ border: '1px solid #E4E8EF', borderRadius: 8, height: 200 }}>
              <div style={{ ...P, height: 12, width: 120, marginBottom: 12 }} />
              <div style={{ ...P, height: 150, borderRadius: 6 }} />
            </div>
          ))}
        </div>
        {/* queue rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
              <div className="px-5 py-3" style={{ borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ ...P, height: 12, width: 120 }} />
              </div>
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <div style={{ ...P, width: 32, height: 32, borderRadius: '50%' }} />
                  <div className="flex-1">
                    <div style={{ ...P, height: 11, width: 120, marginBottom: 6 }} />
                    <div style={{ ...P, height: 9, width: 160 }} />
                  </div>
                  <div style={{ ...P, height: 22, width: 60, borderRadius: 4 }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ selected, onSelect }: { selected: string; onSelect: (ds: string) => void }) {
  const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  const apptsByDate = MOCK_APPOINTMENTS.reduce<Record<string, typeof MOCK_APPOINTMENTS>>((acc, a) => {
    if (!acc[a.date]) acc[a.date] = [];
    acc[a.date].push(a);
    return acc;
  }, {});

  const [hovered, setHovered] = useState<{ ds: string; x: number; y: number } | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const monthName = now.toLocaleDateString('en-US', { month: 'long' });

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(day => (
          <div key={day} className="text-center text-[9.5px] font-bold py-1" style={{ color: '#94A3B8' }}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5" role="grid" aria-label={`${monthName} ${year} calendar`}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} role="gridcell" />;
          const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayAppts   = apptsByDate[ds] ?? [];
          const count      = dayAppts.length;
          const isTodayDate = ds === TODAY;
          const isSelected  = ds === selected;
          return (
            <button key={i} role="gridcell"
              onClick={() => onSelect(ds)}
              onMouseEnter={e => {
                clearTimeout(hideTimer.current);
                if (count > 0) {
                  const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                  setHovered({ ds, x: rect.left, y: rect.bottom + 6 });
                }
              }}
              onMouseLeave={() => { hideTimer.current = setTimeout(() => setHovered(null), 120); }}
              aria-label={`${monthName} ${day}${count > 0 ? `, ${count} appointment${count > 1 ? 's' : ''}` : ''}${isTodayDate ? ', today' : ''}${isSelected ? ', selected' : ''}`}
              aria-pressed={isSelected}
              className="relative flex items-center justify-center text-[11px] font-medium"
              style={{
                height: 26,
                background: isSelected ? '#122056' : isTodayDate ? '#5B65DC' : 'transparent',
                color: (isSelected || isTodayDate) ? '#fff' : count > 0 ? '#122056' : '#94A3B8',
                fontWeight: count > 0 || isTodayDate ? 700 : 400,
                borderRadius: 4, border: 'none', cursor: 'pointer',
                fontFamily: "'Poppins',sans-serif",
              }}>
              {day}
              {count > 0 && !isTodayDate && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#5B65DC' }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Appointment hover popover */}
      {hovered && (apptsByDate[hovered.ds] ?? []).length > 0 && (
        <div className="fixed z-[300] bg-white overflow-hidden"
          style={{ left: hovered.x, top: hovered.y, width: 230, borderRadius: 8, border: '1px solid #E4E8EF', boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}
          onMouseEnter={() => clearTimeout(hideTimer.current)}
          onMouseLeave={() => setHovered(null)}>
          <div className="px-3 py-2" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
            <div className="text-[11px] font-bold" style={{ color: '#5B65DC' }}>
              {new Date(hovered.ds + 'T00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
            <div className="text-[10px]" style={{ color: '#9CA3AF' }}>
              {(apptsByDate[hovered.ds] ?? []).length} appointment{(apptsByDate[hovered.ds] ?? []).length !== 1 ? 's' : ''}
            </div>
          </div>
          {(apptsByDate[hovered.ds] ?? []).slice(0, 5).map(a => (
            <div key={a.id} className="flex items-center gap-2.5 px-3 py-2"
              style={{ borderBottom: '1px solid #F8FAFC' }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_META[a.status]?.text ?? '#94A3B8' }} />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold truncate" style={{ color: '#111827' }}>{a.patientName}</div>
                <div className="text-[10px]" style={{ color: '#9CA3AF' }}>{a.time} · {a.doctorName}</div>
              </div>
            </div>
          ))}
          {(apptsByDate[hovered.ds] ?? []).length > 5 && (
            <div className="px-3 py-1.5 text-[10.5px]" style={{ color: '#9CA3AF', background: '#FAFAFA' }}>
              +{(apptsByDate[hovered.ds] ?? []).length - 5} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ onClose }: { onClose: () => void }) {
  const addToast = useUIStore(s => s.addToast);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);

  const [form, setForm] = useState({
    patientName: '', phone: '', email: '', doctorId: '1',
    date: TODAY, time: '9:00 AM', branch: 'City Clinic',
    type: 'General Consult', insurance: 'Maxicare', notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n; });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.patientName.trim()) errs.patientName = 'Patient name is required';
    if (!form.date)               errs.date        = 'Date is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    addToast({ type: 'success', message: `Appointment booked for ${form.patientName}` });
    onClose();
  }

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4"
      style={{ background: 'rgba(18,32,86,.5)', backdropFilter: 'blur(3px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="booking-title"
        className="bg-white w-full max-w-[540px] overflow-hidden"
        style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div id="booking-title" className="text-[14px] font-bold" style={{ color: '#122056' }}>New Appointment</div>
          <button onClick={onClose} aria-label="Close dialog"
            className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer rounded"
            style={{ color: '#94A3B8', border: '1px solid #E4E8EF', borderRadius: 6 }}>
            <span className="material-icons-outlined" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>
        <form className="px-6 py-4 grid grid-cols-2 gap-3" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>PATIENT NAME *</label>
            <input className="f-input text-[13px]" placeholder="Full name"
              value={form.patientName} onChange={e => setField('patientName', e.target.value)}
              aria-required="true" aria-describedby={errors.patientName ? 'err-name' : undefined}
              style={errors.patientName ? { borderColor: '#EF4444' } : undefined} />
            {errors.patientName && (
              <p id="err-name" className="text-[10.5px] mt-0.5" style={{ color: '#EF4444' }}>{errors.patientName}</p>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>PHONE</label>
            <input className="f-input text-[13px]" placeholder="09xx-xxx-xxxx"
              value={form.phone} onChange={e => setField('phone', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>EMAIL</label>
            <input className="f-input text-[13px]" type="email" placeholder="patient@email.com"
              value={form.email} onChange={e => setField('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>DOCTOR *</label>
            <select className="f-input text-[13px]" value={form.doctorId} onChange={e => setField('doctorId', e.target.value)}>
              {DOCS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>BRANCH *</label>
            <select className="f-input text-[13px]" value={form.branch} onChange={e => setField('branch', e.target.value)}>
              {BRANCHES.map(b => <option key={b.name}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>DATE *</label>
            <input type="date" className="f-input text-[13px]"
              value={form.date} onChange={e => setField('date', e.target.value)} min={TODAY}
              aria-required="true" aria-describedby={errors.date ? 'err-date' : undefined}
              style={errors.date ? { borderColor: '#EF4444' } : undefined} />
            {errors.date && (
              <p id="err-date" className="text-[10.5px] mt-0.5" style={{ color: '#EF4444' }}>{errors.date}</p>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>TIME *</label>
            <select className="f-input text-[13px]" value={form.time} onChange={e => setField('time', e.target.value)}>
              {TIMES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>TYPE</label>
            <select className="f-input text-[13px]" value={form.type} onChange={e => setField('type', e.target.value)}>
              {APPT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>INSURANCE</label>
            <select className="f-input text-[13px]" value={form.insurance} onChange={e => setField('insurance', e.target.value)}>
              {INS_LIST.map(ins => <option key={ins}>{ins}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-bold mb-1" style={{ color: '#64748B' }}>NOTES / CHIEF COMPLAINT</label>
            <textarea className="f-textarea text-[13px]" rows={2} placeholder="Reason for visit…"
              value={form.notes} onChange={e => setField('notes', e.target.value)} />
          </div>
          <div className="col-span-2 flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 h-9 font-semibold text-[13px] bg-transparent border-0 cursor-pointer"
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

// ─── Activity Log Drawer ────────────────────────────────────────────────────────
function ActivityDrawer({ onClose }: { onClose: () => void }) {
  const drawerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(drawerRef, true);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-[600]" onClick={onClose}
        style={{ background: 'rgba(0,0,0,.2)' }} aria-hidden="true" />
      <div ref={drawerRef} className="fixed inset-y-0 right-0 z-[601] flex flex-col bg-white w-[320px] sm:w-[380px]"
        role="dialog" aria-modal="true" aria-labelledby="activity-title"
        style={{ borderLeft: '1px solid #E4E8EF', boxShadow: '-8px 0 32px rgba(0,0,0,.08)' }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div id="activity-title" className="text-[13px] font-bold" style={{ color: '#122056' }}>Activity Log</div>
          <button onClick={onClose} aria-label="Close activity log"
            className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer"
            style={{ color: '#94A3B8', border: '1px solid #E4E8EF', borderRadius: 6 }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {ACTIVITY_LOG.length === 0
            ? <EmptyState message="No activity recorded yet." />
            : (
              <div className="flex flex-col gap-0">
                {ACTIVITY_LOG.map((log, i) => {
                  const meta = ACTIVITY_ICON[log.type];
                  return (
                    <div key={log.id} className="flex gap-3 relative">
                      {i < ACTIVITY_LOG.length - 1 && (
                        <div className="absolute left-[13px] top-7 bottom-0 w-px"
                          style={{ background: '#E4E8EF' }} />
                      )}
                      <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 z-10 mt-0.5"
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
            )
          }
        </div>
      </div>
    </>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
// ─── Skeleton loading card ──────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white p-5 animate-pulse" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
      <div className="w-10 h-10 rounded-lg mb-3" style={{ background: '#F1F5F9' }} />
      <div className="h-7 w-12 rounded mb-2" style={{ background: '#F1F5F9' }} />
      <div className="h-3 w-28 rounded mb-1.5" style={{ background: '#F1F5F9' }} />
      <div className="h-2.5 w-20 rounded" style={{ background: '#F1F5F9' }} />
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addToast = useUIStore(s => s.addToast);
  const [showBooking,    setShowBooking]    = useState(false);
  const [showActivity,   setShowActivity]   = useState(false);
  const [dismissed,      setDismissed]      = useState(false);
  const [queueFilter,    setQueueFilter]    = useState<QueueFilter>('all');
  const [calDate,        setCalDate]        = useState<string>(TODAY);
  const [apptUpdates,    setApptUpdates]    = useState<Record<string, string>>({});
  const [loading,        setLoading]        = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  function resolveStatus(a: { id: string; status: string }) { return apptUpdates[a.id] ?? a.status; }

  function handleAccept(a: { id: string; patientName: string; status: string }) {
    Swal.fire({
      title: 'Accept appointment?',
      html: `<span style="font-family:'Poppins',sans-serif;font-size:13px;color:#6B7280">
        <strong>${a.patientName}</strong>'s appointment will be confirmed and added to today's schedule.</span>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Accept',
      cancelButtonText: 'Back',
      confirmButtonColor: '#5B65DC',
      cancelButtonColor: '#64748B',
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        setApptUpdates(u => ({ ...u, [a.id]: 'confirmed' }));
        addToast({ type: 'success', message: `${a.patientName}'s appointment accepted` });
      }
    });
  }
  function handleDecline(a: { id: string; patientName: string }) {
    Swal.fire({
      title: 'Decline appointment?',
      html: `<span style="font-family:'Poppins',sans-serif;font-size:13px;color:#6B7280">
        <strong>${a.patientName}</strong>'s appointment will be marked as cancelled.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, decline it',
      cancelButtonText: 'Keep',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      reverseButtons: true,
    }).then(result => {
      if (result.isConfirmed) {
        setApptUpdates(u => ({ ...u, [a.id]: 'cancelled' }));
        addToast({ type: 'warning', message: `${a.patientName}'s appointment declined` });
      }
    });
  }

  const allAppts       = MOCK_APPOINTMENTS.map(a => ({ ...a, status: resolveStatus(a) }));
  const todayAppts     = allAppts.filter(a => a.date === TODAY);
  const pendingAppts   = allAppts.filter(a => a.status === 'pending');
  const completedToday = todayAppts.filter(a => a.status === 'completed');
  const upcomingToday  = todayAppts.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const noShowToday    = todayAppts.filter(a => a.status === 'no-show');
  const yesterdayDate  = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); })();
  const todayDiff      = todayAppts.length - MOCK_APPOINTMENTS.filter(a => a.date === yesterdayDate).length;

  const queueAppts = allAppts.filter(a => {
    if (a.date !== calDate) return false;
    if (queueFilter === 'confirmed') return a.status === 'confirmed';
    if (queueFilter === 'pending')   return a.status === 'pending';
    return a.status === 'confirmed' || a.status === 'pending';
  });
  const isToday = calDate === TODAY;

  const weekLabel = WEEKLY_DATA.length >= 7
    ? `${fmtDate(WEEKLY_DATA[0].date)} – ${fmtDate(WEEKLY_DATA[6].date)}, ${new Date().getFullYear()}`
    : '';

  const weekTotal = MOCK_APPOINTMENTS.filter(a =>
    WEEKLY_DATA.length >= 7 && a.date >= WEEKLY_DATA[0].date && a.date <= WEEKLY_DATA[6].date
  ).length;
  const todayProgress = todayAppts.length ? Math.round((completedToday.length / todayAppts.length) * 100) : 0;

  const STATS: {
    label: string; icon: string; color: string; bg: string;
    val: string | number; sub: string; trend: string;
    progress?: number; onClick?: () => void;
  }[] = [
    {
      label: "Today's Schedule", icon: 'calendar_today', color: '#5B65DC', bg: '#EEEFFD',
      val: `${completedToday.length} / ${todayAppts.length}`,
      sub: `${upcomingToday.length} still upcoming`,
      trend: `${todayProgress}% done`,
      progress: todayProgress,
      onClick: () => navigate(`/helpdesk/appointments?date=${TODAY}`),
    },
    {
      label: 'Pending Review', icon: 'pending_actions', color: '#D97706', bg: '#FEF3C7',
      val: pendingAppts.length,
      sub: pendingAppts.length > 0 ? 'Needs helpdesk action' : 'All clear',
      trend: pendingAppts.length > 5 ? 'High volume' : pendingAppts.length > 0 ? 'Action required' : 'No pending',
      onClick: () => navigate('/helpdesk/appointments?status=pending'),
    },
    {
      label: 'Week Total', icon: 'date_range', color: '#0EA5E9', bg: '#E0F2FE',
      val: weekTotal,
      sub: weekLabel,
      trend: todayDiff > 0 ? `↑ ${todayDiff} vs yesterday` : todayDiff < 0 ? `↓ ${Math.abs(todayDiff)} vs yesterday` : '→ Same as yesterday',
      onClick: () => navigate('/helpdesk/appointments'),
    },
    {
      label: 'No-shows Today', icon: 'person_off', color: '#EF4444', bg: '#FEE2E2',
      val: noShowToday.length,
      sub: noShowToday.length > 0 ? 'Send follow-up reminders' : 'None today — great!',
      trend: noShowToday.length === 0 ? '✓ Good' : noShowToday.length <= 2 ? 'Monitor' : '⚠ High',
      onClick: () => navigate('/helpdesk/patients'),
    },
  ];

  const QUICK = [
    { icon: 'add',        label: 'Book Appointment', action: () => setShowBooking(true),                                     color: '#5B65DC' },
    { icon: 'pending',    label: 'Pending Review',   action: () => navigate('/helpdesk/appointments?status=pending'),        color: '#D97706' },
    { icon: 'event_note', label: 'Today Schedule',   action: () => navigate(`/helpdesk/appointments?date=${TODAY}`),        color: '#0EA5E9' },
    { icon: 'history',    label: 'Activity Log',     action: () => setShowActivity(true),                                   color: '#8B5CF6' },
    { icon: 'print',      label: 'Print Schedule',   action: () => window.print(),                                          color: '#64748B' },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4" style={{ background: '#F4F6F9' }}>

      {/* Welcome */}
      <div className="mb-5 bg-white px-5 py-4 flex items-center justify-between"
        style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
        <div>
          <div className="text-[10.5px] font-bold uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-[22px] font-extrabold" style={{ color: '#111827' }}>
            {(() => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; })()}, {user?.name?.split(' ')[0] ?? 'there'}!
          </div>
          <div className="text-[12.5px] mt-0.5" style={{ color: '#6B7280' }}>
            {upcomingToday.length > 0
              ? <>Next: <strong>{upcomingToday[0].patientName}</strong> at {upcomingToday[0].time} · {upcomingToday[0].doctorName}</>
              : todayAppts.length > 0 ? 'All appointments for today are done.' : 'No appointments scheduled today.'}
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full text-[11.5px] font-semibold"
          style={{ background: '#EEEFFD', color: '#5B65DC' }}>
          <span className="material-icons-outlined" style={{ fontSize: 14 }}>local_hospital</span>
          MedPoint HIS
        </div>
      </div>


      {/* Quick actions */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {QUICK.map((q, i) => (
          <button key={q.label} onClick={q.action} title={q.label}
            className="flex items-center gap-2 border-0 cursor-pointer transition-colors"
            style={{
              height: 34, padding: '0 14px', background: '#fff',
              border: '1px solid #E4E8EF', borderRadius: 6,
              fontSize: 12.5, fontWeight: 600, color: '#374151', fontFamily: "'Poppins',sans-serif",
              animation: `cardIn .3s ease ${i * 0.04}s both`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = q.color; (e.currentTarget as HTMLButtonElement).style.color = q.color; (e.currentTarget as HTMLButtonElement).style.background = `${q.color}0D`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E4E8EF'; (e.currentTarget as HTMLButtonElement).style.color = '#374151'; (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}>
            <span className="material-icons-outlined" style={{ fontSize: 16, color: q.color }}>{q.icon}</span>
            <span className="hidden sm:inline">{q.label}</span>
          </button>
        ))}
        <div className="ml-auto text-[11.5px] flex items-center gap-1" style={{ color: '#94A3B8' }}>
          <span className="material-icons-outlined" style={{ fontSize: 13 }}>sync</span>
          just now
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {STATS.map((s, i) => (
          <button key={s.label} onClick={s.onClick}
            className="bg-white p-5 text-left w-full"
            style={{
              border: '1px solid #E4E8EF', borderRadius: 8,
              animation: `cardIn .4s ease ${i * 0.07}s both`,
              cursor: s.onClick ? 'pointer' : 'default',
              transition: 'box-shadow .15s, border-color .15s',
              fontFamily: "'Poppins',sans-serif",
            }}
            onMouseEnter={e => { if (s.onClick) { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${s.color}22`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${s.color}55`; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E4E8EF'; }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 flex items-center justify-center shrink-0"
                style={{ background: s.bg, borderRadius: 10 }}>
                <span className="material-icons-outlined" style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
              </div>
              <span className="text-[10.5px] font-semibold px-2 py-0.5 shrink-0"
                style={{ background: s.bg, color: s.color, borderRadius: 20 }}>
                {s.trend}
              </span>
            </div>
            <div className="text-[26px] font-extrabold leading-none mb-1" style={{ color: '#111827' }}>
              <span aria-live="polite" aria-atomic="true">{s.val}</span>
            </div>
            <div className="text-[11.5px] font-semibold" style={{ color: '#374151' }}>{s.label}</div>
            <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{s.sub}</div>
            {s.progress !== undefined && (
              <div className="mt-3">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                  <div style={{
                    width: `${s.progress}%`, height: '100%',
                    background: s.progress === 100 ? '#16A34A' : s.color,
                    borderRadius: 6, transition: 'width .5s ease',
                  }} />
                </div>
              </div>
            )}
            {s.onClick && (
              <div className="flex items-center gap-0.5 mt-2.5 text-[11px] font-semibold" style={{ color: s.color }}>
                View details <span className="material-icons-outlined" style={{ fontSize: 13 }}>chevron_right</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">

        {/* Bar chart */}
        <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[13px] font-bold" style={{ color: '#111827' }}>Weekly Appointments</div>
              <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{weekLabel}</div>
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
          <div className="text-[13px] font-bold mb-0.5" style={{ color: '#111827' }}>By Status</div>
          <div className="text-[11px] mb-3" style={{ color: '#9CA3AF' }}>All appointments</div>
          <DonutChart />
        </div>

        {/* Mini calendar */}
        <div className="bg-white p-5" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div className="text-[13px] font-bold mb-1" style={{ color: '#111827' }}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <div className="text-[11px] mb-3" style={{ color: '#9CA3AF' }}>Click a date to filter queue</div>
          <MiniCalendar selected={calDate} onSelect={setCalDate} />
          <div className="flex items-center gap-2 mt-3 text-[10.5px]" style={{ color: '#9CA3AF' }}>
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: '#5B65DC' }} />
            Blue dot = has appointments
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

        {/* Queue */}
        <div className="bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid #F1F5F9' }}>
            <div className="text-[13px] font-bold" style={{ color: '#111827' }}>
              {isToday ? "Today's Queue" : `Queue · ${fmtDate(calDate)}`}
            </div>
            <button onClick={() => navigate('/helpdesk/appointments')}
              className="text-[11.5px] font-semibold bg-transparent border-0 cursor-pointer"
              style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
              View all →
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 px-5 pt-3 pb-1">
            {(['all', 'confirmed', 'pending'] as QueueFilter[]).map(f => (
              <button key={f} onClick={() => setQueueFilter(f)}
                aria-pressed={queueFilter === f}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border-0 cursor-pointer"
                style={{
                  background: queueFilter === f ? '#5B65DC' : '#F4F6F9',
                  color: queueFilter === f ? '#fff' : '#64748B',
                  fontFamily: "'Poppins',sans-serif",
                }}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            {!isToday && (
              <button onClick={() => setCalDate(TODAY)}
                className="ml-auto text-[11px] font-semibold bg-transparent border-0 cursor-pointer"
                style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>
                ← Today
              </button>
            )}
          </div>

          {queueAppts.length === 0
            ? <div className="px-5 py-8 text-center text-[12px]" style={{ color: '#9CA3AF' }}>
                No {queueFilter !== 'all' ? `${queueFilter} ` : ''}appointments {isToday ? 'today' : 'on this date'}
              </div>
            : queueAppts.map(a => {
                const meta = STATUS_META[a.status as keyof typeof STATUS_META];
                const isPending = a.status === 'pending';
                return (
                  <div key={a.id} className="flex items-center gap-3 px-5 py-3"
                    style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-semibold" style={{ color: '#111827' }}>{a.patientName}</div>
                      <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{a.doctorName} · {a.specialty} · {a.time}</div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isPending ? (
                        <>
                          <button onClick={() => handleAccept(a)}
                            title="Accept appointment"
                            className="w-7 h-7 flex items-center justify-center border-0 cursor-pointer"
                            style={{ background: '#ECFDF5', color: '#16A34A', borderRadius: 6 }}>
                            <span className="material-icons-outlined" style={{ fontSize: 15 }}>check</span>
                          </button>
                          <button onClick={() => handleDecline(a)}
                            title="Decline appointment"
                            className="w-7 h-7 flex items-center justify-center border-0 cursor-pointer"
                            style={{ background: '#FEE2E2', color: '#EF4444', borderRadius: 6 }}>
                            <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
                          </button>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold px-1.5 py-0.5"
                          style={{ background: meta?.bg, color: meta?.text, borderRadius: 4 }}>
                          <span className="material-icons-outlined" style={{ fontSize: 11 }}>{meta?.icon}</span>
                          {meta?.label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
          }
        </div>

        {/* Pending tasks */}
        <div className="bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
          <div className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid #F1F5F9' }}>
            <div className="text-[13px] font-bold" style={{ color: '#111827' }}>Pending Review</div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded"
              style={{ background: '#FEF3C7', color: '#D97706', borderRadius: 4 }}>
              <span aria-live="polite" aria-atomic="true">{pendingAppts.length}</span> items
            </span>
          </div>
          {pendingAppts.length === 0
            ? <div className="px-5 py-8 text-center text-[12px]" style={{ color: '#9CA3AF' }}>All caught up!</div>
            : pendingAppts.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3"
                style={{ borderBottom: '1px solid #F8FAFC' }}>
                <div className="w-1.5 h-8 shrink-0" style={{ background: '#F59E0B', borderRadius: 2 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold" style={{ color: '#111827' }}>{a.patientName}</div>
                  <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{a.date} · {a.time} · {a.branch}</div>
                </div>
                <button onClick={() => navigate('/helpdesk/appointments')}
                  className="text-[11px] font-semibold px-2.5 py-1 border-0 cursor-pointer shrink-0"
                  style={{ background: '#EEEFFD', color: '#5B65DC', borderRadius: 4, fontFamily: "'Poppins',sans-serif" }}>
                  Review
                </button>
              </div>
            ))
          }
        </div>
      </div>

      {/* Dismissible no-show alert */}
      {noShowToday.length > 0 && !dismissed && (
        <div role="alert" className="flex items-center gap-3 mt-3 px-4 py-3"
          style={{ background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8 }}>
          <span className="material-icons-outlined shrink-0" style={{ fontSize: 17, color: '#EF4444' }}>warning</span>
          <span className="text-[12.5px] font-semibold" style={{ color: '#991B1B' }}>
            {noShowToday.length} no-show{noShowToday.length > 1 ? 's' : ''} recorded today.
          </span>
          <span className="text-[12px]" style={{ color: '#B91C1C' }}>
            Send follow-up reminders to affected patients.
          </span>
          <button onClick={() => setDismissed(true)} aria-label="Dismiss alert"
            className="ml-auto w-6 h-6 flex items-center justify-center bg-transparent border-0 cursor-pointer shrink-0"
            style={{ color: '#EF4444', borderRadius: 4 }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
          </button>
        </div>
      )}

      {showBooking  && <BookingModal onClose={() => setShowBooking(false)} />}
      {showActivity && <ActivityDrawer onClose={() => setShowActivity(false)} />}
    </div>
  );
}
