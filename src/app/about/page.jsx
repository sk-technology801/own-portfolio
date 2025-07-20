"use client"
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import Header from '../components/Header';

const ParticleButton = ({ children, href, download }) => {
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
        download={download}
        className="inline-block px-8 py-4 text-lg font-semibold bg-green-600 hover:bg-green-700 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.7)] dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-[0_0_15px_rgba(255,255,255,0.7)]"
        onClick={createParticle}
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

const AnimatedAvatar = () => {
  const [particles, setParticles] = useState([]);

  const handleHover = () => {
    setParticles((prev) => [
      ...prev,
      ...Array.from({ length: 5 }, () => ({
        id: Math.random(),
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        opacity: 1,
      })),
    ]);
  };

  useEffect(() => {
    const fadeParticles = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.02 }))
          .filter((p) => p.opacity > 0)
      );
    }, 50);
    return () => clearInterval(fadeParticles);
  }, []);

  return (
    <div className="relative w-48 h-48 mx-auto">
      <motion.img
        src="https://via.placeholder.com/150?text=Avatar"
        alt="Avatar"
        className="w-full h-full rounded-full border-4 border-green-500 dark:border-gray-300 shadow-[0_0_15px_rgba(34,197,94,0.7)] dark:shadow-[0_0_15px_rgba(255,255,255,0.7)]"
        onMouseEnter={handleHover}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
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

export default function About() {
  const [theme, setTheme] = useState('dark');
  const [bioText, setBioText] = useState('');
  const fullBio = 'I’m a passionate developer with expertise in web development, 3D graphics, and innovative technologies.';
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    // Theme Handling
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Typewriter Animation for Bio
    if (inView) {
      controls.start('visible');
      let i = 0;
      const typing = setInterval(() => {
        if (i < fullBio.length) {
          setBioText(fullBio.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 50);
      return () => clearInterval(typing);
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

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: 90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const progressVariants = {
    hidden: { width: 0 },
    visible: ({ width }) => ({
      width: `${width}%`,
      transition: { duration: 1, ease: 'easeOut' },
    }),
  };

  const timelineVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
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
        {/* About Me Section */}
        <motion.section
          className="flex flex-col md:flex-row items-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <AnimatedAvatar />
          </div>
          <div className="w-full md:w-2/3 md:pl-8">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-700 drop-shadow-[0_2px_4px_rgba(34,197,94,0.5)] dark:from-gray-800 dark:to-gray-400 dark:drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]">
                About Me
                <span className="animate-cursor">|</span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-600">
              {bioText}
            </p>
            <p className="text-gray-300 mt-4 dark:text-gray-600">
              With a focus on creating immersive and innovative solutions, I specialize in blending modern web technologies with 3D graphics to deliver unique user experiences. Explore my journey and skills below!
            </p>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          ref={ref}
        >
          <h2 className="text-3xl font-bold text-center text-green-400 mb-8 dark:text-green-600">
            Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: 'JavaScript', proficiency: 90 },
              { name: 'React', proficiency: 85 },
              { name: 'Next.js', proficiency: 80 },
              { name: 'Three.js', proficiency: 75 },
              { name: 'Tailwind CSS', proficiency: 90 },
              { name: 'Node.js', proficiency: 70 },
            ].map((skill) => (
              <motion.div
                key={skill.name}
                className="w-40 bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 text-center dark:bg-gray-100 dark:bg-opacity-50"
                variants={skillVariants}
                whileHover={{ scale: 1.1, rotateY: 180 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-gray-200 dark:text-gray-800">{skill.name}</span>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden dark:bg-gray-300">
                  <motion.div
                    className="h-full bg-green-500 dark:bg-green-600"
                    initial="hidden"
                    animate="visible"
                    custom={{ width: skill.proficiency }}
                    variants={progressVariants}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Achievements Timeline */}
        <motion.section
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-3xl font-bold text-center text-green-400 mb-8 dark:text-green-600">
            Achievements
          </h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-1 h-full bg-green-500 dark:bg-green-600" />
            {[
              { year: '2023', event: 'Completed Advanced React Course' },
              { year: '2024', event: 'Published Open-Source 3D Library' },
              { year: '2025', event: 'Won Hackathon for AR Innovation' },
            ].map((achievement, index) => (
              <motion.div
                key={achievement.year}
                className={`flex items-center mb-8 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}
                variants={timelineVariants}
              >
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-4' : 'md:text-left md:pl-4'}`}>
                  <h3 className="text-xl font-semibold text-green-400 dark:text-green-600">{achievement.year}</h3>
                  <p className="text-gray-300 dark:text-gray-600">{achievement.event}</p>
                </div>
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 bg-green-500 rounded-full dark:bg-green-600" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
        >
          <ParticleButton href="/resume.pdf" download>
            Download Resume
          </ParticleButton>
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