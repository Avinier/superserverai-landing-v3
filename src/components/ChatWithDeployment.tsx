import { useEffect, useRef, useState, useCallback } from 'react';
import { Brain, CheckCircle2 } from 'lucide-react';
import 'devicon/devicon.min.css';

interface Deployment {
  name: string;
  branch: string;
  status: 'created' | 'pending';
  url: string;
  techType: 'frontend' | 'backend';
  techName: string;
}

interface ToolConnection {
  tool: 'sentry' | 'datadog' | 'github';
  status: 'connecting' | 'connected';
}

interface ContentBlock {
  type: 'text' | 'heading' | 'list' | 'bulletList' | 'toolConnection' | 'errorLog' | 'metrics' | 'codeAction';
  text?: string;
  items?: string[];
  tool?: ToolConnection;
  errors?: { level: 'error' | 'warning'; message: string; time: string; count?: number }[];
  metrics?: { name: string; value: string; change: string; trend: 'up' | 'down' | 'stable' }[];
  actions?: { status: 'done' | 'pending'; text: string }[];
}

interface ChatMessage {
  type: 'user' | 'ssai';
  message: string;
  hasThinking?: boolean;
  content?: ContentBlock[];
}

// Animation phases
type AnimationPhase =
  | 'idle'
  | 'typing-1' | 'sending-1' | 'thinking-1' | 'streaming-1' | 'pause-1'
  | 'typing-2' | 'sending-2' | 'thinking-2' | 'streaming-2' | 'pause-2'
  | 'typing-3' | 'sending-3' | 'thinking-3' | 'streaming-3' | 'pause-3'
  | 'typing-4' | 'sending-4' | 'thinking-4' | 'streaming-4'
  | 'complete';

// Tool Icons
const SentryIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 72 66" fill="currentColor">
    <path d="M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z"/>
  </svg>
);

const DatadogIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 800 856" fill="currentColor">
    <path d="M670.38 608.27l-71.24-46.99-59.43 99.27-69.12-20.21-60.86-92.89-88.26 31.79-19.29-94.7-100.07-34.11 38.73-71.86-31.62-60.08 80.28-37.5 8.93-103.3 95.95 47.05 74.74-64.9 62.92 58.71 97.46-20.12 22.69 86.09 82.59 19.87-8.38 102.94 78.97 56.23-54.37 71.89 19.37 72.82zm-135.81-381.93l-53.08 46.18-62.33-30.6-6.56 75.89-58.99 27.55 23.22 44.14-28.42 52.79 73.5 25.06 14.17 69.54 64.83-23.36 44.72 68.27 43.62-72.91 52.28 15.29 4.34-73.58 50.21-12.08-16.67-63.25-71.55-14.76-14.09-53.5-59.2 12.22z"/>
  </svg>
);

const GitHubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// Deployment Card Component
const DeploymentCard = ({ deployment, isVisible }: { deployment: Deployment; isVisible: boolean }) => {
  const TechIcon = deployment.techType === 'frontend' ? (
    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );

  const BackgroundLogo = deployment.techType === 'frontend' ? (
    <svg className="w-24 h-24 text-cyan-200/40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9-.82-.08-1.63-.2-2.4-.36-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68 0 1.69-1.83 2.93-4.37 3.68.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68 0-1.69 1.83-2.93 4.37-3.68-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96.77-.16 1.58-.28 2.4-.36.48-.67.99-1.31 1.51-1.9z"/>
    </svg>
  ) : (
    <svg className="w-24 h-24 text-rose-200/40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.37v6.71l6-3.38z"/>
    </svg>
  );

  return (
    <div
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 min-w-[280px] flex-1 max-w-[340px]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease'
      }}
    >
      <div className="absolute -bottom-4 -right-4 pointer-events-none opacity-60">
        {BackgroundLogo}
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-800">{deployment.name}</span>
          <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z"/>
          </svg>
          <span className="text-sm text-primary">{deployment.branch}</span>
        </div>
        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600 border border-green-200">
          {deployment.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="text-sm text-gray-500">URL</span>
        <span className="text-sm text-primary">{deployment.url}</span>
      </div>

      <div className="text-sm text-gray-500 mb-2">Technologies</div>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-50/50 border border-cyan-100">
        {TechIcon}
        <span className="text-sm text-gray-600">
          <span className="font-medium">{deployment.techType}:</span> {deployment.techName}
        </span>
      </div>
    </div>
  );
};

