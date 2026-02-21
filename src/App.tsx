import React, { useState, useEffect, useMemo } from 'react';
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
  ArrowRight,
  Printer,
  FileDown
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AuthGate } from '../src/components/AuthGate';
import { CaseTracker } from '../src/components/CaseTracker';

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
  firSteps: string[];
  escalationLadder: Escalation[];
  secondaryExploitationWarning: string;
}

export const INCIDENT_PATHS: IncidentPath[] = [
  {
    id: 'upi-card-fraud',
    category: IncidentCategory.FINANCIAL_FRAUD,
    title: 'UPI / Debit / Credit Card Fraud',
    summary: 'Unauthorized money transfer from your bank or card. Act fast — quick action within the Golden Hour can save funds.',
    immediateActions: [
      { title: 'Call 1930 immediately', description: 'National Cyber Crime Helpline (Golden Hour). Fast reporting can freeze funds across banks.', isEmergency: true },
      { title: 'Block cards/UPI/wallet with bank', description: 'Disable all digital payments and get reference number.', isEmergency: false },
      { title: 'Report on National Cyber Crime Portal', description: 'Register official complaint and upload evidence.', isEmergency: false }
    ],
    protectionProtocol: ['Never share OTP or PIN', 'Change passwords immediately', 'Enable international transaction limits'],
    officialPortal: {
      name: 'National Cyber Crime Reporting Portal',
      url: 'https://www.cybercrime.gov.in',
      description: 'Official Government of India portal for reporting all cyber and financial frauds.'
    },
    additionalPortals: [
      { name: 'RBI CMS', url: 'https://cms.rbi.org.in', description: 'Escalate to RBI if bank does not resolve in 30 days.' }
    ],
    preparedChecklist: ['Transaction IDs / UTR Number', 'Latest Bank Statement', 'Incident Screenshots', 'Identity Proof'],
    firSteps: [
      'Carry bank statement and fraud timeline',
      'File Zero FIR at ANY police station under Bharatiya Nyaya Sanhita (BNS). Police must register even outside jurisdiction'
    ],
    escalationLadder: [
      { level: 1, authority: 'Bank Nodal Officer', condition: 'If no response in 7 days', link: '#', linkText: 'Find Nodal Officer' },
      { level: 2, authority: 'RBI Ombudsman', condition: 'If unresolved in 30 days', link: 'https://cms.rbi.org.in', linkText: 'File RBI Case' }
    ],
    secondaryExploitationWarning: 'Beware of "fund recovery agents" or private hackers. Legitimate government services are always free.'
  },
  {
    id: 'product-refund-dispute',
    category: IncidentCategory.CONSUMER_DISPUTE,
    title: 'Refund / Defective Product Dispute',
    summary: 'Company refusing refund, warranty, or defective product issues. Don’t worry — consumer courts are designed to be simple.',
    immediateActions: [
      { title: 'Send written complaint + save evidence', description: 'Email or ticket. Keep invoice, photos, chats.', isEmergency: false },
      { title: 'Call 1915 or file on National Consumer Helpline', description: 'Free government mediation step.', isEmergency: false },
      { title: 'File case on e-Jagriti', description: 'Unified system with e-filing, video hearings and e-Notices.', isEmergency: false }
    ],
    protectionProtocol: ['Check merchant ratings before buying', 'Prefer Cash on Delivery for new sites', 'Record unboxing videos'],
    officialPortal: {
      name: 'National Consumer Helpline',
      url: 'https://consumerhelpline.gov.in',
      description: 'Free government mediation (1915)'
    },
    additionalPortals: [
      { name: 'e-Jagriti Integrated Platform', url: 'https://e-jagriti.gov.in', description: 'Unified consumer court system. Handles filing, VC hearings and notices.' }
    ],
    preparedChecklist: ['Invoice copy', 'Photos of defective item', 'Communication history (Emails/Chats)', 'Proof of payment'],
    firSteps: [
      'Consumer disputes are civil matters',
      'Police FIR usually not required unless criminal cheating is evident',
      'If cheating occurs, file Zero FIR at ANY station under BNS'
    ],
    escalationLadder: [
      { level: 1, authority: 'NCH Mediation', condition: 'First step mediation', link: 'https://consumerhelpline.gov.in', linkText: 'File Complaint' },
      { level: 2, authority: 'e-Jagriti Consumer Court', condition: 'If mediation fails after 30 days', link: 'https://e-jagriti.gov.in', linkText: 'File Legal Case' }
    ],
    secondaryExploitationWarning: 'Never pay private "refund agents". All government portals are free.'
  },
  {
    id: 'investment-ponzi-scam',
    category: IncidentCategory.FINANCIAL_FRAUD,
    title: 'Investment / Ponzi / MLM Scam',
    summary: 'Fake investment plans, crypto apps, or trading groups promising guaranteed returns. schemes usually stop withdrawals suddenly.',
    immediateActions: [
      { title: 'Call 1930 immediately', description: 'Freeze funds before they move out of the recipient bank account.', isEmergency: true },
      { title: 'Stop all deposits', description: 'Do not pay "withdrawal fees" or "taxes" requested by the scammer.', isEmergency: false },
      { title: 'File SEBI SCORES Complaint', description: 'Report to regulator for action against illegal intermediaries.', isEmergency: false }
    ],
    protectionProtocol: ['Verify brokers on SEBI/RBI websites', 'Avoid Telegram/WhatsApp trading tips', 'Refuse referral-based income schemes'],
    officialPortal: {
      name: 'National Cyber Crime Reporting Portal',
      url: 'https://www.cybercrime.gov.in',
      description: 'Primary portal for reporting financial cyber fraud.'
    },
    additionalPortals: [
      { name: 'SEBI SCORES', url: 'https://scores.sebi.gov.in', description: 'Report illegal investment platforms.' },
      { name: 'RBI Sachet', url: 'https://sachet.rbi.org.in', description: 'Report unauthorized deposit schemes.' }
    ],
    preparedChecklist: ['Payment screenshots', 'Transaction UTR numbers', 'Chat logs from Telegram/WhatsApp', 'Scam website/app link'],
    firSteps: [
      'Carry bank statement showing all transfers',
      'Clearly state "Ponzi Scheme / MLM Fraud" in the description',
      'File Zero FIR at ANY station under BNS'
    ],
    escalationLadder: [
      { level: 1, authority: 'Cyber Cell', condition: 'Primary reporting', link: 'https://www.cybercrime.gov.in', linkText: 'File Report' },
      { level: 2, authority: 'SEBI / RBI', condition: 'If intermediary claims registration', link: 'https://scores.sebi.gov.in', linkText: 'Regulatory Case' }
    ],
    secondaryExploitationWarning: 'Government portals are free. Never trust private hackers promising to "recover" crypto or funds.'
  },
  {
    id: 'loan-app-harassment',
    category: IncidentCategory.FINANCIAL_FRAUD,
    title: 'Loan App Harassment / Blackmail',
    summary: 'Illegal apps using your contact list for blackmail or extortion. Seek legal help immediately.',
    immediateActions: [
      { title: 'Stop all payments', description: 'Extortionists will continue to demand money even after payment.', isEmergency: true },
      { title: 'Uninstall app & revoke access', description: 'Remove app and change permissions via phone settings.', isEmergency: false },
      { title: 'Report to RBI Sachet', description: 'Log complaint for regulatory action against illegal lenders.', isEmergency: false }
    ],
    protectionProtocol: ['Only install apps from Play Store/App Store', 'Check RBI registration of lender', 'Never give contacts/gallery access'],
    officialPortal: {
      name: 'RBI Sachet Portal',
      url: 'https://sachet.rbi.org.in',
      description: 'Centralized portal for complaints against illegal loan apps.'
    },
    additionalPortals: [
      { name: 'National Cyber Crime Portal', url: 'https://cybercrime.gov.in', description: 'Report extortion and data theft.' }
    ],
    preparedChecklist: ['Harassing call recordings', 'Threatening messages', 'Loan app download source', 'Payment proofs'],
    firSteps: [
      'Carry screenshots of harassing messages',
      'Mention "Extortion and unauthorized data access" in the FIR',
      'File Zero FIR under BNS'
    ],
    escalationLadder: [
      { level: 1, authority: 'Cyber Cell', condition: 'For harassment/threats', link: 'https://cybercrime.gov.in', linkText: 'Report Extortion' },
      { level: 2, authority: 'RBI Banking Ombudsman', condition: 'If lender is an RBI NBFC', link: 'https://cms.rbi.org.in', linkText: 'RBI Case' }
    ],
    secondaryExploitationWarning: 'Courts never send notices via WhatsApp. Ignore fake legal threats from unknown numbers.'
  }
];

