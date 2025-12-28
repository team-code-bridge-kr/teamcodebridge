import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Introduction from '@/components/Introduction'
import Achievement from '@/components/Achievement'
import Projects from '@/components/Projects'
import About from '@/components/About'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation variant="dark" />
      <Hero />
      <Introduction />
      <Achievement />
      <Projects />
      <About />
      <CTA />
      <Footer variant="dark" />
    </main>
  )
}
