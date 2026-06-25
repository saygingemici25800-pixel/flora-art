import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './lib/i18n'
import './styles/global.css'
import { getLenis, useLenis } from './hooks/useLenis'
import { useCursor } from './hooks/useCursor'
import Layout from './components/layout/Layout'
import PageLoader from './components/ui/PageLoader'

const Home = lazy(() => import('./pages/Home'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const Services = lazy(() => import('./pages/Services'))
const Delivery = lazy(() => import('./pages/Delivery'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Legal = lazy(() => import('./pages/Legal'))
const BlogList = lazy(() => import('./pages/BlogList'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const NotFound = lazy(() => import('./pages/NotFound'))

// The admin panel is a self-contained app, lazily loaded so none of it ships
// in the storefront bundle. Mounted outside the storefront Layout.
const AdminApp = lazy(() => import('./admin/AdminApp'))

// Every route change starts at the very top. The storefront uses Lenis smooth
// scroll, which keeps its own scroll offset, so resetting `window` alone isn't
// enough — we reset the Lenis instance too (immediately, no animation).
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Storefront() {
  useLenis()
  useCursor()
  const location = useLocation()

  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/kvkk" element={<Legal />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/en/checkout" element={<Checkout />} />
          <Route path="/en/order-success" element={<OrderSuccess />} />
          <Route path="/ru/checkout" element={<Checkout />} />
          <Route path="/ru/order-success" element={<OrderSuccess />} />

          <Route path="/en" element={<Home />} />
          <Route path="/en/product/:id" element={<ProductDetail />} />
          <Route path="/en/services" element={<Services />} />
          <Route path="/en/delivery" element={<Delivery />} />
          <Route path="/en/about" element={<About />} />
          <Route path="/en/contact" element={<Contact />} />
          <Route path="/en/kvkk" element={<Legal />} />
          <Route path="/en/blog" element={<BlogList />} />
          <Route path="/en/blog/:slug" element={<BlogPost />} />

          <Route path="/ru" element={<Home />} />
          <Route path="/ru/product/:id" element={<ProductDetail />} />
          <Route path="/ru/services" element={<Services />} />
          <Route path="/ru/delivery" element={<Delivery />} />
          <Route path="/ru/about" element={<About />} />
          <Route path="/ru/contact" element={<Contact />} />
          <Route path="/ru/kvkk" element={<Legal />} />
          <Route path="/ru/blog" element={<BlogList />} />
          <Route path="/ru/blog/:slug" element={<BlogPost />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

function AppInner() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/')

  if (isAdmin) {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminApp />
      </Suspense>
    )
  }

  return <Storefront />
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
