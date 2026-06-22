import { Link } from 'react-router-dom';

const features = [
  { icon: '🤖', title: 'AI-Powered Matching', desc: 'Smart algorithm finds your perfect skill-swap partner using cosine similarity scoring.' },
  { icon: '💬', title: 'Real-time Chat', desc: 'Socket.io powered messaging — instant delivery, typing indicators, file sharing.' },
  { icon: '📹', title: 'Video Sessions', desc: 'Built-in WebRTC video calls via Agora.io. No downloads, works in your browser.' },
  { icon: '🏆', title: 'Gamification', desc: 'Earn points, unlock badges, climb the weekly leaderboard. Stay motivated.' },
  { icon: '📚', title: 'Micro-Courses', desc: 'Create and enroll in short skill courses. Learn at your own pace.' },
  { icon: '🛡️', title: 'Secure & Reliable', desc: 'JWT auth, bcrypt encryption, XSS protection. Your data is safe.' },
];

const stats = [
  { value: '73%', label: 'Pakistani students cannot afford premium courses' },
  { value: '0', label: 'Cost to join SkillSwap' },
  { value: '100+', label: 'Skills available to learn & teach' },
  { value: '∞', label: 'Knowledge you can exchange' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px', borderBottom: '1px solid #1e2d4a',
        position: 'sticky', top: 0, background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(10px)',
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #6c63ff, #00d4aa)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>⚡</div>
          <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18 }}>SkillSwap</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Get Started Free →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Glow bg */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="badge badge-purple" style={{ marginBottom: 20, fontSize: 13 }}>
          🇵🇰 Built for Pakistan's Student Community
        </div>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', marginBottom: 20, lineHeight: 1.1 }}>
          Trade Your Skills,<br />
          <span className="gradient-text">Not Your Money</span>
        </h1>
        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Pakistan's first peer-to-peer skill exchange platform. Teach what you know, learn what you need. No subscriptions. No fees. Just knowledge.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary btn-lg">🚀 Start Swapping Free</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Login to Platform</Link>
        </div>

        {/* Stat chips */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 48, flexWrap: 'wrap' }}>
          {['⭐ AI Matching', '💬 Real-time Chat', '📹 Video Calls', '🏆 Leaderboard'].map(t => (
            <div key={t} className="badge badge-purple" style={{ fontSize: 13, padding: '8px 16px' }}>{t}</div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 48px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {stats.map(s => (
            <div key={s.value} className="card" style={{ textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: 40, fontWeight: 800, fontFamily: "'Space Grotesk'" }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 48px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, marginBottom: 48 }}>
            Everything You Need to <span className="gradient-text">Grow Together</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} className="card" style={{ borderColor: 'rgba(108,99,255,0.2)' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '0 48px 80px', background: 'rgba(108,99,255,0.03)', borderTop: '1px solid #1e2d4a', borderBottom: '1px solid #1e2d4a' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', paddingTop: 64 }}>
          <h2 style={{ textAlign: 'center', fontSize: 36, marginBottom: 48 }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { step: '01', icon: '✍️', title: 'Create Profile', desc: 'List skills you can teach and skills you want to learn' },
              { step: '02', icon: '🤖', title: 'Get Matched', desc: 'AI finds the best partner based on skill compatibility' },
              { step: '03', icon: '📅', title: 'Book Session', desc: 'Schedule a session and get email confirmations' },
              { step: '04', icon: '🏆', title: 'Earn Rewards', desc: 'Complete sessions to earn points, badges and climb leaderboard' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6c63ff', fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>STEP {s.step}</div>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 13 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, marginBottom: 16 }}>Ready to Start Swapping?</h2>
        <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 16 }}>Join students across Pakistan who are learning without limits.</p>
        <Link to="/register" className="btn btn-primary btn-lg">🚀 Join SkillSwap Free</Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1e2d4a', padding: '24px 48px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
        <p>SkillSwap — made by Areeba Sajjad (FA23-BCS-033) ·</p>
      </footer>
    </div>
  );
}
