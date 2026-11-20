export type LessonCategory = 'literacy' | 'programming';

export interface LessonItem {
  id: string;
  number: string;
  category: LessonCategory;
  categoryLabel: string;
  readTime: string;
  title: string;
  summary: string;
  analogyTitle: string;
  analogyText: string;
  keyPoints: string[];
  widgetType:
    | 'hardware'
    | 'os'
    | 'files'
    | 'shortcuts'
    | 'office'
    | 'security'
    | 'binary'
    | 'algorithm'
    | 'ifelse'
    | 'loops'
    | 'webarch'
    | 'languages';
}

export interface DidYouKnowItem {
  id: string;
  topic: string;
  question: string;
  hint: string;
  answer: string;
}

export interface ExamQuestion {
  id: number;
  category: LessonCategory;
  categoryLabel: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  category: LessonCategory;
  shortDesc: string;
  example: string;
}

export type VideoVisualType =
  | 'hardware'
  | 'files'
  | 'shortcuts'
  | 'security'
  | 'binary'
  | 'algorithm'
  | 'ifelse'
  | 'loops_web';

export interface VideoScene {
  label: string;
  title: string;
  subtitle: string;
  durationSec: number;
  visualKind: 'hook' | 'analogy' | 'demo' | 'summary';
  highlightText: string;
}

export interface VideoLessonItem {
  id: string;
  number: string;
  category: LessonCategory;
  categoryLabel: string;
  title: string;
  shortDesc: string;
  durationLabel: string;
  visualType: VideoVisualType;
  externalUrl?: string;
  scenes: VideoScene[];
  quickCheck: {
    question: string;
    options: [string, string, string];
    correctIndex: 0 | 1 | 2;
  };
}

