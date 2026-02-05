
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  ChevronRight, 
  ArrowLeft, 
  Phone, 
  AlertCircle, 
  FileText, 
  Users, 
  Info,
  CheckCircle2,
  Lock,
  ExternalLink,
  Search,
  BookOpen,
  Scale,
  Sparkles,
  Share2,
  Navigation,
  ArrowUpRight,
  Loader2,
  CheckSquare,
  Square,
  HeartHandshake,
  Landmark,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { IncidentCategory, AppState, IncidentPath } from './types';
import { INCIDENT_PATHS } from './data/incidents';
import { geminiService } from './services/gemini';

// --- Reusable UI Components ---

const Header = ({ onHome }: { onHome: () => void }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">

    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={onHome}>
      <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
        <Shield className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">Naya Sahai</h1>
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Victim Navigation</span>
      </div>
    </div>
    <div className="hidden sm:flex items-center gap-3">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">Beta 1.0</span>
    </div>
  </header>
);

const SectionTitle = ({ children, subtitle }: { children?: React.ReactNode, subtitle?: string }) => (
  <div className="mb-6 animate-in">
    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
      {children}
    </h2>
    {subtitle && <p className="text-slate-500 text-sm mt-1 leading-relaxed font-medium">{subtitle}</p>}
  </div>
);

