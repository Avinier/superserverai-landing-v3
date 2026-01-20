import { useEffect, useRef, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, GitBranch, GitCommit, Activity, Server, Database, TrendingUp, TrendingDown } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  port: string;
  status: 'healthy' | 'warning' | 'error';
  connections: number;
  icon: React.ReactNode;
}

interface ConnectedTool {
  name: 'Datadog' | 'Sentry' | 'AWS' | 'GitHub';
  icon: React.ReactNode;
  status: 'connected' | 'syncing';
  description: string;
}

type AnimationPhase =
  | 'idle'
  | 'datadog-click' | 'datadog-expand' | 'datadog-view' | 'datadog-collapse'
  | 'sentry-click' | 'sentry-expand' | 'sentry-view' | 'sentry-collapse'
  | 'aws-click' | 'aws-expand' | 'aws-view' | 'aws-collapse'
  | 'github-click' | 'github-expand' | 'github-view' | 'github-collapse'
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

const AWSIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z"/>
  </svg>
);

// Datadog Expanded View - Light mode with purple accents
const DatadogExpandedView = ({ isVisible }: { isVisible: boolean }) => (
  <div
    className="absolute inset-0 bg-white rounded-lg overflow-hidden border border-[#632CA6]/30 shadow-lg"
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      transition: 'all 0.3s ease'
    }}
  >
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <DatadogIcon className="w-5 h-5 text-[#632CA6]" />
        <span className="text-gray-800 font-semibold text-sm">Datadog APM</span>
        <span className="ml-auto px-2 py-0.5 bg-green-100 rounded text-xs text-green-700">Live</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-[#632CA6]/5 rounded p-2 border border-[#632CA6]/10">
          <div className="text-[10px] text-gray-500 uppercase">Latency P99</div>
          <div className="flex items-end gap-1">
            <span className="text-lg font-bold text-gray-800">142ms</span>
            <TrendingDown className="w-3 h-3 text-green-500 mb-1" />
          </div>
        </div>
        <div className="bg-[#632CA6]/5 rounded p-2 border border-[#632CA6]/10">
          <div className="text-[10px] text-gray-500 uppercase">Throughput</div>
          <div className="flex items-end gap-1">
            <span className="text-lg font-bold text-gray-800">1.2k/s</span>
            <TrendingUp className="w-3 h-3 text-green-500 mb-1" />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 rounded p-2 border border-gray-200">
        <div className="text-[10px] text-gray-500 uppercase mb-2">Request Rate</div>
        <div className="flex items-end gap-1 h-12">
          {[40, 65, 45, 80, 55, 70, 85, 60, 75, 90, 70, 85].map((h, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-[#632CA6] to-[#9B59B6] rounded-t" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <Activity className="w-3 h-3 text-[#632CA6]" />
        <span>4 services monitored</span>
      </div>
    </div>
  </div>
);

// Sentry Expanded View - Light mode with purple/red accents
const SentryExpandedView = ({ isVisible }: { isVisible: boolean }) => (
  <div
    className="absolute inset-0 bg-white rounded-lg overflow-hidden border border-[#362D59]/30 shadow-lg"
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      transition: 'all 0.3s ease'
    }}
  >
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <SentryIcon className="w-5 h-5 text-[#362D59]" />
        <span className="text-gray-800 font-semibold text-sm">Sentry Issues</span>
        <span className="ml-auto px-2 py-0.5 bg-red-100 rounded text-xs text-red-700">3 new</span>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="bg-red-50 rounded p-2 border-l-2 border-red-500">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-800 font-mono truncate">TypeError: Cannot read 'map'</p>
              <p className="text-[10px] text-gray-500">UserList.tsx • 23 events</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 rounded p-2 border-l-2 border-red-500">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-800 font-mono truncate">NetworkError: Failed to fetch</p>
              <p className="text-[10px] text-gray-500">api.service.ts • 8 events</p>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 rounded p-2 border-l-2 border-amber-500">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-gray-800 font-mono truncate">Warning: Missing key prop</p>
              <p className="text-[10px] text-gray-500">Dashboard.tsx • 156 events</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>Last 24 hours</span>
        <span className="text-red-600 font-medium">187 total events</span>
      </div>
    </div>
  </div>
);

// AWS Expanded View - Light mode with orange accents
const AWSExpandedView = ({ isVisible }: { isVisible: boolean }) => (
  <div
    className="absolute inset-0 bg-white rounded-lg overflow-hidden border border-[#FF9900]/30 shadow-lg"
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      transition: 'all 0.3s ease'
    }}
  >
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <AWSIcon className="w-5 h-5 text-[#FF9900]" />
        <span className="text-gray-800 font-semibold text-sm">AWS Console</span>
        <span className="ml-auto px-2 py-0.5 bg-orange-100 rounded text-xs text-orange-700">us-east-1</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-orange-50 rounded p-2 text-center border border-orange-200">
          <Server className="w-4 h-4 text-[#FF9900] mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-800">3</div>
          <div className="text-[9px] text-gray-500">EC2</div>
        </div>
        <div className="bg-orange-50 rounded p-2 text-center border border-orange-200">
          <Database className="w-4 h-4 text-[#FF9900] mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-800">2</div>
          <div className="text-[9px] text-gray-500">RDS</div>
        </div>
        <div className="bg-orange-50 rounded p-2 text-center border border-orange-200">
          <Activity className="w-4 h-4 text-[#FF9900] mx-auto mb-1" />
          <div className="text-lg font-bold text-gray-800">1</div>
          <div className="text-[9px] text-gray-500">ELB</div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 rounded p-2 border border-gray-200">
        <div className="text-[10px] text-gray-500 uppercase mb-2">Resources</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-gray-700">api-server-prod</span>
            <span className="ml-auto text-gray-400">t3.medium</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-gray-700">worker-prod</span>
            <span className="ml-auto text-gray-400">t3.small</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-gray-700">postgres-primary</span>
            <span className="ml-auto text-gray-400">db.t3.medium</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
        <CheckCircle2 className="w-3 h-3" />
        <span>All resources healthy</span>
      </div>
    </div>
  </div>
);