export const LESSONS: LessonItem[] = [
  // --- 1-MODUL: KOMPYUTER SAVODXONLIGI (01 - 06) ---
  {
    id: 'hardware',
    number: '01',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Kompyuter qismlari: Protsessor, RAM va Xotira',
    summary:
      'Kompyuter tez va barqaror ishlashi uchun uning uchta asosiy qismi — Protsessor (CPU), Tezkor xotira (RAM) va Doimiy xotira (SSD/HDD) hamkorlikda ishlaydi.',
    analogyTitle: 'Hayotiy misol: Oshxona qiyosi',
    analogyText:
      'Protsessor — taom tayyorlayotgan oshpaz. RAM (tezkor xotira) — oshpaz hozir foydalanayotgan ish stoli. SSD yoki qattiq disk esa — barcha mahsulotlar uzoq muddat saqlanadigan omborxona.',
    keyPoints: [
      'Protsessor (CPU) — barcha hisob-kitob va buyruqlarni bajaruvchi kompyuterning "miyasi".',
      'RAM (Tezkor xotira) — ochiq dasturlarni vaqtincha saqlaydi; elektr o‘chsa, undagi ma’lumot o‘chadi.',
      'SSD / HDD (Qattiq disk) — rasm, video, hujjat va dasturlarni doimiy saqlovchi xotira.',
    ],
    widgetType: 'hardware',
  },
  {
    id: 'os-desktop',
    number: '02',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Operatsion tizim va Ish stoli bilan ishlash',
    summary:
      'Operatsion tizim (Windows, macOS, Linux) — kompyuterning barcha qismlari va dasturlarini boshqarib turuvchi asosiy tizimdir.',
    analogyTitle: 'Hayotiy misol: Bino boshqaruvchisi',
    analogyText:
      'Operatsion tizim xuddi katta ofis binosining boshqaruvchisiga o‘xshaydi: u chiroqni yoqadi, xonalarga kalit beradi va barcha ishchilar (dasturlar)ning bir-biriga xalaqit bermasdan ishlashini ta’minlaydi.',
    keyPoints: [
      'Windows — dunyoda eng keng tarqalgan tizim; macOS — Apple kompyuterlarida, Linux esa ko‘proq serverlar va dasturchilar orasida ishlatiladi.',
      'Ish stoli (Desktop) — asosiy ekran, Vazifalar paneli (Taskbar) esa ochiq dasturlar orasida tez almashish joyidir.',
      'Kompyuterni to‘g‘ridan-to‘g‘ri tokdan uzmasdan, "O‘chirish" (Shut down) tugmasi orqali yopish kerak.',
    ],
    widgetType: 'os',
  },
  {
    id: 'files',
    number: '03',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '2 daqiqa',
    title: 'Fayllar va papkalar bilan tartibli ishlash',
    summary:
      'Kompyuterdagi har bir ma’lumot fayl ko‘rinishida saqlanadi. Papkalar esa ularni mavzular bo‘yicha tartibga solib turishga yordam beradi.',
    analogyTitle: 'Hayotiy misol: Qog‘oz jildlari',
    analogyText:
      'Fayl — bitta varaq hujjat yoki rasm. Papka esa shu varaqlarni tartib bilan solib qo‘yiladigan maxsus jild. Fayl nomidan keyingi kengaytma (.pdf, .jpg) uning turini bildiradi.',
    keyPoints: [
      '.docx va .pdf — matnli va rasmiy hujjatlar uchun ishlatiladi.',
      '.jpg va .png — rasm va grafik tasvirlar formati.',
      '.mp4 — video fayllar, .zip — siqilgan arxiv, .py yoki .html esa dastur kodlari fayllari.',
    ],
    widgetType: 'files',
  },
  {
    id: 'shortcuts',
    number: '04',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Foydali klaviatura tugmalari (Tezkor birikmalar)',
    summary:
      'Sichqoncha bilan menyularni izlab vaqt yo‘qotmaslik uchun klaviaturadagi tezkor tugma birikmalarini bilish ish unumdorligini bir necha barobar oshiradi.',
    analogyTitle: 'Hayotiy misol: Qisqa yo‘lakcha',
    analogyText:
      'Har safar uzoq aylanma yo‘ldan yurish o‘rniga to‘g‘ri va tez yetib boradigan qisqa yo‘lakdan foydalangandek, Ctrl + C va Ctrl + V ishingizni soniyalar ichida bajaradi.',
    keyPoints: [
      'Ctrl + C (nusxa olish), Ctrl + X (qirqib olish) va Ctrl + V (joylashtirish).',
      'Ctrl + Z — oxirgi xato harakatni darhol orqaga qaytaradi (bekor qiladi).',
      'Ctrl + S — hujjatni saqlash, Ctrl + F — sahifa ichidan so‘z qidirish.',
    ],
    widgetType: 'shortcuts',
  },
  {
    id: 'office-web',
    number: '05',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Ofis dasturlari, Brauzer va Elektron pochta',
    summary:
      'Zamonaviy ish faoliyatida matn terish (Word), jadvalda hisoblash (Excel), internetdan ma’lumot izlash va rasmiy elektron xat (Email) yuborish asosiy ko‘nikmadir.',
    analogyTitle: 'Hayotiy misol: Raqamli daftar va pochta',
    analogyText:
      'Word — chiroyli yozuv daftari, Excel — avtomatik hisoblovchi daftar, Brauzer — dunyo kutubxonasining eshigi, Elektron pochta esa bir soniyada yetib boradigan rasmiy maktubdir.',
    keyPoints: [
      'Excel dasturida har bir formula "=" belgisidan boshlanadi (masalan: =SUM(A1:A5)).',
      'Google qidiruvida aniq iborani topish uchun so‘zlarni qo‘shtirnoq ("...") ichida yozing.',
      'Elektron xat yuborganda "Mavzu" (Subject) qismini aniq yozish rasmiy madaniyat belgisidir.',
    ],
    widgetType: 'office',
  },
  {
    id: 'security',
    number: '06',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Internet xavfsizligi va raqamli gigiyena',
    summary:
      'Internetdan foydalanganda shaxsiy ma’lumotlar, parollar va bank kartalarini firibgarlardan himoya qilish har bir foydalanuvchi uchun majburiy ko‘nikmadir.',
    analogyTitle: 'Hayotiy misol: Uy eshigi va qulf',
    analogyText:
      'Oddiy "123456" paroli xuddi eshikni ochiq qoldirishga o‘xshaydi. Murakkab parol va ikki bosqichli tasdiqlash (2FA) esa eshikka ishonchli qulf va qo‘riqchi qo‘yish demakdir.',
    keyPoints: [
      'Parol kamida 8–12 ta belgidan iborat bo‘lib, katta-kichik harf, raqam va belgilarni o‘z ichiga olishi kerak.',
      'Sayt manzili "https://" bilan boshlanishi va qulf belgisi bo‘lishi ma’lumot shifrlanganini bildiradi.',
      'Noma’lum xabarlardagi shubhali havolalarga (fishing) hech qachon kirmang va SMS kodlarni birovga bermang.',
    ],
    widgetType: 'security',
  },

  // --- 2-MODUL: DASTURLASH ASOSLARI (07 - 12) ---
  {
    id: 'programming-intro',
    number: '07',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '3 daqiqa',
    title: 'Dasturlash nima va kompyuter bizni qanday tushunadi?',
    summary:
      'Dasturlash — bu kompyuterga aniq vazifalarni bajarishi uchun u tushunadigan tilda ketma-ket ko‘rsatmalar (kod) yozish jarayonidir.',
    analogyTitle: 'Hayotiy misol: Chet ellik tarjimon',
    analogyText:
      'Kompyuter aslida faqat elektr toki bor (1) yoki yo‘q (0) holatini tushunadi. Dasturlash tillari esa inson tiliga yaqin buyruqlarni kompyuterning 0 va 1 tiliga o‘girib beruvchi tarjimondir.',
    keyPoints: [
      'Kompyuterning eng kichik axborot birligi — bit (0 yoki 1).',
      '8 ta bit birlashib 1 baytni tashkil qiladi (1024 bayt = 1 kilobayt).',
      'Dasturchi muammoni hal qilish rejasini tuzadi va uni dasturlash tilida yozadi.',
    ],
    widgetType: 'binary',
  },
  {
    id: 'algorithm',
    number: '08',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '3 daqiqa',
    title: 'Algoritm tushunchasi: Aniq qadamlar ketma-ketligi',
    summary:
      'Algoritm — ma’lum bir natijaga erishish uchun bajarilishi kerak bo‘lgan aniq, tushunarli va tartibli amallar ketma-ketligidir.',
    analogyTitle: 'Hayotiy misol: Choy damlash retsepti',
    analogyText:
      'Choy damlashda avval choynakka quruq choy solinadi, keyin qaynoq suv quyiladi va 5 daqiqa kutiladi. Qadamlarni almashtirib qo‘ysangiz, kutilgan natija chiqmaydi — dasturda ham xuddi shunday.',
    keyPoints: [
      'Har bir algoritmning boshlanishi (kirish ma’lumoti) va tugashi (natija) bo‘ladi.',
      'Qadamlar noaniq bo‘lmasligi lozim — kompyuter taxmin qila olmaydi, faqat aniq buyruqni bajaradi.',
      'Buyuk ajdodimiz Muhammad al-Xorazmiy nomi "algoritm" atamasining kelib chiqishiga asos bo‘lgan.',
    ],
    widgetType: 'algorithm',
  },
  {
    id: 'variables-conditions',
    number: '09',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '4 daqiqa',
    title: 'O‘zgaruvchilar va shart operatorlari (Agar — Aks holda)',
    summary:
      'O‘zgaruvchi — ma’lumot saqlaydigan nomlangan quti. Shart operatorlari esa vaziyatga qarab dasturning qaysi yo‘ldan borishini belgilaydi.',
    analogyTitle: 'Hayotiy misol: Ob-havo va soyabon',
    analogyText:
      'Uydan chiqayotganda: "AGAR tashqarida yomg‘ir yog‘ayotgan bo‘lsa — soyabon ol, AKS HOLDA — quyosh ko‘zoynagini taq". Dasturlar ham har soniyada shunday qarorlar qabul qiladi.',
    keyPoints: [
      'O‘zgaruvchi misoli: ism = "Madina", ball = 95. Quti ichidagi qiymat istalgan payt o‘zgarishi mumkin.',
      'Agar (if) shart to‘g‘ri bo‘lsa, birinchi amal bajariladi.',
      'Aks holda (else) — shart bajarilmaganda ishga tushadigan muqobil yo‘l.',
    ],
    widgetType: 'ifelse',
  },
  {
    id: 'loops-arrays',
    number: '10',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '3 daqiqa',
    title: 'Sikllar (Takrorlash) va Ro‘yxatlar (Massivlar)',
    summary:
      'Ro‘yxat (massiv) bir nechta qiymatni bitta o‘zgaruvchida jamlaydi. Sikl (loop) esa bir xil amalni kerakli marta avtomatik takrorlaydi.',
    analogyTitle: 'Hayotiy misol: Bozor ro‘yxati va qadamlar',
    analogyText:
      '100 ta o‘quvchiga bitta-bitta "Salom" deb yozib chiqish o‘rniga, barcha ismlarni bitta ro‘yxatga solamiz va sikl orqali: "Ro‘yxatdagi har bir kishiga salom yubor" deb bitta buyruq beramiz.',
    keyPoints: [
      'Massiv (Array) misoli: mevalar = ["Olma", "Banan", "Uzum"]. Dasturlashda sanoq odatda 0 dan boshlanadi.',
      'for sikli — amal necha marta takrorlanishi oldindan aniq bo‘lganda ishlatiladi.',
      'while sikli — ma’lum bir shart bajarilib turguncha davom etadi.',
    ],
    widgetType: 'loops',
  },
  {
    id: 'functions-web',
    number: '11',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '3 daqiqa',
    title: 'Funksiyalar va Veb tizimi (Frontend, Backend, API)',
    summary:
      'Funksiya — qayta-qayta ishlatish mumkin bo‘lgan tayyor kod bloki. Zamonaviy ilovalar esa Frontend (ko‘rinadigan qism) va Backend (server) hamkorligida ishlaydi.',
    analogyTitle: 'Hayotiy misol: Restoran xizmati',
    analogyText:
      'Restoranda siz ko‘radigan zal va menyu — Frontend. Buyurtmani oshxonaga yetkazuvchi ofitsiant — API. Ovqat pishadigan oshxona va ombor esa — Backend hamda Ma’lumotlar bazasidir.',
    keyPoints: [
      'Funksiya kodni tartibli qiladi: masalan, yigindi(a, b) funksiyasini bir marta yozib, yuz marta chaqirish mumkin.',
      'Frontend — foydalanuvchi ekranda ko‘radigan va bosadigan qism (HTML, CSS, JS).',
      'Backend va Ma’lumotlar bazasi — foydalanuvchi hisoblari, testlar va xavfsiz mantiq saqlanadigan server qismi.',
    ],
    widgetType: 'webarch',
  },
  {
    id: 'languages',
    number: '12',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '3 daqiqa',
    title: 'Mashhur dasturlash tillari: Python, JavaScript, HTML/CSS',
    summary:
      'Har bir dasturlash tili ma’lum vazifa uchun qulay yaratilgan. Veb-saytlar, mobil ilovalar va sun’iy intellekt tizimlari turli tillarda quriladi.',
    analogyTitle: 'Hayotiy misol: Uy qurilishi',
    analogyText:
      'Veb-sayt yaratishda HTML — uyning devor va g‘ishtlari (skeleti), CSS — devor rangi va dizayni (bezagi), JavaScript esa — chiroqlar, eshik va liftlarning harakatlanishi (jonliligi).',
    keyPoints: [
      'HTML va CSS — veb-sahifa tuzilishi va tashqi ko‘rinishini belgilovchi tillar (HTML dasturlash tili emas, belgilash tili).',
      'JavaScript — veb-saytlarni interaktiv va jonli qiluvchi asosiy brauzer tili.',
      'Python — o‘qishga juda oson, yangi boshlovchilar va sun’iy intellekt (AI) sohasi uchun eng mashhur til.',
    ],
    widgetType: 'languages',
  },
];

