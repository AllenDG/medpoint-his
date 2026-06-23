import React, { useState, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type Tab = 'profile' | 'notifications' | 'branch' | 'security';
const BRANCHES = ['City Clinic', 'North Branch', 'East Clinic', 'West Branch', 'South Clinic'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

// ── Toast banner ───────────────────────────────────────────────────────────────
function SaveBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div role="status" aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 text-white z-600"
      style={{ background: '#16A34A', borderRadius: 8, boxShadow: '0 8px 24px rgba(22,163,74,.35)', fontSize: 13, fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>
      <span className="material-icons-outlined" style={{ fontSize: 17 }} aria-hidden="true">check_circle</span>
      Settings saved successfully
    </div>
  );
}

// ── Section card wrapper ───────────────────────────────────────────────────────
function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white mb-3" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
        <h3 className="text-[13px] font-bold" style={{ color: '#111827' }}>{title}</h3>
        {sub && <p className="text-[11.5px] mt-0.5" style={{ color: '#6B7280' }}>{sub}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ── Danger confirm modal ───────────────────────────────────────────────────────
function DangerModal({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, true);
  return (
    <div className="fixed inset-0 z-700 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(3px)' }}
      role="dialog" aria-modal="true" aria-labelledby="danger-modal-title">
      <div ref={ref} className="bg-white p-6" style={{ borderRadius: 8, width: 360, boxShadow: '0 20px 60px rgba(0,0,0,.18)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center" style={{ background: '#FEF2F2', borderRadius: 8 }}>
            <span className="material-icons-outlined" style={{ fontSize: 20, color: '#DC2626' }} aria-hidden="true">warning</span>
          </div>
          <h2 id="danger-modal-title" className="text-[14px] font-bold" style={{ color: '#111827' }}>Sign out other sessions?</h2>
        </div>
        <p className="text-[12.5px] mb-5" style={{ color: '#6B7280' }}>
          All other active sessions will be terminated immediately. You will remain logged in on this device.
        </p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 h-9 border-0 cursor-pointer font-semibold text-[12.5px]"
            style={{ background: '#F4F6F9', color: '#64748B', borderRadius: 6, fontFamily: "'Poppins',sans-serif" }}>
            Cancel
          </button>
          <button onClick={onClose} className="flex-1 h-9 border-0 cursor-pointer font-bold text-[12.5px] text-white"
            style={{ background: '#DC2626', borderRadius: 6, fontFamily: "'Poppins',sans-serif" }}>
            Sign Out Others
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Field label ────────────────────────────────────────────────────────────────
function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[10.5px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#6B7280' }}>
      {children}
    </label>
  );
}

// ── Toggle switch ──────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, label, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; id: string }) {
  return (
    <button id={id} role="switch" aria-checked={checked} aria-label={label}
      onClick={() => onChange(!checked)}
      className="shrink-0 relative border-0 cursor-pointer p-0"
      style={{ width: 40, height: 22, borderRadius: 11, background: checked ? '#5B65DC' : '#D1D5DB', transition: 'background .2s' }}>
      <span style={{
        position: 'absolute', top: 3, left: checked ? 21 : 3, width: 16, height: 16,
        background: '#fff', borderRadius: '50%', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user } = useAuth();
  const [tab, setTab]   = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);
  const [showDanger, setShowDanger] = useState(false);

  function triggerSave() { setSaved(true); setTimeout(() => setSaved(false), 2500); }

  // Profile
  const [profile, setProfile] = useState({
    displayName: user?.name ?? 'Helpdesk Admin',
    phone: '+63 917 000 0000',
    department: 'Patient Relations',
    language: 'English (Philippines)',
    timezone: 'Asia/Manila (UTC+8)',
    dateFormat: 'DD/MM/YYYY',
  });

  // Notifications
  const [notifs, setNotifs] = useState({
    new_appointment: { email: true,  sms: false, inApp: true,  label: 'New appointment submitted'    },
    no_show:         { email: true,  sms: false, inApp: true,  label: 'Patient no-show alert'        },
    cancelled:       { email: false, sms: false, inApp: true,  label: 'Appointment cancelled'        },
    pending_review:  { email: true,  sms: true,  inApp: true,  label: 'Pending review reminder'      },
    daily_summary:   { email: true,  sms: false, inApp: false, label: 'End-of-day summary'           },
  });
  const [digestTime, setDigestTime] = useState('18:00');
  const [quietHours, setQuietHours] = useState(false);
  const [quietFrom, setQuietFrom]   = useState('22:00');
  const [quietTo, setQuietTo]       = useState('08:00');

  // Branch
  const [branchCfg, setBranchCfg] = useState({
    assignedBranch: 'City Clinic',
    maxDailyTotal: 30,
    maxPerDoctor: 12,
    maxWalkIns: 5,
    branchPhone: '+63 2 8XXX XXXX',
    branchAddress: '123 Clinic St, Quezon City',
    emergencyContact: 'Nurse-in-Charge: +63 917 XXX XXXX',
    hours: Object.fromEntries(DAYS.map(d => [d, { enabled: d !== 'Sunday', from: '08:00', to: '17:00' }])),
  });

  // Security
  const [sec, setSec]   = useState({ current: '', newPass: '', confirm: '' });
  const [mfa, setMfa]   = useState(false);
  const passMatch = sec.newPass.length >= 8 && sec.newPass === sec.confirm;
  const passError = sec.confirm.length > 0 && sec.newPass !== sec.confirm;

  const TABS: { val: Tab; icon: string; label: string }[] = [
    { val: 'profile',       icon: 'person',        label: 'Profile'       },
    { val: 'notifications', icon: 'notifications', label: 'Notifications' },
    { val: 'branch',        icon: 'location_city', label: 'Branch'        },
    { val: 'security',      icon: 'lock',          label: 'Security'      },
  ];

  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '9px 12px',
    border: '1.5px solid #E4E8EF', borderRadius: 6,
    fontFamily: "'Poppins',sans-serif", fontSize: 12.5, color: '#111827',
    background: '#fff', outline: 'none',
  };
  const readonlyStyle: React.CSSProperties = { ...inputStyle, background: '#F8FAFC', color: '#94A3B8', cursor: 'not-allowed' };
  const TH: React.CSSProperties = { padding: '9px 14px', fontSize: 10.5, fontWeight: 700, color: '#6B7280', letterSpacing: '.06em', textTransform: 'uppercase', background: '#FAFAFA', borderBottom: '1px solid #E4E8EF', borderRight: '1px solid #E4E8EF' };
  const TD: React.CSSProperties = { padding: '11px 14px', fontSize: 12.5, color: '#374151', borderBottom: '1px solid #E4E8EF', borderRight: '1px solid #E4E8EF', fontFamily: "'Poppins',sans-serif" };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: '#F4F6F9' }}>
      <SaveBanner show={saved} />
      {showDanger && <DangerModal onClose={() => setShowDanger(false)} />}

      {/* Page header */}
      <div className="bg-white px-6 py-4" style={{ borderBottom: '1px solid #E4E8EF' }}>
        <h2 className="text-[17px] font-extrabold" style={{ color: '#111827' }}>Settings</h2>
        <p className="text-[12px] mt-0.5" style={{ color: '#6B7280' }}>Manage account, notifications, branch config, and security</p>
      </div>

      <div className="flex min-h-0">
        {/* ── Vertical tab sidebar ── */}
        <nav aria-label="Settings sections"
          className="shrink-0 flex flex-col gap-1 py-4 px-3"
          style={{ width: 180, background: '#fff', borderRight: '1px solid #E4E8EF', minHeight: 'calc(100vh - 104px)' }}>
          {TABS.map(t => (
            <button key={t.val} onClick={() => setTab(t.val)}
              aria-current={tab === t.val ? 'true' : undefined}
              className="flex items-center gap-3 px-3 py-2.5 rounded border-0 cursor-pointer text-left font-semibold text-[12.5px]"
              style={{
                background: tab === t.val ? '#EEEFFD' : 'transparent',
                color: tab === t.val ? '#5B65DC' : '#64748B',
                fontFamily: "'Poppins',sans-serif",
                borderRadius: 6,
              }}>
              <span className="material-icons-outlined" style={{ fontSize: 18, color: tab === t.val ? '#5B65DC' : '#94A3B8' }} aria-hidden="true">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* ── Tab content ── */}
        <div className="flex-1 px-6 py-5 overflow-y-auto">

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div className="grid gap-0" style={{ gridTemplateColumns: '260px 1fr', gap: 20, alignItems: 'start' }}>
              {/* Left: account card */}
              <div>
                <div className="bg-white p-5 mb-3" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-[22px] font-bold mb-3"
                      style={{ background: '#5B65DC' }}>
                      {(user?.name ?? 'HA').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-[14px] font-bold" style={{ color: '#111827' }}>{profile.displayName}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: '#6B7280' }}>{user?.email}</div>
                    <span className="mt-2 text-[10.5px] font-bold px-2.5 py-0.5"
                      style={{ background: '#EEEFFD', color: '#5B65DC', borderRadius: 4 }}>{user?.role}</span>
                  </div>
                  <button className="w-full h-8 flex items-center justify-center gap-1.5 border-0 cursor-pointer font-semibold text-[12px]"
                    style={{ background: '#F4F6F9', color: '#64748B', borderRadius: 6, fontFamily: "'Poppins',sans-serif" }}
                    aria-label="Upload profile photo (feature coming soon)">
                    <span className="material-icons-outlined" style={{ fontSize: 15 }} aria-hidden="true">photo_camera</span>
                    Upload Photo
                  </button>
                </div>
                <div className="bg-white p-4" style={{ border: '1px solid #E4E8EF', borderRadius: 8 }}>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider mb-3" style={{ color: '#6B7280' }}>Account Info</div>
                  {[
                    { label: 'Employee ID', val: 'HD-00124' },
                    { label: 'Branch',      val: 'City Clinic' },
                    { label: 'Last login',  val: '2026-06-22 08:12 AM' },
                    { label: 'Status',      val: 'Active' },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between py-1.5 text-[12px]" style={{ borderBottom: '1px solid #F8FAFC' }}>
                      <span style={{ color: '#6B7280' }}>{r.label}</span>
                      <span className="font-semibold" style={{ color: '#111827' }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right: editable forms */}
              <div>
                <Section title="Personal Information" sub="Update your display name, contact, and department.">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <input id="displayName" style={inputStyle} value={profile.displayName}
                        onChange={e => setProfile(p => ({ ...p, displayName: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <input id="phone" style={inputStyle} value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <input id="department" style={inputStyle} value={profile.department}
                        onChange={e => setProfile(p => ({ ...p, department: e.target.value }))} />
                    </div>
                    <div>
                      <Label htmlFor="emailRO">Email Address</Label>
                      <input id="emailRO" style={readonlyStyle} value={user?.email ?? ''} readOnly aria-readonly="true" />
                      <p className="text-[10.5px] mt-1" style={{ color: '#6B7280' }}>Managed by IT — contact admin to change</p>
                    </div>
                  </div>
                </Section>
                <Section title="Account Preferences" sub="Language, timezone, and date display format.">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <select id="language" style={inputStyle} value={profile.language}
                        onChange={e => setProfile(p => ({ ...p, language: e.target.value }))}>
                        <option>English (Philippines)</option>
                        <option>Filipino</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <select id="timezone" style={inputStyle} value={profile.timezone}
                        onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}>
                        <option>Asia/Manila (UTC+8)</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <select id="dateFormat" style={inputStyle} value={profile.dateFormat}
                        onChange={e => setProfile(p => ({ ...p, dateFormat: e.target.value }))}>
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </Section>
                <Section title="Linked Accounts">
                  <div className="flex items-center justify-between p-3 rounded" style={{ background: '#F8FAFC', border: '1px solid #E4E8EF', borderRadius: 6 }}>
                    <div className="flex items-center gap-3">
                      <span className="material-icons-outlined" style={{ fontSize: 20, color: '#6B7280' }} aria-hidden="true">email</span>
                      <div>
                        <div className="text-[12.5px] font-semibold" style={{ color: '#111827' }}>{user?.email}</div>
                        <div className="text-[11px]" style={{ color: '#6B7280' }}>Primary email · Google Workspace</div>
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold px-2 py-0.5" style={{ background: '#ECFDF5', color: '#16A34A', borderRadius: 4 }}>Connected</span>
                  </div>
                </Section>
                <div className="flex justify-end">
                  <button onClick={triggerSave} className="btn-p h-9 px-5 text-[12.5px] justify-center" style={{ borderRadius: 6 }}>
                    <span className="material-icons-outlined" style={{ fontSize: 15 }} aria-hidden="true">save</span>Save Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifications' && (
            <div>
              <Section title="Notification Channels" sub="Choose how you are notified for each event.">
                <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 6, overflow: 'hidden', border: '1px solid #E4E8EF' }}
                  role="grid" aria-label="Notification settings table">
                  <thead>
                    <tr>
                      {['Event', 'Email', 'SMS', 'In-app'].map((h, i) => (
                        <th key={h} scope="col" style={{ ...TH, textAlign: i === 0 ? 'left' : 'center', borderRight: i < 3 ? '1px solid #E4E8EF' : 'none' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(notifs).map(([key, val], idx) => (
                      <tr key={key} style={{ background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                        <td style={{ ...TD }}>{val.label}</td>
                        {(['email', 'sms', 'inApp'] as const).map((ch, ci) => (
                          <td key={ch} style={{ ...TD, textAlign: 'center', borderRight: ci < 2 ? '1px solid #E4E8EF' : 'none' }}>
                            <input type="checkbox" checked={val[ch]} aria-label={`${val.label} via ${ch}`}
                              onChange={e => setNotifs(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof prev], [ch]: e.target.checked } }))}
                              className="w-4 h-4 cursor-pointer" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>

              <div className="grid grid-cols-2 gap-4">
                <Section title="Daily Digest" sub="Receive a summary at a scheduled time each day.">
                  <div>
                    <Label htmlFor="digestTime">Send digest at</Label>
                    <input id="digestTime" type="time" style={inputStyle} value={digestTime}
                      onChange={e => setDigestTime(e.target.value)} />
                  </div>
                </Section>
                <Section title="Quiet Hours" sub="Pause notifications during specified hours.">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12.5px] font-semibold" style={{ color: '#111827' }}>Enable quiet hours</span>
                    <Toggle id="quiet-toggle" checked={quietHours} onChange={setQuietHours} label="Enable quiet hours" />
                  </div>
                  {quietHours && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="quietFrom">From</Label>
                        <input id="quietFrom" type="time" style={inputStyle} value={quietFrom} onChange={e => setQuietFrom(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="quietTo">To</Label>
                        <input id="quietTo" type="time" style={inputStyle} value={quietTo} onChange={e => setQuietTo(e.target.value)} />
                      </div>
                    </div>
                  )}
                </Section>
              </div>
              <div className="flex justify-end mt-2">
                <button onClick={triggerSave} className="btn-p h-9 px-5 text-[12.5px] justify-center" style={{ borderRadius: 6 }}>
                  <span className="material-icons-outlined" style={{ fontSize: 15 }} aria-hidden="true">save</span>Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* ── BRANCH ── */}
          {tab === 'branch' && (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <Section title="Assignment" sub="Your assigned branch and capacity limits.">
                  <div className="mb-4">
                    <Label htmlFor="assignedBranch">Assigned Branch</Label>
                    <select id="assignedBranch" style={inputStyle} value={branchCfg.assignedBranch}
                      onChange={e => setBranchCfg(b => ({ ...b, assignedBranch: e.target.value }))}>
                      {BRANCHES.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { id: 'maxDaily',    label: 'Max Daily',    key: 'maxDailyTotal' },
                      { id: 'maxPerDoc',   label: 'Per Doctor',   key: 'maxPerDoctor'  },
                      { id: 'maxWalkIn',   label: 'Walk-ins',     key: 'maxWalkIns'    },
                    ] as const).map(f => (
                      <div key={f.id}>
                        <Label htmlFor={f.id}>{f.label}</Label>
                        <input id={f.id} type="number" min={1} max={100} style={inputStyle}
                          value={branchCfg[f.key]}
                          onChange={e => setBranchCfg(b => ({ ...b, [f.key]: Number(e.target.value) }))} />
                      </div>
                    ))}
                  </div>
                </Section>
                <Section title="Branch Contact" sub="Phone, address, and emergency contact.">
                  {([
                    { id: 'bPhone',   label: 'Branch Phone',      key: 'branchPhone'      },
                    { id: 'bAddr',    label: 'Address',            key: 'branchAddress'    },
                    { id: 'bEmerg',   label: 'Emergency Contact',  key: 'emergencyContact' },
                  ] as const).map(f => (
                    <div key={f.id} className="mb-3">
                      <Label htmlFor={f.id}>{f.label}</Label>
                      <input id={f.id} style={inputStyle} value={branchCfg[f.key]}
                        onChange={e => setBranchCfg(b => ({ ...b, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                </Section>
              </div>
              <Section title="Working Hours" sub="Set operating hours per day. Disabled days show as Closed.">
                <div style={{ border: '1px solid #E4E8EF', borderRadius: 6, overflow: 'hidden' }}>
                  {DAYS.map((day, i) => {
                    const cfg = branchCfg.hours[day];
                    return (
                      <div key={day} className="flex items-center gap-4 px-4 py-3"
                        style={{ borderBottom: i < DAYS.length - 1 ? '1px solid #F1F5F9' : 'none', background: cfg.enabled ? '#fff' : '#FAFAFA' }}>
                        <label className="flex items-center gap-2 cursor-pointer" style={{ width: 112, flexShrink: 0 }}>
                          <input type="checkbox" checked={cfg.enabled}
                            aria-label={`Enable ${day}`}
                            onChange={e => setBranchCfg(b => ({ ...b, hours: { ...b.hours, [day]: { ...cfg, enabled: e.target.checked } } }))}
                            className="w-4 h-4" />
                          <span className="text-[12.5px] font-semibold" style={{ color: cfg.enabled ? '#111827' : '#94A3B8' }}>{day}</span>
                        </label>
                        {cfg.enabled ? (
                          <div className="flex items-center gap-2">
                            <input type="time" aria-label={`${day} start time`} style={{ ...inputStyle, width: 100 }} value={cfg.from}
                              onChange={e => setBranchCfg(b => ({ ...b, hours: { ...b.hours, [day]: { ...cfg, from: e.target.value } } }))} />
                            <span className="text-[11.5px]" style={{ color: '#94A3B8' }}>to</span>
                            <input type="time" aria-label={`${day} end time`} style={{ ...inputStyle, width: 100 }} value={cfg.to}
                              onChange={e => setBranchCfg(b => ({ ...b, hours: { ...b.hours, [day]: { ...cfg, to: e.target.value } } }))} />
                          </div>
                        ) : (
                          <span className="text-[12px]" style={{ color: '#94A3B8' }}>Closed</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Section>
              <div className="flex justify-end mt-2">
                <button onClick={triggerSave} className="btn-p h-9 px-5 text-[12.5px] justify-center" style={{ borderRadius: 6 }}>
                  <span className="material-icons-outlined" style={{ fontSize: 15 }} aria-hidden="true">save</span>Save Branch Config
                </button>
              </div>
            </div>
          )}

          {/* ── SECURITY ── */}
          {tab === 'security' && (
            <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
              {/* Left: sessions */}
              <div>
                <Section title="Active Sessions" sub="All devices currently logged in to your account.">
                  {[
                    { device: 'Chrome on Windows 11', ip: '192.168.1.x',   time: 'Now · Current',        current: true  },
                    { device: 'Safari on iPhone 15',  ip: '122.54.x.x',    time: '2026-06-21 11:30 PM',  current: false },
                  ].map(s => (
                    <div key={s.device} className="flex items-start justify-between py-3"
                      style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <div className="flex items-center gap-3">
                        <span className="material-icons-outlined" style={{ fontSize: 20, color: '#6B7280' }} aria-hidden="true">
                          {s.device.includes('iPhone') ? 'smartphone' : 'computer'}
                        </span>
                        <div>
                          <div className="text-[12.5px] font-semibold" style={{ color: '#111827' }}>{s.device}</div>
                          <div className="text-[11px]" style={{ color: '#6B7280' }}>IP: {s.ip} · {s.time}</div>
                        </div>
                      </div>
                      {s.current
                        ? <span className="text-[10.5px] font-bold px-2 py-0.5" style={{ background: '#ECFDF5', color: '#16A34A', borderRadius: 4 }}>This device</span>
                        : <button onClick={() => {}} className="text-[11.5px] font-semibold border-0 cursor-pointer px-2 py-1 rounded"
                            style={{ background: '#FEF2F2', color: '#DC2626', borderRadius: 4, fontFamily: "'Poppins',sans-serif" }}
                            aria-label="Revoke iPhone 15 Safari session">Revoke</button>
                      }
                    </div>
                  ))}
                </Section>
                {/* Danger zone */}
                <div className="bg-white p-5" style={{ border: '1.5px solid #FCA5A5', borderRadius: 8 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons-outlined" style={{ fontSize: 18, color: '#DC2626' }} aria-hidden="true">warning</span>
                    <h3 className="text-[13px] font-bold" style={{ color: '#DC2626' }}>Danger Zone</h3>
                  </div>
                  <p className="text-[12px] mb-4" style={{ color: '#6B7280' }}>
                    Sign out all other sessions. Your current session will remain active.
                  </p>
                  <button onClick={() => setShowDanger(true)}
                    className="w-full h-9 flex items-center justify-center gap-2 border-0 cursor-pointer font-bold text-[12.5px]"
                    style={{ background: '#FEF2F2', color: '#DC2626', borderRadius: 6, border: '1.5px solid #FCA5A5', fontFamily: "'Poppins',sans-serif" }}>
                    <span className="material-icons-outlined" style={{ fontSize: 15 }} aria-hidden="true">logout</span>
                    Sign Out All Other Sessions
                  </button>
                </div>
              </div>

              {/* Right: password + 2FA */}
              <div>
                <Section title="Change Password" sub="Use a strong password of at least 8 characters.">
                  {([
                    { id: 'secCur', label: 'Current Password', key: 'current' as const },
                    { id: 'secNew', label: 'New Password',     key: 'newPass' as const, hint: 'Min 8 characters' },
                    { id: 'secCon', label: 'Confirm Password', key: 'confirm' as const },
                  ]).map(f => (
                    <div key={f.id} className="mb-3">
                      <Label htmlFor={f.id}>{f.label}</Label>
                      <input id={f.id} type="password" style={{
                        ...inputStyle,
                        borderColor: f.key === 'confirm' && passError ? '#EF4444' : '#E4E8EF',
                      }}
                        placeholder={f.hint ?? '••••••••'}
                        value={sec[f.key]}
                        onChange={e => setSec(s => ({ ...s, [f.key]: e.target.value }))}
                        aria-invalid={f.key === 'confirm' && passError}
                        aria-describedby={f.key === 'confirm' && passError ? 'pass-mismatch' : undefined} />
                      {f.key === 'confirm' && passError && (
                        <p id="pass-mismatch" role="alert" className="text-[11px] mt-1" style={{ color: '#EF4444' }}>
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  ))}
                  <button disabled={!passMatch} onClick={triggerSave}
                    className="btn-p w-full h-9 text-[12.5px] justify-center mt-1"
                    style={{ borderRadius: 6, opacity: passMatch ? 1 : 0.4, cursor: passMatch ? 'pointer' : 'not-allowed' }}>
                    <span className="material-icons-outlined" style={{ fontSize: 15 }} aria-hidden="true">lock_reset</span>
                    Update Password
                  </button>
                </Section>

                <Section title="Two-Factor Authentication" sub="Add an extra layer of security with an authenticator app.">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[12.5px] font-semibold" style={{ color: '#111827' }}>Authenticator App (TOTP)</div>
                      <div className="text-[11.5px]" style={{ color: '#6B7280' }}>Google Authenticator, Authy, etc.</div>
                    </div>
                    <Toggle id="mfa-toggle" checked={mfa} onChange={setMfa} label="Enable two-factor authentication" />
                  </div>
                  {mfa && (
                    <div className="p-3 rounded text-[12px]" style={{ background: '#EEEFFD', color: '#5B65DC', borderRadius: 6 }}>
                      QR code setup requires backend integration — available in production deployment.
                    </div>
                  )}
                </Section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
