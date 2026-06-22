import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/matches', icon: '🤝', label: 'AI Matches' },
  { path: '/chat', icon: '💬', label: 'Chat' },
  { path: '/sessions', icon: '📅', label: 'Sessions' },
  { path: '/courses', icon: '📚', label: 'Courses' },
  { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();
  const isOnline = onlineUsers.includes(user?._id);

  const levelColors = ['', '#94a3b8', '#6c63ff', '#00d4aa', '#f59e0b', '#f43f5e'];

  return (
    <aside style={{
      width: 260,
      height: '100vh',
      background: '#0f1629',
      borderRight: '1px solid #1e2d4a',
      position: 'fixed',
      left: 0, top: 0,
      display: 'flex', flexDirection: 'column',
      zIndex: 100,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #1e2d4a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #6c63ff, #00d4aa)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>⚡</div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: '#f1f5f9' }}>SkillSwap</div>
            <div style={{ fontSize: 11, color: '#6c63ff' }}>Trade Skills, Not Money</div>
          </div>
        </div>
      </div>

      {/* User card */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e2d4a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={user?.avatar} alt={user?.name} className="avatar avatar-md" style={{ border: '2px solid #1e2d4a' }}
            onError={e => { e.target.onerror=null; const n=user?.name||'user'; e.target.src=`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(n)}`; }} />
            <div className="online-dot" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span style={{ fontSize: 12, color: levelColors[user?.level] || '#6c63ff' }}>Lvl {user?.level}</span>
              <span style={{ color: '#1e2d4a' }}>·</span>
              <span style={{ fontSize: 12, color: '#f59e0b' }}>⭐ {user?.points}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 12px', flex: 1 }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10,
              marginBottom: 2, fontSize: 14, fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.15s',
              background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
              color: isActive ? '#8b85ff' : '#94a3b8',
              borderLeft: isActive ? '2px solid #6c63ff' : '2px solid transparent',
            })}
          >
            <span style={{ fontSize: 18, width: 24 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 10,
              marginBottom: 2, fontSize: 14, fontWeight: 500,
              textDecoration: 'none', transition: 'all 0.15s',
              background: isActive ? 'rgba(244,63,94,0.15)' : 'transparent',
              color: isActive ? '#f43f5e' : '#f43f5e88',
              borderLeft: isActive ? '2px solid #f43f5e' : '2px solid transparent',
            })}
          >
            <span style={{ fontSize: 18, width: 24 }}>🛡️</span>
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #1e2d4a' }}>
        <button
          onClick={logout}
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
