"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const NotificationsContext = createContext(null);
let idCounter = 0;

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map());

  const remove = useCallback((id) => {
    setItems(cur => cur.filter(n => n.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const push = useCallback((type, message, ttl = 5000) => {
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

  // Cleanup on unmount
  useEffect(() => () => {
    timers.current.forEach(t => clearTimeout(t));
    timers.current.clear();
  }, []);

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
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80 pointer-events-none">
      {items.map(n => (
        <NotificationItem key={n.id} n={n} onDismiss={() => onDismiss(n.id)} />
      ))}
    </div>
  );
}

function NotificationItem({ n, onDismiss }) {
  const [show, setShow] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const f = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(f);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => onDismiss(), 1000); // Match transition duration
  };

  const baseStyles = "pointer-events-auto w-full rounded-lg p-4 shadow-lg transition-all duration-1000 ease-in-out flex items-end";

  const typeStyles = n.type === 'error'
    ? "bg-red-50 border border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-900"
    : "bg-green-50 border border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800/30 dark:text-green-900";

  // Changed animation to slide in from right
  const animationClass = show && !isLeaving
    ? "opacity-100 translate-x-0"
    : "opacity-0 translate-x-full";

  return (
   
      <div
        role={n.type === 'error' ? 'alert' : 'status'}
        aria-live="polite"
        className={`${baseStyles} ${typeStyles} ${animationClass} flex gap-3 mt-16 `}
      >

        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{n.message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          aria-label="Dismiss notification"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    
  );
}