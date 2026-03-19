import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getTunnelPath } from './NeuralNetwork3D'

export default function CameraRig() {
  const { camera } = useThree()

  useFrame((state) => {
    // Check total scroll height vs viewport
    const maxScroll = document.body.scrollHeight - window.innerHeight
    // If no scroll height (e.g., loading), t = 0
    let t = 0
    if (maxScroll > 0) {
      t = window.scrollY / maxScroll
    }
    // Clamp between 0 and 1 just in case of overscroll physics
    t = Math.max(0, Math.min(1, t))
    
    // MAPPING SCROLL TO DEPTH (Z)
    // Start at Z=10, End deeper at Z=-70
    const currentZ = 10 - (t * 60) 
    
    // Get the center of the tunnel at this current depth
    const camPos = getTunnelPath(currentZ)

    // Add some "Look Ahead" so we turn into the curves
    const lookAtZ = currentZ - 5
    const lookAtPos = getTunnelPath(lookAtZ)

    // MOUSE PARALLAX (Subtle movement based on mouse)
    const mouseX = state.mouse.x * 2
    const mouseY = state.mouse.y * 2

    // SMOOTHLY UPDATE CAMERA
    // We maintain the Z path but add mouse offset to X and Y
    camera.position.lerp({
        x: camPos.x + mouseX,
        y: camPos.y + mouseY,
        z: currentZ
    }, 0.1)

    // Make camera look slightly ahead down the tunnel
    camera.lookAt(lookAtPos.x, lookAtPos.y, lookAtZ)
  })

  return null
}