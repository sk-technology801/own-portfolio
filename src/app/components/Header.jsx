"use client"
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Header = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }

    // Canvas Particle Animation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 200; // Fixed height for header

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 200;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [controls, inView]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

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

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: 90 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: 1.5, ease: 'easeOut' },
    },
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="relative bg-black text-white px-6 md:px-12 py-8 overflow-hidden">
      {/* Canvas Particle Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 opacity-50"
      />

      {/* Glassmorphism Navigation Bar */}
      <motion.nav
        ref={ref}
        className="relative z-10 flex justify-between items-center max-w-7xl mx-auto bg-gray-900 bg-opacity-30 backdrop-blur-lg rounded-full px-6 py-4 shadow-[0_0_15px_rgba(34,197,94,0.5)] border border-green-500 border-opacity-20"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        {/* Logo with 3D Neon Effect */}
        <motion.div variants={logoVariants}>
          <Link href="/" className="text-4xl font-extrabold tracking-tight relative group">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-700 drop-shadow-[0_3px_6px_rgba(34,197,94,0.8)]">
              YourName
            </span>
            <span className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-800 opacity-30 blur-lg group-hover:blur-xl transition-all duration-500" />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.ul className="hidden md:flex space-x-8" variants={containerVariants}>
          {navItems.map((item) => (
            <motion.li
              key={item.name}
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotateX: 10, color: '#22c55e' }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className="text-lg font-semibold relative group"
              >
                <span className="text-gray-200 group-hover:text-green-400 transition-colors duration-300">
                  {item.name}
                </span>
                <span className="absolute left-0 bottom-[-6px] w-0 h-1 bg-green-500 group-hover:w-full transition-all duration-500 ease-out" />
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <motion.button
            onClick={toggleMenu}
            className="focus:outline-none"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-8 h-8 text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.7)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              />
            </svg>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu with Glassmorphism */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden mt-4 bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
          initial={{ opacity: 0, height: 0, y: -20 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <motion.li
                key={item.name}
                variants={itemVariants}
                whileHover={{ x: 10, color: '#22c55e' }}
              >
                <Link
                  href={item.href}
                  className="text-lg font-semibold text-gray-200 hover:text-green-400 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Neon Border Effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50 animate-neon" />

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
    </header>
  );
};

export default Header;