import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Phone, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  FileText,
  ChevronRight,
  Info,
  Users,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase';

/* ================= TYPES ================= */

interface BookingData {
  userId?: string;
  caseContext: {
    complaintText?: string;
    description: string;
    evidenceFiles: string[];
  };
  preparation: {
    notes: string;
    expectedOutcome: string;
    urgency: 'Low' | 'Medium' | 'High';
    language: string;
  };
  schedule: {
    date: string;
    timeWindow: 'Morning' | 'Afternoon' | 'Evening';
    mode: 'WhatsApp' | 'Phone';
    phone: string;
    email: string;
  };
  status: 'Requested' | 'Confirmed' | 'Completed' | 'Missed' | 'Rescheduled';
}

interface ExpertBookingProps {
  onBack: () => void;
  onComplete: (booking: BookingData) => void;
  existingComplaint?: string;
  incidentData: any;
}

/* ================= COMPONENT ================= */

export const ExpertBooking: React.FC<ExpertBookingProps> = ({ 
  onBack, 
  onComplete, 
  existingComplaint,
  incidentData 
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  /* ---------- load supabase user ---------- */

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  /* ---------- booking state ---------- */

  const [booking, setBooking] = useState<BookingData>({
    userId: undefined,
    caseContext: {
      complaintText: existingComplaint || '',
      description: incidentData?.description || '',
      evidenceFiles: []
    },
    preparation: {
      notes: '',
      expectedOutcome: '',
      urgency: 'Medium',
      language: 'English'
    },
    schedule: {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      timeWindow: 'Afternoon',
      mode: 'WhatsApp',
      phone: '',
      email: ''
    },
    status: 'Requested'
  });

  /* ---------- sync user → booking ---------- */

  useEffect(() => {
    if (user?.id) {
      setBooking(prev => ({
        ...prev,
        userId: user.id
      }));
    }
  }, [user]);

  /* ================= HANDLERS ================= */

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => step > 1 ? setStep(s => s - 1) : onBack();
const handleSubmit = async () => {
  if (isSubmitting) return;

  setIsSubmitting(true);

  try {
    // 🔴 ALWAYS fetch fresh user
    const {
      data: { user }
    } = await supabase.auth.getUser();

    console.log("INSERT USER:", user?.id);

    if (!user?.id) {
      throw new Error("User not authenticated — cannot insert booking");
    }

    const payload = {
      user_id: user.id,
      incident_id: incidentData?.id || null,

      description: booking.caseContext.description,
      notes: booking.preparation.notes,
      expected_outcome: booking.preparation.expectedOutcome,
      urgency: booking.preparation.urgency,
      language: booking.preparation.language,

      preferred_date: booking.schedule.date,
      time_window: booking.schedule.timeWindow,
      call_mode: booking.schedule.mode,
      phone: booking.schedule.phone,
      email: booking.schedule.email,

      status: booking.status,
      booking_data: booking
    };

    console.log("INSERT PAYLOAD:", payload);

    const { data, error } = await supabase
      .from("expert_bookings")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("SUPABASE INSERT ERROR:", error);
      throw error;
    }

    console.log("BOOKING CREATED:", data);

    onComplete(data);

  } catch (err) {
    console.error("BOOKING ERROR:", err);
    onComplete(booking); // UI fallback
  } finally {
    setIsSubmitting(false);
  }
};




  /* ================= UI STEPS ================= */

  const renderStep1 = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Step 1: Case Context</h3>
        <p className="text-slate-600 font-bold text-lg leading-snug">Experts need to review your case details before the guidance session.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Case Narrative / Description</label>
          <textarea 
            className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-indigo-600 transition-all min-h-[150px] shadow-inner"
            placeholder="Describe exactly what happened..."
            value={booking.caseContext.description}
            onChange={e => setBooking({
              ...booking,
              caseContext: { ...booking.caseContext, description: e.target.value }
            })}
          />
        </div>

        {existingComplaint && (
          <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100 flex items-start gap-4 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-md shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-black text-indigo-900">Generated Complaint Found</p>
              <p className="text-xs font-bold text-indigo-900/60 mt-1">We will automatically share your generated complaint with the expert for review.</p>
            </div>
          </div>
        )}

        <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 text-center group hover:border-indigo-400 transition-colors cursor-pointer">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 group-hover:text-indigo-600 shadow-sm transition-colors">
            <Upload size={20} />
          </div>
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Upload additional evidence</p>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">JPG, PNG, PDF (Max 10MB)</p>
        </div>
      </div>

      <Button onClick={handleNext} disabled={!booking.caseContext.description}>
        Next: Preparation <ChevronRight size={20} />
      </Button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Step 2: Guidance Preparation</h3>
        <p className="text-slate-600 font-bold text-lg leading-snug">Help us prepare the most effective guidance for your specific situation.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Key Questions / Notes</label>
          <textarea 
            className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-indigo-600 transition-all shadow-inner"
            placeholder="What specific questions do you have for the expert?"
            value={booking.preparation.notes}
            onChange={e => setBooking({
              ...booking,
              preparation: { ...booking.preparation, notes: e.target.value }
            })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expected Outcome</label>
          <input 
            className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-indigo-600 transition-all shadow-inner"
            placeholder="e.g. I want to know if I can get my money back"
            value={booking.preparation.expectedOutcome}
            onChange={e => setBooking({
              ...booking,
              preparation: { ...booking.preparation, expectedOutcome: e.target.value }
            })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Urgency</label>
            <select 
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-indigo-600 transition-all appearance-none shadow-inner"
              value={booking.preparation.urgency}
              onChange={e => setBooking({
                ...booking,
                preparation: { ...booking.preparation, urgency: e.target.value as any }
              })}
            >
              <option value="Low">Low Urgency</option>
              <option value="Medium">Medium Urgency</option>
              <option value="High">High Urgency</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Language</label>
            <select 
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-indigo-600 transition-all appearance-none shadow-inner"
              value={booking.preparation.language}
              onChange={e => setBooking({
                ...booking,
                preparation: { ...booking.preparation, language: e.target.value }
              })}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Kannada">Kannada</option>
              <option value="Telugu">Telugu</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack} className="border-slate-200">Back</Button>
        <Button onClick={handleNext} disabled={!booking.preparation.notes || !booking.preparation.expectedOutcome}>
          Next: Schedule <ChevronRight size={20} />
        </Button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Step 3: Preferred Schedule</h3>
        <p className="text-slate-600 font-bold text-lg leading-snug">Select when you'd like to have the guidance session.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preferred Date</label>
          <div className="relative">
            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="date"
              className="w-full p-6 pl-16 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-indigo-600 transition-all shadow-inner"
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              value={booking.schedule.date}
              onChange={e => setBooking({
                ...booking,
                schedule: { ...booking.schedule, date: e.target.value }
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Time Window</label>
          <div className="grid grid-cols-3 gap-3">
            {['Morning', 'Afternoon', 'Evening'].map(window => (
              <button
                key={window}
                onClick={() => setBooking({
                  ...booking,
                  schedule: { ...booking.schedule, timeWindow: window as any }
                })}
                className={`p-5 rounded-2xl border-2 transition-all font-black text-xs shadow-sm ${
                  booking.schedule.timeWindow === window 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-100' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                }`}
              >
                {window}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Call Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setBooking({
                ...booking,
                schedule: { ...booking.schedule, mode: 'WhatsApp' }
              })}
              className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-center gap-3 font-black shadow-sm ${
                booking.schedule.mode === 'WhatsApp' 
                  ? 'bg-[#25D366] border-[#25D366] text-white shadow-[#25D366]/20' 
                  : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
              }`}
            >
              <MessageCircle size={24} /> WhatsApp
            </button>
            <button
              onClick={() => setBooking({
                ...booking,
                schedule: { ...booking.schedule, mode: 'Phone' }
              })}
              className={`p-6 rounded-[2rem] border-2 transition-all flex items-center justify-center gap-3 font-black shadow-sm ${
                booking.schedule.mode === 'Phone' 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-slate-900/20' 
                  : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
              }`}
            >
              <Phone size={24} /> Phone Call
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
            <input 
              type="tel"
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-indigo-600 transition-all shadow-inner"
              placeholder="+91 98765 43210"
              value={booking.schedule.phone}
              onChange={e => setBooking({
                ...booking,
                schedule: { ...booking.schedule, phone: e.target.value }
              })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
            <input 
              type="email"
              className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] font-bold text-sm outline-none focus:border-indigo-600 transition-all shadow-inner"
              placeholder="your@email.com"
              value={booking.schedule.email}
              onChange={e => setBooking({
                ...booking,
                schedule: { ...booking.schedule, email: e.target.value }
              })}
            />
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-100 flex items-start gap-4 shadow-sm">
          <Info className="text-amber-600 shrink-0" size={20} />
          <p className="text-xs font-bold text-amber-900 leading-tight">
            We will confirm your exact slot within 24 hours. Our experts review your case context before the call.
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack} className="border-slate-200">Back</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !booking.schedule.phone || !booking.schedule.email}>
          {isSubmitting ? <><Loader2 className="animate-spin" /> Submitting Request...</> : 'Request Guidance Session'}
        </Button>
      </div>
    </motion.div>
  );

  /* ================= RENDER ================= */

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all active:scale-90 shadow-sm"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100 border-2 border-white/20">
            <Users size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Expert Guidance</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Professional Case Review</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-10 bg-indigo-600' : i < step ? 'w-4 bg-emerald-500' : 'w-4 bg-slate-200'}`} />
            ))}
          </div>
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-100 rounded-[3.5rem] p-8 md:p-14 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
        <AnimatePresence mode="wait">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </AnimatePresence>
      </div>

      <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl transition-all group-hover:bg-indigo-500/20"></div>
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle size={24} />
          </div>
          <p className="text-sm font-bold text-slate-300 leading-relaxed">
            <span className="text-white font-black block mb-1">Important Disclaimer</span>
            Naya Sahai provides documentation guidance and informational support. This is not legal representation. Recovery outcomes depend on banks, authorities, and case specifics.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ================= BUTTON ================= */

const Button = ({ children, onClick, disabled, variant = 'primary', className = "" }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${
      variant === 'primary' 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700' 
        : 'bg-white border-2 border-slate-100 text-slate-900 hover:border-slate-200'
    } ${className}`}
  >
    {children}
  </button>
);
