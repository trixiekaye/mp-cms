export const dynamic = 'force-dynamic'
import HeroSection from '@/components/website/HeroSection'
import FeaturedBlogs from '@/components/website/FeaturedBlogs'
import ImageGallerySection from '@/components/website/ImageGallerySection'
import AboutMeSection from '@/components/website/AboutMeSection'
import ContactSection from '@/components/website/ContactSection'
import AztecDivider from '@/components/website/AztecDivider'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedBlogs />
      <AztecDivider color="#9E7758" opacity={0.3} height={44} />
      <ImageGallerySection />
      <AztecDivider color="#9E7758" opacity={0.28} height={44} />
      <AboutMeSection />
      <AztecDivider color="#7D5C3E" opacity={0.25} height={44} />
      <ContactSection />
    </>
  )
}
