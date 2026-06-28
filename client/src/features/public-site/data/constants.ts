export const DOCS = [
  {
    id: 1, initials: 'SC', hue: 232, name: 'Dr. Sarah Chen',
    creds: 'MD, FACC', specialty: 'Cardiology', branch: 'City Clinic',
    insurance: ['Maxicare', 'MediCard', 'PhilHealth', 'Intellicare'],
    next: 'Today', rating: 4.9, reviews: 128, exp: 12,
    langs: 'English, Mandarin',
    bio: 'Board-certified cardiologist with 12+ years in preventive cardiology and heart disease management. Committed to evidence-based, compassionate care for every patient.',
    nextSlot: '10:00 AM',
  },
  {
    id: 2, initials: 'MT', hue: 210, name: 'Dr. Michael Torres',
    creds: 'MD, FAAOS', specialty: 'Orthopedics', branch: 'North Branch',
    insurance: ['Intellicare', 'Maxicare', 'Insular Health'],
    next: 'Tomorrow', rating: 4.7, reviews: 94, exp: 8,
    langs: 'English, Spanish',
    bio: 'Sports medicine and joint replacement specialist. Focus on rehabilitation and long-term mobility for athletes and active patients.',
    nextSlot: 'Tomorrow 9:00 AM',
  },
  {
    id: 3, initials: 'AP', hue: 250, name: 'Dr. Amara Patel',
    creds: 'MD, FAAP', specialty: 'Pediatrics', branch: 'East Clinic',
    insurance: ['Maxicare', 'MediCard', 'PhilHealth', 'Cocolife'],
    next: 'Today', rating: 4.8, reviews: 211, exp: 15,
    langs: 'English, Hindi, Gujarati',
    bio: '15+ years caring for children from newborns to teenagers in a warm, reassuring environment focused on development and family health.',
    nextSlot: '2:30 PM',
  },
  {
    id: 4, initials: 'JO', hue: 20, name: "Dr. James O'Brien",
    creds: 'MD, FAAD', specialty: 'Dermatology', branch: 'City Clinic',
    insurance: ['MediCard', 'Intellicare', 'Maxicare'],
    next: 'Wednesday', rating: 4.6, reviews: 76, exp: 10,
    langs: 'English',
    bio: 'Medical and cosmetic dermatologist focused on skin cancer prevention, acne management, and evidence-based treatments.',
    nextSlot: 'Wed 11:00 AM',
  },
  {
    id: 5, initials: 'PS', hue: 270, name: 'Dr. Priya Sharma',
    creds: 'MD, PhD', specialty: 'Neurology', branch: 'West Branch',
    insurance: ['Maxicare', 'PhilHealth'],
    next: 'Monday', rating: 4.5, reviews: 53, exp: 18,
    langs: 'English, Hindi',
    bio: 'Research neurologist specializing in headache disorders and epilepsy, bringing the latest evidence-based treatments to practice.',
    nextSlot: 'Mon 9:30 AM',
  },
  {
    id: 6, initials: 'LK', hue: 195, name: 'Dr. Lucas Kim',
    creds: 'MD', specialty: 'Family Medicine', branch: 'South Clinic',
    insurance: ['Maxicare', 'MediCard', 'PhilHealth', 'Intellicare', 'Cocolife'],
    next: 'Today', rating: 4.9, reviews: 305, exp: 7,
    langs: 'English, Korean',
    bio: 'Comprehensive primary care for all ages. Focus on chronic disease management, preventive health, and lasting doctor-patient relationships.',
    nextSlot: '3:00 PM',
  },
] as const;

export const STATS = [
  { icon: 'calendar_month', value: '10,000+', label: 'Appointments booked' },
  { icon: 'groups',         value: '50+',     label: 'Specialist doctors' },
  { icon: 'location_city',  value: '5',       label: 'Clinic branches' },
  { icon: 'star',           value: '4.9★',    label: 'Patient satisfaction' },
] as const;

