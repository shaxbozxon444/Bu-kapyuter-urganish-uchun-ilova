import { useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Play,
  Video,
  XCircle,
} from 'lucide-react';
import type { LessonCategory, VideoLessonItem } from '../data/curriculum';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';

interface VideoLessonsSectionProps {
  videos: VideoLessonItem[];
  watchedVideos: string[];
  onMarkWatched: (id: string, forceValue?: boolean) => void;
  onGoToLessons: () => void;
  onStartExam: () => void;
}

export function VideoLessonsSection({
  videos,
  watchedVideos,
  onMarkWatched,
  onGoToLessons,
  onStartExam,
}: VideoLessonsSectionProps) {
  const [filter, setFilter] = useState<'all' | LessonCategory>('all');
  const [selectedId, setSelectedId] = useState<string>(() => videos[0]?.id ?? '');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const filteredVideos =
    filter === 'all' ? videos : videos.filter((v) => v.category === filter);

  const activeIndex = Math.max(
    0,
    filteredVideos.findIndex((v) => v.id === selectedId)
  );
  const activeVideo = filteredVideos[activeIndex] ?? filteredVideos[0] ?? videos[0];

  const handleSelectVideo = (id: string) => {
    setSelectedId(id);
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setSelectedId(filteredVideos[activeIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (activeIndex < filteredVideos.length - 1) {
      setSelectedId(filteredVideos[activeIndex + 1].id);
    }
  };

  const watchedCount = watchedVideos.filter((id) => videos.some((v) => v.id === id)).length;

  if (!activeVideo) {
    return (
      <section className="py-12 px-4 max-w-5xl mx-auto text-center">
        <Video className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Hozircha videodarslar mavjud emas.
        </p>
      </section>
    );
  }

  const isWatched = watchedVideos.includes(activeVideo.id);
  const pickedOption = quizAnswers[activeVideo.id];
  const hasPicked = pickedOption !== undefined;
  const isQuizCorrect = pickedOption === activeVideo.quickCheck.correctIndex;

  return (
    <section
      id="videolar"
      className="py-6 sm:py-10 md:py-14 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-8rem)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header + Category Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-sky-700 dark:text-sky-400 mb-1">
              Videodarslar · Qisqa va tushunarli
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ko‘rib tez o‘rganing ({watchedCount}/{videos.length})
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Videodarslar bo‘limini filtrlash"
            className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg overflow-x-auto max-w-full self-start lg:self-auto"
          >
            {(
              [
                { id: 'all', label: 'Barchasi' },
                { id: 'literacy', label: 'Savodxonlik' },
                { id: 'programming', label: 'Dasturlash' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={filter === tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  const first = (
                    tab.id === 'all' ? videos : videos.filter((v) => v.category === tab.id)
                  )[0];
                  if (first) setSelectedId(first.id);
                }}
                className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab.id
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Quick-Tap Video Strip (no scrolling down!) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
          {filteredVideos.map((vid) => {
            const active = vid.id === activeVideo.id;
            const done = watchedVideos.includes(vid.id);
            return (
              <button
                key={vid.id}
                type="button"
                onClick={() => handleSelectVideo(vid.id)}
                className={`min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 font-semibold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {done ? (
                  <CheckCircle2
                    className={`w-3.5 h-3.5 shrink-0 ${
                      active ? 'text-emerald-300 dark:text-slate-950' : 'text-emerald-600'
                    }`}
                  />
                ) : (
                  <Play className="w-3 h-3 shrink-0" />
                )}
                <span className="font-mono tabular-nums">{vid.number}</span>
                <span className="max-w-[150px] truncate">{vid.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Cinema Split: Video Player (8-col) + Playlist (4-col on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <InteractiveVideoPlayer
              video={activeVideo}
              onComplete={() => onMarkWatched(activeVideo.id, true)}
              onNextVideo={handleNext}
              hasNextVideo={activeIndex < filteredVideos.length - 1}
            />

            {/* Video Title + Prev / Watched / Next Thumb Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-mono font-semibold text-sky-700 dark:text-sky-400 tabular-nums">
                      {activeVideo.number}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeVideo.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{activeVideo.durationLabel}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {activeVideo.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {activeVideo.shortDesc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onMarkWatched(activeVideo.id)}
                  className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isWatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isWatched ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{isWatched ? 'Ko‘rildi' : 'Ko‘rdim deb belgilash'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={activeIndex <= 0}
                  onClick={handlePrev}
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                  <span>Oldingi video</span>
                </button>
                <button
                  type="button"
                  disabled={activeIndex >= filteredVideos.length - 1}
                  onClick={handleNext}
                  className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 disabled:opacity-40 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Keyingi video</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>

            {/* 1-Question Quick Check right below */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                Tezkor tekshiruv · Video bo‘yicha 1 ta savol
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                {activeVideo.quickCheck.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {activeVideo.quickCheck.options.map((opt, idx) => {
                  const chosen = pickedOption === idx;
                  const isCorrectOpt = idx === activeVideo.quickCheck.correctIndex;
                  let btnCls =
                    'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300';
                  if (hasPicked) {
                    if (isCorrectOpt) {
                      btnCls =
                        'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (chosen) {
                      btnCls =
                        'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200';
                    }
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setQuizAnswers((prev) => ({ ...prev, [activeVideo.id]: idx }))
                      }
                      className={`min-h-[44px] px-3 py-2 text-xs rounded-xl border text-left transition-colors cursor-pointer ${btnCls}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {hasPicked && (
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium pt-1 ${
                    isQuizCorrect
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {isQuizCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>To‘g‘ri! Mavzuni a’lo tushundingiz.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Noto‘g‘ri — to‘g‘ri javob yashil rangda ko‘rsatildi.
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Playlist Column (Desktop) & Quick Jumps */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Videodarslar ro‘yxati
                </span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {filteredVideos.length} ta
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[420px] overflow-y-auto">
                {filteredVideos.map((vid) => {
                  const active = vid.id === activeVideo.id;
                  const done = watchedVideos.includes(vid.id);
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => handleSelectVideo(vid.id)}
                      className={`w-full min-h-[56px] px-4 py-3 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                        active
                          ? 'bg-sky-50 dark:bg-sky-950/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          active
                            ? 'bg-sky-600 text-white'
                            : done
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {done && !active ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {vid.number}. {vid.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono tabular-nums">
                          {vid.durationLabel} · {vid.categoryLabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="text-xs font-semibold text-slate-900 dark:text-white">
                Keyingi qadam
              </div>
              <button
                type="button"
                onClick={onGoToLessons}
                className="w-full min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                Matnli mini-darslarni ochish
              </button>
              <button
                type="button"
                onClick={onStartExam}
                className="w-full min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-xl transition-colors cursor-pointer"
              >
                20 talik yakuniy imtihonga o‘tish
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
