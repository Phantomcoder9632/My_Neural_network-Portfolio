import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook, FaEnvelope, FaBrain, FaFileDownload,
  FaPython, FaDatabase, FaJava, FaGitAlt, FaFigma, FaCode, FaRobot, FaMicrophone, FaServer, FaProjectDiagram } from 'react-icons/fa'
import { SiPytorch, SiTensorflow, SiOpencv, SiGooglecolab, SiCplusplus, SiReact, SiDocker, SiScikitlearn, SiFastapi } from 'react-icons/si'
import emailjs from '@emailjs/browser'

// --- AUDIO ENGINE (INTERACTIVE) ---
const useAudioInterface = () => {
  const audioCtxRef = useRef(null);
  const lastScrollY = useRef(0);

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
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);
      gain.gain.setValueAtTime(0.015, now); 
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.start(now);
      osc.stop(now + 0.03);
    } 
    else if (type === "hover") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
    else if (type === "click") {
       osc.type = "sine";
       osc.frequency.setValueAtTime(1200, now);
       osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
       gain.gain.setValueAtTime(0.05, now);
       gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
       osc.start(now);
       osc.stop(now + 0.1);
    }
    else if (type === "section") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const diff = Math.abs(currentScroll - lastScrollY.current);
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
        id: 11,
        title: "WikiSentinel | Real-Time Vandalism Governance",
        subtitle: "Agentic RAG / Kappa Architecture",
        tech: ["Python", "Pathway", "Llama 3", "RAG", "Vector DB", "FastAPI", "React.js", "Tailwind CSS"],
        github: "https://github.com/Ishan2364/Project_X-Singularity/tree/feature-migration/wikisentinel-frontend", 
        description: "A zero-latency Kappa Architecture system that bypasses traditional databases to detect context-dependent wiki vandalism. Converts edit streaming diffs into high-dimensional vector embeddings, dynamically referenced by a fine-tuned Llama 3 semantic judge.",
        points: [
            "🏆 Won 2nd Place at a high-stakes hackathon for scalability and LLM stream processing innovation.",
            "Utilized Wikimedia EventStreams API and Pathway for stateful windowing and instantaneous vector-store RAG.",
            "Developed a high-concurrency FastAPI backend reducing Vandalism-Live-Time from minutes to sub-500ms."
        ]
    },
    {
        id: 12,
        title: "SoundCo | Decentralized P2P Audio Mesh",
        subtitle: "Distributed Systems / WebRTC",
        tech: ["React Native", "Node.js", "WebRTC", "Socket.io", "FastAPI", "Docker", "STUN/TURN"],
        github: "https://github.com/Phantomcoder9632/SoundCo--Audio-Transmission-App",
        description: "Eliminated 'The Latency Gap' of standard streaming by engineering a Decentralized Media Mesh. Built custom WebRTC DataChannels and STUN/TURN infrastructure for direct audio byte streaming without central bottlenecks.",
        points: [
            "Achieved true real-time synchronization with sub-100ms latency across distinct geographic regions.",
            "Developed a custom jitter-sync algorithm adjusting local playback buffers to keep listeners within 50ms of the host.",
            "Reduced server infrastructure costs by over 90% by offloading heavy bandwidth requirements to edge user devices."
        ]
    },
    {
        id: 13,
        title: "Deep-Apnea | Clinical-Grade Sleep Diagnostics",
        subtitle: "Healthcare / Deep Learning (1D-CNN)",
        tech: ["Python", "TensorFlow", "Keras", "NumPy", "SciPy", "Matplotlib", "Seaborn"],
        github: "https://github.com/Phantomcoder9632/Apneoa-event-prediction-Using-PPG-signal",
        description: "A low-cost, AI-driven screening tool designed to replace expensive overnight Polysomnography by analyzing single-channel wearable Photoplethysmogram (PPG) signals.",
        points: [
            "Designed a SciPy preprocessing suite utilizing Butterworth Bandpass (0.5-5Hz) and Median filters to mathematically isolate heart rates and remove basal wander.",
            "Architected a 1D-CNN utilizing Dilated Convolutions to expand the receptive field to 30-60 second structural windows.",
            "Achieved an impressive 86.03% Sensitivity on the PhysioNet dataset, outperforming baseline clinical ML modeling."
        ]
    },
    {
        id: 14,
        title: "Velco | Traffic Safety & Collision Analytics",
        subtitle: "Computer Vision / Edge AI",
        tech: ["Python", "OpenCV", "YOLOv8", "PyTorch", "SORT Tracking", "PostgreSQL", "Docker", "Linux"],
        github: "https://github.com/Phantomcoder9632/Velloc-AImediaplayer",
        description: "An active computer vision platform turning raw video feeds into actionable collision-prediction data. Features a multi-stage Deep Learning pipeline executing YOLOv8 detection, SORT Kalman filter tracking, and Model-in-Model ALPR.",
        points: [
            "Engineered a physics-based logic module calculating Velocity Vectors and Time-To-Collision (TTC) to trigger predictive emergency alerts.",
            "Maintained 30+ FPS inference on mid-range GPUs making the architecture viable for real-world IP camera deployments.",
            "Developed a full-stack PostgreSQL dashboard to log vehicle interactions and violation timestamps."
        ]
    }
];

