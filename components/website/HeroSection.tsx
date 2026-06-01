import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-[#fff0f5] via-[#ffd6e7] to-[#ffadd2] py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1
          className="text-5xl sm:text-6xl font-bold text-[#7a1445] mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Stories Worth Telling
        </h1>
        <p className="text-lg text-[#a0205a]/80 mb-10 max-w-xl mx-auto">
          Explore thoughts, ideas, and stories crafted with care. Welcome to the MP journal.
        </p>
        <Link
          href="/blogs"
          className="inline-block px-8 py-3.5 bg-[#e84080] hover:bg-[#c93070] text-white font-semibold rounded-2xl text-sm transition-colors shadow-md hover:shadow-lg"
        >
          Read the Blog
        </Link>
      </div>
    </section>
  )
}
