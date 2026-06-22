import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (user) {
      socketRef.current = io('http://localhost:5001', { withCredentials: true });
      socketRef.current.emit('register_user', user._id);

      socketRef.current.on('online_users', (users) => setOnlineUsers(users));
      socketRef.current.on('incoming_call', (data) => setIncomingCall(data));
      socketRef.current.on('call_ended', () => setIncomingCall(null));

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [user]);

  const socket = socketRef.current;

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, incomingCall, setIncomingCall }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
