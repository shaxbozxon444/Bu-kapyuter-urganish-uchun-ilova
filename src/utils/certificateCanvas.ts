import type { CertificateRecord } from '../data/curriculum';

const CERT_MEDIA_CACHE_KEY = 'codecraft_cert_media_v1';

interface CachedCertMedia {
  photoDataUrl?: string;
  aiNote?: string;
}

export function saveCertMediaCache(certId: string, media: CachedCertMedia): void {
  try {
    const raw = localStorage.getItem(CERT_MEDIA_CACHE_KEY);
    const map: Record<string, CachedCertMedia> = raw ? JSON.parse(raw) : {};
    map[certId] = {
      ...(map[certId] || {}),
      ...media,
    };
    const keys = Object.keys(map);
    // Cap local cache to 12 most recent certificates so low-RAM/low-storage phones stay fast
    if (keys.length > 12) {
      for (const oldKey of keys.slice(0, keys.length - 12)) {
        delete map[oldKey];
      }
    }
    localStorage.setItem(CERT_MEDIA_CACHE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

export function getCertMediaCache(certId: string): CachedCertMedia | null {
  try {
    const raw = localStorage.getItem(CERT_MEDIA_CACHE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, CachedCertMedia>;
    return map[certId] || null;
  } catch {
    return null;
  }
}

/**
 * Center-crops and compresses a student portrait photo to a compact 320x320 JPEG data URL
 * so low-RAM phones can render and save certificates instantly without lag.
 */
export async function compressPortraitPhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Faqat rasm faylini (JPG, PNG, WEBP) yuklang.');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Rasmni o‘qishda xatolik yuz berdi.'));
      }
    };
    reader.onerror = () => reject(new Error('Rasmni yuklab bo‘lmadi.'));
    reader.readAsDataURL(file);
  });

  const img = await loadImage(dataUrl);
  const size = 320;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Brauzer rasmni qayta ishlay olmadi.');
  }

  const minSide = Math.min(img.width, img.height);
  const sx = Math.max(0, (img.width - minSide) / 2);
  const sy = Math.max(0, (img.height - minSide) / 2);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

  return canvas.toDataURL('image/jpeg', 0.84);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Rasmni yuklashda xatolik yuz berdi.'));
    img.src = src;
  });
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Generates a high-resolution (1600x1130) PNG certificate image containing:
 * - Student Full Name & Portrait Photo (if provided)
 * - Track & Official Exam Score / Percentage / Grade
 * - AI Assistant Commendation Note (if generated)
 * - BilimKod · murodillayev_dev seal & verification ID
 */
