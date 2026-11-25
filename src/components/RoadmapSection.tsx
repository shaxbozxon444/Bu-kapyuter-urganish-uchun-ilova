import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Flame,
  Monitor,
  Video,
} from 'lucide-react';
import type {
  CertificateRecord,
  ChallengeItem,
  LessonCategory,
  LessonItem,
  VideoLessonItem,
} from '../data/curriculum';
import { ResilientImage } from './ResilientImage';

interface RoadmapSectionProps {
  activeTrack: LessonCategory;
  onSelectTrack: (track: LessonCategory) => void;
  videos: VideoLessonItem[];
  watchedVideos: string[];
  lessons: LessonItem[];
  completedLessons: string[];
  challenges: ChallengeItem[];
  solvedChallenges: string[];
  attemptsUsed: number;
  maxAttempts: number;
  certificates: CertificateRecord[];
  onGoVideos: () => void;
  onGoLessons: () => void;
  onGoChallenges: () => void;
  onGoExam: () => void;
  onGoCertificates: () => void;
}

export function RoadmapSection({
  activeTrack,
  onSelectTrack,
  videos,
  watchedVideos,
  lessons,
  completedLessons,
  challenges,
  solvedChallenges,
  attemptsUsed,
  maxAttempts,
  certificates,
  onGoVideos,
  onGoLessons,
  onGoChallenges,
  onGoExam,
  onGoCertificates,
}: RoadmapSectionProps) {
  const isProg = activeTrack === 'programming';

  const trackVideos = videos.filter((v) => v.category === activeTrack);
  const trackLessons = lessons.filter((l) => l.category === activeTrack);
  const trackChallenges = challenges.filter((c) => c.category === activeTrack);

  const doneVideos = trackVideos.filter((v) => watchedVideos.includes(v.id)).length;
  const doneLessons = trackLessons.filter((l) => completedLessons.includes(l.id)).length;
  const doneChallenges = trackChallenges.filter((c) => solvedChallenges.includes(c.id)).length;
  const trackCert = certificates.find(
    (c) => c.scope === activeTrack || c.scope === 'all'
  );
  const remainingAttempts = Math.max(0, maxAttempts - attemptsUsed);

  const totalSteps = trackVideos.length + trackLessons.length + trackChallenges.length;
  const completedSteps = doneVideos + doneLessons + doneChallenges;
  const readinessPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const steps = [
    {
      num: '01',
      title: 'Animatsion videodarslarni ko‘rish',
      desc: 'Har bir mavzuning asosiy mohiyatini qisqa ssenariyli videolar va tezkor savol orqali tushunib oling.',
      done: doneVideos,
      total: trackVideos.length,
      icon: Video,
      actionLabel: doneVideos === trackVideos.length ? 'Takrorlash' : 'Videolarga o‘tish',
      onAction: onGoVideos,
    },
    {
      num: '02',
      title: 'Chuqurlashtirilgan mini-darslarni o‘qish',
      desc: 'Hayotiy misollar va interaktiv simulyatorlar (DNS, Excel, Ikkilik kod, Funksiya) bilan nazariyani mustahkamlang.',
      done: doneLessons,
      total: trackLessons.length,
      icon: BookOpen,
      actionLabel: doneLessons === trackLessons.length ? 'Ko‘rib chiqish' : 'Darslarni ochish',
      onAction: onGoLessons,
    },
    {
      num: '03',
      title: 'Qiyin amaliy masalalarni yechish',
      desc: 'Hisob-kitob, kod kuzatuvi (trace) va xatolarni topish bo‘yicha murakkab masalalarni mustaqil ishlang.',
      done: doneChallenges,
      total: trackChallenges.length,
      icon: Flame,
      actionLabel:
        doneChallenges === trackChallenges.length ? 'Yana mashq qilish' : 'Masalalarni yechish',
      onAction: onGoChallenges,
    },
    {
      num: '04',
      title: `Yakuniy imtihon (Qolgan imkoniyat: ${remainingAttempts}/${maxAttempts})`,
      desc: '20 ta murakkab savoldan kamida 15 tasiga (75%) to‘g‘ri javob bering. Har bir yo‘nalishga faqat 3 marta urinish beriladi!',
      done: trackCert ? 1 : attemptsUsed > 0 ? 1 : 0,
      total: 1,
      icon: ClipboardCheck,
      actionLabel: 'Imtihonga kirish',
      onAction: onGoExam,
    },
    {
      num: '05',
      title: 'Rasmiy BilimKod sertifikatini olish',
      desc: 'Imtihondan o‘tganingizdan so‘ng ustoz (Admin panel) orqali rasmiy sertifikatingiz chiqariladi va yuklab olishingiz mumkin bo‘ladi.',
      done: trackCert ? 1 : 0,
      total: 1,
      icon: Award,
      actionLabel: 'Sertifikatlarni ko‘rish',
      onAction: onGoCertificates,
    },
  ];

  return (
    <section className="py-10 md:py-14 bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-8rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
          <div>
            <p
              className={`text-sm font-semibold mb-1.5 ${
                isProg ? 'text-indigo-700 dark:text-indigo-400' : 'text-sky-700 dark:text-sky-400'
              }`}
            >
              Bosqichma-bosqich o‘quv rejasi
            </p>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              {isProg
                ? 'Dasturlash asoslari: O‘quv yo‘l xaritasi'
                : 'Kompyuter savodxonligi: O‘quv yo‘l xaritasi'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1.5 max-w-2xl">
              Imtihonda 3 ta imkoniyatdan unumli foydalanish va sertifikat olish uchun quyidagi 5 ta
              bosqichni ketma-ket bajaring.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Yo‘l xaritasi temasi"
            className="inline-flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl self-start"
          >
            <button
              type="button"
              onClick={() => onSelectTrack('literacy')}
              className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !isProg
                  ? 'bg-white dark:bg-slate-950 text-sky-700 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 shrink-0" />
              <span>Savodxonlik</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTrack('programming')}
              className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isProg
                  ? 'bg-white dark:bg-slate-950 text-indigo-700 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 shrink-0" />
              <span>Dasturlash</span>
            </button>
          </div>
        </div>

        {/* Readiness Summary Card with Engaging Visual */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden mb-7 grid grid-cols-1 md:grid-cols-12 items-stretch">
          <div className="md:col-span-4 aspect-[4/3] md:aspect-auto bg-slate-100 dark:bg-slate-800">
            <ResilientImage
              src="/src/assets/images/mobile_coding_journey_1795425391520.jpg"
              alt="Telefondan bosqichma-bosqich o‘rganish, mashq qilish va sertifikat olish yo‘l xaritasi"
              fallbackTitle="5 bosqichli o‘quv yo‘l xaritasi"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-8 p-5 sm:p-6 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Imtihonga tayyorgarlik darajangiz
                </div>
                <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {readinessPct >= 80
                    ? 'Ajoyib! Siz murakkab imtihonga tayyorsiz.'
                    : readinessPct >= 40
                      ? 'Yaxshi sur’at — barcha dars va masalalarni yakunlang.'
                      : 'Avval video, dars va masalalarni ishlab chiqing.'}
                </div>
              </div>
              <div
                className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${
                  isProg ? 'text-indigo-700 dark:text-indigo-400' : 'text-sky-700 dark:text-sky-400'
                }`}
              >
                {readinessPct}%
              </div>
            </div>

            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isProg ? 'bg-indigo-600' : 'bg-sky-600'
                }`}
                style={{ width: `${readinessPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 5 Sequential Roadmap Stages */}
        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isComplete = step.total > 0 && step.done >= step.total;
            return (
              <div
                key={step.num}
                className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isComplete
                    ? 'border-emerald-300 dark:border-emerald-800'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isComplete
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : isProg
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400'
                          : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                      <span className="font-mono font-semibold">{step.num}-bosqich</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {step.done} / {step.total} bajarildi
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={step.onAction}
                  className={`min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer self-stretch sm:self-center ${
                    isProg
                      ? 'text-white bg-indigo-600 hover:bg-indigo-500'
                      : 'text-white bg-slate-900 dark:bg-sky-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-sky-400'
                  }`}
                >
                  <span>{step.actionLabel}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