const PLANS = [
  { id: 'SELF_HELP', name: 'Self-Help Navigator', tagline: 'Perfect for quick reporting & small disputes.', price: '49', color: 'emerald', features: ['Ready-to-Submit Cyber Complaint Draft', 'Official Evidence Package (Word format)', 'Step-by-Step Recovery Roadmap & Portal Links', 'Case Tracker & Status Log', 'Fraud Protection Checklist'] },
  { id: 'AFFIDAVIT', name: 'Pro Recovery', tagline: 'For banking fraud and legal claims.', price: '499', color: 'indigo', features: ['Everything in Self-Help', 'Notary Drafts for Bank', 'Stamp Paper Templates', 'Escalation Assistance'] },
  { id: 'LAWYER', name: 'Expert Assist', tagline: 'High-value recovery with legal support.', price: '1,999', color: 'violet', features: ['Everything in Pro Recovery', '15-min Legal Consultation', 'Priority Case Review', 'Custom Legal Drafts'] }
];

const STORAGE_KEYS = {
  INCIDENT_DATA: 'ns_incident_data',
  CURRENT_INCIDENT_ID: 'ns_current_incident_id',
  PLAN: 'ns_plan',
  CASES: 'ns_cases',
  PAID: 'ns_is_paid',
  GENERATED_EVIDENCE: 'ns_generated_evidence'
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

const SectionTitle = ({ children, subtitle }: { children?: React.ReactNode, subtitle?: string }) => (
  <div className="mb-4 animate-in">
    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">{children}</h2>
    {subtitle && <p className="text-slate-500 text-sm mt-0.5 leading-relaxed font-bold">{subtitle}</p>}
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
    <button disabled={disabled} onClick={onClick} className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {children}
    </button>
  );
};

