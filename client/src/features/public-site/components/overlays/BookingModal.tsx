import React from 'react';
import { Doctor, ModalStep } from '../../types';

interface DateItem { day: string; num: number; month: string; key: string; selected: boolean; onSelect: () => void; }
interface SlotItem { label: string; available: boolean; selected: boolean; onSelect?: () => void; }

interface Props {
  open: boolean;
  doc: Doctor;
  step: ModalStep;
  dates: DateItem[];
  slots: SlotItem[];
  aDate: string;
  aTime: string;
  aService: string;
  aIns: string;
  isExisting: boolean;
  pName: string;
  pDOB: string;
  pPhone: string;
  pEmail: string;
  termsChecked: boolean;
  isLoading: boolean;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
  onEditStep1: () => void;
  onEditStep2: () => void;
  onSubmit: () => void;
  onSetExisting: () => void;
  onSetNew: () => void;
  onSetAService: (v: string) => void;
  onSetAIns: (v: string) => void;
  onSetTerms: (v: boolean) => void;
  onSetPName: (v: string) => void;
  onSetPDOB: (v: string) => void;
  onSetPPhone: (v: string) => void;
  onSetPEmail: (v: string) => void;
}

function StepDot({ state, num }: { state: 'done' | 'active' | 'pending'; num: number }) {
  return (
    <div className={`step-dot ${state}`}>
      {state === 'done'
        ? <span className="material-icons-outlined text-sm text-white">check</span>
        : <span className="text-[12px] font-extrabold" style={{ color: state === 'active' ? '#fff' : '#94A3B8' }}>{num}</span>
      }
    </div>
  );
}

