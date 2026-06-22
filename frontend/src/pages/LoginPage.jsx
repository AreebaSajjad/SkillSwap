import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage({ isRegister }) {
  const [mode, setMode] = useState(isRegister ? 'register' : 'login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        toast.success('Welcome back! 👋');
      } else {
        if (!form.name) return toast.error('Name is required');
        await register(form.name, form.email, form.password);
        toast.success('Welcome to SkillSwap! 🎉');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0e1a', padding: 24,
    }}>
      {/* Glow */}
      <div style={{
        position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #6c63ff, #00d4aa)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>⚡</div>
            <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: '#f1f5f9' }}>SkillSwap</span>
          </Link>
          <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>
            {mode === 'login' ? 'Welcome back! Sign in to continue' : 'Join Pakistan\'s skill exchange community'}
          </p>
        </div>

        <div className="card" style={{ borderColor: 'rgba(108,99,255,0.3)' }}>
          {/* Toggle */}
          <div style={{
            display: 'flex', background: '#0a0e1a', borderRadius: 10,
            padding: 4, marginBottom: 24,
          }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '9px', borderRadius: 8, border: 'none',
                background: mode === m ? '#6c63ff' : 'transparent',
                color: mode === m ? '#fff' : '#94a3b8',
                fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && (
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text" className="input-field"
                  placeholder="Areeba Sajjad"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
            )}
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email" className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password" className="input-field"
                placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required minLength={6}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: 8, padding: '13px' }} disabled={loading}>
              {loading ? '⏳ Please wait...' : mode === 'login' ? '🚀 Sign In' : '✨ Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#94a3b8' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{
              background: 'none', border: 'none', color: '#6c63ff', cursor: 'pointer', fontWeight: 600, fontSize: 13,
            }}>
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#475569' }}>
          By continuing, you agree to our Terms & Privacy Policy
        </p>
        {/* Demo Credentials */}
        <div style={{
          marginTop: 20,
          padding: '16px',
          background: 'rgba(108,99,255,0.08)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: 12,
        }}>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#6c63ff', fontWeight: 700, marginBottom: 10 }}>
            🧪 Demo Account
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: '#64748b' }}>Email</span>
              <span style={{ color: '#f1f5f9', fontFamily: 'monospace' }}>rabea@skillswap.pk</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: '#64748b' }}>Password</span>
              <span style={{ color: '#f1f5f9', fontFamily: 'monospace' }}>password123</span>
            </div>
          </div>
          <button
            onClick={() => {
              setForm({ name: '', email: 'rabea@skillswap.pk', password: 'password123' });
              setMode('login');
            }}
            style={{
              width: '100%', marginTop: 10, padding: '8px',
              background: 'rgba(108,99,255,0.15)',
              border: '1px solid rgba(108,99,255,0.3)',
              borderRadius: 8, color: '#6c63ff',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            ⚡ Auto-fill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