export const DID_YOU_KNOW_CARDS: DidYouKnowItem[] = [
  {
    id: 'dyk-1',
    topic: 'Kompyuter tarixi',
    question: 'Dasturdagi xato nima uchun "Bug" (qo‘ng‘izcha) deb ataladi?',
    hint: '1947-yilda Harvard universitetidagi ulkan kompyuter ichida haqiqiy voqea sodir bo‘lgan.',
    answer:
      '1947-yilda Mark II nomli kompyuter ishlamay qolganda, muhandislar uning relelari orasidan haqiqiy tungi kapalak (hasharot)ni topishgan va kundalikka "birinchi haqiqiy bug topildi" deb yozishgan. Shu-shu xatolarni tuzatish "debugging" deyiladi.',
  },
  {
    id: 'dyk-2',
    topic: 'Sanoq tizimi',
    question: 'Nima uchun kompyuterlar 10 ta raqam o‘rniga faqat 0 va 1 ni ishlatadi?',
    hint: 'Elektron sxemalar va tranzistorlarning fizik holati haqida o‘ylab ko‘ring.',
    answer:
      'Kompyuter ichidagi milliardlab mitti kalitlar (tranzistorlar) faqat ikki holatda bo‘la oladi: tok o‘tmoqda (1 — yoqilgan) yoki tok o‘tmayapti (0 — o‘chirilgan). Bu usul eng ishonchli va xatosiz hisoblanadi.',
  },
  {
    id: 'dyk-3',
    topic: 'Tezkor xotira',
    question: 'Bir vaqtda brauzerda 30 ta oyna ochilsa, kompyuter nima uchun qotib qoladi?',
    hint: 'Oshpazning ish stoli — RAM xotirasini eslang.',
    answer:
      'Har bir ochiq oyna RAM (tezkor xotira) dan joy egallaydi. Agar RAM to‘lib ketsa, kompyuter vaqtincha ma’lumotlarni sekinroq ishlaydigan SSD/HDD diskka ko‘chirishga majbur bo‘ladi va natijada tezlik pasayadi.',
  },
  {
    id: 'dyk-4',
    topic: 'Veb texnologiya',
    question: 'HTML dasturlash tili hisoblanadimi?',
    hint: 'Unda "agar-aks holda" shartlari yoki matematik hisoblar bormi?',
    answer:
      'Yo‘q! HTML (HyperText Markup Language) — bu gipermatnli belgilash tili. U sahifada sarlavha, matn, rasm va tugmalar qayerda turishini ko‘rsatadi, ammo mantiqiy qarorlar qabul qilmaydi. Mantiq uchun JavaScript ishlatiladi.',
  },
  {
    id: 'dyk-5',
    topic: 'Internet xavfsizligi',
    question: 'Sayt manzili boshidagi "https://" da turgan "s" harfi nimani anglatadi?',
    hint: 'Ma’lumotlarning himoyalangan uzatilishini o‘ylab ko‘ring.',
    answer:
      '"S" harfi "Secure" (Xavfsiz) so‘zidan olingan. Bunday saytlarda siz kiritgan parol va ma’lumotlar shifrlangan holda uzatiladi, ya’ni yo‘lda begonalar ularni o‘qiy olmaydi.',
  },
  {
    id: 'dyk-6',
    topic: 'Dasturlash mantiqi',
    question: 'Nima uchun dasturlashda ro‘yxat (massiv) indeksi 1 dan emas, 0 dan boshlanadi?',
    hint: 'Kompyuter xotirasidagi manzil (masofa) tushunchasini o‘ylab ko‘ring.',
    answer:
      'Birinchi element xotira boshidan 0 qadam uzoqlikda joylashgani uchun uning indeksi 0 bo‘ladi, ikkinchi element esa 1 qadam uzoqlikda (indeksi 1). Bu kompyuterga manzilni tez hisoblashga yordam beradi.',
  },
  {
    id: 'dyk-7',
    topic: 'Ofis savodxonligi',
    question: 'Excel katakchasiga "=SUM(A1:A5)" o‘rniga oddiy "SUM(A1:A5)" yozilsa nima bo‘ladi?',
    hint: 'Excel formula ekanligini qanday belgi orqali taniydi?',
    answer:
      'Excel uni hisob-kitob formulasi deb qabul qilmaydi va shunchaki oddiy matn sifatida qoldiradi. Har qanday hisoblash formulasi albatta "=" (tenglik) belgisi bilan boshlanishi shart.',
  },
  {
    id: 'dyk-8',
    topic: 'Algoritm mantiqi',
    question: 'Agar choy damlash algoritmida suvni qaynatmasdan choy solsangiz nima bo‘ladi?',
    hint: 'Algoritmda tartib qanchalik muhim?',
    answer:
      'Choy rangi chiqmaydi va mazasi o‘zgarmaydi! Dasturlashda ham huddi shunday: kod satrlarining ketma-ketligi buzilsa (masalan, o‘zgaruvchini yaratmasdan turib uni ekranga chiqarsangiz), dastur xato beradi.',
  },
];