// SuperServerAI Logo
const SuperServerAILogo = () => (
  <img
    src="/logo-icon.png"
    alt="SuperServerAI"
    className="w-7 h-7 object-contain"
  />
);

// Thinking dots animation
const ThinkingDots = () => (
  <span className="inline-flex gap-1 ml-1">
    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </span>
);

// Blinking cursor
const BlinkingCursor = () => (
  <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5" />
);

// Tool Connection Component
const ToolConnectionBlock = ({ tool, isConnected }: { tool: 'sentry' | 'datadog' | 'github'; isConnected: boolean }) => {
  const toolNames = {
    sentry: 'Sentry',
    datadog: 'Datadog',
    github: 'GitHub',
  };

  const toolIcons = {
    sentry: <SentryIcon className="w-5 h-5" />,
    datadog: <DatadogIcon className="w-5 h-5" />,
    github: <GitHubIcon className="w-5 h-5" />,
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 my-2">
      <span className="text-primary">{toolIcons[tool]}</span>
      <span className="text-sm font-medium text-gray-700">{toolNames[tool]}</span>
      {isConnected ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <span className="text-xs text-primary/70">connecting...</span>
        </span>
      )}
    </div>
  );
};

// Error Log Component
const ErrorLogBlock = ({ errors }: { errors: ContentBlock['errors'] }) => (
  <div className="my-3 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
    <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
      <SentryIcon className="w-4 h-4 text-[#362D59]" />
      <span className="text-xs font-medium text-gray-600">Recent Errors</span>
    </div>
    <div className="divide-y divide-gray-100">
      {errors?.map((error, i) => (
        <div key={i} className="px-3 py-2 flex items-start gap-2 hover:bg-white transition-colors">
          <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${error.level === 'error' ? 'bg-red-500' : 'bg-amber-500'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-800 font-mono truncate">{error.message}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-400">{error.time}</span>
              {error.count && <span className="text-[10px] text-gray-400">• {error.count} events</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Metrics Component
const MetricsBlock = ({ metrics }: { metrics: ContentBlock['metrics'] }) => (
  <div className="my-3 grid grid-cols-2 gap-2">
    {metrics?.map((metric, i) => (
      <div key={i} className="rounded-lg border border-gray-200 bg-white p-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">{metric.name}</div>
        <div className="flex items-end gap-2">
          <span className="text-lg font-semibold text-gray-800">{metric.value}</span>
          <span className={`text-xs font-medium ${
            metric.trend === 'up' ? 'text-green-500' : metric.trend === 'down' ? 'text-red-500' : 'text-gray-400'
          }`}>
            {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'} {metric.change}
          </span>
        </div>
      </div>
    ))}
  </div>
);

// Code Action Component
const CodeActionBlock = ({ actions }: { actions: ContentBlock['actions'] }) => (
  <div className="my-3 rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
    <div className="px-3 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
      <GitHubIcon className="w-4 h-4 text-gray-700" />
      <span className="text-xs font-medium text-gray-600">Fixes Applied</span>
    </div>
    <div className="p-3 space-y-2">
      {actions?.map((action, i) => (
        <div key={i} className="flex items-start gap-2">
          {action.status === 'done' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          ) : (
            <span className="w-4 h-4 rounded-full border-2 border-gray-300 mt-0.5 flex-shrink-0" />
          )}
          <span className="text-sm text-gray-700">{action.text}</span>
        </div>
      ))}
    </div>
  </div>
);

const ChatWithDeployment = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [typingText, setTypingText] = useState('');
  const [streamedContent, setStreamedContent] = useState<{blocks: number; chars: number}>({ blocks: 0, chars: 0 });
  const [toolConnected, setToolConnected] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deployments: Deployment[] = [
    {
      name: 'heimdall-12',
      branch: 'main',
      status: 'created',
      url: 'http://192.168.1.74:42407',
      techType: 'frontend',
      techName: 'react',
    },
    {
      name: 'react_native_...',
      branch: 'main',
      status: 'created',
      url: 'http://192.168.1.74:37089',
      techType: 'backend',
      techName: 'laravel',
    },
  ];

  // Exchange 1: What is this
  const userMessage1 = 'what is this';
  const aiContent1: ContentBlock[] = [
    { type: 'text', text: 'This is heimdall-12 - a React + Laravel stack with MySQL. Frontend on :42407, backend API on :37089.' },
    { type: 'bulletList', items: [
      'All containers healthy',
      '3 connected services: Sentry, Datadog, GitHub',
    ]},
  ];

  // Exchange 2: Sentry errors
  const userMessage2 = 'show me recent sentry errors';
  const aiContent2: ContentBlock[] = [
    { type: 'toolConnection', tool: { tool: 'sentry', status: 'connecting' } },
    { type: 'text', text: 'Found 3 unresolved errors in the last 24 hours:' },
    { type: 'errorLog', errors: [
      { level: 'error', message: 'TypeError: Cannot read property \'map\' of undefined', time: '2 min ago', count: 23 },
      { level: 'error', message: 'NetworkError: Failed to fetch /api/users', time: '15 min ago', count: 8 },
      { level: 'warning', message: 'Warning: Each child should have a unique "key" prop', time: '1 hr ago', count: 156 },
    ]},
  ];

  // Exchange 3: Datadog metrics
  const userMessage3 = 'what about datadog metrics?';
  const aiContent3: ContentBlock[] = [
    { type: 'toolConnection', tool: { tool: 'datadog', status: 'connecting' } },
    { type: 'text', text: 'Current performance metrics for heimdall-12:' },
    { type: 'metrics', metrics: [
      { name: 'Response Time', value: '142ms', change: '12%', trend: 'down' },
      { name: 'Error Rate', value: '0.8%', change: '0.3%', trend: 'up' },
      { name: 'Throughput', value: '1.2k/s', change: '8%', trend: 'up' },
      { name: 'CPU Usage', value: '34%', change: '2%', trend: 'stable' },
    ]},
  ];

  // Exchange 4: Fix errors
  const userMessage4 = 'fix the sentry errors';
  const aiContent4: ContentBlock[] = [
    { type: 'toolConnection', tool: { tool: 'github', status: 'connecting' } },
    { type: 'text', text: 'Analyzing errors and applying fixes to heimdall-12:' },
    { type: 'codeAction', actions: [
      { status: 'done', text: 'Added null check in UserList.tsx:47' },
      { status: 'done', text: 'Added error boundary for /api/users fetch' },
      { status: 'done', text: 'Added unique keys to mapped components' },
    ]},
    { type: 'text', text: 'Created PR #142 with fixes. All 3 errors resolved.' },
  ];

  const chatMessages: ChatMessage[] = [
    { type: 'user', message: userMessage1 },
    { type: 'ssai', message: '', hasThinking: true, content: aiContent1 },
    { type: 'user', message: userMessage2 },
    { type: 'ssai', message: '', hasThinking: true, content: aiContent2 },
    { type: 'user', message: userMessage3 },
    { type: 'ssai', message: '', hasThinking: true, content: aiContent3 },
    { type: 'user', message: userMessage4 },
    { type: 'ssai', message: '', hasThinking: true, content: aiContent4 },
  ];

  // Get total characters for a content array
  const getTotalChars = useCallback((content: ContentBlock[]) => {
    let total = 0;
    content.forEach(block => {
      if (block.type === 'toolConnection') total += 20;
      else if (block.type === 'errorLog') total += 50;
      else if (block.type === 'metrics') total += 40;
      else if (block.type === 'codeAction') total += 45;
      else if (block.text) total += block.text.length;
      if (block.items) block.items.forEach(item => total += item.length);
    });
    return total;
  }, []);

  // Auto-scroll to bottom when content changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [phase, streamedContent]);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
          setTimeout(() => setPhase('typing-1'), 800);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [inView]);

  // Main animation controller
  useEffect(() => {
    if (!inView || phase === 'idle') return;

    const clearTimer = () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };

    clearTimer();

    const createTypingPhase = (message: string, nextPhase: AnimationPhase, speed = 45) => {
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex <= message.length) {
          setTypingText(message.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          animationRef.current = setTimeout(() => setPhase(nextPhase), 150);
        }
      }, speed);
      return () => clearInterval(typeInterval);
    };

    const createStreamingPhase = (content: ContentBlock[], nextPhase: AnimationPhase, hasToolConnection = false) => {
      const totalChars = getTotalChars(content);
      let currentChar = 0;

      // If there's a tool connection, show connecting first
      if (hasToolConnection) {
        setToolConnected(false);
        setTimeout(() => setToolConnected(true), 600);
      }

      const streamInterval = setInterval(() => {
        currentChar += 6;
        if (currentChar >= totalChars) {
          clearInterval(streamInterval);
          setStreamedContent({ blocks: content.length, chars: 999999 });
          animationRef.current = setTimeout(() => setPhase(nextPhase), 600);
        } else {
          let charCount = 0;
          let blockIndex = 0;
          for (let i = 0; i < content.length; i++) {
            const block = content[i];
            let blockChars = 0;
            if (block.type === 'toolConnection') blockChars = 20;
            else if (block.type === 'errorLog') blockChars = 50;
            else if (block.type === 'metrics') blockChars = 40;
            else if (block.text) blockChars += block.text.length;
            if (block.items) block.items.forEach(item => blockChars += item.length);
            if (charCount + blockChars > currentChar) {
              blockIndex = i;
              break;
            }
            charCount += blockChars;
            blockIndex = i + 1;
          }
          setStreamedContent({ blocks: blockIndex, chars: currentChar - charCount });
        }
      }, 12);
      return () => clearInterval(streamInterval);
    };

    switch (phase) {
      case 'typing-1': return createTypingPhase(userMessage1, 'sending-1');
      case 'sending-1':
        setTypingText('');
        animationRef.current = setTimeout(() => setPhase('thinking-1'), 80);
        break;
      case 'thinking-1':
        animationRef.current = setTimeout(() => {
          setStreamedContent({ blocks: 0, chars: 0 });
          setPhase('streaming-1');
        }, 600);
        break;
      case 'streaming-1': return createStreamingPhase(aiContent1, 'pause-1');
      case 'pause-1':
        animationRef.current = setTimeout(() => setPhase('typing-2'), 500);
        break;

      case 'typing-2': return createTypingPhase(userMessage2, 'sending-2', 35);
      case 'sending-2':
        setTypingText('');
        animationRef.current = setTimeout(() => setPhase('thinking-2'), 80);
        break;
      case 'thinking-2':
        animationRef.current = setTimeout(() => {
          setStreamedContent({ blocks: 0, chars: 0 });
          setToolConnected(false);
          setPhase('streaming-2');
        }, 700);
        break;
      case 'streaming-2': return createStreamingPhase(aiContent2, 'pause-2', true);
      case 'pause-2':
        animationRef.current = setTimeout(() => setPhase('typing-3'), 500);
        break;

      case 'typing-3': return createTypingPhase(userMessage3, 'sending-3', 35);
      case 'sending-3':
        setTypingText('');
        animationRef.current = setTimeout(() => setPhase('thinking-3'), 80);
        break;
      case 'thinking-3':
        animationRef.current = setTimeout(() => {
          setStreamedContent({ blocks: 0, chars: 0 });
          setToolConnected(false);
          setPhase('streaming-3');
        }, 700);
        break;
      case 'streaming-3': return createStreamingPhase(aiContent3, 'pause-3', true);
      case 'pause-3':
        animationRef.current = setTimeout(() => setPhase('typing-4'), 500);
        break;

      case 'typing-4': return createTypingPhase(userMessage4, 'sending-4', 40);
      case 'sending-4':
        setTypingText('');
        animationRef.current = setTimeout(() => setPhase('thinking-4'), 80);
        break;
      case 'thinking-4':
        animationRef.current = setTimeout(() => {
          setStreamedContent({ blocks: 0, chars: 0 });
          setToolConnected(false);
          setPhase('streaming-4');
        }, 800);
        break;
      case 'streaming-4': return createStreamingPhase(aiContent4, 'complete', true);

      case 'complete':
        animationRef.current = setTimeout(() => {
          setTypingText('');
          setStreamedContent({ blocks: 0, chars: 0 });
          setToolConnected(false);
          setPhase('typing-1');
        }, 3000);
        break;
    }

    return clearTimer;
  }, [phase, inView, getTotalChars]);

  // Helper to determine what messages are visible
  const getVisibleMessages = () => {
    const visible: { index: number; streaming: boolean; streamProgress?: typeof streamedContent }[] = [];
    const laterPhases = ['sending-1', 'thinking-1', 'streaming-1', 'pause-1', 'typing-2', 'sending-2', 'thinking-2', 'streaming-2', 'pause-2', 'typing-3', 'sending-3', 'thinking-3', 'streaming-3', 'pause-3', 'typing-4', 'sending-4', 'thinking-4', 'streaming-4', 'complete'];

    if (laterPhases.includes(phase)) {
      visible.push({ index: 0, streaming: false });
    }
    if (laterPhases.slice(2).includes(phase)) {
      visible.push({ index: 1, streaming: phase === 'streaming-1', streamProgress: phase === 'streaming-1' ? streamedContent : undefined });
    }
    if (laterPhases.slice(5).includes(phase)) {
      visible.push({ index: 2, streaming: false });
    }
    if (laterPhases.slice(7).includes(phase)) {
      visible.push({ index: 3, streaming: phase === 'streaming-2', streamProgress: phase === 'streaming-2' ? streamedContent : undefined });
    }
    if (laterPhases.slice(10).includes(phase)) {
      visible.push({ index: 4, streaming: false });
    }
    if (laterPhases.slice(12).includes(phase)) {
      visible.push({ index: 5, streaming: phase === 'streaming-3', streamProgress: phase === 'streaming-3' ? streamedContent : undefined });
    }
    if (laterPhases.slice(15).includes(phase)) {
      visible.push({ index: 6, streaming: false });
    }
    if (laterPhases.slice(17).includes(phase)) {
      visible.push({ index: 7, streaming: phase === 'streaming-4', streamProgress: phase === 'streaming-4' ? streamedContent : undefined });
    }

    return visible;
  };

  // Render streamed content
  const renderStreamedContent = (content: ContentBlock[], streamProgress?: typeof streamedContent, isComplete?: boolean) => {
    if (!content) return null;

    if (isComplete || !streamProgress) {
      return content.map((block, idx) => renderBlock(block, idx, true, 999999));
    }

    return content.map((block, idx) => {
      if (idx < streamProgress.blocks) {
        return renderBlock(block, idx, true, 999999);
      } else if (idx === streamProgress.blocks) {
        return renderBlock(block, idx, false, streamProgress.chars);
      }
      return null;
    });
  };

  const renderBlock = (block: ContentBlock, idx: number, complete: boolean, charLimit: number) => {
    switch (block.type) {
      case 'toolConnection':
        if (!complete && charLimit < 10) return null;
        return (
          <ToolConnectionBlock
            key={idx}
            tool={block.tool!.tool}
            isConnected={complete || toolConnected}
          />
        );
      case 'errorLog':
        if (!complete && charLimit < 30) return null;
        return <ErrorLogBlock key={idx} errors={block.errors} />;
      case 'metrics':
        if (!complete && charLimit < 20) return null;
        return <MetricsBlock key={idx} metrics={block.metrics} />;
      case 'codeAction':
        if (!complete && charLimit < 25) return null;
        return <CodeActionBlock key={idx} actions={block.actions} />;
      case 'heading':
        if (!complete && charLimit <= 0) return null;
        return (
          <h4 key={idx} className="text-base font-bold text-gray-900 mt-5 mb-2">
            {complete ? block.text : block.text?.slice(0, charLimit)}
            {!complete && <BlinkingCursor />}
          </h4>
        );
      case 'list': {
        if (!complete && charLimit <= 0) return null;
        let remaining = charLimit;
        return (
          <ol key={idx} className="space-y-1 ml-4">
            {block.items?.map((item, i) => {
              if (!complete && remaining <= 0) return null;
              const text = complete ? item : item.slice(0, remaining);
              remaining -= item.length;
              return (
                <li key={i} className="text-sm text-gray-700 leading-relaxed flex">
                  <span className="mr-2 text-gray-700">{i + 1}.</span>
                  <span>{text}{!complete && remaining <= 0 && remaining + item.length > 0 && <BlinkingCursor />}</span>
                </li>
              );
            })}
          </ol>
        );
      }
      case 'bulletList': {
        if (!complete && charLimit <= 0) return null;
        let remaining = charLimit;
        return (
          <ul key={idx} className="space-y-1 ml-4">
            {block.items?.map((item, i) => {
              if (!complete && remaining <= 0) return null;
              const text = complete ? item : item.slice(0, remaining);
              remaining -= item.length;
              return (
                <li key={i} className="text-sm text-gray-700 leading-relaxed flex">
                  <span className="mr-2 text-gray-700">•</span>
                  <span>{text}{!complete && remaining <= 0 && remaining + item.length > 0 && <BlinkingCursor />}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      default:
        if (!complete && charLimit <= 0) return null;
        return (
          <p key={idx} className="text-sm text-gray-700 leading-relaxed">
            {complete ? block.text : block.text?.slice(0, charLimit)}
            {!complete && <BlinkingCursor />}
          </p>
        );
    }
  };

  const visibleMessages = getVisibleMessages();
  const isTyping = phase.startsWith('typing-');
  const isThinking = phase.startsWith('thinking-');

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-text mb-4">
            Every deployment is a conversation
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Query Sentry, pull Datadog metrics, push fixes to GitHub — all from one chat.
            <span className="text-text"> Ask, observe, act.</span>
          </p>
        </div>

        {/* Chat Interface Card */}
        <div
          className="relative max-w-4xl mx-auto"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          <div className="absolute -inset-2 rounded-lg bg-gradient-to-br from-primary/50 via-transparent to-secondary/40 blur-lg" />
          <div className="absolute -inset-5 rounded-xl bg-gradient-to-br from-primary/35 via-transparent to-secondary/25 blur-3xl" />

          <div
            ref={sectionRef}
            className="relative rounded-lg border border-border/60 bg-white overflow-hidden shadow-lg"
          >
            {/* Deployment Cards */}
            <div className="p-6 bg-gray-50/50">
              <div className="flex gap-4 justify-center flex-wrap">
                {deployments.map((deployment) => (
                  <DeploymentCard
                    key={deployment.name}
                    deployment={deployment}
                    isVisible={inView}
                  />
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div
              ref={chatContainerRef}
              className="px-6 py-8 space-y-6 h-[400px] overflow-y-auto bg-white scroll-smooth"
            >
              {visibleMessages.map(({ index, streaming, streamProgress }) => {
                const msg = chatMessages[index];
                return (
                  <div
                    key={index}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    style={{ animation: 'fadeSlideIn 0.3s ease-out' }}
                  >
                    {msg.type === 'user' ? (
                      <div className="max-w-xs">
                        <div className="rounded-xl rounded-br-sm bg-white border border-gray-200 px-4 py-2.5">
                          <p className="text-sm text-gray-800">{msg.message}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <SuperServerAILogo />
                          <span className="text-lg text-gray-400 font-medium">SuperServerAI</span>
                        </div>

                        {msg.hasThinking && (
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5">
                              <Brain className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">
                                {streaming ? 'Generating response' : 'Thinking complete'}
                              </span>
                              {streaming && <ThinkingDots />}
                            </div>
                            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        )}

                        <div className="pl-1">
                          {msg.content && renderStreamedContent(msg.content, streamProgress, !streaming)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex justify-start" style={{ animation: 'fadeSlideIn 0.3s ease-out' }}>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <SuperServerAILogo />
                      <span className="text-lg text-gray-400 font-medium">SuperServerAI</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-sm text-gray-400">Thinking</span>
                      <ThinkingDots />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="px-6 pb-6 bg-white">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 transition-all duration-200"
                style={{
                  borderColor: isTyping ? '#254bf1' : undefined,
                  boxShadow: isTyping ? '0 0 0 2px rgba(37, 75, 241, 0.1)' : undefined
                }}
              >
                <input
                  type="text"
                  value={typingText}
                  placeholder="chat with deployment..."
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                  readOnly
                />
                {isTyping && <BlinkingCursor />}
                <button
                  className={`p-1.5 transition-colors ${typingText ? 'text-primary' : 'text-gray-300'}`}
                  style={{ transform: typingText ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.2s ease' }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default ChatWithDeployment;
