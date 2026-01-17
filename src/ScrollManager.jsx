import { useScroll } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ScrollManager({ sectionCount }) {
  const scroll = useScroll()
  
  // TRACKING REFS
  const data = useRef({
    currentPage: 0,
    lastScrollTime: 0, // Keeps track of the exact time we last moved
  })

  // CONFIGURATION
  const COOLDOWN = 2000 // 2000ms = 2 Seconds strict lock
  const ANIMATION_DURATION = 1.5 // Time to glide to next chapter

  useEffect(() => {
    // 1. HARD DISABLE NATIVE SCROLL
    const el = scroll.el
    el.style.overflow = 'hidden' 
    el.style.touchAction = 'none'

    // 2. THE HANDLER
    const handleScroll = (deltaY) => {
      const now = Date.now()
      const timeSinceLastScroll = now - data.current.lastScrollTime

      // STRICT LOCK: If it hasn't been 2 seconds yet, STOP immediately.
      if (timeSinceLastScroll < COOLDOWN) {
        return 
      }

      // IGNORE TINY MOVEMENTS (Touchpad jitter)
      if (Math.abs(deltaY) < 30) return

      // DETERMINE DIRECTION
      const direction = deltaY > 0 ? 1 : -1
      
      // CALCULATE NEXT PAGE
      const next = data.current.currentPage + direction
      
      // EXECUTE SCROLL (If valid page)
      if (next >= 0 && next < sectionCount) {
        // Update the lock time NOW so no other events get through
        data.current.lastScrollTime = now 
        data.current.currentPage = next
        
        scrollToSection(next)
      }
    }

    // 3. LISTENERS
    const onWheel = (e) => handleScroll(e.deltaY)
    
    let touchStartY = 0
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY }
    const onTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY
      handleScroll(touchStartY - touchEndY)
    }

    window.addEventListener('wheel', onWheel)
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      el.style.overflow = 'auto'
    }
  }, [sectionCount, scroll])

  // 4. ANIMATION
  const scrollToSection = (index) => {
    const targetScrollTop = index * window.innerHeight

    gsap.to(scroll.el, {
      scrollTop: targetScrollTop,
      duration: ANIMATION_DURATION,
      ease: "power3.inOut", // "power3" is smoother/heavier than power2
    })
  }

  return null
}