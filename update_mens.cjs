const axios = require('axios');
const fs = require('fs');

const keepRefs = [
"9889", "9713", "9742", "8318", "9712", "9864", "9899", "9875", "9858", "8312", "8330", "9867", "9860", "9869", "9901", "9924", "9927", "8313", "9884", "8315", "9845", "8319", "8332", "9857"
];

async function run() {
  const { data } = await axios.get('https://www.solo-solis.com/fr/lunettes-de-soleil-hommes');
  
  const regex = /https:\/\/www\.solo-solis\.com\/media\/catalog\/product\/[^\"]*\.jpg/g;
  const matches = data.match(regex) || [];
  
  const uniqueImages = [...new Set(matches)];
  
  let cards = '';
  let added = new Set();
  
  for (const ref of keepRefs) {
    if (added.has(ref)) continue;
    
    let image = uniqueImages.find(img => img.includes(`/${ref}_`));
    
    if (!image) {
      image = `https://www.solo-solis.com/media/catalog/product/${ref[0]}/${ref[1]}/${ref}_1.jpg`;
    }

    let id = `NDL${ref}`;
    
    cards += `
                <div className="card" data-gender="homme">
                  <div className="card-photo"><img src="${image}?width=600&height=600" alt="Monture solaire réf. NDL${ref}" loading="lazy" /></div>
                  <div className="card-top"><span className="ref mono">RÉF. NDL${ref}</span><span className="badge-new">NOUVEAU</span></div>
                  <div className="colorway">Fournisseur — Homme</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--ink)' }}>25 000 FCFA</span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '100px' }}
                      onClick={() => addToCart({ id: '${id}', name: 'RÉF. NDL${ref} - Fournisseur Homme', price: 25000, image: '${image}?width=600&height=600' })}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>`;
    added.add(ref);
  }

  let content = fs.readFileSync('src/pages/Home.jsx', 'utf8');
  
  const startMarker = "{(activeFilter === 'all' || activeFilter === 'homme') && (";
  const endMarker = "      </div>\n        </div>\n      </section>";
  
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker, startIndex);
  
  if (startIndex !== -1 && endIndex !== -1) {
    const newBlock = startMarker + "\n              <>\n" + cards + "\n              </>\n            )}\n          </div>\n        </div>\n      </section>";
    content = content.slice(0, startIndex) + newBlock + content.slice(endIndex + endMarker.length);
    fs.writeFileSync('src/pages/Home.jsx', content);
    console.log(`Replaced men's products with exactly ${added.size} requested references.`);
  } else {
    console.log("Could not find blocks in Home.jsx");
  }
}

run();
