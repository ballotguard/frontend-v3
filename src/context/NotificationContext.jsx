"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const NotificationsContext = createContext(null);
let idCounter = 0;

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]); // {id,type,message,createdAt}
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    setItems(cur => cur.filter(n => n.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const push = useCallback((type, message, ttl = 3000) => {
    if (!message) return;
    const id = ++idCounter;
    const createdAt = Date.now();
    setItems(cur => [...cur, { id, type, message, createdAt }]);
    const timeout = setTimeout(() => remove(id), ttl);
    timers.current.set(id, timeout);
    return id;
  }, [remove]);

  const notifyError = useCallback((msg, ttl) => push('error', msg, ttl), [push]);
  const notifySuccess = useCallback((msg, ttl) => push('success', msg, ttl), [push]);

  // cleanup on unmount
  useEffect(() => () => { timers.current.forEach(t => clearTimeout(t)); timers.current.clear(); }, []);

  return (
    <NotificationsContext.Provider value={{ notifyError, notifySuccess }}>
      {children}
      <NotificationViewport items={items} onDismiss={remove} />
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

function NotificationViewport({ items, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[1100] flex flex-col gap-3 w-[min(100%,24rem)] pointer-events-none select-none">
      {items.map(n => (
        <NotificationItem key={n.id} n={n} onDismiss={() => onDismiss(n.id)} />
      ))}
    </div>
  );
}

function NotificationItem({ n, onDismiss }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const f = requestAnimationFrame(() => setShow(true)); return () => cancelAnimationFrame(f); }, []);
  const base = "pointer-events-auto w-full rounded-lg border backdrop-blur px-4 py-3 shadow-lg transition-all duration-300 flex gap-3 items-start";
  const typeStyles = n.type === 'error'
    ? "border-red-300/60 bg-red-50/90 text-red-800 dark:bg-red-600/20 dark:text-red-200 dark:border-red-500/40"
    : "border-emerald-300/60 bg-emerald-50/90 text-emerald-800 dark:bg-emerald-600/25 dark:text-emerald-200 dark:border-emerald-500/40";
  return (
    <div
      role={n.type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={`${base} ${typeStyles} ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'} ${!show ? '' : ''}`}
    >
      <div className="mt-0.5">
        {n.type === 'error' ? (
          <span aria-hidden className="inline-block w-2 h-2 rounded-full bg-red-500 mt-1" />
        ) : (
          <span aria-hidden className="inline-block w-2 h-2 rounded-full bg-emerald-500 mt-1" />
        )}
      </div>
      <div className="text-sm leading-snug font-medium flex-1 pr-2 break-words">{n.message}</div>
      <button
        onClick={onDismiss}
        className="text-xs mt-0.5 opacity-60 hover:opacity-100 transition-colors text-current"
        aria-label="Dismiss notification"
      >×</button>
    </div>
  );
}
