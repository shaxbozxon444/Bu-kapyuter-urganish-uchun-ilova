import { useState } from 'react';
import { BookA, Search } from 'lucide-react';
import type { GlossaryTerm, LessonCategory } from '../data/curriculum';

interface GlossarySectionProps {
  terms: GlossaryTerm[];
}

export function GlossarySection({ terms }: GlossarySectionProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | LessonCategory>('all');

  const qLower = query.trim().toLowerCase();
  const filteredTerms = terms.filter((item) => {
    const matchesCat = filter === 'all' || item.category === filter;
    const matchesQuery =
      !qLower ||
      item.term.toLowerCase().includes(qLower) ||
      item.shortDesc.toLowerCase().includes(qLower);
    return matchesCat && matchesQuery;
  });

  return (
    <section
      id="lugat"
      className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-400 mb-2">
              IT Lug‘at · Asosiy tushunchalar
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Muhim atamalar lug‘ati
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
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

            <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-lg self-start overflow-x-auto max-w-full">
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
                  onClick={() => setFilter(tab.id)}
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
            {filteredTerms.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                    {item.category === 'literacy'
                      ? 'Kompyuter savodxonligi'
                      : 'Dasturlash asoslari'}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                    {item.term}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-sky-700 dark:text-sky-400 leading-relaxed">
                  {item.example}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
