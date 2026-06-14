import Link from 'next/link'
import AztecDivider from './AztecDivider'

const aztecTileSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>
  <polygon points='40,0 80,40 40,80 0,40' fill='none' stroke='%237D5C3E' stroke-width='1.8'/>
  <polygon points='40,8 72,40 40,72 8,40' fill='none' stroke='%239E7758' stroke-width='1.4'/>
  <polygon points='40,16 64,40 40,64 16,40' fill='none' stroke='%237D5C3E' stroke-width='1.2'/>
  <polygon points='40,24 56,40 40,56 24,40' fill='none' stroke='%239E7758' stroke-width='1'/>
  <polygon points='40,32 48,40 40,48 32,40' fill='%237D5C3E' opacity='0.45'/>
  <circle cx='40' cy='0' r='2' fill='%237D5C3E' opacity='0.4'/>
  <circle cx='80' cy='40' r='2' fill='%237D5C3E' opacity='0.4'/>
  <circle cx='40' cy='80' r='2' fill='%237D5C3E' opacity='0.4'/>
  <circle cx='0' cy='40' r='2' fill='%237D5C3E' opacity='0.4'/>
</svg>`

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#F5EFE6] via-[#EDE0CF] to-[#E5D5BC] overflow-hidden">

      {/* Aztec tile pattern — very low opacity, faded from center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,${aztecTileSvg}")`,
          backgroundSize: '80px 80px',
          opacity: 0.12,
        }}
      />
      {/* Radial gradient to clear the center so text stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(237,224,207,0.92) 0%, rgba(237,224,207,0.6) 50%, transparent 100%)',
        }}
      />

      {/* Top aztec border strip */}
      <AztecDivider color="#9E7758" opacity={0.35} height={44} />

      {/* Main hero content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-20">
        <h1
          className="text-5xl sm:text-6xl font-bold text-[#5C4028] mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Stories Worth Telling
        </h1>
        <p className="text-lg text-[#7D5C3E]/80 mb-10 max-w-xl mx-auto">
          Explore thoughts, ideas, and stories crafted with care. Welcome to the MP journal.
        </p>
        <Link
          href="/blogs"
          className="inline-block px-8 py-3.5 bg-[#B8916F] hover:bg-[#9E7758] text-white font-semibold rounded-2xl text-sm transition-colors shadow-md hover:shadow-lg"
        >
          Read the Blog
        </Link>
      </div>

      {/* Bottom aztec border strip */}
      <AztecDivider color="#7D5C3E" opacity={0.4} height={48} />
    </section>
  )
}
