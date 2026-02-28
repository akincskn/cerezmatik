# Çerezmatik

3 dakikada KVKK uyumlu cookie banner, çerez politikası ve aydınlatma metni oluşturucu.

## Özellikler

- 4 adımlı wizard: firma bilgileri → çerez seçimi → banner tasarımı → çıktılar
- Vanilla JS snippet (bağımlılıksız, ~4 KB)
- Otomatik Türkçe çerez politikası HTML
- KVKK Madde 10 uyumlu aydınlatma metni
- Google Analytics, Google Ads, Facebook Pixel, Hotjar desteği
- Hesapsız kullanım + kayıt ile panel yönetimi
- Public hosting: `/p/[slug]` çerez politikası sayfası

## Stack

- Next.js 14 (App Router)
- Prisma v5 + Neon PostgreSQL
- NextAuth v4 (JWT, Credentials)
- Zustand v5, shadcn/ui, Tailwind CSS v3
- Zod v4

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasını oluştur
cp .env.example .env.local
# .env.local içindeki değerleri doldur

# Veritabanı migration
npx prisma migrate dev --name init

# Geliştirme sunucusunu başlat
npm run dev
```

## Deployment (Vercel)

1. Repo'yu Vercel'e bağla
2. Environment variables ekle (`.env.example`'a bak):
   - `DATABASE_URL` — Neon pooled connection
   - `DIRECT_URL` — Neon direct connection
   - `NEXTAUTH_URL` — Production URL (örn: `https://cerezmatik.com`)
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32` ile üret
3. Build command: `npx prisma migrate deploy && next build`

## Lisans

MIT
