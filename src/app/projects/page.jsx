"use client"
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Header from '../components/Header';

const ParticleButton = ({ children, href, onClick }) => {
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
      <a
        href={href}
        className="inline-block px-8 py-4 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.7)] dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-[0_0_15px_rgba(255,255,255,0.7)]"
        onClick={() => {
          createParticle();
          if (onClick) onClick();
        }}
      >
        {children}
      </a>
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

export default function Projects() {
  const [theme, setTheme] = useState('dark');
  const [filter, setFilter] = useState('All');
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  // Sample project data
  const projects = [
    {
      title: 'Web Portfolio',
      description: 'A cutting-edge portfolio with advanced animations.',
      category: 'Web',
      link: '/projects/web-portfolio',
      image: 'https://via.placeholder.com/300x200?text=Web+Portfolio',
    },
    {
      title: 'ML Dashboard',
      description: 'A real-time machine learning analytics platform.',
      category: 'ML',
      link: '/projects/ml-dashboard',
      image: 'https://via.placeholder.com/300x200?text=ML+Dashboard',
    },
    {
      title: 'AR Experience',
      description: 'An immersive augmented reality mobile app.',
      category: 'AR',
      link: '/projects/ar-experience',
      image: 'https://via.placeholder.com/300x200?text=AR+Experience',
    },
    {
      title: 'E-Commerce Platform',
      description: 'A scalable online store with dynamic features.',
      category: 'Web',
      link: '/projects/ecommerce',
      image: 'https://via.placeholder.com/300x200?text=E-Commerce',
    },
  ];

  // Filtered projects based on category
  const filteredProjects = filter === 'All' ? projects : projects.filter((project) => project.category === filter);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView, theme]);

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

  const projectVariants = {
    hidden: { opacity: 0, scale: 0.9, rotateY: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
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
              My Projects
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto dark:text-gray-600">
            Explore a collection of innovative projects showcasing web development, machine learning, and augmented reality.
          </p>
        </motion.section>

        {/* Filter Buttons */}
        <motion.section
          className="mb-12 flex justify-center gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          ref={ref}
        >
          {['All', 'Web', 'ML', 'AR'].map((category) => (
            <motion.button
              key={category}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${
                filter === category
                  ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.7)] dark:bg-gray-800 dark:shadow-[0_0_15px_rgba(255,255,255,0.7)]'
                  : 'bg-gray-900 bg-opacity-50 text-gray-200 hover:bg-green-600 hover:text-white dark:bg-gray-100 dark:bg-opacity-50 dark:text-gray-800 dark:hover:bg-gray-800'
              }`}
              onClick={() => setFilter(category)}
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.section>

        {/* Project Grid */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.title}
              className="relative bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-500 border-opacity-20 hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300 overflow-hidden dark:bg-gray-100 dark:bg-opacity-50 dark:border-gray-300 dark:shadow-[0_0_15px_rgba(255,255,255,0.4)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
              variants={projectVariants}
              whileHover={{ scale: 1.05, rotateY: 10, rotateX: 5 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-2xl font-bold text-green-400 mb-2 dark:text-green-600">{project.title}</h3>
              <p className="text-gray-300 mb-4 dark:text-gray-600">{project.description}</p>
              <Link
                href={project.link}
                className="text-green-400 hover:text-green-300 transition-colors duration-300 dark:text-green-600 dark:hover:text-green-500"
              >
                View Project →
              </Link>
            </motion.div>
          ))}
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        >
          <ParticleButton href="/contact">Get in Touch</ParticleButton>
        </motion.section>
      </main>

      

      {/* Custom CSS for Animations */}
      <style jsx>{`
        .animate-neon {
          animation: neon 3s infinite alternate ease-in-out;
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
      `}</style>
    </div>
  );
}