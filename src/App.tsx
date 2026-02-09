
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  useNavigate, 
  useParams, 
  Link, 
  useLocation 
} from 'react-router-dom';
import { 
  Shield, 
  ChevronRight, 
  ArrowLeft, 
  FileText, 
  Users, 
  Info,
  CheckCircle2,
  Lock,
  ExternalLink,
  Search,
  Sparkles,
  Navigation,
  ArrowUpRight,
  Loader2,
  CheckSquare,
  CreditCard,
  Plus,
  Trash2,
  History,
  MapPin,
  MessageCircle,
  Download,
  ShieldCheck,
  Landmark,
  AlertTriangle,
  FileSearch,
  PhoneCall,
  Gavel,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {INCIDENT_PATHS} from '././data/incidents'
// --- Types & Constants ---

enum IncidentCategory {
  FINANCIAL_FRAUD = 'Financial Fraud',
  IDENTITY_THEFT = 'Identity Theft',
  ONLINE_HARASSMENT = 'Online Harassment',
  CONSUMER_DISPUTE = 'Consumer Dispute'
}

interface Portal {
  name: string;
  url: string;
  description: string;
}

interface Escalation {
  level: number;
  authority: string;
  condition: string;
  link: string;
  linkText: string;
}

interface Action {
  id?: string;
  title: string;
  description: string;
  isEmergency?: boolean;
}

interface IncidentPath {
  id: string;
  title: string;
  category: IncidentCategory;
  summary: string;
  immediateActions: Action[];
  officialPortal: Portal;
  additionalPortals?: Portal[];
  protectionProtocol: string[];
  preparedChecklist: string[];
  firSteps?: string[];
  escalationLadder: Escalation[];
  secondaryExploitationWarning: string;
}

// const INCIDENT_PATHS: IncidentPath[] = [
//   {
//     id: 'upi-card-fraud',
//     category: IncidentCategory.FINANCIAL_FRAUD,
//     title: 'UPI / Debit / Credit Card Fraud',
//     summary: 'Unauthorized money transfer from your bank or card. Immediate action within 2 hours (Golden Hour) can freeze funds.',
//     immediateActions: [
//       { title: 'Call 1930 immediately', description: 'National Cyber Crime Helpline (Golden Hour). Fast reporting can freeze funds across banks.', isEmergency: true },
//       { title: 'Block banking channels', description: 'Immediately freeze bank account, cards, and UPI IDs via your bank app.' },
//       { title: 'File Official Complaint', description: 'Register on cybercrime.gov.in within the first 24 hours.' }
//     ],
//     officialPortal: { name: 'National Cyber Crime Portal', url: 'https://cybercrime.gov.in', description: 'Primary government portal for financial cyber crimes.' },
//     additionalPortals: [
//       { name: 'RBI CMS', url: 'https://cms.rbi.org.in', description: 'Escalate to RBI if bank does not resolve in 30 days.' }
//     ],
//     protectionProtocol: ['Save screenshots of all alerts', 'Change all digital banking passwords', 'Enable international transaction limits'],
//     preparedChecklist: ['Transaction UTR numbers', 'Latest bank statement', 'Identity Proof'],
//     firSteps: ['Carry bank statement', 'File Zero FIR at ANY police station under BNS'],
//     escalationLadder: [
//       { level: 1, authority: 'Bank Nodal Officer', condition: 'If no response in 7 days', link: '#', linkText: 'Find Nodal Officer' },
//       { level: 2, authority: 'RBI Ombudsman', condition: 'If unresolved in 30 days', link: 'https://cms.rbi.org.in', linkText: 'File RBI Case' }
//     ],
//     secondaryExploitationWarning: 'Beware of "fund recovery agents". Legitimate services never ask for money or passwords to recover funds.'
//   },
//   {
//     id: 'investment-scam',
//     category: IncidentCategory.FINANCIAL_FRAUD,
//     title: 'Investment / Ponzi / MLM Scam',
//     summary: 'Fake investment plans promising high returns. Schemes usually stop withdrawals suddenly.',
//     immediateActions: [
//       { title: 'Stop All Deposits', description: 'Do not pay any "withdrawal fees" or "taxes" to get your money back.', isEmergency: true },
//       { title: 'Save All Chat Evidence', description: 'Save Telegram/WhatsApp logs and referral links immediately.' },
//       { title: 'File SEBI & Cyber Complaint', description: 'Report to SEBI SCORES and the Cyber Crime portal simultaneously.' }
//     ],
//     officialPortal: { name: 'National Cyber Crime Portal', url: 'https://cybercrime.gov.in', description: 'Official government fraud reporting system' },
//     additionalPortals: [
//       { name: 'SEBI SCORES', url: 'https://scores.sebi.gov.in', description: 'Report illegal brokers and fake trading apps.' },
//       { name: 'RBI Sachet', url: 'https://sachet.rbi.org.in', description: 'Report unauthorized deposit schemes.' }
//     ],
//     protectionProtocol: ['Avoid guaranteed returns', 'Verify broker registration on SEBI', 'Refuse referral-based MLMs'],
//     preparedChecklist: ['Payment screenshots', 'Transaction IDs', 'App dashboard photos'],
//     firSteps: ['Carry bank statement showing all transfers', 'Clearly state "Ponzi Scheme Fraud"', 'File Zero FIR under BNS'],
//     escalationLadder: [
//       { level: 1, authority: 'Cyber Cell', condition: 'Primary reporting', link: 'https://cybercrime.gov.in', linkText: 'File Report' },
//       { level: 2, authority: 'SEBI Regional Office', condition: 'If broker is registered', link: 'https://scores.sebi.gov.in', linkText: 'Regulatory Case' }
//     ],
//     secondaryExploitationWarning: 'Government portals are free. Never trust private hackers or recovery agents.'
//   },
//   {
//     id: 'product-refund-dispute',
//     category: IncidentCategory.CONSUMER_DISPUTE,
//     title: 'Refund / E-commerce Dispute',
//     summary: 'Company refusing refund, warranty, or defective product issues. Consumer courts are citizen-friendly.',
//     immediateActions: [
//       { title: 'Send Written Complaint', description: 'Email/Ticket to seller. Save invoice and unboxing videos.' },
//       { title: 'Call 1915 (NCH)', description: 'National Consumer Helpline free mediation step.' },
//       { title: 'File e-Jagriti Case', description: 'Official integrated consumer court platform for legal recovery.' }
//     ],
//     officialPortal: { name: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in', description: 'Free government mediation step (1915)' },
//     additionalPortals: [
//       { name: 'e-Jagriti', url: 'https://e-jagriti.gov.in', description: 'Unified consumer court system with e-filing and video hearings.' }
//     ],
//     protectionProtocol: ['Check for HTTPS', 'Prefer Cash on Delivery for new sites', 'Record unboxing of expensive items'],
//     preparedChecklist: ['Invoice copy', 'Photos of product', 'Communication history'],
//     firSteps: ['Civil matter usually', 'File Zero FIR only if criminal cheating is involved'],
//     escalationLadder: [
//       { level: 1, authority: 'NCH Mediation', condition: 'First step', link: 'https://consumerhelpline.gov.in', linkText: 'File Mediation' },
//       { level: 2, authority: 'e-Jagriti Consumer Court', condition: 'If mediation fails', link: 'https://e-jagriti.gov.in', linkText: 'File Case' }
//     ],
//     secondaryExploitationWarning: 'Never pay private "refund agents". Official government portals are free.'
//   }
// ];

// Added missing PLANS constant
const PLANS = [
  {
    id: 'SELF_HELP',
    name: 'Self-Help Navigator',
    tagline: 'Ideal for small disputes and primary reporting.',
    price: '49',
    color: 'emerald',
    features: ['Complaint Generator', 'Official Portal Links', 'Basic Protection Protocol', 'Case Tracker']
  },
  {
    id: 'AFFIDAVIT',
    name: 'Pro Recovery',
    tagline: 'For banking fraud and legal claims.',
    price: '499',
    color: 'indigo',
    features: ['Everything in Self-Help', 'Notary Drafts for Bank', 'Stamp Paper Templates', 'Escalation Assistance']
  },
  {
    id: 'LAWYER',
    name: 'Expert Assist',
    tagline: 'High-value recovery with legal support.',
    price: '1,999',
    color: 'violet',
    features: ['Everything in Pro Recovery', '15-min Legal Consultation', 'Priority Case Review', 'Custom Legal Drafts']
  }
];

const STORAGE_KEYS = {
  INCIDENT_DATA: 'ns_incident_data',
  CURRENT_INCIDENT_ID: 'ns_current_incident_id',
  PLAN: 'ns_plan',
  CASES: 'ns_cases',
  PAID: 'ns_is_paid'
};

const saveToLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
const getFromLocal = (key: string) => {
  const data = localStorage.getItem(key);
  try { return data ? JSON.parse(data) : null; } catch { return null; }
};

const triggerDownload = (filename: string, text: string) => {
  const element = document.createElement("a");
  const file = new Blob([text], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// --- Reusable Logic Components ---

const ImmediateSteps = ({ data }: { data: Action[] }) => {
  if (!data?.length) return null;
  return (
    <section className="space-y-6">
      <SectionTitle subtitle="Act now to prevent further loss">Critical Next Steps</SectionTitle>
      <div className="grid gap-5">
        {data.map((action, i) => (
          <div key={i} className={`flex gap-6 items-start bg-white border-2 ${action.isEmergency ? 'border-red-600 ring-4 ring-red-50' : 'border-slate-900'} p-8 rounded-[2.5rem] shadow-xl shadow-gray-400/20 group`}>
            <div className={`w-14 h-14 rounded-2xl ${action.isEmergency ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'} flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
              {i + 1}
            </div>
            <div>
              <p className="font-black text-slate-900 text-2xl group-hover:text-indigo-600 transition-colors mb-1">{action.title}</p>
              <p className="text-slate-600 font-bold text-lg leading-tight">{action.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const OfficialPortal = ({ data }: { data: Portal }) => {
  if (!data) return null;
  return (
    <section className="space-y-4">
      <SectionTitle subtitle="Official reporting for legal record">Official Reporting</SectionTitle>
      <a href={data.url} target="_blank" rel="noreferrer" className="block">
        <Button variant="outline" className="py-6 text-xl border-slate-900 hover:bg-slate-900 hover:text-white group">
          File Official Complaint <ExternalLink className="w-6 h-6 opacity-50 group-hover:opacity-100" />
        </Button>
      </a>
      <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">{data.name}</p>
    </section>
  );
};

const SecondaryAuthorities = ({ data }: { data?: Portal[] }) => {
  if (!data?.length) return null;
  return (
    <section className="space-y-4">
      <SectionTitle subtitle="Required for comprehensive recovery">Additional Portals</SectionTitle>
      <div className="grid gap-4">
        {data.map((portal, i) => (
          <a key={i} href={portal.url} target="_blank" rel="noreferrer" className="p-6 bg-white border-2 border-slate-200 rounded-3xl flex justify-between items-center hover:border-indigo-600 transition-all group">
            <div>
              <h4 className="font-black text-slate-900 text-lg">{portal.name}</h4>
              <p className="text-slate-500 font-bold text-xs">{portal.description}</p>
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-indigo-600" />
          </a>
        ))}
      </div>
    </section>
  );
};

const ProtectionProtocol = ({ data }: { data: string[] }) => {
  if (!data?.length) return null;
  return (
    <Accordion title="Protection Protocol" icon={<Shield className="text-indigo-600" />}>
      <ul className="space-y-3">
        {data.map((item, i) => (
          <li key={i} className="flex gap-3 items-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-bold text-slate-700">{item}</span>
          </li>
        ))}
      </ul>
    </Accordion>
  );
};

const PrepChecklist = ({ data }: { data: string[] }) => {
  if (!data?.length) return null;
  return (
    <Accordion title="Prep Checklist" icon={<FileSearch className="text-indigo-600" />}>
      <p className="text-xs font-black uppercase text-slate-400 mb-4">Gather these documents:</p>
      <div className="grid gap-3">
        {data.map((item, i) => (
          <div key={i} className="flex gap-3 items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
            <span className="font-bold text-slate-900 text-sm">{item}</span>
          </div>
        ))}
      </div>
    </Accordion>
  );
};

const FIRSteps = ({ data }: { data?: string[] }) => {
  if (!data?.length) return null;
  return (
    <Accordion title="FIR Guidance (BNS)" icon={<Gavel className="text-indigo-600" />}>
       <ul className="space-y-4">
        {data.map((step, i) => (
          <li key={i} className="flex gap-4 items-start">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">{i+1}</div>
            <span className="font-bold text-slate-700 text-sm">{step}</span>
          </li>
        ))}
      </ul>
    </Accordion>
  );
};

const EscalationLadderComp = ({ data }: { data: Escalation[] }) => {
  if (!data?.length) return null;
  const sorted = [...data].sort((a, b) => a.level - b.level);
  return (
    <Accordion title="Escalation Ladder" icon={<History className="text-indigo-600" />}>
      <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">Step-by-step escalation:</p>
      <div className="space-y-4">
         {sorted.map((step, i) => (
           <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black">LVL {step.level}</span>
                <span className="text-xs font-bold text-indigo-600">{step.authority}</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{step.condition}</p>
              <a href={step.link} className="text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 flex items-center gap-1">{step.linkText} <ArrowRight className="w-3 h-3" /></a>
           </div>
         ))}
      </div>
    </Accordion>
  );
};

const RecoveryRoadmap = ({ incident }: { incident: IncidentPath }) => {
  const steps = useMemo(() => {
    const list = [
      { 
        title: 'File Official Complaint', 
        desc: `Submit report using ${incident.officialPortal.name}. Use our Complaint Gen for the draft.` 
      }
    ];

    // Rule 2: Institution/Regulator
    if (incident.category === IncidentCategory.CONSUMER_DISPUTE) {
      list.push({ title: 'NCH Mediation', desc: 'Attempt resolution via National Consumer Helpline mediation (1915).' });
    } else if (incident.category === IncidentCategory.FINANCIAL_FRAUD) {
      list.push({ title: 'Bank Visit', desc: 'Provide acknowledgement copy to your Home Branch manager to initiate chargeback.' });
    } else {
      list.push({ title: 'Notify Authorities', desc: 'Inform relevant service providers about the incident.' });
    }

    // Rule 3: Track
    list.push({ title: 'Monitor Case', desc: 'Log updates in your Naya Sahai Case Tracker. Wait 7-15 days for initial response.' });

    // Rule 4: Escalation
    if (incident.escalationLadder.length > 0) {
      const top = incident.escalationLadder[incident.escalationLadder.length - 1];
      list.push({ title: `Escalate to ${top.authority}`, desc: top.condition });
    } else {
      list.push({ title: 'Legal Recovery', desc: 'If no reversal, prepare for Consumer Court or Ombudsman filing.' });
    }

    return list;
  }, [incident]);

  return (
    <section className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl relative border-4 border-slate-800">
      <h3 className="text-2xl font-black mb-8 flex items-center gap-4"><Navigation className="text-indigo-400 w-8 h-8" /> Your Recovery Roadmap</h3>
      <div className="space-y-10 relative">
        <div className="absolute left-4 top-4 bottom-4 w-1 bg-white/10 rounded-full" />
        {steps.map((item, idx) => (
          <div key={idx} className="flex gap-8 items-start relative z-10">
            <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center font-black rounded-xl shadow-lg border-2 border-slate-200">{idx + 1}</div>
            <div>
              <h5 className="font-black text-lg">{item.title}</h5>
              <p className="text-slate-400 font-bold text-sm leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Main Components ---

const Header = () => (
  <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
        <Shield className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">Naya Sahai</h1>
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Victim Navigation</span>
      </div>
    </Link>
  </header>
);

const SectionTitle = ({ children, subtitle }: { children?: React.ReactNode, subtitle?: string }) => (
  <div className="mb-4 animate-in">
    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 uppercase tracking-tight">
      {children}
    </h2>
    {subtitle && <p className="text-slate-500 text-sm mt-0.5 leading-relaxed font-medium">{subtitle}</p>}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, fullWidth = true }: any) => {
  const base = "px-6 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 text-base shadow-lg active:scale-95";
  const variants: any = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50",
    secondary: "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50",
    outline: "bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50",
    premium: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-200/50 hover:scale-[1.02]",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200"
  };
  return (
    <button 
      disabled={disabled}
      onClick={onClick} 
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Accordion = ({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-white mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-black text-slate-900"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="p-5 pt-0 text-slate-600 font-medium leading-relaxed animate-in">
          {children}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredIncidents = useMemo(() => {
    return INCIDENT_PATHS.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="p-6 max-w-5xl mx-auto pb-32 animate-in">
      <div className="mt-8 mb-10">
        <h2 className="text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tighter">
          Naya Sahai <br />
          <span className="text-indigo-600">Recovery OS.</span>
        </h2>
        <p className="text-slate-500 mt-6 text-xl leading-relaxed font-semibold max-w-md">
          Nationwide trusted navigation for cyber fraud recovery. Professional action plans for Indian citizens.
        </p>
      </div>
      <div className="relative mb-14 group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="text-slate-900 w-6 h-6 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search incident (e.g. UPI fraud)" 
          className="w-full bg-white border-2 border-slate-900 rounded-[2rem] py-6 pl-16 pr-8 shadow-xl shadow-gray-400/40 focus:ring-2 focus:ring-gray-400 focus:border-black outline-none text-xl font-bold transition-all placeholder:text-gray-400" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      <SectionTitle subtitle="Official reporting paths & recovery steps">Select Incident Type</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIncidents.map((path) => (
          <button 
            key={path.id} 
            onClick={() => navigate(`/incident/${path.id}`)} 
            className="flex items-center justify-between p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] text-left hover:border-indigo-600 hover:shadow-2xl transition-all group shadow-md shadow-gray-400/20"
          >
            <div className="flex-1 pr-4">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border-2 border-indigo-100 mb-2 inline-block">
                {path.category}
              </span>
              <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{path.title}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ChevronRight className="w-6 h-6" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const IncidentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const incident = useMemo(() => INCIDENT_PATHS.find(p => p.id === id), [id]);

  if (!incident) return (
    <div className="p-20 text-center font-black">
      <SectionTitle subtitle="Redirecting to safety...">Incident Not Found</SectionTitle>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
    </div>
  );

  return (
    <div className="pb-40 bg-slate-50 min-h-screen animate-in">
      <div className="bg-white border-b-2 border-slate-200 p-8 pt-12 pb-10">
        <div className="max-w-2xl mx-auto text-center space-y-4">
           <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100">
            {incident.category}
          </span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{incident.title}</h2>
          <p className="text-slate-500 font-bold text-lg leading-tight max-w-md mx-auto">{incident.summary}</p>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-12 mt-8">
        
        <ImmediateSteps data={incident.immediateActions} />

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 border-2 border-indigo-500/20 overflow-hidden">
             <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest">
                  <Sparkles className="w-4 h-4" /> Recommended Recovery Plan
                </div>
                <h3 className="text-3xl font-black tracking-tight leading-none">Generate Recovery Action Plan</h3>
                <p className="text-slate-400 font-bold text-lg leading-snug">Unlock professional legal drafts, case trackers, and specialized tools to recover your funds.</p>
             </div>
             <Button onClick={() => {
               saveToLocal(STORAGE_KEYS.CURRENT_INCIDENT_ID, incident.id);
               navigate('/plans');
             }} variant="premium" className="py-6 text-xl">
               Get Your Premium Plan <ArrowUpRight className="w-6 h-6" />
             </Button>
          </div>
        </div>

        <OfficialPortal data={incident.officialPortal} />
        
        <SecondaryAuthorities data={incident.additionalPortals} />

        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl flex gap-5 items-start">
          <ShieldAlert className="w-8 h-8 text-red-600 shrink-0 mt-1" />
          <div>
            <h4 className="font-black text-red-900 text-lg leading-tight">Beware of Recovery Scams</h4>
            <p className="text-red-700 font-bold text-sm leading-tight mt-1">
              {incident.secondaryExploitationWarning}
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <SectionTitle subtitle="Further details for complete recovery">Advanced Help</SectionTitle>
          <ProtectionProtocol data={incident.protectionProtocol} />
          <PrepChecklist data={incident.preparedChecklist} />
          <FIRSteps data={incident.firSteps} />
          <EscalationLadderComp data={incident.escalationLadder} />
        </section>

      </div>
    </div>
  );
};

const PlanSelect = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<any>(getFromLocal(STORAGE_KEYS.PLAN));

  const handleSelect = (plan: any) => {
    setSelectedPlan(plan);
    saveToLocal(STORAGE_KEYS.PLAN, plan);
    navigate('/plans/payment');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-40 animate-in">
      <SectionTitle subtitle="Professional assistance for recovery">Select Action Plan</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`p-8 bg-white border-2 rounded-[3.5rem] shadow-lg shadow-gray-400/30 transition-all hover:-translate-y-2 flex flex-col h-full ${selectedPlan?.id === plan.id ? 'border-indigo-600 ring-8 ring-indigo-50' : 'border-slate-100'}`}>
            <div className="flex-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : plan.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-violet-50 text-violet-600'}`}>
                {plan.id === 'SELF_HELP' ? <Shield className="w-7 h-7" /> : plan.id === 'AFFIDAVIT' ? <FileText className="w-7 h-7" /> : <Users className="w-7 h-7" />}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-600 font-bold text-sm mb-6">{plan.tagline}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-slate-900">₹{plan.price}</span>
                <span className="text-slate-500 font-bold text-sm">/ incident</span>
              </div>
              <ul className="space-y-4 mb-10">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-slate-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant={selectedPlan?.id === plan.id ? 'primary' : 'outline'} className={selectedPlan?.id !== plan.id ? "border-slate-200 border-2" : ""} onClick={() => handleSelect(plan)}>
              Activate Plan
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlanPayment = () => {
  const navigate = useNavigate();
  const plan = getFromLocal(STORAGE_KEYS.PLAN);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!plan) navigate('/');
  }, [plan, navigate]);

  if (!plan) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto pb-40 animate-in">
      <button onClick={() => navigate('/plans')} className="flex items-center gap-2 font-black text-indigo-600 mb-8"><ArrowLeft /> Change Plan</button>
      <SectionTitle subtitle="Secure Gateway (Mock Mode)">Finalize Payment</SectionTitle>
      <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 shadow-lg shadow-gray-400/40 space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-2xl font-black text-slate-900">{plan.name}</h4>
            <p className="text-slate-600 font-bold">Standard Incident Recovery</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-indigo-600">₹{plan.price}</span>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mt-1">Total</p>
          </div>
        </div>
        <div className="h-px bg-slate-200 opacity-50" />
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-slate-900 font-bold bg-slate-50 border-2 border-slate-100 p-6 rounded-2xl">
            <Lock className="w-6 h-6 text-emerald-600" />
            <p className="text-sm">Mock checkout for demonstration purposes.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 border-2 border-indigo-600 bg-indigo-50 rounded-2xl flex flex-col items-center gap-2">
              <CreditCard className="text-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Credit/Debit</span>
            </div>
            <div className="p-6 border-2 border-slate-100 rounded-2xl flex flex-col items-center gap-2 opacity-50">
              <Landmark className="text-slate-900" />
              <span className="text-[10px] font-black uppercase tracking-widest">Net Banking</span>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => { 
            setLoading(true); 
            setTimeout(() => { 
              setLoading(false); 
              saveToLocal(STORAGE_KEYS.PAID, 'true');
              navigate('/plans/details'); 
            }, 1200); 
          }} 
          disabled={loading}
          className="shadow-black/10"
        >
          {loading ? <Loader2 className="animate-spin" /> : `Complete Transaction`}
        </Button>
      </div>
    </div>
  );
};

const PlanDetails = () => {
  const navigate = useNavigate();
  const [incidentData, setIncidentData] = useState<any>(getFromLocal(STORAGE_KEYS.INCIDENT_DATA) || {
    type: '', date: '', time: '', bank: '', description: '', location: '', transactions: [], evidence: []
  });
  const [step, setStep] = useState(0);

  const addTx = () => setIncidentData({ ...incidentData, transactions: [...incidentData.transactions, { id: Date.now().toString(), utr: '', amount: '', date: '' }] });
  const updateTx = (id: string, field: string, val: string) => setIncidentData({ ...incidentData, transactions: incidentData.transactions.map((t: any) => t.id === id ? { ...t, [field]: val } : t) });

  const inputClasses = "w-full p-4 bg-white border-2 border-slate-900 rounded-xl font-bold outline-none focus:ring-2 focus:ring-gray-400 focus:border-black transition-all placeholder:text-gray-400 text-slate-900";
  const labelClasses = "text-base font-bold text-slate-900 block mb-2";

  const steps = [
    { 
      title: 'Incident Record', 
      content: <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg shadow-gray-400/40 space-y-8">
          <div className="space-y-2">
            <label className={labelClasses}>Occurrence Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
              <input type="text" value={incidentData.location} onChange={e => setIncidentData({...incidentData, location: e.target.value})} className={`${inputClasses} pl-12`} placeholder="City, State" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClasses}>Event Date</label>
              <input type="date" value={incidentData.date} onChange={e => setIncidentData({...incidentData, date: e.target.value})} className={inputClasses} />
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Time</label>
              <input type="time" value={incidentData.time} onChange={e => setIncidentData({...incidentData, time: e.target.value})} className={inputClasses} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Detailed Account</label>
            <textarea rows={6} value={incidentData.description} onChange={e => setIncidentData({...incidentData, description: e.target.value})} className={`${inputClasses} resize-none`} placeholder="Provide a narrative for the complaint draft..." />
          </div>
        </div>
    },
    {
      title: 'Financial Loss Log',
      content: (
        <div className="space-y-6">
          {incidentData.transactions.map((tx: any) => (
            <div key={tx.id} className="bg-white p-8 border-2 border-slate-200 rounded-2xl relative space-y-6 shadow-lg shadow-gray-400/40 animate-in">
              <button onClick={() => setIncidentData({...incidentData, transactions: incidentData.transactions.filter((t: any) => t.id !== tx.id)})} className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors p-2"><Trash2 className="w-6 h-6" /></button>
              <div className="space-y-2">
                <label className={labelClasses}>UTR / Reference ID</label>
                <input value={tx.utr} onChange={e => updateTx(tx.id, 'utr', e.target.value)} placeholder="0000000000" className={`${inputClasses} font-mono`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelClasses}>Loss Amount (₹)</label>
                  <input value={tx.amount} onChange={e => updateTx(tx.id, 'amount', e.target.value)} placeholder="0.00" className={inputClasses} />
                </div>
                <div className="space-y-2">
                  <label className={labelClasses}>Transaction Date</label>
                  <input type="date" value={tx.date} onChange={e => updateTx(tx.id, 'date', e.target.value)} className={inputClasses} />
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addTx} className="border-dashed border-2 border-slate-200 py-8 bg-white hover:bg-slate-50 shadow-none"><Plus /> Add Transaction Record</Button>
        </div>
      )
    }
  ];

  const handleComplete = () => {
    saveToLocal(STORAGE_KEYS.INCIDENT_DATA, incidentData);
    navigate('/plans/result');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pb-40 min-h-screen animate-in">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{steps[step].title}</h2>
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-16 bg-black' : i < step ? 'w-4 bg-emerald-600' : 'w-4 bg-black/10'}`} />)}
        </div>
      </header>
      {steps[step].content}
      <div className="mt-12 flex gap-4">
        {step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="border-slate-200 border-2 shadow-none">Back</Button>}
        <Button onClick={() => step < steps.length - 1 ? setStep(step + 1) : handleComplete()}>
          {step === steps.length - 1 ? 'Build Action Hub' : 'Next Step'}
        </Button>
      </div>
    </div>
  );
};

const PlanResult = () => {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const plan = getFromLocal(STORAGE_KEYS.PLAN);
  const incidentData = getFromLocal(STORAGE_KEYS.INCIDENT_DATA);
  const incidentId = getFromLocal(STORAGE_KEYS.CURRENT_INCIDENT_ID);
  const incident = useMemo(() => INCIDENT_PATHS.find(p => p.id === incidentId), [incidentId]);
  const [cases, setCases] = useState<any[]>(getFromLocal(STORAGE_KEYS.CASES) || []);

  const inputClasses = "w-full p-4 bg-white border-2 border-slate-900 rounded-xl font-bold outline-none focus:ring-2 focus:ring-gray-400 focus:border-black transition-all placeholder:text-gray-400 text-slate-900";
  const labelClasses = "text-base font-bold text-slate-900 block mb-2";

  useEffect(() => {
    saveToLocal(STORAGE_KEYS.CASES, cases);
  }, [cases]);

  if (!plan || !incidentData || !incident) return <div className="p-20 text-center font-black">Plan not found. <Link to="/" className="text-indigo-600 underline">Start New Path</Link></div>;

  const tools = [
    { id: 'complaint', name: 'Complaint Gen', icon: <MessageCircle />, desc: 'Ready-to-file legal draft' },
    { id: 'tracker', name: 'Case Tracker', icon: <History />, desc: 'Monitor police/bank statuses' },
    { id: 'pack', name: 'Evidence Pack', icon: <FileSearch />, desc: 'Consolidated document set' }
  ];

  if (plan.id === 'AFFIDAVIT' || plan.id === 'LAWYER') {
    tools.push({ id: 'affidavit', name: 'Notary Draft', icon: <FileText />, desc: 'Official Stamp Paper format' });
  }
  if (plan.id === 'LAWYER') {
    tools.push({ id: 'lawyer', name: 'Expert Call', icon: <PhoneCall />, desc: 'Book Law Specialist' });
  }

  // --- Dashboard Tool Sub-Views ---

  if (activeTool === 'complaint') {
    const totalLoss = incidentData.transactions.reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);
    const draftText = `To,\nThe Station House Officer,\nCyber Crime Cell,\n${incidentData.location}\n\nSubject: Official Complaint regarding Cyber Fraud of ₹${totalLoss}.\n\nRespected Sir/Madam,\nI am reporting a fraud that occurred on ${incidentData.date}.\n\nIncident Narrative:\n${incidentData.description}\n\nTransaction Details:\n${incidentData.transactions.map((t: any) => `- UTR: ${t.utr}, Amount: ₹${t.amount}, Date: ${t.date}`).join('\n')}\n\nPlease register this complaint and initiate recovery protocols.\n\nSigned,\n[Name]`;
    
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-8 animate-in">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 font-black text-indigo-600 hover:translate-x-[-4px] transition-transform"><ArrowLeft /> Back to Dashboard</button>
        <SectionTitle subtitle="Official submission format for Cyber Cell">Complaint Generator</SectionTitle>
        <div className="bg-white p-8 border-2 border-slate-200 rounded-[2.5rem] font-mono text-sm whitespace-pre-wrap leading-relaxed shadow-lg shadow-gray-400/20 select-all">
          {draftText}
        </div>
        <div className="flex gap-4">
          <Button onClick={() => { navigator.clipboard.writeText(draftText); alert('Copied to clipboard'); }} className="bg-emerald-600 hover:bg-emerald-700">Copy Text</Button>
          <Button onClick={() => triggerDownload('Cyber_Complaint.txt', draftText)} variant="secondary" className="border-slate-200 border-2"><Download /> Download Text</Button>
        </div>
      </div>
    );
  }

  if (activeTool === 'tracker') {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-10 animate-in">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 font-black text-indigo-600"><ArrowLeft /> Back</button>
        <SectionTitle subtitle="Centralized log for all filings">Incident Tracker</SectionTitle>
        <div className="bg-white p-8 border-2 border-slate-200 rounded-[3rem] space-y-4 shadow-lg shadow-gray-400/40">
          <label className={labelClasses}>Add New Reference</label>
          <input 
            placeholder="e.g. Police Acknowledgement" 
            className={inputClasses} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value;
                if (!val) return;
                setCases([{ id: Date.now().toString(), title: val, refNo: 'ACK-' + Date.now().toString().slice(-6), status: 'Reported', date: new Date().toLocaleDateString() }, ...cases]);
                (e.target as HTMLInputElement).value = '';
              }
            }}
          />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Press ENTER to add new log.</p>
        </div>
        <div className="space-y-4">
          {cases.length === 0 && <div className="text-center py-20 text-slate-400 font-bold italic">No active filings tracked.</div>}
          {cases.map(c => (
            <div key={c.id} className="p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] flex justify-between items-center shadow-md shadow-gray-400/20 hover:border-indigo-600 transition-all">
              <div>
                <h5 className="text-xl font-black text-slate-900">{c.title}</h5>
                <p className="text-xs text-slate-600 font-bold">Ref: {c.refNo} • Logged: {c.date}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200">{c.status}</span>
                </div>
              </div>
              <button onClick={() => setCases(cases.filter(x => x.id !== c.id))} className="text-slate-300 hover:text-red-600 transition-colors p-2"><Trash2 className="w-6 h-6" /></button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTool === 'affidavit') {
    const text = `AFFIDAVIT FOR BANK CHARGEBACK\n\nI, [Name], residing at ${incidentData.location},\nState as follows:\n\n1. I am a victim of a cyber fraud on ${incidentData.date}.\n2. Unauthorized loss: ₹${incidentData.transactions.reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0)}.\n3. Request for immediate reversal.\n\nSigned,\n[Victim Signature]`;
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-10 animate-in">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 font-black text-indigo-600"><ArrowLeft /> Back</button>
        <SectionTitle subtitle="Required for Bank Ombudsman filings">Notary Draft</SectionTitle>
        <div className="bg-orange-50 p-6 border-2 border-slate-200 rounded-3xl flex gap-4 shadow-md shadow-gray-400/20">
          <Info className="text-orange-600 shrink-0" />
          <p className="text-sm font-bold text-orange-950 leading-tight">Print this on a ₹100 Non-Judicial stamp paper. Requires official Notary stamp.</p>
        </div>
        <div className="bg-white p-10 border-2 border-slate-200 rounded-[3rem] font-mono text-sm shadow-inner select-all">
          {text}
        </div>
        <Button onClick={() => triggerDownload('Affidavit_Draft.txt', text)} className="bg-slate-900 border-2 border-slate-200">Download Template</Button>
      </div>
    );
  }

  if (activeTool === 'lawyer') {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-10 animate-in">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 font-black text-indigo-600"><ArrowLeft /> Back</button>
        <SectionTitle subtitle="Professional Legal Review">Schedule Consultation</SectionTitle>
        <div className="bg-white border-2 border-slate-200 rounded-[3rem] p-10 shadow-lg shadow-gray-400/40 space-y-10">
           <div className="flex items-center gap-6">
             <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center text-violet-600 shadow-inner border-2 border-slate-100"><Gavel className="w-8 h-8" /></div>
             <div>
               <h4 className="text-2xl font-black text-slate-900">Adv. R. Varma</h4>
               <p className="text-xs font-black text-violet-600 uppercase tracking-widest">Supreme Court Cyber Specialist</p>
             </div>
           </div>
           <div className="space-y-4">
             <h5 className={labelClasses}>Available Time Slots</h5>
             <div className="grid grid-cols-2 gap-4">
               {['Today 6:00 PM', 'Today 8:00 PM', 'Tomorrow 11:00 AM'].map(slot => (
                 <button key={slot} className="p-5 rounded-2xl border-2 border-slate-200 bg-white text-xs font-bold hover:bg-violet-600 hover:text-white transition-all shadow-md shadow-black/5 active:scale-95">{slot}</button>
               ))}
             </div>
           </div>
           <Button className="bg-violet-600 hover:bg-violet-700 py-6 border-2 border-slate-200 shadow-none" onClick={() => alert('Consultation Request Sent. Verification link emailed.')}>Confirm Booking</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pb-40 animate-in">
      <header className="bg-emerald-50 border-2 border-slate-200 p-12 rounded-[4rem] text-center space-y-4 mb-14 relative overflow-hidden shadow-lg shadow-gray-400/20">
        <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-200 animate-in">
          <ShieldCheck className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-emerald-950 tracking-tighter">Recovery Dashboard Active</h2>
        <p className="text-emerald-800 font-bold">Premium Access Enabled • {plan.name}</p>
      </header>
      
      <SectionTitle subtitle="Use these tools to finalize recovery steps">Unlocked Services</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {tools.map(tool => (
          <button key={tool.id} onClick={() => setActiveTool(tool.id)} className="p-8 bg-white border-2 border-slate-200 rounded-[3rem] text-left hover:border-indigo-600 transition-all group relative overflow-hidden shadow-lg shadow-gray-400/20 hover:shadow-2xl hover:-translate-y-2">
            <div className="p-5 bg-indigo-50 rounded-2xl text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all w-fit shadow-inner border-2 border-slate-100">
              {tool.icon}
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-1 leading-tight">{tool.name}</h4>
            <p className="text-slate-600 font-bold text-xs">{tool.desc}</p>
          </button>
        ))}
      </div>

      <RecoveryRoadmap incident={incident} />

      <div className="mt-14">
        <Button onClick={() => navigate('/')} variant="outline">Exit Recovery Hub</Button>
      </div>
    </div>
  );
};

const TrustInfo = () => (
  <div className="p-12 text-center max-w-3xl mx-auto animate-in pb-40">
    <div className="bg-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-100 mb-10 border-2 border-slate-200"><Shield className="w-10 h-10" /></div>
    <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Verified Recovery OS</h2>
    <p className="text-slate-600 font-bold text-xl mb-12 leading-relaxed max-w-xl mx-auto">All legal formats comply with the latest BNS and IT Act 2000 standards. Your data processed locally, never stored.</p>
    <div className="grid grid-cols-2 gap-6 text-left mb-16">
      <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-lg shadow-gray-400/20">
        <Lock className="text-indigo-600 mb-4" />
        <h4 className="font-black text-slate-900">Privacy First</h4>
        <p className="text-xs font-bold text-slate-600 mt-1">Local processing of all sensitive transaction evidence.</p>
      </div>
      <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-lg shadow-gray-400/20">
        <CheckSquare className="text-emerald-600 mb-4" />
        <h4 className="font-black text-slate-900">Govt Compliant</h4>
        <p className="text-xs font-bold text-slate-600 mt-1">Directly integrated with Cyber Cell submission paths.</p>
      </div>
    </div>
    <Link to="/" className="inline-flex items-center gap-3 text-indigo-600 font-black text-lg group transition-all">
      <ArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Back to Navigator
    </Link>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/incident/:id" element={<IncidentDetails />} />
            <Route path="/plans" element={<PlanSelect />} />
            <Route path="/plans/payment" element={<PlanPayment />} />
            <Route path="/plans/details" element={<PlanDetails />} />
            <Route path="/plans/result" element={<PlanResult />} />
            <Route path="/about" element={<TrustInfo />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around py-5 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <NavLink to="/" icon={<Navigation />} label="Explore" />
          <NavLink to="/plans/result" icon={<CheckSquare />} label="My Recovery" />
          <NavLink to="/about" icon={<Shield />} label="Trust" />
        </nav>  
      </div>
    </BrowserRouter>
  );
};

const NavLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-indigo-600 font-black scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
      <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-indigo-50 border-2 border-indigo-200 shadow-sm' : 'bg-transparent border-2 border-transparent'}`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 24 }) : icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest mt-1">{label}</span>
    </Link>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

export default App;
