import { useEffect, useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Code2,
  Flame,
  HelpCircle,
  Monitor,
  RotateCcw,
  Send,
  XCircle,
} from 'lucide-react';
import type { ChallengeItem, LessonCategory } from '../data/curriculum';
import { AiHintModal } from './AiTutorSection';

interface ChallengesSectionProps {
  challenges: ChallengeItem[];
  solvedIds: string[];
  activeTrack: LessonCategory;
  onSelectTrack: (track: LessonCategory) => void;
  onToggleSolved: (id: string, solved: boolean) => void;
}

export function ChallengesSection({
  challenges,
  solvedIds,
  activeTrack,
  onSelectTrack,
  onToggleSolved,
}: ChallengesSectionProps) {
  const [filter, setFilter] = useState<'all' | LessonCategory>(activeTrack);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'orta' | 'qiyin'>('all');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, 'correct' | 'wrong' | null>>({});
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});
  const [aiChallenge, setAiChallenge] = useState<ChallengeItem | null>(null);

  useEffect(() => {
    setFilter(activeTrack);
  }, [activeTrack]);

  const handleFilter = (next: 'all' | LessonCategory) => {
    setFilter(next);
    if (next === 'literacy' || next === 'programming') {
      onSelectTrack(next);
    }
  };

  const visibleChallenges = challenges.filter((c) => {
    const matchTrack = filter === 'all' || c.category === filter;
    const matchDiff = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
    return matchTrack && matchDiff;
  });

  const isProg = filter === 'programming' || (filter === 'all' && activeTrack === 'programming');

  const checkAnswer = (item: ChallengeItem) => {
    const raw = (inputs[item.id] ?? '').trim().toLowerCase();
    if (!raw) return;

    const validAnswers = [
      item.correctAnswer.trim().toLowerCase(),
      ...(item.acceptedAliases ?? []).map((a) => a.trim().toLowerCase()),
    ];

    const isRight = validAnswers.includes(raw);
    setStatuses((prev) => ({ ...prev, [item.id]: isRight ? 'correct' : 'wrong' }));
    if (isRight) {
      onToggleSolved(item.id, true);
      setOpenSolutions((prev) => ({ ...prev, [item.id]: true }));
    }
  };

  const solvedInView = visibleChallenges.filter((c) => solvedIds.includes(c.id)).length;

  return (
    <section className="py-10 md:py-14 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
          <div>
            <p
              className={`text-sm font-semibold mb-1.5 ${
                isProg ? 'text-indigo-700 dark:text-indigo-400' : 'text-sky-700 dark:text-sky-400'
              }`}
            >
              Mustaqil fikrlash va mehnat mashqlari
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Qiyin amaliy masalalar ({visibleChallenges.length} ta)
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl">
              Imtihon savollari oson emas! Bu bo‘limdagi hisob-kitob va kod tahlili masalalarini
              o‘zingiz yechib, bilimingizni pishiting.
            </p>
          </div>

          <div className="text-sm font-mono tabular-nums text-slate-600 dark:text-slate-300">
            Yechilgan:{' '}
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {solvedInView} / {visibleChallenges.length}
            </span>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
          <div
            role="tablist"
            aria-label="Masalalar yo‘nalishi"
            className="inline-flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl"
          >
            <button
              type="button"
              onClick={() => handleFilter('literacy')}
              className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'literacy'
                  ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 shrink-0" />
              <span>Savodxonlik</span>
            </button>
            <button
              type="button"
              onClick={() => handleFilter('programming')}
              className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'programming'
                  ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 shrink-0" />
              <span>Dasturlash</span>
            </button>
            <button
              type="button"
              onClick={() => handleFilter('all')}
              className={`min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Barchasi
            </button>
          </div>

          <div
            role="group"
            aria-label="Qiyinlik darajasi"
            className="inline-flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl"
          >
            {(
              [
                { id: 'all', label: 'Hamma daraja' },
                { id: 'orta', label: 'O‘rta' },
                { id: 'qiyin', label: 'Qiyin' },
              ] as const
            ).map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficultyFilter(d.id)}
                className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  difficultyFilter === d.id
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {visibleChallenges.map((item, idx) => {
            const isSolved = solvedIds.includes(item.id);
            const currentVal = inputs[item.id] ?? '';
            const status = statuses[item.id];
            const showHint = !!openHints[item.id];
            const showSolution = !!openSolutions[item.id];

            return (
              <article
                key={item.id}
                className={`cv-auto rounded-2xl border p-5 sm:p-6 flex flex-col justify-between transition-colors ${
                  isSolved
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {item.category === 'literacy' ? 'Savodxonlik' : 'Dasturlash'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          item.difficulty === 'qiyin'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-sky-700 dark:text-sky-400'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 shrink-0" />
                        {item.difficulty === 'qiyin' ? 'Qiyin masala' : 'O‘rta masala'}
                      </span>
                    </div>

                    {isSolved && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Yechilgan
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                    {item.prompt}
                  </p>

                  {item.codeSnippet && (
                    <pre className="p-3.5 rounded-xl bg-slate-950 text-indigo-200 text-xs font-mono overflow-x-auto mb-4 leading-relaxed">
                      <code>{item.codeSnippet}</code>
                    </pre>
                  )}

                  {/* Input / Choices */}
                  {item.inputType === 'text' ? (
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => {
                          setInputs((p) => ({ ...p, [item.id]: e.target.value }));
                          if (status) setStatuses((p) => ({ ...p, [item.id]: null }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            checkAnswer(item);
                          }
                        }}
                        placeholder="Aniq javobni kiriting..."
                        className="flex-1 min-h-[44px] px-3.5 py-2 text-base sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => checkAnswer(item)}
                        className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-500 hover:bg-slate-800 dark:hover:bg-indigo-400 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 shrink-0" />
                        <span>Tekshirish</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 mb-3">
                      {item.options?.map((opt) => {
                        const selected = currentVal === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setInputs((p) => ({ ...p, [item.id]: opt }));
                              const isRight =
                                opt.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase();
                              setStatuses((p) => ({
                                ...p,
                                [item.id]: isRight ? 'correct' : 'wrong',
                              }));
                              if (isRight) {
                                onToggleSolved(item.id, true);
                                setOpenSolutions((p) => ({ ...p, [item.id]: true }));
                              }
                            }}
                            className={`w-full min-h-[44px] text-left px-3.5 py-2.5 text-xs sm:text-sm rounded-lg border transition-colors cursor-pointer ${
                              selected && status === 'correct'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold'
                                : selected && status === 'wrong'
                                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200'
                                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-400'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {status === 'correct' && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Barakalla! Javob mutlaqo to‘g‘ri.</span>
                    </div>
                  )}

                  {status === 'wrong' && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 mb-3">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>Noto‘g‘ri. Maslahatni o‘qib qayta hisoblab ko‘ring.</span>
                    </div>
                  )}

                  {showHint && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-950 dark:text-amber-200 mb-3">
                      <span className="font-semibold">Yo‘llanma: </span>
                      {item.hint}
                    </div>
                  )}

                  {showSolution && (
                    <div className="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1 mb-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Qadamma-qadam yechim:
                      </div>
                      {item.solutionSteps.map((step, i) => (
                        <div key={i}>{step}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenHints((p) => ({ ...p, [item.id]: !p[item.id] }))
                      }
                      className="min-h-[36px] inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{showHint ? 'Maslahatni yopish' : 'Maslahat olish'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAiChallenge(item)}
                      className="min-h-[36px] inline-flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5 shrink-0" />
                      <span>AI Ustozdan fikr</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenSolutions((p) => ({ ...p, [item.id]: !p[item.id] }))
                      }
                      className="min-h-[36px] text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      {showSolution ? 'Yechimni yashirish' : 'Yechimni ko‘rish'}
                    </button>
                  </div>

                  {isSolved && (
                    <button
                      type="button"
                      onClick={() => {
                        onToggleSolved(item.id, false);
                        setInputs((p) => ({ ...p, [item.id]: '' }));
                        setStatuses((p) => ({ ...p, [item.id]: null }));
                      }}
                      className="min-h-[36px] inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 shrink-0" />
                      <span>Qayta yechish</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {aiChallenge && (
        <AiHintModal
          open={Boolean(aiChallenge)}
          track={aiChallenge.category}
          title={aiChallenge.title}
          topicPrompt={`${aiChallenge.prompt}${aiChallenge.codeSnippet ? `\nKod:\n${aiChallenge.codeSnippet}` : ''}`}
          onClose={() => setAiChallenge(null)}
        />
      )}
    </section>
  );
}
