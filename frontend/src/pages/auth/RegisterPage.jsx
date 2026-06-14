import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthLayout from '../../layouts/AuthLayout';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading, error, clearAuthErrors } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(`REGISTRATION FAILED: ${error}`);
      clearAuthErrors();
    }
  }, [error, clearAuthErrors]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Operator name is required'),
      email: Yup.string()
        .email('Invalid operator ID format (email expected)')
        .required('Operator ID required'),
      password: Yup.string()
        .min(6, 'Access key must be at least 6 characters')
        .required('Access key required'),
      role: Yup.string()
        .oneOf(['user', 'admin'], 'Invalid clearance assignment')
        .required('Clearance assignment required'),
    }),
    onSubmit: async (values) => {
      toast.loading('CREATING IDENTITY...', { id: 'reg-loading' });
      const success = await register(values.name, values.email, values.password, values.role);
      toast.dismiss('reg-loading');
      if (success) {
        toast.success('IDENTITY CRITICAL INDEX SECURED. LINKED.');
        navigate('/dashboard', { replace: true });
      }
    },
  });

  return (
    <AuthLayout headline="INTEGRATED CORE DATA&#10;ALTERATION PROTOCOLS.">
      <div className="flex flex-col">
        {/* Portal Branding */}
        <header className="mb-8">
          <h2 className="text-xs font-mono font-bold text-ink/50 dark:text-white/50 uppercase tracking-[0.3em] mb-2">
            Secure Node
          </h2>
          <h3 className="text-4xl font-headline font-black text-ink dark:text-white uppercase tracking-tighter">
            REGISTER IDENTITY
          </h3>
          <div className="w-full h-[2px] bg-ink dark:bg-white mt-4" />
        </header>

        {/* Register Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Operator Name */}
          <div className="space-y-1.5 group">
            <label className="block font-mono text-[11px] font-bold uppercase text-ink/65 dark:text-white/70 group-focus-within:text-primary transition-colors" htmlFor="name">
              [01] FULL_NAME
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="OPERATOR NAME"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="w-full bg-transparent border-2 border-black dark:border-white p-3 font-mono text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:ring-0 focus:border-primary dark:focus:border-primary focus:outline-none transition-none brutalist-shadow-sm focus:brutalist-shadow-sm cursor-crosshair"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-primary font-mono text-[10px] uppercase">// ERROR: {formik.errors.name}</div>
            )}
          </div>

          {/* Operator ID Input */}
          <div className="space-y-1.5 group">
            <label className="block font-mono text-[11px] font-bold uppercase text-ink/65 dark:text-white/70 group-focus-within:text-primary transition-colors" htmlFor="email">
              [02] OPERATOR_ID
            </label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="operator@steam.core"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full bg-transparent border-2 border-black dark:border-white p-3 font-mono text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:ring-0 focus:border-primary dark:focus:border-primary focus:outline-none transition-none brutalist-shadow-sm focus:brutalist-shadow-sm cursor-crosshair"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-primary font-mono text-[10px] uppercase">// ERROR: {formik.errors.email}</div>
            )}
          </div>

          {/* Access Key Input */}
          <div className="space-y-1.5 group">
            <label className="block font-mono text-[11px] font-bold uppercase text-ink/65 dark:text-white/70 group-focus-within:text-primary transition-colors" htmlFor="password">
              [03] ACCESS_KEY
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full bg-transparent border-2 border-black dark:border-white p-3 font-mono text-black dark:text-white placeholder:text-black/20 dark:placeholder:text-white/20 focus:ring-0 focus:border-primary dark:focus:border-primary focus:outline-none transition-none brutalist-shadow-sm focus:brutalist-shadow-sm cursor-crosshair"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-primary font-mono text-[10px] uppercase">// ERROR: {formik.errors.password}</div>
            )}
          </div>

          {/* Clearance Level Assignment */}
          <div className="space-y-1.5 group">
            <label className="block font-mono text-[11px] font-bold uppercase text-ink/65 dark:text-white/70 group-focus-within:text-primary transition-colors" htmlFor="role">
              [04] CLEARANCE_LEVEL
            </label>
            <select
              id="role"
              name="role"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
              className="w-full bg-white dark:bg-black border-2 border-black dark:border-white p-3 font-mono text-black dark:text-white focus:ring-0 focus:border-primary dark:focus:border-primary focus:outline-none transition-none brutalist-shadow-sm cursor-crosshair"
            >
              <option value="user">LEVEL 1 // OPERATIONAL ACCESS</option>
              <option value="admin">LEVEL 5 // ROOT DIRECTORY ACCESS</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="text-primary font-mono text-[10px] uppercase">// ERROR: {formik.errors.role}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-primary dark:hover:bg-primary dark:hover:text-white font-headline font-black text-xl py-5 px-8 uppercase tracking-widest transition-all brutalist-shadow brutalist-shadow-active flex justify-between items-center group cursor-crosshair border-2 border-black dark:border-white" 
              type="submit"
              disabled={loading}
            >
              <span>{loading ? 'REGISTERING...' : 'REGISTER_OPERATOR'}</span>
              <span className={`material-symbols-outlined transition-transform ${loading ? 'animate-spin' : 'group-hover:translate-x-2'}`}>
                {loading ? 'sync' : 'arrow_forward'}
              </span>
            </button>
          </div>

          {/* Auxiliary Links */}
          <div className="text-center pt-2 text-[10px] font-mono font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">
            <Link className="hover:text-primary transition-colors" to="/login">
              Already possess credentials? SIGN IN
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
