import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import {
  Plus,
  Trash2,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  X,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Loader2,
  Scale,
  ShieldAlert,
  FileCheck,
  ArrowRight,
  PhoneCall,
  Gavel,
  Landmark,
  FileText
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

// We import INCIDENT_PATHS to resolve incident details from IDs
import { INCIDENT_PATHS } from '../../src/data/incidents';

export type CaseStatus =
  | "Not Reported"
  | "Reported to 1930"
  | "Reported on Portal"
  | "FIR Filed"
  | "Bank Reviewing"
  | "Frozen"
  | "Recovered"
  | "Closed";

interface RecoveryCase {
  id: string;
  user_id: string;
  incident_id: string;
  status: CaseStatus;
  complaint_id: string;
  amount: number;
  portal: string;
  next_action: string;
  created_at: string;
  updated_at: string;
  aiInsight?: any; // Persistent AI insights from previous generation
}

const STATUS_OPTIONS: CaseStatus[] = [
  "Not Reported",
  "Reported to 1930",
  "Reported on Portal",
  "FIR Filed",
  "Bank Reviewing",
  "Frozen",
  "Recovered",
  "Closed"
];

const STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  "Not Reported": { color: "bg-slate-100 text-slate-600", icon: Clock },
  "Reported to 1930": { color: "bg-blue-50 text-blue-600", icon: PhoneCall },
  "Reported on Portal": { color: "bg-indigo-50 text-indigo-600", icon: ExternalLink },
  "FIR Filed": { color: "bg-amber-50 text-amber-600", icon: Gavel },
  "Bank Reviewing": { color: "bg-violet-50 text-violet-600", icon: Landmark },
  "Frozen": { color: "bg-red-50 text-red-600", icon: ShieldAlert },
  "Recovered": { color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  "Closed": { color: "bg-slate-200 text-slate-700", icon: FileText },
};

/**
 * Intelligent Next Action Engine
 * Logic based on Indian Government 2026 Updated Recovery Systems
 */
function getNextAction(incidentId: string, status: CaseStatus): string {
  const incident = INCIDENT_PATHS.find(p => p.id === incidentId);
  const category = incident?.category;

  if (category === 'Financial Fraud') {
    switch (status) {
      case "Not Reported": return "Call 1930 immediately (Golden Hour).";
      case "Reported to 1930": return "File complaint on National Cyber Crime Portal.";
      case "Reported on Portal": return "Visit local police station and file FIR (Zero FIR allowed).";
      case "FIR Filed": return "Follow up with bank nodal officer within 7 days.";
      case "Bank Reviewing": return "Escalate to RBI Ombudsman after 30 days if unresolved.";
      case "Recovered": return "Confirm closure and collect written bank confirmation.";
      default: return "Monitor status and maintain evidence logs.";
    }
  }

  if (category === 'Consumer Dispute') {
    switch (status) {
      case "Not Reported": return "Send written complaint to seller.";
      case "Reported on Portal": return "Call National Consumer Helpline (1915).";
      case "FIR Filed": return "File case via e-Jagriti.";
      default: return "Follow up with mediation if no response in 15 days.";
    }
  }

  // Default fallback for other categories
  switch (status) {
    case "Not Reported": return "Gather all screenshots and evidence immediately.";
    case "Reported on Portal": return "Note acknowledgement number and wait for IO assignment.";
    case "FIR Filed": return "Check investigation status with the local Cyber Cell.";
    default: return "Continue monitoring official portals for updates.";
  }
}

export const CaseTracker: React.FC = () => {
  const [cases, setCases] = useState<RecoveryCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    incident_id: INCIDENT_PATHS[0].id,
    status: "Not Reported" as CaseStatus,
    complaint_id: "",
    portal: "",
    amount: ""
  });

  useEffect(() => {
    fetchCases();
  }, []);

 const fetchCases = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('recovery_cases')
      .select('*')
      .eq('user_id', user.id)   // 👈 VERY IMPORTANT
      .order('created_at', { ascending: false });

    if (error) throw error;

    setCases(data || []);
  } catch (err) {
    console.error("Error fetching cases:", err);
  } finally {
    setLoading(false);
  }
};


  const handleAdd = async () => {
    if (!form.complaint_id || !form.amount) {
      alert("Please fill in Complaint ID and Amount.");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const next_action = getNextAction(form.incident_id, form.status);

      const { data, error } = await supabase
        .from('recovery_cases')
        .insert({
          user_id: user.id,
          incident_id: form.incident_id,
          status: form.status,
          complaint_id: form.complaint_id,
          amount: Number(form.amount),
          portal: form.portal,
          next_action
        })
        .select()
        .single();

      if (error) throw error;
      setCases([data, ...cases]);
      setForm({ ...form, complaint_id: "", portal: "", amount: "" });
      setIsAdding(false);
    } catch (err) {
      console.error("Error adding case:", err);
      alert("Failed to sync with cloud. Check console for details.");
    }
  };

  const handleUpdateStatus = async (caseId: string, newStatus: CaseStatus) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase) return;

    const next_action = getNextAction(targetCase.incident_id, newStatus);

    try {
      const { error } = await supabase
        .from('recovery_cases')
        .update({
          status: newStatus,
          next_action,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;
      
      setCases(cases.map(c => 
        c.id === caseId ? { ...c, status: newStatus, next_action } : c
      ));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (caseId: string) => {
    if (!confirm('Permanently delete this case record from your secure vault?')) return;
    
    try {
      const { error } = await supabase
        .from('recovery_cases')
        .delete()
        .eq('id', caseId);

      if (error) throw error;
      setCases(cases.filter(c => c.id !== caseId));
    } catch (err) {
      console.error("Error deleting case:", err);
    }
  };

  const handleGetAIInsight = async (caseId: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase) return;

    setAnalyzingId(caseId);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Incident Type: ${targetCase.incident_id}
        Complaint ID: ${targetCase.complaint_id}
        Portal Used: ${targetCase.portal}
        Loss Amount: ₹${targetCase.amount}
        Current Status: ${targetCase.status}
      `;

      const systemInstruction = `
        You are an AI Legal & Financial Fraud Assistance Engine for Indian users.
        Classify the incident, suggest correct case status, and provide recovery roadmaps following Indian law.
        Return ONLY valid JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              risk_level: { type: Type.STRING },
              why_this_action: { type: Type.STRING },
              urgent_flag: { type: Type.BOOLEAN },
              official_portal: { type: Type.STRING },
              helpline: { type: Type.STRING },
              legal_step: { type: Type.STRING },
              evidence_to_collect: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["risk_level", "why_this_action", "urgent_flag", "official_portal", "helpline", "legal_step", "evidence_to_collect"]
          }
        }
      });

      const insightData = JSON.parse(response.text || "{}");
      
      // Update local and remote with the insight
      const { error } = await supabase
        .from('recovery_cases')
        .update({ aiInsight: insightData })
        .eq('id', caseId);

      if (!error) {
        setCases(cases.map(c => c.id === caseId ? { ...c, aiInsight: insightData } : c));
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
      alert("AI engine busy. Please try manual updates.");
    } finally {
      setAnalyzingId(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Accessing Secure Vault</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-32 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">CASE TRACKER</h2>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Unified Incident Management</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {isAdding ? <X size={24} /> : <Plus size={24} />}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border-2 border-indigo-600 rounded-[3rem] p-10 shadow-2xl space-y-6">
          <h3 className="text-xl font-black text-slate-900">New Recovery Entry</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Incident Category</label>
              <select
                className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold focus:border-indigo-600 outline-none transition-all appearance-none"
                value={form.incident_id}
                onChange={e => setForm({ ...form, incident_id: e.target.value })}
              >
                {INCIDENT_PATHS.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
              <select
                className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold focus:border-indigo-600 outline-none transition-all appearance-none"
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as CaseStatus })}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Complaint ID"
                className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm"
                value={form.complaint_id}
                onChange={e => setForm({ ...form, complaint_id: e.target.value })}
              />
              <input
                type="number"
                placeholder="Loss (₹)"
                className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <input
              placeholder="Filing Portal (Name or URL)"
              className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-sm"
              value={form.portal}
              onChange={e => setForm({ ...form, portal: e.target.value })}
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Start Cloud Tracking
          </button>
        </div>
      )}

      {cases.length === 0 && !isAdding && (
        <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-24 text-center">
          <ShieldCheck size={80} className="mx-auto text-slate-200" />
          <p className="text-slate-400 font-bold mt-6 text-lg">Your recovery vault is empty.</p>
        </div>
      )}

      <div className="space-y-6">
        {cases.map(c => {
          const incident = INCIDENT_PATHS.find(p => p.id === c.incident_id);
          const statusConfig = STATUS_CONFIG[c.status] || STATUS_CONFIG["Closed"];
          const StatusIcon = statusConfig.icon;
          const isAnalyzing = analyzingId === c.id;

          const highlightNextAction = c.next_action.includes("1930") || c.next_action.includes("immediately");
          const showPoliceIcon = c.next_action.includes("FIR");
          const showWarningIcon = c.next_action.includes("Escalate");

          return (
            <div key={c.id} className={`bg-white border-2 rounded-[3rem] shadow-xl overflow-hidden transition-all hover:shadow-2xl ${c.aiInsight?.urgent_flag ? 'border-red-500 ring-4 ring-red-50' : 'border-slate-200'}`}>
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${statusConfig.color}`}>
                      <StatusIcon size={14} />
                      {c.status}
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 leading-tight">{incident?.title || c.incident_id}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ACK: {c.complaint_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-indigo-600">₹{c.amount.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Recovery Value</p>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 rounded-[2rem] border-2 border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    {showPoliceIcon ? <Gavel size={60} /> : showWarningIcon ? <ShieldAlert size={60} /> : <History size={60} />}
                  </div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Automated Next Step</p>
                  <p className={`text-lg font-black leading-tight ${highlightNextAction ? 'text-red-400' : 'text-white'}`}>
                    {c.next_action}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Update Case Progress</label>
                  <select
                    className="w-full p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-xs"
                    value={c.status}
                    onChange={(e) => handleUpdateStatus(c.id, e.target.value as CaseStatus)}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {c.aiInsight && (
                  <div className="bg-indigo-50 border-2 border-indigo-100 rounded-[2rem] p-6 space-y-4 animate-in">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Sparkles size={18} />
                      <h5 className="font-black text-xs uppercase tracking-widest">AI Strategic Insight</h5>
                    </div>
                    <p className="text-xs font-bold text-indigo-900 leading-relaxed italic">"{c.aiInsight.why_this_action}"</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black border border-indigo-100 uppercase">Risk: {c.aiInsight.risk_level}</span>
                      <span className="bg-white px-3 py-1 rounded-lg text-[9px] font-black border border-indigo-100 uppercase">Helpline: {c.aiInsight.helpline}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    disabled={isAnalyzing}
                    onClick={() => handleGetAIInsight(c.id)}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    {isAnalyzing ? "Analyzing..." : "AI Insight"}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-4 bg-red-50 text-red-600 rounded-2xl border-2 border-red-100 hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
