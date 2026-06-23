import React, { useEffect, useRef } from 'react';
import { usePortalState } from '@/features/public-site/hooks/usePortalState';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

import { HomePage }    from '@/features/public-site/components/pages/HomePage';
import { AboutPage }   from '@/features/public-site/components/pages/AboutPage';
import { ServicesPage } from '@/features/public-site/components/pages/ServicesPage';
import { NewsPage }    from '@/features/public-site/components/pages/NewsPage';
import { ContactPage } from '@/features/public-site/components/pages/ContactPage';
import { BookPage }    from '@/features/public-site/components/pages/BookPage';

import { ProfilePanel }   from '@/features/public-site/components/overlays/ProfilePanel';
import { BookingModal }   from '@/features/public-site/components/overlays/BookingModal';
import { MobileDrawer }   from '@/features/public-site/components/overlays/MobileDrawer';
import { ToastContainer } from '@/features/public-site/components/overlays/ToastContainer';
import { LoadingOverlay } from '@/features/public-site/components/overlays/LoadingOverlay';

const NAV_HEIGHT = 64;
const ANN_HEIGHT = 44;

export default function PublicLayout() {
  const {
    s, actions,
    filteredDocs, newsFiltered,
    profileDoc, bookingDoc,
    profileDates, profileSlots,
    bookDates, bookSlots,
    specPills, profileCanBook, annOffset,
  } = usePortalState();

  const mainRef = useRef<HTMLDivElement>(null);

  /* Scroll to top on screen change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [s.screen]);

  /* Scroll-reveal via IntersectionObserver */
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>('[data-animate]');
    targets.forEach(t => t.classList.add('anim-hidden'));

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const delay = Number(target.dataset.delay ?? 0);
          setTimeout(() => target.classList.remove('anim-hidden'), delay);
          io.unobserve(target);
        });
      },
      { threshold: 0.08 }
    );
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, [s.screen]);

  const topOffset = annOffset + NAV_HEIGHT;

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Poppins', sans-serif" }}>

      {/* Announcement bar */}
      {s.annBarVisible && (
        <div
          className="ann-bar-enter fixed left-0 right-0 z-[450] flex items-center justify-center gap-3 text-white text-[13px] font-medium px-4"
          style={{ height: ANN_HEIGHT, background: '#5B65DC', top: 0 }}
        >
          <span className="material-icons-outlined text-base">campaign</span>
          <span>
            <strong>New:</strong> Online booking for all specialties now available! &nbsp;
            <button
              onClick={actions.goBook}
              className="underline bg-transparent border-0 text-white cursor-pointer font-semibold p-0"
              style={{ fontFamily: "'Poppins',sans-serif" }}
            >
              Book now →
            </button>
          </span>
          <button
            onClick={actions.dismissAnn}
            className="absolute right-4 bg-transparent border-0 cursor-pointer text-white flex items-center"
            aria-label="Dismiss announcement"
          >
            <span className="material-icons-outlined text-base">close</span>
          </button>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        screen={s.screen}
        annOffset={annOffset}
        isDrOpen={s.openMenu === 'doctor'}
        actions={actions}
      />

      {/* Page content */}
      <main ref={mainRef} className="flex-1" style={{ paddingTop: topOffset }}>
        {s.screen === 'home'     && <HomePage    actions={actions} />}
        {s.screen === 'about'    && <AboutPage   />}
        {s.screen === 'services' && <ServicesPage actions={actions} />}
        {s.screen === 'news'     && (
          <NewsPage
            newsFilter={s.newsFilter}
            newsFiltered={newsFiltered}
            onFilter={actions.setNewsFilter}
          />
        )}
        {s.screen === 'contact'  && <ContactPage actions={actions} />}
        {s.screen === 'book'     && (
          <BookPage
            actions={actions}
            filteredDocs={filteredDocs}
            specPills={specPills}
            searchQuery={s.searchQuery}
            sortBy={s.sortBy}
            fBranch={s.fBranch}
            fAvail={s.fAvail}
            selectedSpec={s.selectedSpec}
            hasFilters={!!(s.selectedSpec || s.fBranch || s.fAvail || s.searchQuery)}
            annOffset={topOffset}
          />
        )}
      </main>

      {s.screen !== 'book' && <Footer actions={actions} />}

      {/* Overlays */}
      <ProfilePanel
        open={s.profileOpen}
        doc={profileDoc}
        tab={s.profileTab}
        dates={profileDates}
        slots={profileSlots}
        profileDate={s.profileDate}
        profileSlot={s.profileSlot}
        canBook={profileCanBook}
        onClose={actions.closeProfile}
        onSetTab={actions.setProfileTab}
        onBook={actions.bookFromProfile}
      />

      <BookingModal
        open={s.bookModalOpen}
        doc={bookingDoc}
        step={s.modalStep}
        dates={bookDates}
        slots={bookSlots}
        aDate={s.aDate}
        aTime={s.aTime}
        aService={s.aService}
        aIns={s.aIns}
        isExisting={s.isExisting}
        pName={s.pName}
        pDOB={s.pDOB}
        pPhone={s.pPhone}
        pEmail={s.pEmail}
        termsChecked={s.termsChecked}
        isLoading={s.showLoading}
        onClose={actions.closeBookModal}
        onNext={actions.nextModalStep}
        onBack={actions.prevModalStep}
        onEditStep1={actions.editStep1}
        onEditStep2={actions.editStep2}
        onSubmit={actions.submitBooking}
        onSetExisting={actions.setExisting}
        onSetNew={actions.setNew}
        onSetAService={actions.setAService}
        onSetAIns={actions.setAIns}
        onSetTerms={actions.setTerms}
        onSetPName={actions.setPName}
        onSetPDOB={actions.setPDOB}
        onSetPPhone={actions.setPPhone}
        onSetPEmail={actions.setPEmail}
      />

      <MobileDrawer open={s.mobileOpen} screen={s.screen} actions={actions} />

      <ToastContainer toasts={s.toasts} onDismiss={actions.dismissToast} />

      <LoadingOverlay visible={s.showLoading} />
    </div>
  );
}