// --- 2. COMPONENTS ---

// NEURO CORE ANIMATION (Optimized Size)
const NeuroCore = () => {
  return (
    <motion.div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', 
        width: 'clamp(150px, 30vw, 200px)',  // Much bigger (responsive)
        height: 'clamp(150px, 30vw, 200px)'  // Square aspect ratio
      }}
      animate={{ y: [0, -20, 0] }} // Increased float range
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <FaBrain style={{ 
          color: '#00f3ff', 
          fontSize: 'clamp(180px, 20vw, 300px)', // Huge Icon
          filter: 'drop-shadow(0 0 40px #00f3ff)' // Stronger Glow
      }} />
      <motion.div
        style={{
          position: 'absolute', width: '100%', height: '100%', borderRadius: '50%',
          border: '4px solid #00f3ff', opacity: 0, // Thicker ring
        }}
        animate={{ scale: [0.8, 1.4], opacity: [0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
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
    padding: '10vh 5vw', // Reduced horizontal padding for mobile
    marginBottom: '10vh', // Reduced margin between sections
    position: 'relative', 
    boxSizing: 'border-box'
  }}>
    <motion.div onViewportEnter={() => playSound && playSound("section")}>
        {children}
    </motion.div>
  </section>
)

// STYLES
const cardStyle = {
    background: 'rgba(0, 0, 0, 0.7)', 
    backdropFilter: 'blur(10px)',
    padding: '25px', // Slightly less padding
    borderRadius: '15px',
    borderLeft: '4px solid #00f3ff',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    flex: 1,
    minWidth: '280px', // Ensures cards don't get too squashed
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
    gap: '30px',
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
      <input type="text" name="user_name" placeholder="Your Name" required onMouseEnter={() => playSound("hover")} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #333', padding: '15px', borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none' }} />
      <input type="email" name="user_email" placeholder="Your Email" required onMouseEnter={() => playSound("hover")} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #333', padding: '15px', borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none' }} />
      <textarea name="message" rows="5" placeholder="Write your message here..." required onMouseEnter={() => playSound("hover")} style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #333', padding: '15px', borderRadius: '10px', color: 'white', fontSize: '1rem', outline: 'none', resize: 'none' }} />
      <button type="submit" onMouseEnter={() => playSound("hover")} style={{ background: '#00f3ff', color: 'black', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', letterSpacing: '1px' }}>{status || 'SEND TRANSMISSION'}</button>
    </form>
  )
}

const themeColors = ['#00f3ff', '#bd00ff', '#ffd700'];

// ---- NAV CONFIG ----
const navItems = [
  { label: 'Home',            id: 'home'        },
  { label: 'About Me',        id: 'education'   },
  { label: 'Work Experience', id: 'internships' },
  { label: 'Skills',          id: 'skills'      },
  { label: 'Projects',        id: 'projects'    },
  { label: 'Contact Me',      id: 'contact'     },
];

// ---- SKILLS DATA (tabbed) ----
const skillCategories = [
  {
    key: 'languages',
    label: '// DEV & WEB',
    color: '#00f3ff',
    glow: 'rgba(0,243,255,0.25)',
    skills: [
      { name: 'Python',      icon: <FaPython /> },
      { name: 'C++',         icon: <SiCplusplus /> },
      { name: 'React',       icon: <SiReact /> },
      { name: 'FastAPI',     icon: <SiFastapi /> },
      { name: 'SQL / MySQL', icon: <FaDatabase /> },
      { name: 'WebSockets',  icon: <FaServer /> },
    ],
  },
  {
    key: 'neural',
    label: '// NEURAL CORE',
    color: '#bd00ff',
    glow: 'rgba(189,0,255,0.25)',
    skills: [
      { name: 'PyTorch',         icon: <SiPytorch /> },
      { name: 'TensorFlow',      icon: <SiTensorflow /> },
      { name: 'Llama 3',         icon: <FaRobot /> },
      { name: 'Gemini Vision',   icon: <SiOpencv /> },
      { name: 'Whisper',         icon: <FaMicrophone /> },
      { name: 'Scikit-Learn',    icon: <SiScikitlearn /> },
    ],
  },
  {
    key: 'tools',
    label: '// INFRA & TOOLS',
    color: '#ffd700',
    glow: 'rgba(255,215,0,0.25)',
    skills: [
      { name: 'Docker',        icon: <SiDocker /> },
      { name: 'Pathway',       icon: <FaProjectDiagram /> },
      { name: 'Git / GitHub',  icon: <FaGitAlt /> },
      { name: 'Figma',         icon: <FaFigma /> },
      { name: 'Google Colab',  icon: <SiGooglecolab /> },
    ],
  },
];

// ---- SKILL ICON CARD ----
const SkillCard = ({ skill, color, glow }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -6, scale: 1.08 }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '12px', padding: '22px 16px',
        borderRadius: '16px',
        background: hovered ? `rgba(0,0,0,0.75)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${hovered ? color : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered ? `0 0 24px ${glow}, inset 0 0 20px ${glow}` : 'none',
        cursor: 'default',
        transition: 'all 0.3s ease',
        minWidth: '90px',
      }}
    >
      <span style={{
        fontSize: '2rem',
        color: hovered ? color : 'rgba(255,255,255,0.55)',
        filter: hovered ? `drop-shadow(0 0 8px ${color})` : 'none',
        transition: 'all 0.3s ease',
      }}>
        {skill.icon}
      </span>
      <span style={{
        fontSize: '0.7rem', fontWeight: '600',
        color: hovered ? color : 'rgba(255,255,255,0.6)',
        letterSpacing: '0.5px', textAlign: 'center',
        transition: 'color 0.3s ease',
      }}>
        {skill.name}
      </span>
    </motion.div>
  );
};

// ---- SKILLS SECTION ----
const SkillsSection = ({ playSound }) => {
  const [activeTab, setActiveTab] = useState('languages');
  const active = skillCategories.find(c => c.key === activeTab);

  return (
    <motion.div
      initial="hidden" whileInView="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
      style={{ width: '100%' }}
    >
      <h2 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center', marginBottom: '40px', color: 'white' }}>TECHNICAL ARSENAL</h2>

      {/* Category Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {skillCategories.map(cat => (
          <motion.button
            key={cat.key}
            onClick={() => { setActiveTab(cat.key); playSound && playSound('click'); }}
            onMouseEnter={() => playSound && playSound('hover')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: activeTab === cat.key ? cat.color : 'rgba(255,255,255,0.05)',
              color: activeTab === cat.key ? '#000' : cat.color,
              border: `1px solid ${cat.color}`,
              borderRadius: '50px',
              padding: '10px 26px',
              fontSize: '0.78rem',
              fontWeight: 'bold',
              letterSpacing: '1.5px',
              cursor: 'pointer',
              boxShadow: activeTab === cat.key ? `0 0 16px ${cat.glow}` : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {cat.label}
          </motion.button>
        ))}
      </div>

      {/* Icon Grid */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          maxWidth: '700px', margin: '0 auto',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '24px',
          border: `1px solid ${active.color}22`,
          boxShadow: `0 0 60px ${active.glow}`,
          padding: '36px 28px',
        }}
      >
        {/* Top accent line */}
        <div style={{ height: '2px', borderRadius: '2px', background: `linear-gradient(90deg, transparent, ${active.color}, transparent)`, marginBottom: '28px' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {active.skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <SkillCard skill={skill} color={active.color} glow={active.glow} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Interface() {
  const { playSound } = useAudioInterface();

  return (
    <div style={{ color: 'white', fontFamily: "'Inter', sans-serif", width: '100%', overflowX: 'hidden' }}>

      {/* 1. ORIGIN */}
      <Section id="home" playSound={playSound}>
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '30px', flexWrap: 'wrap-reverse', textAlign: 'left', width: '100%', paddingTop: '60px' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
              <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 6rem)', margin: 0, lineHeight: '0.9', textShadow: '0 0 20px rgba(0,243,255,0.5)' }}>BIKRAM<br />HAWLADAR</h1>
              <p style={{ marginTop: '20px', fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: '#00f3ff', letterSpacing: '3px' }}>ENTERING THE NEURAL CORE...</p>
              
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
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center', marginBottom: '40px' }}>ACADEMIC BACKGROUND</h2>
            
            <div style={containerStyle}>
                <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <div>
                        <p style={{ color: '#00f3ff', letterSpacing: '1px', fontSize: '0.7rem', fontWeight: 'bold' }}>INDIAN INSTITUTE OF INFORMATION TECHNOLOGY</p>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '5px' }}>IIIT Dharwad</h2>
                        <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 'normal' }}>B.Tech in Computer Science & Engineering</h3>
                    </div>

                    <p style={{ lineHeight: '1.5', fontSize: '0.95rem', color: '#ccc' }}>
                        The journey began here. Mastering the "Mathematics of Intelligence" and building a strong foundation in computational logic.
                    </p>
                    
                    <div style={{ alignSelf: 'flex-start' }}><span style={{ background: '#00f3ff', color: 'black', padding: '2px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>CGPA 8.45</span></div>

                    <div style={{ marginTop: '10px', background: 'rgba(0, 243, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(0, 243, 255, 0.1)' }}>
                        <h4 style={{ color: '#00f3ff', margin: '0 0 10px 0', fontSize: '0.8rem', letterSpacing: '1px' }}>RELEVANT COURSEWORK</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {['Data Structures & Algorithms', 'Deep Learning', 'Machine Learning', 'NLP', 'Bio-Medical Signal Processing', 'Computer Networks', 'Operating Systems'].map((course) => (
                                <span key={course} style={{ 
                                    border: '1px solid #333', color: '#ccc', 
                                    background: 'rgba(0,0,0,0.3)', padding: '4px 10px', 
                                    borderRadius: '15px', fontSize: '0.7rem' 
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
        <SkillsSection playSound={playSound} />
      </Section>

      {/* 4. WORK EXPERIENCE */}
      <Section id="internships" playSound={playSound}>
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
             <h2 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center', marginBottom: '40px' }}>PROFESSIONAL EXPERIENCE</h2>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
                {/* EXPERIENCE 1 (DISPLACE 2026) */}
                <div style={{ 
                    ...cardStyle, 
                    borderLeft: 'none', 
                    borderTop: '4px solid #00f3ff',
                    display: 'flex', flexDirection: 'column', gap: '15px',
                    boxShadow: '0 0 30px rgba(0, 243, 255, 0.1)'
                }}>
                    <div>
                        <p style={{ color: '#00f3ff', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>AI/ML RESEARCHER • DISPLACE 2026 CHALLENGE</p>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '10px 0', lineHeight: '1.2' }}>End-to-End Clinical Speech Processing Pipeline</h2>
                    </div>
                    <p style={{ lineHeight: '1.5', fontSize: '0.95rem', color: '#e0e0e0' }}>
                        Tackled the complex challenge of processing spontaneous, code-mixed (Hindi/English) clinical dialogues recorded in noisy rural healthcare settings. Built a highly accurate cascaded AI pipeline to identify speakers, transcribe dialects, and synthesize medical facts into professional clinical summaries.
                    </p>
                    <div style={{ background: 'rgba(0, 243, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(0, 243, 255, 0.15)' }}>
                        <h4 style={{ color: '#00f3ff', marginTop: 0, marginBottom: '8px', fontSize: '0.8rem', letterSpacing: '1px' }}>TECHNICAL ARCHITECTURE & ACHIEVEMENTS</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc', lineHeight: '1.5', fontSize: '0.85rem' }}>
                            <li style={{ marginBottom: '5px' }}><strong>Acoustic Preprocessing:</strong> Engineered custom sliding-window algorithms to process long-form 10-minute audio dynamically filtering out absolute silence to optimize GPU compute efficiency.</li>
                            <li style={{ marginBottom: '5px' }}><strong>Multilingual ASR & Diarization:</strong> Conducted zero-shot evaluation across IndicConformer, SeamlessM4T v2, and Whisper Large v3 Turbo. Experimented with WavLM and Pyannote for foreground speech overlap.</li>
                            <li><strong>Generative NLP:</strong> Developed a robust NLP pipeline leveraging IndicTrans2 for Hindi-to-English translation followed by a zero-shot, 4-bit quantized Zephyr-7B LLM extracting medical facts with a 0.8004 BERTScore.</li>
                        </ul>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['PyTorch', 'CUDA', 'WavLM', 'Whisper v3 Turbo', 'IndicConformer', 'Zephyr-7B (4-bit)', 'IndicTrans2', 'Hugging Face'].map((t) => (
                            <span key={t} style={{ border: '1px solid rgba(0,243,255,0.4)', color: '#00f3ff', background: 'rgba(0, 243, 255, 0.05)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>{t}</span>
                        ))}
                    </div>
                </div>

                {/* EXPERIENCE 2 (NIT DURGAPUR) */}
                <div style={{ 
                    ...cardStyle, 
                    borderLeft: 'none', 
                    borderTop: '4px solid #bd00ff',
                    display: 'flex', flexDirection: 'column', gap: '15px',
                    boxShadow: '0 0 30px rgba(189, 0, 255, 0.05)'
                }}>
                    <div>
                        <p style={{ color: '#bd00ff', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 'bold' }}>DEEP LEARNING / BCI RESEARCH ASSISTANT • NIT DURGAPUR</p>
                        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', margin: '10px 0', lineHeight: '1.2' }}>Interpretable Brain-Computer Interface (BCI) using Vision Transformers</h2>
                    </div>
                    <p style={{ lineHeight: '1.5', fontSize: '0.95rem', color: '#e0e0e0' }}>
                        Developed an end-to-end Deep Learning pipeline to classify human cognitive states (Motor Imagery and Rest) using Functional Near-Infrared Spectroscopy (fNIRS) brain signal data. Bridged neuroimaging and advanced computer vision to decode brain activity and make AI decisions transparent.
                    </p>
                    <div style={{ background: 'rgba(189, 0, 255, 0.05)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(189, 0, 255, 0.15)' }}>
                        <h4 style={{ color: '#bd00ff', marginTop: 0, marginBottom: '8px', fontSize: '0.8rem', letterSpacing: '1px' }}>KEY CONTRIBUTIONS</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#ccc', lineHeight: '1.5', fontSize: '0.85rem' }}>
                            <li style={{ marginBottom: '5px' }}><strong>Signal Processing:</strong> Built a MATLAB pipeline to extract and clean 72-channel hemodynamic signals, applying 0.2 Hz low-pass filters to remove cardiac noise.</li>
                            <li style={{ marginBottom: '5px' }}><strong>Spatial-Temporal Mapping & ViTs:</strong> Transformed raw time-series brain data into 2D scalp maps using overlapping sliding windows, training a Vision Transformer to process the image sequences.</li>
                            <li><strong>Explainable AI (XAI):</strong> Implemented SHAP (SHapley Additive exPlanations) to interpret the ViT’s decision-making, mapping predictions back to specific biological brain regions.</li>
                        </ul>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {['Python', 'MATLAB', 'PyTorch', 'Vision Transformers (ViT)', 'SHAP', 'BBCI Toolbox', 'Git'].map((t) => (
                            <span key={t} style={{ border: '1px solid rgba(189, 0, 255, 0.4)', color: '#bd00ff', background: 'rgba(189, 0, 255, 0.05)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold' }}>{t}</span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
      </Section>

      {/* 5. PROJECTS REDESIGN (Masonry/Grid) */}
      <Section id="projects" playSound={playSound}>
         <motion.div initial="hidden" whileInView="visible" variants={fadeIn}>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', textAlign: 'center', marginBottom: '50px', textShadow: '0 0 20px rgba(0,243,255,0.3)' }}>FEATURED CREATIONS</h2>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '24px',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {projects.map((project, index) => {
                    const tColor = themeColors[index % 3];
                    return (
                        <motion.div 
                            key={project.id}
                            onMouseEnter={() => playSound("hover")}
                            whileHover={{ y: -8, scale: 1.02 }}
                            style={{ 
                                background: 'rgba(5, 5, 8, 0.65)', 
                                backdropFilter: 'blur(16px)', 
                                WebkitBackdropFilter: 'blur(16px)', 
                                border: `1px solid rgba(255,255,255,0.08)`,
                                borderRadius: '24px',
                                overflow: 'hidden',
                                display: 'flex', flexDirection: 'column',
                                boxShadow: `0 0 0 rgba(0,0,0,0)`, // Animate shadow on hover
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}
                        >
                            {/* Glowing Neon Line at the top of card */}
                            <div style={{ height: '4px', width: '100%', background: `linear-gradient(90deg, transparent, ${tColor}, transparent)` }} />
                            
                            <div style={{ padding: '32px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 8px 0', lineHeight: '1.3' }}>{project.title}</h3>
                                    <span style={{ color: tColor, fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 'bold', textTransform: 'uppercase' }}>{project.subtitle}</span>
                                </div>
                                
                                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.7)', flex: 1, marginBottom: '25px' }}>
                                    {project.description}
                                </p>

                                <div style={{ 
                                    background: 'rgba(255,255,255,0.02)', 
                                    padding: '16px', 
                                    borderRadius: '12px', 
                                    marginBottom: '25px', 
                                    border: '1px solid rgba(255,255,255,0.04)' 
                                }}>
                                    <h4 style={{ color: 'white', opacity: 0.9, marginTop: 0, marginBottom: '12px', fontSize: '0.75rem', letterSpacing: '1px' }}>KEY ARCHITECTURE</h4>
                                    <ul style={{ margin: 0, paddingLeft: '18px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5', fontSize: '0.8rem' }}>
                                        {project.points.map((point, i) => <li key={i} style={{ marginBottom: '6px' }}>{point}</li>)}
                                    </ul>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto' }}>
                                    {project.tech.map((t, i) => (
                                        <span key={t} style={{ 
                                            border: `1px solid ${tColor}44`, color: tColor, 
                                            background: `${tColor}11`, padding: '4px 12px', 
                                            borderRadius: '20px', fontSize: '0.65rem', fontWeight: 'bold',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
         </motion.div>
      </Section>

      {/* 6. CONTACT */}
      <Section id="contact" playSound={playSound}>
        <motion.div initial="hidden" whileInView="visible" variants={fadeIn} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
            <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', textAlign: 'center' }}>INITIATE CONNECTION</h1>
            <div style={{ display: 'flex', gap: '20px', fontSize: '1.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="https://github.com/Phantomcoder9632" target="_blank" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#00f3ff'} onMouseOut={e => e.target.style.color='white'}><FaGithub /></a>
                <a href="https://www.linkedin.com/in/bikram-hawladar-2742092b1" target="_blank" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#0077b5'} onMouseOut={e => e.target.style.color='white'}><FaLinkedin /></a>
                <a href="https://www.instagram.com/alexa_findbikram" target="_blank" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#E1306C'} onMouseOut={e => e.target.style.color='white'}><FaInstagram /></a>
                <a href="https://www.facebook.com/share/1BexzEXx8D" target="_blank" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#1877F2'} onMouseOut={e => e.target.style.color='white'}><FaFacebook /></a>
                <a href="mailto:bikram@example.com" onMouseEnter={() => playSound("hover")} style={{ color: 'white', transition: '0.3s' }} onMouseOver={e => e.target.style.color='#ea4335'} onMouseOut={e => e.target.style.color='white'}><FaEnvelope /></a>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.8)', padding: '30px', borderRadius: '20px', border: '1px solid #333', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ marginBottom: '15px', color: '#ccc' }}>Send a direct encrypted message:</p>
                <ContactForm playSound={playSound} />
            </div>
        </motion.div>
      </Section>
    </div>
  )
}