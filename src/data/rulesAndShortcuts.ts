export type ShortcutGroup = 'ctrl' | 'ctrl_shift' | 'alt_win' | 'coding';

export interface ShortcutRuleItem {
  id: string;
  keys: string[];
  comboLabel: string;
  group: ShortcutGroup;
  title: string;
  kidExplanation: string;
  exampleAction: string;
  importance: 'Kundalik' | 'Foydali' | 'Pro';
}

export type KidRuleCategory = 'soglik' | 'xavfsizlik' | 'tartib' | 'kodlash';

export interface KidGoldenRuleItem {
  id: string;
  number: string;
  category: KidRuleCategory;
  categoryLabel: string;
  title: string;
  summary: string;
  doThis: string;
  avoidThis: string;
}

export interface RuleQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const SHORTCUT_RULES: ShortcutRuleItem[] = [
  // Asosiy Ctrl tugmalari
  {
    id: 'sc-ctrl-c',
    keys: ['Ctrl', 'C'],
    comboLabel: 'Ctrl + C',
    group: 'ctrl',
    title: 'Nusxa olish (Copy)',
    kidExplanation:
      'Belgilangan matn, rasm yoki faylning xuddi o‘zidek ikkinchi nusxasini xotiraga ko‘chirib oladi. Asl nusxa joyida qoladi.',
    exampleAction: 'Chiroyli rasm yoki matnni tanlab Ctrl + C bosing — u vaqtincha xotiraga tushadi.',
    importance: 'Kundalik',
  },
  {
    id: 'sc-ctrl-v',
    keys: ['Ctrl', 'V'],
    comboLabel: 'Ctrl + V',
    group: 'ctrl',
    title: 'Joylashtirish (Paste)',
    kidExplanation:
      'Ctrl + C yoki Ctrl + X bilan olingan matn yoki faylni yangi joyga qo‘yib beradi.',
    exampleAction: 'Yangi hujjatni ochib Ctrl + V bossangiz, nusxalangan matn darhol paydo bo‘ladi.',
    importance: 'Kundalik',
  },
  {
    id: 'sc-ctrl-x',
    keys: ['Ctrl', 'X'],
    comboLabel: 'Ctrl + X',
    group: 'ctrl',
    title: 'Qirqib olish (Cut)',
    kidExplanation:
      'Fayl yoki matnni eski joyidan olib, boshqa joyga ko‘chiradi (qaychi kabi kesib oladi).',
    exampleAction: 'Ish stolidagi rasmni «Rasmlar» papkasiga ko‘chirish uchun Ctrl + X, keyin Ctrl + V bosing.',
    importance: 'Kundalik',
  },
  {
    id: 'sc-ctrl-z',
    keys: ['Ctrl', 'Z'],
    comboLabel: 'Ctrl + Z',
    group: 'ctrl',
    title: 'Orqaga qaytarish (Undo)',
    kidExplanation:
      'Sehrli «vaqt mashinasi»! Agar tasodifan matnni o‘chirib yuborsangiz yoki xato chizsangiz, 1 soniyada oldingi holatga qaytaradi.',
    exampleAction: 'Inshoni adashib o‘chirib yubordingizmi? Vahima qilmang — darhol Ctrl + Z bosing.',
    importance: 'Kundalik',
  },
  {
    id: 'sc-ctrl-y',
    keys: ['Ctrl', 'Y'],
    comboLabel: 'Ctrl + Y',
    group: 'ctrl',
    title: 'Oldinga qaytarish (Redo)',
    kidExplanation:
      'Ctrl + Z bilan bekor qilingan harakatni qaytadan tiklaydi.',
    exampleAction: 'Orqaga qaytarishni haddan tashqari ko‘p bosib yuborganingizda Ctrl + Y yordam beradi.',
    importance: 'Foydali',
  },
  {
    id: 'sc-ctrl-s',
    keys: ['Ctrl', 'S'],
    comboLabel: 'Ctrl + S',
    group: 'ctrl',
    title: 'Tez saqlash (Save)',
    kidExplanation:
      'Yozgan hujjat yoki kodingizni doimiy xotiraga saqlab qo‘yadi. Elektr o‘chsa ham mehnatingiz kuymaydi.',
    exampleAction: 'Har 5 daqiqada bir marta Ctrl + S bosishni odat qiling!',
    importance: 'Kundalik',
  },
  {
    id: 'sc-ctrl-a',
    keys: ['Ctrl', 'A'],
    comboLabel: 'Ctrl + A',
    group: 'ctrl',
    title: 'Hammasini belgilash (Select All)',
    kidExplanation:
      'Sahifadagi barcha matn yoki papkadagi hamma fayllarni bitta bosishda tanlab beradi.',
    exampleAction: '100 ta rasmni bittalab belgilash o‘rniga Ctrl + A bosing.',
    importance: 'Kundalik',
  },
  {
    id: 'sc-ctrl-f',
    keys: ['Ctrl', 'F'],
    comboLabel: 'Ctrl + F',
    group: 'ctrl',
    title: 'Matn ichidan qidirish (Find)',
    kidExplanation:
      'Katta kitob, sayt yoki kod ichidan kerakli so‘zni bir zumda topib beradi.',
    exampleAction: 'Saytda Ctrl + F bosib kerakli so‘zni yozsangiz, u sariq rangda ajralib ko‘rinadi.',
    importance: 'Kundalik',
  },
  {
    id: 'sc-ctrl-p',
    keys: ['Ctrl', 'P'],
    comboLabel: 'Ctrl + P',
    group: 'ctrl',
    title: 'Chop etish (Print)',
    kidExplanation:
      'Hujjat yoki rasmni printerdan qog‘ozga chiqarish yoki PDF qilib saqlash oynasini ochadi.',
    exampleAction: 'Sertifikatingizni PDF qilish uchun Ctrl + P bosib «Save as PDF» ni tanlang.',
    importance: 'Foydali',
  },

  // Ctrl + Shift & Shift kombinatsiyalari
  {
    id: 'sc-ctrl-shift-t',
    keys: ['Ctrl', 'Shift', 'T'],
    comboLabel: 'Ctrl + Shift + T',
    group: 'ctrl_shift',
    title: 'Yopilgan oynani qaytarish',
    kidExplanation:
      'Brauzerda dars saytini tasodifan «X» bosib yopib qo‘ydingizmi? Shu 3 ta tugma uni xuddi o‘sha joyidan qayta ochadi!',
    exampleAction: 'Google Chrome yoki Edge da muhim dars sahifasi yopilib ketsa darhol bosing.',
    importance: 'Pro',
  },
  {
    id: 'sc-ctrl-shift-n',
    keys: ['Ctrl', 'Shift', 'N'],
    comboLabel: 'Ctrl + Shift + N',
    group: 'ctrl_shift',
    title: 'Yangi papka / Maxfiy oyna',
    kidExplanation:
      'Ish stoli yoki papka ichida bir zumda yangi papka ochadi. Brauzerda esa tarix saqlamaydigan Inkognito oynani ochadi.',
    exampleAction: 'Papka ichida «New Folder» tugmasini qidirmasdan Ctrl + Shift + N bosing.',
    importance: 'Pro',
  },
  {
    id: 'sc-ctrl-shift-esc',
    keys: ['Ctrl', 'Shift', 'Esc'],
    comboLabel: 'Ctrl + Shift + Esc',
    group: 'ctrl_shift',
    title: 'Vazifalar menejeri (Task Manager)',
    kidExplanation:
      'Agar birorta o‘yin yoki dastur qotib qolsa, shu tugmalar orqali tizim nazoratchisini ochib qotgan dasturni yopish mumkin.',
    exampleAction: 'Qotib qolgan dastur ustiga bosib «End task» tugmasini tanlaysiz.',
    importance: 'Pro',
  },
  {
    id: 'sc-ctrl-shift-s',
    keys: ['Ctrl', 'Shift', 'S'],
    comboLabel: 'Ctrl + Shift + S',
    group: 'ctrl_shift',
    title: 'Boshqa nom bilan saqlash (Save As)',
    kidExplanation:
      'Hujjatning eski nusxasini buzmasdan, yangi nom yoki yangi joyga saqlash uchun ishlatiladi.',
    exampleAction: 'Loyihaning 2-versiyasini «Loyiha_v2» nomi bilan saqlashda juda qo‘l keladi.',
    importance: 'Foydali',
  },
  {
    id: 'sc-ctrl-shift-z',
    keys: ['Ctrl', 'Shift', 'Z'],
    comboLabel: 'Ctrl + Shift + Z',
    group: 'ctrl_shift',
    title: 'Kod muharririda oldinga qaytarish',
    kidExplanation:
      'Dasturlash muharrirlari (VS Code) va dizayn dasturlarida Ctrl + Z ni bekor qilib, harakatni tiklaydi.',
    exampleAction: 'Kod yozayotganda orqaga qaytib, keyin fikringizdan qaytsangiz bosing.',
    importance: 'Foydali',
  },
  {
    id: 'sc-shift-del',
    keys: ['Shift', 'Delete'],
    comboLabel: 'Shift + Delete',
    group: 'ctrl_shift',
    title: 'Savatga tashlamay butunlay o‘chirish',
    kidExplanation:
      'Oddiy Delete faylni Savatga (Recycle Bin) yuboradi. Shift + Delete esa uni butunlay o‘chiradi — shuning uchun juda ehtiyot bo‘lib ishlating!',
    exampleAction: 'Faqat 100% keraksiz ekaniga ishonchingiz komil bo‘lgan katta fayllarda qo‘llang.',
    importance: 'Pro',
  },
  {
    id: 'sc-shift-arrows',
    keys: ['Shift', '← / →'],
    comboLabel: 'Shift + ← / →',
    group: 'ctrl_shift',
    title: 'Sichqonchasiz matn belgilash',
    kidExplanation:
      'Shift tugmasini bosib turib o‘q tugmalarini bossangiz, matnni harfma-harf aniq belgilaysiz.',
    exampleAction: 'Kichkina so‘zni sichqoncha bilan qiynalmay belgilashda juda qulay.',
    importance: 'Foydali',
  },

  // Alt, Win va F tugmalari
  {
    id: 'sc-alt-tab',
    keys: ['Alt', 'Tab'],
    comboLabel: 'Alt + Tab',
    group: 'alt_win',
    title: 'Oynalar orasida tez sakrash',
    kidExplanation:
      'Ochiq turgan dasturlar (masalan, darslik va kod muharriri) orasida 1 soniyada almashish imkonini beradi.',
    exampleAction: 'Videodarsni ko‘rib, bir zumda kod yozadigan oynaga o‘tish uchun bosing.',
    importance: 'Kundalik',
  },
  {
    id: 'sc-alt-f4',
    keys: ['Alt', 'F4'],
    comboLabel: 'Alt + F4',
    group: 'alt_win',
    title: 'Faol dasturni yopish',
    kidExplanation:
      'Hozir ishlab turgan dasturni tez yopadi. Ish stolida bosilsa, kompyuterni o‘chirish oynasini chiqaradi.',
    exampleAction: 'X tugmasi ko‘rinmay qolgan dasturlarni yopishda foydali (o‘yin vaqtida hazillashib bosmang!).',
    importance: 'Foydali',
  },
  {
    id: 'sc-win-d',
    keys: ['Win', 'D'],
    comboLabel: 'Win + D',
    group: 'alt_win',
    title: 'Ish stolini ko‘rsatish (Desktop)',
    kidExplanation:
      'Ekranda 10 ta oyna ochiq bo‘lsa ham, hammasini yig‘ishtirib bir zumda toza Ish stolini (Desktop) ochadi.',
    exampleAction: 'Qayta bossangiz, hamma oynalar joyiga qaytadi.',
    importance: 'Foydali',
  },
  {
    id: 'sc-win-l',
    keys: ['Win', 'L'],
    comboLabel: 'Win + L',
    group: 'alt_win',
    title: 'Ekranni parol bilan qulflash (Lock)',
    kidExplanation:
      'Kompyuter oldidan 2 daqiqaga tursangiz, hech kim kirmasligi uchun ekranni darhol qulflab ketish qoidasi.',
    exampleAction: 'Sinfxonada yoki uyda kompyuterdan turishdan oldin Win + L bosing.',
    importance: 'Pro',
  },
  {
    id: 'sc-win-shift-s',
    keys: ['Win', 'Shift', 'S'],
    comboLabel: 'Win + Shift + S',
    group: 'alt_win',
    title: 'Ekranning kerakli joyini rasmga olish',
    kidExplanation:
      'Butun ekranni emas, faqat o‘zingiz belgilagan qismni kesib skrinshot (rasm) qilib oladi.',
    exampleAction: 'Qiyin masala yoki kod xatosini ustozga yuborish uchun kesib oling.',
    importance: 'Pro',
  },
  {
    id: 'sc-win-v',
    keys: ['Win', 'V'],
    comboLabel: 'Win + V',
    group: 'alt_win',
    title: 'Nusxalar tarixi (Clipboard)',
    kidExplanation:
      'Oxirgi nusxalangan 1 ta emas, oldinroq Ctrl + C qilgan barcha matnlar ro‘yxatini chiqaradi.',
    exampleAction: 'Bir nechta so‘z yoki havolani ketma-ket nusxalaganda juda kerak bo‘ladi.',
    importance: 'Pro',
  },
  {
    id: 'sc-f2',
    keys: ['F2'],
    comboLabel: 'F2',
    group: 'alt_win',
    title: 'Fayl nomini tez o‘zgartirish',
    kidExplanation:
      'Fayl yoki papkani tanlab F2 bossangiz, o‘ng tugmani bosmasdan turib darhol nomini o‘zgartira olasiz.',
    exampleAction: '«New folder» ni «Dasturlash» deb o‘zgartirish uchun F2 bosing.',
    importance: 'Foydali',
  },

  // Dasturlash va Brauzer tugmalari
  {
    id: 'sc-ctrl-slash',
    keys: ['Ctrl', '/'],
    comboLabel: 'Ctrl + /',
    group: 'coding',
    title: 'Kodni izohga (Comment) olish',
    kidExplanation:
      'Kod qatorini o‘chirmasdan vaqtincha to‘xtatib turadi yoki o‘zingiz uchun eslatma yozishga yordam beradi.',
    exampleAction: 'VS Code da biror qatorni sinab ko‘rish uchun vaqtincha o‘chirishda ishlating.',
    importance: 'Pro',
  },
  {
    id: 'sc-ctrl-d',
    keys: ['Ctrl', 'D'],
    comboLabel: 'Ctrl + D',
    group: 'coding',
    title: 'Keyingi o‘xshash so‘zni ham belgilash',
    kidExplanation:
      'Kod muharririda bitta o‘zgaruvchi nomini hamma joyda bir vaqtda o‘zgartirish uchun ishlatiladi.',
    exampleAction: 'So‘zni tanlab Ctrl + D ni bir necha marta bossangiz, bir nechta kursor paydo bo‘ladi.',
    importance: 'Pro',
  },
  {
    id: 'sc-ctrl-l',
    keys: ['Ctrl', 'L'],
    comboLabel: 'Ctrl + L',
    group: 'coding',
    title: 'Brauzer manzil satriga o‘tish',
    kidExplanation:
      'Sichqonchaga tegmasdan turib brauzerning yuqori qidiruv satriga o‘tadi va yangi sayt yozishga tayyorlaydi.',
    exampleAction: 'Brauzerda Ctrl + L bosib darhol kerakli sayt manzilini yozing.',
    importance: 'Foydali',
  },
  {
    id: 'sc-ctrl-w',
    keys: ['Ctrl', 'W'],
    comboLabel: 'Ctrl + W',
    group: 'coding',
    title: 'Joriy oynachani (Tab) yopish',
    kidExplanation:
      'Butun brauzerni emas, faqat hozir ko‘rib turgan bitta sahifani tez yopadi.',
    exampleAction: 'Ortiqcha sahifalarni Ctrl + W bilan tozalang (adashsangiz Ctrl + Shift + T qaytaradi!).',
    importance: 'Foydali',
  },
  {
    id: 'sc-f12',
    keys: ['F12'],
    comboLabel: 'F12',
    group: 'coding',
    title: 'Dasturchi oynasi (DevTools)',
    kidExplanation:
      'Har qanday veb-saytning ichki HTML, CSS va JavaScript tuzilishini ko‘rsatadigan dasturchi laboratoriyasini ochadi.',
    exampleAction: 'Sayt elementlari qanday yaratilganini tekshirish uchun F12 bosing.',
    importance: 'Pro',
  },
];