const RecoveryRoadmap = ({ incident }: { incident: IncidentPath }) => {
  const roadmapSteps = [
    { title: 'Immediate Actions', desc: 'Priority steps taken within the first 24 hours.', icon: <AlertTriangle /> },
    { title: 'Evidence Preparation', desc: 'Consolidating transaction records and chat logs.', icon: <FileText /> },
    { title: 'Official Reporting', desc: `Submission to ${incident.officialPortal.name}.`, icon: <ExternalLink /> },
    { title: 'Escalation Phase', desc: 'Moving to Nodal Officers or Ombudsman if unresolved.', icon: <History /> }
  ];

  return (
    <div className="space-y-8 mt-16 animate-in">
      <SectionTitle subtitle="Track your path to recovery">Personalized Roadmap</SectionTitle>
      <div className="relative pl-10 space-y-12">
        <div className="absolute left-[19px] top-2 bottom-2 w-1 bg-slate-200 rounded-full" />
        {roadmapSteps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="absolute -left-10 top-0 w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-slate-50 z-10">
              {React.cloneElement(step.icon as React.ReactElement<{ size?: number }>, { size: 18 })}
            </div>
            <div className="bg-white border-2 border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:border-indigo-400 transition-colors">
              <h4 className="text-xl font-black text-slate-900">{step.title}</h4>
              <p className="text-slate-500 font-bold mt-1">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PlanResult = () => {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [evidenceDoc, setEvidenceDoc] = useState<string | null>(getFromLocal(STORAGE_KEYS.GENERATED_EVIDENCE));
  
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  
  const plan = getFromLocal(STORAGE_KEYS.PLAN);
  const incidentData = getFromLocal(STORAGE_KEYS.INCIDENT_DATA);
  const incidentId = getFromLocal(STORAGE_KEYS.CURRENT_INCIDENT_ID);
  
  const incident = useMemo(
    () => INCIDENT_PATHS.find(p => p.id === incidentId),
    [incidentId]
  );

  const inputClasses = "w-full p-4 bg-white border-2 border-slate-900 rounded-xl font-bold outline-none focus:ring-2 focus:ring-gray-400 focus:border-black transition-all placeholder:text-gray-400 text-slate-900";
  const labelClasses = "text-base font-bold text-slate-900 block mb-2";

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

  const toggleEvidence = (item: string) => {
    setSelectedEvidence(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleGenerateEvidence = async () => {
    if (selectedEvidence.length === 0) return;

    setGenerating(true);
    try {
      const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY!
});

      const totalLoss = incidentData.transactions.reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);
      const caseId = `NS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const generatedDate = new Date().toLocaleString();

      const prompt = `
        You are generating an OFFICIAL EVIDENCE PACKAGE document for Microsoft Word (.docx).
        CRITICAL RULES:
        1. Output PLAIN FORMATTED TEXT only.
        2. NO markdown (no #, **, _, etc.).
        3. NO emojis.
        4. NO explanations or intro/outro text.
        5. Tone must be formal, professional, and official.
        6. The format must be IDENTICAL for all incident types.
        7. The document must look print-ready.

        ========================================
        MANDATORY DOCUMENT LAYOUT
        ========================================

        Center title:
        NAYA SAHAI
        OFFICIAL EVIDENCE PACKAGE

        Generated On: ${generatedDate}
        Case ID: ${caseId}
        Incident Type: ${incident.title}

        ========================================
        SECTION A – INCIDENT SUMMARY
        ========================================
        Location: ${incidentData.location}
        Date: ${incidentData.date}
        Time: ${incidentData.time}
        Category: ${incident.category}

        ========================================
        SECTION B – INCIDENT DESCRIPTION
        ========================================
        Write one formal narrative paragraph clearly explaining the incident based on the following input:
        "${incidentData.description}"

        ========================================
        SECTION C – FINANCIAL / LOSS DETAILS
        ========================================
        Total Loss Amount: ₹${totalLoss}

        Transaction Details:
        Reference/UTR        Date            Amount (INR)
        ------------------------------------------------
        ${incidentData.transactions.map((t: any) => `${t.utr.padEnd(20)} ${t.date.padEnd(15)} ₹${t.amount}`).join('\n        ')}

        ========================================
        SECTION D – ATTACHED EVIDENCE
        ========================================
        The following items are officially attached to this package:
        ${selectedEvidence.map(item => `☑ ${item}`).join('\n        ')}

        ========================================
        SECTION E – ACTIONS TAKEN
        ========================================
        List the following actions as formal sentences:
        - Reporting via Naya Sahai Recovery System initiated.
        - Steps taken to block unauthorized access to accounts.
        - Preparation of official documentation for submission to authorities.

        ========================================
        SECTION F – DECLARATION
        ========================================
        I hereby declare that the above information is true and correct to the best of my knowledge and belief. This document is prepared for official submission to the concerned authority.

        Signature: _______________________________

        Name: _______________________________

        Date: _______________________________

        ========================================
        Footer:
        Naya Sahai Recovery System – Auto Generated Document
        ========================================

        Return ONLY the document text.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      const doc = response.text || 'Error: Generation failed.';
      setEvidenceDoc(doc);
      saveToLocal(STORAGE_KEYS.GENERATED_EVIDENCE, doc);
    } catch (e) {
      console.error(e);
      alert('Failed to generate document. Please check your connection.');
    } finally {
      setGenerating(false);
    }
  };

  if (activeTool === 'complaint') {
    const totalLoss = incidentData.transactions.reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);
    const evidenceList = incidentData.evidence && incidentData.evidence.length > 0 
      ? `\n\nEvidence Attached:\n${incidentData.evidence.map((e: string) => `- ${e}`).join('\n')}`
      : "";
    
    const draftText = `To,\nThe Station House Officer,\nCyber Crime Cell,\n${incidentData.location}\n\nSubject: Official Complaint regarding ${incident.title} of ₹${totalLoss}.\n\nRespected Sir/Madam,\nI am reporting a fraud that occurred on ${incidentData.date}.\n\nIncident Narrative:\n${incidentData.description}\n\nTransaction Details:\n${incidentData.transactions.map((t: any) => `- UTR: ${t.utr}, Amount: ₹${t.amount}, Date: ${t.date}`).join('\n')}${evidenceList}\n\nPlease register this complaint and initiate recovery protocols.\n\nSigned,\n[Your Name]`;
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-8 animate-in pb-40">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 font-black text-indigo-600 hover:translate-x-[-4px] transition-transform"><ArrowLeft /> Back to Dashboard</button>
        <SectionTitle subtitle="Official submission format for Cyber Cell">Complaint Generator</SectionTitle>
        <div className="bg-white p-8 border-2 border-slate-200 rounded-[2.5rem] font-mono text-sm whitespace-pre-wrap leading-relaxed shadow-lg shadow-gray-400/20 select-all">{draftText}</div>
        <div className="flex gap-4">
          <Button onClick={() => { navigator.clipboard.writeText(draftText); alert('Copied to clipboard'); }} className="bg-emerald-600 hover:bg-emerald-700">Copy Text</Button>
          <Button onClick={() => triggerDownload('Cyber_Complaint_Draft.txt', draftText)} variant="secondary" className="border-slate-200 border-2"><Download /> Download Text</Button>
        </div>
      </div>
    );
  }

  if (activeTool === 'tracker') {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-10 animate-in pb-40">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 font-black text-indigo-600"><ArrowLeft /> Back</button>
        <SectionTitle subtitle="Secure Cloud Sync via Supabase">Case Management</SectionTitle>
        <AuthGate>
          <CaseTracker />
        </AuthGate>
      </div>
    );
  }

  if (activeTool === 'pack') {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-10 animate-in pb-40">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 font-black text-indigo-600 hover:translate-x-[-4px] transition-transform"><ArrowLeft /> Back to Dashboard</button>
        <SectionTitle subtitle="Ready-to-print official submission package">Evidence Pack</SectionTitle>
        
        {!evidenceDoc ? (
          <div className="bg-white border-2 border-slate-200 rounded-[3rem] p-12 text-center shadow-xl space-y-8 relative z-10">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
              <FileSearch className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">Build Your Evidence File</h3>
              <p className="text-slate-600 font-bold text-lg max-w-md mx-auto">Select the evidence items you have available to include in the official package.</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-3 relative z-10">
              {incident.preparedChecklist.map((item: string) => (
                <label 
                  key={item} 
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md select-none ${selectedEvidence.includes(item) ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-slate-200'}`}
                >
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-indigo-600 cursor-pointer" 
                    checked={selectedEvidence.includes(item)}
                    onChange={() => toggleEvidence(item)}
                  />
                  <span className={`font-bold text-sm ${selectedEvidence.includes(item) ? 'text-indigo-950' : 'text-slate-600'}`}>{item}</span>
                </label>
              ))}
            </div>

            <Button 
              onClick={handleGenerateEvidence} 
              disabled={generating || selectedEvidence.length === 0} 
              className="py-6 text-xl"
            >
              {generating ? <><Loader2 className="animate-spin" /> Formatting Document...</> : <><Sparkles /> Generate Package</>}
            </Button>
            {selectedEvidence.length === 0 && <p className="text-xs font-bold text-red-500">Please select at least one evidence item to continue.</p>}
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
             <div className="bg-indigo-900 text-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h4 className="text-xl font-black">Official Document Ready</h4>
                  <p className="text-indigo-200 font-bold text-sm">Download as Word (.doc) to print and submit.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <Button onClick={() => triggerDownload('Official_Evidence_Package.doc', evidenceDoc)} variant="premium" className="px-8 shadow-none"><Printer className="w-5 h-5" /> Download for Word</Button>
                  <Button onClick={() => { setEvidenceDoc(null); saveToLocal(STORAGE_KEYS.GENERATED_EVIDENCE, null); }} variant="outline" className="border-indigo-400 text-white bg-transparent hover:bg-indigo-800 shadow-none">Modify Selection</Button>
                </div>
             </div>
             <div className="bg-white p-12 border-2 border-slate-900 rounded-[3rem] shadow-xl overflow-hidden font-mono text-sm leading-relaxed text-slate-900 select-all whitespace-pre">{evidenceDoc}</div>
          </div>
        )}
      </div>
    );
  }

  if (activeTool === 'affidavit') {
    const totalLoss = incidentData.transactions.reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);
    const text = `AFFIDAVIT FOR BANK CHARGEBACK / OMBUDSMAN\n\nI, [Your Name], residing at ${incidentData.location},\nState as follows:\n\n1. I am a victim of a cyber fraud on ${incidentData.date}.\n2. Unauthorized loss amount: ₹${totalLoss}.\n3. Detailed Narrative: ${incidentData.description}\n4. Request for immediate reversal and investigation.\n\nSigned,\n__________________________\n[Victim Signature]\n\nDate: ${new Date().toLocaleDateString()}`;
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-10 animate-in pb-40">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 font-black text-indigo-600"><ArrowLeft /> Back</button>
        <SectionTitle subtitle="Required for Bank Ombudsman filings">Notary Draft</SectionTitle>
        <div className="bg-orange-50 p-6 border-2 border-slate-200 rounded-3xl flex gap-4 shadow-md shadow-gray-400/20">
          <Info className="text-orange-600 shrink-0" />
          <p className="text-sm font-bold text-orange-950 leading-tight">Print this on a ₹100 Non-Judicial stamp paper. Requires official Notary stamp.</p>
        </div>
        <div className="bg-white p-10 border-2 border-slate-200 rounded-[3rem] font-mono text-sm shadow-inner select-all whitespace-pre">{text}</div>
        <Button onClick={() => triggerDownload('Legal_Affidavit_Draft.txt', text)} className="bg-slate-900 border-2 border-slate-200">Download Template</Button>
      </div>
    );
  }

  if (activeTool === 'lawyer') {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-10 animate-in pb-40">
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
        <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-200 animate-in"><ShieldCheck className="w-12 h-12 text-emerald-600" /></div>
        <h2 className="text-3xl font-black text-emerald-950 tracking-tighter">Recovery Dashboard Active</h2>
        <p className="text-emerald-800 font-bold">Premium Access Enabled • {plan.name}</p>
      </header>
      <SectionTitle subtitle="Use these tools to finalize recovery steps">Unlocked Services</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {tools.map(tool => (
          <button key={tool.id} onClick={() => setActiveTool(tool.id)} className="p-8 bg-white border-2 border-slate-200 rounded-[3rem] text-left hover:border-indigo-600 transition-all group relative overflow-hidden shadow-lg shadow-gray-400/20 hover:shadow-2xl hover:-translate-y-2">
            <div className="p-5 bg-indigo-50 rounded-2xl text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all w-fit shadow-inner border-2 border-slate-100">{React.isValidElement(tool.icon) ? React.cloneElement(tool.icon as React.ReactElement<{ size?: number }>, { size: 28 }) : tool.icon}</div>
            <h4 className="text-xl font-black text-slate-900 mb-1 leading-tight">{tool.name}</h4>
            <p className="text-slate-600 font-bold text-xs">{tool.desc}</p>
          </button>
        ))}
      </div>
      <RecoveryRoadmap incident={incident} />
      <div className="mt-14"><Button onClick={() => navigate('/')} variant="outline" className="border-slate-300">Exit Recovery Hub</Button></div>
    </div>
  );
};

