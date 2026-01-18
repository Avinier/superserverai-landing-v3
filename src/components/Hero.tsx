import { useEffect, useState, useCallback } from 'react';
import { Button, ArrowIcon } from './ui/Button';

// Terminal animation phases
type Phase = 'typing-pull' | 'pulling' | 'typing-run' | 'running' | 'complete';

// Terminal animation types (Phase defined above)

const Hero = () => {
  const [phase, setPhase] = useState<Phase>('typing-pull');
  const [typedChars, setTypedChars] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [runningLineIndex, setRunningLineIndex] = useState(0);

  // Command strings
  const pullCommand = 'docker pull ssai';
  const runCommand = 'docker run -p 3000:3000 ssai';

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Main animation sequence
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    switch (phase) {
      case 'typing-pull':
        if (typedChars < pullCommand.length) {
          timer = setTimeout(() => {
            setTypedChars(prev => prev + 1);
          }, 40);
        } else {
          timer = setTimeout(() => {
            setPhase('pulling');
          }, 300);
        }
        break;

      case 'pulling':
        if (progress < 100) {
          timer = setTimeout(() => {
            setProgress(prev => Math.min(prev + 2, 100));
          }, 30);
        } else {
          timer = setTimeout(() => {
            setTypedChars(0);
            setPhase('typing-run');
          }, 500);
        }
        break;

      case 'typing-run':
        if (typedChars < runCommand.length) {
          timer = setTimeout(() => {
            setTypedChars(prev => prev + 1);
          }, 40);
        } else {
          timer = setTimeout(() => {
            setPhase('running');
          }, 300);
        }
        break;

      case 'running':
        if (runningLineIndex < 2) {
          timer = setTimeout(() => {
            setRunningLineIndex(prev => prev + 1);
          }, 400);
        } else {
          timer = setTimeout(() => {
            setPhase('complete');
          }, 300);
        }
        break;

      case 'complete':
        // Animation complete - stay in this state
        break;
    }

    return () => clearTimeout(timer);
  }, [phase, typedChars, progress, runningLineIndex]);

  // Reset animation (for looping if needed)
  const resetAnimation = useCallback(() => {
    setPhase('typing-pull');
    setTypedChars(0);
    setProgress(0);
    setRunningLineIndex(0);
  }, []);

  // Restart animation after 5 seconds of completion
  useEffect(() => {
    if (phase === 'complete') {
      const restartTimer = setTimeout(() => {
        resetAnimation();
      }, 8000);
      return () => clearTimeout(restartTimer);
    }
  }, [phase, resetAnimation]);

  // Progress bar visual
  const progressBar = () => {
    const filled = Math.floor(progress / 4);
    const empty = 25 - filled;
    return `[${'='.repeat(filled)}${empty > 0 ? '>' : ''}${' '.repeat(Math.max(0, empty - 1))}]`;
  };

  // Get current typing text
  const getCurrentTypingText = () => {
    if (phase === 'typing-pull') {
      return pullCommand.slice(0, typedChars);
    }
    if (phase === 'typing-run') {
      return runCommand.slice(0, typedChars);
    }
    return '';
  };

  // Check if cursor should show for current line
  const shouldShowCursor = (linePhase: Phase) => {
    return (phase === linePhase && (phase === 'typing-pull' || phase === 'typing-run')) && showCursor;
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
              The DevOps layer that runs itself
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-text-muted max-w-lg leading-relaxed">
              A DevOps agent that lives in your infrastructure. The $200K hire you don't have to make.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button as="a" href="#get-started">
                Try it now
                <ArrowIcon />
              </Button>
              <Button as="a" href="#contact" variant="outline">
                Talk to founders
                <ArrowIcon />
              </Button>
            </div>
          </div>

          {/* Right Column - Terminal Window */}
          <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xl animate-slide-in-right hover:shadow-primary/10 transition-shadow duration-500">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
              </div>
              <span className="text-xs text-text-muted font-mono">terminal</span>
            </div>

            {/* Terminal Content */}
            <div className="p-4 font-mono text-sm leading-relaxed min-h-[280px]">
              {/* Line 1: docker pull command */}
              <div className="flex items-center">
                <span className="text-green-500 mr-2">$</span>
                <span className="text-text">
                  {phase === 'typing-pull' ? getCurrentTypingText() : pullCommand}
                </span>
                {shouldShowCursor('typing-pull') && (
                  <span className="ml-0.5 w-2 h-4 bg-text inline-block animate-pulse"></span>
                )}
              </div>

              {/* Line 2: Pulling output (shown after typing-pull) */}
              {(phase !== 'typing-pull') && (
                <div className="text-text-muted mt-1">
                  Pulling from superserverai/ssai...
                </div>
              )}

              {/* Line 3: Progress bar (shown during pulling and after) */}
              {(phase === 'pulling' || phase === 'typing-run' || phase === 'running' || phase === 'complete') && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-primary">{progressBar()}</span>
                  <span className="text-text-muted">{progress}%</span>
                </div>
              )}

              {/* Blank line */}
              {(phase === 'typing-run' || phase === 'running' || phase === 'complete') && (
                <div className="h-4"></div>
              )}

              {/* Line 5: docker run command */}
              {(phase === 'typing-run' || phase === 'running' || phase === 'complete') && (
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">$</span>
                  <span className="text-text">
                    {phase === 'typing-run' ? getCurrentTypingText() : runCommand}
                  </span>
                  {shouldShowCursor('typing-run') && (
                    <span className="ml-0.5 w-2 h-4 bg-text inline-block animate-pulse"></span>
                  )}
                </div>
              )}

              {/* Line 6: ssai initialized (shown during running phase) */}
              {(phase === 'running' || phase === 'complete') && runningLineIndex >= 1 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-500">&#10003;</span>
                  <span className="text-text">ssai initialized</span>
                </div>
              )}

              {/* Line 7: Running on URL (shown at end of running phase) */}
              {(phase === 'running' || phase === 'complete') && runningLineIndex >= 2 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-500">&#10003;</span>
                  <span className="text-text">Running on </span>
                  <a
                    href="#"
                    className={`text-primary transition-all duration-300 ${
                      phase === 'complete' ? 'animate-pulse-subtle' : ''
                    }`}
                    style={phase === 'complete' ? {
                      textShadow: '0 0 10px rgba(37, 75, 241, 0.5), 0 0 20px rgba(37, 75, 241, 0.3)'
                    } : {}}
                    onClick={(e) => e.preventDefault()}
                  >
                    http://localhost:3000
                  </a>
                </div>
              )}

              {/* Blinking cursor at the end when complete */}
              {phase === 'complete' && (
                <div className="flex items-center mt-2">
                  <span className="text-green-500 mr-2">$</span>
                  {showCursor && (
                    <span className="w-2 h-4 bg-text inline-block"></span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