export const KIDS_GOLDEN_RULES: KidGoldenRuleItem[] = [
  // Sog'liq
  {
    id: 'rule-20-20-20',
    number: '01',
    category: 'soglik',
    categoryLabel: 'Sog‘liq',
    title: 'Ko‘zlar uchun «20-20-20» qoidasi',
    summary:
      'Har 20 daqiqa kompyuter yoki telefonda o‘qigandan keyin, 20 soniya davomida 6 metr uzoqlikdagi narsaga (masalan, derazadan tashqariga) qarang.',
    doThis: 'Har dars orasida ko‘zlarni yumib-oching va uzoqqa qarab dam oldiring.',
    avoidThis: 'Soatlab ekrandan ko‘z uzmasdan, qorong‘u xonada ishlash.',
  },
  {
    id: 'rule-posture',
    number: '02',
    category: 'soglik',
    categoryLabel: 'Sog‘liq',
    title: 'Masofa va tik o‘tirish qoidasi',
    summary:
      'Ko‘z va monitor orasidagi masofa qo‘l cho‘zilgandek (50–60 sm), bel esa stul suyanchig‘iga tekis tiralgan bo‘lishi kerak.',
    doThis: 'Telefonni ham ko‘zga juda yaqin tutmay, yorug‘likni o‘rtacha darajada saqlang.',
    avoidThis: 'Bo‘yinni egib, yotgan holda yoki juda yaqindan ekranga qarash.',
  },
  {
    id: 'rule-clean-desk',
    number: '03',
    category: 'soglik',
    categoryLabel: 'Sog‘liq',
    title: 'Klaviatura yonida suv va ovqat taqiqi',
    summary:
      'Klaviatura va noutbuk ostidagi mikrosxemalar namlikka juda sezgir. Bir tomchi choy ham plata va tugmalarni ishdan chiqarishi mumkin.',
    doThis: 'Choy yoki suvni kompyuterdan uzoqroqdagi stolga qo‘ying.',
    avoidThis: 'Noutbuk ustida ovqatlanish yoki ochiq stakan qo‘yish.',
  },
  {
    id: 'rule-shutdown',
    number: '04',
    category: 'soglik',
    categoryLabel: 'Sog‘liq',
    title: 'To‘g‘ri o‘chirish (Shut down) qoidasi',
    summary:
      'Kompyuterni hech qachon rozetkadan shartta sug‘urmang. Tizim fayllari yozilishni tugatishi uchun menyudan «Shut down» bosing.',
    doThis: 'Avval dasturlarni Ctrl + S bilan saqlab, keyin tizimni o‘chiring.',
    avoidThis: 'Ishlab turgan kompyuterni elektrdan uzib qo‘yish.',
  },

  // Xavfsizlik
  {
    id: 'rule-password',
    number: '05',
    category: 'xavfsizlik',
    categoryLabel: 'Xavfsizlik',
    title: 'Mustahkam parol va sir saqlash qoidasi',
    summary:
      'Parol kamida 8–10 ta belgidan iborat bo‘lsin: katta harf + kichik harf + son + belgi (masalan: Ziyo@2026!). Tug‘ilgan kun yoki 123456 qo‘ymang.',
    doThis: 'Parolni faqat ota-onangiz va o‘zingiz biling; har saytda boshqa parol ishlating.',
    avoidThis: 'Parolni do‘stlarga aytish yoki «parol123» kabi oddiy so‘z qo‘yish.',
  },
  {
    id: 'rule-phishing',
    number: '06',
    category: 'xavfsizlik',
    categoryLabel: 'Xavfsizlik',
    title: '«Bepul sovg‘a» va soxta havola tuzog‘i',
    summary:
      'Agar chatda «Siz iPhone yutdingiz!» yoki «Tekin o‘yin tangasi olish uchun kiring» degan xabar kelsa — bu firibgarlik (fishing).',
    doThis: 'Havola manzilini tekshiring, shubhali bo‘lsa aslo bosmang va o‘chirib tashlang.',
    avoidThis: 'Noma’lum havolaga login, parol yoki SMS kodini kiritish.',
  },
  {
    id: 'rule-fake-ext',
    number: '07',
    category: 'xavfsizlik',
    categoryLabel: 'Xavfsizlik',
    title: 'Ikki kengaytmali xavfli fayllar (.pdf.exe)',
    summary:
      'Haqiqiy kitob `.pdf`, rasm `.jpg` bilan tugaydi. Agar fayl oxiri `.exe`, `.bat` yoki `dars.pdf.exe` bo‘lsa, bu yashirin virus dasturidir!',
    doThis: 'Yuklab olingan faylning eng oxirgi nuqtadan keyingi formatini tekshiring.',
    avoidThis: 'Notanish saytdan tushgan `.exe` fayllarni ikki marta bosib ishga tushirish.',
  },
  {
    id: 'rule-privacy',
    number: '08',
    category: 'xavfsizlik',
    categoryLabel: 'Xavfsizlik',
    title: 'Shaxsiy ma’lumotlar himoyasi',
    summary:
      'Uy manzili, maktab raqami, telefon raqami va bank kartasi rasmini internetdagi begona guruhlarga hech qachon joylamang.',
    doThis: 'Internetda doim https:// va qulf belgisiga ega ishonchli saytlardan foydalaning.',
    avoidThis: 'Begona insonlarga shaxsiy surat yoki manzil yuborish.',
  },

  // Tartib
  {
    id: 'rule-save-habit',
    number: '09',
    category: 'tartib',
    categoryLabel: 'Tartib',
    title: '«Saqlanmagan ish — yo‘qolgan ish» qoidasi',
    summary:
      'Maktab taqdimoti, matn yoki dastur yozayotganda har 5 daqiqada Ctrl + S tugmasini bosing.',
    doThis: 'Ishni boshlashdayoq faylga nom berib saqlab qo‘ying.',
    avoidThis: '2 soat mehnat qilib, oxirigacha bir marta ham saqlamaslik.',
  },
  {
    id: 'rule-naming',
    number: '10',
    category: 'tartib',
    categoryLabel: 'Tartib',
    title: 'Fayl va papkalarga aniq nom berish',
    summary:
      '«Yangi papka (7)» yoki «aaaa.docx» deb nomlasangiz, bir haftadan keyin hech narsani topa olmaysiz.',
    doThis: '«7-sinf_Informatika_1-dars.docx» kabi tushunarli nom qo‘ying.',
    avoidThis: 'Ish stolini tartibsiz yuzlab nomsiz fayllar bilan to‘ldirish.',
  },
  {
    id: 'rule-recycle-bin',
    number: '11',
    category: 'tartib',
    categoryLabel: 'Tartib',
    title: 'O‘chirishdan oldin ikki marta o‘ylang',
    summary:
      'Oddiy Delete bosilgan faylni Savat (Recycle Bin) dan qaytarish mumkin, lekin Shift + Delete butunlay o‘chirib yuboradi.',
    doThis: 'Ishonchingiz komil bo‘lmasa oddiy Delete ishlating va muhim faylni zaxira qiling.',
    avoidThis: 'Boshqa odamning kompyuterida shoshilib Shift + Delete bosish.',
  },
  {
    id: 'rule-lock-screen',
    number: '12',
    category: 'tartib',
    categoryLabel: 'Tartib',
    title: 'Joyingizdan tursangiz — Win + L bosing',
    summary:
      'Sinfxonada yoki kompyuter xonasida o‘rningizdan tursangiz, hisobingizni qulflab qo‘yish professional odatdir.',
    doThis: 'Win + L tugmasi bilan 1 soniyada ekranni himoyalang.',
    avoidThis: 'Ochiq akkaunt va parollar bilan kompyuterni qarovsiz qoldirish.',
  },

  // Kodlash
  {
    id: 'rule-brackets',
    number: '13',
    category: 'kodlash',
    categoryLabel: 'Kodlash',
    title: 'Qavslarni juftlab yozish qoidasi',
    summary:
      'Dasturlashda `()`, `{}`, `[]` va qo‘shtirnoq `""` doim juft bo‘ladi. Bitta ochilgan qavs yopilmasa, dastur ishlamaydi.',
    doThis: 'Qavsni ochishingiz bilanoq darhol yopilishini ham yozib qo‘ying.',
    avoidThis: '10 qator kod yozib, qaysi qavs ochiq qolganini qidirib o‘tirish.',
  },
  {
    id: 'rule-read-error',
    number: '14',
    category: 'kodlash',
    categoryLabel: 'Kodlash',
    title: 'Xatodan qo‘rqma — xato xabarini o‘qi!',
    summary:
      'Dasturchi uchun qizil xato xabari dushman emas, balki yo‘l ko‘rsatuvchi xaritadir: u xato qaysi qatorda ekanini aniq aytadi.',
    doThis: 'Xato matnidagi qator raqamini toping va o‘sha joyni tekshiring.',
    avoidThis: 'Xato chiqqanda hamma kodni o‘chirib tashlash.',
  },
  {
    id: 'rule-meaningful-names',
    number: '15',
    category: 'kodlash',
    categoryLabel: 'Kodlash',
    title: 'O‘zgaruvchilarga ma’noli nom berish',
    summary:
      'Kodda `a`, `b`, `x1` deb yozish o‘rniga `talabaYoshi`, `imtihonBalli` deb yozsangiz, kodingizni hamma oson tushunadi.',
    doThis: 'O‘zgaruvchi nomini uning ichidagi qiymatga qarab qo‘ying.',
    avoidThis: 'Bir xil nomsiz va chalkash harflardan foydalanish.',
  },
  {
    id: 'rule-understand-code',
    number: '16',
    category: 'kodlash',
    categoryLabel: 'Kodlash',
    title: 'Ko‘chirish emas — tushunib yozish',
    summary:
      'Tayyor kodni ko‘r-ko‘rona Ctrl + C / Ctrl + V qilsangiz, o‘zingiz mustaqil yozishda qiynalasiz.',
    doThis: 'Har bir qator «Nima uchun shunday yozildi?» deb o‘zingizga savol bering va AI Ustozdan fikr so‘rang.',
    avoidThis: 'Mohiyatini tushunmay tayyor javob ko‘chirish.',
  },
];

