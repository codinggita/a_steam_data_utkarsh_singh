import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthLayout from '../../layouts/AuthLayout';
import BrutalistButton from '../../components/BrutalistButton';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, error, clearAuthErrors } = useAuth();

  // Determine redirect path
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // If already authenticated, redirect
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    // Show error toast if any auth failure
    if (error) {
      toast.error(`HANDSHAKE FAILED: ${error}`);
      clearAuthErrors();
    }
  }, [error, clearAuthErrors]);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid operator ID format (email expected)')
        .required('Operator ID required'),
      password: Yup.string()
        .min(6, 'Access key must be at least 6 characters')
        .required('Access key required'),
    }),
    onSubmit: async (values) => {
      toast.loading('AUTHORIZING CHANNEL...', { id: 'auth-loading' });
      const success = await login(values.email, values.password);
      toast.dismiss('auth-loading');
      if (success) {
        toast.success('ACCESS GRANTED. SECURE CHANNEL STABILIZED.');
        navigate(from, { replace: true });
      }
    },
  });

  return (
    <AuthLayout headline="THE DATABASE&#10;NEVER SLEEPS.">
      <div className="flex flex-col">
        {/* Portal Branding */}
        <header className="mb-12">
          <h2 className="text-xs font-mono font-bold text-ink/50 dark:text-white/50 uppercase tracking-[0.3em] mb-2">
            Secure Gateway
          </h2>
          <h3 className="text-4xl font-headline font-black text-ink dark:text-white uppercase tracking-tighter">
            STEAM CORE ACCESS
          </h3>
          <div className="w-full h-[2px] bg-ink dark:bg-white mt-4" />
        </header>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Operator ID Input */}
          <div className="space-y-2 group">
            <label 
              className="block font-mono text-xs font-bold uppercase text-ink/65 dark:text-white/70 group-focus-within:text-primary transition-colors" 
              htmlFor="email"
            >
              [01] OPERATOR_ID
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="text"
                placeholder="operator@steam.core"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="w-full bg-transparent border-2 border-black dark:border-white p-4 font-mono text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:ring-0 focus:border-primary dark:focus:border-primary focus:outline-none transition-none brutalist-shadow-sm focus:brutalist-shadow-sm cursor-crosshair"
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 pointer-events-none">
                fingerprint
              </span>
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-primary font-mono text-[10px] uppercase">// ERROR: {formik.errors.email}</div>
            )}
          </div>

          {/* Access Key Input */}
          <div className="space-y-2 group">
            <label 
              className="block font-mono text-xs font-bold uppercase text-ink/65 dark:text-white/70 group-focus-within:text-primary transition-colors" 
              htmlFor="password"
            >
              [02] ACCESS_KEY
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••••••"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full bg-transparent border-2 border-black dark:border-white p-4 font-mono text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:ring-0 focus:border-primary dark:focus:border-primary focus:outline-none transition-none brutalist-shadow-sm focus:brutalist-shadow-sm cursor-crosshair"
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 pointer-events-none">
                key
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-primary font-mono text-[10px] uppercase">// ERROR: {formik.errors.password}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-primary dark:hover:bg-primary dark:hover:text-white font-headline font-black text-xl py-5 px-8 uppercase tracking-widest transition-all brutalist-shadow brutalist-shadow-active flex justify-between items-center group cursor-crosshair border-2 border-black dark:border-white" 
              type="submit"
              disabled={loading}
            >
              <span>{loading ? 'AUTHORIZING...' : 'INITIATE_HANDSHAKE'}</span>
              <span className={`material-symbols-outlined transition-transform ${loading ? 'animate-spin' : 'group-hover:translate-x-2'}`}>
                {loading ? 'sync' : 'arrow_forward'}
              </span>
            </button>
          </div>

          {/* Auth Auxiliary Links */}
          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">
            <Link className="hover:text-primary transition-colors" to="/forgot-password">
              Lost Credentials?
            </Link>
            <Link className="hover:text-primary transition-colors text-primary" to="/register">
              Create operator ID
            </Link>
          </div>
        </form>

        {/* System Logs (Atmospheric) */}
        <div className="mt-12 bg-black/5 dark:bg-white/5 p-4 border-l-4 border-black dark:border-white">
          <p className="font-mono text-[10px] text-black dark:text-white/70 leading-tight uppercase">
            &gt; RECV: Connection established via node_14<br/>
            &gt; WARN: Multi-factor token required for level 5<br/>
            &gt; INFO: Monitoring encrypted channel 0x4F...
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
