import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_NURSES, STATUS_META, WORKFLOW_META,
  PRIORITY_META, ACTIVITY_LOG, ACTIVITY_ICON, TODAY,
  type Appointment, type AppStatus, type WorkflowStep, type Priority,
} from '../data/mock';
import { DOCS, BRANCHES, INS_LIST, TIMES } from '@/features/public-site/data/constants';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useUIStore } from '@/store/ui.store';
// ── Note tooltip on patient name ─────────────────────────────────────────────
function NoteTooltip({ notes, children }: { notes: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      {children}
      {open && (
        <div className="absolute left-0 z-[300] pointer-events-none"
          style={{ bottom: 'calc(100% + 6px)', minWidth: 200, maxWidth: 260, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.16))' }}>
          <div className="text-[11.5px] leading-snug px-3 py-2.5 rounded-lg"
            style={{ background: '#1E293B', color: '#F1F5F9', fontFamily: "'Poppins',sans-serif" }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#94A3B8' }}>Chief Complaint</div>
            {notes}
          </div>
          <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #1E293B', marginLeft: 14 }} />
        </div>
      )}
    </div>
  );
}

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
            <div className="flex flex-col items-center shrink-0" style={{ minWidth: 52 }}>
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
              <div className="flex-1 h-px mx-0.5 shrink-0" style={{ minWidth: 8, background: done ? '#16A34A' : '#E4E8EF', marginBottom: 14 }} />
            )}
          </React.Fragment>
        );
      })}
      {isCancelled && (
        <div className="ml-2 shrink-0">
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
      className="fixed z-800 bg-white py-1"
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
    <div className="fixed inset-0 z-700 flex items-center justify-center" style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(3px)' }}
      role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <div ref={modalRef} className="bg-white w-full max-w-170 overflow-hidden" style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.2)', maxHeight: '90vh', overflowY: 'auto' }}>
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
                <span className="w-20 shrink-0 font-semibold" style={{ color: '#9CA3AF' }}>{r.label}</span>
                <span style={{ color: '#111827' }}>{r.val}</span>
              </div>
            ))}
            {appt.notes && (
              <div className="mt-3 p-3 rounded text-[12px] leading-relaxed" style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#78350F', borderRadius: 6 }}>
                <strong>Notes:</strong> {appt.notes}
              </div>
            )}
          </div>
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
    <div className="fixed inset-0 z-700 flex items-center justify-center" style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(3px)' }}
      role="dialog" aria-modal="true" aria-labelledby="endorse-modal-title">
      <div ref={modalRef} className="bg-white w-full max-w-140" style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
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
          <div className="flex items-center gap-4 p-3 rounded" style={{ background: '#F8FAFC', border: '1px solid #E4E8EF', borderRadius: 6 }}>
            <div className="text-[12px]"><span style={{ color: '#9CA3AF' }}>Patient: </span><strong style={{ color: '#111827' }}>{appt.patientName}</strong></div>
            <div className="text-[12px]"><span style={{ color: '#9CA3AF' }}>Doctor: </span><span style={{ color: '#374151' }}>{appt.doctorName}</span></div>
            <div className="text-[12px]"><span style={{ color: '#9CA3AF' }}>Slot: </span><span style={{ color: '#374151' }}>{appt.date} {appt.time}</span></div>
          </div>
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

