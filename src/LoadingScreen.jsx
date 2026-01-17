import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- AUDIO ENGINE ---
const playSound = (type, ctx) => {
  if (!ctx || ctx.state === 'suspended') return;
  const now = ctx.currentTime;

  const playTone = (freq, type, duration, vol, delay = 0) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + delay);
    
    // Soft Envelope
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(vol, now + delay + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + duration + 0.2);
  };

  if (type === "tick") {
    // Very quiet, soft blip
    playTone(800, "sine", 0.05, 0.02);
  } 
  else if (type === "lock") {
    // Soft bass thud
    playTone(100, "sine", 0.3, 0.1); 
  }
  else if (type === "enter") {
    // "DEEP CINEMATIC SWELL" (Pleasant & Warm)
    const duration = 2.0;
    
    // 1. Deep Sub-Bass (The Foundation)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine"; // Sine is smooth, not harsh
    osc1.frequency.setValueAtTime(40, now);
    osc1.frequency.linearRampToValueAtTime(60, now + duration); // Very subtle rise
    
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 1); // Slow fade in
    gain1.gain.linearRampToValueAtTime(0, now + duration); // Fade out
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + duration);

    // 2. Warm Mid-Tone (The Harmony)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle"; // Softer than square/saw
    osc2.frequency.setValueAtTime(100, now);
    osc2.frequency.linearRampToValueAtTime(200, now + duration); // Gentle rise
    
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.05, now + 0.5); // Very low volume
    gain2.gain.linearRampToValueAtTime(0, now + duration);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now);
    osc2.stop(now + duration);
  }
};

// --- VOICE ENGINE ---
const speak = (text) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices();
  const systemVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft Zira"));
  if (systemVoice) utterance.voice = systemVoice;
  utterance.pitch = 0.9; 
  utterance.rate = 1.0;  
  utterance.volume = 0.6; // Slightly lower volume
  window.speechSynthesis.speak(utterance);
};

