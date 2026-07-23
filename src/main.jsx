import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ShopProvider } from './context/ShopContext';
import { ProductsProvider } from './context/ProductsContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProductsProvider>
        <ShopProvider>
          <App />
        </ShopProvider>
      </ProductsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
