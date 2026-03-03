import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2, ArrowLeft } from "lucide-react";

export const GlobalLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleMagicLogin = async () => {
    if (!email) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    setLoading(false);

    if (!error) setSent(true);
    else alert("Login failed. Try again.");
  };

  const redirectAfterLogin = () => {
    const redirect = sessionStorage.getItem("redirectAfterLogin");
    if (redirect) {
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirect);
    } else {
      navigate("/plans/result");
    }
  };

  if (sent) {
    return (
      <div className="p-6 max-w-md mx-auto pb-40 animate-in text-center space-y-8">
        <div className="bg-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl">
          <Shield className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-black text-slate-900">
          Check your email
        </h2>

        <p className="text-slate-600 font-bold">
          Magic login link sent. Open email on any device.
        </p>

        <button
          onClick={redirectAfterLogin}
          className="px-6 py-4 rounded-2xl bg-indigo-600 text-white font-black w-full"
        >
          I have logged in
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto pb-40 animate-in space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 font-black text-indigo-600"
      >
        <ArrowLeft /> Back
      </button>

      <div className="text-center space-y-6">
        <div className="bg-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl">
          <Shield className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-black text-slate-900">
          Secure Access
        </h2>

        <p className="text-slate-600 font-bold">
          Login once to access Recovery Hub, bookings, evidence & payments.
        </p>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-[3rem] p-10 shadow-lg space-y-6">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-4 bg-white border-2 border-slate-900 rounded-xl font-bold outline-none"
        />

        <button
          onClick={handleMagicLogin}
          disabled={loading}
          className="px-6 py-4 rounded-2xl bg-indigo-600 text-white font-black w-full flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Send Magic Link"}
        </button>

        <p className="text-xs font-bold text-slate-400 text-center">
          Passwordless login • Secure • Govt compliant
        </p>
      </div>
    </div>
  );
};