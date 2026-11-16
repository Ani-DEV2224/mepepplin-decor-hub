"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BellRing,
  Mail,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

type NotificationItem = {
  id: string;
  name: string;
  service: string;
  created_at: string;
};

type NotificationResponse = {
  count: number;
  items: NotificationItem[];
};

const POLL_INTERVAL = 15000;
const LAST_SEEN_KEY = "meppeplin-admin-last-enquiry-time";
const READ_IDS_KEY = "meppeplin-admin-read-notification-ids";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function playSound() {
  try {
    const AudioContextClass = window.AudioContext;

    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 740;

    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.12,
      context.currentTime + 0.02
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + 0.24
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.25);

    oscillator.onended = () => {
      void context.close();
    };
  } catch {
    // Audio is optional and may be blocked by browser settings.
  }
}

export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<NotificationResponse>({
    count: 0,
    items: [],
  });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved: unknown = JSON.parse(
        window.localStorage.getItem(READ_IDS_KEY) || "[]"
      );
      return Array.isArray(saved)
        ? saved.filter((id): id is string => typeof id === "string")
        : [];
    } catch {
      return [];
    }
  });
  const [error, setError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const latestSeen = useRef<number>(0);
  const soundRef = useRef(false);
  const openRef = useRef(false);

  const unreadItems = data.items.filter(
    (item) => !readIds.includes(item.id)
  );
  const unreadCount = unreadItems.length;

  function markNotificationsRead() {
    const next = [...new Set([...readIds, ...data.items.map((item) => item.id)])];
    setReadIds(next);
    window.localStorage.setItem(READ_IDS_KEY, JSON.stringify(next));
  }

  function toggleNotifications() {
    openRef.current = !open;
    if (!open) {
      markNotificationsRead();
      void refresh();
    }
    setOpen((value) => !value);
  }

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/notifications", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to refresh notifications");
      }

      const result =
        (await response.json()) as NotificationResponse;

      setData(result);
      setError("");
      if (openRef.current) {
        setReadIds((current) => {
          const next = [...new Set([...current, ...result.items.map((item) => item.id)])];
          window.localStorage.setItem(READ_IDS_KEY, JSON.stringify(next));
          return next;
        });
      }

      const newestTimestamp = result.items.length
        ? Math.max(
            ...result.items.map((item) =>
              new Date(item.created_at).getTime()
            )
          )
        : 0;

      if (!initialized.current) {
        initialized.current = true;

        const stored = Number(
          window.localStorage.getItem(LAST_SEEN_KEY) || 0
        );

        latestSeen.current = Math.max(
          stored,
          newestTimestamp
        );

        window.localStorage.setItem(
          LAST_SEEN_KEY,
          String(latestSeen.current)
        );

        return;
      }

      if (newestTimestamp > latestSeen.current) {
        const newItems = result.items.filter(
          (item) =>
            new Date(item.created_at).getTime() >
            latestSeen.current
        );

        latestSeen.current = newestTimestamp;

        window.localStorage.setItem(
          LAST_SEEN_KEY,
          String(newestTimestamp)
        );

        if (newItems.length && soundRef.current) {
          playSound();
        }

        if (
          newItems.length &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          new Notification("Meppeplin Decor Hub", {
            body:
              newItems.length === 1
                ? "A new customer enquiry has arrived."
                : `${newItems.length} new customer enquiries have arrived.`,
          });
        }
      }
    } catch {
      setError("Notifications are temporarily unavailable.");
    }
  }, []);

  useEffect(() => {
    const initialRefresh = window.setTimeout(() => {
      void refresh();
    }, 0);

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    }, POLL_INTERVAL);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void refresh();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      window.clearTimeout(initialRefresh);
      window.clearInterval(interval);
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [refresh]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        openRef.current = false;
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        openRef.current = false;
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  async function enableAlerts() {
    if (!("Notification" in window)) {
      setError("This browser does not support desktop notifications.");
      return;
    }

    const permission =
      await Notification.requestPermission();

    if (permission !== "granted") {
      setError(
        "Browser notifications were not enabled. You can still use the inbox."
      );
    }
  }

  return (
    <div
      className="atelier-notification-root"
      ref={containerRef}
    >
      <button
        type="button"
        className="atelier-icon-button atelier-bell-button"
        aria-label={`Notifications: ${unreadCount} unread enquiries`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={toggleNotifications}
      >
        {unreadCount > 0 ? (
          <BellRing size={20} />
        ) : (
          <Bell size={20} />
        )}

        {unreadCount > 0 && (
          <span className="atelier-notification-count">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="atelier-notification-panel"
          role="dialog"
          aria-label="New enquiry notifications"
        >
          <div className="atelier-notification-header">
            <div>
              <strong>Notifications</strong>
              <span>
                {unreadCount} unread{" "}
                {unreadCount === 1 ? "notification" : "notifications"}
              </span>
            </div>

            <button
              type="button"
              className="atelier-notification-close"
              aria-label="Close notifications"
              onClick={() => { openRef.current = false; setOpen(false); }}
            >
              <X size={18} />
            </button>
          </div>

          <div className="atelier-notification-options">
            <button
              type="button"
              onClick={() => {
                setSoundEnabled((value) => !value);
                playSound();
              }}
            >
              {soundEnabled ? (
                <Volume2 size={15} />
              ) : (
                <VolumeX size={15} />
              )}
              Sound {soundEnabled ? "on" : "off"}
            </button>

            <button
              type="button"
              onClick={() => void enableAlerts()}
            >
              <Bell size={15} />
              Enable desktop alerts
            </button>
          </div>

          {error && (
            <p className="atelier-notification-error" role="alert">
              {error}
            </p>
          )}

          <div className="atelier-notification-list">
            {data.items.length === 0 ? (
              <div className="atelier-notification-empty">
                <Mail size={28} />
                <strong>No new enquiries</strong>
                <p>
                  New customer enquiries will appear here.
                </p>
              </div>
            ) : (
              data.items.map((item) => (
                <Link
                  key={item.id}
                  href="/admin/enquiries"
                  className="atelier-notification-item"
                  onClick={() => setOpen(false)}
                >
                  <div className="atelier-notification-icon">
                    <Mail size={17} />
                  </div>

                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.service || "Project enquiry"}
                    </span>
                    <small>
                      {formatDate(item.created_at)}
                    </small>
                  </div>
                </Link>
              ))
            )}
          </div>

          <Link
            href="/admin/enquiries"
            className="atelier-notification-footer"
            onClick={() => setOpen(false)}
          >
            View all enquiries
          </Link>
        </div>
      )}
    </div>
  );
}