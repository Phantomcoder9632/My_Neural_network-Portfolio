import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 1. THE PATH FUNCTION
export function getTunnelPath(z) {
  const x = Math.sin(z * 0.1) * 8 
  const y = Math.cos(z * 0.15) * 4
  return new THREE.Vector3(x, y, z)
}

export default function NeuralNetwork3D() {
  const groupRef = useRef()
  
  // MOBILE DETECTION
  // If screen width is less than 768px, we use fewer particles
  const isMobile = window.innerWidth < 768
  
  // CONFIGURATION
  const particleCount = isMobile ? 700 : 2000 // Huge performance save
  const tunnelLength = 80 
  const tunnelRadius = isMobile ? 4 : 5 // Slightly tighter tunnel on mobile
  const connectionDistance = isMobile ? 3 : 2.5 

  const [pointsGeo, linesGeo] = useMemo(() => {
    const pPositions = []
    const pColors = []
    const particles = []
    
    const color1 = new THREE.Color('#00f3ff')
    const color2 = new THREE.Color('#bd00ff')
    const color3 = new THREE.Color('#ffd700')
    
    for (let i = 0; i < particleCount; i++) {
      const z = 10 - Math.random() * tunnelLength
      const center = getTunnelPath(z)
      const angle = Math.random() * Math.PI * 2
      const r = tunnelRadius + (Math.random() - 0.5) * 3

      const x = center.x + Math.cos(angle) * r
      const y = center.y + Math.sin(angle) * r

      pPositions.push(x, y, z)
      particles.push(new THREE.Vector3(x, y, z))

      const progress = (10 - z) / tunnelLength
      let c
      if (progress < 0.5) c = color1.clone().lerp(color2, progress * 2)
      else c = color2.clone().lerp(color3, (progress - 0.5) * 2)
      
      pColors.push(c.r, c.g, c.b)
    }

    const lPositions = []
    for (let i = 0; i < particleCount; i++) {
        // Reduced check range for performance
        for (let j = i + 1; j < Math.min(i + 30, particleCount); j++) {
            const dist = particles[i].distanceTo(particles[j])
            if (dist < connectionDistance) {
                lPositions.push(particles[i].x, particles[i].y, particles[i].z)
                lPositions.push(particles[j].x, particles[j].y, particles[j].z)
            }
        }
    }

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3))
    pGeo.setAttribute('color', new THREE.Float32BufferAttribute(pColors, 3))

    const lGeo = new THREE.BufferGeometry()
    lGeo.setAttribute('position', new THREE.Float32BufferAttribute(lPositions, 3))

    return [pGeo, lGeo]
  }, [isMobile]) // Re-run if mobile state changes

  useFrame((state, delta) => {
    groupRef.current.rotation.z += delta * 0.02
  })

  return (
    <group ref={groupRef}>
      <points geometry={pointsGeo}>
        <pointsMaterial 
          size={isMobile ? 0.2 : 0.15} // Make points slightly bigger on mobile to compensate for fewer count
          vertexColors 
          transparent 
          opacity={0.9} 
          sizeAttenuation={true}
        />
      </points>
      <lineSegments geometry={linesGeo}>
        <lineBasicMaterial color="#4db5ff" transparent opacity={0.15} />
      </lineSegments>
    </group>
  )
}