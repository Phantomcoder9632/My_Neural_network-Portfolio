import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'
import NeuralNetwork3D from './NeuralNetwork3D'
import Interface from './Interface'
import LoadingScreen from './LoadingScreen'
import CameraRig from './CameraRig'

export default function App() {
  const [started, setStarted] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', overflow: 'hidden' }}>
      
      {/* LOADING SCREEN */}
      <AnimatePresence mode="wait">
        {!started && <LoadingScreen onStarted={() => setStarted(true)} />}
      </AnimatePresence>

      {/* MAIN 3D SITE - Cinematic Focus Entry */}
      {started && (
        <motion.div 
            // Starts BLURRY and ZOOMED IN (Like coming out of hyperspace)
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} 
            // Resolves to CLEAR and SHARP
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}   
            // 2-second ease-out for a very smooth landing
            transition={{ duration: 2, ease: "easeOut" }} 
            style={{ width: "100%", height: "100%" }}
        >
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true }}>
            <fog attach="fog" args={['black', 10, 40]} />
            <ambientLight intensity={0.5} />
            
            <ScrollControls 
              pages={10} 
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