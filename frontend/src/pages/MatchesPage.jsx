import { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Navbar from '../components/shared/Navbar';
import { matchesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function UserCard({ suggestion, onRequest }) {
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequest = async () => {
    setRequesting(true);
    try {
      await onRequest(suggestion.user._id);
      setRequested(true);
      toast.success('Match request sent! 🤝');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  const u = suggestion.user;

  return (
    <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Score badge */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: suggestion.score > 70 ? 'rgba(0,212,170,0.15)' : 'rgba(108,99,255,0.15)',
        border: `1px solid ${suggestion.score > 70 ? 'rgba(0,212,170,0.3)' : 'rgba(108,99,255,0.3)'}`,
        color: suggestion.score > 70 ? '#00d4aa' : '#8b85ff',
        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
      }}>
        {suggestion.score}% match
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <img src={u.avatar} alt={u.name} className="avatar avatar-lg" style={{ border: '2px solid #1e2d4a' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 17, marginBottom: 2 }}>{u.name}</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge badge-purple" style={{ fontSize: 11 }}>Lvl {u.level}</span>
            {u.rating > 0 && <span style={{ fontSize: 12, color: '#f59e0b' }}>⭐ {u.rating.toFixed(1)}</span>}
            <span style={{ fontSize: 12, color: '#94a3b8' }}>✅ {u.sessionsCompleted} sessions</span>
          </div>
          {u.bio && <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.bio}</p>}
        </div>
      </div>

      {/* Skills */}
      <div style={{ marginBottom: 16 }}>
        {u.skillsTeaching?.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#00d4aa', marginBottom: 4 }}>CAN TEACH</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {u.skillsTeaching.slice(0, 3).map((s, i) => (
                <span key={i} className="badge badge-teal" style={{ fontSize: 11 }}>{s.skill}</span>
              ))}
              {u.skillsTeaching.length > 3 && <span style={{ fontSize: 11, color: '#475569' }}>+{u.skillsTeaching.length - 3} more</span>}
            </div>
          </div>
        )}
        {u.skillsLearning?.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6c63ff', marginBottom: 4 }}>WANTS TO LEARN</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {u.skillsLearning.slice(0, 3).map((s, i) => (
                <span key={i} className="badge badge-purple" style={{ fontSize: 11 }}>{s.skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={handleRequest}
        disabled={requesting || requested}
      >
        {requested ? '✅ Request Sent' : requesting ? '⏳ Sending...' : '🤝 Send Match Request'}
      </button>
    </div>
  );
}

export default function MatchesPage() {
  const [tab, setTab] = useState('suggestions');
  const [suggestions, setSuggestions] = useState([]);
  const [myMatches, setMyMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    Promise.all([matchesAPI.getSuggestions(), matchesAPI.getMatches()])
      .then(([s, m]) => {
        setSuggestions(s.data.data);
        setMyMatches(m.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const sendRequest = async (userId) => {
    await matchesAPI.sendRequest(userId, {});
    setMyMatches(prev => [...prev]);
  };

  const handleRespond = async (matchId, status) => {
    try {
      await matchesAPI.respond(matchId, status);
      toast.success(status === 'accepted' ? 'Match accepted! 🎉' : 'Match declined');
      const res = await matchesAPI.getMatches();
      setMyMatches(res.data.data);
    } catch (err) {
      toast.error('Failed to respond');
    }
  };

  const pending = myMatches.filter(m => m.status === 'pending' && m.recipient._id === user?._id);
  const accepted = myMatches.filter(m => m.status === 'accepted');
  const sent = myMatches.filter(m => m.status === 'pending' && m.requester._id === user?._id);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content" style={{ paddingTop: 0 }}>
        <Navbar title="AI Matches" />

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { v: suggestions.length, l: 'Suggestions', c: '#6c63ff' },
            { v: pending.length, l: 'Pending Requests', c: '#f59e0b' },
            { v: accepted.length, l: 'Active Matches', c: '#00d4aa' },
            { v: sent.length, l: 'Requests Sent', c: '#f43f5e' },
          ].map(s => (
            <div key={s.l} className="stat-card" style={{ borderLeft: `3px solid ${s.c}` }}>
              <div className="stat-value" style={{ color: s.c, fontSize: 28 }}>{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, background: '#0f1629', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
          {[
            { key: 'suggestions', label: '🤖 AI Suggestions' },
            { key: 'pending', label: `⏳ Requests (${pending.length})` },
            { key: 'active', label: `✅ Active (${accepted.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === t.key ? '#6c63ff' : 'transparent',
              color: tab === t.key ? '#fff' : '#94a3b8',
              fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner" />
        ) : tab === 'suggestions' ? (
          suggestions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🤖</div>
              <h3>No suggestions yet</h3>
              <p>Add skills to your profile to get AI-powered match suggestions!</p>
            </div>
          ) : (
            <div className="grid-3">
              {suggestions.map(s => <UserCard key={s.user._id} suggestion={s} onRequest={sendRequest} />)}
            </div>
          )
        ) : tab === 'pending' ? (
          pending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">⏳</div>
              <h3>No pending requests</h3>
            </div>
          ) : (
            <div className="grid-3">
              {pending.map(m => {
                const partner = m.requester;
                return (
                  <div key={m._id} className="card">
                    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <img src={partner.avatar} className="avatar avatar-md" alt={partner.name} />
                      <div>
                        <h3 style={{ fontSize: 16 }}>{partner.name}</h3>
                        <span className="badge badge-amber" style={{ fontSize: 11 }}>Pending request</span>
                      </div>
                    </div>
                    {m.message && <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16, fontStyle: 'italic' }}>"{m.message}"</p>}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleRespond(m._id, 'accepted')}>✅ Accept</button>
                      <button className="btn btn-danger" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleRespond(m._id, 'declined')}>❌ Decline</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          accepted.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🤝</div>
              <h3>No active matches</h3>
              <p>Accept match requests to start skill swapping!</p>
            </div>
          ) : (
            <div className="grid-3">
              {accepted.map(m => {
                const partner = m.requester._id === user?._id ? m.recipient : m.requester;
                return (
                  <div key={m._id} className="card" style={{ borderColor: 'rgba(0,212,170,0.3)' }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                      <img src={partner.avatar} className="avatar avatar-md" alt={partner.name} />
                      <div>
                        <h3 style={{ fontSize: 16 }}>{partner.name}</h3>
                        <span className="badge badge-teal" style={{ fontSize: 11 }}>✅ Matched</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>
                      Match score: <span style={{ color: '#6c63ff', fontWeight: 700 }}>{m.matchScore}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>
    </div>
  );
}
