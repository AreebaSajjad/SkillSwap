import { useState, useEffect } from 'react';
import Sidebar from '../components/shared/Sidebar';
import Navbar from '../components/shared/Navbar';
import { coursesAPI, skillsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LEVELS = ['Beginner', 'Intermediate', 'Expert'];
const levelColor = { Beginner: '#00d4aa', Intermediate: '#f59e0b', Expert: '#f43f5e' };

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', skill: '', level: 'Beginner', content: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([coursesAPI.getCourses(), skillsAPI.getSkills()])
      .then(([c, s]) => { setCourses(c.data.data); setSkills(s.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (id) => {
    try {
      await coursesAPI.enroll(id);
      toast.success('Enrolled successfully! 📚');
      const res = await coursesAPI.getCourses();
      setCourses(res.data.data);
    } catch (err) {
      toast.error('Enrollment failed');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const contentArr = form.content ? [{ title: 'Overview', body: form.content, order: 1 }] : [];
      await coursesAPI.createCourse({ ...form, content: contentArr });
      toast.success('Course created! 🎉');
      setShowCreate(false);
      const res = await coursesAPI.getCourses();
      setCourses(res.data.data);
    } catch (err) {
      toast.error('Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const filtered = filter === 'all' ? courses : filter === 'mine' ? courses.filter(c => c.instructor?._id === user?._id) : courses.filter(c => c.enrolledUsers?.includes(user?._id));

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content" style={{ paddingTop: 0 }}>
        <Navbar title="Micro-Courses" />

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          {[
            { v: courses.length, l: 'Total Courses', c: '#6c63ff' },
            { v: courses.filter(c => c.enrolledUsers?.includes(user?._id)).length, l: 'Enrolled', c: '#00d4aa' },
            { v: courses.filter(c => c.instructor?._id === user?._id).length, l: 'Created by You', c: '#f59e0b' },
            { v: courses.reduce((a, c) => a + (c.enrolledUsers?.length || 0), 0), l: 'Total Enrollments', c: '#f43f5e' },
          ].map(s => (
            <div key={s.l} className="stat-card" style={{ borderLeft: `3px solid ${s.c}` }}>
              <div className="stat-value" style={{ color: s.c, fontSize: 28 }}>{s.v}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 4, background: '#0f1629', borderRadius: 12, padding: 4 }}>
            {[{ k: 'all', l: '📚 All' }, { k: 'enrolled', l: '✅ Enrolled' }, { k: 'mine', l: '👤 Created' }].map(t => (
              <button key={t.k} onClick={() => setFilter(t.k)} style={{
                padding: '8px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: filter === t.k ? '#6c63ff' : 'transparent',
                color: filter === t.k ? '#fff' : '#94a3b8',
                fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
              }}>{t.l}</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>➕ Create Course</button>
        </div>

        {/* Courses grid */}
        {loading ? <div className="loading-spinner" />
          : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3>No courses found</h3>
              <p>Be the first to create a micro-course!</p>
            </div>
          ) : (
            <div className="grid-3">
              {filtered.map(c => {
                const isEnrolled = c.enrolledUsers?.includes(user?._id);
                const isMine = c.instructor?._id === user?._id;
                return (
                  <div key={c._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Header color bar */}
                    <div style={{ height: 4, background: `linear-gradient(90deg, ${levelColor[c.level]}, #6c63ff)`, borderRadius: '4px 4px 0 0', margin: '-24px -24px 16px' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <span className="badge" style={{ background: `${levelColor[c.level]}22`, color: levelColor[c.level], border: `1px solid ${levelColor[c.level]}44`, fontSize: 11 }}>
                        {c.level}
                      </span>
                      {c.skill && <span className="badge badge-purple" style={{ fontSize: 11 }}>{c.skill}</span>}
                    </div>

                    <h3 style={{ fontSize: 16, marginBottom: 8, flex: 1 }}>{c.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {c.description}
                    </p>

                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, fontSize: 12, color: '#94a3b8' }}>
                      <img src={c.instructor?.avatar} className="avatar" style={{ width: 24, height: 24 }} alt="" />
                      <span>{c.instructor?.name}</span>
                      <span style={{ marginLeft: 'auto' }}>👥 {c.enrolledUsers?.length || 0}</span>
                    </div>

                    <button
                      className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ justifyContent: 'center' }}
                      onClick={() => !isEnrolled && !isMine && handleEnroll(c._id)}
                      disabled={isMine}
                    >
                      {isMine ? '📝 Your Course' : isEnrolled ? '✅ Enrolled' : '📚 Enroll Free'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        {/* Create Modal */}
        {showCreate && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
            onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
            <div className="card" style={{ width: '100%', maxWidth: 500, borderColor: 'rgba(108,99,255,0.4)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20 }}>➕ Create Course</h2>
                <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 24, cursor: 'pointer' }}>×</button>
              </div>
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-group">
                  <label>Course Title</label>
                  <input className="input-field" placeholder="e.g. React.js for Beginners" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea className="input-field" rows={3} placeholder="What will students learn?" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="input-group">
                    <label>Skill</label>
                    <select className="input-field" value={form.skill} onChange={e => setForm(p => ({ ...p, skill: e.target.value }))}>
                      <option value="">Select...</option>
                      {skills.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Level</label>
                    <select className="input-field" value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}>
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Course Content</label>
                  <textarea className="input-field" rows={5} placeholder="Write your course content here..." value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} style={{ resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px' }} disabled={creating}>
                  {creating ? '⏳ Creating...' : '🚀 Publish Course'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
