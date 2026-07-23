const axios = require('axios');
const fs = require('fs');

const keepRefs = [
"9971", "9973", "9970", "9919", "9921", "9922", "9920", "9916", "9915", "9917", "9910", "9912", "9914", "9971", "9880", "9815", "9816", "8298", "8299", "9871", "9872", "9873", "9776", "9775", "9572", "9570", "9571", "9518", "9952", "9338", "9340", "9583"
];

async function run() {
  const { data } = await axios.get('https://www.solo-solis.com/fr/lunettes-de-soleil-femmes');
  
  const regex = /https:\/\/www\.solo-solis\.com\/media\/catalog\/product\/[^\"]*\.jpg/g;
  const matches = data.match(regex) || [];
  
  const uniqueImages = [...new Set(matches)];
  
  let cards = '';
  let added = new Set();
  
  // We need to keep only the ones in keepRefs
  for (const ref of keepRefs) {
    if (added.has(ref)) continue;
    
    // Find image for this ref
    let image = uniqueImages.find(img => img.includes(`/${ref}_`));
    
    // If not found in the page, fallback to guessing
    if (!image) {
      image = `https://www.solo-solis.com/media/catalog/product/${ref[0]}/${ref[1]}/${ref}_1.jpg`;
    }

    let id = `NDL${ref}`;
    
    cards += `
                <div className="card" data-gender="femme">
                  <div className="card-photo"><img src="${image}?width=600&height=600" alt="Monture solaire réf. NDL${ref}" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL${ref}</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Femme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: '${id}', name: 'RÉF. NDL${ref} - Fournisseur Femme', price: 25000, image: '${image}?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>`;
    added.add(ref);
  }

  let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');
  
  // Replace the femme block
  const startMarker = "{(activeFilter === 'all' || activeFilter === 'femme') && (";
  const endMarker = "            {(activeFilter === 'all' || activeFilter === 'homme') && (";
  
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);
  
  if (startIndex !== -1 && endIndex !== -1) {
    const newBlock = startMarker + "\n              <>\n" + cards + "\n              </>\n            )}\n\n" + endMarker;
    content = content.slice(0, startIndex) + newBlock + content.slice(endIndex + endMarker.length);
    fs.writeFileSync('src/pages/Home.jsx', content);
    console.log(`Replaced women's products with exactly ${added.size} requested references.`);
  } else {
    console.log("Could not find blocks in Home.jsx");
  }
}

run();
