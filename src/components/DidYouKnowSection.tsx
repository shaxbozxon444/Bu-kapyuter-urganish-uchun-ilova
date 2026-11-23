import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Code2, Lightbulb, Monitor } from 'lucide-react';
import type { DidYouKnowItem, LessonCategory } from '../data/curriculum';

interface DidYouKnowSectionProps {
  cards: DidYouKnowItem[];
  activeTrack: LessonCategory;
  onSelectTrack: (track: LessonCategory) => void;
}

export function DidYouKnowSection({
  cards,
  activeTrack,
  onSelectTrack,
}: DidYouKnowSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [openIds, setOpenIds] = useState<string[]>(() => (cards[0] ? [cards[0].id] : []));

  useEffect(() => {
    setShowAll(false);
    const first = cards.find((c) => c.category === activeTrack);
    if (first) setOpenIds([first.id]);
  }, [activeTrack, cards]);

  const filteredCards = showAll ? cards : cards.filter((c) => c.category === activeTrack);

  const toggleCard = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    const allOpen =
      filteredCards.length > 0 && filteredCards.every((c) => openIds.includes(c.id));
    if (allOpen) {
      setOpenIds([]);
    } else {
      setOpenIds(filteredCards.map((c) => c.id));
    }
  };

  const isProg = activeTrack === 'programming';
  const accentLabel = isProg
    ? 'text-indigo-700 dark:text-indigo-400'
    : 'text-sky-700 dark:text-sky-400';

  const allExpanded =
    filteredCards.length > 0 && filteredCards.every((c) => openIds.includes(c.id));

  return (
    <section
      id="bilasizmi"
      className="py-10 md:py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <p className={`text-sm font-semibold mb-1.5 ${accentLabel}`}>
              Bilasizmi? · {isProg ? 'Dasturlash savol-javoblari' : 'Savodxonlik savol-javoblari'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Mantiqiy savollar bilan bilimingizni charxlang
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Imtihondan oldin qiziqarli mantiqiy savollar ustida bosh qotiring va javobni ochib
              tekshiring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
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
                Barchasi ({cards.length})
              </button>
            </div>

            <button
              type="button"
              onClick={expandAll}
              className="min-h-[40px] px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {allExpanded ? 'Barchasini yopish' : 'Barchasini ochish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCards.map((card, index) => {
            const isOpen = openIds.includes(card.id);
            const cardProg = card.category === 'programming';

            return (
              <div
                key={card.id}
                className={`bg-slate-50 dark:bg-slate-950 border rounded-2xl p-5 sm:p-6 flex flex-col justify-between ${
                  cardProg
                    ? 'border-indigo-200/70 dark:border-indigo-900/60'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span
                      className={`font-mono font-semibold tabular-nums ${
                        cardProg
                          ? 'text-indigo-700 dark:text-indigo-400'
                          : 'text-sky-700 dark:text-sky-400'
                      }`}
                    >
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
                    className={`w-full min-h-[44px] flex items-center justify-between gap-3 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                      cardProg
                        ? 'text-indigo-700 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300'
                        : 'text-sky-700 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300'
                    }`}
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
