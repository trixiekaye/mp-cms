import Header from '@/components/website/Header'
import Footer from '@/components/website/Footer'

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