export default function LoadingScreen({ onStarted }) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false); 
  const [activeTechIndex, setActiveTechIndex] = useState(-1);
  const audioCtxRef = useRef(null);

  const techStack = [
    { id: "React", label: "REACT CORE", desc: "MOUNTING VIRTUAL DOM" },
    { id: "PyTorch", label: "PYTORCH", desc: "LOADING TENSOR WEIGHTS" },
    { id: "Node", label: "NODE.JS", desc: "ESTABLISHING MESH NETWORK" },
    { id: "fNIRS", label: "fNIRS SENSOR", desc: "CALIBRATING BIO-SIGNALS" },
    { id: "AI", label: "NEURAL AI", desc: "SYNCHRONIZING CONTEXT" },
  ];

  const handleStartInteraction = () => {
    setHasInteracted(true);
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    window.speechSynthesis.getVoices();
  };

  const handleEnterSystem = () => {
    playSound("enter", audioCtxRef.current);
    speak("Welcome to the Neural Core.");
    setTimeout(onStarted, 500); 
  };

  useEffect(() => {
    if (!hasInteracted) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (!isReady) {
            setIsReady(true);
            speak("System Ready. Access Granted.");
          }
          return 100;
        }
        const next = prev + Math.random() * 1.5;
        if (Math.floor(next / 5) > Math.floor(prev / 5)) {
            playSound("tick", audioCtxRef.current);
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [hasInteracted, isReady]);

  useEffect(() => {
    const step = 100 / techStack.length;
    const newIndex = Math.floor(progress / step);
    if (newIndex > activeTechIndex && newIndex < techStack.length) {
      setActiveTechIndex(newIndex);
      playSound("lock", audioCtxRef.current);
    }
  }, [progress, activeTechIndex]);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#050505", zIndex: 99999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif", color: "white", overflow: "hidden"
    }}>
      
      {/* BACKGROUND GRID */}
      <div style={{ 
          position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none",
          backgroundImage: "linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)", 
          backgroundSize: "60px 60px" 
      }} />

      {/* START BUTTON */}
      {!hasInteracted && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0, 243, 255, 0.4)" }}
          onClick={handleStartInteraction}
          style={{
            background: "rgba(0,0,0,0.6)", border: "1px solid #00f3ff",
            padding: "20px 60px", color: "#00f3ff", fontSize: "1.2rem", letterSpacing: "4px",
            cursor: "pointer", borderRadius: "4px", textTransform: "uppercase",
            backdropFilter: "blur(10px)", boxShadow: "0 0 20px rgba(0, 243, 255, 0.1)"
          }}
        >
          Initialize System
        </motion.button>
      )}

      {/* LOADING SEQUENCE */}
      <AnimatePresence>
        {hasInteracted && (
          <motion.div
            key="loading-ui"
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)", transition: { duration: 1.5, ease: "easeInOut" } }}
            style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}
          >
            {/* HUD Content */}
            <div style={{ display: "flex", alignItems: "center", gap: "80px", zIndex: 10 }}>
                {/* Tech List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-end" }}>
                    {techStack.map((tech, i) => (
                        <motion.div 
                            key={tech.id}
                            animate={{ opacity: i <= activeTechIndex ? 1 : 0.2, x: i <= activeTechIndex ? 0 : -20 }}
                            style={{ textAlign: "right" }}
                        >
                            <div style={{ fontSize: "1.1rem", fontWeight: "800", color: i <= activeTechIndex ? "#fff" : "#555" }}>{tech.label}</div>
                            <div style={{ fontSize: "0.75rem", color: i <= activeTechIndex ? "#00f3ff" : "#333", letterSpacing: "1px" }}>{i <= activeTechIndex ? "ONLINE" : "PENDING..."}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Central Core */}
                <div style={{ position: "relative", width: "250px", height: "250px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <motion.div 
                        style={{ position: "absolute", inset: 0, border: "2px solid #111", borderRadius: "50%", borderTopColor: "#00f3ff", borderLeftColor: "#00f3ff" }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                        style={{ position: "absolute", inset: "20px", border: "2px solid #111", borderRadius: "50%", borderBottomColor: "#bd00ff", borderRightColor: "#bd00ff" }}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    
                    <div style={{ textAlign: 'center', zIndex: 20 }}>
                        {!isReady ? (
                            <>
                                <h1 style={{ fontSize: "3.5rem", fontWeight: "900", margin: 0, color: "white", lineHeight: 1 }}>
                                    {Math.floor(progress)}<span style={{ fontSize: "1.5rem", color: "#555" }}>%</span>
                                </h1>
                                <p style={{ margin: "5px 0 0 0", fontSize: "0.8rem", color: "#00f3ff", letterSpacing: "2px" }}>LOADING</p>
                            </>
                        ) : (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.1, background: "rgba(0, 243, 255, 0.2)", boxShadow: "0 0 30px #00f3ff" }}
                                onClick={handleEnterSystem}
                                style={{
                                    background: "transparent",
                                    border: "2px solid #00f3ff",
                                    borderRadius: "50%",
                                    width: "140px", height: "140px",
                                    color: "white", fontWeight: "bold", fontSize: "1rem",
                                    cursor: "pointer", textShadow: "0 0 10px white",
                                    boxShadow: "0 0 20px rgba(0,243,255,0.3)"
                                }}
                            >
                                ENTER<br/>NEURAL<br/>CORE
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Right Data Stream */}
                <div style={{ width: "200px", textAlign: "left" }}>
                    <div style={{ borderLeft: "2px solid #333", paddingLeft: "20px", height: "150px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px" }}>
                        <div style={{ fontSize: "0.7rem", color: "#555", fontFamily: "monospace" }}>{`NEURAL_NET: ${progress > 50 ? "ACTIVE" : "SLEEP"}`}</div>
                        <div style={{ fontSize: "0.7rem", color: "#555", fontFamily: "monospace" }}>{`GPU_ACCEL: ${progress > 80 ? "READY" : "WAIT"}`}</div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ position: "absolute", bottom: "10%", width: "40%", height: "2px", background: "#222" }}>
                <motion.div 
                    style={{ height: "100%", background: "#00f3ff", boxShadow: "0 0 20px #00f3ff" }}
                    animate={{ width: `${progress}%` }}
                />
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}