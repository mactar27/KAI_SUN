const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');

let counter = 1;

content = content.replace(/<div className="card" data-gender="([^"]+)">([\s\S]*?)<\/div>\s*(?=<div className="card"|<\/React.Fragment>|<\/>|<\/div>)/g, (match, gender, inner) => {
  let refMatch = inner.match(/<span className="ref mono">(.*?)<\/span>/);
  let ref = refMatch ? refMatch[1] : `Product ${counter}`;
  
  let nameMatch = inner.match(/<div className="colorway"[^>]*>(.*?)<\/div>/);
  let name = nameMatch ? nameMatch[1] : 'Lunettes';
  
  let imgMatch = inner.match(/<img src="(.*?)"/);
  let image = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600';
  
  let id = ref.replace(/[^a-zA-Z0-9]/g, '');
  
  let injection = `
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
        <button 
          className="btn-primary" 
          style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
          onClick={() => addToCart({ id: '${id}', name: '${ref} - ${name}', price: 25000, image: '${image}' })}
        >
          Ajouter
        </button>
      </div>
  </div>`;
  
  counter++;
  
  // Replace the closing </div> of the card with the injection
  return match.replace(/<\/div>\s*$/, injection + '\n');
});

// Import useContext and ShopContext if not present
if (!content.includes('ShopContext')) {
  content = content.replace("import React, { useState } from 'react';", "import React, { useState, useContext } from 'react';\nimport { ShopContext } from '../context/ShopContext';");
}

// Extract addToCart from useContext
if (!content.includes('const { addToCart }')) {
  content = content.replace("const [activeFilter, setActiveFilter] = useState('all');", "const [activeFilter, setActiveFilter] = useState('all');\n  const { addToCart } = useContext(ShopContext);");
}

fs.writeFileSync('src/pages/Home.jsx', content);
