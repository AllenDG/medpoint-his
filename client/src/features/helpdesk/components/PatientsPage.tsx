import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, STATUS_META, type Patient } from '../data/mock';

type PatFilter = 'all' | 'active' | 'frequent' | 'new' | 'noshows';

// ── Patient context menu ──────────────────────────────────────────────────────
function CtxMenu({ x, y, patient, onProfile, onHistory, onClose }: {
  x: number; y: number; patient: Patient;
  onProfile: () => void; onHistory: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });
  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    setPos({ x: x + width > window.innerWidth ? x - width : x, y: y + height > window.innerHeight ? y - height : y });
  }, [x, y]);
  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => { if (e instanceof KeyboardEvent && e.key !== 'Escape') return; onClose(); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [onClose]);
  function Item({ icon, label, onClick, color = '#374151' }: { icon: string; label: string; onClick: () => void; color?: string }) {
    return (
      <button onClick={onClick} role="menuitem" className="w-full flex items-center gap-2.5 px-3 py-2 border-0 cursor-pointer text-left text-[12.5px] font-medium"
        style={{ background: 'transparent', color, fontFamily: "'Poppins',sans-serif" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F8FAFC'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
        <span className="material-icons-outlined" style={{ fontSize: 15, color }}>{icon}</span>{label}
      </button>
    );
  }
  return (
    <div ref={ref} role="menu" aria-label={`Actions for ${patient.name}`}
      className="fixed z-[800] bg-white py-1"
      style={{ left: pos.x, top: pos.y, width: 190, borderRadius: 8, border: '1px solid #E4E8EF', boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}
      onMouseDown={e => e.stopPropagation()}>
      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div className="text-[11.5px] font-bold" style={{ color: '#111827' }}>{patient.name}</div>
        <div className="text-[10.5px]" style={{ color: '#9CA3AF' }}>{patient.id}</div>
      </div>
      <Item icon="person"      label="View Profile"          onClick={onProfile} />
      <Item icon="event_note"  label="Appointment History"   onClick={onHistory} />
      <div style={{ height: 1, background: '#F1F5F9', margin: '4px 0' }} />
      <Item icon="edit"        label="Edit Details"          onClick={onClose} />
      <Item icon="local_hospital" label="Book Appointment"   onClick={onClose} color="#5B65DC" />
    </div>
  );
}

// ── Patient detail panel ──────────────────────────────────────────────────────
function PatientPanel({ patient, onClose, showHistory }: { patient: Patient; onClose: () => void; showHistory?: boolean }) {
  const [tab,     setTab]     = useState<'profile' | 'history'>(showHistory ? 'history' : 'profile');
  const [visible, setVisible] = useState(false);

  const appts     = MOCK_APPOINTMENTS.filter(a => a.patientId === patient.id);
  const hasActive = appts.some(a => a.status === 'confirmed' || a.status === 'pending');
  const completed = appts.filter(a => a.status === 'completed').length;

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 260);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[499]" onClick={handleClose}
        style={{ background: 'rgba(0,0,0,.25)', opacity: visible ? 1 : 0, transition: 'opacity .26s ease' }} />

      {/* Slide-in panel */}
      <div role="dialog" aria-modal="true" aria-label={`Patient: ${patient.name}`}
        className="fixed inset-y-0 right-0 z-[500] flex flex-col bg-white"
        style={{
          width: 460,
          boxShadow: '-16px 0 48px rgba(0,0,0,.14)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .26s cubic-bezier(.4,0,.2,1)',
          overflow: 'hidden',
        }}>

        {/* ── White header ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E4E8EF', flexShrink: 0 }}>

          {/* Top row: avatar + name + close */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold shrink-0"
                style={{ background: `hsl(${patient.hue} 55% 55%)`, fontSize: 15 }}>
                {patient.initials}
              </div>
              <div>
                <div className="text-[14.5px] font-bold leading-tight" style={{ color: '#111827' }}>{patient.name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10.5px] font-semibold px-1.5 py-px"
                    style={{ background: '#EEEFFD', color: '#5B65DC', borderRadius: 4 }}>
                    {patient.id}
                  </span>
                  <span className="text-[10.5px]" style={{ color: '#D1D5DB' }}>·</span>
                  <span className="text-[10.5px]" style={{ color: '#9CA3AF' }}>
                    {patient.gender === 'F' ? 'Female' : 'Male'}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={handleClose} aria-label="Close panel"
              className="w-7 h-7 flex items-center justify-center border-0 cursor-pointer shrink-0"
              style={{ background: '#F4F6F9', color: '#6B7280', borderRadius: 6 }}>
              <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
            </button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 mx-5 mb-4 overflow-hidden"
            style={{ borderRadius: 8, border: '1px solid #E4E8EF', background: '#F8FAFC' }}>
            {[
              { label: 'Total Visits', val: patient.totalVisits, color: '#5B65DC' },
              { label: 'Completed',    val: completed,           color: '#16A34A' },
              { label: 'Status',       val: hasActive ? 'Active' : 'Inactive', color: hasActive ? '#16A34A' : '#94A3B8' },
            ].map((s, i) => (
              <div key={s.label} className="flex flex-col items-center py-3"
                style={{ borderRight: i < 2 ? '1px solid #E4E8EF' : 'none' }}>
                <div className="text-[16px] font-extrabold" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex" style={{ borderTop: '1px solid #F1F5F9' }}>
            {(['profile', 'history'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 h-9 border-0 cursor-pointer font-semibold text-[12px]"
                style={{
                  background: 'transparent',
                  color: tab === t ? '#5B65DC' : '#9CA3AF',
                  borderBottom: tab === t ? '2px solid #5B65DC' : '2px solid transparent',
                  fontFamily: "'Poppins',sans-serif",
                  transition: 'color .15s',
                }}>
                {t === 'history' ? `Appt. History (${appts.length})` : 'Profile'}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto" style={{ background: '#F4F6F9' }}>
          {tab === 'profile' ? (
            <div className="p-4 flex flex-col gap-3">

              {/* Contact */}
              <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid #E4E8EF' }}>
                <div className="px-4 py-2" style={{ background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Contact</span>
                </div>
                {[
                  { icon: 'phone',       label: 'Phone',   val: patient.phone   },
                  { icon: 'email',       label: 'Email',   val: patient.email   },
                  { icon: 'location_on', label: 'Address', val: patient.address },
                ].map((r, i, arr) => (
                  <div key={r.label} className="flex items-start gap-3 px-4 py-3"
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: '#EEEFFD', borderRadius: 6 }}>
                      <span className="material-icons-outlined" style={{ fontSize: 14, color: '#5B65DC' }}>{r.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10.5px]" style={{ color: '#9CA3AF' }}>{r.label}</div>
                      <div className="text-[12.5px] font-semibold mt-0.5 leading-snug" style={{ color: '#111827' }}>{r.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Personal + Insurance grid */}
              <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid #E4E8EF' }}>
                <div className="px-4 py-2" style={{ background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Personal Details</span>
                </div>
                <div className="grid grid-cols-2">
                  {[
                    { icon: 'badge',             label: 'Patient ID',   val: patient.id },
                    { icon: 'cake',              label: 'Date of Birth', val: patient.dob },
                    { icon: 'wc',                label: 'Gender',       val: patient.gender === 'F' ? 'Female' : 'Male' },
                    { icon: 'health_and_safety', label: 'Insurance',    val: patient.insurance },
                  ].map((r, i) => (
                    <div key={r.label} className="flex items-start gap-2.5 px-4 py-3"
                      style={{
                        borderBottom: i < 2 ? '1px solid #F8FAFC' : 'none',
                        borderRight:  i % 2 === 0 ? '1px solid #F8FAFC' : 'none',
                      }}>
                      <span className="material-icons-outlined" style={{ fontSize: 15, color: '#9CA3AF', marginTop: 2, flexShrink: 0 }}>{r.icon}</span>
                      <div className="min-w-0">
                        <div className="text-[10.5px]" style={{ color: '#9CA3AF' }}>{r.label}</div>
                        <div className="text-[12px] font-semibold mt-0.5 leading-snug" style={{ color: '#111827' }}>{r.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visit summary */}
              <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid #E4E8EF' }}>
                <div className="px-4 py-2" style={{ background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Visit Summary</span>
                </div>
                <div className="grid grid-cols-3">
                  {[
                    { label: 'Total Visits',  val: String(patient.totalVisits), color: '#5B65DC' },
                    { label: 'Last Visit',    val: patient.lastVisit,            color: '#374151' },
                    { label: 'Patient Since', val: patient.dob.slice(0, 4),      color: '#374151' },
                  ].map((s, i) => (
                    <div key={s.label} className="flex flex-col items-center py-4"
                      style={{ borderRight: i < 2 ? '1px solid #F1F5F9' : 'none' }}>
                      <div className="text-[18px] font-extrabold" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-[10.5px] mt-0.5" style={{ color: '#9CA3AF' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active status badge */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg"
                style={{
                  border: `1px solid ${hasActive ? '#BBF7D0' : '#E4E8EF'}`,
                  background: hasActive ? '#ECFDF5' : '#F8FAFC',
                }}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ background: hasActive ? '#D1FAE5' : '#F1F5F9', borderRadius: 8 }}>
                  <span className="material-icons-outlined" style={{ fontSize: 16, color: hasActive ? '#16A34A' : '#94A3B8' }}>
                    {hasActive ? 'event_available' : 'event_busy'}
                  </span>
                </div>
                <div>
                  <div className="text-[12.5px] font-bold" style={{ color: hasActive ? '#15803D' : '#64748B' }}>
                    {hasActive ? 'Active Patient' : 'No Upcoming Appointments'}
                  </div>
                  <div className="text-[11px]" style={{ color: hasActive ? '#16A34A' : '#94A3B8' }}>
                    {hasActive ? 'Has confirmed or pending appointment' : 'Schedule an appointment to re-activate'}
                  </div>
                </div>
              </div>
            </div>

          ) : (
            <div className="p-4 flex flex-col gap-2.5">
              {appts.length === 0 ? (
                <div className="py-14 flex flex-col items-center gap-2">
                  <div className="w-14 h-14 flex items-center justify-center rounded-full"
                    style={{ background: '#F1F5F9' }}>
                    <span className="material-icons-outlined" style={{ fontSize: 28, color: '#CBD5E1' }}>event_busy</span>
                  </div>
                  <div className="text-[13px] font-semibold mt-1" style={{ color: '#6B7280' }}>No appointments</div>
                  <div className="text-[11.5px]" style={{ color: '#9CA3AF' }}>No records found for this patient</div>
                </div>
              ) : appts.map(a => {
                const meta = STATUS_META[a.status];
                return (
                  <div key={a.id} className="bg-white rounded-lg overflow-hidden"
                    style={{ border: '1px solid #E4E8EF' }}>
                    <div className="flex items-center justify-between px-4 py-2.5"
                      style={{ borderBottom: '1px solid #F8FAFC', background: '#FAFAFA' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11.5px] font-bold" style={{ color: '#5B65DC' }}>{a.id}</span>
                        <span style={{ color: '#D1D5DB', fontSize: 10 }}>·</span>
                        <span className="text-[11px] font-medium" style={{ color: '#6B7280' }}>{a.date}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5"
                        style={{ background: meta.bg, color: meta.text, borderRadius: 3 }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                        {meta.label}
                      </span>
                    </div>
                    <div className="px-4 py-3">
                      <div className="text-[13px] font-semibold mb-1" style={{ color: '#111827' }}>{a.doctorName}</div>
                      <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11.5px]" style={{ color: '#64748B' }}>
                        <span>{a.specialty}</span>
                        <span style={{ color: '#D1D5DB' }}>·</span>
                        <span>{a.branch}</span>
                        <span style={{ color: '#D1D5DB' }}>·</span>
                        <span>{a.time}</span>
                        <span style={{ color: '#D1D5DB' }}>·</span>
                        <span>{a.type}</span>
                      </div>
                      {a.notes && (
                        <div className="text-[11px] mt-2 italic leading-relaxed"
                          style={{ color: '#94A3B8', borderTop: '1px solid #F8FAFC', paddingTop: 8 }}>
                          "{a.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-2 px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid #E4E8EF', background: '#fff' }}>
          <button onClick={handleClose}
            className="flex-1 h-9 border-0 cursor-pointer font-semibold text-[12.5px]"
            style={{ background: '#F4F6F9', color: '#374151', borderRadius: 6, fontFamily: "'Poppins',sans-serif" }}>
            Close
          </button>
          <button className="flex-1 btn-p h-9 text-[12.5px] justify-center" style={{ borderRadius: 6 }}>
            <span className="material-icons-outlined" style={{ fontSize: 14 }}>add</span>
            Book Appointment
          </button>
        </div>
      </div>
    </>
  );
}

// ── Table styles ──────────────────────────────────────────────────────────────
const TD: React.CSSProperties = {
  padding: '9px 14px',
  borderBottom: '1px solid #E4E8EF',
  borderRight: '1px solid #E4E8EF',
  fontSize: 12.5,
  color: '#374151',
  fontFamily: "'Poppins',sans-serif",
  verticalAlign: 'middle',
};
const TH: React.CSSProperties = {
  padding: '10px 14px',
  borderBottom: '2px solid #E4E8EF',
  borderRight: '1px solid #E4E8EF',
  fontSize: 10.5,
  fontWeight: 700,
  color: '#94A3B8',
  letterSpacing: '.07em',
  textTransform: 'uppercase',
  background: '#FAFAFA',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  whiteSpace: 'nowrap',
  textAlign: 'left',
  fontFamily: "'Poppins',sans-serif",
};

function PageSkeleton() {
  const P = { background: '#F1F5F9', borderRadius: 4 } as const;
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 px-5 pt-4 pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white px-4 py-3" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <div style={{ ...P, height: 10, width: 80, marginBottom: 8 }} />
            <div className="flex items-center justify-between gap-2">
              <div style={{ ...P, height: 26, width: 40 }} />
              <div style={{ ...P, width: 36, height: 36, borderRadius: 8 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2.5 px-5 pb-3">
        <div style={{ ...P, height: 34, width: 240, borderRadius: 6 }} />
        {[55, 65, 80, 70, 72].map((w, i) => <div key={i} style={{ ...P, height: 28, width: w, borderRadius: 20 }} />)}
        <div className="ml-auto" style={{ ...P, height: 32, width: 120, borderRadius: 6 }} />
      </div>
      <div className="mx-5 mb-4 flex-1 bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
        <div className="flex items-center gap-4 px-4" style={{ height: 40, background: '#FAFAFA', borderBottom: '1px solid #E4E8EF' }}>
          {[50, 110, 80, 90, 80, 70, 40, 60].map((w, i) => (
            <div key={i} style={{ ...P, height: 9, width: w, background: '#E4E8EF' }} />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4" style={{ height: 48, borderBottom: '1px solid #F1F5F9' }}>
            {[50, 120, 80, 100, 80, 70, 32, 56].map((w, j) => (
              <div key={j} style={{ ...P, height: 9, width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const PAGE_SIZES = [10, 25, 50] as const;
const COLS = ['ID', 'Patient', 'Date of Birth', 'Contact', 'Insurance', 'Last Visit', 'Visits', 'Status'] as const;

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PatientsPage() {
  const [loading, setLoading] = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<PatFilter>('all');
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState<10|25|50>(10);
  const [ctx,      setCtx]      = useState<{ x: number; y: number; patient: Patient } | null>(null);
  const [panel,    setPanel]    = useState<{ patient: Patient; history?: boolean } | null>(null);

  const noShowPatients = useMemo(
    () => new Set(MOCK_APPOINTMENTS.filter(a => a.status === 'no-show').map(a => a.patientId)),
    []
  );
  const activePatients = useMemo(
    () => new Set(MOCK_APPOINTMENTS.filter(a => a.status === 'confirmed' || a.status === 'pending').map(a => a.patientId)),
    []
  );

  const FILTERS = useMemo(() => [
    { label: 'All',      val: 'all'      as PatFilter, count: MOCK_PATIENTS.length },
    { label: 'Active',   val: 'active'   as PatFilter, count: activePatients.size },
    { label: 'Frequent', val: 'frequent' as PatFilter, count: MOCK_PATIENTS.filter(p => p.totalVisits >= 5).length },
    { label: 'New',      val: 'new'      as PatFilter, count: MOCK_PATIENTS.filter(p => p.totalVisits <= 1).length },
    { label: 'No-shows', val: 'noshows'  as PatFilter, count: noShowPatients.size },
  ], [activePatients, noShowPatients]);

  const frequentCount = MOCK_PATIENTS.filter(p => p.totalVisits >= 5).length;
  const activeRate = MOCK_PATIENTS.length ? Math.round((activePatients.size / MOCK_PATIENTS.length) * 100) : 0;

  const ANALYTICS: { label:string; val:string|number; color:string; bg:string; icon:string; sub?:string; progress?:number; onClick?:()=>void }[] = [
    { label: 'Total Patients',       val: MOCK_PATIENTS.length, color: '#5B65DC', bg: '#EEEFFD', icon: 'groups',          sub: 'registered in system',   onClick: () => { setFilter('all'); setSearch(''); } },
    { label: 'Active Patients',      val: activePatients.size,  color: '#16A34A', bg: '#ECFDF5', icon: 'event_available', sub: `${activeRate}% of total`, progress: activeRate, onClick: () => setFilter('active') },
    { label: 'Frequent (5+ visits)', val: frequentCount,        color: '#D97706', bg: '#FEF3C7', icon: 'star',            sub: 'loyal patients',          onClick: () => setFilter('frequent') },
    { label: 'No-show Records',      val: noShowPatients.size,  color: '#EF4444', bg: '#FEF2F2', icon: 'person_off',      sub: noShowPatients.size > 0 ? 'follow up needed' : 'none recorded', onClick: () => setFilter('noshows') },
  ];

  const filtered = useMemo(() => MOCK_PATIENTS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search || [p.name, p.id, p.insurance, p.email, p.phone].some(v => v.toLowerCase().includes(q));
    const matchFilter =
      filter === 'all'                                       ||
      (filter === 'active'   && activePatients.has(p.id))   ||
      (filter === 'frequent' && p.totalVisits >= 5)          ||
      (filter === 'new'      && p.totalVisits <= 1)          ||
      (filter === 'noshows'  && noShowPatients.has(p.id));
    return matchSearch && matchFilter;
  }).sort((a, b) => a.name.localeCompare(b.name)), [search, filter, activePatients, noShowPatients]);

  const pageNums = useMemo(() =>
    Array.from({ length: Math.ceil(filtered.length / pageSize) }, (_, i) => i + 1),
    [filtered.length, pageSize]);

  const handleCtx = useCallback((e: React.MouseEvent, patient: Patient) => {
    e.preventDefault();
    setCtx({ x: e.clientX, y: e.clientY, patient });
  }, []);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);
  useEffect(() => { setPage(1); }, [search, filter, pageSize]);

  if (loading) return <PageSkeleton />;

  const totalPages = pageNums.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const from  = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const to    = Math.min(page * pageSize, filtered.length);

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F4F6F9' }}>

      {/* Analytics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 px-5 pt-4 pb-3">
        {ANALYTICS.map((s, i) => (
          <button key={s.label} onClick={s.onClick}
            className="bg-white px-4 py-3 text-left w-full"
            style={{
              border: '1px solid #E4E8EF', borderRadius: 8,
              animation: `cardIn .38s ease ${i * 0.07}s both`,
              cursor: s.onClick ? 'pointer' : 'default',
              transition: 'box-shadow .15s, border-color .15s',
              fontFamily: "'Poppins',sans-serif",
            }}
            onMouseEnter={e => { if (s.onClick) { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${s.color}20`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${s.color}50`; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = ''; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E4E8EF'; }}>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="text-[10.5px] font-semibold" style={{ color: '#9CA3AF' }}>{s.label}</div>
              <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{ background: s.bg, borderRadius: 6 }}>
                <span className="material-icons-outlined" style={{ fontSize: 14, color: s.color }}>{s.icon}</span>
              </div>
            </div>
            <div className="text-[22px] font-extrabold leading-none" style={{ color: '#111827' }}>{s.val}</div>
            {s.sub && <div className="text-[10.5px] mt-0.5" style={{ color: '#9CA3AF' }}>{s.sub}</div>}
            {s.progress !== undefined && (
              <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                <div style={{ width: `${s.progress}%`, height: '100%', background: s.color, borderRadius: 6, transition: 'width .5s ease' }} />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2.5 px-5 pb-3 flex-wrap">
        <div className="relative shrink-0" style={{ width: 240 }}>
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 15, color: '#9CA3AF' }}>search</span>
          <input className="f-input text-[12.5px]" style={{ paddingLeft: 34 }}
            placeholder="Search name, ID, phone, insurance…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1 flex-wrap flex-1">
          {FILTERS.map(f => {
            const active = filter === f.val;
            return (
              <button key={f.val} onClick={() => setFilter(f.val)}
                aria-pressed={active}
                title={`${f.label} — ${f.count} patient${f.count !== 1 ? 's' : ''}`}
                className="inline-flex items-center gap-1.5 border-0 cursor-pointer font-semibold"
                style={{
                  height: 30, padding: '0 10px 0 11px', borderRadius: 20, fontSize: 12,
                  fontFamily: "'Poppins',sans-serif",
                  background: active ? '#5B65DC' : '#fff',
                  color: active ? '#fff' : '#64748B',
                  border: active ? '1px solid #5B65DC' : '1px solid #E4E8EF',
                  transition: 'all .15s',
                }}>
                {f.label}
                <span className="text-[10.5px] font-bold rounded-full leading-none"
                  style={{
                    padding: '1px 5px',
                    background: active ? 'rgba(255,255,255,.22)' : '#F1F5F9',
                    color: active ? 'rgba(255,255,255,.9)' : '#94A3B8',
                    minWidth: 18, textAlign: 'center',
                  }}>
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="ml-auto shrink-0">
          <button className="btn-p h-8 px-3.5 text-[12.5px]" style={{ borderRadius: 6 }}
            title="Register a new patient">
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>person_add</span>
            Add Patient
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="mx-5 mb-4 bg-white flex flex-col"
        style={{ border: '1px solid #E4E8EF', borderRadius: 8, flex: '1 1 0', minHeight: 240, overflow: 'hidden' }}>

        <div className="overflow-auto flex-1">
          <table role="grid" aria-label="Patients table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {COLS.map((h, i) => (
                  <th key={`${h}-${i}`} scope="col"
                    style={{ ...TH, borderRight: i === COLS.length - 1 ? 'none' : undefined }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr>
                  <td colSpan={COLS.length} aria-live="polite"
                    style={{ ...TD, borderRight: 'none', textAlign: 'center', padding: '64px 0', borderBottom: 'none' }}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-icons-outlined" style={{ fontSize: 36, color: '#D1D5DB' }} aria-hidden="true">folder_open</span>
                      <div className="text-[13px] font-semibold" style={{ color: '#6B7280' }}>No patients found</div>
                      <div className="text-[11.5px]" style={{ color: '#9CA3AF' }}>Adjust search or filter to see results</div>
                    </div>
                  </td>
                </tr>
              )}
              {paged.map((p, idx) => {
                const isLast    = idx === paged.length - 1;
                const rowBg     = idx % 2 === 0 ? '#fff' : '#FAFAFA';
                const tdBtm     = isLast ? 'none' : '1px solid #E4E8EF';
                const hasActive = activePatients.has(p.id);
                const isNoShow  = noShowPatients.has(p.id);
                return (
                  <tr key={p.id} onContextMenu={e => handleCtx(e, p)}
                    style={{ background: rowBg, cursor: 'context-menu', userSelect: 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F0F4FF'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowBg; }}>

                    <td style={{ ...TD, borderBottom: tdBtm }}>
                      <span className="font-bold text-[12px]" style={{ color: '#5B65DC' }}>{p.id}</span>
                    </td>

                    <td style={{ ...TD, borderBottom: tdBtm }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                          style={{ background: `hsl(${p.hue} 45% 46%)`, fontSize: 10 }}>
                          {p.initials}
                        </div>
                        <div>
                          <div className="font-semibold leading-tight" style={{ color: '#111827', whiteSpace: 'nowrap' }}>{p.name}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{p.gender === 'F' ? 'Female' : 'Male'}</div>
                        </div>
                      </div>
                    </td>

                    <td style={{ ...TD, borderBottom: tdBtm, whiteSpace: 'nowrap' }}>{p.dob}</td>

                    <td style={{ ...TD, borderBottom: tdBtm }}>
                      <div style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{p.phone}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF', whiteSpace: 'nowrap' }}>{p.email}</div>
                    </td>

                    <td style={{ ...TD, borderBottom: tdBtm, whiteSpace: 'nowrap' }}>{p.insurance}</td>

                    <td style={{ ...TD, borderBottom: tdBtm, whiteSpace: 'nowrap' }}>{p.lastVisit}</td>

                    <td style={{ ...TD, borderBottom: tdBtm, textAlign: 'center' }}>
                      <span className="font-bold" style={{ color: p.totalVisits >= 5 ? '#5B65DC' : '#374151' }}>
                        {p.totalVisits}
                      </span>
                    </td>

                    <td style={{ ...TD, borderBottom: tdBtm, borderRight: 'none' }}>
                      {hasActive ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5"
                          style={{ background: '#ECFDF5', color: '#16A34A', borderRadius: 3 }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#16A34A' }} />Active
                        </span>
                      ) : isNoShow ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5"
                          style={{ background: '#FEF2F2', color: '#EF4444', borderRadius: 3 }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#EF4444' }} />No-show
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5"
                          style={{ background: '#F4F6F9', color: '#64748B', borderRadius: 3 }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#94A3B8' }} />Inactive
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 shrink-0"
          style={{ borderTop: '1px solid #E4E8EF', background: '#FAFAFA' }}>
          <div className="text-[12px]" style={{ color: '#6B7280' }}>
            {filtered.length === 0
              ? 'No entries found'
              : <span>Showing <strong style={{ color: '#374151' }}>{from}</strong>–<strong style={{ color: '#374151' }}>{to}</strong> of <strong style={{ color: '#374151' }}>{filtered.length}</strong> patients</span>
            }
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-[12px]" style={{ color: '#64748B' }}>
              Rows:
              <select value={pageSize} onChange={e => setPageSize(Number(e.target.value) as typeof pageSize)}
                className="h-7 px-2 text-[12px] cursor-pointer"
                style={{ border: '1px solid #E4E8EF', borderRadius: 5, fontFamily: "'Poppins',sans-serif", color: '#374151', background: '#fff', outline: 'none' }}>
                {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            {totalPages > 1 && (
              <nav aria-label="Patient pages" className="flex items-center gap-1">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  title="Previous page"
                  className="border-0 font-semibold text-[12px]"
                  style={{ height: 28, padding: '0 10px', borderRadius: 6, fontFamily: "'Poppins',sans-serif",
                    background: '#fff', color: page <= 1 ? '#CBD5E1' : '#374151',
                    border: '1px solid #E4E8EF', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>‹</button>
                {pageNums.map((p) =>
                    <button key={p} onClick={() => setPage(p)}
                        className="border-0 cursor-pointer font-semibold text-[12px]"
                        style={{ height: 28, minWidth: 28, padding: '0 8px', borderRadius: 6, fontFamily: "'Poppins',sans-serif",
                          background: page === p ? '#5B65DC' : '#fff', color: page === p ? '#fff' : '#374151',
                          border: page === p ? '1px solid #5B65DC' : '1px solid #E4E8EF' }}>{p}</button>
                )}
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  title="Next page"
                  className="border-0 font-semibold text-[12px]"
                  style={{ height: 28, padding: '0 10px', borderRadius: 6, fontFamily: "'Poppins',sans-serif",
                    background: '#fff', color: page >= totalPages ? '#CBD5E1' : '#374151',
                    border: '1px solid #E4E8EF', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>›</button>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Overlays */}
      {ctx && (
        <CtxMenu x={ctx.x} y={ctx.y} patient={ctx.patient}
          onProfile={()  => { setPanel({ patient: ctx.patient });                setCtx(null); }}
          onHistory={()  => { setPanel({ patient: ctx.patient, history: true }); setCtx(null); }}
          onClose={()    => setCtx(null)} />
      )}
      {panel && <PatientPanel patient={panel.patient} showHistory={panel.history} onClose={() => setPanel(null)} />}
    </div>
  );
}