export const SERVICES = [
  { icon: 'local_hospital',   name: 'General Consultation', tag: 'Walk-in & Booked',  desc: 'Licensed physicians for first visits and routine checkups.',                   delay: 0   },
  { icon: 'medical_services', name: 'Specialist Referral',  tag: 'No GP Required',    desc: 'Direct access to 50+ board-certified specialists.',                           delay: 80  },
  { icon: 'science',          name: 'Preventive Screening', tag: 'Annual & Periodic', desc: 'Full blood panels, cancer screening, and annual physicals.',                   delay: 160 },
  { icon: 'child_care',       name: 'Pediatric Care',       tag: 'Ages 0–18',         desc: 'Child-focused consultations from newborn to adolescent.',                      delay: 240 },
  { icon: 'pregnant_woman',   name: "Women's Health",       tag: 'OB-GYN & Wellness', desc: "OB-GYN, prenatal care, and complete women's wellness.",                       delay: 320 },
  { icon: 'biotech',          name: 'Diagnostic Services',  tag: 'In-Clinic Lab',     desc: 'Lab tests and imaging at your branch.',                                        delay: 400 },
] as const;

export const SERVICES_DETAILED = SERVICES.map(s => ({
  ...s,
  bullets: ['Available at all 5 branches', 'Insurance pre-verified', 'Book online, instant confirmation'],
}));

export const FEATURES = [
  { icon: 'verified_user',        title: 'Insurance-Ready',     desc: 'Filter by coverage. No billing surprises.',           delay: 0   },
  { icon: 'timer',                title: 'Live Queue Tracking',  desc: 'See your queue position in real time.',               delay: 80  },
  { icon: 'workspace_premium',    title: 'Licensed Physicians',  desc: 'Every physician board-certified with active PRC license.', delay: 160 },
  { icon: 'notifications_active', title: 'Instant Confirmation', desc: 'SMS and email when appointment is approved.',         delay: 240 },
  { icon: 'event_available',      title: 'Zero Double-Booking',  desc: 'Your slot secured the moment you confirm.',           delay: 320 },
  { icon: 'folder_shared',        title: 'Secure Records',       desc: 'All visits and results in your profile.',             delay: 400 },
] as const;

export const TESTIMONIALS = [
  { quote: 'Booked in under 3 minutes. Tracked my queue on my phone, was out in 45 minutes. Game changer.',                                                                                 name: 'Maria S.', initials: 'MS', avatarBg: '#5B65DC', specialty: 'Cardiology',    delay: 0   },
  { quote: "Platform verifies Maxicare coverage upfront. No billing surprises. The live queue tracker is something I didn't know I needed.",                                                 name: 'Jose R.',  initials: 'JR', avatarBg: '#122056', specialty: 'Orthopedics',  delay: 100 },
  { quote: 'My whole family uses MedPoint now. Booking for my kids is effortless and records are organized in one place.',                                                                   name: 'Ana L.',   initials: 'AL', avatarBg: '#334155', specialty: 'Pediatrics',   delay: 200 },
] as const;

export const MILESTONES = [
  { year: '2010', event: 'Founded by board-certified specialists in Manila' },
  { year: '2013', event: 'North and East branches; 30+ doctors' },
  { year: '2018', event: 'Digital portal and online booking launched' },
  { year: '2023', event: '5 branches; expanded multi-specialty services' },
] as const;

export const VALUES = [
  { icon: 'favorite',          title: 'Compassion',  desc: 'Every patient treated with genuine care and dignity.' },
  { icon: 'workspace_premium', title: 'Excellence',  desc: 'We uphold the highest clinical standards.' },
  { icon: 'handshake',         title: 'Integrity',   desc: 'Transparent billing, honest communication.' },
  { icon: 'lightbulb',         title: 'Innovation',  desc: 'Continuously adopting better tools for care.' },
] as const;

