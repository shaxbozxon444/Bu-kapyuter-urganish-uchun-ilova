import { useState } from 'react';
import {
  CheckCircle2,
  HardDrive,
  Keyboard,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  XCircle,
} from 'lucide-react';

type LabMode = 'code' | 'typing' | 'literacy';
type PresetId = 'greeting' | 'exam' | 'loop' | 'discount';

const TYPING_PROMPTS = [
  'Kompyuter savodxonligi va dasturlash asoslari kelajak kasblarining poydevoridir.',
  'Algoritm bu aniq natijaga erishish uchun tuzilgan tartibli qadamlar ketma-ketligidir.',
  'Kuchli parol va ikki bosqichli himoya shaxsiy ma’lumotlarni firibgarlardan asraydi.',
];

const PHISHING_CASES = [
  {
    id: 'ph-1',
    sender: 'Xizmat-Bank-24@info-bonus.xyz',
    text: 'Tabriklaymiz! Siz 5 000 000 so‘m yutib oldingiz. Pulni olish uchun karta raqami va SMS kodni kiriting.',
    isPhishing: true,
    reason: 'Noma’lum domen va SMS kod so‘ralishi — 100% fishing (firibgarlik) belgisi.',
  },
  {
    id: 'ph-2',
    sender: 'no-reply@accounts.google.com',
    text: 'Yangi qurilmadan hisobingizga kirish qayd etildi. Agar bu siz bo‘lmasangiz, sozlamalarda parolni yangilang.',
    isPhishing: false,
    reason: 'Rasmiy domen, karta yoki SMS kod so‘ralmagan — haqiqiy xavfsizlik ogohlantirishi.',
  },
];

