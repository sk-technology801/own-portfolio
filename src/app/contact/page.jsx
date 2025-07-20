"use client"
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Header from '../components/Header';

const ParticleButton = ({ children, onClick, disabled }) => {
  const [particles, setParticles] = useState([]);

  const createParticle = () => {
    const newParticle = {
      id: Math.random(),
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      opacity: 1,
    };
    setParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={`inline-block px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.7)] dark:shadow-[0_0_15px_rgba(255,255,255,0.7)] ${
          disabled
            ? 'bg-gray-600 cursor-not-allowed dark:bg-gray-500'
            : 'bg-green-600 hover:bg-green-700 dark:bg-gray-800 dark:hover:bg-gray-700'
        }`}
        onClick={() => {
          if (!disabled) {
            createParticle();
            if (onClick) onClick();
          }
        }}
        disabled={disabled}
      >
        {children}
      </button>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-green-400 rounded-full dark:bg-white"
          style={{ left: '50%', top: '50%' }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: particle.x, y: particle.y, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

export default function Contact() {
  const [theme, setTheme] = useState('dark');
  const [heroText, setHeroText] = useState('');
  const fullHeroText = 'Get in Touch';
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  // Typewriter Effect and Theme Handling
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (inView) {
      controls.start('visible');
      let i = 0;
      const typing = setInterval(() => {
        if (i < fullHeroText.length) {
          setHeroText(fullHeroText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 100);
      return () => clearInterval(typing);
    }
  }, [controls, inView, theme]);

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitted(true);
      setErrors({});
      // Simulate form submission (replace with actual API call if needed)
      console.log('Form submitted:', formData);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 2000);
    } else {
      setErrors(validationErrors);
    }
  };

  // Form Input Handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: 'easeOut', staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, rotate: 10 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} relative overflow-hidden transition-colors duration-300`}>
      {/* Parallax Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.2)_0%,_transparent_70%)] opacity-30 dark:bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.2)_0%,_transparent_70%)]" />

      {/* Header */}
      <Header theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-700 drop-shadow-[0_2px_4px_rgba(34,197,94,0.5)] dark:from-gray-800 dark:to-gray-400 dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]">
              {heroText}
              <span className="animate-cursor">|</span>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto dark:text-gray-600">
            Reach out to collaborate, discuss projects, or just say hello! Fill out the form below or connect via social media.
          </p>
        </motion.section>

        {/* Contact Form */}
        <motion.section
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          ref={ref}
        >
          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-lg p-8 shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-500 border-opacity-20 dark:bg-gray-100 dark:bg-opacity-50 dark:border-gray-300 dark:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-lg font-semibold text-gray-200 dark:text-gray-800">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-green-500 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-200 dark:bg-opacity-50 dark:border-gray-300 dark:focus:ring-gray-500 text-gray-200 dark:text-gray-800"
                  placeholder="Your Name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              </motion.div>
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-lg font-semibold text-gray-200 dark:text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full mt-2 p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-green-500 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-200 dark:bg-opacity-50 dark:border-gray-300 dark:focus:ring-gray-500 text-gray-200 dark:text-gray-800"
                  placeholder="Your Email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </motion.div>
              <motion.div variants={itemVariants}>
                <label htmlFor="message" className="block text-lg font-semibold text-gray-200 dark:text-gray-800">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full mt-2 p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-green-500 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-200 dark:bg-opacity-50 dark:border-gray-300 dark:focus:ring-gray-500 text-gray-200 dark:text-gray-800"
                  placeholder="Your Message"
                />
                {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
              </motion.div>
              <motion.div variants={itemVariants} className="text-center">
                <ParticleButton disabled={isSubmitted}>
                  {isSubmitted ? 'Submitted!' : 'Send Message'}
                </ParticleButton>
              </motion.div>
            </form>
          </div>
        </motion.section>

        {/* Social Links */}
        <motion.section
          className="mb-16 text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-3xl font-bold text-green-400 mb-8 dark:text-green-600">
            Connect with Me
          </h2>
          <div className="flex justify-center gap-8">
            {[
              { name: 'GitHub', href: 'https://github.com/sk-technology801', icon: 'M12 2C6.48 2 2 6.48 2 12c0 4.41 2.87 8.14 6.84 9.49.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.34-3.37-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.64-1.35-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.26.1-2.63 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.11 2.52.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.38.1 2.63.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.56 4.94.36.31.68.94.68 1.9v2.81c0 .27.18.58.69.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z' },
              { name: 'LinkedIn', href: 'https://www.linkedin.com/in/sk-technology-05080b338/', icon: 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.39V8.41h3.42v1.56h.05c.48-.91 1.65-1.87 3.39-1.87 3.62 0 4.29 2.38 4.29 5.48v6.87zM5.34 6.85c-1.15 0-2.08-.93-2.08-2.08 0-1.15.93-2.08 2.08-2.08 1.15 0 2.08.93 2.08 2.08 0 1.15-.93 2.08-2.08 2.08zm1.78 13.6H3.56V8.41h3.56v12.04zM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z' },
              { name: 'Twitter', href: 'https://x.com', icon: 'M18.24 4.15c.66.44 1.24.98 1.74 1.59-.64.39-1.33.69-2.07.87.75-.45 1.33-1.16 1.6-2.01-.71.42-1.5.72-2.34.88-.67-.71-1.62-1.15-2.67-1.15-2.02 0-3.66 1.64-3.66 3.66 0 .29.03.57.09.85-3.04-.15-5.74-1.61-7.55-3.82-.32.54-.5 1.17-.5 1.84 0 1.27.65 2.39 1.63 3.05-.6-.02-1.16-.18-1.65-.45v.05c0 1.78 1.27 3.27 2.95 3.61-.31.08-.63.13-.96.13-.23 0-.46-.02-.68-.07.46 1.43 1.79 2.47 3.37 2.5-1.24.98-2.8 1.56-4.49 1.56-.29 0-.58-.02-.86-.06 1.61 1.03 3.52 1.63 5.57 1.63 6.68 0 10.34-5.53 10.34-10.34 0-.16 0-.31-.01-.47.71-.51 1.33-1.15 1.82-1.88-.66.29-1.37.49-2.11.58z' },
            ].map((social) => (
              <motion.div
                key={social.name}
                variants={itemVariants}
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="group"
              >
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors duration-300 dark:text-gray-600 dark:hover:text-green-600"
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={social.icon} />
                  </svg>
                  <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 text-sm text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:text-green-600">
                    {social.name}
                  </span>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>


      {/* Custom CSS for Animations */}
      <style jsx>{`
        .animate-neon {
          animation: neon 3s infinite alternate ease-in-out;
        }
        .animate-cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes neon {
          0% {
            opacity: 0.5;
            transform: scaleX(0.8);
          }
          100% {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}