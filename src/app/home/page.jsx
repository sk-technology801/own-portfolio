"use client"
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Grid } from '@react-three/drei';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as THREE from 'three';
import Link from 'next/link';

const Cube = ({ isVisible, setIsVisible, setParticles }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current && isVisible) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.scale.setScalar(1 + 0.1 * Math.sin(Date.now() * 0.001));
    }
  });

  const handleHover = () => {
    setIsVisible(false);
    setParticles((prev) => [
      ...prev,
      ...Array.from({ length: 10 }, () => ({
        id: Math.random(),
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4,
        z: (Math.random() - 0.5) * 4,
        opacity: 1,
      })),
    ]);
  };

  return (
    <mesh
      ref={meshRef}
      visible={isVisible}
      onPointerOver={handleHover}
      onPointerOut={() => setIsVisible(true)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color="#22c55e"
        wireframe
        emissive="#22c55e"
        emissiveIntensity={0.7}
      />
    </mesh>
  );
};

const ParticleButton = ({ children, href }) => {
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

export default function Home() {
  const [isCubeVisible, setIsVisible] = useState(true); // Fixed: Renamed setIsVisible to match prop
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cubeParticles, setCubeParticles] = useState([]);
  const [theme, setTheme] = useState('dark');
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Typewriter Effect for Hero Text
  const [heroText, setHeroText] = useState('');
  const fullText = 'Welcome to My Portfolio';

  useEffect(() => {
    // Theme Handling
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Typewriter Animation
    if (inView) {
      controls.start('visible');
      let i = 0;
      const typing = setInterval(() => {
        if (i < fullText.length) {
          setHeroText(fullText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typing);
        }
      }, 100);
      return () => clearInterval(typing);
    }

    // Header Particle Animation
    const canvas = canvasRef.current;
    if (!canvas) return; // Prevent null error

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 200, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, 200);

    const particles = new THREE.Group();
    const particleCount = 50; // Optimized for performance
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x22c55e });

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10
      );
      particle.userData = {
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
      };
      particles.add(particle);
    }

    scene.add(particles);
    camera.position.z = 5;

    const animate = () => {
      particles.children.forEach((particle) => {
        particle.position.add(particle.userData.velocity);
        particle.position.x += (mousePosition.x / window.innerWidth - 0.5) * 0.02;
        particle.position.y += (mousePosition.y / window.innerHeight - 0.5) * 0.02;
        if (particle.position.x > 10 || particle.position.x < -10) particle.userData.velocity.x *= -1;
        if (particle.position.y > 2.5 || particle.position.y < -2.5) particle.userData.velocity.y *= -1;
        if (particle.position.z > 5 || particle.position.z < -5) particle.userData.velocity.z *= -1;
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Mouse Movement Listener
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, 200);
      camera.aspect = window.innerWidth / 200;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
    };
  }, [controls, inView, mousePosition, theme]);

  // Fade out cube particles over time
  useEffect(() => {
    const fadeParticles = setInterval(() => {
      setCubeParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.02 }))
          .filter((p) => p.opacity > 0)
      );
    }, 50);
    return () => clearInterval(fadeParticles);
  }, []);

  const navItems = [
    { name: 'Home', href: '/home' },
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} relative overflow-hidden transition-colors duration-300`}>
      {/* Parallax Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.2)_0%,_transparent_70%)] opacity-30 dark:bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.2)_0%,_transparent_70%)]" />

      {/* Header */}
      <header className="relative z-20 px-6 md:px-12 py-8">
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />
        <motion.nav
          ref={ref}
          className="relative flex justify-between items-center max-w-7xl mx-auto bg-gray-900 bg-opacity-30 backdrop-blur-lg rounded-full px-6 py-4 shadow-[0_0_20px_rgba(34,197,94,0.6)] border border-green-500 border-opacity-30 dark:bg-gray-100 dark:bg-opacity-30 dark:border-gray-300 dark:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div variants={logoVariants}>
            <Link href="/home" className="text-4xl font-extrabold tracking-tight relative group">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-700 drop-shadow-[0_3px_6px_rgba(34,197,94,0.8)] dark:from-gray-800 dark:via-gray-600 dark:to-gray-400 dark:drop-shadow-[0_3px_6px_rgba(255,255,255,0.8)]">
                SK-TECHNOLOGY-801
              </span>
              <span className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-800 opacity-30 blur-lg group-hover:blur-xl transition-all duration-500 dark:from-gray-600 dark:to-gray-800" />
            </Link>
          </motion.div>
          <motion.ul className="hidden md:flex space-x-8" variants={containerVariants}>
            {navItems.map((item) => (
              <motion.li
                key={item.name}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotateX: 10, color: theme === 'dark' ? '#22c55e' : '#16a34a' }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="text-lg font-semibold relative group"
                >
                  <span className="text-gray-200 group-hover:text-green-400 transition-colors duration-300 dark:text-gray-800 dark:group-hover:text-green-600">
                    {item.name}
                  </span>
                  <span className="absolute left-0 bottom-[-6px] w-0 h-1 bg-green-500 group-hover:w-full transition-all duration-500 ease-out dark:bg-green-600" />
                </Link>
              </motion.li>
            ))}
          </motion.ul>
          <div className="flex items-center space-x-4 md:space-x-8">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-green-600 hover:bg-green-700 shadow-[0_0_10px_rgba(34,197,94,0.7)] dark:bg-gray-600 dark:hover:bg-gray-500 dark:shadow-[0_0_10px_rgba(255,255,255,0.7)]"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6 text-white dark:text-black"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {theme === 'dark' ? (
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                ) : (
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                )}
              </svg>
            </motion.button>
            <div className="md:hidden">
              <motion.button
                onClick={toggleMenu}
                className="focus:outline-none"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-8 h-8 text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.7)] dark:text-green-600 dark:drop-shadow-[0_0_5px_rgba(22,163,74,0.7)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.nav>
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-[0_0_15px_rgba(34,197,94,0.4)] dark:bg-gray-100 dark:bg-opacity-50 dark:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <motion.li
                  key={item.name}
                  variants={itemVariants}
                  whileHover={{ x: 10, color: theme === 'dark' ? '#22c55e' : '#16a34a' }}
                >
                  <Link
                    href={item.href}
                    className="text-lg font-semibold text-gray-200 hover:text-green-400 transition-colors duration-300 dark:text-gray-800 dark:hover:text-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50 animate-neon dark:via-gray-300" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Hero Section with Typewriter Effect */}
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
            Discover cutting-edge projects with a futuristic twist. Hover over the 3D cube to make it vanish with a particle burst!
          </p>
        </motion.section>

        {/* Three.js 3D Model Section */}
        <motion.section
          className="relative h-96 flex justify-center items-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Cube isVisible={isCubeVisible} setIsVisible={setIsVisible} setParticles={setCubeParticles} />
            {cubeParticles.map((particle) => (
              <mesh
                key={particle.id}
                position={[particle.x, particle.y, particle.z]}
              >
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#22c55e" transparent opacity={particle.opacity} />
              </mesh>
            ))}
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
            <Grid
              args={[20, 20]}
              cellColor="#22c55e"
              sectionColor="#16a34a"
              fadeDistance={30}
              position={[0, -2, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>
          <motion.div
            className="absolute bottom-4 text-sm text-gray-400 dark:text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: isCubeVisible ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            Cube hidden! Move cursor away to reveal.
          </motion.div>
        </motion.section>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-green-400 dark:text-green-600"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg
            className="w-8 h-8 drop-shadow-[0_0_5px_rgba(34,197,94,0.7)] dark:drop-shadow-[0_0_5px_rgba(22,163,74,0.7)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>

        {/* Skills Section */}
        <motion.section
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
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

        {/* Project Showcase Section */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {[
            {
              title: 'Project One',
              description: 'A cutting-edge web app with advanced animations.',
              link: '/projects/one',
              image: 'https://via.placeholder.com/300x200?text=Project+One',
            },
            {
              title: 'Project Two',
              description: 'A machine learning dashboard with real-time data.',
              link: '/projects/two',
              image: 'https://via.placeholder.com/300x200?text=Project+Two',
            },
            {
              title: 'Project Three',
              description: 'An immersive AR experience for mobile devices.',
              link: '/projects/three',
              image: 'https://via.placeholder.com/300x200?text=Project+Three',
            },
          ].map((project) => (
            <motion.div
              key={project.title}
              className="relative bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-500 border-opacity-20 hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] transition-all duration-300 overflow-hidden dark:bg-gray-100 dark:bg-opacity-50 dark:border-gray-300 dark:shadow-[0_0_15px_rgba(255,255,255,0.4)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
              variants={containerVariants}
              whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
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
          <ParticleButton href="/projects">Explore All Projects</ParticleButton>
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