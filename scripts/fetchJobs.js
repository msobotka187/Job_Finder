import fs from 'fs';
import path from 'path';

// Zkontrolujeme API klíč
const RAPID_API_KEY = process.env.VITE_RAPIDAPI_KEY;
if (!RAPID_API_KEY) {
  console.error('❌ CHYBA: Chybí API klíč v .env souboru!');
  process.exit(1);
}

// v2 endpoint a query
const QUERY = encodeURIComponent('Machine Learning Engineer');
const URL = `https://jsearch.p.rapidapi.com/search-v2?query=${QUERY}&num_pages=1&country=us`;

async function fetchJobs() {
  console.log('⏳ Stahuji ML pozice z JSearch v2 API...');

  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPID_API_KEY,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API chyba ${response.status}: ${errorText}`);
    }

    const json = await response.json();
    // Ve v2 se data často skrývají pod klíčem 'data'
    const jobs = json.data || [];
    
    console.log(`✅ Úspěšně staženo ${jobs.length} pozic.`);

    const dirPath = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const filePath = path.join(dirPath, 'jobs.json');
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2), 'utf-8');
    
    console.log(`💾 Data uložena do: ${filePath}`);
    
  } catch (error) {
    console.error('❌ Nastala chyba při volání v2 API:', error.message);
  }
}

fetchJobs();
