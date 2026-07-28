import React, { useState, useMemo } from 'react';
import jobsResponse from '../data/jobs.json';
import JobCard from './components/JobCard';
import { Search } from 'lucide-react';

export default function App() {
  const jobsData = jobsResponse.jobs || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [employmentType, setEmploymentType] = useState('ALL'); // 'ALL', 'FULLTIME', 'PARTTIME', 'CONTRACTOR'
  const [city, setCity] = useState('ALL');

  // Získání unikátních měst pro filtr
  const uniqueCities = useMemo(() => {
    const cities = jobsData.map(j => j.job_city).filter(Boolean);
    return ['ALL', ...new Set(cities)];
  }, [jobsData]);

  const getEmploymentTypes = (type) => {
    if (!type) return ['OTHER'];
    const clean = type.toLowerCase().replaceAll('-', ' ');
    const types = [];

    console.log("clean:", clean);
    if (clean.includes('full time')) types.push('FULLTIME');
    if (clean.includes('part time')) types.push('PARTTIME');
    if (clean.includes('contract')) types.push('CONTRACT');

    return types.length > 0 ? types : ['OTHER'];
  };

  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const searchContent = `${job.job_title} ${job.employer_name}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchTerm.toLowerCase());
      const matchesRemote = remoteOnly ? job.job_is_remote === true : true;
      const jobTypes = getEmploymentTypes(job.job_employment_type);
      const matchesType = employmentType === 'ALL' ? true : jobTypes.includes(employmentType);
      const matchesCity = city === 'ALL' ? true : job.job_city === city;

      return matchesSearch && matchesRemote && matchesType && matchesCity;
    });
  }, [searchTerm, remoteOnly, employmentType, city, jobsData]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      {/* Filtrovací lišta */}
      <div className="max-w-7xl mx-auto mb-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-wrap gap-4 items-center">
        
        <input
          type="text"
          placeholder="Hledat..."
          className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700" 
          onChange={(e) => setEmploymentType(e.target.value)}>
          <option value="ALL">Všechny úvazky</option>
          <option value="FULLTIME">Full-time</option>
          <option value="PARTTIME">Part-time</option>
          <option value="CONTRACT">Contractor</option>
          <option value="OTHER">Ostatní</option>
        </select>

        <select className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700" onChange={(e) => setCity(e.target.value)}>
          {uniqueCities.map(c => <option key={c} value={c}>{c === 'ALL' ? 'Všechna města' : c}</option>)}
        </select>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
          Remote
        </label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {filteredJobs.map((job) => <JobCard key={job.job_id} job={job} />)}
      </div>
    </div>
  );
}
