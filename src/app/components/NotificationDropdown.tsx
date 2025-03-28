"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface Notification {
  type: "joinRequest" | "like";
  user: {
    id: string;
    name: string;
    profilePic: string;
    project?: string; // For join requests
    post?: string;    // For likes
  };
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onClose,
}) => {
  const router = useRouter();

  const handleUserProfileClick = (userId: string) => {
    router.push(`/profile/${userId}`);
    onClose(); // Close dropdown after navigation
  };

  return (
    <div style={{
      position: 'absolute',
      right: '0',
      marginTop: '8px',
      width: '320px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: '1000',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{
        padding: '12px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#1f2937'
          }}>Notifications</h3>
          <button 
            onClick={onClose} 
            style={{
              color: '#9ca3af',
              fontSize: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#4b5563'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
          >✖</button>
        </div>

        {notifications.length === 0 ? (
          <p style={{
            color: '#6b7280',
            fontSize: '12px',
            textAlign: 'center',
            padding: '8px 0'
          }}>No new notifications</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} style={{
              marginBottom: '12px',
              padding: '8px',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {notification.type === "joinRequest" ? (
                <div className="flex justify-center items-center" style={{
                  display: 'flex',
                  alignItems: 'flex-center',
                  justifyContent: 'space-center',
                  gap: '8px'
                }}>
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }} 
                    onClick={() => handleUserProfileClick(notification.user.id)}
                  >
                    <img
                      src={notification.user.profilePic}
                      alt={notification.user.name}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ marginLeft: '8px' }}>
                      <p style={{
                        fontSize: '12px',
                        color: '#1f2937'
                      }}>
                        <span style={{ fontWeight: '600' }}>{notification.user.name}</span> wants to join{" "}
                        <span style={{ fontWeight: '700', color: '#385773' }}>{notification.user.project}</span>
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                    >
                      Accept
                    </button>
                    <button style={{
                      padding: '4px 8px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }} 
                  onClick={() => handleUserProfileClick(notification.user.id)}
                >
                  <img
                    src={notification.user.profilePic}
                    alt={notification.user.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ marginLeft: '8px' }}>
                    <p style={{
                      fontSize: '12px',
                      color: '#1f2937'
                    }}>
                      <span style={{ fontWeight: '600' }}>{notification.user.name}</span> liked your post:{" "}
                      <span style={{ fontWeight: '700', color: '#385773' }}>{notification.user.post}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;