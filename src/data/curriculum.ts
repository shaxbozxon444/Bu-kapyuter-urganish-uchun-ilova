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
    | 'network'
    | 'security'
    | 'ai'
    | 'binary'
    | 'algorithm'
    | 'datatypes'
    | 'ifelse'
    | 'loops'
    | 'functions'
    | 'webarch'
    | 'languages';
}

export interface DidYouKnowItem {
  id: string;
  category: LessonCategory;
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
  | 'network'
  | 'security'
  | 'binary'
  | 'algorithm'
  | 'ifelse'
  | 'functions'
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

export interface ChallengeItem {
  id: string;
  category: LessonCategory;
  difficulty: 'orta' | 'qiyin';
  title: string;
  prompt: string;
  codeSnippet?: string;
  inputType: 'choice' | 'text';
  options?: string[];
  correctAnswer: string;
  acceptedAliases?: string[];
  hint: string;
  solutionSteps: string[];
}

export interface CertificateRecord {
  id: string;
  attemptId: string;
  studentName: string;
  scope: 'literacy' | 'programming' | 'all';
  trackTitle: string;
  score: number;
  total: number;
  percentage: number;
  gradeLabel: string;
  issuedAt: string;
  issuerName: string;
}

export const LESSONS: LessonItem[] = [
  // =========================================================================
  // 1-YO'NALISH: KOMPYUTER SAVODXONLIGI (01 - 08)
  // =========================================================================
  {
    id: 'hardware',
    number: '01',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Kompyuter arxitekturasi: Protsessor, RAM, SSD va GPU',
    summary:
      'Kompyuter tez va barqaror ishlashi uchun uning asosiy apparat qismlari — Protsessor (CPU), Tezkor xotira (RAM), Doimiy xotira (SSD) va Ona plata (Motherboard) hamkorlikda ishlaydi.',
    analogyTitle: 'Hayotiy misol: Oshxona qiyosi',
    analogyText:
      'Protsessor — taom tayyorlayotgan oshpaz. RAM (tezkor xotira) — oshpaz hozir foydalanayotgan ish stoli. SSD yoki qattiq disk esa — barcha mahsulotlar uzoq muddat saqlanadigan omborxona.',
    keyPoints: [
      'Protsessor (CPU) yadrolari ko‘p bo‘lsa, bir vaqtda ko‘p dasturni (multitasking) qiynalmasdan boshqaradi.',
      'RAM — vaqtinchalik tezkor xotira (tok o‘chsa tozalanadi); SSD — uzoq muddatli tezkor disk; kesh (Cache) esa CPU ichidagi eng tezkor xotiradir.',
      '3-2-1 zaxira qoidasi: muhim faylning kamida 3 ta nusxasini, 2 xil tashuvchida (masalan SSD + tashqi disk) va 1 tasini bulutda saqlang.',
    ],
    widgetType: 'hardware',
  },
  {
    id: 'os-desktop',
    number: '02',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Operatsion tizimlar: Windows, macOS, Linux va Drayverlar',
    summary:
      'Operatsion tizim (OS) — kompyuter apparatlari va foydalanuvchi o‘rtasidagi aloqani boshqaruvchi, barcha dasturlarga resurs ajratuvchi asosiy tizimdir.',
    analogyTitle: 'Hayotiy misol: Bino boshqaruvchisi',
    analogyText:
      'Operatsion tizim xuddi katta ofis binosining boshqaruvchisiga o‘xshaydi: u chiroqni yoqadi, xonalarga kalit beradi va barcha ishchilar (dasturlar)ning bir-biriga xalaqit bermasdan ishlashini ta’minlaydi.',
    keyPoints: [
      'Drayver (Driver) — printer, videokarta yoki skaner kabi tashqi qurilmalarni OS bilan tushuntirib beruvchi maxsus tarjimon dastur.',
      'Task Manager (Ctrl+Shift+Esc) orqali 99% CPU yeyayotgan yoki qotib qolgan jarayonni aniqlab xavfsiz yopish mumkin.',
      '1 Kilobayt = 1024 Bayt, 1 Megabayt = 1024 Kilobayt (ishlab chiqaruvchi 1000 ga, OS esa 1024 ga bo‘lgani uchun 16 GB fleshka ~14.9 GB ko‘rinadi).',
    ],
    widgetType: 'os',
  },
  {
    id: 'files',
    number: '03',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Fayl tizimi, kengaytmalar va Arxivlash (.zip / .rar)',
    summary:
      'Kompyuterdagi har bir ma’lumot fayl ko‘rinishida saqlanadi. Papkalar tartibni saqlaydi, kengaytma esa fayl turini bildiradi. Arxivlash esa fayllar hajmini kichraytiradi.',
    analogyTitle: 'Hayotiy misol: Qog‘oz jildlari va chamadon',
    analogyText:
      'Fayl — bitta varaq hujjat. Papka — shu varaqlarni solib qo‘yiladigan jild. ZIP arxiv esa — safarga chiqishdan oldin kiyimlarni zichlab joylaydigan vakuum paketiga o‘xshaydi.',
    keyPoints: [
      'Xavfli hiyla: "hisobot.pdf.exe" kabi ikkita kengaytmali faylda oxirgi qism (.exe) haqiqiy tur hisoblanadi — bu virusli dastur bo‘lishi mumkin!',
      'Matn fayllari (.txt, .docx) ichida takrorlanuvchi baytlar ko‘pligi uchun .zip da kuchli siqiladi; .mp4 yoki .jpg esa allaqachon siqilgani uchun deyarli kichraymaydi.',
      '.pdf hujjatning shrift va tuzilishini barcha qurilmalarda bir xil saqlaydi.',
    ],
    widgetType: 'files',
  },
  {
    id: 'shortcuts',
    number: '04',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Klaviatura mahorati, Bufer (Clipboard) va Tezkor birikmalar',
    summary:
      'Sichqoncha bilan menyularni izlab vaqt yo‘qotmaslik uchun klaviaturadagi tezkor tugma birikmalarini va almashinuv buferini (Clipboard) bilish ish unumdorligini 3 barobar oshiradi.',
    analogyTitle: 'Hayotiy misol: Qisqa yo‘lakcha',
    analogyText:
      'Har safar uzoq aylanma yo‘ldan yurish o‘rniga to‘g‘ri va tez yetib boradigan qisqa yo‘lakdan foydalangandek, Ctrl + C va Ctrl + V ishingizni soniyalar ichida bajaradi.',
    keyPoints: [
      'Ctrl + X bilan qirqib olingan matn almashinuv buferiga (Clipboard) tushadi; lekin Ctrl + V bosmasdan yana Ctrl + C qilsangiz, eski matn o‘rnini yangisi egallaydi.',
      'Ctrl + Z — oxirgi xato harakatni orqaga qaytaradi; Ctrl + Y — bekor qilinganni tiklaydi.',
      'Alt + Tab — ochiq oynalar orasida tezkor almashish; Win + Shift + S — ekran qismini rasmga olish.',
    ],
    widgetType: 'shortcuts',
  },
  {
    id: 'office-web',
    number: '05',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '4 daqiqa',
    title: 'Ofis dasturlari: Word, Excel formulalari ($A$1) va PDF',
    summary:
      'Zamonaviy ish faoliyatida matn terish (Word), jadvalda murakkab formulalar tuzish (Excel) va rasmiy hujjat almashinuvi eng talabgir ko‘nikmalardir.',
    analogyTitle: 'Hayotiy misol: Aqlli kalkulyator daftar',
    analogyText:
      'Word — chiroyli yozuv daftari. Excel esa — katakchalari o‘zi qo‘shib, ko‘paytirib, o‘rtachasini chiqarib beradigan aqlli hisob-kitob daftaridir.',
    keyPoints: [
      'Excelda har qanday formula "=" dan boshlanadi: =SUM(A1:A3)/B1 kabi murakkab ifodalarda avval yig‘indi, keyin bo‘lish bajariladi.',
      'Mutlaq manzil ($A$1): formulani pastga nusxalaganda $ belgili katakcha manzili o‘zgarmasdan qat’iy saqlanib qoladi.',
      'Rasmiy shartnomani tahrirlash uchun .docx, o‘zgarmas ko‘rinishda chop etish uchun .pdf formatidan foydalaning.',
    ],
    widgetType: 'office',
  },
  {
    id: 'internet-cloud',
    number: '06',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Internet, Brauzer Cache/Cookie, IP/DNS va Bulutli xotira',
    summary:
      'Internet — dunyo bo‘ylab kompyuterlarni bog‘lovchi tarmoq. DNS, Brauzer keshi (Cache), Cookie va bulutli sinxronizatsiya qanday ishlashini chuqur o‘rganing.',
    analogyTitle: 'Hayotiy misol: Telefon kontaktlar kitobi',
    analogyText:
      'Har bir saytning raqamli manzili (IP: 142.250.185.78) bor. DNS tizimi esa xuddi telefon kontaktidek, biz yozgan "google.com" nomini o‘sha raqamli manzilga avtomatik aylantirib beradi.',
    keyPoints: [
      'Agar sayt nomi bilan ochilmasa-yu, lekin to‘g‘ridan-to‘g‘ri IP manzili orqali ochilsa — muammo internetda emas, DNS serverida bo‘ladi!',
      'Cache — sayt rasmlarini tezroq ochish uchun saqlanadigan vaqtinchalik nusxa; Cookie — saytdagi login sessiyangiz va sozlamalarni eslab qoluvchi kichik fayl.',
      'Bulutli sinxronizatsiya yoqilgan papkadan fayl o‘chirilsa, u bulutdan ham o‘chadi (lekin Trash/Savatchadan 30 kun ichida tiklash mumkin).',
    ],
    widgetType: 'network',
  },
  {
    id: 'security',
    number: '07',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Kiberxavfsizlik: Fishing domenlar, HTTPS va 2FA himoyasi',
    summary:
      'Internetdan foydalanganda soxta domenlarni ajrata olish, ochiq Wi-Fi tarmoqlarida xavfsizlikni saqlash va 2FA orqali akkauntlarni himoyalash zarur.',
    analogyTitle: 'Hayotiy misol: Po‘lat eshik va ikkita qulf',
    analogyText:
      'Oddiy "123456" paroli xuddi eshikni ochiq qoldirishga o‘xshaydi. Murakkab parol va ikki bosqichli tasdiqlash (2FA) esa eshikka po‘lat qulf va SMS qo‘ng‘iroqli himoya qo‘yish demakdir.',
    keyPoints: [
      'Soxta domen tuzog‘i: "payme-uz-bonus.click" manzili rasmiy "payme.uz" sayti emas — asosiy domen oxirgi nuqtadan oldingi qismdir.',
      'Ochiq kafe Wi-Fi tarmog‘ida "http://" (S siz) saytga parol kiritilsa, trafik shifrlanmagani uchun bir tarmoqdagi xaker parolni ushlab olishi (MITM) mumkin.',
      'Har bir sayt uchun alohida kuchli parol va 2FA yoqish bir saytdan sizgan parol bilan boshqa akkauntlaringiz buzilishining oldini oladi.',
    ],
    widgetType: 'security',
  },
  {
    id: 'digital-ai',
    number: '08',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    readTime: '3 daqiqa',
    title: 'Zamonaviy raqamli vositalar va AI Prompt muhandisligi',
    summary:
      'Bugungi kunda sun’iy intellekt (ChatGPT, Gemini va boshqalar) matn yozish, reja tuzish va o‘rganishda kuchli yordamchiga aylandi. Uni aniq Prompt bilan boshqarishni o‘rganing.',
    analogyTitle: 'Hayotiy misol: Tajribali yordamchi',
    analogyText:
      'AI ga noaniq "Menga insho yoz" deyish — yordamchiga mavzusiz ish buyurishdek gap. Aniq vazifa, rol, daraja va cheklovlar bilan so‘rasangiz (Prompt), professional natija olasiz.',
    keyPoints: [
      'Prompt — sun’iy intellektga beriladigan aniq savol yoki topshiriq matni.',
      'Kuchli strukturaviy prompt 4 qismdan iborat: Rol (kim sifatida), Kontekst/Daraja, Aniq vazifa va Javob formati (jadval, ro‘yxat).',
      'AI ba’zan haqiqatga o‘xshash to‘qima fakt (gallyutsinatsiya) berishi mumkin, shuning uchun raqam va faktlarni tekshirish shart.',
    ],
    widgetType: 'ai',
  },

  // =========================================================================
  // 2-YO'NALISH: DASTURLASH ASOSLARI (01 - 08)
  // =========================================================================
  {
    id: 'programming-intro',
    number: '01',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '3 daqiqa',
    title: '0 va 1 tili: Dasturlash nima va kompyuter kodni qanday uqadi?',
    summary:
      'Dasturlash — kompyuterga aniq vazifalarni bajarishi uchun u tushunadigan mantiqiy ko‘rsatmalar (kod) yozish jarayonidir. Barcha kod oxir-oqibat 0 va 1 ga aylanadi.',
    analogyTitle: 'Hayotiy misol: Chet ellik tarjimon',
    analogyText:
      'Kompyuter aslida faqat elektr toki bor (1) yoki yo‘q (0) holatini tushunadi. Kompilyator va interpretator esa inson tushunadigan kodni mashinaning 0 va 1 tiliga o‘girib beruvchi tarjimondir.',
    keyPoints: [
      'Ikkilik sanoq tizimida har bir xona o‘ngdan chapga 2 ning darajalari (1, 2, 4, 8, 16, 32...) qiymatiga ega. Masalan: 10110 = 16 + 0 + 4 + 2 + 0 = 22.',
      'Kompilyator kodni oldindan mashina tiliga o‘giradi (C++, Go); interpretator esa qatorma-qator bajaradi (Python, JS).',
      'Kod yozishdagi xatolar "Bug", ularni izlab tuzatish esa "Debugging" deb ataladi.',
    ],
    widgetType: 'binary',
  },
  {
    id: 'algorithm',
    number: '02',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '3 daqiqa',
    title: 'Algoritmlar, Ikkilik qidiruv va Blok-sxemalar',
    summary:
      'Algoritm — ma’lum bir maqsadga erishish uchun bajarilishi kerak bo‘lgan aniq, tushunarli va tartibli qadamlar ketma-ketligidir.',
    analogyTitle: 'Hayotiy misol: Choy damlash retsepti',
    analogyText:
      'Choy damlashda avval choynakka quruq choy solinadi, keyin qaynoq suv quyiladi va 5 daqiqa kutiladi. Qadamlarni almashtirib qo‘ysangiz, kutilgan natija chiqmaydi — dasturda ham xuddi shunday.',
    keyPoints: [
      'Har bir algoritmda 3 bosqich bo‘ladi: Kirish (Input) → Qayta ishlash (Process) → Natija (Output).',
      'Samaradorlik: 1024 ta saralangan sondan birini topishda Chiziqli qidiruv 1024 ta, Ikkilik qidiruv (Binary Search) esa o‘rtadan bo‘lib eng ko‘pi 10 ta qadam sarflaydi!',
      'Buyuk allomamiz Muhammad al-Xorazmiyning nomi dunyo faniga "Algorithm" atamasini olib kirgan.',
    ],
    widgetType: 'algorithm',
  },
  {
    id: 'datatypes-variables',
    number: '03',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '4 daqiqa',
    title: 'O‘zgaruvchilar, Swap va Ma’lumot turlari (String, Number, Boolean)',
    summary:
      'O‘zgaruvchi — ma’lumotni xotirada saqlab turuvchi nomlangan "quti". Turlar (String vs Number) va qiymat almashish (Swap) mantiqini bilish xatolarning oldini oladi.',
    analogyTitle: 'Hayotiy misol: Yozuvli saqlash qutilari',
    analogyText:
      'Ikki stakan ichidagi choy va suvni almashtirish uchun uchinchi bo‘sh stakan (temp) kerak bo‘lganidek, dasturlashda ham a va b ni almashtirishda uchinchi o‘zgaruvchi ishlatiladi.',
    keyPoints: [
      'Qiymat almashtirish (Swap): temp = a; a = b; b = temp; — uchinchi o‘zgaruvchisiz a = b qilsangiz, a ning eski qiymati o‘chib ketadi!',
      'Qoldiqli bo‘lish (% modulo): 27 % 5 = 2 (chunki 27 ni 5 ga bo‘lganda 5 chiqadi va 2 qoldiq qoladi).',
      '"5" + 3 = "53" (matn + son ulanadi), matematik qo‘shish uchun Number("5") + 3 = 8 ishlatiladi.',
    ],
    widgetType: 'datatypes',
  },
  {
    id: 'variables-conditions',
    number: '04',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '4 daqiqa',
    title: 'Shart operatorlari (if / else) va Murakkab mantiq',
    summary:
      'Shart operatorlari dasturga vaziyatga qarab mustaqil qaror qabul qilish qobiliyatini beradi. Mantiqiy operatorlar (&&, ||, !) bir nechta shartni birlashtiradi.',
    analogyTitle: 'Hayotiy misol: Ob-havo va soyabon',
    analogyText:
      'Uydan chiqayotganda: "AGAR yomg‘ir yog‘sa (if) — soyabon ol, AKS HOLDA (else) — quyosh ko‘zoynagini taq". Bankomat va o‘yinlar ham har soniyada shunday qaror qiladi.',
    keyPoints: [
      'if / else if / else zanjirida birinchi mos kelgan shart ishlaydi va qolgan shoxlar tekshirilmaydi.',
      'Mantiqiy inkor (!) rostni yolg‘onga aylantiradi: agar ruxsat = false bo‘lsa, !ruxsat qiymati true bo‘ladi.',
      'Mantiqiy VA (&&) — barcha tomonlar true bo‘lgandagina true; YOKI (||) — kamida bittasi true bo‘lsa yetarli.',
    ],
    widgetType: 'ifelse',
  },
  {
    id: 'loops-arrays',
    number: '05',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '4 daqiqa',
    title: 'Sikllar (for / while), Ichma-ich sikl va Cheksiz sikl',
    summary:
      'Dasturlashning eng katta kuchi — bir xil vazifani charchamasdan soniyasiga million marta bajara olishidir. Accumulator (yig‘indi), ichma-ich sikl va cheksiz sikl xatolarini o‘rganing.',
    analogyTitle: 'Hayotiy misol: 100 ta tabriknoma yuborish',
    analogyText:
      '100 ta o‘quvchiga bitta-bitta salom yozib o‘tirish o‘rniga, sikl orqali: "1 dan 100 gacha har bir o‘quvchiga xabar yubor" deb bitta qisqa buyruq beramiz.',
    keyPoints: [
      'Accumulator (yig‘uvchi): sum = 0; sikl ichida sum = sum + i*2 qilib borilsa, har qadam qiymati qo‘shilib boradi.',
      'Ichma-ich sikl (Nested loop): tashqi sikl 3 marta, ichki sikl 4 marta aylansa, ichidagi kod jami 3 × 4 = 12 marta bajariladi.',
      'Cheksiz sikl tuzog‘i: i = 10; while (i > 0) { i = i + 1; } da i kamaymasdan oshgani uchun sikl hech qachon to‘xtamaydi!',
    ],
    widgetType: 'loops',
  },
  {
    id: 'functions-modules',
    number: '06',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '4 daqiqa',
    title: 'Funksiyalar, Return, Ko‘rinish doirasi (Scope) va Zanjir',
    summary:
      'Funksiya — ma’lum bir vazifani bajaradigan va dasturning istalgan joyidan qayta chaqiriladigan nomlangan kod blokidir. return va Scope tushunchalarini bilish juda muhim.',
    analogyTitle: 'Hayotiy misol: Sharbat chiqargich apparati',
    analogyText:
      'Apparatga meva solasiz (Parametr / Input), ichida jarayon bajariladi va tayyor sharbat qaytariladi (Return). Apparat ichidagi pichoqqa tashqaridan qo‘l tekkizib bo‘lmaganidek, lokal o‘zgaruvchi ham faqat funksiya ichida ko‘rinadi.',
    keyPoints: [
      'return vs console.log: console.log faqat ekranga yozadi, lekin hisobda ishlatish uchun qiymat qaytarmaydi (undefined bo‘ladi); natijani ishlatish uchun return shart!',
      'Mahalliy ko‘rinish doirasi (Local Scope): funksiya ichida ochilgan o‘zgaruvchi funksiya tashqarisida tanilmaydi (ReferenceError).',
      'Funksiyalar bir-birini chaqirishi mumkin: f(x) = 2x+1 bo‘lsa, f(3)+f(2) = 7+5 = 12.',
    ],
    widgetType: 'functions',
  },
  {
    id: 'web-architecture',
    number: '07',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '4 daqiqa',
    title: 'Massivlar, Maksimum topish, JSON va API (404 / 500)',
    summary:
      'Katta ilovalarda ma’lumotlar Massivlar (Array) va JSON obyektlarida saqlanadi hamda Frontend va Backend o‘rtasida API va HTTP status kodlari orqali almashinadi.',
    analogyTitle: 'Hayotiy misol: Restoran xizmati',
    analogyText:
      'Siz ko‘radigan menyu va stol — Frontend. Buyurtmani JSON qog‘ozchasiga yozib oshxonaga eltuvchi ofitsiant — API. Oshxona va muzlatkich esa — Backend va Ma’lumotlar bazasidir.',
    keyPoints: [
      'Massiv oxirgi elementi har doim arr[arr.length - 1] da turadi. Maksimal sonni topishda max = 0 emas, max = arr[0] olish manfiy sonlarda xato chiqishini oldini oladi!',
      'JSON obyekt ichidan olish: user = { fanlar: ["JS", "Python"] } → user.fanlar[1] bu "Python".',
      'HTTP Status kodlari: 200 (Muvaffaqiyatli), 404 (So‘ralgan sahifa/resurs topilmadi), 500 (Server ichki xatosi).',
    ],
    widgetType: 'webarch',
  },
  {
    id: 'languages',
    number: '08',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    readTime: '3 daqiqa',
    title: 'Veb tillar (HTML/CSS/JS), Python va Git (Commit vs Push)',
    summary:
      'Har bir dasturlash tili va vositasi o‘z vazifasiga ega. Veb texnologiyalarining mas’uliyatlari hamda Git versiya boshqaruvi ish oqimini o‘rganing.',
    analogyTitle: 'Hayotiy misol: Uy qurilishi ustalari',
    analogyText:
      'Veb-sayt qurishda HTML — g‘isht va devorlar (skelet), CSS — bo‘yoq va chiroyli bezak (dizayn), JavaScript — eshik, lift va chiroqlarni harakatga keltiruvchi tizim (jonlilik).',
    keyPoints: [
      'HTML — tuzilish (tugma, matn), CSS — ko‘rinish va joylashuv (rang, flex/grid), JavaScript — bosilgandagi jonli mantiq.',
      'Python — o‘qishga qulay sintaksisi tufayli Backend va Sun’iy intellekt (AI) da yetakchi til.',
      'Git ish oqimi: "git commit" o‘zgarishlarni kompyuterdagi lokal tarixga saqlaydi, "git push" esa ularni GitHub kabi masofaviy serverga yuklaydi.',
    ],
    widgetType: 'languages',
  },
];

export const DID_YOU_KNOW_CARDS: DidYouKnowItem[] = [
  // --- SAVODXONLIK SAVOLLARI (8 ta) ---
  {
    id: 'dyk-lit-1',
    category: 'literacy',
    topic: 'Tezkor xotira (RAM)',
    question: 'Bir vaqtda brauzerda 30 ta oyna ochilsa, kompyuter nima uchun qotib qoladi?',
    hint: 'Oshpazning ish stoli — RAM xotirasini eslang.',
    answer:
      'Har bir ochiq oyna RAM (tezkor xotira) dan joy egallaydi. Agar RAM to‘lib ketsa, kompyuter vaqtincha ma’lumotlarni sekinroq ishlaydigan SSD/HDD diskka ko‘chirishga majbur bo‘ladi va natijada tezlik keskin pasayadi.',
  },
  {
    id: 'dyk-lit-2',
    category: 'literacy',
    topic: 'Internet xavfsizligi',
    question: 'Sayt manzili boshidagi "https://" da turgan "s" harfi nimani anglatadi?',
    hint: 'Ma’lumotlarning himoyalangan uzatilishini o‘ylab ko‘ring.',
    answer:
      '"S" harfi "Secure" (Xavfsiz) so‘zidan olingan. Bunday saytlarda siz kiritgan parol va karta ma’lumotlari shifrlangan holda uzatiladi, ya’ni yo‘lda begonalar ularni o‘qiy olmaydi.',
  },
  {
    id: 'dyk-lit-3',
    category: 'literacy',
    topic: 'Ofis savodxonligi',
    question: 'Excel katakchasiga "=SUM(A1:A5)" o‘rniga oddiy "SUM(A1:A5)" yozilsa nima bo‘ladi?',
    hint: 'Excel formula ekanligini qanday belgi orqali taniydi?',
    answer:
      'Excel uni hisob-kitob formulasi deb qabul qilmaydi va shunchaki oddiy matn sifatida qoldiradi. Har qanday hisoblash formulasi albatta "=" (tenglik) belgisi bilan boshlanishi shart.',
  },
  {
    id: 'dyk-lit-4',
    category: 'literacy',
    topic: 'Fayl turlari',
    question: 'Nima uchun rasmiy rezyume yoki shartnomani Word (.docx) emas, PDF (.pdf) formatida yuborish tavsiya etiladi?',
    hint: 'Boshqa kompyuterda shriftlar o‘zgarib ketishi haqida o‘ylang.',
    answer:
      'PDF formati hujjatning ko‘rinishi, shrifti va jadvallarini qat’iy muhrlab qo‘yadi. Uni telefonda ham, boshqa kompyuterda ham ochsangiz, joylashuvi zarracha buzilmaydi.',
  },
  {
    id: 'dyk-lit-5',
    category: 'literacy',
    topic: 'Tarmoq va DNS',
    question: 'Brauzerga "google.com" yozganingizda aslida telefon kitobi kabi ishlaydigan qaysi tizim yordamga keladi?',
    hint: 'Sayt nomini raqamli IP manzilga aylantiruvchi xizmat.',
    answer:
      'Bu DNS (Domain Name System). Kompyuterlar harflarni emas, IP raqamlarni tushunadi; DNS esa "google.com" nomini darhol kerakli serverning IP manziliga tarjima qiladi.',
  },
  {
    id: 'dyk-lit-6',
    category: 'literacy',
    topic: 'Klaviatura sirlari',
    question: 'Adashib muhim hujjatdagi butun boshli paragrafni o‘chirib yubordingiz. Eng tezkor qutqaruv yo‘li qaysi?',
    hint: 'Bekor qilish (Undo) tugma birikmasini eslang.',
    answer:
      'Darhol Ctrl + Z (Mac da Cmd + Z) tugmasini bosing. U oxirgi qilingan amalni soniyalar ichida ortga qaytaradi va o‘chirilgan matnni tiklaydi.',
  },
  {
    id: 'dyk-lit-7',
    category: 'literacy',
    topic: 'Disk xotirasi',
    question: 'Nega 512 GB lik yangi SSD diskni kompyuterga qo‘yganda, tizimda taxminan 476 GB ko‘rinadi?',
    hint: 'Ishlab chiqaruvchilar 1000 ga, kompyuter esa 1024 ga bo‘lib hisoblaydi.',
    answer:
      'Disk ishlab chiqaruvchilar 1 kilobaytni 1000 bayt deb hisoblaydi, operatsion tizim esa ikkilik sanoq tizimida 1024 bayt deb o‘lchaydi. Farq shuning hisobiga kelib chiqadi, disk buzilmagan!',
  },
  {
    id: 'dyk-lit-8',
    category: 'literacy',
    topic: 'Raqamli gigiyena',
    question: 'Bank kartasi raqami va orqasidagi 3 xonali CVV kodini telefon orqali so‘ragan odamga berish mumkinmi?',
    hint: 'Hatto haqiqiy bank xodimi ham bu ma’lumotni so‘ramaydi.',
    answer:
      'Aslo mumkin emas! CVV kodi va telefonga keladigan SMS tasdiq kodi faqat sizga tegishli maxfiy kalitlardir. Ularni so‘raydigan har qanday shaxs — 100% firibgar.',
  },

  // --- DASTURLASH SAVOLLARI (8 ta) ---
  {
    id: 'dyk-prog-1',
    category: 'programming',
    topic: 'Kompyuter tarixi',
    question: 'Dasturdagi xato nima uchun "Bug" (qo‘ng‘izcha) deb ataladi?',
    hint: '1947-yilda Harvard universitetidagi ulkan kompyuter ichida haqiqiy voqea sodir bo‘lgan.',
    answer:
      '1947-yilda Mark II nomli kompyuter ishlamay qolganda, muhandislar uning relelari orasidan haqiqiy tungi kapalakni topishgan va kundalikka "birinchi haqiqiy bug topildi" deb yozishgan. Shu-shu xatolarni tuzatish "debugging" deyiladi.',
  },
  {
    id: 'dyk-prog-2',
    category: 'programming',
    topic: 'Ikkilik sanoq tizimi',
    question: 'Nima uchun kompyuterlar 10 ta raqam o‘rniga faqat 0 va 1 ni ishlatadi?',
    hint: 'Elektron sxemalar va tranzistorlarning fizik holati haqida o‘ylab ko‘ring.',
    answer:
      'Kompyuter ichidagi milliardlab mitti kalitlar (tranzistorlar) faqat ikki holatda bo‘la oladi: tok o‘tmoqda (1 — yoqilgan) yoki tok o‘tmayapti (0 — o‘chirilgan). Bu usul eng ishonchli va xatosiz hisoblanadi.',
  },
  {
    id: 'dyk-prog-3',
    category: 'programming',
    topic: 'Veb texnologiya',
    question: 'HTML dasturlash tili hisoblanadimi?',
    hint: 'Unda "agar-aks holda" shartlari yoki matematik hisoblar bormi?',
    answer:
      'Yo‘q! HTML (HyperText Markup Language) — bu gipermatnli belgilash tili. U sahifada sarlavha, matn, rasm va tugmalar qayerda turishini ko‘rsatadi, ammo mantiqiy qarorlar qabul qilmaydi. Mantiq uchun JavaScript ishlatiladi.',
  },
  {
    id: 'dyk-prog-4',
    category: 'programming',
    topic: 'Massivlar mantiqi',
    question: 'Nima uchun dasturlashda ro‘yxat (massiv) indeksi 1 dan emas, 0 dan boshlanadi?',
    hint: 'Kompyuter xotirasidagi manzil (masofa) tushunchasini o‘ylab ko‘ring.',
    answer:
      'Birinchi element xotira boshidan 0 qadam uzoqlikda joylashgani uchun uning indeksi 0 bo‘ladi, ikkinchi element esa 1 qadam uzoqlikda (indeksi 1). Bu kompyuterga manzilni tez hisoblashga yordam beradi.',
  },
  {
    id: 'dyk-prog-5',
    category: 'programming',
    topic: 'Algoritm tartibi',
    question: 'Agar choy damlash algoritmida suvni qaynatmasdan choy solsangiz nima bo‘ladi?',
    hint: 'Algoritmda tartib qanchalik muhim?',
    answer:
      'Choy rangi chiqmaydi va mazasi o‘zgarmaydi! Dasturlashda ham huddi shunday: kod satrlarining ketma-ketligi buzilsa (masalan, o‘zgaruvchini yaratmasdan turib uni ekranga chiqarsangiz), dastur xato beradi.',
  },
  {
    id: 'dyk-prog-6',
    category: 'programming',
    topic: 'Ma’lumot turlari',
    question: 'JavaScript da "5" + 3 natijasi nima uchun 8 emas, "53" chiqadi?',
    hint: 'Qo‘shtirnoq ichidagi "5" son emas, matn (String) hisoblanadi!',
    answer:
      '"5" matn (String) turida bo‘lgani uchun + belgisi qo‘shish o‘rniga matnlarni yonma-yon ulab qo‘yadi: "5" + "3" = "53". Matematik qo‘shish uchun ikkalasi ham qo‘shtirnoqsiz son (5 + 3) bo‘lishi kerak.',
  },
  {
    id: 'dyk-prog-7',
    category: 'programming',
    topic: 'Sikllar xavfsizligi',
    question: 'while (true) { ... } sikli to‘xtatish shartisiz yozilsa, dasturga nima bo‘ladi?',
    hint: 'To‘xtash sharti bo‘lmagan sikl qachon tugaydi?',
    answer:
      'U cheksiz sikl (Infinite Loop) ga tushib qoladi! Kompyuter protsessori 100% band bo‘lib, dastur yoki brauzer oynasi qotib qoladi. Har bir while siklidan chiqish sharti bo‘lishi zarur.',
  },
  {
    id: 'dyk-prog-8',
    category: 'programming',
    topic: 'Frontend va Backend',
    question: 'Nima uchun login va parolni tekshirish faqat Frontend (brauzer) da emas, Backend (server) da amalga oshiriladi?',
    hint: 'Brauzerdagi kodni foydalanuvchi ko‘ra oladimi?',
    answer:
      'Brauzerda ishlaydigan JavaScript kodini istalgan odam F12 orqali ko‘rishi va o‘zgartirishi mumkin. Parollar va maxfiy ma’lumotlar faqat himoyalangan serverda (Backend) tekshiriladi.',
  },
];

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // =========================================================================
  // 1-YO'NALISH: KOMPYUTER SAVODXONLIGI IMTIHONI (20 ta murakkab savol: id 1 - 20)
  // =========================================================================
  {
    id: 1,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Foydalanuvchi Word hujjatini yozib bo‘ldi, lekin "Saqlash" (Ctrl+S) tugmasini bosmasdan elektr toki o‘chib qoldi. Hujjatdagi oxirgi o‘zgarishlar qaysi xotirada turgani uchun yo‘qoladi?',
    options: [
      'A) SSD diskda turgani uchun saqlanib qoladi',
      'B) Faqat tezkor xotira (RAM) da turgani uchun o‘chib ketadi',
      'C) Protsessor (CPU) ichida doimiy saqlanib qoladi',
      'D) Videokarta (GPU) xotirasida abadiy qoladi',
    ],
    correctIndex: 1,
    explanation:
      'Saqlanmagan hujjat va ochiq dasturlar elektrga bog‘liq RAM xotirasida turadi; SSD ga yozish uchun Ctrl+S bosish kerak.',
  },
  {
    id: 2,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      '4 MB hajmdagi rasm faylini 512 KB/soniya tezlikdagi internet orqali yuklab olish uchun aniq necha soniya vaqt ketadi? (1 MB = 1024 KB)',
    options: [
      'A) 4 soniya',
      'B) 6 soniya',
      'C) 8 soniya',
      'D) 16 soniya',
    ],
    correctIndex: 2,
    explanation:
      '4 MB = 4 × 1024 = 4096 KB. Yuklash vaqti: 4096 / 512 = 8 soniya.',
  },
  {
    id: 3,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Sizga pochta orqali "oylik_hisobot_2026.pdf.exe" nomli fayl keldi. Ushbu faylning haqiqiy turi nima va uni ochish nima uchun xavfli?',
    options: [
      'A) Oddiy PDF hujjat, xavfsiz ochish mumkin',
      'B) Siqilgan arxiv fayli, faqat WinRAR bilan ochiladi',
      'C) Haqiqiy kengaytmasi ".exe" bo‘lgan bajariluvchi dastur — virus bo‘lishi mumkin',
      'D) Yuqori sifatli rasm fayli, sekin ochiladi',
    ],
    correctIndex: 2,
    explanation:
      'Qo‘sh kengaytma firibgarlar usulidir: Windows oxirgi nuqtadan keyingi ".exe" ni haqiqiy dastur turi deb qabul qiladi.',
  },
  {
    id: 4,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Matn muharririda 1-abzasni Ctrl+X bilan qirqib oldingiz, so‘ng joylashtirmasdan turib 2-so‘zni Ctrl+C bilan nusxaladingiz. Endi Ctrl+V bosilsa ekranga nima chiqadi?',
    options: [
      'A) 1-abzas joylashadi',
      'B) Ikkalasi ham ketma-ket joylashadi',
      'C) Faqat oxirgi nusxalangan 2-so‘z joylashadi',
      'D) Hech narsa chiqmaydi, xato beradi',
    ],
    correctIndex: 2,
    explanation:
      'Oddiy almashinuv buferi (Clipboard) faqat oxirgi nusxalangan yoki qirqilgan bitta ma’lumotni saqlaydi.',
  },
  {
    id: 5,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Excel jadvalida A1=10, A2=20, A3=30 va B1=5 qiymatlari turibdi. Katakchaga "=SUM(A1:A3)/B1 + 4" formulasi yozilsa, natija nechiga teng bo‘ladi?',
    options: [
      'A) 10',
      'B) 12',
      'C) 16',
      'D) 24',
    ],
    correctIndex: 2,
    explanation:
      'SUM(A1:A3) = 10 + 20 + 30 = 60. Keyin 60 / 5 = 12, va 12 + 4 = 16.',
  },
  {
    id: 6,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Excelda C2 katakchasiga "=B2*$A$1" formulasi yozilib, pastga (C3, C4...) cho‘zib nusxalandi. Nima uchun $A$1 manzili o‘zgarmay qoladi?',
    options: [
      'A) "$" belgisi natijani dollarda hisoblaydi',
      'B) "$A$1" mutlaq (qotirilgan) manzil bo‘lib, nusxalanganda surilmaydi',
      'C) Excel har doim A ustunini o‘zgartirmaydi',
      'D) B2 bo‘sh bo‘lganda shunday bo‘ladi',
    ],
    correctIndex: 1,
    explanation:
      'Excelda "$" belgisi ustun va qatorni qulflaydi (Absolute reference), shu sababli nusxalashda $A$1 o‘zgarmaydi.',
  },
  {
    id: 7,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Kompyuteringizda Telegram ishlab turibdi, brauzerga "142.250.185.78" IP manzilini tersangiz Google ochilyapti, lekin "google.com" yozsangiz sayt ochilmayapti. Qaysi tizimda muammo bor?',
    options: [
      'A) Videokarta (GPU) ishdan chiqqan',
      'B) DNS (Domain Name System) serverida nosozlik bor',
      'C) Monitor kabeli uzilgan',
      'D) SSD xotira to‘lib qolgan',
    ],
    correctIndex: 1,
    explanation:
      'IP manzil orqali ulanish bor, demak internet ishlayapti; domen nomini IP ga aylantiruvchi DNS xizmati ishlamayapti.',
  },
  {
    id: 8,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Kafedagi parolsiz bepul Wi-Fi tarmog‘ida o‘tirib, manzili "http://" (S harfisiz) bilan boshlanadigan saytga login va parol kiritishning asosiy xavfi nimada?',
    options: [
      'A) Saytning shriftlari chiroyli ko‘rinmaydi',
      'B) Ma’lumotlar shifrlanmay uzatilgani uchun bir tarmoqdagi xaker parolni ushlab olishi mumkin',
      'C) Kompyuter batareyasi ikki barobar tez tugaydi',
      'D) Brauzer keshini to‘ldirib yuboradi',
    ],
    correctIndex: 1,
    explanation:
      'HTTP trafiki ochiq matn ko‘rinishida uzatiladi; ochiq Wi-Fi da uni tinglab parollarni o‘g‘irlash (MITM hujumi) juda oson.',
  },
  {
    id: 9,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'SMS da kelgan "https://payme-uz-bonus.click/login" havolasi nima uchun soxta (fishing) sayt hisoblanadi, garchi boshida "https://" va "payme" so‘zi bor bo‘lsa ham?',
    options: [
      'A) Havolada tire (-) belgisi bo‘lishi mumkin emas',
      'B) Asosiy domen "payme.uz" emas, balki begona "payme-uz-bonus.click" domenidir',
      'C) Haqiqiy saytlar faqat http:// bilan ochiladi',
      'D) Telefon brauzerida click domenlari ishlamaydi',
    ],
    correctIndex: 1,
    explanation:
      'HTTPS faqat aloqa shifrlanganini bildiradi, sayt halolligini emas! Asosiy domen oxirgi qismda ("payme-uz-bonus.click") turibdi.',
  },
  {
    id: 10,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Agar xaker bitta kichik sayt ma’lumotlar bazasidan parolingizni o‘g‘irlab olsa, bank va Telegram akkauntlaringiz ham xavf ostida qolmasligi uchun qaysi ikkita qoida shart?',
    options: [
      'A) Har hafta brauzer tarixini o‘chirish va kompyuterni qayta yoqish',
      'B) Har bir xizmatda alohida noyob parol ishlatish hamda 2FA (ikki bosqichli himoya) ni yoqish',
      'C) Barcha saytlarda bitta murakkab parolni saqlab yurish',
      'D) Faqat tungi rejimda ishlash',
    ],
    correctIndex: 1,
    explanation:
      'Bir xil parol ishlatilsa, bitta saytdan sizgan parol hamma joyga tushadi; noyob parollar va 2FA bunga to‘liq to‘siq qo‘yadi.',
  },
  {
    id: 11,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Kompyuterda Google Drive sinxronizatsiyasi yoqilgan papkadan muhim faylni o‘chirib yubordingiz. Bulutda nima sodir bo‘ladi va uni qanday tiklash mumkin?',
    options: [
      'A) Bulutda saqlanib qolaveradi, o‘chmaydi',
      'B) Bulutdan ham o‘chadi, lekin Drive Savatchasi (Trash) dan belgilangan muddat ichida tiklash mumkin',
      'C) Umuman tiklab bo‘lmaydi',
      'D) Faqat Ctrl+Z bilan kompyuterni o‘chirgandan keyin qaytadi',
    ],
    correctIndex: 1,
    explanation:
      'Sinxronizatsiya ikki tomonlama ishlaydi — mahalliy o‘chirish bulutga ham ta’sir qiladi, biroq bulut Savatchasi faylni saqlab turadi.',
  },
  {
    id: 12,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Sizda 50 MB hajmli oddiy matn (.txt) fayli va 50 MB hajmli video (.mp4) fayli bor. Ikkalasini alohida .zip arxiv qilsangiz, qaysi biri hajmi sezilarli darajada kichrayadi?',
    options: [
      'A) Video (.mp4), chunki video fayllar yengil siqiladi',
      'B) Matn (.txt), chunki matnda takrorlanuvchi belgilar ko‘p, .mp4 esa allaqachon siqilgan',
      'C) Ikkalasi ham aniq 2 barobar kichrayadi',
      'D) Hech qaysi kichraymaydi, .zip hajmni oshiradi',
    ],
    correctIndex: 1,
    explanation:
      'Matn fayllarida bo‘shliqlar va takrorlanuvchi baytlar ko‘pligi uchun ZIP juda yaxshi siqadi; MP4 va JPG esa oldindan siqilgan formatlardir.',
  },
  {
    id: 13,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Bir vaqtning o‘zida 20 ta brauzer oynasi, video montaj va musiqa dasturini qotmasdan ishlatish uchun 1 yadroli 4.0 GHz CPU yaxshimi yoki 6 yadroli 3.2 GHz CPU?',
    options: [
      'A) 1 yadroli 4.0 GHz har doim tezroq',
      'B) 6 yadroli 3.2 GHz, chunki ko‘p yadro parallel vazifalarni (multitasking) bo‘lib bajaradi',
      'C) Yadrolar soni tezlikka ta’sir qilmaydi',
      'D) Ikkalasi ham faqat printer tezligiga bog‘liq',
    ],
    correctIndex: 1,
    explanation:
      'Ko‘p dasturli (multitasking) ishda bir nechta yadro vazifalarni parallel taqsimlab bajaradi va kompyuter qotib qolmaydi.',
  },
  {
    id: 14,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Hamkasbingiz shartnoma matniga o‘zgartirish kiritishi kerak bo‘lsa qaysi formatda, bosmaxonaga o‘zgarmas ko‘rinishda yuborish uchun esa qaysi formatda jo‘natasiz?',
    options: [
      'A) Tahrirlashga .pdf, chop etishga .txt',
      'B) Tahrirlashga .docx, o‘zgarmas chop etishga .pdf',
      'C) Ikkalasiga ham .jpg rasm qilib',
      'D) Tahrirlashga .exe, chop etishga .zip',
    ],
    correctIndex: 1,
    explanation:
      'DOCX matn va jadvalni qulay tahrirlash uchun, PDF esa har qanday qurilma va printerda shrift buzilmasligi uchun ishlatiladi.',
  },
  {
    id: 15,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Kompyuterga yangi printer yoki grafik planshet ulaganingizda operatsion tizim u bilan to‘g‘ri "gaplasha olishi" uchun o‘rnatiladigan maxsus dastur nima deyiladi?',
    options: [
      'A) Brauzer',
      'B) Drayver (Driver)',
      'C) Kompilyator',
      'D) Arxivator',
    ],
    correctIndex: 1,
    explanation:
      'Drayver — operatsion tizim va apparat qurilmasi (printer, videokarta va h.k.) o‘rtasida til topishtiruvchi boshqaruv dasturidir.',
  },
  {
    id: 16,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Kompyuteringiz birdan juda qizib, qotib qoldi. Ctrl+Shift+Esc (Task Manager) ni ochganingizda noma’lum dastur CPU ning 98% ini band qilib turganini ko‘rdingiz. To‘g‘ri harakat qaysi?',
    options: [
      'A) Darhol rozetkadan elektr simini sug‘urib olish',
      'B) Jarayon nomini tekshirib, qotgan dasturni "End Task" (Vazifani tugatish) bilan yopish va antivirus tekshiruvi o‘tkazish',
      'C) Monitorni o‘chirib yoqish',
      'D) Klaviatura tilini o‘zgartirish',
    ],
    correctIndex: 1,
    explanation:
      'Task Manager yordamida ortiqcha yuklama berayotgan dasturni to‘xtatish va xavfsizlik tekshiruvidan o‘tkazish eng to‘g‘ri yo‘ldir.',
  },
  {
    id: 17,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Sun’iy intellekt (AI) dan mukammal natija olish uchun quyidagi promptlardan qaysi biri eng to‘g‘ri va professional tuzilgan?',
    options: [
      'A) "Python o‘rgat"',
      'B) "Kod yozib ber tez"',
      'C) "Sen tajribali Python o‘qituvchisisan. 14 yoshli boshlovchi uchun sikllar mavzusini 3 ta hayotiy misol va jadval bilan o‘zbek tilida tushuntir."',
      'D) "Menga kompyuter haqida hamma narsani ayt"',
    ],
    correctIndex: 2,
    explanation:
      'Sifatli strukturaviy promptda Rol, auditoriya darajasi, aniq vazifa, format va til ko‘rsatiladi.',
  },
  {
    id: 18,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Do‘kondan 16 GB yozuvli flesh-xotira sotib oldingiz, lekin Windows ga ulaganda u taxminan 14.9 GB bo‘lib ko‘rinyapti. Buning haqiqiy sababi nima?',
    options: [
      'A) Sotuvchi 1.1 GB joyni yashirincha o‘chirib qo‘ygan',
      'B) Ishlab chiqaruvchi 1 GB = 1000 MB deb, operatsion tizim esa 1024 lik sanoqda hisoblagani uchun',
      'C) Flesh-xotira virus bilan zararlangan',
      'D) USB port eski bo‘lgani uchun sig‘im kamaygan',
    ],
    correctIndex: 1,
    explanation:
      '16 × 1000³ bayt ÷ (1024³) ≈ 14.9 GiB. Bu normal hisoblash tizimlari farqidir.',
  },
  {
    id: 19,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Brauzerdagi "Cache" (Kesh) va "Cookie" tushunchalarining asosiy farqi nimada?',
    options: [
      'A) Ikkalasi ham faqat parollarni o‘chiradi',
      'B) Cache sayt rasmlari/fayllarini tez ochish uchun saqlaydi; Cookie esa login sessiyasi va shaxsiy sozlamalarni eslab qoladi',
      'C) Cookie virus, Cache esa antivirus',
      'D) Cache faqat telefonda, Cookie faqat noutbukda ishlaydi',
    ],
    correctIndex: 1,
    explanation:
      'Kesh saytni tez yuklashga xizmat qiladi, Cookie esa saytga qaytib kirganda akkauntda qolishingizni ta’minlaydi.',
  },
  {
    id: 20,
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    question:
      'Muhim diplom ishi yoki loyiha kodlarini yo‘qotmaslik uchun "3-2-1 zaxira qoidasi" nimani anglatadi?',
    options: [
      'A) Faylni soat 3, 2 va 1 da tekshirish',
      'B) Kamida 3 ta nusxa, 2 xil saqlash qurilmasida (SSD + tashqi disk) va 1 tasini boshqa joyda (bulutda) saqlash',
      'C) 3 ta papkada 2 ta nom bilan 1 ta diskda saqlash',
      'D) Parolni 3 ta raqam, 2 ta harf, 1 ta belgidan tuzish',
    ],
    correctIndex: 1,
    explanation:
      '3-2-1 qoidasi hatto bitta kompyuter buzilsa yoki yo‘qolsa ham ma’lumotlar 100% saqlanib qolishini kafolatlaydi.',
  },

