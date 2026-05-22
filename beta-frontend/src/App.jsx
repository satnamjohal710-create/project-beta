import React, { useState } from 'react';

function App() {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
  const [step, setStep] = useState('intake');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', location: '', language: 'English', goal: 'Cloud Engineering'
  });

  const handleIntakeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          location: formData.location,
          languages: [formData.language],
          careerGoals: [formData.goal]
        })
      });
      const data = await response.json();
      if (response.ok) {
        setProfile(data);
        setStep('dashboard');
      } else {
        alert(data.error || "Intake registration failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error linking to the backend cloud services.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to make dates look professional
  const formatMeetingTime = (isoString) => {
    if (!isoString) return "Scheduling...";
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col items-center justify-center">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-sky-400 tracking-tight">Nexus Career Services</h1>
        <p className="text-slate-400 mt-2 text-lg">End-to-End Cloud Virtual Advisory Platform</p>
      </header>

      {step === 'intake' ? (
        <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-slate-700">
          <h2 className="text-2xl font-bold mb-6 text-slate-200">Candidate Onboarding Portal</h2>
          <form onSubmit={handleIntakeSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Full Name</label>
              <input type="text" className="w-full p-3 bg-slate-700 rounded-xl border border-slate-600 focus:outline-none focus:border-sky-500 transition" placeholder="Satnam Singh" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Email Address</label>
              <input type="email" className="w-full p-3 bg-slate-700 rounded-xl border border-slate-600 focus:outline-none focus:border-sky-500 transition" placeholder="satnam@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">Geographic Location</label>
              <input type="text" className="w-full p-3 bg-slate-700 rounded-xl border border-slate-600 focus:outline-none focus:border-sky-500 transition" placeholder="e.g. Brampton, ON" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Primary Language</label>
                <select className="w-full p-3 bg-slate-700 rounded-xl border border-slate-600 focus:outline-none focus:border-sky-500" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                  <option>English</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-300">Target Track</label>
                <select className="w-full p-3 bg-slate-700 rounded-xl border border-slate-600 focus:outline-none focus:border-sky-500" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})}>
                  <option>Cloud Engineering</option>
                  <option>Cybersecurity</option>
                  <option>IT Support Systems</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 font-bold rounded-xl transition duration-200 mt-4 shadow-lg shadow-sky-600/20">
              {loading ? "Routing Profile Match..." : "Initialize Match Routing"}
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT PANEL: WELCOME & MATCH DETAILS */}
          <div className="md:col-span-2 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl space-y-6">
            <div>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Account Verified</span>
              <h2 className="text-3xl font-extrabold text-white mt-3 mb-1">Welcome, {profile?.user?.name}!</h2>
              <p className="text-slate-400 text-sm">Your cloud onboarding sequence has initiated successfully.</p>
            </div>
            
            <div className="p-6 bg-slate-700/40 rounded-xl border border-slate-600">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assigned Strategic Advisor</span>
              <h3 className="text-xl font-bold text-sky-300 mt-1">
                {profile?.matchedAdvisor ? profile.matchedAdvisor.name : "Analyzing match parameters..."}
              </h3>
              <p className="text-sm text-slate-400 mt-0.5">Track Focus: {formData.goal}</p>
              {profile?.matchedAdvisor && (
                <p className="text-xs text-slate-500 mt-2">Contact: {profile.matchedAdvisor.email}</p>
              )}
            </div>

            {/* NEW: DYNAMIC APPOINTMENT CARD */}
            {profile?.appointment ? (
              <div className="p-6 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Confirmed Session</span>
                <h4 className="text-lg font-bold text-slate-100 mt-2">Initial Strategy Briefing</h4>
                <p className="text-sm text-slate-300 mt-1">
                  📅 {formatMeetingTime(profile.appointment.scheduled_time)}
                </p>
                <div className="mt-4 flex gap-3">
                  <a href="https://teams.microsoft.com" target="_blank" rel="noreferrer" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-xs font-bold rounded-lg transition shadow-md shadow-sky-600/10">
                    Join Teams Meeting
                  </a>
                  <span className="text-xs text-slate-500 flex items-center">Status: {profile.appointment.status}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-amber-950/20 border border-amber-500/20 rounded-xl text-amber-300 text-sm">
                ⚠️ Advisor match unavailable for selected filters. Meeting scheduling suspended.
              </div>
            )}
          </div>
          
          {/* RIGHT PANEL: MILESTONE PROGRESS */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-200 mb-4">Milestone Progress</h3>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex items-center gap-3 text-emerald-400">
                  <span className="bg-emerald-500/20 p-1 rounded-full text-xs">✔</span> Intake Profile Registered
                </li>
                <li className="flex items-center gap-3 text-emerald-400">
                  <span className="bg-emerald-500/20 p-1 rounded-full text-xs">✔</span> Advisor Match Assigned
                </li>
                <li className="flex items-center gap-3 text-sky-400">
                  <span className="bg-sky-500/20 p-1 px-2 rounded-full text-xs animate-pulse">⏳</span> {profile?.appointment ? "Briefing Scheduled" : "Pending Requirements"}
                </li>
              </ul>
            </div>
            <button onClick={() => setStep('intake')} className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 font-semibold rounded-xl text-xs tracking-wide transition mt-6">
              Reset Session
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;