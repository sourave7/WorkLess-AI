import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Shield, Lock, Trash2, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - WorkLess AI Hub</title>
        <meta name="description" content="Learn about how we protect your data with enterprise-grade encryption and automatic deletion." />
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
                Privacy Policy
              </h1>
              <p className="text-xl text-slate-600">
                Last updated: January 2026
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 space-y-10"
            >
              {/* Key Highlights */}
              <div className="grid md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg border-2 border-green-200 shrink-0">
                    <Lock className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-lg mb-1">Enterprise Encryption</h3>
                    <p className="text-sm text-slate-600">All data is secured with AES-256 encryption at rest and TLS 1.3 in transit.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-lg border-2 border-red-200 shrink-0">
                    <Trash2 className="w-6 h-6 text-red-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-lg mb-1">Auto-Deletion</h3>
                    <p className="text-sm text-slate-600">Processed files are automatically permanently deleted from our servers after 24 hours.</p>
                  </div>
                </div>
              </div>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black flex items-center gap-2">
                  1. Information We Collect
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  We collect information you provide directly to us, such as when you create an account, upload documents for processing, or contact us for support. This may include your name, email address, and the content of the documents you process.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black flex items-center gap-2">
                  2. Data Security & Encryption
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  We employ enterprise-grade security measures designed to protect your information from unauthorized access. Your documents are encrypted using <strong>AES-256 encryption</strong> while stored on our servers and transmitted using secure <strong>TLS 1.3 protocols</strong>.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black flex items-center gap-2">
                  3. Data Retention Policy
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  We practice strict data minimization. Any document you upload for processing is temporarily stored to allow for AI analysis and file generation. <strong>All uploaded files and processed outputs are automatically and permanently deleted from our systems 24 hours after processing is complete.</strong> We do not use your data to train our public AI models.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black flex items-center gap-2">
                  4. How We Use Your Information
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  We use the information we collect to provide, maintain, and improve our services. Specifically:
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-2">
                  <li>To provide the document processing services you request.</li>
                  <li>To send you technical notices, updates, security alerts, and support messages.</li>
                  <li>To monitor and analyze trends, usage, and activities in connection with our services.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-black text-black flex items-center gap-2">
                  5. Contact Us
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:iamsouravmaurya@gmail.com" className="text-purple-600 font-bold hover:underline">iamsouravmaurya@gmail.com</a>
                </p>
              </section>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;