import { useEffect, useRef, useState } from 'react';

interface ChatMessage {
  type: 'user' | 'ssai';
  message: string;
  suggestion?: string;
  actions?: string[];
  status?: 'success';
}

const ChatWithDeployment = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  const chatMessages: ChatMessage[] = [
    {
      type: 'user',
      message: 'Why is the API response time spiking?',
    },
    {
      type: 'ssai',
      message: 'I detected a spike starting 10 mins ago. Root cause: Database connection pool exhausted.',
      suggestion: 'Suggested fix: Increase pool size from 10 to 25',
      actions: ['Apply Fix', 'View Logs', 'Ignore'],
    },
    {
      type: 'user',
      message: 'Apply the fix and scale to 3 replicas',
    },
    {
      type: 'ssai',
      message: 'Done. Pool size increased. Scaling to 3 replicas now... Complete. Response time nominal.',
      status: 'success',
    },
  ];

  // Intersection Observer for section visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Stagger message animation when section comes into view
  useEffect(() => {
    if (!inView) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Show messages one by one with delays
    chatMessages.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages(index + 1);
      }, 300 + index * 500); // Start at 300ms, then every 500ms
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [inView]);

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-text mb-4">
            Every deployment is a conversation
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Meet ssai - your infrastructure's voice. Debug, scale, and manage through natural conversation.
          </p>
        </div>

        {/* Chat Interface Card */}
        <div
          ref={sectionRef}
          className="max-w-3xl mx-auto rounded-2xl border border-border bg-surface overflow-hidden card-hover"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-elevated">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <span className="font-medium text-text">ssai</span>
                <span className="text-text-muted"> - api-service-prod</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
              </div>
              <span className="text-xs text-text-muted">Online</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="p-6 space-y-4 min-h-[300px]">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{
                  opacity: index < visibleMessages ? 1 : 0,
                  transform: index < visibleMessages
                    ? 'translateY(0)'
                    : msg.type === 'user'
                      ? 'translateX(20px)'
                      : 'translateX(-20px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease'
                }}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-4 ${
                    msg.type === 'user'
                      ? 'bg-primary/20 border border-primary/30'
                      : 'bg-surface-elevated border border-border'
                  }`}
                >
                  <p className="text-sm text-text">{msg.message}</p>

                  {msg.suggestion && (
                    <p className="text-sm text-primary mt-2">{msg.suggestion}</p>
                  )}

                  {msg.actions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {msg.actions.map((action) => (
                        <button
                          key={action}
                          className="px-3 py-1 rounded-lg bg-surface border border-border text-xs text-text-muted hover:text-text hover:border-primary/30 transition-all duration-300"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.status === 'success' && (
                    <div className="flex items-center gap-2 mt-2">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs text-green-500">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator - shown briefly while messages are loading */}
            {inView && visibleMessages < chatMessages.length && visibleMessages > 0 && chatMessages[visibleMessages]?.type === 'ssai' && (
              <div className="flex justify-start">
                <div className="rounded-xl p-4 bg-surface-elevated border border-border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border">
              <input
                type="text"
                placeholder="Ask ssai anything..."
                className="flex-1 bg-transparent text-sm text-text placeholder-text-muted outline-none"
                disabled
              />
              <button className="px-4 py-2 rounded-lg bg-primary text-text text-sm font-medium hover:bg-primary/90 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatWithDeployment;
