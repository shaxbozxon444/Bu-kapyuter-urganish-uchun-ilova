import { useState } from 'react';
import { Check, ChevronRight, Lock, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { LessonItem } from '../data/curriculum';

interface LessonInteractiveWidgetProps {
  type: LessonItem['widgetType'];
}

export function LessonInteractiveWidget({ type }: LessonInteractiveWidgetProps) {
  const [activePart, setActivePart] = useState<'cpu' | 'ram' | 'ssd'>('cpu');
  const [activeOs, setActiveOs] = useState<'windows' | 'macos' | 'linux'>('windows');
  const [activeExt, setActiveExt] = useState<'.docx' | '.jpg' | '.mp4' | '.py'>('.docx');
  const [activeShortcut, setActiveShortcut] = useState<string>('Ctrl + C');
  const [excelNums, setExcelNums] = useState<[number, number, number]>([12, 18, 25]);
  const [samplePassword, setSamplePassword] = useState<string>('Salom2026!');
  const [charInput, setCharInput] = useState<string>('A');
  const [algoStep, setAlgoStep] = useState<number>(0);
  const [isRaining, setIsRaining] = useState<boolean>(true);
  const [loopCount, setLoopCount] = useState<number>(3);
  const [webStep, setWebStep] = useState<'frontend' | 'api' | 'backend'>('frontend');
  const [activeLang, setActiveLang] = useState<'html' | 'css' | 'js' | 'python'>('html');

  if (type === 'hardware') {
    const details = {
      cpu: {
        name: 'Protsessor (CPU)',
        metric: 'Tezligi: 3.5 — 5.0 GHz',
        desc: 'Soniyasiga milliardlab buyruqlarni bajaradi. Qancha kuchli bo‘lsa, murakkab amallar shuncha tez hisoblanadi.',
      },
      ram: {
        name: 'Tezkor xotira (RAM)',
        metric: 'Hajmi: 8 GB — 32 GB',
        desc: 'Ayni damda ochiq turgan brauzer, o‘yin va dasturlarni ushlab turadi. Elektr o‘chsa, tozalanadi.',
      },
      ssd: {
        name: 'Doimiy xotira (SSD)',
        metric: 'Hajmi: 256 GB — 2 TB',
        desc: 'Rasm, video va tizim fayllarini kompyuter o‘chganida ham saqlab qoladi.',
      },
    };
    const current = details[activePart];

    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
          Sinab ko‘ring: qismni tanlang
        </p>
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-3">
          {(['cpu', 'ram', 'ssd'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActivePart(key)}
              className={`flex-1 min-w-[76px] min-h-[40px] py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePart === key
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-slate-900 dark:text-white">{current.name}</span>
            <span className="font-mono text-xs text-sky-700 dark:text-sky-400 tabular-nums">
              {current.metric}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">{current.desc}</p>
        </div>
      </div>
    );
  }

  if (type === 'os') {
    const osDetails = {
      windows:
        'Windows — ofis ishlari, o‘yinlar va kundalik foydalanish uchun eng keng tarqalgan tizim.',
      macos:
        'macOS — Apple MacBook va iMac kompyuterlari uchun yaratilgan barqaror va dizaynerlar sevadigan tizim.',
      linux:
        'Linux — bepul, ochiq kodli tizim; internet serverlarining 90% dan ortig‘i va dasturchilar foydalanadi.',
    };

    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
          Operatsion tizimni solishtiring:
        </p>
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-3">
          {(['windows', 'macos', 'linux'] as const).map((os) => (
            <button
              key={os}
              type="button"
              onClick={() => setActiveOs(os)}
              className={`flex-1 min-h-[40px] py-2 px-3 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeOs === os
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {os === 'macos' ? 'macOS' : os === 'windows' ? 'Windows' : 'Linux'}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {osDetails[activeOs]}
        </p>
      </div>
    );
  }

  if (type === 'files') {
    const extInfo: Record<'.docx' | '.jpg' | '.mp4' | '.py', string> = {
      '.docx': 'Matnli hujjat (Microsoft Word / Google Docs) — insho, rezyume va xatlar uchun.',
      '.jpg': 'Siqilgan rasm fayli — suratlar va veb-tasvirlarni saqlash uchun eng keng tarqalgan format.',
      '.mp4': 'Video va ovoz fayli — darsliklar, filmlar va videoroliklar shu formatda saqlanadi.',
      '.py': 'Python dasturlash tili kodi — kompyuter bajaradigan buyruqlar matni.',
    };

    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
          Kengaytma ustiga bosing:
        </p>
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-3">
          {(['.docx', '.jpg', '.mp4', '.py'] as const).map((ext) => (
            <button
              key={ext}
              type="button"
              onClick={() => setActiveExt(ext)}
              className={`flex-1 min-h-[40px] py-2 px-2.5 font-mono text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeExt === ext
                  ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {ext}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {extInfo[activeExt]}
        </p>
      </div>
    );
  }

  if (type === 'shortcuts') {
    const shortcuts: Record<string, { title: string; detail: string }> = {
      'Ctrl + C': {
        title: 'Nusxa olish (Copy)',
        detail: 'Belgilangan matn yoki faylni asl joyidan o‘chirmasdan xotiraga ko‘chiradi.',
      },
      'Ctrl + V': {
        title: 'Joylashtirish (Paste)',
        detail: 'Xotiraga olingan matn yoki faylni kursor turgan yangi joyga qo‘yadi.',
      },
      'Ctrl + X': {
        title: 'Qirqib olish (Cut)',
        detail: 'Fayl yoki matnni eski joyidan olib, yangi joyga ko‘chirishga tayyorlaydi.',
      },
      'Ctrl + Z': {
        title: 'Orqaga qaytarish (Undo)',
        detail: 'Adashib o‘chirib yuborilgan matn yoki xato harakatni darhol tiklaydi.',
      },
      'Ctrl + S': {
        title: 'Saqlash (Save)',
        detail: 'Yozilgan hujjatni kompyuter xotirasiga yozib qo‘yadi.',
      },
    };
    const info = shortcuts[activeShortcut];

    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
          Tugmani tanlab vazifasini ko‘ring:
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {Object.keys(shortcuts).map((combo) => (
            <button
              key={combo}
              type="button"
              onClick={() => setActiveShortcut(combo)}
              className={`min-h-[40px] px-3 py-2 font-mono text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeShortcut === combo
                  ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-500'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {combo}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white">{info.title}:</span>{' '}
          {info.detail}
        </p>
      </div>
    );
  }

  if (type === 'office') {
    const sum = excelNums[0] + excelNums[1] + excelNums[2];

    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
          Mini Excel formulasi (=SUM): sonlarni o‘zgartiring
        </p>
        <div className="grid grid-cols-4 gap-2 items-center">
          {excelNums.map((num, idx) => (
            <div key={idx}>
              <div className="text-[10px] font-mono text-slate-400 mb-0.5">
                A{idx + 1}
              </div>
              <input
                type="number"
                aria-label={`Katakcha A${idx + 1}`}
                value={num}
                onChange={(e) => {
                  const next = [...excelNums] as [number, number, number];
                  next[idx] = Number(e.target.value) || 0;
                  setExcelNums(next);
                }}
                className="w-full min-h-[42px] px-2 py-1.5 text-base sm:text-xs font-mono tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          ))}
          <div>
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mb-0.5">
              =SUM(A1:A3)
            </div>
            <div className="min-h-[42px] flex items-center justify-center px-2 py-1.5 text-xs font-mono font-bold tabular-nums bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-emerald-800 dark:text-emerald-300 text-center">
              {sum}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'security') {
    const hasLength = samplePassword.length >= 8;
    const hasNumber = /\d/.test(samplePassword);
    const hasUpper = /[A-Z]/.test(samplePassword);
    const hasSymbol = /[^A-Za-z0-9]/.test(samplePassword);
    const score = [hasLength, hasNumber, hasUpper, hasSymbol].filter(Boolean).length;
    const isStrong = score >= 3;

    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <label
          htmlFor="pw-check"
          className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2"
        >
          Parol mustahkamligini tekshirib ko‘ring:
        </label>
        <div className="relative mb-2.5">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="pw-check"
            type="text"
            value={samplePassword}
            onChange={(e) => setSamplePassword(e.target.value)}
            placeholder="Parol yozib ko‘ring..."
            className="w-full min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="flex items-center justify-between gap-2 text-xs">
          <span
            className={`inline-flex items-center gap-1.5 font-medium ${
              isStrong
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-amber-700 dark:text-amber-400'
            }`}
          >
            {isStrong ? (
              <ShieldCheck className="w-4 h-4 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 shrink-0" />
            )}
            {isStrong ? 'Ishonchli parol' : 'Kuchsiz parol — belgi va raqam qo‘shing'}
          </span>
          <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            {score}/4 mezon
          </span>
        </div>
      </div>
    );
  }

  if (type === 'binary') {
    const safeChar = charInput.slice(-1) || 'A';
    const code = safeChar.charCodeAt(0);
    const binary = code.toString(2).padStart(8, '0');

    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          Istalgan bitta harf yozing — kompyuter uni 0 va 1 ga aylantiradi:
        </p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            aria-label="Harf kiriting"
            value={safeChar}
            onChange={(e) => setCharInput(e.target.value)}
            maxLength={2}
            className="w-12 h-11 text-center font-mono text-base font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1 min-h-[44px] flex items-center bg-slate-900 dark:bg-slate-950 text-sky-300 font-mono text-sm px-3 py-2 rounded-lg tracking-wider tabular-nums border border-slate-800">
            {binary}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'algorithm') {
    const steps = [
      '1. Choynakni tozalab, quruq choy solish',
      '2. Qaynab turgan suvni quyish',
      '3. 5 daqiqa damlanishini kutish',
      '4. Piyolaga quyib, dasturxonga tortish',
    ];

    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Choy damlash algoritmi:
          </span>
          <button
            type="button"
            onClick={() => setAlgoStep((prev) => (prev + 1) % steps.length)}
            className="min-h-[40px] px-2.5 text-xs font-medium text-sky-700 dark:text-sky-400 hover:text-sky-800 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Keyingi qadam →
          </button>
        </div>
        <div className="space-y-1.5">
          {steps.map((step, index) => {
            const done = index <= algoStep;
            return (
              <div
                key={step}
                className={`flex items-center gap-2 text-xs py-1 transition-colors ${
                  index === algoStep
                    ? 'font-semibold text-slate-900 dark:text-white'
                    : done
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <Check
                  className={`w-3.5 h-3.5 shrink-0 ${
                    done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (type === 'ifelse') {
    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Shartni o‘zgartirib ko‘ring:
          </span>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setIsRaining(true)}
              className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isRaining
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Yomg‘ir bor
            </button>
            <button
              type="button"
              onClick={() => setIsRaining(false)}
              className={`min-h-[40px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !isRaining
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Quyoshli
            </button>
          </div>
        </div>
        <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 font-mono text-xs p-3 rounded-lg overflow-x-auto leading-relaxed border border-slate-800">
          <code>
            <span className={isRaining ? 'text-sky-300 font-semibold' : 'text-slate-400'}>
              {`agar (yomgir == ha) {\n  natija = "Soyabon oling!"\n}`}
            </span>
            {'\n'}
            <span className={!isRaining ? 'text-emerald-300 font-semibold' : 'text-slate-400'}>
              {`aks holda {\n  natija = "Ko‘zoynak taqing!"\n}`}
            </span>
          </code>
        </pre>
      </div>
    );
  }

  if (type === 'loops') {
    const items = ['Olma', 'Banan', 'Uzum', 'Anor', 'Gilos'].slice(0, loopCount);
    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Takrorlash soni (for sikli):
          </span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {[2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setLoopCount(n)}
                className={`min-h-[40px] min-w-[36px] px-2.5 py-1.5 font-mono text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  loopCount === n
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 dark:bg-slate-950 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800 space-y-1">
          {items.map((item, i) => (
            <div key={item}>
              [{i}] → {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'webarch') {
    const webInfo = {
      frontend:
        'Frontend (Brauzer) — foydalanuvchi ko‘radigan sahifa, tugma va dizayn qismi.',
      api: 'API (Ko‘prik) — brauzer yuborgan so‘rovni serverga, javobni esa ekranga eltuvchi elchi.',
      backend:
        'Backend (Server va Baza) — ma’lumotlarni xavfsiz saqlaydigan va hisoblaydigan orqa qism.',
    };
    return (
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
          So‘rov yo‘lini bosib ko‘ring:
        </p>
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-3">
          {(['frontend', 'api', 'backend'] as const).map((step) => (
            <button
              key={step}
              type="button"
              onClick={() => setWebStep(step)}
              className={`flex-1 min-h-[40px] py-2 px-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                webStep === step
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {step === 'frontend' ? 'Frontend' : step === 'api' ? 'API' : 'Backend'}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {webInfo[webStep]}
        </p>
      </div>
    );
  }

  const langDetails = {
    html: 'HTML — sahifaning skeleti: sarlavhalar, matnlar, rasmlar va tugmalarni joylashtiradi.',
    css: 'CSS — sahifaning dizayni: ranglar, shriftlar, o‘lcham va chiroyli ko‘rinishni beradi.',
    js: 'JavaScript — sahifaning harakati: tugmalar bosilganda testni tekshiradi va animatsiya qo‘shadi.',
    python:
      'Python — sodda va kuchli til: sun’iy intellekt, ma’lumotlar tahlili va serverlar uchun ishlatiladi.',
  };

  return (
    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
        Til vazifasini tanlang:
      </p>
      <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-3">
        {(['html', 'css', 'js', 'python'] as const).map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveLang(lang)}
            className={`flex-1 min-h-[40px] py-2 px-2.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeLang === lang
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {lang === 'js' ? 'JavaScript' : lang.toUpperCase()}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {langDetails[activeLang]}
      </p>
    </div>
  );
}
