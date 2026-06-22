import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ title }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);

  useEffect(() => {
    notificationsAPI.getNotifications()
      .then(r => setNotifications(r.data.data))
      .catch(() => {});
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    await notificationsAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <header style={{
      height: 64, background: '#0f1629',
      borderBottom: '1px solid #1e2d4a',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px', marginBottom: 32,
      borderRadius: '0 0 16px 16px',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
        {/* Notifications */}
        <button
          onClick={() => setShowNotifs(s => !s)}
          style={{
            background: 'rgba(108,99,255,0.1)', border: '1px solid #1e2d4a',
            borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
            color: '#94a3b8', position: 'relative', fontSize: 18,
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              background: '#f43f5e', color: '#fff',
              width: 18, height: 18, borderRadius: '50%',
              fontSize: 11, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{unreadCount}</span>
          )}
        </button>

        {/* Dropdown */}
        {showNotifs && (
          <div style={{
            position: 'absolute', top: 48, right: 0, width: 320,
            background: '#141d35', border: '1px solid #1e2d4a',
            borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            zIndex: 200, overflow: 'hidden',
          }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e2d4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: '#6c63ff', fontSize: 12, cursor: 'pointer' }}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: '#475569', fontSize: 14 }}>No notifications yet</div>
              ) : notifications.map(n => (
                <div key={n._id} style={{
                  padding: '12px 16px',
                  background: n.isRead ? 'transparent' : 'rgba(108,99,255,0.05)',
                  borderBottom: '1px solid #1e2d4a',
                  cursor: 'pointer',
                }} onClick={() => { navigate(n.link || '/dashboard'); setShowNotifs(false); }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{n.message}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avatar */}
        <img
          src={user?.avatar}
          alt={user?.name}
          className="avatar avatar-sm"
          style={{ cursor: 'pointer', border: '2px solid #6c63ff' }}
          onClick={() => navigate('/profile')}
          onError={e => { e.target.onerror=null; e.target.src=`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name||'user')}`; }}
        />
      </div>
    </header>
  );
}
