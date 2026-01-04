import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FileText, AlertCircle, Scale } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - WorkLess AI Hub</title>
        <meta name="description" content="Read our Terms of Service to understand your rights and responsibilities when using WorkLess AI Hub." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <div className="pt-24 pb-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-black text-black mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-slate-600">
                Effective Date: January 1, 2026
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 space-y-10"
            >
              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black">1. Acceptance of Terms</h2>
                <p className="text-slate-700 leading-relaxed">
                  By accessing or using WorkLess AI Hub ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. These Terms constitute a legally binding agreement between you and WorkLess AI.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black">2. Description of Service</h2>
                <p className="text-slate-700 leading-relaxed">
                  WorkLess AI Hub provides AI-powered document processing services, converting handwritten notes and documents into structured digital formats. We reserve the right to modify, suspend, or discontinue the Service at any time, with or without notice.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black">3. User Accounts</h2>
                <p className="text-slate-700 leading-relaxed">
                  To access certain features, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black">4. Acceptable Use</h2>
                <p className="text-slate-700 leading-relaxed">
                  You agree not to use the Service to process any documents containing illegal content, malware, or content that infringes on the intellectual property rights of others. You agree not to attempt to reverse engineer, decompile, or disassemble any portion of the Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black">5. Intellectual Property</h2>
                <p className="text-slate-700 leading-relaxed">
                  The Service and its original content (excluding user-uploaded documents), features, and functionality are and will remain the exclusive property of WorkLess AI and its licensors.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black">6. Limitation of Liability</h2>
                <p className="text-slate-700 leading-relaxed">
                  In no event shall WorkLess AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black">7. Changes to Terms</h2>
                <p className="text-slate-700 leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
                </p>
              </section>

              <div className="pt-8 border-t-2 border-slate-100">
                 <p className="text-slate-500 text-sm">
                   Questions regarding these Terms should be sent to <a href="mailto:iamsouravmaurya@gmail.com" className="text-purple-600 font-bold hover:underline">iamsouravmaurya@gmail.com</a>
                 </p>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default TermsPage;