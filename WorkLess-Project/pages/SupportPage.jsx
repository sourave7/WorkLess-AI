import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { HelpCircle, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Label } from '@/components/ui/label';

const SupportPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'How many scans do I get with the free plan?',
      answer: 'The Basic plan includes 3 scans per day. The limit resets at midnight.'
    },
    {
      question: 'What file formats are supported?',
      answer: 'We support JPG, PNG, and PDF files for document scanning.'
    },
    {
      question: 'How accurate is the AI conversion?',
      answer: 'Our AI achieves 95%+ accuracy on most handwritten documents. Results may vary based on handwriting clarity.'
    },
    {
      question: 'Can I cancel my Pro subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have Pro access until the end of your billing period.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, all data is encrypted at rest and in transit. We follow industry-standard security practices.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to submit a support ticket."
      });
      return;
    }

    if (!formData.subject || !formData.message) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: user.id,
          subject: formData.subject,
          message: formData.message
        }]);

      if (error) throw error;

      toast({
        title: "Ticket Submitted",
        description: "We'll get back to you within 24 hours."
      });

      setFormData({ subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting ticket:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your ticket."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Support - WorkLess AI Hub</title>
        <meta name="description" content="Get help with WorkLess AI Hub. Browse FAQs or submit a support ticket." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <Navbar />

        <div className="pt-24 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                How Can We Help?
              </h1>
              <p className="text-xl text-slate-300">
                Find answers or reach out to our support team
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-8 h-8 text-purple-500" />
                    <h2 className="text-3xl font-black text-black">FAQ</h2>
                  </div>

                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200"
                      >
                        <h3 className="font-bold text-black mb-2">{faq.question}</h3>
                        <p className="text-slate-600 text-sm">{faq.answer}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Send className="w-8 h-8 text-purple-500" />
                    <h2 className="text-3xl font-black text-black">Submit Ticket</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="subject" className="text-black font-bold mb-2 block">
                        Subject
                      </Label>
                      <input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief description of your issue"
                        className="w-full px-4 py-3 bg-slate-50 border-4 border-black rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-black font-bold mb-2 block">
                        Message
                      </Label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Provide details about your issue..."
                        rows={6}
                        className="w-full px-4 py-3 bg-slate-50 border-4 border-black rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !user}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg py-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="w-5 h-5" />
                          Submit Ticket
                        </span>
                      )}
                    </Button>

                    {!user && (
                      <p className="text-center text-slate-600 text-sm">
                        Please sign in to submit a support ticket
                      </p>
                    )}
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default SupportPage;