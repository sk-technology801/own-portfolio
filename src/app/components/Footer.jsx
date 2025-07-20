"use client";
import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import Link from 'next/link';

// Footer Particle System (matches homepage header particles)
const FooterParticles = ({ mousePosition }) => {
  const pointsRef = useRef();
  const particleCount = 50; // Matches homepage header particle count
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  useFrame(() => {
    const positions = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Apply mouse interaction only if mousePosition is defined
      if (mousePosition && typeof mousePosition.x === 'number' && typeof mousePosition.y === 'number') {
        positions[i * 3] += (mousePosition.x / window.innerWidth - 0.5) * 0.02;
        positions[i * 3 + 1] += (mousePosition.y / window.innerHeight - 0.5) * 0.02;
      }

      // Boundary checks
      if (positions[i * 3] > 10 || positions[i * 3] < -10) velocities[i * 3] *= -1;
      if (positions[i * 3 + 1] > 2.5 || positions[i * 3 + 1] < -2.5) velocities[i * 3 + 1] *= -1;
      if (positions[i * 3 + 2] > 5 || positions[i * 3 + 2] < -5) velocities[i * 3 + 2] *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        color="#22c55e" // Matches homepage green
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </Points>
  );
};

// Footer Branding Component
const FooterBranding = () => {
  return (
    <motion.div
      className="text-center md:text-left"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <Link
        href="/home"
        className="text-2xl font-extrabold tracking-tight relative group mb-2 inline-block"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-700 drop-shadow-[0_3px_6px_rgba(34,197,94,0.8)]">
          SK-TECHNOLOGY-801
        </span>
        <span className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-800 opacity-30 blur-lg group-hover:blur-xl transition-all duration-500" />
      </Link>
      <p className="text-green-400 text-sm">
        © 2025 SK-TECHNOLOGY-801. All rights reserved.
      </p>
    </motion.div>
  );
};

// Footer Socials Component (with particle effects)
const FooterSocials = () => {
  const [particles, setParticles] = useState([]);

  const createParticle = (id) => {
    const newParticle = {
      id,
      x: Math.random() * 20 - 10,
      y: Math.random() * 20 - 10,
      opacity: 1,
    };
    setParticles((prev) => [...prev, newParticle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);
  };

  const socials = [
    {
      name: 'GitHub',
      href: 'https://github.com/sk-technology801',
      icon: 'M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.12-1.47-1.12-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.5 2.28 1.07 2.84.81.09-.64.35-1.07.62-1.32-2.17-.25-4.46-1.09-4.46-4.85 0-1.07.38-1.94 1-2.63 0 0 .33-1.03 0-2.41-1.86-.33-3.83.94-3.83.94-.63-.34-1.31-.51-2-.51s-1.37.17-2 .51c0 0-1.97-1.27-3.83-.94-.33 1.38 0 2.41 0 2.41.62.69 1 1.56 1 2.63 0 3.77-2.3 4.6-4.47 4.85.35.3.66.89.66 1.8v2.66c0 .27.16.58.67.5A10 10 0 0012 22c5.52 0 10-4.48 10-10A10 10 0 0012 2z',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/sk-technology-05080b338/',
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.327-.027-3.037-1.852-3.037-1.854 0-2.137 1.446-2.137 2.941v5.665H9.352V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h-.003z',
    },
    {
      name: 'Twitter',
      href: 'https://x.com',
      icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z',
    },
  ];

  return (
    <motion.div
      className="flex space-x-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {socials.map((social) => (
        <div key={social.name} className="relative">
          <motion.a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 transition-colors duration-300"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => createParticle(social.name + Math.random())}
          >
            <svg
              className="w-6 h-6 drop-shadow-[0_0_5px_rgba(34,197,94,0.7)]"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={social.icon} />
            </svg>
          </motion.a>
        </div>
      ))}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-green-400 rounded-full"
          style={{ left: '50%', top: '50%' }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: particle.x, y: particle.y, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  );
};

// Footer Gradient Component
const FooterGradient = () => {
  return (
    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50 animate-neon" />
  );
};

// Main Footer Component
export default function Footer({ mousePosition = { x: 0, y: 0 } }) {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: 'easeOut', staggerChildren: 0.3 },
    },
  };

  return (
    <footer className="relative z-10 bg-black bg-opacity-50 backdrop-blur-lg py-8 px-6 md:px-12 border-t border-green-500 border-opacity-30 shadow-[0_0_20px_rgba(34,197,94,0.6)]">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <FooterParticles mousePosition={mousePosition} />
        </Canvas>
      </div>

      {/* Main Footer Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <FooterBranding />
        <FooterSocials />
      </motion.div>

      <FooterGradient />

      {/* CSS for Animations */}
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
    </footer>
  );
}