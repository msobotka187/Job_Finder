import React, { useState, useMemo } from 'react';
import jobsData from '../data/jobs.json';
import {
  Search,
  MapPin,
  DollarSign,
  ExternalLink,
  Briefcase,
  Clock,
  Building,
  Monitor
} from 'lucide-react';

// --- KOMPONENTA: Kartička pracovní pozice ---
const JobCard = ({ job }) => {
  // Pomocná funkce pro bezpečné formátování platu
  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Plat neuveden';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    });
    if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
    return formatter.format(min || max);
  };

  // Formátování data
  const postDate = new Date(job.job_posted_at_datetime_utc).toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 flex flex-col group shadow-lg hover:shadow-emerald-500/10">
      {/* Hlavička s logem a názvem firmy */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden shrink-0 border border-slate-600">
            {job.employer_logo ? (
              <img src={job.employer_logo} alt={job.employer_name} className="w-full h-full object-contain p-1" />
            ) : (
              <Building className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
              {job.job_title}
            </h3>
            <p className="text-slate-400 font-medium">{job.employer_name}</p>
          </div>
        </div>
      </div>

      {/* Tagy s metadaty */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600">
          <MapPin className="w-3.5 h-3.5" />
          {job.job_city || 'Lokace neuvedena'}
        </span>
        {job.job_is_remote && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Monitor className="w-3.5 h-3.5" />
            Remote
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <DollarSign className="w-3.5 h-3.5" />
          {formatSalary(job.job_min_salary, job.job_max_salary, job.job_salary_currency)}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Briefcase className="w-3.5 h-3.5" />
          {job.job_employment_type}
        </span>
      </div>

      {/* Popis pozice */}
      <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
        {job.job_description}
      </p>

      {/* Patička (Datum + Tlačítko) */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          Přidáno: {postDate}
        </div>
        <a 
          href={job.job_apply_link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-semibold rounded-lg transition-colors"
        >
          Aplikovat
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

// --- HLAVNÍ KOMPONENTA: Dashboard ---
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  // Memoizace filtrování pro optimální výkon
  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const searchContent = `${job.job_title} ${job.employer_name} ${job.job_description}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
      const matchesRemote = remoteOnly ? job.job_is_remote === true : true;
      
      return matchesSearch && matchesRemote;
    });
  }, [searchTerm, remoteOnly]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-emerald-500/30">
      {/* Hlavička aplikace */}
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

            {/* Ovládací panel (Filtry & Hledání) */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
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

      {/* Hlavní obsah - Grid pozic */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Výsledky počítadlo */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Nalezené pozice
          </h2>
          <span className="bg-slate-800 text-emerald-400 py-1 px-3 rounded-full text-sm font-bold border border-slate-700">
            {filteredJobs.length} výsledků
          </span>
        </div>

        {/* Mřížka (Grid) pro karty */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.job_id} job={job} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20 bg-slate-800/50 rounded-2xl border border-slate-700 border-dashed">
            <Search className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Žádné pozice nenalezeny</h3>
            <p className="text-slate-400">Zkus upravit parametry vyhledávání nebo vypnout Remote filtr.</p>
          </div>
        )}
      </main>
    </div>
  );
}