const NextStepsEngine = ({ steps }: { steps: string[] }) => {
  const [completed, setCompleted] = useState<boolean[]>(new Array(steps.length).fill(false));

  const toggle = (idx: number) => {
    const next = [...completed];
    next[idx] = !next[idx];
    setCompleted(next);
  };

  return (
    <div className="bg-white border-2 border-indigo-200 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(79,70,229,0.15)] overflow-hidden relative border-l-[12px] border-l-indigo-600 animate-in">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Navigation className="w-24 h-24 text-indigo-600 rotate-12" />
      </div>
      <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-100 p-2 rounded-xl">
              <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-indigo-900 font-black text-xl tracking-tight">
            Immediate Next 3 Steps
          </h3>
      </div>
      <div className="space-y-8">
        {steps.slice(0, 3).map((step, idx) => (
          <button 
            key={idx} 
            onClick={() => toggle(idx)}
            className="flex gap-6 relative z-10 group text-left w-full items-start"
          >
            <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 shadow-lg ${completed[idx] ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-100 group-hover:scale-110'}`}>
              {completed[idx] ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-black text-lg">{idx + 1}</span>}
            </div>
            <div className="pt-2">
              <p className={`font-extrabold text-lg leading-tight transition-all duration-300 ${completed[idx] ? 'text-slate-400 line-through' : 'text-slate-800 group-hover:text-indigo-600'}`}>{step}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('HOME');
  const [selectedIncident, setSelectedIncident] = useState<IncidentPath | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [dynamicSummary, setDynamicSummary] = useState<{ summary: string, steps: string[] } | null>(null);

  const filteredIncidents = useMemo(() => {
    return INCIDENT_PATHS.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleIncidentSelect = (path: IncidentPath) => {
    setSelectedIncident(path);
    setDynamicSummary(null);
    setCurrentScreen('ACTION_DASHBOARD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generateAIGuidance = async () => {
    if (!selectedIncident) return;
    setIsAiLoading(true);
    const result = await geminiService.getNextSteps(`${selectedIncident.title}: ${selectedIncident.summary}`);
    setDynamicSummary(result);
    setIsAiLoading(false);
  };

  useEffect(() => {
    if (selectedIncident && !dynamicSummary && currentScreen === 'ACTION_DASHBOARD') {
      generateAIGuidance();
    }
  }, [selectedIncident, currentScreen]);

  const renderHome = () => (
    <div className="p-6 max-w-2xl mx-auto pb-32 animate-in">
      <div className="mt-8 mb-10">
        <h2 className="text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tighter">
          Naya Sahai <br/><span className="gradient-text">Victim OS.</span>
        </h2>
        <p className="text-slate-500 mt-6 text-xl leading-relaxed font-semibold max-w-md">
          Trusted navigation when things go wrong. No jargon. Only official paths.
        </p>
      </div>

      <div className="relative mb-14 group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="text-slate-400 w-6 h-6 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="What went wrong? (e.g. UPI fraud)"
          className="w-full bg-white border-4 border-slate-200 rounded-[2rem] py-6 pl-16 pr-8 shadow-2xl focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500/50 focus:outline-none text-xl font-bold transition-all placeholder:text-slate-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <SectionTitle subtitle="Official routing for crime and disputes">Select Incident Category</SectionTitle>
      
      <div className="grid gap-6">
        {filteredIncidents.map(path => (
          <button 
            key={path.id}
            onClick={() => handleIncidentSelect(path)}
            className="flex items-center justify-between p-8
bg-white
border-4 border-slate-300
rounded-3xl
text-left
shadow-lg shadow-slate-300/40
hover:shadow-2xl hover:shadow-indigo-200/40
hover:border-indigo-500
hover:-translate-y-1
transition-all duration-300
group relative"
          >
            <div className="flex-1 pr-6 relative z-10">
              <span className={`inline-flex items-center px-3 py-1 text-[11px] font-black rounded-full mb-4 uppercase tracking-widest border-2 ${path.category === IncidentCategory.FINANCIAL_FRAUD ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                {path.category}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors leading-tight">{path.title}</h3>
              <p className="text-slate-500 text-base font-bold line-clamp-2 leading-relaxed opacity-90">{path.summary}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300 relative z-10 shadow-md">
              <ChevronRight className="w-6 h-6" />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mt-14">
        <button 
          onClick={() => setCurrentScreen('RIGHTS')}
          className="p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-xl hover:bg-indigo-50 group transition-all border-b-8 border-b-indigo-500"
        >
          <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-indigo-200">
            <BookOpen className="w-8 h-8" />
          </div>
          <span className="font-black text-slate-900 text-base tracking-tight">Citizen Rights</span>
        </button>
        <button className="p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-xl hover:bg-rose-50 group transition-all border-b-8 border-b-rose-500">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-rose-200">
            <Phone className="w-8 h-8" />
          </div>
          <span className="font-black text-slate-900 text-base tracking-tight">Emergencies</span>
        </button>
      </div>
    </div>
  );

  const renderChecklist = () => {
    if (!selectedIncident) return null;
    return (
      <div className="p-6 max-w-2xl mx-auto pb-40 animate-in">
        <button onClick={() => setCurrentScreen('ACTION_DASHBOARD')} className="mb-8 flex items-center gap-3 text-indigo-700 font-black text-sm bg-white px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors border-2 border-slate-200 shadow-lg">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        <SectionTitle subtitle="Prepare these items before visiting any official or police station">Walk-in Prepared Checklist</SectionTitle>
        <div className="space-y-4">
          {selectedIncident.preparedChecklist.map((item, i) => (
            <div key={i} className="flex gap-6 p-8 bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-xl items-center border-l-[12px] border-l-slate-800">
              <div className="bg-slate-100 p-3 rounded-2xl">
                <CheckSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="font-black text-slate-800 text-lg leading-tight">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl">
          <div className="flex gap-6 items-start">
             <div className="bg-white/20 p-4 rounded-2xl">
                <Info className="w-8 h-8" />
             </div>
             <div>
                <h4 className="font-black text-xl mb-2">Pro Tip: Always get Acknowledgment</h4>
                <p className="font-bold opacity-80 leading-relaxed">Ensure you receive a stamped copy or a CSR (Complaint Status Report) after submitting your documents.</p>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrust = () => (
    <div className="p-6 max-w-2xl mx-auto pb-40 animate-in">
      <SectionTitle subtitle="The foundation of our architecture">Our Principles of Trust</SectionTitle>
      <div className="space-y-8">
        {[
          { icon: <Lock />, title: "Zero Data Selling", desc: "We do not store or sell your personal information. Your privacy is non-negotiable." },
          { icon: <Users />, title: "Zero Middlemen", desc: "Naya Sahai connects you directly to government authorities. No agent fees, no lawyer traps." },
          { icon: <Scale />, title: "Unbiased Guidance", desc: "Our navigation is based strictly on Indian law and official protocols, not sponsored content." },
          { icon: <Shield />, title: "Infrastructure-Level", desc: "Built as a public utility to become the starting point for every victim in India." }
        ].map((item, i) => (
          <div key={i} className="flex gap-8 p-10 bg-white border-2 border-slate-200 rounded-[3rem] shadow-2xl hover:border-indigo-500 transition-colors group">
             <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                {React.cloneElement(item.icon as React.ReactElement, { size: 36 })}
             </div>
             <div>
                <h4 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-500 font-bold leading-relaxed text-lg">{item.desc}</p>
             </div>
          </div>
        ))}
        <div className="mt-10 p-10 border-4 border-dashed border-slate-300 rounded-[3rem] text-center">
           <HeartHandshake className="w-16 h-16 text-slate-300 mx-auto mb-6" />
           <p className="text-slate-400 font-black text-xl">Supported by Citizen Rights Activists</p>
        </div>
      </div>
    </div>
  );

  const renderActionDashboard = () => {
    if (!selectedIncident) return null;

    return (
      <div className="pb-40 bg-slate-50 min-h-screen animate-in">
  <div className="bg-white border-b border-slate-200 p-5 flex items-center gap-5 sticky top-[65px] z-40 shadow-sm ">
    <button
      onClick={() => setCurrentScreen('HOME')}
      className="w-12 h-12 flex items-center justify-center bg-white rounded-full border-2 border-slate-300 shadow-md hover:bg-slate-50 transition-colors"
    >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex-1 overflow-hidden">
            <h2 className="font-black text-slate-900 truncate tracking-tighter text-xl">{selectedIncident.title}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-black uppercase tracking-widest leading-none px-2 py-0.5 rounded border-2 ${selectedIncident.category === IncidentCategory.FINANCIAL_FRAUD ? 'text-indigo-600 border-indigo-100 bg-indigo-50' : 'text-emerald-600 border-emerald-100 bg-emerald-50'}`}>
                {selectedIncident.category}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-2xl mx-auto space-y-10">
          {/* Situation Analysis Summary Card - More Compact */}
          <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 p-6">
              <Sparkles className={`w-8 h-8 transition-all duration-1000 ${isAiLoading ? 'text-indigo-600 animate-pulse scale-110' : 'text-indigo-400/30'}`} />
            </div>
            {isAiLoading ? (
              <div className="flex flex-col items-center text-center space-y-4">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-slate-500 font-bold text-sm">Analyzing situation protocols...</p>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-widest border-2 border-indigo-200 mb-4 inline-block">Analysis</span>
                <p className="text-xl font-black text-slate-800 leading-tight tracking-tight italic">
                  "{dynamicSummary?.summary || selectedIncident.summary}"
                </p>
              </div>
            )}
          </div>

          <NextStepsEngine steps={dynamicSummary?.steps || selectedIncident.immediateActions.map(a => a.title)} />

          <section>
            <SectionTitle subtitle="Immediate defensive measures">Protection Protocol</SectionTitle>
            <div className="grid gap-4">
              {selectedIncident.protectionProtocol ? (
                selectedIncident.protectionProtocol.map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white border-2 border-slate-200 rounded-[2rem] shadow-xl items-center border-l-8 border-l-emerald-500">
                    <div className="bg-emerald-50 p-2 rounded-xl">
                      <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="font-black text-slate-800 text-lg leading-tight">{item}</p>
                  </div>
                ))
              ) : (
                selectedIncident.immediateActions.map(action => (
                  <div key={action.id} className={`p-8 rounded-[2.5rem] border-4 transition-all shadow-xl ${action.isEmergency ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex gap-6">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center flex-shrink-0 border-4 ${action.isEmergency ? 'bg-red-600 text-white border-red-400 shadow-lg' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                        {action.isEmergency ? <AlertCircle className="w-8 h-8" /> : <Phone className="w-7 h-7" />}
                      </div>
                      <div className="flex-1 pt-1.5">
                        <h4 className={`font-black text-xl tracking-tight ${action.isEmergency ? 'text-red-900' : 'text-slate-900'}`}>{action.title}</h4>
                        <p className={`mt-2 text-base font-bold leading-relaxed ${action.isEmergency ? 'text-red-800/80' : 'text-slate-500'}`}>{action.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="space-y-6">
            <SectionTitle subtitle="Direct routing for reporting">Official Portal</SectionTitle>
            <div className="grid gap-6">
              {[selectedIncident.officialPortal, ...(selectedIncident.additionalPortals || [])].map((portal, idx) => (
                <div key={idx} className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden border-4 border-slate-800">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter mb-1">{portal.name}</h3>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Authorized Routing</p>
                    </div>
                    <ArrowUpRight className="w-6 h-6 opacity-40" />
                  </div>
                  <p className="text-slate-400 text-base leading-relaxed mb-8 font-bold">
                    {portal.description}
                  </p>
                  <a 
                    href={portal.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-4 w-full bg-white text-slate-900 py-5 rounded-[1.5rem] font-black text-lg hover:shadow-2xl transition-all border-b-8 border-slate-300"
                  >
                    Go to {portal.name}
                    <ExternalLink className="w-5 h-5 opacity-60" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {selectedIncident.sectorOptions && (
            <section>
              <SectionTitle subtitle="Sector-specific options">Industry Regulators</SectionTitle>
              <div className="grid gap-6">
                {selectedIncident.sectorOptions.map((opt) => (
                  <div key={opt.id} className="p-8 bg-indigo-50 border-2 border-indigo-200 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 opacity-5">
                       <Landmark className="w-24 h-24 text-indigo-600" />
                    </div>
                    <h4 className="font-black text-indigo-900 text-xl mb-2 flex items-center gap-2">
                       {opt.title}
                    </h4>
                    <p className="text-slate-600 font-bold mb-6 leading-relaxed">{opt.description}</p>
                    {opt.link && (
                      <a 
                        href={opt.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 font-black text-indigo-600 bg-white px-6 py-3 rounded-xl border-2 border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-md"
                      >
                        {opt.linkText || 'Open Portal'} <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-6">
              <SectionTitle subtitle="If your report is ignored">Escalation Ladder</SectionTitle>
              <button 
                onClick={() => setCurrentScreen('CHECKLIST')}
                className="flex items-center gap-2 text-indigo-600 font-black text-sm hover:underline"
              >
                Prep Checklist <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid gap-6">
              {selectedIncident.escalationLadder.map((esc, idx) => (
                <div key={idx} className="flex flex-col gap-4 p-8 bg-white rounded-[2.5rem] border-2 border-slate-200 text-slate-900 group shadow-xl border-l-[12px] border-l-slate-800">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-900 border-2 border-slate-200">
                      {esc.level}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-xl text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{esc.authority}</h4>
                      <p className="text-sm text-slate-500 mt-1.5 font-bold leading-tight">{esc.condition}</p>
                    </div>
                  </div>
                  {esc.link && (
                    <a 
                      href={esc.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-indigo-50 text-indigo-700 font-black text-sm border-2 border-indigo-100 hover:bg-indigo-100 transition-colors"
                    >
                      {esc.linkText || 'Open Escalation Portal'}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="bg-amber-50 border-4 border-amber-300 p-10 rounded-[3rem] flex gap-8 items-start shadow-2xl border-l-[16px] border-l-amber-500">
            <div className="bg-amber-500 p-4 rounded-2xl flex-shrink-0">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="font-black text-amber-900 uppercase tracking-widest text-[10px] mb-3">Safety Warning</h4>
              <p className="text-amber-900 text-lg font-black leading-tight tracking-tight">
                {selectedIncident.secondaryExploitationWarning}
              </p>
            </div>
          </div>
        </div>

        <div className="fixed bottom-28 right-8 flex flex-col gap-4 z-50">
          <button 
            onClick={() => window.open(`https://wa.me/?text=I found a clear official guide for ${selectedIncident.title} on Naya Sahai. Share this to help others: https://nayasahai.app`, '_blank')}
            className="w-16 h-16 bg-[#25D366] text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border-4 border-white"
          >
            <Share2 className="w-8 h-8" />
          </button>
        </div>
      </div>
    );
  };

  const renderRights = () => (
    <div className="p-6 max-w-2xl mx-auto pb-40 animate-in">
      <button onClick={() => setCurrentScreen('HOME')} className="mb-10 flex items-center gap-3 text-indigo-700 font-black text-sm bg-white px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors border-2 border-slate-200 shadow-lg">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>
      <SectionTitle subtitle="Official protections you must know when dealing with authorities">Citizen Rights</SectionTitle>
      <div className="grid gap-8">
        {[
          { title: 'Right to FIR', desc: 'Police cannot refuse to register an FIR for serious (cognizable) crimes. If they do, write to the SP or Magistrate.', color: 'indigo' },
          { title: 'Zero FIR', desc: 'A Zero FIR can be registered at any police station regardless of jurisdiction. They must transfer it later.', color: 'emerald' },
          { title: 'Women\'s Arrest Rights', desc: 'A woman cannot be arrested after sunset and before sunrise, except in exceptional circumstances by a female officer.', color: 'rose' },
          { title: 'Free Legal Aid', desc: 'Article 39A ensures free legal aid for the poor. You have a right to a lawyer provided by the state if you cannot afford one.', color: 'amber' }
        ].map((r, i) => (
          <div key={i} className={`bg-white border-2 p-10 rounded-[3rem] shadow-2xl border-slate-200 border-b-8 border-b-slate-100`}>
            <h4 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-4">
              <div className={`w-4 h-10 rounded-full bg-indigo-500 shadow-lg`} />
              {r.title}
            </h4>
            <p className="text-slate-600 font-extrabold leading-relaxed text-lg">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 flex flex-col antialiased">
      <Header onHome={() => setCurrentScreen('HOME')} />
      <main className="flex-1">
        {currentScreen === 'HOME' && renderHome()}
        {currentScreen === 'ACTION_DASHBOARD' && renderActionDashboard()}
        {currentScreen === 'RIGHTS' && renderRights()}
        {currentScreen === 'CHECKLIST' && renderChecklist()}
        {currentScreen === 'ABOUT' && renderTrust()}
      </main>

    <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around py-5 px-8 z-50 shadow-lg">

        <button 
          onClick={() => setCurrentScreen('HOME')}
          className={`flex flex-col items-center gap-2 transition-all duration-300 ${currentScreen === 'HOME' ? 'text-indigo-600 scale-110 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-3 rounded-2xl transition-all border-2 ${currentScreen === 'HOME' ? 'bg-indigo-100 border-indigo-300 shadow-lg' : 'border-transparent'}`}>
            <Navigation className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">Navigator</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('RIGHTS')}
          className={`flex flex-col items-center gap-2 transition-all duration-300 ${currentScreen === 'RIGHTS' ? 'text-indigo-600 scale-110 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-3 rounded-2xl transition-all border-2 ${currentScreen === 'RIGHTS' ? 'bg-indigo-100 border-indigo-300 shadow-lg' : 'border-transparent'}`}>
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">Rights</span>
        </button>
        <button 
          onClick={() => setCurrentScreen('ABOUT')}
          className={`flex flex-col items-center gap-2 transition-all duration-300 ${currentScreen === 'ABOUT' ? 'text-indigo-600 scale-110 font-black' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-3 rounded-2xl transition-all border-2 ${currentScreen === 'ABOUT' ? 'bg-indigo-100 border-indigo-300 shadow-lg' : 'border-transparent'}`}>
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">Trust</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
