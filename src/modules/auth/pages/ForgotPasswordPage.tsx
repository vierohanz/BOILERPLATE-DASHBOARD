import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import toast from 'react-hot-toast';
import logo from '@/assets/logo.png';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Recovery instructions sent to your email!');
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      toast.error('Failed to send recovery email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-[#1a1d23] rounded-3xl p-10 md:p-14 shadow-2xl border border-white/5"
      >
        {/* Back Link */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest cursor-pointer">
            Back to Login
          </span>
        </button>

        {/* Logo & Text */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6">
            <img src={logo} alt="Admin Logo" className="h-10 object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-2">Forgot Password?</h2>
          <p className="text-slate-400 text-sm text-center font-medium leading-relaxed">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-xs font-bold text-white uppercase tracking-wider ml-1">
              Email Address<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="mt-2 w-full bg-[#242930] border-2 border-transparent focus:border-primary rounded-xl py-4 pl-12 pr-4 outline-none text-white font-medium transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <Button
            isLoading={loading}
            type="submit"
            className="w-full py-5 text-slate-950 font-black"
          >
            Send Instructions
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