export const RULES_QUIZ_QUESTIONS: RuleQuizQuestion[] = [
  {
    id: 'rq-1',
    question:
      'Tasodifan muhim inshoingizni o‘chirib yubordingiz! Uni 1 soniyada qaytarish uchun qaysi tugmalar bosiladi?',
    options: ['Ctrl + Z', 'Ctrl + X', 'Shift + Delete', 'Alt + F4'],
    correctIndex: 0,
    explanation: 'Ctrl + Z (Undo) — oxirgi bajarilgan xato harakatni darhol orqaga qaytaradi.',
  },
  {
    id: 'rq-2',
    question:
      'Brauzerda dars ko‘rib o‘tirgan edingiz, adashib oynani yopib qo‘ydingiz. Uni qanday qaytarasiz?',
    options: ['Ctrl + S', 'Ctrl + Shift + T', 'Win + D', 'Ctrl + A'],
    correctIndex: 1,
    explanation: 'Ctrl + Shift + T oxirgi yopilgan brauzer sahifasini xuddi o‘sha joyidan qayta ochadi.',
  },
  {
    id: 'rq-3',
    question: 'Ko‘zlar charchamasligi uchun «20-20-20» qoidasi nimani anglatadi?',
    options: [
      'Kuniga 20 soat o‘ynash',
      'Har 20 daqiqada 20 soniya davomida 6 metr (20 fut) uzoqlikka qarash',
      'Ekranga 20 sm yaqin o‘tirish',
      '20 marta Ctrl + S bosish',
    ],
    correctIndex: 1,
    explanation:
      'Har 20 daqiqada 20 soniya uzoqqa qarash ko‘z mushaklarini dam oldiradi va ko‘rish qobiliyatini asraydi.',
  },
  {
    id: 'rq-4',
    question: 'Ekranning faqat kerakli bir bo‘lagini kesib rasmga (skrinshot) olish tugmasi qaysi?',
    options: ['Win + Shift + S', 'Ctrl + P', 'Alt + Tab', 'Ctrl + F'],
    correctIndex: 0,
    explanation: 'Win + Shift + S ekranning istalgan qismini tez kesib rasmga olish vositasini ochadi.',
  },
  {
    id: 'rq-5',
    question: 'O‘yin yoki dastur qotib qolsa, Vazifalar menejerini (Task Manager) qaysi tugmalar ochadi?',
    options: ['Ctrl + C', 'Ctrl + Shift + Esc', 'Ctrl + Shift + N', 'Win + L'],
    correctIndex: 1,
    explanation: 'Ctrl + Shift + Esc to‘g‘ridan-to‘g‘ri Task Manager ni ochadi.',
  },
  {
    id: 'rq-6',
    question: 'Faylni Savat (Recycle Bin) ga tashlamasdan butunlay o‘chiradigan xavfli kombinatsiya qaysi?',
    options: ['Ctrl + Delete', 'Shift + Delete', 'Alt + Delete', 'Ctrl + Z'],
    correctIndex: 1,
    explanation:
      'Shift + Delete faylni Savatga tushirmay butunlay o‘chiradi, shuning uchun ehtiyotkorlik bilan ishlatiladi.',
  },
  {
    id: 'rq-7',
    question: 'Do‘stingiz sizga «darslik.pdf.exe» nomli fayl yubordi. Nima qilasiz?',
    options: [
      'Darhol ochib o‘qiyman',
      'Ochmayman, chunki .exe bilan tugaydigan yashirin dastur virus bo‘lishi mumkin',
      'Ctrl + A bilan belgilayman',
      'Nomini o‘zgartirib do‘stlarimga tarqataman',
    ],
    correctIndex: 1,
    explanation:
      'Haqiqiy PDF hujjat .pdf bilan tugaydi. Oxiri .exe bo‘lgan qo‘sh kengaytmali fayllar xavfli dastur bo‘lishi mumkin.',
  },
  {
    id: 'rq-8',
    question: 'Kompyuter oldidan turib ketayotganda ekranni tez qulflash uchun qaysi tugmalar bosiladi?',
    options: ['Win + L', 'Win + D', 'Ctrl + L', 'Alt + F4'],
    correctIndex: 0,
    explanation: 'Win + L (Lock) tugmasi kompyuter ekranini darhol parol bilan qulflaydi.',
  },
  {
    id: 'rq-9',
    question: 'Dasturlash muharririda kod qatorini o‘chirmay vaqtincha izohga (comment) olish tugmasi qaysi?',
    options: ['Ctrl + /', 'Ctrl + V', 'Ctrl + P', 'F2'],
    correctIndex: 0,
    explanation: 'Ctrl + / tanlangan kod qatorini tez izohga aylantiradi va qayta bosilsa tiklaydi.',
  },
  {
    id: 'rq-10',
    question: 'Papka ichida sichqonchasiz yangi papka yaratish uchun qaysi tugmalar bosiladi?',
    options: ['Ctrl + Shift + N', 'Ctrl + F', 'Alt + Tab', 'Shift + ←'],
    correctIndex: 0,
    explanation: 'Ctrl + Shift + N Windows papkalarida yangi papka yaratadi (brauzerda esa maxfiy oyna ochadi).',
  },
];
