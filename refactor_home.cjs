const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

// Ensure we import products.json and Link
if (!content.includes("import products from '../data/products.json';")) {
  content = content.replace("import React, { useState, useContext } from 'react';", "import React, { useState, useContext } from 'react';\nimport products from '../data/products.json';\nimport { Link } from 'react-router-dom';");
}

const collectionStart = '<section id="collection">';
const collectionEnd = '      </section>';

const startIndex = content.indexOf(collectionStart);
let endIndex = content.indexOf(collectionEnd, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newCollection = `
      <section id="collection">
        <div className="container">
          <div className="filter-bar">
            <button className={\`filter-btn \${activeFilter === 'all' ? 'active' : ''}\`} onClick={() => handleFilter('all')}>Tout</button>
            <button className={\`filter-btn \${activeFilter === 'femme' ? 'active' : ''}\`} onClick={() => handleFilter('femme')}>Femme</button>
            <button className={\`filter-btn \${activeFilter === 'homme' ? 'active' : ''}\`} onClick={() => handleFilter('homme')}>Homme</button>
          </div>
          
          <div className="grid">
            {products
              .filter(p => activeFilter === 'all' || p.gender === activeFilter)
              .map(product => (
                <div key={product.id} className="card" data-gender={product.gender}>
                  <Link to={\`/product/\${product.id}\`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="card-photo">
                      <img src={product.image + '?width=600&height=600'} alt={product.name} loading="lazy" />
                    </div>
                  </Link>
                  <div className="card-top">
                    <span className="ref mono">RÉF. {product.ref}</span>
                    <span className="badge-new">NOUVEAU</span>
                  </div>
                  <div className="colorway">Fournisseur — {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ id: product.id, name: product.name, price: 25000, image: product.image + '?width=600&height=600' });
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>`;

  content = content.slice(0, startIndex) + newCollection + content.slice(endIndex);
  fs.writeFileSync('src/pages/Home.jsx', content);
  console.log("Refactored Home.jsx successfully");
} else {
  console.log("Could not find section");
}