export const EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: 'Kompyuterning barcha hisob-kitob va buyruqlarini bajaruvchi asosiy "miyasi" qaysi qism?',
    options: [
      'A) Qattiq disk (SSD)',
      'B) Protsessor (CPU)',
      'C) Monitor',
      'D) Klaviatura',
    ],
    correctIndex: 1,
    explanation: 'Protsessor (CPU) kompyuterdagi barcha mantiqiy va matematik amallarni bajaradi.',
  },
  {
    id: 2,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: 'Kompyuter o‘chirilganda qaysi xotiradagi ma’lumotlar o‘chib ketadi?',
    options: [
      'A) Qattiq disk (HDD)',
      'B) SSD xotira',
      'C) Tezkor xotira (RAM)',
      'D) Flesh-xotira (USB)',
    ],
    correctIndex: 2,
    explanation: 'RAM faqat elektr toki bor paytda ishlaydigan vaqtinchalik tezkor xotiradir.',
  },
  {
    id: 3,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: 'Quyidagilardan qaysi biri operatsion tizim hisoblanadi?',
    options: [
      'A) Microsoft Word',
      'B) Windows 11',
      'C) Google Chrome',
      'D) Telegram',
    ],
    correctIndex: 1,
    explanation: 'Windows, macOS va Linux kompyuter apparat qismlarini boshqaruvchi operatsion tizimlardir.',
  },
  {
    id: 4,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: 'Belgilangan matn yoki fayldan nusxa olish uchun qaysi klaviatura birikmasi ishlatiladi?',
    options: [
      'A) Ctrl + V',
      'B) Ctrl + Z',
      'C) Ctrl + C',
      'D) Ctrl + X',
    ],
    correctIndex: 2,
    explanation: 'Ctrl + C ("Copy") nusxa oladi, Ctrl + V esa joylashtiradi.',
  },
  {
    id: 5,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: 'Oxirgi bajarilgan xato harakatni darhol orqaga qaytarish (bekor qilish) tugmasi qaysi?',
    options: [
      'A) Ctrl + Z',
      'B) Ctrl + S',
      'C) Alt + F4',
      'D) Ctrl + A',
    ],
    correctIndex: 0,
    explanation: 'Ctrl + Z oxirgi o‘zgartirishni bekor qilib, oldingi holatga qaytaradi.',
  },
  {
    id: 6,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: 'Fayl nomidagi ".jpg" yoki ".png" kengaytmasi nimani bildiradi?',
    options: [
      'A) Video fayl ekanligini',
      'B) Musiqa fayli ekanligini',
      'C) Rasm (tasvir) fayli ekanligini',
      'D) Matnli jadval ekanligini',
    ],
    correctIndex: 2,
    explanation: '.jpg va .png kengaytmalari raqamli rasmlar va grafika fayllari uchun ishlatiladi.',
  },
  {
    id: 7,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: 'Excel dasturida har qanday hisob-kitob formulasi qaysi belgi bilan boshlanadi?',
    options: [
      'A) + (qo‘shish)',
      'B) = (tenglik)',
      'C) # (panjara)',
      'D) * (ko‘paytirish)',
    ],
    correctIndex: 1,
    explanation: 'Excel katakchasiga formula yozish albatta "=" belgisidan boshlanadi.',
  },
  {
    id: 8,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: 'Quyidagi parollardan qaysi biri eng xavfsiz hisoblanadi?',
    options: [
      'A) 12345678',
      'B) qwerty2024',
      'C) meningparolim',
      'D) K9$mP!72xQ#4',
    ],
    correctIndex: 3,
    explanation: 'Kuchli parolda katta-kichik harflar, raqamlar va maxsus belgilar aralash bo‘lishi kerak.',
  },
  {
    id: 9,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: 'Internetda begona shaxsning soxta sayt orqali parolingizni o‘g‘irlashga urinishi nima deyiladi?',
    options: [
      'A) Fishing (Phishing)',
      'B) Arxivlash',
      'C) Formatlash',
      'D) Dasturlash',
    ],
    correctIndex: 0,
    explanation: 'Fishing — ishonchli tashkilot niqobi ostida shaxsiy ma’lumotlarni aldab olish usulidir.',
  },
  {
    id: 10,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question: '1 bayt nechta bitdan tashkil topgan?',
    options: [
      'A) 2 ta bit',
      'B) 4 ta bit',
      'C) 8 ta bit',
      'D) 16 ta bit',
    ],
    correctIndex: 2,
    explanation: 'Axborot o‘lchov birligida 1 bayt aniq 8 ta bitga teng.',
  },
  {
    id: 11,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'Kompyuter mashina tilida ma’lumotlarni qanday raqamlar yordamida qayta ishlaydi?',
    options: [
      'A) 0 dan 9 gacha raqamlar bilan',
      'B) Faqat 0 va 1 raqamlari bilan',
      'C) Faqat lotin harflari bilan',
      'D) 1 va 2 raqamlari bilan',
    ],
    correctIndex: 1,
    explanation: 'Kompyuter ikkilik sanoq tizimida (0 va 1) ishlaydi.',
  },
  {
    id: 12,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'Ma’lum bir maqsadga erishish uchun tuzilgan aniq qadamlar ketma-ketligi nima deb ataladi?',
    options: [
      'A) Brauzer',
      'B) Server',
      'C) Algoritm',
      'D) Monitor',
    ],
    correctIndex: 2,
    explanation: 'Algoritm — natijaga eltuvchi aniq, tartibli buyruqlar ketma-ketligidir.',
  },
  {
    id: 13,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'Dasturlashda ma’lumotni vaqtincha saqlab turadigan nomlangan "quti" nima deyiladi?',
    options: [
      'A) O‘zgaruvchi (Variable)',
      'B) Printer',
      'C) Papka',
      'D) Kengaytma',
    ],
    correctIndex: 0,
    explanation: 'O‘zgaruvchi — xotiradagi qiymatga berilgan nom bo‘lib, u dastur davomida o‘zgarishi mumkin.',
  },
  {
    id: 14,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'Dasturda "agar shart bajarilsa — bir amalni, aks holda — boshqa amalni bajar" mantiqi qaysi operator bilan yoziladi?',
    options: [
      'A) print / input',
      'B) if / else',
      'C) html / css',
      'D) copy / paste',
    ],
    correctIndex: 1,
    explanation: '"if" (agar) va "else" (aks holda) shart operatorlari qaror qabul qilishda ishlatiladi.',
  },
  {
    id: 15,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'Bir xil amalni kerakli marta avtomatik takrorlash uchun dasturlashda nima ishlatiladi?',
    options: [
      'A) Sikl (for / while)',
      'B) Arxiv (.zip)',
      'C) Monitor',
      'D) Fayl kengaytmasi',
    ],
    correctIndex: 0,
    explanation: 'Sikl (takrorlash operatori) bir xil kodni qayta yozmasdan bir necha bor bajarish imkonini beradi.',
  },
  {
    id: 16,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'Veb-sahifaning asosiy tuzilishi (skeleti) va bezagi (rang/shrift) qaysi tillar bilan yaratiladi?',
    options: [
      'A) HTML va CSS',
      'B) Word va Excel',
      'C) ZIP va PDF',
      'D) BIOS va USB',
    ],
    correctIndex: 0,
    explanation: 'HTML sahifa tuzilishini, CSS esa tashqi ko‘rinishi va dizaynini yaratadi.',
  },
  {
    id: 17,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'Quyidagi kod natijasida ekranga nima chiqadi:  x = 5;  y = 3;  ekranga_chiqar(x + y)?',
    options: [
      'A) 53',
      'B) x + y',
      'C) 8',
      'D) 2',
    ],
    correctIndex: 2,
    explanation: 'x va y sonli o‘zgaruvchilar bo‘lgani uchun 5 + 3 = 8 natijasi chiqadi.',
  },
  {
    id: 18,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'O‘qishga osonligi, soddaligi va sun’iy intellekt sohasida keng qo‘llanishi bilan mashhur til qaysi?',
    options: [
      'A) Python',
      'B) Assembly',
      'C) CSS',
      'D) HTML',
    ],
    correctIndex: 0,
    explanation: 'Python sodda sintaksisi tufayli boshlovchilar va sun’iy intellekt mutaxassislari orasida juda mashhur.',
  },
  {
    id: 19,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'Veb-saytlarni foydalanuvchi harakatlariga javob beradigan (interaktiv) qiluvchi asosiy til qaysi?',
    options: [
      'A) JavaScript',
      'B) JPEG',
      'C) Excel',
      'D) Photoshop',
    ],
    correctIndex: 0,
    explanation: 'JavaScript brauzerda ishlaydi va tugma bosilganda, test tekshirilganda jonli harakatlarni bajaradi.',
  },
  {
    id: 20,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question: 'Foydalanuvchi ekranda ko‘radigan qism (Frontend) bilan server (Backend) o‘rtasida ma’lumot tashuvchi ko‘prik nima deyiladi?',
    options: [
      'A) API',
      'B) Klaviatura',
      'C) Printer',
      'D) Kuler',
    ],
    correctIndex: 0,
    explanation: 'API (Application Programming Interface) dasturning old qismi va serveri o‘rtasida so‘rov va javoblarni tashiydi.',
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'term-cpu',
    term: 'CPU (Protsessor)',
    category: 'literacy',
    shortDesc: 'Kompyuterning barcha hisob-kitob va buyruqlarini bajaruvchi asosiy mikrosxemasi.',
    example: 'Masalan: Intel Core i5 yoki Apple M3 protsessori.',
  },
  {
    id: 'term-ram',
    term: 'RAM (Tezkor xotira)',
    category: 'literacy',
    shortDesc: 'Ayni damda ochiq turgan dastur va fayllarni vaqtincha saqlovchi tezkor xotira.',
    example: '8 GB yoki 16 GB RAM bir vaqtda ko‘p oynalar ochishga imkon beradi.',
  },
  {
    id: 'term-ssd',
    term: 'SSD (Qattiq holatli disk)',
    category: 'literacy',
    shortDesc: 'Tizim, dastur va fayllarni kompyuter o‘chganda ham uzoq saqlovchi tezkor xotira.',
    example: 'SSD eski HDD disklarga qaraganda 5–10 barobar tezroq ishlaydi.',
  },
  {
    id: 'term-os',
    term: 'Operatsion tizim (OS)',
    category: 'literacy',
    shortDesc: 'Kompyuter apparatlari va dasturlari o‘rtasidagi aloqani boshqaruvchi asosiy tizim.',
    example: 'Windows 11, macOS, Ubuntu Linux, Android va iOS.',
  },
  {
    id: 'term-browser',
    term: 'Brauzer (Browser)',
    category: 'literacy',
    shortDesc: 'Internetdagi veb-saytlarni ochish va ko‘rish uchun mo‘ljallangan maxsus dastur.',
    example: 'Google Chrome, Safari, Mozilla Firefox, Microsoft Edge.',
  },
  {
    id: 'term-bit-byte',
    term: 'Bit va Bayt',
    category: 'literacy',
    shortDesc: 'Axborotning eng kichik o‘lchov birliklari. 1 bayt = 8 bitga teng.',
    example: 'Bitta oddiy harf xotirada odatda 1 bayt joy egallaydi.',
  },
  {
    id: 'term-phishing',
    term: 'Fishing (Phishing)',
    category: 'literacy',
    shortDesc: 'Ishonchli sayt yoki tashkilot niqobi ostida parol va karta ma’lumotlarini o‘g‘irlash.',
    example: 'Noma’lum SMS havola orqali karta kodini so‘rash fishing belgisidir.',
  },
  {
    id: 'term-2fa',
    term: '2FA (Ikki bosqichli himoya)',
    category: 'literacy',
    shortDesc: 'Akkauntga kirishda paroldan tashqari telefon raqamga keladigan bir martalik kod so‘rash.',
    example: 'Parolingiz begona qo‘liga tushsa ham, 2FA kodsiz kira olmaydi.',
  },
  {
    id: 'term-algorithm',
    term: 'Algoritm',
    category: 'programming',
    shortDesc: 'Aniq natijaga erishish uchun tuzilgan tartibli va tushunarli qadamlar ketma-ketligi.',
    example: 'Ovqat pishirish retsepti yoki sonlarni o‘sish tartibida saralash.',
  },
  {
    id: 'term-variable',
    term: 'O‘zgaruvchi (Variable)',
    category: 'programming',
    shortDesc: 'Dastur davomida qiymat saqlab turuvchi va nomi bor xotira katakchasi ("quti").',
    example: 'yosh = 20  yoki  shahar = "Toshkent"',
  },
  {
    id: 'term-condition',
    term: 'Shart operatori (if / else)',
    category: 'programming',
    shortDesc: 'Berilgan shart to‘g‘ri yoki noto‘g‘ri ekaniga qarab turli amallarni bajarish buyrug‘i.',
    example: 'agar (ball >= 15) { "O‘tdi" } aks holda { "Qayta urining" }',
  },
  {
    id: 'term-loop',
    term: 'Sikl (Loop: for / while)',
    category: 'programming',
    shortDesc: 'Bir xil harakatni belgilangan marta yoki shart bajarilguncha avtomatik takrorlash.',
    example: 'for (i = 1; i <= 5; i++) — amalni 5 marta ketma-ket bajaradi.',
  },
  {
    id: 'term-array',
    term: 'Massiv / Ro‘yxat (Array)',
    category: 'programming',
    shortDesc: 'Bir turdagi yoki bog‘liq bir nechta qiymatni bitta tartibli ro‘yxatda saqlash.',
    example: 'fanlar = ["Matematika", "Informatika", "Ingliz tili"]',
  },
  {
    id: 'term-function',
    term: 'Funksiya (Function)',
    category: 'programming',
    shortDesc: 'Muayyan vazifani bajaradigan va istalgan joydan chaqiriladigan alohida kod bloki.',
    example: 'salom_ber("Ali") funksiyasi har chaqirilganda salom matnini chiqaradi.',
  },
  {
    id: 'term-api',
    term: 'Frontend, Backend va API',
    category: 'programming',
    shortDesc: 'Frontend — foydalanuvchi ko‘radigan interfeys, Backend — server, API — ular orasidagi aloqa.',
    example: 'Ob-havo ilovasi API orqali serverdan bugungi haroratni olib ko‘rsatadi.',
  },
  {
    id: 'term-html-css',
    term: 'HTML va CSS',
    category: 'programming',
    shortDesc: 'HTML veb-sahifa tuzilishini (skeletini), CSS esa uning rang va dizaynini yaratadi.',
    example: 'HTML sarlavha qo‘yadi, CSS uni ko‘k rangga bo‘yaydi.',
  },
  {
    id: 'term-js',
    term: 'JavaScript',
    category: 'programming',
    shortDesc: 'Veb-sahifalarga jonlilik, tugma harakatlari va mantiq qo‘shuvchi dasturlash tili.',
    example: 'Testda javobni bosganda natijani darhol tekshirib berish.',
  },
  {
    id: 'term-python',
    term: 'Python',
    category: 'programming',
    shortDesc: 'Sodda va tushunarli yoziladigan, sun’iy intellekt hamda backendda keng qo‘llaniladigan til.',
    example: 'print("Salom, dunyo!") buyrug‘i bilan ekranga matn chiqaradi.',
  },
];

