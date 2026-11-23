import { useEffect, useState } from 'react';
import { BookA, Code2, Monitor, Search } from 'lucide-react';
import type { GlossaryTerm, LessonCategory } from '../data/curriculum';

interface GlossarySectionProps {
  terms: GlossaryTerm[];
  activeTrack: LessonCategory;
  onSelectTrack: (track: LessonCategory) => void;
}

export function GlossarySection({
  terms,
  activeTrack,
  onSelectTrack,
}: GlossarySectionProps) {
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setShowAll(false);
  }, [activeTrack]);

  const qLower = query.trim().toLowerCase();
  const filteredTerms = terms.filter((item) => {
    const matchesCat = showAll || item.category === activeTrack;
    const matchesQuery =
      !qLower ||
      item.term.toLowerCase().includes(qLower) ||
      item.shortDesc.toLowerCase().includes(qLower);
    return matchesCat && matchesQuery;
  });

  const isProg = activeTrack === 'programming';
  const accentLabel = isProg
    ? 'text-indigo-700 dark:text-indigo-400'
    : 'text-sky-700 dark:text-sky-400';

  return (
    <section
      id="lugat"
      className="py-10 md:py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className={`text-sm font-semibold mb-1.5 ${accentLabel}`}>
              IT Lug‘at · {isProg ? 'Dasturlash atamalari' : 'Savodxonlik atamalari'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Muhim atamalar lug‘ati
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Darslar va test davomida uchraydigan eng kerakli texnologik atamalarni tez toping va
              oddiy misollar bilan yodda saqlang.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Atama qidirish..."
                aria-label="Atama qidirish"
                className="w-full sm:w-56 min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl self-start overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => {
                  setShowAll(false);
                  onSelectTrack('literacy');
                }}
                className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  !showAll && activeTrack === 'literacy'
                    ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 shrink-0" />
                <span>Savodxonlik</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAll(false);
                  onSelectTrack('programming');
                }}
                className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  !showAll && activeTrack === 'programming'
                    ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 shrink-0" />
                <span>Dasturlash</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showAll
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Barchasi ({terms.length})
              </button>
            </div>
          </div>
        </div>

        {filteredTerms.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center">
            <BookA className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Qidiruv bo‘yicha atama topilmadi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTerms.map((item) => {
              const itemProg = item.category === 'programming';
              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-slate-900 border rounded-xl p-5 flex flex-col justify-between ${
                    itemProg
                      ? 'border-indigo-200/70 dark:border-indigo-900/60'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {itemProg ? 'Dasturlash asoslari' : 'Kompyuter savodxonligi'}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                      {item.term}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>

                  <div
                    className={`mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs leading-relaxed ${
                      itemProg
                        ? 'text-indigo-700 dark:text-indigo-400'
                        : 'text-sky-700 dark:text-sky-400'
                    }`}
                  >
                    {item.example}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
