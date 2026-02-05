
export enum IncidentCategory {
  CYBER_CRIME = 'Cybercrime',
  FINANCIAL_FRAUD = 'Financial Fraud',
  MATRIMONY_SCAM = 'Matrimony Scam',
  CONSUMER_DISPUTE = 'Consumer Dispute',
  WOMEN_SAFETY = 'Women Safety & Rights',
  IDENTITY_THEFT = 'Identity Theft'
}

export interface ActionStep {
  id: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  isEmergency?: boolean;
  type: 'immediate' | 'filing' | 'followup';
}

export interface EscalationLevel {
  level: number;
  authority: string;
  condition: string;
  contact?: string;
  link?: string;
  linkText?: string;
}

export interface SectorOption {
  id: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
}

export interface IncidentPath {
  id: string;
  category: IncidentCategory;
  title: string;
  summary: string;
  immediateActions: ActionStep[];
  protectionProtocol?: string[];
  officialPortal: {
    name: string;
    url: string;
    description: string;
  };
  additionalPortals?: {
    name: string;
    url: string;
    description: string;
  }[];
  sectorOptions?: SectorOption[];
  firSteps: string[];
  preparedChecklist: string[];
  escalationLadder: EscalationLevel[];
  secondaryExploitationWarning: string;
}

export type AppState = 'HOME' | 'CATEGORY_DETAIL' | 'ACTION_DASHBOARD' | 'RIGHTS' | 'CHECKLIST' | 'ABOUT';
