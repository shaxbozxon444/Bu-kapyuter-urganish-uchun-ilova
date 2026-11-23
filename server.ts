import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// Ephemeral in-memory fallback if ADMIN_SESSION_SECRET is not set
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');

const ADMIN_DATA_DIR = path.resolve(process.cwd(), 'data');
const ADMIN_AUTH_FILE = path.resolve(ADMIN_DATA_DIR, 'admin-auth.json');

interface StoredAdminHash {
  salt: string;
  hash: string;
  claimedAt: string;
}

function readClaimedAdminHash(): StoredAdminHash | null {
  try {
    if (!fs.existsSync(ADMIN_AUTH_FILE)) {
      return null;
    }
    const raw = fs.readFileSync(ADMIN_AUTH_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<StoredAdminHash>;
    if (
      typeof parsed.salt === 'string' &&
      typeof parsed.hash === 'string' &&
      parsed.salt.length > 0 &&
      parsed.hash.length > 0
    ) {
      return {
        salt: parsed.salt,
        hash: parsed.hash,
        claimedAt: typeof parsed.claimedAt === 'string' ? parsed.claimedAt : new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

function writeClaimedAdminHash(record: StoredAdminHash): void {
  if (!fs.existsSync(ADMIN_DATA_DIR)) {
    fs.mkdirSync(ADMIN_DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(record, null, 2), { mode: 0o600 });
}

function hashPasscodeWithSalt(passcode: string, salt: string): Buffer {
  return crypto.scryptSync(passcode, salt, 64);
}

function constantTimeCompareStrings(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function signAdminToken(): { token: string; expiresAt: number } {
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: expiresAt, nonce })).toString(
    'base64url'
  );
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return { token: `${payload}.${sig}`, expiresAt };
}

function verifyAdminToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  if (!payload || !sig) return false;

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

const SOCRATIC_SYSTEM_INSTRUCTION = `
Sen "murodillayev_dev" ta'lim platformasining Sokratik AI Ustozisan (Kompyuter savodxonligi va Dasturlash asoslari bo'yicha mentor).

QAT'IY VA BUZILMAS QOIDALAR:
1. HECH QACHON to'g'ri javobni, aniq sonni, test variantini (A, B, C yoki D) yoki tayyor yechim kodini TO'G'RIDAN-TO'G'RI AYTMA!
2. Agar o'quvchi "javobini ayt", "tayyor kod yozib ber", "qaysi variant to'g'ri" deb so'rasa ham, javobni BERMA. Buning o'rniga uning o'zi topishi uchun fikr ber.
3. Javobingda faqat quyidagilar bo'lsin:
   - Muammoni tushunishga yordam beradigan 1-2 ta yo'naltiruvchi fikr ("Maslahat / Fikr");
   - Birinchi mantiqiy qadam yoki hayotiy o'xshatish;
   - Oxirida o'quvchini mustaqil fikrlashga undaydigan 1 ta qisqa savol.
4. Faqat sof, tushunarli va do'stona O'zbek tilida javob ber. Javob qisqa, lo'nda va o'qishga oson bo'lsin (ko'pi bilan 120-160 so'z).
`.trim();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // --- Admin Passcode Auth Endpoints ---
  app.get('/api/admin/status', (_req, res) => {
    const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
    if (envPasscode.length > 0) {
      res.json({ configured: true, source: 'env' });
      return;
    }
    const claimed = readClaimedAdminHash();
    if (claimed) {
      res.json({ configured: true, source: 'claimed' });
      return;
    }
    res.json({ configured: false, source: 'unconfigured' });
  });

  app.post('/api/admin/claim', (req, res) => {
    const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
    if (envPasscode.length > 0 || readClaimedAdminHash() !== null) {
      res.status(409).json({
        error: 'Admin paroli allaqachon sozlangan. Kirish oynasidan foydalaning.',
      });
      return;
    }

    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (passcode.length < 6 || passcode.length > 128) {
      res.status(400).json({
        error: 'Parol kamida 6 ta, ko‘pi bilan 128 ta belgidan iborat bo‘lishi kerak.',
      });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPasscodeWithSalt(passcode, salt).toString('hex');
    writeClaimedAdminHash({
      salt,
      hash,
      claimedAt: new Date().toISOString(),
    });

    const session = signAdminToken();
    res.json({ token: session.token, expiresAt: session.expiresAt });
  });

  app.post('/api/admin/login', (req, res) => {
    const passcode = typeof req.body?.passcode === 'string' ? req.body.passcode.trim() : '';
    if (!passcode || passcode.length > 128) {
      res.status(400).json({ error: 'Iltimos, parolni kiriting.' });
      return;
    }

    const envPasscode = (process.env.ADMIN_PASSCODE || '').trim();
    if (envPasscode.length > 0) {
      if (constantTimeCompareStrings(passcode, envPasscode)) {
        const session = signAdminToken();
        res.json({ token: session.token, expiresAt: session.expiresAt });
        return;
      }
      res.status(401).json({ error: 'Admin paroli noto‘g‘ri.' });
      return;
    }

    const claimed = readClaimedAdminHash();
    if (!claimed) {
      res.status(400).json({ error: 'Admin paroli hali o‘rnatilmagan.' });
      return;
    }

    const candidateHash = hashPasscodeWithSalt(passcode, claimed.salt);
    const storedHash = Buffer.from(claimed.hash, 'hex');
    if (
      candidateHash.length === storedHash.length &&
      crypto.timingSafeEqual(candidateHash, storedHash)
    ) {
      const session = signAdminToken();
      res.json({ token: session.token, expiresAt: session.expiresAt });
      return;
    }

    res.status(401).json({ error: 'Admin paroli noto‘g‘ri.' });
  });

  app.get('/api/admin/verify', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (verifyAdminToken(token)) {
      res.json({ valid: true });
      return;
    }
    res.status(401).json({ valid: false });
  });

  // --- Socratic AI Ustoz Endpoint (Server-side @google/genai) ---
  app.post('/api/ai-tutor', async (req, res) => {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      res.status(503).json({
        error:
          'GEMINI_API_KEY sozlanmagan. Iltimos, AI Studio Secrets bo‘limidan GEMINI_API_KEY qo‘shing.',
      });
      return;
    }

    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message || message.length > 1500) {
      res.status(400).json({
        error: 'Savol matni 1 dan 1500 belgigacha bo‘lishi kerak.',
      });
      return;
    }

    const contextTrack =
      req.body?.contextTrack === 'programming' ? 'Dasturlash asoslari' : 'Kompyuter savodxonligi';
    const contextTitle =
      typeof req.body?.contextTitle === 'string' ? req.body.contextTitle.slice(0, 140) : '';
    const contextTopic =
      typeof req.body?.contextTopic === 'string' ? req.body.contextTopic.slice(0, 800) : '';

    const rawHistory: unknown[] = Array.isArray(req.body?.history)
      ? (req.body.history as unknown[]).slice(-8)
      : [];
    const safeHistory = rawHistory
      .filter(
        (m: unknown): m is { role: 'user' | 'assistant'; text: string } =>
          typeof m === 'object' &&
          m !== null &&
          ((m as { role?: string }).role === 'user' ||
            (m as { role?: string }).role === 'assistant') &&
          typeof (m as { text?: unknown }).text === 'string'
      )
      .map((m: { role: 'user' | 'assistant'; text: string }) => ({
        role: m.role === 'assistant' ? 'AI Ustoz' : 'O‘quvchi',
        text: m.text.slice(0, 600),
      }));

    const contextBlock = [
      `Yo‘nalish: ${contextTrack}`,
      contextTitle ? `Mavzu / Masala: ${contextTitle}` : '',
      contextTopic ? `Tafsilot: ${contextTopic}` : '',
      safeHistory.length > 0
        ? `Oldingi suhbat:\n${safeHistory
            .map((h: { role: string; text: string }) => `${h.role}: ${h.text}`)
            .join('\n')}`
        : '',
      `O‘quvchining hozirgi savoli: ${message}`,
      'Eslatma: Javobni yoki tayyor kodni aytma, faqat fikr va yo‘naltiruvchi savol ber!',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: contextBlock,
        config: {
          systemInstruction: SOCRATIC_SYSTEM_INSTRUCTION,
        },
      });

      const reply = (response.text || '').trim();
      if (!reply) {
        res.status(502).json({ error: 'AI javob qaytara olmadi. Qayta urinib ko‘ring.' });
        return;
      }

      res.json({ reply });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('AI Tutor error:', errMsg);
      if (errMsg.includes('403') || errMsg.includes('API_KEY_INVALID')) {
        res.status(403).json({
          error: 'Gemini API kaliti yaroqsiz yoki ruxsat yo‘q. Settings > Secrets bo‘limini tekshiring.',
        });
        return;
      }
      if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED')) {
        res.status(429).json({
          error: 'So‘rovlar limiti vaqtincha to‘ldi. Bir oz kutib qayta urinib ko‘ring.',
        });
        return;
      }
      res.status(500).json({
        error: 'AI Ustoz bilan bog‘lanishda xatolik yuz berdi. Qayta urinib ko‘ring.',
      });
    }
  });

  if (IS_PROD) {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`murodillayev_dev server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
