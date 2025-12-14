import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Calendar, 
  Heart, 
  Gamepad2, 
  BarChart3, 
  MessageCircle,
  Sparkles,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Mood Detection',
    description: 'Advanced facial recognition and journal analysis to understand your emotional state.'
  },
  {
    icon: Calendar,
    title: 'Smart Calendar',
    description: 'AI-powered event planning that predicts how activities will affect your mood.'
  },
  {
    icon: Heart,
    title: 'Feel & Heal Room',
    description: 'Ambient sounds, guided reflections, and therapeutic tools for emotional wellness.'
  },
  {
    icon: Gamepad2,
    title: 'Cognitive Quests',
    description: 'Mind-relaxing games tailored to your current mood for optimal mental exercise.'
  },
  {
    icon: BarChart3,
    title: 'Weekly Reports',
    description: 'Track your emotional patterns and get AI-powered insights for growth.'
  },
  {
    icon: MessageCircle,
    title: 'AI Wellness Chat',
    description: 'Your personal wellness companion available 24/7 for support and guidance.'
  }
];

const benefits = [
  {
    icon: Sparkles,
    title: 'Personalized Experience',
    description: 'Every feature adapts to your unique emotional patterns.'
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your wellness data is encrypted and never shared.'
  },
  {
    icon: Zap,
    title: 'Real-time Insights',
    description: 'Instant feedback and suggestions based on your current state.'
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gradient">MendMind</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-sm sm:text-base">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0 text-sm sm:text-base">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Your Personal{' '}
              <span className="text-gradient">Mental Wellness</span>{' '}
              Companion
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              MendMind uses AI to understand your emotions, predict your mood patterns, 
              and guide you towards a balanced, healthier mind.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gradient-primary text-primary-foreground border-0 text-base sm:text-lg px-6 sm:px-8">
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating mood emojis - hidden on very small screens, grid on mobile */}
          <div className="relative mt-10 sm:mt-16 h-16 sm:h-32 hidden xs:block">
            <div className="flex justify-center gap-4 sm:gap-0 sm:block">
              {['😊', '😌', '🧘', '💪', '🎯', '❤️'].map((emoji, index) => (
                <motion.div
                  key={index}
                  className="text-2xl sm:text-4xl sm:absolute"
                  style={{
                    left: `${10 + index * 14}%`,
                    top: '50%',
                  }}
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: 'easeInOut',
                  }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 px-2"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Everything You Need for <span className="text-gradient">Mental Wellness</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              A comprehensive suite of AI-powered tools designed to support your emotional health journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass border-0 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center mb-3 sm:mb-4">
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-gradient">MendMind</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{benefit.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="glass border-0 overflow-hidden">
            <div className="gradient-primary p-6 sm:p-8 md:p-12 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground mb-3 sm:mb-4">
                Ready to Transform Your Mental Wellness?
              </h2>
              <p className="text-sm sm:text-base text-primary-foreground/80 mb-4 sm:mb-6 max-w-xl mx-auto">
                Join thousands of users who have discovered a healthier, more balanced life with MendMind.
              </p>
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">MendMind</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MendMind. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
