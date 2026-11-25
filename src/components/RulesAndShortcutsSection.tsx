import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Eye,
  FolderCheck,
  Keyboard,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  KIDS_GOLDEN_RULES,
  RULES_QUIZ_QUESTIONS,
  SHORTCUT_RULES,
  type KidRuleCategory,
  type ShortcutGroup,
} from '../data/rulesAndShortcuts';
import { ResilientImage } from './ResilientImage';

interface RulesAndShortcutsSectionProps {
  masteredIds: string[];
  onToggleMastered: (id: string) => void;
  onGoToLessons: () => void;
}

type SectionTab = 'tugmalar' | 'qoidalar' | 'sinov';

const MODIFIER_KEYS = ['Ctrl', 'Shift', 'Alt', 'Win'] as const;
const ACTION_KEYS = [
  'C',
  'V',
  'X',
  'Z',
  'Y',
  'S',
  'A',
  'F',
  'P',
  'T',
  'N',
  'L',
  'D',
  'W',
  'Esc',
  'Tab',
  'Delete',
  'F4',
  '/',
] as const;

const SIMULATED_PRESETS: Array<{ label: string; mods: string[]; action: string }> = [
  { label: 'Ctrl + C', mods: ['Ctrl'], action: 'C' },
  { label: 'Ctrl + V', mods: ['Ctrl'], action: 'V' },
  { label: 'Ctrl + Z', mods: ['Ctrl'], action: 'Z' },
  { label: 'Ctrl + Shift + T', mods: ['Ctrl', 'Shift'], action: 'T' },
  { label: 'Ctrl + Shift + N', mods: ['Ctrl', 'Shift'], action: 'N' },
  { label: 'Ctrl + Shift + Esc', mods: ['Ctrl', 'Shift'], action: 'Esc' },
  { label: 'Win + Shift + S', mods: ['Win', 'Shift'], action: 'S' },
  { label: 'Alt + Tab', mods: ['Alt'], action: 'Tab' },
  { label: 'Shift + Delete', mods: ['Shift'], action: 'Delete' },
];

