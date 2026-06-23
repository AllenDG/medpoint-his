import { useState, useCallback } from 'react';
import {
  Doctor, ModalStep, NewsFilter, PortalState, Screen, SortBy, Toast, ToastType,
} from '../types';
import { DOCS, NEWS_ALL, SPEC_PILLS, TIMES, TODAY, WDAYS, MONTHS_ARR } from '../data/constants';

const INITIAL_STATE: PortalState = {
  screen: 'home',
  annBarVisible: true,
  openMenu: null,
  mobileOpen: false,
  searchQuery: '',
  selectedSpec: '',
  fBranch: '',
  fAvail: false,
  sortBy: 'rating',
  newsFilter: 'all',
  profileOpen: false,
  profileDoc: null,
  profileTab: 'about',
  profileDate: '',
  profileSlot: '',
  bookModalOpen: false,
  bookingDoc: null,
  modalStep: 1,
  pName: '',
  pDOB: '',
  pPhone: '',
  pEmail: '',
  isExisting: true,
  aDate: '',
  aTime: '',
  aService: '',
  aIns: '',
  termsChecked: false,
  showLoading: false,
  toasts: [],
};

function buildDates(baseDate: Date, selectedDate: string, onSelect: (key: string) => void) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate.getTime() + i * 86_400_000);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    return {
      day: WDAYS[d.getDay()],
      num: d.getDate(),
      month: MONTHS_ARR[d.getMonth()],
      key,
      selected: selectedDate === key,
      onSelect: () => onSelect(key),
    };
  });
}

function buildSlots(docId: number, dateKey: string, selectedSlot: string, onSelect: (t: string) => void) {
  if (!dateKey) return [];
  const dateSum = dateKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return TIMES.map((t, idx) => {
    const h = (docId * 13 + idx * 7 + dateSum) % 11;
    const available = h > 2;
    return {
      label: t,
      available,
      selected: selectedSlot === t,
      onSelect: available ? () => onSelect(t) : undefined,
    };
  });
}

