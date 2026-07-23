const axios = require('axios');
const fs = require('fs');

async function run() {
  const { data } = await axios.get('https://www.solo-solis.com/fr/lunettes-de-soleil-hommes');
  
  const regex = /https:\/\/www\.solo-solis\.com\/media\/catalog\/product\/[^\"]*\.jpg/g;
  const matches = data.match(regex) || [];
  
  const uniqueImages = [...new Set(matches)];
  
  let cards = '';
  let count = 0;
  let usedRefs = new Set();
  
  for (const image of uniqueImages) {
    if (count >= 42) break; // The user specifically asked for 42 pairs
    if (image.includes('placeholder')) continue;

    const filenameMatch = image.match(/\/(\d+)[^\/]*\.jpg/);
    const modelNum = filenameMatch ? filenameMatch[1] : null;

    if (!modelNum || usedRefs.has(modelNum)) continue;
    usedRefs.add(modelNum);

    let id = `K-${modelNum}`;
    
    cards += `
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="${image}?width=600&height=600" alt="Monture solaire réf. ${modelNum}" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. ${modelNum}</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: '${id}', name: 'RÉF. ${modelNum} - Fournisseur Homme', price: 25000, image: '${image}?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>`;
    count++;
  }

  let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');
  
  // Find where to insert them: at the end of the homme block
  const insertionPoint = content.lastIndexOf('</>');
  
  content = content.slice(0, insertionPoint) + cards + '\n              ' + content.slice(insertionPoint);
  
  fs.writeFileSync('src/pages/Home.jsx', content);
  console.log(`Added ${count} products.`);
}

run();
