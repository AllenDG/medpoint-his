import React from 'react';

interface Props { visible: boolean; }

export function LoadingOverlay({ visible }: Props) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[950] flex flex-col items-center justify-center gap-[18px]"
      style={{ background: 'rgba(18,32,86,.8)', backdropFilter: 'blur(5px)' }}
    >
      <div
        className="w-11 h-11 rounded-full portal-spin"
        style={{ border: '4px solid rgba(255,255,255,.2)', borderTopColor: '#fff' }}
      />
      <div className="text-base font-bold text-white">Confirming your appointment…</div>
      <div className="text-[13px]" style={{ color: 'rgba(255,255,255,.65)' }}>Please wait a moment</div>
    </div>
  );
}
