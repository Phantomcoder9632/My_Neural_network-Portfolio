import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import NeuralNetwork3D from './NeuralNetwork3D'
import Interface from './Interface'
import CameraRig from './CameraRig'

// ─── NAV ITEMS (must match section IDs in Interface.jsx) ───────────────────────
const NAV_ITEMS = [
  { label: 'Home',            id: 'home'        },
  { label: 'About Me',        id: 'education'   },
  { label: 'Work Experience', id: 'internships' },
  { label: 'Skills',          id: 'skills'      },
  { label: 'Projects',        id: 'projects'    },
  { label: 'Contact Me',      id: 'contact'     },
];

// ─── PERSISTENT NAVBAR ─────────────────────────────────────────────────────────
// Rendered OUTSIDE the Canvas so position:fixed works correctly at all times
function TopNav() {
  const [activeId, setActiveId] = useState('home');
  const [scrolled, setScrolled]  = useState(false);

  useEffect(() => {
    // Observe each section to highlight the active nav item
    const observers = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    // Deepen the blur slightly after any scroll
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => {
      observers.forEach(o => o.disconnect());
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 99999,           // above the canvas
      height: '56px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 16px',
      background: scrolled ? 'rgba(0,0,0,0.60)' : 'rgba(0,0,0,0.30)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,243,255,0.10)',
      transition: 'background 0.4s',
      pointerEvents: 'all',    // always capture clicks
    }}>
      <div style={{
        display: 'flex', gap: '4px',
        overflowX: 'auto', scrollbarWidth: 'none',
        maxWidth: '960px', width: '100%', justifyContent: 'center',
      }}>
        {NAV_ITEMS.map(({ label, id }) => {
          const active = activeId === id;
          return (
            <motion.button
              key={id}
              onClick={() => scrollTo(id)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: active ? 'rgba(0,243,255,0.13)' : 'transparent',
                color: active ? '#00f3ff' : 'rgba(255,255,255,0.65)',
                border: active ? '1px solid rgba(0,243,255,0.40)' : '1px solid transparent',
                borderRadius: '30px',
                padding: '6px 16px',
                fontSize: '0.75rem',
                fontWeight: active ? 'bold' : '500',
                letterSpacing: '1px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textShadow: active ? '0 0 10px rgba(0,243,255,0.9)' : 'none',
                transition: 'all 0.25s ease',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

export default function App() {
  const [started, setStarted] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Detect Screen Size for "pages" calculation
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is standard tablet/mobile width
    };
    
    checkMobile(); // Check on load
    window.addEventListener('resize', checkMobile); // Check on resize
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: 'black', overflowX: 'hidden' }}>

      {/* ALWAYS-VISIBLE NAV */}
      <TopNav />

      {/* FIXED 3D BACKGROUND */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true }}>
          <fog attach="fog" args={['black', 10, 40]} />
          <ambientLight intensity={0.5} />
          
          <CameraRig />
          <NeuralNetwork3D />
        </Canvas>
      </div>

      {/* NORMAL HTML CONTENT ON TOP */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <Interface />
      </div>
    </div>
  )
}