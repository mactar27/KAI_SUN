import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: "Bonjour ! Je suis l'assistant de KAÏA SUNGLASSES. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'model', content: data.text }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'model', content: "Désolé, je rencontre des difficultés techniques actuellement. Veuillez réessayer plus tard." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--kaia-green)',
          color: 'var(--kaia-gold)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 1000,
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '350px',
          height: '500px',
          maxHeight: '80vh',
          background: '#fff',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--kaia-green)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'var(--kaia-gold)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50' }}></div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '18px' }}>Assistant Kaïa</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--kaia-gold)', cursor: 'pointer', display: 'flex', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            background: 'var(--kaia-cream)'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.role === 'user' ? 'var(--kaia-gold)' : '#fff',
                color: msg.role === 'user' ? 'var(--kaia-green)' : 'var(--ink)',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                fontSize: '14px',
                lineHeight: 1.5,
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                background: '#fff',
                padding: '12px 16px',
                borderRadius: '16px 16px 16px 4px',
                fontSize: '14px',
                display: 'flex',
                gap: '4px'
              }}>
                <span className="typing-dot" style={{ animationDelay: '0s' }}>.</span>
                <span className="typing-dot" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="typing-dot" style={{ animationDelay: '0.4s' }}>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={{
            padding: '16px',
            background: '#fff',
            display: 'flex',
            gap: '12px',
            borderTop: '1px solid rgba(0,0,0,0.05)'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '100px',
                border: '1px solid rgba(0,0,0,0.1)',
                background: 'var(--kaia-cream)',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: 'var(--kaia-green)',
                color: 'var(--kaia-gold)',
                border: 'none',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.5 : 1
              }}
            >
              <Send size={18} style={{ marginLeft: '2px' }} />
            </button>
          </form>
        </div>
      )}
      <style>{`
        @keyframes typing {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
        .typing-dot {
          display: inline-block;
          animation: typing 1.4s infinite ease-in-out;
          font-weight: bold;
          font-size: 18px;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