// GitHub Expanded View - Light mode with gray accents
const GitHubExpandedView = ({ isVisible }: { isVisible: boolean }) => (
  <div
    className="absolute inset-0 bg-white rounded-lg overflow-hidden border border-gray-300 shadow-lg"
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      transition: 'all 0.3s ease'
    }}
  >
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <GitHubIcon className="w-5 h-5 text-gray-800" />
        <span className="text-gray-800 font-semibold text-sm">heimdall-12</span>
        <span className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded text-xs text-green-700">
          <GitBranch className="w-3 h-3" />
          main
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <GitCommit className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 font-mono">a3f2d1c</span>
            </div>
            <p className="text-xs text-gray-800 truncate">fix: resolve null check in UserList</p>
            <p className="text-[10px] text-gray-400">2 minutes ago</p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <GitCommit className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 font-mono">b8e4f2a</span>
            </div>
            <p className="text-xs text-gray-800 truncate">feat: add error boundary</p>
            <p className="text-[10px] text-gray-400">15 minutes ago</p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <GitCommit className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 font-mono">c9d3e5b</span>
            </div>
            <p className="text-xs text-gray-800 truncate">chore: update dependencies</p>
            <p className="text-[10px] text-gray-400">1 hour ago</p>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
        <span className="text-gray-500">3 commits today</span>
        <span className="text-green-600 font-medium">+247 -89</span>
      </div>
    </div>
  </div>
);

// Service Card Component
const ServiceCard = ({ service, isVisible, delay }: { service: Service; isVisible: boolean; delay: number }) => {
  const statusColors = {
    healthy: 'bg-green-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500'
  };

  const statusBadgeColors = {
    healthy: 'bg-green-50 text-green-600 border-green-200',
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    error: 'bg-red-50 text-red-600 border-red-200'
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColors[service.status]}`} />
          <span className="text-sm font-medium text-gray-800">{service.name}</span>
        </div>
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusBadgeColors[service.status]}`}>
          {service.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-gray-400">{service.icon}</span>
        <span className="px-2 py-1 rounded bg-gray-100 text-xs font-mono text-gray-600">:{service.port}</span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-500">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span>{service.connections} active connections</span>
      </div>
    </div>
  );
};