  // =========================================================================
  // 2-YO'NALISH: DASTURLASH ASOSLARI IMTIHONI (20 ta murakkab savol: id 21 - 40)
  // =========================================================================
  {
    id: 21,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Kompyuter xotirasidagi "10110" ikkilik (binary) soni oddiy o‘nlik sanoq tizimida qaysi songa teng?',
    options: [
      'A) 18',
      'B) 20',
      'C) 22',
      'D) 26',
    ],
    correctIndex: 2,
    explanation:
      'O‘ngdan chapga darajalar (16, 8, 4, 2, 1): 1×16 + 0×8 + 1×4 + 1×2 + 0×1 = 16 + 4 + 2 = 22.',
  },
  {
    id: 22,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Dasturchi ikki o‘zgaruvchi qiymatini almashtirmoqchi bo‘lib "a = 5; b = 9; a = b; b = a;" kodini yozdi. Yakunda a va b nechiga teng bo‘ladi?',
    options: [
      'A) a = 9, b = 5',
      'B) a = 5, b = 5',
      'C) a = 9, b = 9',
      'D) a = 14, b = 9',
    ],
    correctIndex: 2,
    explanation:
      'a = b bajarilganda a ning eski qiymati (5) yo‘qolib 9 ga aylanadi; keyin b = a bajarilganda b ham 9 bo‘lib qoladi. To‘g‘ri almashish uchun 3-o‘zgaruvchi (temp) kerak!',
  },
  {
    id: 23,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'JavaScript da:  let a = "5";  let b = 3;  let x = a + b;  let y = Number(a) + b;  bo‘lsa, x va y qiymatlari nima bo‘ladi?',
    options: [
      'A) x = 8, y = 8',
      'B) x = "53", y = 8',
      'C) x = 8, y = "53"',
      'D) x = "5+3", y = 53',
    ],
    correctIndex: 1,
    explanation:
      '"5" String bo‘lgani uchun a + b matnlarni ulab "53" qiladi; Number("5") esa uni songa aylantirib 5 + 3 = 8 natijasini beradi.',
  },
  {
    id: 24,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Qoldiqli bo‘lish (%) amali berilgan:  x = 27 % 5;  y = x * 3 - 1;  Kod bajarilgandan so‘ng y qiymati nechiga teng?',
    options: [
      'A) 4',
      'B) 5',
      'C) 14',
      'D) 15',
    ],
    correctIndex: 1,
    explanation:
      '27 ni 5 ga bo‘lganda 5 chiqadi va qoldiq x = 2 bo‘ladi. Keyin y = 2 × 3 - 1 = 5.',
  },
  {
    id: 25,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'ball = 85;  if (ball >= 90) natija = "A"; else if (ball >= 70) natija = "B"; else if (ball >= 80) natija = "C"; else natija = "D"; — yakunda natija nima bo‘ladi?',
    options: [
      'A) "A"',
      'B) "B"',
      'C) "C"',
      'D) "D"',
    ],
    correctIndex: 1,
    explanation:
      'if / else if zanjirida birinchi to‘g‘ri kelgan shart ishlaydi! 85 >= 70 rost bo‘lgani uchun darhol "B" tanlanadi va keyingi else if tekshirilmaydi.',
  },
  {
    id: 26,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'yosh = 16;  ruxsat = false;  toloviBor = true;  bo‘lsa,  (yosh >= 18 || toloviBor) && !ruxsat  mantiqiy ifodasi qanday qiymat qaytaradi?',
    options: [
      'A) true (rost)',
      'B) false (yolg‘on)',
      'C) 16',
      'D) Xato beradi',
    ],
    correctIndex: 0,
    explanation:
      '(false || true) = true; !ruxsat (!false) = true; yakunda true && true = true chiqadi.',
  },
  {
    id: 27,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Quyidagi sikl to‘liq bajarilgandan keyin sum o‘zgaruvchisi nechiga teng bo‘ladi?   sum = 0;  for (i = 1; i <= 4; i++) { sum = sum + i * 2; }',
    options: [
      'A) 10',
      'B) 16',
      'C) 20',
      'D) 24',
    ],
    correctIndex: 2,
    explanation:
      'i = 1 → +2; i = 2 → +4; i = 3 → +6; i = 4 → +8. Jami: 2 + 4 + 6 + 8 = 20.',
  },
  {
    id: 28,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'count = 0;  for (i = 1; i <= 10; i++) { if (i % 3 === 0) count++; }  kodi bajarilsa count nechiga teng bo‘ladi?',
    options: [
      'A) 2',
      'B) 3',
      'C) 4',
      'D) 10',
    ],
    correctIndex: 1,
    explanation:
      '1 dan 10 gacha 3 ga qoldiqsiz bo‘linadigan sonlar faqat 3, 6 va 9 (jami 3 ta).',
  },
  {
    id: 29,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Dasturchi quyidagi siklni yozdi:  i = 10;  while (i > 0) { i = i + 1; }  Bu kod ishga tushirilsa nima sodir bo‘ladi?',
    options: [
      'A) Sikl 10 marta aylanib to‘xtaydi',
      'B) Sikl umuman ishlamaydi',
      'C) Cheksiz sikl (Infinite Loop) yuzaga kelib dastur qotib qoladi',
      'D) i avtomatik 0 ga aylanadi',
    ],
    correctIndex: 2,
    explanation:
      'i = 10 dan boshlanib har qadamda 1 ga ortib bormoqda (11, 12, 13...), shuning uchun i > 0 sharti hech qachon false bo‘lmaydi.',
  },
  {
    id: 30,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Ichma-ich sikl berilgan:  for (i = 1; i <= 3; i++) { for (j = 1; j <= 4; j++) { ish++; } }  Sikl tugaganda ish nechiga teng bo‘ladi?',
    options: [
      'A) 7',
      'B) 12',
      'C) 16',
      'D) 4',
    ],
    correctIndex: 1,
    explanation:
      'Tashqi siklning har bir qadamida (3 ta) ichki sikl to‘liq 4 marta aylanadi: 3 × 4 = 12.',
  },
  {
    id: 31,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'sonlar = [10, 25, 40, 55]; massivi berilgan.  sonlar[1] + sonlar[sonlar.length - 1]  ifodasining natijasi nechiga teng?',
    options: [
      'A) 50',
      'B) 65',
      'C) 80',
      'D) 95',
    ],
    correctIndex: 2,
    explanation:
      'sonlar[1] = 25 (chunki indeks 0 dan boshlanadi). sonlar.length = 4 bo‘lsa, sonlar[3] = 55. Jami: 25 + 55 = 80.',
  },
  {
    id: 32,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Massivdan eng katta sonni topish uchun boshlang‘ich "max = 0" deb olinsa, [-15, -3, -9] massivida funksiya qanday xato natija qaytaradi?',
    options: [
      'A) To‘g‘ri -3 qaytaradi',
      'B) Noto‘g‘ri 0 qaytaradi, chunki 0 barcha manfiy sonlardan katta',
      'C) -15 qaytaradi',
      'D) Massiv uzunligini qaytaradi',
    ],
    correctIndex: 1,
    explanation:
      'Hech qaysi manfiy son 0 dan katta emas, shuning uchun max = 0 o‘zgarmay qoladi. Doim max = arr[0] deb boshlash shart!',
  },
  {
    id: 33,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'function kvadrat(n) { console.log(n * n); }  funksiyasi yozilgan (return yo‘q!).  let x = kvadrat(4) + 2;  qatorida x nimaga aylanadi?',
    options: [
      'A) 18 ga teng bo‘ladi',
      'B) 16 ga teng bo‘ladi',
      'C) return bo‘lmagani uchun funksiya undefined qaytaradi va x hisoblanmaydi (NaN)',
      'D) 6 ga teng bo‘ladi',
    ],
    correctIndex: 2,
    explanation:
      'console.log faqat ekranga chiqaradi, qiymat qaytarmaydi. Matematik hisobda ishlatish uchun albatta return n * n yozilishi kerak.',
  },
  {
    id: 34,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Funksiyalar berilgan:  f(x) { return x * 2 + 1; }  va  g(y) { return f(y) + f(y - 1); }  Agar g(3) chaqirilsa, qanday son qaytadi?',
    options: [
      'A) 10',
      'B) 12',
      'C) 14',
      'D) 16',
    ],
    correctIndex: 1,
    explanation:
      'f(3) = 3×2 + 1 = 7; f(2) = 2×2 + 1 = 5. Demak g(3) = 7 + 5 = 12.',
  },
  {
    id: 35,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Funksiya ichida "let maxfiy = 42;" o‘zgaruvchisi yaratildi. Funksiya tashqarisida "console.log(maxfiy);" yozilsa nima bo‘ladi?',
    options: [
      'A) 42 chiqadi',
      'B) 0 chiqadi',
      'C) Xatolik (ReferenceError) chiqadi, chunki mahalliy o‘zgaruvchi tashqarida ko‘rinmaydi',
      'D) "maxfiy" matni chiqadi',
    ],
    correctIndex: 2,
    explanation:
      'Funksiya ichida ochilgan o‘zgaruvchi Lokal Scope da yashaydi va funksiya tugashi bilan tashqaridan ko‘rinmaydi.',
  },
  {
    id: 36,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'user = { ism: "Ali", fanlar: ["JS", "Python", "SQL"] } JSON obyektidan "Python" so‘zini olish uchun to‘g‘ri kod qaysi?',
    options: [
      'A) user.fanlar[2]',
      'B) user.fanlar[1]',
      'C) user[1].fanlar',
      'D) fanlar.user[0]',
    ],
    correctIndex: 1,
    explanation:
      'Obyekt maydoniga user.fanlar orqali kiriladi, massiv ichidagi 2-element esa 1-indeksda ("Python") turadi.',
  },
  {
    id: 37,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Saralangan 1024 ta sondan iborat ro‘yxatdan bitta sonni topishda Ikkilik qidiruv (Binary Search) eng ko‘pi bilan taxminan nechta tekshiruv bajaradi?',
    options: [
      'A) 10 ta qadam',
      'B) 512 ta qadam',
      'C) 1024 ta qadam',
      'D) 100 ta qadam',
    ],
    correctIndex: 0,
    explanation:
      'Binary Search har qadamda ro‘yxatni teng ikkiga bo‘ladi: 2¹⁰ = 1024 bo‘lgani uchun atigi 10 ta qadamda aniq topadi!',
  },
  {
    id: 38,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Frontend ilova Backend API ga so‘rov yuborganda serverdan 404 yoki 500 status kodi qaytdi. Bular mos ravishda nimani bildiradi?',
    options: [
      'A) 404 — muvaffaqiyatli, 500 — internet o‘chgan',
      'B) 404 — so‘ralgan manzil/resurs topilmadi, 500 — server ichki xatosi',
      'C) 404 — parol to‘g‘ri, 500 — foydalanuvchi ko‘paydi',
      'D) Ikkalasi ham ma’lumot bazasi to‘lganini bildiradi',
    ],
    correctIndex: 1,
    explanation:
      'HTTP protokolida 200 — OK, 404 — Not Found (Topilmadi), 500 — Internal Server Error (Server xatosi) ni bildiradi.',
  },
  {
    id: 39,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Veb-sahifada <button class="btn" onclick="hisobla()">Sotib olish</button> tugmasining rangi va soya effektini o‘zgartirish hamda bosilganda narxni hisoblash qaysi tillarga kiradi?',
    options: [
      'A) Rangi HTML, hisoblash CSS',
      'B) Rangi va dizayni CSS, bosilgandagi hisoblash mantiqi JavaScript',
      'C) Ikkalasini ham faqat SQL bajaradi',
      'D) Rangi Python, bosilishi HTML',
    ],
    correctIndex: 1,
    explanation:
      'HTML tugmani yaratadi, CSS uni bezaydi (.btn), JavaScript esa hisobla() funksiyasi orqali harakatni bajaradi.',
  },
  {
    id: 40,
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    question:
      'Dasturchilar foydalanadigan Git tizimida "git commit" va "git push" buyruqlari o‘rtasidagi asosiy farq nima?',
    options: [
      'A) Ikkalasi bir xil ishni bajaradi',
      'B) "commit" o‘zgarishni kompyuterdagi lokal tarixga muhrlaydi, "push" esa ularni GitHub kabi masofaviy serverga yuboradi',
      'C) "commit" faylni o‘chiradi, "push" qayta tiklaydi',
      'D) "push" faqat offline rejimda ishlaydi',
    ],
    correctIndex: 1,
    explanation:
      'Avval lokal repozitoriyga commit qilib saqlanadi, so‘ngra push orqali internetdagi jamoaviy serverga yuklanadi.',
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // --- SAVODXONLIK ATAMALARI (13 ta) ---
  {
    id: 'term-cpu',
    term: 'CPU (Protsessor)',
    category: 'literacy',
    shortDesc: 'Kompyuterning barcha hisob-kitob va buyruqlarini bajaruvchi asosiy mikrosxemasi.',
    example: 'Masalan: Intel Core i5, AMD Ryzen 7 yoki Apple M3 protsessori.',
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
    id: 'term-gpu',
    term: 'GPU (Videokarta)',
    category: 'literacy',
    shortDesc: 'Ekrandagi tasvir, video montaj, 3D grafika va o‘yinlarni qayta ishlovchi qism.',
    example: 'Masalan: NVIDIA GeForce RTX seriyasi.',
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
    id: 'term-archive',
    term: 'Arxiv (.zip / .rar)',
    category: 'literacy',
    shortDesc: 'Bir nechta faylni hajmini kichraytirib bitta paketga jamlash formati.',
    example: '20 ta rasmni bitta "rasmlar.zip" fayliga solib yuborish.',
  },
  {
    id: 'term-dns',
    term: 'IP manzil va DNS',
    category: 'literacy',
    shortDesc: 'IP — qurilmaning tarmoqdagi raqamli manzili, DNS — sayt nomini shu raqamga o‘giruvchi tizim.',
    example: '"google.com" yozilganda DNS uning IP manzilini topib beradi.',
  },
  {
    id: 'term-cloud',
    term: 'Bulutli saqlash (Cloud)',
    category: 'literacy',
    shortDesc: 'Fayllarni kompyuter xotirasida emas, internetdagi xavfsiz serverlarda saqlash.',
    example: 'Google Drive, OneDrive, iCloud.',
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
    id: 'term-prompt',
    term: 'Prompt (AI so‘rovi)',
    category: 'literacy',
    shortDesc: 'Sun’iy intellekt modeliga aniq vazifa va kontekst beruvchi matnli ko‘rsatma.',
    example: '"Menga 5-sinf o‘quvchisi uchun algoritmni oddiy misol bilan tushuntir."',
  },

  // --- DASTURLASH ATAMALARI (13 ta) ---
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
    id: 'term-datatypes',
    term: 'String, Number, Boolean',
    category: 'programming',
    shortDesc: 'Dasturlashdagi asosiy ma’lumot turlari: matn, son va mantiqiy (rost/yolg‘on) qiymat.',
    example: '"Ali" (String), 42 (Number), true (Boolean).',
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
    id: 'term-json',
    term: 'Obyekt va JSON',
    category: 'programming',
    shortDesc: 'Ma’lumotlarni "kalit: qiymat" juftligi ko‘rinishida tartibli saqlash va uzatish formati.',
    example: '{ "ism": "Jasur", "ball": 95 }',
  },
  {
    id: 'term-function',
    term: 'Funksiya (Function)',
    category: 'programming',
    shortDesc: 'Muayyan vazifani bajaradigan va istalgan joydan chaqiriladigan alohida kod bloki.',
    example: 'salom_ber("Ali") funksiyasi har chaqirilganda salom matnini chiqaradi.',
  },
  {
    id: 'term-bug',
    term: 'Bug va Debugging',
    category: 'programming',
    shortDesc: 'Bug — dasturdagi xato, Debugging esa shu xatoni aniqlab tuzatish jarayoni.',
    example: 'Ishlamay qolgan tugma sababini konsol orqali topib to‘g‘rilash.',
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
    term: 'Python va Git',
    category: 'programming',
    shortDesc: 'Python — sodda va AI da mashhur til; Git — kod versiyalarini saqlovchi tizim.',
    example: 'print("Salom, dunyo!") Python da ekranga matn chiqaradi.',
  },
];