const Header = () => (
  <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform"><Shield className="w-5 h-5 text-white" /></div>
      <div className="flex flex-col">
        <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">Naya Sahai</h1>
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Victim Navigation</span>
      </div>
    </Link>
  </header>
);

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const filteredIncidents = useMemo(() => INCIDENT_PATHS.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())), [searchQuery]);
  return (
    <div className="p-6 max-w-5xl mx-auto pb-32 animate-in">
      <div className="mt-8 mb-10">
        <h2 className="text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tighter">Naya Sahai <br /><span className="text-indigo-600">Recovery OS.</span></h2>
        <p className="text-slate-500 mt-6 text-xl leading-relaxed font-semibold max-w-md">Professional recovery navigation for Indian citizens. Powered by BNS & IT Act compliant logic.</p>
      </div>
      <div className="relative mb-14 group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none"><Search className="text-slate-900 w-6 h-6 group-focus-within:text-indigo-600 transition-colors" /></div>
        <input type="text" placeholder="Search incident (e.g. UPI fraud)" className="w-full bg-white border-2 border-slate-900 rounded-[2rem] py-6 pl-16 pr-8 shadow-xl shadow-gray-400/40 focus:ring-2 focus:ring-gray-400 focus:border-black outline-none text-xl font-bold transition-all placeholder:text-gray-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
      <SectionTitle subtitle="Select the path matching your incident">Official Recovery Paths</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredIncidents.map((path) => (
          <button key={path.id} onClick={() => navigate(`/incident/${path.id}`)} className="flex items-center justify-between p-8 bg-white border-2 border-slate-200 rounded-[2.5rem] text-left hover:border-indigo-600 hover:shadow-2xl transition-all group shadow-md shadow-gray-400/20">
            <div className="flex-1 pr-4"><span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest border-2 border-indigo-100 mb-2 inline-block">{path.category}</span><h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{path.title}</h3></div>
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><ChevronRight className="w-6 h-6" /></div>
          </button>
        ))}
      </div>
    </div>
  );
};

const IncidentDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const incident = useMemo(() => INCIDENT_PATHS.find(p => p.id === params.id), [params.id]);
  if (!incident) return <div className="p-20 text-center font-black"><SectionTitle subtitle="Incident mapping error">Incident Not Found</SectionTitle><Button onClick={() => navigate('/')}>Back to Navigator</Button></div>;
  return (
    <div className="pb-40 bg-slate-50 min-h-screen animate-in">
      <div className="bg-white border-b-2 border-slate-200 p-8 pt-12 pb-10">
        <div className="max-w-2xl mx-auto text-center space-y-4">
           <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-indigo-100">{incident.category}</span>
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
                <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest"><Sparkles className="w-4 h-4" /> Recommended Recovery Plan</div>
                <h3 className="text-3xl font-black tracking-tight leading-none">Generate Recovery Action Plan</h3>
                <p className="text-slate-400 font-bold text-lg leading-snug">Unlock professional legal drafts, evidence packages, and specialized tracking tools.</p>
             </div>
             <Button onClick={() => { saveToLocal(STORAGE_KEYS.CURRENT_INCIDENT_ID, incident.id); navigate('/plans'); }} variant="premium" className="py-6 text-xl">Get Your Action Plan <ArrowUpRight className="w-6 h-6" /></Button>
          </div>
        </div>
        <section className="space-y-4">
          <SectionTitle subtitle="Official reporting for legal record">Official Reporting</SectionTitle>
          <a href={incident.officialPortal.url} target="_blank" rel="noreferrer" className="block"><Button variant="outline" className="py-6 text-xl border-slate-900 hover:bg-slate-900 hover:text-white group">File Official Complaint <ExternalLink className="w-6 h-6 opacity-50 group-hover:opacity-100" /></Button></a>
          <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">{incident.officialPortal.name}</p>
        </section>
      </div>
    </div>
  );
};

