import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { getTunnelPath } from './NeuralNetwork3D' // Import the path logic

export default function CameraRig() {
  const { camera } = useThree()
  const scroll = useScroll()

  useFrame((state, delta) => {
    // Scroll runs from 0 to 1
    const t = scroll.offset 
    
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