export function CodePlaygroundSection() {
  const [labMode, setLabMode] = useState<LabMode>('code');

  // --- Mode 1: Code Runner ---
  const [preset, setPreset] = useState<PresetId>('greeting');
  const [studentName, setStudentName] = useState('Azizbek');
  const [numberA, setNumberA] = useState(19);
  const [numberB, setNumberB] = useState(5);
  const [outputLines, setOutputLines] = useState<string[]>([
    'Dastur ishga tushirishga tayyor. «Ishga tushirish» tugmasini bosing.',
  ]);

  // --- Mode 2: Typing Trainer ---
  const [promptIndex, setPromptIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [typingStartTime, setTypingStartTime] = useState<number | null>(null);
  const [typingEndTime, setTypingEndTime] = useState<number | null>(null);

  // --- Mode 3: Literacy Tools (Storage Converter & Phishing Detector) ---
  const [mbValue, setMbValue] = useState<number>(2048);
  const [phishingChoices, setPhishingChoices] = useState<Record<string, boolean | null>>({});

  const targetPrompt = TYPING_PROMPTS[promptIndex];

  const applyPreset = (id: PresetId) => {
    setPreset(id);
    if (id === 'greeting') {
      setStudentName('Azizbek');
      setNumberA(19);
      setNumberB(5);
    } else if (id === 'exam') {
      setStudentName('Madina');
      setNumberA(18);
      setNumberB(20);
    } else if (id === 'loop') {
      setStudentName('Dars');
      setNumberA(4);
      setNumberB(10);
    } else {
      setStudentName('Sardor');
      setNumberA(120000);
      setNumberB(20);
    }
    setOutputLines(['Namuna yuklandi. «Ishga tushirish» tugmasini bosing.']);
  };

  const runSimulation = () => {
    const cleanName = studentName.trim() || 'Foydalanuvchi';
    if (preset === 'greeting') {
      const yosh = numberA;
      const qoshimcha = numberB;
      const kelajakYosh = yosh + qoshimcha;
      const holat =
        yosh >= 18
          ? 'Siz voyaga yetgansiz — to‘liq kurslar ochiq!'
          : 'Siz yosh dasturchisiz — boshlang‘ich guruhga xush kelibsiz!';
      setOutputLines([
        `> Salom, ${cleanName}!`,
        `> Hozirgi yoshingiz: ${yosh}`,
        `> Shart tekshiruvi: ${holat}`,
        `> ${qoshimcha} yildan keyin yoshingiz ${kelajakYosh} da bo‘ladi.`,
      ]);
    } else if (preset === 'exam') {
      const ball = Math.min(numberA, numberB);
      const jami = Math.max(numberB, 1);
      const foiz = Math.round((ball / jami) * 100);
      const natija =
        foiz >= 75
          ? 'Tabriklaymiz, imtihondan muvaffaqiyatli o‘tdingiz!'
          : 'Natija pastroq — darslarni yana bir bor takrorlang.';
      setOutputLines([
        `> O‘quvchi: ${cleanName}`,
        `> Natija: ${ball} / ${jami} (${foiz}%)`,
        `> Baholash: ${natija}`,
      ]);
    } else if (preset === 'loop') {
      const count = Math.min(Math.max(numberA, 1), 8);
      const stepVal = numberB;
      const lines = [`> "${cleanName}" sikli ${count} marta ishga tushdi:`];
      for (let i = 1; i <= count; i += 1) {
        lines.push(`  [${i}-qadam] → ${cleanName} #${i} (qiymat: ${i * stepVal})`);
      }
      setOutputLines(lines);
    } else {
      const narx = Math.max(numberA, 0);
      const chegirmaFoiz = Math.min(Math.max(numberB, 0), 90);
      const tejash = Math.round((narx * chegirmaFoiz) / 100);
      const yakuniy = narx - tejash;
      setOutputLines([
        `> Xaridor: ${cleanName}`,
        `> Asl narx: ${narx.toLocaleString('uz-UZ')} so‘m`,
        `> Chegirma (${chegirmaFoiz}%): -${tejash.toLocaleString('uz-UZ')} so‘m`,
        `> To‘lov summasi: ${yakuniy.toLocaleString('uz-UZ')} so‘m`,
      ]);
    }
  };

  // Typing calculation
  const handleTypingChange = (val: string) => {
    if (typingStartTime === null && val.length > 0) {
      setTypingStartTime(Date.now());
    }
    setTypedText(val);
    if (val.length >= targetPrompt.length) {
      setTypingEndTime(Date.now());
    } else {
      setTypingEndTime(null);
    }
  };

  const resetTyping = (nextIdx?: number) => {
    if (typeof nextIdx === 'number') setPromptIndex(nextIdx);
    setTypedText('');
    setTypingStartTime(null);
    setTypingEndTime(null);
  };

  let correctChars = 0;
  for (let i = 0; i < typedText.length; i += 1) {
    if (typedText[i] === targetPrompt[i]) correctChars += 1;
  }
  const accuracyPct =
    typedText.length > 0 ? Math.round((correctChars / typedText.length) * 100) : 100;
  const elapsedMinutes =
    typingStartTime !== null
      ? Math.max(((typingEndTime ?? Date.now()) - typingStartTime) / 60000, 0.05)
      : 0;
  const wpm =
    typingStartTime !== null && typedText.length > 0
      ? Math.round(correctChars / 5 / elapsedMinutes)
      : 0;
  const isTypingDone = typedText.length >= targetPrompt.length;

  return (
    <section
      id="amaliyot"
      className="py-16 md:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-400 mb-2">
              Amaliy laboratoriya · Dasturlash va Savodxonlik
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              Nazariyani amalda sinab ko‘ring
            </h2>
            <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Kod yozish mantiqini, klaviaturada tez terishni, xavfli xabarlarni aniqlashni va
              xotira o‘lchov birliklarini bitta laboratoriyada mashq qiling.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Amaliy laboratoriya bo‘limlari"
            className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto max-w-full self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={labMode === 'code'}
              onClick={() => setLabMode('code')}
              className={`min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                labMode === 'code'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Kod sinagichi</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={labMode === 'typing'}
              onClick={() => setLabMode('typing')}
              className={`min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                labMode === 'typing'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Tez yozish</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={labMode === 'literacy'}
              onClick={() => setLabMode('literacy')}
              className={`min-h-[42px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                labMode === 'literacy'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Savodxonlik</span>
            </button>
          </div>
        </div>

        {/* LAB 1: CODE RUNNER */}
        {labMode === 'code' && (
          <div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-5 overflow-x-auto max-w-full">
              {(
                [
                  { id: 'greeting', label: '1. Shart (if/else)' },
                  { id: 'exam', label: '2. Ball hisoblash' },
                  { id: 'loop', label: '3. Sikl (Takrorlash)' },
                  { id: 'discount', label: '4. Chegirma' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyPreset(item.id)}
                  className={`min-h-[40px] px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    preset === item.id
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {preset === 'loop' ? 'element nomi' : 'ism (matn)'}
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {preset === 'greeting'
                        ? 'yosh (son)'
                        : preset === 'exam'
                          ? 'to‘plangan ball'
                          : preset === 'loop'
                            ? 'takrorlash soni (1-8)'
                            : 'tovar narxi'}
                    </label>
                    <input
                      type="number"
                      value={numberA}
                      onChange={(e) => setNumberA(Number(e.target.value) || 0)}
                      className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm font-mono tabular-nums bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {preset === 'greeting'
                        ? 'qo‘shiladigan yil'
                        : preset === 'exam'
                          ? 'jami savollar'
                          : preset === 'loop'
                            ? 'qadam qiymati'
                            : 'chegirma (%)'}
                    </label>
                    <input
                      type="number"
                      value={numberB}
                      onChange={(e) => setNumberB(Number(e.target.value) || 0)}
                      className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm font-mono tabular-nums bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <pre className="bg-slate-900 text-slate-100 font-mono text-xs p-4 rounded-xl overflow-x-auto leading-relaxed">
                  {preset === 'greeting' &&
                    `ism = "${studentName || 'Foydalanuvchi'}"\nyosh = ${numberA}\n\nekranga_chiqar("Salom, " + ism)\nagar (yosh >= 18) {\n  ekranga_chiqar("To‘liq kurslar ochiq!")\n} aks holda {\n  ekranga_chiqar("Boshlang‘ich guruh!")\n}\nyakuniy = yosh + ${numberB}`}
                  {preset === 'exam' &&
                    `oquvchi = "${studentName || 'Foydalanuvchi'}"\nball = ${Math.min(numberA, numberB)}\njami = ${Math.max(numberB, 1)}\nfoiz = (ball / jami) * 100\n\nagar (foiz >= 75) {\n  ekranga_chiqar("Imtihondan o‘tdingiz!")\n} aks holda {\n  ekranga_chiqar("Qayta tayyorlaning.")\n}`}
                  {preset === 'loop' &&
                    `nom = "${studentName || 'Dars'}"\nsoni = ${Math.min(Math.max(numberA, 1), 8)}\n\ntakrorla (i = 1 dan soni gacha) {\n  ekranga_chiqar(nom, i * ${numberB})\n}`}
                  {preset === 'discount' &&
                    `xaridor = "${studentName || 'Foydalanuvchi'}"\nnarx = ${Math.max(numberA, 0)}\nchegirma = ${Math.min(Math.max(numberB, 0), 90)}\n\ntejash = (narx * chegirma) / 100\nyakuniy_narx = narx - tejash\nekranga_chiqar(yakuniy_narx)`}
                </pre>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={runSimulation}
                    className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl sm:rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 shrink-0" />
                    <span>Ishga tushirish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyPreset('greeting')}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl sm:rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span>Tozalash</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 pb-3 mb-4 border-b border-slate-800">
                  <Terminal className="w-4 h-4 shrink-0" />
                  <span>Natija oynasi</span>
                </div>

                <div className="flex-1 font-mono text-xs sm:text-sm space-y-2.5 leading-relaxed text-emerald-300">
                  {outputLines.map((line, i) => (
                    <div key={`${line}-${i}`}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAB 2: TYPING SPEED TRAINER */}
        {labMode === 'typing' && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Klaviaturada tez va bexato yozish mashqi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pastdagi matnni qarasdan yozib ko‘ring — tezlik va aniqlik darhol hisoblanadi.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Tezlik</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-sky-700 dark:text-sky-400">
                    {wpm} so‘z/daq
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Aniqlik</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                    {accuracyPct}%
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-base sm:text-lg leading-relaxed select-none">
              {targetPrompt.split('').map((ch, idx) => {
                let cls = 'text-slate-400 dark:text-slate-500';
                if (idx < typedText.length) {
                  cls =
                    typedText[idx] === ch
                      ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                      : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 underline';
                }
                return (
                  <span key={idx} className={cls}>
                    {ch}
                  </span>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={typedText}
              onChange={(e) => handleTypingChange(e.target.value)}
              placeholder="Shu yerga yozishni boshlang..."
              className="w-full px-4 py-3 font-mono text-base bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-medium">
                {isTypingDone ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Ajoyib! Matn to‘liq terib tugatildi.
                  </span>
                ) : (
                  <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                    Kiritildi: {typedText.length} / {targetPrompt.length} belgi
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  type="button"
                  onClick={() => resetTyping()}
                  className="min-h-[44px] px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-lg cursor-pointer"
                >
                  Qaytadan yozish
                </button>
                <button
                  type="button"
                  onClick={() => resetTyping((promptIndex + 1) % TYPING_PROMPTS.length)}
                  className="min-h-[44px] px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 rounded-xl sm:rounded-lg cursor-pointer"
                >
                  Keyingi matn →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LAB 3: LITERACY TOOLS (STORAGE CONVERTER + PHISHING DETECTOR) */}
        {labMode === 'literacy' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Storage Converter */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Xotira o‘lchov birliklari konvertori
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Megabayt (MB) qiymatini kiriting — kompyuter qolgan birliklarni hisoblaydi.
                </p>
              </div>

              <div>
                <label
                  htmlFor="mb-input"
                  className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1"
                >
                  Hajm (Megabayt — MB)
                </label>
                <input
                  id="mb-input"
                  type="number"
                  min={0}
                  value={mbValue}
                  onChange={(e) => setMbValue(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full min-h-[44px] px-3.5 py-2 text-base sm:text-sm font-mono tabular-nums bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                <div className="py-2.5 flex justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Gigabayt (GB)</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    {(mbValue / 1024).toFixed(2)} GB
                  </span>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Kilobayt (KB)</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    {(mbValue * 1024).toLocaleString('uz-UZ')} KB
                  </span>
                </div>
                <div className="py-2.5 flex justify-between gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Bayt (B)</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    {(mbValue * 1024 * 1024).toLocaleString('uz-UZ')} B
                  </span>
                </div>
              </div>
            </div>

            {/* Phishing Detector Exercise */}
            <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Xavfsizlik mashqi: Soxta xabarni (Fishing) aniqlang
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Har bir kelgan xabarni o‘qib, u ishonchli yoki firibgarlik ekanini belgilang.
                </p>
              </div>

              <div className="space-y-4">
                {PHISHING_CASES.map((item) => {
                  const chosen = phishingChoices[item.id];
                  const hasChosen = chosen !== undefined && chosen !== null;
                  const isCorrect = chosen === item.isPhishing;

                  return (
                    <div
                      key={item.id}
                      className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3"
                    >
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        Kimdan: {item.sender}
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {item.text}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPhishingChoices((prev) => ({ ...prev, [item.id]: false }))
                          }
                          className={`min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border cursor-pointer ${
                            chosen === false
                              ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Xavfsiz xabar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setPhishingChoices((prev) => ({ ...prev, [item.id]: true }))
                          }
                          className={`min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border cursor-pointer ${
                            chosen === true
                              ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                          <span>Soxta (Fishing)</span>
                        </button>
                      </div>

                      {hasChosen && (
                        <div
                          className={`pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex items-start gap-1.5 ${
                            isCorrect
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          )}
                          <span>
                            <strong>{isCorrect ? 'To‘g‘ri!' : 'Ehtiyot bo‘ling:'}</strong>{' '}
                            {item.reason}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
