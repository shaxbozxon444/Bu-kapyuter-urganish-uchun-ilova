import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code2,
  LayoutGrid,
  Monitor,
  Smartphone,
  Video,
} from 'lucide-react';
import type { LessonCategory, LessonItem } from '../data/curriculum';
import { LessonInteractiveWidget } from './LessonInteractiveWidget';
import { ResilientImage } from './ResilientImage';

interface LessonsSectionProps {
  lessons: LessonItem[];
  completedLessons: string[];
  activeTrack: LessonCategory;
  onSelectTrack: (track: LessonCategory) => void;
  focusedLessonId?: string | null;
  onToggleLesson: (id: string) => void;
  onOpenVideos?: () => void;
  onStartExam: () => void;
}

function getLessonVisual(lesson: LessonItem): { src: string; alt: string } {
  const widget = lesson.widgetType;
  const id = lesson.id.toLowerCase();

  if (widget === 'hardware' || widget === 'shortcuts' || widget === 'os' || id.includes('hardware')) {
    return {
      src: '/src/assets/images/computer_hardware_diagram_1795163268376.jpg',
      alt: `${lesson.title} — kompyuter qismlari va tizim sxemasi`,
    };
  }
  if (widget === 'security' || id.includes('cyber') || id.includes('xavf')) {
    return {
      src: '/src/assets/images/cyber_security_shield_1795425392051.jpg',
      alt: `${lesson.title} — kiberxavfsizlik va parol himoyasi illyustratsiyasi`,
    };
  }
  if (widget === 'office' || widget === 'network' || widget === 'files' || id.includes('excel') || id.includes('internet')) {
    return {
      src: '/src/assets/images/spreadsheet_network_lab_1795425391913.jpg',
      alt: `${lesson.title} — jadval formulalari va internet tarmog‘i illyustratsiyasi`,
    };
  }
  if (widget === 'ai' || id.includes('ai') || id.includes('prompt')) {
    return {
      src: '/src/assets/images/ai_mentor_learning_1795425392617.jpg',
      alt: `${lesson.title} — sun’iy intellekt va zamonaviy savodxonlik illyustratsiyasi`,
    };
  }
  if (widget === 'binary' || widget === 'algorithm' || widget === 'datatypes' || widget === 'ifelse' || widget === 'loops' || widget === 'functions') {
    return {
      src: '/src/assets/images/programming_logic_visual_1795163270407.jpg',
      alt: `${lesson.title} — dasturlash algoritmi va kod mantiqi illyustratsiyasi`,
    };
  }
  if (lesson.category === 'programming' || widget === 'languages' || widget === 'webarch') {
    return {
      src: '/src/assets/images/mobile_coding_journey_1795425391520.jpg',
      alt: `${lesson.title} — dasturlash mashqlari va rivojlanish illyustratsiyasi`,
    };
  }
  return {
    src: '/src/assets/images/hero_coding_studio_1795163267457.jpg',
    alt: `${lesson.title} — o‘quv ish stoli illyustratsiyasi`,
  };
}