export function RulesAndShortcutsSection({
  masteredIds,
  onToggleMastered,
  onGoToLessons,
}: RulesAndShortcutsSectionProps) {
  const [activeTab, setActiveTab] = useState<SectionTab>('tugmalar');
  const [shortcutFilter, setShortcutFilter] = useState<'all' | ShortcutGroup>('all');
  const [ruleFilter, setRuleFilter] = useState<'all' | KidRuleCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile Virtual Keyboard Simulator state
  const [selectedMods, setSelectedMods] = useState<string[]>(['Ctrl', 'Shift']);
  const [selectedAction, setSelectedAction] = useState<string>('T');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const toggleMod = (mod: string) => {
    setSelectedMods((prev) =>
      prev.includes(mod) ? prev.filter((item) => item !== mod) : [...prev, mod]
    );
  };

  const normalizedCombo = useMemo(() => {
    const order = ['Ctrl', 'Win', 'Alt', 'Shift'];
    const sortedMods = [...selectedMods].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    return [...sortedMods, selectedAction].filter(Boolean).join(' + ');
  }, [selectedMods, selectedAction]);

  const matchedShortcut = useMemo(() => {
    const normalizeKeyString = (keys: string[]) => {
      const order = ['Ctrl', 'Win', 'Alt', 'Shift'];
      const mods = keys.filter((k) => order.includes(k)).sort((a, b) => order.indexOf(a) - order.indexOf(b));
      const rest = keys.filter((k) => !order.includes(k));
      return [...mods, ...rest].join(' + ').toLowerCase();
    };
    const target = normalizedCombo.toLowerCase();
    return SHORTCUT_RULES.find((item) => normalizeKeyString(item.keys) === target) ?? null;
  }, [normalizedCombo]);

  const visibleShortcuts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SHORTCUT_RULES.filter((item) => {
      const matchesGroup = shortcutFilter === 'all' || item.group === shortcutFilter;
      if (!matchesGroup) return false;
      if (!q) return true;
      return (
        item.comboLabel.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.kidExplanation.toLowerCase().includes(q)
      );
    });
  }, [shortcutFilter, searchQuery]);

  const visibleRules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return KIDS_GOLDEN_RULES.filter((item) => {
      const matchesCat = ruleFilter === 'all' || item.category === ruleFilter;
      if (!matchesCat) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.doThis.toLowerCase().includes(q)
      );
    });
  }, [ruleFilter, searchQuery]);

  const totalItems = SHORTCUT_RULES.length + KIDS_GOLDEN_RULES.length;
  const masteredCount = masteredIds.filter(
    (id) =>
      SHORTCUT_RULES.some((s) => s.id === id) || KIDS_GOLDEN_RULES.some((r) => r.id === id)
  ).length;

  const currentQuiz = RULES_QUIZ_QUESTIONS[quizIndex];

  const handleAnswerQuiz = (optionIdx: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(optionIdx);
    if (optionIdx === currentQuiz.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex + 1 >= RULES_QUIZ_QUESTIONS.length) {
      setQuizDone(true);
    } else {
      setQuizIndex((prev) => prev + 1);
      setQuizSelected(null);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setQuizSelected(null);
    setQuizScore(0);
    setQuizDone(false);
  };

  return (
    <section className="py-7 sm:py-10 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-8rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Engaging Header Card with Custom Illustration */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-5 aspect-[4/3] md:aspect-auto bg-slate-100 dark:bg-slate-800">
            <ResilientImage
              src="/src/assets/images/kids_keyboard_rules_1795594586560.jpg"
              alt="Ctrl va Shift tezkor tugmalari hamda bolalar uchun kompyuter qoidalari illyustratsiyasi"
              fallbackTitle="Ctrl+Shift va Bolalar Qoidalari"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-sky-700 dark:text-sky-400 mb-1">
                BilimKod · Yosh foydalanuvchilar maktabi
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
                Bolalar uchun qoidalar va Ctrl+Shift tugmalari
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                Telefon ekranidayoq klaviatura tugmalarini bosib sinab ko‘ring, ko‘z va xavfsizlik
                qoidalarini o‘rganing hamda tezkor o‘yin-testdan o‘ting.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-mono tabular-nums text-slate-600 dark:text-slate-300">
                O‘zlashtirildi:{' '}
                <strong className="text-emerald-700 dark:text-emerald-400">
                  {masteredCount} / {totalItems}
                </strong>
              </div>
              <button
                type="button"
                onClick={onGoToLessons}
                className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
              >
                Mini-darslarga o‘tish →
              </button>
            </div>
          </div>
        </div>

        {/* Mobile-Friendly 3-Tab Switcher */}
        <div
          role="tablist"
          aria-label="Qoidalar va tugmalar bo‘limlari"
          className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'tugmalar'}
            onClick={() => setActiveTab('tugmalar')}
            className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'tugmalar'
                ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Keyboard className="w-4 h-4 shrink-0" />
            <span>Tugmalar ({SHORTCUT_RULES.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'qoidalar'}
            onClick={() => setActiveTab('qoidalar')}
            className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'qoidalar'
                ? 'bg-white dark:bg-slate-950 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Qoidalar ({KIDS_GOLDEN_RULES.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'sinov'}
            onClick={() => setActiveTab('sinov')}
            className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sinov'
                ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Trophy className="w-4 h-4 shrink-0" />
            <span>Sinov</span>
          </button>
        </div>

        {/* TAB 1: Interactive Keyboard Simulator + Shortcut Cards */}
        {activeTab === 'tugmalar' && (
          <div className="space-y-6">
            {/* Interactive Mobile Virtual Key Combinator */}
            <div className="bg-slate-900 dark:bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Mobil Klaviatura Simulyatori</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Boshqaruv tugmalarini (Ctrl, Shift, Alt, Win) va harfni bosing — nima sodir
                    bo‘lishini ko‘rasiz!
                  </p>
                </div>
                <div className="font-mono text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-sky-300 self-start sm:self-auto">
                  {normalizedCombo}
                </div>
              </div>

              {/* Quick Tap Presets for Instant Exploration */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {SIMULATED_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setSelectedMods(preset.mods);
                      setSelectedAction(preset.action);
                    }}
                    className={`min-h-[38px] px-3 py-1.5 font-mono text-xs font-semibold rounded-lg border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      normalizedCombo === preset.label
                        ? 'bg-sky-400 text-slate-950 border-sky-400'
                        : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Row 1: Modifier Keys */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                  1-qadam: Boshqaruv tugmalarini tanlang (bir nechtasini bosish mumkin)
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {MODIFIER_KEYS.map((mod) => {
                    const active = selectedMods.includes(mod);
                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => toggleMod(mod)}
                        className={`min-h-[46px] font-mono text-xs sm:text-sm font-bold rounded-xl border transition-all active:scale-[0.97] cursor-pointer ${
                          active
                            ? 'bg-sky-400 text-slate-950 border-sky-300 shadow-sm'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {mod}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Action Keys (Ordered Grid on Mobile) */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
                  2-qadam: Harf yoki maxsus tugmani bosing
                </div>
                <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-1.5">
                  {ACTION_KEYS.map((key) => {
                    const active = selectedAction === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedAction(key)}
                        className={`min-h-[44px] sm:min-w-[44px] px-2 sm:px-3 font-mono text-xs sm:text-sm font-bold rounded-xl border transition-all active:scale-[0.96] cursor-pointer ${
                          active
                            ? 'bg-indigo-500 text-white border-indigo-400'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {key}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Result Display */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                {matchedShortcut ? (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm sm:text-base font-bold text-emerald-400">
                        {matchedShortcut.comboLabel} → {matchedShortcut.title}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        {matchedShortcut.importance}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {matchedShortcut.kidExplanation}
                    </p>
                    <p className="text-xs text-sky-300">
                      Misol: {matchedShortcut.exampleAction}
                    </p>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-slate-300">
                    <strong>{normalizedCombo}</strong> — bu maxsus kombinatsiya darslikda alohida
                    belgilanmagan. Yuqoridagi tayyor tugmalardan birini (masalan{' '}
                    <span className="font-mono text-sky-300">Ctrl + Shift + T</span> yoki{' '}
                    <span className="font-mono text-sky-300">Win + Shift + S</span>) sinab ko‘ring!
                  </div>
                )}
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
                {(
                  [
                    { id: 'all', label: 'Hammasi' },
                    { id: 'ctrl', label: 'Ctrl' },
                    { id: 'ctrl_shift', label: 'Ctrl + Shift' },
                    { id: 'alt_win', label: 'Alt / Win' },
                    { id: 'coding', label: 'Dasturlash' },
                  ] as const
                ).map((grp) => (
                  <button
                    key={grp.id}
                    type="button"
                    onClick={() => setShortcutFilter(grp.id)}
                    className={`min-h-[40px] px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      shortcutFilter === grp.id
                        ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {grp.label}
                  </button>
                ))}
              </div>

              <div className="relative md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Qidirish: Shift, nusxa, ekran..."
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Shortcuts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleShortcuts.map((item) => {
                const mastered = masteredIds.includes(item.id);
                return (
                  <article
                    key={item.id}
                    className={`cv-auto rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-3 transition-colors ${
                      mastered
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {item.keys.map((k, idx) => (
                            <span key={`${item.id}-${k}-${idx}`} className="inline-flex items-center gap-1.5">
                              <kbd className="px-2.5 py-1.5 font-mono text-xs font-bold bg-slate-900 dark:bg-slate-800 text-sky-300 rounded-lg border border-slate-700 shadow-xs">
                                {k}
                              </kbd>
                              {idx < item.keys.length - 1 && (
                                <span className="text-xs font-bold text-slate-400">+</span>
                              )}
                            </span>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleMastered(item.id)}
                          className={`min-h-[38px] inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                            mastered
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {mastered ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span>{mastered ? 'Yodladim' : 'Belgilash'}</span>
                        </button>
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.kidExplanation}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate">{item.exampleAction}</span>
                      <span className="font-mono font-semibold text-sky-700 dark:text-sky-400 shrink-0">
                        {item.importance}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Kids Golden Rules */}
        {activeTab === 'qoidalar' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
                {(
                  [
                    { id: 'all', label: 'Barcha qoidalar', icon: Sparkles },
                    { id: 'soglik', label: 'Sog‘liq', icon: Eye },
                    { id: 'xavfsizlik', label: 'Xavfsizlik', icon: ShieldCheck },
                    { id: 'tartib', label: 'Tartib', icon: FolderCheck },
                    { id: 'kodlash', label: 'Kodlash', icon: Terminal },
                  ] as const
                ).map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setRuleFilter(cat.id)}
                      className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        ruleFilter === cat.id
                          ? 'bg-white dark:bg-slate-950 text-emerald-700 dark:text-emerald-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Qoida izlash: parol, ko‘z, qavs..."
                  className="w-full min-h-[44px] pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {visibleRules.map((rule) => {
                const mastered = masteredIds.includes(rule.id);
                return (
                  <article
                    key={rule.id}
                    className={`cv-auto rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
                      mastered
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-mono font-bold text-sky-700 dark:text-sky-400">
                            {rule.number}-qoida
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {rule.categoryLabel}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleMastered(rule.id)}
                          className={`min-h-[38px] inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border whitespace-nowrap shrink-0 cursor-pointer ${
                            mastered
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {mastered ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span>{mastered ? 'Amal qilaman' : 'O‘rgandim'}</span>
                        </button>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                          {rule.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                          {rule.summary}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 border border-emerald-200/80 dark:border-emerald-900/50">
                        <div className="font-bold mb-0.5">To‘g‘ri odat:</div>
                        <div>{rule.doThis}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200 border border-rose-200/80 dark:border-rose-900/50">
                        <div className="font-bold mb-0.5">Mumkin emas:</div>
                        <div>{rule.avoidThis}</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Interactive Kids Mini-Quiz */}
        {activeTab === 'sinov' && (
          <div className="max-w-2xl mx-auto">
            {!quizDone ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-semibold tabular-nums">
                    Savol {quizIndex + 1} / {RULES_QUIZ_QUESTIONS.length}
                  </span>
                  <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    To‘g‘ri: {quizScore}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {currentQuiz.question}
                </h2>

                <div className="space-y-2.5">
                  {currentQuiz.options.map((opt, idx) => {
                    const isPicked = quizSelected === idx;
                    const isCorrect = idx === currentQuiz.correctIndex;
                    const answered = quizSelected !== null;

                    let btnStyle =
                      'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-sky-400';
                    if (answered) {
                      if (isCorrect) {
                        btnStyle =
                          'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                      } else if (isPicked) {
                        btnStyle =
                          'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200';
                      } else {
                        btnStyle =
                          'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 opacity-70';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={answered}
                        onClick={() => handleAnswerQuiz(idx)}
                        className={`w-full min-h-[48px] text-left px-4 py-3 text-sm rounded-xl border transition-colors flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {answered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {answered && isPicked && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSelected !== null && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-xs sm:text-sm text-sky-950 dark:text-sky-200 leading-relaxed">
                      <strong>Izoh:</strong> {currentQuiz.explanation}
                    </div>
                    <button
                      type="button"
                      onClick={handleNextQuiz}
                      className="w-full min-h-[48px] px-5 py-3 text-sm font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400 rounded-xl transition-colors cursor-pointer"
                    >
                      {quizIndex + 1 >= RULES_QUIZ_QUESTIONS.length
                        ? 'Natijani ko‘rish →'
                        : 'Keyingi savol →'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                  <Trophy className="w-7 h-7" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Barakalla! Natijangiz: {quizScore} / {RULES_QUIZ_QUESTIONS.length}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {quizScore >= 8
                    ? 'Ajoyib! Siz Ctrl+Shift tugmalari va kompyuter qoidalarining haqiqiy bilimdonisiz.'
                    : 'Yaxshi harakat! Tugmalar va qoidalarni yana bir bor ko‘rib chiqib, rekordni yangilang.'}
                </p>
                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-xl cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Qaytadan o‘ynash</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
