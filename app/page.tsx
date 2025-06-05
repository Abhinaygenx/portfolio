"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { ArrowRight, Code, ExternalLink, Github, Mail, Monitor, Palette, ChevronDown, Download } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import JourneyMap from "@/components/journey-map"
import CustomCursor from "@/components/custom-cursor"
import FloatingElements from "@/components/floating-elements"
import AnimatedText from "@/components/animated-text"
import ThemeSwitcher from "@/components/theme-switcher"
import Scene3D from "@/components/3d-scene"
import Floating3DCard from "@/components/floating-3d-card"
import { useMobile } from "@/hooks/use-mobile"

export default function Portfolio() {
  const isMobile = useMobile()
  const [activeSection, setActiveSection] = useState("home")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const sectionRefs = {
    home: useRef<HTMLElement>(null),
    about: useRef<HTMLElement>(null),
    skills: useRef<HTMLElement>(null),
    projects: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  }

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Prevent layout shift by forcing scrollbar visibility
  useEffect(() => {
    document.documentElement.style.overflow = "scroll"
    document.documentElement.style.overflowX = "hidden"

    // Add consistent padding to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      document.documentElement.style.overflow = ""
      document.documentElement.style.overflowX = ""
      document.body.style.paddingRight = ""
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    let isActive = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      if (!isActive) return

      try {
        const scrollPosition = window.scrollY + 100

        Object.entries(sectionRefs).forEach(([section, ref]) => {
          const element = ref.current
          if (element && element.offsetTop !== undefined && element.offsetHeight !== undefined) {
            const { offsetTop, offsetHeight } = element
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section)
            }
          }
        })
      } catch (error) {
        console.warn("Error in scroll handler:", error)
      }
    }

    const addEventListeners = () => {
      try {
        if (typeof window !== "undefined" && window.addEventListener) {
          window.addEventListener("mousemove", handleMouseMove, { passive: true })
          window.addEventListener("scroll", handleScroll, { passive: true })
        }
      } catch (error) {
        console.warn("Error adding window event listeners:", error)
      }
    }

    addEventListeners()

    return () => {
      isActive = false
      try {
        if (typeof window !== "undefined" && window.removeEventListener) {
          window.removeEventListener("mousemove", handleMouseMove)
          window.removeEventListener("scroll", handleScroll)
        }
      } catch (error) {
        console.warn("Error removing window event listeners:", error)
      }
    }
  }, [isMounted])

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="text-6xl font-bold">
              <span className="bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Portfolio
              </span>
              <span className="text-blue-400">.</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-sm"
          >
            Loading amazing experience...
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden cursor-none">
      <CustomCursor />

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/" className="text-xl font-bold">
              Portfolio<span className="text-blue-400">.</span>
            </Link>
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            {Object.keys(sectionRefs).map((section, index) => (
              <motion.div
                key={section}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <button
                  onClick={() => {
                    const element = sectionRefs[section as keyof typeof sectionRefs].current
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  }}
                  className={`text-sm font-medium capitalize transition-colors relative group ${
                    activeSection === section ? "text-blue-400" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {section}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
                </button>
              </motion.div>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                size="sm"
                onClick={() => {
                  const element = sectionRefs.contact.current
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
                className="hidden md:flex bg-blue-600 hover:bg-blue-700 transition-all duration-300 hover:scale-105"
              >
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Button>
            </motion.div>
          </div>

          <Button variant="outline" size="icon" className="md:hidden border-white/20 text-white">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" ref={sectionRefs.home} className="relative min-h-screen flex items-center overflow-hidden">
        <FloatingElements />
        <Scene3D />

        {/* Dynamic background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Interactive background elements */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ opacity, scale }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
                  <p className="text-blue-400 font-medium tracking-wider uppercase text-sm">
                    Creative Developer & Designer
                  </p>
                </motion.div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h1 className="text-7xl sm:text-8xl md:text-7xl lg:text-7xl font-bold tracking-tight leading-none">
                      <span className="block">Abhinay Kumar</span>
                      <span className="block bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
                        Yadav
                      </span>
                      <span className="text-blue-400 text-6xl sm:text-7xl md:text-8xl lg:text-9xl">.</span>
                    </h1>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-xl md:text-2xl text-gray-400 max-w-xl leading-relaxed"
                  >
                    <AnimatedText
                      text="I craft exceptional digital experiences that blend creativity with cutting-edge technology."
                      delay={300}
                      speed={40}
                    />
                  </motion.div>
                </div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button
                  size="lg"
                  onClick={() => {
                    const element = sectionRefs.projects.current
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  View My Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 font-medium px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/resume.pdf" target="_blank">
                    <Download className="mr-2 h-5 w-5" />
                    Download Resume
                  </Link>
                </Button>
              </motion.div>

              {/* Social Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex items-center space-x-6 pt-4"
              >
                {[
                  { href: "https://github.com", icon: Github, label: "GitHub" },
                  {
                    href: "https://linkedin.com",
                    icon: () => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                    label: "LinkedIn",
                  },
                {
  href: "mailto:abhinaykumar5432@gmail.com",
  icon: Mail,
  label: "Email"
}
                ].map((social, index) => (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <Link
                      href={social.href}
                      target="_blank"
                      className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/5"
                    >
                      <social.icon className="h-6 w-6" />
                      <span className="sr-only">{social.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                {/* Animated rings with brackets */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-blue-400/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  style={{ width: "120%", height: "120%", top: "-10%", left: "-10%" }}
                >
                  {/* Small brackets on the ring */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 border-l-2 border-t-2 border-blue-400/40 rotate-45" />
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 border-r-2 border-b-2 border-blue-400/40 rotate-45" />
                  <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 border-l-2 border-b-2 border-blue-400/40 rotate-45" />
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 border-r-2 border-t-2 border-blue-400/40 rotate-45" />
                </motion.div>

                <motion.div
                  className="absolute inset-0 rounded-full border border-purple-400/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  style={{ width: "140%", height: "140%", top: "-20%", left: "-20%" }}
                >
                  {/* Small brackets on the outer ring */}
                  <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 border-l border-t border-purple-400/30 rotate-45" />
                  <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 border-r border-t border-purple-400/30 rotate-45" />
                  <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 border-l border-b border-purple-400/30 rotate-45" />
                  <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 border-r border-b border-purple-400/30 rotate-45" />
                </motion.div>

                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-2xl blur-3xl animate-pulse" />

                {/* Main image */}
                <motion.div
                  className="relative z-10 w-full max-w-md mx-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="/placeholder.svg?height=600&width=500&text=Professional+Portrait"
                    alt="Professional Portrait"
                    className="w-full rounded-2xl shadow-2xl border border-white/10"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl" />
                </motion.div>

                {/* Floating 3D elements */}
                <motion.div
                  className="absolute -top-8 -right-8"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Floating3DCard text="DEV" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-8 -left-8"
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.5 }}
                >
                  <Floating3DCard text="UX" />
                </motion.div>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2"
            >
              <span className="text-sm text-gray-400">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <ChevronDown className="w-6 h-6 text-blue-400" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About & Journey Section */}
      <section id="about" ref={sectionRefs.about} className="py-20 md:py-32 bg-gray-900/30 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                  About Me
                </h2>
                <div className="space-y-4 text-gray-400 leading-relaxed">
                  <p>
                    Hi, I'm Abhinay — a tech enthusiast and Electrical Engineering student at NIT Silchar. I started my coding journey in 2023, and ever since, I've been driven by a passion for building, creating, and automating.

I love working on projects that combine creativity and technology. From video editing and social media management to building automation workflows with n8n, I enjoy exploring tools that make things more efficient and engaging.
                  </p>
<div className="mt-6">
  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
    <span>🛠️</span> Skills & Tools I Use:
  </h2>
  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-10 list-disc list-inside text-gray-300">
    <li>
      <span className="font-semibold text-gray-100">Languages:</span> JavaScript, C++, C
    </li>
    <li>
      <span className="font-semibold text-gray-100">Web:</span> HTML, CSS, React, Next.js
    </li>
    <li>
      <span className="font-semibold text-gray-100">Automation:</span> n8n
    </li>
    <li>
      <span className="font-semibold text-gray-100">Creative Tools:</span> Adobe Premiere Pro, After Effects, Photoshop, Canva
    </li>
    <li>
      <span className="font-semibold text-gray-100">Others:</span> Notion, Git, VS Code
    </li>
  </ul>
</div>
                  <p>
                   I'm always exploring new ideas, learning new skills, and building things that inspire or solve real problems.Whether you're looking for a video editor, a developer, or someone to streamline your digital workflow — I’d love to collaborate.


                  </p>
                </div>
              </motion.div>
            </div>

            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                  My Journey
                </h2>
                <div className="h-[400px] relative">
                  <JourneyMap />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" ref={sectionRefs.skills} className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            My Skills
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Frontend Development",
                icon: Code,
                color: "blue",
                skills: [
                  { name: "React", level: 95 },
                  { name: "Next.js", level: 90 },
                  { name: "TypeScript", level: 85 },
                  { name: "Tailwind CSS", level: 90 },
                ],
              },
              {
                title: "Design",
                icon: Palette,
                color: "purple",
                skills: [
                  { name: "UI/UX Design", level: 85 },
                  { name: "Figma", level: 80 },
                  { name: "Animation", level: 80 },
                  { name: "Responsive Design", level: 95 },
                ],
              },
              {
                title: "Other Skills",
                icon: Monitor,
                color: "green",
                skills: [
                  { name: "Video Editng", level: 90 },
                  { name: "Graphics Designing", level: 85 },
                  { name: "SEO", level: 80 },
                  { name: "Performance Optimization", level: 80 },
                ],
              },
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 group">
                  <div className={`h-2 bg-${category.color}-500`} />
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <category.icon
                        className={`h-8 w-8 mr-3 text-${category.color}-500 group-hover:scale-110 transition-transform duration-300`}
                      />
                      <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    </div>
                    <div className="space-y-4">
                      {category.skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: skillIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                            <span className="text-sm text-gray-400">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2 bg-gray-800" />
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" ref={sectionRefs.projects} className="py-20 md:py-32 bg-gray-900/30 relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-white via-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Featured Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                id: 1,
                title: "Doctor appointment booking Web App",
                description:
                  " web-based platform that enables users to book doctor appointments online, view doctor profiles and availability, and receive timely reminders.",
                tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
                gradient: "from-blue-600 to-purple-600",
              },
              {
                id: 2,
                title: "E-commerce Dashboard",
                description:
                  "Modern dashboard for e-commerce analytics with real-time data visualization and AI insights.",
                tech: ["Next.js", "TypeScript", "Prisma", "Chart.js"],
                gradient: "from-purple-600 to-pink-600",
              },
              {
                id: 3,
                title: "Creative Portfolio Website",
                description:
                  "A stunning portfolio website with advanced animations, 3D elements, and smooth interactions.",
                tech: ["React", "Framer Motion", "Three.js", "Tailwind"],
                gradient: "from-green-600 to-blue-600",
              },
              {
                id: 4,
                title: "Task Management App",
                description:
                  "Collaborative task management application with real-time updates and team collaboration features.",
                tech: ["Vue.js", "Firebase", "Vuetify", "PWA"],
                gradient: "from-orange-600 to-red-600",
              },
            ].map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-all duration-500"
              >
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                  />
                  <img
                    src={`/placeholder.svg?height=400&width=600&text=${encodeURIComponent(project.title)}`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <div className="p-6 relative">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: techIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full border border-blue-600/30 hover:bg-blue-600/30 transition-colors duration-300"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                      asChild
                    >
                      <Link href="https://doctor-appointment-site-mhmt.vercel.app/">
                        <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-blue-500/50 transition-all duration-300"
                      asChild
                    >
                      <Link href="https://github.com/Abhinaygenx/doctor-appointment-site">
                        <Github className="mr-2 h-4 w-4" /> Source Code
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={sectionRefs.contact} className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Get In Touch
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-400 leading-relaxed"
            >
              I'm currently available for freelance work and open to new opportunities. If you have a project that needs
              some creative touch, let's talk!
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {[
                  { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                  { id: "email", label: "Email", type: "email", placeholder: "Your email" },
                ].map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <label htmlFor={field.id} className="text-sm font-medium text-gray-300">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-300 hover:border-gray-600"
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Your message"
                    className="flex min-h-[120px] w-full rounded-md border border-gray-700 bg-gray-900/50 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-300 hover:border-gray-600 resize-none"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Send Message
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-4 md:mb-0"
            >
              <Link href="/" className="text-xl font-bold">
                Portfolio<span className="text-blue-400">.</span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-sm text-gray-400"
            >
              &copy; {new Date().getFullYear()} Abhinay kumar Yadav. All rights reserved.
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-4 md:mt-0"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const element = sectionRefs.home.current
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Back to top
              </Button>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}
