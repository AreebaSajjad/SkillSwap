import { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Navbar from '../components/shared/Navbar';
import { adminAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getUsers()])
      .then(([s, u]) => { setStats(s.data.data); setUsers(u.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleBan = async (id) => {
    try {
      const res = await adminAPI.toggleBan(id);
      toast.success(res.data.message);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
    } catch {
      toast.error('Failed to update user');
    }
  };

  const statCards = stats ? [
    { icon: '👥', label: 'Total Users', value: stats.totalUsers, color: '#6c63ff' },
    { icon: '🤝', label: 'Total Matches', value: stats.totalMatches, color: '#00d4aa' },
    { icon: '✅', label: 'Sessions Completed', value: stats.totalSessions, color: '#f59e0b' },
    { icon: '📚', label: 'Total Courses', value: stats.totalCourses, color: '#f43f5e' },
    { icon: '🆕', label: 'New Today', value: stats.newUsersToday, color: '#8b5cf6' },
  ] : [];

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content" style={{ paddingTop: 0 }}>
        <Navbar title="Admin Dashboard" />

        {/* Warning banner */}
        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 12, padding: '12px 20px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 20 }}>🛡️</span>
          <span style={{ fontSize: 14, color: '#f43f5e', fontWeight: 600 }}>Admin Panel — Restricted Access Only</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#0f1629', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
          {[{ k: 'overview', l: '📊 Overview' }, { k: 'users', l: `👥 Users (${users.length})` }, { k: 'skills', l: '📈 Top Skills' }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t.k ? '#f43f5e' : 'transparent',
              color: tab === t.k ? '#fff' : '#94a3b8',
              fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
            }}>{t.l}</button>
          ))}
        </div>

        {loading ? <div className="loading-spinner" /> : tab === 'overview' ? (
          <>
            <div className="grid-4" style={{ marginBottom: 24 }}>
              {statCards.map(s => (
                <div key={s.label} className="stat-card" style={{ borderLeft: `3px solid ${s.c || s.color}` }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value?.toLocaleString()}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick user table */}
            <div className="card">
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Recent Users</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1e2d4a' }}>
                      {['User', 'Email', 'Points', 'Sessions', 'Role', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 8).map(u => (
                      <tr key={u._id} style={{ borderBottom: '1px solid #1e2d4a' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                            <img src={u.avatar} className="avatar" style={{ width: 28, height: 28 }} alt="" />
                            <span style={{ fontWeight: 600 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#94a3b8' }}>{u.email}</td>
                        <td style={{ padding: '10px 12px', color: '#f59e0b', fontWeight: 700 }}>{u.points}</td>
                        <td style={{ padding: '10px 12px' }}>{u.sessionsCompleted}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className={`badge ${u.role === 'admin' ? 'badge-rose' : 'badge-purple'}`} style={{ fontSize: 11 }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#475569', fontSize: 12 }}>{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : tab === 'users' ? (
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>All Users</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e2d4a' }}>
                    {['User', 'Email', 'Status', 'Level', 'Points', 'Joined', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: '#94a3b8', fontWeight: 600, fontSize: 12 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #1e2d4a', opacity: u.isActive ? 1 : 0.5 }}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <img src={u.avatar} className="avatar" style={{ width: 28, height: 28 }} alt="" />
                          <span style={{ fontWeight: 600 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#94a3b8', fontSize: 13 }}>{u.email}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`badge ${u.isActive ? 'badge-teal' : 'badge-rose'}`} style={{ fontSize: 11 }}>
                          {u.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className="badge badge-purple" style={{ fontSize: 11 }}>Lv.{u.level}</span>
                      </td>
                      <td style={{ padding: '10px 12px', color: '#f59e0b', fontWeight: 700 }}>{u.points}</td>
                      <td style={{ padding: '10px 12px', color: '#475569', fontSize: 12 }}>{format(new Date(u.createdAt), 'MMM d, yy')}</td>
                      <td style={{ padding: '10px 12px' }}>
                        {u.role !== 'admin' && (
                          <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-teal'}`} onClick={() => handleToggleBan(u._id)}>
                            {u.isActive ? '🚫 Ban' : '✅ Unban'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>📈 Top Skills on Platform</h3>
            {stats?.topSkills?.length === 0 ? (
              <div style={{ color: '#475569', fontSize: 14 }}>No skill data yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(stats?.topSkills || []).map((s, i) => (
                  <div key={s._id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ width: 28, textAlign: 'center', fontWeight: 800, color: '#475569' }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{s._id}</span>
                        <span style={{ color: '#6c63ff', fontWeight: 700 }}>{s.count} teachers</span>
                      </div>
                      <div style={{ height: 6, background: '#1e2d4a', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${(s.count / (stats.topSkills[0]?.count || 1)) * 100}%`, background: 'linear-gradient(90deg, #6c63ff, #00d4aa)', borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
