import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import defaultStartupImage from '../assets/default-startup.jpg';
import defaultInvestorImage from '../assets/default-investor.jpg';
import './ChatPage.css';

// Dummy data for chats
const dummyChats = {
  startup101: {
    id: 101,
    name: 'TechInnovate',
    avatar: '/images/avatars/startup1.jpg',
    role: 'startup',
    messages: [
      {
        id: 1,
        sender: 'investor',
        text: "Hello! I saw your profile and I'm interested in learning more about your AI platform.",
        timestamp: '2025-03-18T10:30:00',
        read: true
      },
      {
        id: 2,
        sender: 'startup',
        text: 'Hi there! Thanks for reaching out. Our platform uses machine learning to automate customer support interactions.',
        timestamp: '2025-03-18T10:35:00',
        read: true
      },
      {
        id: 3,
        sender: 'investor',
        text: 'That sounds interesting. What kind of traction do you have so far?',
        timestamp: '2025-03-18T10:40:00',
        read: true
      },
      {
        id: 4,
        sender: 'startup',
        text: 'We currently have 50 businesses using our platform, with a 95% satisfaction rate. Our MRR is $25,000.',
        timestamp: '2025-03-18T10:45:00',
        read: true
      },
      {
        id: 5,
        sender: 'investor',
        text: "Impressive! I'd like to schedule a call to discuss potential investment opportunities.",
        timestamp: '2025-03-18T10:50:00',
        read: true
      }
    ]
  },
  startup102: {
    id: 102,
    name: 'GreenEnergy Solutions',
    avatar: '/images/avatars/startup2.jpg',
    role: 'startup',
    messages: [
      {
        id: 1,
        sender: 'investor',
        text: "Hello! I'm interested in your renewable energy solutions. Can you tell me more?",
        timestamp: '2025-03-17T14:20:00',
        read: true
      },
      {
        id: 2,
        sender: 'startup',
        text: 'Hi! Our solution focuses on solar and wind energy integration for residential and commercial properties.',
        timestamp: '2025-03-17T14:25:00',
        read: true
      },
      {
        id: 3,
        sender: 'investor',
        text: "What's your current market penetration in Southeast Asia?",
        timestamp: '2025-03-17T14:30:00',
        read: true
      }
    ]
  },
  investor201: {
    id: 201,
    name: 'Asia Ventures',
    avatar: '/images/avatars/investor1.jpg',
    role: 'investor',
    messages: [
      {
        id: 1,
        sender: 'startup',
        text: 'Hello! I saw that you invest in healthcare startups. Our telemedicine platform might be of interest to you.',
        timestamp: '2025-03-16T09:10:00',
        read: true
      },
      {
        id: 2,
        sender: 'investor',
        text: 'Hi there! Yes, healthcare is one of our focus areas. Tell me more about your platform.',
        timestamp: '2025-03-16T09:15:00',
        read: true
      }
    ]
  }
};

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  // Format date
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    // In a real app, you would fetch chats from an API
    // For now, we'll use the dummy data
    setTimeout(() => {
      // Convert dummy chats object to array
      const chatsArray = Object.values(dummyChats);
      setChats(chatsArray);
      
      // If id is provided in URL, set active chat
      if (id) {
        const chat = dummyChats[id];
        if (chat) {
          setActiveChat(chat);
        }
      } else if (chatsArray.length > 0) {
        // Otherwise set first chat as active
        setActiveChat(chatsArray[0]);
      }
      
      setLoading(false);
    }, 1000);
  }, [id]);

  useEffect(() => {
    // Only scroll to bottom when new messages are added, not when switching chats
    if (!activeChat) return;
    
    const currentMessagesLength = activeChat.messages.length;
    
    // Check if we're adding a new message (not just switching chats)
    const isNewMessage = currentMessagesLength > prevMessagesLengthRef.current;
    
    // Update the previous messages length reference
    prevMessagesLengthRef.current = currentMessagesLength;
    
    // Only scroll if it's a new message
    if (isNewMessage && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat]);

  useEffect(() => {
    // Reset the previous messages length when switching chats
    if (activeChat) {
      prevMessagesLengthRef.current = activeChat.messages.length;
    }
  }, [activeChat?.id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // In a real app, you would send this to an API
    // For now, we'll just update the local state
    const newMessage = {
      id: Date.now(),
      sender: user?.role || 'startup', // Default to startup if user role is not available
      text: message,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage]
    };
    
    setActiveChat(updatedChat);
    
    // Update the chat in the chats array
    const updatedChats = chats.map(chat => 
      chat.id === activeChat.id ? updatedChat : chat
    );
    
    setChats(updatedChats);
    setMessage('');
  };

  const handleAttachment = (type) => {
    // In a real app, this would open a file picker
    alert(`Attach ${type} functionality would be implemented here`);
    setShowAttachMenu(false);
  };

  if (loading) {
    return <div className="loading-spinner">Loading chats...</div>;
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h3>Messages</h3>
          </div>
          <div className="chat-list">
            {chats.length > 0 ? (
              chats.map(chat => (
                <div 
                  key={chat.id}
                  className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => setActiveChat(chat)}
                >
                  <div className="chat-avatar">
                    <img 
                      src={chat.avatar || (chat.role === 'startup' ? defaultStartupImage : defaultInvestorImage)} 
                      alt={chat.name}
                      onError={(e) => {
                        e.target.src = chat.role === 'startup' ? defaultStartupImage : defaultInvestorImage;
                      }}
                    />
                  </div>
                  <div className="chat-info">
                    <div className="chat-name">{chat.name}</div>
                    <div className="chat-preview">
                      {chat.messages.length > 0 
                        ? chat.messages[chat.messages.length - 1].text.substring(0, 30) + (chat.messages[chat.messages.length - 1].text.length > 30 ? '...' : '')
                        : 'No messages yet'}
                    </div>
                  </div>
                  <div className="chat-meta">
                    {chat.messages.length > 0 && (
                      <div className="chat-time">
                        {formatTime(chat.messages[chat.messages.length - 1].timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-chats">No conversations yet</p>
            )}
          </div>
        </div>
        
        <div className="chat-main">
          {activeChat ? (
            <>
              <div className="chat-header">
                <div className="chat-contact">
                  <div className="chat-avatar">
                    <img 
                      src={activeChat.avatar || (activeChat.role === 'startup' ? defaultStartupImage : defaultInvestorImage)} 
                      alt={activeChat.name}
                      onError={(e) => {
                        e.target.src = activeChat.role === 'startup' ? defaultStartupImage : defaultInvestorImage;
                      }}
                    />
                  </div>
                  <div className="chat-contact-info">
                    <div className="chat-contact-name">{activeChat.name}</div>
                    <div className="chat-contact-status">
                      <span className="status-indicator online"></span>
                      Online
                    </div>
                  </div>
                </div>
                <div className="chat-actions">
                  <button className="chat-action-btn">
                    <i className="fas fa-phone"></i>
                  </button>
                  <button className="chat-action-btn">
                    <i className="fas fa-video"></i>
                  </button>
                  <button className="chat-action-btn">
                    <i className="fas fa-info-circle"></i>
                  </button>
                </div>
              </div>
              
              <div className="chat-messages">
                {activeChat.messages.map((msg, index) => {
                  const isFirstOfDay = index === 0 || 
                    new Date(msg.timestamp).toDateString() !== 
                    new Date(activeChat.messages[index - 1].timestamp).toDateString();
                  
                  return (
                    <React.Fragment key={msg.id}>
                      {isFirstOfDay && (
                        <div className="date-divider">
                          <span>{formatDate(msg.timestamp)}</span>
                        </div>
                      )}
                      <div className={`message ${msg.sender === user?.role ? 'outgoing' : 'incoming'}`}>
                        <div className="message-content">
                          <p>{msg.text}</p>
                          <span className="message-time">{formatTime(msg.timestamp)}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="chat-input">
                <div className="attach-menu-container">
                  {showAttachMenu && (
                    <div className="attach-menu">
                      <button onClick={() => handleAttachment('document')} className="attach-option">
                        <i className="fas fa-file-alt"></i>
                        <span>Document</span>
                      </button>
                      <button onClick={() => handleAttachment('image')} className="attach-option">
                        <i className="fas fa-image"></i>
                        <span>Image</span>
                      </button>
                      <button onClick={() => handleAttachment('presentation')} className="attach-option">
                        <i className="fas fa-file-powerpoint"></i>
                        <span>Presentation</span>
                      </button>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSendMessage} className="message-form">
                  <button 
                    type="button" 
                    className="attach-btn"
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                  >
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button type="submit" className="send-btn" disabled={!message.trim()}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-content">
                <i className="fas fa-comments fa-3x"></i>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
