import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Navbar from '../components/shared/Navbar';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const rankColors = ['#f59e0b', '#94a3b8', '#cd7f32'];
const rankEmojis = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getLeaderboard().then(r => setLeaders(r.data.data)).finally(() => setLoading(false));
  }, []);

  const myRank = leaders.findIndex(l => l._id === user?._id) + 1;

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content" style={{ paddingTop: 0 }}>
        <Navbar title="Leaderboard" />

        {/* My rank card */}
        {myRank > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(108,99,255,0.1))',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 16, padding: '20px 24px', marginBottom: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ fontSize: 40 }}>{myRank <= 3 ? rankEmojis[myRank - 1] : `#${myRank}`}</div>
              <div>
                <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 2 }}>YOUR CURRENT RANK</div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>#{myRank} on the Leaderboard</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>{user?.points}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Points</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#6c63ff' }}>Lv.{user?.level}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Level</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#00d4aa' }}>{user?.sessionsCompleted}</div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>Sessions</div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 podium */}
        {!loading && leaders.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32, alignItems: 'flex-end' }}>
            {/* 2nd place */}
            <div style={{ textAlign: 'center', flex: 1, maxWidth: 200 }}>
              <img src={leaders[1]?.avatar} className="avatar avatar-lg" alt="" style={{ border: '3px solid #94a3b8', marginBottom: 8 }} />
              <div style={{ fontSize: 24 }}>🥈</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{leaders[1]?.name}</div>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>{leaders[1]?.points} pts</div>
              <div style={{ height: 80, background: 'linear-gradient(180deg, #94a3b833, transparent)', borderRadius: '8px 8px 0 0', marginTop: 8 }} />
            </div>
            {/* 1st place */}
            <div style={{ textAlign: 'center', flex: 1, maxWidth: 200 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>👑</div>
              <img src={leaders[0]?.avatar} className="avatar avatar-xl" alt="" style={{ border: '3px solid #f59e0b', marginBottom: 8 }} />
              <div style={{ fontSize: 28 }}>🥇</div>
              <div style={{ fontWeight: 800, fontSize: 16, marginTop: 4 }}>{leaders[0]?.name}</div>
              <div style={{ color: '#f59e0b', fontSize: 14, fontWeight: 700 }}>{leaders[0]?.points} pts</div>
              <div style={{ height: 110, background: 'linear-gradient(180deg, #f59e0b33, transparent)', borderRadius: '8px 8px 0 0', marginTop: 8 }} />
            </div>
            {/* 3rd place */}
            <div style={{ textAlign: 'center', flex: 1, maxWidth: 200 }}>
              <img src={leaders[2]?.avatar} className="avatar avatar-lg" alt="" style={{ border: '3px solid #cd7f32', marginBottom: 8 }} />
              <div style={{ fontSize: 24 }}>🥉</div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{leaders[2]?.name}</div>
              <div style={{ color: '#94a3b8', fontSize: 13 }}>{leaders[2]?.points} pts</div>
              <div style={{ height: 60, background: 'linear-gradient(180deg, #cd7f3233, transparent)', borderRadius: '8px 8px 0 0', marginTop: 8 }} />
            </div>
          </div>
        )}

        {/* Full list */}
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>🏆 Full Rankings</h3>
          {loading ? <div className="loading-spinner" />
            : leaders.map((l, i) => {
              const isMe = l._id === user?._id;
              return (
                <div key={l._id} onClick={() => navigate(`/profile/${l._id}`)} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '12px 16px', borderRadius: 10,
                  background: isMe ? 'rgba(108,99,255,0.1)' : 'transparent',
                  border: isMe ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
                  cursor: 'pointer', marginBottom: 4, transition: 'all 0.15s',
                }}>
                  {/* Rank */}
                  <div style={{ width: 36, textAlign: 'center', flexShrink: 0 }}>
                    {i < 3 ? (
                      <span style={{ fontSize: 22 }}>{rankEmojis[i]}</span>
                    ) : (
                      <span style={{ fontWeight: 800, fontSize: 16, color: '#475569' }}>#{i + 1}</span>
                    )}
                  </div>

                  <img src={l.avatar} className="avatar avatar-md" alt={l.name} style={{ border: `2px solid ${isMe ? '#6c63ff' : '#1e2d4a'}` }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {l.name} {isMe && <span style={{ color: '#6c63ff', fontSize: 12 }}>(You)</span>}
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      Level {l.level} · {l.sessionsCompleted} sessions · {l.badges?.length || 0} badges
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : '#f1f5f9' }}>
                      {l.points.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 12, color: '#475569' }}>points</div>
                  </div>

                  {/* XP bar */}
                  <div style={{ width: 80, flexShrink: 0 }}>
                    <div style={{ height: 4, background: '#1e2d4a', borderRadius: 2 }}>
                      <div style={{
                        height: '100%', width: `${Math.min(100, (l.points % 100))}%`,
                        background: i < 3 ? `linear-gradient(90deg, ${rankColors[i]}, #6c63ff)` : 'linear-gradient(90deg, #6c63ff, #00d4aa)',
                        borderRadius: 2,
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}
