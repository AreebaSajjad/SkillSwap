import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Navbar from '../components/shared/Navbar';
import { useAuth } from '../context/AuthContext';
import { sessionsAPI, matchesAPI, notificationsAPI } from '../services/api';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      sessionsAPI.getSessions(),
      matchesAPI.getMatches(),
      notificationsAPI.getNotifications(),
    ]).then(([s, m, n]) => {
      setSessions(s.data.data.slice(0, 3));
      setMatches(m.data.data.filter(m => m.status === 'accepted'));
      setNotifications(n.data.data.slice(0, 5));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const xpToNext = (user?.level || 1) * 100;
  const xpPct = Math.min(100, ((user?.points || 0) % 100));

  const quickStats = [
    { icon: '⭐', value: user?.points || 0, label: 'Total Points', color: '#f59e0b' },
    { icon: '🏅', value: `Lvl ${user?.level || 1}`, label: 'Current Level', color: '#6c63ff' },
    { icon: '🤝', value: matches.length, label: 'Active Matches', color: '#00d4aa' },
    { icon: '✅', value: user?.sessionsCompleted || 0, label: 'Sessions Done', color: '#f43f5e' },
  ];

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content" style={{ paddingTop: 0 }}>
        <Navbar title="Dashboard" />

        {/* Welcome banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(0,212,170,0.1))',
          border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: 16, padding: '24px 28px', marginBottom: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <h2 style={{ fontSize: 24, marginBottom: 4 }}>Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>
              {matches.length > 0
                ? `You have ${matches.length} active match${matches.length > 1 ? 'es' : ''}. Keep learning!`
                : 'Start by finding your skill-swap partners in AI Matches!'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate('/matches')}>🤖 Find Matches</button>
            <button className="btn btn-secondary" onClick={() => navigate('/courses')}>📚 Browse Courses</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          {quickStats.map(s => (
            <div key={s.label} className="stat-card" style={{ borderLeft: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* XP Bar */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <span style={{ fontWeight: 700 }}>Level {user?.level} Progress</span>
              <span style={{ color: '#94a3b8', fontSize: 13, marginLeft: 8 }}>→ Level {(user?.level || 1) + 1}</span>
            </div>
            <span style={{ color: '#6c63ff', fontWeight: 700 }}>{xpPct}/{xpToNext} XP</span>
          </div>
          <div style={{ height: 8, background: '#1e2d4a', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${xpPct}%`,
              background: 'linear-gradient(90deg, #6c63ff, #00d4aa)',
              borderRadius: 4, transition: 'width 1s ease',
            }} />
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 28 }}>
          {/* Upcoming Sessions */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16 }}>📅 Upcoming Sessions</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/sessions')}>View All</button>
            </div>
            {loading ? <div className="loading-spinner" style={{ margin: '20px auto', width: 30, height: 30 }} />
              : sessions.length === 0 ? (
                <div className="empty-state" style={{ padding: '24px 0' }}>
                  <div className="empty-state-icon">📅</div>
                  <p style={{ fontSize: 14 }}>No sessions yet. Book one from your matches!</p>
                </div>
              ) : sessions.map(s => (
                <div key={s._id} style={{
                  padding: '12px 0', borderBottom: '1px solid #1e2d4a',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.skill}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                      with {s.teacher?._id === user?._id ? s.learner?.name : s.teacher?.name}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#6c63ff' }}>{format(new Date(s.scheduledAt), 'MMM d')}</div>
                    <span className={`badge ${s.status === 'scheduled' ? 'badge-teal' : 'badge-amber'}`} style={{ fontSize: 11 }}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          {/* Badges & Notifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Badges */}
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>🏅 Badges Earned</h3>
              {user?.badges?.length === 0 || !user?.badges ? (
                <div style={{ color: '#475569', fontSize: 13 }}>Complete sessions to earn your first badge!</div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {user.badges.map((b, i) => (
                    <div key={i} className="badge badge-amber" style={{ fontSize: 13 }}>
                      {b.icon} {b.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>🔔 Recent Activity</h3>
              {notifications.length === 0 ? (
                <div style={{ color: '#475569', fontSize: 13 }}>No recent activity</div>
              ) : notifications.map(n => (
                <div key={n._id} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>
                    {n.type === 'match_request' ? '🤝' : n.type === 'match_accepted' ? '✅' : n.type === 'session_booked' ? '📅' : '🏅'}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{n.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