const ImmediateSteps = ({ data }: { data: Action[] }) => (
  <section className="space-y-6">
    <SectionTitle subtitle="Act now to prevent further loss">Critical Next Steps</SectionTitle>
    <div className="grid gap-5">
      {data.map((action, i) => (
        <div key={i} className={`flex gap-6 items-start bg-white border-2 ${action.isEmergency ? 'border-red-600 ring-4 ring-red-50' : 'border-slate-900'} p-8 rounded-[2.5rem] shadow-xl shadow-gray-400/20 group transition-all`}>
          <div className={`w-14 h-14 rounded-2xl ${action.isEmergency ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'} flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>{i + 1}</div>
          <div>
            <p className="font-black text-slate-900 text-2xl group-hover:text-indigo-600 transition-colors mb-1">{action.title}</p>
            <p className="text-slate-600 font-bold text-lg leading-tight">{action.description}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

const PlanSelect = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<any>(getFromLocal(STORAGE_KEYS.PLAN));
  const handleSelect = (plan: any) => { setSelectedPlan(plan); saveToLocal(STORAGE_KEYS.PLAN, plan); navigate('/plans/payment'); };
  return (
    <div className="p-6 max-w-6xl mx-auto pb-40 animate-in">
      <SectionTitle subtitle="Professional assistance for recovery">Select Action Plan</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`p-8 bg-white border-2 rounded-[3.5rem] shadow-lg shadow-gray-400/30 transition-all hover:-translate-y-2 flex flex-col h-full ${selectedPlan?.id === plan.id ? 'border-indigo-600 ring-8 ring-indigo-50' : 'border-slate-100'}`}>
            <div className="flex-1">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : plan.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 'bg-violet-50 text-violet-600'}`}>{plan.id === 'SELF_HELP' ? <Shield className="w-7 h-7" /> : plan.id === 'AFFIDAVIT' ? <FileText className="w-7 h-7" /> : <Users className="w-7 h-7" />}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-600 font-bold text-sm mb-6 leading-tight">{plan.tagline}</p>
              <div className="flex items-baseline gap-1 mb-8"><span className="text-4xl font-black text-slate-900">₹{plan.price}</span><span className="text-slate-500 font-bold text-sm">/ incident</span></div>
              <ul className="space-y-4 mb-10">{plan.features.map(f => <li key={f} className="flex items-center gap-3 text-slate-900 font-bold text-xs leading-tight"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />{f}</li>)}</ul>
            </div>
            <Button variant={selectedPlan?.id === plan.id ? 'primary' : 'outline'} className={selectedPlan?.id !== plan.id ? "border-slate-200 border-2" : ""} onClick={() => handleSelect(plan)}>Activate Plan</Button>
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
  useEffect(() => { if (!plan) navigate('/'); }, [plan, navigate]);
  if (!plan) return null;
  return (
    <div className="p-6 max-w-2xl mx-auto pb-40 animate-in">
      <button onClick={() => navigate('/plans')} className="flex items-center gap-2 font-black text-indigo-600 mb-8"><ArrowLeft /> Change Plan</button>
      <SectionTitle subtitle="Secure Gateway (Mock Mode)">Finalize Payment</SectionTitle>
      <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 shadow-lg shadow-gray-400/40 space-y-10">
        <div className="flex justify-between items-center">
          <div><h4 className="text-2xl font-black text-slate-900">{plan.name}</h4><p className="text-slate-600 font-bold">Standard Incident Recovery</p></div>
          <div className="text-right"><span className="text-3xl font-black text-indigo-600">₹{plan.price}</span><p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mt-1">Total</p></div>
        </div>
        <div className="h-px bg-slate-200 opacity-50" />
        <Button onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); saveToLocal(STORAGE_KEYS.PAID, 'true'); navigate('/plans/details'); }, 1200); }} disabled={loading} className="shadow-black/10">{loading ? <Loader2 className="animate-spin" /> : `Complete Transaction`}</Button>
      </div>
    </div>
  );
};

