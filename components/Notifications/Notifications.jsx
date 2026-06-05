import React, { useState, useEffect } from "react";
import "./style.css";
import Swal from "sweetalert2";
import Navigation from "../Dashboard/Navigation";
import Header from "../Dashboard/Header";
import {
  getNotifications,
  getUser,
  markNotificationAsRead,
} from "../../api/Api";
import { useLegacyRouting } from "@/lib/router-compat";

const isRecent = (date) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);
  return notificationDate > oneWeekAgo;
};

const formatRelativeTime = (date) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

  if (isNaN(diffInSeconds)) return "N/A";
  if (diffInSeconds < 60) return `${Math.max(1, Math.floor(diffInSeconds))}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
};

const defaultImageSrc = "/migfulllogo.png";

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { navigate } = useLegacyRouting();

  useEffect(() => {
    const user = getUser();
    if (!user.isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchNotificationsList(page);
  }, [page]);

  const fetchNotificationsList = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications(pageNumber);
      if (data && Array.isArray(data.notifications)) {
        if (pageNumber === 1) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Failed to load notifications. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      read_status: true,
    }));
    setNotifications(updatedNotifications);
  };

  const handleNotificationClick = async (notification) => {
    const { id, message, date_received } = notification;

    try {
      await markNotificationAsRead(id);
      Swal.fire({
        html: `
          <div class="notification-detail" style="font-family: 'Outfit', sans-serif; text-align: left;">
            <h2 style="font-size: 18px; margin-bottom: 12px; font-weight: 700;">Notification Details</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #374151;">
              ${message
                ? message.split('\n').map((line, index) => {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    const lineWithLinks = line.replace(urlRegex, (url) => {
                      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #6366f1; text-decoration: underline;">${url}</a>`;
                    });
                    return `${lineWithLinks}${index < message.split('\n').length - 1 ? '<br />' : ''}`;
                  }).join('')
                : 'No message content'
              }
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 16px;">Received: ${new Date(date_received).toLocaleString()}</p>
          </div>
        `,
        confirmButtonText: "Close",
        width: "95%",
        customClass: {
          popup: "my-popup",
        },
      });

      const updatedNotifications = notifications.map((n) =>
        n.id === id ? { ...n, read_status: true } : n
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error("Failed to mark read:", error);
    }
  };

  const handleViewMore = () => {
    if (page < totalPages && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const groupedNotifications = notifications.reduce((acc, notification) => {
    const section = isRecent(notification.date_received) ? "Recent" : "Earlier Notifications";
    (acc[section] = acc[section] || []).push(notification);
    return acc;
  }, {});

  return (
    <>
      <div className="notifications" style={{ fontFamily: "Outfit, sans-serif" }}>
        <Header title="Notifications" maxWidth={1200} showMobileBack={true} />

        <div className="content">
          {error && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#ef4444" }}>
              <p style={{ fontWeight: 600 }}>{error}</p>
              <button 
                onClick={() => fetchNotificationsList(page)}
                style={{ marginTop: "12px", padding: "8px 16px", background: "#000", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Retry
              </button>
            </div>
          )}

          {!error && notifications.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>
              <img src="/bell-silent.svg" alt="No notifications" style={{ width: "80px", opacity: 0.3, margin: "0 auto 16px", display: "block" }} onError={(e) => {e.target.style.display = "none";}} />
              <p style={{ fontSize: "16px", fontWeight: 600 }}>No notifications yet</p>
              <p style={{ fontSize: "14px", marginTop: "4px" }}>We'll notify you when something important arrives.</p>
            </div>
          )}

          {Object.entries(groupedNotifications).map(([section, notifs]) => (
            <div className="section" key={section}>
              <div className="section-header">
                <div className="label">{section}</div>
                {section === "Recent" && notifs.some(n => !n.read_status) && (
                  <div
                    className="text-wrapper"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </div>
                )}
              </div>

              {notifs.map((notification) => (
                <div
                  className={`notification ${notification.read_status ? "read" : "unread"}`}
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-avatar-container">
                    <img
                      alt="Notification"
                      src={notification.imageSrc || defaultImageSrc}
                      onError={(e) => { e.target.src = defaultImageSrc; }}
                    />
                  </div>
                  <div className="notification-content">
                    <p className="not-title">
                      {notification.message || "New Update"}
                    </p>
                    <div className="time-wrapper">
                      <span className="time">
                        {formatRelativeTime(notification.date_received)}
                      </span>
                    </div>
                  </div>
                  <div className="notification-status">
                    {!notification.read_status ? (
                      <div className="status-dot-unread" title="Unread" />
                    ) : (
                      <div className="status-dot-read" title="Read" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          )}

          {!loading && !error && page < totalPages && (
            <div className="view-more-container">
              <button className="view-more" onClick={handleViewMore}>
                View More
              </button>
            </div>
          )}
        </div>
      </div>
      <Navigation />
      <style jsx>{`
        /* Local components animations if any */
      `}</style>
    </>
  );
};

export default Notifications;