export async function renderCertificateImage(certificate: CertificateRecord): Promise<string> {
  const cached = getCertMediaCache(certificate.id);
  const photoSrc = certificate.photoDataUrl || cached?.photoDataUrl;
  const aiNote = (certificate.aiNote || cached?.aiNote || '').trim();

  let portraitImg: HTMLImageElement | null = null;
  if (photoSrc) {
    try {
      portraitImg = await loadImage(photoSrc);
    } catch {
      portraitImg = null;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1130;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Sertifikat rasmini chizib bo‘lmadi.');
  }

  const isProg = certificate.scope === 'programming';
  const accentHex = isProg ? '#4f46e5' : certificate.scope === 'all' ? '#059669' : '#0284c7';
  const softAccentBg = isProg ? '#eef2ff' : certificate.scope === 'all' ? '#ecfdf5' : '#f0f9ff';

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Outer clean paper background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1600, 1130);

  // Subtle architectural frame
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(46, 46, 1508, 1038);

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 10;
  ctx.strokeRect(46, 46, 1508, 1038);

  ctx.strokeStyle = accentHex;
  ctx.lineWidth = 3;
  ctx.strokeRect(72, 72, 1456, 986);

  // Top color ribbon
  ctx.fillStyle = accentHex;
  ctx.fillRect(72, 72, 1456, 18);

  // Brand header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 34px Outfit, sans-serif';
  ctx.fillText('BilimKod · murodillayev_dev', 800, 154);

  ctx.fillStyle = '#64748b';
  ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('KOMPYUTER SAVODXONLIGI VA DASTURLASH TA’LIM PLATFORMASI', 800, 190);

  // Title
  ctx.fillStyle = accentHex;
  ctx.font = 'bold 68px Outfit, sans-serif';
  ctx.fillText('SERTIFIKAT', 800, 278);

  // Main Identity Band (with Portrait Photo if present, or centered cleanly)
  if (portraitImg) {
    // Portrait frame on left-center
    const px = 210;
    const py = 335;
    const pSize = 210;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - 10, py - 10, pSize + 20, pSize + 20);
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 4;
    ctx.strokeRect(px - 10, py - 10, pSize + 20, pSize + 20);

    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pSize, pSize);
    ctx.clip();
    ctx.drawImage(portraitImg, px, py, pSize, pSize);
    ctx.restore();

    // Right side: Recipient name & description
    ctx.textAlign = 'left';
    ctx.fillStyle = '#475569';
    ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Ushbu rasmiy sertifikat quyidagi bitiruvchiga beriladi:', 475, 372);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 54px Outfit, sans-serif';
    ctx.fillText(certificate.studentName, 475, 444, 930);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(475, 470);
    ctx.lineTo(1400, 470);
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.font = '500 26px "Plus Jakarta Sans", sans-serif';
    const descLines = wrapCanvasText(
      ctx,
      `«${certificate.trackTitle}» yo‘nalishi bo‘yicha o‘quv dasturi hamda yakuniy nazorat imtihonini muvaffaqiyatli tamomladi.`,
      920
    );
    descLines.slice(0, 2).forEach((line, idx) => {
      ctx.fillText(line, 475, 518 + idx * 38);
    });
  } else {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#475569';
    ctx.font = '500 25px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Ushbu rasmiy hujjat quyidagi o‘quvchiga taqdim etiladi:', 800, 345);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 60px Outfit, sans-serif';
    ctx.fillText(certificate.studentName, 800, 428, 1180);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(360, 456);
    ctx.lineTo(1240, 456);
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.font = '500 27px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(
      `«${certificate.trackTitle}» yo‘nalishi bo‘yicha o‘quv dasturi`,
      800,
      514
    );
    ctx.fillText(
      'hamda yakuniy nazorat imtihonini muvaffaqiyatli tamomlaganligi uchun berildi.',
      800,
      554
    );
  }

  // AI Note strip (if available)
  if (aiNote) {
    ctx.fillStyle = softAccentBg;
    ctx.fillRect(195, 594, 1210, 86);
    ctx.strokeStyle = accentHex;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(195, 594, 1210, 86);

    ctx.textAlign = 'center';
    ctx.fillStyle = accentHex;
    ctx.font = '700 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('AI BAHOLASH XULOSASI', 800, 622);

    ctx.fillStyle = '#1e293b';
    ctx.font = '500 21px "Plus Jakarta Sans", sans-serif';
    const noteLines = wrapCanvasText(ctx, aiNote, 1140);
    ctx.fillText(noteLines.slice(0, 2).join(' '), 800, 657, 1150);
  }

  // Score Summary Box
  const metricsY = aiNote ? 712 : 655;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(195, metricsY, 1210, 134);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(195, metricsY, 1210, 134);

  const colCenters = [400, 800, 1200];
  const labels = ['TO‘PLANGAN BALL', 'BAHOLASH DARAJASI', 'SERTIFIKAT RAQAMI'];
  const values = [
    `${certificate.score} / ${certificate.total} (${certificate.percentage}%)`,
    certificate.gradeLabel,
    certificate.id,
  ];

  ctx.textAlign = 'center';
  colCenters.forEach((cx, i) => {
    ctx.fillStyle = '#64748b';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(labels[i], cx, metricsY + 46);

    ctx.fillStyle = i === 1 ? accentHex : '#0f172a';
    ctx.font = 'bold 28px "JetBrains Mono", monospace';
    ctx.fillText(values[i], cx, metricsY + 95, 360);
  });

  // Footer signatures & seal
  ctx.textAlign = 'left';
  ctx.fillStyle = '#64748b';
  ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('BERILGAN SANA', 195, 938);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(formattedDate, 195, 978);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#64748b';
  ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('MAS’UL PLATFORMA', 1405, 938);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(certificate.issuerName, 1405, 978);

  // Center Seal
  ctx.textAlign = 'center';
  ctx.beginPath();
  ctx.arc(800, 955, 62, 0, Math.PI * 2);
  ctx.fillStyle = accentHex;
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px Outfit, sans-serif';
  ctx.fillText('TASDIQLANGAN', 800, 950);
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  ctx.fillText(`${certificate.percentage}%`, 800, 978);

  return canvas.toDataURL('image/png');
}