export const BRANCHES = [
  { name: 'City Clinic (Main)', address: 'E. Rodriguez Sr. Ave., QC',        hours: '7AM–9PM' },
  { name: 'North Branch',       address: 'Commonwealth Ave., QC',            hours: '8AM–8PM' },
  { name: 'East Clinic',        address: 'Ortigas Ave., Pasig City',         hours: '8AM–8PM' },
  { name: 'West Branch',        address: 'EDSA, Mandaluyong City',           hours: '8AM–6PM' },
  { name: 'South Clinic',       address: 'Alabang–Zapote Rd., Muntinlupa',   hours: '8AM–6PM' },
] as const;

export const INS_LIST = ['Maxicare', 'MediCard', 'PhilHealth', 'Intellicare', 'Insular Health', 'Cocolife'] as const;

export const NEWS_ALL = [
  { id: 1, category: 'ANNOUNCEMENT', date: 'June 15, 2026', filter: 'announcement', accentColor: '#5B65DC', tagClass: 'tag-indigo', delay: 0,
    title: 'Same-day appointment booking now live across all 5 branches',
    excerpt: 'Book same-day consultations across all branches – no waiting list for urgent care.' },
  { id: 2, category: 'NEW SERVICE',   date: 'June 10, 2026', filter: 'service',      accentColor: '#122056', tagClass: 'tag-navy',   delay: 100,
    title: 'Teleconsultation launching July 2026 for all departments',
    excerpt: 'Video consultations with MedPoint specialists for follow-ups starting July 1.' },
  { id: 3, category: 'HEALTH TIP',    date: 'June 1, 2026',  filter: 'health',       accentColor: '#5B65DC', tagClass: 'tag-indigo', delay: 200,
    title: 'Free cardiac screening for all PhilHealth members in June',
    excerpt: 'Complimentary cardiac screenings in partnership with PhilHealth. Limited slots.' },
  { id: 4, category: 'ANNOUNCEMENT',  date: 'May 28, 2026',  filter: 'announcement', accentColor: '#5B65DC', tagClass: 'tag-indigo', delay: 0,
    title: 'North Branch accepting walk-in patients on weekends',
    excerpt: 'Starting June 1, North Branch extends weekend hours from 8AM to 4PM.' },
  { id: 5, category: 'NEW SERVICE',   date: 'May 20, 2026',  filter: 'service',      accentColor: '#122056', tagClass: 'tag-navy',   delay: 100,
    title: 'Digital health records accessible via patient portal 24/7',
    excerpt: 'Lab results, prescriptions, and visit notes available anytime.' },
  { id: 6, category: 'HEALTH TIP',    date: 'May 15, 2026',  filter: 'health',       accentColor: '#5B65DC', tagClass: 'tag-indigo', delay: 200,
    title: 'Annual executive physical packages available at City Clinic',
    excerpt: 'Comprehensive checkup packages including ECG, blood panels, X-ray.' },
] as const;

export const SPEC_PILLS = [
  { name: 'All',             icon: 'apps',                    spec: '' },
  { name: 'Cardiology',      icon: 'favorite',                spec: 'Cardiology' },
  { name: 'Neurology',       icon: 'psychology',              spec: 'Neurology' },
  { name: 'Orthopedics',     icon: 'accessibility_new',       spec: 'Orthopedics' },
  { name: 'Pediatrics',      icon: 'child_care',              spec: 'Pediatrics' },
  { name: 'Dermatology',     icon: 'face_retouching_natural', spec: 'Dermatology' },
  { name: 'Family Medicine', icon: 'local_hospital',          spec: 'Family Medicine' },
] as const;

export const TIMES = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'] as const;
export const WDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const MONTHS_ARR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const TODAY = new Date(2026, 5, 22);

