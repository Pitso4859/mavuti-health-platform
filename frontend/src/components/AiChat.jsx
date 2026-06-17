import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconSparkles, IconX, IconSend, IconAlertCircle } from './Icons';

const VUT_SYSTEM_PROMPT = `You are the Mavuti Health Assistant, a friendly and knowledgeable AI health assistant for students and staff at Vaal University of Technology (VUT) Clinic in Vanderbijlpark, South Africa.

Your role:
- Answer general health and wellness questions relevant to VUT students and staff
- Explain VUT clinic services: General Consultation, Health Screening, Family Planning, Mental Health Support, Chronic Disease Management, Emergency Care
- Guide users on how to book appointments at the Mavuti Health Clinic
- Provide wellness tips relevant to student life (stress, sleep, nutrition, sexual health, mental health)
- Offer first aid guidance for minor issues

VUT Clinic contact information:
- Clinic hours: Monday–Friday, 8:00 AM – 4:30 PM
- Emergency: (016) 950-9111
- After-hours emergency: (016) 950-9595
- Urgent care during clinic hours: (016) 950-9000
- Location: VUT Main Campus, Vanderbijlpark

Booking appointments:
- Students can book online via the Appointment page on this platform
- Select a service, choose a preferred date, pick an available time slot, and click Confirm Booking
- Book at least 24 hours in advance
- Arrive 10 minutes early with your student/staff ID and medical aid card
- Cancel at least 6 hours before to avoid fees

Rules:
- NEVER diagnose conditions or prescribe medication
- For emergencies, ALWAYS direct users to call (016) 950-9111 immediately
- For mental health crises, direct users to the clinic's mental health support service
- Keep responses concise, warm, and appropriate for young South African university students
- If asked about something outside health/wellness/clinic topics, politely redirect to health topics
- Respond in English by default; if a student writes in Sesotho or Zulu, reply in that language if you can
- You are NOT powered by Gemini — you are the Mavuti Health Assistant`;

const WELCOME = {
  role: 'assistant',
  content: `👋 Hi! I'm the **Mavuti Health Assistant** — here to help VUT students and staff with health questions and clinic guidance.\n\nI can help with:\n- General health & wellness advice\n- Understanding VUT clinic services\n- How to book an appointment\n- Student mental health & stress tips\n\n*I provide general health information only. For emergencies, call (016) 950-9111.*\n\nWhat can I help you with today?`,
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
      // Build conversation history (exclude welcome, max 10 turns)
      const history = updatedMessages
          .filter(m => m !== WELCOME)
          .slice(-10)
          .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: VUT_SYSTEM_PROMPT,
          messages: history,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Request failed (${response.status})`);
      }

      const data = await response.json();
      const reply = data?.content?.[0]?.text;

      if (reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } else {
        throw new Error('Empty response from assistant.');
      }
    } catch (err) {
      setError(
          err.message?.includes('fetch')
              ? 'Network error. Please check your connection.'
              : err.message || 'Something went wrong. Please try again.'
      );
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
                  <p>VUT Clinic · Health topics only</p>
                </div>
                <button
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px', fontSize: '11px' }}
                    onClick={clearChat}
                    aria-label="Clear chat"
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