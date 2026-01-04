import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      name: 'Basic',
      price: '₹0',
      period: 'forever',
      icon: Zap,
      features: [
        '3 scans per day',
        'AI-powered conversion',
        'Basic analytics',
        'Email support',
        'Secure storage'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '₹999',
      period: 'per month',
      icon: Crown,
      features: [
        'Unlimited scans',
        'Advanced AI processing',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom integrations',
        'Team collaboration'
      ],
      cta: 'Upgrade to Pro',
      highlighted: true
    }
  ];

  const handleSubscribe = async (planName) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (planName === 'Basic') {
      navigate('/dashboard');
      return;
    }

    // Pro plan - Stripe integration placeholder
    setIsProcessing(true);
    
    // Simulate Stripe checkout
    setTimeout(() => {
      toast({
        title: "🚧 Payment Integration",
        description: "Stripe payment integration will be connected to your backend. Redirecting to checkout..."
      });
      setIsProcessing(false);
      
      // In production, this would redirect to Stripe checkout
      // const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      // stripe.redirectToCheckout({ sessionId: response.sessionId });
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Pricing - WorkLess AI Hub</title>
        <meta name="description" content="Choose the perfect plan for your document processing needs. Start free or upgrade for unlimited access." />
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
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-slate-300">
                Choose the plan that works best for you
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl border-4 border-black p-8 ${
                    plan.highlighted 
                      ? 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ring-4 ring-purple-500 relative' 
                      : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-bold text-sm border-4 border-black">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl border-4 border-black ${
                      plan.highlighted ? 'bg-purple-500' : 'bg-slate-200'
                    }`}>
                      <plan.icon className={`w-6 h-6 ${
                        plan.highlighted ? 'text-white' : 'text-black'
                      }`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-black">{plan.name}</h2>
                      <p className="text-sm text-slate-600">{plan.period}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-5xl font-black text-black">{plan.price}</span>
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-1 bg-green-100 rounded-full border-2 border-black flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={isProcessing}
                    className={`w-full font-bold text-lg py-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        : 'bg-white hover:bg-slate-50 text-black'
                    }`}
                  >
                    {isProcessing && plan.highlighted ? 'Processing...' : plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-16 text-center"
            >
              <p className="text-slate-400">
                All plans include enterprise-grade security and data encryption.
              </p>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PricingPage;