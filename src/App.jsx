import React, { useState, useEffect, useMemo } from 'react';
import jobsData from '../data/jobs.json';
import JobCard from './components/JobCard';
import { Search, Bookmark } from 'lucide-react'; // Přidána ikona Bookmark

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false); // Nový stav pro zobrazení jen uložených

  // Inicializace stavu přímo z LocalStorage (spustí se jen jednou při načtení)
  const [savedJobs, setSavedJobs] = useState(() => {
    const saved = localStorage.getItem('ml-job-finder-saved');
    return saved ? JSON.parse(saved) : [];
  });

  // Ukládání do LocalStorage při každé změně savedJobs
  useEffect(() => {
    localStorage.setItem('ml-job-finder-saved', JSON.stringify(savedJobs));
  }, [savedJobs]);

  // Funkce pro přidání/odebrání z oblíbených
  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const searchContent = `${job.job_title} ${job.employer_name} ${job.job_description}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
      const matchesRemote = remoteOnly ? job.job_is_remote === true : true;
      const matchesSaved = showSavedOnly ? savedJobs.includes(job.job_id) : true;
      
      return matchesSearch && matchesRemote && matchesSaved;
    });
  }, [searchTerm, remoteOnly, showSavedOnly, savedJobs]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500/30">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                ML Job Finder
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Nejnovější příležitosti pro Machine Learning & Data Science
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              
              {/* Nový filtr: Uložené pozice */}
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

              <label className="flex items-center gap-2 cursor-pointer group">
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
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  Jen Remote
                </span>
              </label>

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {showSavedOnly ? 'Tvoje uložené pozice' : 'Nalezené pozice'}
          </h2>
          <span className="bg-slate-800 text-emerald-400 py-1 px-3 rounded-full text-sm font-bold border border-slate-700">
            {filteredJobs.length} výsledků
          </span>
        </div>

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
          <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
            <Bookmark className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nic jsme nenašli</h3>
            <p className="text-slate-400">
              {showSavedOnly 
                ? "Zatím nemáš uložené žádné pozice." 
                : "Zkus upravit parametry vyhledávání."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
