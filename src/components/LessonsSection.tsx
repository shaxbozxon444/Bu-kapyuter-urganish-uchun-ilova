import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  LayoutGrid,
  Smartphone,
  Video,
} from 'lucide-react';
import type { LessonCategory, LessonItem } from '../data/curriculum';
import { LessonInteractiveWidget } from './LessonInteractiveWidget';
import { ResilientImage } from './ResilientImage';

interface LessonsSectionProps {
  lessons: LessonItem[];
  completedLessons: string[];
  focusedLessonId?: string | null;
  onToggleLesson: (id: string) => void;
  onOpenVideos?: () => void;
  onStartExam: () => void;
}

type FilterOption = 'all' | LessonCategory;

export function LessonsSection({
  lessons,
  completedLessons,
  focusedLessonId,
  onToggleLesson,
  onOpenVideos,
  onStartExam,
}: LessonsSectionProps) {
  const [filter, setFilter] = useState<FilterOption>('all');
  const [viewLayout, setViewLayout] = useState<'pager' | 'grid'>('pager');
  const [selectedId, setSelectedId] = useState<string>(() => lessons[0]?.id ?? '');

  useEffect(() => {
    if (focusedLessonId && lessons.some((l) => l.id === focusedLessonId)) {
      setFilter('all');
      setSelectedId(focusedLessonId);
    }
  }, [focusedLessonId, lessons]);

  const filteredLessons =
    filter === 'all' ? lessons : lessons.filter((item) => item.category === filter);

  const activeIndex = Math.max(
    0,
    filteredLessons.findIndex((l) => l.id === selectedId)
  );
  const activeLesson = filteredLessons[activeIndex] ?? filteredLessons[0];

  const completedInCurrentList = completedLessons.filter((id) =>
    lessons.some((l) => l.id === id)
  ).length;
  const literacyCount = lessons.filter((l) => l.category === 'literacy').length;
  const programmingCount = lessons.filter((l) => l.category === 'programming').length;

  const renderLessonCard = (lesson: LessonItem) => {
    const isCompleted = completedLessons.includes(lesson.id);
    return (
      <article
        id={`lesson-${lesson.id}`}
        key={lesson.id}
        className={`scroll-mt-20 bg-white dark:bg-slate-900 rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-colors ${
          isCompleted
            ? 'border-emerald-300 dark:border-emerald-700'
            : 'border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-semibold text-sky-700 dark:text-sky-400 tabular-nums">
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

          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white leading-snug mb-2">
              {lesson.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lesson.summary}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
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
                  className="mt-2 w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400 shrink-0"
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
      className="py-6 sm:py-10 md:py-14 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-8rem)]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Section Header + Filter + Mode Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-sky-700 dark:text-sky-400 mb-1">
              Mini-darslar · {completedInCurrentList} / {lessons.length} o‘zlashtirildi
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Noldan bosqichma-bosqich o‘rganing
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div
              role="tablist"
              aria-label="Darslar bo‘limini filtrlash"
              className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg overflow-x-auto max-w-full"
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
                      tab.id === 'all' ? lessons : lessons.filter((l) => l.category === tab.id)
                    )[0];
                    if (first) setSelectedId(first.id);
                  }}
                  className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    filter === tab.id
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
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

        {/* Focused Phone Pager Mode (No endless vertical scrolling!) */}
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
                        ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500 font-semibold'
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
                  className="min-h-[46px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Keyingi dars</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onStartExam}
                  className="min-h-[46px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Imtihonni boshlash →</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Visual Module Spotlights in Grid Mode */}
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
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    1-modul · {literacyCount} ta dars
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">
                    Kompyuter savodxonligi
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Qurilma tuzilishi, fayllar tartibi, klaviatura tugmalari va internet xavfsizligi.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col sm:flex-row items-stretch">
                <div className="sm:w-44 aspect-[4/3] sm:aspect-auto shrink-0 bg-slate-900">
                  <ResilientImage
                    src="/src/assets/images/programming_logic_visual_1795163270407.jpg"
                    alt="Dasturlash algoritmi va shart operatorlari blok-sxemasi"
                    fallbackTitle="Algoritm va mantiq sxemasi"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex flex-col justify-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    2-modul · {programmingCount} ta dars
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">
                    Dasturlash asoslari
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    0 va 1 tili, algoritmlar, o‘zgaruvchilar, shart operatorlari va dasturlash tillari.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredLessons.map((lesson) => renderLessonCard(lesson))}
            </div>
          </>
        )}

        {/* Quick Actions Footer inside Lessons Screen */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {onOpenVideos && (
            <button
              type="button"
              onClick={onOpenVideos}
              className="min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 rounded-xl transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>Videodarslarni ko‘rish</span>
            </button>
          )}
          <button
            type="button"
            onClick={onStartExam}
            className="min-h-[46px] px-5 py-3 text-sm font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-xl hover:bg-slate-800 dark:hover:bg-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Yakuniy imtihonga o‘tish
          </button>
        </div>
      </div>
    </section>
  );
}
