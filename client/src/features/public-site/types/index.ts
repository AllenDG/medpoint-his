export type Screen = 'home' | 'about' | 'services' | 'news' | 'contact' | 'book';
export type SortBy = 'rating' | 'availability' | 'name';
export type NewsFilter = 'all' | 'announcement' | 'service' | 'health';
export type ProfileTab = 'about' | 'slots';
export type ModalStep = 1 | 2 | 3;
export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  msg: string;
  type: ToastType;
  icon: string;
  iconColor: string;
  title: string;
}

export interface Doctor {
  id: number;
  initials: string;
  hue: number;
  name: string;
  creds: string;
  specialty: string;
  branch: string;
  insurance: readonly string[];
  next: string;
  rating: number;
  reviews: number;
  exp: number;
  langs: string;
  bio: string;
  nextSlot: string;
}

export interface PortalState {
  screen: Screen;
  annBarVisible: boolean;
  openMenu: null | 'doctor';
  mobileOpen: boolean;
  searchQuery: string;
  selectedSpec: string;
  fBranch: string;
  fAvail: boolean;
  sortBy: SortBy;
  newsFilter: NewsFilter;
  profileOpen: boolean;
  profileDoc: Doctor | null;
  profileTab: ProfileTab;
  profileDate: string;
  profileSlot: string;
  bookModalOpen: boolean;
  bookingDoc: Doctor | null;
  modalStep: ModalStep;
  pName: string;
  pDOB: string;
  pPhone: string;
  pEmail: string;
  isExisting: boolean;
  aDate: string;
  aTime: string;
  aService: string;
  aIns: string;
  termsChecked: boolean;
  showLoading: boolean;
  toasts: Toast[];
}
