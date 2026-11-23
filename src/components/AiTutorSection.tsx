import { useState } from 'react';
import {
  Bot,
  Code2,
  Lightbulb,
  Monitor,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import type { LessonCategory } from '../data/curriculum';
import { ResilientImage } from './ResilientImage';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface AiTutorSectionProps {
  activeTrack: LessonCategory;
  onSelectTrack: (track: LessonCategory) => void;
  initialContextTitle?: string;
  initialContextTopic?: string;
}

const STARTER_PROMPTS: Record<LessonCategory, string[]> = {
  literacy: [
    '3 GB hajmda nechta 512 MB fayl sig‘ishini qanday hisoblayman?',
    'Excelda $A$1 va A1 yozuvining farqini tushuntirib bering',
    'Soxta (fishing) sayt havolasini haqiqiysidan qanday ajrataman?',
    'Fayl nomi oxiri .pdf.exe bo‘lsa nima uchun xavfli?',
  ],
  programming: [
    'O‘zgaruvchilar qiymatini almashtirishda (swap) nima uchun 3-o‘zgaruvchi kerak?',
    'a % b (qoldiq) operatori nima beradi va qayerda ishlatiladi?',
    'for sikli necha marta aylanishini qanday kuzataman?',
    'Massiv ichidan eng katta sonni topish algoritmini qanday boshlayman?',
  ],
};

export function AiTutorSection({
  activeTrack,
  onSelectTrack,
  initialContextTitle,
  initialContextTopic,
}: AiTutorSectionProps) {
  const isProg = activeTrack === 'programming';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: initialContextTitle
        ? `Assalomu alaykum! "${initialContextTitle}" mavzusi bo‘yicha fikrlashingizga yordam beraman. Eslatma: men tayyor javob yoki kodni aytmayman — faqat yo‘naltiruvchi fikr va savol beraman. Qayerda qiynalayapsiz?`
        : 'Assalomu alaykum! Men murodillayev_dev AI Ustoziman. Qoidam oddiy: tayyor javobni aytmayman, lekin o‘zingiz topishingiz uchun aniq yo‘naltiruvchi fikr va tushuncha beraman. Qaysi mavzu yoki masala bo‘yicha yordam kerak?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setErrorMsg('');
    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          contextTrack: activeTrack,
          contextTitle: initialContextTitle || '',
          contextTopic: initialContextTopic || '',
          history: nextMessages
            .filter((m) => m.id !== 'welcome')
            .slice(-8)
            .map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setErrorMsg(data.error || 'AI Ustoz javob bera olmadi.');
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: data.reply || '',
        },
      ]);
    } catch {
      setErrorMsg('Tarmoq xatoligi. Internet yoki serverni tekshirib qayta urining.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 md:py-14 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-widest mb-1.5 ${
                isProg ? 'text-indigo-600 dark:text-indigo-400' : 'text-sky-700 dark:text-sky-400'
              }`}
            >
              O‘rgatuvchi Sokratik Mentor
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Ustoz (Faqat fikr va yo‘nalish)
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Tayyor javob bermaydi — masalani o‘zingiz yechishingizga yordam beradi.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl self-start">
            <button
              type="button"
              onClick={() => onSelectTrack('literacy')}
              className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                !isProg
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Savodxonlik</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTrack('programming')}
              className={`min-h-[38px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isProg
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Dasturlash</span>
            </button>
          </div>
        </div>

        {/* Socratic Policy Banner with Engaging Visual */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 sm:grid-cols-12 items-stretch">
          <div className="sm:col-span-4 aspect-[4/3] sm:aspect-auto bg-slate-100 dark:bg-slate-800">
            <ResilientImage
              src="/src/assets/images/ai_mentor_learning_1795425392617.jpg"
              alt="AI Ustoz bilan birga mantiqiy fikrlash va masalalarni mustaqil yechish illyustratsiyasi"
              fallbackTitle="AI Ustoz · Sokratik mentor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="sm:col-span-8 p-4 sm:p-5 flex flex-col justify-center gap-2 bg-amber-50/70 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>Ustoz qoidasi — faqat fikr va yo‘nalish</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 leading-relaxed">
              Bu AI sizga tayyor javob, test varianti yoki tayyor yechim kodini bermaydi. Faqat
              mantiqiy fikr, birinchi qadam va yo‘naltiruvchi savol berib, o‘zingiz topishingizga
              yordam beradi.
            </p>
          </div>
        </div>

        {/* Starter Prompts */}
        <div className="flex flex-wrap gap-2">
          {STARTER_PROMPTS[activeTrack].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void sendMessage(prompt)}
              disabled={loading}
              className="text-left text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Sokratik suhbat oynasi</span>
            </div>
            <button
              type="button"
              onClick={() =>
                setMessages([
                  {
                    id: 'welcome',
                    role: 'assistant',
                    text: 'Suhbat yangilandi. Qaysi mavzu yoki masalada yo‘naltiruvchi fikr kerak?',
                  },
                ])
              }
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tozalash</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4 max-h-[440px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? isProg
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 mb-1">
                      <Bot className="w-3.5 h-3.5" />
                      <span>AI Ustoz fikri</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  Ustoz fikrlamoqda...
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage(input);
            }}
            className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Qiyin tushuncha yoki masalani yozing (javob emas, fikr olasiz)..."
              maxLength={1500}
              className="flex-1 min-h-[44px] px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`min-h-[44px] px-4 py-2 text-sm font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer ${
                isProg
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">So‘rash</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

interface AiHintModalProps {
  open: boolean;
  track: LessonCategory;
  title: string;
  topicPrompt: string;
  onClose: () => void;
}

export function AiHintModal({ open, track, title, topicPrompt, onClose }: AiHintModalProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!open) return null;

  const handleAsk = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setErrorMsg('');
    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: 'user', text: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          contextTrack: track,
          contextTitle: title,
          contextTopic: topicPrompt,
          history: next.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setErrorMsg(data.error || 'AI Ustoz javob qaytara olmadi.');
        return;
      }
      setMessages((prev) => [
        ...prev,
        { id: `a_${Date.now()}`, role: 'assistant', text: data.reply || '' },
      ]);
    } catch {
      setErrorMsg('Serverga ulanib bo‘lmadi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="AI Ustozdan fikr olish"
    >
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 dark:text-sky-400">
              <Bot className="w-4 h-4 shrink-0" />
              <span>AI Ustoz · Tayyor javobsiz yordam</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-0.5">
              {title}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Yopish"
            onClick={onClose}
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Ustoz sizga to‘g‘ri javobni aytmaydi, faqat fikr va birinchi qadamni ko‘rsatadi:
              </p>
              <button
                type="button"
                onClick={() =>
                  void handleAsk('Shu masalani yechishni nimadan va qanday mantiqdan boshlay?')
                }
                className="w-full text-left text-xs px-3 py-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-900/50 hover:opacity-90 cursor-pointer"
              >
                «Shu masalani yechishni nimadan va qanday mantiqdan boshlay?»
              </button>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 ml-8'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 mr-6'
              }`}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="text-xs text-slate-500 dark:text-slate-400">Fikr tayyorlanmoqda...</div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleAsk(question);
          }}
          className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Savolingizni yozing..."
            maxLength={1000}
            className="flex-1 min-h-[42px] px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="min-h-[42px] px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-xl disabled:opacity-50 cursor-pointer"
          >
            Yuborish
          </button>
        </form>
      </div>
    </div>
  );
}
