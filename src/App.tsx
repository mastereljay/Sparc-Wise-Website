/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, useMotionValue } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import { 
  Home, 
  Briefcase, 
  Rocket, 
  Users, 
  Leaf, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ArrowRight, 
  MapPin, 
  Mail, 
  Phone,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { cn } from './lib/utils';
import CommunityDirectory from './components/CommunityDirectory';
import { PROGRAMS, NAV_ITEMS } from './constants';
import heroImage from './images/heroimage2.png';
import visionImage from './images/river.png';
import aboutImage from './images/GPsign.png';
import transparencyImage from './images/shops.png';

const IconMap: Record<string, any> = {
  Home,
  Briefcase,
  Rocket,
  Users,
  Leaf
};

const StatCounter = ({ value, label }: { value: string, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="relative group">
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <p className="text-5xl md:text-7xl font-serif font-bold mb-2 text-white relative z-10">
        {count}{suffix}
      </p>
      <p className="text-xs uppercase tracking-[0.3em] opacity-60 font-bold relative z-10">{label}</p>
    </div>
  );
};

const TextReveal = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(' ');
  return (
    <h2 className={cn("overflow-hidden flex flex-wrap", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8, 
            delay: i * 0.05,
            ease: [0.215, 0.61, 0.355, 1]
          }}
          className="inline-block mr-[0.25em] py-1"
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
};

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSize = useMotionValue(32);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const cursorSizeSpring = useSpring(cursorSize, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea')) {
        cursorSize.set(64);
      } else {
        cursorSize.set(32);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 bg-accent/30 rounded-full pointer-events-none z-[9999] mix-blend-difference backdrop-blur-[2px] hidden md:block"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        width: cursorSizeSpring,
        height: cursorSizeSpring,
        x: "-50%",
        y: "-50%",
      }}
    />
  );
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"]
  });
  const { scrollYProgress: pathScrollYProgress } = useScroll({
    target: pathRef,
    offset: ["start end", "end start"]
  });

  // Smooth Scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(heroScroll, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.5], [1, 0.9]);
  const heroY = useTransform(heroScroll, [0, 0.5], [0, 100]);
  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);

  // Parallax transforms for hero text
  const heroTextLeft = useTransform(heroScroll, [0, 1], [0, -50]);
  const heroTextRight = useTransform(heroScroll, [0, 1], [0, 50]);

  // Background color transition
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["#ffffff", "#f5f5f0", "#ffffff", "#0a0a0a", "#ffffff", "#ffffff"]
  );

  // Vision image transforms
  const visionScale = useTransform(scrollYProgress, [0.1, 0.3], [1, 1.2]);
  const visionRotate = useTransform(scrollYProgress, [0.1, 0.3], [0, 5]);

  // Impact text transform
  const impactX = useTransform(scrollYProgress, [0.5, 0.8], ["-20%", "20%"]);

  // Public section rotate
  const publicRotate = useTransform(scrollYProgress, [0.7, 0.9], [0, 10]);

  // SVG path length
  const pathLength = useTransform(pathScrollYProgress, [0, 1], [0, 1]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ firstName: '', lastName: '', email: '', message: '' });
    }, 1500);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <motion.div 
      ref={containerRef} 
      style={{ backgroundColor: isDarkMode ? "#000000" : bgColor }}
      className="min-h-screen font-sans selection:bg-accent selection:text-white overflow-x-hidden max-w-full relative transition-colors duration-500"
    >
      <CustomCursor />
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left"
        style={{ scaleX: scaleProgress }}
      />

      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.a 
            href="#home" 
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-serif text-xl font-bold group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight">Sparc Wise</span>
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item, idx) => (
              <motion.a 
                key={item.label} 
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full" />
              </motion.a>
            ))}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <motion.a 
              href="#donate" 
              whileHover={{ scale: 1.1, x: 5, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-lg shadow-primary/20"
            >
              Donate
            </motion.a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white dark:bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {NAV_ITEMS.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-serif italic hover:text-accent transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <motion.a
                href="#donate"
                onClick={() => setIsMenuOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white py-4 rounded-xl text-lg font-bold mt-8 shadow-xl block text-center"
              >
                Donate Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: heroBgY }}
        >
          <img 
            src={heroImage}
            alt="Grants Pass Oregon" 
            className="w-full h-full object-cover opacity-40 dark:opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/50 to-bg" />
        </motion.div>

        <motion.div 
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full border border-primary/30 text-xs font-bold uppercase tracking-[0.2em] mb-6">
              Empowering Josephine County
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold leading-[0.9] mb-8 tracking-tighter">
              <motion.span 
                style={{ x: heroTextLeft }}
                className="block"
              >
                Strengthening <span className="italic text-primary">Partnerships</span>,
              </motion.span>
              <motion.span 
                style={{ x: heroTextRight }}
                className="block"
              >
                Reviving <span className="italic text-accent">Communities</span>.
              </motion.span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-80 mb-10 leading-relaxed font-light">
              We identify and address unmet community needs through innovative, inclusive, and sustainable solutions in housing, education, and economic development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="#programs" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                Explore Programs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a 
                href="#vision" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-ink/20 px-8 py-4 rounded-full font-bold hover:bg-ink hover:text-bg transition-all"
              >
                Our Vision
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      <section id="vision" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start relative z-10">
          <div className="md:sticky md:top-32 h-fit">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-900">
                <motion.img 
                  style={{ scale: visionScale, rotate: visionRotate }}
                  src={visionImage} 
                  alt="Community Impact" 
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-8 -right-8 bg-accent text-white p-8 rounded-3xl shadow-2xl hidden lg:block max-w-xs"
              >
                <p className="font-serif italic text-xl mb-2">"A thriving Josephine County where everyone has access to reach their full potential."</p>
                <p className="text-sm opacity-80 font-bold uppercase tracking-widest">— Our Vision</p>
              </motion.div>
            </motion.div>
          </div>
          
          <div className="space-y-24 py-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <TextReveal text="Bridging the Gaps in Our Community" className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight" />
              <p className="text-xl opacity-70 leading-relaxed mb-12">
                We believe that every challenge is an opportunity for innovation. By focusing on the most pressing needs of Josephine County, we create sustainable models for growth and resilience.
              </p>
            </motion.div>

            <div className="space-y-16">
              {[
                { title: "Identify & Fill Service Gaps", desc: "We work collaboratively with existing organizations to identify genuine service gaps rather than duplicating efforts. Our goal is to strengthen the entire ecosystem of support." },
                { title: "Universal Needs-Based Support", desc: "Serving all individuals based solely on their circumstances, regardless of background or identity. We believe in radical inclusivity and dignity for all." },
                { title: "Sustainable Community Assets", desc: "Revitalizing underutilized properties\u2014including hotels and agricultural facilities\u2014to serve as anchor sites for change. These assets become the foundation for our programs." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="group flex gap-8 items-start"
                >
                  <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <CheckCircle2 size={28} className="transition-transform" />
                  </div>
                  <div>
                    <h3 className="font-serif italic text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-lg opacity-70 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="news" className="py-32 px-6 border-t border-ink/5">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4"
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-2">News</h2>
              <p className="opacity-60">Latest updates from our community initiatives.</p>
            </div>
            <motion.a 
              href="#" 
              whileHover={{ x: 5 }}
              className="text-sm font-bold uppercase tracking-widest text-accent flex items-center gap-2"
            >
              View All News <ArrowRight size={16} />
            </motion.a>
          </motion.div>

          <div className="space-y-8">
            {[
              { date: '2026/03/20', title: 'New Affordable Housing Project Approved for Grants Pass' },
              { date: '2026/02/15', title: 'Entertainment Industry Trade School Welcomes First Cohort' },
              { date: '2026/01/10', title: 'Sparc Wise Receives 501(c)(3) Status Confirmation' }
            ].map((news, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 10 }}
                className="group flex flex-col md:flex-row md:items-center gap-4 md:gap-12 py-8 border-b border-ink/5 cursor-pointer"
              >
                <span className="font-mono text-sm opacity-40">{news.date}</span>
                <h3 className="text-xl md:text-3xl font-serif group-hover:text-primary transition-colors">{news.title}</h3>
                <ArrowRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all text-primary" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="programs" className="py-32 bg-ink text-bg relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-8xl font-serif font-bold mb-6 italic tracking-tighter">Core Programs</h2>
            <p className="opacity-60 max-w-2xl text-lg">Our strategic approach focuses on five key pillars to revitalize Josephine County.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROGRAMS.map((program, idx) => {
              const Icon = IconMap[program.icon];
              return (
                <motion.div 
                  key={program.id}
                  whileHover={{ y: -10, scale: 1.05, boxShadow: "0 20px 30px -10px rgba(255,255,255,0.1)" }}
                  className="bg-white/5 backdrop-blur-md p-12 rounded-[3rem] border border-white/10 flex flex-col justify-between group relative overflow-hidden transition-all duration-300"
                >
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                  <div>
                    <div className="w-20 h-20 bg-accent text-white rounded-[2rem] flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-accent/20">
                      <Icon size={40} />
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-8 italic">{program.title}</h3>
                    <p className="opacity-70 mb-10 text-lg leading-relaxed">{program.description}</p>
                  </div>
                  <ul className="space-y-4">
                    {program.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0 shadow-[0_0_15px_rgba(255,182,18,0.6)]" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-40">Program 0{idx + 1}</span>
                    <motion.div 
                      whileHover={{ scale: 1.2, rotate: 45 }}
                      className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white hover:text-ink transition-all"
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CommunityDirectory />

      <section className="py-48 px-6 bg-accent text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          <StatCounter value="150+" label="Housing Units" />
          <StatCounter value="250+" label="Students Trained" />
          <StatCounter value="25+" label="Businesses Incubated" />
          <StatCounter value="10k+" label="Meals Served" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <motion.p 
            style={{ x: impactX }}
            className="text-[25vw] font-serif font-black italic whitespace-nowrap"
          >
            IMPACT &bull; IMPACT &bull; IMPACT &bull; IMPACT
          </motion.p>
        </div>
      </section>

      <section id="about" className="py-32 px-6 overflow-hidden relative">
        <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10" viewBox="0 0 1000 1000">
          <motion.path
            ref={pathRef}
            d="M 500 0 Q 600 250 500 500 T 500 1000"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ pathLength: pathLength }}
          />
        </svg>

        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight">Rooted in <br /><span className="text-primary italic">Grants Pass</span></h2>
              <p className="text-lg opacity-70 mb-8 leading-relaxed">
                SPARC WISE is a newly formed organization, established in 2025 to address critical gaps in community services in Grants Pass, Oregon. Founded by community leaders who recognized the need for an integrated approach to development.
              </p>
              <p className="text-lg opacity-70 mb-12 leading-relaxed">
                We don't just provide services; we build pathways. From converting distressed hotels into beautiful affordable homes to training the next generation of digital media creators and sustainable farmers.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10"
                >
                  <h4 className="font-bold text-xl mb-3">Collaboration</h4>
                  <p className="text-sm opacity-60">Working hand-in-hand with local government and nonprofits.</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="p-8 bg-accent/5 rounded-[2rem] border border-accent/10"
                >
                  <h4 className="font-bold text-xl mb-3">Innovation</h4>
                  <p className="text-sm opacity-60">Creative solutions for persistent community challenges.</p>
                </motion.div>
              </div>
            </motion.div>

            <div className="order-1 md:order-2 relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="aspect-square rounded-full border-2 border-dashed border-primary/30 p-6"
              >
                <div className="w-full h-full rounded-full overflow-hidden shadow-2xl">
                  <img 
                    src={aboutImage}
                    alt="Josephine County" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 p-6 rounded-full shadow-2xl z-20"
              >
                <Heart className="text-accent fill-accent" size={48} />
              </motion.div>
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute top-0 right-0 bg-primary text-white p-4 rounded-2xl shadow-xl"
              >
                <Users size={24} />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 2 }}
                className="absolute bottom-12 left-0 bg-accent text-white p-4 rounded-2xl shadow-xl"
              >
                <Leaf size={24} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="public" className="py-32 px-6 bg-primary/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">Public Notice</h2>
            <p className="text-xl opacity-70 mb-12 leading-relaxed">
              As a public benefit corporation, Sparc Wise is committed to transparency. We maintain open communication with stakeholders about our goals, methods, challenges, and outcomes.
            </p>
            <div className="space-y-6">
              {[
                "2025 Annual Financial Report",
                "Articles of Incorporation",
                "Board Meeting Minutes"
              ].map((doc, i) => (
                <motion.a 
                  key={i}
                  href="#" 
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center justify-between p-8 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group border border-ink/5"
                >
                  <span className="font-bold text-lg">{doc}</span>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="relative"
            style={{ rotate: publicRotate }}
          >
            <div className="aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl">
              <img 
                src={transparencyImage}
                alt="Transparency" 
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: [-12, -8, -12] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-accent rounded-full flex items-center justify-center text-white shadow-2xl"
            >
              <span className="font-serif italic text-2xl font-bold">Verified</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="donate" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
          
          {/* Left Column: Copy & Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-8"
          >
            <div>
              <span className="inline-block px-4 py-1 rounded-full border border-accent/30 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-accent">
                Make an Impact
              </span>
              <TextReveal text="Support Our Mission" className="text-4xl md:text-6xl font-serif font-bold mb-8 leading-tight" />
              <p className="text-xl opacity-70 leading-relaxed mb-6">
                At SPARC WISE, we know that change starts with people like you. Every act of kindness, every dollar, and every moment of your time brings us closer to achieving our mission.
              </p>
              <p className="text-lg opacity-70 leading-relaxed">
                Together, we can create a brighter, more compassionate world for all in Josephine County.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              {[
                {
                  title: "100% Tax Deductible",
                  desc: "As a registered 501(c)(3) nonprofit organization, all donations to Sparc Wise are fully tax-deductible."
                },
                {
                  title: "No Platform Fees",
                  desc: "We use Zeffy for our campaigns, ensuring that 100% of your donation goes directly to our community programs instead of processor fees."
                },
                {
                  title: "Direct Community Impact",
                  desc: "Your contribution directly funds transitional housing conversions, workforce trade schools, and local food distribution."
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                    <Heart size={20} className="fill-accent/20" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-sm opacity-60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Embedded Zeffy Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 w-full bg-white dark:bg-zinc-900/50 backdrop-blur-md rounded-[3rem] border border-ink/5 dark:border-white/10 p-4 md:p-6 shadow-2xl overflow-hidden"
          >
            <div className="relative w-full h-[750px] overflow-hidden rounded-[2rem]">
              <iframe
                title="Donation form powered by Zeffy"
                style={{
                  position: 'absolute',
                  border: 0,
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent'
                }}
                src="https://www.zeffy.com/embed/donation-form/donate-to-change-lives-15646"
                allow="payment"
              />
            </div>
          </motion.div>

        </div>
      </section>

      <section id="contact" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-900 rounded-[4rem] overflow-hidden shadow-2xl grid md:grid-cols-2 border border-ink/5"
          >
            <div className="p-12 md:p-24">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 italic">Get in Touch</h2>
              {isSubmitted ? (
                <div className="text-center py-20">
                  <CheckCircle2 size={64} className="text-accent mx-auto mb-6" />
                  <h3 className="text-3xl font-serif font-bold mb-4">Message Sent!</h3>
                  <p className="opacity-70">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label htmlFor="firstName" className="text-xs font-bold uppercase tracking-widest opacity-60">First Name</label>
                      <input 
                        id="firstName"
                        type="text" 
                        required
                        value={formState.firstName}
                        onChange={(e) => setFormState({...formState, firstName: e.target.value})}
                        className="w-full bg-primary/5 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label htmlFor="lastName" className="text-xs font-bold uppercase tracking-widest opacity-60">Last Name</label>
                      <input 
                        id="lastName"
                        type="text" 
                        required
                        value={formState.lastName}
                        onChange={(e) => setFormState({...formState, lastName: e.target.value})}
                        className="w-full bg-primary/5 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest opacity-60">Email</label>
                    <input 
                      id="email"
                      type="email" 
                      required
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className="w-full bg-primary/5 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest opacity-60">Message</label>
                    <textarea 
                      id="message"
                      rows={4} 
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({...formState, message: e.target.value})}
                      className="w-full bg-primary/5 border-none rounded-2xl p-5 focus:ring-2 focus:ring-primary outline-none resize-none transition-all" 
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full bg-accent text-white py-5 rounded-2xl font-bold hover:shadow-2xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              )}
            </div>
            <div className="bg-primary p-12 md:p-24 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-12 italic leading-tight">"Strengthening Partnerships And Reviving Communities."</h3>
                <div className="space-y-8">
                  <motion.div whileHover={{ x: 10 }} className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><MapPin size={20} /></div>
                    <span className="text-lg">7010 Lower River Rd, Grants Pass, OR 97526</span>
                  </motion.div>
                  <motion.div whileHover={{ x: 10 }} className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Mail size={20} /></div>
                    <span className="text-lg">hello@sparcwise.org</span>
                  </motion.div>
                  <motion.div whileHover={{ x: 10 }} className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Phone size={20} /></div>
                    <span className="text-lg">(541) 555-0123</span>
                  </motion.div>
                </div>
              </div>
              <div className="mt-16 pt-16 border-t border-white/10 relative z-10">
                <p className="text-sm font-bold uppercase tracking-widest opacity-60 mb-6">Follow our journey</p>
                <div className="flex flex-wrap gap-8">
                  {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map(social => (
                    <a key={social} href="#" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">{social}</a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-ink/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-serif text-xl font-bold">
              S
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight">Sparc Wise</span>
          </div>
          <p className="text-sm opacity-40 max-w-md text-center md:text-left">
            &copy; 2026 Sparc Wise. 501(c)(3) Nonprofit Organization. <br />
            Dedicated to uplifting Josephine County, Oregon.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" className="text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Terms</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}