export const TEAM = [
  {
    name: 'Dr. Elena Reyes', role: 'Medical Director', creds: 'MD, FPCS', hue: 232, initials: 'ER',
    desc: 'Board-certified surgeon with 20+ years leading multi-specialty clinical programs across Metro Manila.',
  },
  {
    name: 'Dr. Ramon Villanueva', role: 'Chief of Medicine', creds: 'MD, FACP', hue: 210, initials: 'RV',
    desc: 'Internal medicine specialist and PhilHealth partner liaison with 18 years in clinical leadership.',
  },
  {
    name: 'Ms. Christine Lim', role: 'Chief Operations Officer', creds: 'MBA, CPHQ', hue: 158, initials: 'CL',
    desc: 'Leads branch operations, patient experience strategy, and digital health transformation initiatives.',
  },
  {
    name: 'Dr. Riza Manalo', role: 'Director of Nursing', creds: 'RN, MAN', hue: 195, initials: 'RM',
    desc: 'Oversees clinical nursing standards and staff development programs across all 5 branches.',
  },
] as const;

export const PROCESS_STEPS = [
  { num: '01', icon: 'search',         title: 'Find Your Doctor',  desc: 'Search by specialty, insurance, branch, or real-time availability. Filter results in seconds.' },
  { num: '02', icon: 'calendar_today', title: 'Choose a Slot',     desc: 'Pick a date and time that works for your schedule. See live availability — no waiting lists.' },
  { num: '03', icon: 'verified_user',  title: 'Confirm Booking',   desc: 'Enter your details, verify insurance coverage, and confirm. Instant SMS and email confirmation sent.' },
  { num: '04', icon: 'local_hospital', title: 'Visit & Get Care',  desc: 'Walk in at your appointment time. No paperwork queues — just sign in at reception and see your doctor.' },
] as const;

export const INS_PARTNERS = [
  { name: 'Maxicare',       icon: 'health_and_safety', color: '#0078D4' },
  { name: 'MediCard',       icon: 'medical_services',  color: '#E63946' },
  { name: 'PhilHealth',     icon: 'account_balance',   color: '#2D6A4F' },
  { name: 'Intellicare',    icon: 'favorite',          color: '#5B65DC' },
  { name: 'Insular Health', icon: 'shield',            color: '#F4A261' },
  { name: 'Cocolife',       icon: 'verified_user',     color: '#122056' },
] as const;

export const FAQS = [
  {
    q: 'Do I need to create an account to book an appointment?',
    a: 'No account required. You can book as a guest by providing your name, contact number, and email. Returning patients simply verify their phone number to access previous booking history.',
  },
  {
    q: 'Which insurance plans are accepted?',
    a: 'We accept Maxicare, MediCard, PhilHealth, Intellicare, Insular Health, and Cocolife across all 5 branches. Insurance eligibility is verified before your visit at no extra charge.',
  },
  {
    q: 'Can I reschedule or cancel my appointment?',
    a: 'Yes. Reply to your confirmation SMS or call the branch directly at least 2 hours before your appointment to reschedule or cancel without any penalty fee.',
  },
  {
    q: 'How do I know if a doctor is available today?',
    a: 'Doctors with real-time availability show a live pulsing badge on their profile card. You can also use the "Available Today" filter on the Find a Doctor page to quickly narrow results.',
  },
  {
    q: 'Are my medical records and personal data secure?',
    a: 'All records are stored with end-to-end encryption and are fully compliant with the Philippine Data Privacy Act of 2012 (RA 10173). Your data is never shared without your explicit written consent.',
  },
  {
    q: 'What happens if the doctor I want has no available slots?',
    a: 'You can join a waitlist for the doctor and branch of your choice. We will notify you via SMS immediately when a slot opens up, and you can confirm in one tap.',
  },
] as const;

export const ACCREDITATIONS = [
  { icon: 'health_and_safety',  label: 'Licensed Facility',       sub: 'Board-Certified Specialists' },
  { icon: 'account_balance',    label: 'PhilHealth Affiliated',   sub: 'SSS & GSIS Covered' },
  { icon: 'workspace_premium',  label: 'JCI Standards',           sub: 'International Quality' },
  { icon: 'science',            label: 'ISO 9001:2015',           sub: 'Certified Operations' },
  { icon: 'security',           label: 'HIPAA Compliant',         sub: 'Data Privacy Act' },
] as const;
