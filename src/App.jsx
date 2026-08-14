import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchOverlay from './components/SearchOverlay';
import Home from './pages/Home';
import MenCollection from './pages/MenCollection';
import WomenCollection from './pages/WomenCollection';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Invoice from './pages/admin/Invoice';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import Chatbot from './components/Chatbot';
import SplashScreen from './components/SplashScreen';

// New Pages
import CGV from './pages/legal/CGV';
import MentionsLegales from './pages/legal/MentionsLegales';
import Confidentialite from './pages/legal/Confidentialite';
import ContactFAQ from './pages/ContactFAQ';
import LaunchPage from './pages/LaunchPage';

const IS_UNDER_CONSTRUCTION = true; // Toggle this to false to reveal the site
const PREVIEW_SECRET = 'kaiasun2026'; // Code secret pour accès client

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Vérifier si le code secret est dans l'URL
  const params = new URLSearchParams(location.search);
  const previewParam = params.get('preview');

  if (previewParam === PREVIEW_SECRET) {
    // Mémoriser l'accès dans le navigateur
    localStorage.setItem('kaïasun_preview', PREVIEW_SECRET);
  }

  const hasPreviewAccess = localStorage.getItem('kaïasun_preview') === PREVIEW_SECRET;

  if (IS_UNDER_CONSTRUCTION && !isAdmin && !hasPreviewAccess) {
    return <LaunchPage />;
  }

  return (
    <div className="app">
      {!isAdmin && <SplashScreen />}
      {!isAdmin && <Navbar />}
      {!isAdmin && <SearchOverlay />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/homme" element={<MenCollection />} />
          <Route path="/femme" element={<WomenCollection />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/invoice/:id" element={<Invoice />} />
          
          {/* Legal & Contact Routes */}
          <Route path="/cgv" element={<CGV />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/contact" element={<ContactFAQ />} />
          <Route path="/faq" element={<ContactFAQ />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <Chatbot />}
    </div>
  );
}

export default App;
