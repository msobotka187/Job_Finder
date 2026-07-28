import React from 'react';
import { MapPin, DollarSign, ExternalLink, Briefcase, Clock, Building, Monitor } from 'lucide-react';

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

export default JobCard;
