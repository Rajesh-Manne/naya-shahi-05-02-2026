
import { IncidentCategory, IncidentPath } from '../types';

export const INCIDENT_PATHS: IncidentPath[] = [
  // --- FINANCIAL FRAUDS ---
  {
    id: 'upi-card-fraud',
    category: IncidentCategory.FINANCIAL_FRAUD,
    title: 'UPI / Debit / Credit Card Fraud',
    summary: 'Criminal unauthorized fund transfer from your bank account or credit/debit card. Act now to freeze the funds before they leave the banking system.',
    immediateActions: [
      { 
        id: '1', 
        title: 'Call 1930 immediately to report fraud and trigger fund freeze', 
        description: 'National Cyber Crime Helpline. Call now to block the stolen money from leaving the banking system. This is the "Golden Hour" response.', 
        isEmergency: true, 
        type: 'immediate' 
      },
      { 
        id: '2', 
        title: 'Contact your bank and block cards, UPI, and wallet access', 
        description: 'Notify your bank\'s fraud department to block all digital access and request an acknowledgment/reference number for your request.', 
        type: 'immediate' 
      },
      { 
        id: '3', 
        title: 'File a complaint on the National Cyber Crime Reporting Portal or visit Cyber Cell/Police to register FIR', 
        description: 'Official legal reporting is mandatory. Visit cybercrime.gov.in or the nearest Cyber Cell to initiate a formal criminal investigation.', 
        type: 'immediate' 
      }
    ],
    protectionProtocol: [
      'Save screenshots of all fraud SMS, payment alerts, and chat messages',
      'Keep a record of all Transaction IDs (UTR or RRN numbers)',
      'Change all banking and email passwords immediately',
      'Enable 2-Factor Authentication (2FA) on all financial accounts'
    ],
    officialPortal: { 
      name: 'National Cyber Crime Reporting Portal', 
      url: 'https://www.cybercrime.gov.in', 
      description: 'The official government portal for reporting financial cyber crimes and tracking fund recovery.' 
    },
    firSteps: [
      'Download bank statement highlighting the fraud.',
      'Visit local Cyber Cell with a written chronology of events.',
      'Obtain an acknowledgment copy (CSR) or FIR copy.'
    ],
    preparedChecklist: [
      'Transaction ID / UTR Number',
      'Bank Statement showing fraud',
      'Identity Proof (Aadhar/Voter ID)',
      'Screenshot of Fraud Message/Link'
    ],
    escalationLadder: [
      { 
        level: 1, 
        authority: 'Bank Nodal Officer', 
        condition: 'If the bank does not provide a response or resolution within 48 hours.', 
        link: 'https://www.rbi.org.in/Scripts/AboutUsDisplay.aspx?pg=NodalOfficers.htm', 
        linkText: 'Find Nodal Officer' 
      },
      { 
        level: 2, 
        authority: 'RBI Ombudsman', 
        condition: 'If the claim is rejected or unresolved after 30 days.', 
        link: 'https://cms.rbi.org.in', 
        linkText: 'File RBI Complaint' 
      },
      { 
        level: 3, 
        authority: 'Superintendent of Police (SP)', 
        condition: 'If the local police station refuses to register your FIR for the crime.', 
        link: 'https://www.cybercrime.gov.in', 
        linkText: 'Report FIR Refusal' 
      }
    ],
    secondaryExploitationWarning: 'Never pay recovery agents or private cyber experts. Government services are free.'
  },
  {
    id: 'loan-app-harassment',
    category: IncidentCategory.FINANCIAL_FRAUD,
    title: 'Loan App Harassment',
    summary: 'Criminal extortion, blackmail, and data theft by illegal lending apps. This involves unauthorized bank debits and harassment of your contacts.',
    immediateActions: [
      { 
        id: '1', 
        title: 'Contact your bank and freeze cards/UPI/wallet immediately', 
        description: 'Scam apps often attempt unauthorized recurring debits. Stop all digital access from your bank app or helpline immediately.', 
        isEmergency: true, 
        type: 'immediate' 
      },
      { 
        id: '2', 
        title: 'Uninstall the loan app and revoke Contacts/Gallery/SMS permissions', 
        description: 'Remove the app from your device and go to Settings > App Permissions to ensure all data access is completely revoked.', 
        type: 'immediate' 
      },
      { 
        id: '3', 
        title: 'File a complaint on the National Cyber Crime Portal or visit Cyber Cell/Police Station', 
        description: 'Extortion and data misuse are criminal offences. Report immediately at cybercrime.gov.in to initiate legal action.', 
        type: 'immediate' 
      }
    ],
    protectionProtocol: [
      'Inform your contacts immediately that your data was stolen and to ignore scam messages',
      'Save screenshots of all threats, messages, and morphed photos as evidence',
      'Block all unknown or harassing numbers immediately; do not engage with scammers',
      'Do not pay any extortion amount; payment leads to further blackmail and more demands'
    ],
    officialPortal: { 
      name: 'National Cyber Crime Reporting Portal', 
      url: 'https://www.cybercrime.gov.in', 
      description: 'Primary official portal for reporting cyber extortion, data theft, and loan app harassment.' 
    },
    additionalPortals: [
      { 
        name: 'RBI Sachet Portal', 
        url: 'https://sachet.rbi.org.in', 
        description: 'Secondary regulatory report to help the RBI identify and block illegal lending entities.' 
      }
    ],
    sectorOptions: [
      {
        id: 'rbi-regulatory',
        title: 'Report Illegal Lending to RBI Sachet',
        description: 'Use this to help regulators ban the app and take action against unlicensed lenders.',
        link: 'https://sachet.rbi.org.in',
        linkText: 'Report to RBI Sachet'
      }
    ],
    firSteps: [
      'Carry screenshots of harassment messages and call logs to the station.',
      'Show evidence of unauthorized access to your gallery or contacts.',
      'Explicitly mention "Extortion" and "Identity Theft" in your complaint.'
    ],
    preparedChecklist: [
      'App Name and Play Store link (if still available)',
      'Screenshots of threats or morphed content',
      'Transaction details of any amount paid',
      'List of numbers used for harassment'
    ],
    escalationLadder: [
      { 
        level: 1, 
        authority: 'Cyber Cell / FIR', 
        condition: 'Mandatory first step for criminal extortion and data misuse.', 
        link: 'https://www.cybercrime.gov.in', 
        linkText: 'File Cyber Report' 
      },
      { 
        level: 2, 
        authority: 'Superintendent of Police (SP)', 
        condition: 'If harassment continues or the local station refuses to act on your report.', 
        link: 'https://www.cybercrime.gov.in', 
        linkText: 'Report Escalation' 
      },
      { 
        level: 3, 
        authority: 'RBI Sachet (Regulatory)', 
        condition: 'For formal regulatory action to ban the app and lending entity.', 
        link: 'https://sachet.rbi.org.in', 
        linkText: 'Regulatory Report' 
      }
    ],
    secondaryExploitationWarning: 'Ignore WhatsApp "legal notices" or threats. Courts never send summons only via WhatsApp. Never pay private recovery agents.'
  },
  {
    id: 'wallet-sim-swap',
    category: IncidentCategory.FINANCIAL_FRAUD,
    title: 'Wallet Fraud / SIM Swap',
    summary: 'Immediate loss of network signal followed by unauthorized transactions. This is a time-critical identity theft and financial fraud case.',
    immediateActions: [
      { 
        id: '1', 
        title: 'Call 1930 immediately to report fraud and initiate fund freeze', 
        description: 'National Cyber Crime Helpline. Report immediately to block funds across the banking ecosystem.', 
        isEmergency: true, 
        type: 'immediate' 
      },
      { 
        id: '2', 
        title: 'Contact your bank and freeze all cards, UPI, and wallet access', 
        description: 'Notify your bank immediately to block all digital transactions and request a reference number.', 
        type: 'immediate' 
      },
      { 
        id: '3', 
        title: 'Block your SIM with your telecom operator and file a complaint on the National Cyber Crime Portal or visit Cyber Cell/Police to register FIR', 
        description: 'Stop identity theft by deactivating the SIM, then report formally at cybercrime.gov.in or your nearest Cyber Cell.', 
        type: 'immediate' 
      }
    ],
    protectionProtocol: [
      'Save screenshots of all fraud SMS, network alerts, and transaction IDs',
      'Change all banking and email passwords immediately',
      'Enable 2-Factor Authentication (2FA) on all financial accounts',
      'Never share OTP with anyone under any circumstances',
      'Never install remote access apps (AnyDesk/TeamViewer)'
    ],
    officialPortal: { 
      name: 'National Cyber Crime Reporting Portal', 
      url: 'https://www.cybercrime.gov.in', 
      description: 'The only official government portal for reporting cybercrime and identity theft.' 
    },
    firSteps: [
      'Note the exact time your network signal went missing.',
      'Gather all SMS alerts received before the signal loss.',
      'Obtain the CSR or FIR acknowledgment from the Cyber Cell.'
    ],
    preparedChecklist: [
      'Last valid transaction time',
      'Identity Proof (Aadhar)',
      'Telecom account details',
      'Screenshots of unauthorized transactions'
    ],
    escalationLadder: [
      { 
        level: 1, 
        authority: 'Bank/Telecom Nodal Officer', 
        condition: 'If your accounts or SIM are not blocked immediately upon request.', 
        link: 'https://dot.gov.in/pg-nodal-officers', 
        linkText: 'Find Nodal Officer' 
      },
      { 
        level: 2, 
        authority: 'Superintendent of Police (SP)', 
        condition: 'If the local police station refuses to register an FIR for your report.', 
        link: 'https://www.cybercrime.gov.in', 
        linkText: 'Report FIR Refusal' 
      }
    ],
    secondaryExploitationWarning: 'Government services never charge fees. Ignore recovery agents or remote access requests.'
  },
  {
    id: 'product-refund-dispute',
    category: IncidentCategory.CONSUMER_DISPUTE,
    title: 'Refund / Defective Product',
    summary: 'Refund denied for defective goods, wrong items received, or warranty services rejected by a company.',
    immediateActions: [
      { id: '1', title: 'Save evidence (invoice, photos, chats) and send a formal written complaint to the seller/company. Wait 48–72 hours.', description: 'Establishing a paper trail is the critical first legal requirement.', type: 'immediate' },
      { id: '2', title: 'If unresolved, file a formal complaint with the National Consumer Helpline (Call 1915 or use NCH Portal).', description: 'Government mediation is mandatory before filing a legal case.', type: 'immediate' },
      { id: '3', title: 'If mediation fails, file a formal legal case via the official e-Daakhil portal for the Consumer Commission.', description: 'This is the final legal path to get a binding judgment.', type: 'immediate' }
    ],
    officialPortal: { name: 'National Consumer Helpline (NCH)', url: 'https://consumerhelpline.gov.in', description: 'The official government system for resolving consumer complaints through mediation (1915).' },
    additionalPortals: [
      { name: 'e-Daakhil', url: 'https://edaakhil.nic.in', description: 'Official portal for online filing of legal cases in Consumer Commissions.' }
    ],
    firSteps: ['Consumer disputes are civil. Police FIRs are only for physical threats or forgery.'],
    preparedChecklist: ['Invoice / Bill copy', 'Unboxing video or photos of defect', 'Warranty Card', 'Written email logs with company'],
    escalationLadder: [
      { level: 1, authority: 'NCH Mediation', condition: 'Mandatory 15-day window for company to respond to NCH.', link: 'https://consumerhelpline.gov.in', linkText: 'NCH Portal' },
      { level: 2, authority: 'e-Daakhil Legal Case', condition: 'If NCH mediation fails to provide a refund or resolution.', link: 'https://edaakhil.nic.in', linkText: 'File e-Daakhil Case' }
    ],
    secondaryExploitationWarning: 'Beware of fake "Refund Agents" on social media. Only use official government portals (NCH/e-Daakhil). No lawyer is required for small claims.'
  },
  {
    id: 'ecommerce-mis-selling',
    category: IncidentCategory.CONSUMER_DISPUTE,
    title: 'E-commerce / Mis-selling / Ads',
    summary: 'Subscription traps, false advertising, wrong items received, or deceptive platform practices.',
    immediateActions: [
      { id: '1', title: 'Save evidence (invoice, photos, chats) and send a formal written complaint to the seller. Wait 48–72 hours.', description: 'Always keep proof of the original advertisement and your purchase.', type: 'immediate' },
      { id: '2', title: 'If unresolved, file a complaint with the National Consumer Helpline (1915/app/portal).', description: 'Mediation for refund or replacement through government intervention.', type: 'immediate' },
      { id: '3', title: 'If mediation fails, file a formal legal case via the official e-Daakhil portal.', description: 'Final legal escalation path for consumer redressal.', type: 'immediate' }
    ],
    sectorOptions: [
      { id: 'ccpa', title: 'Report Deceptive Ads to CCPA', description: 'If the issue involves mass misleading ads affecting many consumers, report to CCPA via NCH.', link: 'https://consumerhelpline.gov.in', linkText: 'Report to CCPA' },
      { id: 'stop-pay', title: 'Stop Subscription Payments', description: 'If trapped in a subscription, immediately disable the e-mandate via your UPI or Bank app.' }
    ],
    officialPortal: { name: 'National Consumer Helpline (NCH)', url: 'https://consumerhelpline.gov.in', description: 'Primary mediation platform for e-commerce and mis-selling disputes.' },
    additionalPortals: [
      { name: 'e-Daakhil', url: 'https://edaakhil.nic.in', description: 'Legal escalation for consumer disputes.' }
    ],
    firSteps: ['Consumer commission cases take priority over police reports for mis-selling.'],
    preparedChecklist: ['Order ID & Invoice', 'Screenshot of the deceptive ad/promise', 'Payment receipt/ID', 'Unboxing video if wrong item'],
    escalationLadder: [
      { level: 1, authority: 'NCH Mediation', condition: 'First official step for refund disputes.', link: 'https://consumerhelpline.gov.in', linkText: 'NCH Portal' },
      { level: 2, authority: 'e-Daakhil', condition: 'Legal recourse if mediation fails.', link: 'https://edaakhil.nic.in', linkText: 'File e-Daakhil Case' }
    ],
    secondaryExploitationWarning: 'Beware of "Chargeback Services" that ask for a fee. Contact your bank or NCH directly for free assistance.'
  },
  {
    id: 'travel-builder-service',
    category: IncidentCategory.CONSUMER_DISPUTE,
    title: 'Travel / Builder / Service Issue',
    summary: 'Airline ticket refunds, builder delays, property disputes, or poor telecom/broadband service quality.',
    immediateActions: [
      { id: '1', title: 'Save receipts, booking IDs, and agreement copies and send a formal written complaint to the company. Wait 48–72 hours.', description: 'Establish a formal record of your grievance.', type: 'immediate' },
      { id: '2', title: 'If no response or denial, file a formal complaint with the National Consumer Helpline (1915/app/portal).', description: 'Official mediation step for service quality and refund issues.', type: 'immediate' },
      { id: '3', title: 'If mediation fails, file a formal legal case through the official e-Daakhil portal.', description: 'Final legal path for a binding judgment from the Consumer Commission.', type: 'immediate' }
    ],
    sectorOptions: [
      { id: 'rera', title: 'Builder / Property: Check RERA', description: 'For builder delays or project issues, file a complaint on your State RERA portal.', link: 'https://rera.delhi.gov.in', linkText: 'Go to RERA' },
      { id: 'telecom', title: 'Telecom / Airlines: Nodal Officer', description: 'Escalate to the provider\'s Nodal Officer or Ombudsman if the service provider refuses to resolve.', link: 'https://dot.gov.in/pg-nodal-officers', linkText: 'Find Nodal Officer' }
    ],
    officialPortal: { name: 'National Consumer Helpline', url: 'https://consumerhelpline.gov.in', description: 'The official first step for mediation in all service-related disputes.' },
    additionalPortals: [
      { name: 'e-Daakhil', url: 'https://edaakhil.nic.in', description: 'Online filing for Consumer Commission cases.' },
      { name: 'State RERA', url: 'https://rera.delhi.gov.in', description: 'For real estate and property builder disputes.' }
    ],
    firSteps: ['These are civil matters. Police FIR is only for criminal cheating where the builder has fled or sold the same unit twice.'],
    preparedChecklist: ['Booking ID / Allotment Letter', 'Payment receipts', 'Written correspondence with company', 'Project RERA Number (if builder)'],
    escalationLadder: [
      { level: 1, authority: 'NCH Mediation', condition: 'Mandatory window for company to respond to government mediation.', link: 'https://consumerhelpline.gov.in', linkText: 'NCH Portal' },
      { level: 2, authority: 'e-Daakhil', condition: 'Legal action if mediation fails to resolve the service issue.', link: 'https://edaakhil.nic.in', linkText: 'File e-Daakhil Case' }
    ],
    secondaryExploitationWarning: 'Do not pay "Settlement Agents" for airline refunds or builder issues. Use official government paths provided here.'
  }
];
