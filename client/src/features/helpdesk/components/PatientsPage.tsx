import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, STATUS_META, type Patient } from '../data/mock';

const TD: React.CSSProperties = { padding: '9px 12px', borderRight: '1px solid #E4E8EF', borderBottom: '1px solid #E4E8EF', fontSize: 12.5, color: '#374151', fontFamily: "'Poppins',sans-serif" };
const TH: React.CSSProperties = { ...TD, fontSize: 10.5, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.06em', textTransform: 'uppercase', background: '#FAFAFA', position: 'sticky', top: 0, zIndex: 10, whiteSpace: 'nowrap' };

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
      <Item icon="person" label="View Profile" onClick={onProfile} />
      <Item icon="event_note" label="Appointment History" onClick={onHistory} />
      <div style={{ height:1, background:'#F1F5F9', margin:'4px 0' }} />
      <Item icon="edit" label="Edit Details" onClick={onClose} />
      <Item icon="local_hospital" label="Book Appointment" onClick={onClose} color="#5B65DC" />
    </div>
  );
}

// ── Patient detail panel ──────────────────────────────────────────────────────
function PatientPanel({ patient, onClose, showHistory }: { patient: Patient; onClose: () => void; showHistory?: boolean }) {
  const [tab, setTab] = useState<'profile'|'history'>(showHistory ? 'history' : 'profile');
  const appts = MOCK_APPOINTMENTS.filter(a => a.patientId === patient.id);
  return (
    <>
      <div className="fixed inset-0 z-[499]" onClick={onClose} style={{ background: 'rgba(0,0,0,.15)' }} />
      <div className="fixed inset-y-0 right-0 z-[500] flex flex-col bg-white overflow-hidden"
        style={{ width: 440, borderLeft: '1px solid #E4E8EF', boxShadow: '-12px 0 40px rgba(0,0,0,.09)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ background: `hsl(${patient.hue} 45% 46%)`, fontSize: 14 }}>{patient.initials}</div>
            <div>
              <div className="text-[13px] font-bold" style={{ color: '#111827' }}>{patient.name}</div>
              <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{patient.id} · {patient.insurance}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer"
            style={{ border: '1px solid #E4E8EF', borderRadius: 6, color: '#9CA3AF' }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
          </button>
        </div>
        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid #E4E8EF' }}>
          {(['profile','history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 h-10 border-0 cursor-pointer font-semibold capitalize text-[12.5px]"
              style={{ background: 'transparent', borderBottom: tab === t ? '2px solid #5B65DC' : '2px solid transparent',
                color: tab === t ? '#5B65DC' : '#64748B', fontFamily: "'Poppins',sans-serif" }}>
              {t === 'history' ? `Appointment History (${appts.length})` : 'Profile'}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {tab === 'profile' ? (
            <div className="flex flex-col gap-4">
              <div className="rounded overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 6 }}>
                {[
                  { icon:'person_outline',    label:'Full Name',    val: patient.name },
                  { icon:'badge',             label:'Patient ID',   val: patient.id },
                  { icon:'cake',              label:'Date of Birth',val: patient.dob },
                  { icon:'wc',                label:'Gender',       val: patient.gender === 'F' ? 'Female' : 'Male' },
                  { icon:'phone',             label:'Phone',        val: patient.phone },
                  { icon:'email',             label:'Email',        val: patient.email },
                  { icon:'location_on',       label:'Address',      val: patient.address },
                  { icon:'health_and_safety', label:'Insurance',    val: patient.insurance },
                  { icon:'event',             label:'Last Visit',   val: patient.lastVisit },
                  { icon:'history',           label:'Total Visits', val: `${patient.totalVisits} visits` },
                ].map((r, i, arr) => (
                  <div key={r.label} className="flex items-center gap-3 px-3.5 py-2.5"
                    style={{ borderBottom: i < arr.length-1 ? '1px solid #F8FAFC' : 'none' }}>
                    <span className="material-icons-outlined" style={{ fontSize: 14, color: '#9CA3AF', width: 16 }}>{r.icon}</span>
                    <span className="text-[11.5px]" style={{ color: '#9CA3AF', minWidth: 90 }}>{r.label}</span>
                    <span className="text-[12px] font-semibold" style={{ color: '#111827' }}>{r.val}</span>
                  </div>
                ))}
              </div>
              <button className="btn-p h-9 w-full justify-center text-[12.5px]" style={{ borderRadius: 6 }}>
                <span className="material-icons-outlined" style={{ fontSize: 15 }}>add</span>
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {appts.length === 0 && (
                <div className="py-10 text-center text-[12px]" style={{ color: '#9CA3AF' }}>No appointments on record.</div>
              )}
              {appts.map(a => {
                const meta = STATUS_META[a.status];
                return (
                  <div key={a.id} className="rounded p-3" style={{ border: '1px solid #E4E8EF', borderRadius: 6 }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11.5px] font-bold" style={{ color: '#5B65DC' }}>{a.id}</span>
                      <span className="text-[10.5px] font-bold px-2 py-0.5" style={{ background: meta.bg, color: meta.text, borderRadius: 3 }}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="text-[12.5px] font-semibold mb-0.5" style={{ color: '#111827' }}>{a.doctorName}</div>
                    <div className="text-[11.5px]" style={{ color: '#64748B' }}>{a.specialty} · {a.branch}</div>
                    <div className="text-[11px] mt-1" style={{ color: '#9CA3AF' }}>{a.date} at {a.time} · {a.type}</div>
                    {a.notes && <div className="text-[11px] mt-1 italic" style={{ color: '#94A3B8' }}>"{a.notes}"</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const PAGE_SIZES = [10, 25, 50] as const;

export default function PatientsPage() {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<PatFilter>('all');
  const [page, setPage]       = useState(1);
  const [pageSize, setPageSize] = useState<10|25|50>(10);
  const [ctx, setCtx]         = useState<{ x:number; y:number; patient: Patient } | null>(null);
  const [panel, setPanel]     = useState<{ patient: Patient; history?: boolean } | null>(null);

  const noShowPatients = new Set(MOCK_APPOINTMENTS.filter(a => a.status==='no-show').map(a => a.patientId));
  const activePatients = new Set(MOCK_APPOINTMENTS.filter(a => a.status==='confirmed'||a.status==='pending').map(a => a.patientId));

  const filtered = useMemo(() => MOCK_PATIENTS.filter(p => {
    const matchSearch = !search || [p.name, p.id, p.insurance, p.email, p.phone].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all'
      || (filter === 'active'   && activePatients.has(p.id))
      || (filter === 'frequent' && p.totalVisits >= 5)
      || (filter === 'new'      && p.totalVisits <= 1)
      || (filter === 'noshows'  && noShowPatients.has(p.id));
    return matchSearch && matchFilter;
  }), [search, filter]);

  useEffect(() => { setPage(1); }, [search, filter, pageSize]);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);
  const from = filtered.length ? (page-1)*pageSize+1 : 0;
  const to   = Math.min(page*pageSize, filtered.length);

  const FILTERS: { label: string; val: PatFilter }[] = [
    { label:'All Patients', val:'all' },
    { label:'Active',       val:'active' },
    { label:'Frequent',     val:'frequent' },
    { label:'New',          val:'new' },
    { label:'No-shows',     val:'noshows' },
  ];

  const ANALYTICS = [
    { label:'Total Patients',         val: MOCK_PATIENTS.length,                                         color:'#5B65DC', bg:'#EEEFFD', icon:'groups'          },
    { label:'With Active Appointment',val: activePatients.size,                                           color:'#16A34A', bg:'#ECFDF5', icon:'event_available'  },
    { label:'Frequent Visitors (5+)', val: MOCK_PATIENTS.filter(p => p.totalVisits>=5).length,           color:'#D97706', bg:'#FEF3C7', icon:'star'             },
    { label:'No-show Records',        val: noShowPatients.size,                                           color:'#EF4444', bg:'#FEF2F2', icon:'person_off'       },
  ];

  const handleCtx = useCallback((e: React.MouseEvent, patient: Patient) => {
    e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, patient });
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F4F6F9' }}>
      {/* Analytics */}
      <div className="grid grid-cols-4 gap-3 p-4 pb-3">
        {ANALYTICS.map(s => (
          <div key={s.label} className="bg-white flex items-center gap-3 px-4 py-3" style={{ border:'1px solid #E4E8EF', borderRadius:8 }}>
            <div className="w-9 h-9 flex items-center justify-center" style={{ background:s.bg, borderRadius:8 }}>
              <span className="material-icons-outlined" style={{ fontSize:18, color:s.color }}>{s.icon}</span>
            </div>
            <div>
              <div className="text-[20px] font-extrabold leading-tight" style={{ color:'#111827' }}>{s.val}</div>
              <div className="text-[11px]" style={{ color:'#9CA3AF' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="relative" style={{ flex:'1 1 240px', maxWidth:300 }}>
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize:15, color:'#9CA3AF' }}>search</span>
          <input className="f-input text-[12.5px]" style={{ paddingLeft:32 }} placeholder="Search patients…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1">
          {FILTERS.map(f => (
            <button key={f.val} onClick={() => setFilter(f.val)}
              aria-pressed={filter === f.val}
              className="border-0 cursor-pointer font-semibold text-[12px]"
              style={{ height:32, padding:'0 11px', borderRadius:6, fontFamily:"'Poppins',sans-serif",
                background: filter===f.val ? '#5B65DC' : '#fff', color: filter===f.val ? '#fff' : '#64748B',
                border: filter===f.val ? '1px solid #5B65DC' : '1px solid #E4E8EF' }}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <button className="btn-p h-8 px-3.5 text-[12.5px]" style={{ borderRadius:6 }}>
            <span className="material-icons-outlined" style={{ fontSize:15 }}>person_add</span>Add Patient
          </button>
        </div>
      </div>
      {/* Show-entries sub-toolbar */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px]" style={{ color:'#64748B' }}>Show</span>
          {PAGE_SIZES.map(s => (
            <button key={s} onClick={() => setPageSize(s)}
              aria-pressed={pageSize === s}
              className="border-0 cursor-pointer font-semibold text-[12px]"
              style={{ height:28, padding:'0 10px', borderRadius:6, fontFamily:"'Poppins',sans-serif",
                background: pageSize===s ? '#5B65DC' : '#fff', color: pageSize===s ? '#fff' : '#64748B',
                border: pageSize===s ? '1px solid #5B65DC' : '1px solid #E4E8EF' }}>
              {s}
            </button>
          ))}
          <span className="text-[12px]" style={{ color:'#64748B' }}>entries</span>
        </div>
        <div className="text-[12px]" style={{ color:'#6B7280' }}>
          Showing <strong>{from}</strong>–<strong>{to}</strong> of <strong>{filtered.length}</strong>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto mx-4 bg-white" style={{ border:'1px solid #E4E8EF', borderRadius:8, flex:'1 1 0', minHeight:240 }}>
        <table role="grid" aria-label="Patients table" style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {['ID','Full Name','DOB','Gender','Insurance','Phone','Last Visit','Total Visits','Status'].map((h,i,arr) => (
                <th key={h} scope="col" style={{ ...TH, borderRight: i<arr.length-1 ? '1px solid #E4E8EF' : 'none' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr><td colSpan={9} aria-live="polite" style={{ ...TD, textAlign:'center', padding:'56px 0', borderRight:'none' }}>
                <div className="flex flex-col items-center gap-2">
                  <span className="material-icons-outlined" style={{ fontSize:36, color:'#D1D5DB' }} aria-hidden="true">folder_open</span>
                  <div className="text-[13px] font-semibold" style={{ color:'#6B7280' }}>No patients found</div>
                  <div className="text-[11.5px]" style={{ color:'#9CA3AF' }}>Try adjusting your search or filter</div>
                </div>
              </td></tr>
            )}
            {paged.map((p, idx) => {
              const rowBg = idx%2===0 ? '#fff' : '#FAFAFA';
              const hasActive = activePatients.has(p.id);
              return (
                <tr key={p.id} onContextMenu={e => handleCtx(e, p)}
                  style={{ background: rowBg, cursor:'context-menu', userSelect:'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F0F4FF'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowBg; }}>
                  <td style={{ ...TD }}><span className="font-bold" style={{ color:'#5B65DC' }}>{p.id}</span></td>
                  <td style={{ ...TD }}><span className="font-semibold" style={{ color:'#111827' }}>{p.name}</span></td>
                  <td style={{ ...TD, whiteSpace:'nowrap' }}>{p.dob}</td>
                  <td style={{ ...TD }}>{p.gender === 'F' ? 'Female' : 'Male'}</td>
                  <td style={{ ...TD, whiteSpace:'nowrap' }}>{p.insurance}</td>
                  <td style={{ ...TD, whiteSpace:'nowrap' }}>{p.phone}</td>
                  <td style={{ ...TD, whiteSpace:'nowrap' }}>{p.lastVisit}</td>
                  <td style={{ ...TD, textAlign:'center' }}>
                    <span className="font-bold" style={{ color: p.totalVisits>=5 ? '#5B65DC' : '#374151' }}>{p.totalVisits}</span>
                  </td>
                  <td style={{ ...TD, borderRight:'none' }}>
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded"
                      style={{ background: hasActive ? '#ECFDF5' : '#F4F6F9', color: hasActive ? '#16A34A' : '#64748B', borderRadius:3 }}>
                      {hasActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-center px-4 py-3">
        <nav aria-label="Patient pages" className="flex gap-1">
          <button disabled={page<=1} onClick={() => setPage(p=>p-1)}
            className="border-0 cursor-pointer font-semibold text-[12px]"
            style={{ height:28, padding:'0 10px', borderRadius:6, fontFamily:"'Poppins',sans-serif",
              background:'#fff', color: page<=1 ? '#CBD5E1' : '#374151', border:'1px solid #E4E8EF',
              cursor: page<=1 ? 'not-allowed' : 'pointer' }}>‹ Prev</button>
          {Array.from({length:totalPages},(_,i)=>i+1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className="border-0 cursor-pointer font-semibold text-[12px]"
              style={{ height:28, minWidth:28, padding:'0 8px', borderRadius:6, fontFamily:"'Poppins',sans-serif",
                background: page===p ? '#5B65DC' : '#fff', color: page===p ? '#fff' : '#374151',
                border: page===p ? '1px solid #5B65DC' : '1px solid #E4E8EF' }}>{p}</button>
          ))}
          <button disabled={page>=totalPages} onClick={() => setPage(p=>p+1)}
            className="border-0 cursor-pointer font-semibold text-[12px]"
            style={{ height:28, padding:'0 10px', borderRadius:6, fontFamily:"'Poppins',sans-serif",
              background:'#fff', color: page>=totalPages ? '#CBD5E1' : '#374151', border:'1px solid #E4E8EF',
              cursor: page>=totalPages ? 'not-allowed' : 'pointer' }}>Next ›</button>
        </nav>
      </div>
      {/* Overlays */}
      {ctx && (
        <CtxMenu x={ctx.x} y={ctx.y} patient={ctx.patient}
          onProfile={() => { setPanel({ patient: ctx.patient }); setCtx(null); }}
          onHistory={() => { setPanel({ patient: ctx.patient, history: true }); setCtx(null); }}
          onClose={() => setCtx(null)} />
      )}
      {panel && <PatientPanel patient={panel.patient} showHistory={panel.history} onClose={() => setPanel(null)} />}
    </div>
  );
}
