import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/shared/Sidebar';
import Navbar from '../components/shared/Navbar';
import { messagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesAPI.getRooms()
      .then(r => setRooms(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
      setRooms(prev => prev.map(r => r.roomId === msg.room ? { ...r, lastMessage: msg } : r));
    });
    socket.on('user_typing', ({ isTyping }) => setPartnerTyping(isTyping));
    return () => { socket.off('receive_message'); socket.off('user_typing'); };
  }, [socket]);

  const openRoom = async (room) => {
    setActiveRoom(room);
    socket?.emit('join_room', room.roomId);
    const res = await messagesAPI.getMessages(room.roomId);
    setMessages(res.data.data);
    setRooms(prev => prev.map(r => r.roomId === room.roomId ? { ...r, unreadCount: 0 } : r));
  };

  const sendMessage = () => {
    if (!input.trim() || !activeRoom || !socket) return;
    socket.emit('send_message', { room: activeRoom.roomId, content: input.trim(), type: 'text' });
    setInput('');
  };

  const handleTyping = (val) => {
    setInput(val);
    if (!socket || !activeRoom) return;
    socket.emit('user_typing', { room: activeRoom.roomId, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('user_typing', { room: activeRoom.roomId, isTyping: false });
    }, 1500);
  };

  const startVideoCall = () => {
    if (!activeRoom) return;
    const channel = activeRoom.roomId.replace('-', '_');
    navigate(`/video/${channel}`);
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content" style={{ paddingTop: 0, padding: 0, marginLeft: 260, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ padding: '0 32px' }}><Navbar title="Chat" /></div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', margin: '0 32px 32px' }}>
          {/* Rooms sidebar */}
          <div style={{
            width: 280, flexShrink: 0,
            background: '#0f1629', border: '1px solid #1e2d4a',
            borderRadius: '16px 0 0 16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e2d4a', fontWeight: 700 }}>
              💬 Conversations
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {loading ? <div className="loading-spinner" style={{ margin: '30px auto', width: 28, height: 28 }} />
                : rooms.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#475569', fontSize: 13 }}>
                    No conversations yet.<br />Accept a match to start chatting!
                  </div>
                ) : rooms.map(r => {
                  const isOnline = onlineUsers.includes(r.partner?._id);
                  const isActive = activeRoom?.roomId === r.roomId;
                  return (
                    <div key={r.roomId} onClick={() => openRoom(r)} style={{
                      padding: '14px 16px', cursor: 'pointer',
                      background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
                      borderLeft: isActive ? '3px solid #6c63ff' : '3px solid transparent',
                      borderBottom: '1px solid #1e2d4a', display: 'flex', gap: 12, alignItems: 'center',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img src={r.partner?.avatar} className="avatar avatar-sm" alt="" />
                        {isOnline && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, background: '#00d4aa', borderRadius: '50%', border: '2px solid #0f1629' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{r.partner?.name}</div>
                        <div style={{ fontSize: 12, color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.lastMessage?.content || 'No messages yet'}
                        </div>
                      </div>
                      {r.unreadCount > 0 && (
                        <div style={{ background: '#6c63ff', color: '#fff', width: 20, height: 20, borderRadius: '50%', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {r.unreadCount}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Chat area */}
          <div style={{
            flex: 1, border: '1px solid #1e2d4a', borderLeft: 'none',
            borderRadius: '0 16px 16px 0', display: 'flex', flexDirection: 'column', background: '#0a0e1a',
            overflow: 'hidden',
          }}>
            {!activeRoom ? (
              <div className="empty-state" style={{ margin: 'auto' }}>
                <div className="empty-state-icon">💬</div>
                <h3>Select a conversation</h3>
                <p>Choose a match from the left to start chatting</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #1e2d4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f1629' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={activeRoom.partner?.avatar} className="avatar avatar-sm" alt="" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{activeRoom.partner?.name}</div>
                      <div style={{ fontSize: 12, color: onlineUsers.includes(activeRoom.partner?._id) ? '#00d4aa' : '#475569' }}>
                        {onlineUsers.includes(activeRoom.partner?._id) ? '🟢 Online' : '⚫ Offline'}
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-teal btn-sm" onClick={startVideoCall}>📹 Video Call</button>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                  {messages.map((msg, i) => {
                    const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                    return (
                      <div key={msg._id || i} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                        {!isMine && <img src={msg.sender?.avatar} className="avatar avatar-sm" style={{ marginRight: 8, flexShrink: 0 }} alt="" />}
                        <div style={{
                          maxWidth: '65%',
                          background: isMine ? 'linear-gradient(135deg, #6c63ff, #4f46e5)' : '#141d35',
                          borderRadius: isMine ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                          padding: '10px 14px',
                          border: !isMine ? '1px solid #1e2d4a' : 'none',
                        }}>
                          <div style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.content}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4, textAlign: 'right' }}>
                            {format(new Date(msg.createdAt), 'h:mm a')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {partnerTyping && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
                      <span>typing</span>
                      <span style={{ letterSpacing: 2 }}>...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid #1e2d4a', display: 'flex', gap: 8, background: '#0f1629' }}>
                  <input
                    className="input-field" style={{ flex: 1 }}
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => handleTyping(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  />
                  <button className="btn btn-primary" onClick={sendMessage} disabled={!input.trim()}>Send 📤</button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
