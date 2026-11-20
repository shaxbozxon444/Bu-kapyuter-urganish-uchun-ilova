import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import type { DidYouKnowItem } from '../data/curriculum';

interface DidYouKnowSectionProps {
  cards: DidYouKnowItem[];
}

export function DidYouKnowSection({ cards }: DidYouKnowSectionProps) {
  const [openIds, setOpenIds] = useState<string[]>(() => (cards[0] ? [cards[0].id] : []));

  const toggleCard = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    if (openIds.length === cards.length) {
      setOpenIds([]);
    } else {
      setOpenIds(cards.map((c) => c.id));
    }
  };

  return (
    <section
      id="bilasizmi"
      className="py-16 md:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-400 mb-2">
              Bilasizmi? · Mantiqiy savol-javoblar
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              O‘zingizni tekshirib ko‘ring
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Imtihondan oldin qiziqarli mantiqiy savollar ustida bosh qotiring va javobni ochib
              tekshiring.
            </p>
          </div>

          <button
            type="button"
            onClick={expandAll}
            className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            {openIds.length === cards.length && cards.length > 0
              ? 'Barcha javoblarni yashirish'
              : 'Barcha javoblarni ochish'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => {
            const isOpen = openIds.includes(card.id);

            return (
              <div
                key={card.id}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-mono font-semibold text-sky-700 dark:text-sky-400 tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{card.topic}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-snug mb-2">
                    {card.question}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <span>Yo‘llanma: {card.hint}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleCard(card.id)}
                    className="w-full min-h-[44px] flex items-center justify-between gap-3 py-2 text-sm font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 transition-colors cursor-pointer"
                  >
                    <span>{isOpen ? 'Javobni yashirish' : 'Javobni ko‘rish'}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {card.answer}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
