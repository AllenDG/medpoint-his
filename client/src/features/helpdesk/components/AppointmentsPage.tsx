import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_NURSES, STATUS_META, WORKFLOW_META,
  PRIORITY_META, ACTIVITY_LOG, ACTIVITY_ICON,
  type Appointment, type AppStatus, type WorkflowStep, type Priority,
} from '../data/mock';
import { DOCS, BRANCHES, INS_LIST, TIMES } from '@/features/public-site/data/constants';
import { useFocusTrap } from '@/hooks/useFocusTrap';

const TODAY     = '2026-06-22';
const APPT_TYPES = ['General Consult', 'Follow-up', 'New Patient', 'Check-up', 'Consult', 'Emergency'] as const;
const WORKFLOW_ORDERED: WorkflowStep[] = ['submitted','under_review','validated','endorsed','in_triage','with_doctor','completed'];

// ── Shared small components ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: AppStatus }) {
  const m = STATUS_META[status];
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5"
      style={{ background: m.bg, color: m.text, borderRadius: 3, whiteSpace: 'nowrap' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: m.dot }} />{m.label}
    </span>
  );
}

function WorkflowBadge({ step }: { step: WorkflowStep }) {
  const m = WORKFLOW_META[step];
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5"
      style={{ background: m.bg, color: m.color, borderRadius: 3, whiteSpace: 'nowrap' }}>
      <span className="material-icons-outlined" style={{ fontSize: 12 }}>{m.icon}</span>{m.label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const m = PRIORITY_META[priority];
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5"
      style={{ background: m.bg, color: m.color, borderRadius: 3 }}>
      {priority === 'urgent' && <span className="material-icons-outlined" style={{ fontSize: 11 }}>priority_high</span>}
      {m.label}
    </span>
  );
}

// ── Workflow stepper (horizontal, compact) ────────────────────────────────────
function WorkflowStepper({ current }: { current: WorkflowStep }) {
  const steps = WORKFLOW_ORDERED;
  const curIdx = steps.indexOf(current === 'cancelled' ? 'completed' : current);
  const isCancelled = current === 'cancelled';
  const SHORT: Record<WorkflowStep, string> = {
    submitted:'Submitted', under_review:'Review', validated:'Validated',
    endorsed:'Endorsed', in_triage:'Triage', with_doctor:'Doctor',
    completed:'Done', cancelled:'Cancelled',
  };
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1">
      {steps.map((s, i) => {
        const done = i < curIdx;
        const active = i === curIdx && !isCancelled;
        const m = WORKFLOW_META[s];
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 52 }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{
                  background: done ? '#16A34A' : active ? m.color : '#E4E8EF',
                  border: active ? `2px solid ${m.color}` : done ? '2px solid #16A34A' : '2px solid #E4E8EF',
                }}>
                {done
                  ? <span className="material-icons-outlined" style={{ fontSize: 12 }}>check</span>
                  : <span className="material-icons-outlined" style={{ fontSize: 11, color: active ? '#fff' : '#94A3B8' }}>{m.icon}</span>
                }
              </div>
              <span className="text-[9px] font-semibold mt-0.5 text-center leading-tight"
                style={{ color: active ? m.color : done ? '#16A34A' : '#9CA3AF', maxWidth: 48 }}>
                {SHORT[s]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mx-0.5 flex-shrink-0" style={{ minWidth: 8, background: done ? '#16A34A' : '#E4E8EF', marginBottom: 14 }} />
            )}
          </React.Fragment>
        );
      })}
      {isCancelled && (
        <div className="ml-2 flex-shrink-0">
          <WorkflowBadge step="cancelled" />
        </div>
      )}
    </div>
  );
}

// ── Context menu ──────────────────────────────────────────────────────────────
type CtxState = { x: number; y: number; appt: Appointment };

