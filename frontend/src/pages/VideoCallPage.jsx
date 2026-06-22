import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

export default function VideoCallPage() {
  const { channel } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [status, setStatus] = useState('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [duration, setDuration] = useState(0);
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    startCamera();
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    setStatus('connected');
    return () => {
      stopCamera();
      clearInterval(timerRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      toast.success('Camera started 📹');
    } catch (err) {
      toast.error('Camera access denied. Check permissions.');
      setIsCamOff(true);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
  };

  const toggleMute = () => {
    streamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsMuted(m => !m);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    setIsCamOff(c => !c);
  };

  const endCall = () => {
    stopCamera();
    clearInterval(timerRef.current);
    socket?.emit('call_ended', {});
    toast.success('Call ended');
    navigate(-1);
  };

  const formatDuration = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div style={{
      minHeight: '100vh', background: '#060b14',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        background: 'rgba(6,11,20,0.9)', backdropFilter: 'blur(10px)',
        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid #1e2d4a', zIndex: 100,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 10, height: 10, background: status === 'connected' ? '#00d4aa' : '#f59e0b', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          <span style={{ fontWeight: 700 }}>SkillSwap Video Session</span>
          <span style={{ color: '#94a3b8', fontSize: 14 }}>Channel: {channel}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ background: '#1e2d4a', padding: '6px 14px', borderRadius: 8, fontWeight: 700, fontSize: 14, fontFamily: 'monospace' }}>
            ⏱️ {formatDuration(duration)}
          </div>
        </div>
      </div>

      {/* Video area */}
      <div style={{ width: '100%', maxWidth: 1000, padding: '80px 24px 120px', display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>

        {/* Local video */}
        <div style={{ position: 'relative', flex: 1, minWidth: 300, maxWidth: 480, aspectRatio: '16/9', background: '#0f1629', borderRadius: 16, overflow: 'hidden', border: '2px solid #1e2d4a' }}>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
          {isCamOff && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f1629' }}>
              <img src={user?.avatar} className="avatar avatar-xl" alt="" />
              <span style={{ color: '#94a3b8', marginTop: 8, fontSize: 13 }}>Camera Off</span>
            </div>
          )}
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600 }}>
            You {isMuted && '🔇'}
          </div>
        </div>

        {/* Remote placeholder */}
        <div style={{ position: 'relative', flex: 1, minWidth: 300, maxWidth: 480, aspectRatio: '16/9', background: '#0f1629', borderRadius: 16, border: '2px dashed #1e2d4a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{ fontSize: 48 }}>👤</div>
          <div style={{ color: '#475569', fontSize: 14, textAlign: 'center' }}>
            Waiting for partner to join...<br />
            <span style={{ fontSize: 12 }}>Share channel: <strong style={{ color: '#6c63ff' }}>{channel}</strong></span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(6,11,20,0.95)', backdropFilter: 'blur(10px)',
        padding: '20px 24px',
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16,
        borderTop: '1px solid #1e2d4a',
      }}>
        <button onClick={toggleMute} style={{
          width: 54, height: 54, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: isMuted ? 'rgba(244,63,94,0.2)' : '#1e2d4a',
          color: isMuted ? '#f43f5e' : '#f1f5f9', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>{isMuted ? '🔇' : '🎙️'}</button>

        <button onClick={toggleCam} style={{
          width: 54, height: 54, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: isCamOff ? 'rgba(244,63,94,0.2)' : '#1e2d4a',
          color: isCamOff ? '#f43f5e' : '#f1f5f9', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>{isCamOff ? '📷' : '📹'}</button>

        <button onClick={endCall} style={{
          width: 64, height: 64, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: '#f43f5e', color: '#fff', fontSize: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(244,63,94,0.5)',
          transition: 'all 0.2s',
        }}>📵</button>

        <button style={{
          width: 54, height: 54, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: '#1e2d4a', color: '#f1f5f9', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>🖥️</button>

        <button style={{
          width: 54, height: 54, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: '#1e2d4a', color: '#f1f5f9', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>💬</button>
      </div>

      {/* Agora note */}
      <div style={{ position: 'fixed', top: 76, right: 16, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#94a3b8', maxWidth: 220 }}>
        💡 For production, Agora.io SDK integrates here for multi-party WebRTC video
      </div>
    </div>
  );
}
