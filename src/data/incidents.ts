import { IncidentCategory, IncidentPath } from '../types';

/* ======================================================
   Shared helper text (keeps consistency everywhere)
====================================================== */

const GOLDEN_HOUR =
  'Call 1930 within the first 2 hours (Golden Hour). Fast reporting can freeze funds across banks and greatly improves recovery chances.';

const ZERO_FIR =
  'You can file a Zero FIR at ANY police station under Bharatiya Nyaya Sanhita (BNS). Police must register it even if the crime occurred elsewhere.';

const CYBER_PORTAL = {
  name: 'National Cyber Crime Reporting Portal',
  url: 'https://www.cybercrime.gov.in',
  description: 'Official Government of India portal for reporting all cyber and financial frauds.'
};

const E_JAGRITI = {
  name: 'e-Jagriti',
  url: 'https://e-jagriti.gov.in',
  description: 'New integrated consumer court platform supporting e-filing, video hearings and e-Notices.'
};

const E_DAAKHIL = {
  name: 'e-Daakhil',
  url: 'https://edaakhil.nic.in',
  description: 'Existing online consumer court filing portal.'
};


/* ======================================================
   MASTER INCIDENT PATHS
====================================================== */

export const INCIDENT_PATHS: IncidentPath[] = [

/* ======================================================
   FINANCIAL FRAUDS (BANKING / UPI CORE)
====================================================== */


{
  id: 'wallet-sim-swap',
  category: IncidentCategory.FINANCIAL_FRAUD,
  title: 'SIM Swap / Identity Theft / Wallet Fraud',
  summary:
    'Sudden loss of mobile network followed by OTP activity or unauthorized transactions. This is identity theft. Act immediately — the first 2 hours (Golden Hour) are critical.',

  immediateActions: [
    {
      id: '1',
      title: 'Call 1930 within 2 hours (Golden Hour)',
      description:
        'This connects to the national fraud freeze system. Reporting fast gives the highest chance of recovering money.',
      isEmergency: true,
      type: 'immediate'
    },
    {
      id: '2',
      title: 'Block SIM with telecom + freeze bank/UPI access',
      description: 'Stop both identity misuse and financial access immediately.',
      type: 'immediate'
    },
    {
      id: '3',
      title: 'Report on National Cyber Crime Portal',
      description: 'Creates official legal record and starts investigation.',
      type: 'immediate'
    }
  ],

  protectionProtocol: [
    'Change all passwords immediately',
    'Enable 2FA on every account',
    'Never share OTP with anyone',
    'Check unknown SIMs linked to your Aadhaar using Sanchar Saathi'
  ],

  officialPortal: {
    name: 'National Cyber Crime Reporting Portal',
    url: 'https://www.cybercrime.gov.in',
    description: 'Official government fraud reporting system'
  },

  additionalPortals: [
    {
      name: 'Sanchar Saathi (TAFCOP)',
      url: 'https://sancharsaathi.gov.in',
      description:
        'Check how many SIM cards are issued in your name and block fraudulent ones instantly.'
    }
  ],

  firSteps: [
    'Carry bank statement and fraud timeline',
    'Carry telecom/SIM details',
    'File Zero FIR at ANY police station under Bharatiya Nyaya Sanhita (BNS). Police must register even outside jurisdiction'
  ],

  preparedChecklist: [
    'Transaction IDs',
    'SIM details',
    'ID proof',
    'Screenshots'
  ],

  escalationLadder: [
    {
      level: 1,
      authority: 'Cyber Cell',
      condition: 'Primary reporting',
      link: 'https://www.cybercrime.gov.in',
      linkText: 'File Complaint'
    }
  ],

  secondaryExploitationWarning:
    'Never trust recovery agents or remote help apps. Government services are always free.'
},


/* =========================================================
   CONSUMER DISPUTE (Updated to e-Jagriti)
========================================================= */

{
  id: 'product-refund-dispute',
  category: IncidentCategory.CONSUMER_DISPUTE,
  title: 'Refund / Defective Product / Service Issue',

  summary:
    'Company refusing refund or warranty support. Don’t worry — consumer courts are designed to be simple and citizen-friendly.',

  immediateActions: [
    {
      id: '1',
      title: 'Send written complaint + save evidence',
      description: 'Email or ticket. Keep invoice, photos, chats.',
      type: 'immediate'
    },
    {
      id: '2',
      title: 'Call 1915 or file on National Consumer Helpline',
      description: 'Free government mediation step.',
      type: 'immediate'
    },
    {
      id: '3',
      title: 'File case on e-Jagriti (Integrated Consumer Court Platform)',
      description:
        'Unified system with e-filing, video hearings and e-Notices. e-Daakhil is now part of this platform.',
      type: 'immediate'
    }
  ],

  officialPortal: {
    name: 'National Consumer Helpline',
    url: 'https://consumerhelpline.gov.in',
    description: 'Free government mediation (1915)'
  },

  additionalPortals: [
    {
      name: 'e-Jagriti Consumer Platform (Integrated)',
      url: 'https://e-jagriti.gov.in',
      description:
        'Unified consumer court system. Handles filing, VC hearings and notices. e-Daakhil operates inside this ecosystem.'
    },
    {
      name: 'e-Daakhil (Module)',
      url: 'https://edaakhil.nic.in',
      description: 'Online filing module inside e-Jagriti'
    }
  ],

  firSteps: [
    'Consumer disputes are civil matters',
    'Police FIR usually not required',
    'If criminal cheating, you can still file Zero FIR at any station under BNS'
  ],

  preparedChecklist: [
    'Invoice copy',
    'Photos',
    'Emails',
    'Chats'
  ],

  escalationLadder: [
    {
      level: 1,
      authority: 'NCH Mediation',
      condition: 'First step',
      link: 'https://consumerhelpline.gov.in',
      linkText: 'File Complaint'
    },
    {
      level: 2,
      authority: 'e-Jagriti Consumer Court',
      condition: 'If mediation fails',
      link: 'https://e-jagriti.gov.in',
      linkText: 'File Case'
    }
  ],

  secondaryExploitationWarning:
    'Never pay private “refund agents”. All government portals are free.'
},


/* =========================================================
   NEW 2026 HIGH IMPACT SCAMS
========================================================= */

{
  id: 'ai-voice-video-cloning',
  category: IncidentCategory.FINANCIAL_FRAUD,
  title: 'AI Voice / Video Cloning – Relative in Distress Scam',

  summary:
    'Scammers use AI to mimic your relative’s voice/video and ask for emergency money. Stay calm — verify first.',

  immediateActions: [
    {
      id: '1',
      title: 'Do NOT send money immediately',
      description: 'Pause. Verify through another family member or direct call.',
      isEmergency: true,
      type: 'immediate'
    },
    {
      id: '2',
      title: 'Save call recordings/screenshots',
      description: 'Important evidence.',
      type: 'immediate'
    },
    {
      id: '3',
      title: 'Report to 1930 or Cyber Portal',
      description: 'Report quickly if payment already sent.',
      type: 'immediate'
    }
  ],

  protectionProtocol: [
    'Always verify emergencies independently',
    'Use family safety codes',
    'Avoid sharing personal data publicly'
  ],

  officialPortal: {
    name: 'National Cyber Crime Reporting Portal',
    url: 'https://www.cybercrime.gov.in',
    description: 'Official reporting portal'
  },

  firSteps: [
    'Carry call logs and evidence',
    'File Zero FIR under BNS if needed'
  ],

  preparedChecklist: ['Screenshots', 'Numbers used', 'Payment proof'],

  escalationLadder: [],

  secondaryExploitationWarning:
    'AI voice cloning is rising rapidly. Always verify before sending money.'
}
,
{
  id: 'upi-card-fraud',
  category: IncidentCategory.FINANCIAL_FRAUD,
  title: 'UPI / Debit / Credit Card Fraud',
  summary: 'Unauthorized money transfer from your bank or card. Act fast — quick action can save funds.',

  immediateActions: [
    { id:'1', title:'Call 1930 immediately', description:GOLDEN_HOUR, isEmergency:true, type:'immediate' },
    { id:'2', title:'Block cards/UPI/wallet with bank', description:'Disable all digital payments and get reference number.', type:'immediate' },
    { id:'3', title:'Report on National Cyber Crime Portal', description:'Register official complaint and upload evidence.', type:'immediate' }
  ],

  protectionProtocol:['Save screenshots','Change passwords','Enable 2FA'],

  officialPortal: CYBER_PORTAL,

  firSteps:['Carry bank statement and evidence', ZERO_FIR],

  preparedChecklist:['Transaction IDs','Screenshots','ID proof'],

  escalationLadder:[],

  secondaryExploitationWarning:'Do not pay recovery agents.'
},

/* ======================================================
   INVESTMENT / PONZI / MLM
====================================================== */

{
  id: 'investment-ponzi-mlm-scam',
  category: IncidentCategory.FINANCIAL_FRAUD,
  title: 'Investment / Ponzi / MLM / Chit Fund Scam',
  summary: 'Fake investment plans, Ponzi chains, MLM schemes, chit funds, crypto or trading apps promising guaranteed or very high returns. These schemes use trust and referrals to trap money and usually stop withdrawals suddenly. Stay calm — quick reporting can still help freeze funds.',

  immediateActions: [
    {
      id: '1',
      title: 'Call 1930 immediately (within 2 hours – Golden Hour) to freeze funds',
      description: 'This is the most important step. The national helpline connects directly with banks to stop or trace transactions. Call immediately before money moves further.',
      isEmergency: true,
      type: 'immediate'
    },
    {
      id: '2',
      title: 'Contact your bank and block cards/UPI/wallet/net banking',
      description: 'Prevent any further debits or auto-payments linked to the scam platform. Ask for a complaint reference number.',
      type: 'immediate'
    },
    {
      id: '3',
      title: 'File complaint on National Cyber Crime Portal and register FIR (Zero FIR allowed)',
      description: 'Report at cybercrime.gov.in or ANY police station. Under Bharatiya Nyaya Sanhita (BNS), you can file a Zero FIR anywhere even if the crime happened elsewhere.',
      type: 'immediate'
    }
  ],

  protectionProtocol: [
    'Never trust guaranteed or fixed return promises',
    'Avoid schemes requiring referrals or member recruitment',
    'Verify brokers/investment advisors on SEBI/RBI/MCA websites before investing',
    'Never share Aadhaar, PAN, OTP or screen access with anyone',
    'Avoid Telegram/WhatsApp trading or crypto tip groups',
    'Do not send more money to “unlock” or “recover” previous losses'
  ],

  officialPortal: {
    name: 'National Cyber Crime Reporting Portal',
    url: 'https://www.cybercrime.gov.in',
    description: 'Primary and fastest government portal for reporting financial fraud and initiating fund freeze requests.'
  },

  additionalPortals: [
    {
      name: 'SEBI SCORES',
      url: 'https://scores.sebi.gov.in',
      description: 'Report illegal brokers, trading apps, and fake investment advisors for regulatory action.'
    },
    {
      name: 'RBI Sachet Portal',
      url: 'https://sachet.rbi.org.in',
      description: 'Report unauthorized deposit schemes, chit funds, and illegal lending/investment entities.'
    },
    {
      name: 'National Consumer Helpline (NCH)',
      url: 'https://consumerhelpline.gov.in',
      description: 'Helpful for mediation and guidance if a registered company/platform refuses refund or service.'
    },
    {
      name: 'e-Jagriti (Consumer Commission Platform)',
      url: 'https://e-jagriti.gov.in',
      description: 'Integrated online platform for filing consumer legal cases, virtual hearings, and e-notices for recovery of money from registered entities.'
    }
  ],

  sectorOptions: [
    {
      id: 'sebi-regulator',
      title: 'Report Investment/Trading Platform to SEBI',
      description: 'Helps regulators investigate and shut down illegal brokers or advisory services.',
      link: 'https://scores.sebi.gov.in',
      linkText: 'File SEBI Complaint'
    },
    {
      id: 'rbi-regulator',
      title: 'Report Deposit/Chit Fund Scheme to RBI Sachet',
      description: 'For unauthorized deposit or chit fund operations.',
      link: 'https://sachet.rbi.org.in',
      linkText: 'Report to RBI Sachet'
    }
  ],

  firSteps: [
    'Carry bank statement showing all transfers',
    'Carry screenshots of app/website, ads, or guaranteed return promises',
    'Carry chats/Telegram group details and referral links',
    'Clearly state “Ponzi Scheme / MLM Fraud / Cheating / Financial Cyber Crime”',
    'Request written CSR/FIR acknowledgment copy',
    'You can file a Zero FIR at ANY police station under Bharatiya Nyaya Sanhita (BNS)'
  ],

  preparedChecklist: [
    'Transaction IDs / UTR numbers',
    'App or website name and link',
    'Screenshots of ads/promises',
    'Payment receipts or bank statement',
    'Chat/group evidence and contact numbers'
  ],

  escalationLadder: [
    {
      level: 1,
      authority: 'Cyber Cell / FIR',
      condition: 'Mandatory first step for criminal financial fraud and fund recovery.',
      link: 'https://www.cybercrime.gov.in',
      linkText: 'File Cyber Report'
    },
    {
      level: 2,
      authority: 'SEBI / RBI Regulators',
      condition: 'If the platform claims to be an investment, trading, NBFC, or deposit scheme.',
      link: 'https://scores.sebi.gov.in',
      linkText: 'Regulatory Complaint'
    },
    {
      level: 3,
      authority: 'NCH → e-Jagriti Consumer Case',
      condition: 'If a registered company refuses refund or you need legal recovery of funds.',
      link: 'https://e-jagriti.gov.in',
      linkText: 'File Consumer Case'
    },
    {
      level: 4,
      authority: 'Superintendent of Police (SP)',
      condition: 'If FIR is refused or no action is taken locally.',
      link: 'https://www.cybercrime.gov.in',
      linkText: 'Escalate FIR Refusal'
    }
  ],

  secondaryExploitationWarning:
    'Beware of “fund recovery agents”, crypto recovery services, or private hackers promising to get your money back for a fee. These are secondary scams. Government complaint systems are free.'
}

,

/* ======================================================
   LOAN APP HARASSMENT
====================================================== */
{
  id:'loan-app-harassment',
  category:IncidentCategory.FINANCIAL_FRAUD,
  title:'Loan App Harassment / Data Blackmail',
  summary:'Illegal apps steal contacts/photos and threaten you for money.',

  immediateActions:[
    {id:'1',title:'Freeze bank access',description:'Block cards/UPI immediately.',isEmergency:true,type:'immediate'},
    {id:'2',title:'Uninstall app & revoke permissions',description:'Remove access to contacts/gallery.',type:'immediate'},
    {id:'3',title:'Report on Cyber Crime Portal',description:'Start legal action.',type:'immediate'}
  ],

  protectionProtocol:['Block numbers','Do not pay','Save threats'],

  officialPortal:CYBER_PORTAL,

  firSteps:['Carry screenshots', ZERO_FIR],

  preparedChecklist:['App name','Screenshots','Call logs'],

  escalationLadder:[],

  secondaryExploitationWarning:'Courts never send WhatsApp notices.'
},

/* ======================================================
   REMOTE ACCESS / CUSTOMER CARE
====================================================== */

{
  id:'remote-access-scam',
  category:IncidentCategory.FINANCIAL_FRAUD,
  title:'Fake Customer Care / AnyDesk / Screen Sharing Scam',
  summary:'Scammers ask you to install remote apps and control your phone.',

  immediateActions:[
    {id:'1',title:'Disconnect internet & uninstall app',description:'Stop control immediately.',isEmergency:true,type:'immediate'},
    {id:'2',title:'Call 1930',description:GOLDEN_HOUR,type:'immediate'},
    {id:'3',title:'Report on portal',description:'File complaint.',type:'immediate'}
  ],

  protectionProtocol:['Never install remote apps','Banks never ask screen share'],

  officialPortal:CYBER_PORTAL,

  firSteps:['Carry transaction details', ZERO_FIR],

  preparedChecklist:['App name','Screenshots'],

  escalationLadder:[],

  secondaryExploitationWarning:'Banks never ask AnyDesk.'
},

/* ======================================================
   DIGITAL ARREST / IMPERSONATION
====================================================== */

{
  id:'digital-arrest-scam',
  category:IncidentCategory.FINANCIAL_FRAUD,
  title:'Police/CBI Digital Arrest Scam',
  summary:'Fake officers threaten you over video call and demand money.',

  immediateActions:[
    {id:'1',title:'Disconnect call immediately',description:'Do not stay on call.',isEmergency:true,type:'immediate'},
    {id:'2',title:'Do NOT pay money',description:'Government never asks payment.',type:'immediate'},
    {id:'3',title:'Report on portal',description:'File complaint.',type:'immediate'}
  ],

  protectionProtocol:['Police never demand money','No digital arrest exists'],

  officialPortal:CYBER_PORTAL,

  firSteps:['Carry call logs/screenshots', ZERO_FIR],

  preparedChecklist:['Phone numbers','Proof'],

  escalationLadder:[],

  secondaryExploitationWarning:'Threat calls are scams.'
},

/* ======================================================
   AI VOICE / VIDEO CLONING
====================================================== */

{
  id:'ai-voice-clone-scam',
  category:IncidentCategory.FINANCIAL_FRAUD,
  title:'AI Voice/Video Cloning – Relative in Distress',
  summary:'Scammers clone voices/videos and urgently ask for money.',

  immediateActions:[
    {id:'1',title:'Verify with real person first',description:'Call known number.',isEmergency:true,type:'immediate'},
    {id:'2',title:'If paid, call 1930',description:GOLDEN_HOUR,type:'immediate'},
    {id:'3',title:'Report on portal',description:'File complaint.',type:'immediate'}
  ],

  protectionProtocol:['Never trust urgent calls','Set family code words'],

  officialPortal:CYBER_PORTAL,

  firSteps:['Carry chats/screenshots', ZERO_FIR],

  preparedChecklist:['Call logs','Payments'],

  escalationLadder:[],

  secondaryExploitationWarning:'AI voices are easy to fake.'
},

/* ======================================================
   OLX / MARKETPLACE
====================================================== */

{
  id:'olx-marketplace-scam',
  category:IncidentCategory.FINANCIAL_FRAUD,
  title:'OLX / Marketplace / Courier Scam',
  summary:'Fake buyers or sellers trick you into paying advance or scanning QR.',

  immediateActions:[
    {id:'1',title:'Call 1930',description:GOLDEN_HOUR,isEmergency:true,type:'immediate'},
    {id:'2',title:'Disable UPI temporarily',description:'Stop further requests.',type:'immediate'},
    {id:'3',title:'Report on portal',description:'File complaint.',type:'immediate'}
  ],

  protectionProtocol:['Never pay advance','QR always means PAY'],

  officialPortal:CYBER_PORTAL,

  firSteps:['Carry chats & UTR', ZERO_FIR],

  preparedChecklist:['Order details','Screenshots'],

  escalationLadder:[],

  secondaryExploitationWarning:'Army/parcel stories are common scams.'
},

/* ======================================================
   FAKE APP / APK MALWARE
====================================================== */

{
  id:'fake-app-malware-scam',
  category:IncidentCategory.FINANCIAL_FRAUD,
  title:'Fake App / APK / Banking Malware Scam',
  summary:'Malicious apps steal OTP and banking access.',

  immediateActions:[
    {id:'1',title:'Uninstall app & disconnect internet',description:'Stop malware immediately.',isEmergency:true,type:'immediate'},
    {id:'2',title:'Call 1930',description:GOLDEN_HOUR,type:'immediate'},
    {id:'3',title:'Change passwords',description:'Secure all accounts.',type:'immediate'}
  ],

  protectionProtocol:['Install apps only from Play Store','Avoid APK links'],

  officialPortal:CYBER_PORTAL,

  firSteps:['Carry installed app info', ZERO_FIR],

  preparedChecklist:['App name','Transactions'],

  escalationLadder:[],

  secondaryExploitationWarning:'Banks never send APK files.'
},

/* ======================================================
   IDENTITY THEFT
====================================================== */

{
  id:'identity-theft-scam',
  category:IncidentCategory.FINANCIAL_FRAUD,
  title:'Identity Theft / Aadhaar or PAN Misuse',
  summary:'Loans/SIMs/accounts opened using your identity without consent.',

  immediateActions:[
    {id:'1',title:'Call 1930 if financial loss',description:GOLDEN_HOUR,isEmergency:true,type:'immediate'},
    {id:'2',title:'Freeze accounts & inform bank',description:'Prevent further misuse.',type:'immediate'},
    {id:'3',title:'Report on portal',description:'Register identity theft complaint.',type:'immediate'}
  ],

  protectionProtocol:['Monitor CIBIL','Avoid sharing ID copies'],

  officialPortal:CYBER_PORTAL,

  firSteps:['Carry KYC misuse proof', ZERO_FIR],

  preparedChecklist:['Credit report','Loan details'],

  escalationLadder:[],

  secondaryExploitationWarning:'Never share Aadhaar freely.'
},

/* ======================================================
   CONSUMER DISPUTE (UPDATED 2026)
====================================================== */

{
  id:'consumer-refund',
  category:IncidentCategory.CONSUMER_DISPUTE,
  title:'Refund / E-commerce / Service Dispute',
  summary:'If seller denies refund or service, government mediation and courts are available.',

  immediateActions:[
    {id:'1',title:'Save evidence & send written complaint',description:'Create proof first.',type:'immediate'},
    {id:'2',title:'File complaint with National Consumer Helpline (1915)',description:'Free mediation.',type:'immediate'},
    {id:'3',title:'File legal case via e-Daakhil or e-Jagriti',description:'Online consumer court filing.',type:'immediate'}
  ],

  officialPortal:{
    name:'National Consumer Helpline',
    url:'https://consumerhelpline.gov.in',
    description:'Primary mediation platform.'
  },

  additionalPortals:[E_DAAKHIL, E_JAGRITI],

  firSteps:['Consumer matters are civil disputes.', ZERO_FIR],

  preparedChecklist:['Invoice','Photos','Chats'],

  escalationLadder:[],

  secondaryExploitationWarning:'Use only official portals.'
}

];
