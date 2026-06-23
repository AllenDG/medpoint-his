export type AppStatus    = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no-show';
export type WorkflowStep = 'submitted' | 'under_review' | 'validated' | 'endorsed' | 'in_triage' | 'with_doctor' | 'completed' | 'cancelled';
export type Priority     = 'urgent' | 'normal' | 'low';

export interface Patient {
  id: string; name: string; email: string; phone: string;
  dob: string; gender: 'M' | 'F'; insurance: string;
  address: string; lastVisit: string; totalVisits: number;
  initials: string; hue: number;
}

export interface Appointment {
  id: string; patientId: string; patientName: string;
  doctorId: number; doctorName: string; specialty: string;
  branch: string; date: string; time: string; type: string;
  status: AppStatus; insurance: string; notes: string; createdAt: string;
  workflowStep: WorkflowStep;
  priority: Priority;
  endorsedTo?: string;
  endorsedAt?: string;
  triageNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const MOCK_PATIENTS: Patient[] = [
  { id:'P001', name:'Maria Santos',     email:'maria.santos@gmail.com',  phone:'0917-123-4567', dob:'1985-03-12', gender:'F', insurance:'Maxicare',      address:'Quezon City',    lastVisit:'2026-06-15', totalVisits:8,  initials:'MS', hue:232 },
  { id:'P002', name:'Jose Reyes',       email:'jose.reyes@gmail.com',    phone:'0918-234-5678', dob:'1978-07-22', gender:'M', insurance:'PhilHealth',    address:'Pasig City',     lastVisit:'2026-06-10', totalVisits:3,  initials:'JR', hue:195 },
  { id:'P003', name:'Ana Cruz',         email:'ana.cruz@gmail.com',      phone:'0919-345-6789', dob:'1992-11-05', gender:'F', insurance:'MediCard',      address:'Mandaluyong',    lastVisit:'2026-05-28', totalVisits:12, initials:'AC', hue:158 },
  { id:'P004', name:'Ricardo Lim',      email:'r.lim@gmail.com',         phone:'0920-456-7890', dob:'1965-01-30', gender:'M', insurance:'Intellicare',   address:'Muntinlupa',     lastVisit:'2026-06-20', totalVisits:5,  initials:'RL', hue:20  },
  { id:'P005', name:'Patricia Tan',     email:'patricia.tan@gmail.com',  phone:'0921-567-8901', dob:'1990-08-14', gender:'F', insurance:'Maxicare',      address:'Quezon City',    lastVisit:'2026-06-18', totalVisits:2,  initials:'PT', hue:270 },
  { id:'P006', name:'Kevin Garcia',     email:'kevin.garcia@gmail.com',  phone:'0922-678-9012', dob:'1988-04-19', gender:'M', insurance:'Cocolife',      address:'Mandaluyong',    lastVisit:'2026-06-12', totalVisits:7,  initials:'KG', hue:340 },
  { id:'P007', name:'Elena Villanueva', email:'elena.v@gmail.com',       phone:'0923-789-0123', dob:'1975-09-25', gender:'F', insurance:'Insular Health', address:'Pasig City',    lastVisit:'2026-06-22', totalVisits:15, initials:'EV', hue:210 },
  { id:'P008', name:'Marco Dela Cruz',  email:'marco.dc@gmail.com',      phone:'0924-890-1234', dob:'2005-12-03', gender:'M', insurance:'PhilHealth',    address:'Quezon City',    lastVisit:'2026-06-22', totalVisits:1,  initials:'MD', hue:45  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id:'A001', patientId:'P001', patientName:'Maria Santos',     doctorId:1, doctorName:'Dr. Sarah Chen',     specialty:'Cardiology',      branch:'City Clinic',  date:'2026-06-22', time:'10:00 AM', type:'Follow-up',       status:'confirmed',  insurance:'Maxicare',       notes:'Hypertension monitoring. BP was 140/90 last visit.',  createdAt:'2026-06-19 08:30', workflowStep:'validated',  priority:'normal' },
  { id:'A002', patientId:'P003', patientName:'Ana Cruz',         doctorId:3, doctorName:'Dr. Amara Patel',   specialty:'Pediatrics',      branch:'East Clinic',  date:'2026-06-22', time:'2:30 PM',  type:'Check-up',        status:'confirmed',  insurance:'MediCard',       notes:'Annual wellness checkup for 3-year-old.',              createdAt:'2026-06-20 10:15', workflowStep:'endorsed',   priority:'normal', endorsedTo:'nurse002', endorsedAt:'2026-06-21 09:00' },
  { id:'A003', patientId:'P006', patientName:'Kevin Garcia',     doctorId:6, doctorName:'Dr. Lucas Kim',     specialty:'Family Medicine', branch:'South Clinic', date:'2026-06-22', time:'3:00 PM',  type:'General Consult', status:'pending',    insurance:'Cocolife',       notes:'Fever and cough for 3 days.',                          createdAt:'2026-06-22 07:45', workflowStep:'submitted',  priority:'urgent' },
  { id:'A004', patientId:'P002', patientName:'Jose Reyes',       doctorId:2, doctorName:'Dr. Michael Torres',specialty:'Orthopedics',     branch:'North Branch', date:'2026-06-23', time:'9:00 AM',  type:'New Patient',     status:'confirmed',  insurance:'PhilHealth',     notes:'Knee pain assessment — right knee, 2 months.',         createdAt:'2026-06-21 14:00', workflowStep:'endorsed',   priority:'normal', endorsedTo:'nurse003', endorsedAt:'2026-06-22 08:30' },
  { id:'A005', patientId:'P005', patientName:'Patricia Tan',     doctorId:5, doctorName:'Dr. Priya Sharma',  specialty:'Neurology',       branch:'West Branch',  date:'2026-06-23', time:'11:00 AM', type:'Consult',         status:'pending',    insurance:'Maxicare',       notes:'Recurring headaches, started 6 weeks ago.',            createdAt:'2026-06-22 09:00', workflowStep:'under_review', priority:'normal', reviewedBy:'Admin' },
  { id:'A006', patientId:'P004', patientName:'Ricardo Lim',      doctorId:4, doctorName:"Dr. James O'Brien", specialty:'Dermatology',     branch:'City Clinic',  date:'2026-06-24', time:'11:00 AM', type:'Follow-up',       status:'confirmed',  insurance:'Intellicare',    notes:'Acne treatment review — 3rd session.',                 createdAt:'2026-06-18 16:00', workflowStep:'validated',  priority:'low' },
  { id:'A007', patientId:'P007', patientName:'Elena Villanueva', doctorId:1, doctorName:'Dr. Sarah Chen',    specialty:'Cardiology',      branch:'City Clinic',  date:'2026-06-22', time:'9:00 AM',  type:'Check-up',        status:'completed',  insurance:'Insular Health', notes:'Annual cardiac screen completed. Normal results.',      createdAt:'2026-06-15 11:00', workflowStep:'completed',  priority:'normal' },
  { id:'A008', patientId:'P008', patientName:'Marco Dela Cruz',  doctorId:3, doctorName:'Dr. Amara Patel',   specialty:'Pediatrics',      branch:'East Clinic',  date:'2026-06-20', time:'2:00 PM',  type:'New Patient',     status:'completed',  insurance:'PhilHealth',     notes:'First visit. Growth charts normal for age 20.',        createdAt:'2026-06-18 10:30', workflowStep:'completed',  priority:'normal' },
  { id:'A009', patientId:'P001', patientName:'Maria Santos',     doctorId:6, doctorName:'Dr. Lucas Kim',     specialty:'Family Medicine', branch:'City Clinic',  date:'2026-06-19', time:'10:30 AM', type:'Follow-up',       status:'completed',  insurance:'Maxicare',       notes:'Blood pressure recheck. Now 130/85.',                  createdAt:'2026-06-14 09:00', workflowStep:'completed',  priority:'normal' },
  { id:'A010', patientId:'P003', patientName:'Ana Cruz',         doctorId:2, doctorName:'Dr. Michael Torres',specialty:'Orthopedics',     branch:'North Branch', date:'2026-06-18', time:'3:00 PM',  type:'Consult',         status:'cancelled',  insurance:'MediCard',       notes:'Patient requested reschedule — conflict at work.',     createdAt:'2026-06-12 14:00', workflowStep:'cancelled',  priority:'normal' },
  { id:'A011', patientId:'P006', patientName:'Kevin Garcia',     doctorId:4, doctorName:"Dr. James O'Brien", specialty:'Dermatology',     branch:'City Clinic',  date:'2026-06-25', time:'11:00 AM', type:'Follow-up',       status:'confirmed',  insurance:'Cocolife',       notes:'Post-treatment assessment.',                           createdAt:'2026-06-20 11:30', workflowStep:'endorsed',   priority:'low',    endorsedTo:'nurse001', endorsedAt:'2026-06-21 14:00' },
  { id:'A012', patientId:'P002', patientName:'Jose Reyes',       doctorId:5, doctorName:'Dr. Priya Sharma',  specialty:'Neurology',       branch:'West Branch',  date:'2026-06-26', time:'9:30 AM',  type:'Consult',         status:'pending',    insurance:'PhilHealth',     notes:'MRI results review — ordered last week.',              createdAt:'2026-06-22 08:00', workflowStep:'submitted',  priority:'urgent' },
  { id:'A013', patientId:'P005', patientName:'Patricia Tan',     doctorId:1, doctorName:'Dr. Sarah Chen',    specialty:'Cardiology',      branch:'City Clinic',  date:'2026-06-17', time:'10:00 AM', type:'Consult',         status:'no-show',    insurance:'Maxicare',       notes:'Did not arrive. SMS sent, no response.',               createdAt:'2026-06-14 15:00', workflowStep:'completed',  priority:'normal' },
  { id:'A014', patientId:'P004', patientName:'Ricardo Lim',      doctorId:6, doctorName:'Dr. Lucas Kim',     specialty:'Family Medicine', branch:'South Clinic', date:'2026-06-27', time:'3:00 PM',  type:'Check-up',        status:'confirmed',  insurance:'Intellicare',    notes:'Diabetes management check. A1c due.',                 createdAt:'2026-06-21 13:00', workflowStep:'validated',  priority:'urgent' },
  { id:'A015', patientId:'P007', patientName:'Elena Villanueva', doctorId:3, doctorName:'Dr. Amara Patel',   specialty:'Pediatrics',      branch:'East Clinic',  date:'2026-06-28', time:'2:30 PM',  type:'Follow-up',       status:'pending',    insurance:'Insular Health', notes:'Child development follow-up.',                         createdAt:'2026-06-22 10:00', workflowStep:'under_review', priority:'low', reviewedBy:'Support' },
];

export const MOCK_NURSES = [
  { id: 'nurse001', name: 'Nurse Maria Santos',  branch: 'City Clinic'  },
  { id: 'nurse002', name: 'Nurse Ana Cruz',      branch: 'East Clinic'  },
  { id: 'nurse003', name: 'Nurse Jose Reyes',    branch: 'North Branch' },
  { id: 'nurse004', name: 'Nurse Elena Garcia',  branch: 'East Clinic'  },
  { id: 'nurse005', name: 'Nurse Kevin Lim',     branch: 'South Clinic' },
  { id: 'nurse006', name: 'Nurse Patricia Tan',  branch: 'West Branch'  },
];

export const WEEKLY_DATA = [
  { day:'Mon', date:'2026-06-22', count:4 },
  { day:'Tue', date:'2026-06-23', count:2 },
  { day:'Wed', date:'2026-06-24', count:1 },
  { day:'Thu', date:'2026-06-25', count:1 },
  { day:'Fri', date:'2026-06-26', count:1 },
  { day:'Sat', date:'2026-06-27', count:1 },
  { day:'Sun', date:'2026-06-28', count:1 },
];

export const SPECIALTY_DATA = [
  { name:'Cardiology',       count:4, color:'#5B65DC' },
  { name:'Pediatrics',       count:3, color:'#16A34A' },
  { name:'Family Medicine',  count:3, color:'#0EA5E9' },
  { name:'Orthopedics',      count:2, color:'#F59E0B' },
  { name:'Dermatology',      count:2, color:'#EC4899' },
  { name:'Neurology',        count:2, color:'#8B5CF6' },
];

export const ACTIVITY_LOG = [
  { id:1, time:'10:42 AM', user:'Admin',   action:'Confirmed appointment A001 for Maria Santos (Cardiology)',       type:'confirm'  },
  { id:2, time:'10:15 AM', user:'Support', action:'Created new appointment A003 for Kevin Garcia (Family Med)',     type:'create'   },
  { id:3, time:'09:38 AM', user:'Admin',   action:'Cancelled appointment A010 — patient reschedule request',       type:'cancel'   },
  { id:4, time:'09:05 AM', user:'System',  action:'Appointment A007 Elena Villanueva marked completed',            type:'complete' },
  { id:5, time:'08:50 AM', user:'Admin',   action:'Patient profile P008 Marco Dela Cruz updated',                  type:'edit'     },
  { id:6, time:'08:30 AM', user:'System',  action:"Reminder SMS sent to 4 patients for today's appointments",      type:'notify'   },
  { id:7, time:'Yesterday',user:'System',  action:'End-of-day summary: 3 completed, 1 no-show, 0 cancellations',  type:'report'   },
];

export const STATUS_META: Record<AppStatus, { bg:string; text:string; dot:string; label:string }> = {
  confirmed:  { bg:'#ECFDF5', text:'#16A34A', dot:'#16A34A', label:'Confirmed'  },
  pending:    { bg:'#FFFBEB', text:'#92400E', dot:'#F59E0B', label:'Pending'    },
  completed:  { bg:'#F4F6F9', text:'#64748B', dot:'#94A3B8', label:'Completed'  },
  cancelled:  { bg:'#FFF5F5', text:'#DC2626', dot:'#EF4444', label:'Cancelled'  },
  'no-show':  { bg:'#FEF3F2', text:'#9F1239', dot:'#FB7185', label:'No-show'    },
};

export const WORKFLOW_META: Record<WorkflowStep, { label:string; color:string; bg:string; icon:string }> = {
  submitted:    { label:'Submitted',    color:'#6B7280', bg:'#F4F6F9', icon:'send'             },
  under_review: { label:'Under Review', color:'#92400E', bg:'#FEF3C7', icon:'manage_search'    },
  validated:    { label:'Validated',    color:'#5B65DC', bg:'#EEEFFD', icon:'verified'         },
  endorsed:     { label:'Endorsed',     color:'#0EA5E9', bg:'#E0F2FE', icon:'forward_to_inbox' },
  in_triage:    { label:'In Triage',    color:'#8B5CF6', bg:'#EDE9FE', icon:'medical_services' },
  with_doctor:  { label:'With Doctor',  color:'#16A34A', bg:'#ECFDF5', icon:'stethoscope'      },
  completed:    { label:'Completed',    color:'#64748B', bg:'#F1F5F9', icon:'task_alt'         },
  cancelled:    { label:'Cancelled',    color:'#EF4444', bg:'#FEF2F2', icon:'cancel'           },
};

export const PRIORITY_META: Record<Priority, { label:string; color:string; bg:string }> = {
  urgent: { label:'Urgent', color:'#DC2626', bg:'#FEF2F2' },
  normal: { label:'Normal', color:'#64748B', bg:'#F4F6F9' },
  low:    { label:'Low',    color:'#0EA5E9', bg:'#E0F2FE' },
};

export const MONTHLY_TREND = [
  { month:'Jan', appointments:6,  revenue:15200, newPatients:2 },
  { month:'Feb', appointments:9,  revenue:22800, newPatients:3 },
  { month:'Mar', appointments:7,  revenue:17600, newPatients:1 },
  { month:'Apr', appointments:11, revenue:27900, newPatients:4 },
  { month:'May', appointments:14, revenue:35400, newPatients:5 },
  { month:'Jun', appointments:15, revenue:38000, newPatients:3 },
];

export const SPECIALTY_FEE: Record<string, number> = {
  'Cardiology':      2800,
  'Pediatrics':      1400,
  'Family Medicine': 1000,
  'Orthopedics':     2200,
  'Dermatology':     1600,
  'Neurology':       2400,
};

export const ACTIVITY_ICON: Record<string, { icon:string; color:string }> = {
  confirm:  { icon:'check_circle', color:'#16A34A' },
  create:   { icon:'add_circle',   color:'#5B65DC' },
  cancel:   { icon:'cancel',       color:'#DC2626' },
  complete: { icon:'task_alt',     color:'#64748B' },
  edit:     { icon:'edit',         color:'#F59E0B' },
  notify:   { icon:'notifications',color:'#0EA5E9' },
  report:   { icon:'summarize',    color:'#8B5CF6' },
};
