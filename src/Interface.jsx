import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaEnvelope, FaBrain, FaFileDownload } from 'react-icons/fa'
import emailjs from '@emailjs/browser'

// --- AUDIO ENGINE (INTERACTIVE) ---
const useAudioInterface = () => {
  const audioCtxRef = useRef(null);
  const lastScrollY = useRef(0);

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSound = (type) => {
    initAudio();
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "scroll") {
      // Very soft, high-tech "tick"
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);
      gain.gain.setValueAtTime(0.015, now); // Very quiet
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } 
    else if (type === "hover") {
      // Sci-Fi "Shimmer"
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
    else if (type === "click") {
       // Confirmation Chirp
       osc.type = "sine";
       osc.frequency.setValueAtTime(1200, now);
       osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
       gain.gain.setValueAtTime(0.05, now);
       gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
       osc.start(now);
       osc.stop(now + 0.1);
    }
    else if (type === "section") {
      // Heavier "Lock-on" bass
      osc.type = "sine";
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const diff = Math.abs(currentScroll - lastScrollY.current);

      // Play a tick every 50 pixels scrolled
      if (diff > 50) {
        playSound("scroll");
        lastScrollY.current = currentScroll;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { playSound };
};

// --- 1. PROJECT DATA ---
const projects = [
    {
        id: 1,
        title: "Sleep Apnea AI",
        subtitle: "Healthcare / Deep Learning",
        tech: ["Random Forest", "Python", "PyTorch", "PPG Signals"],
        github: "https://github.com/Phantomcoder9632/Apneoa-event-prediction-Using-PPG-signal.git",
        description: "A non-invasive detection system that utilizes Photoplethysmogram (PPG) signals from common wearable devices to detect undiagnosed sleep apnea.",
        points: [
            "Achieved 92% classification accuracy using a Random Forest algorithm.",
            "Processed raw physiological data using Python (Pandas/NumPy) to extract meaningful features.",
            "Designed a real-time inference pipeline capable of running on edge devices."
        ]
    },
    {
        id: 2,
        title: "SoundCo Sync",
        subtitle: "Distributed Systems / Audio Engineering",
        tech: ["WebRTC", "Node.js", "Socket.io", "UDP", "React Native"],
        github: "https://github.com/Phantomcoder9632/SoundCo--Audio-Transmission-App.git",
        description: "An engineering challenge in distributed systems allowing multiple Android devices to play music in perfect sync over local Wi-Fi (No Internet required).",
        points: [
            "Engineered a peer-to-peer mesh using WebRTC and Socket.io for millisecond-level latency.",
            "Implemented UDP broadcasting for automatic server discovery on the local network.",
            "Utilized Android Foreground Services to ensure continuous playback even when devices are locked."
        ]
    },
    {
        id: 3,
        title: "Screen Time Research",
        subtitle: "Data Science / Behavioral Analytics",
        tech: ["LSTM", "PyTorch", "Linear Regression", "Data Analytics"],
        github: "https://github.com/YOUR_USERNAME/research-repo",
        description: "A longitudinal study examining the correlation between smartphone usage patterns, blue light exposure, and sleep quality.",
        points: [
            "Applied Long Short-Term Memory (LSTM) networks to forecast future sleep outcomes based on historical usage data.",
            "Utilized Linear Regression to quantify the impact of specific apps and usage times on sleep efficiency.",
            "Filled critical research gaps by employing objective monitoring rather than self-reported surveys."
        ]
    }
];

// --- 2. COMPONENTS ---

// NEURO CORE ANIMATION
const NeuroCore = () => {
  return (
    <motion.div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '150px', 
        height: '150px'
      }}
      animate={{ 
        y: [0, -15, 0], 
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
    >
      <FaBrain 
        style={{ 
          color: '#00f3ff', 
          fontSize: '100px', 
          filter: 'drop-shadow(0 0 20px #00f3ff)' 
        }} 
      />
      <motion.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid #00f3ff',
          opacity: 0,
        }}
        animate={{
          scale: [0.8, 1.6],
          opacity: [0.6, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeOut"
        }}
      />
    </motion.div>
  )
}

const Section = ({ children, id, playSound }) => (
  <section id={id} style={{
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '15vh 10vw',
    marginBottom: '20vh',
    position: 'relative',
    boxSizing: 'border-box'
  }}>
    <motion.div
        onViewportEnter={() => playSound && playSound("section")}
    >
        {children}
    </motion.div>
  </section>
)

// STYLES
const cardStyle = {
    background: 'rgba(0, 0, 0, 0.7)', 
    backdropFilter: 'blur(10px)',
    padding: '30px', 
    borderRadius: '15px',
    borderLeft: '4px solid #00f3ff',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    flex: 1,
    minWidth: '280px',
    maxWidth: '100%'
}

const imageStyle = {
    flex: 1,
    minWidth: '280px',
    maxWidth: '500px', 
    margin: '0 auto 20px auto', 
    borderRadius: '15px',
    overflow: 'hidden',
    border: '1px solid rgba(0, 243, 255, 0.3)',
    boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)',
    height: 'auto',
}

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '40px',
    flexWrap: 'wrap-reverse', 
    width: '100%'
}

