import React from 'react';
import { ArrowLeft, Shield, FileText, RefreshCcw, Mail, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PolicyLayout = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const navigate = useNavigate();
  return (
    <div className="p-6 max-w-4xl mx-auto pb-40 animate-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black text-indigo-600 mb-8 hover:-translate-x-1 transition-transform">
        <ArrowLeft /> Back
      </button>
      <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tighter uppercase">{title}</h1>
      <div className="bg-white border-2 border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-xl prose prose-slate max-w-none font-bold text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export const PrivacyPolicy = () => (
  <PolicyLayout title="Privacy Policy">
    <p>Last Updated: February 21, 2026</p>
    <section className="space-y-4">
      <h2 className="text-slate-900 font-black">1. Data Collection</h2>
      <p>Naya Sahai collects information necessary to assist in cyber crime recovery, including incident descriptions, transaction details (UTR numbers, amounts), and uploaded evidence (screenshots, PDFs). We also collect contact information for communication purposes.</p>
      
      <h2 className="text-slate-900 font-black">2. Data Processing & Storage</h2>
      <p>We prioritize local processing. Sensitive evidence is processed on your device whenever possible. We use secure cloud storage for case management features if you opt-in. All data is encrypted at rest and in transit.</p>
      
      <h2 className="text-slate-900 font-black">3. Third-Party Integrations</h2>
      <p>We use Razorpay for secure payment processing. We do not store your card or bank details. We also integrate with WhatsApp for support and sharing features.</p>
      
      <h2 className="text-slate-900 font-black">4. User Rights</h2>
      <p>You have the right to access, correct, or delete your data. You can request data deletion by contacting our support team at support@nayasahai.com.</p>
    </section>
  </PolicyLayout>
);

export const TermsAndConditions = () => (
  <PolicyLayout title="Terms & Conditions">
    <p>Last Updated: February 21, 2026</p>
    <section className="space-y-4">
      <h2 className="text-slate-900 font-black">1. Service Description</h2>
      <p>Naya Sahai provides documentation assistance and recovery guidance for victims of cyber fraud. We help generate official complaints and evidence packages based on user input.</p>
      
      <h2 className="text-slate-900 font-black">2. Payment Terms</h2>
      <p>Access to premium features requires a one-time payment per incident. Pricing is clearly displayed before checkout.</p>
      
      <h2 className="text-slate-900 font-black">3. Delivery Method</h2>
      <p>Documents are generated instantly upon successful payment and data entry. Consultations are scheduled based on availability.</p>
      
      <h2 className="text-slate-900 font-black">4. Disclaimer</h2>
      <p>Naya Sahai provides informational guidance and documentation assistance. We are not a law firm and do not provide legal representation. Recovery outcomes depend on banks and law enforcement authorities.</p>
    </section>
  </PolicyLayout>
);

export const RefundPolicy = () => (
  <PolicyLayout title="Refund & Cancellation">
    <p>Last Updated: February 21, 2026</p>
    <section className="space-y-4">
      <h2 className="text-slate-900 font-black">1. Refund Eligibility</h2>
      <p>Refunds are available if our system fails to generate the promised documents or if the service cannot be delivered due to technical issues on our end.</p>
      
      <h2 className="text-slate-900 font-black">2. Non-Refundable Scenarios</h2>
      <p>Refunds are not provided once the user has accessed the generated documents or if a scheduled legal consultation has been completed.</p>
      
      <h2 className="text-slate-900 font-black">3. Refund Timeline</h2>
      <p>Approved refunds are processed within 5-7 business days to the original payment method.</p>
      
      <h2 className="text-slate-900 font-black">4. Cancellation</h2>
      <p>Users can cancel their request before the document generation process begins.</p>
    </section>
  </PolicyLayout>
);

export const ContactInfo = () => (
  <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-6">
    <h3 className="text-2xl font-black tracking-tight">Business Identity</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Support Email</p>
          <p className="font-bold">support@nayasahai.com</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-lg">
          <Phone className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">WhatsApp Support</p>
          <p className="font-bold">+91 8217617245</p>
        </div>
      </div>
    </div>
    <div className="pt-6 border-t border-white/10">
      <p className="text-xs font-bold text-slate-400">Business Address: Naya Sahai Tech, HSR Layout, Bangalore, Karnataka - 560102</p>
    </div>
  </section>
);
