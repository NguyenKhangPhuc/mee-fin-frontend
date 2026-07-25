/**
 * PURPOSE:
 * Renders the global notification popup toast at the bottom right.
 * Redesigned to strictly adhere to design-tokens and match app aesthetics.
 *
 * CONTEXT/PARENT FILE:
 * Mounted globally in root layout wrappers to display success, error, or info alerts.
 *
 * INPUTS / PARAMETERS:
 * None (reads global state via useNotification context hook).
 */

'use client';

import { useNotification, NotificationType } from "../context/NotificationContext";
import { designTokens } from "../constants/design-tokens";

const NotificationCard = () => {
  const { notification, setNotification } = useNotification();
  console.log(notification)
  if (!notification.isOpen) return null;

  const currentType: NotificationType = notification.type || 'info';
  const style = designTokens.notification[currentType] || designTokens.notification.info;

  const renderIcon = () => {
    if (currentType === 'success') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (currentType === 'error') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getDisplayText = (content: any): string => {
    if (!content) return "Operation updated.";
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .map((c) => (typeof c === "object" && c ? c.message || JSON.stringify(c) : String(c)))
        .join("; ");
    }
    if (typeof content === "object") {
      return content.message || JSON.stringify(content);
    }
    return String(content);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[100] pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div
        className={`${style.bg} border ${style.border} ${designTokens.shadows.card} ${designTokens.radii.toast} p-4 flex items-center justify-between gap-3.5 max-w-sm w-full pointer-events-auto relative overflow-hidden select-none`}
      >
        {/* Left vertical accent line */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3.5px] ${style.accent}`} />

        {/* Status Icon */}
        <div className={`flex shrink-0 items-center justify-center w-8 h-8 rounded-lg border ${style.iconBg}`}>
          {renderIcon()}
        </div>

        {/* Alert Content */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-1">
          <span className={`font-mono text-[9px] font-bold uppercase tracking-wider leading-none ${style.badge}`}>
            {currentType}_NOTIFICATION
          </span>
          <p className={`text-xs font-medium leading-relaxed break-words select-text ${style.text}`}>
            {getDisplayText(notification.content)}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={() => setNotification({ ...notification, isOpen: false })}
          type="button"
          aria-label="Close notification"
          className="flex shrink-0 items-center justify-center w-6 h-6 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
