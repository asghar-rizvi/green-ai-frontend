import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Hero() {
  const [phase, setPhase] = useState(0)
  const videoRef = useRef(null)
  const [debugLog, setDebugLog] = useState("Initializing...")

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      // 🐛 DEBUG LOG 1: Track initial state elements
      console.log("[DEBUG] Video element found in DOM. Source path:", video.querySelector('source')?.src)
      
      // 💡 FORCE MUTED PROPERTIES TO OVERRIDE STRICT BROWSER AUTOPLAY POLICIES
      video.muted = true
      video.defaultMuted = true

      // 🐛 DEBUG LOG 2: Monitor asset load states
      video.onloadstart = () => {
        console.log("[DEBUG] Browser started loading the video asset...")
        setDebugLog("Loading stream...")
      }

      video.oncanplay = () => {
        console.log("[DEBUG] Browser pipeline success: Video can play smoothly.")
        setDebugLog("Buffer ready. Executing playback...")
      }

      video.onerror = (e) => {
        console.error("[DEBUG ERROR] Critical Video Asset Load Error:", video.error)
        setDebugLog(`Error Code: ${video.error?.code ?? 'Unknown'} - Check asset path location inside /public`)
      }

      // Execute programmatic stream play call
      video.play()
        .then(() => {
          console.log("[DEBUG] Autoplay status: Active and rendering successfully.")
          setDebugLog("Streaming active.")
        })
        .catch(err => {
          console.error("[DEBUG ERROR] Browser blocked native streaming execution:", err.name)
          setDebugLog(`Blocked: ${err.message}`)
        })
    } else {
      console.error("[DEBUG ERROR] Video reference failed to attach to DOM node.")
    }

    // Phase management timelines
    const t1 = setTimeout(() => setPhase(1), 1500)
    const t2 = setTimeout(() => setPhase(2), 2600)
    const t3 = setTimeout(() => setPhase(3), 3400)
    
    return () => { 
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3) 
    }
  }, [])

  return (
    <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#0A361F' }}>

      {/* SAFE ANIMATED WRAPPER FOR NATIVE VIDEO */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
        initial={{ opacity: 0.8, scale: 1.1 }}
        animate={phase === 3 ? { opacity: 0.5, scale: 1 } : { opacity: 0.8, scale: 1.1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
      >
        <video
          ref={videoRef}
          autoPlay={true}
          muted={true}
          loop={true}
          playsInline={true}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        >
          <source src="/drone_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>

      {/* AMBIENT OVERLAY SYSTEM */}
      <motion.div
        style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: '#0A361F', 
          zIndex: 2,
          pointerEvents: 'none'
        }}
        initial={{ opacity: 0.3 }}
        animate={phase === 3 ? { opacity: 0.6 } : { opacity: 0.3 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* PHASE 0 & 1: HUD TARGETING RADAR */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.div
            key="drone-ui"
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <motion.div
              style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              initial={{ y: 0, scale: 0.8, opacity: 0 }}
              animate={phase === 0 ? { y: 0, scale: 1, opacity: 1 } : { y: -100, scale: 0.5, opacity: 0 }}
              transition={phase === 0 
                ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
                : { duration: 1.0, ease: [0.33, 1, 0.68, 1] }
              }
            >
              <div style={{ position: 'absolute', width: 80, height: 80, backgroundColor: '#22C55E', borderRadius: '50%', filter: 'blur(30px)', opacity: 0.6 }} />
              <div style={{ position: 'absolute', width: 100, height: 100, border: '2px solid rgba(34, 197, 94, 0.4)', borderRadius: '50%', animation: 'spin 2s linear infinite' }} />
              <div style={{ position: 'absolute', width: 70, height: 70, border: '2px solid rgba(34, 197, 94, 0.2)', borderRadius: '50%', animation: 'spin 3s linear infinite reverse' }} />
              
              <div style={{ width: 20, height: 20, backgroundColor: '#22C55E', borderRadius: '50%', zIndex: 10, boxShadow: '0 0 40px #22C55E' }} />
              <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 60, height: 6, backgroundColor: 'rgba(34, 197, 94, 0.5)', borderRadius: 10, filter: 'blur(2px)' }} />
              <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', width: 60, height: 6, backgroundColor: 'rgba(34, 197, 94, 0.5)', borderRadius: 10, filter: 'blur(2px)' }} />
              <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 6, height: 60, backgroundColor: 'rgba(34, 197, 94, 0.5)', borderRadius: 10, filter: 'blur(2px)' }} />
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 6, height: 60, backgroundColor: 'rgba(34, 197, 94, 0.5)', borderRadius: 10, filter: 'blur(2px)' }} />
            </motion.div>

            <motion.p
              style={{ marginTop: 40, color: 'rgba(249, 251, 249, 0.7)', fontFamily: 'Inter, sans-serif', fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 0 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              Initializing Field Vision
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 2 & 3: MAIN LANDING TYPOGRAPHY */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            key="main-text"
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 30, padding: '0 24px', textAlign: 'center' }}
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', fontWeight: 800, color: '#F9FBF9', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              Green AI: Precision<br />
              <span style={{ color: '#22C55E' }}>Crop & Weed</span> Detection
            </h1>
            <motion.div
              style={{ width: 80, height: 4, backgroundColor: '#22C55E', marginTop: 32, borderRadius: 10, transformOrigin: 'center' }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SCROLL METRIC INDICATOR */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div
            key="scroll"
            style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span style={{ color: 'rgba(249, 251, 249, 0.5)', fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 22, height: 36, border: '2px solid rgba(249, 251, 249, 0.3)', borderRadius: 20, display: 'flex', justifyContent: 'center', paddingTop: 6 }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 4, height: 4, backgroundColor: '#22C55E', borderRadius: '50%' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}