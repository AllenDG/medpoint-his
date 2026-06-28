/// <reference types="vite/client" />

declare module 'sweetalert2' {
  interface SweetAlertOptions {
    title?: string;
    html?: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    showCancelButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
    reverseButtons?: boolean;
    [key: string]: unknown;
  }
  interface SweetAlertResult {
    isConfirmed?: boolean;
    isDenied?: boolean;
    isDismissed?: boolean;
    value?: unknown;
  }
  const Swal: {
    fire(options: SweetAlertOptions): Promise<SweetAlertResult>;
  };
  export default Swal;
}

declare module 'react-google-recaptcha' {
  import * as React from 'react';

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onErrored?: () => void;
    theme?: 'dark' | 'light';
    type?: 'image' | 'audio';
    size?: 'compact' | 'normal' | 'invisible';
    tabindex?: number;
    hl?: string;
    badge?: 'bottomright' | 'bottomleft' | 'inline';
  }

  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    reset(): void;
    execute(): Promise<string>;
    getValue(): string | null;
    getWidgetId(): number | null;
  }
}
