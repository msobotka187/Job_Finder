import fs from 'fs';
import path from 'path';

// Získáme API klíč z .env souboru
const RAPID_API_KEY = process.env.VITE_RAPIDAPI_KEY;

// Hledáme ML pozice
const QUERY = encodeURIComponent('Machine Learning Engineer');
const URL = `https://jsearch.p.rapidapi.com/search?query=${QUERY}&num_pages=1`;

async function fetchJobs() {
  console.log('⏳ Stahuji ML pozice z JSearch API...');

  if (!RAPID_API_KEY) {
    console.error('❌ Chybí API klíč! Zkontroluj soubor .env');
    return;
  }

  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error(`Chyba API: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const jobs = json.data;
    
    console.log(`✅ Úspěšně staženo ${jobs.length} pozic.`);

    // Ujistíme se, že složka "data" existuje
    const dirPath = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Uložení dat
    const filePath = path.join(dirPath, 'jobs.json');
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2), 'utf-8');
    
    console.log(`💾 Data uložena do: ${filePath}`);
    
  } catch (error) {
    console.error('❌ Nastala chyba při stahování dat:', error.message);
  }
}

fetchJobs();
