# ML Job Finder

Aplikace v Reactu pro vyhledávání a filtrování pracovních nabídek v oblasti Machine Learning.

## Architektura a klíčové vlastnosti
- **Data Fetching:** Stahování dat z JSearch API přes oddělený Node.js skript.
- **Graceful Degradation:** Automatický přechod na lokální záložní data při selhání nebo limitu API.
- **Normalizace dat:** Vlastní logika pro sjednocení nekonzistentních formátů (např. typy úvazků) pro spolehlivé klientské filtrování.
- **Perzistence stavu:** Ukládání oblíbených nabídek pomocí localStorage.

## Technologie
- **Frontend:** React (Vite)
- **Stylování:** Tailwind CSS, Lucide React
- **Skriptování:** Node.js

## Instalace a spuštění

**Instalace závislostí:**
```bash
npm install
```

**Nastavení prostředí** (vytvořte soubor .env v kořenovém adresáři):
```bash
VITE_RAPIDAPI_KEY=vas_api_klic
```

**Stažení úvodních dat:**
```bash
npm run fetch-jobs
```

**Spuštění vývojového serveru:**
```bash
npm run dev
```
