import { useEffect, useState, useCallback } from 'react';
import { Button, ArrowIcon } from './ui/Button';

type Phase = 'typing-pull' | 'pulling' | 'typing-run' | 'running' | 'complete';

const Hero = () => {
  const [phase, setPhase] = useState<Phase>('typing-pull');
  const [typedChars, setTypedChars] = useState(0);
  const [progress, setProgress] = useState(0);
  const [runningLineIndex, setRunningLineIndex] = useState(0);

  const pullCommand = 'docker pull ssai';
  const runCommand = 'docker run -p 3000:3000 ssai';

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case 'typing-pull':
        if (typedChars < pullCommand.length) {
          timer = setTimeout(() => setTypedChars(prev => prev + 1), 50 + Math.random() * 30);
        } else {
          timer = setTimeout(() => setPhase('pulling'), 200);
        }
        break;

      case 'pulling':
        if (progress < 100) {
          timer = setTimeout(() => {
            setProgress(prev => Math.min(prev + (progress < 70 ? 3 : 5), 100));
          }, 25);
        } else {
          timer = setTimeout(() => {
            setTypedChars(0);
            setPhase('typing-run');
          }, 400);
        }
        break;

      case 'typing-run':
        if (typedChars < runCommand.length) {
          timer = setTimeout(() => setTypedChars(prev => prev + 1), 50 + Math.random() * 30);
        } else {
          timer = setTimeout(() => setPhase('running'), 200);
        }
        break;

      case 'running':
        if (runningLineIndex < 2) {
          timer = setTimeout(() => setRunningLineIndex(prev => prev + 1), 350);
        } else {
          timer = setTimeout(() => setPhase('complete'), 200);
        }
        break;
    }

    return () => clearTimeout(timer);
  }, [phase, typedChars, progress, runningLineIndex]);

  const resetAnimation = useCallback(() => {
    setPhase('typing-pull');
    setTypedChars(0);
    setProgress(0);
    setRunningLineIndex(0);
  }, []);

  useEffect(() => {
    if (phase === 'complete') {
      const timer = setTimeout(resetAnimation, 5000);
      return () => clearTimeout(timer);
    }
  }, [phase, resetAnimation]);

  // ASCII gradient progress bar
  const AsciiProgress = () => {
    const width = 20;
    const filled = Math.floor((progress / 100) * width);

    let bar = '';
    for (let i = 0; i < width; i++) {
      if (i < filled) {
        bar += '█';
      } else {
        bar += '░';
      }
    }

    return (
      <span className="text-text-muted">
        [<span className="text-primary">{bar.slice(0, filled)}</span>
        <span className="text-text-muted/30">{bar.slice(filled)}</span>]
        <span className="ml-2">{progress}%</span>
      </span>
    );
  };

  const getCurrentText = () => {
    if (phase === 'typing-pull') return pullCommand.slice(0, typedChars);
    if (phase === 'typing-run') return runCommand.slice(0, typedChars);
    return '';
  };

  const Cursor = () => (
    <span className="inline-block w-[7px] h-[15px] bg-primary/90 ml-px animate-pulse" />
  );

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="flex flex-col gap-6 animate-fade-in">
            <h1 className="font-title text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] text-text">
              The DevOps layer that runs itself
            </h1>
            <p className="text-lg text-text-muted max-w-lg leading-relaxed">
              A DevOps agent that lives in your infrastructure. The $200K hire you don't have to make.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button as="a" href="https://dev.superserver.app" target="_blank" rel="noopener noreferrer" variant="primary">
                Try it now
                <ArrowIcon />
              </Button>
              <Button as="a" href="#contact" variant="outline">
                Talk to founders
                <ArrowIcon />
              </Button>
            </div>
          </div>

          {/* Right Column - Terminal */}
          <div className="animate-slide-in-right">
            <div className="rounded-lg border border-border/60 overflow-hidden bg-[#0c0c0c]">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-surface/50 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-text-muted/50 text-xs font-mono">ssai ~ zsh</span>
              </div>

              {/* Content */}
              <div className="p-4 font-mono text-[13px] min-h-[220px] leading-relaxed">
                {/* Command 1 */}
                <div className="flex">
                  <span className="text-secondary">❯</span>
                  <span className="text-text ml-2">
                    {phase === 'typing-pull' ? getCurrentText() : pullCommand}
                  </span>
                  {phase === 'typing-pull' && <Cursor />}
                </div>

                {/* Pulling output */}
                {phase !== 'typing-pull' && (
                  <div className="mt-1 text-text-muted">
                    <span className="text-primary">-&gt;</span> pulling superserverai/ssai
                  </div>
                )}

                {/* Progress */}
                {(phase === 'pulling' || phase === 'typing-run' || phase === 'running' || phase === 'complete') && (
                  <div className="mt-1">
                    <AsciiProgress />
                  </div>
                )}

                {/* Spacer */}
                {(phase === 'typing-run' || phase === 'running' || phase === 'complete') && (
                  <div className="mt-1 text-text-muted/20">~</div>
                )}

                {/* Command 2 */}
                {(phase === 'typing-run' || phase === 'running' || phase === 'complete') && (
                  <div className="flex mt-1">
                    <span className="text-secondary">❯</span>
                    <span className="text-text ml-2">
                      {phase === 'typing-run' ? getCurrentText() : runCommand}
                    </span>
                    {phase === 'typing-run' && <Cursor />}
                  </div>
                )}

                {/* Success 1 */}
                {(phase === 'running' || phase === 'complete') && runningLineIndex >= 1 && (
                  <div className="mt-1">
                    <span className="text-green-500">[ok]</span>
                    <span className="text-text ml-2">ssai initialized</span>
                  </div>
                )}

                {/* Success 2 */}
                {(phase === 'running' || phase === 'complete') && runningLineIndex >= 2 && (
                  <div className="mt-1">
                    <span className="text-green-500">[ok]</span>
                    <span className="text-text ml-2">running at </span>
                    <span className="text-primary">localhost:3000</span>
                  </div>
                )}

                {/* Final prompt */}
                {phase === 'complete' && (
                  <div className="flex mt-1">
                    <span className="text-secondary">❯</span>
                    <span className="ml-2"><Cursor /></span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-surface/30 border-t border-border/30 text-[11px] font-mono text-text-muted/40">
                <span><span className="text-primary">■</span> NORMAL</span>
                <span>utf-8 | zsh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
