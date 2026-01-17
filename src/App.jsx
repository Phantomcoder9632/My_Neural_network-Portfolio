import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import NeuralNetwork3D from './NeuralNetwork3D'
import Interface from './Interface'
import LoadingScreen from './LoadingScreen'
import CameraRig from './CameraRig'

export default function App() {
  const [started, setStarted] = useState(false)
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
    <div style={{ width: '100vw', height: '100vh', background: 'black', overflow: 'hidden' }}>
      
      {/* LOADING SCREEN */}
      <AnimatePresence mode="wait">
        {!started && <LoadingScreen onStarted={() => setStarted(true)} />}
      </AnimatePresence>

      {/* MAIN 3D SITE */}
      {started && (
        <motion.div 
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} 
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}   
            transition={{ duration: 2, ease: "easeOut" }} 
            style={{ width: "100%", height: "100%" }}
        >
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true }}>
            <fog attach="fog" args={['black', 10, 40]} />
            <ambientLight intensity={0.5} />
            
            <ScrollControls 
              // DYNAMIC PAGES: 20 for Mobile (Tall), 10 for PC (Wide)
              pages={isMobile ? 20 : 10} 
              damping={0.2} 
              style={{ scrollbarWidth: 'none' }}
            >
              <CameraRig />
              <NeuralNetwork3D />
              <Scroll html style={{ width: '100%' }}>
                <Interface />
              </Scroll>
            </ScrollControls>
          </Canvas>
        </motion.div>
      )}
    </div>
  )
}