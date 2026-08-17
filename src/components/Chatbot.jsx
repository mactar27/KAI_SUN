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
        className="chatbot-btn"
        onClick={() => setIsOpen(true)}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <img src="/kaia-logo-v3.png" alt="KAÏA" style={{ height: '24px', width: 'auto', filter: 'brightness(0)', opacity: 0.85 }} />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '5px',
            fontWeight: 700,
            letterSpacing: '0.4em',
            color: 'var(--kaia-gold)',
            marginLeft: '2px'
          }}>ASSISTANT</span>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div style={{
            background: 'var(--kaia-cream)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <img src="/kaia-logo-v3.png" alt="KAÏA SUNGLASSES" style={{ height: '32px', width: 'auto', filter: 'brightness(0)' }} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '7px',
                fontWeight: 600,
                letterSpacing: '0.4em',
                color: 'var(--kaia-gold)'
              }}>ASSISTANT</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--kaia-green)', cursor: 'pointer', display: 'flex', padding: '8px', opacity: 0.6, transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '24px 20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            background: '#faf9f6'
          }}>
            {messages.map((msg, index) => (
              <div key={index} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.role === 'user' ? 'var(--kaia-green)' : '#fff',
                color: msg.role === 'user' ? '#fff' : 'var(--ink)',
                padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                fontSize: '13px',
                lineHeight: 1.6,
                boxShadow: msg.role === 'user' ? 'none' : '0 4px 12px rgba(0,0,0,0.03)',
                border: msg.role === 'user' ? 'none' : '1px solid rgba(0,0,0,0.04)'
              }}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div style={{
                alignSelf: 'flex-start',
                background: '#fff',
                padding: '14px 18px',
                borderRadius: '20px 20px 20px 4px',
                fontSize: '13px',
                display: 'flex',
                gap: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.04)'
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
            padding: '16px 20px',
            background: '#fff',
            display: 'flex',
            gap: '12px',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px'
          }}>
            <label htmlFor="chatbot_input" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Votre question</label>
            <input
              id="chatbot_input"
              name="chatbot_message"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '100px',
                border: '1px solid rgba(0,0,0,0.08)',
                background: '#faf9f6',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: "'Inter', sans-serif"
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.2)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                background: 'var(--kaia-green)',
                color: 'var(--kaia-gold)',
                border: 'none',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isLoading || !input.trim() ? 0.6 : 1,
                transition: 'opacity 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => !isLoading && input.trim() && (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => !isLoading && input.trim() && (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Send size={18} style={{ marginLeft: '2px' }} strokeWidth={2} />
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
