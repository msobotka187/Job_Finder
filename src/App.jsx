import React, { useState, useEffect, useMemo } from 'react';
import jobsResponse from '../data/jobs.json';
import JobCard from './components/JobCard';
import { Search, Bookmark } from 'lucide-react';

// Pomocná funkce pro normalizaci typů úvazků (nyní zvládá i kombinace)
const getEmploymentTypes = (type) => {
  if (!type) return ['OTHER'];
  const clean = type.toLowerCase().replace(/-/g, ' '); // Nahradí všechny pomlčky
  const types = [];
  
  if (clean.includes('full time')) types.push('FULLTIME');
  if (clean.includes('part time')) types.push('PARTTIME');
  if (clean.includes('contract')) types.push('CONTRACT');
  
  return types.length > 0 ? types : ['OTHER'];
};

export default function App() {
  // Inicializace dat z JSONu (hledáme buď v .jobs nebo přímo jako pole, pro případ, že se struktura změní)
  const jobsData = jobsResponse.jobs || jobsResponse || [];

  // --- STAVY (State) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [employmentType, setEmploymentType] = useState('ALL');
  const [city, setCity] = useState('ALL');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Načítání a ukládání oblíbených do LocalStorage
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('ml-job-finder-saved');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ml-job-finder-saved', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  // --- DERIVOVANÁ DATA (Filtry & Možnosti) ---
  
  // Získáme unikátní města pro dropdown
  const uniqueCities = useMemo(() => {
    const cities = jobsData.map(j => j.job_city).filter(Boolean);
    return ['ALL', ...new Set(cities)];
  }, [jobsData]);

  // Hlavní filtrování
  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      // 1. Textové hledání
      const searchContent = `${job.job_title} ${job.employer_name} ${job.job_description || ''}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
      
      // 2. Togglovací filtry (Remote, Oblíbené)
      const matchesRemote = remoteOnly ? job.job_is_remote === true : true;
      const matchesSaved = showSavedOnly ? savedJobs.includes(job.job_id) : true;
      
      // 3. Dropdown filtry (Úvazek, Město)
      const jobTypes = getEmploymentTypes(job.job_employment_type);
      const matchesType = employmentType === 'ALL' ? true : jobTypes.includes(employmentType);
      const matchesCity = city === 'ALL' ? true : job.job_city === city;
      
      return matchesSearch && matchesRemote && matchesSaved && matchesType && matchesCity;
    });
  }, [searchTerm, remoteOnly, showSavedOnly, employmentType, city, savedJobs, jobsData]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500/30">
      
      {/* 1. HLAVIČKA (Titul & Hledání & Tlačítko uložených) */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Job Finder
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Nejnovější příležitosti v tvém okolí
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Tlačítko pro Uložené pozice */}
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  showSavedOnly 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50' 
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-emerald-400' : ''}`} />
                Uložené ({savedJobs.length})
              </button>

              {/* Hledací lišta */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder="Hledat pozici nebo firmu..."
                  className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. HLAVNÍ OBSAH */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filtrovací lišta (Dropdowny a Checkboxy) */}
        <div className="mb-8 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-wrap gap-4 items-center">
          
          <select 
            className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          >
            <option value="ALL">Všechny úvazky</option>
            <option value="FULLTIME">Full-time</option>
            <option value="PARTTIME">Part-time</option>
            <option value="CONTRACT">Contractor</option>
            <option value="OTHER">Ostatní</option>
          </select>

          <select 
            className="bg-slate-800 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {uniqueCities.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'Všechna města' : c}</option>
            ))}
          </select>

          {/* Toggle "Jen Remote" stylovaný jako hezký přepínač */}
          <label className="flex items-center gap-2 cursor-pointer group ml-auto">
            <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
              Jen Remote
            </span>
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${remoteOnly ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${remoteOnly ? 'translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>

        {/* Informace o počtu výsledků */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {showSavedOnly ? 'Tvoje uložené pozice' : 'Nalezené pozice'}
          </h2>
          <span className="bg-slate-800 text-emerald-400 py-1 px-3 rounded-full text-sm font-bold border border-slate-700">
            {filteredJobs.length} výsledků
          </span>
        </div>

        {/* Grid pro karty s pozicemi */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.job_id} 
                job={job} 
                isSaved={savedJobs.includes(job.job_id)}
                onToggleSave={toggleSaveJob}
              />
            ))}
          </div>
        ) : (
          /* Empty state (Když nic nenajdeme) */
          <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
            {showSavedOnly ? (
              <>
                <Bookmark className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Žádné uložené pozice</h3>
                <p className="text-slate-400">Klikni na záložku u pozice pro její uložení sem.</p>
              </>
            ) : (
              <>
                <Search className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Nic jsme nenašli</h3>
                <p className="text-slate-400">Zkus upravit filtry nebo hledaný výraz.</p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
