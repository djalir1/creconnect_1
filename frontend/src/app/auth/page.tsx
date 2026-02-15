"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FaUser, FaLock, FaEnvelope, FaGoogle, FaHome, FaEyeSlash, FaEye } from "react-icons/fa";
import Footer from "@/components/Footer";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, register } = useAuth();
  
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "login") {
        // 1. Capture user response
        const user = await login({ 
          email: formData.email, 
          password: formData.password 
        });
        
        // 2. Role-based redirect
        if (user?.role === "STUDIO_OWNER") {
          router.push("/dashboard/studio-new");
        } else {
          router.push("/");
        }
      } else {
        // 3. Registration
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "STUDIO_OWNER", 
        });
        router.push("/setup/studio");
      }
    } catch (err: any) {
      // 4. Detailed Error Catching
      console.error("Auth process error:", err);
      setError(err.response?.data?.message || err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Top Header */}
      <div className="p-6 px-12 bg-white">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all"
        >
          <FaHome /> Back to home
        </button>
      </div>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className={`flex w-full max-w-6xl min-h-[600px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden rounded-sm transition-all duration-500 ${mode === 'register' ? 'flex-row' : 'flex-row-reverse'}`}>
          
          {/* WELCOME PANEL (Black side) */}
          <div className="hidden lg:flex w-1/2 bg-black text-white flex-col items-center justify-center p-12 text-center">
            <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter">
              {mode === 'login' ? 'Welcome Back !' : 'Join Us !'}
            </h1>
            <p className="text-zinc-400 mb-10 max-w-xs leading-relaxed italic text-sm">
              {mode === 'login' 
                ? "To keep connected with us please sign up with your personal info." 
                : "Enter your personal details and start your journey with us."}
            </p>
            <button 
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
              className="border-2 border-white text-white px-16 py-3 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </div>

          {/* FORM PANEL (White side) */}
          <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-sm">
              <h2 className="text-4xl font-black text-center mb-2 uppercase tracking-tight">
                {mode === 'login' ? 'Login Here' : 'Create Account'}
              </h2>
              <p className="text-center text-zinc-400 text-xs mb-8 italic">Enter your credentials below!</p>

              {/* Error Alert Box */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "register" && (
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-3" />
                    <input 
                      type="text" 
                      placeholder="Username" 
                      required 
                      className="w-full bg-zinc-50 border-b border-zinc-200 py-3 pl-10 pr-4 focus:outline-none focus:border-black text-sm transition-colors text-black"
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    />
                  </div>
                )}
                
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-3" />
                  <input 
                    type="email" 
                    placeholder="Email or username" 
                    required 
                    className="w-full bg-zinc-50 border-b border-zinc-200 py-3 pl-10 pr-4 focus:outline-none focus:border-black text-sm transition-colors text-black"
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  />
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-3" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    required 
                    className="w-full bg-zinc-50 border-b border-zinc-200 py-3 pl-10 pr-10 focus:outline-none focus:border-black text-sm transition-colors text-black"
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                  >
                    {showPassword ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                  </button>
                </div>

                {mode === 'login' && (
                  <div className="text-right">
                    <button type="button" className="text-[10px] text-zinc-400 italic hover:text-black uppercase font-bold">Forgot password?</button>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-black text-white py-7 rounded-none font-black uppercase tracking-[0.2em] text-xs hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : mode === 'login' ? 'Login' : 'Sign up'}
                </Button>

                <div className="relative py-2 flex items-center justify-center">
                   <span className="bg-white px-4 text-[10px] font-black text-zinc-400 z-10 uppercase tracking-widest">OR</span>
                   <div className="absolute w-full border-t border-zinc-100"></div>
                </div>

                <button 
                  type="button" 
                  className="w-full border border-zinc-200 py-3 flex items-center justify-center gap-3 font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-50 transition-colors text-black"
                >
                  <FaGoogle className="text-red-500" /> Continue with google
                </button>

                <p className="text-center text-[10px] text-zinc-400 mt-6 font-bold uppercase tracking-wider">
                  {mode === 'login' ? "Don't have account yet?" : "Already have account?"} 
                  <button 
                    type="button" 
                    onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} 
                    className="text-orange-500 ml-2 underline italic hover:text-orange-600"
                  >
                    {mode === 'login' ? 'Signup' : 'Login'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-black font-black uppercase tracking-widest">Loading...</div>}>
      <AuthContent />
    </Suspense>
  );
}