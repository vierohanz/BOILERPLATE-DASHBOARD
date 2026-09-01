import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';
import logo from '@/assets/logo.png';
import { useAuthController } from '../controllers/AuthController';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuthController();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-[#1a1d23] rounded-3xl p-10 md:p-14 shadow-2xl border border-white/5"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6">
            <img src={logo} alt="Admin Logo" className="h-10 object-contain" />
          </div>
          <h2 className="text-2xl md:text-2xl font-bold text-white text-center mb-2">
            Sign in to your account
          </h2>
          <p className="text-slate-400 text-sm text-center font-medium">
            Enter your credentials to access the admin dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase tracking-wider ml-1">
              email<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full bg-[#242930] border-2 border-transparent focus:border-primary rounded-xl py-3.5 px-4 outline-none text-white font-medium transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Password<span className="text-red-500 ml-0.5">*</span>
              </label>
              <span
                onClick={() => navigate('/forgot-password')}
                className="text-[11px] font-bold text-primary hover:text-primary-hover cursor-pointer transition-colors uppercase"
              >
                Forgot password?
              </span>
            </div>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#242930] border-2 border-transparent focus:border-primary rounded-xl py-3.5 px-4 pr-12 outline-none text-white font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 px-1">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-orange-500 focus:ring-orange-500/20"
            />
            <label htmlFor="remember" className="text-xs font-bold text-slate-400 cursor-pointer">
              Remember me
            </label>
          </div>

          {/* Removed inline error since we use toast now */}

          <Button
            isLoading={loading}
            type="submit"
            className="w-full py-5 text-slate-950 font-black"
          >
            Sign In
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