function ContextMenu({ x, y, appt, onViewDetails, onViewLog, onReview, onEndorse, onClose }: {
  x: number; y: number; appt: Appointment;
  onViewDetails: () => void; onViewLog: () => void;
  onReview: () => void; onEndorse: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x, y });

  useEffect(() => {
    if (!ref.current) return;
    const { width, height } = ref.current.getBoundingClientRect();
    setPos({ x: x + width > window.innerWidth ? x - width : x, y: y + height > window.innerHeight ? y - height : y });
  }, [x, y]);

  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
      onClose();
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [onClose]);

  const canReview  = appt.workflowStep === 'submitted' || appt.workflowStep === 'under_review';
  const canEndorse = appt.workflowStep === 'validated';
  const canCancel  = appt.status !== 'cancelled' && appt.status !== 'completed';

  function Item({ icon, label, onClick, color = '#374151', hoverBg = '#F8FAFC' }: {
    icon: string; label: string; onClick: () => void; color?: string; hoverBg?: string;
  }) {
    return (
      <button onClick={onClick} role="menuitem"
        className="w-full flex items-center gap-2.5 px-3 py-2 border-0 cursor-pointer text-left text-[12.5px] font-medium transition-colors"
        style={{ background: 'transparent', color, fontFamily:"'Poppins',sans-serif" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = hoverBg; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
        <span className="material-icons-outlined" style={{ fontSize: 15, color }}>{icon}</span>
        {label}
      </button>
    );
  }

  return (
    <div ref={ref} role="menu" aria-label={`Actions for ${appt.patientName}`}
      className="fixed z-[800] bg-white py-1"
      style={{ left: pos.x, top: pos.y, width: 210, borderRadius: 8, border: '1px solid #E4E8EF', boxShadow: '0 8px 24px rgba(0,0,0,.12)' }}
      onMouseDown={e => e.stopPropagation()}>
      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <div className="text-[11.5px] font-bold truncate" style={{ color: '#111827' }}>{appt.patientName}</div>
        <div className="text-[10.5px]" style={{ color: '#9CA3AF' }}>{appt.id} · <WorkflowBadge step={appt.workflowStep} /></div>
      </div>
      <Item icon="open_in_new" label="View Details"   onClick={onViewDetails} />
      <Item icon="history"     label="Activity Log"   onClick={onViewLog}     />
      {(canReview || canEndorse) && <div style={{ height:1, background:'#F1F5F9', margin:'4px 0' }} />}
      {canReview  && <Item icon="verified"        label="Review & Validate" onClick={onReview}  color="#D97706" hoverBg="#FFFBEB" />}
      {canEndorse && <Item icon="forward_to_inbox" label="Endorse to Nurse"  onClick={onEndorse} color="#0EA5E9" hoverBg="#E0F2FE" />}
      <div style={{ height:1, background:'#F1F5F9', margin:'4px 0' }} />
      <Item icon="edit_calendar" label="Reschedule"         onClick={onClose} />
      {canCancel && <Item icon="cancel" label="Cancel Appointment" onClick={onClose} color="#DC2626" hoverBg="#FEF2F2" />}
    </div>
  );
}

// ── Review & Validate Modal ───────────────────────────────────────────────────
function ReviewModal({ appt, onClose, onValidate }: {
  appt: Appointment; onClose: () => void;
  onValidate: (priority: Priority, notes: string) => void;
}) {
  const [priority, setPriority] = useState<Priority>(appt.priority);
  const [notes, setNotes] = useState('');
  const [checks, setChecks] = useState({ insurance: false, availability: false, contacted: false });
  const allChecked = Object.values(checks).every(Boolean);
  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center" style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(3px)' }}
      role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <div ref={modalRef} className="bg-white w-full max-w-[680px] overflow-hidden" style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.2)', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white" style={{ borderBottom: '1px solid #E4E8EF', zIndex: 1 }}>
          <div>
            <div id="review-modal-title" className="text-[14px] font-bold" style={{ color: '#111827' }}>Review & Validate Appointment</div>
            <div className="text-[11.5px]" style={{ color: '#9CA3AF' }}>Ref #{appt.id} · Submitted {appt.createdAt}</div>
          </div>
          <button onClick={onClose} aria-label="Close review modal" className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer"
            style={{ border: '1px solid #E4E8EF', borderRadius: 6, color: '#9CA3AF' }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }} aria-hidden="true">close</span>
          </button>
        </div>
        <div className="grid grid-cols-2 gap-0" style={{ borderBottom: '1px solid #E4E8EF' }}>
          {/* Left: appointment recap */}
          <div className="p-6" style={{ borderRight: '1px solid #E4E8EF', background: '#FAFAFA' }}>
            <div className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Appointment Summary</div>
            {[
              { label: 'Patient',   val: appt.patientName },
              { label: 'Doctor',    val: appt.doctorName },
              { label: 'Specialty', val: appt.specialty },
              { label: 'Branch',    val: appt.branch },
              { label: 'Date',      val: `${appt.date} at ${appt.time}` },
              { label: 'Type',      val: appt.type },
              { label: 'Insurance', val: appt.insurance },
            ].map(r => (
              <div key={r.label} className="flex gap-2 mb-2 text-[12.5px]">
                <span className="w-20 flex-shrink-0 font-semibold" style={{ color: '#9CA3AF' }}>{r.label}</span>
                <span style={{ color: '#111827' }}>{r.val}</span>
              </div>
            ))}
            {appt.notes && (
              <div className="mt-3 p-3 rounded text-[12px] leading-relaxed" style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#78350F', borderRadius: 6 }}>
                <strong>Notes:</strong> {appt.notes}
              </div>
            )}
          </div>
          {/* Right: validation form */}
          <div className="p-6">
            <div className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Validation Checklist</div>
            <div className="flex flex-col gap-2 mb-4">
              {([
                ['insurance',    'Insurance coverage verified'],
                ['availability', 'Doctor availability confirmed'],
                ['contacted',    'Patient contacted / notified'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer text-[12.5px]" style={{ color: '#374151' }}>
                  <input type="checkbox" checked={checks[key]} onChange={e => setChecks(c => ({ ...c, [key]: e.target.checked }))}
                    className="w-4 h-4 cursor-pointer" />
                  {label}
                </label>
              ))}
            </div>
            <div className="mb-4">
              <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Priority Level</div>
              <div className="flex gap-2">
                {(['urgent','normal','low'] as Priority[]).map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className="flex-1 h-8 border-0 cursor-pointer font-semibold capitalize text-[12px]"
                    style={{
                      borderRadius: 6,
                      background: priority === p ? PRIORITY_META[p].bg : '#F4F6F9',
                      color: priority === p ? PRIORITY_META[p].color : '#64748B',
                      border: priority === p ? `1.5px solid ${PRIORITY_META[p].color}` : '1.5px solid #E4E8EF',
                      fontFamily: "'Poppins',sans-serif",
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Review Notes</div>
              <textarea
                className="f-textarea text-[12.5px]" rows={3}
                placeholder="Add helpdesk review notes, observations, or special instructions…"
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4">
          <button onClick={() => { onValidate(priority, `[UNDER REVIEW] ${notes}`); onClose(); }}
            className="flex items-center gap-2 h-9 px-4 border-0 cursor-pointer font-semibold text-[12.5px]"
            style={{ background: '#FEF3C7', color: '#D97706', borderRadius: 6, fontFamily: "'Poppins',sans-serif" }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>hourglass_top</span>
            Mark Under Review
          </button>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="h-9 px-4 border-0 cursor-pointer font-semibold text-[12.5px]"
              style={{ background: '#F4F6F9', color: '#64748B', borderRadius: 6, fontFamily: "'Poppins',sans-serif" }}>
              Cancel
            </button>
            <button
              disabled={!allChecked}
              onClick={() => { if (allChecked) { onValidate(priority, notes); onClose(); } }}
              className="btn-p h-9 px-5 text-[12.5px] justify-center"
              style={{ borderRadius: 6, opacity: allChecked ? 1 : .45, cursor: allChecked ? 'pointer' : 'not-allowed' }}>
              <span className="material-icons-outlined" style={{ fontSize: 15 }}>verified</span>
              Validate &amp; Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Endorse to Nurse Modal ────────────────────────────────────────────────────
function EndorseModal({ appt, onClose, onEndorse }: {
  appt: Appointment; onClose: () => void;
  onEndorse: (nurseId: string, priority: Priority, notes: string) => void;
}) {
  const branchNurses = MOCK_NURSES.filter(n => n.branch === appt.branch);
  const fallbackNurses = branchNurses.length ? branchNurses : MOCK_NURSES;
  const [nurseId,  setNurseId]  = useState(fallbackNurses[0]?.id ?? '');
  const [priority, setPriority] = useState<Priority>(appt.priority);
  const [notes,    setNotes]    = useState('');
  const [specials, setSpecials] = useState({ wheelchair: false, interpreter: false, fasting: false, escort: false });

  const modalRef = useRef<HTMLDivElement>(null);
  useFocusTrap(modalRef, true);

  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center" style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(3px)' }}
      role="dialog" aria-modal="true" aria-labelledby="endorse-modal-title">
      <div ref={modalRef} className="bg-white w-full max-w-[560px]" style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div>
            <div id="endorse-modal-title" className="text-[14px] font-bold" style={{ color: '#111827' }}>Endorse to Nurse</div>
            <div className="text-[11.5px]" style={{ color: '#9CA3AF' }}>Handoff validated appointment to nursing staff</div>
          </div>
          <button onClick={onClose} aria-label="Close endorse modal" className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer"
            style={{ border: '1px solid #E4E8EF', borderRadius: 6, color: '#9CA3AF' }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }} aria-hidden="true">close</span>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Appointment recap strip */}
          <div className="flex items-center gap-4 p-3 rounded" style={{ background: '#F8FAFC', border: '1px solid #E4E8EF', borderRadius: 6 }}>
            <div className="text-[12px]"><span style={{ color: '#9CA3AF' }}>Patient: </span><strong style={{ color: '#111827' }}>{appt.patientName}</strong></div>
            <div className="text-[12px]"><span style={{ color: '#9CA3AF' }}>Doctor: </span><span style={{ color: '#374151' }}>{appt.doctorName}</span></div>
            <div className="text-[12px]"><span style={{ color: '#9CA3AF' }}>Slot: </span><span style={{ color: '#374151' }}>{appt.date} {appt.time}</span></div>
          </div>
          {/* Nurse selector */}
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>
              Assign to Nurse — {appt.branch}
            </label>
            <select className="f-input text-[12.5px]" value={nurseId} onChange={e => setNurseId(e.target.value)}>
              {fallbackNurses.map(n => <option key={n.id} value={n.id}>{n.name} ({n.branch})</option>)}
            </select>
            {branchNurses.length === 0 && (
              <div className="text-[11px] mt-1" style={{ color: '#D97706' }}>
                No nurses assigned to {appt.branch} — showing all nurses
              </div>
            )}
          </div>
          {/* Priority */}
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Triage Priority</div>
            <div className="flex gap-2">
              {(['urgent','normal','low'] as Priority[]).map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className="flex-1 h-8 border-0 cursor-pointer font-semibold capitalize text-[12px]"
                  style={{
                    borderRadius: 6, fontFamily: "'Poppins',sans-serif",
                    background: priority === p ? PRIORITY_META[p].bg : '#F4F6F9',
                    color: priority === p ? PRIORITY_META[p].color : '#64748B',
                    border: priority === p ? `1.5px solid ${PRIORITY_META[p].color}` : '1.5px solid #E4E8EF',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          {/* Special requirements */}
          <div>
            <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Special Requirements</div>
            <div className="grid grid-cols-2 gap-2">
              {([
                ['wheelchair',  'Wheelchair assistance'],
                ['interpreter', 'Language interpreter'],
                ['fasting',     'Patient is fasting'],
                ['escort',      'Escort / companion present'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-[12px] cursor-pointer" style={{ color: '#374151' }}>
                  <input type="checkbox" checked={specials[key]} onChange={e => setSpecials(s => ({ ...s, [key]: e.target.checked }))} className="w-4 h-4" />
                  {label}
                </label>
              ))}
            </div>
          </div>
          {/* Triage notes */}
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Triage Handoff Notes</label>
            <textarea className="f-textarea text-[12.5px]" rows={3}
              placeholder="Chief complaint, relevant history, special instructions for the nurse…"
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={onClose}
              className="flex-1 h-9 border-0 cursor-pointer font-semibold text-[12.5px]"
              style={{ background: '#F4F6F9', color: '#64748B', borderRadius: 6, fontFamily: "'Poppins',sans-serif" }}>
              Cancel
            </button>
            <button onClick={() => { onEndorse(nurseId, priority, notes); onClose(); }}
              className="flex-1 h-9 flex items-center justify-center gap-2 border-0 cursor-pointer font-bold text-[12.5px] text-white"
              style={{ background: '#0EA5E9', borderRadius: 6, fontFamily: "'Poppins',sans-serif" }}>
              <span className="material-icons-outlined" style={{ fontSize: 15 }}>forward_to_inbox</span>
              Endorse to Nurse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail Side Panel ─────────────────────────────────────────────────────────
function DetailPanel({ appt, onClose }: { appt: Appointment; onClose: () => void }) {
  const patient = MOCK_PATIENTS.find(p => p.id === appt.patientId);
  const endorsed = appt.endorsedTo ? MOCK_NURSES.find(n => n.id === appt.endorsedTo) : null;

  return (
    <>
      <div className="fixed inset-0 z-[499]" onClick={onClose} style={{ background: 'rgba(0,0,0,.15)' }} />
      <div className="fixed inset-y-0 right-0 z-[500] flex flex-col bg-white overflow-hidden"
        style={{ width: 460, borderLeft: '1px solid #E4E8EF', boxShadow: '-12px 0 40px rgba(0,0,0,.09)' }}>
        <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div>
            <div className="text-[13px] font-bold" style={{ color: '#111827' }}>Appointment Details</div>
            <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>#{appt.id} · {appt.createdAt}</div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={appt.status} />
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer"
              style={{ border: '1px solid #E4E8EF', borderRadius: 6, color: '#9CA3AF' }}>
              <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Workflow stepper */}
          <div className="px-5 py-3" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Appointment Workflow</div>
            <WorkflowStepper current={appt.workflowStep} />
          </div>
          {/* Patient info */}
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <div className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Patient Information</div>
            {patient ? (
              <div className="rounded overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 6 }}>
                {[
                  { icon:'person_outline',    label:'Full Name',    val: patient.name },
                  { icon:'phone',             label:'Phone',        val: patient.phone },
                  { icon:'email',             label:'Email',        val: patient.email },
                  { icon:'cake',              label:'Date of Birth',val: patient.dob },
                  { icon:'wc',                label:'Gender',       val: patient.gender === 'F' ? 'Female' : 'Male' },
                  { icon:'location_on',       label:'Address',      val: patient.address },
                  { icon:'health_and_safety', label:'Insurance',    val: patient.insurance },
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
            ) : (
              <div className="py-4 text-center text-[12px] rounded" style={{ background:'#F8FAFC', color:'#9CA3AF', borderRadius:6 }}>
                Walk-in / new patient
              </div>
            )}
          </div>
          {/* Appointment info */}
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <div className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Appointment Information</div>
            <div className="rounded overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 6 }}>
              {[
                { icon:'tag',               label:'Reference',    val: appt.id },
                { icon:'calendar_today',    label:'Date',         val: appt.date },
                { icon:'schedule',          label:'Time',         val: appt.time },
                { icon:'label',             label:'Type',         val: appt.type },
                { icon:'person',            label:'Doctor',       val: appt.doctorName },
                { icon:'science',           label:'Specialty',    val: appt.specialty },
                { icon:'location_city',     label:'Branch',       val: appt.branch },
                { icon:'health_and_safety', label:'Insurance',    val: appt.insurance },
              ].map((r, i, arr) => (
                <div key={r.label} className="flex items-center gap-3 px-3.5 py-2.5"
                  style={{ borderBottom: i < arr.length-1 ? '1px solid #F8FAFC' : 'none' }}>
                  <span className="material-icons-outlined" style={{ fontSize: 14, color: '#9CA3AF', width: 16 }}>{r.icon}</span>
                  <span className="text-[11.5px]" style={{ color: '#9CA3AF', minWidth: 90 }}>{r.label}</span>
                  <span className="text-[12px] font-semibold" style={{ color: '#111827' }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Priority + Workflow */}
          <div className="px-5 py-4 flex gap-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <div><div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Priority</div><PriorityBadge priority={appt.priority} /></div>
            <div><div className="text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Workflow</div><WorkflowBadge step={appt.workflowStep} /></div>
          </div>
          {/* Endorsed info */}
          {endorsed && (
            <div className="px-5 py-4 flex gap-3 items-center" style={{ borderBottom: '1px solid #F1F5F9', background: '#E0F2FE20' }}>
              <span className="material-icons-outlined" style={{ fontSize: 20, color: '#0EA5E9' }}>forward_to_inbox</span>
              <div>
                <div className="text-[12px] font-bold" style={{ color: '#0EA5E9' }}>Endorsed to {endorsed.name}</div>
                <div className="text-[11px]" style={{ color: '#9CA3AF' }}>Branch: {endorsed.branch} · {appt.endorsedAt}</div>
              </div>
            </div>
          )}
          {/* Notes */}
          {appt.notes && (
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
              <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: '#9CA3AF' }}>Chief Complaint / Notes</div>
              <div className="px-3.5 py-3 text-[12.5px] leading-relaxed rounded"
                style={{ background:'#FFFBEB', border:'1px solid #FDE68A', color:'#78350F', borderRadius:6 }}>
                {appt.notes}
              </div>
            </div>
          )}
          {/* Actions */}
          <div className="px-5 py-4">
            <div className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: '#9CA3AF' }}>Quick Actions</div>
            <div className="flex flex-col gap-2">
              {appt.status === 'pending' && (
                <button onClick={onClose} className="btn-p h-9 justify-center text-[12.5px] w-full" style={{ borderRadius: 6 }}>
                  <span className="material-icons-outlined" style={{ fontSize: 15 }}>verified</span>Review & Validate
                </button>
              )}
              <div className="flex gap-2">
                <button onClick={onClose} className="flex-1 flex items-center justify-center gap-1.5 h-9 border-0 cursor-pointer text-[12px] font-semibold"
                  style={{ background:'#F4F6F9', color:'#374151', borderRadius:6, fontFamily:"'Poppins',sans-serif" }}>
                  <span className="material-icons-outlined" style={{ fontSize: 14 }}>edit_calendar</span>Reschedule
                </button>
                {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                  <button onClick={onClose} className="flex-1 flex items-center justify-center gap-1.5 h-9 border-0 cursor-pointer text-[12px] font-semibold"
                    style={{ background:'#FEF2F2', color:'#DC2626', borderRadius:6, fontFamily:"'Poppins',sans-serif" }}>
                    <span className="material-icons-outlined" style={{ fontSize: 14 }}>cancel</span>Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Activity Log Modal ────────────────────────────────────────────────────────
function ActivityModal({ appt, onClose }: { appt: Appointment; onClose: () => void }) {
  const logs = [
    { id:1, time: appt.createdAt,       user:'Patient',  action:`Booking submitted for ${appt.doctorName} (${appt.specialty})`,                        type:'create'   },
    { id:2, time:'10 min later',        user:'System',   action:'Confirmation email sent to patient',                                                   type:'notify'   },
    { id:3, time:'2026-06-20 09:00',    user:'Helpdesk', action:`Appointment under review — priority: ${appt.priority}`,                               type:'edit'     },
    { id:4, time: appt.reviewedAt ?? '—', user: appt.reviewedBy ?? 'Helpdesk', action:'Checklist completed — insurance verified, availability confirmed', type:'confirm' },
    ...ACTIVITY_LOG.slice(0, 2),
  ];
  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center" style={{ background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white w-full max-w-[460px]" style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div>
            <div className="text-[13.5px] font-bold" style={{ color: '#111827' }}>Activity Log</div>
            <div className="text-[11px]" style={{ color: '#9CA3AF' }}>#{appt.id} · {appt.patientName}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer"
            style={{ border: '1px solid #E4E8EF', borderRadius: 6, color: '#9CA3AF' }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
          </button>
        </div>
        <div className="px-5 py-4 max-h-[400px] overflow-y-auto">
          {logs.map((log, i) => {
            const meta = ACTIVITY_ICON[log.type];
            return (
              <div key={log.id} className="flex gap-3 relative">
                {i < logs.length - 1 && <div className="absolute left-[13px] top-7 bottom-0 w-px" style={{ background: '#E4E8EF' }} />}
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 z-10 mt-0.5"
                  style={{ background: `${meta.color}15`, borderRadius: 6 }}>
                  <span className="material-icons-outlined" style={{ fontSize: 14, color: meta.color }}>{meta.icon}</span>
                </div>
                <div className="pb-5">
                  <div className="text-[12.5px]" style={{ color: '#374151' }}>{log.action}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{log.user} · {log.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ onClose, onSave }: { onClose: () => void; onSave: (a: Appointment) => void }) {
  const [form, setForm] = useState({
    patientName:'', phone:'', email:'', doctorId:'1',
    date: TODAY, time:'9:00 AM', branch:'City Clinic',
    type:'General Consult', insurance:'Maxicare', notes:'',
  });
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const doc = DOCS.find(d => d.id === Number(form.doctorId));
    onSave({ id:`A${Date.now()}`, patientId:'P_NEW', patientName: form.patientName,
      doctorId: Number(form.doctorId), doctorName: doc?.name ?? '', specialty: doc?.specialty ?? '',
      branch: form.branch, date: form.date, time: form.time, type: form.type,
      status:'pending', insurance: form.insurance, notes: form.notes,
      createdAt: new Date().toISOString().slice(0,16).replace('T',' '),
      workflowStep:'submitted', priority:'normal',
    });
    onClose();
  }
  return (
    <div className="fixed inset-0 z-[700] flex items-center justify-center" style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(3px)' }}>
      <div className="bg-white w-full max-w-[540px]" style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div className="text-[14px] font-bold" style={{ color: '#111827' }}>New Appointment</div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center bg-transparent border-0 cursor-pointer"
            style={{ border: '1px solid #E4E8EF', borderRadius: 6, color: '#94A3B8' }}>
            <span className="material-icons-outlined" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 grid grid-cols-2 gap-3">
          <div><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Patient Name *</label>
            <input className="f-input text-[12.5px]" placeholder="Full name" value={form.patientName} onChange={e => set('patientName', e.target.value)} required /></div>
          <div><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Phone</label>
            <input className="f-input text-[12.5px]" placeholder="09xx-xxx-xxxx" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
          <div className="col-span-2"><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Email</label>
            <input className="f-input text-[12.5px]" type="email" placeholder="patient@email.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
          <div><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Doctor *</label>
            <select className="f-input text-[12.5px]" value={form.doctorId} onChange={e => set('doctorId', e.target.value)}>
              {DOCS.map(d => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}</select></div>
          <div><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Branch *</label>
            <select className="f-input text-[12.5px]" value={form.branch} onChange={e => set('branch', e.target.value)}>
              {BRANCHES.map(b => <option key={b.name}>{b.name}</option>)}</select></div>
          <div><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Date *</label>
            <input type="date" className="f-input text-[12.5px]" value={form.date} min={TODAY} onChange={e => set('date', e.target.value)} required /></div>
          <div><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Time *</label>
            <select className="f-input text-[12.5px]" value={form.time} onChange={e => set('time', e.target.value)}>
              {TIMES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Type</label>
            <select className="f-input text-[12.5px]" value={form.type} onChange={e => set('type', e.target.value)}>
              {APPT_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Insurance</label>
            <select className="f-input text-[12.5px]" value={form.insurance} onChange={e => set('insurance', e.target.value)}>
              {INS_LIST.map(i => <option key={i}>{i}</option>)}</select></div>
          <div className="col-span-2"><label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Chief Complaint / Notes</label>
            <textarea className="f-textarea text-[12.5px]" rows={2} placeholder="Reason for visit…" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
          <div className="col-span-2 flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 h-9 border-0 cursor-pointer font-semibold text-[12.5px]"
              style={{ background:'#F4F6F9', color:'#64748B', borderRadius:6, fontFamily:"'Poppins',sans-serif" }}>Cancel</button>
            <button type="submit" className="btn-p flex-1 h-9 text-[12.5px] justify-center" style={{ borderRadius: 6 }}>
              <span className="material-icons-outlined" style={{ fontSize: 15 }}>add</span>Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const FILTERS: { label: string; val: AppStatus | 'all' }[] = [
  { label:'All', val:'all' }, { label:'Confirmed', val:'confirmed' },
  { label:'Pending', val:'pending' }, { label:'Completed', val:'completed' },
  { label:'Cancelled', val:'cancelled' }, { label:'No-show', val:'no-show' },
];
const PAGE_SIZES = [10, 25, 50, 100] as const;

const TD: React.CSSProperties = { padding: '9px 12px', borderRight: '1px solid #E4E8EF', borderBottom: '1px solid #E4E8EF', fontSize: 12.5, color: '#374151', fontFamily: "'Poppins',sans-serif" };
const TH: React.CSSProperties = { ...TD, fontSize: 10.5, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.06em', textTransform: 'uppercase', background: '#FAFAFA', position: 'sticky', top: 0, zIndex: 10, whiteSpace: 'nowrap' };

export default function AppointmentsPage() {
  const [filter,       setFilter]      = useState<AppStatus | 'all'>('all');
  const [search,       setSearch]      = useState('');
  const [page,         setPage]        = useState(1);
  const [pageSize,     setPageSize]    = useState<10|25|50|100>(10);
  const [ctx,          setCtx]         = useState<CtxState | null>(null);
  const [panelAppt,    setPanelAppt]   = useState<Appointment | null>(null);
  const [logAppt,      setLogAppt]     = useState<Appointment | null>(null);
  const [reviewAppt,   setReviewAppt]  = useState<Appointment | null>(null);
  const [endorseAppt,  setEndorseAppt] = useState<Appointment | null>(null);
  const [showBooking,  setShowBooking] = useState(false);
  const [extra,        setExtra]       = useState<Appointment[]>([]);
  const [updates,      setUpdates]     = useState<Record<string, Partial<Appointment>>>({});

  const allAppts = useMemo(() =>
    [...MOCK_APPOINTMENTS, ...extra].map(a => updates[a.id] ? { ...a, ...updates[a.id] } : a),
    [extra, updates]
  );

  function patchAppt(id: string, changes: Partial<Appointment>) {
    setUpdates(prev => ({ ...prev, [id]: { ...(prev[id] ?? {}), ...changes } }));
  }

  const filtered = useMemo(() =>
    allAppts.filter(a =>
      (filter === 'all' || a.status === filter) &&
      (!search || [a.patientName, a.doctorName, a.specialty, a.branch, a.id, a.type]
        .some(v => v.toLowerCase().includes(search.toLowerCase())))
    ).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [filter, search, allAppts]
  );

  useEffect(() => { setPage(1); }, [filter, search, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const counts = useMemo(() => ({
    all: allAppts.length,
    confirmed: allAppts.filter(a => a.status==='confirmed').length,
    pending:   allAppts.filter(a => a.status==='pending').length,
    completed: allAppts.filter(a => a.status==='completed').length,
    cancelled: allAppts.filter(a => a.status==='cancelled').length,
    'no-show': allAppts.filter(a => a.status==='no-show').length,
  }), [allAppts]);

  const pendingEndorse  = allAppts.filter(a => a.workflowStep === 'validated').length;
  const pendingReview   = allAppts.filter(a => a.workflowStep === 'submitted' || a.workflowStep === 'under_review').length;
  const completionRate  = counts.all ? Math.round((counts.completed / counts.all) * 100) : 0;

  const ANALYTICS = [
    { label:'Today',            val: String(allAppts.filter(a => a.date === TODAY).length), icon:'today',           color:'#5B65DC', bg:'#EEEFFD' },
    { label:'Needs Review',     val: String(pendingReview),  icon:'manage_search',  color:'#D97706', bg:'#FEF3C7' },
    { label:'Awaiting Endorse', val: String(pendingEndorse), icon:'forward_to_inbox',color:'#0EA5E9', bg:'#E0F2FE' },
    { label:'Completion Rate',  val: `${completionRate}%`,  icon:'task_alt',       color:'#16A34A', bg:'#ECFDF5' },
  ];

  const handleCtx = useCallback((e: React.MouseEvent, appt: Appointment) => {
    e.preventDefault();
    setCtx({ x: e.clientX, y: e.clientY, appt });
  }, []);

  useEffect(() => {
    const close = () => setCtx(null);
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, []);

  const fromRow = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const toRow   = Math.min(page * pageSize, filtered.length);

  // Paginate button list (show max 5 pages)
  const pageNums = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const near = [page - 1, page, page + 1].filter(p => p >= 1 && p <= totalPages);
    const all = Array.from(new Set([1, ...near, totalPages])).sort((a, b) => a - b);
    const result: (number | '…')[] = [];
    all.forEach((p, i) => {
      if (i > 0 && p - (all[i - 1] as number) > 1) result.push('…');
      result.push(p);
    });
    return result;
  }, [page, totalPages]);

  // Merge panel appt with latest updates
  const livePanel = panelAppt ? allAppts.find(a => a.id === panelAppt.id) ?? panelAppt : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: '#F4F6F9' }}>
      {/* Analytics cards */}
      <div className="grid grid-cols-4 gap-3 p-4 pb-3">
        {ANALYTICS.map(s => (
          <div key={s.label} className="bg-white flex items-center gap-3 px-4 py-3"
            style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
            <div className="w-9 h-9 flex items-center justify-center"
              style={{ background: s.bg, borderRadius: 8 }}>
              <span className="material-icons-outlined" style={{ fontSize: 18, color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <div className="text-[20px] font-extrabold leading-tight" style={{ color: '#111827' }}>{s.val}</div>
              <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="relative" style={{ flex: '1 1 240px', maxWidth: 320 }}>
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 15, color: '#9CA3AF' }}>search</span>
          <input className="f-input text-[12.5px]" style={{ paddingLeft: 32 }}
            placeholder="Search patient, doctor, branch, type…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {FILTERS.map(f => {
            const active = filter === f.val;
            return (
              <button key={f.val} onClick={() => setFilter(f.val)}
                aria-pressed={filter === f.val}
                className="border-0 cursor-pointer font-semibold"
                style={{ height: 32, padding: '0 11px', borderRadius: 6, fontSize: 12, fontFamily: "'Poppins',sans-serif",
                  background: active ? '#5B65DC' : '#fff', color: active ? '#fff' : '#64748B',
                  border: active ? '1px solid #5B65DC' : '1px solid #E4E8EF' }}>
                {f.label} <span style={{ opacity: .7, fontSize: 10.5 }}>({counts[f.val]})</span>
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px]" style={{ color: '#9CA3AF' }}>Right-click row for actions</span>
          <button onClick={() => setShowBooking(true)} className="btn-p h-8 px-3.5 text-[12.5px]" style={{ borderRadius: 6 }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>add</span>New
          </button>
        </div>
      </div>

      {/* Show-entries sub-toolbar */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px]" style={{ color: '#64748B' }}>Show</span>
          {PAGE_SIZES.map(s => (
            <button key={s} onClick={() => setPageSize(s)}
              aria-pressed={pageSize === s}
              className="border-0 cursor-pointer font-semibold text-[12px]"
              style={{ height: 28, padding: '0 10px', borderRadius: 6, fontFamily: "'Poppins',sans-serif",
                background: pageSize === s ? '#5B65DC' : '#fff', color: pageSize === s ? '#fff' : '#64748B',
                border: pageSize === s ? '1px solid #5B65DC' : '1px solid #E4E8EF' }}>
              {s}
            </button>
          ))}
          <span className="text-[12px]" style={{ color: '#64748B' }}>entries</span>
        </div>
        <div className="text-[12px]" style={{ color: '#6B7280' }}>
          Showing <strong>{fromRow}</strong>–<strong>{toRow}</strong> of <strong>{filtered.length}</strong> entries
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-auto mx-4 bg-white" style={{ border: '1px solid #E4E8EF', borderRadius: 8, flex: '1 1 0', minHeight: 240 }}>
        <table role="grid" aria-label="Appointments table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Ref #','Patient','Contact','Doctor','Specialty','Date','Time','Branch','Type','Priority','Status','Workflow'].map((h, i, arr) => (
                <th key={h} scope="col" style={{ ...TH, borderRight: i < arr.length-1 ? '1px solid #E4E8EF' : 'none' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr><td colSpan={12} aria-live="polite" style={{ ...TD, textAlign: 'center', padding: '56px 0', borderRight: 'none' }}>
                <div className="flex flex-col items-center gap-2">
                  <span className="material-icons-outlined" style={{ fontSize: 36, color: '#D1D5DB' }} aria-hidden="true">event_busy</span>
                  <div className="text-[13px] font-semibold" style={{ color: '#6B7280' }}>No appointments found</div>
                  <div className="text-[11.5px]" style={{ color: '#9CA3AF' }}>Try adjusting your search or filter</div>
                </div>
              </td></tr>
            )}
            {paged.map((a, idx) => {
              const pt = MOCK_PATIENTS.find(p => p.id === a.patientId);
              const rowBg = idx % 2 === 0 ? '#fff' : '#FAFAFA';
              return (
                <tr key={a.id} onContextMenu={e => handleCtx(e, a)}
                  style={{ background: rowBg, cursor: 'context-menu', userSelect: 'none' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F0F4FF'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowBg; }}>
                  <td style={{ ...TD }}><span className="font-bold" style={{ color: '#5B65DC' }}>{a.id}</span></td>
                  <td style={{ ...TD }}><div className="font-semibold" style={{ color: '#111827', whiteSpace: 'nowrap' }}>{a.patientName}</div><div style={{ fontSize: 11, color: '#9CA3AF' }}>{a.insurance}</div></td>
                  <td style={{ ...TD }}><div style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{pt?.phone ?? '—'}</div><div style={{ fontSize: 11, color: '#9CA3AF' }}>{pt?.email ?? '—'}</div></td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{a.doctorName}</td>
                  <td style={{ ...TD }}><span style={{ background: '#F4F6F9', color: '#64748B', padding: '2px 6px', borderRadius: 3, fontSize: 11, whiteSpace: 'nowrap' }}>{a.specialty}</span></td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>
                    <span style={{ color: a.date === TODAY ? '#5B65DC' : '#111827', fontWeight: a.date === TODAY ? 700 : 500 }}>{a.date}</span>
                    {a.date === TODAY && <span style={{ marginLeft: 4, fontSize: 9.5, fontWeight: 700, background: '#EEEFFD', color: '#5B65DC', padding: '1px 5px', borderRadius: 3 }}>TODAY</span>}
                  </td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{a.time}</td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{a.branch}</td>
                  <td style={{ ...TD, whiteSpace: 'nowrap' }}>{a.type}</td>
                  <td style={{ ...TD }}><PriorityBadge priority={a.priority} /></td>
                  <td style={{ ...TD }}><StatusBadge status={a.status} /></td>
                  <td style={{ ...TD, borderRight: 'none' }}><WorkflowBadge step={a.workflowStep} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-center px-4 py-3">
        <nav aria-label="Appointment pages" className="flex items-center gap-1">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
            className="border-0 cursor-pointer font-semibold text-[12px]"
            style={{ height: 28, padding: '0 10px', borderRadius: 6, fontFamily: "'Poppins',sans-serif",
              background: '#fff', color: page <= 1 ? '#CBD5E1' : '#374151', border: '1px solid #E4E8EF',
              cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>‹ Prev</button>
          {pageNums.map((p, i) =>
            p === '…'
              ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#9CA3AF', fontSize: 12 }}>…</span>
              : <button key={p} onClick={() => setPage(p as number)}
                  className="border-0 cursor-pointer font-semibold text-[12px]"
                  style={{ height: 28, minWidth: 28, padding: '0 8px', borderRadius: 6, fontFamily: "'Poppins',sans-serif",
                    background: page === p ? '#5B65DC' : '#fff', color: page === p ? '#fff' : '#374151',
                    border: page === p ? '1px solid #5B65DC' : '1px solid #E4E8EF' }}>{p}</button>
          )}
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
            className="border-0 cursor-pointer font-semibold text-[12px]"
            style={{ height: 28, padding: '0 10px', borderRadius: 6, fontFamily: "'Poppins',sans-serif",
              background: '#fff', color: page >= totalPages ? '#CBD5E1' : '#374151', border: '1px solid #E4E8EF',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>Next ›</button>
        </nav>
      </div>

      {/* Overlays */}
      {ctx && (
        <ContextMenu x={ctx.x} y={ctx.y} appt={ctx.appt}
          onViewDetails={() => { setPanelAppt(ctx.appt); setCtx(null); }}
          onViewLog={() => { setLogAppt(ctx.appt); setCtx(null); }}
          onReview={() => { setReviewAppt(ctx.appt); setCtx(null); }}
          onEndorse={() => { setEndorseAppt(ctx.appt); setCtx(null); }}
          onClose={() => setCtx(null)} />
      )}
      {livePanel  && <DetailPanel appt={livePanel} onClose={() => setPanelAppt(null)} />}
      {logAppt    && <ActivityModal appt={logAppt} onClose={() => setLogAppt(null)} />}
      {reviewAppt && (
        <ReviewModal appt={reviewAppt} onClose={() => setReviewAppt(null)}
          onValidate={(priority, notes) => {
            patchAppt(reviewAppt.id, { workflowStep:'validated', status:'confirmed', priority,
              reviewedBy:'Helpdesk Admin', reviewedAt: new Date().toISOString().slice(0,16).replace('T',' ') });
          }} />
      )}
      {endorseAppt && (
        <EndorseModal appt={endorseAppt} onClose={() => setEndorseAppt(null)}
          onEndorse={(nurseId, priority, triageNotes) => {
            patchAppt(endorseAppt.id, { workflowStep:'endorsed', endorsedTo: nurseId,
              endorsedAt: new Date().toISOString().slice(0,16).replace('T',' '), triageNotes, priority });
          }} />
      )}
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} onSave={a => setExtra(prev => [a, ...prev])} />}
    </div>
  );
}
