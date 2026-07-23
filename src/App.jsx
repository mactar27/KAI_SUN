import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MenCollection from './pages/MenCollection';
import WomenCollection from './pages/WomenCollection';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/admin/Dashboard';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/homme" element={<MenCollection />} />
          <Route path="/femme" element={<WomenCollection />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