// ── Reschedule Modal ──────────────────────────────────────────────────────────
function RescheduleModal({ appt, onClose, addToast }: {
  appt: Appointment;
  onClose: () => void;
  addToast: (t: { type: 'success'|'error'|'warning'|'info'; message: string }) => void;
}) {
  const [date, setDate] = useState(appt.date);
  const [time, setTime] = useState(appt.time);
  const [reason, setReason] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  async function handleConfirm() {
    if (!date || !time) return;
    const result = await Swal.fire({
      title: 'Confirm reschedule?',
      html: `<span style="font-family:'Poppins',sans-serif;font-size:13px;color:#6B7280">
        Reschedule <strong>${appt.patientName}</strong> to <strong>${date}</strong> at <strong>${time}</strong>?</span>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Reschedule',
      cancelButtonText: 'Back',
      confirmButtonColor: '#5B65DC',
      cancelButtonColor: '#64748B',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      addToast({ type: 'success', message: `Appointment rescheduled to ${date} at ${time}` });
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-700 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="rs-title"
        className="bg-white overflow-hidden" style={{ width: 420, borderRadius: 12, boxShadow: '0 24px 64px rgba(0,0,0,.2)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div>
            <div id="rs-title" className="text-[14px] font-extrabold" style={{ color: '#111827', fontFamily: "'Poppins',sans-serif" }}>
              Reschedule Appointment
            </div>
            <div className="text-[11.5px] mt-0.5" style={{ color: '#9CA3AF' }}>{appt.patientName} · Ref #{appt.id}</div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center border-0 cursor-pointer"
            style={{ background: '#F4F6F9', borderRadius: 6, color: '#6B7280' }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>close</span>
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6B7280' }}>New Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="f-input text-[13px]" />
          </div>
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6B7280' }}>New Time</label>
            <select value={time} onChange={e => setTime(e.target.value)} className="f-input text-[13px]">
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6B7280' }}>
              Reason <span style={{ color: '#9CA3AF', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              rows={2} placeholder="e.g. Doctor unavailable, patient request…"
              className="f-textarea text-[12.5px]" />
          </div>
        </div>
        <div className="flex gap-2.5 px-6 py-4" style={{ borderTop: '1px solid #F1F5F9' }}>
          <button onClick={onClose} className="flex-1 h-10 border-0 cursor-pointer font-semibold text-[13px]"
            style={{ background: '#F4F6F9', color: '#64748B', borderRadius: 8, fontFamily: "'Poppins',sans-serif" }}>
            Cancel
          </button>
          <button onClick={handleConfirm} className="flex-1 h-10 border-0 cursor-pointer font-semibold text-[13px]"
            style={{ background: '#5B65DC', color: '#fff', borderRadius: 8, fontFamily: "'Poppins',sans-serif" }}>
            Confirm Reschedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail Side Panel ─────────────────────────────────────────────────────────
function DetailPanel({ appt, onClose }: { appt: Appointment; onClose: () => void }) {
  const patient  = MOCK_PATIENTS.find(p => p.id === appt.patientId);
  const endorsed = appt.endorsedTo ? MOCK_NURSES.find(n => n.id === appt.endorsedTo) : null;
  const addToast = useUIStore(s => s.addToast);
  const [visible,        setVisible]        = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [tab,            setTab]            = useState<'details'|'activity'>('details');
  const [showMore,       setShowMore]       = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const apptHistory = MOCK_APPOINTMENTS.filter(a => a.patientId === appt.patientId);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!showMore) return;
    function onDown(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setShowMore(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [showMore]);

  function handleClose() { setVisible(false); setTimeout(onClose, 260); }

  async function handleCancel() {
    setShowMore(false);
    const result = await Swal.fire({
      title: 'Cancel appointment?',
      html: `<span style="font-family:'Poppins',sans-serif;font-size:13px;color:#6B7280">
        <strong>${appt.patientName}</strong>'s appointment on <strong>${appt.date}</strong> at <strong>${appt.time}</strong> will be cancelled.</span>`,
      icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Yes, cancel it', cancelButtonText: 'Keep appointment',
      confirmButtonColor: '#EF4444', cancelButtonColor: '#64748B', reverseButtons: true,
    });
    if (result.isConfirmed) {
      addToast({ type: 'warning', message: `${appt.patientName}'s appointment cancelled` });
      handleClose();
    }
  }

  const isPending  = appt.status === 'pending';
  const canAct     = appt.status !== 'cancelled' && appt.status !== 'completed';
  const hue        = patient?.hue ?? 220;
  const initials   = patient?.initials ?? appt.patientName[0];

  const DetailRow = ({ icon, label, val }: { icon: string; label: string; val: string }) => (
    <div className="flex items-start gap-2.5 px-4 py-3">
      <span className="material-icons-outlined shrink-0" style={{ fontSize: 15, color: '#9CA3AF', marginTop: 2 }}>{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[10.5px]" style={{ color: '#9CA3AF' }}>{label}</div>
        <div className="text-[12.5px] font-semibold mt-0.5 leading-snug break-words" style={{ color: '#111827' }}>{val}</div>
      </div>
    </div>
  );

  const activityLog = [
    { id:1, time: appt.createdAt,          user:'Patient',   action:`Booking submitted for ${appt.doctorName} (${appt.specialty})`,     type:'create'  },
    { id:2, time:'10 min later',           user:'System',    action:'Confirmation email sent to patient',                               type:'notify'  },
    { id:3, time:'2026-06-20 09:00',       user:'Helpdesk',  action:`Appointment under review — priority: ${appt.priority}`,           type:'edit'    },
    { id:4, time: appt.reviewedAt ?? '—',  user: appt.reviewedBy ?? 'Helpdesk', action:'Checklist completed — insurance & availability verified', type:'confirm' },
    ...ACTIVITY_LOG.slice(0, 2),
  ];

  return (
    <>
      <div className="fixed inset-0 z-499" onClick={handleClose}
        style={{ background: 'rgba(0,0,0,.25)', opacity: visible ? 1 : 0, transition: 'opacity .26s ease' }} />

      <div role="dialog" aria-modal="true" aria-label={`Appointment: ${appt.patientName}`}
        className="fixed inset-y-0 right-0 z-500 flex flex-col bg-white"
        style={{
          width: 460, boxShadow: '-16px 0 48px rgba(0,0,0,.14)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .26s cubic-bezier(.4,0,.2,1)', overflow: 'hidden',
        }}>

        {/* ── White header ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E4E8EF', flexShrink: 0 }}>

          {/* Avatar + name + close */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-extrabold shrink-0"
                style={{ background: `hsl(${hue} 55% 52%)`, fontSize: 15 }}>
                {initials}
              </div>
              <div>
                <div className="text-[14.5px] font-bold leading-tight" style={{ color: '#111827' }}>{appt.patientName}</div>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <StatusBadge status={appt.status} />
                  <PriorityBadge priority={appt.priority} />
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
              { label: 'Ref #',  val: `#${appt.id}`,                      color: '#5B65DC' },
              { label: 'Doctor', val: appt.doctorName.split(' ').slice(0,2).join(' '), color: '#374151' },
              { label: 'Appts',  val: apptHistory.length,                  color: '#D97706' },
            ].map((s, i) => (
              <div key={s.label} className="flex flex-col items-center py-3"
                style={{ borderRight: i < 2 ? '1px solid #E4E8EF' : 'none' }}>
                <div className="text-[14px] font-extrabold leading-tight text-center" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[10px] mt-0.5" style={{ color: '#9CA3AF' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex" style={{ borderTop: '1px solid #F1F5F9' }}>
            {(['details', 'activity'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 h-9 border-0 cursor-pointer font-semibold text-[12px]"
                style={{
                  background: 'transparent', fontFamily: "'Poppins',sans-serif",
                  color: tab === t ? '#5B65DC' : '#9CA3AF',
                  borderBottom: tab === t ? '2px solid #5B65DC' : '2px solid transparent',
                  transition: 'color .15s',
                }}>
                {t === 'details' ? 'Details' : `Activity (${activityLog.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto" style={{ background: '#F4F6F9' }}>
          {tab === 'details' ? (
            <div className="p-4 flex flex-col gap-3">

              {/* Appointment details card */}
              <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid #E4E8EF' }}>
                <div className="px-4 py-2" style={{ background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Appointment</span>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y" style={{ '--tw-divide-color': '#F8FAFC' } as React.CSSProperties}>
                  {[
                    { icon:'calendar_today', label:'Date',      val: appt.date      },
                    { icon:'schedule',       label:'Time',      val: appt.time      },
                    { icon:'person',         label:'Doctor',    val: appt.doctorName },
                    { icon:'science',        label:'Specialty', val: appt.specialty },
                    { icon:'location_city',  label:'Branch',    val: appt.branch    },
                    { icon:'label',          label:'Type',      val: appt.type      },
                  ].map((r, i) => (
                    <div key={r.label} style={{ borderBottom: i < 4 ? '1px solid #F8FAFC' : 'none', borderRight: i % 2 === 0 ? '1px solid #F8FAFC' : 'none' }}>
                      <DetailRow {...r} />
                    </div>
                  ))}
                </div>
                {appt.insurance && (
                  <div style={{ borderTop: '1px solid #F8FAFC' }}>
                    <DetailRow icon="health_and_safety" label="Insurance" val={appt.insurance} />
                  </div>
                )}
              </div>

              {/* Patient card */}
              {patient ? (
                <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid #E4E8EF' }}>
                  <div className="px-4 py-2" style={{ background: '#FAFAFA', borderBottom: '1px solid #F1F5F9' }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#94A3B8' }}>Patient</span>
                  </div>
                  <div className="grid grid-cols-2">
                    {[
                      { icon:'phone', label:'Phone', val: patient.phone },
                      { icon:'email', label:'Email', val: patient.email },
                      { icon:'cake',  label:'Date of Birth', val: patient.dob },
                      { icon:'wc',    label:'Gender', val: patient.gender === 'F' ? 'Female' : 'Male' },
                    ].map((r, i) => (
                      <div key={r.label} style={{ borderBottom: i < 2 ? '1px solid #F8FAFC' : 'none', borderRight: i % 2 === 0 ? '1px solid #F8FAFC' : 'none' }}>
                        <DetailRow {...r} />
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid #F8FAFC' }}>
                    <DetailRow icon="location_on" label="Address" val={patient.address} />
                  </div>
                  <div style={{ borderTop: '1px solid #F8FAFC' }}>
                    <DetailRow icon="badge" label="Patient ID" val={patient.id} />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg px-4 py-3 text-center text-[12px]"
                  style={{ border: '1px solid #E4E8EF', color: '#9CA3AF' }}>Walk-in / new patient</div>
              )}

              {/* Chief complaint card */}
              {appt.notes && (
                <div className="bg-white rounded-lg overflow-hidden" style={{ border: '1px solid #FDE68A' }}>
                  <div className="px-4 py-2" style={{ background: '#FFFBEB', borderBottom: '1px solid #FDE68A' }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#92400E' }}>Chief Complaint / Notes</span>
                  </div>
                  <div className="px-4 py-3 text-[12.5px] leading-relaxed" style={{ color: '#78350F' }}>
                    {appt.notes}
                  </div>
                </div>
              )}

              {/* Endorsed banner */}
              {endorsed && (
                <div className="flex gap-3 items-center px-4 py-3 rounded-lg"
                  style={{ background: '#E0F2FE', border: '1px solid #BAE6FD' }}>
                  <span className="material-icons-outlined shrink-0" style={{ fontSize: 18, color: '#0EA5E9' }}>forward_to_inbox</span>
                  <div>
                    <div className="text-[12px] font-bold" style={{ color: '#0369A1' }}>Endorsed to {endorsed.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: '#0EA5E9' }}>Branch: {endorsed.branch} · {appt.endorsedAt}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              {activityLog.map((log, i) => {
                const meta = ACTIVITY_ICON[log.type];
                return (
                  <div key={log.id} className="flex gap-3 relative">
                    {i < activityLog.length - 1 && (
                      <div className="absolute left-3.5 top-8 bottom-0 w-px" style={{ background: '#E4E8EF' }} />
                    )}
                    <div className="w-7 h-7 flex items-center justify-center shrink-0 z-10 mt-0.5"
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
          )}
        </div>

        {/* ── Action footer — max 2 buttons ── */}
        <div className="shrink-0 flex gap-2 px-5 py-3" style={{ borderTop: '1px solid #E4E8EF' }}>
          {/* Primary action */}
          {isPending ? (
            <button onClick={onClose}
              className="flex-1 h-9 flex items-center justify-center gap-1.5 border-0 cursor-pointer font-semibold text-[12.5px]"
              style={{ background: '#5B65DC', color: '#fff', borderRadius: 7, fontFamily: "'Poppins',sans-serif" }}>
              <span className="material-icons-outlined" style={{ fontSize: 15 }}>verified</span>
              Review &amp; Validate
            </button>
          ) : canAct ? (
            <button onClick={() => setShowReschedule(true)}
              className="flex-1 h-9 flex items-center justify-center gap-1.5 border-0 cursor-pointer font-semibold text-[12.5px]"
              style={{ background: '#F4F6F9', color: '#374151', borderRadius: 7, fontFamily: "'Poppins',sans-serif" }}>
              <span className="material-icons-outlined" style={{ fontSize: 15 }}>edit_calendar</span>
              Reschedule
            </button>
          ) : null}

          {/* Secondary: ⋮ more menu */}
          {canAct && (
            <div className="relative" ref={moreRef}>
              <button onClick={() => setShowMore(v => !v)}
                aria-label="More actions"
                className="h-9 w-9 flex items-center justify-center border-0 cursor-pointer"
                style={{ background: '#F4F6F9', color: '#374151', borderRadius: 7, fontFamily: "'Poppins',sans-serif" }}>
                <span className="material-icons-outlined" style={{ fontSize: 18 }}>more_vert</span>
              </button>
              {showMore && (
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg overflow-hidden"
                  style={{ width: 176, border: '1px solid #E4E8EF', boxShadow: '0 8px 24px rgba(0,0,0,.12)', zIndex: 10 }}>
                  {isPending && (
                    <button onClick={() => { setShowMore(false); setShowReschedule(true); }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 border-0 cursor-pointer text-[12.5px] font-medium"
                      style={{ background: 'transparent', color: '#374151', fontFamily: "'Poppins',sans-serif" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F8FAFC'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                      <span className="material-icons-outlined" style={{ fontSize: 15, color: '#6B7280' }}>edit_calendar</span>
                      Reschedule
                    </button>
                  )}
                  <button onClick={handleCancel}
                    className="w-full flex items-center gap-2 px-3 py-2.5 border-0 cursor-pointer text-[12.5px] font-medium"
                    style={{ background: 'transparent', color: '#DC2626', fontFamily: "'Poppins',sans-serif" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                    <span className="material-icons-outlined" style={{ fontSize: 15, color: '#DC2626' }}>cancel</span>
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showReschedule && (
        <RescheduleModal appt={appt} onClose={() => setShowReschedule(false)} addToast={addToast} />
      )}
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
    <div className="fixed inset-0 z-700 flex items-center justify-center" style={{ background: 'rgba(0,0,0,.35)', backdropFilter: 'blur(2px)' }}>
      <div className="bg-white w-full max-w-115" style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
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
        <div className="px-5 py-4 max-h-100 overflow-y-auto">
          {logs.map((log, i) => {
            const meta = ACTIVITY_ICON[log.type];
            return (
              <div key={log.id} className="flex gap-3 relative">
                {i < logs.length - 1 && <div className="absolute left-3.25 top-7 bottom-0 w-px" style={{ background: '#E4E8EF' }} />}
                <div className="w-7 h-7 flex items-center justify-center shrink-0 z-10 mt-0.5"
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
    <div className="fixed inset-0 z-700 flex items-center justify-center" style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(3px)' }}>
      <div className="bg-white w-full max-w-135" style={{ borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
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

// ── Main Page ─────────────────────────────────────────────────────────────────
const FILTERS: { label: string; val: AppStatus | 'all' }[] = [
  { label:'All',       val:'all'       },
  { label:'Confirmed', val:'confirmed' },
  { label:'Pending',   val:'pending'   },
  { label:'Completed', val:'completed' },
  { label:'Cancelled', val:'cancelled' },
  { label:'No-show',   val:'no-show'   },
];
function PageSkeleton() {
  const P = { background: '#F1F5F9', borderRadius: 4 } as const;
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
      {/* Analytics */}
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
      {/* Toolbar */}
      <div className="flex items-center gap-2.5 px-4 pb-3">
        <div style={{ ...P, height: 34, width: 256, borderRadius: 6 }} />
        {[60, 70, 80, 72, 68, 80].map((w, i) => (
          <div key={i} style={{ ...P, height: 28, width: w, borderRadius: 20 }} />
        ))}
        <div className="ml-auto" style={{ ...P, height: 32, width: 100, borderRadius: 6 }} />
      </div>
      {/* Table */}
      <div className="mx-5 mb-4 flex-1 bg-white overflow-hidden" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
        <div className="flex items-center gap-3 px-4" style={{ height: 40, background: '#FAFAFA', borderBottom: '1px solid #E4E8EF' }}>
          {[64, 100, 80, 120, 90, 80, 50, 60, 80].map((w, i) => (
            <div key={i} style={{ ...P, height: 9, width: w, background: '#E4E8EF' }} />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4" style={{ height: 46, borderBottom: '1px solid #F1F5F9' }}>
            {[64, 110, 90, 130, 90, 90, 48, 64, 88].map((w, j) => (
              <div key={j} style={{ ...P, height: 9, width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// InfoRow used in DetailPanel
function InfoRow({ icon, label, val, span }: { icon: string; label: string; val: string; span?: boolean }) {
  return (
    <div className={span ? 'col-span-2' : ''}>
      <div className="flex items-center gap-1 mb-0.5">
        <span className="material-icons-outlined" style={{ fontSize: 11, color: '#9CA3AF' }}>{icon}</span>
        <span className="text-[9.5px] font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>{label}</span>
      </div>
      <div className="text-[12px] font-semibold pl-0 leading-snug" style={{ color: '#111827' }}>{val}</div>
    </div>
  );
}

const PAGE_SIZES = [10, 25, 50, 100] as const;
const COLS = ['Ref #', 'Patient', 'Contact', 'Doctor', 'Schedule', 'Branch', 'Priority', 'Status', 'Workflow'] as const;

export default function AppointmentsPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filter,       setFilter]      = useState<AppStatus | 'all'>(() => {
    const s = searchParams.get('status');
    return (s && ['confirmed','pending','completed','cancelled','no-show'].includes(s)) ? s as AppStatus : 'all';
  });
  const [search,       setSearch]      = useState(() => {
    const d = searchParams.get('date');
    return d ? d : '';
  });
  const [page,         setPage]        = useState(1);
  const [pageSize,     setPageSize]    = useState<10|25|50|100>(10);
  const [sortCol,      setSortCol]     = useState<string>('Patient');
  const [sortDir,      setSortDir]     = useState<'asc'|'desc'>('asc');
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

  const filtered = useMemo(() => {
    const list = allAppts.filter(a =>
      (filter === 'all' || a.status === filter) &&
      (!search || [a.patientName, a.doctorName, a.specialty, a.branch, a.id, a.type, a.date]
        .some(v => v.toLowerCase().includes(search.toLowerCase())))
    );
    list.sort((a, b) => {
      let av = '', bv = '';
      if (sortCol === 'Patient')  { av = a.patientName;              bv = b.patientName;              }
      else if (sortCol === 'Doctor')   { av = a.doctorName;               bv = b.doctorName;               }
      else if (sortCol === 'Schedule') { av = `${a.date} ${a.time}`;      bv = `${b.date} ${b.time}`;      }
      else if (sortCol === 'Branch')   { av = a.branch;                   bv = b.branch;                   }
      else if (sortCol === 'Priority') { av = a.priority;                 bv = b.priority;                 }
      else if (sortCol === 'Status')   { av = a.status;                   bv = b.status;                   }
      else if (sortCol === 'Workflow') { av = a.workflowStep;             bv = b.workflowStep;             }
      else                             { av = a.patientName;              bv = b.patientName;              }
      const cmp = av.localeCompare(bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [filter, search, allAppts, sortCol, sortDir]);

  const counts = useMemo(() => ({
    all:       allAppts.length,
    confirmed: allAppts.filter(a => a.status === 'confirmed').length,
    pending:   allAppts.filter(a => a.status === 'pending').length,
    completed: allAppts.filter(a => a.status === 'completed').length,
    cancelled: allAppts.filter(a => a.status === 'cancelled').length,
    'no-show': allAppts.filter(a => a.status === 'no-show').length,
  }), [allAppts]);

  const handleCtx = useCallback((e: React.MouseEvent, appt: Appointment) => {
    e.preventDefault();
    setCtx({ x: e.clientX, y: e.clientY, appt });
  }, []);

  const handleSort = useCallback((col: string) => {
    setSortCol(prev => {
      if (prev === col) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return col; }
      setSortDir('asc');
      return col;
    });
  }, []);

  const pageNums = useMemo(() =>
    Array.from({ length: Math.ceil(filtered.length / pageSize) }, (_, i) => i + 1),
    [filtered.length, pageSize]);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);
  useEffect(() => { setPage(1); }, [filter, search, pageSize]);
  useEffect(() => {
    const close = () => setCtx(null);
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, []);

  if (loading) return <PageSkeleton />;

  const totalPages = pageNums.length;
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const pendingEndorse = allAppts.filter(a => a.workflowStep === 'validated').length;
  const pendingReview  = allAppts.filter(a => a.workflowStep === 'submitted' || a.workflowStep === 'under_review').length;
  const completionRate = counts.all ? Math.round((counts.completed / counts.all) * 100) : 0;

  const ANALYTICS: { label:string; val:string; icon:string; color:string; bg:string; sub?:string; progress?:number; onClick?:()=>void }[] = [
    { label:'Today',            val: String(allAppts.filter(a => a.date === TODAY).length), icon:'today',             color:'#5B65DC', bg:'#EEEFFD', sub:'appointments',    onClick: () => setSearch(TODAY) },
    { label:'Needs Review',     val: String(pendingReview),                                  icon:'manage_search',    color:'#D97706', bg:'#FEF3C7', sub:'pending action',   onClick: () => setFilter('pending') },
    { label:'Awaiting Endorse', val: String(pendingEndorse),                                 icon:'forward_to_inbox', color:'#0EA5E9', bg:'#E0F2FE', sub:'validated queue',  onClick: () => { setFilter('all'); setSearch(''); } },
    { label:'Completion Rate',  val: `${completionRate}%`,                                   icon:'task_alt',         color:'#16A34A', bg:'#ECFDF5', sub:'of all appointments', progress: completionRate },
  ];

  const fromRow = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const toRow   = Math.min(page * pageSize, filtered.length);
  const livePanel = panelAppt ? allAppts.find(a => a.id === panelAppt.id) ?? panelAppt : null;

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
        <div className="relative shrink-0" style={{ width: 256 }}>
          <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ fontSize: 15, color: '#9CA3AF' }}>search</span>
          <input className="f-input text-[12.5px]" style={{ paddingLeft: 34 }}
            placeholder="Search patient, doctor, branch…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="flex items-center gap-1 flex-wrap flex-1">
          {FILTERS.map(f => {
            const active = filter === f.val;
            return (
              <button key={f.val} onClick={() => setFilter(f.val)}
                aria-pressed={active}
                title={`Show ${f.label.toLowerCase()} appointments (${counts[f.val]})`}
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
                  {counts[f.val]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button onClick={() => setShowBooking(true)}
            title="Book a new appointment"
            className="btn-p h-8 px-3.5 text-[12.5px]" style={{ borderRadius: 6 }}>
            <span className="material-icons-outlined" style={{ fontSize: 15 }}>add</span>
            New
          </button>
        </div>
      </div>

      {/* Table card — table + footer unified */}
      <div className="mx-5 mb-4 bg-white flex flex-col"
        style={{ border: '1px solid #E4E8EF', borderRadius: 8, flex: '1 1 0', minHeight: 240, overflow: 'hidden' }}>

        {/* Scrollable table */}
        <div className="overflow-auto flex-1">
          <table role="grid" aria-label="Appointments table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {COLS.map((h, i) => {
                  const sortable = h !== 'Ref #' && h !== 'Contact';
                  const isActive = sortCol === h;
                  const isLast = i === COLS.length - 1;
                  return (
                    <th key={`${h}-${i}`} scope="col"
                      onClick={sortable ? () => handleSort(h) : undefined}
                      style={{
                        ...TH,
                        borderRight: isLast ? 'none' : '1px solid #E4E8EF',
                        cursor: sortable ? 'pointer' : 'default',
                        background: isActive ? '#EEEFFD' : TH.background,
                        color: isActive ? '#5B65DC' : TH.color,
                        userSelect: 'none',
                      }}>
                      <div className="flex items-center gap-1">
                        <span>{h}</span>
                        {sortable && (
                          <span className="material-icons-outlined" style={{ fontSize: 12, color: isActive ? '#5B65DC' : '#CBD5E1' }}>
                            {isActive ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr>
                  <td colSpan={COLS.length} aria-live="polite"
                    style={{ ...TD, borderRight: 'none', textAlign: 'center', padding: '64px 0', borderBottom: 'none' }}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-icons-outlined" style={{ fontSize: 36, color: '#D1D5DB' }} aria-hidden="true">event_busy</span>
                      <div className="text-[13px] font-semibold" style={{ color: '#6B7280' }}>No appointments found</div>
                      <div className="text-[11.5px]" style={{ color: '#9CA3AF' }}>Try adjusting your search or filter</div>
                    </div>
                  </td>
                </tr>
              )}
              {paged.map((a, idx) => {
                const pt     = MOCK_PATIENTS.find(p => p.id === a.patientId);
                const isLast = idx === paged.length - 1;
                const rowBg  = idx % 2 === 0 ? '#fff' : '#FAFAFA';
                const tdB    = isLast ? 'none' : '1px solid #E4E8EF';
                return (
                  <tr key={a.id} onContextMenu={e => handleCtx(e, a)}
                    style={{ background: rowBg, cursor: 'context-menu', userSelect: 'none' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F0F4FF'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = rowBg; }}>

                    <td style={{ ...TD, borderBottom: tdB }}>
                      <span className="font-bold text-[12px]" style={{ color: '#5B65DC' }}>{a.id}</span>
                    </td>

                    <td style={{ ...TD, borderBottom: tdB }}>
                      {a.notes ? (
                        <NoteTooltip notes={a.notes}>
                          <div className="font-semibold leading-tight cursor-help" style={{ color: '#111827', whiteSpace: 'nowrap', textDecoration: 'underline dotted #CBD5E1' }}>{a.patientName}</div>
                        </NoteTooltip>
                      ) : (
                        <div className="font-semibold leading-tight" style={{ color: '#111827', whiteSpace: 'nowrap' }}>{a.patientName}</div>
                      )}
                      <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{a.insurance}</div>
                    </td>

                    <td style={{ ...TD, borderBottom: tdB }}>
                      <div style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{pt?.phone ?? '—'}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF', whiteSpace: 'nowrap' }}>{pt?.email ?? '—'}</div>
                    </td>

                    <td style={{ ...TD, borderBottom: tdB }}>
                      <div className="font-medium leading-tight" style={{ color: '#374151', whiteSpace: 'nowrap' }}>{a.doctorName}</div>
                      <div className="text-[11px] mt-0.5 inline-flex px-1.5 py-px rounded"
                        style={{ background: '#F4F6F9', color: '#64748B', fontWeight: 600 }}>
                        {a.specialty}
                      </div>
                    </td>

                    <td style={{ ...TD, borderBottom: tdB, whiteSpace: 'nowrap' }}>
                      <div className="font-medium" style={{ color: a.date === TODAY ? '#5B65DC' : '#374151', fontWeight: a.date === TODAY ? 700 : 500 }}>
                        {a.date}
                        {a.date === TODAY && <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 700, background: '#EEEFFD', color: '#5B65DC', padding: '1px 4px', borderRadius: 3 }}>TODAY</span>}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{a.time}</div>
                    </td>

                    <td style={{ ...TD, borderBottom: tdB }}>
                      <div style={{ whiteSpace: 'nowrap' }}>{a.branch}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: '#9CA3AF' }}>{a.type}</div>
                    </td>

                    <td style={{ ...TD, borderBottom: tdB }}><PriorityBadge priority={a.priority} /></td>
                    <td style={{ ...TD, borderBottom: tdB }}><StatusBadge status={a.status} /></td>
                    <td style={{ ...TD, borderBottom: tdB, borderRight: 'none' }}><WorkflowBadge step={a.workflowStep} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer: count · rows per page · pagination */}
        <div className="flex items-center justify-between px-4 py-2.5 shrink-0"
          style={{ borderTop: '1px solid #E4E8EF', background: '#FAFAFA' }}>
          <div className="text-[12px]" style={{ color: '#6B7280' }}>
            {filtered.length === 0
              ? 'No entries found'
              : <span>Showing <strong style={{ color: '#374151' }}>{fromRow}</strong>–<strong style={{ color: '#374151' }}>{toRow}</strong> of <strong style={{ color: '#374151' }}>{filtered.length}</strong> entries</span>
            }
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-[12px]" style={{ color: '#64748B' }}>
              Rows:
              <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value) as typeof pageSize)}
                className="h-7 px-2 text-[12px] cursor-pointer"
                style={{ border: '1px solid #E4E8EF', borderRadius: 5, fontFamily: "'Poppins',sans-serif", color: '#374151', background: '#fff', outline: 'none' }}>
                {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            {totalPages > 1 && (
              <nav aria-label="Appointment pages" className="flex items-center gap-1">
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
