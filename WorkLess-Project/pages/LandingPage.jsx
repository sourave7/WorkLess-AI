import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Shield, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Conversion',
      description: 'Transform handwritten notes into structured digital data instantly'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process documents in seconds with our advanced OCR technology'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with enterprise-grade security'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Track your productivity and document processing insights'
    }
  ];

  return (
    <>
      <Helmet>
        <title>WorkLess AI Hub - Work Less, Achieve More</title>
        <meta name="description" content="Transform handwritten documents into structured digital data with AI-powered conversion. Start for free today." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border-4 border-purple-500 rounded-lg mb-8"
            >
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-bold">AI-Powered Document Processing</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
              Work Less,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Achieve More
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Transform handwritten documents into structured digital data instantly with our AI-powered conversion technology. Save hours of manual work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg px-8 py-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Start for Free
              </Button>
              <Button
                onClick={() => navigate('/pricing')}
                variant="outline"
                className="bg-white text-black hover:bg-slate-100 font-bold text-lg px-8 py-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                View Pricing
              </Button>
            </div>
          </motion.div>

          {/* Animated Background Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-slate-950/50">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-center mb-16 text-white"
            >
              Why Choose WorkLess AI?
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1"
                >
                  <feature.icon className="w-12 h-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-black">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500 to-pink-500 p-12 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who are already working smarter, not harder.
            </p>
            <Button
              onClick={() => navigate('/auth')}
              className="bg-white text-purple-600 hover:bg-slate-100 font-bold text-lg px-10 py-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Get Started Now
            </Button>
          </motion.div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;