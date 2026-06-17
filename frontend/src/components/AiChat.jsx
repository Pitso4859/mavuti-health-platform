import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconSparkles, IconX, IconSend, IconAlertCircle } from './Icons';
import { aiApi } from '../api/services';

// ── Welcome message ────────────────────────────────────────────────────────
const WELCOME = {
  role: 'assistant',
  content: `👋 Hi! I'm the **Mavuti Health Assistant** — powered by AI, built for VUT students and staff.\n\nI can help with:\n- 🏥 Clinic services & how to book\n- 💊 General health & wellness tips\n- 🧠 Student mental health support\n- 🚨 Emergency contacts & guidance\n\n*I provide general health information only. For emergencies, call (016) 950-9111.*\n\nWhat can I help you with today?`,
};

export default function AiChat() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  if (!isAuthenticated) return null;

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setError(null);

    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Build history (exclude welcome message, keep last 10 turns)
      const history = updatedMessages
          .filter(m => m !== WELCOME)
          .slice(-10)
          .map(m => ({ role: m.role, content: m.content }));

      // Call Spring AI backend
      const res = await aiApi.chat(text, history);
      const data = res.data;

      if (data.success && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.error
          || err.response?.data?.message
          || 'Network error. Please check your connection.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    setError(null);
  };

  return (
      <>
        {/* Floating Action Button */}
        <button
            className="ai-chat-fab"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close health assistant' : 'Open health assistant'}
            title="AI Health Assistant"
        >
          {open ? <IconX size={24} /> : <IconSparkles size={24} />}
          {!open && <span className="fab-badge">AI</span>}
        </button>

        {/* Chat panel */}
        {open && (
            <div className="ai-chat-panel" role="dialog" aria-label="AI Health Assistant">

              {/* Header */}
              <div className="ai-chat-header">
                <span className="ai-online-dot" aria-hidden="true" />
                <div style={{ flex: 1 }}>
                  <h4>Mavuti Health Assistant</h4>
                  <p>VUT Clinic · Powered by Spring AI</p>
                </div>
                <button
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px', fontSize: '11px' }}
                    onClick={clearChat}
                    title="Clear conversation"
                >
                  Clear
                </button>
                <button
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px', marginLeft: '4px' }}
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                >
                  <IconX size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="ai-messages" aria-live="polite" aria-label="Conversation">
                {messages.map((msg, i) => (
                    <div key={i} className={`ai-bubble ${msg.role === 'assistant' ? 'bot' : 'user'}`}>
                      <SimpleMarkdown text={msg.content} />
                    </div>
                ))}

                {loading && (
                    <div className="ai-bubble bot">
                      <div className="ai-typing" aria-label="Assistant is typing">
                        <span /><span /><span />
                      </div>
                    </div>
                )}

                {error && (
                    <div className="alert alert-error" style={{ margin: '4px 0', fontSize: '12px' }}>
                      <IconAlertCircle size={14} />
                      {error}
                    </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Disclaimer */}
              <div className="ai-disclaimer">
                ⚕️ Not a substitute for professional medical advice · Emergency: (016) 950-9111
              </div>

              {/* Input */}
              <div className="ai-input-row">
                <input
                    ref={inputRef}
                    className="ai-input"
                    type="text"
                    placeholder="Ask a health question…"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    disabled={loading}
                    maxLength={500}
                    aria-label="Your message"
                />
                <button
                    className="ai-send-btn"
                    onClick={send}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                >
                  <IconSend size={16} />
                </button>
              </div>
            </div>
        )}
      </>
  );
}

// ── Markdown renderer ──────────────────────────────────────────────────────
function SimpleMarkdown({ text }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
      <div>
        {lines.map((line, i) => {
          if (line.startsWith('- ') || line.startsWith('• ')) {
            return (
                <div key={i} style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                  <span>·</span>
                  <span dangerouslySetInnerHTML={{ __html: fmt(line.slice(2)) }} />
                </div>
            );
          }
          if (line.trim() === '') return <br key={i} />;
          return <p key={i} style={{ margin: '2px 0' }} dangerouslySetInnerHTML={{ __html: fmt(line) }} />;
        })}
      </div>
  );
}

function fmt(t) {
  return t
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code style="background:rgba(0,0,0,0.08);padding:1px 4px;border-radius:3px;font-size:0.9em">$1</code>');
}