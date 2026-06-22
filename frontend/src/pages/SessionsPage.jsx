import { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Navbar from '../components/shared/Navbar';
import { sessionsAPI, matchesAPI, skillsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function SessionsPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [tab, setTab] = useState('upcoming');
  const [form, setForm] = useState({ teacherId: '', skill: '', scheduledAt: '', duration: 60, notes: '' });
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    Promise.all([sessionsAPI.getSessions(), matchesAPI.getMatches(), skillsAPI.getSkills()])
      .then(([s, m, sk]) => {
        setSessions(s.data.data);
        setMatches(m.data.data.filter(m => m.status === 'accepted'));
        setSkills(sk.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    setBooking(true);
    try {
      await sessionsAPI.bookSession(form);
      toast.success('Session booked! 📅 Email confirmation sent.');
      setShowBook(false);
      const res = await sessionsAPI.getSessions();
      setSessions(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await sessionsAPI.completeSession(id);
      toast.success('Session completed! Points awarded 🎉');
      const res = await sessionsAPI.getSessions();
      setSessions(res.data.data);
    } catch (err) {
      toast.error('Failed to complete session');
    }
  };

  const handleCancel = async (id) => {
    try {
      await sessionsAPI.cancelSession(id);
      toast.success('Session cancelled');
      const res = await sessionsAPI.getSessions();
      setSessions(res.data.data);
    } catch (err) {
      toast.error('Failed to cancel');
    }
  };

  const upcoming = sessions.filter(s => s.status === 'scheduled');
  const completed = sessions.filter(s => s.status === 'completed');
  const cancelled = sessions.filter(s => s.status === 'cancelled');
  const displayed = tab === 'upcoming' ? upcoming : tab === 'completed' ? completed : cancelled;

  const statusColor = { scheduled: '#00d4aa', completed: '#6c63ff', cancelled: '#f43f5e', ongoing: '#f59e0b' };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content" style={{ paddingTop: 0 }}>
        <Navbar title="Sessions" />

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { v: upcoming.length, l: 'Upcoming', c: '#00d4aa' },
            { v: completed.length, l: 'Completed', c: '#6c63ff' },
            { v: user?.sessionsCompleted || 0, l: 'Total Done', c: '#f59e0b' },
            { v: `${(user?.sessionsCompleted || 0) * 100}`, l: 'Points Earned', c: '#f43f5e' },
          ].map(s => (
            <div key={s.l} className="stat-card" style={{ borderLeft: `3px solid ${s.c}` }}>
              <div className="stat-value" style={{ color: s.c, fontSize: 28 }}>{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 4, background: '#0f1629', borderRadius: 12, padding: 4 }}>
            {[
              { k: 'upcoming', l: `📅 Upcoming (${upcoming.length})` },
              { k: 'completed', l: `✅ Completed (${completed.length})` },
              { k: 'cancelled', l: `❌ Cancelled (${cancelled.length})` },
            ].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: tab === t.k ? '#6c63ff' : 'transparent',
                color: tab === t.k ? '#fff' : '#94a3b8',
                fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
              }}>{t.l}</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowBook(true)}>📅 Book Session</button>
        </div>

        {/* Session list */}
        {loading ? <div className="loading-spinner" />
          : displayed.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No {tab} sessions</h3>
              <p>Book a session with one of your matches!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {displayed.map(s => {
                const isTeacher = s.teacher?._id === user?._id;
                const partner = isTeacher ? s.learner : s.teacher;
                return (
                  <div key={s._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <img src={partner?.avatar} className="avatar avatar-md" alt={partner?.name} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{s.skill}</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>
                          {isTeacher ? '👨‍🏫 Teaching' : '👨‍🎓 Learning'} · with <strong>{partner?.name}</strong>
                        </div>
                        <div style={{ fontSize: 13, color: '#94a3b8' }}>
                          📅 {format(new Date(s.scheduledAt), 'PPP · p')} · ⏱️ {s.duration} min
                        </div>
                        {s.notes && <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>📝 {s.notes}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="badge" style={{ background: `${statusColor[s.status]}22`, color: statusColor[s.status], border: `1px solid ${statusColor[s.status]}44`, fontSize: 12 }}>
                        {s.status}
                      </span>
                      {s.status === 'scheduled' && (
                        <>
                          <button className="btn btn-teal btn-sm" onClick={() => handleComplete(s._id)}>✅ Complete</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(s._id)}>Cancel</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        {/* Book Session Modal */}
        {showBook && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 24,
          }} onClick={e => e.target === e.currentTarget && setShowBook(false)}>
            <div className="card" style={{ width: '100%', maxWidth: 480, borderColor: 'rgba(108,99,255,0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20 }}>📅 Book a Session</h2>
                <button onClick={() => setShowBook(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>×</button>
              </div>
              <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="input-group">
                  <label>Select Match (Teacher)</label>
                  <select className="input-field" value={form.teacherId} onChange={e => setForm(p => ({ ...p, teacherId: e.target.value }))} required>
                    <option value="">Choose your teacher...</option>
                    {matches.map(m => {
                      const partner = m.requester?._id === user?._id ? m.recipient : m.requester;
                      return <option key={m._id} value={partner?._id}>{partner?.name}</option>;
                    })}
                  </select>
                </div>
                <div className="input-group">
                  <label>Skill to Learn</label>
                  <select className="input-field" value={form.skill} onChange={e => setForm(p => ({ ...p, skill: e.target.value }))} required>
                    <option value="">Select skill...</option>
                    {skills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Date & Time</label>
                  <input type="datetime-local" className="input-field" value={form.scheduledAt} onChange={e => setForm(p => ({ ...p, scheduledAt: e.target.value }))} required min={new Date().toISOString().slice(0, 16)} />
                </div>
                <div className="input-group">
                  <label>Duration (minutes)</label>
                  <select className="input-field" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))}>
                    {[30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} minutes</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Notes (optional)</label>
                  <textarea className="input-field" rows={3} placeholder="What do you want to cover?" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px' }} disabled={booking}>
                  {booking ? '⏳ Booking...' : '📅 Book Session'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