export function usePortalState() {
  const [s, setS] = useState<PortalState>(INITIAL_STATE);

  const go = useCallback((screen: Screen) =>
    setS(p => ({ ...p, screen, openMenu: null, mobileOpen: false })), []);

  const showToast = useCallback((msg: string, type: ToastType = 'success', title?: string) => {
    const icons: Record<ToastType, string> = { success: 'check_circle', error: 'error', info: 'info' };
    const colors: Record<ToastType, string> = { success: '#16A34A', error: '#DC2626', info: '#5B65DC' };
    const titles: Record<ToastType, string> = { success: 'Success', error: 'Error', info: 'Notice' };
    const id = Date.now() + Math.random();
    const toast: Toast = { id, msg, type, icon: icons[type], iconColor: colors[type], title: title ?? titles[type] };
    setS(p => ({ ...p, toasts: [...p.toasts, toast] }));
    setTimeout(() => setS(p => ({ ...p, toasts: p.toasts.filter(t => t.id !== id) })), 3600);
  }, []);

  const allDocs: Doctor[] = [...DOCS];

  const filteredDocs = allDocs
    .filter(d => {
      if (s.selectedSpec && d.specialty !== s.selectedSpec) return false;
      if (s.fAvail && d.next !== 'Today') return false;
      if (s.fBranch && d.branch !== s.fBranch) return false;
      if (s.searchQuery) {
        const q = s.searchQuery.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.specialty.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (s.sortBy === 'rating') return b.rating - a.rating;
      if (s.sortBy === 'availability') return (a.next === 'Today' ? 0 : 1) - (b.next === 'Today' ? 0 : 1);
      return a.name.localeCompare(b.name);
    });

  const newsFiltered = s.newsFilter === 'all'
    ? [...NEWS_ALL]
    : NEWS_ALL.filter(n => n.filter === s.newsFilter);

  const profileDoc = s.profileDoc ?? allDocs[0];
  const bookingDoc = s.bookingDoc ?? allDocs[0];

  const profileDates = buildDates(TODAY, s.profileDate, (key) =>
    setS(p => ({ ...p, profileDate: key, profileSlot: '' })));
  const profileSlots = buildSlots(profileDoc.id, s.profileDate, s.profileSlot,
    (t) => setS(p => ({ ...p, profileSlot: t })));

  const bookDates = buildDates(TODAY, s.aDate, (key) =>
    setS(p => ({ ...p, aDate: key, aTime: '' })));
  const bookSlots = buildSlots(bookingDoc.id, s.aDate, s.aTime,
    (t) => setS(p => ({ ...p, aTime: t })));

  const specPills = SPEC_PILLS.map(sp => ({
    ...sp,
    active: s.selectedSpec === sp.spec,
    onSelect: () => setS(p => ({ ...p, selectedSpec: sp.spec })),
  }));

  const profileCanBook = !!(s.profileDate && s.profileSlot);

  const actions = {
    go,
    goHome:     () => go('home'),
    goAbout:    () => go('about'),
    goServices: () => go('services'),
    goNews:     () => go('news'),
    goContact:  () => go('contact'),
    goBook:     () => go('book'),

    dismissAnn:   () => setS(p => ({ ...p, annBarVisible: false })),
    openDrMenu:   () => setS(p => ({ ...p, openMenu: 'doctor' })),
    closeMenus:   () => setS(p => ({ ...p, openMenu: null })),
    toggleMobile: () => setS(p => ({ ...p, mobileOpen: !p.mobileOpen })),
    closeMobile:  () => setS(p => ({ ...p, mobileOpen: false })),

    setSearch:  (q: string) => setS(p => ({ ...p, searchQuery: q })),
    setSort:    (v: SortBy) => setS(p => ({ ...p, sortBy: v })),
    setFBranch: (v: string) => setS(p => ({ ...p, fBranch: v })),
    setFAvail:  (v: boolean) => setS(p => ({ ...p, fAvail: v })),
    clearFilters: () => setS(p => ({ ...p, selectedSpec: '', fBranch: '', fAvail: false, searchQuery: '', sortBy: 'rating' })),

    setNewsFilter: (f: NewsFilter) => setS(p => ({ ...p, newsFilter: f })),

    openProfile: (doc: Doctor) => setS(p => ({ ...p, profileOpen: true, profileDoc: doc, profileTab: 'slots', profileDate: '', profileSlot: '' })),
    closeProfile: () => setS(p => ({ ...p, profileOpen: false, profileDoc: null })),
    setProfileTab: (tab: 'about' | 'slots') => setS(p => ({ ...p, profileTab: tab })),
    bookFromProfile: () => {
      if (!profileCanBook) { setS(p => ({ ...p, profileTab: 'slots' })); return; }
      setS(p => ({ ...p, profileOpen: false, bookModalOpen: true, bookingDoc: s.profileDoc, modalStep: 2, aDate: s.profileDate, aTime: s.profileSlot, aService: '', termsChecked: false }));
    },

    openBookModal: (doc: Doctor) => setS(p => ({ ...p, bookModalOpen: true, bookingDoc: doc, modalStep: 1, aDate: '', aTime: '', aService: '', termsChecked: false })),
    closeBookModal: () => setS(p => ({ ...p, bookModalOpen: false, bookingDoc: null })),
    nextModalStep: () => {
      if (s.modalStep === 1 && (!s.aDate || !s.aTime)) { showToast('Please select a date and time slot to continue.', 'info', 'Select a Slot'); return; }
      setS(p => ({ ...p, modalStep: Math.min(3, p.modalStep + 1) as ModalStep }));
    },
    prevModalStep: () => setS(p => ({ ...p, modalStep: Math.max(1, p.modalStep - 1) as ModalStep })),
    editStep1: () => { setS(p => ({ ...p, modalStep: 1 })); showToast('Edit your slot selection', 'info', 'Edit'); },
    editStep2: () => { setS(p => ({ ...p, modalStep: 2 })); showToast('Edit your details', 'info', 'Edit'); },
    submitBooking: () => {
      if (!s.termsChecked) return;
      setS(p => ({ ...p, showLoading: true }));
      setTimeout(() => {
        setS(p => ({ ...p, showLoading: false, bookModalOpen: false, bookingDoc: null, modalStep: 1, aDate: '', aTime: '', aService: '', termsChecked: false }));
        showToast('Appointment confirmed! SMS confirmation sent to your phone.', 'success', 'Booking Confirmed');
      }, 1800);
    },

    setPName:    (v: string) => setS(p => ({ ...p, pName: v })),
    setPDOB:     (v: string) => setS(p => ({ ...p, pDOB: v })),
    setPPhone:   (v: string) => setS(p => ({ ...p, pPhone: v })),
    setPEmail:   (v: string) => setS(p => ({ ...p, pEmail: v })),
    setExisting: () => setS(p => ({ ...p, isExisting: true })),
    setNew:      () => setS(p => ({ ...p, isExisting: false })),
    setAService: (v: string) => setS(p => ({ ...p, aService: v })),
    setAIns:     (v: string) => setS(p => ({ ...p, aIns: v })),
    setTerms:    (v: boolean) => setS(p => ({ ...p, termsChecked: v })),

    sendMessage: () => showToast("Your message has been sent! We'll respond within 1 business day.", 'success', 'Message Sent'),
    dismissToast: (id: number) => setS(p => ({ ...p, toasts: p.toasts.filter(t => t.id !== id) })),
  };

  return {
    s,
    actions,
    filteredDocs,
    newsFiltered,
    profileDoc,
    bookingDoc,
    profileDates,
    profileSlots,
    bookDates,
    bookSlots,
    specPills,
    profileCanBook,
    annOffset: s.annBarVisible ? 44 : 0,
  };
}

export type PortalActions = ReturnType<typeof usePortalState>['actions'];
