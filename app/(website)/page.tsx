export const dynamic = 'force-dynamic'
import HeroSection from '@/components/website/HeroSection'
import FeaturedBlogs from '@/components/website/FeaturedBlogs'
import ImageGallerySection from '@/components/website/ImageGallerySection'
import AboutMeSection from '@/components/website/AboutMeSection'
import ContactSection from '@/components/website/ContactSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedBlogs />
      <ImageGallerySection />
      <AboutMeSection />
      <ContactSection />
    </>
  )
}
