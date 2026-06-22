import React from 'react';
import { Toast } from '../../types';

interface Props {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-[10px] items-end pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="toast-enter flex items-start gap-3 bg-white rounded-lg px-4 py-[14px] pointer-events-auto" style={{ border: '1px solid #E4E8EF', boxShadow: '0 8px 28px rgba(18,32,86,.12)', width: 340 }}>
          <span className="material-icons-outlined text-xl flex-shrink-0 mt-px" style={{ color: t.iconColor }}>{t.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-bold mb-0.5" style={{ color: '#122056' }}>{t.title}</div>
            <div className="text-[13px] leading-[1.4]" style={{ color: '#64748B' }}>{t.msg}</div>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="bg-transparent border-0 cursor-pointer p-0 flex flex-shrink-0"
            aria-label="Dismiss"
            style={{ color: '#94A3B8' }}
          >
            <span className="material-icons-outlined text-base">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
