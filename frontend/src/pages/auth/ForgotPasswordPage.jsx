import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import toast from 'react-hot-toast';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email format')
        .required('Operator email required to send link'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      toast.loading('LOCATING IDENTITY RECORD...', { id: 'reset-loading' });
      
      // Simulate API call for password reset
      setTimeout(() => {
        toast.dismiss('reset-loading');
        setLoading(false);
        toast.success('BYPASS KEY DISPATCHED. CHECK ENCRYPTED INBOX.');
        navigate('/login');
      }, 1500);
    },
  });

  return (
    <AuthLayout headline="DIAGNOSTIC IDENTIFICATION&#10;VERIFICATION IN PROGRESS.">
      <div className="flex flex-col">
        {/* Portal Branding */}
        <header className="mb-12">
          <h2 className="text-xs font-mono font-bold text-ink/50 dark:text-white/50 uppercase tracking-[0.3em] mb-2">
            System Diagnostics
          </h2>
          <h3 className="text-4xl font-headline font-black text-ink dark:text-white uppercase tracking-tighter">
            LOST ACCESS KEY
          </h3>
          <div className="w-full h-[2px] bg-ink dark:bg-white mt-4" />
        </header>

        {/* Forgot Password Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
            <label className="block font-mono text-xs font-bold uppercase text-ink/65 dark:text-white/70 group-focus-within:text-primary transition-colors" htmlFor="email">
              [01] REGISTERED_EMAIL
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
                contact_mail
              </span>
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-primary font-mono text-[10px] uppercase">// ERROR: {formik.errors.email}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-primary dark:hover:bg-primary dark:hover:text-white font-headline font-black text-xl py-5 px-8 uppercase tracking-widest transition-all brutalist-shadow brutalist-shadow-active flex justify-between items-center group cursor-crosshair border-2 border-black dark:border-white" 
              type="submit"
              disabled={loading}
            >
              <span>{loading ? 'TRANSMITTING...' : 'INITIATE_BYPASS'}</span>
              <span className={`material-symbols-outlined transition-transform ${loading ? 'animate-spin' : 'group-hover:translate-x-2'}`}>
                {loading ? 'sync' : 'arrow_forward'}
              </span>
            </button>
          </div>

          {/* Auxiliary Links */}
          <div className="text-center text-[10px] font-mono font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">
            <Link className="hover:text-primary transition-colors" to="/login">
              Credentials remembered? SIGN IN
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
