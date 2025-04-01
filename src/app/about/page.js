'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  // Parallax effect for background elements
  const x1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  // Team members data
  const teamMembers = [
    {
      name: "Alex Rivera",
      role: "Founder & Music Engineer",
      bio: "Former producer with 10+ years of experience in the music industry, specializing in creating viral tracks.",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&q=80"
    },
    {
      name: "Maya Lee",
      role: "AI Engineer",
      bio: "PhD in AI and Music Composition with expertise in neural networks and audio processing algorithms.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80"
    },
    {
      name: "Ethan Wright",
      role: "Product Designer",
      bio: "UX specialist focused on creating intuitive interfaces for music creation tools.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=80"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  };

  const floatingCircles = [
    { size: 150, x: -100, y: 100, delay: 0, blur: 70, color: "var(--primary)" },
    { size: 200, x: 200, y: 300, delay: 2, blur: 90, color: "var(--secondary)" },
    { size: 120, x: 300, y: 0, delay: 4, blur: 60, color: "var(--accent)" },
  ];

  return (
    <div className="relative overflow-hidden" ref={containerRef}>
      {/* Animated background elements */}
      {floatingCircles.map((circle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: circle.size,
            height: circle.size,
            background: circle.color,
            top: `${circle.y}px`,
            left: `${circle.x}px`,
            filter: `blur(${circle.blur}px)`,
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            delay: circle.delay,
          }}
        />
      ))}

      {/* Hero section */}
      <motion.div 
        style={{ opacity, scale }}
        className="py-20 md:py-32 text-center relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto px-4"
        >
          <span className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">About Us</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 relative">
            <span className="gradient-text">Revolutionizing</span> How Music Goes Viral
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            We're a team of music producers, AI engineers, and designers passionate about helping artists create tracks that resonate with audiences.
          </p>
        </motion.div>
      </motion.div>

      {/* Mission section */}
      <div className="py-12 md:py-24 bg-white/50 dark:bg-card-bg/50">
        <motion.div 
          className="max-w-5xl mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We believe that every artist deserves the opportunity to have their music heard. 
              Our AI-powered platform democratizes music production, making professional-level optimization accessible to everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Make Music Viral",
                description: "Our algorithms analyze patterns from thousands of successful tracks to optimize yours for maximum engagement."
              },
              {
                icon: "🤖",
                title: "AI-Powered Enhancement",
                description: "Advanced neural networks identify and enhance the most catchy elements of your music while maintaining its uniqueness."
              },
              {
                icon: "🔓",
                title: "Accessible to All",
                description: "Whether you're a bedroom producer or established artist, our tools help level the playing field in the music industry."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="card p-6 relative overflow-hidden"
                whileHover={{ y: -10, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Team section */}
      <div className="py-12 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A passionate group of experts dedicated to transforming the music creation experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -10 }}
                className="card overflow-hidden"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Technology section with parallax */}
      <div className="py-12 md:py-24 bg-white/50 dark:bg-card-bg/50 relative overflow-hidden">
        <motion.div
          style={{ x: x1, y: y1 }}
          className="absolute top-10 right-10 w-56 h-56 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ x: x2, y: y2 }}
          className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
        />
        
        <div className="max-w-5xl mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Technology</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced AI algorithms analyze and enhance your music to maximize engagement and viral potential.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold mb-6 gradient-text">How Our AI Works</h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Pattern Recognition",
                    description: "Our algorithms analyze thousands of viral tracks to identify what makes them successful."
                  },
                  {
                    title: "Audio Processing",
                    description: "We isolate and enhance key elements like hooks, beats, and transitions that engage listeners."
                  },
                  {
                    title: "Optimized Structure",
                    description: "Your track is restructured to maintain attention and maximize sharing potential."
                  },
                  {
                    title: "Platform-Specific Tuning",
                    description: "Content is tailored for specific platforms like TikTok, Instagram, or YouTube."
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex"
                  >
                    <div className="mr-4 mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-sm">
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-card-bg rounded-2xl shadow-lg p-6 relative z-10">
                <div className="rounded-xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-800">
                  <div className="aspect-video relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M15.5 12L10.5 15V9L15.5 12Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-semibold mb-2">See Our Technology in Action</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Watch how our AI transforms an ordinary track into a viral hit in just minutes.
                </p>
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M15.5 12L10.5 15V9L15.5 12Z" fill="currentColor"/>
                  </svg>
                  Watch Demo
                </button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute w-full h-full top-4 left-4 rounded-2xl border-2 border-primary/30 -z-10"></div>
              <div className="absolute w-16 h-16 -top-8 -left-8 bg-primary/10 rounded-full -z-10"></div>
              <div className="absolute w-12 h-12 -bottom-6 -right-6 bg-secondary/10 rounded-full -z-10"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 