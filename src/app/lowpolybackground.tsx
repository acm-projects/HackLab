"use client";

import React, { useEffect, useRef, useState } from "react";

// Define particle properties
interface Particle {
  position: { x: number; y: number };
  velocity: { dx: number; dy: number };
  angle: number;
  length: number;
}

// Constants
const CONNECTION_DISTANCE = 100;
const PARTICLE_SPEED = 0.4; // Speed remains constant

const LowPolyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [particleCount, setParticleCount] = useState(150); // Start with 150 for large screens

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Function to update particle count based on screen size
    const updateParticleCount = () => {
      const width = window.innerWidth;

      if (width > 1200) setParticleCount(150); // Large screens
      else if (width > 768) setParticleCount(100); // Medium screens
      else setParticleCount(50); // Small screens
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateParticleCount();
      initializeParticles();
    };

    const initializeParticles = () => {
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        position: {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
        },
        velocity: {
          dx: (Math.random() - 0.5) * PARTICLE_SPEED,
          dy: (Math.random() - 0.5) * PARTICLE_SPEED,
        },
        angle: Math.random() * Math.PI * 2,
        length: Math.random() * (40 - 15) + 15, // Bar size range 15-40
      }));
    };

    const drawParticles = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections with increased opacity
      ctx.globalAlpha = 0.3; // 🔥 Threads opacity increased for visibility
      ctx.strokeStyle = "rgba(0, 32, 192, 0.4)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.position.x - p2.position.x;
          const dy = p1.position.y - p2.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(p1.position.x, p1.position.y);
            ctx.lineTo(p2.position.x, p2.position.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles (bars)
      ctx.globalAlpha = 0.2; // 🔥 Particles opacity remains lower for subtle effect
      ctx.strokeStyle = "gray";
      ctx.lineWidth = 0.5;

      particlesRef.current.forEach((particle) => {
        const halfLength = particle.length / 2;
        const dx = Math.cos(particle.angle) * halfLength;
        const dy = Math.sin(particle.angle) * halfLength;
        ctx.beginPath();
        ctx.moveTo(particle.position.x - dx, particle.position.y - dy);
        ctx.lineTo(particle.position.x + dx, particle.position.y + dy);
        ctx.stroke();
      });
    };

    const updateParticles = () => {
      const screenWidth = canvas.width;
      const screenHeight = canvas.height;

      particlesRef.current.forEach((particle) => {
        particle.position.x += particle.velocity.dx;
        particle.position.y += particle.velocity.dy;

        if (particle.position.x < 0) particle.position.x += screenWidth;
        if (particle.position.x > screenWidth) particle.position.x -= screenWidth;
        if (particle.position.y < 0) particle.position.y += screenHeight;
        if (particle.position.y > screenHeight) particle.position.y -= screenHeight;

        particle.angle += 0.005;
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [particleCount]); // Reacts to particle count changes when screen size updates

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full bg-white" />
  );
};

export default LowPolyBackground;
