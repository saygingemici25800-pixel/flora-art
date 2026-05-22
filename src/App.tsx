import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './lib/i18n'
import './styles/global.css'
import { useLenis } from './hooks/useLenis'
import { useCursor } from './hooks/useCursor'
import PlaceholderPage from './components/PlaceholderPage'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'

function AppInner() {
  useLenis()
  useCursor()
  const location = useLocation()

  return (
    <Layout>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/services" element={<PlaceholderPage name="Hizmetler" />} />
        <Route path="/delivery" element={<PlaceholderPage name="Teslimat" />} />
        <Route path="/about" element={<PlaceholderPage name="Hakkımızda" />} />
        <Route path="/contact" element={<PlaceholderPage name="İletişim" />} />
        <Route path="/checkout" element={<PlaceholderPage name="Ödeme" />} />
        <Route path="/order-success" element={<PlaceholderPage name="Sipariş Alındı" />} />

        <Route path="/en" element={<Home />} />
        <Route path="/en/shop" element={<Shop />} />
        <Route path="/en/product/:id" element={<ProductDetail />} />
        <Route path="/en/services" element={<PlaceholderPage name="Services" />} />
        <Route path="/en/delivery" element={<PlaceholderPage name="Delivery" />} />
        <Route path="/en/about" element={<PlaceholderPage name="About" />} />
        <Route path="/en/contact" element={<PlaceholderPage name="Contact" />} />

        <Route path="/ru" element={<Home />} />
        <Route path="/ru/shop" element={<Shop />} />
        <Route path="/ru/product/:id" element={<ProductDetail />} />
        <Route path="/ru/services" element={<PlaceholderPage name="Услуги" />} />
        <Route path="/ru/delivery" element={<PlaceholderPage name="Доставка" />} />
        <Route path="/ru/about" element={<PlaceholderPage name="О нас" />} />
        <Route path="/ru/contact" element={<PlaceholderPage name="Контакты" />} />

        <Route path="*" element={<PlaceholderPage name="404" />} />
      </Routes>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