export function LessonsSection({
  lessons,
  completedLessons,
  activeTrack,
  onSelectTrack,
  focusedLessonId,
  onToggleLesson,
  onOpenVideos,
  onStartExam,
}: LessonsSectionProps) {
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [viewLayout, setViewLayout] = useState<'pager' | 'grid'>('pager');
  const [selectedId, setSelectedId] = useState<string>(
    () => lessons.find((l) => l.category === activeTrack)?.id ?? lessons[0]?.id ?? ''
  );

  useEffect(() => {
    if (focusedLessonId) {
      const target = lessons.find((l) => l.id === focusedLessonId);
      if (target) {
        setShowAllTracks(false);
        if (target.category !== activeTrack) {
          onSelectTrack(target.category);
        }
        setSelectedId(target.id);
        return;
      }
    }
  }, [focusedLessonId, lessons, activeTrack, onSelectTrack]);

  useEffect(() => {
    setShowAllTracks(false);
    const firstInTrack = lessons.find((l) => l.category === activeTrack);
    if (firstInTrack) {
      setSelectedId(firstInTrack.id);
    }
  }, [activeTrack, lessons]);

  const filteredLessons = showAllTracks
    ? lessons
    : lessons.filter((item) => item.category === activeTrack);

  const activeIndex = Math.max(
    0,
    filteredLessons.findIndex((l) => l.id === selectedId)
  );
  const activeLesson = filteredLessons[activeIndex] ?? filteredLessons[0];

  const completedInTrack = completedLessons.filter((id) =>
    filteredLessons.some((l) => l.id === id)
  ).length;
  const literacyCount = lessons.filter((l) => l.category === 'literacy').length;
  const programmingCount = lessons.filter((l) => l.category === 'programming').length;

  const isProg = activeTrack === 'programming';
  const accentLabel = isProg
    ? 'text-indigo-700 dark:text-indigo-400'
    : 'text-sky-700 dark:text-sky-400';
  const dotColor = isProg
    ? 'bg-indigo-600 dark:bg-indigo-400'
    : 'bg-sky-600 dark:bg-sky-400';

  const renderLessonCard = (lesson: LessonItem) => {
    const isCompleted = completedLessons.includes(lesson.id);
    const cardIsProg = lesson.category === 'programming';
    const visual = getLessonVisual(lesson);
    return (
      <article
        id={`lesson-${lesson.id}`}
        key={lesson.id}
        className={`cv-auto scroll-mt-20 bg-white dark:bg-slate-900 rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-colors ${
          isCompleted
            ? 'border-emerald-300 dark:border-emerald-700'
            : cardIsProg
              ? 'border-indigo-200/80 dark:border-indigo-900/70'
              : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span
                className={`font-mono font-semibold tabular-nums ${
                  cardIsProg
                    ? 'text-indigo-700 dark:text-indigo-400'
                    : 'text-sky-700 dark:text-sky-400'
                }`}
              >
                {lesson.number}
              </span>
              <span aria-hidden="true">·</span>
              <span>{lesson.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{lesson.readTime}</span>
            </div>

            <button
              type="button"
              onClick={() => onToggleLesson(lesson.id)}
              className={`min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 shrink-0" />
              )}
              {isCompleted ? 'O‘qildi' : 'Belgilash'}
            </button>
          </div>

          <div className="aspect-[16/9] sm:aspect-[2/1] w-full rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
            <ResilientImage
              src={visual.src}
              alt={visual.alt}
              fallbackTitle={lesson.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white leading-snug mb-2">
              {lesson.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lesson.summary}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p
              className={`text-xs font-semibold mb-1 ${
                cardIsProg
                  ? 'text-indigo-700 dark:text-indigo-400'
                  : 'text-sky-700 dark:text-sky-400'
              }`}
            >
              {lesson.analogyTitle}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {lesson.analogyText}
            </p>
          </div>

          <ul className="space-y-2 pt-2">
            {lesson.keyPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <span
                  aria-hidden="true"
                  className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${
                    cardIsProg ? 'bg-indigo-600 dark:bg-indigo-400' : dotColor
                  }`}
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5">
          <LessonInteractiveWidget type={lesson.widgetType} />
        </div>
      </article>
    );
  };

  return (
    <section
      id="darslar"
      className="py-6 sm:py-10 md:py-12 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-8rem)]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header + Separate Track Tabs + Mode Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <p className={`text-xs sm:text-sm font-semibold mb-1 ${accentLabel}`}>
              {showAllTracks
                ? `Barcha mini-darslar · ${completedInTrack} / ${filteredLessons.length}`
                : isProg
                  ? `Dasturlash asoslari · ${completedInTrack} / ${filteredLessons.length} o‘zlashtirildi`
                  : `Kompyuter savodxonligi · ${completedInTrack} / ${filteredLessons.length} o‘zlashtirildi`}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {isProg
                ? 'Kodlash va algoritmlarni bosqichma-bosqich o‘rganing'
                : 'Kompyuter ko‘nikmalarini noldan professionalgacha o‘rganing'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div
              role="tablist"
              aria-label="Darslar yo‘nalishi"
              className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full"
            >
              <button
                type="button"
                role="tab"
                aria-selected={!showAllTracks && activeTrack === 'literacy'}
                onClick={() => {
                  setShowAllTracks(false);
                  onSelectTrack('literacy');
                }}
                className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  !showAllTracks && activeTrack === 'literacy'
                    ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 shrink-0" />
                <span>Savodxonlik ({literacyCount})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!showAllTracks && activeTrack === 'programming'}
                onClick={() => {
                  setShowAllTracks(false);
                  onSelectTrack('programming');
                }}
                className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  !showAllTracks && activeTrack === 'programming'
                    ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 shrink-0" />
                <span>Dasturlash ({programmingCount})</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={showAllTracks}
                onClick={() => setShowAllTracks(true)}
                className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showAllTracks
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Barchasi
              </button>
            </div>

            <button
              type="button"
              onClick={() => setViewLayout((p) => (p === 'pager' ? 'grid' : 'pager'))}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer whitespace-nowrap"
            >
              {viewLayout === 'pager' ? (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                  <span>Hammasi</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  <span>Bittadan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Focused Phone Pager Mode */}
        {viewLayout === 'pager' && activeLesson ? (
          <div className="space-y-4">
            {/* Quick Lesson Selector Strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {filteredLessons.map((lesson) => {
                const isSelected = lesson.id === activeLesson.id;
                const done = completedLessons.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => setSelectedId(lesson.id)}
                    className={`min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isSelected
                        ? isProg
                          ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 font-semibold'
                          : 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 font-semibold'
                        : done
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="font-mono tabular-nums">{lesson.number}</span>
                    <span className="max-w-[130px] truncate">{lesson.title}</span>
                  </button>
                );
              })}
            </div>

            {renderLessonCard(activeLesson)}

            {/* Step-by-step Next/Prev Thumb Controls */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={activeIndex <= 0}
                onClick={() => setSelectedId(filteredLessons[activeIndex - 1].id)}
                className="min-h-[46px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
                <span>Oldingi dars</span>
              </button>

              {activeIndex < filteredLessons.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!completedLessons.includes(activeLesson.id)) {
                      onToggleLesson(activeLesson.id);
                    }
                    setSelectedId(filteredLessons[activeIndex + 1].id);
                  }}
                  className={`min-h-[46px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                    isProg
                      ? 'text-white bg-indigo-600 hover:bg-indigo-500'
                      : 'text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400'
                  }`}
                >
                  <span>Keyingi dars</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStartExam}
                  className={`min-h-[46px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                    isProg
                      ? 'text-white bg-indigo-600 hover:bg-indigo-500'
                      : 'text-slate-950 bg-sky-400 hover:bg-sky-300'
                  }`}
                >
                  <span>Imtihonni boshlash →</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-stretch">
                <div className="sm:w-44 aspect-[4/3] sm:aspect-auto shrink-0 bg-slate-100 dark:bg-slate-800">
                  <ResilientImage
                    src="/src/assets/images/computer_hardware_diagram_1795163268376.jpg"
                    alt="Kompyuterning ichki qismlari: protsessor, tezkor xotira va SSD"
                    fallbackTitle="Kompyuter qismlari sxemasi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col justify-center">
                  <div className="text-xs text-sky-700 dark:text-sky-400 font-semibold mb-1">
                    1-yo‘nalish · {literacyCount} ta dars
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">
                    Kompyuter savodxonligi
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Apparat qismlari, OS, fayl/arxivlar, ofis, internet/DNS, xavfsizlik va AI.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900/70 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-stretch">
                <div className="sm:w-44 aspect-[4/3] sm:aspect-auto shrink-0 bg-slate-900">
                  <ResilientImage
                    src="/src/assets/images/programming_logic_visual_1795163270407.jpg"
                    alt="Dasturlash algoritmi va shart operatorlari blok-sxemasi"
                    fallbackTitle="Algoritm va mantiq sxemasi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col justify-center">
                  <div className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold mb-1">
                    2-yo‘nalish · {programmingCount} ta dars
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">
                    Dasturlash asoslari
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    0 va 1, algoritmlar, ma’lumot turlari, shart, sikl, funksiyalar va veb/API.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLessons.map((lesson) => renderLessonCard(lesson))}
            </div>
          </>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {onOpenVideos && (
            <button
              type="button"
              onClick={onOpenVideos}
              className={`min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                isProg
                  ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800'
                  : 'text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800'
              }`}
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>Videodarslarni ko‘rish</span>
            </button>
          )}
          <button
            type="button"
            onClick={onStartExam}
            className={`min-h-[46px] px-5 py-3 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isProg
                ? 'text-white bg-indigo-600 hover:bg-indigo-500'
                : 'text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400'
            }`}
          >
            {isProg ? '20 talik Dasturlash imtihoniga o‘tish' : '20 talik Savodxonlik imtihoniga o‘tish'}
          </button>
        </div>
      </div>
    </section>
  );
}
