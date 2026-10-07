import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  LogIn,
  BookOpen,
  Shield,
  KeyRound,
  AtSign,
} from 'lucide-react';
import { TailorLogo } from '../common/TailorLogo';

interface LoginViewProps {
  onLoginSuccess: (email: string, role: string) => void;
  onGoogleLogin?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onGoogleLogin,
}) => {
  const [email, setEmail] = useState('manager@royaltailor.sa');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email, 'مدير النظام');
    }, 600);
  };

  const handleBiometricLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('manager@royaltailor.sa', 'مدير النظام');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between items-center p-4 sm:p-6 text-slate-800">
      <div className="w-full max-w-sm mx-auto space-y-6 pt-4 sm:pt-8 flex-1 flex flex-col justify-center">
        {/* Top Header Crest (Matching Screenshot 1) */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <TailorLogo size="lg" className="p-3" />
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-2xs"></span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200/60 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة الإدارة والتحكم</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">مشغل الخياطة الملكية</h1>
            <p className="text-xs text-slate-500">بوابة إدارة المشغل، تفصيل الثياب والمبيعات</p>
          </div>
        </div>

        {/* Login Form Card (Matching Screenshot 1) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Username Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  اسم المستخدم أو البريد الإلكتروني
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@royaltailor.sa"
                  className="w-full pl-10 pr-3.5 py-3 text-xs bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all font-mono"
                  required
                />
                <AtSign className="absolute left-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  كلمة المرور
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-20 pr-3.5 py-3 text-xs bg-slate-50/80 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all font-mono"
                  required
                />
                <div className="absolute left-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <KeyRound className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                <span>تذكر بيانات الدخول</span>
              </label>

              <button
                type="button"
                onClick={() => alert('تم إرسال رابط استعادة كلمة المرور للبريد الإلكتروني المعتمد.')}
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                {errorMsg}
              </div>
            )}

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'جاري التحقق...' : 'تسجيل الدخول للنظام'}</span>
            </button>
          </form>

          {/* Separator */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-slate-400 font-medium absolute">أو</span>
          </div>

          {/* Biometric Quick Login */}
          <button
            type="button"
            onClick={handleBiometricLogin}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 border border-blue-200/80 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Fingerprint className="w-5 h-5 text-blue-600" />
            <span>الدخول السريع عبر البصمة الحيوية</span>
          </button>

          {/* Google Auth option */}
          {onGoogleLogin && (
            <button
              type="button"
              onClick={onGoogleLogin}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>تسجيل الدخول عبر Google</span>
            </button>
          )}
        </div>

        {/* 2 Security Badges Cards (Matching Screenshot 1) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-sans">دفتر القياسات</span>
              <span className="text-xs font-bold text-slate-800 block">متاح دون اتصال</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-sans">حماية الجلسة</span>
              <span className="text-xs font-bold text-slate-800 block font-mono">تشفير كامل 256-bit</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer (Matching Screenshot 1) */}
      <footer className="text-center py-4 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-1.5 font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>الإصدار 2.4.0 • نظام تشغيل سحابي آمن</span>
        </div>
        <p>جميع الحقوق محفوظة لمشغل الخياطة الملكية © 2025</p>
      </footer>
    </div>
  );
};
