
import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase'
import { LogIn, LogOut, User, Mail, ShieldCheck } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      console.log("Session" + JSON.stringify(session));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/plans/result'
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6 max-w-xl mx-auto animate-in">
        <div className="bg-white border-2 border-slate-200 rounded-[3rem] shadow-lg p-10 text-center space-y-8">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
            <User size={40} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Identity Verification</h2>
            <p className="text-slate-500 font-bold text-lg">Login required to access secure recovery tracking and persistent case files.</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
          >
            <LogIn size={24} />
            Continue with Google
          </button>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secure session powered by Supabase Auth</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
            <Mail size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Active Session</p>
            <p className="text-sm font-bold text-indigo-900">{session.user.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
      {children}
    </div>
  );
};