export const VIDEO_LESSONS: VideoLessonItem[] = [
  // --- 1-YO'NALISH VIDEOLARI: SAVODXONLIK (01 - 06) ---
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
    title: 'Fayllar, kengaytmalar va ZIP arxivlash',
    shortDesc: 'Fayl nomining oxiridagi harflar (.pdf, .jpg, .zip) nimani anglatishini tez bilib oling.',
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
        title: 'Papka va Arxiv farqi',
        subtitle: 'Papka — tartibli jild. ZIP arxiv esa ko‘plab fayllarni siqib bitta paketga soladi.',
        durationSec: 9,
        visualKind: 'analogy',
        highlightText: 'Darslar / hisobot.zip',
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
        subtitle: 'Rasmiy hujjatlarni PDF da saqlang va fayllarni aniq nomlang.',
        durationSec: 9,
        visualKind: 'summary',
        highlightText: 'Tartib = Tez qidiruv',
      },
    ],
    quickCheck: {
      question: 'Qaysi kengaytma siqilgan arxiv faylni bildiradi?',
      options: ['.zip', '.jpg', '.mp4'],
      correctIndex: 0,
    },
  },
  {
    id: 'vid-shortcuts',
    number: '03',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    title: 'Ishni 3x tezlatuvchi klaviatura sirlari',
    shortDesc: 'Sichqonchasiz bir soniyada nusxalash, qaytarish va ekran tasvirini olish tugmalari.',
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
        subtitle: 'Ctrl+C (nusxa), Ctrl+V (qo‘yish), Ctrl+Z (orqaga), Alt+Tab (oyna almashtirish).',
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
    id: 'vid-network',
    number: '04',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    title: 'Internet, IP/DNS va Bulutli xotira (Cloud) qanday ishlaydi?',
    shortDesc: 'Sayt nomini yozganda sahifa ekraningizda soniyalar ichida qanday ochilishini ko‘ring.',
    durationLabel: '0:36',
    visualType: 'network',
    scenes: [
      {
        label: 'Savol',
        title: 'Sayt manzilini yozganda nima bo‘ladi?',
        subtitle: 'Brauzerga sayt nomini kiritganingizda ko‘rinmas pochtachi ishga tushadi.',
        durationSec: 9,
        visualKind: 'hook',
        highlightText: 'murodillayev.dev → ?',
      },
      {
        label: 'Telefon kitobi',
        title: 'DNS — Internetning kontakt kitobi',
        subtitle: 'DNS sayt nomini kompyuter tushunadigan raqamli IP manzilga aylantiradi.',
        durationSec: 9,
        visualKind: 'analogy',
        highlightText: 'Domen ➔ DNS ➔ IP Manzil',
      },
      {
        label: 'Bulut',
        title: 'Bulutli saqlash (Google Drive)',
        subtitle: 'Fayllarni bulutda saqlasangiz, telefonda boshlagan ishni kompyuterda davom ettirasiz.',
        durationSec: 9,
        visualKind: 'demo',
        highlightText: 'Telefon ⇄ Cloud ⇄ Noutbuk',
      },
      {
        label: 'Xulosa',
        title: 'Internetdan unumli foydalaning',
        subtitle: 'Muhim hujjatlarni doimo Google Drive yoki bulutda zaxira nusxasini saqlang.',
        durationSec: 9,
        visualKind: 'summary',
        highlightText: 'Bulut = Yo‘qolmaydigan fayl',
      },
    ],
    quickCheck: {
      question: 'Sayt nomini raqamli IP manzilga aylantiruvchi tizim qaysi?',
      options: ['DNS', 'PDF', 'ZIP'],
      correctIndex: 0,
    },
  },
  {
    id: 'vid-security',
    number: '05',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    title: 'Internet firibgarlari (Fishing), Kuchli parol va 2FA',
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
    id: 'vid-office-excel',
    number: '06',
    category: 'literacy',
    categoryLabel: 'Kompyuter savodxonligi',
    title: 'Ofis va Excel formulalari + AI Prompt siri',
    shortDesc: 'Excelda "=" belgisi bilan tezkor hisoblash va Sun’iy intellektga to‘g‘ri vazifa berish.',
    durationLabel: '0:36',
    visualType: 'hardware',
    scenes: [
      {
        label: 'Ofis',
        title: 'Excel da qo‘lda hisoblamang!',
        subtitle: 'Jadvaldagi minglab sonlarni =SUM() formulasi bir soniyada qo‘shib beradi.',
        durationSec: 9,
        visualKind: 'hook',
        highlightText: '=SUM(A1:A10)',
      },
      {
        label: 'Qoida',
        title: '"=" belgisi — kalit so‘z',
        subtitle: 'Tenglik belgisiz Excel formulani oddiy matn deb o‘ylaydi.',
        durationSec: 9,
        visualKind: 'analogy',
        highlightText: '= bilan boshlash shart!',
      },
      {
        label: 'AI Prompt',
        title: 'Sun’iy intellekt bilan ishlash',
        subtitle: 'AI ga aniq Rol + Vazifa + Format aytsangiz, mukammal javob olasiz.',
        durationSec: 9,
        visualKind: 'demo',
        highlightText: 'Rol + Vazifa + Format',
      },
      {
        label: 'Xulosa',
        title: 'Zamonaviy mutaxassis qurollari',
        subtitle: 'Word, Excel, PDF va AI ni bilgan odam har qanday ofisda qadrlanadi.',
        durationSec: 9,
        visualKind: 'summary',
        highlightText: 'Excel + PDF + AI Prompt',
      },
    ],
    quickCheck: {
      question: 'Excelda har qanday formula qaysi belgi bilan boshlanadi?',
      options: ['=', '#', '+'],
      correctIndex: 0,
    },
  },

  // --- 2-YO'NALISH VIDEOLARI: DASTURLASH ASOSLARI (01 - 06) ---
  {
    id: 'vid-binary',
    number: '01',
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
    number: '02',
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
    number: '03',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    title: 'O‘zgaruvchilar, Turlar va Shart operatori (if / else)',
    shortDesc: 'Dasturlar qanday qilib ma’lumot saqlashi va o‘zi qaror qabul qilishini tushuning.',
    durationLabel: '0:40',
    visualType: 'ifelse',
    scenes: [
      {
        label: 'Quti',
        title: 'O‘zgaruvchi — nomlangan quti',
        subtitle: 'ism = "Madina" (String), ball = 95 (Number), o‘tdi = true (Boolean).',
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
    id: 'vid-functions',
    number: '04',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    title: 'Funksiyalar (Function), Parametr va Return siri',
    shortDesc: 'Kodni takrorlamasdan bir marta yozib, yuz marta ishlatish texnikasi.',
    durationLabel: '0:36',
    visualType: 'functions',
    scenes: [
      {
        label: 'Muammo',
        title: 'Bir xil kodni qayta-qayta yozmang',
        subtitle: 'Har safar chegirma hisoblash formulasini nusxalash o‘rniga bitta funksiya yarating.',
        durationSec: 9,
        visualKind: 'hook',
        highlightText: 'DRY: Qayta yozma!',
      },
      {
        label: 'Qiyos',
        title: 'Sharbat chiqargich mashina',
        subtitle: 'Kirish (Parametr: meva) → Qayta ishlash → Natija (return: sharbat).',
        durationSec: 9,
        visualKind: 'analogy',
        highlightText: 'Input → Funksiya → Return',
      },
      {
        label: 'Jonli kod',
        title: 'hisobla(a, b) funksiyasi',
        subtitle: 'function yigindi(a, b) { return a + b; } → yigindi(10, 5) = 15.',
        durationSec: 9,
        visualKind: 'demo',
        highlightText: 'return a + b',
      },
      {
        label: 'Xulosa',
        title: 'Toza va professional kod',
        subtitle: 'Funksiyalar katta dasturlarni kichik va tushunarli bo‘laklarga ajratadi.',
        durationSec: 9,
        visualKind: 'summary',
        highlightText: '1 funksiya = 1 aniq vazifa',
      },
    ],
    quickCheck: {
      question: 'Funksiyadan yakuniy natijani tashqariga qaytaruvchi kalit so‘z qaysi?',
      options: ['return', 'while', 'else'],
      correctIndex: 0,
    },
  },
  {
    id: 'vid-loops-web',
    number: '05',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    title: 'Sikllar (for / while) va Massivlar (Array)',
    shortDesc: '1000 ta elementli ro‘yxatni 3 qator sikl kodi bilan soniyalar ichida qayta ishlash.',
    durationLabel: '0:36',
    visualType: 'loops_web',
    scenes: [
      {
        label: 'Sikl',
        title: '1000 marta bitta kod yozmang!',
        subtitle: 'Sikl (for / while) bir xil vazifani avtomatik kerakli marta takrorlaydi.',
        durationSec: 9,
        visualKind: 'hook',
        highlightText: 'for (1 dan 5 gacha) ↻',
      },
      {
        label: 'Massiv',
        title: 'Ro‘yxat indeksi 0 dan boshlanadi!',
        subtitle: 'fanlar = ["IT", "Fizika"] → fanlar[0] bu "IT", fanlar[1] bu "Fizika".',
        durationSec: 9,
        visualKind: 'analogy',
        highlightText: 'Indeks: [0], [1], [2]...',
      },
      {
        label: 'Jonli amal',
        title: 'Sikl + Massiv kuchi',
        subtitle: 'Sikl ro‘yxatdagi har bir talabaga birma-bir ball va sertifikat chiqaradi.',
        durationSec: 9,
        visualKind: 'demo',
        highlightText: '1000 talaba = 3 qator kod',
      },
      {
        label: 'Xulosa',
        title: 'Avtomatlashtirish asosi',
        subtitle: 'Har bir while siklidan chiqish shartini tekshirishni unutmang.',
        durationSec: 9,
        visualKind: 'summary',
        highlightText: 'Sikl + Massiv = Tezlik',
      },
    ],
    quickCheck: {
      question: 'Dasturlashda massivning birinchi elementi qaysi indeksda turadi?',
      options: ['0-indeksda', '1-indeksda', '2-indeksda'],
      correctIndex: 0,
    },
  },
  {
    id: 'vid-fullstack',
    number: '06',
    category: 'programming',
    categoryLabel: 'Dasturlash asoslari',
    title: 'Veb-sayt qurilishi: HTML, CSS, JS, Python va API',
    shortDesc: 'Frontend, Backend, Ma’lumotlar bazasi va mashhur dasturlash tillarining vazifalari.',
    durationLabel: '0:40',
    visualType: 'loops_web',
    scenes: [
      {
        label: 'Veb uy',
        title: 'HTML + CSS + JavaScript',
        subtitle: 'HTML — uy devorlari (skelet), CSS — bo‘yoq va bezak, JS — chiroq va harakat.',
        durationSec: 10,
        visualKind: 'hook',
        highlightText: 'Skelet + Dizayn + Harakat',
      },
      {
        label: 'Restoran',
        title: 'Frontend ⇄ API ⇄ Backend',
        subtitle: 'Frontend — zal, API — ofitsiant, Backend va Database — oshxona va ombor.',
        durationSec: 10,
        visualKind: 'analogy',
        highlightText: 'Frontend ⇄ API ⇄ Server',
      },
      {
        label: 'Tillar',
        title: 'Python, JavaScript va Git',
        subtitle: 'Python AI va Backendda, JS vebda yetakchi. Git esa barcha kod tarixini saqlaydi.',
        durationSec: 10,
        visualKind: 'demo',
        highlightText: 'Python · JS · Git',
      },
      {
        label: 'Xulosa',
        title: 'Siz dasturlashga tayyorsiz!',
        subtitle: 'Endi laboratoriyada kod yozib, 20 talik Dasturlash imtihonini topshiring.',
        durationSec: 10,
        visualKind: 'summary',
        highlightText: 'Nazariya + Amaliyot = Pro',
      },
    ],
    quickCheck: {
      question: 'Veb-sahifaga rang, shrift va chiroyli bezak beruvchi til qaysi?',
      options: ['CSS', 'SQL', 'BIOS'],
      correctIndex: 0,
    },
  },
];

export const PRACTICE_CHALLENGES: ChallengeItem[] = [
  // --- SAVODXONLIK MASALALARI (6 ta) ---
  {
    id: 'ch-lit-1',
    category: 'literacy',
    difficulty: 'qiyin',
    title: 'Yuklash vaqtini hisoblang (MB → KB)',
    prompt:
      'Sizda 4 MB hajmdagi PDF kitob bor. Agar internet tezligi sekundiga 512 KB/s bo‘lsa, kitob necha soniyada to‘liq yuklanadi? (1 MB = 1024 KB, faqat raqam kiriting)',
    inputType: 'text',
    correctAnswer: '8',
    acceptedAliases: ['8 soniya', '8 s', '8s'],
    hint: 'Avval 4 MB ni 1024 ga ko‘paytirib KB ga o‘tkazing, keyin 512 ga bo‘ling.',
    solutionSteps: [
      '1-qadam: 4 MB × 1024 = 4096 KB.',
      '2-qadam: 4096 KB ÷ 512 KB/s = 8 soniya.',
    ],
  },
  {
    id: 'ch-lit-2',
    category: 'literacy',
    difficulty: 'qiyin',
    title: 'Murakkab Excel formulasi',
    prompt:
      'Excel jadvalida A1 = 12, A2 = 18, A3 = 30 va B1 = 3. Agar D1 katakchasiga "=SUM(A1:A3)/B1 + 5" yozilsa, natija nechi chiqadi?',
    inputType: 'text',
    correctAnswer: '25',
    hint: 'Avval SUM(A1:A3) yig‘indisini toping, so‘ng B1 ga bo‘ling va 5 ni qo‘shing.',
    solutionSteps: [
      '1-qadam: SUM(A1:A3) = 12 + 18 + 30 = 60.',
      '2-qadam: 60 / 3 = 20.',
      '3-qadam: 20 + 5 = 25.',
    ],
  },
  {
    id: 'ch-lit-3',
    category: 'literacy',
    difficulty: 'orta',
    title: 'Xavfli fayl tuzog‘ini aniqlang',
    prompt:
      'Telegram orqali sizga "maktab_royxati.docx.exe" nomli fayl keldi. Bu fayl aslida qaysi turdagi fayl va uni ochish mumkinmi?',
    inputType: 'choice',
    options: [
      'Word hujjati — xavfsiz ochish mumkin',
      'Bajariluvchi dastur (.exe) — virus bo‘lishi mumkin, ochmaslik kerak',
      'Arxiv fayli — WinRAR bilan ochiladi',
    ],
    correctAnswer: 'Bajariluvchi dastur (.exe) — virus bo‘lishi mumkin, ochmaslik kerak',
    hint: 'Fayl nomidagi eng oxirgi nuqtadan keyingi kengaytmaga qarang.',
    solutionSteps: [
      '1-qadam: ".docx" chalg‘itish uchun qo‘yilgan soxta qism.',
      '2-qadam: Haqiqiy kengaytma ".exe" (Executable) — bu noma’lum dastur yoki virus.',
    ],
  },
  {
    id: 'ch-lit-4',
    category: 'literacy',
    difficulty: 'qiyin',
    title: 'Tarmoq nosozligi diagnostikasi',
    prompt:
      'Brauzerga "youtube.com" yozsangiz sayt ochilmayapti, lekin IP manzil tersangiz serverga ulanyapti. Qaysi tizim ishlamayapti? (Qisqa nomini yozing)',
    inputType: 'text',
    correctAnswer: 'DNS',
    acceptedAliases: ['dns', 'dns server', 'domain name system'],
    hint: 'Sayt nomini IP raqamga aylantirib beruvchi 3 harfli tizim nomi.',
    solutionSteps: [
      '1-qadam: IP orqali ulanish bor — internet kabeli va Wi-Fi ishlayapti.',
      '2-qadam: Domen nomini IP ga tarjima qiluvchi tizim — DNS nosoz.',
    ],
  },
  {
    id: 'ch-lit-5',
    category: 'literacy',
    difficulty: 'orta',
    title: 'Clipboard (Bufer) sinovi',
    prompt:
      'Matndagi "Salom" so‘zini Ctrl+X qildingiz, keyin "Dunyo" so‘zini Ctrl+C qildingiz. Endi Ctrl+V bossangiz nima chiqadi?',
    inputType: 'text',
    correctAnswer: 'Dunyo',
    acceptedAliases: ['dunyo'],
    hint: 'Oddiy almashinuv buferida nechta nusxa saqlanadi?',
    solutionSteps: [
      '1-qadam: Ctrl+X "Salom" ni buferga oldi.',
      '2-qadam: Ctrl+C "Dunyo" bilan buferni almashtirdi. Natija: "Dunyo".',
    ],
  },
  {
    id: 'ch-lit-6',
    category: 'literacy',
    difficulty: 'qiyin',
    title: 'Fishing havolani fosh qiling',
    prompt:
      'Quyidagi 3 ta manzildan qaysi biri haqiqiy bank sayti emas (soxta fishing)?',
    inputType: 'choice',
    options: [
      'https://my.gov.uz/login',
      'https://uzcard-yutuq-2026.xyz/verify',
      'https://soliq.uz/cabinet',
    ],
    correctAnswer: 'https://uzcard-yutuq-2026.xyz/verify',
    hint: 'Oxirgi domen nomiga va "yutuq" so‘ziga e’tibor bering.',
    solutionSteps: [
      '1-qadam: Rasmiy O‘zbekiston portallari .uz domenida bo‘ladi.',
      '2-qadam: "uzcard-yutuq-2026.xyz" firibgarlar ochgan soxta domendir.',
    ],
  },

  // --- DASTURLASH MASALALARI (6 ta) ---
  {
    id: 'ch-prog-1',
    category: 'programming',
    difficulty: 'qiyin',
    title: 'Ikkilik sonni o‘nlikka o‘giring',
    prompt: 'Kompyuter xotirasidagi 10110 ikkilik soni o‘nlik tizimida nechiga teng?',
    codeSnippet: 'binary = "10110"  // darajalar: 16, 8, 4, 2, 1',
    inputType: 'text',
    correctAnswer: '22',
    hint: '1×16 + 0×8 + 1×4 + 1×2 + 0×1 ni hisoblang.',
    solutionSteps: [
      '1-qadam: 16 + 0 + 4 + 2 + 0.',
      '2-qadam: Jami = 22.',
    ],
  },
  {
    id: 'ch-prog-2',
    category: 'programming',
    difficulty: 'qiyin',
    title: 'for sikli yig‘indisini kuzating (Trace)',
    prompt: 'Quyidagi kod bajarilgandan so‘ng ekranga nechchi soni chiqadi?',
    codeSnippet:
      'let sum = 0;\nfor (let i = 1; i <= 4; i++) {\n  sum = sum + i * 2;\n}\nconsole.log(sum);',
    inputType: 'text',
    correctAnswer: '20',
    hint: 'i = 1, 2, 3, 4 bo‘lganda i * 2 qiymatlarini birma-bir qo‘shing.',
    solutionSteps: [
      'i = 1 → sum = 0 + 2 = 2',
      'i = 2 → sum = 2 + 4 = 6',
      'i = 3 → sum = 6 + 6 = 12',
      'i = 4 → sum = 12 + 8 = 20',
    ],
  },
  {
    id: 'ch-prog-3',
    category: 'programming',
    difficulty: 'orta',
    title: 'Qoldiqli bo‘lish (%) va ifoda',
    prompt: 'Kod yakunida y o‘zgaruvchisining qiymati nechiga teng bo‘ladi?',
    codeSnippet: 'let x = 27 % 5;\nlet y = x * 3 - 1;',
    inputType: 'text',
    correctAnswer: '5',
    hint: '27 ni 5 ga bo‘lgandagi qoldiq x = 2.',
    solutionSteps: [
      '1-qadam: 27 % 5 = 2 (5×5 = 25, qoldiq 2).',
      '2-qadam: y = 2 * 3 - 1 = 5.',
    ],
  },
  {
    id: 'ch-prog-4',
    category: 'programming',
    difficulty: 'qiyin',
    title: 'Massiv indekslari bilan hisob',
    prompt: 'Quyidagi kod natijasi nechiga teng bo‘ladi?',
    codeSnippet:
      'let arr = [10, 25, 40, 55];\nlet natija = arr[1] + arr[arr.length - 1];',
    inputType: 'text',
    correctAnswer: '80',
    hint: 'arr[1] ikkinchi element (25), arr.length - 1 esa oxirgi indeks (3).',
    solutionSteps: [
      '1-qadam: arr[1] = 25.',
      '2-qadam: arr.length = 4 → arr[3] = 55.',
      '3-qadam: 25 + 55 = 80.',
    ],
  },
  {
    id: 'ch-prog-5',
    category: 'programming',
    difficulty: 'qiyin',
    title: 'Funksiyalar zanjirini hisoblang',
    prompt: 'Agar g(3) chaqirilsa, funksiya qanday son qaytaradi?',
    codeSnippet:
      'function f(x) { return x * 2 + 1; }\nfunction g(y) { return f(y) + f(y - 1); }',
    inputType: 'text',
    correctAnswer: '12',
    hint: 'Avval f(3) va f(2) ni alohida hisoblang.',
    solutionSteps: [
      '1-qadam: f(3) = 3×2 + 1 = 7.',
      '2-qadam: f(2) = 2×2 + 1 = 5.',
      '3-qadam: g(3) = 7 + 5 = 12.',
    ],
  },
  {
    id: 'ch-prog-6',
    category: 'programming',
    difficulty: 'orta',
    title: 'Swap xatosini toping (Debugging)',
    prompt:
      'a = 5 va b = 9 qiymatlarini almashtirish uchun "a = b; b = a;" yozildi. Natijada b nechi bo‘lib qoladi?',
    codeSnippet: 'let a = 5;\nlet b = 9;\na = b;\nb = a;',
    inputType: 'text',
    correctAnswer: '9',
    hint: 'a = b bajarilgandan keyin a ning ichida qaysi son turibdi?',
    solutionSteps: [
      '1-qadam: a = b → a ning qiymati 9 bo‘ldi (5 yo‘qoldi!).',
      '2-qadam: b = a → b ham 9 ga teng bo‘lib qoldi.',
    ],
  },
];