// Tool Connection Card Component with click animation
const ToolConnectionCard = ({
  tool,
  isVisible,
  delay,
  isClicked,
  isExpanded,
  expandedView
}: {
  tool: ConnectedTool;
  isVisible: boolean;
  delay: number;
  isClicked: boolean;
  isExpanded: boolean;
  expandedView: React.ReactNode;
}) => (
  <div
    className="relative rounded-lg transition-all duration-300"
    style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
      transition: `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`,
      height: isExpanded ? '220px' : '52px',
      zIndex: isExpanded ? 10 : 1,
    }}
  >
    {/* Normal card state */}
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border transition-all duration-200 ${
        isClicked ? 'border-primary/50 bg-gradient-to-r from-primary/10 to-secondary/10' : 'border-primary/20 hover:border-primary/40'
      }`}
      style={{
        opacity: isExpanded ? 0 : 1,
        pointerEvents: isExpanded ? 'none' : 'auto',
        transition: 'opacity 0.2s ease, border-color 0.2s ease, background 0.2s ease'
      }}
    >
      <span className="text-primary">
        {tool.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">{tool.name}</span>
          {tool.status === 'connected' ? (
            <CheckCircle2 className="w-4 h-4 text-green-500" />
          ) : (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-xs text-primary/70">syncing</span>
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">{tool.description}</p>
      </div>
    </div>

    {/* Expanded view */}
    {expandedView}
  </div>
);

const AutoDiscovery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const toolsContainerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !inView) {
          setInView(true);
          // Start animation after initial render
          setTimeout(() => setPhase('datadog-click'), 2000);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [inView]);

  // Animation controller
  useEffect(() => {
    if (!inView || phase === 'idle') return;

    const clearTimer = () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
        animationRef.current = null;
      }
    };

    clearTimer();

    const timings: Record<string, { next: AnimationPhase; delay: number }> = {
      'datadog-click': { next: 'datadog-expand', delay: 400 },
      'datadog-expand': { next: 'datadog-view', delay: 300 },
      'datadog-view': { next: 'datadog-collapse', delay: 2500 },
      'datadog-collapse': { next: 'sentry-click', delay: 600 },

      'sentry-click': { next: 'sentry-expand', delay: 400 },
      'sentry-expand': { next: 'sentry-view', delay: 300 },
      'sentry-view': { next: 'sentry-collapse', delay: 2500 },
      'sentry-collapse': { next: 'aws-click', delay: 600 },

      'aws-click': { next: 'aws-expand', delay: 400 },
      'aws-expand': { next: 'aws-view', delay: 300 },
      'aws-view': { next: 'aws-collapse', delay: 2500 },
      'aws-collapse': { next: 'github-click', delay: 600 },

      'github-click': { next: 'github-expand', delay: 400 },
      'github-expand': { next: 'github-view', delay: 300 },
      'github-view': { next: 'github-collapse', delay: 2500 },
      'github-collapse': { next: 'complete', delay: 600 },

      'complete': { next: 'datadog-click', delay: 2000 },
    };

    const current = timings[phase];
    if (current) {
      animationRef.current = setTimeout(() => setPhase(current.next), current.delay);
    }

    return clearTimer;
  }, [phase, inView]);

  // Helper to check tool states
  const getToolState = useCallback((toolName: string) => {
    const isClicked = phase === `${toolName.toLowerCase()}-click`;
    const isExpanded = phase.startsWith(toolName.toLowerCase()) &&
      (phase.includes('expand') || phase.includes('view'));
    return { isClicked, isExpanded };
  }, [phase]);

  // Auto-scroll to expanded tool
  useEffect(() => {
    if (!toolsContainerRef.current) return;

    const toolOrder = ['datadog', 'sentry', 'aws', 'github'];
    const expandingTool = toolOrder.find(tool => phase === `${tool}-expand`);

    if (expandingTool) {
      const toolIndex = toolOrder.indexOf(expandingTool);
      // Each collapsed card is ~52px + 12px gap
      const scrollTarget = toolIndex * 64;
      toolsContainerRef.current.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    }
  }, [phase]);

  const discoveredServices: Service[] = [
    {
      id: 'api-service',
      name: 'API Gateway',
      port: '3000',
      status: 'healthy',
      connections: 12,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      )
    },
    {
      id: 'redis-cache',
      name: 'Redis Cache',
      port: '6379',
      status: 'healthy',
      connections: 8,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      )
    },
    {
      id: 'worker-queue',
      name: 'Worker Queue',
      port: '8080',
      status: 'healthy',
      connections: 4,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'postgres-db',
      name: 'PostgreSQL',
      port: '5432',
      status: 'healthy',
      connections: 32,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      )
    },
  ];

  const connectedTools: ConnectedTool[] = [
    {
      name: 'Datadog',
      icon: <DatadogIcon className="w-5 h-5" />,
      status: 'connected',
      description: 'Metrics & APM monitoring'
    },
    {
      name: 'Sentry',
      icon: <SentryIcon className="w-5 h-5" />,
      status: 'connected',
      description: 'Error tracking enabled'
    },
    {
      name: 'AWS',
      icon: <AWSIcon className="w-5 h-5" />,
      status: 'connected',
      description: 'Infrastructure synced'
    },
    {
      name: 'GitHub',
      icon: <GitHubIcon className="w-5 h-5" />,
      status: 'connected',
      description: 'Repository connected'
    },
  ];

  const featureBadges = [
    { icon: '⚡', text: 'Zero-config setup' },
    { icon: '🔍', text: 'Auto service detection' },
    { icon: '💚', text: 'Real-time health' },
    { icon: '🔗', text: 'Connection mapping' },
  ];

  // Get expanded views for each tool
  const getExpandedView = (toolName: string) => {
    const state = getToolState(toolName);
    switch (toolName) {
      case 'Datadog':
        return <DatadogExpandedView isVisible={state.isExpanded} />;
      case 'Sentry':
        return <SentryExpandedView isVisible={state.isExpanded} />;
      case 'AWS':
        return <AWSExpandedView isVisible={state.isExpanded} />;
      case 'GitHub':
        return <GitHubExpandedView isVisible={state.isExpanded} />;
      default:
        return null;
    }
  };

  return (
    <section id="platform" className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl lg:text-5xl font-medium text-text mb-4">
            Install once. See everything.
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            ssai automatically discovers your entire infrastructure - services, connections, health status, and more.
            <span className="text-text"> Your tools, unified.</span>
          </p>
        </div>

        {/* Main Card with Gradient Glow */}
        <div
          className="relative max-w-5xl mx-auto"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease'
          }}
        >
          {/* Gradient Glow Effects */}
          <div className="absolute -inset-2 rounded-lg bg-gradient-to-br from-primary/50 via-transparent to-secondary/40 blur-lg" />
          <div className="absolute -inset-5 rounded-xl bg-gradient-to-br from-primary/35 via-transparent to-secondary/25 blur-3xl" />

          <div
            ref={sectionRef}
            className="relative rounded-lg border border-border/60 bg-white overflow-hidden shadow-lg"
          >
            {/* Header Section */}
            <div className="p-6 bg-gray-50/80 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Infrastructure Overview</h3>
                  <p className="text-sm text-gray-500">Auto-discovered services and connections</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-700">All systems healthy</span>
                </div>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2">
                {featureBadges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-600"
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? 'translateY(0)' : 'translateY(5px)',
                      transition: `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`
                    }}
                  >
                    <span>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-6 bg-white">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Services Grid */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Discovered Services</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {discoveredServices.map((service, index) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        isVisible={inView}
                        delay={0.2 + index * 0.1}
                      />
                    ))}
                  </div>
                </div>

                {/* Connected Tools */}
                <div className="flex flex-col">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Connected Tools</h4>
                  <div ref={toolsContainerRef} className="relative h-[280px] overflow-y-auto overflow-x-hidden pr-2 scroll-smooth">
                    <div className="grid gap-3">
                      {connectedTools.map((tool, index) => {
                        const state = getToolState(tool.name);
                        return (
                          <ToolConnectionCard
                            key={tool.name}
                            tool={tool}
                            isVisible={inView}
                            delay={0.4 + index * 0.1}
                            isClicked={state.isClicked}
                            isExpanded={state.isExpanded}
                            expandedView={getExpandedView(tool.name)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-200">
              <div
                className="flex flex-wrap justify-center gap-6"
                style={{
                  opacity: inView ? 1 : 0,
                  transition: 'opacity 0.4s ease 0.8s'
                }}
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>4 services discovered</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>56 active connections</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>4 tools integrated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoDiscovery;