export const VIDEO_LESSONS: VideoLessonItem[] = [
  {
    id: 'vid-hardware',
    number: '01',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    title: 'Kompyuter qanday ishlaydi? CPU, RAM va SSD siri',
    shortDesc: 'Kompyuter nima uchun qotadi va uchta asosiy qism qanday hamkorlik qiladi — 40 soniyada.',
    durationLabel: '0:40',
    visualType: 'hardware',
    scenes: [
      {
        label: 'Muammo',
        title: 'Nega kompyuter qotib qoladi?',
        subtitle: 'Ko‘p dastur ochganda tezkor xotira to‘lib ketadi — sababini ko‘ramiz.',
        durationSec: 10,
        visualKind: 'hook',
        highlightText: 'CPU · RAM · SSD',
      },
      {
        label: 'Hayotiy misol',
        title: 'Oshxona qiyosi bilan tushuning',
        subtitle: 'CPU — oshpaz, RAM — ish stoli, SSD esa — katta omborxona.',
        durationSec: 10,
        visualKind: 'analogy',
        highlightText: 'Oshpaz → Stol → Ombor',
      },
      {
        label: 'Jonli sxema',
        title: 'Ma’lumot qanday harakatlanadi?',
        subtitle: 'Fayl SSD dan RAM ga olinadi, so‘ng Protsessor uni soniyasiga milliardlab marta hisoblaydi.',
        durationSec: 10,
        visualKind: 'demo',
        highlightText: 'SSD ➔ RAM ➔ CPU',
      },
      {
        label: 'Xulosa',
        title: 'Oltin qoida',
        subtitle: 'Tez kompyuter uchun kuchli CPU, kamida 8–16 GB RAM va SSD disk kerak.',
        durationSec: 10,
        visualKind: 'summary',
        highlightText: 'RAM elektr o‘chsa tozalanadi!',
      },
    ],
    quickCheck: {
      question: 'Kompyuter o‘chganda qaysi xotiradagi vaqtinchalik ma’lumotlar tozalanadi?',
      options: ['SSD doimiy disk', 'Tezkor xotira (RAM)', 'Flesh-xotira'],
      correctIndex: 1,
    },
  },
  {
    id: 'vid-files',
    number: '02',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    title: 'Fayllar va kengaytmalar: .pdf, .jpg, .mp4, .py',
    shortDesc: 'Fayl nomining oxiridagi nuqtadan keyingi harflar nimani anglatishini tez bilib oling.',
    durationLabel: '0:36',
    visualType: 'files',
    scenes: [
      {
        label: 'Savol',
        title: 'Fayl oxiridagi ".pdf" nima?',
        subtitle: 'Kompyuter har bir faylni qaysi dasturda ochishni aynan kengaytma orqali biladi.',
        durationSec: 9,
        visualKind: 'hook',
        highlightText: 'hisobot.pdf · rasm.jpg',
      },
      {
        label: 'Misol',
        title: 'Papka — tartibli jild',
        subtitle: 'Fayl — bitta varaq, papka esa shu varaqlarni mavzu bo‘yicha saqlovchi jilddir.',
        durationSec: 9,
        visualKind: 'analogy',
        highlightText: 'Ishlar / Darslar / Rasmlar',
      },
      {
        label: 'Turlari',
        title: 'Eng ko‘p uchraydigan 4 format',
        subtitle: '.docx/.pdf (matn), .jpg/.png (rasm), .mp4 (video), .py (Python kodi).',
        durationSec: 9,
        visualKind: 'demo',
        highlightText: '.docx · .jpg · .mp4 · .py',
      },
      {
        label: 'Xulosa',
        title: 'Tartibli ish siri',
        subtitle: 'Har doim fayllarga aniq nom bering va kerakli papkalarga joylang.',
        durationSec: 9,
        visualKind: 'summary',
        highlightText: 'Tartib = Tez qidiruv',
      },
    ],
    quickCheck: {
      question: 'Qaysi kengaytma video faylni bildiradi?',
      options: ['.mp4', '.jpg', '.docx'],
      correctIndex: 0,
    },
  },
  {
    id: 'vid-shortcuts',
    number: '03',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    title: 'Ishni 3x tezlatuvchi klaviatura sirlari',
    shortDesc: 'Sichqonchasiz bir soniyada nusxalash, qaytarish va saqlash tugmalari.',
    durationLabel: '0:36',
    visualType: 'shortcuts',
    scenes: [
      {
        label: 'Tezlik',
        title: 'Sichqoncha bilan vaqt yo‘qotmang',
        subtitle: 'Tezkor tugmalar (Shortcuts) har kuni 20–30 daqiqa vaqtingizni tejaydi.',
        durationSec: 9,
        visualKind: 'hook',
        highlightText: 'Ctrl + C / Ctrl + V',
      },
      {
        label: 'Misol',
        title: 'Qisqa yo‘lakcha effekti',
        subtitle: 'Uzoq menyularni izlash o‘rniga 2 ta tugma bilan buyruq berasiz.',
        durationSec: 9,
        visualKind: 'analogy',
        highlightText: '2 tugma = 1 tayyor amal',
      },
      {
        label: 'Jonli namoyish',
        title: 'Eng muhim 4 ta kombinatsiya',
        subtitle: 'Ctrl+C (nusxa), Ctrl+V (qo‘yish), Ctrl+Z (orqaga), Ctrl+S (saqlash).',
        durationSec: 9,
        visualKind: 'demo',
        highlightText: 'Ctrl + Z — xatoni tuzatadi!',
      },
      {
        label: 'Xulosa',
        title: 'Hoziroq qo‘llang',
        subtitle: 'Matn yozayotganda har 5 daqiqada Ctrl+S bosishni odat qiling.',
        durationSec: 9,
        visualKind: 'summary',
        highlightText: 'Ctrl + S = Xavfsiz mehnat',
      },
    ],
    quickCheck: {
      question: 'Adashib o‘chirilgan matnni darhol orqaga qaytarish tugmasi qaysi?',
      options: ['Ctrl + V', 'Ctrl + Z', 'Ctrl + C'],
      correctIndex: 1,
    },
  },
  {
    id: 'vid-security',
    number: '04',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    title: 'Internet firibgarlari (Fishing) va Kuchli parol',
    shortDesc: 'Soxta havolalarni bir qarashda ajratish va akkauntni 100% himoyalash.',
    durationLabel: '0:40',
    visualType: 'security',
    scenes: [
      {
        label: 'Xavf',
        title: 'Soxta yutuq xabarlariga aldanmang!',
        subtitle: 'Firibgarlar mashhur bank yoki sayt nomidan karta va SMS kod so‘raydi.',
        durationSec: 10,
        visualKind: 'hook',
        highlightText: 'Fishing = Tuzoq havola',
      },
      {
        label: 'Qiyos',
        title: 'Eshik va ishonchli qulf',
        subtitle: '"123456" paroli ochiq eshikdir. Murakkab parol + 2FA — po‘lat qulf.',
        durationSec: 10,
        visualKind: 'analogy',
        highlightText: 'Katta harf + Raqam + Belgi',
      },
      {
        label: 'Tekshiruv',
        title: 'Manzilni qanday tekshirish kerak?',
        subtitle: 'Haqiqiy sayt "https://" va qulf belgisi bilan boshlanadi, begona domen bo‘lmaydi.',
        durationSec: 10,
        visualKind: 'demo',
        highlightText: 'https:// + Rasmiy domen',
      },
      {
        label: 'Qoida',
        title: 'Hech kimga SMS kod bermang!',
        subtitle: 'Bank xodimi ham, admin ham hech qachon SMS tasdiq kodini so‘ramaydi.',
        durationSec: 10,
        visualKind: 'summary',
        highlightText: '2FA himoyasini yoqing',
      },
    ],
    quickCheck: {
      question: 'Sayt manzilidagi "https://" nimani kafolatlaydi?',
      options: ['Bepul internetni', 'Ma’lumotlar shifrlanishini', 'Sayt o‘yin ekanini'],
      correctIndex: 1,
    },
  },
  {
    id: 'vid-binary',
    number: '05',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    title: '0 va 1 tili: Kompyuter so‘zlarni qanday tushunadi?',
    shortDesc: 'Harflar, rasmlar va buyruqlar qanday qilib 0 va 1 ga aylanishini jonli ko‘ring.',
    durationLabel: '0:36',
    visualType: 'binary',
    scenes: [
      {
        label: 'Sir',
        title: 'Kompyuter faqat 2 ta belgini biladi',
        subtitle: 'Uning ichida milliardlab mitti kalitlar bor: Yoqilgan (1) yoki O‘chiq (0).',
        durationSec: 9,
        visualKind: 'hook',
        highlightText: '0 = Tok yo‘q · 1 = Tok bor',
      },
      {
        label: 'Tarjimon',
        title: 'Dasturlash tillari — ko‘prik',
        subtitle: 'Biz Python yoki JS da yozamiz, kompyuter esa uni 01000001 kodiga o‘giradi.',
        durationSec: 9,
        visualKind: 'analogy',
        highlightText: 'Inson tili ➔ 0 va 1',
      },
      {
        label: 'Hisob',
        title: 'Bit va Bayt o‘lchovi',
        subtitle: '1 ta 0 yoki 1 bu — Bit. 8 ta bit birlashib 1 Bayt (bitta harf) hosil qiladi.',
        durationSec: 9,
        visualKind: 'demo',
        highlightText: '"A" = 01000001 (8 bit)',
      },
      {
        label: 'Xulosa',
        title: 'Har bir piksel va harf — raqam',
        subtitle: 'Telefoningizdagi barcha rasm, video va o‘yinlar aslida 0 va 1 lardan iborat!',
        durationSec: 9,
        visualKind: 'summary',
        highlightText: '1 Bayt = 8 Bit',
      },
    ],
    quickCheck: {
      question: '1 bayt axborot nechta bitdan tashkil topadi?',
      options: ['4 bit', '8 bit', '16 bit'],
      correctIndex: 1,
    },
  },
  {
    id: 'vid-algorithm',
    number: '06',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    title: 'Algoritm nima? Dasturlashning yuragi',
    shortDesc: 'Muhammad al-Xorazmiy asos solgan tushuncha kundalik hayot va kodda qanday ishlaydi.',
    durationLabel: '0:36',
    visualType: 'algorithm',
    scenes: [
      {
        label: 'Asos',
        title: 'Dastur yozishdan oldingi reja',
        subtitle: 'Algoritm — maqsadga erishish uchun tuzilgan aniq qadamlar ketma-ketligi.',
        durationSec: 9,
        visualKind: 'hook',
        highlightText: 'Kirish ➔ Qadamlar ➔ Natija',
      },
      {
        label: 'Hayotiy misol',
        title: 'Choy damlash algoritmi',
        subtitle: '1) Choy solish, 2) Qaynoq suv quyish, 3) 5 daqiqa kutish, 4) Suzish.',
        durationSec: 9,
        visualKind: 'analogy',
        highlightText: 'Tartib buzilsa — natija chiqmaydi!',
      },
      {
        label: 'Tarix',
        title: 'Xorazmiy va Algoritm',
        subtitle: 'Buyuk olimimiz Muhammad al-Xorazmiyning nomi "Algorithm" atamasiga asos bo‘lgan.',
        durationSec: 9,
        visualKind: 'demo',
        highlightText: 'Al-Xorazmiy → Algorithm',
      },
      {
        label: 'Xulosa',
        title: 'Avval o‘ylang, keyin kod yozing',
        subtitle: 'To‘g‘ri tuzilgan algoritm har qanday dasturlash tilida oson ishlaydi.',
        durationSec: 9,
        visualKind: 'summary',
        highlightText: 'Aniq tartib = Xatosiz kod',
      },
    ],
    quickCheck: {
      question: 'Algoritm atamasi qaysi buyuk alloma nomi bilan bog‘liq?',
      options: ['Muhammad al-Xorazmiy', 'Abu Ali ibn Sino', 'Alisher Navoiy'],
      correctIndex: 0,
    },
  },
  {
    id: 'vid-ifelse',
    number: '07',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    title: 'O‘zgaruvchilar va Shart operatori (if / else)',
    shortDesc: 'Dasturlar qanday qilib o‘zi qaror qabul qilishini 40 soniyada tushuning.',
    durationLabel: '0:40',
    visualType: 'ifelse',
    scenes: [
      {
        label: 'Quti',
        title: 'O‘zgaruvchi — nomlangan quti',
        subtitle: 'ism = "Madina", ball = 95. Ma’lumotni nom ostida saqlaymiz.',
        durationSec: 10,
        visualKind: 'hook',
        highlightText: 'ball = 95 · ism = "Madina"',
      },
      {
        label: 'Hayotiy misol',
        title: 'Ob-havo qarori',
        subtitle: 'AGAR yomg‘ir yog‘sa — soyabon ol. AKS HOLDA — quyosh ko‘zoynagini taq.',
        durationSec: 10,
        visualKind: 'analogy',
        highlightText: 'if (yomgir) → Soyabon',
      },
      {
        label: 'Jonli kod',
        title: 'Imtihon tekshiruvi kodi',
        subtitle: 'agar (ball >= 15) { "O‘tdi!" } aks holda { "Qayta urining" }',
        durationSec: 10,
        visualKind: 'demo',
        highlightText: 'if / else — 2 yo‘ldan biri',
      },
      {
        label: 'Xulosa',
        title: 'Aqlli ilovalar siri',
        subtitle: 'Parolni tekshirish, chegirma berish va o‘yin ballari hammasi if/else da ishlaydi!',
        durationSec: 10,
        visualKind: 'summary',
        highlightText: 'Shart to‘g‘ri → 1-yo‘l',
      },
    ],
    quickCheck: {
      question: 'Dasturlashda qaror qabul qilish operatori qaysi?',
      options: ['if / else', 'Ctrl + V', 'HTML'],
      correctIndex: 0,
    },
  },
  {
    id: 'vid-loops-web',
    number: '08',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    title: 'Sikllar (for) va Veb-sayt qurilishi (HTML, CSS, JS)',
    shortDesc: 'Takrorlanuvchi kodlarni qisqartirish hamda saytlarning 3 ta asosiy tili.',
    durationLabel: '0:40',
    visualType: 'loops_web',
    scenes: [
      {
        label: 'Sikl',
        title: '1000 marta bitta kod yozmang!',
        subtitle: 'Sikl (for / while) bir xil vazifani avtomatik kerakli marta takrorlaydi.',
        durationSec: 10,
        visualKind: 'hook',
        highlightText: 'for (1 dan 5 gacha) ↻',
      },
      {
        label: 'Veb uy',
        title: 'HTML + CSS + JavaScript',
        subtitle: 'HTML — uy devorlari (skelet), CSS — bo‘yoq va bezak, JS — chiroq va harakat.',
        durationSec: 10,
        visualKind: 'analogy',
        highlightText: 'Skelet + Dizayn + Harakat',
      },
      {
        label: 'Backend & API',
        title: 'Sayt ichida nima sodir bo‘ladi?',
        subtitle: 'Frontend (ekran) API ko‘prigi orqali Backend (server) bilan gaplashadi.',
        durationSec: 10,
        visualKind: 'demo',
        highlightText: 'Frontend ⇄ API ⇄ Backend',
      },
      {
        label: 'Xulosa',
        title: 'Siz dasturlashga tayyorsiz!',
        subtitle: 'Endi laboratoriya va 20 talik yakuniy imtihonda bilimingizni sinab ko‘ring.',
        durationSec: 10,
        visualKind: 'summary',
        highlightText: 'Python · JS · HTML/CSS',
      },
    ],
    quickCheck: {
      question: 'Veb-sahifaga rang, shrift va chiroyli bezak beruvchi til qaysi?',
      options: ['CSS', 'SQL', 'BIOS'],
      correctIndex: 0,
    },
  },
];

