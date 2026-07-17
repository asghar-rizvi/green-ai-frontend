import { motion } from 'framer-motion'
import { Linkedin, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-emerald-deep py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-alabaster/70 font-body text-sm tracking-wide text-center md:text-left"
        >
          Engineered for Sustainable Precision Agriculture.
        </motion.p>

        <div className="flex items-center gap-4">
          <motion.a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05, backgroundColor: "#22C55E" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-alabaster/10 text-alabaster px-6 py-3 rounded-full font-heading font-semibold text-sm border border-alabaster/10 transition-colors duration-300"
          >
            <Linkedin className="w-4 h-4" />
            Let's Connect
          </motion.a>

          <motion.a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-alabaster/10 text-alabaster border border-alabaster/10 hover:bg-alabaster/20 transition-colors duration-300"
          >
            <Github className="w-5 h-5" />
          </motion.a>
        </div>
      </div>
    </footer>
  )
}