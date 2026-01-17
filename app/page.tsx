import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Introduction from '@/components/Introduction'
import Achievement from '@/components/Achievement'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Activities from '@/components/Activities'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import FloatingChat from '@/components/FloatingChat'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation variant="dark" />
      <Hero />
      <Introduction />
      <Achievement />
      <About />
      <Projects />
      <FAQ />
      <CTA />
      <Footer variant="dark" />
      <FloatingChat />
    </main>
  )
}