const EVIDENCE_OPTIONS = [
  "Bank statement",
  "Transaction / UTR screenshot",
  "SMS alerts",
  "Call logs",
  "WhatsApp / Telegram chats",
  "Email communication",
  "Fraud website/app link",
  "Screen recording",
  "ID proof",
  "Loan app screenshots",
  "Threat / harassment messages",
  "Investment advertisement",
  "Remote app screenshot (AnyDesk etc)",
  "Courier / order details",
  "Audio / video proof"
];

const PlanDetails = () => {
  const navigate = useNavigate();
  const [incidentData, setIncidentData] = useState<any>(getFromLocal(STORAGE_KEYS.INCIDENT_DATA) || { date: '', time: '', description: '', location: '', transactions: [], evidence: [] });
  const [step, setStep] = useState(0);
  const addTx = () => setIncidentData({ ...incidentData, transactions: [...incidentData.transactions, { id: Date.now().toString(), utr: '', amount: '', date: '' }] });
  const updateTx = (id: string, field: string, val: string) => setIncidentData({ ...incidentData, transactions: incidentData.transactions.map((t: any) => t.id === id ? { ...t, [field]: val } : t) });
  
  const toggleEvidence = (item: string) => {
    const currentEvidence = incidentData.evidence || [];
    const newEvidence = currentEvidence.includes(item)
      ? currentEvidence.filter((i: string) => i !== item)
      : [...currentEvidence, item];
    setIncidentData({ ...incidentData, evidence: newEvidence });
  };

  const inputClasses = "w-full p-4 bg-white border-2 border-slate-900 rounded-xl font-bold outline-none focus:ring-2 focus:ring-gray-400 focus:border-black transition-all text-slate-900";
  const labelClasses = "text-base font-bold text-slate-900 block mb-2";
  const steps = [
    { title: 'Incident Record', content: <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg shadow-gray-400/40 space-y-8"><div className="space-y-2"><label className={labelClasses}>Location</label><input type="text" value={incidentData.location} onChange={e => setIncidentData({...incidentData, location: e.target.value})} className={inputClasses} placeholder="City, State" /></div><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className={labelClasses}>Date</label><input type="date" value={incidentData.date} onChange={e => setIncidentData({...incidentData, date: e.target.value})} className={inputClasses} /></div><div className="space-y-2"><label className={labelClasses}>Time</label><input type="time" value={incidentData.time} onChange={e => setIncidentData({...incidentData, time: e.target.value})} className={inputClasses} /></div></div><div className="space-y-2"><label className={labelClasses}>Description</label><textarea rows={6} value={incidentData.description} onChange={e => setIncidentData({...incidentData, description: e.target.value})} className={`${inputClasses} resize-none`} /></div></div> },
    { 
      title: 'Loss Details', 
      content: (
        <div className="space-y-10">
          <div className="space-y-6">
            <SectionTitle subtitle="List all fraudulent transactions">Transaction Records</SectionTitle>
            {incidentData.transactions.map((tx: any) => (
              <div key={tx.id} className="bg-white p-8 border-2 border-slate-200 rounded-2xl relative space-y-6">
                <button onClick={() => setIncidentData({...incidentData, transactions: incidentData.transactions.filter((t: any) => t.id !== tx.id)})} className="absolute top-4 right-4 text-slate-400 hover:text-red-600 p-2"><Trash2 className="w-6 h-6" /></button>
                <input value={tx.utr} onChange={e => updateTx(tx.id, 'utr', e.target.value)} placeholder="UTR/Ref" className={inputClasses} />
                <div className="grid grid-cols-2 gap-4">
                  <input value={tx.amount} onChange={e => updateTx(tx.id, 'amount', e.target.value)} placeholder="Amount (₹)" className={inputClasses} />
                  <input type="date" value={tx.date} onChange={e => updateTx(tx.id, 'date', e.target.value)} className={inputClasses} />
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addTx} className="border-dashed border-2 py-8 bg-white shadow-none"><Plus /> Add Record</Button>
          </div>

          <div className="space-y-6">
            <SectionTitle subtitle="Select all items you can provide">Available Evidence</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EVIDENCE_OPTIONS.map((option) => (
                <label 
                  key={option} 
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    incidentData.evidence?.includes(option) 
                      ? 'bg-indigo-50 border-indigo-600 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 accent-indigo-600 rounded" 
                    checked={incidentData.evidence?.includes(option)}
                    onChange={() => toggleEvidence(option)}
                  />
                  <span className={`text-sm font-bold ${incidentData.evidence?.includes(option) ? 'text-indigo-900' : 'text-slate-600'}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];
  const handleComplete = () => { saveToLocal(STORAGE_KEYS.INCIDENT_DATA, incidentData); navigate('/plans/result'); };
  return (
    <div className="max-w-2xl mx-auto p-6 pb-40 min-h-screen animate-in">
      <header className="mb-12 text-center"><h2 className="text-4xl font-black text-slate-900">{steps[step].title}</h2><div className="flex justify-center gap-2 mt-6">{steps.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-16 bg-black' : i < step ? 'w-4 bg-emerald-600' : 'w-4 bg-black/10'}`} />)}</div></header>
      {steps[step].content}
      <div className="mt-12 flex gap-4">{step > 0 && <Button variant="outline" onClick={() => setStep(step - 1)} className="border-slate-200 border-2 shadow-none">Back</Button>}<Button onClick={() => step < steps.length - 1 ? setStep(step + 1) : handleComplete()}>{step === steps.length - 1 ? 'Build Hub' : 'Next'}</Button></div>
    </div>
  );
};

const NavLink = ({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-indigo-600 font-black scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
      <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-indigo-50 border-2 border-indigo-200 shadow-sm' : 'bg-transparent border-2 border-transparent'}`}>{React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 24 }) : icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest mt-1">{label}</span>
    </Link>
  );
};

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

const TrustInfo = () => (
  <div className="p-12 text-center max-w-3xl mx-auto animate-in pb-40">
    <div className="bg-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-100 mb-10 border-2 border-slate-200"><Shield className="w-10 h-10" /></div>
    <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tighter">Verified Recovery OS</h2>
    <p className="text-slate-600 font-bold text-xl mb-12 leading-relaxed max-w-xl mx-auto">All legal formats comply with the latest BNS and IT Act standards. Your data is processed locally and never stored.</p>
    <div className="grid grid-cols-2 gap-6 text-left mb-16">
      <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-lg shadow-gray-400/20">
        <Lock className="text-indigo-600 mb-4" />
        <h4 className="font-black text-slate-900">Privacy First</h4>
        <p className="text-xs font-bold text-slate-600 mt-1">Local encryption of all sensitive transaction evidence.</p>
      </div>
      <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl shadow-lg shadow-gray-400/20">
        <CheckSquare className="text-emerald-600 mb-4" />
        <h4 className="font-black text-slate-900">Govt Compliant</h4>
        <p className="text-xs font-bold text-slate-600 mt-1">Directly integrated with official Cyber Cell submission logic.</p>
      </div>
    </div>
    <Link to="/" className="inline-flex items-center gap-3 text-indigo-600 font-black text-lg group transition-all">
      <ArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Back to Navigator
    </Link>
  </div>
);



export default App;
