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
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Services from './pages/Services'
import Delivery from './pages/Delivery'

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
        <Route path="/services" element={<Services />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/about" element={<PlaceholderPage name="Hakkımızda" />} />
        <Route path="/contact" element={<PlaceholderPage name="İletişim" />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/en/checkout" element={<Checkout />} />
        <Route path="/en/order-success" element={<OrderSuccess />} />
        <Route path="/ru/checkout" element={<Checkout />} />
        <Route path="/ru/order-success" element={<OrderSuccess />} />

        <Route path="/en" element={<Home />} />
        <Route path="/en/shop" element={<Shop />} />
        <Route path="/en/product/:id" element={<ProductDetail />} />
        <Route path="/en/services" element={<Services />} />
        <Route path="/en/delivery" element={<Delivery />} />
        <Route path="/en/about" element={<PlaceholderPage name="About" />} />
        <Route path="/en/contact" element={<PlaceholderPage name="Contact" />} />

        <Route path="/ru" element={<Home />} />
        <Route path="/ru/shop" element={<Shop />} />
        <Route path="/ru/product/:id" element={<ProductDetail />} />
        <Route path="/ru/services" element={<Services />} />
        <Route path="/ru/delivery" element={<Delivery />} />
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
