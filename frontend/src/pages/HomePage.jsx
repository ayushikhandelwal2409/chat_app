import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from '../lib/axios';
import useAuthStore from '../store/useAuthStore';
import Loader from '../components/Loader.jsx';
import socket from '../lib/socket';

const getId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (value._id) return value._id.toString();
    if (typeof value.toString === 'function') return value.toString();
  }
  return `${value}`;
};

const HomePage = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isUsersLoading, setUsersLoading] = useState(false);
  const [isMessagesLoading, setMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const handleIncomingMessage = (incomingMessage) => {
      const senderId = getId(incomingMessage.senderId);
      const receiverId = getId(incomingMessage.receiverId);
      const myId = getId(user?._id);
      const partnerId = senderId === myId ? receiverId : senderId;

      if (partnerId === selectedUserId) {
        setMessages((prev) => {
          if (prev.some((message) => message._id === incomingMessage._id)) {
            return prev;
          }
          return [...prev, incomingMessage];
        });
      } else if (senderId !== myId) {
        toast.success(
          `New message from ${
            incomingMessage?.senderId?.fullName || 'a user'
          }`
        );
      }
    };

    const handleConnectError = (error) => {
      toast.error(error.message || 'Socket connection failed');
    };

    socket.on('newMessage', handleIncomingMessage);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('newMessage', handleIncomingMessage);
      socket.off('connect_error', handleConnectError);
    };
  }, [selectedUserId, user]);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }
    fetchMessages(selectedUserId);
  }, [selectedUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const { data } = await axios.get('/message/users');
      setUsers(data);
      if (data.length && !selectedUserId) {
        setSelectedUserId(data[0]._id);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchMessages = async (chatPartnerId) => {
    setMessagesLoading(true);
    try {
      const { data } = await axios.get(`/message/${chatPartnerId}`);
      setMessages(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!messageInput.trim() || !selectedUserId) return;
    setIsSending(true);
    try {
      const { data } = await axios.post(`/message/send/${selectedUserId}`, {
        text: messageInput.trim(),
      });
      setMessages((prev) => {
        if (prev.some((message) => message._id === data._id)) {
          return prev;
        }
        return [...prev, data];
      });
      setMessageInput('');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const selectedUser = useMemo(
    () => users.find((entry) => entry._id === selectedUserId) || null,
    [selectedUserId, users]
  );

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <div className="chat-sidebar__header">
          <h2>Chats</h2>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={fetchUsers}
          >
            Refresh
          </button>
        </div>
        {isUsersLoading ? (
          <Loader label="Loading users..." />
        ) : users.length ? (
          <ul className="chat-sidebar__list">
            {users.map((chatUser) => (
              <li
                key={chatUser._id}
                className={
                  chatUser._id === selectedUserId
                    ? 'chat-sidebar__item is-active'
                    : 'chat-sidebar__item'
                }
                onClick={() => setSelectedUserId(chatUser._id)}
              >
                <div className="chat-sidebar__avatar">
                  {chatUser.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="chat-sidebar__name">{chatUser.fullName}</p>
                  <p className="chat-sidebar__email">{chatUser.email}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="chat-sidebar__empty">No other users found.</p>
        )}
      </aside>
      <section className="chat-panel">
        {selectedUser ? (
          <>
            <header className="chat-panel__header">
              <div>
                <p className="chat-panel__title">{selectedUser.fullName}</p>
                <p className="chat-panel__subtitle">{selectedUser.email}</p>
              </div>
            </header>
            <div className="chat-panel__messages">
              {isMessagesLoading ? (
                <Loader label="Loading messages..." />
              ) : messages.length ? (
                messages.map((message) => {
                  const senderId =
                    typeof message.senderId === 'object'
                      ? message.senderId?._id || message.senderId?.toString?.()
                      : message.senderId;
                  const myId =
                    typeof user?._id === 'object'
                      ? user?._id?.toString?.()
                      : user?._id;
                  const isMine =
                    senderId?.toString?.() === myId?.toString?.() ||
                    senderId === myId;
                  return (
                    <div
                      key={message._id}
                      className={
                        isMine ? 'message-bubble is-own' : 'message-bubble'
                      }
                    >
                      {message.text && <p>{message.text}</p>}
                      <span className="message-bubble__timestamp">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="chat-panel__empty">
                  Start the conversation with {selectedUser.fullName}.
                </p>
              )}
              <span ref={messagesEndRef} />
            </div>
            <form className="chat-panel__input" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your message..."
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
              />
              <button className="btn" type="submit" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send'}
              </button>
            </form>
          </>
        ) : (
          <div className="chat-panel__placeholder">
            <h3>Select a chat to get started</h3>
            <p>Pick someone from the list on the left.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;