const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
}

const ContactForm = ({ playSound }) => {
  const form = useRef();
  const [status, setStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    emailjs.sendForm('service_eos6oxg', 'template_2t7e2vo', form.current, 'Wsgug6msmdOKEoP39')
      .then(() => { setStatus('Message Sent! 🚀'); e.target.reset(); }, 
            () => { setStatus('Failed. Try again.'); });
  };

  return (
    <form ref={form} onSubmit={sendEmail} style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input type="text" name="user_name" placeholder="Your Name" required 
        onMouseEnter={() => playSound("hover")}
        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #333', padding: '15px', borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#00f3ff'} onBlur={(e) => e.target.style.borderColor = '#333'} />
      <input type="email" name="user_email" placeholder="Your Email" required 
        onMouseEnter={() => playSound("hover")}
        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #333', padding: '15px', borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#00f3ff'} onBlur={(e) => e.target.style.borderColor = '#333'} />
      <textarea name="message" rows="5" placeholder="Write your message here..." required 
        onMouseEnter={() => playSound("hover")}
        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #333', padding: '15px', borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none', resize: 'none' }} onFocus={(e) => e.target.style.borderColor = '#00f3ff'} onBlur={(e) => e.target.style.borderColor = '#333'} />
      <button type="submit" onMouseEnter={() => playSound("hover")} style={{ background: '#00f3ff', color: 'black', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', letterSpacing: '1px' }}>{status || 'SEND TRANSMISSION'}</button>
    </form>
  )
}

const themeColors = ['#00f3ff', '#bd00ff', '#ffd700'];

export default function Interface() {
  const [showNav, setShowNav] = useState(false)
  const { playSound } = useAudioInterface(); 

  return (
    <div style={{ color: 'white', fontFamily: "'Inter', sans-serif", width: '100%', overflowX: 'hidden' }}>
      
      {/* 1. ORIGIN */}
      <Section id="home" playSound={playSound}>
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '50px', flexWrap: 'wrap', textAlign: 'left', width: '100%' }}>
          <div>
              <h1 style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', margin: 0, lineHeight: '0.9', textShadow: '0 0 20px rgba(0,243,255,0.5)' }}>BIKRAM<br />HAWLADAR</h1>
              <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#00f3ff', letterSpacing: '3px' }}>ENTERING THE NEURAL CORE...</p>
              
              {/* --- RESUME DOWNLOAD BUTTON (FIXED PATH) --- */}
              <motion.a 
                href="/Bikram_s_Resume.pdf" 
                download="Bikram_Hawladar_Resume.pdf"
                style={{ textDecoration: 'none', display: 'inline-block', marginTop: '30px' }}
                onMouseEnter={() => playSound("hover")}
                onClick={() => playSound("click")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '15px',
                    border: '1px solid #00f3ff', borderRadius: '50px', 
                    padding: '12px 30px', background: 'rgba(0, 243, 255, 0.05)',
                    boxShadow: '0 0 10px rgba(0, 243, 255, 0.1)'
                }}>
                    <FaFileDownload style={{ color: '#00f3ff', fontSize: '1.2rem' }} />
                    <span style={{ color: '#00f3ff', fontWeight: 'bold', letterSpacing: '2px', fontSize: '0.9rem' }}>
                        DOWNLOAD RESUME
                    </span>
                </div>
              </motion.a>
              
          </div>
          
          <NeuroCore />
        </motion.div>
      </Section>

      {/* 2. EDUCATION */}
      <Section id="education" playSound={playSound}>
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', textAlign: 'center', marginBottom: '40px' }}>ACADEMIC BACKGROUND</h2>
            
            <div style={containerStyle}>
                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* College & Degree */}
                    <div>
                        <p style={{ color: '#00f3ff', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>INDIAN INSTITUTE OF INFORMATION TECHNOLOGY</p>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '5px' }}>IIIT Dharwad</h2>
                        <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'normal' }}>B.Tech in Computer Science & Engineering</h3>
                    </div>

                    <p style={{ lineHeight: '1.6', fontSize: '1rem', color: '#ccc' }}>
                        The journey began here. Mastering the "Mathematics of Intelligence" and building a strong foundation in computational logic.
                    </p>
                    
                    <div style={{ alignSelf: 'flex-start' }}><span style={{ background: '#00f3ff', color: 'black', padding: '2px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>CGPA 8.45</span></div>

                    {/* RELEVANT COURSEWORK SECTION */}
                    <div style={{ marginTop: '20px', background: 'rgba(0, 243, 255, 0.05)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(0, 243, 255, 0.1)' }}>
                        <h4 style={{ color: '#00f3ff', marginTop: 0, marginBottom: '15px', fontSize: '0.9rem', letterSpacing: '1px' }}>RELEVANT COURSEWORK</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {['Data Structures & Algorithms', 'Deep Learning', 'Machine Learning', 'Natural Language Processing', 'AI in Bio-Medical Signal Processing', 'Computer Networks', 'Linear Algebra', 'Operating Systems', 'Probability & Statistics'].map((course) => (
                                <span key={course} style={{ 
                                    border: '1px solid #333', color: '#ccc', 
                                    background: 'rgba(0,0,0,0.3)', padding: '5px 12px', 
                                    borderRadius: '20px', fontSize: '0.8rem' 
                                }}>
                                    {course}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
                <div style={imageStyle}>
                    <img src="\Bikram_Hawladar_image.jpg" alt="Profile" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
            </div>
        </motion.div>
      </Section>

      {/* 3. SKILLS */}
      <Section id="skills" playSound={playSound}>
        <motion.div initial="hidden" whileInView="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }} style={{ width: '100%' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', marginBottom: '40px', color: 'white' }}>TECHNICAL ARSENAL</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
                <div style={{ ...cardStyle, borderLeft: 'none', borderTop: '4px solid #00f3ff' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#00f3ff', marginBottom: '20px', letterSpacing: '2px' }}>// LANGUAGES</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {['Python', 'C', 'SQL (MySQL)', 'Java', 'Firebase'].map(skill => (
                            <motion.span key={skill} 
                                onMouseEnter={() => playSound("hover")}
                                whileHover={{ scale: 1.1, background: '#00f3ff', color: 'black' }} 
                                style={{ background: 'rgba(0, 243, 255, 0.1)', border: '1px solid #00f3ff', padding: '8px 15px', borderRadius: '5px', fontSize: '0.9rem', cursor: 'default' }}>
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
                <div style={{ ...cardStyle, borderLeft: 'none', borderTop: '4px solid #bd00ff' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#bd00ff', marginBottom: '20px', letterSpacing: '2px' }}>// NEURAL CORE</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {['PyTorch', 'TensorFlow', 'CNNs', 'LSTMs', 'NLP', 'Computer Vision'].map(skill => (
                            <motion.span key={skill} 
                                onMouseEnter={() => playSound("hover")}
                                whileHover={{ scale: 1.1, background: '#bd00ff', color: 'black' }} 
                                style={{ background: 'rgba(189, 0, 255, 0.1)', border: '1px solid #bd00ff', padding: '8px 15px', borderRadius: '5px', fontSize: '0.9rem', cursor: 'default' }}>
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
                <div style={{ ...cardStyle, borderLeft: 'none', borderTop: '4px solid #ffd700' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#ffd700', marginBottom: '20px', letterSpacing: '2px' }}>// DEV TOOLS</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {['Git / GitHub', 'Figma', 'VS Code', 'Pycharm', 'Google Colab'].map(skill => (
                            <motion.span key={skill} 
                                onMouseEnter={() => playSound("hover")}
                                whileHover={{ scale: 1.1, background: '#ffd700', color: 'black' }} 
                                style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid #ffd700', padding: '8px 15px', borderRadius: '5px', fontSize: '0.9rem', cursor: 'default' }}>
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
      </Section>

      {/* 4. INTERNSHIPS */}
      <Section id="internships" playSound={playSound}>
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
             <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', textAlign: 'center', marginBottom: '40px' }}>PROFESSIONAL EXPERIENCE</h2>
             
             <div style={containerStyle}>
                <div style={{ 
                    ...cardStyle, 
                    borderLeft: 'none', 
                    borderTop: '4px solid #bd00ff',
                    display: 'flex', flexDirection: 'column', gap: '20px' 
                }}>
                    <div>
                        <p style={{ color: '#bd00ff', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>RESEARCH INTERN • NIT DURGAPUR</p>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', margin: '10px 0', lineHeight: '1.2' }}>Analysis of Cognitive Load using fNIRS & Explainable AI</h2>
                    </div>
                    <p style={{ lineHeight: '1.6', fontSize: '1rem', color: '#e0e0e0' }}>
                        Spearheaded neuro-engineering research to classify hemodynamic brain patterns. I transformed raw physiological signals into "Discriminative Images" to train Vision Transformers, bridging the gap between deep learning accuracy and neurophysiological interpretability.
                    </p>
                    <div style={{ background: 'rgba(189, 0, 255, 0.1)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(189, 0, 255, 0.2)' }}>
                        <h4 style={{ color: '#bd00ff', marginTop: 0, marginBottom: '10px', fontSize: '0.9rem', letterSpacing: '1px' }}>KEY RESEARCH MODULES</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc', lineHeight: '1.6', fontSize: '0.95rem' }}>
                            <li style={{ marginBottom: '8px' }}><strong>Signal Engineering (MATLAB):</strong> Processed raw NIRS signals using the BBCI Toolbox, applying filters (0.01-0.2 Hz) and calculating signed r² statistics to generate 224 spatiotemporal topographic maps.</li>
                            <li style={{ marginBottom: '8px' }}><strong>Deep Learning Pipeline:</strong> Optimized a Vision Transformer (ViT-B/16) using Transfer Learning and Backbone Freezing, achieving 85-94% accuracy on cognitive tasks.</li>
                            <li><strong>Explainable AI (XAI):</strong> Deployed Integrated Gradients (Captum) to validate the model's focus on the Motor Cortex and Prefrontal Cortex, ensuring medical trust.</li>
                        </ul>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {['MATLAB', 'Python', 'PyTorch', 'Vision Transformers', 'Explainable AI'].map((t) => (
                            <span key={t} style={{ border: '1px solid #bd00ff', color: '#bd00ff', background: 'rgba(189, 0, 255, 0.1)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{t}</span>
                        ))}
                    </div>
                </div>
                <div style={imageStyle}>
                    <img src="\NIT_Durgapur.jpeg" alt="Research Lab" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
            </div>
        </motion.div>
      </Section>

      {/* 5. PROJECTS */}
      <Section id="projects" playSound={playSound}>
         <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', textAlign: 'center', marginBottom: '60px' }}>FEATURED CREATIONS</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
                {projects.map((project, index) => (
                    <motion.div 
                        key={project.id}
                        onMouseEnter={() => playSound("hover")}
                        style={{ 
                            background: 'rgba(18, 18, 18, 0.8)', 
                            backdropFilter: 'blur(10px)', 
                            WebkitBackdropFilter: 'blur(10px)', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            display: 'flex', flexDirection: 'column',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            transition: 'border-color 0.3s'
                        }}
                        whileHover={{ borderColor: themeColors[index % 3] }}
                    >
                        <div style={{ padding: '40px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                                <div>
                                    <h3 style={{ color: '#fff', fontSize: '2rem', margin: 0 }}>{project.title}</h3>
                                    <span style={{ color: '#00f3ff', fontSize: '0.9rem', letterSpacing: '1px', fontWeight: 'bold' }}>{project.subtitle}</span>
                                </div>
                                <a href={project.github} target="_blank" style={{ color: '#000', background: '#ffd700', padding: '10px 25px', borderRadius: '25px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)' }}>GITHUB ↗</a>
                            </div>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#e0e0e0', marginBottom: '30px' }}>{project.description}</p>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h4 style={{ color: '#aaa', marginTop: 0, marginBottom: '10px', fontSize: '0.9rem', letterSpacing: '1px' }}>KEY ACHIEVEMENTS</h4>
                                <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc', lineHeight: '1.6' }}>{project.points.map((point, i) => <li key={i} style={{ marginBottom: '8px' }}>{point}</li>)}</ul>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {project.tech.map((t, i) => {
                                    const color = themeColors[i % themeColors.length];
                                    return <span key={t} style={{ border: `1px solid ${color}`, color: color, background: `rgba(${i % 3 === 0 ? '0, 243, 255' : i % 3 === 1 ? '189, 0, 255' : '255, 215, 0'}, 0.1)`, padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>{t}</span>
                                })}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
         </motion.div>
      </Section>

      {/* 6. CONTACT */}
      <Section id="contact" playSound={playSound}>
        <motion.div initial="hidden" whileInView={() => { setShowNav(true); return "visible"; }} onViewportLeave={() => setShowNav(false)} variants={fadeIn} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '40px' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', textAlign: 'center' }}>INITIATE CONNECTION</h1>
            <div style={{ display: 'flex', gap: '30px', fontSize: '2rem' }}>
                <a href="https://github.com/Phantomcoder9632" target="_blank" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#00f3ff'} onMouseOut={e => e.target.style.color='white'}><FaGithub /></a>
                <a href="https://www.linkedin.com/in/bikram-hawladar-2742092b1" target="_blank" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#0077b5'} onMouseOut={e => e.target.style.color='white'}><FaLinkedin /></a>
                <a href="https://www.instagram.com/alexa_findbikram" target="_blank" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#E1306C'} onMouseOut={e => e.target.style.color='white'}><FaInstagram /></a>
                <a href="https://www.facebook.com/share/1BexzEXx8D" target="_blank" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#1877F2'} onMouseOut={e => e.target.style.color='white'}><FaFacebook /></a>
                <a href="mailto:bikram@example.com" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#ea4335'} onMouseOut={e => e.target.style.color='white'}><FaEnvelope /></a>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.8)', padding: '40px', borderRadius: '20px', border: '1px solid #333', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ marginBottom: '20px', color: '#ccc' }}>Send a direct encrypted message:</p>
                <ContactForm playSound={playSound} />
            </div>
        </motion.div>

        <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -20 }} transition={{ duration: 0.5 }} style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', padding: '10px 20px', borderRadius: '50px', border: '1px solid #333', zIndex: 1000, display: 'flex', gap: '10px', overflowX: 'auto', maxWidth: '90vw' }}>
            {['Home', 'Education', 'Skills', 'Internships', 'Projects', 'Contact'].map((item) => (
                <button key={item} 
                    onMouseEnter={() => playSound("hover")}
                    onClick={() => document.getElementById(item.toLowerCase()).scrollIntoView({ behavior: 'smooth' })} 
                    style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', flexShrink: 0 }}>
                    {item}
                </button>
            ))}
        </motion.nav>
      </Section>
    </div>
  )
}