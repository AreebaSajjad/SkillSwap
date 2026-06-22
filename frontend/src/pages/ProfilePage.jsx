import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Navbar from '../components/shared/Navbar';
import { usersAPI, reviewsAPI, skillsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Expert'];
const levelColors = { 1: '#94a3b8', 2: '#6c63ff', 3: '#00d4aa', 4: '#f59e0b', 5: '#f43f5e' };
const femaleNames = ['areeba','hifza','fatima','nadia','sana','maham','zara','maryam','iqra','rabea','aisha','hina','amna','lubna','sundus','komal','alina','naila','sara'];

function getAvatar(name, src) {
  if (src && src.startsWith('http')) return src;
  const firstName = (name || '').toLowerCase().split(' ')[0];
  const isFemale = femaleNames.some(n => firstName.includes(n));
  const style = isFemale ? 'adventurer' : 'avataaars';
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(name || 'user')}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
}

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const isOwnProfile = !id || id === currentUser?._id;

  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', skillsTeaching: [], skillsLearning: [] });
  const [newTeachSkill, setNewTeachSkill] = useState({ skill: '', level: 'Intermediate', description: '' });
  const [newLearnSkill, setNewLearnSkill] = useState({ skill: '', priority: 'Medium' });

  useEffect(() => {
    const profileId = id || currentUser?._id;
    if (!profileId) return;
    setLoading(true);
    Promise.all([
      usersAPI.getProfile(profileId),
      reviewsAPI.getUserReviews(profileId),
      skillsAPI.getSkills(),
    ]).then(([p, r, s]) => {
      setProfile(p.data.data);
      setReviews(r.data.data);
      setSkills(s.data.data);
      setForm({
        name: p.data.data.name,
        bio: p.data.data.bio || '',
        skillsTeaching: p.data.data.skillsTeaching || [],
        skillsLearning: p.data.data.skillsLearning || [],
      });
    }).catch(err => {
      console.error('Profile load error:', err);
      toast.error('Failed to load profile');
    }).finally(() => setLoading(false));
  }, [id, currentUser?._id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await usersAPI.updateProfile(form);
      setProfile(res.data.data);
      updateUser(res.data.data);
      setEditing(false);
      toast.success('Profile updated! ✅');
    } catch (err) {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addTeachSkill = () => {
    if (!newTeachSkill.skill) return toast.error('Select a skill first');
    setForm(p => ({ ...p, skillsTeaching: [...p.skillsTeaching, { ...newTeachSkill }] }));
    setNewTeachSkill({ skill: '', level: 'Intermediate', description: '' });
  };

  const addLearnSkill = () => {
    if (!newLearnSkill.skill) return toast.error('Select a skill first');
    setForm(p => ({ ...p, skillsLearning: [...p.skillsLearning, { ...newLearnSkill }] }));
    setNewLearnSkill({ skill: '', priority: 'Medium' });
  };

  const removeSkill = (type, index) => {
    setForm(p => ({ ...p, [type]: p[type].filter((_, i) => i !== index) }));
  };

  if (loading) {
    return (
      <div className="page-layout">
        <Sidebar />
        <main className="page-content" style={{ paddingTop: 0 }}>
          <Navbar title="Profile" />
          <div className="loading-spinner" />
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-layout">
        <Sidebar />
        <main className="page-content" style={{ paddingTop: 0 }}>
          <Navbar title="Profile" />
          <div className="empty-state">
            <div className="empty-state-icon">👤</div>
            <h3>Profile not found</h3>
          </div>
        </main>
      </div>
    );
  }

  const avatarSrc = getAvatar(profile.name, profile.avatar);
  const displaySkillsTeaching = editing ? form.skillsTeaching : (profile.skillsTeaching || []);
  const displaySkillsLearning = editing ? form.skillsLearning : (profile.skillsLearning || []);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content" style={{ paddingTop: 0 }}>
        <Navbar title={isOwnProfile ? 'My Profile' : `${profile.name}'s Profile`} />

        {/* Profile header card */}
        <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,212,170,0.05))', borderColor: 'rgba(108,99,255,0.3)' }}>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={avatarSrc}
                alt={profile.name}
                className="avatar avatar-xl"
                style={{ border: '3px solid #6c63ff' }}
                onError={e => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`; }}
              />
              <div style={{
                position: 'absolute', bottom: -4, right: -4,
                background: levelColors[profile.level] || '#6c63ff',
                color: '#fff', width: 24, height: 24, borderRadius: '50%',
                fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0a0e1a',
              }}>{profile.level}</div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              {editing ? (
                <input
                  className="input-field"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}
                />
              ) : (
                <h2 style={{ fontSize: 26, marginBottom: 4 }}>{profile.name}</h2>
              )}

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <span className="badge badge-purple">Level {profile.level}</span>
                {profile.role === 'admin' && <span className="badge badge-rose">🛡️ Admin</span>}
                {profile.rating > 0 && (
                  <span style={{ fontSize: 13, color: '#f59e0b' }}>
                    ⭐ {profile.rating.toFixed(1)} ({profile.totalRatings} reviews)
                  </span>
                )}
                <span style={{ fontSize: 13, color: '#94a3b8' }}>✅ {profile.sessionsCompleted} sessions</span>
                <span style={{ fontSize: 13, color: '#f59e0b' }}>⭐ {profile.points} pts</span>
              </div>

              {editing ? (
                <textarea
                  className="input-field"
                  rows={2}
                  value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell others about yourself..."
                  style={{ resize: 'vertical' }}
                />
              ) : (
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>
                  {profile.bio || 'No bio added yet.'}
                </p>
              )}
            </div>

            {/* Edit button */}
            {isOwnProfile && (
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {editing ? (
                  <>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                      {saving ? '⏳' : '💾 Save'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-secondary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>
                )}
              </div>
            )}
          </div>

          {/* Badges */}
          {profile.badges?.length > 0 && (
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #1e2d4a' }}>
              <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, fontWeight: 700 }}>BADGES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.badges.map((b, i) => (
                  <div key={i} className="badge badge-amber">{b.icon} {b.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills grid */}
        <div className="grid-2" style={{ marginBottom: 20 }}>

          {/* Teaching Skills */}
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>👨‍🏫 Skills I Can Teach</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: editing ? 16 : 0 }}>
              {displaySkillsTeaching.length === 0 ? (
                <div style={{ color: '#475569', fontSize: 13 }}>No teaching skills added yet</div>
              ) : displaySkillsTeaching.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px',
                  background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 8,
                }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{s.skill}</span>
                    <span className="badge badge-teal" style={{ marginLeft: 8, fontSize: 11 }}>{s.level}</span>
                    {s.description && <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{s.description}</div>}
                  </div>
                  {editing && (
                    <button onClick={() => removeSkill('skillsTeaching', i)}
                      style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
                  )}
                </div>
              ))}
            </div>

            {editing && (
              <div style={{ borderTop: '1px solid #1e2d4a', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <select className="input-field" value={newTeachSkill.skill}
                    onChange={e => setNewTeachSkill(p => ({ ...p, skill: e.target.value }))}>
                    <option value="">Select skill...</option>
                    {skills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="input-field" value={newTeachSkill.level}
                    onChange={e => setNewTeachSkill(p => ({ ...p, level: e.target.value }))}>
                    {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <input className="input-field" placeholder="Short description (optional)"
                  value={newTeachSkill.description}
                  onChange={e => setNewTeachSkill(p => ({ ...p, description: e.target.value }))} />
                <button className="btn btn-teal btn-sm" onClick={addTeachSkill} style={{ alignSelf: 'flex-start' }}>
                  + Add Teaching Skill
                </button>
              </div>
            )}
          </div>

          {/* Learning Skills */}
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 16 }}>📚 Skills I Want to Learn</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: editing ? 16 : 0 }}>
              {displaySkillsLearning.length === 0 ? (
                <div style={{ color: '#475569', fontSize: 13 }}>No learning goals added yet</div>
              ) : displaySkillsLearning.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px',
                  background: 'rgba(108,99,255,0.05)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8,
                }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{s.skill}</span>
                    <span className="badge badge-purple" style={{ marginLeft: 8, fontSize: 11 }}>{s.priority}</span>
                  </div>
                  {editing && (
                    <button onClick={() => removeSkill('skillsLearning', i)}
                      style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
                  )}
                </div>
              ))}
            </div>

            {editing && (
              <div style={{ borderTop: '1px solid #1e2d4a', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <select className="input-field" value={newLearnSkill.skill}
                    onChange={e => setNewLearnSkill(p => ({ ...p, skill: e.target.value }))}>
                    <option value="">Select skill...</option>
                    {skills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select className="input-field" value={newLearnSkill.priority}
                    onChange={e => setNewLearnSkill(p => ({ ...p, priority: e.target.value }))}>
                    {['Low', 'Medium', 'High'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <button className="btn btn-primary btn-sm" onClick={addLearnSkill} style={{ alignSelf: 'flex-start' }}>
                  + Add Learning Goal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>⭐ Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <div style={{ color: '#475569', fontSize: 14 }}>No reviews yet. Complete sessions to earn reviews!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(r => (
                <div key={r._id} style={{
                  padding: '14px 16px', background: '#0f1629',
                  borderRadius: 10, border: '1px solid #1e2d4a',
                }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <img
                      src={getAvatar(r.reviewer?.name, r.reviewer?.avatar)}
                      className="avatar avatar-sm"
                      alt={r.reviewer?.name}
                      onError={e => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.reviewer?.name || 'user')}`; }}
                    />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{r.reviewer?.name}</span>
                      <div style={{ color: '#f59e0b', fontSize: 13 }}>{'⭐'.repeat(r.rating)}</div>
                    </div>
                  </div>
                  {r.comment && (
                    <p style={{ color: '#94a3b8', fontSize: 14, fontStyle: 'italic' }}>"{r.comment}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