export function BookingModal({
  open, doc, step, dates, slots, aDate, aTime, aService, aIns,
  isExisting, pName, pDOB, pPhone, pEmail, termsChecked,
  onClose, onNext, onBack, onEditStep1, onEditStep2, onSubmit,
  onSetExisting, onSetNew, onSetAService, onSetAIns, onSetTerms,
  onSetPName, onSetPDOB, onSetPPhone, onSetPEmail,
}: Props) {
  if (!open) return null;

  const avatarBg = `hsl(${doc.hue} 55% 38%)`;
  const s1 = step > 1 ? 'done' : step === 1 ? 'active' : 'pending';
  const s2 = step > 2 ? 'done' : step === 2 ? 'active' : 'pending';
  const s3 = step === 3 ? 'active' : 'pending';

  const sumName    = pName    || 'Juan Dela Cruz';
  const sumPhone   = pPhone   || '+63 912 345 6789';
  const sumDate    = aDate    || 'Not selected';
  const sumTime    = aTime    || 'Not selected';
  const sumService = aService || 'General Consultation';
  const sumIns     = aIns     || 'Self Pay / Cash';

  return (
    <div className="fixed inset-0 z-[900] flex items-start justify-end" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(18,32,86,.55)', backdropFilter: 'blur(3px)' }} aria-hidden="true" />

      <div
        className="panel-enter relative z-10 bg-white w-full max-w-[520px] h-screen overflow-y-auto"
        style={{ boxShadow: '-24px 0 80px rgba(18,32,86,.2)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center gap-[14px] sticky top-0 z-10" style={{ background: '#122056' }}>
          <div className="w-[46px] h-[46px] rounded-lg flex items-center justify-center flex-shrink-0 text-white text-sm font-bold" style={{ background: avatarBg }}>
            {doc.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] font-semibold uppercase tracking-[.07em] mb-0.5" style={{ color: 'rgba(255,255,255,.5)' }}>Booking Appointment</div>
            <div className="text-base font-bold text-white leading-[1.2]">{doc.name}</div>
            <div className="text-[11.5px]" style={{ color: 'rgba(255,255,255,.6)' }}>{doc.specialty} · {doc.branch}</div>
          </div>
          <button onClick={onClose} className="rounded-lg w-[34px] h-[34px] flex items-center justify-center text-white flex-shrink-0" style={{ background: 'rgba(255,255,255,.12)', border: 'none', cursor: 'pointer' }} aria-label="Close">
            <span className="material-icons-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Stepper */}
        <div className="px-[26px] py-4 pb-3 bg-white" style={{ borderBottom: '1px solid #E4E8EF' }}>
          <div className="flex items-start">
            {[
              { state: s1, num: 1, label: 'Pick a\nSlot' },
              { divider: true },
              { state: s2, num: 2, label: 'Your\nDetails' },
              { divider: true },
              { state: s3, num: 3, label: 'Confirm' },
            ].map((item, i) => {
              if ('divider' in item) {
                const lineState = i === 1 ? (step > 1 ? 'done' : 'pending') : (step > 2 ? 'done' : 'pending');
                return <div key={i} className={`step-line ${lineState}`} style={{ marginTop: 13 }} />;
              }
              return (
                <div key={i} className="flex flex-col items-center gap-[5px] min-w-[72px]">
                  <StepDot state={item.state as any} num={item.num!} />
                  <span className={`step-label ${item.state}`} style={{ whiteSpace: 'pre-line' }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="px-[26px] py-[22px]">
          {/* Step 1: Date & Time */}
          {step === 1 && (
            <>
              <h2 className="text-[15px] font-bold mb-[14px]" style={{ color: '#122056' }}>Select a Date</h2>
              <div className="flex gap-[5px] mb-5">
                {dates.map(d => (
                  <button key={d.key} onClick={d.onSelect} className={`date-btn ${d.selected ? 'sel' : ''}`}>
                    <div className="text-[10px] font-semibold opacity-70">{d.day}</div>
                    <div className="text-[15px] font-extrabold leading-[1.1] my-0.5">{d.num}</div>
                    <div className="text-[10px] opacity-70">{d.month}</div>
                  </button>
                ))}
              </div>

              {slots.length > 0 ? (
                <>
                  <h2 className="text-[15px] font-bold mb-3" style={{ color: '#122056' }}>Available Times</h2>
                  <div className="flex gap-2 flex-wrap mb-[10px]">
                    {slots.map(sl => (
                      <button key={sl.label} onClick={sl.onSelect} className={`slot-btn ${sl.selected ? 'sel' : ''} ${!sl.available ? 'unavail' : ''}`}>
                        {sl.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11.5px] flex items-center gap-[5px]" style={{ color: '#94A3B8' }}>
                    <span className="material-icons-outlined text-[13px]">info</span>
                    <span style={{ textDecoration: 'line-through' }}>Strikethrough</span> = slot booked
                  </p>
                </>
              ) : (
                <div className="rounded-lg px-5 py-7 text-center" style={{ background: '#F4F6F9' }}>
                  <span className="material-icons-outlined text-[32px] block mb-2" style={{ color: '#CBD5E1' }}>event</span>
                  <p className="text-[13.5px]" style={{ color: '#94A3B8' }}>Select a date above to view available time slots.</p>
                </div>
              )}
            </>
          )}

          {/* Step 2: Patient details */}
          {step === 2 && (
            <>
              <div className="rounded-lg px-[14px] py-[10px] mb-[18px] flex items-center gap-[10px]" style={{ background: '#EEEFFD' }}>
                <span className="material-icons-outlined text-base flex-shrink-0" style={{ color: '#5B65DC' }}>event</span>
                <span className="text-[13px] font-semibold" style={{ color: '#5B65DC' }}>{aDate} at {aTime}</span>
              </div>

              <h2 className="text-[15px] font-bold mb-[14px]" style={{ color: '#122056' }}>Your Details</h2>

              <div className="flex gap-2 mb-4">
                {[
                  { label: 'Existing Patient', active: isExisting, onClick: onSetExisting },
                  { label: 'New Patient',      active: !isExisting, onClick: onSetNew },
                ].map(btn => (
                  <button
                    key={btn.label}
                    onClick={btn.onClick}
                    className="flex-1 h-[38px] rounded-lg text-[13px] font-semibold cursor-pointer transition-all"
                    style={{
                      fontFamily: "'Poppins',sans-serif",
                      background: btn.active ? '#EEEFFD' : '#fff',
                      color:      btn.active ? '#5B65DC' : '#94A3B8',
                      border:     btn.active ? '2px solid #5B65DC' : '1.5px solid #E4E8EF',
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-[13px]">
                <div>
                  <label className="block text-[12.5px] font-semibold mb-[5px]" style={{ color: '#122056' }}>Full name</label>
                  <input type="text" value={pName} onChange={e => onSetPName(e.target.value)} placeholder="Enter your full name" className="f-input" />
                </div>
                <div className="grid grid-cols-2 gap-[10px]">
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-[5px]" style={{ color: '#122056' }}>Date of birth</label>
                    <input type="date" value={pDOB} onChange={e => onSetPDOB(e.target.value)} className="f-input" />
                  </div>
                  <div>
                    <label className="block text-[12.5px] font-semibold mb-[5px]" style={{ color: '#122056' }}>Phone</label>
                    <input type="tel" value={pPhone} onChange={e => onSetPPhone(e.target.value)} placeholder="Enter your phone" className="f-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold mb-[5px]" style={{ color: '#122056' }}>Email</label>
                  <input type="email" value={pEmail} onChange={e => onSetPEmail(e.target.value)} placeholder="Enter your email address" className="f-input" />
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold mb-[5px]" style={{ color: '#122056' }}>Service type</label>
                  <select value={aService} onChange={e => onSetAService(e.target.value)} className="f-select">
                    <option value="">Select service type</option>
                    {['General Consultation','Follow-up Visit','Physical Exam','Preventive Care'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12.5px] font-semibold mb-[5px]" style={{ color: '#122056' }}>
                    Insurance <span className="text-[11.5px] font-normal" style={{ color: '#94A3B8' }}>(Optional)</span>
                  </label>
                  <select value={aIns} onChange={e => onSetAIns(e.target.value)} className="f-select">
                    <option value="">Skip or select insurance</option>
                    {['Maxicare','MediCard','PhilHealth','Intellicare','Self Pay / Cash'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <>
              <h2 className="text-[15px] font-bold mb-4" style={{ color: '#122056' }}>Review & Confirm</h2>

              {/* Slot summary */}
              <div className="rounded-lg overflow-hidden mb-3" style={{ background: '#F4F6F9' }}>
                <div className="px-[14px] py-[9px] flex justify-between items-center" style={{ background: '#E4E8EF' }}>
                  <span className="text-[12.5px] font-bold" style={{ color: '#122056' }}>Appointment Slot</span>
                  <button onClick={onEditStep1} className="bg-transparent border-0 text-[12px] font-semibold cursor-pointer p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>Edit</button>
                </div>
                <div className="px-[14px] py-3 flex flex-col gap-[7px]">
                  {[
                    { label: 'Doctor', val: doc.name },
                    { label: 'Date',   val: sumDate },
                    { label: 'Time',   val: sumTime },
                  ].map(r => (
                    <div key={r.label} className="flex gap-2 text-[13px]">
                      <span className="min-w-[60px]" style={{ color: '#94A3B8' }}>{r.label}</span>
                      <span className="font-medium" style={{ color: '#122056' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient summary */}
              <div className="rounded-lg overflow-hidden mb-[18px]" style={{ background: '#F4F6F9' }}>
                <div className="px-[14px] py-[9px] flex justify-between items-center" style={{ background: '#E4E8EF' }}>
                  <span className="text-[12.5px] font-bold" style={{ color: '#122056' }}>Patient Details</span>
                  <button onClick={onEditStep2} className="bg-transparent border-0 text-[12px] font-semibold cursor-pointer p-0" style={{ color: '#5B65DC', fontFamily: "'Poppins',sans-serif" }}>Edit</button>
                </div>
                <div className="px-[14px] py-3 flex flex-col gap-[7px]">
                  {[
                    { label: 'Name',      val: sumName },
                    { label: 'Phone',     val: sumPhone },
                    { label: 'Service',   val: sumService },
                    { label: 'Insurance', val: sumIns },
                  ].map(r => (
                    <div key={r.label} className="flex gap-2 text-[13px]">
                      <span className="min-w-[60px]" style={{ color: '#94A3B8' }}>{r.label}</span>
                      <span className="font-medium" style={{ color: '#122056' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-[10px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={e => onSetTerms(e.target.checked)}
                  className="w-[15px] h-[15px] mt-0.5 flex-shrink-0 cursor-pointer"
                  style={{ accentColor: '#5B65DC' }}
                />
                <span className="text-[13px] leading-[1.5]" style={{ color: '#64748B' }}>
                  I agree to the <a href="#" style={{ color: '#5B65DC', textDecoration: 'none' }}>Terms of Service</a> and confirm this information is accurate.
                </span>
              </label>
            </>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex gap-[10px] px-[26px] py-4 sticky bottom-0 bg-white" style={{ borderTop: '1px solid #E4E8EF' }}>
          {step > 1 && (
            <button onClick={onBack} className="btn-o h-11 px-[18px] text-sm">
              <span className="material-icons-outlined text-[17px]">arrow_back</span>Back
            </button>
          )}
          {step === 1 && (
            <button onClick={onNext} className="btn-p flex-1 h-11 text-sm justify-center">
              Your Details <span className="material-icons-outlined text-[17px]">arrow_forward</span>
            </button>
          )}
          {step === 2 && (
            <button onClick={onNext} className="btn-p flex-1 h-11 text-sm justify-center">
              Review Booking <span className="material-icons-outlined text-[17px]">arrow_forward</span>
            </button>
          )}
          {step === 3 && (
            <button
              onClick={onSubmit}
              className="btn-p flex-1 h-11 text-sm justify-center transition-opacity"
              style={{ opacity: termsChecked ? 1 : 0.45 }}
            >
              <span className="material-icons-outlined text-[17px]">check</span>Confirm Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
