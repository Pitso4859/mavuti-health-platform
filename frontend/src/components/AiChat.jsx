import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../api/services';
import { IconSparkles, IconX, IconSend, IconAlertCircle } from './Icons';

const WELCOME = {
  role: 'assistant',
  content: `👋 Hello! I'm the **Mavuti Health Assistant**, powered by AI.

I can help you with:
- General health information and tips
- Understanding clinic services
- Booking appointment guidance
- Student wellness advice

*Note: I provide general health information only. For diagnoses or emergencies, please see a clinician or call (016) 950-9111.*

How can I help you today?`,
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

  // Only show for authenticated users
  if (!isAuthenticated) return null;

  // Scroll to latest message
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

    // Append user message
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build history (exclude welcome message, max 10 turns)
      const history = messages
        .filter(m => m !== WELCOME)
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }));

      const resp = await aiApi.chat(text, history);

      if (resp.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: resp.reply }]);
      } else {
        setError(resp.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Failed to reach the AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* FAB button */}
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
              <p>Powered by Google Gemini · Health topics only</p>
            </div>
            <button
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px' }}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="ai-messages" aria-live="polite" aria-label="Conversation">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`ai-bubble ${msg.role === 'assistant' ? 'bot' : 'user'}`}
              >
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

          {/* Input row */}
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

/**
 * Minimal Markdown renderer (bold, italic, bullets, line breaks).
 * Keeps the bundle small — no full markdown library needed for chat.
 */
function SimpleMarkdown({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <div key={i} style={{ display: 'flex', gap: 6, marginTop: 2 }}>
            <span>·</span>
            <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
          </div>;
        }
        if (line.trim() === '') return <br key={i} />;
        return (
          <p key={i} style={{ margin: '2px 0' }}
             dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
      })}
    </div>
  );
}

function formatInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(0,0,0,0.08);padding:1px 4px;border-radius:3px;font-size:0.9em">$1</code>');
}
