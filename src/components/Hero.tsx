import { useState } from 'react';

const Hero = () => {
  const [activeTab, setActiveTab] = useState<'ts' | 'py'>('ts');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText('npm install @superserver/core');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="flex flex-col gap-6 animate-fade-in">
            {/* YC Badge */}
            <div className="flex items-center gap-2 w-fit">
              <div className="flex items-center gap-2 rounded-full bg-surface border border-border px-3 py-1.5 hover-glow transition-all duration-300 cursor-default">
                <div className="w-5 h-5 bg-[#f97316] rounded flex items-center justify-center text-xs font-bold text-white">
                  Y
                </div>
                <span className="text-sm text-text-muted">Backed by Y Combinator</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-title text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-text">
              The perpetual sandbox platform
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-text-muted max-w-lg leading-relaxed">
              Build, deploy, and scale AI agents with secure, isolated sandbox environments.
              Sub-millisecond latency, infinite persistence, and enterprise-grade security.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <a
                href="#get-started"
                className="inline-flex items-center gap-2 rounded-lg bg-text text-background px-5 py-3 text-sm font-medium hover:bg-text/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10"
              >
                Try SuperServer
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm font-medium text-text hover:bg-surface-elevated transition-all duration-300 hover:border-primary/30"
              >
                Get a demo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-mono text-text-muted hover:bg-surface-elevated transition-all duration-300 hover:border-primary/30"
              >
                <span className="text-text-muted">$</span>
                <span>npm install @superserver/core</span>
                {copied ? (
                  <svg className="w-4 h-4 text-green-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 transition-transform duration-200 hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Code Window */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xl animate-slide-in-right hover:shadow-primary/10 transition-shadow duration-500">
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('ts')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activeTab === 'ts'
                      ? 'bg-primary/20 text-primary'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  TS
                </button>
                <button
                  onClick={() => setActiveTab('py')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activeTab === 'py'
                      ? 'bg-primary/20 text-primary'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  PY
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm leading-relaxed font-mono">
                <code>
                  {activeTab === 'ts' ? (
                    <>
                      <span className="text-[#c586c0]">import</span>
                      <span className="text-text"> {'{ '}</span>
                      <span className="text-[#4ec9b0]">Sandbox</span>
                      <span className="text-text">{' }'} </span>
                      <span className="text-[#c586c0]">from</span>
                      <span className="text-[#ce9178]"> "@superserver/core"</span>
                      <span className="text-text">;</span>
                      {'\n\n'}
                      <span className="text-[#569cd6]">const</span>
                      <span className="text-[#4fc1ff]"> sandbox</span>
                      <span className="text-text"> = </span>
                      <span className="text-[#c586c0]">await</span>
                      <span className="text-[#4ec9b0]"> Sandbox</span>
                      <span className="text-text">.</span>
                      <span className="text-[#dcdcaa]">create</span>
                      <span className="text-text">{'({'}</span>
                      {'\n'}
                      <span className="text-text">  </span>
                      <span className="text-[#9cdcfe]">runtime</span>
                      <span className="text-text">: </span>
                      <span className="text-[#ce9178]">"node"</span>
                      <span className="text-text">,</span>
                      {'\n'}
                      <span className="text-text">  </span>
                      <span className="text-[#9cdcfe]">memory</span>
                      <span className="text-text">: </span>
                      <span className="text-[#b5cea8]">512</span>
                      <span className="text-text">,</span>
                      {'\n'}
                      <span className="text-text">  </span>
                      <span className="text-[#9cdcfe]">timeout</span>
                      <span className="text-text">: </span>
                      <span className="text-[#b5cea8]">30000</span>
                      {'\n'}
                      <span className="text-text">{'});'}</span>
                      {'\n\n'}
                      <span className="text-[#6a9955]">// Execute code in isolated environment</span>
                      {'\n'}
                      <span className="text-[#569cd6]">const</span>
                      <span className="text-[#4fc1ff]"> result</span>
                      <span className="text-text"> = </span>
                      <span className="text-[#c586c0]">await</span>
                      <span className="text-[#4fc1ff]"> sandbox</span>
                      <span className="text-text">.</span>
                      <span className="text-[#dcdcaa]">exec</span>
                      <span className="text-text">(</span>
                      <span className="text-[#ce9178]">`</span>
                      {'\n'}
                      <span className="text-[#ce9178]">  const data = await fetch(...);</span>
                      {'\n'}
                      <span className="text-[#ce9178]">  return data.json();</span>
                      {'\n'}
                      <span className="text-[#ce9178]">`</span>
                      <span className="text-text">);</span>
                    </>
                  ) : (
                    <>
                      <span className="text-[#c586c0]">from</span>
                      <span className="text-text"> superserver </span>
                      <span className="text-[#c586c0]">import</span>
                      <span className="text-[#4ec9b0]"> Sandbox</span>
                      {'\n\n'}
                      <span className="text-[#4fc1ff]">sandbox</span>
                      <span className="text-text"> = </span>
                      <span className="text-[#c586c0]">await</span>
                      <span className="text-[#4ec9b0]"> Sandbox</span>
                      <span className="text-text">.</span>
                      <span className="text-[#dcdcaa]">create</span>
                      <span className="text-text">(</span>
                      {'\n'}
                      <span className="text-text">    </span>
                      <span className="text-[#9cdcfe]">runtime</span>
                      <span className="text-text">=</span>
                      <span className="text-[#ce9178]">"python"</span>
                      <span className="text-text">,</span>
                      {'\n'}
                      <span className="text-text">    </span>
                      <span className="text-[#9cdcfe]">memory</span>
                      <span className="text-text">=</span>
                      <span className="text-[#b5cea8]">512</span>
                      <span className="text-text">,</span>
                      {'\n'}
                      <span className="text-text">    </span>
                      <span className="text-[#9cdcfe]">timeout</span>
                      <span className="text-text">=</span>
                      <span className="text-[#b5cea8]">30000</span>
                      {'\n'}
                      <span className="text-text">)</span>
                      {'\n\n'}
                      <span className="text-[#6a9955]"># Execute code in isolated environment</span>
                      {'\n'}
                      <span className="text-[#4fc1ff]">result</span>
                      <span className="text-text"> = </span>
                      <span className="text-[#c586c0]">await</span>
                      <span className="text-[#4fc1ff]"> sandbox</span>
                      <span className="text-text">.</span>
                      <span className="text-[#dcdcaa]">exec</span>
                      <span className="text-text">(</span>
                      <span className="text-[#ce9178]">"""</span>
                      {'\n'}
                      <span className="text-[#ce9178]">    import requests</span>
                      {'\n'}
                      <span className="text-[#ce9178]">    data = requests.get(...)</span>
                      {'\n'}
                      <span className="text-[#ce9178]">    return data.json()</span>
                      {'\n'}
                      <span className="text-[#ce9178]">"""</span>
                      <span className="text-text">)</span>
                    </>
                  )}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
