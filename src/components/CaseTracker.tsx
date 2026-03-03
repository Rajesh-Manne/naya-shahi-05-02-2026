import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  Plus,
  Trash2,
  History,
  CheckCircle2,
  Clock,
  X,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Loader2,
  ShieldAlert,
  PhoneCall,
  Gavel,
  Landmark,
  FileText,
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { INCIDENT_PATHS } from "../../src/data/incidents";

/* =========================
   GLOBAL AUTH GATE
========================= */
const requireAuth = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = "/login";
    return null;
  }

  return user;
};

/* =========================
   TYPES
========================= */
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
  aiInsight?: any;
}

/* =========================
   STATUS CONFIG
========================= */
const STATUS_OPTIONS: CaseStatus[] = [
  "Not Reported",
  "Reported to 1930",
  "Reported on Portal",
  "FIR Filed",
  "Bank Reviewing",
  "Frozen",
  "Recovered",
  "Closed",
];

const STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  "Not Reported": { color: "bg-slate-100 text-slate-600", icon: Clock },
  "Reported to 1930": { color: "bg-blue-50 text-blue-600", icon: PhoneCall },
  "Reported on Portal": {
    color: "bg-indigo-50 text-indigo-600",
    icon: ExternalLink,
  },
  "FIR Filed": { color: "bg-amber-50 text-amber-600", icon: Gavel },
  "Bank Reviewing": { color: "bg-violet-50 text-violet-600", icon: Landmark },
  Frozen: { color: "bg-red-50 text-red-600", icon: ShieldAlert },
  Recovered: { color: "bg-emerald-50 text-emerald-600", icon: CheckCircle2 },
  Closed: { color: "bg-slate-200 text-slate-700", icon: FileText },
};

/* =========================
   NEXT ACTION ENGINE
========================= */
function getNextAction(incidentId: string, status: CaseStatus): string {
  const incident = INCIDENT_PATHS.find((p) => p.id === incidentId);
  const category = incident?.category;

  if (category === "Financial Fraud") {
    switch (status) {
      case "Not Reported":
        return "Call 1930 immediately (Golden Hour).";
      case "Reported to 1930":
        return "File complaint on National Cyber Crime Portal.";
      case "Reported on Portal":
        return "Visit local police station and file FIR.";
      case "FIR Filed":
        return "Follow up with bank nodal officer.";
      case "Bank Reviewing":
        return "Escalate to RBI Ombudsman.";
      case "Recovered":
        return "Collect written bank confirmation.";
      default:
        return "Monitor status and maintain evidence.";
    }
  }

  return "Continue monitoring official portals.";
}

/* =========================
   COMPONENT
========================= */
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
    amount: "",
  });

  /* =========================
     FETCH CASES
  ========================= */
  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const user = await requireAuth();
      if (!user) return;

      const { data, error } = await supabase
        .from("recovery_cases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ADD CASE
  ========================= */
  const handleAdd = async () => {
    const user = await requireAuth();
    if (!user) return;

    if (!form.complaint_id || !form.amount) return;

    const next_action = getNextAction(form.incident_id, form.status);

    const { data, error } = await supabase
      .from("recovery_cases")
      .insert({
        user_id: user.id,
        incident_id: form.incident_id,
        status: form.status,
        complaint_id: form.complaint_id,
        amount: Number(form.amount),
        portal: form.portal,
        next_action,
      })
      .select()
      .single();

    if (!error) {
      setCases([data, ...cases]);
      setIsAdding(false);
    }
  };

  /* =========================
     UPDATE STATUS
  ========================= */
  const handleUpdateStatus = async (caseId: string, newStatus: CaseStatus) => {
    const target = cases.find((c) => c.id === caseId);
    if (!target) return;

    const next_action = getNextAction(target.incident_id, newStatus);

    await supabase
      .from("recovery_cases")
      .update({
        status: newStatus,
        next_action,
        updated_at: new Date().toISOString(),
      })
      .eq("id", caseId);

    setCases(
      cases.map((c) =>
        c.id === caseId ? { ...c, status: newStatus, next_action } : c
      )
    );
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id: string) => {
    await supabase.from("recovery_cases").delete().eq("id", id);
    setCases(cases.filter((c) => c.id !== id));
  };

  /* =========================
     AI INSIGHT
  ========================= */
  const handleGetAIInsight = async (caseId: string) => {
    const user = await requireAuth();
    if (!user) return;

    const target = cases.find((c) => c.id === caseId);
    if (!target) return;

    setAnalyzingId(caseId);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `Case amount ${target.amount}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              risk_level: { type: Type.STRING },
              why_this_action: { type: Type.STRING },
              urgent_flag: { type: Type.BOOLEAN },
            },
            required: ["risk_level", "why_this_action", "urgent_flag"],
          },
        },
      });

      const insight = JSON.parse(response.text || "{}");

      await supabase
        .from("recovery_cases")
        .update({ aiInsight: insight })
        .eq("id", caseId);

      setCases(
        cases.map((c) => (c.id === caseId ? { ...c, aiInsight: insight } : c))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingId(null);
    }
  };

  /* =========================
     UI
  ========================= */
  if (loading)
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black">CASE TRACKER</h2>

      {cases.map((c) => {
        const incident = INCIDENT_PATHS.find((p) => p.id === c.incident_id);
        const StatusIcon = STATUS_CONFIG[c.status].icon;

        return (
          <div key={c.id} className="p-6 border rounded-2xl">
            <div className="flex justify-between">
              <div>
                <StatusIcon />
                <h3>{incident?.title}</h3>
              </div>
              <button onClick={() => handleDelete(c.id)}>
                <Trash2 />
              </button>
            </div>

            <button onClick={() => handleGetAIInsight(c.id)}>
              {analyzingId === c.id ? <Loader2 /> : <Sparkles />}
            </button>
          </div>
        );
      })}
    </div>
  );
};