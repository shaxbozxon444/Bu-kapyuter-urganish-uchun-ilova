import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Cpu,
  FileCode2,
  FileImage,
  FileText,
  FileVideo,
  FolderOpen,
  GitBranch,
  Globe,
  HardDrive,
  Keyboard,
  Lock,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { VideoLessonItem, VideoScene } from '../data/curriculum';

interface InteractiveVideoPlayerProps {
  video: VideoLessonItem;
  onComplete?: () => void;
  onNextVideo?: () => void;
  hasNextVideo?: boolean;
}

function getYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?rel=0`;
      if (parsed.pathname.startsWith('/embed/')) return url;
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0];
        if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
      }
    }
    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.replace('/', '').split('/')[0];
      if (id) return `https://www.youtube.com/embed/${id}?rel=0`;
    }
  } catch {
    return null;
  }
  return null;
}

function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function playSoftChime(sceneIdx: number) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const freqs = [440, 523.25, 587.33, 659.25];
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqs[sceneIdx % freqs.length], ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.26);
    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 350);
  } catch {
    // Ignore Web Audio restrictions
  }
}

export function InteractiveVideoPlayer({
  video,
  onComplete,
  onNextVideo,
  hasNextVideo = false,
}: InteractiveVideoPlayerProps) {
  const totalDuration = video.scenes.reduce((sum, s) => sum + s.durationSec, 0) || 36;
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [completedSent, setCompletedSent] = useState(false);

  const lastSceneRef = useRef<number>(0);
  const completedCallbackRef = useRef(onComplete);
  completedCallbackRef.current = onComplete;

  // Reset player state when video changes
  useEffect(() => {
    setElapsed(0);
    setIsPlaying(false);
    setCompletedSent(false);
    lastSceneRef.current = 0;
  }, [video.id]);

  // Compute current scene & local scene progress
  let acc = 0;
  let activeSceneIndex = 0;
  let sceneStart = 0;
  for (let i = 0; i < video.scenes.length; i += 1) {
    const dur = video.scenes[i].durationSec;
    if (elapsed < acc + dur || i === video.scenes.length - 1) {
      activeSceneIndex = i;
      sceneStart = acc;
      break;
    }
    acc += dur;
  }
  const activeScene: VideoScene = video.scenes[activeSceneIndex] ?? video.scenes[0];
  const sceneElapsed = Math.max(0, elapsed - sceneStart);
  const sceneProgress = Math.min(1, sceneElapsed / Math.max(activeScene.durationSec, 1));

  // Playback animation loop
  useEffect(() => {
    if (!isPlaying) return;
    let rafId = 0;
    let prevTime = performance.now();

    const tick = (now: number) => {
      const dt = ((now - prevTime) / 1000) * speed;
      prevTime = now;
      setElapsed((prev) => {
        const next = prev + dt;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, speed, totalDuration]);

  // Scene change chime & completion callback
  useEffect(() => {
    if (activeSceneIndex !== lastSceneRef.current) {
      lastSceneRef.current = activeSceneIndex;
      if (isPlaying && soundEnabled) {
        playSoftChime(activeSceneIndex);
      }
    }
    if (!completedSent && elapsed >= totalDuration * 0.85) {
      setCompletedSent(true);
      completedCallbackRef.current?.();
    }
  }, [activeSceneIndex, elapsed, totalDuration, isPlaying, soundEnabled, completedSent]);

  const handleTogglePlay = () => {
    if (elapsed >= totalDuration) {
      setElapsed(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handleJumpScene = (index: number) => {
    let target = 0;
    for (let i = 0; i < index; i += 1) {
      target += video.scenes[i]?.durationSec ?? 0;
    }
    setElapsed(target);
    lastSceneRef.current = index;
    if (soundEnabled) playSoftChime(index);
  };

  const cycleSpeed = () => {
    setSpeed((prev) => (prev === 1 ? 1.25 : prev === 1.25 ? 1.5 : 1));
  };

  // External video override (if added from Admin Panel)
  if (video.externalUrl && video.externalUrl.trim().length > 0) {
    const trimmedUrl = video.externalUrl.trim();
    const ytUrl = getYoutubeEmbedUrl(trimmedUrl);
    return (
      <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
        <div className="aspect-video w-full bg-black">
          {ytUrl ? (
            <iframe
              src={ytUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={trimmedUrl} controls playsInline className="w-full h-full object-contain" />
          )}
        </div>
        <div className="p-4 flex items-center justify-between gap-3 bg-slate-900 text-white">
          <div className="text-xs text-slate-300 truncate">{video.title}</div>
          <button
            type="button"
            onClick={() => onComplete?.()}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 rounded-lg cursor-pointer shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ko‘rdim</span>
          </button>
        </div>
      </div>
    );
  }

  const isFinished = elapsed >= totalDuration - 0.05;
  const progressPct = Math.min(100, (elapsed / totalDuration) * 100);

  return (
    <div className="bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-lg select-none">
      {/* Interactive Video Viewport — Phone-friendly tall aspect on mobile, crisp 16:10 on desktop */}
      <div
        onClick={handleTogglePlay}
        role="button"
        tabIndex={0}
        aria-label={isPlaying ? 'Videoni to‘xtatish' : 'Videoni ijro etish'}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleTogglePlay();
          }
        }}
        className="relative min-h-[340px] sm:min-h-[380px] flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-sky-950/60 cursor-pointer overflow-hidden"
      >
        {/* Top Scene Progress Segments (Stories / Reels style!) */}
        <div className="relative z-10 space-y-3">
          <div className="grid grid-cols-4 gap-1.5">
            {video.scenes.map((scene, idx) => {
              const fill =
                idx < activeSceneIndex ? 100 : idx > activeSceneIndex ? 0 : sceneProgress * 100;
              return (
                <div
                  key={scene.label}
                  className="h-1 bg-white/15 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-sky-400 transition-[width] duration-75"
                    style={{ width: `${fill}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-mono font-semibold text-sky-400">
              {video.number} · {activeScene.label} ({activeSceneIndex + 1}/{video.scenes.length})
            </span>
            <span className="font-mono text-slate-400 tabular-nums">
              {formatTime(elapsed)} / {formatTime(totalDuration)}
            </span>
          </div>
        </div>

        {/* Center Animated Motion-Graphic Visual Stage */}
        <div className="relative z-10 my-4 flex flex-col items-center justify-center">
          <SceneMotionVisual
            visualType={video.visualType}
            sceneIndex={activeSceneIndex}
            sceneProgress={sceneProgress}
            highlightText={activeScene.highlightText}
          />
        </div>

        {/* Bottom Kinetic Uzbek Subtitles */}
        <div className="relative z-10 bg-slate-900/85 backdrop-blur-md border border-slate-700/70 rounded-xl p-3.5 sm:p-4">
          <div className="text-sm sm:text-base font-bold text-white leading-snug mb-1">
            {activeScene.title}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeScene.subtitle}
          </p>
        </div>

        {/* Play / Finish Center Overlay when Paused */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 bg-slate-950/35 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-xl">
                {isFinished ? (
                  <RotateCcw className="w-7 h-7" />
                ) : (
                  <Play className="w-7 h-7 ml-0.5" />
                )}
              </div>
              <span className="px-3 py-1 rounded-lg bg-slate-950/90 text-xs font-semibold text-white border border-slate-700">
                {isFinished ? 'Qayta ko‘rish' : elapsed > 0 ? 'Davom ettirish' : 'Videoni boshlash'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Video Player Controls Bar */}
      <div className="px-3.5 sm:px-5 py-3 bg-slate-900 border-t border-slate-800 space-y-2.5">
        {/* Scrubber Range */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={0.1}
            value={elapsed}
            aria-label="Video vaqtini surish"
            onChange={(e) => setElapsed(Number(e.target.value))}
            className="w-full h-2 accent-sky-400 cursor-pointer"
          />
          <span className="font-mono text-[11px] tabular-nums text-slate-400 shrink-0">
            {Math.round(progressPct)}%
          </span>
        </div>

        {/* Scene Jump Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {video.scenes.map((sc, idx) => (
            <button
              key={sc.label}
              type="button"
              onClick={() => handleJumpScene(idx)}
              className={`min-h-[36px] px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                idx === activeSceneIndex
                  ? 'bg-sky-400 text-slate-950 font-semibold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {idx + 1}. {sc.label}
            </button>
          ))}
        </div>

        {/* Action Controls Row (44px+ touch targets) */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 shrink-0" />
                  <span>Pauza</span>
                </>
              ) : isFinished ? (
                <>
                  <RotateCcw className="w-4 h-4 shrink-0" />
                  <span>Qayta</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 shrink-0" />
                  <span>Ijro</span>
                </>
              )}
            </button>

            <button
              type="button"
              aria-label="Oldingi sahna"
              onClick={() => handleJumpScene(Math.max(0, activeSceneIndex - 1))}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              aria-label="Keyingi sahna"
              onClick={() =>
                handleJumpScene(Math.min(video.scenes.length - 1, activeSceneIndex + 1))
              }
              className="min-h-[44px] min-w-[44px] flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={cycleSpeed}
              className="min-h-[44px] px-3 py-2 font-mono text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg cursor-pointer tabular-nums"
            >
              {speed}x
            </button>

            <button
              type="button"
              aria-label={soundEnabled ? 'Ovozni o‘chirish' : 'Ovozni yoqish'}
              onClick={() => setSoundEnabled((p) => !p)}
              className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg cursor-pointer ${
                soundEnabled
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {isFinished && hasNextVideo && onNextVideo && (
              <button
                type="button"
                onClick={onNextVideo}
                className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg cursor-pointer whitespace-nowrap"
              >
                Keyingi video →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneMotionVisual({
  visualType,
  sceneIndex,
  sceneProgress,
  highlightText,
}: {
  visualType: VideoLessonItem['visualType'];
  sceneIndex: number;
  sceneProgress: number;
  highlightText: string;
}) {
  const pulseStep = Math.floor(sceneProgress * 4) % 4;

  if (visualType === 'hardware') {
    const nodes = [
      { label: 'SSD', sub: 'Ombor', icon: HardDrive, active: sceneIndex === 2 ? pulseStep === 0 : true },
      { label: 'RAM', sub: 'Ish stoli', icon: Cpu, active: sceneIndex === 2 ? pulseStep === 1 : sceneIndex >= 1 },
      { label: 'CPU', sub: 'Oshpaz', icon: Cpu, active: sceneIndex === 2 ? pulseStep >= 2 : sceneIndex >= 2 },
    ];
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {nodes.map((n, i) => {
            const Icon = n.icon;
            const highlight = (sceneIndex === 0 && i === 1) || (sceneIndex === 2 && pulseStep === i) || sceneIndex === 3;
            return (
              <div
                key={n.label}
                className={`p-3 rounded-xl border text-center transition-all duration-300 ${
                  highlight
                    ? 'bg-sky-500/20 border-sky-400 scale-[1.03]'
                    : 'bg-slate-900/70 border-slate-700/80'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-1.5 ${highlight ? 'text-sky-300' : 'text-slate-400'}`} />
                <div className="font-mono text-xs font-bold text-white">{n.label}</div>
                <div className="text-[11px] text-slate-400">{n.sub}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center font-mono text-xs font-semibold text-sky-300 bg-sky-950/60 border border-sky-800/60 rounded-lg py-2 px-3">
          {highlightText}
        </div>
      </div>
    );
  }

  if (visualType === 'files') {
    const formats = [
      { ext: '.pdf', name: 'Hujjat', icon: FileText, color: 'text-sky-300' },
      { ext: '.jpg', name: 'Rasm', icon: FileImage, color: 'text-emerald-300' },
      { ext: '.mp4', name: 'Video', icon: FileVideo, color: 'text-amber-300' },
      { ext: '.py', name: 'Kod', icon: FileCode2, color: 'text-indigo-300' },
    ];
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {formats.map((f, idx) => {
            const Icon = f.icon;
            const active = pulseStep === idx || sceneIndex === 3;
            return (
              <div
                key={f.ext}
                className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
                  active ? 'bg-slate-800 border-sky-400 -translate-y-1' : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 mx-auto mb-1 ${f.color}`} />
                <div className="font-mono text-xs font-bold text-white">{f.ext}</div>
                <div className="text-[10px] text-slate-400">{f.name}</div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-sky-300 bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3">
          <FolderOpen className="w-4 h-4 shrink-0" />
          <span>{highlightText}</span>
        </div>
      </div>
    );
  }

  if (visualType === 'shortcuts') {
    const keys = [
      { k: 'Ctrl + C', d: 'Nusxa' },
      { k: 'Ctrl + V', d: 'Qo‘yish' },
      { k: 'Ctrl + Z', d: 'Orqaga' },
      { k: 'Ctrl + S', d: 'Saqlash' },
    ];
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="grid grid-cols-2 gap-2.5">
          {keys.map((item, idx) => {
            const active = pulseStep === idx;
            return (
              <div
                key={item.k}
                className={`px-3 py-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                  active
                    ? 'bg-sky-400 text-slate-950 border-sky-300 scale-[1.02]'
                    : 'bg-slate-900/80 text-white border-slate-700'
                }`}
              >
                <span className="font-mono text-xs font-bold">{item.k}</span>
                <span className={`text-[11px] font-medium ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.d}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-sky-300 bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3">
          <Keyboard className="w-4 h-4 shrink-0" />
          <span>{highlightText}</span>
        </div>
      </div>
    );
  }

  if (visualType === 'security') {
    const showSafe = sceneIndex >= 2 || pulseStep % 2 === 1;
    return (
      <div className="w-full max-w-md space-y-3">
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all duration-300 ${
            !showSafe
              ? 'bg-rose-950/70 border-rose-500/70 text-rose-200'
              : 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200'
          }`}
        >
          {!showSafe ? (
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          )}
          <div className="min-w-0">
            <div className="font-mono text-xs font-bold truncate">
              {!showSafe ? 'http://bonus-bank-24.xyz' : 'https://rasmiy-sayt.uz'}
            </div>
            <div className="text-[11px] opacity-90 mt-0.5">
              {!showSafe
                ? 'Soxta havola! SMS kod va karta so‘ralmoqda'
                : 'Shifrlangan ulanish + 2FA himoyasi yoqilgan'}
            </div>
          </div>
          <Lock className="w-4 h-4 shrink-0 opacity-75" />
        </div>
        <div className="text-center font-mono text-xs font-semibold text-sky-300 bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3">
          {highlightText}
        </div>
      </div>
    );
  }

  if (visualType === 'binary') {
    const bits = ['0', '1', '0', '0', '0', '0', '0', '1'];
    return (
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-center gap-1.5">
          {bits.map((b, i) => {
            const lit = (i + pulseStep) % 2 === 0 || b === '1';
            return (
              <div
                key={i}
                className={`w-8 h-10 sm:w-9 sm:h-11 rounded-lg border font-mono text-sm font-bold flex items-center justify-center transition-all duration-200 ${
                  b === '1'
                    ? 'bg-sky-400 text-slate-950 border-sky-300'
                    : lit
                      ? 'bg-slate-800 text-slate-200 border-slate-600'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {b}
              </div>
            );
          })}
        </div>
        <div className="text-center font-mono text-xs font-semibold text-sky-300 bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3">
          {highlightText}
        </div>
      </div>
    );
  }

  if (visualType === 'algorithm') {
    const steps = ['1. Choy solish', '2. Suv quyish', '3. 5 daq kutish', '4. Tayyor choy'];
    return (
      <div className="w-full max-w-md space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {steps.map((st, idx) => {
            const active = idx <= pulseStep || sceneIndex === 3;
            return (
              <div
                key={st}
                className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-300 ${
                  idx === pulseStep
                    ? 'bg-sky-400 text-slate-950 border-sky-300 font-bold'
                    : active
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                      : 'bg-slate-900/70 text-slate-400 border-slate-800'
                }`}
              >
                {st}
              </div>
            );
          })}
        </div>
        <div className="text-center font-mono text-xs font-semibold text-sky-300 bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3">
          {highlightText}
        </div>
      </div>
    );
  }

  if (visualType === 'ifelse') {
    const branchTrue = pulseStep % 2 === 0;
    return (
      <div className="w-full max-w-md space-y-3">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-center font-mono text-xs text-white flex items-center justify-center gap-2">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <span>agar (ball &gt;= 15)</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div
            className={`p-3 rounded-xl border text-center transition-all duration-300 ${
              branchTrue
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 scale-[1.02]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-mono text-[11px] font-bold">TO‘G‘RI (if)</div>
            <div className="text-xs mt-1">Imtihondan o‘tdi!</div>
          </div>
          <div
            className={`p-3 rounded-xl border text-center transition-all duration-300 ${
              !branchTrue
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 scale-[1.02]'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <div className="font-mono text-[11px] font-bold">AKS HOLDA (else)</div>
            <div className="text-xs mt-1">Qayta tayyorlanish</div>
          </div>
        </div>
        <div className="text-center font-mono text-xs font-semibold text-sky-300 bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3">
          {highlightText}
        </div>
      </div>
    );
  }

  if (visualType === 'network') {
    const netNodes = [
      { t: 'Brauzer', sub: 'murodillayev.dev' },
      { t: 'DNS', sub: 'IP qidiruv' },
      { t: 'Cloud Server', sub: '104.21.48.192' },
    ];
    return (
      <div className="w-full max-w-md space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {netNodes.map((n, idx) => {
            const active = pulseStep % 3 === idx || sceneIndex === 3;
            return (
              <div
                key={n.t}
                className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
                  active
                    ? 'bg-sky-500/20 border-sky-400 text-white scale-[1.02]'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400'
                }`}
              >
                <Globe className={`w-5 h-5 mx-auto mb-1 ${active ? 'text-sky-300' : 'text-slate-500'}`} />
                <div className="font-mono text-xs font-bold">{n.t}</div>
                <div className="text-[10px] opacity-80 truncate">{n.sub}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center font-mono text-xs font-semibold text-sky-300 bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3">
          {highlightText}
        </div>
      </div>
    );
  }

  if (visualType === 'functions') {
    const activePart = pulseStep % 3;
    return (
      <div className="w-full max-w-md space-y-3">
        <div className="grid grid-cols-3 gap-2 items-center">
          <div
            className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
              activePart === 0
                ? 'bg-indigo-500/25 border-indigo-400 text-white'
                : 'bg-slate-900/70 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-mono text-[11px] font-bold">Parametr</div>
            <div className="font-mono text-xs mt-1">(10, 5)</div>
          </div>
          <div
            className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
              activePart === 1
                ? 'bg-indigo-500/25 border-indigo-400 text-white'
                : 'bg-slate-900/70 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-mono text-[11px] font-bold">yigindi()</div>
            <div className="font-mono text-xs mt-1">a + b</div>
          </div>
          <div
            className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
              activePart === 2 || sceneIndex === 3
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200'
                : 'bg-slate-900/70 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-mono text-[11px] font-bold">return</div>
            <div className="font-mono text-xs mt-1">15</div>
          </div>
        </div>
        <div className="text-center font-mono text-xs font-semibold text-indigo-300 bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3">
          {highlightText}
        </div>
      </div>
    );
  }

  // loops_web
  return (
    <div className="w-full max-w-md space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          { t: 'HTML', sub: 'Skelet', icon: Globe },
          { t: 'CSS', sub: 'Dizayn', icon: Repeat },
          { t: 'JS', sub: 'Harakat', icon: FileCode2 },
        ].map((layer, idx) => {
          const Icon = layer.icon;
          const active = pulseStep % 3 === idx || sceneIndex === 3;
          return (
            <div
              key={layer.t}
              className={`p-2.5 rounded-xl border text-center transition-all duration-300 ${
                active
                  ? 'bg-sky-500/20 border-sky-400 text-white'
                  : 'bg-slate-900/70 border-slate-800 text-slate-400'
              }`}
            >
              <Icon className={`w-5 h-5 mx-auto mb-1 ${active ? 'text-sky-300' : 'text-slate-500'}`} />
              <div className="font-mono text-xs font-bold">{layer.t}</div>
              <div className="text-[10px] opacity-80">{layer.sub}</div>
            </div>
          );
        })}
      </div>
      <div className="text-center font-mono text-xs font-semibold text-sky-300 bg-slate-900/90 border border-slate-800 rounded-lg py-2 px-3">
        {highlightText}
      </div>
    </div>
  );
}
