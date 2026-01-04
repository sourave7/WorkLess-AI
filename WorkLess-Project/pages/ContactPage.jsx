import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Send, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you shortly."
      });
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - WorkLess AI Hub</title>
        <meta name="description" content="Get in touch with the WorkLess AI team. We're here to help." />
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
                Get in Touch
              </h1>
              <p className="text-xl text-slate-300">
                Have questions? We'd love to hear from you.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                  <h2 className="text-3xl font-black text-black mb-6">Contact Info</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg border-2 border-black">
                        <Mail className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black text-lg">Email Us</h3>
                        <a href="mailto:iamsouravmaurya@gmail.com" className="text-slate-600 hover:text-purple-600 font-medium transition-colors">
                          iamsouravmaurya@gmail.com
                        </a>
                        <p className="text-slate-500 text-sm mt-1">We typically reply within 24 hours.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg border-2 border-black">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-black text-lg">Location</h3>
                        <p className="text-slate-600">
                          WorkLess AI HQ<br />
                          Tech Hub District<br />
                          Bangalore, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-white">
                  <h3 className="text-2xl font-black mb-2">Need Immediate Help?</h3>
                  <p className="mb-4 opacity-90">Check our support center for quick answers to common questions.</p>
                  <Button 
                    onClick={() => window.location.href = '/support'}
                    className="bg-white text-purple-600 hover:bg-slate-100 font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Visit Support Center
                  </Button>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-white rounded-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
                  <h2 className="text-3xl font-black text-black mb-6">Send a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-black font-bold mb-2 block">Name</Label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-4 border-black rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-black font-bold mb-2 block">Email</Label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-4 border-black rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all"
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-black font-bold mb-2 block">Message</Label>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-4 border-black rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all min-h-[150px] resize-none"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-black hover:bg-slate-800 text-white font-bold text-lg py-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Send className="w-5 h-5" />
                          Send Message
                        </span>
                      )}
                    </Button>
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

export default ContactPage;