# 🚤 FJORD HUNTER

Et avhengighetsskapende 3D båtspill for Josva og Kaleb!

## 🎮 Spillfunksjoner

- **3D Båtkjøring** - Realistisk fysikk med React Three Fiber og Rapier
- **Fiske** - Fang fisk ved å trykke SPACE når du er nær dem
- **Skyting** - Skyt fugler med SHIFT-tasten
- **Samling** - Kjør over gullmynter og stjerner for bonuspoeng
- **Leaderboards** - Konkurrer med andre spillere via Supabase database
- **Achievements** - 14 forskjellige achievements å låse opp
- **Level System** - XP-basert progresjon
- **AI Funksjoner** (valgfritt) - Dynamiske utfordringer og tips

## 💰 Kostnader

### ✅ GRATIS (Ingen kredittkort nødvendig)
- **Hele spillet** - Full spillopplevelse uten AI-funksjoner
- **Supabase Database** - Gratis tier (500MB database, 50,000 monthly active users)
- **Vercel Hosting** - Gratis hobby plan
- **Leaderboards** - Fullt funksjonelt
- **Achievements** - Alle 14 achievements
- **Pre-definerte utfordringer** - 4 forskjellige utfordringer

### 💳 Valgfritt (Krever kredittkort)
- **AI-genererte utfordringer** - Krever Vercel AI Gateway
- **AI Coach tips** - Personlige tips basert på spillstatistikk
- **Vercel AI Gateway** - Inkluderer $20 gratis credits per måned
  - GPT-4o-mini koster ca $0.15 per 1M input tokens
  - En AI-utfordring bruker ~200 tokens = $0.00003 (nesten gratis)
  - Med $20 gratis credits kan du generere ~650,000 AI-utfordringer per måned

**Konklusjon: Spillet er 100% gratis å spille. AI-funksjoner er en bonus som koster nesten ingenting selv om du aktiverer dem.**

## 🚀 Kom i gang

### 1. Installer avhengigheter
\`\`\`bash
npm install
\`\`\`

### 2. Kjør database-script
Spillet vil automatisk kjøre SQL-scriptet for å sette opp tabellene i Supabase.

### 3. Start utviklingsserver
\`\`\`bash
npm run dev
\`\`\`

### 4. (Valgfritt) Aktiver AI-funksjoner
For å bruke AI-genererte utfordringer og tips:
1. Gå til [Vercel AI Gateway](https://vercel.com/ai)
2. Legg til et kredittkort (får $20 gratis credits per måned)
3. AI-funksjonene vil automatisk fungere

## 🎯 Kontroller

- **W / ↑** - Gass
- **S / ↓** - Rygge
- **A / ←** - Sving venstre
- **D / →** - Sving høyre
- **SPACE** - Fiske (når nær fisk)
- **SHIFT** - Skyte (treff fugler)

## 🏆 Poeng System

- 🐟 Fisk: 10 poeng
- 🦅 Fugler: 25 poeng
- 🪙 Gullmynter: 15 poeng
- ⭐ Stjerner: 50 poeng
- 🎯 Utfordringer: 100-250 bonus poeng

## 🛠️ Teknologi

- **Next.js 16** - React framework
- **React Three Fiber** - 3D grafikk
- **Rapier** - Fysikk-motor
- **Supabase** - Database og leaderboards
- **Zustand** - State management
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI komponenter
- **Vercel AI SDK** (valgfritt) - AI-funksjoner

## ⚠️ Kjente advarsler

**"Multiple instances of Three.js being imported"**
- Dette er en harmløs advarsel fra React Three Fiber
- Påvirker ikke spillets funksjonalitet
- Kan ignoreres trygt

## 📝 Notater

- Spillet bruker browser-basert 3D rendering (WebGL)
- Fungerer best i moderne nettlesere (Chrome, Firefox, Safari, Edge)
- Anbefalt skjermstørrelse: 1280x720 eller større
- Supabase Row Level Security (RLS) er aktivert for sikkerhet
